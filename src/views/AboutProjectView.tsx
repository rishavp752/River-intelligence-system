import React, { useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Download,
  FileArchive,
  Laptop,
  Smartphone,
  Terminal,
  WifiOff,
} from 'lucide-react';
import { NavigationTab } from '../types/monitoring';

interface AboutProjectViewProps {
  onNavigate: (tab: NavigationTab) => void;
  onOpenInstallModal: () => void;
}

const TEAM_MEMBERS = [
  {
    roll: '139',
    name: 'Rijoy Biswas',
    role: 'IoT Telemetry Simulation & System Architecture',
  },
  {
    roll: '140',
    name: 'Rishabh Kumar Shaw',
    role: 'Water Quality Analytics & Data Visualization',
  },
  {
    roll: '141',
    name: 'Rishan Nandi',
    role: 'ML Pipeline Design & Preliminary Risk Logic',
  },
  {
    roll: '142',
    name: 'Rishav Kumar Pandey',
    role: 'Full-Stack Interface, GIS Corridor & Heavy Metal Framework',
  },
  {
    roll: '144',
    name: 'Ritik Kumar Ram',
    role: 'Drone Intelligence Workflow, PWA & Reporting System',
  },
];

const FUTURE_SCOPE_ITEMS = [
  {
    title: 'Real-Time IoT Sensor Integration',
    description:
      'Interfacing physical waterproof sensor probes (pH, RTD temperature, optical turbidity, galvanic DO, and 4-electrode EC) with LoRaWAN/MQTT edge gateways.',
  },
  {
    title: 'Physical Sensor Deployment',
    description:
      'Solar-powered floating buoy stations anchored across upstream, midstream urban influx, and downstream recovery zones.',
  },
  {
    title: 'Laboratory Validation',
    description:
      'Periodic grab-sample collection analyzed via ICP-MS and Atomic Absorption Spectroscopy (AAS) to establish ground-truth heavy metal concentrations (Pb, Hg, As, Cd).',
  },
  {
    title: 'Independently Validated ML Models',
    description:
      'Training and benchmarking Decision Tree, Random Forest, and Logistic Regression classifiers on multi-season paired field-and-laboratory datasets.',
  },
  {
    title: 'Advanced Drone Imaging',
    description:
      'Automated UAV flight corridors capturing geotagged nadir RGB and multispectral imagery for shoreline waste and plume boundary tracking.',
  },
  {
    title: 'Continuous GIS-Based Monitoring',
    description:
      'Integration with spatial watershed databases for automated catchment-wide anomaly alerts and regulatory reporting.',
  },
];

const PROJECT_FILE_MANIFEST = [
  'package.json — Dependencies, Vite scripts (dev, build, preview, lint)',
  'vite.config.ts — Vite + Tailwind CSS v4 + VitePWA manifest & Workbox configuration',
  'tsconfig.json — TypeScript ES2022 + React + PWA client configuration',
  'index.html — Responsive viewport, PWA meta tags, icons & Google Fonts',
  'README.md — Complete installation, build, Android/Windows PWA & offline guide',
  'public/manifest.json — Standalone Web App Manifest',
  'public/offline.html — Offline fallback screen',
  'public/icon.svg, pwa-192x192.png, pwa-512x512.png, pwa-maskable-512x512.png, apple-touch-icon.png',
  'src/App.tsx — Main responsive shell, collapsible sidebar, mobile drawer & bottom bar',
  'src/types/monitoring.ts — Complete TypeScript interfaces',
  'src/data/initialData.ts — Exact Station A, B, C dataset & rule-based risk engine',
  'src/components/RiverCorridorSvg.tsx — Custom interactive SVG river corridor & GIS engine',
  'src/components/PWAInstallModalAndBanner.tsx — PWA installation modal & offline indicator',
  'src/views/* — All 10 functional application modules',
];

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({
  onNavigate,
  onOpenInstallModal,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'instructions' | 'project-info'>(
    'instructions'
  );
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipStatusMessage, setZipStatusMessage] = useState<string | null>(null);

  const handleDownloadSourceZip = async () => {
    setDownloadingZip(true);
    setZipStatusMessage(null);
    try {
      // Trigger download of the complete pre-packaged project ZIP archive in /public
      const response = await fetch('/RIVER_INTELLIGENCE_Source_Code.zip');
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'RIVER_INTELLIGENCE_Source_Code.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setZipStatusMessage(
          'Downloaded RIVER_INTELLIGENCE_Source_Code.zip (Complete React + TypeScript + PWA source package).'
        );
      } else {
        throw new Error('Static archive unavailable');
      }
    } catch {
      setZipStatusMessage(
        'You can also export the full source repository directly using the AI Studio Download / Export button in the top workspace toolbar.'
      );
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Academic Hero Banner */}
      <div className="rounded-xl border border-[#20D6D0]/35 bg-[#0B2030] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#20D6D0]">
          <span>ASANSOL ENGINEERING COLLEGE</span>
          <span aria-hidden="true">·</span>
          <span>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</span>
          <span aria-hidden="true">·</span>
          <span>ACADEMIC SESSION 2026–2027</span>
          <span aria-hidden="true">·</span>
          <span>GROUP NUMBER: 4</span>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          PROJECT: RIVER INTELLIGENCE
        </h1>
        <p className="mt-1 text-sm sm:text-base font-medium text-[#20D6D0]">
          IoT- and AI-Based River Water Quality Monitoring with Heavy Metal Risk Prediction and Drone-Assisted Pollution Mapping
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-800 pt-4 text-xs">
          <div>
            <div className="text-slate-400">Institution</div>
            <div className="mt-0.5 font-semibold text-white">
              Asansol Engineering College
            </div>
          </div>
          <div>
            <div className="text-slate-400">Department</div>
            <div className="mt-0.5 font-semibold text-white">
              Computer Science and Engineering
            </div>
          </div>
          <div>
            <div className="text-slate-400">Academic Session</div>
            <div className="mt-0.5 font-mono font-semibold text-white">
              2026–2027
            </div>
          </div>
          <div>
            <div className="text-slate-400">Project Group</div>
            <div className="mt-0.5 font-mono font-semibold text-[#20D6D0]">
              Group Number 4 (5 Team Members)
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Directory (Group 4: Exactly 5 Members — 139, 140, 141, 142, 144) */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              PROJECT DEVELOPMENT TEAM · GROUP 4
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              Team Members — Asansol Engineering College (CSE)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            5 MEMBERS · ACADEMIC SESSION 2026–2027
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.roll}
              className="rounded-xl border border-slate-800 bg-[#061421] p-4 flex items-start gap-3.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#20D6D0]/40 bg-[#0B2030] font-mono text-sm font-bold text-[#20D6D0]">
                {member.roll}
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">
                  ROLL NO. {member.roll}
                </div>
                <div className="text-base font-bold text-white">{member.name}</div>
                <div className="mt-1 text-xs text-slate-400">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download Project & Cross-Platform PWA Installation Section (Objective 4) */}
      <div className="rounded-xl border border-[#20D6D0]/40 bg-[#0B2030] p-5 sm:p-6 space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#20D6D0]">
              DOWNLOAD PROJECT PACKAGE & INSTALLABLE PWA CENTER
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
              Download Complete Source Code (ZIP) & Local Setup Guide
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Download the complete React + TypeScript + Vite + PWA source code package to run locally on your laptop, or install RIVER INTELLIGENCE as a standalone app on Android and Windows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadSourceZip}
              disabled={downloadingZip}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg bg-[#20D6D0] px-4 py-2.5 text-xs font-bold text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <FileArchive className="h-4 w-4" />
              <span>
                {downloadingZip
                  ? 'Preparing Source ZIP...'
                  : 'Download Source Code (ZIP)'}
              </span>
            </button>

            <button
              onClick={() => setActiveDocTab('instructions')}
              className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeDocTab === 'instructions'
                  ? 'border-[#20D6D0] bg-[#20D6D0]/15 text-[#20D6D0]'
                  : 'border-slate-700 bg-[#061421] text-slate-300 hover:text-white'
              }`}
            >
              <Terminal className="h-4 w-4" />
              <span>View Installation Instructions</span>
            </button>

            <button
              onClick={() => setActiveDocTab('project-info')}
              className={`min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                activeDocTab === 'project-info'
                  ? 'border-[#20D6D0] bg-[#20D6D0]/15 text-[#20D6D0]'
                  : 'border-slate-700 bg-[#061421] text-slate-300 hover:text-white'
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>View Project Information</span>
            </button>

            <button
              onClick={onOpenInstallModal}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#061421] px-3.5 py-2 text-xs font-semibold text-white hover:border-[#20D6D0] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4 text-[#20D6D0]" />
              <span>Install App (PWA Guide)</span>
            </button>
          </div>
        </div>

        {zipStatusMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{zipStatusMessage}</span>
          </div>
        )}

        {activeDocTab === 'instructions' ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Local Laptop Development & Production Build */}
            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Terminal className="h-4 w-4 text-[#20D6D0]" />
                <span>1. Run & Build Locally (Windows / Mac / Linux)</span>
              </div>
              <p className="text-xs text-slate-400">
                Requires Node.js (v18+) and npm. Unzip the downloaded source archive and run:
              </p>
              <pre className="rounded-lg border border-slate-800 bg-[#0B2030] p-3 font-mono text-[11px] text-[#20D6D0] overflow-x-auto">
{`# Install dependencies
npm install

# Run local dev server (http://localhost:3000)
npm run dev

# Build production bundle (dist/)
npm run build

# Run local production preview
npm run preview`}
              </pre>
            </div>

            {/* Install on Android Smartphone */}
            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Smartphone className="h-4 w-4 text-[#20D6D0]" />
                <span>2. Install on Android Phone (Chrome / Brave)</span>
              </div>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Open the application URL directly in <strong>Chrome</strong> or <strong>Brave</strong> on your Android phone.
                </li>
                <li>
                  Tap the <strong>Install App</strong> button in the header or tap the browser menu (<strong>⋮</strong>) → <strong>"Install app"</strong> / <strong>"Add to Home screen"</strong>.
                </li>
                <li>
                  Launch <strong>RIVER INTELLIGENCE</strong> from your home screen in standalone full-screen mode without an address bar.
                </li>
              </ol>
            </div>

            {/* Install on Windows Laptop & Offline Mode */}
            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Laptop className="h-4 w-4 text-[#20D6D0]" />
                <span>3. Install on Windows Laptop & Offline Usage</span>
              </div>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Open the app in a dedicated tab in <strong>Chrome</strong>, <strong>Brave</strong>, or <strong>Microsoft Edge</strong>.
                </li>
                <li>
                  Click the <strong>Install icon</strong> in the address bar (or <strong>⋮ → Save and share → Install page as app</strong>).
                </li>
                <li>
                  Once loaded, the Service Worker caches all simulation assets, charts, and GIS layers for offline operation.
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-[#20D6D0]">
                INCLUDED IN SOURCE CODE ZIP ARCHIVE
              </div>
              <ul className="space-y-1 text-xs font-mono text-slate-300">
                {PROJECT_FILE_MANIFEST.map((file, idx) => (
                  <li key={idx} className="truncate">
                    • {file}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#061421] p-4 space-y-2.5 text-xs text-slate-300">
              <div className="text-xs font-mono font-bold text-[#F4B942]">
                ZERO-COST & SELF-CONTAINED ARCHITECTURE GUARANTEE
              </div>
              <p className="leading-relaxed">
                • <strong>No External Cloud / No API Keys:</strong> Contains zero Firebase, Supabase, MongoDB, or paid API dependencies. Runs immediately out of the box.
              </p>
              <p className="leading-relaxed">
                • <strong>AI Studio Native Export Option:</strong> In addition to the <strong>Download Source Code (ZIP)</strong> button above, you can also click the <strong>Download / Export</strong> icon in the top AI Studio toolbar to download the workspace snapshot at any time.
              </p>
              <p className="leading-relaxed">
                • <strong>PWA Standards & Browser Notes:</strong> Implements a valid Web App Manifest (`display: standalone`, theme `#061421`, 192px/512px/maskable PNG icons) and Workbox Service Worker. Note that browsers only fire native install prompts in top-level tabs (outside preview iframes) on compatible Chromium browsers.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vision, Objectives, Research Gap & Scientific Limitations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6 space-y-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              01 · VISION & CORE OBJECTIVES
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              Project Vision & Engineering Objectives
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Conventional river monitoring relies on infrequent manual grab sampling, creating blind spots between upstream baselines and midstream industrial/urban discharge zones. <strong>RIVER INTELLIGENCE</strong> proposes a unified environmental intelligence architecture that combines continuous physico-chemical telemetry, preliminary risk screening, spatial GIS mapping, and aerial surface inspection.
          </p>

          <ul className="space-y-2 text-xs text-slate-200">
            <li>
              • <strong>Multi-Point Corridor Comparison:</strong> Monitor Upstream Reference (Station A), Midstream Influx (Station B), and Downstream Recovery (Station C) across pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity.
            </li>
            <li>
              • <strong>Transparent Preliminary Screening:</strong> Flag multi-parameter anomalies (such as Station B’s elevated turbidity and conductivity and depleted oxygen) to prioritize targeted laboratory sampling.
            </li>
            <li>
              • <strong>Spatial & Aerial Context:</strong> Fuse submerged sensor anomalies with drone-assisted surface pollution mapping on an interactive GIS schematic.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6 space-y-4">
          <div>
            <div className="text-xs font-mono text-[#F4B942]">
              02 · RESEARCH GAP & SCIENTIFIC LIMITATIONS
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              Research Gap & Honest Prototype Boundaries
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Identified Research Gap:</strong> Low-cost IoT stations measure bulk physical/chemical parameters quickly, whereas heavy metal assay (Pb, Hg, As, Cd) requires expensive, time-consuming laboratory spectroscopy. Bridging this gap requires carefully validated proxy risk screening paired with targeted lab verification.
            </p>
            <div className="rounded-lg border border-[#F4B942]/30 bg-[#061421] p-3.5 space-y-1.5">
              <div className="font-semibold text-[#F4B942]">
                Mandatory Scientific & Prototype Limitations:
              </div>
              <div>
                1. Basic probes (pH, Temp, Turbidity, DO, EC) cannot directly measure dissolved heavy metal concentrations.
              </div>
              <div>
                2. Aerial drone imagery identifies visible surface pollution only and cannot detect dissolved trace metals.
              </div>
              <div>
                3. All telemetry, GIS coordinates, and risk rules in this web application are simulated for academic demonstration; actual ML validation requires a labelled field-and-laboratory dataset.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Future Scope Roadmap */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              03 · FUTURE ROADMAP
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              Future Scope & Field Deployment Roadmap
            </h2>
          </div>
          <button
            onClick={() => onNavigate('overview')}
            className="min-h-[40px] rounded-lg bg-[#20D6D0] px-4 py-2 text-xs font-semibold text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors cursor-pointer"
          >
            Return to Command Centre →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE_SCOPE_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-800 bg-[#061421] p-4"
            >
              <div className="text-xs font-mono font-bold text-[#20D6D0]">
                PHASE 0{idx + 1}
              </div>
              <h3 className="mt-1 text-sm font-bold text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
