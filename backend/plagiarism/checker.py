"""
IRA Plagiarism Checker — Full PDF text extraction + multi-level analysis.

1. Extracts full text from PDF using PyMuPDF
2. Document-level: TF-IDF + cosine similarity against all papers in DB
3. Sentence-level: Finds specific copied passages between papers
4. Web check: Searches key sentences on the web via Google
"""
import re
import logging
import fitz  # PyMuPDF
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from papers.models import Paper

logger = logging.getLogger(__name__)

SIMILARITY_THRESHOLD = 30.0  # flag if overall similarity >= 30%
SENTENCE_MATCH_THRESHOLD = 0.85  # flag individual sentences >= 85% similar
MIN_SENTENCE_LENGTH = 40  # ignore very short sentences


# ─── PDF TEXT EXTRACTION ───

def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file using PyMuPDF."""
    try:
        doc = fitz.open(pdf_path)
        full_text = []
        for page in doc:
            full_text.append(page.get_text())
        doc.close()
        return "\n".join(full_text)
    except Exception as e:
        logger.error(f"PDF text extraction failed: {e}")
        return ""


def get_paper_full_text(paper):
    """Get full text for a paper — PDF if available, else metadata."""
    text = ""
    if paper.pdf_file:
        try:
            text = extract_text_from_pdf(paper.pdf_file.path)
        except Exception:
            pass
    # Fallback or supplement with metadata
    if not text or len(text) < 100:
        text = f"{paper.title}\n{paper.abstract}\n{paper.keywords}"
    return text


# ─── TEXT PREPROCESSING ───

def preprocess_text(text):
    """Clean and normalize text for comparison."""
    text = text.lower()
    # Remove URLs
    text = re.sub(r'https?://\S+', '', text)
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    # Remove special characters but keep sentence structure
    text = re.sub(r'[^\w\s.,;:!?()-]', ' ', text)
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def split_sentences(text):
    """Split text into sentences for sentence-level comparison."""
    # Simple sentence splitter
    sentences = re.split(r'(?<=[.!?])\s+', text)
    # Filter out very short sentences and clean
    return [s.strip() for s in sentences if len(s.strip()) >= MIN_SENTENCE_LENGTH]


# ─── DOCUMENT-LEVEL CHECK ───

def document_level_check(paper_text, corpus_papers, corpus_texts):
    """
    TF-IDF + cosine similarity at the document level.
    Returns list of matches with similarity scores.
    """
    if not corpus_texts:
        return [], 0.0

    all_texts = [paper_text] + corpus_texts
    vectorizer = TfidfVectorizer(
        stop_words='english',
        max_features=10000,
        ngram_range=(1, 2),  # unigrams + bigrams for better matching
        min_df=1,
        max_df=0.95,
    )
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    matches = []
    for i, sim in enumerate(similarities):
        if sim > 0.05:
            matches.append({
                'paper_id': corpus_papers[i].id,
                'title': corpus_papers[i].title,
                'similarity': round(float(sim) * 100, 2),
                'authors': ", ".join(
                    [a.author_name for a in corpus_papers[i].authors.all()[:3]]
                ),
                'status': corpus_papers[i].status,
            })

    matches.sort(key=lambda x: x['similarity'], reverse=True)
    max_sim = round(float(similarities.max()) * 100, 2) if len(similarities) > 0 else 0.0

    return matches[:10], max_sim


# ─── SENTENCE-LEVEL CHECK ───

def sentence_level_check(paper_sentences, corpus_papers, corpus_texts):
    """
    Compare individual sentences from the submitted paper against
    sentences in the corpus. Finds specific copied passages.
    """
    if not paper_sentences or not corpus_texts:
        return []

    # Build corpus of sentences with their source paper info
    corpus_sentences = []
    corpus_sentence_sources = []
    for i, text in enumerate(corpus_texts):
        sents = split_sentences(text)
        for s in sents:
            corpus_sentences.append(s)
            corpus_sentence_sources.append(i)

    if not corpus_sentences:
        return []

    # Vectorize all sentences together
    all_sentences = paper_sentences + corpus_sentences
    try:
        vectorizer = TfidfVectorizer(
            stop_words='english',
            max_features=5000,
            ngram_range=(1, 2),
        )
        tfidf_matrix = vectorizer.fit_transform(all_sentences)
    except ValueError:
        return []

    n_paper = len(paper_sentences)
    paper_vectors = tfidf_matrix[:n_paper]
    corpus_vectors = tfidf_matrix[n_paper:]

    # Calculate similarity
    sim_matrix = cosine_similarity(paper_vectors, corpus_vectors)

    flagged_sentences = []
    seen_pairs = set()

    for p_idx in range(n_paper):
        for c_idx in range(len(corpus_sentences)):
            sim = sim_matrix[p_idx][c_idx]
            if sim >= SENTENCE_MATCH_THRESHOLD:
                source_paper_idx = corpus_sentence_sources[c_idx]
                pair_key = (p_idx, source_paper_idx)
                if pair_key not in seen_pairs:
                    seen_pairs.add(pair_key)
                    flagged_sentences.append({
                        'submitted_sentence': paper_sentences[p_idx][:200],
                        'matched_sentence': corpus_sentences[c_idx][:200],
                        'similarity': round(float(sim) * 100, 2),
                        'source_paper_id': corpus_papers[source_paper_idx].id,
                        'source_paper_title': corpus_papers[source_paper_idx].title,
                    })

    flagged_sentences.sort(key=lambda x: x['similarity'], reverse=True)
    return flagged_sentences[:20]  # Top 20 flagged passages


# ─── WEB CHECK ───

def web_check(sentences):
    """
    Check key sentences against web sources.
    Uses urllib to search Google and detect if sentences appear online.
    Returns list of sentences found on the web.
    """
    import urllib.request
    import urllib.parse
    import json

    web_matches = []

    # Only check the first 5 longest unique sentences to avoid rate limits
    check_sentences = sorted(sentences, key=len, reverse=True)[:5]

    for sentence in check_sentences:
        # Take a distinctive phrase (middle portion, 8-12 words)
        words = sentence.split()
        if len(words) < 8:
            continue
        # Pick a phrase from the middle for better uniqueness
        start = max(0, len(words) // 4)
        phrase = " ".join(words[start:start + 10])

        try:
            query = urllib.parse.quote(f'"{phrase}"')
            url = f"https://www.google.com/search?q={query}"
            req = urllib.request.Request(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            response = urllib.request.urlopen(req, timeout=5)
            html = response.read().decode('utf-8', errors='ignore')

            # Check if results were found (rough heuristic)
            has_results = 'did not match any documents' not in html and 'About' in html
            if has_results:
                web_matches.append({
                    'sentence': sentence[:200],
                    'phrase_searched': phrase,
                    'found_online': True,
                })
        except Exception as e:
            logger.debug(f"Web check failed for phrase: {e}")
            continue

    return web_matches


# ─── MAIN CHECK FUNCTION ───

def check_plagiarism(paper, include_web_check=False):
    """
    Full plagiarism check pipeline:
    1. Extract full text from PDF
    2. Document-level similarity (TF-IDF)
    3. Sentence-level passage matching
    4. Optional web check

    Args:
        paper: Paper model instance
        include_web_check: Whether to search sentences on the web (slower)

    Returns:
        dict with similarity_score, is_flagged, matches, flagged_sentences, etc.
    """
    # Step 1: Extract text
    paper_text = preprocess_text(get_paper_full_text(paper))
    paper_sentences = split_sentences(paper_text)

    # Get corpus (all other papers)
    existing_papers = Paper.objects.exclude(id=paper.id).filter(
        status__in=['accepted', 'published', 'under_review', 'payment_verified']
    )

    corpus_papers = []
    corpus_texts = []
    for p in existing_papers:
        text = preprocess_text(get_paper_full_text(p))
        if text.strip() and len(text) > 50:
            corpus_papers.append(p)
            corpus_texts.append(text)

    # Step 2: Document-level check
    doc_matches, max_similarity = document_level_check(
        paper_text, corpus_papers, corpus_texts
    )

    # Step 3: Sentence-level check
    flagged_sentences = sentence_level_check(
        paper_sentences, corpus_papers, corpus_texts
    )

    # Step 4: Web check (optional)
    web_matches = []
    if include_web_check and paper_sentences:
        web_matches = web_check(paper_sentences)

    # Calculate combined score
    # Weight: 70% document-level, 30% sentence density
    sentence_plagiarism_rate = 0.0
    if paper_sentences:
        flagged_count = len(set(f['submitted_sentence'] for f in flagged_sentences))
        sentence_plagiarism_rate = (flagged_count / len(paper_sentences)) * 100

    combined_score = round(0.7 * max_similarity + 0.3 * sentence_plagiarism_rate, 2)
    is_flagged = combined_score >= SIMILARITY_THRESHOLD or len(web_matches) > 2

    return {
        'similarity_score': combined_score,
        'is_flagged': is_flagged,
        'document_similarity': max_similarity,
        'sentence_plagiarism_rate': round(sentence_plagiarism_rate, 2),
        'matches': doc_matches,
        'flagged_sentences': flagged_sentences,
        'web_matches': web_matches,
        'total_compared': len(corpus_texts),
        'total_sentences_checked': len(paper_sentences),
        'total_sentences_flagged': len(flagged_sentences),
        'text_extracted_length': len(paper_text),
    }
