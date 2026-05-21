import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import { getIdeaById } from '../data/ideasData';
import {
  HiOutlineEye, HiOutlineClock, HiOutlineChatAlt2,
  HiOutlineTag, HiOutlineCurrencyDollar, HiOutlineUsers,
  HiOutlineLightBulb, HiOutlinePencil, HiOutlineTrash,
  HiOutlineCheck, HiOutlineX, HiOutlineArrowLeft
} from 'react-icons/hi';

/* ─── Category colour map ─── */
const CATEGORY_STYLES = {
  Tech:        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  AI:          'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Health:      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Education:   'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Finance:     'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  Environment: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400',
  Social:      'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400',
};

/* ─── Single comment row ─── */
const CommentItem = ({ comment, currentUser, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const isOwner = currentUser?.email === comment.authorEmail;

  const handleSave = () => {
    if (!editText.trim()) return;
    onEdit(comment._id, editText);
    setEditing(false);
  };

  return (
    <div className="flex gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
      <img
        src={
          comment.authorPhoto ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.authorName)}&background=6175f4&color=fff&size=40`
        }
        alt={comment.authorName}
        className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-slate-700"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <span className="font-semibold text-slate-800 dark:text-white text-sm">{comment.authorName}</span>
            <span className="text-xs text-slate-400 ml-2">
              {format(new Date(comment.createdAt), 'MMM d, yyyy · h:mm a')}
            </span>
          </div>
          {isOwner && !editing && (
            <div className="flex gap-1">
              <button
                onClick={() => setEditing(true)}
                className="p-1.5 text-slate-400 hover:text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-950/30 rounded-lg transition-all"
              >
                <HiOutlinePencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(comment._id)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="input-field text-sm resize-none mb-2"
            />
            <div className="flex gap-2">
              <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 bg-ink-600 text-white rounded-lg text-sm font-medium hover:bg-ink-700 transition-all">
                <HiOutlineCheck className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditing(false); setEditText(comment.text); }}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <HiOutlineX className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{comment.text}</p>
        )}
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const IdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authHeader, API_BASE } = useAuth();

  // Load idea from local data file
  const idea = getIdeaById(id);

  // Comments state (try backend, fallback to empty)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useTitle(idea?.title || 'Idea Details');

  useEffect(() => {
    if (!idea) {
      toast.error('Idea not found');
      navigate('/ideas');
      return;
    }
    // Fetch comments from backend (or stay empty if backend unavailable)
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const res = await axios.get(`${API_BASE}/api/comments/${id}`);
        setComments(res.data);
      } catch {
        // Backend not yet running — comments start empty
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [id, API_BASE, idea, navigate]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) { navigate('/login'); return; }

    setCommenting(true);
    try {
      await axios.post(
        `${API_BASE}/api/comments`,
        { ideaId: id, text: newComment.trim() },
        authHeader()
      );
      const res = await axios.get(`${API_BASE}/api/comments/${id}`);
      setComments(res.data);
      setNewComment('');
      toast.success('Comment added!');
    } catch {
      // Optimistic local add when backend is offline
      const localComment = {
        _id: Date.now().toString(),
        ideaId: id,
        text: newComment.trim(),
        authorEmail: user.email,
        authorName: user.displayName || user.email,
        authorPhoto: user.photoURL || '',
        createdAt: new Date().toISOString(),
      };
      setComments((prev) => [localComment, ...prev]);
      setNewComment('');
      toast.success('Comment added locally!');
    } finally {
      setCommenting(false);
    }
  };

  const handleEditComment = async (commentId, text) => {
    try {
      await axios.put(`${API_BASE}/api/comments/${commentId}`, { text }, authHeader());
    } catch { /* offline — still update locally */ }
    setComments((prev) => prev.map((c) => c._id === commentId ? { ...c, text } : c));
    toast.success('Comment updated');
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`${API_BASE}/api/comments/${commentId}`, authHeader());
    } catch { /* offline — still remove locally */ }
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    toast.success('Comment deleted');
  };

  if (!idea) return null;

  const catStyle = CATEGORY_STYLES[idea.category] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-ink-600 dark:hover:text-ink-400 transition-colors mb-8 group"
        >
          <HiOutlineArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Ideas
        </button>

        {/* Hero image */}
        {idea.imageURL && (
          <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-xl">
            <img
              src={idea.imageURL} alt={idea.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${id}/1200/600`; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className={`category-badge ${catStyle} text-sm px-4 py-2`}>{idea.category}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title & meta */}
            <div>
              {!idea.imageURL && (
                <span className={`category-badge ${catStyle} mb-3`}>{idea.category}</span>
              )}
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white leading-tight mb-4">
                {idea.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <HiOutlineEye className="w-4 h-4" /> {idea.views || 0} views
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineClock className="w-4 h-4" />
                  {idea.createdAt ? format(new Date(idea.createdAt), 'MMMM d, yyyy') : ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineChatAlt2 className="w-4 h-4" /> {comments.length} comments
                </span>
              </div>
            </div>

            {/* Short description highlight box */}
            <div className="p-5 bg-ink-50 dark:bg-ink-950/20 rounded-2xl border border-ink-100 dark:border-ink-900/30">
              <p className="text-ink-800 dark:text-ink-300 font-medium leading-relaxed">{idea.shortDescription}</p>
            </div>

            {/* Problem */}
            {idea.problemStatement && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg flex items-center justify-center">⚠️</span>
                  The Problem
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{idea.problemStatement}</p>
              </div>
            )}

            {/* Solution */}
            {idea.proposedSolution && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-lg flex items-center justify-center">✅</span>
                  Proposed Solution
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{idea.proposedSolution}</p>
              </div>
            )}

            {/* Detailed description */}
            {idea.detailedDescription && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-4">Full Description</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{idea.detailedDescription}</p>
              </div>
            )}

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {idea.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-xl text-sm font-medium">
                    <HiOutlineTag className="w-3.5 h-3.5" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Comments ── */}
            <div>
              <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <HiOutlineChatAlt2 className="w-6 h-6 text-ink-500" />
                Discussion
                <span className="ml-1 px-2 py-0.5 bg-ink-100 dark:bg-ink-900/30 text-ink-600 dark:text-ink-400 rounded-full text-sm font-semibold">
                  {comments.length}
                </span>
              </h3>

              {/* Add comment */}
              {user ? (
                <form onSubmit={handleAddComment} className="mb-8">
                  <div className="flex gap-3">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=6175f4&color=fff&size=40`
                      }
                      alt="You"
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white dark:ring-slate-700"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts on this idea..."
                        rows={3}
                        className="input-field resize-none mb-3 text-sm"
                        required
                      />
                      <button
                        type="submit"
                        disabled={commenting || !newComment.trim()}
                        className="btn-primary !py-2 !px-5 !text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {commenting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-slate-600 dark:text-slate-300 mb-3">Sign in to join the discussion</p>
                  <Link to="/login" className="btn-primary !py-2 !px-5 !text-sm">Login to Comment</Link>
                </div>
              )}

              {/* Comment list */}
              {loadingComments ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-ink-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <HiOutlineChatAlt2 className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      currentUser={user}
                      onEdit={handleEditComment}
                      onDelete={handleDeleteComment}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-5">

            {/* Author card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Posted By</h4>
              <div className="flex items-center gap-3">
                <img
                  src={
                    idea.authorPhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(idea.authorName || 'User')}&background=6175f4&color=fff&size=48`
                  }
                  alt={idea.authorName}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-ink-100 dark:ring-ink-900/30"
                />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{idea.authorName || 'Anonymous'}</p>
                  <p className="text-xs text-slate-400">Idea Creator</p>
                </div>
              </div>
            </div>

            {/* Idea stats & details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Idea Details</h4>

              {idea.estimatedBudget && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <HiOutlineCurrencyDollar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Estimated Budget</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{idea.estimatedBudget}</p>
                  </div>
                </div>
              )}

              {idea.targetAudience && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                    <HiOutlineUsers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Target Audience</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm leading-snug">{idea.targetAudience}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-ink-100 dark:bg-ink-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <HiOutlineLightBulb className="w-4 h-4 text-ink-600 dark:text-ink-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{idea.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <HiOutlineEye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Total Views</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{idea.views?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            {/* CTA card */}
            <div className="bg-gradient-to-br from-ink-50 to-amber-50 dark:from-ink-950/30 dark:to-amber-950/20 rounded-2xl border border-ink-100 dark:border-ink-900/30 p-5">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">💬 Join the Discussion</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share your expertise, ask questions, and help shape this idea into something great.
              </p>
            </div>

            {/* Back to ideas */}
            <Link
              to="/ideas"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-ink-300 dark:hover:border-ink-700 hover:text-ink-600 dark:hover:text-ink-400 rounded-xl font-semibold text-sm transition-all"
            >
              <HiOutlineArrowLeft className="w-4 h-4" /> Browse More Ideas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetails;
