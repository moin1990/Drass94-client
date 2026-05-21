import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineLightBulb, HiOutlinePencil, HiOutlineTrash,
  HiOutlineEye, HiOutlineX, HiOutlineCheck, HiOutlinePlusCircle
} from 'react-icons/hi';

const CATEGORIES = ['Tech', 'AI', 'Health', 'Education', 'Finance', 'Environment', 'Social', 'Other'];

const UpdateModal = ({ idea, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: idea.title || '',
    shortDescription: idea.shortDescription || '',
    detailedDescription: idea.detailedDescription || '',
    category: idea.category || '',
    imageURL: idea.imageURL || '',
    estimatedBudget: idea.estimatedBudget || '',
    targetAudience: idea.targetAudience || '',
    problemStatement: idea.problemStatement || '',
    proposedSolution: idea.proposedSolution || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(idea._id, form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white">Update Idea</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <HiOutlineX className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 flex-1">
          {[
            { name: 'title', label: 'Title', type: 'input' },
            { name: 'shortDescription', label: 'Short Description', type: 'input' },
            { name: 'imageURL', label: 'Image URL', type: 'input' },
            { name: 'estimatedBudget', label: 'Estimated Budget', type: 'input' },
            { name: 'targetAudience', label: 'Target Audience', type: 'input' },
            { name: 'detailedDescription', label: 'Detailed Description', type: 'textarea' },
            { name: 'problemStatement', label: 'Problem Statement', type: 'textarea' },
            { name: 'proposedSolution', label: 'Proposed Solution', type: 'textarea' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
              {field.type === 'input' ? (
                <input name={field.name} value={form[field.name]} onChange={handleChange} className="input-field" />
              ) : (
                <textarea name={field.name} value={form[field.name]} onChange={handleChange} rows={3} className="input-field resize-none" />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-slate-800 pb-1">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
              <HiOutlineCheck className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteModal = ({ idea, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm(idea._id);
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineTrash className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-2">Delete Idea?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            Are you sure you want to delete <strong className="text-slate-700 dark:text-slate-300">"{idea.title}"</strong>?
          </p>
          <p className="text-sm text-red-500 mb-8">This action cannot be undone. All associated comments will also be removed.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all disabled:opacity-60">
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button onClick={onClose} className="flex-1 py-3 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyIdeas = () => {
  useTitle('My Ideas');
  const { user, authHeader, API_BASE } = useAuth();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIdea, setEditingIdea] = useState(null);
  const [deletingIdea, setDeletingIdea] = useState(null);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/api/ideas/user/${user.email}`, authHeader());
        setIdeas(res.data);
      } catch {
        toast.error('Failed to load your ideas');
      } finally {
        setLoading(false);
      }
    };
    if (user?.email) fetchMyIdeas();
  }, [user, API_BASE]);

  const handleUpdate = async (id, data) => {
    try {
      await axios.put(`${API_BASE}/api/ideas/${id}`, data, authHeader());
      setIdeas((prev) => prev.map((idea) => idea._id === id ? { ...idea, ...data } : idea));
      setEditingIdea(null);
      toast.success('Idea updated successfully!');
    } catch {
      toast.error('Failed to update idea');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/ideas/${id}`, authHeader());
      setIdeas((prev) => prev.filter((idea) => idea._id !== id));
      setDeletingIdea(null);
      toast.success('Idea deleted successfully');
    } catch {
      toast.error('Failed to delete idea');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl font-bold text-slate-800 dark:text-white">My Ideas</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {ideas.length} idea{ideas.length !== 1 ? 's' : ''} published
            </p>
          </div>
          <Link to="/add-idea" className="btn-primary shrink-0">
            <HiOutlinePlusCircle className="w-5 h-5" /> New Idea
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : ideas.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-ink-50 dark:bg-ink-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineLightBulb className="w-10 h-10 text-ink-400" />
            </div>
            <h3 className="font-display text-2xl font-bold text-slate-800 dark:text-white mb-2">No ideas yet</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">You haven't shared any ideas yet. Start by creating your first one!</p>
            <Link to="/add-idea" className="btn-primary">
              <HiOutlinePlusCircle className="w-5 h-5" /> Share Your First Idea
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div key={idea._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex flex-col sm:flex-row gap-4 hover:border-ink-200 dark:hover:border-ink-700 transition-all">
                {/* Image */}
                {idea.imageURL && (
                  <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={idea.imageURL} alt={idea.title} className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white truncate">{idea.title}</h3>
                    <span className="text-xs text-slate-400 shrink-0">
                      {idea.createdAt ? format(new Date(idea.createdAt), 'MMM d, yyyy') : ''}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{idea.shortDescription}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-lg">
                      {idea.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <HiOutlineEye className="w-3.5 h-3.5" /> {idea.views || 0} views
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link to={`/ideas/${idea._id}`}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-ink-50 dark:hover:bg-ink-950/30 hover:text-ink-600 dark:hover:text-ink-400 rounded-xl transition-all">
                    <HiOutlineEye className="w-4 h-4" /> View
                  </Link>
                  <button onClick={() => setEditingIdea(idea)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 hover:text-amber-600 dark:hover:text-amber-400 rounded-xl transition-all">
                    <HiOutlinePencil className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => setDeletingIdea(idea)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 rounded-xl transition-all">
                    <HiOutlineTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingIdea && (
        <UpdateModal idea={editingIdea} onClose={() => setEditingIdea(null)} onSave={handleUpdate} />
      )}
      {deletingIdea && (
        <DeleteModal idea={deletingIdea} onClose={() => setDeletingIdea(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
};

export default MyIdeas;
