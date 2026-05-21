import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import IdeaCard from '../components/IdeaCard';
import { getFilteredIdeas } from '../data/ideasData';
import {
  HiOutlineSearch, HiOutlineX, HiOutlineLightBulb, HiOutlineAdjustments
} from 'react-icons/hi';

const CATEGORIES = ['All', 'Tech', 'AI', 'Health', 'Education', 'Finance', 'Environment', 'Social', 'Other'];

const Ideas = () => {
  useTitle('Explore Ideas');
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter ideas from local data
  const ideas = useMemo(
    () => getFilteredIdeas({ search, category, from, to }),
    [search, category, from, to]
  );

  const hasFilters = search || category !== 'All' || from || to;

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setFrom('');
    setTo('');
    setSearchParams({});
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const newParams = {};
    if (search) newParams.search = search;
    if (cat !== 'All') newParams.category = cat;
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    const newParams = {};
    if (val) newParams.search = val;
    if (category !== 'All') newParams.category = category;
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
            <HiOutlineLightBulb className="w-4 h-4" />
            {ideas.length} Ideas
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white">
            Explore All Ideas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Discover and engage with innovative startup concepts from the community.
          </p>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search ideas by title..."
                className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ink-400 transition-all"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                showFilters
                  ? 'border-ink-500 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400'
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-ink-300'
              }`}
            >
              <HiOutlineAdjustments className="w-5 h-5" />
              Filters
              {hasFilters && <span className="w-2 h-2 bg-ink-500 rounded-full" />}
            </button>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-sm transition-all"
              >
                <HiOutlineX className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Advanced date filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">From Date</label>
                <input
                  type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                  className="input-field !py-2.5 !text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 block">To Date</label>
                <input
                  type="date" value={to} onChange={(e) => setTo(e.target.value)}
                  className="input-field !py-2.5 !text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                category === cat
                  ? 'bg-ink-600 text-white shadow-lg shadow-ink-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-ink-300 dark:hover:border-ink-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Ideas Grid ── */}
        {ideas.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineLightBulb className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-2">
              No ideas found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              {hasFilters ? 'Try adjusting your search or filters.' : 'No ideas available.'}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea._id} idea={idea} />
              ))}
            </div>
            <p className="text-center text-slate-400 text-sm mt-10">
              Showing {ideas.length} idea{ideas.length !== 1 ? 's' : ''}
              {category !== 'All' && ` in "${category}"`}
              {search && ` matching "${search}"`}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Ideas;
