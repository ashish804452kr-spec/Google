import React, { useState } from 'react';
import {
  X,
  Layers,
  Search,
  Lock,
  Eye,
  Heart,
  PlusCircle,
  ArrowRight,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { PlatformSite } from '../types';

interface PlatformRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: PlatformSite[];
  onNavigateToSite: (url: string) => void;
  onNewTab: (url: string) => void;
  onOpenStudio: (siteToEdit?: PlatformSite) => void;
  onDeleteSite: (id: string) => void;
}

export const PlatformRegistryModal: React.FC<PlatformRegistryModalProps> = ({
  isOpen,
  onClose,
  sites,
  onNavigateToSite,
  onNewTab,
  onOpenStudio,
  onDeleteSite,
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!isOpen) return null;

  const categories = ['All', ...Array.from(new Set(sites.map((s) => s.category)))];

  const filtered = sites.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesText =
      !filterText ||
      s.title.toLowerCase().includes(filterText.toLowerCase()) ||
      s.slug.toLowerCase().includes(filterText.toLowerCase()) ||
      s.author.toLowerCase().includes(filterText.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(filterText.toLowerCase()));
    return matchesCat && matchesText;
  });

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>PrivateWeb Platform Directory</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  {sites.length} Active Nodes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Explore websites hosted exclusively on this platform (protected from public search engines).
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStudio();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post New Site</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter by title, author, keyword, or URL slug..."
              className="w-full bg-slate-900 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <p>No platform websites found matching your filter.</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStudio();
                }}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Create one now &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((site) => (
                <div
                  key={site.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono text-emerald-400 text-xs font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{site.url}</span>
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {site.category}
                      </span>
                    </div>

                    <h3
                      onClick={() => {
                        onClose();
                        onNavigateToSite(site.url);
                      }}
                      className="text-base font-semibold text-slate-100 hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {site.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {site.tagline || site.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>{site.views}</span>
                      </span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-3 h-3" />
                        <span>{site.likes}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenStudio(site);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-400 rounded hover:bg-slate-800"
                        title="Edit website"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {site.id !== 'site-1' && (
                        <button
                          type="button"
                          onClick={() => onDeleteSite(site.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                          title="Delete website"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToSite(site.url);
                        }}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 transition-colors"
                      >
                        <span>Visit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
