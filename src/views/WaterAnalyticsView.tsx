import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  StationData,
  StationId,
  TimeSeriesPoint,
  ParameterKey,
} from '../types/monitoring';
import { PARAMETER_METADATA } from '../data/initialData';
import { useTheme } from '../context/ThemeContext';

interface WaterAnalyticsViewProps {
  stations: Record<StationId, StationData>;
  timeSeries: TimeSeriesPoint[];
}

export const WaterAnalyticsView: React.FC<WaterAnalyticsViewProps> = ({
  stations,
  timeSeries,
}) => {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const chartGridColor = isNight ? 'rgba(255, 255, 255, 0.08)' : '#D8EEF8';
  const chartAxisColor = isNight ? '#9CA3AF' : '#52667A';
  const tooltipStyle = {
    backgroundColor: isNight ? 'rgba(20, 22, 27, 0.96)' : 'rgba(255, 255, 255, 0.96)',
    borderColor: isNight ? 'rgba(255, 255, 255, 0.14)' : '#70CFFF',
    borderRadius: '12px',
    fontSize: '12px',
    color: isNight ? '#F3F4F6' : '#263B50',
  };

  const [selectedParam, setSelectedParam] = useState<ParameterKey>('turbidity');
  const [timeWindow, setTimeWindow] = useState<'6' | '10' | '16'>('16');
  const [customDemoThreshold, setCustomDemoThreshold] = useState<Record<ParameterKey, number>>({
    ph: 6.8,
    temperature: 28,
    turbidity: 25,
    dissolvedOxygen: 5.5,
    conductivity: 500,
  });

  const slicedSeries = timeSeries.slice(-Number(timeWindow));
  const activeMeta = PARAMETER_METADATA[selectedParam];

  const parameterKeys: ParameterKey[] = [
    'ph',
    'temperature',
    'turbidity',
    'dissolvedOxygen',
    'conductivity',
  ];

  const buildSeriesForParam = (param: ParameterKey) =>
    slicedSeries.map((pt) => ({
      time: pt.timeLabel,
      'Station A (Upstream)': pt.A[param],
      'Station B (Midstream)': pt.B[param],
      'Station C (Downstream)': pt.C[param],
    }));

  const buildSnapshotComparison = (param: ParameterKey) => [
    {
      station: 'Station A',
      value: stations.A.readings[param],
      baseline: stations.A.baselineReadings[param],
    },
    {
      station: 'Station B',
      value: stations.B.readings[param],
      baseline: stations.B.baselineReadings[param],
    },
    {
      station: 'Station C',
      value: stations.C.readings[param],
      baseline: stations.C.baselineReadings[param],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#0D9488]">
              <span>MULTI-PARAMETER HYDROLOGICAL ANALYTICS</span>
              <span aria-hidden="true" className="text-[#71869A]">·</span>
              <span className="text-[#0284C7]">SIMULATED DEMONSTRATION DATASET</span>
            </div>
            <h1 className="mt-1 text-xl font-extrabold text-[#263B50] sm:text-2xl">
              Water Quality Parameter Analytics &amp; Station Comparison
            </h1>
            <p className="mt-1 text-sm text-[#52667A]">
              Analyze temporal variations and cross-station gradients across all five simulated water-quality parameters.
            </p>
          </div>

          {/* Time-Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#52667A]">Demo Time Window:</span>
            <div className="flex items-center gap-1 rounded-xl border border-[#70CFFF]/40 bg-[#EDF8FF]/90 p-1">
              {[
                { key: '6', label: 'Recent (6 pts)' },
                { key: '10', label: 'Medium (10 pts)' },
                { key: '16', label: 'Full Window (16 pts)' },
              ].map((w) => (
                <button
                  key={w.key}
                  onClick={() => setTimeWindow(w.key as '6' | '10' | '16')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    timeWindow === w.key
                      ? 'bg-[#20CFC6] text-white font-bold shadow-xs'
                      : 'text-[#52667A] hover:text-[#263B50]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parameter Selector Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#70CFFF]/30 pt-4">
          <span className="text-xs font-semibold text-[#52667A] mr-1">
            Primary Parameter Focus:
          </span>
          {parameterKeys.map((key) => {
            const meta = PARAMETER_METADATA[key];
            const isSelected = selectedParam === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedParam(key)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] text-white shadow-[0_6px_16px_-4px_rgba(32,207,198,0.5)]'
                    : 'border border-[#70CFFF]/40 bg-white/80 text-[#52667A] hover:border-[#20CFC6] hover:text-[#263B50]'
                }`}
              >
                {meta.label} ({meta.unit})
              </button>
            );
          })}
        </div>
      </div>

      {/* Focused Parameter Deep-Dive Row: Time-Series + Parameter Detail Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Primary Interactive Graph */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#263B50]">
                {activeMeta.label} Variation — Station A vs B vs C ({activeMeta.unit})
              </h2>
              <p className="text-xs text-[#71869A]">
                Dashed line indicates configurable demonstration reference value (not an official regulatory threshold).
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <label className="text-[#52667A] font-semibold">Configurable Demo Ref:</label>
              <input
                type="number"
                step={activeMeta.step}
                value={customDemoThreshold[selectedParam]}
                onChange={(e) =>
                  setCustomDemoThreshold({
                    ...customDemoThreshold,
                    [selectedParam]: Number(e.target.value),
                  })
                }
                className="w-20 rounded-lg border border-[#70CFFF]/60 bg-white px-2.5 py-1 text-xs font-mono font-bold text-[#0D9488]"
              />
              <span className="text-[#71869A]">{activeMeta.unit}</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={buildSeriesForParam(selectedParam)}
                margin={{ top: 12, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis dataKey="time" stroke={chartAxisColor} fontSize={11} />
                <YAxis stroke={chartAxisColor} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', color: chartAxisColor }} />
                <ReferenceLine
                  y={customDemoThreshold[selectedParam]}
                  stroke="#F59E0B"
                  strokeDasharray="5 5"
                  label={{
                    value: `Demo Ref: ${customDemoThreshold[selectedParam]} ${activeMeta.unit}`,
                    fill: '#F59E0B',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Station A (Upstream)"
                  stroke="#20CFC6"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Station B (Midstream)"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Station C (Downstream)"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Scientific Explanation Panel */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                PARAMETER SCIENTIFIC BRIEF
              </div>
              <h3 className="mt-1 text-lg font-bold text-[#263B50]">
                {activeMeta.label} ({activeMeta.unit})
              </h3>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#263B50]">What It Measures</div>
              <p className="text-xs text-[#52667A] leading-relaxed">
                {activeMeta.whatItMeasures}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#263B50]">
                Why It Matters in River Monitoring
              </div>
              <p className="text-xs text-[#52667A] leading-relaxed">
                {activeMeta.whyItMatters}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-[#263B50]">
                Current Simulated Station Values
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {(['A', 'B', 'C'] as StationId[]).map((id) => (
                  <div
                    key={id}
                    className="glass-subcard rounded-xl p-2.5"
                  >
                    <div className="text-xs font-medium text-[#71869A]">Station {id}</div>
                    <div className="mt-1 text-sm font-extrabold font-mono tabular-nums text-[#263B50]">
                      {stations[id].readings[selectedParam]}
                    </div>
                    <div className="text-[11px] font-mono text-[#0D9488]">
                      {activeMeta.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-[#70CFFF]/30 pt-3 text-xs text-[#71869A]">
            Note: Illustrative reference lines shown on charts are user-configurable demonstration values for comparing upstream vs. midstream changes, not statutory water-quality standards.
          </div>
        </div>
      </div>

      {/* All 5 Individual Parameter Interactive Graphs */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#263B50]">
            Complete Five-Parameter Interactive Graph Matrix (Station A vs B vs C)
          </h2>
          <p className="text-xs text-[#71869A]">
            Simultaneous temporal variation and current vs. baseline bar comparisons for pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {parameterKeys.map((paramKey, idx) => {
            const meta = PARAMETER_METADATA[paramKey];
            const seriesData = buildSeriesForParam(paramKey);
            const barData = buildSnapshotComparison(paramKey);

            return (
              <motion.div
                key={paramKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#70CFFF]/30 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#263B50]">
                      {meta.label} Variation ({meta.unit})
                    </h3>
                    <p className="text-xs font-medium text-[#71869A]">
                      A: {stations.A.readings[paramKey]} · B: {stations.B.readings[paramKey]} · C:{' '}
                      {stations.C.readings[paramKey]} {meta.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedParam(paramKey)}
                    className="text-xs font-mono font-bold text-[#0D9488] hover:underline cursor-pointer"
                  >
                    Focus Above ↑
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Line Variation Chart */}
                  <div className="sm:col-span-2 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={seriesData} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                        <XAxis dataKey="time" stroke={chartAxisColor} fontSize={10} />
                        <YAxis stroke={chartAxisColor} fontSize={10} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: '11px', color: chartAxisColor }} />
                        <Line
                          type="monotone"
                          dataKey="Station A (Upstream)"
                          stroke="#20CFC6"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Station B (Midstream)"
                          stroke="#F43F5E"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Station C (Downstream)"
                          stroke="#38BDF8"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Direct Station A vs B vs C Bar Comparison */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                        <XAxis dataKey="station" stroke={chartAxisColor} fontSize={10} />
                        <YAxis stroke={chartAxisColor} fontSize={10} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="value" name="Current" fill="#20CFC6" radius={[5, 5, 0, 0]} />
                        <Bar
                          dataKey="baseline"
                          name="Baseline"
                          fill="#94A3B8"
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
