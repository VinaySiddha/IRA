import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  TrendingUp,
  Users,
  Star,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import paperService from '../services/paperService';
import reviewService from '../services/reviewService';
import { PAPER_STATUS_LABELS, PAPER_STATUS_VARIANTS } from '../utils/constants';

const statusConfig = {
  draft: { variant: 'info', label: 'Draft' },
  submitted: { variant: 'info', label: 'Submitted' },
  payment_pending: { variant: 'warning', label: 'Payment Pending' },
  payment_verified: { variant: 'success', label: 'Payment Verified' },
  under_review: { variant: 'warning', label: 'Under Review' },
  accepted: { variant: 'success', label: 'Accepted' },
  revision_required: { variant: 'warning', label: 'Revision Required' },
  revised: { variant: 'info', label: 'Revised' },
  published: { variant: 'success', label: 'Published' },
  rejected: { variant: 'error', label: 'Rejected' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.name || 'Researcher';
  const userRole = user?.role || 'author';

  const [papers, setPapers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const fetchedPapers = await paperService.getPapers();
        setPapers(Array.isArray(fetchedPapers) ? fetchedPapers : []);

        if (userRole === 'reviewer') {
          try {
            const fetchedAssignments = await reviewService.myAssignments();
            setAssignments(Array.isArray(fetchedAssignments) ? fetchedAssignments : []);
          } catch {
            setAssignments([]);
          }
        }
      } catch {
        setPapers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userRole]);

  const pendingReviewCount = useMemo(() => {
    return assignments.filter(
      (a) => a.status === 'assigned' || a.status === 'pending'
    ).length;
  }, [assignments]);

  const statsCards = useMemo(() => {
    const totalPapers = papers.length;
    const acceptedCount = papers.filter((p) => p.status === 'accepted').length;
    const publishedCount = papers.filter((p) => p.status === 'published').length;
    const underReviewCount = papers.filter((p) => p.status === 'under_review').length;
    const submittedCount = papers.filter((p) => p.status === 'submitted').length;
    const rejectedCount = papers.filter((p) => p.status === 'rejected').length;
    const revisionCount = papers.filter((p) => p.status === 'revision_required').length;
    const acceptRate =
      totalPapers > 0
        ? Math.round(((acceptedCount + publishedCount) / totalPapers) * 100)
        : 0;

    if (userRole === 'reviewer') {
      return [
        {
          title: 'My Assignments',
          value: String(assignments.length),
          change: `${pendingReviewCount} pending`,
          icon: FileText,
          color: 'bg-primary/10 text-primary',
          gradient: 'from-primary/5 to-primary/10',
        },
        {
          title: 'Pending Reviews',
          value: String(pendingReviewCount),
          change: pendingReviewCount > 0 ? 'Action needed' : 'All caught up',
          icon: Clock,
          color: 'bg-warning/10 text-warning',
          gradient: 'from-warning/5 to-warning/10',
        },
        {
          title: 'Completed Reviews',
          value: String(
            assignments.filter((a) => a.status === 'completed').length
          ),
          change: 'Reviews done',
          icon: CheckCircle,
          color: 'bg-success/10 text-success',
          gradient: 'from-success/5 to-success/10',
        },
        {
          title: 'Papers in System',
          value: String(totalPapers),
          change: `${underReviewCount} under review`,
          icon: AlertCircle,
          color: 'bg-accent/10 text-accent',
          gradient: 'from-accent/5 to-accent/10',
        },
      ];
    }

    if (userRole === 'editor') {
      return [
        {
          title: 'All Papers',
          value: String(totalPapers),
          change: `${submittedCount} new submissions`,
          icon: FileText,
          color: 'bg-primary/10 text-primary',
          gradient: 'from-primary/5 to-primary/10',
        },
        {
          title: 'Under Review',
          value: String(underReviewCount),
          change: `${revisionCount} need revision`,
          icon: Clock,
          color: 'bg-warning/10 text-warning',
          gradient: 'from-warning/5 to-warning/10',
        },
        {
          title: 'Accepted',
          value: String(acceptedCount + publishedCount),
          change: `${acceptRate}% acceptance rate`,
          icon: CheckCircle,
          color: 'bg-success/10 text-success',
          gradient: 'from-success/5 to-success/10',
        },
        {
          title: 'Rejected',
          value: String(rejectedCount),
          change: `${totalPapers > 0 ? Math.round((rejectedCount / totalPapers) * 100) : 0}% rejection rate`,
          icon: AlertCircle,
          color: 'bg-accent/10 text-accent',
          gradient: 'from-accent/5 to-accent/10',
        },
      ];
    }

    // Default: author view
    return [
      {
        title: 'My Papers',
        value: String(totalPapers),
        change: totalPapers === 1 ? '1 paper' : `${totalPapers} papers total`,
        icon: FileText,
        color: 'bg-primary/10 text-primary',
        gradient: 'from-primary/5 to-primary/10',
      },
      {
        title: 'Pending Reviews',
        value: String(underReviewCount + submittedCount),
        change:
          underReviewCount + submittedCount > 0
            ? 'Awaiting decision'
            : 'None pending',
        icon: Clock,
        color: 'bg-warning/10 text-warning',
        gradient: 'from-warning/5 to-warning/10',
      },
      {
        title: 'Accepted',
        value: String(acceptedCount + publishedCount),
        change: totalPapers > 0 ? `${acceptRate}% rate` : 'No papers yet',
        icon: CheckCircle,
        color: 'bg-success/10 text-success',
        gradient: 'from-success/5 to-success/10',
      },
      {
        title: 'Under Review',
        value: String(underReviewCount),
        change: revisionCount > 0 ? `${revisionCount} need revision` : 'On track',
        icon: AlertCircle,
        color: 'bg-accent/10 text-accent',
        gradient: 'from-accent/5 to-accent/10',
      },
    ];
  }, [papers, assignments, pendingReviewCount, userRole]);

  const recentActivity = useMemo(() => {
    const sorted = [...papers].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    return sorted.slice(0, 5);
  }, [papers]);

  const researchImpact = useMemo(() => {
    const publishedCount = papers.filter((p) => p.status === 'published').length;
    const acceptedCount = papers.filter((p) => p.status === 'accepted').length;
    const totalPapers = papers.length;
    const categoriesSet = new Set(
      papers.map((p) => p.category?.name).filter(Boolean)
    );

    return {
      published: publishedCount,
      accepted: acceptedCount,
      total: totalPapers,
      categories: categoriesSet.size,
    };
  }, [papers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-light flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-1">
                Welcome back,{' '}
                <span className="gradient-text">{userName}</span>
              </h1>
              <p className="text-text-muted">
                Here&apos;s what&apos;s happening with your research.
              </p>
            </div>
            <Link to="/submit">
              <Button icon={Plus}>New Submission</Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover={false} className={`p-6 bg-gradient-to-br ${stat.gradient}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-text-muted font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-black text-text">{stat.value}</p>
                    <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card hover={false} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-text flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Recent Activity
                </h2>
                <Link to="/papers">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
                  <p className="text-text-muted font-medium">No papers yet</p>
                  <p className="text-sm text-text-muted mt-1">
                    Submit your first paper to get started.
                  </p>
                  <Link to="/submit" className="inline-block mt-4">
                    <Button size="sm" icon={Plus}>
                      Submit Paper
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Paper
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left py-3 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">
                          Date
                        </th>
                        <th className="text-right py-3 px-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/50 last:border-0 hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-2">
                            <p className="font-medium text-text text-sm line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                              {item.category?.name || 'Uncategorized'}
                            </p>
                          </td>
                          <td className="py-4 px-2">
                            <Badge
                              variant={
                                PAPER_STATUS_VARIANTS[item.status] ||
                                statusConfig[item.status]?.variant ||
                                'info'
                              }
                              size="sm"
                            >
                              {PAPER_STATUS_LABELS[item.status] ||
                                statusConfig[item.status]?.label ||
                                item.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 hidden sm:table-cell">
                            <span className="text-sm text-text-muted">
                              {new Date(item.updated_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-right">
                            {item.status === 'payment_pending' ? (
                              <Link
                                to={`/papers/${item.id}/payment`}
                                className="inline-flex items-center gap-1 text-google-red hover:text-red-700 text-sm font-medium transition-colors"
                              >
                                Pay Now
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : (
                              <Link
                                to={`/papers/${item.id}`}
                                className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                              >
                                View
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Quick Actions & Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card hover={false} className="p-6">
              <h2 className="text-lg font-bold text-text mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/submit" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text group-hover:text-primary transition-colors">
                        Submit New Paper
                      </p>
                      <p className="text-xs text-text-muted">
                        Start a new submission
                      </p>
                    </div>
                  </div>
                </Link>

                <Link to="/archive" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/5 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text group-hover:text-secondary transition-colors">
                        Browse Archive
                      </p>
                      <p className="text-xs text-text-muted">
                        Explore published papers
                      </p>
                    </div>
                  </div>
                </Link>

                <Link to="/reviews" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-warning/5 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text group-hover:text-warning transition-colors">
                        Pending Reviews
                      </p>
                      <p className="text-xs text-text-muted">
                        {userRole === 'reviewer'
                          ? `${pendingReviewCount} review${pendingReviewCount !== 1 ? 's' : ''} awaiting`
                          : `${papers.filter((p) => p.status === 'under_review' || p.status === 'submitted').length} paper${papers.filter((p) => p.status === 'under_review' || p.status === 'submitted').length !== 1 ? 's' : ''} pending`}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/5 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors">
                      My Co-authors
                    </p>
                    <p className="text-xs text-text-muted">
                      Manage collaborators
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Research Impact */}
            <Card hover={false} className="p-6">
              <h2 className="text-lg font-bold text-text mb-4">Research Impact</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Published Papers</span>
                  <span className="text-sm font-bold text-text">
                    {researchImpact.published}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{
                      width:
                        researchImpact.total > 0
                          ? `${Math.round((researchImpact.published / researchImpact.total) * 100)}%`
                          : '0%',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Accepted Papers</span>
                  <span className="text-sm font-bold text-text">
                    {researchImpact.accepted}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-500"
                    style={{
                      width:
                        researchImpact.total > 0
                          ? `${Math.round((researchImpact.accepted / researchImpact.total) * 100)}%`
                          : '0%',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Categories</span>
                  <span className="text-sm font-bold text-text">
                    {researchImpact.categories}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full transition-all duration-500"
                    style={{
                      width:
                        researchImpact.categories > 0
                          ? `${Math.min(researchImpact.categories * 10, 100)}%`
                          : '0%',
                    }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
