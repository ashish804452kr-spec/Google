import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Search,
  Lock,
  Globe,
  Plus,
  X,
  PlusCircle,
  ShieldCheck,
  Bookmark,
  Layers,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';
import { BrowserTab, PlatformSite } from '../types';

interface BrowserChromeProps {
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: (url?: string) => void;
  onNavigate: (tabId: string, url: string) => void;
  onBack: (tabId: string) => void;
  onForward: (tabId: string) => void;
  onReload: (tabId: string) => void;
  onOpenStudio: (siteToEdit?: PlatformSite) => void;
  onOpenRegistry: () => void;
  onOpenShieldVerifier: () => void;
  platformSites: PlatformSite[];
}

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onOpenStudio,
  onOpenRegistry,
  onOpenShieldVerifier,
  platformSites,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [omniboxInput, setOmniboxInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const omniboxRef = useRef<HTMLDivElement>(null);

  // Sync omnibox input when active tab URL changes
  useEffect(() => {
    if (activeTab) {
      if (activeTab.url === 'home') {
        setOmniboxInput('');
      } else if (activeTab.url.startsWith('search?q=')) {
        setOmniboxInput(decodeURIComponent(activeTab.url.replace('search?q=', '')));
      } else {
        setOmniboxInput(activeTab.url);
      }
    }
  }, [activeTab?.url, activeTab?.id]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (omniboxRef.current && !omniboxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOmniboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = omniboxInput.trim();
    if (!val) return;

    setShowSuggestions(false);

    // If it looks like a URL
    if (val.startsWith('pweb://')) {
      onNavigate(activeTab.id, val);
    } else if (val.startsWith('http://') || val.startsWith('https://')) {
      onNavigate(activeTab.id, val);
    } else if (val.includes('.') && !val.includes(' ') && val.length > 3) {
      onNavigate(activeTab.id, `https://${val}`);
    } else {
      // It's a search query
      onNavigate(activeTab.id, `search?q=${encodeURIComponent(val)}`);
    }
  };

  const isPlatformWeb = activeTab?.url.startsWith('pweb://');
  const isSearch = activeTab?.url.startsWith('search?q=');
  const isHome = activeTab?.url === 'home';

  // Filter site suggestions
  const filteredSuggestions = omniboxInput.trim()
    ? platformSites.filter(
        (s) =>
          s.title.toLowerCase().includes(omniboxInput.toLowerCase()) ||
          s.slug.toLowerCase().includes(omniboxInput.toLowerCase()) ||
          s.tags.some((t) => t.toLowerCase().includes(omniboxInput.toLowerCase()))
      ).slice(0, 5)
    : platformSites.slice(0, 4);

  return (
    <div className="bg-slate-900 border-b border-slate-800 select-none shadow-md">
      {/* 1. Tab Bar */}
      <div className="flex items-center px-2 pt-2 space-x-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center max-w-[220px] min-w-[130px] h-9 px-3 rounded-t-lg text-xs font-medium cursor-pointer transition-all duration-150 border-t border-x ${
                isActive
                  ? 'bg-slate-950 text-slate-100 border-slate-700/80 shadow-sm'
                  : 'bg-slate-800/70 text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="mr-2 flex-shrink-0">
                {tab.url.startsWith('pweb://') ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse" title="Platform Site" />
                ) : tab.url === 'home' ? (
                  <div className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] text-blue-400">G</div>
                ) : (
                  <Search className="w-3 h-3 text-slate-400" />
                )}
              </div>
              <span className="truncate flex-1">{tab.title || 'New Tab'}</span>
              {tabs.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded hover:bg-slate-700/80 text-slate-400 hover:text-slate-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => onNewTab('home')}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          title="New Tab"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Quick Studio & Shield Action in Tab Header */}
        <div className="flex items-center space-x-2 pr-2">
          <button
            type="button"
            onClick={onOpenShieldVerifier}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/80 transition-colors shadow-sm"
            title="Verify why your website is NOT indexed by Google & only visible here"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Shield: Protected</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenStudio()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Website</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Bar & Omnibox */}
      <div className="bg-slate-950 px-3 py-2 flex items-center space-x-2 border-t border-slate-800/80">
        <div className="flex items-center space-x-1 text-slate-400">
          <button
            type="button"
            disabled={activeTab?.historyIndex <= 0}
            onClick={() => onBack(activeTab.id)}
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={activeTab?.historyIndex >= activeTab?.history.length - 1}
            onClick={() => onForward(activeTab.id)}
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onReload(activeTab.id)}
            className="p-1.5 rounded-md hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Reload"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate(activeTab.id, 'home')}
            className={`p-1.5 rounded-md hover:bg-slate-800 transition-colors ${
              isHome ? 'text-blue-400 bg-slate-800/60' : 'hover:text-slate-200'
            }`}
            title="Google Home"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Omnibox Input Bar */}
        <div ref={omniboxRef} className="relative flex-1">
          <form onSubmit={handleOmniboxSubmit} className="relative flex items-center">
            <div className="absolute left-3 flex items-center space-x-1.5 text-xs pointer-events-none">
              {isPlatformWeb ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>pweb://</span>
                </div>
              ) : isHome ? (
                <div className="flex items-center gap-1 text-blue-400 font-bold">
                  <span>Google</span>
                </div>
              ) : isSearch ? (
                <Search className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-slate-400" />
              )}
            </div>

            <input
              type="text"
              value={omniboxInput}
              onChange={(e) => {
                setOmniboxInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              placeholder="Search Google or type a web / pweb:// URL..."
              className={`w-full h-9 bg-slate-900 text-slate-100 text-xs rounded-full pl-24 pr-10 border transition-all focus:outline-none ${
                isFocused
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-slate-900'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            />

            {omniboxInput && (
              <button
                type="button"
                onClick={() => {
                  setOmniboxInput('');
                  setShowSuggestions(true);
                }}
                className="absolute right-3 p-1 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Autocomplete / Dropdown Suggestions */}
          {showSuggestions && isFocused && (
            <div className="absolute top-11 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
              {/* Quick Search Option */}
              {omniboxInput.trim() && (
                <div
                  onMouseDown={() => {
                    onNavigate(activeTab.id, `search?q=${encodeURIComponent(omniboxInput.trim())}`);
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-800/80 cursor-pointer text-xs"
                >
                  <Search className="w-4 h-4 text-blue-400" />
                  <div className="flex-1">
                    <span className="text-slate-200">Search Google & PrivateWeb for </span>
                    <strong className="text-blue-400 font-medium">"{omniboxInput}"</strong>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Press Enter</span>
                </div>
              )}

              {/* Platform Sites Matching */}
              <div className="py-1">
                <div className="px-4 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Platform-Exclusive Sites (Private)</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-normal">
                    <Lock className="w-2.5 h-2.5" /> Not on Google
                  </span>
                </div>

                {filteredSuggestions.map((site) => (
                  <div
                    key={site.id}
                    onMouseDown={() => {
                      onNavigate(activeTab.id, site.url);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 flex items-center justify-between hover:bg-slate-800/70 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                        P
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 truncate">
                          {site.title}
                        </div>
                        <div className="text-[11px] text-emerald-400/90 font-mono truncate">{site.url}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {site.category}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Bar */}
              <div className="px-4 py-2 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
                <button
                  type="button"
                  onMouseDown={() => {
                    onOpenRegistry();
                    setShowSuggestions(false);
                  }}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View All {platformSites.length} Platform Sites</span>
                </button>
                <button
                  type="button"
                  onMouseDown={() => {
                    onOpenStudio();
                    setShowSuggestions(false);
                  }}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-medium"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Host Your Website Here</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={onOpenRegistry}
            className="px-2.5 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-800"
            title="Browse all platform websites"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Registry ({platformSites.length})</span>
          </button>
        </div>
      </div>

      {/* 3. Bookmarks / Quick Links Bar */}
      <div className="bg-slate-900/90 px-3 py-1 flex items-center space-x-2 text-[11px] text-slate-400 border-t border-slate-800/40 overflow-x-auto no-scrollbar">
        <span className="flex items-center gap-1 text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-1">
          <Bookmark className="w-3 h-3" /> Shortcuts:
        </span>

        <button
          type="button"
          onClick={() => onNavigate(activeTab.id, 'home')}
          className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors flex items-center gap-1.5"
        >
          <span className="text-blue-400 font-bold">G</span>
          <span>Google Search</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(activeTab.id, 'pweb://ashish-creations')}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
        >
          <Lock className="w-2.5 h-2.5" />
          <span>Ashish Tech Studio</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(activeTab.id, 'pweb://chai-pe-charcha')}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
        >
          <Lock className="w-2.5 h-2.5" />
          <span>Chai Pe Charcha Café</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(activeTab.id, 'pweb://code-vault')}
          className="px-2 py-0.5 rounded hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <Lock className="w-2.5 h-2.5" />
          <span>Developer Cheatsheets</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate(activeTab.id, 'search?q=latest tech news')}
          className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors flex items-center gap-1"
        >
          <Search className="w-2.5 h-2.5 text-blue-400" />
          <span>Trending Tech News</span>
        </button>
      </div>
    </div>
  );
};
