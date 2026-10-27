import React, { useState } from 'react';
import { Globe, ExternalLink, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

interface ExternalWebSandboxViewerProps {
  url: string;
  onBack: () => void;
}

export const ExternalWebSandboxViewer: React.FC<ExternalWebSandboxViewerProps> = ({
  url,
  onBack,
}) => {
  const [iframeError, setIframeError] = useState(false);

  let hostname = '';
  try {
    hostname = new URL(url).hostname;
  } catch {
    hostname = url;
  }

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            title="Back to search"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-blue-400 font-mono text-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>{hostname}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            <span>Open in External Tab</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main View */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <Globe className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-bold text-white">External Web Address</h2>
            <p className="text-xs font-mono text-blue-400 mt-1 break-all">{url}</p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Due to browser security protocols (cross-origin iframe protections), many public websites restrict embedding inside sandboxes. You can safely launch this public resource directly.
          </p>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-4 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>Launch {hostname}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
          >
            Return to OmniSearch
          </button>
        </div>
      </div>
    </div>
  );
};
