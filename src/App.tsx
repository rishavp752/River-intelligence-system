/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Camera,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileSpreadsheet,
  FlaskConical,
  Info,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Waves,
  X,
} from 'lucide-react';
import {
  NavigationTab,
  StationData,
  StationId,
  TimeSeriesPoint,
  WaterReadings,
  AlertItem,
  ActivityLogItem,
  DroneObservationRecord,
} from './types/monitoring';
import {
  BASELINE_STATIONS,
  generateInitialTimeSeries,
  INITIAL_ALERTS,
  INITIAL_DRONE_OBSERVATIONS,
  INITIAL_GIS_HOTSPOTS,
} from './data/initialData';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AmbientAquaticBackdrop } from './components/AmbientAquaticBackdrop';
import { AquaticOpeningIntro } from './components/AquaticOpeningIntro';
import { OverviewView } from './views/OverviewView';
import { LiveMonitoringView } from './views/LiveMonitoringView';
import { WaterAnalyticsView } from './views/WaterAnalyticsView';
import { AiRiskAssessmentView } from './views/AiRiskAssessmentView';
import { HeavyMetalAnalysisView } from './views/HeavyMetalAnalysisView';
import { GisPollutionMapView } from './views/GisPollutionMapView';
import { DroneIntelligenceView } from './views/DroneIntelligenceView';
import { AlertsReportsView } from './views/AlertsReportsView';
import { SystemArchitectureView } from './views/SystemArchitectureView';
import { AboutProjectView } from './views/AboutProjectView';

const SIDEBAR_ITEMS: {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'water-analytics', label: 'Water Analytics', icon: BarChart3 },
  { id: 'ai-risk', label: 'AI Risk Assessment', icon: BrainCircuit },
  { id: 'heavy-metals', label: 'Heavy Metal Analysis', icon: FlaskConical },
  { id: 'gis-map', label: 'GIS Pollution Map', icon: Map },
  { id: 'drone-intelligence', label: 'Drone Intelligence', icon: Camera },
  { id: 'alerts-reports', label: 'Alerts & Reports', icon: FileSpreadsheet },
  { id: 'system-architecture', label: 'System Architecture', icon: Cpu },
  { id: 'about-project', label: 'About Project', icon: Info },
];

const TOP_NAV_LINKS: {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'gis-map', label: 'GIS Map', icon: Map },
  { id: 'drone-intelligence', label: 'Drone Analysis', icon: Camera },
  { id: 'about-project', label: 'About Project', icon: Info },
];

const STORAGE_KEY_STATIONS = 'river_intelligence_stations_v1';
const STORAGE_KEY_ALERTS = 'river_intelligence_alerts_v1';
const SESSION_KEY_INTRO = 'river_intelligence_intro_seen_v3';

function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const isNight = theme === 'night';

  const [showOpeningIntro, setShowOpeningIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY_INTRO);
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [stations, setStations] = useState<Record<StationId, StationData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATIONS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to baseline
    }
    return BASELINE_STATIONS;
  });

  const [selectedStation, setSelectedStation] = useState<StationId>('B');
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>(() =>
    generateInitialTimeSeries(16)
  );
  const [isSimulationRunning, setIsSimulationRunning] = useState<boolean>(false);
  const [simulationSpeedMs, setSimulationSpeedMs] = useState<number>(2200);

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_ALERTS;
  });

  const [droneObservations, setDroneObservations] = useState<DroneObservationRecord[]>(
    INITIAL_DRONE_OBSERVATIONS
  );

  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([
    {
      id: 'ACT-1',
      timestamp: '12:30:00',
      module: 'SIMULATION',
      description: 'Loaded baseline simulated dataset for Stations A, B, and C.',
    },
    {
      id: 'ACT-2',
      timestamp: '12:30:02',
      module: 'RISK ENGINE',
      description:
        'Station B flagged with High Preliminary Risk (Turbidity 35 NTU, EC 650 µS/cm, DO 4.8 mg/L).',
      stationId: 'B',
    },
    {
      id: 'ACT-3',
      timestamp: '12:30:05',
      module: 'GIS MAP',
      description: 'Initialized schematic river corridor with 2 illustrative hotspots and 2 UAV tags.',
    },
  ]);

  const handleFinishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY_INTRO, '1');
    } catch {
      // Ignore storage errors
    }
    setShowOpeningIntro(false);
  }, []);

  const appendLog = useCallback((module: string, description: string, stationId?: StationId) => {
    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setActivityLog((prev) => [
      {
        id: `ACT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        module,
        description,
        stationId,
      },
      ...prev.slice(0, 14),
    ]);
  }, []);

  // Persist station and alert changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATIONS, JSON.stringify(stations));
    } catch {
      // Ignore storage quota errors
    }
  }, [stations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
    } catch {
      // Ignore storage errors
    }
  }, [alerts]);

  // Controlled variation generator around baseline values
  const stepSimulationReadings = useCallback(() => {
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const shortLabel = nowLabel.slice(0, 5);

    setStations((prev) => {
      const vary = (base: number, maxDelta: number, decimals = 1) => {
        const delta = (Math.random() * 2 - 1) * maxDelta;
        return Number((base + delta).toFixed(decimals));
      };

      const nextA: WaterReadings = {
        ph: vary(BASELINE_STATIONS.A.baselineReadings.ph, 0.12, 2),
        temperature: vary(BASELINE_STATIONS.A.baselineReadings.temperature, 0.4, 1),
        turbidity: Math.max(2, vary(BASELINE_STATIONS.A.baselineReadings.turbidity, 1.2, 1)),
        dissolvedOxygen: vary(BASELINE_STATIONS.A.baselineReadings.dissolvedOxygen, 0.2, 2),
        conductivity: Math.round(vary(BASELINE_STATIONS.A.baselineReadings.conductivity, 12, 0)),
      };

      const nextB: WaterReadings = {
        ph: vary(BASELINE_STATIONS.B.baselineReadings.ph, 0.12, 2),
        temperature: vary(BASELINE_STATIONS.B.baselineReadings.temperature, 0.5, 1),
        turbidity: Math.max(26, vary(BASELINE_STATIONS.B.baselineReadings.turbidity, 3.0, 1)),
        dissolvedOxygen: Math.min(
          5.3,
          vary(BASELINE_STATIONS.B.baselineReadings.dissolvedOxygen, 0.22, 2)
        ),
        conductivity: Math.round(vary(BASELINE_STATIONS.B.baselineReadings.conductivity, 24, 0)),
      };

      const nextC: WaterReadings = {
        ph: vary(BASELINE_STATIONS.C.baselineReadings.ph, 0.12, 2),
        temperature: vary(BASELINE_STATIONS.C.baselineReadings.temperature, 0.4, 1),
        turbidity: Math.max(10, vary(BASELINE_STATIONS.C.baselineReadings.turbidity, 1.8, 1)),
        dissolvedOxygen: vary(BASELINE_STATIONS.C.baselineReadings.dissolvedOxygen, 0.2, 2),
        conductivity: Math.round(vary(BASELINE_STATIONS.C.baselineReadings.conductivity, 16, 0)),
      };

      setTimeSeries((oldSeries) => [
        ...oldSeries.slice(1),
        {
          timestamp: new Date().toISOString(),
          timeLabel: shortLabel,
          A: nextA,
          B: nextB,
          C: nextC,
        },
      ]);

      return {
        A: {
          ...prev.A,
          readings: nextA,
          lastUpdated: nowLabel,
          sensorLatencyMs: 36 + Math.floor(Math.random() * 14),
        },
        B: {
          ...prev.B,
          readings: nextB,
          lastUpdated: nowLabel,
          sensorLatencyMs: 41 + Math.floor(Math.random() * 16),
        },
        C: {
          ...prev.C,
          readings: nextC,
          lastUpdated: nowLabel,
          sensorLatencyMs: 35 + Math.floor(Math.random() * 14),
        },
      };
    });
  }, []);

  useEffect(() => {
    if (!isSimulationRunning) return;
    const timer = window.setInterval(() => {
      stepSimulationReadings();
    }, simulationSpeedMs);
    return () => window.clearInterval(timer);
  }, [isSimulationRunning, simulationSpeedMs, stepSimulationReadings]);

  const handleResetSimulation = () => {
    setIsSimulationRunning(false);
    setStations(BASELINE_STATIONS);
    setTimeSeries(generateInitialTimeSeries(16));
    localStorage.removeItem(STORAGE_KEY_STATIONS);
    appendLog(
      'RESET',
      'Restored exact baseline simulated dataset for Station A, B, and C.'
    );
  };

  const handleManualUpdateReadings = (stationId: StationId, newReadings: WaterReadings) => {
    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setStations((prev) => {
      const updated = {
        ...prev,
        [stationId]: {
          ...prev[stationId],
          readings: newReadings,
          isFlagged:
            newReadings.turbidity >= 28 ||
            newReadings.conductivity >= 550 ||
            newReadings.dissolvedOxygen <= 5.2,
          lastUpdated: nowLabel,
        },
      };

      setTimeSeries((oldSeries) => [
        ...oldSeries.slice(1),
        {
          timestamp: new Date().toISOString(),
          timeLabel: nowLabel.slice(0, 5),
          A: updated.A.readings,
          B: updated.B.readings,
          C: updated.C.readings,
        },
      ]);

      return updated;
    });

    appendLog(
      'MANUAL EDIT',
      `Updated Station ${stationId} simulated parameters (pH ${newReadings.ph}, Turbidity ${newReadings.turbidity} NTU, EC ${newReadings.conductivity} µS/cm).`,
      stationId
    );
  };

  const handleToggleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: !a.acknowledged } : a))
    );
    appendLog('ALERTS', `Toggled acknowledgement status for alert ${alertId}.`);
  };

  const handleAddDroneObservation = (obs: DroneObservationRecord) => {
    setDroneObservations((prev) => [obs, ...prev]);
    appendLog(
      'DRONE GIS',
      `Added aerial observation ${obs.id} linked to Station ${obs.stationId}.`,
      obs.stationId
    );
  };

  const navigateTo = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen aquatic-mesh-bg text-[#263B50] flex flex-col">
      {/* Ambient Animated Aquatic Environment (Liquid Orbs, Caustic Rays, Floating Particles) */}
      <AmbientAquaticBackdrop />

      {/* Cinematic Opening Experience (Plays once per session, skippable) */}
      <AnimatePresence>
        {showOpeningIntro && <AquaticOpeningIntro onFinish={handleFinishIntro} />}
      </AnimatePresence>

      {/* Translucent Floating Liquid-Glass Navigation Bar */}
      <header className="sticky top-0 z-30 px-3 pt-2.5 sm:px-6 sm:pt-3 no-print">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4 lg:gap-8 rounded-2xl glass-panel px-4 py-2.5 sm:px-6">
          {/* Zone 1: Brand Title */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('overview');
            }}
            className="group flex items-center gap-2.5 text-base sm:text-lg font-extrabold tracking-tight text-[#263B50] whitespace-nowrap shrink-0"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${
                isNight
                  ? 'border-[#00F2FE]/50 bg-gradient-to-br from-[#0A2547] to-[#00F2FE]/20 text-[#00F2FE] shadow-[0_0_16px_rgba(0,242,254,0.28)]'
                  : 'border-[#20CFC6]/50 bg-gradient-to-br from-[#C9F5F5] to-[#EDF8FF] text-[#0D9488] shadow-xs'
              }`}
            >
              <Waves className="h-4 w-4" />
            </span>
            <div className="flex flex-col">
              <span className="leading-none">RIVER INTELLIGENCE</span>
              <span className="mt-0.5 text-[10px] font-mono font-bold tracking-widest text-[#0D9488] hidden sm:inline">
                AQUA NEXUS PLATFORM
              </span>
            </div>
          </a>

          {/* Zone 2: 5 Animated Navigation Links with Sliding Pill + Glowing Underline */}
          <nav className="hidden md:flex items-center gap-1 text-xs lg:text-sm font-semibold text-[#52667A]">
            {TOP_NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(link.id);
                  }}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#0D9488] font-bold'
                      : 'text-[#52667A] hover:text-[#263B50]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="topNavActivePill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className={`absolute inset-0 -z-10 rounded-xl border ${
                        isNight
                          ? 'border-[#00F2FE]/45 bg-[#00F2FE]/14 shadow-[0_0_18px_rgba(0,242,254,0.22)]'
                          : 'border-[#20CFC6]/55 bg-[#C9F5F5]/75 shadow-[0_2px_12px_rgba(32,207,198,0.22)]'
                      }`}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="topNavLaserLine"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-[#20CFC6] via-[#38BDF8] to-[#20CFC6]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: Day/Night Theme Switch + Primary Action Button + Mobile Drawer Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Magical Day / Night Theme Switch */}
            <button
              onClick={toggleTheme}
              aria-label={isNight ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              title={isNight ? 'Switch to Bright Aqua Day Mode' : 'Switch to Deep Ocean Night Mode'}
              className={`min-h-[40px] inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                isNight
                  ? 'border-[#00F2FE]/45 bg-[#081A33]/90 text-[#00F2FE] shadow-[0_0_18px_rgba(0,242,254,0.2)] hover:border-[#00F2FE]'
                  : 'border-[#20CFC6]/45 bg-white/85 text-[#263B50] shadow-xs hover:bg-[#EDF8FF]'
              }`}
            >
              <motion.span
                key={theme}
                initial={{ rotate: -65, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                className="flex items-center justify-center"
              >
                {isNight ? (
                  <Moon className="h-4 w-4 text-[#00F2FE]" />
                ) : (
                  <Sun className="h-4 w-4 text-amber-500" />
                )}
              </motion.span>
              <span className="hidden sm:inline font-mono text-[11px]">
                {isNight ? 'NIGHT MODE' : 'DAY MODE'}
              </span>
            </button>

            <button
              onClick={() => navigateTo('alerts-reports')}
              className="btn-liquid-primary min-h-[40px] px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] rounded-xl shadow-[0_4px_14px_rgba(32,207,198,0.35)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Alerts &amp; Reports
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Drawer"
              className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl border border-[#70CFFF]/45 bg-white/80 text-[#263B50] hover:bg-[#EDF8FF] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Container: Left Collapsible Glass Sidebar + Content Stage */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 gap-6 px-3 pt-4 sm:px-6 sm:pt-5">
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden lg:flex flex-col justify-between self-start sticky top-20 rounded-2xl glass-panel transition-all duration-200 shrink-0 no-print ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-3 space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-[11px] font-mono font-bold text-[#0D9488]">
                AQUA NEXUS MODULES
              </div>
            )}

            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  title={item.label}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] text-white shadow-[0_4px_16px_rgba(32,207,198,0.32)]'
                      : 'text-[#52667A] hover:bg-white/80 hover:text-[#263B50]'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Sidebar Collapse Toggle & Academic Credit Footer */}
          <div className="border-t border-[#70CFFF]/30 p-3 space-y-2">
            {!sidebarCollapsed && (
              <div className="rounded-xl glass-subcard p-3 text-[11px] text-[#52667A]">
                <div className="font-bold text-[#263B50]">
                  Asansol Engineering College
                </div>
                <div className="mt-0.5 font-mono text-[#0D9488] font-semibold">
                  CSE · Group 4 · 2026–2027
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#70CFFF]/35 bg-white/75 py-2 text-xs font-semibold text-[#52667A] hover:text-[#263B50] hover:bg-white cursor-pointer"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span>Collapse Sidebar</span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden no-print">
            <div
              className="fixed inset-0 bg-[#040D1A]/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className={`relative z-50 flex w-72 flex-col justify-between p-4 border-r shadow-2xl overflow-y-auto backdrop-blur-2xl ${
                isNight
                  ? 'bg-[#07162C]/95 border-[#00F2FE]/30'
                  : 'bg-white/92 border-[#70CFFF]/40'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 pb-3 border-b border-[#70CFFF]/30 mb-2">
                  <span className="text-xs font-mono font-bold text-[#0D9488]">
                    RIVER INTELLIGENCE MODULES
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-[#52667A] hover:text-[#263B50]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {SIDEBAR_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`min-h-[44px] flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] text-white shadow-sm'
                          : 'text-[#52667A] hover:bg-[#EDF8FF] hover:text-[#263B50]'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-[#70CFFF]/30 pt-3 space-y-2.5">
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#20CFC6]/45 bg-white/80 py-2.5 text-xs font-bold text-[#263B50] cursor-pointer"
                >
                  {isNight ? (
                    <>
                      <Sun className="h-4 w-4 text-amber-400" />
                      <span>Switch to Day Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-[#0D9488]" />
                      <span>Switch to Night Mode</span>
                    </>
                  )}
                </button>
                <div className="rounded-xl glass-subcard p-2.5 text-[11px] text-[#52667A]">
                  Asansol Engineering College · CSE Group 4 (Rolls 139, 140, 141, 142, 144)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main View Stage */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pb-20 lg:pb-8">
          <main className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'overview' && (
                  <OverviewView
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                    timeSeries={timeSeries}
                    onNavigate={navigateTo}
                    isSimulationRunning={isSimulationRunning}
                    onToggleSimulation={() => {
                      const next = !isSimulationRunning;
                      setIsSimulationRunning(next);
                      appendLog(
                        'SIMULATION',
                        next
                          ? 'Started automated sensor variation.'
                          : 'Paused sensor variation.'
                      );
                    }}
                    alerts={alerts}
                    activityLog={activityLog}
                    hotspots={INITIAL_GIS_HOTSPOTS}
                    droneObservations={droneObservations}
                  />
                )}

                {activeTab === 'live-monitoring' && (
                  <LiveMonitoringView
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                    isSimulationRunning={isSimulationRunning}
                    simulationSpeedMs={simulationSpeedMs}
                    onStartSimulation={() => {
                      setIsSimulationRunning(true);
                      appendLog('SIMULATION', 'Started live simulated variation stream.');
                    }}
                    onPauseSimulation={() => {
                      setIsSimulationRunning(false);
                      appendLog('SIMULATION', 'Paused live simulated variation stream.');
                    }}
                    onResetSimulation={handleResetSimulation}
                    onChangeSpeed={(ms) => {
                      setSimulationSpeedMs(ms);
                      appendLog('SIMULATION', `Changed simulation interval to ${ms}ms.`);
                    }}
                    onManualUpdateReadings={handleManualUpdateReadings}
                    onGenerateSingleStepReading={() => {
                      stepSimulationReadings();
                      appendLog(
                        'SIMULATION',
                        'Generated single demonstration reading across Stations A, B, and C.'
                      );
                    }}
                  />
                )}

                {activeTab === 'water-analytics' && (
                  <WaterAnalyticsView stations={stations} timeSeries={timeSeries} />
                )}

                {activeTab === 'ai-risk' && (
                  <AiRiskAssessmentView
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                  />
                )}

                {activeTab === 'heavy-metals' && (
                  <HeavyMetalAnalysisView
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                  />
                )}

                {activeTab === 'gis-map' && (
                  <GisPollutionMapView
                    stations={stations}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                    hotspots={INITIAL_GIS_HOTSPOTS}
                    droneObservations={droneObservations}
                    isSimulationRunning={isSimulationRunning}
                    onNavigate={navigateTo}
                  />
                )}

                {activeTab === 'drone-intelligence' && (
                  <DroneIntelligenceView
                    droneObservations={droneObservations}
                    onAddDroneObservation={handleAddDroneObservation}
                    selectedStation={selectedStation}
                    onSelectStation={setSelectedStation}
                  />
                )}

                {activeTab === 'alerts-reports' && (
                  <AlertsReportsView
                    stations={stations}
                    alerts={alerts}
                    onToggleAcknowledgeAlert={handleToggleAcknowledgeAlert}
                  />
                )}

                {activeTab === 'system-architecture' && (
                  <SystemArchitectureView onNavigate={navigateTo} />
                )}

                {activeTab === 'about-project' && (
                  <AboutProjectView onNavigate={navigateTo} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Clean Academic Project Footer (5 Team Members + Replay Intro Option) */}
          <footer className="mt-8 rounded-2xl glass-panel px-5 py-4 text-xs text-[#52667A] no-print">
            <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-[#263B50]">RIVER INTELLIGENCE</span>
                <span className="text-[#70CFFF]">·</span>
                <span>Asansol Engineering College (CSE Group 4, 2026–2027)</span>
                <span className="text-[#70CFFF]">·</span>
                <button
                  onClick={() => setShowOpeningIntro(true)}
                  className="inline-flex items-center gap-1 font-semibold text-[#0D9488] hover:text-[#0284C7] hover:underline cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Replay Cinematic Opening</span>
                </button>
              </div>
              <div className="font-medium text-[#263B50]">
                Team: 139 — Rijoy Biswas · 140 — Rishabh Kumar Shaw · 141 — Rishan Nandi · 142 — Rishav Kumar Pandey · 144 — Ritik Kumar Ram
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Quick-Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 items-center border-t backdrop-blur-xl lg:hidden no-print ${
          isNight
            ? 'border-[#00F2FE]/25 bg-[#07162C]/92 shadow-[0_-4px_24px_rgba(0,0,0,0.45)]'
            : 'border-[#70CFFF]/40 bg-white/92 shadow-[0_-4px_20px_rgba(38,59,80,0.06)]'
        }`}
      >
        {[
          { id: 'overview' as NavigationTab, label: 'Overview', icon: LayoutDashboard },
          { id: 'live-monitoring' as NavigationTab, label: 'Live IoT', icon: Activity },
          { id: 'water-analytics' as NavigationTab, label: 'Charts', icon: BarChart3 },
          { id: 'gis-map' as NavigationTab, label: 'GIS Map', icon: Map },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`min-h-[52px] flex flex-col items-center justify-center py-1 text-[10px] font-semibold transition-colors cursor-pointer ${
                isActive ? 'text-[#0D9488] font-bold' : 'text-[#71869A] hover:text-[#263B50]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1 truncate">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="min-h-[52px] flex flex-col items-center justify-center py-1 text-[10px] font-semibold text-[#52667A] hover:text-[#263B50] cursor-pointer"
        >
          <Menu className="h-4 w-4 text-[#0D9488]" />
          <span className="mt-1 truncate">All Modules</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
