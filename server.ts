import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Data persistence path
const SITES_FILE = path.join(__dirname, 'data', 'sites.json');

function getStoredSites(): any[] {
  try {
    if (fs.existsSync(SITES_FILE)) {
      const data = fs.readFileSync(SITES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading sites data:', err);
  }
  return [];
}

function saveStoredSites(sites: any[]) {
  try {
    const dir = path.dirname(SITES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing sites data:', err);
  }
}

// GET /api/sites - Retrieve all platform-exclusive websites
app.get('/api/sites', (_req: Request, res: Response) => {
  const sites = getStoredSites();
  res.json({ success: true, sites });
});

// GET /api/sites/:slug - Retrieve a specific site by slug or url
app.get('/api/sites/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug.toLowerCase().replace(/^pweb:\/\//, '');
  const sites = getStoredSites();
  const site = sites.find(
    (s: any) =>
      s.slug.toLowerCase() === slug ||
      s.id === slug ||
      s.url.toLowerCase() === `pweb://${slug}`
  );

  if (!site) {
    return res.status(404).json({ success: false, message: 'Website not found on PrivateWeb' });
  }

  // Increment view count
  site.views = (site.views || 0) + 1;
  saveStoredSites(sites);

  res.json({ success: true, site });
});

// POST /api/sites - Create or update a website on the platform
app.post('/api/sites', (req: Request, res: Response) => {
  try {
    const siteData = req.body;
    if (!siteData.title || !siteData.slug) {
      return res.status(400).json({ success: false, message: 'Title and Slug/URL are required' });
    }

    const cleanSlug = siteData.slug
      .toLowerCase()
      .replace(/^pweb:\/\//, '')
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-');

    const sites = getStoredSites();
    const existingIndex = sites.findIndex(
      (s: any) => s.slug.toLowerCase() === cleanSlug || (siteData.id && s.id === siteData.id)
    );

    const fullSite = {
      id: siteData.id || `site-${Date.now()}`,
      slug: cleanSlug,
      url: `pweb://${cleanSlug}`,
      title: siteData.title,
      tagline: siteData.tagline || '',
      description: siteData.description || '',
      category: siteData.category || 'General',
      author: siteData.author || 'Anonymous Creator',
      authorEmail: siteData.authorEmail || '',
      tags: Array.isArray(siteData.tags) ? siteData.tags : (siteData.tags || '').split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean),
      theme: siteData.theme || 'indigo',
      isPrivate: true,
      robotsMeta: 'noindex, nofollow, noarchive',
      views: existingIndex >= 0 ? sites[existingIndex].views || 1 : 1,
      likes: existingIndex >= 0 ? sites[existingIndex].likes || 0 : 0,
      createdAt: existingIndex >= 0 ? sites[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: siteData.content || {
        heroHeadline: siteData.title,
        heroSubheadline: siteData.tagline || '',
        about: siteData.description || '',
        sections: [],
        contactEmail: siteData.authorEmail || ''
      }
    };

    if (existingIndex >= 0) {
      sites[existingIndex] = fullSite;
    } else {
      sites.unshift(fullSite);
    }

    saveStoredSites(sites);
    res.json({ success: true, site: fullSite, message: 'Website published to PrivateWeb successfully!' });
  } catch (err: any) {
    console.error('Error publishing site:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to save site' });
  }
});

// DELETE /api/sites/:id - Delete a platform website
app.delete('/api/sites/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const sites = getStoredSites();
    const filtered = sites.filter((s: any) => s.id !== id && s.slug !== id);
    saveStoredSites(filtered);
    res.json({ success: true, message: 'Site removed from platform' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error deleting site' });
  }
});

// POST /api/sites/:id/like - Like a platform website
app.post('/api/sites/:id/like', (req: Request, res: Response) => {
  const id = req.params.id;
  const sites = getStoredSites();
  const site = sites.find((s: any) => s.id === id || s.slug === id);
  if (site) {
    site.likes = (site.likes || 0) + 1;
    saveStoredSites(sites);
    return res.json({ success: true, likes: site.likes });
  }
  res.status(404).json({ success: false, message: 'Site not found' });
});

// Search scoring helper for local platform sites
function searchPlatformSites(query: string, sites: any[]) {
  const q = query.toLowerCase().trim();
  const queryTerms = q.split(/\s+/).filter(Boolean);

  if (!queryTerms.length) return [];

  const scored = sites.map((site) => {
    let score = 0;
    const title = (site.title || '').toLowerCase();
    const tagline = (site.tagline || '').toLowerCase();
    const desc = (site.description || '').toLowerCase();
    const slug = (site.slug || '').toLowerCase();
    const author = (site.author || '').toLowerCase();
    const tags = (site.tags || []).map((t: string) => t.toLowerCase());
    const contentStr = JSON.stringify(site.content || {}).toLowerCase();

    // Exact phrase match
    if (title.includes(q)) score += 50;
    if (slug.includes(q)) score += 40;
    if (tagline.includes(q)) score += 30;
    if (tags.some((t: string) => t === q)) score += 35;
    if (desc.includes(q)) score += 20;

    // Term-by-term match
    for (const term of queryTerms) {
      if (title.includes(term)) score += 15;
      if (slug.includes(term)) score += 12;
      if (tags.some((t: string) => t.includes(term))) score += 12;
      if (tagline.includes(term)) score += 8;
      if (desc.includes(term)) score += 6;
      if (author.includes(term)) score += 6;
      if (contentStr.includes(term)) score += 4;
    }

    return { site, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.site);
}

// POST /api/search - Live Google Grounding Search + Local Platform Search
app.post('/api/search', async (req: Request, res: Response) => {
  const { query, filter = 'all' } = req.body;
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  const cleanQuery = query.trim();
  const allPlatformSites = getStoredSites();
  const matchedPlatformSites = searchPlatformSites(cleanQuery, allPlatformSites);

  // If user specifically requested ONLY platform sites
  if (filter === 'platform') {
    return res.json({
      success: true,
      query: cleanQuery,
      filter,
      platformResults: matchedPlatformSites,
      googleResults: [],
      overview: matchedPlatformSites.length
        ? `Found ${matchedPlatformSites.length} platform-exclusive website(s) matching "${cleanQuery}". Note: These websites are hosted strictly on this platform and do not appear on public Google.`
        : `No private platform websites found matching "${cleanQuery}". Try publishing one or switch to 'All' or 'Google Web'.`,
    });
  }

  let googleResults: Array<{ title: string; uri: string; snippet?: string; domain?: string }> = [];
  let aiOverview: string = '';

  // Attempt Google Grounding using Gemini 3.8 Flash
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are the Google Web Search engine engine. For the search query: "${cleanQuery}", provide an accurate, helpful, and concise Google Overview answer summary with relevant web facts. Keep formatting clean with clear paragraphs or bullets if relevant.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      aiOverview = response.text || '';

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && Array.isArray(chunks)) {
        googleResults = chunks
          .filter((c: any) => c.web?.uri)
          .map((c: any) => {
            const uri = c.web.uri;
            let domain = '';
            try {
              domain = new URL(uri).hostname.replace('www.', '');
            } catch {
              domain = 'web';
            }
            return {
              title: c.web.title || `${domain} - ${cleanQuery}`,
              uri: uri,
              domain: domain,
              snippet: `Live Google Grounded result for "${cleanQuery}". Source: ${domain}`,
            };
          });
      }
    } catch (err: any) {
      console.warn('Gemini Search Grounding notice:', err.message);
    }
  }

  // If no Google grounded chunks came back (e.g. offline, rate limit, or broad topic), provide rich fallback search results
  if (googleResults.length === 0) {
    const safeQ = encodeURIComponent(cleanQuery);
    googleResults = [
      {
        title: `${cleanQuery} - Comprehensive Encyclopedia & Reference`,
        uri: `https://en.wikipedia.org/wiki/Special:Search?search=${safeQ}`,
        domain: 'en.wikipedia.org',
        snippet: `Explore articles, history, technical details, and encyclopedic knowledge regarding ${cleanQuery}.`,
      },
      {
        title: `Latest News and Live Updates: ${cleanQuery}`,
        uri: `https://news.google.com/search?q=${safeQ}`,
        domain: 'news.google.com',
        snippet: `Breaking headlines, trending developments, and editorial coverage about ${cleanQuery}.`,
      },
      {
        title: `Official Guides, Documentation & Community on ${cleanQuery}`,
        uri: `https://github.com/search?q=${safeQ}`,
        domain: 'github.com',
        snippet: `Open source codebases, repositories, and developer discussions related to ${cleanQuery}.`,
      },
      {
        title: `Explore Media, Videos and Demonstrations for ${cleanQuery}`,
        uri: `https://www.youtube.com/results?search_query=${safeQ}`,
        domain: 'youtube.com',
        snippet: `Watch educational videos, walkthroughs, reviews, and high-definition guides on ${cleanQuery}.`,
      },
    ];

    if (!aiOverview) {
      aiOverview = `Searching Google and the World Wide Web for "${cleanQuery}". Browse the grounded web resources below or explore private platform-exclusive websites created by users.`;
    }
  }

  res.json({
    success: true,
    query: cleanQuery,
    filter,
    platformResults: filter === 'google' ? [] : matchedPlatformSites,
    googleResults: filter === 'platform' ? [] : googleResults,
    overview: aiOverview,
  });
});

// POST /api/ai-generate-site - Assist user with crafting a website template using Gemini
app.post('/api/ai-generate-site', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ success: false, message: 'Prompt required' });

  if (!ai) {
    return res.json({
      success: true,
      site: {
        title: 'My Custom Web Project',
        slug: 'my-project-' + Math.floor(Math.random() * 1000),
        tagline: 'Crafted with precision on PrivateWeb Engine',
        description: prompt,
        category: 'Personal',
        theme: 'indigo',
        content: {
          heroHeadline: 'Welcome to My Private Website',
          heroSubheadline: prompt,
          about: 'This is an exclusive site hosted inside the OmniBrowser network. It is not indexable on public search engines.',
          sections: [
            {
              title: 'Highlights',
              items: [
                { name: 'Feature One', desc: 'Custom tailored design.' },
                { name: 'Feature Two', desc: 'Securely visible only on this browser platform.' }
              ]
            }
          ]
        }
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a structured JSON for a custom website based on this request: "${prompt}".
The response must be valid JSON strictly matching this schema:
{
  "title": string,
  "slug": string (lowercase, hyphenated, no spaces),
  "tagline": string,
  "description": string,
  "category": string (e.g. "Tech & Coding", "Food & Cafes", "Portfolio & Tech", "Gaming & Art", "Business", "Blog"),
  "theme": string ("indigo" | "amber" | "emerald" | "cyan" | "purple" | "rose"),
  "tags": string[],
  "content": {
    "heroHeadline": string,
    "heroSubheadline": string,
    "about": string,
    "sections": [
      {
        "title": string,
        "items": [
          { "name": string, "desc": string }
        ]
      }
    ],
    "status": string
  }
}
Return only pure JSON, no markdown backticks, no extra text.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, site: parsed });
  } catch (err: any) {
    console.error('AI site generator error:', err);
    res.status(500).json({ success: false, message: 'Could not generate site via AI' });
  }
});

// Production / Dev handling
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
