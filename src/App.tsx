import React, { useState, useEffect, useCallback } from 'react';
import { BrowserChrome } from './components/BrowserChrome';
import { GoogleSearchPage } from './components/GoogleSearchPage';
import { SearchResultsPage } from './components/SearchResultsPage';
import { PlatformWebsiteViewer } from './components/PlatformWebsiteViewer';
import { ExternalWebSandboxViewer } from './components/ExternalWebSandboxViewer';
import { WebsiteStudioModal } from './components/WebsiteStudioModal';
import { PlatformRegistryModal } from './components/PlatformRegistryModal';
import { GoogleComparisonTester } from './components/GoogleComparisonTester';
import { BrowserTab, PlatformSite, SearchResponseData } from './types';

export default function App() {
  const [platformSites, setPlatformSites] = useState<PlatformSite[]>([]);
  const [tabs, setTabs] = useState<BrowserTab[]>([
    {
      id: 'tab-1',
      title: 'Google',
      url: 'home',
      history: ['home'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');

  // Search results cache by query
  const [searchCache, setSearchCache] = useState<Record<string, SearchResponseData>>({});
  const [searchLoading, setSearchLoading] = useState(false);

  // Modals state
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [siteToEdit, setSiteToEdit] = useState<PlatformSite | null>(null);
  const [isRegistryOpen, setIsRegistryOpen] = useState(false);
  const [isShieldVerifierOpen, setIsShieldVerifierOpen] = useState(false);

  // Load platform websites from server
  const fetchSites = useCallback(async () => {
    try {
      const res = await fetch('/api/sites');
      const data = await res.json();
      if (data.success && Array.isArray(data.sites)) {
        setPlatformSites(data.sites);
      }
    } catch (err) {
      console.warn('Could not load platform sites from server:', err);
    }
  }, []);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Helper to execute search
  const executeSearch = useCallback(
    async (query: string, tabId: string) => {
      const cleanQ = query.trim();
      if (!cleanQ) return;

      // Update tab URL
      const searchUrl = `search?q=${encodeURIComponent(cleanQ)}`;
      updateTabNavigation(tabId, searchUrl, `${cleanQ} - Google Search`);

      if (searchCache[cleanQ]) {
        return;
      }

      setSearchLoading(true);
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: cleanQ }),
        });
        const data = await res.json();
        if (data.success) {
          setSearchCache((prev) => ({ ...prev, [cleanQ]: data }));
        }
      } catch (err) {
        console.error('Search request failed:', err);
      } finally {
        setSearchLoading(false);
      }
    },
    [searchCache]
  );

  // Tab navigation functions
  const updateTabNavigation = (tabId: string, newUrl: string, customTitle?: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== tabId) return tab;

        let title = customTitle;
        if (!title) {
          if (newUrl === 'home') title = 'Google';
          else if (newUrl.startsWith('pweb://')) {
            const slug = newUrl.replace('pweb://', '');
            const found = platformSites.find((s) => s.slug === slug);
            title = found ? found.title : newUrl;
          } else if (newUrl.startsWith('search?q=')) {
            title = `${decodeURIComponent(newUrl.replace('search?q=', ''))} - Search`;
          } else {
            try {
              title = new URL(newUrl).hostname;
            } catch {
              title = newUrl;
            }
          }
        }

        const newHistory = tab.history.slice(0, tab.historyIndex + 1);
        newHistory.push(newUrl);

        return {
          ...tab,
          url: newUrl,
          title: title || 'New Tab',
          history: newHistory,
          historyIndex: newHistory.length - 1,
        };
      })
    );
  };

  const handleNavigate = (tabId: string, url: string) => {
    if (url.startsWith('search?q=')) {
      const q = decodeURIComponent(url.replace('search?q=', ''));
      executeSearch(q, tabId);
    } else {
      updateTabNavigation(tabId, url);
    }
  };

  const handleBack = (tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== tabId || tab.historyIndex <= 0) return tab;
        const newIndex = tab.historyIndex - 1;
        const prevUrl = tab.history[newIndex];
        return {
          ...tab,
          url: prevUrl,
          historyIndex: newIndex,
          title: prevUrl === 'home' ? 'Google' : tab.title,
        };
      })
    );
  };

  const handleForward = (tabId: string) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== tabId || tab.historyIndex >= tab.history.length - 1) return tab;
        const newIndex = tab.historyIndex + 1;
        const nextUrl = tab.history[newIndex];
        return {
          ...tab,
          url: nextUrl,
          historyIndex: newIndex,
        };
      })
    );
  };

  const handleReload = (tabId: string) => {
    fetchSites();
    const tab = tabs.find((t) => t.id === tabId);
    if (tab && tab.url.startsWith('search?q=')) {
      const q = decodeURIComponent(tab.url.replace('search?q=', ''));
      executeSearch(q, tabId);
    }
  };

  const handleNewTab = (initialUrl = 'home') => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: initialUrl === 'home' ? 'Google' : 'New Tab',
      url: initialUrl,
      history: [initialUrl],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);

    if (initialUrl.startsWith('search?q=')) {
      const q = decodeURIComponent(initialUrl.replace('search?q=', ''));
      executeSearch(q, newId);
    }
  };

  const handleCloseTab = (idToClose: string) => {
    if (tabs.length === 1) {
      // Don't close last tab, just reset to home
      setTabs([
        {
          id: 'tab-1',
          title: 'Google',
          url: 'home',
          history: ['home'],
          historyIndex: 0,
        },
      ]);
      setActiveTabId('tab-1');
      return;
    }

    const filtered = tabs.filter((t) => t.id !== idToClose);
    setTabs(filtered);

    if (activeTabId === idToClose) {
      setActiveTabId(filtered[filtered.length - 1].id);
    }
  };

  // Website publish handler
  const handleSitePublished = (newSite: PlatformSite) => {
    setPlatformSites((prev) => {
      const existsIndex = prev.findIndex((s) => s.id === newSite.id || s.slug === newSite.slug);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newSite;
        return copy;
      }
      return [newSite, ...prev];
    });

    // Automatically navigate the active tab to the new website!
    updateTabNavigation(activeTab.id, newSite.url, newSite.title);
  };

  // Delete site
  const handleDeleteSite = async (id: string) => {
    try {
      await fetch(`/api/sites/${id}`, { method: 'DELETE' });
      setPlatformSites((prev) => prev.filter((s) => s.id !== id && s.slug !== id));
    } catch (e) {
      console.warn('Failed to delete site:', e);
    }
  };

  // Open Studio modal
  const handleOpenStudio = (site?: PlatformSite) => {
    setSiteToEdit(site || null);
    setIsStudioOpen(true);
  };

  // Render tab content
  const renderTabContent = () => {
    if (!activeTab) return null;

    if (activeTab.url === 'home') {
      return (
        <GoogleSearchPage
          onSearch={(q) => executeSearch(q, activeTab.id)}
          onNavigateToSite={(url) => updateTabNavigation(activeTab.id, url)}
          onOpenStudio={() => handleOpenStudio()}
          onOpenRegistry={() => setIsRegistryOpen(true)}
          onOpenShieldVerifier={() => setIsShieldVerifierOpen(true)}
          platformSites={platformSites}
        />
      );
    }

    if (activeTab.url.startsWith('search?q=')) {
      const q = decodeURIComponent(activeTab.url.replace('search?q=', ''));
      const cached = searchCache[q] || null;

      return (
        <SearchResultsPage
          query={q}
          data={cached}
          loading={searchLoading && !cached}
          onSearch={(newQ) => executeSearch(newQ, activeTab.id)}
          onNavigateToSite={(url) => updateTabNavigation(activeTab.id, url)}
          onNewTab={(url) => handleNewTab(url)}
          onOpenStudio={() => handleOpenStudio()}
          onOpenShieldVerifier={() => setIsShieldVerifierOpen(true)}
        />
      );
    }

    if (activeTab.url.startsWith('pweb://')) {
      const slug = activeTab.url.replace('pweb://', '');
      const site = platformSites.find(
        (s) => s.slug.toLowerCase() === slug.toLowerCase() || s.id === slug
      );

      if (site) {
        return (
          <PlatformWebsiteViewer
            site={site}
            onEditSite={(s) => handleOpenStudio(s)}
            onOpenShieldVerifier={() => setIsShieldVerifierOpen(true)}
            onBack={() => handleBack(activeTab.id)}
          />
        );
      }

      // If site not found
      return (
        <div className="min-h-full flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-300">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 mx-auto text-xl font-bold">
              404
            </div>
            <h2 className="text-lg font-bold text-white">Platform Site Not Found</h2>
            <p className="text-xs text-slate-400 font-mono">{activeTab.url}</p>
            <p className="text-xs text-slate-400">
              No website is registered with this slug on the PrivateWeb network yet. Would you like to create it?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => updateTabNavigation(activeTab.id, 'home')}
                className="flex-1 py-2 px-3 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Go Home
              </button>
              <button
                type="button"
                onClick={() => handleOpenStudio()}
                className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                Publish This Site
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Otherwise external web address
    return (
      <ExternalWebSandboxViewer
        url={activeTab.url}
        onBack={() => handleBack(activeTab.id)}
      />
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Browser Frame */}
      <BrowserChrome
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={(id) => setActiveTabId(id)}
        onCloseTab={handleCloseTab}
        onNewTab={handleNewTab}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onOpenStudio={handleOpenStudio}
        onOpenRegistry={() => setIsRegistryOpen(true)}
        onOpenShieldVerifier={() => setIsShieldVerifierOpen(true)}
        platformSites={platformSites}
      />

      {/* Main Viewport Content */}
      <div className="flex-1 overflow-y-auto relative bg-slate-950">{renderTabContent()}</div>

      {/* Website Creator Studio Modal */}
      <WebsiteStudioModal
        isOpen={isStudioOpen}
        onClose={() => {
          setIsStudioOpen(false);
          setSiteToEdit(null);
        }}
        onSitePublished={handleSitePublished}
        siteToEdit={siteToEdit}
      />

      {/* Platform Registry Modal */}
      <PlatformRegistryModal
        isOpen={isRegistryOpen}
        onClose={() => setIsRegistryOpen(false)}
        sites={platformSites}
        onNavigateToSite={(url) => updateTabNavigation(activeTab.id, url)}
        onNewTab={(url) => handleNewTab(url)}
        onOpenStudio={(s) => handleOpenStudio(s)}
        onDeleteSite={handleDeleteSite}
      />

      {/* Google Comparison & Shield Verifier Modal */}
      <GoogleComparisonTester
        isOpen={isShieldVerifierOpen}
        onClose={() => setIsShieldVerifierOpen(false)}
        platformSites={platformSites}
      />
    </div>
  );
}
