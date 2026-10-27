import React, { useState } from 'react';
import {
  Search,
  Lock,
  Globe,
  Sparkles,
  ExternalLink,
  PlusCircle,
  Eye,
  Heart,
  ShieldCheck,
  Filter,
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';
import { PlatformSite, GoogleWebItem, SearchResponseData } from '../types';

interface SearchResultsPageProps {
  query: string;
  data: SearchResponseData | null;
  loading: boolean;
  onSearch: (newQuery: string) => void;
  onNavigateToSite: (url: string) => void;
  onNewTab: (url: string) => void;
  onOpenStudio: () => void;
  onOpenShieldVerifier: () => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  query,
  data,
  loading,
  onSearch,
  onNavigateToSite,
  onNewTab,
  onOpenStudio,
  onOpenShieldVerifier,
}) => {
  const [searchInput, setSearchInput] = useState(query);
  const [activeFilter, setActiveFilter] = useState<'all' | 'platform' | 'google'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  const platformResults = data?.platformResults || [];
  const googleResults = data?.googleResults || [];

  const filteredPlatformResults = activeFilter === 'google' ? [] : platformResults;
  const filteredGoogleResults = activeFilter === 'platform' ? [] : googleResults;

  const totalResultsCount = filteredPlatformResults.length + filteredGoogleResults.length;

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Search Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Google & platform websites..."
              className="w-full bg-slate-950 text-slate-100 text-sm rounded-full pl-10 pr-10 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-3 top-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              Search
            </button>
          </form>

          {/* Quick Post Button */}
          <button
            type="button"
            onClick={onOpenStudio}
            className="flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Post Your Site</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-5xl mx-auto flex items-center gap-4 mt-3 text-xs overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>All Results</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full text-slate-400">
              {totalResultsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('platform')}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === 'platform'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Platform Sites (Exclusive)</span>
            {platformResults.length > 0 && (
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/60 px-1.5 py-0.2 rounded-full font-bold">
                {platformResults.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('google')}
            className={`pb-2 px-1 border-b-2 font-medium transition-colors flex items-center gap-1.5 ${
              activeFilter === 'google'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span>Google Web</span>
            {googleResults.length > 0 && (
              <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800/60 px-1.5 py-0.2 rounded-full">
                {googleResults.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Results Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-4">
        {/* Result Meta */}
        <div className="text-xs text-slate-500 mb-4 flex items-center justify-between">
          <span>
            About {totalResultsCount} results for "{query}"
          </span>
          <button
            type="button"
            onClick={onOpenShieldVerifier}
            className="text-emerald-400/90 hover:text-emerald-300 flex items-center gap-1 font-mono text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Google Exclusivity Active</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400">Grounding Google Web results & checking Private Registry...</p>
          </div>
        )}

        {/* AI Overview Box (Google Search Style) */}
        {!loading && data?.overview && (
          <div className="mb-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Google AI Overview</span>
              </div>
              <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50">
                Live Grounded
              </span>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {data.overview}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Platform-Exclusive Website Results */}
            {filteredPlatformResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <h2 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Platform-Exclusive Sites ({filteredPlatformResults.length})
                    </h2>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                    Protected &bull; Not on Google
                  </span>
                </div>

                {filteredPlatformResults.map((site) => (
                  <div
                    key={site.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-emerald-600/30 hover:border-emerald-500 transition-all shadow-md group relative overflow-hidden"
                  >
                    {/* Visual accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500" />

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-emerald-400 text-xs font-semibold truncate">
                          {site.url}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-[11px] text-slate-400">{site.category}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{site.views}</span>
                        </span>
                        <span className="flex items-center gap-1 text-rose-400">
                          <Heart className="w-3 h-3 text-rose-500" />
                          <span>{site.likes}</span>
                        </span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onNavigateToSite(site.url)}
                      className="text-base sm:text-lg font-semibold text-blue-400 group-hover:text-emerald-300 cursor-pointer underline decoration-blue-500/30 group-hover:decoration-emerald-400 transition-colors mb-1"
                    >
                      {site.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                      {site.tagline || site.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Created by <strong className="text-slate-200">{site.author}</strong></span>
                        <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded border border-slate-700">
                          🔒 Platform Only
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onNewTab(site.url)}
                          className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          New Tab
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigateToSite(site.url)}
                          className="px-3 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Visit Site</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Google Grounded Web Results */}
            {filteredGoogleResults.length > 0 && (
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h2 className="text-sm font-bold text-blue-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Google Web Results ({filteredGoogleResults.length})
                  </h2>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    Global Web Index
                  </span>
                </div>

                {filteredGoogleResults.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300">
                        {item.domain?.[0]?.toUpperCase() || 'W'}
                      </div>
                      <span className="text-slate-300 font-mono text-[11px] truncate max-w-sm">
                        {item.domain || item.uri}
                      </span>
                      <span className="text-[10px] bg-slate-800/80 text-blue-400 px-1.5 py-0.2 rounded">
                        🌐 Web
                      </span>
                    </div>

                    <a
                      href={item.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base sm:text-lg font-medium text-blue-400 hover:text-blue-300 hover:underline leading-snug cursor-pointer"
                    >
                      {item.title}
                    </a>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.snippet || `Explore information, guides and resources at ${item.uri}`}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && totalResultsCount === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-200">
                    No results found for "{query}"
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Be the very first creator to publish a website for "{query}" on our platform network!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenStudio}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish "{query}" Website Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Platform Privacy Knowledge & Post Promo (1/3) */}
          <div className="space-y-6">
            {/* Post Your Website Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-slate-800 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100">Post Your Custom Website</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Publish a portfolio, business site, blog, or tools hub with a custom <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">pweb://</code> URL.
              </p>
              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Searchable on OmniBrowser</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Invisible to Public Google</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenStudio}
                className="w-full mt-4 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Launch Website Creator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Why Not On Public Google Card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Google Shield Mechanism</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Websites created here are served through our proprietary internal protocol (`pweb://`) and are protected by automatic <code>noindex</code> directives.
              </p>
              <button
                type="button"
                onClick={onOpenShieldVerifier}
                className="text-blue-400 hover:text-blue-300 font-medium text-[11px] flex items-center gap-1 pt-1"
              >
                <span>Test & verify shield</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
