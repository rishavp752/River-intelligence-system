import React, { useState } from 'react';
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

interface WaterAnalyticsViewProps {
  stations: Record<StationId, StationData>;
  timeSeries: TimeSeriesPoint[];
}

export const WaterAnalyticsView: React.FC<WaterAnalyticsViewProps> = ({
  stations,
  timeSeries,
}) => {
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
      <div className="rounded-xl border border-[#20D6D0]/30 bg-[#0B2030] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#20D6D0]">
              <span>MULTI-PARAMETER HYDROLOGICAL ANALYTICS</span>
              <span aria-hidden="true">·</span>
              <span>SIMULATED DEMONSTRATION DATASET</span>
            </div>
            <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Water Quality Parameter Analytics & Station Comparison
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Analyze temporal variations and cross-station gradients across all five simulated water-quality parameters.
            </p>
          </div>

          {/* Time-Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Demo Time Window:</span>
            <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-[#061421] p-1">
              {[
                { key: '6', label: 'Recent (6 pts)' },
                { key: '10', label: 'Medium (10 pts)' },
                { key: '16', label: 'Full Window (16 pts)' },
              ].map((w) => (
                <button
                  key={w.key}
                  onClick={() => setTimeWindow(w.key as '6' | '10' | '16')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    timeWindow === w.key
                      ? 'bg-[#20D6D0] text-[#061421] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parameter Selector Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
          <span className="text-xs font-medium text-slate-400 mr-1">
            Primary Parameter Focus:
          </span>
          {parameterKeys.map((key) => {
            const meta = PARAMETER_METADATA[key];
            const isSelected = selectedParam === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedParam(key)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#20D6D0] text-[#061421]'
                    : 'border border-slate-800 bg-[#061421] text-slate-300 hover:border-slate-700 hover:text-white'
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
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0B2030] p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white">
                {activeMeta.label} Variation — Station A vs B vs C ({activeMeta.unit})
              </h2>
              <p className="text-xs text-slate-400">
                Dashed line indicates configurable demonstration reference value (not an official regulatory threshold).
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <label className="text-slate-400">Configurable Demo Ref:</label>
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
                className="w-20 rounded border border-slate-700 bg-[#061421] px-2 py-1 text-xs font-mono text-[#20D6D0]"
              />
              <span className="text-slate-400">{activeMeta.unit}</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={buildSeriesForParam(selectedParam)}
                margin={{ top: 12, right: 20, left: -10, bottom: 5 }}
              >
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
                <ReferenceLine
                  y={customDemoThreshold[selectedParam]}
                  stroke="#F4B942"
                  strokeDasharray="5 5"
                  label={{
                    value: `Demo Ref: ${customDemoThreshold[selectedParam]} ${activeMeta.unit}`,
                    fill: '#F4B942',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Station A (Upstream)"
                  stroke="#20D6D0"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Station B (Midstream)"
                  stroke="#FF7068"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="Station C (Downstream)"
                  stroke="#F4B942"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parameter Scientific Explanation Panel */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono text-[#20D6D0]">
                PARAMETER SCIENTIFIC BRIEF
              </div>
              <h3 className="mt-1 text-lg font-bold text-white">
                {activeMeta.label} ({activeMeta.unit})
              </h3>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-300">What It Measures</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeMeta.whatItMeasures}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-300">
                Why It Matters in River Monitoring
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {activeMeta.whyItMatters}
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-300">
                Current Simulated Station Values
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {(['A', 'B', 'C'] as StationId[]).map((id) => (
                  <div
                    key={id}
                    className="rounded-lg border border-slate-800 bg-[#061421] p-2.5"
                  >
                    <div className="text-xs text-slate-400">Station {id}</div>
                    <div className="mt-1 text-sm font-bold font-mono tabular-nums text-white">
                      {stations[id].readings[selectedParam]}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      {activeMeta.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-400">
            Note: Illustrative reference lines shown on charts are user-configurable demonstration values for comparing upstream vs. midstream changes, not statutory water-quality standards.
          </div>
        </div>
      </div>

      {/* All 5 Individual Parameter Interactive Graphs (Mandatory Section 6 Requirement) */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-white">
            Complete Five-Parameter Interactive Graph Matrix (Station A vs B vs C)
          </h2>
          <p className="text-xs text-slate-400">
            Simultaneous temporal variation and current vs. baseline bar comparisons for pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {parameterKeys.map((paramKey) => {
            const meta = PARAMETER_METADATA[paramKey];
            const seriesData = buildSeriesForParam(paramKey);
            const barData = buildSnapshotComparison(paramKey);

            return (
              <div
                key={paramKey}
                className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {meta.label} Variation ({meta.unit})
                    </h3>
                    <p className="text-xs text-slate-400">
                      A: {stations.A.readings[paramKey]} · B: {stations.B.readings[paramKey]} · C:{' '}
                      {stations.C.readings[paramKey]} {meta.unit}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedParam(paramKey)}
                    className="text-xs font-mono text-[#20D6D0] hover:underline cursor-pointer"
                  >
                    Focus Above ↑
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Line Variation Chart */}
                  <div className="sm:col-span-2 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={seriesData} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                        <YAxis stroke="#94A3B8" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#061421',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: '#F1F5F9',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Line
                          type="monotone"
                          dataKey="Station A (Upstream)"
                          stroke="#20D6D0"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Station B (Midstream)"
                          stroke="#FF7068"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Station C (Downstream)"
                          stroke="#F4B942"
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="station" stroke="#94A3B8" fontSize={10} />
                        <YAxis stroke="#94A3B8" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#061421',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: '#F1F5F9',
                          }}
                        />
                        <Bar dataKey="value" name="Current" fill="#20D6D0" radius={[4, 4, 0, 0]} />
                        <Bar
                          dataKey="baseline"
                          name="Baseline"
                          fill="#475569"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
