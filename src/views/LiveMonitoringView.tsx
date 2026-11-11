import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
} from 'lucide-react';
import {
  StationData,
  StationId,
  WaterReadings,
  ParameterKey,
} from '../types/monitoring';
import { PARAMETER_METADATA, evaluateStationRisk } from '../data/initialData';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface LiveMonitoringViewProps {
  stations: Record<StationId, StationData>;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
  isSimulationRunning: boolean;
  simulationSpeedMs: number;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onResetSimulation: () => void;
  onChangeSpeed: (ms: number) => void;
  onManualUpdateReadings: (stationId: StationId, readings: WaterReadings) => void;
  onGenerateSingleStepReading: () => void;
}

export const LiveMonitoringView: React.FC<LiveMonitoringViewProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  isSimulationRunning,
  simulationSpeedMs,
  onStartSimulation,
  onPauseSimulation,
  onResetSimulation,
  onChangeSpeed,
  onManualUpdateReadings,
  onGenerateSingleStepReading,
}) => {
  const activeStation = stations[selectedStation];
  const activeRisk = evaluateStationRisk(selectedStation, activeStation.readings);

  const [editMode, setEditMode] = useState(false);
  const [draftReadings, setDraftReadings] = useState<WaterReadings>(activeStation.readings);

  const handleOpenEdit = (stId: StationId) => {
    onSelectStation(stId);
    setDraftReadings({ ...stations[stId].readings });
    setEditMode(true);
  };

  const handleApplyManualEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onManualUpdateReadings(selectedStation, draftReadings);
    setEditMode(false);
  };

  const handleSliderChange = (key: ParameterKey, val: number) => {
    const next = {
      ...activeStation.readings,
      [key]: val,
    };
    onManualUpdateReadings(selectedStation, next);
  };

  return (
    <div className="space-y-6">
      {/* Header & Glassmorphism Simulation Controller Bar */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#0D9488]">
              <span>SIMULATED IOT TELEMETRY CONTROLLER</span>
              <span aria-hidden="true" className="text-[#71869A]">·</span>
              <span className="text-[#0284C7]">
                STREAM STATE: {isSimulationRunning ? 'ACTIVE VARIATION' : 'PAUSED / MANUAL'}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-extrabold text-[#263B50] sm:text-2xl">
              Live Water-Quality Monitoring &amp; Simulation Console
            </h1>
            <p className="mt-1 text-sm text-[#52667A]">
              Control simulated IoT sensor streams, switch between stations, trigger demonstration readings, or manually adjust water parameters.
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isSimulationRunning ? (
              <button
                onClick={onStartSimulation}
                className="min-h-[42px] inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_20px_-6px_rgba(32,207,198,0.55)] hover:opacity-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start / Resume Simulation</span>
              </button>
            ) : (
              <button
                onClick={onPauseSimulation}
                className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-amber-400 bg-amber-50/90 px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Pause Simulation</span>
              </button>
            )}

            <button
              onClick={onGenerateSingleStepReading}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-[#20CFC6]/50 bg-white/85 px-3.5 py-2 text-xs font-bold text-[#0D9488] hover:bg-[#EDF8FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Demo Reading</span>
            </button>

            <button
              onClick={onResetSimulation}
              className="min-h-[42px] inline-flex items-center gap-2 rounded-xl border border-[#70CFFF]/50 bg-white/80 px-3.5 py-2 text-xs font-semibold text-[#263B50] hover:bg-[#EDF8FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-[#0284C7]" />
              <span>Reset to Exact Baseline</span>
            </button>
          </div>
        </div>

        {/* Simulation Speed & Station Quick Switcher Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#70CFFF]/30 pt-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#52667A] font-semibold">Simulation Speed:</span>
            <div className="flex items-center gap-1 rounded-xl bg-[#EDF8FF]/90 p-1 border border-[#70CFFF]/35">
              {[
                { label: 'Slow (4.0s)', ms: 4000 },
                { label: 'Normal (2.2s)', ms: 2200 },
                { label: 'Fast (1.0s)', ms: 1000 },
              ].map((opt) => (
                <button
                  key={opt.ms}
                  onClick={() => onChangeSpeed(opt.ms)}
                  className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    simulationSpeedMs === opt.ms
                      ? 'bg-[#20CFC6] text-white font-bold shadow-xs'
                      : 'text-[#52667A] hover:text-[#263B50]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#52667A] font-semibold">Inspect Station Detail:</span>
            <div className="flex items-center gap-1 rounded-xl bg-[#EDF8FF]/90 p-1 border border-[#70CFFF]/35">
              {(['A', 'B', 'C'] as StationId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    onSelectStation(id);
                    setDraftReadings({ ...stations[id].readings });
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedStation === id
                      ? 'bg-[#20CFC6] text-white shadow-xs'
                      : 'text-[#52667A] hover:text-[#263B50]'
                  }`}
                >
                  Station {id} {id === 'B' ? '▲' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Interactive Glassmorphism Monitoring Station Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {(['A', 'B', 'C'] as StationId[]).map((id, idx) => {
          const st = stations[id];
          const isSelected = selectedStation === id;
          const isStationB = id === 'B';

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              onClick={() => {
                onSelectStation(id);
                setDraftReadings({ ...stations[id].readings });
              }}
              className={`glass-card rounded-2xl p-5 cursor-pointer ${
                isStationB
                  ? 'border-rose-300/80 ring-1 ring-rose-200/70'
                  : isSelected
                  ? 'border-[#20CFC6] ring-2 ring-[#20CFC6]/30'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span
                      className={
                        isSimulationRunning
                          ? 'text-emerald-600 font-bold'
                          : 'text-[#0284C7] font-semibold'
                      }
                    >
                      {isSimulationRunning ? '● LIVE SIMULATED LINK' : '● PAUSED SNAPSHOT'}
                    </span>
                    <span aria-hidden="true" className="text-[#71869A]">·</span>
                    <span className="text-[#71869A]">{st.sensorLatencyMs} ms</span>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-[#263B50]">{st.name}</h2>
                  <p className="text-xs text-[#71869A]">{st.schematicCoords.label}</p>
                </div>

                {isStationB && (
                  <span className="text-xs font-mono font-bold text-rose-600 whitespace-nowrap shrink-0">
                    ▲ FLAGGED STATION
                  </span>
                )}
              </div>

              {/* Station B Mandatory Highlights */}
              {isStationB && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/80 px-3.5 py-2.5 text-xs text-[#263B50]">
                  <div className="font-bold text-rose-600">
                    Key Anomaly Highlights (Station B):
                  </div>
                  <div className="mt-1 text-[#52667A]">
                    Highest Turbidity ({st.readings.turbidity} NTU) · Highest Electrical Conductivity ({st.readings.conductivity} µS/cm) · Lowest Dissolved Oxygen ({st.readings.dissolvedOxygen} mg/L)
                  </div>
                </div>
              )}

              {/* 5 Parameter Readout Rows */}
              <div className="mt-4 divide-y divide-[#70CFFF]/25 border-t border-[#70CFFF]/30">
                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-[#52667A]">pH</span>
                  <div className="font-mono tabular-nums">
                    <AnimatedCounter
                      value={st.readings.ph}
                      decimals={1}
                      className="font-bold text-[#263B50]"
                    />
                    <span className="ml-2 text-xs text-[#71869A]">
                      (Base: {st.baselineReadings.ph})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-[#52667A]">Temperature</span>
                  <div className="font-mono tabular-nums">
                    <AnimatedCounter
                      value={st.readings.temperature}
                      decimals={1}
                      suffix="°C"
                      className="font-bold text-[#263B50]"
                    />
                    <span className="ml-2 text-xs text-[#71869A]">
                      (Base: {st.baselineReadings.temperature}°C)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-[#52667A]">Turbidity</span>
                  <div className="font-mono tabular-nums">
                    <AnimatedCounter
                      value={st.readings.turbidity}
                      decimals={0}
                      suffix=" NTU"
                      className={`font-bold ${
                        isStationB ? 'text-rose-600' : 'text-[#263B50]'
                      }`}
                    />
                    <span className="ml-2 text-xs text-[#71869A]">
                      (Base: {st.baselineReadings.turbidity} NTU)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-[#52667A]">Dissolved Oxygen</span>
                  <div className="font-mono tabular-nums">
                    <AnimatedCounter
                      value={st.readings.dissolvedOxygen}
                      decimals={1}
                      suffix=" mg/L"
                      className={`font-bold ${
                        isStationB ? 'text-rose-600' : 'text-[#0D9488]'
                      }`}
                    />
                    <span className="ml-2 text-xs text-[#71869A]">
                      (Base: {st.baselineReadings.dissolvedOxygen} mg/L)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-[#52667A]">Electrical Conductivity</span>
                  <div className="font-mono tabular-nums">
                    <AnimatedCounter
                      value={st.readings.conductivity}
                      decimals={0}
                      suffix=" µS/cm"
                      className={`font-bold ${
                        isStationB ? 'text-amber-600' : 'text-[#0284C7]'
                      }`}
                    />
                    <span className="ml-2 text-xs text-[#71869A]">
                      (Base: {st.baselineReadings.conductivity} µS/cm)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#70CFFF]/25">
                <span className="text-xs font-mono text-[#71869A]">
                  Updated: {st.lastUpdated} (Simulated)
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(id);
                  }}
                  className="text-xs font-bold text-[#0D9488] hover:underline cursor-pointer"
                >
                  Edit Parameters →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed Monitoring & Interactive Parameter Calibration Console for Selected Station */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#70CFFF]/30 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0D9488]">
              <span>DETAILED STATION TELEMETRY &amp; MANUAL OVERRIDE</span>
              <span aria-hidden="true" className="text-[#71869A]">·</span>
              <span className="text-[#0284C7]">SELECTED: {activeStation.code}</span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-[#263B50]">
              {activeStation.name} — Interactive Sensor Array
            </h3>
            <p className="mt-1 text-sm text-[#52667A] max-w-3xl">
              {activeStation.zoneDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDraftReadings({ ...activeStation.readings });
                setEditMode(!editMode);
              }}
              className="min-h-[40px] inline-flex items-center gap-2 rounded-xl border border-[#20CFC6]/50 bg-white/85 px-4 py-2 text-xs font-bold text-[#0D9488] hover:bg-[#EDF8FF] transition-colors cursor-pointer"
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{editMode ? 'Close Numeric Form' : 'Open Numeric Input Form'}</span>
            </button>
          </div>
        </div>

        {/* Optional Numeric Form Override */}
        {editMode && (
          <form
            onSubmit={handleApplyManualEdit}
            className="mt-4 glass-subcard rounded-2xl p-4 sm:p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-[#0D9488]">
                DIRECT NUMERIC OVERRIDE FOR STATION {selectedStation} (SIMULATED)
              </span>
              <span className="text-xs text-[#71869A]">
                Press Apply to update charts &amp; risk engine
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div>
                <label className="block text-xs font-semibold text-[#263B50] mb-1">
                  pH (4.5 – 9.5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="4.5"
                  max="9.5"
                  value={draftReadings.ph}
                  onChange={(e) =>
                    setDraftReadings({ ...draftReadings, ph: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-sm font-mono text-[#263B50]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#263B50] mb-1">
                  Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="10"
                  max="40"
                  value={draftReadings.temperature}
                  onChange={(e) =>
                    setDraftReadings({ ...draftReadings, temperature: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-sm font-mono text-[#263B50]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#263B50] mb-1">
                  Turbidity (NTU)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={draftReadings.turbidity}
                  onChange={(e) =>
                    setDraftReadings({ ...draftReadings, turbidity: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-sm font-mono text-[#263B50]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#263B50] mb-1">
                  Dissolved O₂ (mg/L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="14"
                  value={draftReadings.dissolvedOxygen}
                  onChange={(e) =>
                    setDraftReadings({
                      ...draftReadings,
                      dissolvedOxygen: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-sm font-mono text-[#263B50]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#263B50] mb-1">
                  Conductivity (µS/cm)
                </label>
                <input
                  type="number"
                  step="10"
                  min="50"
                  max="1500"
                  value={draftReadings.conductivity}
                  onChange={(e) =>
                    setDraftReadings({
                      ...draftReadings,
                      conductivity: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-sm font-mono text-[#263B50]"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="rounded-xl border border-[#70CFFF]/50 bg-white px-3.5 py-1.5 text-xs font-semibold text-[#52667A] hover:text-[#263B50] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-4 py-1.5 text-xs font-bold text-white hover:opacity-95 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Apply Simulated Readings</span>
              </button>
            </div>
          </form>
        )}

        {/* Interactive Parameter Sliders & Real-Time Risk Feedback */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-sm font-bold text-[#263B50]">
              Interactive Sensor Scrubbers (Drag to test sensitivity on Station {selectedStation})
            </h4>

            {(Object.keys(PARAMETER_METADATA) as ParameterKey[]).map((key) => {
              const meta = PARAMETER_METADATA[key];
              const currentVal = activeStation.readings[key];
              const baseVal = activeStation.baselineReadings[key];

              return (
                <div
                  key={key}
                  className="glass-subcard rounded-xl p-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-bold text-[#263B50]">{meta.label}</span>
                      <span className="ml-2 text-[#71869A]">({meta.sensorPrinciple})</span>
                    </div>
                    <div className="font-mono tabular-nums">
                      <span className="text-sm font-bold text-[#0D9488]">
                        {currentVal} {meta.unit}
                      </span>
                      <span className="ml-2 text-[#71869A]">
                        [Baseline: {baseVal} {meta.unit}]
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <span className="text-xs font-mono text-[#71869A] w-10">
                      {meta.minRange}
                    </span>
                    <input
                      type="range"
                      min={meta.minRange}
                      max={meta.maxRange}
                      step={meta.step}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(key, Number(e.target.value))}
                      className="w-full accent-[#20CFC6] cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#71869A] w-12 text-right">
                      {meta.maxRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Preliminary Risk Impact Box for Selected Station */}
          <div className="glass-subcard rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                STATION {selectedStation} DIAGNOSTIC SUMMARY
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-base font-bold text-[#263B50]">Preliminary Risk:</span>
                <span
                  className={`text-xl font-mono font-extrabold ${
                    activeRisk.level === 'High'
                      ? 'text-rose-600'
                      : activeRisk.level === 'Medium'
                      ? 'text-amber-600'
                      : 'text-[#0D9488]'
                  }`}
                >
                  {activeRisk.level.toUpperCase()} ({activeRisk.score}/100)
                </span>
              </div>

              <div className="mt-4 space-y-2.5 border-t border-[#70CFFF]/30 pt-4">
                <div className="text-xs font-bold text-[#263B50]">
                  Active Rule Evaluations:
                </div>
                {activeRisk.reasons.map((reason, idx) => (
                  <p key={idx} className="text-xs text-[#52667A] leading-relaxed">
                    • {reason}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-[#70CFFF]/30 pt-3 text-xs text-[#71869A]">
              All values displayed are simulated for academic demonstration. Use Reset to restore the exact project table dataset.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
