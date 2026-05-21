import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  HiOutlineEye, HiOutlineClock, HiOutlineUser,
  HiOutlineArrowRight, HiOutlineCurrencyDollar
} from 'react-icons/hi';

const CATEGORY_STYLES = {
  Tech:        { bg: 'bg-blue-100 dark:bg-blue-900/30',   text: 'text-blue-700 dark:text-blue-400',   dot: 'bg-blue-500' },
  AI:          { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  Health:      { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-700 dark:text-green-400',  dot: 'bg-green-500' },
  Education:   { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-700 dark:text-amber-400',  dot: 'bg-amber-500' },
  Finance:     { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Environment: { bg: 'bg-teal-100 dark:bg-teal-900/30',   text: 'text-teal-700 dark:text-teal-400',   dot: 'bg-teal-500' },
  Social:      { bg: 'bg-pink-100 dark:bg-pink-900/30',   text: 'text-pink-700 dark:text-pink-400',   dot: 'bg-pink-500' },
  Other:       { bg: 'bg-slate-100 dark:bg-slate-800',    text: 'text-slate-700 dark:text-slate-400', dot: 'bg-slate-500' },
};

const IdeaCard = ({ idea }) => {
  const {
    _id, title, shortDescription, category, imageURL,
    authorName, authorPhoto, views, createdAt, estimatedBudget, tags
  } = idea;

  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Other;
  const date = createdAt ? format(new Date(createdAt), 'MMM d, yyyy') : '';

  return (
    <div className="idea-card flex flex-col h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
        {imageURL ? (
          <img
            src={imageURL}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${_id}/600/400`; }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-ink-100 to-amber-100 dark:from-ink-900/40 dark:to-amber-900/20 flex items-center justify-center">
            <span className="text-5xl">💡</span>
          </div>
        )}
        {/* Category badge overlay */}
        <div className={`absolute top-3 left-3 category-badge ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-display font-semibold text-slate-800 dark:text-white text-lg leading-snug mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Short desc */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-1">
          {shortDescription}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <img
              src={authorPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName || 'User')}&background=6175f4&color=fff&size=32`}
              alt={authorName}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white dark:ring-slate-700"
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[80px]">
              {authorName || 'Anonymous'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <HiOutlineEye className="w-3.5 h-3.5" />
              {views || 0}
            </span>
            <span className="flex items-center gap-1">
              <HiOutlineClock className="w-3.5 h-3.5" />
              {date}
            </span>
          </div>
        </div>

        {/* Budget + CTA */}
        <div className="flex items-center justify-between mt-4">
          {estimatedBudget ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <HiOutlineCurrencyDollar className="w-3.5 h-3.5" />
              {estimatedBudget}
            </span>
          ) : <span />}
          <Link
            to={`/ideas/${_id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-ink-600 dark:text-ink-400 hover:gap-2 transition-all"
          >
            View Details <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
