import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineChatAlt2, HiOutlineArrowRight, HiOutlinePencil,
  HiOutlineTrash, HiOutlineX, HiOutlineCheck
} from 'react-icons/hi';

const MyInteractions = () => {
  useTitle('My Interactions');
  const { user, authHeader, API_BASE } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchInteractions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/comments/user/${user.email}`, authHeader());
        setComments(res.data);
      } catch {
        toast.error('Failed to load interactions');
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchInteractions();
  }, [user, API_BASE]);

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      await axios.put(`${API_BASE}/api/comments/${id}`, { text: editText }, authHeader());
      setComments((prev) => prev.map((c) => c._id === id ? { ...c, text: editText } : c));
      setEditingId(null);
      toast.success('Comment updated');
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`${API_BASE}/api/comments/${id}`, authHeader());
      setComments((prev) => prev.filter((c) => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-slate-800 dark:text-white">My Interactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            All your comments and discussions across ideas.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : comments.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineChatAlt2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-2">No interactions yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Start exploring ideas and join the discussions!
            </p>
            <Link to="/ideas" className="btn-primary">Explore Ideas</Link>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6 p-4 bg-ink-50 dark:bg-ink-950/20 rounded-2xl border border-ink-100 dark:border-ink-900/30">
              <HiOutlineChatAlt2 className="w-5 h-5 text-ink-500" />
              <span className="font-semibold text-ink-700 dark:text-ink-300">
                {comments.length} comment{comments.length !== 1 ? 's' : ''} across {new Set(comments.map(c => c.ideaId)).size} ideas
              </span>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 hover:border-ink-200 dark:hover:border-ink-700 transition-all">
                  {/* Idea link */}
                  {comment.idea && (
                    <Link
                      to={`/ideas/${comment.ideaId}`}
                      className="flex items-center gap-2 text-sm font-semibold text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 mb-3 group"
                    >
                      <span className="flex-1 truncate">{comment.idea.title}</span>
                      <HiOutlineArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}

                  {/* Comment content */}
                  {editingId === comment._id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={3}
                        className="input-field resize-none mb-3 text-sm"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(comment._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-ink-600 text-white rounded-lg text-sm font-medium hover:bg-ink-700 transition-all">
                          <HiOutlineCheck className="w-4 h-4" /> Save
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                          <HiOutlineX className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                        {comment.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {comment.createdAt ? format(new Date(comment.createdAt), 'MMMM d, yyyy · h:mm a') : ''}
                        </span>
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(comment)}
                            className="p-1.5 text-slate-400 hover:text-ink-500 hover:bg-ink-50 dark:hover:bg-ink-950/30 rounded-lg transition-all">
                            <HiOutlinePencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(comment._id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyInteractions;
