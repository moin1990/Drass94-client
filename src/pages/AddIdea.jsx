import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import { HiOutlineLightBulb, HiOutlinePlusCircle } from 'react-icons/hi';

const CATEGORIES = ['Tech', 'AI', 'Health', 'Education', 'Finance', 'Environment', 'Social', 'Other'];

const AddIdea = () => {
  useTitle('Add Idea');
  const { authHeader, API_BASE } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    category: '',
    tags: [],
    imageURL: '',
    estimatedBudget: '',
    targetAudience: '',
    problemStatement: '',
    proposedSolution: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    const tag = tagInput.trim().replace(/^#/, '');
    if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/ideas`, form, authHeader());
      toast.success('Your idea has been published! 🎉');
      navigate('/my-ideas');
    } catch {
      toast.error('Failed to submit idea. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'input-field';
  const labelClass = 'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-ink-500 to-amber-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-ink-500/30">
            <HiOutlineLightBulb className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-slate-800 dark:text-white">Share Your Idea</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Present your startup concept to the world. Be detailed, be clear, be inspiring.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              Basic Information
            </h2>

            <div>
              <label className={labelClass}>Idea Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required
                placeholder="e.g., AI-powered personal finance coach"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Short Description *</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required
                placeholder="A one-liner that captures your idea's essence"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Detailed Description *</label>
              <textarea name="detailedDescription" value={form.detailedDescription} onChange={handleChange} required
                rows={5} placeholder="Explain your idea in depth. Cover the concept, approach, and potential..."
                className={`${inputClass} resize-none`} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required className={inputClass}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Estimated Budget (optional)</label>
                <input name="estimatedBudget" value={form.estimatedBudget} onChange={handleChange}
                  placeholder="e.g., $5,000 – $50,000"
                  className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Image URL (optional)</label>
              <input name="imageURL" value={form.imageURL} onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputClass} />
            </div>

            {/* Tags */}
            <div>
              <label className={labelClass}>Tags (optional, up to 8)</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type a tag and press Enter"
                  className={`${inputClass} flex-1`}
                />
                <button type="button" onClick={addTag} className="btn-secondary !py-2 !px-4 shrink-0">
                  Add
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-xl text-sm font-medium">
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Problem & Solution card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-5">
            <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              Problem & Solution
            </h2>

            <div>
              <label className={labelClass}>Target Audience *</label>
              <input name="targetAudience" value={form.targetAudience} onChange={handleChange} required
                placeholder="e.g., Freelancers, small business owners aged 25–45"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Problem Statement *</label>
              <textarea name="problemStatement" value={form.problemStatement} onChange={handleChange} required
                rows={4} placeholder="What problem does your idea solve? Why does it matter?"
                className={`${inputClass} resize-none`} />
            </div>

            <div>
              <label className={labelClass}>Proposed Solution *</label>
              <textarea name="proposedSolution" value={form.proposedSolution} onChange={handleChange} required
                rows={4} placeholder="How exactly does your idea solve the problem?"
                className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={submitting}
            className="btn-primary w-full !py-4 !text-base justify-center disabled:opacity-60 disabled:cursor-not-allowed">
            <HiOutlinePlusCircle className="w-5 h-5" />
            {submitting ? 'Publishing your idea...' : 'Publish Idea'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIdea;
