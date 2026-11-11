import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Check,
  Radio,
  AlertTriangle,
} from 'lucide-react';
import {
  StationData,
  StationId,
  WaterReadings,
  ParameterKey,
} from '../types/monitoring';
import { PARAMETER_METADATA, evaluateStationRisk } from '../data/initialData';

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
      {/* Header & Simulation Controller Bar */}
      <div className="rounded-xl border border-[#20D6D0]/30 bg-[#0B2030] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#20D6D0]">
              <span>SIMULATED IOT TELEMETRY CONTROLLER</span>
              <span aria-hidden="true">·</span>
              <span>
                STREAM STATE: {isSimulationRunning ? 'ACTIVE VARIATION' : 'PAUSED / MANUAL'}
              </span>
            </div>
            <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Live Water-Quality Monitoring & Simulation Console
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Control simulated IoT sensor streams, switch between stations, trigger demonstration readings, or manually adjust water parameters.
            </p>
          </div>

          {/* Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isSimulationRunning ? (
              <button
                onClick={onStartSimulation}
                className="inline-flex items-center gap-2 rounded-lg bg-[#20D6D0] px-4 py-2 text-xs font-semibold text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start / Resume Simulation</span>
              </button>
            ) : (
              <button
                onClick={onPauseSimulation}
                className="inline-flex items-center gap-2 rounded-lg border border-[#F4B942] bg-[#F4B942]/15 px-4 py-2 text-xs font-semibold text-[#F4B942] hover:bg-[#F4B942]/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Pause className="h-3.5 w-3.5" />
                <span>Pause Simulation</span>
              </button>
            )}

            <button
              onClick={onGenerateSingleStepReading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#20D6D0]/40 bg-[#061421] px-3.5 py-2 text-xs font-medium text-[#20D6D0] hover:bg-[#20D6D0]/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Demo Reading</span>
            </button>

            <button
              onClick={onResetSimulation}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#061421] px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset to Exact Baseline</span>
            </button>
          </div>
        </div>

        {/* Simulation Speed & Station Quick Switcher Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium">Simulation Speed:</span>
            <div className="flex items-center gap-1 rounded-lg bg-[#061421] p-1 border border-slate-800">
              {[
                { label: 'Slow (4.0s)', ms: 4000 },
                { label: 'Normal (2.2s)', ms: 2200 },
                { label: 'Fast (1.0s)', ms: 1000 },
              ].map((opt) => (
                <button
                  key={opt.ms}
                  onClick={() => onChangeSpeed(opt.ms)}
                  className={`rounded-md px-3 py-1 font-mono text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    simulationSpeedMs === opt.ms
                      ? 'bg-[#20D6D0] text-[#061421] font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Inspect Station Detail:</span>
            <div className="flex items-center gap-1 rounded-lg bg-[#061421] p-1 border border-slate-800">
              {(['A', 'B', 'C'] as StationId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    onSelectStation(id);
                    setDraftReadings({ ...stations[id].readings });
                  }}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedStation === id
                      ? 'bg-[#20D6D0] text-[#061421]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Station {id} {id === 'B' ? '▲' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Interactive Monitoring Station Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {(['A', 'B', 'C'] as StationId[]).map((id) => {
          const st = stations[id];
          const isSelected = selectedStation === id;
          const isStationB = id === 'B';

          return (
            <div
              key={id}
              onClick={() => {
                onSelectStation(id);
                setDraftReadings({ ...stations[id].readings });
              }}
              className={`rounded-xl border p-5 transition-all cursor-pointer ${
                isStationB
                  ? 'border-[#FF7068]/70 bg-[#0B2030]'
                  : isSelected
                  ? 'border-[#20D6D0] bg-[#0B2030]'
                  : 'border-slate-800 bg-[#0B2030]/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={isSimulationRunning ? 'text-emerald-400' : 'text-amber-400'}>
                      {isSimulationRunning ? '● LIVE SIMULATED LINK' : '● PAUSED SNAPSHOT'}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400">{st.sensorLatencyMs} ms</span>
                  </div>
                  <h2 className="mt-1 text-lg font-bold text-white">{st.name}</h2>
                  <p className="text-xs text-slate-400">{st.schematicCoords.label}</p>
                </div>

                {isStationB && (
                  <span className="text-xs font-mono font-bold text-[#FF7068] whitespace-nowrap shrink-0">
                    ▲ FLAGGED STATION
                  </span>
                )}
              </div>

              {/* Station B Mandatory Highlights */}
              {isStationB && (
                <div className="mt-3 rounded-lg border border-[#FF7068]/30 bg-[#FF7068]/10 px-3 py-2 text-xs text-slate-200">
                  <div className="font-semibold text-[#FF7068]">
                    Key Anomaly Highlights (Station B):
                  </div>
                  <div className="mt-1 text-slate-300">
                    Highest Turbidity ({st.readings.turbidity} NTU) · Highest Electrical Conductivity ({st.readings.conductivity} µS/cm) · Lowest Dissolved Oxygen ({st.readings.dissolvedOxygen} mg/L)
                  </div>
                </div>
              )}

              {/* 5 Parameter Readout Rows */}
              <div className="mt-4 divide-y divide-slate-800/80 border-t border-slate-800">
                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-300">pH</span>
                  <div className="font-mono tabular-nums">
                    <span className="font-bold text-white">{st.readings.ph}</span>
                    <span className="ml-2 text-xs text-slate-500">
                      (Base: {st.baselineReadings.ph})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-300">Temperature</span>
                  <div className="font-mono tabular-nums">
                    <span className="font-bold text-white">{st.readings.temperature}°C</span>
                    <span className="ml-2 text-xs text-slate-500">
                      (Base: {st.baselineReadings.temperature}°C)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-300">Turbidity</span>
                  <div className="font-mono tabular-nums">
                    <span
                      className={`font-bold ${
                        isStationB ? 'text-[#FF7068]' : 'text-white'
                      }`}
                    >
                      {st.readings.turbidity} NTU
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      (Base: {st.baselineReadings.turbidity} NTU)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-300">Dissolved Oxygen</span>
                  <div className="font-mono tabular-nums">
                    <span
                      className={`font-bold ${
                        isStationB ? 'text-[#FF7068]' : 'text-white'
                      }`}
                    >
                      {st.readings.dissolvedOxygen} mg/L
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      (Base: {st.baselineReadings.dissolvedOxygen} mg/L)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-slate-300">Electrical Conductivity</span>
                  <div className="font-mono tabular-nums">
                    <span
                      className={`font-bold ${
                        isStationB ? 'text-[#F4B942]' : 'text-white'
                      }`}
                    >
                      {st.readings.conductivity} µS/cm
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      (Base: {st.baselineReadings.conductivity} µS/cm)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs font-mono text-slate-400">
                  Updated: {st.lastUpdated} (Simulated)
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenEdit(id);
                  }}
                  className="text-xs font-semibold text-[#20D6D0] hover:underline cursor-pointer"
                >
                  Edit Parameters →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Monitoring & Interactive Parameter Calibration Console for Selected Station */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#20D6D0]">
              <span>DETAILED STATION TELEMETRY & MANUAL OVERRIDE</span>
              <span aria-hidden="true">·</span>
              <span>SELECTED: {activeStation.code}</span>
            </div>
            <h3 className="mt-1 text-xl font-bold text-white">
              {activeStation.name} — Interactive Sensor Array
            </h3>
            <p className="mt-1 text-sm text-slate-400 max-w-3xl">
              {activeStation.zoneDescription}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setDraftReadings({ ...activeStation.readings });
                setEditMode(!editMode);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#20D6D0]/40 bg-[#061421] px-4 py-2 text-xs font-semibold text-[#20D6D0] hover:bg-[#20D6D0]/10 transition-colors cursor-pointer"
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
            className="mt-4 rounded-xl border border-[#20D6D0]/30 bg-[#061421] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-[#20D6D0]">
                DIRECT NUMERIC OVERRIDE FOR STATION {selectedStation} (SIMULATED)
              </span>
              <span className="text-xs text-slate-400">
                Press Apply to update charts & risk engine
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">pH (4.5 – 9.5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="4.5"
                  max="9.5"
                  value={draftReadings.ph}
                  onChange={(e) =>
                    setDraftReadings({ ...draftReadings, ph: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0B2030] px-3 py-2 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Temp (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  min="10"
                  max="40"
                  value={draftReadings.temperature}
                  onChange={(e) =>
                    setDraftReadings({ ...draftReadings, temperature: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0B2030] px-3 py-2 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Turbidity (NTU)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={draftReadings.turbidity}
                  onChange={(e) =>
                    setDraftReadings({ ...draftReadings, turbidity: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0B2030] px-3 py-2 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Dissolved O₂ (mg/L)</label>
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
                  className="w-full rounded-lg border border-slate-700 bg-[#0B2030] px-3 py-2 text-sm font-mono text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Conductivity (µS/cm)</label>
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
                  className="w-full rounded-lg border border-slate-700 bg-[#0B2030] px-3 py-2 text-sm font-mono text-white"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#20D6D0] px-4 py-1.5 text-xs font-semibold text-[#061421] hover:bg-[#00AFA7] hover:text-white cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Apply Simulated Readings</span>
              </button>
            </div>
          </form>
        )}

        {/* Interactive Parameter Sliders & Real-Time Risk Feedback */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-semibold text-white">
              Interactive Sensor Scrubbers (Drag to test sensitivity on Station {selectedStation})
            </h4>

            {(Object.keys(PARAMETER_METADATA) as ParameterKey[]).map((key) => {
              const meta = PARAMETER_METADATA[key];
              const currentVal = activeStation.readings[key];
              const baseVal = activeStation.baselineReadings[key];

              return (
                <div
                  key={key}
                  className="rounded-lg border border-slate-800/90 bg-[#061421]/70 p-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-white">{meta.label}</span>
                      <span className="ml-2 text-slate-400">({meta.sensorPrinciple})</span>
                    </div>
                    <div className="font-mono tabular-nums">
                      <span className="text-sm font-bold text-[#20D6D0]">
                        {currentVal} {meta.unit}
                      </span>
                      <span className="ml-2 text-slate-500">
                        [Baseline: {baseVal} {meta.unit}]
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 w-10">
                      {meta.minRange}
                    </span>
                    <input
                      type="range"
                      min={meta.minRange}
                      max={meta.maxRange}
                      step={meta.step}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(key, Number(e.target.value))}
                      className="w-full accent-[#20D6D0] cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-500 w-12 text-right">
                      {meta.maxRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Preliminary Risk Impact Box for Selected Station */}
          <div className="rounded-xl border border-slate-800 bg-[#061421] p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400">
                STATION {selectedStation} DIAGNOSTIC SUMMARY
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white">Preliminary Risk:</span>
                <span
                  className={`text-xl font-mono font-bold ${
                    activeRisk.level === 'High'
                      ? 'text-[#FF7068]'
                      : activeRisk.level === 'Medium'
                      ? 'text-[#F4B942]'
                      : 'text-[#20D6D0]'
                  }`}
                >
                  {activeRisk.level.toUpperCase()} ({activeRisk.score}/100)
                </span>
              </div>

              <div className="mt-4 space-y-2.5 border-t border-slate-800 pt-4">
                <div className="text-xs font-semibold text-slate-300">
                  Active Rule Evaluations:
                </div>
                {activeRisk.reasons.map((reason, idx) => (
                  <p key={idx} className="text-xs text-slate-300 leading-relaxed">
                    • {reason}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-800 pt-3 text-xs text-slate-400">
              All values displayed are simulated for academic demonstration. Use Reset to restore the exact project table dataset.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
