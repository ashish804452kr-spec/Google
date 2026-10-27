import React, { useState, useEffect } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Lock,
  ShieldCheck,
  Save,
  Trash2,
  Plus,
  Layers,
  Palette,
  Eye,
  CheckCircle2,
  Wand2,
  RefreshCw,
  Code
} from 'lucide-react';
import { PlatformSite, PlatformSiteSection } from '../types';
import { THEME_CONFIGS } from '../utils/theme';

interface WebsiteStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSitePublished: (newSite: PlatformSite) => void;
  siteToEdit?: PlatformSite | null;
}

export const WebsiteStudioModal: React.FC<WebsiteStudioModalProps> = ({
  isOpen,
  onClose,
  onSitePublished,
  siteToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Portfolio & Tech');
  const [author, setAuthor] = useState('Ashish Kumar');
  const [authorEmail, setAuthorEmail] = useState('ashish804452kr@gmail.com');
  const [tagsInput, setTagsInput] = useState('');
  const [theme, setTheme] = useState<PlatformSite['theme']>('indigo');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [aboutText, setAboutText] = useState('');
  const [sections, setSections] = useState<PlatformSiteSection[]>([]);
  const [customHtml, setCustomHtml] = useState('');
  const [statusBadge, setStatusBadge] = useState('Online & Active');

  // AI Assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'ai' | 'preview'>('editor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load existing site if editing
  useEffect(() => {
    if (siteToEdit) {
      setTitle(siteToEdit.title || '');
      setSlug(siteToEdit.slug || '');
      setTagline(siteToEdit.tagline || '');
      setDescription(siteToEdit.description || '');
      setCategory(siteToEdit.category || 'Portfolio & Tech');
      setAuthor(siteToEdit.author || 'Ashish Kumar');
      setAuthorEmail(siteToEdit.authorEmail || '');
      setTagsInput((siteToEdit.tags || []).join(', '));
      setTheme(siteToEdit.theme || 'indigo');
      setHeroHeadline(siteToEdit.content?.heroHeadline || siteToEdit.title || '');
      setHeroSubheadline(siteToEdit.content?.heroSubheadline || siteToEdit.tagline || '');
      setAboutText(siteToEdit.content?.about || '');
      setSections(siteToEdit.content?.sections || []);
      setCustomHtml(siteToEdit.content?.customHtml || '');
      setStatusBadge(siteToEdit.content?.status || 'Online');
    } else {
      // Defaults for brand new website
      setTitle('');
      setSlug('');
      setTagline('');
      setDescription('');
      setCategory('Portfolio & Tech');
      setAuthor('Ashish Kumar');
      setAuthorEmail('ashish804452kr@gmail.com');
      setTagsInput('tech, portfolio, projects');
      setTheme('indigo');
      setHeroHeadline('');
      setHeroSubheadline('');
      setAboutText('');
      setSections([
        {
          title: 'Featured Works',
          items: [
            { name: 'Project Alpha', desc: 'Custom web application hosted on private platform.' },
            { name: 'Project Beta', desc: 'Interactive tools and experiments.' }
          ]
        }
      ]);
      setCustomHtml('');
      setStatusBadge('Online & Active');
    }
  }, [siteToEdit, isOpen]);

  // Auto-generate slug when typing title (if not editing)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!siteToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
      if (!heroHeadline) setHeroHeadline(val);
    }
  };

  // Add section
  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        title: 'New Section',
        items: [{ name: 'Item 1', desc: 'Description of this item' }],
      },
    ]);
  };

  const handleUpdateSectionTitle = (index: number, newTitle: string) => {
    const updated = [...sections];
    updated[index].title = newTitle;
    setSections(updated);
  };

  const handleAddItemToSection = (sectionIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].items.push({ name: 'New Item', desc: 'Add details here' });
    setSections(updated);
  };

  const handleUpdateItem = (sectionIndex: number, itemIndex: number, field: 'name' | 'desc', val: string) => {
    const updated = [...sections];
    updated[sectionIndex].items[itemIndex][field] = val;
    setSections(updated);
  };

  const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...sections];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setSections(updated);
  };

  const handleRemoveSection = (sectionIndex: number) => {
    const updated = [...sections];
    updated.splice(sectionIndex, 1);
    setSections(updated);
  };

  // Handle AI Auto-generation
  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/ai-generate-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });
      const data = await res.json();
      if (data.success && data.site) {
        const s = data.site;
        if (s.title) setTitle(s.title);
        if (s.slug) setSlug(s.slug);
        if (s.tagline) setTagline(s.tagline);
        if (s.description) setDescription(s.description);
        if (s.category) setCategory(s.category);
        if (s.theme) setTheme(s.theme);
        if (s.tags) setTagsInput(Array.isArray(s.tags) ? s.tags.join(', ') : s.tags);
        if (s.content?.heroHeadline) setHeroHeadline(s.content.heroHeadline);
        if (s.content?.heroSubheadline) setHeroSubheadline(s.content.heroSubheadline);
        if (s.content?.about) setAboutText(s.content.about);
        if (s.content?.sections) setSections(s.content.sections);
        if (s.content?.status) setStatusBadge(s.content.status);
        setActiveTab('editor');
      } else {
        setErrorMsg(data.message || 'AI generation failed');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error communicating with AI service');
    } finally {
      setAiLoading(false);
    }
  };

  // Handle Publish
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setErrorMsg('Please enter a website title and URL slug.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      id: siteToEdit?.id,
      title: title.trim(),
      slug: slug.trim(),
      tagline: tagline.trim() || title.trim(),
      description: description.trim() || tagline.trim() || title.trim(),
      category,
      author: author.trim() || 'Anonymous',
      authorEmail: authorEmail.trim(),
      tags: tagsArray,
      theme,
      content: {
        heroHeadline: heroHeadline.trim() || title.trim(),
        heroSubheadline: heroSubheadline.trim() || tagline.trim(),
        about: aboutText.trim(),
        sections,
        customHtml: customHtml.trim(),
        contactEmail: authorEmail.trim(),
        status: statusBadge.trim(),
      },
    };

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.site) {
        onSitePublished(data.site);
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to publish site.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Network error publishing site.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{siteToEdit ? 'Edit Platform Website' : 'Post Your Custom Website'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                  Platform-Only &bull; No Google Index
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Visible only on OmniBrowser. Does not appear on public Google search.
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

        {/* Studio Sub-nav / Mode Tabs */}
        <div className="px-6 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Builder</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Auto-Generate</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <Lock className="w-3 h-3" />
            <span>Target: pweb://{slug || 'your-slug'}</span>
          </div>
        </div>

        {/* Error message if any */}
        {errorMsg && (
          <div className="mx-6 mt-3 p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'ai' && (
            <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-4">
              <div className="flex items-start gap-3">
                <Wand2 className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-white">AI Website Designer</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Describe what website you want to create (in Hindi or English). Gemini will auto-generate headlines, sections, theme, and keywords!
                  </p>
                </div>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Mere liye ek Cyberpunk Coding Studio ka website banao jisme AI tools, game demos aur Ashish ke projects ho with cyan theme..."
                rows={4}
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={aiLoading || !aiPrompt.trim()}
                  onClick={handleAiGenerate}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {aiLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>{aiLoading ? 'Designing Website...' : 'Generate & Fill Builder'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <form onSubmit={handlePublish} className="space-y-6">
              {/* 1. Core Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Website Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Ashish Tech Studio"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Platform URL Slug (pweb://...) *
                  </label>
                  <div className="flex items-center">
                    <span className="px-2.5 py-2 rounded-l-lg bg-slate-800 text-emerald-400 font-mono text-xs border border-r-0 border-slate-700">
                      pweb://
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                      placeholder="ashish-studio"
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-r-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline / One-liner
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Full-stack development, modern apps & experiments"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Portfolio & Tech">Portfolio & Tech</option>
                    <option value="Food & Cafes">Food & Cafes</option>
                    <option value="Gaming & Art">Gaming & Art</option>
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Travel & Nature">Travel & Nature</option>
                    <option value="Business & Store">Business & Store</option>
                    <option value="Blog & Notes">Blog & Notes</option>
                  </select>
                </div>
              </div>

              {/* 2. Theme Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  <span>Website Visual Theme</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {Object.entries(THEME_CONFIGS).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key as any)}
                      className={`p-2 rounded-xl text-center border text-xs font-medium transition-all ${
                        theme === key
                          ? 'border-blue-400 bg-slate-800 ring-2 ring-blue-500/30 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`w-full h-3 rounded-md ${cfg.accent} mb-1`} />
                      <span className="truncate block text-[11px]">{cfg.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Hero & About */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Page Content
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hero Main Headline</label>
                    <input
                      type="text"
                      value={heroHeadline}
                      onChange={(e) => setHeroHeadline(e.target.value)}
                      placeholder="Welcome to our platform showcase"
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Status Badge / Availability</label>
                    <input
                      type="text"
                      value={statusBadge}
                      onChange={(e) => setStatusBadge(e.target.value)}
                      placeholder="e.g. Taking freelance inquiries / Open daily"
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">About the Website / Creator</label>
                  <textarea
                    rows={3}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Tell visitors about yourself, your company, menu, or projects..."
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-3 border border-slate-700"
                  />
                </div>
              </div>

              {/* 4. Dynamic Sections & Items */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Content Sections ({sections.length})
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-2.5 py-1 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {sections.map((sec, secIdx) => (
                  <div key={secIdx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => handleUpdateSectionTitle(secIdx, e.target.value)}
                        placeholder="Section Title (e.g. Featured Projects / Specials / Menu)"
                        className="bg-slate-900 text-slate-100 text-xs font-bold rounded px-2.5 py-1.5 border border-slate-700 flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(secIdx)}
                        className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                        title="Remove Section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 pl-2">
                      {sec.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(secIdx, itemIdx, 'name', e.target.value)}
                            placeholder="Item Name (e.g. Masala Chai or Portfolio App)"
                            className="w-1/3 bg-slate-900 text-slate-100 text-xs rounded px-2 py-1 border border-slate-800"
                          />
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => handleUpdateItem(secIdx, itemIdx, 'desc', e.target.value)}
                            placeholder="Description or pricing"
                            className="flex-1 bg-slate-900 text-slate-100 text-xs rounded px-2 py-1 border border-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(secIdx, itemIdx)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => handleAddItemToSection(secIdx)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add item to this section</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. Custom Code / Advanced HTML */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-slate-400" />
                  <span>Optional Custom HTML / Embeds</span>
                </label>
                <textarea
                  rows={2}
                  value={customHtml}
                  onChange={(e) => setCustomHtml(e.target.value)}
                  placeholder="<div>Custom HTML content here...</div>"
                  className="w-full bg-slate-950 font-mono text-[11px] text-slate-300 rounded-lg p-2.5 border border-slate-800"
                />
              </div>

              {/* 6. Author info & Search Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ashish Kumar"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Author Email</label>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="ashish@example.com"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Search Keywords (comma separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tech, games, design"
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700"
                  />
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Guaranteed: No index on public Google</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Publishing...' : 'Publish to PrivateWeb'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
