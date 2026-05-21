import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import {
  HiOutlineLightBulb, HiOutlineMenu, HiX,
  HiOutlineMoon, HiOutlineSun, HiOutlineUser,
  HiOutlineLogout, HiOutlinePencil, HiOutlineCollection,
  HiOutlineHeart, HiOutlineHome
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-ink-600 dark:text-ink-400 bg-ink-50 dark:bg-ink-950/50'
        : 'text-slate-600 dark:text-slate-300 hover:text-ink-600 dark:hover:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-950/30'
    }`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-[#0f1023]/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <div className="w-9 h-9 bg-gradient-to-br from-ink-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-ink-500/30">
              <HiOutlineLightBulb className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text hidden sm:block">IdeaVault</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              <HiOutlineHome className="w-4 h-4" /> Home
            </NavLink>
            <NavLink to="/ideas" className={navLinkClass}>
              <HiOutlineCollection className="w-4 h-4" /> Ideas
            </NavLink>
            {user && (
              <>
                <NavLink to="/add-idea" className={navLinkClass}>
                  <HiOutlinePencil className="w-4 h-4" /> Add Idea
                </NavLink>
                <NavLink to="/my-ideas" className={navLinkClass}>
                  <HiOutlineLightBulb className="w-4 h-4" /> My Ideas
                </NavLink>
                <NavLink to="/my-interactions" className={navLinkClass}>
                  <HiOutlineHeart className="w-4 h-4" /> My Interactions
                </NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-ink-600 dark:hover:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-950/30 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border-2 border-ink-200 dark:border-ink-800 hover:border-ink-400 transition-all"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=6175f4&color=fff`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block max-w-[100px] truncate">
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.displayName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-ink-50 dark:hover:bg-ink-950/30 hover:text-ink-600 transition-all"
                      >
                        <HiOutlineUser className="w-4 h-4" /> Profile Management
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                      >
                        <HiOutlineLogout className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-ink-600 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-950/30 rounded-xl transition-all">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-4 !text-sm">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-ink-50 dark:hover:bg-ink-950/30 transition-all"
            >
              {menuOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-1 animate-slide-up">
          <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>
            <HiOutlineHome className="w-4 h-4" /> Home
          </NavLink>
          <NavLink to="/ideas" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <HiOutlineCollection className="w-4 h-4" /> Ideas
          </NavLink>
          {user ? (
            <>
              <NavLink to="/add-idea" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <HiOutlinePencil className="w-4 h-4" /> Add Idea
              </NavLink>
              <NavLink to="/my-ideas" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <HiOutlineLightBulb className="w-4 h-4" /> My Ideas
              </NavLink>
              <NavLink to="/my-interactions" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <HiOutlineHeart className="w-4 h-4" /> My Interactions
              </NavLink>
              <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                <HiOutlineUser className="w-4 h-4" /> Profile
              </NavLink>
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all">
                <HiOutlineLogout className="w-4 h-4" /> Log Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 border border-ink-200 dark:border-ink-800 text-ink-600 dark:text-ink-400 rounded-xl text-sm font-semibold">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2 bg-ink-600 text-white rounded-xl text-sm font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
