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

const STORAGE_KEY_STATIONS = 'river_intelligence_stations_v1';
const STORAGE_KEY_ALERTS = 'river_intelligence_alerts_v1';

export default function App() {
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
    <div className="min-h-screen bg-[#061421] text-slate-100 flex flex-col">
      {/* Top Bar Contract: 3 Zones Separated by gap-8 */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 border-b border-slate-800/90 bg-[#0B2030]/95 px-4 py-3 backdrop-blur sm:px-6 no-print">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            navigateTo('overview');
          }}
          className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          RIVER INTELLIGENCE
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('overview');
            }}
            className={`hover:text-[#20D6D0] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'overview' ? 'text-[#20D6D0] underline underline-offset-4' : ''
            }`}
          >
            Overview
          </a>
          <a
            href="#live-monitoring"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('live-monitoring');
            }}
            className={`hover:text-[#20D6D0] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'live-monitoring'
                ? 'text-[#20D6D0] underline underline-offset-4'
                : ''
            }`}
          >
            Live Monitoring
          </a>
          <a
            href="#gis-map"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('gis-map');
            }}
            className={`hover:text-[#20D6D0] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'gis-map' ? 'text-[#20D6D0] underline underline-offset-4' : ''
            }`}
          >
            GIS Map
          </a>
          <a
            href="#drone-intelligence"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('drone-intelligence');
            }}
            className={`hover:text-[#20D6D0] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'drone-intelligence'
                ? 'text-[#20D6D0] underline underline-offset-4'
                : ''
            }`}
          >
            Drone Analysis
          </a>
          <a
            href="#about-project"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('about-project');
            }}
            className={`hover:text-[#20D6D0] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'about-project'
                ? 'text-[#20D6D0] underline underline-offset-4'
                : ''
            }`}
          >
            About Project
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action Button (+ Mobile Drawer Trigger on small screens) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigateTo('alerts-reports')}
            className="min-h-[40px] px-3.5 py-2 text-xs font-bold text-[#061421] bg-[#20D6D0] rounded-lg hover:bg-[#00AFA7] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Alerts & Reports
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Drawer"
            className="lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Container: Left Collapsible Sidebar + Content Stage */}
      <div className="flex flex-1">
        {/* Desktop Collapsible Left Sidebar */}
        <aside
          className={`hidden lg:flex flex-col justify-between border-r border-slate-800/90 bg-[#0B2030] transition-all duration-200 shrink-0 no-print ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="p-3 space-y-1">
            {!sidebarCollapsed && (
              <div className="px-3 py-2 text-[11px] font-mono text-slate-400">
                Environmental Technology Meets AI
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#20D6D0] text-[#061421]'
                      : 'text-slate-300 hover:bg-[#061421]/60 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Sidebar Collapse Toggle & Academic Credit Footer */}
          <div className="border-t border-slate-800 p-3 space-y-2">
            {!sidebarCollapsed && (
              <div className="rounded-lg bg-[#061421] p-3 text-[11px] text-slate-400">
                <div className="font-semibold text-slate-200">
                  Asansol Engineering College
                </div>
                <div className="mt-0.5 font-mono">
                  CSE · Group 4 · 2026–2027
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-[#061421] py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
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
              className="fixed inset-0 bg-black/70"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 flex w-72 flex-col justify-between bg-[#0B2030] p-4 border-r border-slate-800 overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-between px-2 pb-3">
                  <span className="text-xs font-mono text-[#20D6D0]">
                    RIVER INTELLIGENCE MODULES
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
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
                      className={`min-h-[44px] flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#20D6D0] text-[#061421]'
                          : 'text-slate-300 hover:bg-[#061421]/60 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="rounded-lg bg-[#061421] p-2.5 text-[11px] text-slate-400">
                  Asansol Engineering College · CSE Group 4 (Rolls 139, 140, 141, 142, 144)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main View Stage */}
        <div className="flex-1 min-w-0 flex flex-col justify-between pb-16 lg:pb-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
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

          {/* Clean Academic Project Footer (5 Team Members) */}
          <footer className="border-t border-slate-800/80 bg-[#0B2030]/60 px-4 py-4 sm:px-6 lg:px-8 text-xs text-slate-400 no-print">
            <div className="max-w-[1440px] mx-auto flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="font-semibold text-white">RIVER INTELLIGENCE</span>
                <span className="mx-2 text-slate-600">·</span>
                <span>Asansol Engineering College (CSE Group 4, 2026–2027)</span>
              </div>
              <div className="text-slate-300">
                Team: 139 — Rijoy Biswas · 140 — Rishabh Kumar Shaw · 141 — Rishan Nandi · 142 — Rishav Kumar Pandey · 144 — Ritik Kumar Ram
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Quick-Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 items-center border-t border-slate-800 bg-[#0B2030]/95 backdrop-blur lg:hidden no-print"
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
              className={`min-h-[52px] flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors cursor-pointer ${
                isActive ? 'text-[#20D6D0] font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="mt-1 truncate">{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="min-h-[52px] flex flex-col items-center justify-center py-1 text-[10px] font-medium text-slate-300 hover:text-white cursor-pointer"
        >
          <Menu className="h-4 w-4 text-[#20D6D0]" />
          <span className="mt-1 truncate">All Modules</span>
        </button>
      </nav>
    </div>
  );
}
