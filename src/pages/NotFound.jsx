import { Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';
import { HiOutlineLightBulb, HiOutlineArrowLeft, HiOutlineHome } from 'react-icons/hi';

const NotFound = () => {
  useTitle('Page Not Found');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-[#0f1023]">
      <div className="text-center max-w-lg">
        {/* Decorative 404 */}
        <div className="relative mb-8">
          <p className="font-display font-bold text-[10rem] leading-none text-slate-100 dark:text-slate-800 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-ink-500 to-amber-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-ink-500/30 animate-float">
              <HiOutlineLightBulb className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-slate-800 dark:text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
          Looks like this idea doesn't exist yet. Maybe it's a sign to create something new?
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary">
            <HiOutlineHome className="w-5 h-5" /> Back to Home
          </Link>
          <Link to="/ideas" className="btn-secondary">
            <HiOutlineLightBulb className="w-5 h-5" /> Explore Ideas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
