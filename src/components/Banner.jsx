import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineLightBulb } from 'react-icons/hi';

const slides = [
  {
    id: 1,
    headline: 'Turn Your Ideas Into',
    highlight: 'Tomorrow\'s Startups',
    sub: 'Share your innovative startup concepts, get community validation, and connect with like-minded builders shaping the future.',
    emoji: '🚀',
    gradient: 'from-ink-900 via-ink-800 to-slate-900',
    accent: 'from-ink-500/20 to-amber-500/10',
  },
  {
    id: 2,
    headline: 'Discover Trending',
    highlight: 'Startup Concepts',
    sub: 'Explore hundreds of vetted startup ideas across Tech, AI, Health, and more. Find inspiration and collaborate with founders.',
    emoji: '💡',
    gradient: 'from-slate-900 via-purple-950 to-ink-900',
    accent: 'from-purple-500/20 to-pink-500/10',
  },
  {
    id: 3,
    headline: 'Validate & Refine',
    highlight: 'Your Vision',
    sub: 'Get real feedback from the community. Comment, discuss, and iterate on ideas to build something truly impactful.',
    emoji: '🎯',
    gradient: 'from-slate-900 via-slate-800 to-emerald-950',
    accent: 'from-emerald-500/20 to-teal-500/10',
  },
];

const Banner = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadSwiper = async () => {
      const { Swiper } = await import('swiper');
      const { Autoplay, Pagination, EffectFade } = await import('swiper/modules');

      await import('swiper/css');
      await import('swiper/css/pagination');
      await import('swiper/css/effect-fade');

      if (swiperRef.current) {
        new Swiper(swiperRef.current, {
          modules: [Autoplay, Pagination, EffectFade],
          effect: 'fade',
          autoplay: { delay: 5000, disableOnInteraction: false },
          pagination: { el: '.swiper-pagination', clickable: true },
          loop: true,
        });
      }
    };
    loadSwiper();
  }, []);

  return (
    <div className="relative h-[90vh] min-h-[600px] overflow-hidden" ref={swiperRef}>
      <div className="swiper-wrapper">
        {slides.map((slide) => (
          <div key={slide.id} className={`swiper-slide relative bg-gradient-to-br ${slide.gradient}`}>
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${slide.accent} opacity-60`} />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />

            {/* Floating orbs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ink-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float" />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Emoji badge */}
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
                  <span className="text-2xl">{slide.emoji}</span>
                  <span className="text-white/80 text-sm font-medium">IdeaVault Platform</span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-slide-up">
                  {slide.headline}
                  <br />
                  <span className="bg-gradient-to-r from-ink-400 to-amber-400 bg-clip-text text-transparent">
                    {slide.highlight}
                  </span>
                </h1>

                <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
                  {slide.sub}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                  <Link to="/ideas" className="btn-primary !py-4 !px-8 !text-base shadow-2xl shadow-ink-500/40">
                    Explore Ideas <HiOutlineArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/add-idea" className="px-8 py-4 text-base border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold rounded-xl transition-all duration-200 inline-flex items-center gap-2">
                    <HiOutlineLightBulb className="w-5 h-5" />
                    Share an Idea
                  </Link>
                </div>

                {/* Stats bar */}
                <div className="flex justify-center gap-8 mt-14 animate-fade-in">
                  {[
                    { num: '2,400+', label: 'Ideas Shared' },
                    { num: '840+', label: 'Active Builders' },
                    { num: '12K+', label: 'Discussions' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="font-display font-bold text-2xl text-white">{stat.num}</p>
                      <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="swiper-pagination !bottom-8" />
    </div>
  );
};

export default Banner;
