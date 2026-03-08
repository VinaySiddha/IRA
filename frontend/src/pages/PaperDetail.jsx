import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  Calendar,
  BookOpen,
  Users as UsersIcon,
  Tag,
  Building2,
  Star,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { PAPER_STATUS_VARIANTS, PAPER_STATUS_LABELS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import paperService from '../services/paperService';
import reviewService from '../services/reviewService';
import plagiarismService from '../services/plagiarismService';
import publicationService from '../services/publicationService';

export default function PaperDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comments: '',
    recommendation: 'accept',
  });
  const [plagiarismReport, setPlagiarismReport] = useState(null);
  const [checkingPlagiarism, setCheckingPlagiarism] = useState(false);
  const [pubRecord, setPubRecord] = useState(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        const data = await paperService.getPaper(id);
        setPaper(data);
        // Fetch plagiarism report if exists
        try {
          const report = await plagiarismService.getReport(id);
          setPlagiarismReport(report);
        } catch { /* no report yet */ }
        // Fetch publication record if editor
        try {
          const pub = await publicationService.getStatus(id);
          setPubRecord(pub);
        } catch { /* no record yet */ }
      } catch (err) {
        console.error('Failed to fetch paper:', err);
        setPaper(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id]);

  const getKeywords = () => {
    if (!paper?.keywords) return [];
    return typeof paper.keywords === 'string'
      ? paper.keywords.split(',').map((k) => k.trim())
      : paper.keywords;
  };

  const getAuthorNames = () => {
    if (!paper?.authors) return [];
    return paper.authors.map((a) => a.author_name);
  };

  const getDisplayDate = () => {
    return paper.published_at || paper.created_at;
  };

  const handleCopyCitation = () => {
    if (!paper) return;
    const citation = paper.citation_text
      ? paper.citation_text
      : `${getAuthorNames().join(', ')}. "${paper.title}." International Research Archive${paper.volume ? `, Vol. ${paper.volume}` : ''}${paper.issue ? `, Issue ${paper.issue}` : ''}${getDisplayDate() ? `, ${new Date(getDisplayDate()).getFullYear()}` : ''}.${paper.doi ? ` DOI: ${paper.doi}` : ''}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    toast.success('Citation copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      // Find user's review assignment for this paper
      const assignments = await reviewService.myAssignments();
      const myReview = assignments.find((r) => r.paper === parseInt(id));
      if (!myReview) {
        toast.error('No review assignment found for this paper');
        return;
      }
      await reviewService.submit(myReview.id, {
        comments: reviewForm.comments,
        score: reviewForm.rating * 2, // Convert 1-5 stars to 2-10 score
        recommendation:
          reviewForm.recommendation === 'revise'
            ? 'minor_revision'
            : reviewForm.recommendation,
      });
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, comments: '', recommendation: 'accept' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit review');
    }
  };

  const handleDecision = async (decision) => {
    try {
      await reviewService.createDecision({
        paper: parseInt(id),
        decision: decision,
        comments: '',
      });
      toast.success(
        `Paper ${decision === 'accept' ? 'accepted' : decision === 'reject' ? 'rejected' : 'revision requested'}!`
      );
      // Refresh paper data
      const updated = await paperService.getPaper(id);
      setPaper(updated);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Decision failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-text mb-4">Paper Not Found</h2>
        <p className="text-text-muted mb-6">
          The paper you are looking for does not exist or has been removed.
        </p>
        <Link to="/archive">
          <Button icon={ArrowLeft}>Browse Archive</Button>
        </Link>
      </div>
    );
  }

  const keywords = getKeywords();
  const displayDate = getDisplayDate();

  return (
    <div className="min-h-screen bg-surface-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant={PAPER_STATUS_VARIANTS[paper.status] || 'info'}>
                {PAPER_STATUS_LABELS[paper.status] || paper.status}
              </Badge>
              <Badge variant="primary">
                {paper.category?.name || paper.category}
              </Badge>
              {paper.doi && (
                <span className="text-xs text-text-muted font-mono bg-gray-100 px-2 py-1 rounded">
                  {paper.doi}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text leading-tight mb-4">
              {paper.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-text-muted">
              {displayDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(displayDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
              {paper.volume && paper.issue && (
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Vol. {paper.volume}, Issue {paper.issue}
                </span>
              )}
            </div>
          </div>

          {/* Authors */}
          {paper.authors && paper.authors.length > 0 && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                Authors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paper.authors.map((author, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {author.author_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-text text-sm">
                        {author.author_name}
                        {author.is_corresponding && (
                          <span className="ml-1 text-xs text-primary">*</span>
                        )}
                      </p>
                      {author.affiliation && (
                        <p className="text-xs text-text-muted flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {author.affiliation}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Abstract */}
          <Card hover={false} className="p-6 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Abstract
            </h3>
            <p className="text-text leading-relaxed">{paper.abstract}</p>
          </Card>

          {/* Keywords */}
          {keywords.length > 0 && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Payment Banner */}
          {paper.status === 'payment_pending' && user?.id === paper.submitted_by?.id && (
            <div className="mb-6 p-4 rounded-xl bg-google-yellow/10 border border-google-yellow/30 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-text">Payment Required</p>
                <p className="text-sm text-text-muted">Complete payment to proceed with your submission.</p>
              </div>
              <Link to={`/papers/${id}/payment`}>
                <Button size="sm" className="bg-google-yellow text-white hover:bg-google-yellow/90">
                  Pay Now
                </Button>
              </Link>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {paper.pdf_file ? (
              <a href={paper.pdf_file} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button icon={Download} size="lg" className="w-full">
                  Download PDF
                </Button>
              </a>
            ) : (
              <Button icon={Download} size="lg" className="w-full" disabled>
                Download PDF
              </Button>
            )}
            <Button
              variant="outline"
              icon={copied ? Check : Copy}
              size="lg"
              className="w-full"
              onClick={handleCopyCitation}
            >
              {copied ? 'Copied!' : 'Copy Citation'}
            </Button>
          </div>

          {/* Citation */}
          <Card hover={false} className="p-6 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Citation
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-text-muted leading-relaxed">
              {paper.citation_text ? (
                paper.citation_text
              ) : (
                <>
                  {getAuthorNames().join(', ')}. &quot;{paper.title}.&quot;{' '}
                  <em>International Research Archive</em>
                  {paper.volume && <>, Vol. {paper.volume}</>}
                  {paper.issue && <>, Issue {paper.issue}</>}
                  {displayDate && <>, {new Date(displayDate).getFullYear()}</>}.
                  {paper.doi && ` DOI: ${paper.doi}`}
                </>
              )}
            </div>
          </Card>

          {/* Review Form (for reviewers) */}
          {user?.role === 'reviewer' && paper.status === 'under_review' && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-6">Submit Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Overall Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: star })
                        }
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= reviewForm.rating
                              ? 'text-warning fill-warning'
                              : 'text-border'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1.5">
                    Review Comments
                  </label>
                  <textarea
                    value={reviewForm.comments}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comments: e.target.value })
                    }
                    placeholder="Provide detailed feedback on the paper..."
                    rows={6}
                    className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-text placeholder:text-text-muted/50 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Recommendation
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'accept', label: 'Accept', variant: 'success' },
                      { value: 'revise', label: 'Revise', variant: 'warning' },
                      { value: 'reject', label: 'Reject', variant: 'error' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setReviewForm({ ...reviewForm, recommendation: opt.value })
                        }
                        className={`
                          p-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer
                          ${
                            reviewForm.recommendation === opt.value
                              ? `border-${opt.variant} bg-${opt.variant}/10 text-${opt.variant}`
                              : 'border-border text-text-muted hover:border-gray-300'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" icon={Send}>
                  Submit Review
                </Button>
              </form>
            </Card>
          )}

          {/* Editor: Payment Verification */}
          {(user?.role === 'editor' || user?.role === 'admin') && paper.payment?.status === 'submitted' && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4">Verify Payment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-text-muted">Transaction ID</p>
                  <p className="font-semibold text-text">{paper.payment.transaction_id || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50">
                  <p className="text-xs text-text-muted">Amount</p>
                  <p className="font-semibold text-text">₹{parseFloat(paper.payment.amount).toFixed(2)}</p>
                </div>
              </div>
              {paper.payment.payment_proof && (
                <a href={paper.payment.payment_proof} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm mb-4 block">
                  View Payment Proof Screenshot
                </a>
              )}
              <Link to={`/papers/${id}/payment`}>
                <Button size="sm">Review Payment</Button>
              </Link>
            </Card>
          )}

          {/* Editor: Process PDF */}
          {(user?.role === 'editor' || user?.role === 'admin') && paper.pdf_file && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4">Paper Processing</h3>
              <p className="text-sm text-text-muted mb-4">
                Add IRA journal header, footer, and branding to the paper PDF.
              </p>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await paperService.processPdf(id);
                    toast.success('PDF processed with IRA branding!');
                    const updated = await paperService.getPaper(id);
                    setPaper(updated);
                  } catch (err) {
                    toast.error(err.response?.data?.detail || 'PDF processing failed');
                  }
                }}
              >
                Process PDF (Add IRA Header)
              </Button>
            </Card>
          )}

          {/* Plagiarism Report */}
          {(user?.role === 'editor' || user?.role === 'admin') && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4">Plagiarism Check</h3>
              {plagiarismReport ? (
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl font-black ${
                      plagiarismReport.is_flagged ? 'text-google-red' : 'text-google-green'
                    }`}>
                      {plagiarismReport.similarity_score}%
                    </div>
                    <div>
                      <p className="font-semibold text-text">
                        {plagiarismReport.is_flagged ? 'Flagged — High Similarity' : 'Passed — Original Content'}
                      </p>
                      <p className="text-xs text-text-muted">
                        Full PDF text analyzed ({plagiarismReport.report_data?.text_extracted_length?.toLocaleString() || 0} chars)
                      </p>
                    </div>
                  </div>

                  {/* Breakdown Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-blue-50 text-center">
                      <p className="text-lg font-bold text-google-blue">{plagiarismReport.report_data?.document_similarity || 0}%</p>
                      <p className="text-xs text-text-muted">Doc Similarity</p>
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 text-center">
                      <p className="text-lg font-bold text-google-red">{plagiarismReport.report_data?.sentence_plagiarism_rate || 0}%</p>
                      <p className="text-xs text-text-muted">Passage Match</p>
                    </div>
                    <div className="p-3 rounded-xl bg-yellow-50 text-center">
                      <p className="text-lg font-bold text-google-yellow">{plagiarismReport.report_data?.total_sentences_flagged || 0}</p>
                      <p className="text-xs text-text-muted">Flagged Passages</p>
                    </div>
                    <div className="p-3 rounded-xl bg-green-50 text-center">
                      <p className="text-lg font-bold text-google-green">{plagiarismReport.report_data?.total_compared || 0}</p>
                      <p className="text-xs text-text-muted">Papers Compared</p>
                    </div>
                  </div>

                  {/* Similar Papers */}
                  {plagiarismReport.report_data?.matches?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Similar Papers</p>
                      {plagiarismReport.report_data.matches.slice(0, 5).map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-1">
                          <span className="text-sm text-text truncate flex-1 mr-2">{m.title}</span>
                          <span className={`text-sm font-bold ${m.similarity > 30 ? 'text-google-red' : 'text-text-muted'}`}>
                            {m.similarity}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Flagged Passages */}
                  {plagiarismReport.report_data?.flagged_sentences?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Flagged Passages</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {plagiarismReport.report_data.flagged_sentences.slice(0, 5).map((f, i) => (
                          <div key={i} className="p-3 rounded-lg bg-red-50 border border-red-100">
                            <p className="text-xs text-red-700 mb-1">
                              <strong>{f.similarity}% match</strong> with "{f.source_paper_title}"
                            </p>
                            <p className="text-xs text-text-muted italic">"{f.submitted_sentence}..."</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Web Matches */}
                  {plagiarismReport.report_data?.web_matches?.length > 0 && (
                    <div>
                      <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Found on Web</p>
                      {plagiarismReport.report_data.web_matches.map((w, i) => (
                        <div key={i} className="p-2 rounded-lg bg-yellow-50 border border-yellow-100 mb-1">
                          <p className="text-xs text-yellow-800 italic">"{w.sentence}..."</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      loading={checkingPlagiarism}
                      onClick={async () => {
                        setCheckingPlagiarism(true);
                        try {
                          const report = await plagiarismService.checkPaper(id);
                          setPlagiarismReport(report);
                          toast.success('Plagiarism check completed!');
                        } catch (err) {
                          toast.error(err.response?.data?.detail || 'Check failed');
                        } finally {
                          setCheckingPlagiarism(false);
                        }
                      }}
                    >
                      Re-run Check
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={checkingPlagiarism}
                      onClick={async () => {
                        setCheckingPlagiarism(true);
                        try {
                          const report = await plagiarismService.checkPaper(id, true);
                          setPlagiarismReport(report);
                          toast.success('Full check with web search completed!');
                        } catch (err) {
                          toast.error(err.response?.data?.detail || 'Check failed');
                        } finally {
                          setCheckingPlagiarism(false);
                        }
                      }}
                    >
                      Re-run + Web Check
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-text-muted mb-4">
                    Extracts full text from PDF and runs multi-level analysis:
                  </p>
                  <ul className="text-sm text-text-muted mb-4 space-y-1 ml-4 list-disc">
                    <li>Document-level TF-IDF similarity against all papers in database</li>
                    <li>Sentence-level passage matching to find copied text</li>
                    <li>Optional web search to detect external plagiarism</li>
                  </ul>
                  <div className="flex gap-2">
                    <Button
                      loading={checkingPlagiarism}
                      onClick={async () => {
                        setCheckingPlagiarism(true);
                        try {
                          const report = await plagiarismService.checkPaper(id);
                          setPlagiarismReport(report);
                          toast.success('Plagiarism check completed!');
                        } catch (err) {
                          toast.error(err.response?.data?.detail || 'Check failed');
                        } finally {
                          setCheckingPlagiarism(false);
                        }
                      }}
                    >
                      Run Plagiarism Check
                    </Button>
                    <Button
                      variant="outline"
                      loading={checkingPlagiarism}
                      onClick={async () => {
                        setCheckingPlagiarism(true);
                        try {
                          const report = await plagiarismService.checkPaper(id, true);
                          setPlagiarismReport(report);
                          toast.success('Full check with web search completed!');
                        } catch (err) {
                          toast.error(err.response?.data?.detail || 'Check failed');
                        } finally {
                          setCheckingPlagiarism(false);
                        }
                      }}
                    >
                      Run + Web Check
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Publication Pipeline */}
          {(user?.role === 'editor' || user?.role === 'admin') && pubRecord && (
            <Card hover={false} className="p-6 mb-6">
              <h3 className="text-lg font-bold text-text mb-4">Publication Pipeline</h3>
              <div className="space-y-3">
                {[
                  { key: 'doi_generated', label: 'DOI Generated', color: 'google-blue' },
                  { key: 'pdf_formatted', label: 'PDF Formatted', color: 'google-red' },
                  { key: 'plagiarism_cleared', label: 'Plagiarism Cleared', color: 'google-green' },
                ].map((step) => (
                  <div key={step.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                        pubRecord[step.key] ? `bg-${step.color}` : 'bg-gray-300'
                      }`}>
                        {pubRecord[step.key] ? '✓' : '·'}
                      </div>
                      <span className="text-sm font-medium text-text">{step.label}</span>
                    </div>
                    {!pubRecord[step.key] && step.key === 'doi_generated' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const data = await publicationService.generateDoi(id);
                            setPubRecord({ ...pubRecord, doi_generated: true });
                            const updated = await paperService.getPaper(id);
                            setPaper(updated);
                            toast.success(`DOI assigned: ${data.doi}`);
                          } catch (err) {
                            toast.error(err.response?.data?.detail || 'Failed');
                          }
                        }}
                      >
                        Generate DOI
                      </Button>
                    )}
                    {!pubRecord[step.key] && step.key !== 'doi_generated' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          try {
                            const updated = await publicationService.updateStatus(id, { [step.key]: true });
                            setPubRecord(updated);
                            toast.success(`${step.label} — Done!`);
                          } catch (err) {
                            toast.error(err.response?.data?.detail || 'Failed');
                          }
                        }}
                      >
                        Mark Done
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {pubRecord.is_ready && paper.status === 'accepted' && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    loading={publishing}
                    className="bg-google-green hover:bg-google-green/90 w-full"
                    onClick={async () => {
                      setPublishing(true);
                      try {
                        await publicationService.publish(id);
                        const updated = await paperService.getPaper(id);
                        setPaper(updated);
                        toast.success('Paper published!');
                      } catch (err) {
                        toast.error(err.response?.data?.detail || 'Publish failed');
                      } finally {
                        setPublishing(false);
                      }
                    }}
                  >
                    Publish Paper
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Editor Decision (for editors) */}
          {(user?.role === 'editor' || user?.role === 'admin') && (
            <Card hover={false} className="p-6">
              <h3 className="text-lg font-bold text-text mb-6">Editorial Decision</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleDecision('accept')}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDecision('minor_revision')}
                >
                  Request Revision
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDecision('reject')}
                >
                  Reject
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
