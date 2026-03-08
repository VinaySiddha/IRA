import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search as SearchIcon,
  FileText,
  Calendar,
  Tag,
  Filter,
  X,
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import searchService from '../services/searchService';
import paperService from '../services/paperService';
import { PAPER_STATUS_LABELS, PAPER_STATUS_VARIANTS } from '../utils/constants';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    paperService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

  const performSearch = async (q, filters = {}) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchService.search(q, filters);
      setResults(data.results);
      setCount(data.count);
    } catch {
      setResults([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const filters = {};
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedYear) filters.year = selectedYear;
    setSearchParams({ q: query });
    performSearch(query, filters);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedYear('');
    if (query) performSearch(query);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-surface-light py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">
            Search <span className="text-google-blue">Papers</span>
          </h1>
          <p className="text-text-muted">
            Search across all papers by title, abstract, keywords, or authors
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch}
          className="mb-6"
        >
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, abstract, keywords, author..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border bg-white text-text placeholder:text-text-muted/50 outline-none focus:border-google-blue focus:ring-2 focus:ring-google-blue/20 transition-all"
              />
            </div>
            <Button type="submit" icon={SearchIcon} disabled={!query.trim()}>
              Search
            </Button>
          </div>
        </motion.form>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Filter className="w-4 h-4" />
            Filters:
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm text-text cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-border bg-white text-sm text-text cursor-pointer"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {(selectedCategory || selectedYear) && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : searched ? (
          <>
            <p className="text-sm text-text-muted mb-6">
              {count} result{count !== 1 ? 's' : ''} found
              {query && ` for "${query}"`}
            </p>

            {results.length === 0 ? (
              <Card hover={false} className="p-12 text-center">
                <SearchIcon className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">No results found</h3>
                <p className="text-text-muted text-sm">
                  Try different keywords or adjust your filters.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {results.map((paper, index) => (
                  <motion.div
                    key={paper.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/papers/${paper.id}`}>
                      <Card className="p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant={PAPER_STATUS_VARIANTS[paper.status] || 'info'} size="sm">
                            {PAPER_STATUS_LABELS[paper.status] || paper.status}
                          </Badge>
                          {paper.category?.name && (
                            <Badge variant="secondary" size="sm">{paper.category.name}</Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
                          {paper.title}
                        </h3>
                        <p className="text-sm text-text-muted line-clamp-3 mb-3">
                          {paper.abstract}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
                          {paper.authors?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {paper.authors.map((a) => a.author_name).join(', ')}
                            </span>
                          )}
                          {paper.created_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(paper.created_at).toLocaleDateString()}
                            </span>
                          )}
                          {paper.keywords && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3.5 h-3.5" />
                              {paper.keywords.split(',').slice(0, 3).join(', ')}
                            </span>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <Card hover={false} className="p-16 text-center">
            <SearchIcon className="w-16 h-16 text-text-muted/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">
              Start Your Search
            </h3>
            <p className="text-text-muted">
              Enter keywords to find research papers across the IRA archive.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
