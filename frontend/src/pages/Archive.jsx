import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  BookOpen,
  X,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  PLACEHOLDER_PAPERS,
  CATEGORIES,
  PAPER_STATUS_VARIANTS,
  PAPER_STATUS_LABELS,
} from '../utils/constants';

const ITEMS_PER_PAGE = 6;
const YEARS = [2026, 2025, 2024, 2023];

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter papers
  const filteredPapers = useMemo(() => {
    return PLACEHOLDER_PAPERS.filter((paper) => {
      const matchesSearch =
        !searchQuery ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        paper.authors.some((a) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || paper.category === selectedCategory;

      const matchesYear =
        !selectedYear || new Date(paper.date).getFullYear() === parseInt(selectedYear);

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [searchQuery, selectedCategory, selectedYear]);

  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE);
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedYear('');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedYear;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-3">
            Research <span className="gradient-text">Archive</span>
          </h1>
          <p className="text-text-muted max-w-xl mx-auto">
            Browse and search through our collection of published research papers,
            reviews, and scholarly articles.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Volume/Issue Navigation */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-64 shrink-0"
          >
            <Card hover={false} className="p-6 sticky top-24">
              <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Volumes & Issues
              </h3>
              <div className="space-y-2">
                {[
                  { vol: 3, issue: 2, label: 'Vol. 3, Issue 2 (2026)', current: true },
                  { vol: 3, issue: 1, label: 'Vol. 3, Issue 1 (2026)' },
                  { vol: 2, issue: 4, label: 'Vol. 2, Issue 4 (2025)' },
                  { vol: 2, issue: 3, label: 'Vol. 2, Issue 3 (2025)' },
                  { vol: 2, issue: 2, label: 'Vol. 2, Issue 2 (2025)' },
                  { vol: 2, issue: 1, label: 'Vol. 2, Issue 1 (2025)' },
                ].map((item, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      item.current
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-text-muted hover:bg-gray-50 hover:text-text'
                    }`}
                  >
                    {item.label}
                    {item.current && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              {/* Search Bar */}
              <div className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search papers by title, author, or keyword..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-white text-text placeholder:text-text-muted/50 transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  variant={showFilters ? 'primary' : 'outline'}
                  icon={Filter}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </div>

              {/* Filter Bar */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-border"
                >
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 rounded-lg border border-border text-sm bg-white text-text outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2 rounded-lg border border-border text-sm bg-white text-text outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="">All Years</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 text-sm text-error hover:bg-error/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Results count */}
            <p className="text-sm text-text-muted mb-6">
              Showing {paginatedPapers.length} of {filteredPapers.length} results
            </p>

            {/* Paper Cards */}
            {paginatedPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {paginatedPapers.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/papers/${paper.id}`}>
                      <Card className="p-6 h-full flex flex-col" gradient>
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant={PAPER_STATUS_VARIANTS[paper.status] || 'info'}
                            size="sm"
                          >
                            {PAPER_STATUS_LABELS[paper.status] || paper.status}
                          </Badge>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(paper.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-text mb-2 line-clamp-2 leading-snug">
                          {paper.title}
                        </h3>

                        <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-1">
                          {paper.abstract}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <Badge variant="primary" size="sm">
                            {paper.category}
                          </Badge>
                          {paper.keywords.slice(0, 2).map((kw) => (
                            <Badge key={kw} variant="secondary" size="sm">
                              {kw}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
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
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text mb-2">
                  No papers found
                </h3>
                <p className="text-text-muted mb-6">
                  Try adjusting your search or filter criteria.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'text-text-muted hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
