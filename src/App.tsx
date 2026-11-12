/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Camera,
  Info,
  LayoutDashboard,
  Map,
  Moon,
  Sparkles,
  Sun,
  Waves,
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

const ESSENTIAL_NAV_TABS: {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'gis-map', label: 'GIS Map', icon: Map },
  { id: 'drone-intelligence', label: 'Drone Analysis', icon: Camera },
  { id: 'about-project', label: 'About', icon: Info },
];

const MONITORING_SUB_LENSES: {
  id: NavigationTab;
  label: string;
}[] = [
  { id: 'live-monitoring', label: 'Station Telemetry' },
  { id: 'water-analytics', label: 'Parameter Analytics' },
  { id: 'ai-risk', label: 'AI Risk & ML Pipeline' },
  { id: 'heavy-metals', label: 'Heavy Metal Screening' },
  { id: 'alerts-reports', label: 'Alerts & Reports' },
];

const STORAGE_KEY_STATIONS = 'river_intelligence_stations_v1';
const STORAGE_KEY_ALERTS = 'river_intelligence_alerts_v1';
const SESSION_KEY_INTRO = 'river_intelligence_intro_seen_v4';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMonitoringFamily =
    activeTab === 'live-monitoring' ||
    activeTab === 'water-analytics' ||
    activeTab === 'ai-risk' ||
    activeTab === 'heavy-metals' ||
    activeTab === 'alerts-reports';

  const topNavResolvedId: NavigationTab = isMonitoringFamily
    ? 'live-monitoring'
    : activeTab === 'system-architecture'
    ? 'about-project'
    : activeTab;

  return (
    <div className="relative min-h-screen aquatic-mesh-bg text-[#263B50] flex flex-col">
      {/* Subtle Ambient Aquatic Horizon */}
      <AmbientAquaticBackdrop />

      {/* Cinematic Minimal Opening Experience */}
      <AnimatePresence>
        {showOpeningIntro && <AquaticOpeningIntro onFinish={handleFinishIntro} />}
      </AnimatePresence>

      {/* Compact, Minimal Floating Glass Navigation Bar (5 Essential Tabs + Theme Switch) */}
      <header className="sticky top-0 z-30 px-4 pt-4 sm:px-8 sm:pt-5 no-print">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4 rounded-full glass-panel px-5 py-2.5 sm:px-6">
          {/* Brand Wordmark */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('overview');
            }}
            className="flex items-center gap-2.5 text-sm sm:text-base font-medium tracking-[0.12em] uppercase text-[#263B50] whitespace-nowrap shrink-0"
          >
            <Waves className="h-4 w-4 text-[#0D9488]" />
            <span>River Intelligence</span>
          </a>

          {/* 5 Essential Navigation Tabs */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 text-xs font-medium"
          >
            {ESSENTIAL_NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = topNavResolvedId === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(tab.id);
                  }}
                  className={`group relative flex items-center gap-1.5 rounded-full px-4 py-2 transition-all duration-300 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#0D9488] font-semibold'
                      : 'text-[#52667A] hover:text-[#263B50]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="minimalNavPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className={`absolute inset-0 -z-10 rounded-full border ${
                        isNight
                          ? 'border-white/15 bg-white/[0.07] shadow-[0_4px_16px_rgba(0,0,0,0.45)]'
                          : 'border-[#2B8A8E]/25 bg-[#E5F2F3]/85'
                      }`}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <span className={`nav-link-underline ${isActive ? 'active' : ''}`}>
                    {tab.label}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Compact Day / Night Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={isNight ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              title={isNight ? 'Switch to Day Mode' : 'Switch to Night Mode'}
              className="inline-flex items-center gap-2 rounded-full border border-[#70CFFF]/35 bg-white/75 px-3.5 py-1.5 text-xs font-medium text-[#263B50] cursor-pointer"
            >
              <motion.span
                key={theme}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="flex items-center"
              >
                {isNight ? (
                  <Moon className="h-3.5 w-3.5 text-[#66C4C8]" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                )}
              </motion.span>
              <span className="font-mono text-[11px]">
                {isNight ? 'Night' : 'Day'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Spacious Editorial Workspace */}
      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 flex flex-col justify-between px-4 pt-6 pb-24 sm:px-8 lg:pb-12">
        <main className="flex-1 w-full space-y-6">
          {/* Segmented Analytical Lens Switcher when inside Live Monitoring family */}
          {isMonitoringFamily && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl glass-card px-4 py-2.5 no-print">
              <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#71869A]">
                Monitoring &amp; Analytical Lenses
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {MONITORING_SUB_LENSES.map((lens) => {
                  const active = activeTab === lens.id;
                  return (
                    <button
                      key={lens.id}
                      onClick={() => navigateTo(lens.id)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-[#20CFC6] text-white'
                          : 'text-[#52667A] hover:text-[#263B50]'
                      }`}
                    >
                      {lens.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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

        {/* Minimal Institution-Neutral Footer */}
        <footer className="mt-16 border-t border-[#70CFFF]/25 pt-6 text-xs text-[#71869A] no-print">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium tracking-[0.1em] uppercase text-[#263B50]">
                River Intelligence
              </span>
              <span>·</span>
              <span>Environmental Hydrological Intelligence Platform</span>
            </div>
            <button
              onClick={() => setShowOpeningIntro(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D9488] hover:underline cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="h-3 w-3" />
              <span>Replay Opening Experience</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom 5-Tab Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 items-center border-t border-[#70CFFF]/30 glass-panel md:hidden no-print"
      >
        {ESSENTIAL_NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = topNavResolvedId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`min-h-[54px] flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors cursor-pointer ${
                isActive ? 'text-[#0D9488] font-semibold' : 'text-[#71869A] hover:text-[#263B50]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1 truncate">{tab.label}</span>
            </button>
          );
        })}
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
