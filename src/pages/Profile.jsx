import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import { HiOutlineUser, HiOutlinePhotograph, HiOutlineCheck, HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const Profile = () => {
  useTitle('Profile');
  const { user, updateUserProfile, authHeader, API_BASE } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(user?.photoURL || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    try {
      await updateUserProfile(name.trim(), photoURL.trim());
      // Also update in backend
      await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader().headers },
        body: JSON.stringify({ name: name.trim(), photo: photoURL.trim() }),
      });
      toast.success('Profile updated successfully!');
      setPreview(photoURL.trim());
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold text-slate-800 dark:text-white">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your personal information and account details.</p>
        </div>

        {/* Avatar preview card */}
        <div className="bg-gradient-to-br from-ink-600 to-ink-800 rounded-3xl p-8 mb-8 flex items-center gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative">
            <img
              src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'User')}&background=ffffff&color=6175f4&size=80`}
              alt="Avatar"
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl"
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=User&background=ffffff&color=6175f4&size=80`; }}
            />
          </div>
          <div className="relative">
            <p className="font-display font-bold text-2xl text-white">{user?.displayName || 'User'}</p>
            <p className="text-ink-200 text-sm">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-medium">Verified Account</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            Edit Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 dark:text-slate-500" />
                <input
                  type="email" value={user?.email || ''} disabled
                  className="input-field pl-11 opacity-60 cursor-not-allowed bg-slate-50 dark:bg-slate-700"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Email address cannot be changed.</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Display Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="Your full name" className="input-field pl-11"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Photo URL</label>
              <div className="relative">
                <HiOutlinePhotograph className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/photo.jpg" className="input-field pl-11"
                />
              </div>
              {photoURL && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={photoURL} alt="Preview"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-600"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-xs text-slate-400">Preview</span>
                </div>
              )}
            </div>

            <button
              type="submit" disabled={saving}
              className="btn-primary w-full !py-3.5 justify-center text-base disabled:opacity-60"
            >
              <HiOutlineCheck className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Member Since', value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '—' },
            { label: 'Auth Provider', value: user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email' },
            { label: 'Status', value: 'Active' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 text-center">
              <p className="font-display font-bold text-lg text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
