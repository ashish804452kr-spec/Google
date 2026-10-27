import React, { useState } from 'react';
import {
  Search,
  Mic,
  Camera,
  PlusCircle,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Globe2
} from 'lucide-react';
import { PlatformSite } from '../types';

interface GoogleSearchPageProps {
  onSearch: (query: string) => void;
  onNavigateToSite: (url: string) => void;
  onOpenStudio: () => void;
  onOpenRegistry: () => void;
  onOpenShieldVerifier: () => void;
  platformSites: PlatformSite[];
}

export const GoogleSearchPage: React.FC<GoogleSearchPageProps> = ({
  onSearch,
  onNavigateToSite,
  onOpenStudio,
  onOpenRegistry,
  onOpenShieldVerifier,
  platformSites,
}) => {
  const [query, setQuery] = useState('');
  const [lang, setLang] = useState<'hinglish' | 'hindi' | 'english'>('hinglish');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleFeelingLucky = () => {
    if (query.trim()) {
      onSearch(query.trim());
    } else if (platformSites.length > 0) {
      // Pick random platform site
      const randomSite = platformSites[Math.floor(Math.random() * platformSites.length)];
      onNavigateToSite(randomSite.url);
    } else {
      onSearch('Google AI Studio technology');
    }
  };

  const trendingTopics = [
    { label: 'Ashish Tech Studio', isPrivate: true, target: 'pweb://ashish-creations' },
    { label: 'Chai Pe Charcha Cafe', isPrivate: true, target: 'pweb://chai-pe-charcha' },
    { label: 'Developer CodeVault', isPrivate: true, target: 'pweb://code-vault' },
    { label: 'Latest Cricket World Cup', isPrivate: false, target: 'cricket match live score' },
    { label: 'React 19 & Tailwind CSS v4', isPrivate: false, target: 'React 19 new features guide' },
    { label: 'Himalayan Hidden Trails', isPrivate: true, target: 'pweb://himalayan-escapes' },
  ];

  return (
    <div className="min-h-full flex flex-col justify-between bg-slate-950 text-slate-100 font-sans pb-8">
      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onOpenShieldVerifier}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/60 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Privacy Shield: Active</span>
          </button>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400">
            {platformSites.length} Private Sites Hosted
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => onSearch('Google images')}
            className="hover:text-slate-200 transition-colors"
          >
            Images
          </button>
          <button
            type="button"
            onClick={onOpenRegistry}
            className="hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Platform Registry</span>
          </button>

          <button
            type="button"
            onClick={onOpenStudio}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-500 hover:to-indigo-500 shadow-md transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Your Website</span>
          </button>

          <div
            title="User Profile: ashish804452kr@gmail.com"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-800 cursor-pointer"
          >
            A
          </div>
        </div>
      </header>

      {/* Main Center Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full my-6">
        {/* Google Style Colorful Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl select-none">
            <span className="text-[#4285F4]">G</span>
            <span className="text-[#EA4335]">o</span>
            <span className="text-[#FBBC05]">o</span>
            <span className="text-[#4285F4]">g</span>
            <span className="text-[#34A853]">l</span>
            <span className="text-[#EA4335]">e</span>
            <span className="text-xs sm:text-sm font-mono tracking-normal ml-2 px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 uppercase">
              + PrivateWeb
            </span>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            World Wide Web via Google Grounding &bull; Host your private website visible{' '}
            <strong className="text-emerald-400 font-semibold underline decoration-emerald-500/50">
              only on this platform
            </strong>
          </p>
        </div>

        {/* Big Search Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl relative">
          <div className="group relative flex items-center bg-slate-900 border border-slate-700/80 hover:border-slate-600 focus-within:border-blue-500 rounded-full px-4 h-12 sm:h-14 shadow-lg hover:shadow-xl focus-within:ring-4 focus-within:ring-blue-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 group-focus-within:text-blue-400 transition-colors" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Google or search platform-exclusive websites..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
              autoFocus
            />

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setQuery('Ashish Developer Portfolio');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                title="Search suggestion"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
              </button>
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"
                title="Search by voice"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-green-400 transition-colors"
                title="Search by image / lens"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 hover:border-slate-600 shadow-sm transition-all"
            >
              Google Search
            </button>

            <button
              type="button"
              onClick={handleFeelingLucky}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 hover:border-slate-600 shadow-sm transition-all"
            >
              I'm Feeling Lucky
            </button>

            <button
              type="button"
              onClick={onOpenStudio}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Post Your Website (Exclusive)</span>
            </button>
          </div>
        </form>

        {/* Clear Hindi / English Feature Guarantee */}
        <div className="mt-8 max-w-2xl w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-xs space-y-1.5 flex-1">
              <div className="font-semibold text-slate-200 flex items-center justify-between">
                <span>Google + Platform-Exclusive Guarantee</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  noindex &bull; Private-Net
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Yahan par Google ka sara internet live grounded data ke sath search hoga. Sath hi aap{' '}
                <span className="text-slate-200 font-medium">apni website post kar sakte hain</span> jo sirf is platform ke search me dikhegi —{' '}
                <span className="text-emerald-300 font-medium">public Google par search karne par bilkul nahi aayegi</span>!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Trending Searches & Platform Hubs */}
        <div className="mt-8 w-full max-w-2xl">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Trending Searches & Platform Highlights</span>
            </div>
            <button
              type="button"
              onClick={onOpenRegistry}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-0.5"
            >
              <span>Explore all</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {trendingTopics.map((topic, i) => (
              <div
                key={i}
                onClick={() => {
                  if (topic.target.startsWith('pweb://')) {
                    onNavigateToSite(topic.target);
                  } else {
                    onSearch(topic.target);
                  }
                }}
                className="group flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {topic.isPrivate ? (
                    <div className="w-5 h-5 rounded bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-[10px] text-emerald-400 flex-shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                    </div>
                  ) : (
                    <Search className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  )}
                  <span className="text-xs text-slate-300 group-hover:text-white truncate">
                    {topic.label}
                  </span>
                </div>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    topic.isPrivate
                      ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40'
                      : 'bg-blue-950/50 text-blue-400 border border-blue-800/40'
                  }`}
                >
                  {topic.isPrivate ? 'Platform Only' : 'Google Web'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-800/60 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Region: India / Global (OmniBrowser Node)</span>
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <button type="button" onClick={onOpenShieldVerifier} className="hover:text-slate-300">
            How PrivateWeb Works
          </button>
          <button type="button" onClick={onOpenStudio} className="hover:text-slate-300">
            Publish New Site
          </button>
          <button type="button" onClick={onOpenRegistry} className="hover:text-slate-300">
            Directory
          </button>
          <span className="text-slate-600">&copy; 2026 OmniBrowser PrivateNet</span>
        </div>
      </footer>
    </div>
  );
};
