import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
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
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span>CRITICAL SCIENTIFIC &amp; INSTRUMENTATION LIMITATION</span>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0D9488]">
            DATASET STATUS: AWAITING LABELLED DATASET
          </span>
        </div>

        <h1 className="mt-2 text-xl font-extrabold text-[#263B50] sm:text-2xl">
          Heavy Metal Risk Estimation &amp; Laboratory Verification Framework
        </h1>
        <p className="mt-2 text-sm text-[#52667A] leading-relaxed">
          The five basic water-quality parameters monitored by standard IoT probes (<strong>pH, temperature, turbidity, dissolved oxygen, and electrical conductivity</strong>) <strong>cannot directly measure dissolved heavy metals</strong> (Lead, Mercury, Arsenic, or Cadmium). Heavy-metal risk estimation via Machine Learning requires suitable labelled datasets containing paired laboratory-measured metal concentrations, and <strong>laboratory chemical analysis is mandatory for confirmation</strong>.
        </p>
      </div>

      {/* Visual Distinction Comparison: PREDICTED RISK vs LAB CONFIRMED */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#0D9488]">
              MODE 01 · COMPUTATIONAL SCREENING
            </span>
            <span className="text-xs font-mono font-bold text-amber-700">
              Awaiting Labelled Dataset
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold text-[#263B50]">
            PREDICTED RISK = Preliminary ML-Based Estimate
          </h2>
          <p className="mt-2 text-xs text-[#52667A] leading-relaxed">
            Uses bulk physico-chemical anomalies (such as high electrical conductivity of 650 µS/cm, high turbidity of 35 NTU, and lower pH of 6.5 at Station B) as indirect environmental proxy indicators to flag locations where industrial effluent or sediment-bound trace metals may be present.
          </p>
          <div className="mt-4 glass-subcard rounded-xl p-3.5 text-xs text-[#263B50] space-y-1 font-mono">
            <div>• Input: 5 Simulated IoT Parameters (pH, Temp, Turb, DO, EC)</div>
            <div>• Model Status: Awaiting labelled dataset for training &amp; validation</div>
            <div>• Output Role: Preliminary screening priority for field sampling</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-700">
              MODE 02 · ANALYTICAL CHEMISTRY TRUTH
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              Gold-Standard Confirmation
            </span>
          </div>
          <h2 className="mt-2 text-lg font-bold text-[#263B50]">
            LAB CONFIRMED = Actual Laboratory Chemical Analysis
          </h2>
          <p className="mt-2 text-xs text-[#52667A] leading-relaxed">
            Direct quantitative measurement of trace metal ions (Pb²⁺, Hg²⁺, As³⁺/As⁵⁺, Cd²⁺) in grab water and sediment samples using analytical spectroscopy (ICP-MS, AAS, CV-AAS) after acid digestion in an accredited environmental laboratory.
          </p>
          <div className="mt-4 glass-subcard rounded-xl p-3.5 text-xs text-[#263B50] space-y-1 font-mono">
            <div>• Input: Acid-preserved physical river water grab samples</div>
            <div>• Assay Status: No laboratory assay conducted in this prototype</div>
            <div>• Output Role: Definitive legal &amp; toxicological verification (µg/L)</div>
          </div>
        </div>
      </div>

      {/* Four Heavy Metal Cards (Pb, Hg, As, Cd) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-lg font-bold text-[#263B50]">
              Target Heavy Elements (Pb, Hg, As, Cd) — Status &amp; Requirements
            </h2>
            <p className="text-xs text-[#71869A]">
              Click any element card to inspect its geochemical behavior, proxy correlation rationale, and required spectroscopy protocol.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#71869A]">
            ZERO FABRICATED LAB CONCENTRATIONS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HEAVY_METALS_DATA.map((metal, idx) => {
            const isSelected = selectedMetal === metal.symbol;
            return (
              <motion.div
                key={metal.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedMetal(metal.symbol)}
                className={`glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#20CFC6] ring-2 ring-[#20CFC6]/30'
                    : ''
                }`}
              >
                <div>
                  {/* Element Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#20CFC6]/50 bg-gradient-to-br from-[#EDF8FF] to-[#C9F5F5]/60 font-mono text-xl font-extrabold text-[#0D9488] shadow-xs">
                      {metal.symbol}
                    </div>
                    <div className="text-right font-mono text-xs text-[#71869A]">
                      <div>Z = {metal.atomicNumber}</div>
                      <div>{metal.atomicMass}</div>
                    </div>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-[#263B50]">
                    {metal.symbol} — {metal.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#52667A] leading-relaxed">
                    {metal.significance}
                  </p>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#70CFFF]/30 pt-3 text-xs">
                  <div>
                    <span className="text-[#71869A]">Dataset Availability:</span>
                    <div className="font-mono font-bold text-amber-700">
                      {metal.datasetStatus}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#71869A]">Prediction Status:</span>
                    <div className="font-mono font-semibold text-[#263B50]">
                      {metal.predictionStatus}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#71869A]">Lab-Testing Requirement:</span>
                    <div className="font-mono font-bold text-[#0D9488]">
                      Mandatory ({metal.labTestingMethod.split('(')[0].trim()})
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Heavy Metal Deep-Dive & Station Environmental Context */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#70CFFF]/30 pb-3">
            <div>
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                ELEMENT TECHNICAL DOSSIER · {activeMetal.symbol.toUpperCase()}
              </div>
              <h3 className="text-xl font-bold text-[#263B50]">
                {activeMetal.name} ({activeMetal.symbol}) — Environmental &amp; Analytical Profile
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700">
              Awaiting Labelled Dataset
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="glass-subcard rounded-xl p-4">
              <div className="text-xs font-bold text-[#263B50] mb-1.5">
                Environmental &amp; Ecological Significance
              </div>
              <p className="text-xs text-[#52667A] leading-relaxed">
                {activeMetal.ecologicalImpact}
              </p>
            </div>

            <div className="glass-subcard rounded-xl p-4">
              <div className="text-xs font-bold text-[#263B50] mb-1.5">
                Typical Anthropogenic &amp; Geogenic Sources
              </div>
              <ul className="space-y-1 text-xs text-[#52667A]">
                {activeMetal.potentialSources.map((src, i) => (
                  <li key={i}>• {src}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass-subcard rounded-xl p-4">
            <div className="text-xs font-bold text-[#0D9488] mb-1">
              Required Laboratory Chemical Analysis Method (LAB CONFIRMED)
            </div>
            <p className="text-xs text-[#263B50] leading-relaxed">
              {activeMetal.labTestingMethod}
            </p>
          </div>

          <div className="rounded-xl border border-amber-300/70 bg-amber-50/70 p-4">
            <div className="text-xs font-bold text-amber-800 mb-1">
              Relationship to Monitored IoT Parameters (PREDICTED RISK Limitation)
            </div>
            <p className="text-xs text-[#52667A] leading-relaxed">
              {activeMetal.proxyCorrelationNote}
            </p>
          </div>
        </div>

        {/* Station Proxy Susceptibility Context Panel */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-[#0D9488]">
              STATION PROXY SCREENING CONTEXT
            </div>
            <h3 className="mt-1 text-base font-bold text-[#263B50]">
              Physico-Chemical Anomaly Check
            </h3>
            <p className="mt-1 text-xs text-[#71869A]">
              Select a station to inspect whether bulk IoT readings warrant collecting grab samples for laboratory {activeMetal.name} testing.
            </p>

            <div className="mt-3 flex items-center gap-1 rounded-xl border border-[#70CFFF]/40 bg-[#EDF8FF]/90 p-1">
              {(['A', 'B', 'C'] as StationId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => onSelectStation(id)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    selectedStation === id
                      ? 'bg-[#20CFC6] text-white shadow-xs'
                      : 'text-[#52667A] hover:text-[#263B50]'
                  }`}
                >
                  Station {id}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2.5 glass-subcard rounded-xl p-4 text-xs">
              <div className="flex justify-between">
                <span className="text-[#71869A]">Selected Station:</span>
                <span className="font-bold text-[#263B50]">Station {selectedStation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71869A]">Simulated pH / EC:</span>
                <span className="font-mono font-bold text-[#263B50]">
                  {st.readings.ph} / {st.readings.conductivity} µS/cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71869A]">Simulated Turbidity / DO:</span>
                <span className="font-mono font-bold text-[#263B50]">
                  {st.readings.turbidity} NTU / {st.readings.dissolvedOxygen} mg/L
                </span>
              </div>
              <div className="flex justify-between border-t border-[#70CFFF]/30 pt-2">
                <span className="text-[#71869A]">ML Heavy-Metal Model:</span>
                <span className="font-mono font-bold text-amber-700">
                  Awaiting labelled dataset
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71869A]">Lab Assay Concentration:</span>
                <span className="font-mono text-[#52667A]">Not Measured (Lab Required)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71869A]">Sampling Priority:</span>
                <span
                  className={`font-mono font-bold ${
                    stRisk.level === 'High'
                      ? 'text-rose-600'
                      : stRisk.level === 'Medium'
                      ? 'text-amber-600'
                      : 'text-[#0D9488]'
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

          <div className="mt-4 border-t border-[#70CFFF]/30 pt-3 text-xs text-[#71869A]">
            Summary: Even when Station B shows High Preliminary Risk due to turbidity (35 NTU) and conductivity (650 µS/cm), confirming the presence or concentration of {activeMetal.name} ({activeMetal.symbol}) requires laboratory chemical analysis.
          </div>
        </div>
      </div>
    </div>
  );
};
