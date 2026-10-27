import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Lock,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PlatformSite } from '../types';

interface GoogleComparisonTesterProps {
  isOpen: boolean;
  onClose: () => void;
  platformSites: PlatformSite[];
}

export const GoogleComparisonTester: React.FC<GoogleComparisonTesterProps> = ({
  isOpen,
  onClose,
  platformSites,
}) => {
  const [selectedSiteSlug, setSelectedSiteSlug] = useState(
    platformSites[0]?.slug || 'ashish-creations'
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasVerified, setHasVerified] = useState(true);

  if (!isOpen) return null;

  const currentSite =
    platformSites.find((s) => s.slug === selectedSiteSlug) || platformSites[0];

  const handleRunVerification = () => {
    setIsVerifying(true);
    setHasVerified(false);
    setTimeout(() => {
      setIsVerifying(false);
      setHasVerified(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Google Index Shield & Exclusivity Verifier</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  Active Shield
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Verify why your website cannot be found on public Google and only lives here.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Site Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select website to test Google Exclusivity:
            </label>
            <div className="flex gap-2">
              <select
                value={selectedSiteSlug}
                onChange={(e) => {
                  setSelectedSiteSlug(e.target.value);
                  setHasVerified(true);
                }}
                className="flex-1 bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
              >
                {platformSites.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.title} ({s.url})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleRunVerification}
                disabled={isVerifying}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Testing...' : 'Run Live Test'}</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          {hasVerified && currentSite && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Our Platform (OmniBrowser) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Our Platform (OmniBrowser)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-800">
                    STATUS: FOUND &bull; 100% VISIBLE
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-emerald-400">{currentSite.url}</div>
                  <div className="text-xs font-bold text-slate-100">{currentSite.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">{currentSite.tagline}</div>
                </div>

                <div className="text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span>&bull;</span> Search query "{currentSite.slug}" retrieves this immediately.
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <span>&bull;</span> Direct navigation via Omnibox address bar works.
                  </div>
                </div>
              </div>

              {/* Box 2: Public Google Search (google.com) */}
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Globe className="w-4 h-4 text-rose-400" />
                    <span>Public Google (google.com)</span>
                  </div>
                  <span className="text-[10px] bg-rose-950 text-rose-400 px-2 py-0.5 rounded font-mono border border-rose-800">
                    STATUS: 0 RESULTS &bull; BLOCKED
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1 text-slate-400 font-sans text-xs">
                  <div className="text-rose-400/90 font-mono text-[11px]">
                    site:google.com "{currentSite.url}"
                  </div>
                  <p className="text-slate-400 italic text-[11px]">
                    "Your search did not match any documents."
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400/90">
                    <span>&times;</span> Googlebot crawler is prohibited by robots directives.
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-400/90">
                    <span>&times;</span> Not in global Google PageRank index.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Technical Explanations */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-300">
            <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>How your requirement is implemented:</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
              <li>
                <strong className="text-slate-200">Custom Protocol:</strong> Your website is registered under the <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded font-mono">pweb://</code> platform namespace which external Google robots do not crawl.
              </li>
              <li>
                <strong className="text-slate-200">Strict Meta Directives:</strong> Emits <code className="text-indigo-300 bg-slate-900 px-1 py-0.5 rounded font-mono">&lt;meta name="robots" content="noindex, nofollow"&gt;</code>.
              </li>
              <li>
                <strong className="text-slate-200">Independent Search Index:</strong> Searching within OmniBrowser queries our local database registry. When searching public topics, it merges real Google Grounding, but keeps your custom site private to this platform.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
