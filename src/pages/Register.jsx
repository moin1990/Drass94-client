import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import {
  HiOutlineLightBulb, HiOutlineMail, HiOutlineLockClosed,
  HiOutlineUser, HiOutlinePhotograph, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineCheckCircle, HiOutlineXCircle
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

const PasswordRule = ({ met, text }) => (
  <span className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
    {met
      ? <HiOutlineCheckCircle className="w-3.5 h-3.5" />
      : <HiOutlineXCircle className="w-3.5 h-3.5" />}
    {text}
  </span>
);

const Register = () => {
  useTitle('Register');
  const { registerUser, googleLogin, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pw = form.password;
  const rules = {
    length: pw.length >= 6,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
  };
  const allRulesMet = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allRulesMet) {
      toast.error('Password does not meet requirements');
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser(form.email, form.password);
      await updateUserProfile(form.name, form.photoURL);
      toast.success('Account created successfully! Welcome 🎉');
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'This email is already registered'
        : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
      toast.success('Welcome to IdeaVault! 🚀');
      navigate('/');
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-slate-900 via-ink-900 to-amber-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-ink-500/20 rounded-full blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-ink-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
            <HiOutlineLightBulb className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">IdeaVault</span>
        </Link>

        <div className="relative z-10">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">Join the community</p>
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            Build the future,<br />one idea at a time.
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '2,400+', label: 'Ideas Shared' },
              { num: '840+', label: 'Active Members' },
              { num: '12K+', label: 'Discussions' },
              { num: '6', label: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="font-display font-bold text-2xl text-white">{stat.num}</p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm">
          © {new Date().getFullYear()} IdeaVault. All rights reserved.
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0f1023] overflow-y-auto">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-ink-500 to-amber-400 rounded-xl flex items-center justify-center">
              <HiOutlineLightBulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">IdeaVault</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Create account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-ink-600 dark:text-ink-400 font-semibold hover:underline">Sign in</Link>
          </p>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:border-ink-300 dark:hover:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-950/20 transition-all mb-6 disabled:opacity-60"
          >
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  placeholder="John Doe" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Photo URL (optional)</label>
              <div className="relative">
                <HiOutlinePhotograph className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="url" name="photoURL" value={form.photoURL} onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="Create a strong password" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
              {pw && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  <PasswordRule met={rules.length} text="Min. 6 characters" />
                  <PasswordRule met={rules.upper} text="Uppercase letter" />
                  <PasswordRule met={rules.lower} text="Lowercase letter" />
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full !py-3.5 justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              By signing up, you agree to our{' '}
              <a href="#" className="text-ink-500 hover:underline">Terms</a> and{' '}
              <a href="#" className="text-ink-500 hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
