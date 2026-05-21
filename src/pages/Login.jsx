import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import useTitle from '../hooks/useTitle';
import { HiOutlineLightBulb, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  useTitle('Login');
  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.code === 'auth/too-many-requests'
        ? 'Too many attempts. Please try again later.'
        : 'Login failed. Please try again.';
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
      navigate(from, { replace: true });
    } catch {
      toast.error('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-ink-900 via-ink-800 to-slate-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-ink-500/20 rounded-full blur-3xl" />

        <Link to="/" className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-ink-400 to-amber-400 rounded-xl flex items-center justify-center shadow-lg">
            <HiOutlineLightBulb className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white">IdeaVault</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white mb-6 leading-tight">
            Your ideas deserve<br />to be heard.
          </h2>
          <div className="space-y-5">
            {[
              { emoji: '💡', text: 'Share innovative startup concepts' },
              { emoji: '🤝', text: 'Get community validation & feedback' },
              { emoji: '🚀', text: 'Connect with like-minded builders' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-slate-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm">
          © {new Date().getFullYear()} IdeaVault. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0f1023]">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-ink-500 to-amber-400 rounded-xl flex items-center justify-center">
              <HiOutlineLightBulb className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">IdeaVault</span>
          </Link>

          <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-ink-600 dark:text-ink-400 font-semibold hover:underline">Sign up free</Link>
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:border-ink-300 dark:hover:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-950/20 transition-all mb-6 disabled:opacity-60"
          >
            <FcGoogle className="w-5 h-5" />
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange} required
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <button type="button" className="text-xs text-ink-600 dark:text-ink-400 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                  placeholder="Your password"
                  className="input-field pl-11 pr-11"
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full !py-3.5 justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
