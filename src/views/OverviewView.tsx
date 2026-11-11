import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Radio,
  ShieldAlert,
  Sliders,
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
  const stationList = [stations.A, stations.B, stations.C];
  const flaggedCount = stationList.filter((s) => s.isFlagged).length;

  // Prepare station comparison data for Recharts
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
      {/* Top Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#20D6D0]/25 bg-[#0B2030] px-5 py-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#20D6D0] font-mono">
            <span>SIMULATED DATA — NOT REAL-TIME FIELD MEASUREMENTS</span>
            <span aria-hidden="true">·</span>
            <span>CURRENT SYSTEM STATUS: SIMULATION MODE</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Environmental Monitoring Command Centre
          </h1>
          <p className="text-sm text-slate-400">
            Integrated IoT telemetry simulation, preliminary rule-based risk evaluation, and geospatial river corridor intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleSimulation}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#20D6D0]/40 bg-[#20D6D0]/10 text-[#20D6D0] hover:bg-[#20D6D0]/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isSimulationRunning ? 'Pause Live Stream' : 'Start Live Stream'}
          </button>
          <button
            onClick={() => onNavigate('live-monitoring')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#20D6D0] text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Station Controller
          </button>
        </div>
      </div>

      {/* 5 Required Command-Centre KPI Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4">
          <div className="text-xs text-slate-400">Total Monitoring Stations</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">3</span>
            <span className="text-xs font-mono text-[#20D6D0]">STN A · B · C</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Upstream, Midstream & Downstream
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4">
          <div className="text-xs text-slate-400">Connected Simulated Stations</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tabular-nums text-[#20D6D0]">3</span>
            <span className="text-xs font-mono text-emerald-400">● 100% LINKED</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Virtual telemetry nodes active
          </div>
        </div>

        <div className="rounded-xl border border-[#FF7068]/40 bg-[#0B2030] p-4">
          <div className="text-xs text-slate-400">Flagged Station</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tabular-nums text-[#FF7068]">
              {flaggedCount}
            </span>
            <span className="text-xs font-mono text-[#FF7068]">▲ STATION B</span>
          </div>
          <div className="mt-2 text-xs text-slate-300">
            Peak Turbidity & Conductivity
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4">
          <div className="text-xs text-slate-400">Water Parameters Monitored</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono tabular-nums text-white">5</span>
            <span className="text-xs font-mono text-slate-300">CORE SENSORS</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            pH · Temp · Turbidity · DO · EC
          </div>
        </div>

        <div className="rounded-xl border border-[#F4B942]/30 bg-[#0B2030] p-4">
          <div className="text-xs text-slate-400">Current System Status</div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold font-mono text-[#F4B942]">
              SIMULATION MODE
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Controlled demo dataset active
          </div>
        </div>
      </div>

      {/* Animated River Visualization & Interactive Station Selector */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Interactive River Corridor & Station Telemetry Preview
            </h2>
            <p className="text-xs text-slate-400">
              Click Station A, B, or C on the river schematic to inspect live simulated measurements, or open the full GIS Pollution Map.
            </p>
          </div>
          <button
            onClick={() => onNavigate('gis-map')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#20D6D0] hover:underline cursor-pointer"
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

      {/* Latest Simulated Readings Across All 3 Stations */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {(['A', 'B', 'C'] as StationId[]).map((id) => {
          const st = stations[id];
          const risk = evaluateStationRisk(id, st.readings);
          const isSelected = selectedStation === id;

          return (
            <div
              key={id}
              onClick={() => onSelectStation(id)}
              className={`rounded-xl border p-5 transition-colors cursor-pointer ${
                st.isFlagged
                  ? 'border-[#FF7068]/60 bg-[#0B2030]'
                  : isSelected
                  ? 'border-[#20D6D0] bg-[#0B2030]'
                  : 'border-slate-800 bg-[#0B2030]/90 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>{st.code}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        st.isFlagged
                          ? 'text-[#FF7068] font-semibold'
                          : id === 'C'
                          ? 'text-[#F4B942]'
                          : 'text-[#20D6D0]'
                      }
                    >
                      {st.isFlagged ? '▲ FLAGGED ANOMALY' : '● CONNECTED'}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-white">{st.name}</h3>
                </div>
                <span
                  className={`text-xs font-mono font-semibold ${
                    risk.level === 'High'
                      ? 'text-[#FF7068]'
                      : risk.level === 'Medium'
                      ? 'text-[#F4B942]'
                      : 'text-[#20D6D0]'
                  }`}
                >
                  RISK: {risk.level.toUpperCase()} ({risk.score}/100)
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 border-t border-slate-800/80 pt-4">
                <div>
                  <div className="text-xs text-slate-400">pH</div>
                  <div className="mt-0.5 text-lg font-bold font-mono tabular-nums text-white">
                    {st.readings.ph}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Temperature</div>
                  <div className="mt-0.5 text-lg font-bold font-mono tabular-nums text-white">
                    {st.readings.temperature}
                    <span className="ml-1 text-xs font-normal text-slate-400">°C</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Turbidity</div>
                  <div
                    className={`mt-0.5 text-lg font-bold font-mono tabular-nums ${
                      st.readings.turbidity >= 28 ? 'text-[#FF7068]' : 'text-white'
                    }`}
                  >
                    {st.readings.turbidity}
                    <span className="ml-1 text-xs font-normal text-slate-400">NTU</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Dissolved O₂</div>
                  <div
                    className={`mt-0.5 text-lg font-bold font-mono tabular-nums ${
                      st.readings.dissolvedOxygen <= 5.2 ? 'text-[#FF7068]' : 'text-white'
                    }`}
                  >
                    {st.readings.dissolvedOxygen}
                    <span className="ml-1 text-xs font-normal text-slate-400">mg/L</span>
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-2">
                  <div className="text-xs text-slate-400">Electrical Conductivity</div>
                  <div
                    className={`mt-0.5 text-lg font-bold font-mono tabular-nums ${
                      st.readings.conductivity >= 550 ? 'text-[#F4B942]' : 'text-white'
                    }`}
                  >
                    {st.readings.conductivity}
                    <span className="ml-1 text-xs font-normal text-slate-400">µS/cm</span>
                  </div>
                </div>
              </div>

              {st.highlightSummary && (
                <div className="mt-3 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                  {st.highlightSummary.join(' · ')}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Row: Station Comparison Chart & Water Quality Trends */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Multi-Parameter Station Comparison */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Cross-Station Parameter Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Normalized comparison of Turbidity (NTU), Dissolved O₂ (×10 mg/L), and Conductivity (÷10 µS/cm)
              </p>
            </div>
            <button
              onClick={() => onNavigate('water-analytics')}
              className="text-xs font-medium text-[#20D6D0] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              Full Analytics →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} margin={{ top: 10, right: 16, left: -12, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#061421',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F1F5F9',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Turbidity" fill="#FF7068" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Dissolved O₂ (×10)" fill="#20D6D0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Conductivity (÷10)" fill="#F4B942" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Simulated Turbidity Trend */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Water Quality Trend — Turbidity (NTU)
              </h3>
              <p className="text-xs text-slate-400">
                Simulated temporal progression across Upstream (A), Midstream (B), and Downstream (C)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">DEMO TIME SERIES</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData} margin={{ top: 10, right: 16, left: -12, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF7068" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF7068" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F4B942" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F4B942" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#061421',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F1F5F9',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="Station B"
                  stroke="#FF7068"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradB)"
                />
                <Area
                  type="monotone"
                  dataKey="Station C"
                  stroke="#F4B942"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradC)"
                />
                <Area
                  type="monotone"
                  dataKey="Station A"
                  stroke="#20D6D0"
                  strokeWidth={2}
                  fillOpacity={0.1}
                  fill="#20D6D0"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 3-Column Row: Pollution Alert Panel, AI Risk Overview, and Recent System Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pollution Alert Panel */}
        <div className="rounded-xl border border-[#FF7068]/40 bg-[#0B2030] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF7068]">
                <AlertTriangle className="h-4 w-4" />
                <span>ACTIVE DEMONSTRATION ALERT</span>
              </div>
              <button
                onClick={() => onNavigate('alerts-reports')}
                className="text-xs font-medium text-[#20D6D0] hover:underline cursor-pointer"
              >
                All Alerts ({alerts.length}) →
              </button>
            </div>

            <h3 className="mt-3 text-base font-bold text-white">
              Station B — Midstream Anomaly Flagged
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              Station B shows the highest turbidity ({stations.B.readings.turbidity} NTU) and conductivity ({stations.B.readings.conductivity} µS/cm) and the lowest dissolved oxygen ({stations.B.readings.dissolvedOxygen} mg/L) among the three simulated stations. Further investigation is recommended.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Severity: High Priority</span>
            <button
              onClick={() => {
                onSelectStation('B');
                onNavigate('live-monitoring');
              }}
              className="font-semibold text-[#FF7068] hover:underline cursor-pointer"
            >
              Inspect Station B →
            </button>
          </div>
        </div>

        {/* AI Preliminary Risk Overview */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#20D6D0]">
                <ShieldAlert className="h-4 w-4" />
                <span>RULE-BASED PRELIMINARY RISK</span>
              </div>
              <button
                onClick={() => onNavigate('ai-risk')}
                className="text-xs font-medium text-[#20D6D0] hover:underline cursor-pointer"
              >
                ML Workflow →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {(['A', 'B', 'C'] as StationId[]).map((id) => {
                const r = evaluateStationRisk(id, stations[id].readings);
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border border-slate-800/90 bg-[#061421]/60 px-3.5 py-2.5"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Station {id} ({stations[id].role})
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Index Score: {r.score}/100
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        r.level === 'High'
                          ? 'text-[#FF7068]'
                          : r.level === 'Medium'
                          ? 'text-[#F4B942]'
                          : 'text-[#20D6D0]'
                      }`}
                    >
                      {r.level.toUpperCase()} RISK
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            Preliminary rule-based evaluation. Actual ML validation requires a labelled dataset.
          </div>
        </div>

        {/* Recent System Activity */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Activity className="h-4 w-4 text-[#20D6D0]" />
                <span>RECENT SIMULATION ACTIVITY</span>
              </div>
              <span className="text-xs font-mono text-slate-500">LOCAL LOG</span>
            </div>

            <div className="mt-3 divide-y divide-slate-800/80">
              {activityLog.slice(0, 4).map((item) => (
                <div key={item.id} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-[#20D6D0]">{item.module}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-200">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Self-contained local session</span>
            <button
              onClick={() => onNavigate('system-architecture')}
              className="text-[#20D6D0] hover:underline cursor-pointer"
            >
              View System Architecture →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
