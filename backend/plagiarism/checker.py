import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from papers.models import Paper

SIMILARITY_THRESHOLD = 30.0  # percentage


def preprocess_text(text):
    """Clean and normalize text for comparison."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def check_plagiarism(paper):
    """
    Check a paper against all existing published/accepted papers.
    Returns dict with similarity_score, is_flagged, and matches.
    """
    paper_text = preprocess_text(f"{paper.title} {paper.abstract} {paper.keywords}")

    # Get all other papers to compare against
    existing_papers = Paper.objects.exclude(id=paper.id).filter(
        status__in=['accepted', 'published', 'under_review', 'payment_verified']
    )

    if not existing_papers.exists():
        return {
            'similarity_score': 0.0,
            'is_flagged': False,
            'matches': [],
            'total_compared': 0,
        }

    corpus_papers = []
    corpus_texts = []
    for p in existing_papers:
        text = preprocess_text(f"{p.title} {p.abstract} {p.keywords}")
        if text.strip():
            corpus_papers.append(p)
            corpus_texts.append(text)

    if not corpus_texts:
        return {
            'similarity_score': 0.0,
            'is_flagged': False,
            'matches': [],
            'total_compared': 0,
        }

    # Build TF-IDF matrix
    all_texts = [paper_text] + corpus_texts
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    # Calculate similarity between submitted paper (index 0) and all others
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # Build matches list sorted by similarity
    matches = []
    for i, sim in enumerate(similarities):
        if sim > 0.05:  # Only include if >5% similar
            matches.append({
                'paper_id': corpus_papers[i].id,
                'title': corpus_papers[i].title,
                'similarity': round(float(sim) * 100, 2),
                'authors': ", ".join([a.author_name for a in corpus_papers[i].authors.all()[:3]]),
            })

    matches.sort(key=lambda x: x['similarity'], reverse=True)
    max_similarity = round(float(similarities.max()) * 100, 2) if len(similarities) > 0 else 0.0

    return {
        'similarity_score': max_similarity,
        'is_flagged': max_similarity >= SIMILARITY_THRESHOLD,
        'matches': matches[:10],  # Top 10 matches
        'total_compared': len(corpus_texts),
    }
