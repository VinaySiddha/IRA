import { useState } from 'react';
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
import { useAuth } from '../hooks/useAuth';

const statsCards = [
  {
    title: 'My Papers',
    value: '12',
    change: '+2 this month',
    icon: FileText,
    color: 'bg-primary/10 text-primary',
    gradient: 'from-primary/5 to-primary/10',
  },
  {
    title: 'Pending Reviews',
    value: '3',
    change: '1 overdue',
    icon: Clock,
    color: 'bg-warning/10 text-warning',
    gradient: 'from-warning/5 to-warning/10',
  },
  {
    title: 'Accepted',
    value: '8',
    change: '67% rate',
    icon: CheckCircle,
    color: 'bg-success/10 text-success',
    gradient: 'from-success/5 to-success/10',
  },
  {
    title: 'Under Review',
    value: '4',
    change: 'Avg. 12 days',
    icon: AlertCircle,
    color: 'bg-accent/10 text-accent',
    gradient: 'from-accent/5 to-accent/10',
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'submission',
    title: 'Deep Learning for Medical Image Segmentation',
    status: 'submitted',
    date: '2026-03-05',
    description: 'Paper submitted for review',
  },
  {
    id: 2,
    type: 'review',
    title: 'Quantum Error Correction Using Topological Codes',
    status: 'under_review',
    date: '2026-03-03',
    description: 'Review assigned by editor',
  },
  {
    id: 3,
    type: 'decision',
    title: 'Advances in Transformer Architecture',
    status: 'accepted',
    date: '2026-02-28',
    description: 'Paper accepted for publication',
  },
  {
    id: 4,
    type: 'revision',
    title: 'Sustainable Carbon Capture Using MOFs',
    status: 'revision_required',
    date: '2026-02-25',
    description: 'Minor revisions requested',
  },
  {
    id: 5,
    type: 'publication',
    title: 'Neural Correlates of Decision-Making',
    status: 'published',
    date: '2026-02-20',
    description: 'Published in Vol. 3, Issue 1',
  },
];

const statusConfig = {
  submitted: { variant: 'info', label: 'Submitted' },
  under_review: { variant: 'warning', label: 'Under Review' },
  accepted: { variant: 'success', label: 'Accepted' },
  revision_required: { variant: 'warning', label: 'Revision Required' },
  published: { variant: 'success', label: 'Published' },
  rejected: { variant: 'error', label: 'Rejected' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const userName = user?.name || 'Researcher';

  return (
    <div className="min-h-screen bg-background py-12 px-4">
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
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

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
                            {item.description}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <Badge
                            variant={statusConfig[item.status]?.variant || 'info'}
                            size="sm"
                          >
                            {statusConfig[item.status]?.label || item.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-2 hidden sm:table-cell">
                          <span className="text-sm text-text-muted">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <Link
                            to={`/papers/${item.id}`}
                            className="inline-flex items-center gap-1 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                          >
                            View
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-warning/5 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text group-hover:text-warning transition-colors">
                      Pending Reviews
                    </p>
                    <p className="text-xs text-text-muted">
                      3 reviews awaiting
                    </p>
                  </div>
                </div>

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
                  <span className="text-sm text-text-muted">Total Citations</span>
                  <span className="text-sm font-bold text-text">142</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    style={{ width: '72%' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">h-index</span>
                  <span className="text-sm font-bold text-text">7</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full"
                    style={{ width: '45%' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">Profile Views</span>
                  <span className="text-sm font-bold text-text">1,284</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-accent to-secondary h-2 rounded-full"
                    style={{ width: '60%' }}
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
