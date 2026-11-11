import React, { useState } from 'react';
import { Download, Laptop, Smartphone, WifiOff, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWAInstall();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl border border-[#F4B942]/50 bg-[#0B2030]/95 px-4 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur no-print">
      <WifiOff className="h-4 w-4 text-[#F4B942] shrink-0" />
      <div>
        <div className="font-mono font-bold text-[#F4B942]">
          OFFLINE MODE ACTIVE — CACHED SIMULATION READY
        </div>
        <div className="text-[11px] text-slate-300">
          All local simulated station readings, charts, and GIS layers continue working offline.
        </div>
      </div>
    </div>
  );
};

interface PWAInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallGuideModal: React.FC<PWAInstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs no-print">
      <div className="w-full max-w-2xl rounded-2xl border border-[#20D6D0]/40 bg-[#0B2030] p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#20D6D0]">
              PROGRESSIVE WEB APP (PWA) · STANDALONE INSTALLATION
            </div>
            <h3 className="mt-1 text-lg font-bold text-white sm:text-xl">
              Install RIVER INTELLIGENCE on Android & Windows Laptop
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close installation guide"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-700 bg-[#061421] text-slate-300 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-300">
          {isInstalled ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300 font-medium">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>
                RIVER INTELLIGENCE is currently running in standalone installed app mode.
              </span>
            </div>
          ) : isInstallable ? (
            <div className="rounded-xl border border-[#20D6D0]/50 bg-[#061421] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-semibold text-white text-sm">
                  Direct Browser Installation Ready
                </div>
                <p className="text-slate-400 mt-0.5">
                  Your browser supports native one-click PWA installation.
                </p>
              </div>
              <button
                onClick={async () => {
                  await install();
                }}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#20D6D0] px-5 py-2.5 text-xs font-bold text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Trigger Native Install Prompt</span>
              </button>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Android Phone Instructions */}
            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Smartphone className="h-4 w-4 text-[#20D6D0]" />
                <span>Android Phone (Chrome / Brave)</span>
              </div>
              <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Open the application URL directly in <strong>Google Chrome</strong> or <strong>Brave Browser</strong> on Android (outside any embedded preview iframe).
                </li>
                <li>
                  Tap the browser menu icon (<strong>⋮</strong>) in the top-right corner.
                </li>
                <li>
                  Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </li>
                <li>
                  Launch <strong>RIVER INTELLIGENCE</strong> from your home screen in standalone full-window mode without an address bar.
                </li>
              </ol>
            </div>

            {/* Windows Laptop / Desktop Instructions */}
            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Laptop className="h-4 w-4 text-[#20D6D0]" />
                <span>Windows Laptop (Chrome / Brave / Edge)</span>
              </div>
              <ol className="space-y-1.5 text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Open the deployed app URL or local server (<code>http://localhost:3000</code>) in a dedicated browser tab.
                </li>
                <li>
                  Click the <strong>Install RIVER INTELLIGENCE</strong> icon on the right side of the address bar (or click <strong>⋮ → Save and share → Install page as app</strong>).
                </li>
                <li>
                  Confirm installation to pin the app to your Windows Start Menu, Desktop, or Taskbar.
                </li>
              </ol>
            </div>
          </div>

          <div className="rounded-xl border border-[#F4B942]/30 bg-[#061421] p-3.5 text-slate-300 leading-relaxed">
            <strong className="text-[#F4B942]">Browser & Preview Environment Note:</strong> Browsers suppress the automatic <code>beforeinstallprompt</code> event when an application is viewed inside an embedded sandbox <code>&lt;iframe&gt;</code> (such as the AI Studio split preview pane) or in browsers that do not implement the Web App Install API (such as Firefox Desktop). To install directly, open the Shared/Development App URL in a standalone Chrome, Brave, or Edge browser tab, or run the downloaded source code locally.
          </div>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="min-h-[44px] rounded-lg bg-[#20D6D0] px-5 py-2 text-xs font-bold text-[#061421] hover:bg-[#00AFA7] hover:text-white cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
