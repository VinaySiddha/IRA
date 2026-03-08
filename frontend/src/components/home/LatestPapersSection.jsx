import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users as UsersIcon, Loader2 } from 'lucide-react';
import Badge from '../common/Badge';
import { PAPER_STATUS_VARIANTS } from '../../utils/constants';
import paperService from '../../services/paperService';

export default function LatestPapersSection() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const data = await paperService.getPapers({ status: 'published' });
        const list = Array.isArray(data) ? data : data.results || [];
        setPapers(list.slice(0, 3));
      } catch {
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, []);

  if (!loading && papers.length === 0) return null;

  return (
    <section className="py-24 bg-surface-light">
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
              Latest <span className="text-google-blue">Publications</span>
            </h2>
            <div className="flex gap-1 mt-2">
              <div className="w-8 h-1 bg-google-blue rounded-full" />
              <div className="w-8 h-1 bg-google-red rounded-full" />
              <div className="w-8 h-1 bg-google-yellow rounded-full" />
              <div className="w-8 h-1 bg-google-green rounded-full" />
            </div>
          </div>
          <Link
            to="/archive"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 text-google-blue hover:text-primary-dark font-medium transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-google-blue animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper, index) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/papers/${paper.id}`}>
                  <div className="devfest-card p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant={PAPER_STATUS_VARIANTS[paper.status] || 'info'} size="sm">
                        {paper.category?.name || paper.category}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-text-muted text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(paper.published_at || paper.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-text mb-3 line-clamp-2 leading-snug">
                      {paper.title}
                    </h3>

                    <p className="text-sm text-text-muted mb-4 line-clamp-3 leading-relaxed flex-1">
                      {paper.abstract}
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-border">
                      <UsersIcon className="w-4 h-4 text-text-muted shrink-0" />
                      <p className="text-sm text-text-muted truncate">
                        {paper.authors?.map((a) => a.author_name || a.name).join(', ') || paper.submitted_by?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
