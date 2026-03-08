import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users as UsersIcon } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { PLACEHOLDER_PAPERS, PAPER_STATUS_VARIANTS } from '../../utils/constants';

export default function LatestPapersSection() {
  const papers = PLACEHOLDER_PAPERS.filter((p) => p.status === 'published').slice(0, 3);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-2">
              Latest <span className="gradient-text">Publications</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
          </div>
          <Link
            to="/archive"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {papers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/papers/${paper.id}`}>
                <Card className="p-6 h-full flex flex-col" gradient>
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={PAPER_STATUS_VARIANTS[paper.status] || 'info'} size="sm">
                      {paper.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-text-muted text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(paper.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-text mb-3 line-clamp-2 leading-snug">
                    {paper.title}
                  </h3>

                  {/* Abstract snippet */}
                  <p className="text-sm text-text-muted mb-4 line-clamp-3 leading-relaxed flex-1">
                    {paper.abstract}
                  </p>

                  {/* Authors */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                    <UsersIcon className="w-4 h-4 text-text-muted shrink-0" />
                    <p className="text-sm text-text-muted truncate">
                      {paper.authors.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
