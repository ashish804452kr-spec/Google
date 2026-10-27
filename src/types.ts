export interface PlatformSiteSectionItem {
  name: string;
  desc: string;
  badge?: string;
  link?: string;
}

export interface PlatformSiteSection {
  title: string;
  items: PlatformSiteSectionItem[];
}

export interface PlatformSiteContent {
  heroHeadline: string;
  heroSubheadline?: string;
  about?: string;
  sections?: PlatformSiteSection[];
  contactEmail?: string;
  status?: string;
  customHtml?: string;
  accentColor?: string;
}

export interface PlatformSite {
  id: string;
  slug: string;
  url: string; // pweb://slug
  title: string;
  tagline: string;
  description: string;
  category: string;
  author: string;
  authorEmail?: string;
  tags: string[];
  theme: 'indigo' | 'amber' | 'emerald' | 'cyan' | 'purple' | 'rose' | 'slate';
  isPrivate: boolean;
  robotsMeta?: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt?: string;
  content: PlatformSiteContent;
}

export interface GoogleWebItem {
  title: string;
  uri: string;
  domain?: string;
  snippet?: string;
}

export interface SearchResponseData {
  success: boolean;
  query: string;
  filter: 'all' | 'platform' | 'google';
  platformResults: PlatformSite[];
  googleResults: GoogleWebItem[];
  overview?: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string; // 'home' | 'search?q=...' | 'pweb://...' | 'https://...' | 'studio' | 'registry'
  favicon?: string;
  history: string[];
  historyIndex: number;
}
