import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Waves,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  StationData,
  StationId,
  TimeSeriesPoint,
  NavigationTab,
  AlertItem,
  ActivityLogItem,
  GisHotspot,
  DroneObservationRecord,
} from '../types/monitoring';
import { evaluateStationRisk } from '../data/initialData';
import { RiverCorridorSvg } from '../components/RiverCorridorSvg';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { useTheme } from '../context/ThemeContext';

interface OverviewViewProps {
  stations: Record<StationId, StationData>;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
  timeSeries: TimeSeriesPoint[];
  onNavigate: (tab: NavigationTab) => void;
  isSimulationRunning: boolean;
  onToggleSimulation: () => void;
  alerts: AlertItem[];
  activityLog: ActivityLogItem[];
  hotspots: GisHotspot[];
  droneObservations: DroneObservationRecord[];
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  timeSeries,
  onNavigate,
  isSimulationRunning,
  onToggleSimulation,
  alerts,
  activityLog,
  hotspots,
  droneObservations,
}) => {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const chartGridColor = isNight ? 'rgba(56, 189, 248, 0.16)' : '#D8EEF8';
  const chartAxisColor = isNight ? '#9CC0E0' : '#52667A';
  const tooltipStyle = {
    backgroundColor: isNight ? 'rgba(7, 22, 44, 0.96)' : 'rgba(255, 255, 255, 0.96)',
    borderColor: isNight ? 'rgba(0, 242, 254, 0.45)' : '#70CFFF',
    borderRadius: '12px',
    fontSize: '12px',
    color: isNight ? '#ECF6FF' : '#263B50',
    boxShadow: isNight
      ? '0 14px 32px rgba(0, 0, 0, 0.55)'
      : '0 10px 25px rgba(38, 59, 80, 0.1)',
  };

  const stationList = [stations.A, stations.B, stations.C];
  const flaggedCount = stationList.filter((s) => s.isFlagged).length;

  const comparisonChartData = [
    {
      name: 'Station A (Upstream)',
      Turbidity: stations.A.readings.turbidity,
      'Dissolved O₂ (×10)': Number((stations.A.readings.dissolvedOxygen * 10).toFixed(1)),
      'Conductivity (÷10)': Number((stations.A.readings.conductivity / 10).toFixed(1)),
    },
    {
      name: 'Station B (Midstream)',
      Turbidity: stations.B.readings.turbidity,
      'Dissolved O₂ (×10)': Number((stations.B.readings.dissolvedOxygen * 10).toFixed(1)),
      'Conductivity (÷10)': Number((stations.B.readings.conductivity / 10).toFixed(1)),
    },
    {
      name: 'Station C (Downstream)',
      Turbidity: stations.C.readings.turbidity,
      'Dissolved O₂ (×10)': Number((stations.C.readings.dissolvedOxygen * 10).toFixed(1)),
      'Conductivity (÷10)': Number((stations.C.readings.conductivity / 10).toFixed(1)),
    },
  ];

  const trendChartData = timeSeries.slice(-10).map((pt) => ({
    time: pt.timeLabel,
    'Station A': pt.A.turbidity,
    'Station B': pt.B.turbidity,
    'Station C': pt.C.turbidity,
  }));

  return (
    <div className="space-y-6">
      {/* Main Welcome & Environmental Command Centre Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-7"
      >
        {/* Subtle Luminous Water Gradient Accent */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-[#20CFC6]/25 to-[#70CFFF]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-[#0D9488]">
              <span>SIMULATED DATA — NOT REAL-TIME FIELD MEASUREMENTS</span>
              <span aria-hidden="true" className="text-[#71869A]">·</span>
              <span className="text-[#0284C7]">CURRENT SYSTEM STATUS: SIMULATION MODE</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#263B50] sm:text-3xl">
              Intelligent River Monitoring &amp; Environmental Analysis
            </h1>
            <p className="text-sm text-[#52667A] leading-relaxed">
              Integrated hydrological command centre combining simulated multi-station IoT telemetry, comparative water-quality analytics, rule-based preliminary risk screening, schematic GIS mapping, and drone-assisted visual inspection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onToggleSimulation}
              className="min-h-[42px] px-4 py-2 text-xs font-bold rounded-xl border border-[#20CFC6]/60 bg-white/80 text-[#0D9488] hover:bg-[#EDF8FF] transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              {isSimulationRunning ? 'Pause Live Simulation' : 'Start Live Simulation'}
            </button>
            <button
              onClick={() => onNavigate('live-monitoring')}
              className="min-h-[42px] px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] text-white hover:opacity-95 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-[0_8px_20px_-6px_rgba(32,207,198,0.55)]"
            >
              Open Station Controller →
            </button>
          </div>
        </div>
      </motion.div>

      {/* 5 Command-Centre KPI Glass Cards with Animated Counters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="glass-card rounded-2xl p-4 sm:p-5"
        >
          <div className="text-xs font-semibold text-[#71869A]">Total Monitoring Stations</div>
          <div className="mt-2 flex items-baseline justify-between">
            <AnimatedCounter value={3} className="text-3xl font-extrabold text-[#263B50]" />
            <span className="text-xs font-mono font-semibold text-[#0D9488]">STN A · B · C</span>
          </div>
          <div className="mt-2 text-xs text-[#71869A]">
            Upstream, Midstream &amp; Downstream
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card rounded-2xl p-4 sm:p-5"
        >
          <div className="text-xs font-semibold text-[#71869A]">Connected Simulated Stations</div>
          <div className="mt-2 flex items-baseline justify-between">
            <AnimatedCounter value={3} className="text-3xl font-extrabold text-[#0D9488]" />
            <span className="text-xs font-mono font-bold text-emerald-600">● 100% LINKED</span>
          </div>
          <div className="mt-2 text-xs text-[#71869A]">
            Virtual telemetry nodes active
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="glass-card rounded-2xl p-4 sm:p-5 border-rose-300/70"
        >
          <div className="text-xs font-semibold text-[#71869A]">Flagged Station</div>
          <div className="mt-2 flex items-baseline justify-between">
            <AnimatedCounter value={flaggedCount} className="text-3xl font-extrabold text-rose-600" />
            <span className="text-xs font-mono font-bold text-rose-600">▲ STATION B</span>
          </div>
          <div className="mt-2 text-xs text-[#52667A]">
            Peak Turbidity &amp; Conductivity
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="glass-card rounded-2xl p-4 sm:p-5"
        >
          <div className="text-xs font-semibold text-[#71869A]">Water Parameters Monitored</div>
          <div className="mt-2 flex items-baseline justify-between">
            <AnimatedCounter value={5} className="text-3xl font-extrabold text-[#263B50]" />
            <span className="text-xs font-mono font-semibold text-[#0284C7]">CORE SENSORS</span>
          </div>
          <div className="mt-2 text-xs text-[#71869A]">
            pH · Temp · Turbidity · DO · EC
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-4 sm:p-5"
        >
          <div className="text-xs font-semibold text-[#71869A]">Current System Status</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-base sm:text-lg font-extrabold font-mono text-[#0D9488]">
              SIMULATION MODE
            </span>
          </div>
          <div className="mt-2 text-xs text-[#71869A]">
            Controlled demo dataset active
          </div>
        </motion.div>
      </div>

      {/* Animated River Visualization & Interactive Station Selector */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-mono font-semibold text-[#0D9488]">
              HYDROLOGICAL CORRIDOR &amp; RIVER HEALTH OVERVIEW
            </div>
            <h2 className="text-lg font-bold text-[#263B50]">
              Interactive River Corridor &amp; Station Telemetry Preview
            </h2>
            <p className="text-xs text-[#71869A]">
              Click Station A, B, or C on the river schematic to inspect live simulated measurements, or open the full GIS Pollution Map.
            </p>
          </div>
          <button
            onClick={() => onNavigate('gis-map')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#20CFC6]/45 bg-white/80 px-3.5 py-2 text-xs font-bold text-[#0D9488] hover:bg-[#EDF8FF] transition-colors cursor-pointer"
          >
            <span>Open Full Multi-Layer GIS Map</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <RiverCorridorSvg
          stations={stations}
          selectedStation={selectedStation}
          onSelectStation={onSelectStation}
          hotspots={hotspots}
          droneObservations={droneObservations}
          isSimulationRunning={isSimulationRunning}
          compact
        />
      </div>

      {/* Water Quality & Pollution Indicators Across All 3 Stations */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {(['A', 'B', 'C'] as StationId[]).map((id, idx) => {
          const st = stations[id];
          const risk = evaluateStationRisk(id, st.readings);
          const isSelected = selectedStation === id;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * idx }}
              onClick={() => onSelectStation(id)}
              className={`glass-card rounded-2xl p-5 cursor-pointer ${
                st.isFlagged
                  ? 'border-rose-300/80 ring-1 ring-rose-200/60'
                  : isSelected
                  ? 'border-[#20CFC6] ring-2 ring-[#20CFC6]/30'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#71869A]">
                    <span className="font-semibold text-[#263B50]">{st.code}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        st.isFlagged
                          ? 'text-rose-600 font-bold'
                          : id === 'C'
                          ? 'text-amber-600 font-semibold'
                          : 'text-[#0D9488] font-semibold'
                      }
                    >
                      {st.isFlagged ? '▲ FLAGGED ANOMALY' : '● CONNECTED'}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-[#263B50]">{st.name}</h3>
                </div>
                <span
                  className={`text-xs font-mono font-bold ${
                    risk.level === 'High'
                      ? 'text-rose-600'
                      : risk.level === 'Medium'
                      ? 'text-amber-600'
                      : 'text-[#0D9488]'
                  }`}
                >
                  RISK: {risk.level.toUpperCase()} ({risk.score}/100)
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 border-t border-[#70CFFF]/25 pt-4">
                <div className="glass-subcard rounded-xl p-2.5">
                  <div className="text-[11px] font-medium text-[#71869A]">pH Level</div>
                  <div className="mt-0.5 text-lg font-extrabold text-[#263B50]">
                    <AnimatedCounter value={st.readings.ph} decimals={1} />
                  </div>
                </div>
                <div className="glass-subcard rounded-xl p-2.5">
                  <div className="text-[11px] font-medium text-[#71869A]">Temperature</div>
                  <div className="mt-0.5 text-lg font-extrabold text-[#263B50]">
                    <AnimatedCounter value={st.readings.temperature} decimals={1} suffix="°C" />
                  </div>
                </div>
                <div className="glass-subcard rounded-xl p-2.5">
                  <div className="text-[11px] font-medium text-[#71869A]">Turbidity</div>
                  <div
                    className={`mt-0.5 text-lg font-extrabold ${
                      st.readings.turbidity >= 28 ? 'text-rose-600' : 'text-[#263B50]'
                    }`}
                  >
                    <AnimatedCounter value={st.readings.turbidity} decimals={0} suffix=" NTU" />
                  </div>
                </div>
                <div className="glass-subcard rounded-xl p-2.5">
                  <div className="text-[11px] font-medium text-[#71869A]">Dissolved O₂</div>
                  <div
                    className={`mt-0.5 text-lg font-extrabold ${
                      st.readings.dissolvedOxygen <= 5.2 ? 'text-rose-600' : 'text-[#0D9488]'
                    }`}
                  >
                    <AnimatedCounter
                      value={st.readings.dissolvedOxygen}
                      decimals={1}
                      suffix=" mg/L"
                    />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-2 glass-subcard rounded-xl p-2.5">
                  <div className="text-[11px] font-medium text-[#71869A]">
                    Electrical Conductivity
                  </div>
                  <div
                    className={`mt-0.5 text-lg font-extrabold ${
                      st.readings.conductivity >= 550 ? 'text-amber-600' : 'text-[#0284C7]'
                    }`}
                  >
                    <AnimatedCounter
                      value={st.readings.conductivity}
                      decimals={0}
                      suffix=" µS/cm"
                    />
                  </div>
                </div>
              </div>

              {st.highlightSummary && (
                <div className="mt-3 border-t border-[#70CFFF]/25 pt-3 text-xs font-medium text-[#52667A]">
                  {st.highlightSummary.join(' · ')}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row: Cross-Station Comparison Chart & Water Quality Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Multi-Parameter Station Comparison */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#263B50]">
                Cross-Station Parameter Comparison
              </h3>
              <p className="text-xs text-[#71869A]">
                Normalized comparison of Turbidity (NTU), Dissolved O₂ (×10 mg/L), and Conductivity (÷10 µS/cm)
              </p>
            </div>
            <button
              onClick={() => onNavigate('water-analytics')}
              className="text-xs font-bold text-[#0D9488] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Full Analytics →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 16, left: -12, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="name" stroke={chartAxisColor} fontSize={11} />
                <YAxis stroke={chartAxisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: chartAxisColor }} />
                <Bar dataKey="Turbidity" fill="#F43F5E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Dissolved O₂ (×10)" fill="#20CFC6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Conductivity (÷10)" fill="#38BDF8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulated Turbidity Trend */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#263B50]">
                Water Quality Trend — Turbidity (NTU)
              </h3>
              <p className="text-xs text-[#71869A]">
                Simulated temporal progression across Upstream (A), Midstream (B), and Downstream (C)
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#0D9488]">DEMO TIME SERIES</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData} margin={{ top: 10, right: 16, left: -12, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradBLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradCLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gradALight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#20CFC6" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#20CFC6" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="time" stroke={chartAxisColor} fontSize={11} />
                <YAxis stroke={chartAxisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: chartAxisColor }} />
                <Area
                  type="monotone"
                  dataKey="Station B"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradBLight)"
                />
                <Area
                  type="monotone"
                  dataKey="Station C"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradCLight)"
                />
                <Area
                  type="monotone"
                  dataKey="Station A"
                  stroke="#20CFC6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#gradALight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 3-Column Row: Pollution Alert Panel, AI Risk Overview, and Recent System Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pollution Alert Panel */}
        <div className="glass-card rounded-2xl border-rose-300/70 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600">
                <AlertTriangle className="h-4 w-4" />
                <span>ACTIVE DEMONSTRATION ALERT</span>
              </div>
              <button
                onClick={() => onNavigate('alerts-reports')}
                className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer"
              >
                All Alerts ({alerts.length}) →
              </button>
            </div>

            <h3 className="mt-3 text-base font-bold text-[#263B50]">
              Station B — Midstream Anomaly Flagged
            </h3>
            <p className="mt-2 text-sm text-[#52667A] leading-relaxed">
              Station B shows the highest turbidity ({stations.B.readings.turbidity} NTU) and conductivity ({stations.B.readings.conductivity} µS/cm) and the lowest dissolved oxygen ({stations.B.readings.dissolvedOxygen} mg/L) among the three simulated stations. Further investigation is recommended.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#70CFFF]/30 flex items-center justify-between text-xs text-[#71869A]">
            <span className="font-medium">Severity: High Priority</span>
            <button
              onClick={() => {
                onSelectStation('B');
                onNavigate('live-monitoring');
              }}
              className="font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Inspect Station B →
            </button>
          </div>
        </div>

        {/* AI Preliminary Risk Overview */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0D9488]">
                <ShieldAlert className="h-4 w-4" />
                <span>RULE-BASED PRELIMINARY RISK</span>
              </div>
              <button
                onClick={() => onNavigate('ai-risk')}
                className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer"
              >
                ML Workflow →
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {(['A', 'B', 'C'] as StationId[]).map((id) => {
                const r = evaluateStationRisk(id, stations[id].readings);
                return (
                  <div
                    key={id}
                    className="glass-subcard flex items-center justify-between rounded-xl px-3.5 py-2.5"
                  >
                    <div>
                      <div className="text-xs font-bold text-[#263B50]">
                        Station {id} ({stations[id].role})
                      </div>
                      <div className="text-xs text-[#71869A] font-mono">
                        Index Score: {r.score}/100
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        r.level === 'High'
                          ? 'text-rose-600'
                          : r.level === 'Medium'
                          ? 'text-amber-600'
                          : 'text-[#0D9488]'
                      }`}
                    >
                      {r.level.toUpperCase()} RISK
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#70CFFF]/30 text-xs text-[#71869A]">
            Preliminary rule-based evaluation. Actual ML validation requires a labelled dataset.
          </div>
        </div>

        {/* Recent System Activity */}
        <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#263B50]">
                <Activity className="h-4 w-4 text-[#0D9488]" />
                <span>RECENT MONITORING ACTIVITY</span>
              </div>
              <span className="text-xs font-mono text-[#71869A]">SESSION LOG</span>
            </div>

            <div className="mt-3 divide-y divide-[#70CFFF]/25">
              {activityLog.slice(0, 4).map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs font-mono text-[#71869A]">
                    <span className="font-semibold text-[#0D9488]">{item.module}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#263B50]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#70CFFF]/30 flex items-center justify-between text-xs text-[#71869A]">
            <span>Self-contained local simulation</span>
            <button
              onClick={() => onNavigate('system-architecture')}
              className="font-bold text-[#0D9488] hover:underline cursor-pointer"
            >
              System Architecture →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
