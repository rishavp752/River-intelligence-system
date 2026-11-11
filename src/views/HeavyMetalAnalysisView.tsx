import React, { useState } from 'react';
import {
  AlertTriangle,
  Beaker,
  Database,
  FileWarning,
  FlaskConical,
  Microscope,
  ShieldAlert,
} from 'lucide-react';
import {
  StationData,
  StationId,
  HeavyMetalInfo,
} from '../types/monitoring';
import { HEAVY_METALS_DATA, evaluateStationRisk } from '../data/initialData';

interface HeavyMetalAnalysisViewProps {
  stations: Record<StationId, StationData>;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
}

export const HeavyMetalAnalysisView: React.FC<HeavyMetalAnalysisViewProps> = ({
  stations,
  selectedStation,
  onSelectStation,
}) => {
  const [selectedMetal, setSelectedMetal] = useState<HeavyMetalInfo['symbol']>('Pb');
  const activeMetal =
    HEAVY_METALS_DATA.find((m) => m.symbol === selectedMetal) || HEAVY_METALS_DATA[0];
  const st = stations[selectedStation];
  const stRisk = evaluateStationRisk(selectedStation, st.readings);

  return (
    <div className="space-y-6">
      {/* Mandatory Scientific Limitation Banner */}
      <div className="rounded-xl border border-[#F4B942]/50 bg-[#0B2030] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#F4B942]">
            <AlertTriangle className="h-4 w-4" />
            <span>CRITICAL SCIENTIFIC & INSTRUMENTATION LIMITATION</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            DATASET STATUS: AWAITING LABELLED DATASET
          </span>
        </div>

        <h1 className="mt-2 text-xl font-bold text-white sm:text-2xl">
          Heavy Metal Risk Estimation & Laboratory Verification Framework
        </h1>
        <p className="mt-2 text-sm text-slate-200 leading-relaxed">
          The five basic water-quality parameters monitored by standard IoT probes (<strong>pH, temperature, turbidity, dissolved oxygen, and electrical conductivity</strong>) <strong>cannot directly measure dissolved heavy metals</strong> (Lead, Mercury, Arsenic, or Cadmium). Heavy-metal risk estimation via Machine Learning requires suitable labelled datasets containing paired laboratory-measured metal concentrations, and <strong>laboratory chemical analysis is mandatory for confirmation</strong>.
        </p>
      </div>

      {/* Visual Distinction Comparison: PREDICTED RISK vs LAB CONFIRMED */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-[#20D6D0]/40 bg-[#0B2030] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#20D6D0]">
              MODE 01 · COMPUTATIONAL SCREENING
            </span>
            <span className="text-xs font-mono text-[#F4B942]">
              Awaiting Labelled Dataset
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold text-white">
            PREDICTED RISK = Preliminary ML-Based Estimate
          </h2>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Uses bulk physico-chemical anomalies (such as high electrical conductivity of 650 µS/cm, high turbidity of 35 NTU, and lower pH of 6.5 at Station B) as indirect environmental proxy indicators to flag locations where industrial effluent or sediment-bound trace metals may be present.
          </p>
          <div className="mt-4 rounded-lg border border-slate-800 bg-[#061421] p-3 text-xs text-slate-300 space-y-1 font-mono">
            <div>• Input: 5 Simulated IoT Parameters (pH, Temp, Turb, DO, EC)</div>
            <div>• Model Status: Awaiting labelled dataset for training & validation</div>
            <div>• Output Role: Preliminary screening priority for field sampling</div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/40 bg-[#0B2030] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">
              MODE 02 · ANALYTICAL CHEMISTRY TRUTH
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Gold-Standard Confirmation
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold text-white">
            LAB CONFIRMED = Actual Laboratory Chemical Analysis
          </h2>
          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            Direct quantitative measurement of trace metal ions (Pb²⁺, Hg²⁺, As³⁺/As⁵⁺, Cd²⁺) in grab water and sediment samples using analytical spectroscopy (ICP-MS, AAS, CV-AAS) after acid digestion in an accredited environmental laboratory.
          </p>
          <div className="mt-4 rounded-lg border border-slate-800 bg-[#061421] p-3 text-xs text-slate-300 space-y-1 font-mono">
            <div>• Input: Acid-preserved physical river water grab samples</div>
            <div>• Assay Status: No laboratory assay conducted in this prototype</div>
            <div>• Output Role: Definitive legal & toxicological verification (µg/L)</div>
          </div>
        </div>
      </div>

      {/* Four Heavy Metal Cards (Pb, Hg, As, Cd) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-lg font-bold text-white">
              Target Heavy Elements (Pb, Hg, As, Cd) — Status & Requirements
            </h2>
            <p className="text-xs text-slate-400">
              Click any element card to inspect its geochemical behavior, proxy correlation rationale, and required spectroscopy protocol.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            ZERO FABRICATED LAB CONCENTRATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HEAVY_METALS_DATA.map((metal) => {
            const isSelected = selectedMetal === metal.symbol;
            return (
              <div
                key={metal.symbol}
                onClick={() => setSelectedMetal(metal.symbol)}
                className={`rounded-xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#20D6D0] bg-[#0B2030]'
                    : 'border-slate-800 bg-[#0B2030]/85 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Element Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#20D6D0]/40 bg-[#061421] font-mono text-xl font-bold text-[#20D6D0]">
                      {metal.symbol}
                    </div>
                    <div className="text-right font-mono text-xs text-slate-400">
                      <div>Z = {metal.atomicNumber}</div>
                      <div>{metal.atomicMass}</div>
                    </div>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-white">
                    {metal.symbol} — {metal.name}
                  </h3>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {metal.significance}
                  </p>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-800 pt-3 text-xs">
                  <div>
                    <span className="text-slate-400">Dataset Availability:</span>
                    <div className="font-mono font-semibold text-[#F4B942]">
                      {metal.datasetStatus}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Prediction Status:</span>
                    <div className="font-mono text-slate-200">
                      {metal.predictionStatus}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Lab-Testing Requirement:</span>
                    <div className="font-mono text-[#20D6D0]">
                      Mandatory ({metal.labTestingMethod.split('(')[0].trim()})
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Heavy Metal Deep-Dive & Station Environmental Context */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0B2030] p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="text-xs font-mono text-[#20D6D0]">
                ELEMENT TECHNICAL DOSSIER · {activeMetal.symbol.toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-white">
                {activeMetal.name} ({activeMetal.symbol}) — Environmental & Analytical Profile
              </h3>
            </div>
            <span className="text-xs font-mono text-[#F4B942]">
              Awaiting Labelled Dataset
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-[#061421] p-4">
              <div className="text-xs font-semibold text-white mb-1.5">
                Environmental & Ecological Significance
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeMetal.ecologicalImpact}
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-[#061421] p-4">
              <div className="text-xs font-semibold text-white mb-1.5">
                Typical Anthropogenic & Geogenic Sources
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {activeMetal.potentialSources.map((src, i) => (
                  <li key={i}>• {src}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#061421] p-4">
            <div className="text-xs font-semibold text-[#20D6D0] mb-1">
              Required Laboratory Chemical Analysis Method (LAB CONFIRMED)
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeMetal.labTestingMethod}
            </p>
          </div>

          <div className="rounded-lg border border-[#F4B942]/30 bg-[#061421] p-4">
            <div className="text-xs font-semibold text-[#F4B942] mb-1">
              Relationship to Monitored IoT Parameters (PREDICTED RISK Limitation)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeMetal.proxyCorrelationNote}
            </p>
          </div>
        </div>

        {/* Station Proxy Susceptibility Context Panel */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              STATION PROXY SCREENING CONTEXT
            </div>
            <h3 className="mt-1 text-base font-bold text-white">
              Physico-Chemical Anomaly Check
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Select a station to inspect whether bulk IoT readings warrant collecting grab samples for laboratory {activeMetal.name} testing.
            </p>

            <div className="mt-3 flex items-center gap-1 rounded-lg border border-slate-800 bg-[#061421] p-1">
              {(['A', 'B', 'C'] as StationId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => onSelectStation(id)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedStation === id
                      ? 'bg-[#20D6D0] text-[#061421]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Station {id}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 rounded-lg border border-slate-800 bg-[#061421] p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Station:</span>
                <span className="font-semibold text-white">Station {selectedStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated pH / EC:</span>
                <span className="font-mono text-white">
                  {st.readings.ph} / {st.readings.conductivity} µS/cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simulated Turbidity / DO:</span>
                <span className="font-mono text-white">
                  {st.readings.turbidity} NTU / {st.readings.dissolvedOxygen} mg/L
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">ML Heavy-Metal Model:</span>
                <span className="font-mono text-[#F4B942]">Awaiting labelled dataset</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lab Assay Concentration:</span>
                <span className="font-mono text-slate-400">Not Measured (Lab Required)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sampling Priority Recommendation:</span>
                <span
                  className={`font-mono font-bold ${
                    stRisk.level === 'High'
                      ? 'text-[#FF7068]'
                      : stRisk.level === 'Medium'
                      ? 'text-[#F4B942]'
                      : 'text-[#20D6D0]'
                  }`}
                >
                  {stRisk.level === 'High'
                    ? 'HIGH PRIORITY GRAB SAMPLE'
                    : stRisk.level === 'Medium'
                    ? 'ROUTINE VERIFICATION'
                    : 'BASELINE REFERENCE'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-400">
            Summary: Even when Station B shows High Preliminary Risk due to turbidity (35 NTU) and conductivity (650 µS/cm), confirming the presence or concentration of {activeMetal.name} ({activeMetal.symbol}) requires laboratory chemical analysis.
          </div>
        </div>
      </div>
    </div>
  );
};
