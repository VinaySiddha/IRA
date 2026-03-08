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
import { PLACEHOLDER_PAPERS, PAPER_STATUS_VARIANTS, PAPER_STATUS_LABELS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';

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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const found = PLACEHOLDER_PAPERS.find((p) => p.id === parseInt(id));
      setPaper(found || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleCopyCitation = () => {
    if (!paper) return;
    const citation = `${paper.authors.map((a) => a.name).join(', ')}. "${paper.title}." International Research Archive, Vol. ${paper.volume}, Issue ${paper.issue}, ${new Date(paper.date).getFullYear()}. ${paper.doi ? `DOI: ${paper.doi}` : ''}`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    toast.success('Citation copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    toast.success('Review submitted successfully!');
    setReviewForm({ rating: 5, comments: '', recommendation: 'accept' });
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

  return (
    <div className="min-h-screen bg-background py-12 px-4">
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
              <Badge variant="primary">{paper.category}</Badge>
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
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(paper.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Vol. {paper.volume}, Issue {paper.issue}
              </span>
            </div>
          </div>

          {/* Authors */}
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
                    {author.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-text text-sm">{author.name}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {author.affiliation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Abstract */}
          <Card hover={false} className="p-6 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
              Abstract
            </h3>
            <p className="text-text leading-relaxed">{paper.abstract}</p>
          </Card>

          {/* Keywords */}
          <Card hover={false} className="p-6 mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {paper.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {keyword}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Button icon={Download} size="lg" className="w-full">
              Download PDF
            </Button>
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
              {paper.authors.map((a) => a.name).join(', ')}. &quot;{paper.title}.&quot;{' '}
              <em>International Research Archive</em>, Vol. {paper.volume}, Issue{' '}
              {paper.issue}, {new Date(paper.date).getFullYear()}.
              {paper.doi && ` DOI: ${paper.doi}`}
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

          {/* Editor Decision (for editors) */}
          {user?.role === 'editor' && (
            <Card hover={false} className="p-6">
              <h3 className="text-lg font-bold text-text mb-6">Editorial Decision</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => toast.success('Paper accepted!')}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toast.success('Revision requested')}
                >
                  Request Revision
                </Button>
                <Button
                  variant="danger"
                  onClick={() => toast.success('Paper rejected')}
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
