import { useState, useEffect, useMemo } from 'react';
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
  Loader2,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import paperService from '../services/paperService';
import journalService from '../services/journalService';
import { PAPER_STATUS_VARIANTS, PAPER_STATUS_LABELS } from '../utils/constants';

const ITEMS_PER_PAGE = 6;

export default function Archive() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Data state
  const [papers, setPapers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issues, setIssues] = useState([]);

  // Loading state
  const [loadingPapers, setLoadingPapers] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingVolumes, setLoadingVolumes] = useState(true);

  // Fetch papers from API
  useEffect(() => {
    const fetchPapers = async () => {
      setLoadingPapers(true);
      try {
        const data = await paperService.getPapers();
        setPapers(data);
      } catch (error) {
        console.error('Failed to fetch papers:', error);
        setPapers([]);
      } finally {
        setLoadingPapers(false);
      }
    };
    fetchPapers();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await paperService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch volumes and issues from API
  useEffect(() => {
    const fetchVolumesAndIssues = async () => {
      setLoadingVolumes(true);
      try {
        const volumeData = await journalService.getVolumes();
        setVolumes(volumeData);

        // Fetch all issues
        const issueData = await journalService.getIssues();
        setIssues(issueData);
      } catch (error) {
        console.error('Failed to fetch volumes/issues:', error);
        setVolumes([]);
        setIssues([]);
      } finally {
        setLoadingVolumes(false);
      }
    };
    fetchVolumesAndIssues();
  }, []);

  // Build sidebar items from volumes and issues
  const volumeIssueItems = useMemo(() => {
    if (!volumes.length || !issues.length) return [];

    // Sort volumes descending by volume_number
    const sortedVolumes = [...volumes].sort(
      (a, b) => b.volume_number - a.volume_number
    );

    const items = [];
    sortedVolumes.forEach((vol) => {
      const volIssues = issues
        .filter((iss) => iss.volume === vol.id)
        .sort((a, b) => b.issue_number - a.issue_number);

      volIssues.forEach((iss) => {
        items.push({
          vol: vol.volume_number,
          issue: iss.issue_number,
          label: `Vol. ${vol.volume_number}, Issue ${iss.issue_number} (${vol.year})`,
          issueId: iss.id,
          isPublished: iss.is_published,
        });
      });
    });

    // Mark the first item as current
    if (items.length > 0) {
      items[0].current = true;
    }

    return items;
  }, [volumes, issues]);

  // Derive available years from fetched papers
  const years = useMemo(() => {
    const yearSet = new Set();
    papers.forEach((paper) => {
      const dateStr = paper.published_at || paper.created_at;
      if (dateStr) {
        const year = new Date(dateStr).getFullYear();
        if (!isNaN(year)) yearSet.add(year);
      }
    });
    return [...yearSet].sort((a, b) => b - a);
  }, [papers]);

  // Helper to parse keywords (may be a comma-separated string or array)
  const parseKeywords = (keywords) => {
    if (!keywords) return [];
    if (Array.isArray(keywords)) return keywords;
    if (typeof keywords === 'string') {
      return keywords.split(',').map((k) => k.trim()).filter(Boolean);
    }
    return [];
  };

  // Filter papers client-side
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const keywords = parseKeywords(paper.keywords);
      const authorNames = paper.authors?.map((a) => a.author_name) || [];
      const categoryName = paper.category?.name || paper.category || '';

      const matchesSearch =
        !searchQuery ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (paper.abstract || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        keywords.some((k) =>
          k.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        authorNames.some((name) =>
          (name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || categoryName === selectedCategory;

      const dateStr = paper.published_at || paper.created_at;
      const matchesYear =
        !selectedYear ||
        (dateStr && new Date(dateStr).getFullYear() === parseInt(selectedYear));

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [papers, searchQuery, selectedCategory, selectedYear]);

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
    <div className="min-h-screen bg-surface-light py-12 px-4">
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
                {loadingVolumes ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : volumeIssueItems.length > 0 ? (
                  volumeIssueItems.map((item, index) => (
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
                  ))
                ) : (
                  <p className="text-sm text-text-muted py-2">
                    No volumes available.
                  </p>
                )}
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
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
                    {years.map((year) => (
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

            {/* Loading State */}
            {loadingPapers ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-text-muted">Loading papers...</p>
              </div>
            ) : (
              <>
                {/* Results count */}
                <p className="text-sm text-text-muted mb-6">
                  Showing {paginatedPapers.length} of {filteredPapers.length} results
                </p>

                {/* Paper Cards */}
                {paginatedPapers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {paginatedPapers.map((paper, index) => {
                      const keywords = parseKeywords(paper.keywords);
                      const categoryName =
                        paper.category?.name || paper.category || '';
                      const dateStr = paper.published_at || paper.created_at;
                      const authorNames =
                        paper.authors?.map((a) => a.author_name).filter(Boolean) ||
                        [];

                      return (
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
                                  variant={
                                    PAPER_STATUS_VARIANTS[paper.status] || 'info'
                                  }
                                  size="sm"
                                >
                                  {PAPER_STATUS_LABELS[paper.status] ||
                                    paper.status}
                                </Badge>
                                <span className="text-xs text-text-muted flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {dateStr
                                    ? new Date(dateStr).toLocaleDateString(
                                        'en-US',
                                        {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        }
                                      )
                                    : 'N/A'}
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-text mb-2 line-clamp-2 leading-snug">
                                {paper.title}
                              </h3>

                              <p className="text-sm text-text-muted mb-4 line-clamp-2 flex-1">
                                {paper.abstract}
                              </p>

                              <div className="flex flex-wrap gap-1.5 mb-4">
                                {categoryName && (
                                  <Badge variant="primary" size="sm">
                                    {categoryName}
                                  </Badge>
                                )}
                                {keywords.slice(0, 2).map((kw) => (
                                  <Badge key={kw} variant="secondary" size="sm">
                                    {kw}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                                <UsersIcon className="w-4 h-4 text-text-muted shrink-0" />
                                <p className="text-sm text-text-muted truncate">
                                  {authorNames.length > 0
                                    ? authorNames.join(', ')
                                    : 'No authors listed'}
                                </p>
                              </div>
                            </Card>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="w-16 h-16 text-text-muted/30 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-text mb-2">
                      No papers found
                    </h3>
                    <p className="text-text-muted mb-6">
                      {hasActiveFilters
                        ? 'Try adjusting your search or filter criteria.'
                        : 'No papers have been submitted yet.'}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    )}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
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
                      )
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
