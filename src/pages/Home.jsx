import { Link } from 'react-router-dom';
import { getTrendingIdeas } from '../data/ideasData';
import useTitle from '../hooks/useTitle';
import Banner from '../components/Banner';
import IdeaCard from '../components/IdeaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HiOutlineArrowRight, HiOutlineLightBulb, HiOutlineUsers,
  HiOutlineTrendingUp, HiOutlineShieldCheck, HiOutlineChatAlt2,
  HiOutlineStar, HiOutlineSparkles
} from 'react-icons/hi';

const CATEGORIES = [
  { name: 'Tech', icon: '💻', color: 'from-blue-500 to-cyan-500' },
  { name: 'AI', icon: '🤖', color: 'from-purple-500 to-pink-500' },
  { name: 'Health', icon: '🏥', color: 'from-green-500 to-emerald-500' },
  { name: 'Education', icon: '📚', color: 'from-amber-500 to-orange-500' },
  { name: 'Finance', icon: '💰', color: 'from-emerald-500 to-teal-500' },
  { name: 'Environment', icon: '🌿', color: 'from-teal-500 to-green-500' },
];

const Home = () => {
  useTitle('Home');
  const trendingIdeas = getTrendingIdeas(6);
  const loading = false;

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <Banner />

      {/* Trending Ideas */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
              <HiOutlineTrendingUp className="w-4 h-4" />
              Trending Now
            </div>
            <h2 className="font-display text-4xl font-bold text-slate-800 dark:text-white">
              Hot Startup Ideas
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              The most explored ideas in the community
            </p>
          </div>
          <Link to="/ideas" className="btn-secondary shrink-0">
            View All Ideas <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : trendingIdeas.length === 0 ? (
          <div className="text-center py-16">
            <HiOutlineLightBulb className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">No ideas yet. Be the first to share!</p>
            <Link to="/add-idea" className="btn-primary mt-4">Share an Idea</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingIdeas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-ink-50 dark:bg-ink-950/30 text-ink-600 dark:text-ink-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
              <HiOutlineSparkles className="w-4 h-4" />
              Explore by Category
            </div>
            <h2 className="font-display text-4xl font-bold text-slate-800 dark:text-white">
              Browse Your Domain
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
              Explore startup ideas across diverse sectors and find what resonates with your vision.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/ideas?category=${cat.name}`}
                className="group flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-ink-200 dark:hover:border-ink-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-500/10 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {cat.icon}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why IdeaVault */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
            <HiOutlineStar className="w-4 h-4" />
            Why IdeaVault
          </div>
          <h2 className="font-display text-4xl font-bold text-slate-800 dark:text-white">
            Built for Builders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <HiOutlineLightBulb className="w-7 h-7" />,
              title: 'Share Your Vision',
              desc: 'Post your startup ideas with full details — problem, solution, budget, and target audience. Your idea deserves to be heard.',
              color: 'bg-ink-500',
            },
            {
              icon: <HiOutlineUsers className="w-7 h-7" />,
              title: 'Community Validation',
              desc: 'Get real feedback from entrepreneurs, investors, and builders. The community helps you refine and strengthen your concept.',
              color: 'bg-amber-500',
            },
            {
              icon: <HiOutlineChatAlt2 className="w-7 h-7" />,
              title: 'Rich Discussions',
              desc: 'Engage through threaded comments. Add, edit, and delete your contributions. Every conversation refines the idea further.',
              color: 'bg-emerald-500',
            },
          ].map((feat) => (
            <div key={feat.title} className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-ink-200 dark:hover:border-ink-700 hover:shadow-xl hover:shadow-ink-500/10 transition-all duration-300">
              <div className={`w-14 h-14 ${feat.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feat.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-3">{feat.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-ink-600 to-ink-800 rounded-3xl p-12 text-center">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-ink-400/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-ink-200 text-sm font-semibold uppercase tracking-widest mb-4">Ready to start?</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Your Next Big Idea<br />Starts Here
              </h2>
              <p className="text-ink-200 text-lg max-w-xl mx-auto mb-10">
                Join thousands of innovators sharing and validating startup ideas. Your breakthrough could be one post away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-8 py-4 bg-white text-ink-700 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-xl inline-flex items-center gap-2 justify-center">
                  Get Started Free <HiOutlineArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/ideas" className="px-8 py-4 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all inline-flex items-center gap-2 justify-center">
                  Browse Ideas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
