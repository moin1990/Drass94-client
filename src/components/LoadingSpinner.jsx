import { HiOutlineLightBulb } from 'react-icons/hi';

const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-[#0f1023]/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ink-500 to-amber-400 flex items-center justify-center shadow-xl shadow-ink-500/30 animate-pulse">
              <HiOutlineLightBulb className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl border-4 border-ink-400/30 animate-ping" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ink-500 to-amber-400 flex items-center justify-center shadow-lg shadow-ink-500/30 animate-pulse">
          <HiOutlineLightBulb className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 rounded-xl border-4 border-ink-400/20 animate-ping" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
