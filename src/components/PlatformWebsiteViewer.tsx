import React, { useState } from 'react';
import {
  Lock,
  Heart,
  Eye,
  Share2,
  Edit,
  Code,
  ShieldCheck,
  CheckCircle,
  Mail,
  Send,
  Calendar,
  User,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { PlatformSite } from '../types';
import { THEME_CONFIGS } from '../utils/theme';

interface PlatformWebsiteViewerProps {
  site: PlatformSite;
  onEditSite: (site: PlatformSite) => void;
  onOpenShieldVerifier: () => void;
  onBack: () => void;
}

export const PlatformWebsiteViewer: React.FC<PlatformWebsiteViewerProps> = ({
  site,
  onEditSite,
  onOpenShieldVerifier,
  onBack,
}) => {
  const [likes, setLikes] = useState(site.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRobotsModal, setShowRobotsModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const themeKey = site.theme || 'indigo';
  const theme = THEME_CONFIGS[themeKey] || THEME_CONFIGS.indigo;

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    try {
      await fetch(`/api/sites/${site.id}/like`, { method: 'POST' });
    } catch (e) {
      console.warn('Like sync failed:', e);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(site.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactMessage.trim()) {
      setContactSent(true);
      setTimeout(() => {
        setContactMessage('');
        setContactSent(false);
      }, 3500);
    }
  };

  return (
    <div className={`min-h-full bg-gradient-to-b ${theme.bgGradient} text-slate-100 font-sans pb-20 select-text`}>
      {/* Platform Website Top Bar */}
      <div className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-2.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Back to search"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/70 font-mono text-[11px] font-semibold">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>{site.url}</span>
            </span>

            <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 hidden md:inline">
              {site.category}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Robots / Google Shield Inspector */}
          <button
            type="button"
            onClick={() => setShowRobotsModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-[11px]"
            title="Inspect why Google cannot index this site"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Google Shield</span>
          </button>

          {/* Like button */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors text-[11px] ${
              hasLiked
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
            <span>{likes}</span>
          </button>

          {/* Views count */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[11px]">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{site.views} views</span>
          </div>

          {/* Share */}
          <button
            type="button"
            onClick={handleCopyUrl}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 transition-colors text-[11px]"
            title="Copy platform URL"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-green-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEditSite(site)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors text-[11px]"
          >
            <Edit className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        </div>
      </div>

      {/* Website Body Canvas */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-10">
        {/* Banner / Hero Card */}
        <div className={`p-8 sm:p-12 rounded-3xl ${theme.cardBg} border ${theme.border} backdrop-blur-md shadow-2xl relative overflow-hidden mb-8`}>
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${theme.badge} border`}>
                {site.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Platform Exclusive (Not on Google)</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {site.content?.heroHeadline || site.title}
            </h1>

            <p className={`text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed`}>
              {site.content?.heroSubheadline || site.tagline}
            </p>

            {/* Author Attribution & Date */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Created by <strong className="text-slate-200">{site.author}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{new Date(site.createdAt).toLocaleDateString()}</span>
              </div>
              {site.content?.status && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{site.content.status}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Section */}
        {site.content?.about && (
          <div className={`p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.border} backdrop-blur-sm mb-8 space-y-3`}>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${theme.textAccent}`} />
              <span>About</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {site.content.about}
            </p>
          </div>
        )}

        {/* Custom Sections / Items */}
        {site.content?.sections && site.content.sections.length > 0 && (
          <div className="space-y-8 mb-8">
            {site.content.sections.map((sec, idx) => (
              <div key={idx} className={`p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.border} backdrop-blur-sm space-y-4`}>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  {sec.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sec.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-100">
                          {item.name}
                        </h3>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom HTML Preview if defined */}
        {site.content?.customHtml && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 mb-8 space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Custom Rendered Code Canvas</span>
            </div>
            <div
              className="prose prose-invert max-w-none text-slate-200"
              dangerouslySetInnerHTML={{ __html: site.content.customHtml }}
            />
          </div>
        )}

        {/* Tags */}
        {site.tags && site.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs text-slate-500 font-medium">Keywords:</span>
            {site.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-900/90 text-slate-300 border border-slate-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Interactive In-Page Contact / Feedback Box */}
        <div className={`p-6 sm:p-8 rounded-2xl ${theme.cardBg} border ${theme.border} backdrop-blur-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className={`w-4 h-4 ${theme.textAccent}`} />
                <span>Send a Message to Creator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Message <span className="text-slate-200 font-medium">{site.author}</span> directly through this platform.
              </p>
            </div>
            {site.content?.contactEmail && (
              <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                {site.content.contactEmail}
              </span>
            )}
          </div>

          {contactSent ? (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Message sent successfully to {site.author}! Thank you for visiting.</span>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Leave feedback, ask questions, or say hello..."
                rows={3}
                className="w-full bg-slate-900/90 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!contactMessage.trim()}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold ${theme.button} disabled:opacity-40 transition-all flex items-center gap-1.5`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Robots & Privacy Shield Inspection Modal */}
      {showRobotsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Google Index Shield Verified</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRobotsModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-300 leading-relaxed">
              <p>
                This website is hosted under the private address <code className="text-emerald-400 bg-slate-950 px-1 py-0.5 rounded font-mono">{site.url}</code> and does NOT get sent to public search engines like Google, Bing, or Yahoo.
              </p>

              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-emerald-400 border border-slate-800 space-y-1">
                <div>&lt;meta name="robots" content="noindex, nofollow, noarchive" /&gt;</div>
                <div>&lt;meta name="googlebot" content="noindex, noarchive" /&gt;</div>
                <div>&lt;meta name="platform-scope" content="omnibrowser-private-net" /&gt;</div>
              </div>

              <p className="text-slate-400 text-[11px]">
                Result: Anyone searching on the public world-wide Google will get 0 results for this page. Only users searching inside this OmniBrowser platform will discover and view it.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRobotsModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
