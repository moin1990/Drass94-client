import { Link } from 'react-router-dom';
import {
  HiOutlineLightBulb, HiOutlineMail, HiOutlineLocationMarker
} from 'react-icons/hi';
import { FaXTwitter, FaGithub, FaLinkedin, FaDiscord } from 'react-icons/fa6';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-[#080918] text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-ink-500 to-amber-400 rounded-xl flex items-center justify-center">
                <HiOutlineLightBulb className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">IdeaVault</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              A community-driven platform where startup visionaries share, validate, and refine their ideas together.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-ink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-ink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-ink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-ink-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <FaDiscord className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-white font-semibold font-display mb-5">Platform</h4>
            <ul className="space-y-3">
              {[
                { to: '/ideas', label: 'Browse Ideas' },
                { to: '/ideas?category=Tech', label: 'Tech Ideas' },
                { to: '/ideas?category=AI', label: 'AI Ideas' },
                { to: '/ideas?category=Health', label: 'Health Ideas' },
                { to: '/add-idea', label: 'Share an Idea' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-ink-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold font-display mb-5">Categories</h4>
            <ul className="space-y-3">
              {['Tech', 'AI', 'Health', 'Education', 'Finance', 'Environment'].map((cat) => (
                <li key={cat}>
                  <Link to={`/ideas?category=${cat}`} className="text-sm text-slate-400 hover:text-ink-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-display mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <HiOutlineMail className="w-5 h-5 text-ink-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400">support@ideavault.io</p>
                  <p className="text-sm text-slate-400">partnerships@ideavault.io</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <HiOutlineLocationMarker className="w-5 h-5 text-ink-400 shrink-0" />
                <p className="text-sm text-slate-400">San Francisco, CA</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {year} IdeaVault. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-ink-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ink-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
