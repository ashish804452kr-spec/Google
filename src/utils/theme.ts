export const THEME_CONFIGS: Record<
  string,
  {
    name: string;
    bgGradient: string;
    cardBg: string;
    border: string;
    accent: string;
    badge: string;
    button: string;
    textAccent: string;
    ring: string;
  }
> = {
  indigo: {
    name: 'Neo Indigo',
    bgGradient: 'from-slate-950 via-indigo-950/40 to-slate-900',
    cardBg: 'bg-indigo-950/20',
    border: 'border-indigo-500/20',
    accent: 'bg-indigo-600',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25',
    textAccent: 'text-indigo-400',
    ring: 'focus:ring-indigo-500',
  },
  amber: {
    name: 'Warm Amber / Chai',
    bgGradient: 'from-neutral-950 via-amber-950/30 to-stone-900',
    cardBg: 'bg-amber-950/20',
    border: 'border-amber-500/20',
    accent: 'bg-amber-600',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    button: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/25',
    textAccent: 'text-amber-400',
    ring: 'focus:ring-amber-500',
  },
  emerald: {
    name: 'Emerald Gaming',
    bgGradient: 'from-zinc-950 via-emerald-950/30 to-slate-950',
    cardBg: 'bg-emerald-950/20',
    border: 'border-emerald-500/20',
    accent: 'bg-emerald-600',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25',
    textAccent: 'text-emerald-400',
    ring: 'focus:ring-emerald-500',
  },
  cyan: {
    name: 'Cyber Cyan',
    bgGradient: 'from-gray-950 via-cyan-950/30 to-slate-950',
    cardBg: 'bg-cyan-950/20',
    border: 'border-cyan-500/20',
    accent: 'bg-cyan-600',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    button: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-500/25',
    textAccent: 'text-cyan-400',
    ring: 'focus:ring-cyan-500',
  },
  purple: {
    name: 'Royal Purple',
    bgGradient: 'from-slate-950 via-purple-950/30 to-neutral-950',
    cardBg: 'bg-purple-950/20',
    border: 'border-purple-500/20',
    accent: 'bg-purple-600',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    button: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25',
    textAccent: 'text-purple-400',
    ring: 'focus:ring-purple-500',
  },
  rose: {
    name: 'Sunset Rose',
    bgGradient: 'from-zinc-950 via-rose-950/30 to-neutral-950',
    cardBg: 'bg-rose-950/20',
    border: 'border-rose-500/20',
    accent: 'bg-rose-600',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    button: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25',
    textAccent: 'text-rose-400',
    ring: 'focus:ring-rose-500',
  },
  slate: {
    name: 'Minimal Slate',
    bgGradient: 'from-slate-950 via-slate-900 to-zinc-900',
    cardBg: 'bg-slate-900/60',
    border: 'border-slate-700/40',
    accent: 'bg-slate-700',
    badge: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
    button: 'bg-slate-700 hover:bg-slate-600 text-white shadow-slate-700/25',
    textAccent: 'text-slate-300',
    ring: 'focus:ring-slate-500',
  },
};
