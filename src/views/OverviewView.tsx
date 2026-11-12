import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Droplets, Sparkles, Waves } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
import { MacroWaterCollisionStage } from '../components/MacroWaterCollisionStage';
import { MagneticButton } from '../components/MagneticButton';
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
  hotspots,
  droneObservations,
}) => {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [visualMode, setVisualMode] = useState<'corridor' | 'telemetry'>('corridor');

  const stationBRisk = evaluateStationRisk('B', stations.B.readings);

  const chartGridColor = isNight ? 'rgba(255, 255, 255, 0.07)' : 'rgba(148, 163, 184, 0.2)';
  const chartAxisColor = isNight ? '#9CA3AF' : '#526578';
  const tooltipStyle = {
    backgroundColor: isNight ? 'rgba(20, 22, 27, 0.96)' : 'rgba(255, 255, 255, 0.97)',
    borderColor: isNight ? 'rgba(255, 255, 255, 0.14)' : 'rgba(148, 163, 184, 0.35)',
    borderRadius: '14px',
    fontSize: '12px',
    color: isNight ? '#F3F4F6' : '#182635',
    boxShadow: isNight
      ? '0 20px 44px rgba(0, 0, 0, 0.7)'
      : '0 12px 28px rgba(24, 38, 53, 0.08)',
  };

  const trendChartData = timeSeries.slice(-12).map((pt) => ({
    time: pt.timeLabel,
    'Station A (Upstream)': pt.A.turbidity,
    'Station B (Midstream)': pt.B.turbidity,
    'Station C (Downstream)': pt.C.turbidity,
  }));

  return (
    <div className="space-y-20 sm:space-y-28 py-4 sm:py-8">
      {/* 1. SEAMLESS MULTI-DROPLET FLUID HERO SECTION (Blends Naturally in Day & Night Modes) */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative min-h-[540px] sm:min-h-[600px] flex flex-col justify-between overflow-hidden rounded-[2rem] px-6 py-12 sm:px-14 sm:py-16 text-center transition-colors duration-500"
      >
        {/* 4-Phase Multi-Direction Droplet Convergence, Surface-Tension Merging & Splash Stage */}
        <MacroWaterCollisionStage intensity="hero" interactive={true} />

        {/* Subtle Top Metadata Strip */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-[0.2em] uppercase text-[#71869A] pointer-events-none">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            <span>Hydrological Corridor Telemetry</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[#0D9488]">
            <Droplets className="h-3.5 w-3.5" />
            <span>Multi-Droplet Fluid Physics · Interactive</span>
          </span>
        </div>

        {/* Center Editorial Title & macOS-Precision Magnetic Controls */}
        <div className="relative z-10 mx-auto max-w-3xl my-auto py-10 space-y-7 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-mono tracking-[0.22em] uppercase backdrop-blur-md ${
              isNight
                ? 'border-white/12 bg-[#1A1D23]/80 text-[#58B9C2]'
                : 'border-[#29828A]/25 bg-white/80 text-[#29828A]'
            }`}
          >
            <Waves className="h-3.5 w-3.5" />
            <span>Environmental Hydrological Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-[4.15rem] font-light tracking-[-0.025em] text-[#263B50] leading-[1.08]"
          >
            Where Water Meets{' '}
            <span className="font-serif-editorial italic font-normal text-[#0D9488]">
              Intelligence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-xl text-sm sm:text-base font-normal text-[#52667A] leading-relaxed"
          >
            An integrated environmental framework uniting multi-station water telemetry, preliminary heavy-metal risk screening, spatial GIS mapping, and aerial surface observation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 flex flex-wrap items-center justify-center gap-4 pointer-events-auto"
          >
            <MagneticButton
              variant="primary"
              onClick={() => onNavigate('live-monitoring')}
              className="px-7 py-3.5 text-xs sm:text-sm font-medium tracking-wide"
            >
              <span>Explore Live Monitoring</span>
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={onToggleSimulation}
              className="px-5 py-3.5 text-xs font-mono tracking-wider uppercase"
            >
              <span>
                {isSimulationRunning ? '● Telemetry Stream Active' : '○ Start Live Telemetry Stream'}
              </span>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Bottom Interactive Hint & Station Summary Bar */}
        <div
          className={`relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t text-[11px] font-mono text-[#71869A] pointer-events-none ${
            isNight ? 'border-white/10' : 'border-slate-300/60'
          }`}
        >
          <span>UPSTREAM STN A · MIDSTREAM STN B · DOWNSTREAM STN C</span>
          <span className="inline-flex items-center gap-1.5 text-[#0D9488]">
            <Sparkles className="h-3 w-3" />
            <span>Click anywhere on the fluid stage to trigger an immediate water splash</span>
          </span>
        </div>
      </motion.section>

      {/* 2. FOUR ESSENTIAL ENVIRONMENTAL INDICATORS (Scroll-Triggered Reveal) */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
          <h2 className="text-xs font-mono tracking-[0.22em] uppercase text-[#71869A]">
            Core Corridor Indicators (Simulated Baseline)
          </h2>
          <span className="text-xs font-mono text-[#71869A]">
            Upstream A · Midstream B · Downstream C
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-card rounded-2xl p-6 space-y-3"
          >
            <div className="text-xs font-medium text-[#71869A]">
              Monitored River Corridor
            </div>
            <div className="flex items-baseline justify-between">
              <AnimatedCounter
                value={3}
                suffix=" Stations"
                className="text-3xl font-light tracking-tight text-[#263B50]"
              />
            </div>
            <div className="text-xs text-[#52667A]">
              5 physico-chemical parameters per node
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="glass-card rounded-2xl p-6 space-y-3"
          >
            <div className="text-xs font-medium text-[#71869A]">
              Midstream Peak Turbidity
            </div>
            <div className="flex items-baseline justify-between">
              <AnimatedCounter
                value={stations.B.readings.turbidity}
                decimals={0}
                suffix=" NTU"
                className="text-3xl font-light tracking-tight text-rose-500"
              />
              <span className="text-[11px] font-mono text-rose-500">STN B</span>
            </div>
            <div className="text-xs text-[#52667A]">
              Compared to {stations.A.readings.turbidity} NTU upstream baseline
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.19 }}
            className="glass-card rounded-2xl p-6 space-y-3"
          >
            <div className="text-xs font-medium text-[#71869A]">
              Dissolved Oxygen Minimum
            </div>
            <div className="flex items-baseline justify-between">
              <AnimatedCounter
                value={stations.B.readings.dissolvedOxygen}
                decimals={1}
                suffix=" mg/L"
                className="text-3xl font-light tracking-tight text-[#0D9488]"
              />
              <span className="text-[11px] font-mono text-[#71869A]">STN B</span>
            </div>
            <div className="text-xs text-[#52667A]">
              Recovers to {stations.C.readings.dissolvedOxygen} mg/L downstream
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.26 }}
            className="glass-card rounded-2xl p-6 space-y-3"
          >
            <div className="text-xs font-medium text-[#71869A]">
              Preliminary Risk Screening
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-light tracking-tight text-[#263B50]">
                {stationBRisk.level}{' '}
                <span className="text-lg font-mono text-[#71869A]">
                  ({stationBRisk.score}/100)
                </span>
              </span>
            </div>
            <div className="text-xs text-[#52667A]">
              Station B flagged for laboratory verification
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. ONE UNIFIED SIGNATURE VISUALIZATION */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-3xl p-6 sm:p-10 space-y-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0D9488]">
              Spatial &amp; Temporal Synthesis
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#263B50]">
              Hydrological Corridor &amp; Telemetry Gradient
            </h2>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#70CFFF]/35 bg-[#EDF8FF]/90 p-1 self-start sm:self-auto">
            <button
              onClick={() => setVisualMode('corridor')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                visualMode === 'corridor'
                  ? 'bg-[#20CFC6] text-white'
                  : 'text-[#52667A] hover:text-[#263B50]'
              }`}
            >
              Corridor Schematic
            </button>
            <button
              onClick={() => setVisualMode('telemetry')}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                visualMode === 'telemetry'
                  ? 'bg-[#20CFC6] text-white'
                  : 'text-[#52667A] hover:text-[#263B50]'
              }`}
            >
              Turbidity Gradient (NTU)
            </button>
          </div>
        </div>

        {visualMode === 'corridor' ? (
          <RiverCorridorSvg
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={onSelectStation}
            hotspots={hotspots}
            droneObservations={droneObservations}
            isSimulationRunning={isSimulationRunning}
            compact
          />
        ) : (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendChartData}
                margin={{ top: 10, right: 16, left: -12, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="overviewGradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="overviewGradC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="overviewGradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2B8A8E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2B8A8E" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="time" stroke={chartAxisColor} fontSize={11} />
                <YAxis stroke={chartAxisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: chartAxisColor }} />
                <Area
                  type="monotone"
                  dataKey="Station B (Midstream)"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#overviewGradB)"
                />
                <Area
                  type="monotone"
                  dataKey="Station C (Downstream)"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#overviewGradC)"
                />
                <Area
                  type="monotone"
                  dataKey="Station A (Upstream)"
                  stroke="#2B8A8E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#overviewGradA)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Clean 3-Station Telemetry Strip */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
          {(['A', 'B', 'C'] as StationId[]).map((id) => {
            const st = stations[id];
            const isSelected = selectedStation === id;
            return (
              <div
                key={id}
                onClick={() => onSelectStation(id)}
                className={`rounded-2xl p-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'glass-card border-[#20CFC6]/60'
                    : 'glass-subcard opacity-90 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0D9488] font-medium">STATION {id}</span>
                  <span className={st.isFlagged ? 'text-rose-500' : 'text-[#71869A]'}>
                    {st.isFlagged ? '▲ Flagged Influx' : st.role}
                  </span>
                </div>
                <div className="mt-1.5 text-base font-medium text-[#263B50]">
                  {st.name}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#52667A]">
                  <span>pH {st.readings.ph}</span>
                  <span>{st.readings.temperature}°C</span>
                  <span>{st.readings.turbidity} NTU</span>
                  <span>{st.readings.dissolvedOxygen} mg/L DO</span>
                  <span>{st.readings.conductivity} µS/cm</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* 4. MINIMAL PROJECT OVERVIEW SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-1">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0D9488]">
              Architecture &amp; Scope
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#263B50]">
              Three Pillars of Environmental Intelligence
            </h2>
          </div>
          <button
            onClick={() => onNavigate('about-project')}
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#0D9488] cursor-pointer"
          >
            <span className="nav-link-underline">Read Full Scientific Methodology</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            onClick={() => onNavigate('live-monitoring')}
            className="glass-card rounded-2xl p-7 space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#0D9488]">
              <span>01</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
            <h3 className="text-lg font-medium text-[#263B50]">
              Multi-Node Water Telemetry
            </h3>
            <p className="text-sm text-[#52667A] leading-relaxed">
              Continuous simulated tracking of pH, temperature, turbidity, dissolved oxygen, and electrical conductivity across upstream, midstream, and downstream reaches.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.14 }}
            onClick={() => onNavigate('ai-risk')}
            className="glass-card rounded-2xl p-7 space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#0D9488]">
              <span>02</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
            <h3 className="text-lg font-medium text-[#263B50]">
              Preliminary Risk &amp; Metal Screening
            </h3>
            <p className="text-sm text-[#52667A] leading-relaxed">
              Rule-based anomaly screening paired with a structured ML pipeline framework to prioritize laboratory ICP-MS verification for Lead, Mercury, Arsenic, and Cadmium.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.23 }}
            onClick={() => onNavigate('gis-map')}
            className="glass-card rounded-2xl p-7 space-y-3 cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#0D9488]">
              <span>03</span>
              <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </div>
            <h3 className="text-lg font-medium text-[#263B50]">
              GIS &amp; Aerial Surface Correlation
            </h3>
            <p className="text-sm text-[#52667A] leading-relaxed">
              Spatial river corridor mapping synchronized with aerial surface imagery annotations to correlate visible shoreline waste and discharge plumes with sensor spikes.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
