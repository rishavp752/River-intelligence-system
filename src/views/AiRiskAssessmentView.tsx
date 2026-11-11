import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  StationData,
  StationId,
  WaterReadings,
} from '../types/monitoring';
import { evaluateStationRisk } from '../data/initialData';

interface AiRiskAssessmentViewProps {
  stations: Record<StationId, StationData>;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
}

const ML_PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Dataset',
    subtitle: 'Sensor & Lab Records',
    description:
      'Collect paired water-quality sensor time series (pH, Temp, Turbidity, DO, EC) alongside ground-truth chemical assay labels.',
  },
  {
    step: '02',
    title: 'Preprocessing',
    subtitle: 'Cleaning & Scaling',
    description:
      'Handle missing probe packets, filter transient optical spikes, and normalize parameter scales (Min-Max / Z-score standardization).',
  },
  {
    step: '03',
    title: 'Feature Selection',
    subtitle: 'Correlation & Importance',
    description:
      'Evaluate inter-parameter collinearity (e.g., EC vs. Turbidity influx) and retain the most discriminative hydrological features.',
  },
  {
    step: '04',
    title: 'Model Training',
    subtitle: 'Supervised Learning',
    description:
      'Fit candidate classifiers (Decision Tree, Random Forest, Logistic Regression) using stratified k-fold cross-validation.',
  },
  {
    step: '05',
    title: 'Model Evaluation',
    subtitle: 'Validation Metrics',
    description:
      'Assess held-out test set generalization using Accuracy, Precision, Recall, and F1-Score to minimize false negatives on high-risk plumes.',
  },
  {
    step: '06',
    title: 'Prediction',
    subtitle: 'Risk Classification',
    description:
      'Classify incoming station telemetry into Low, Medium, or High risk tiers to prioritize field sampling.',
  },
];

const CANDIDATE_ALGORITHMS = [
  {
    id: 'decision-tree',
    name: 'Decision Tree Classifier',
    role: 'Interpretable Hierarchical Rule Splitting',
    howItWorks:
      'Recursively partitions the 5-parameter feature space using axis-aligned splits (e.g., Turbidity > 25 NTU → Conductivity > 500 µS/cm) that maximize Information Gain or minimize Gini Impurity.',
    strengths: 'Highly transparent decision path; easy to audit against domain hydrology rules.',
    limitations: 'Prone to overfitting on small or noisy environmental datasets if tree depth is unconstrained.',
    visualDiagram: [
      'Root Node: Turbidity ≥ 25 NTU?',
      '├─ Yes → Check Conductivity ≥ 500 µS/cm & DO ≤ 5.2 mg/L → HIGH RISK',
      '└─ No  → Check Conductivity ≥ 350 µS/cm → MEDIUM / LOW RISK',
    ],
  },
  {
    id: 'random-forest',
    name: 'Random Forest Ensemble',
    role: 'Bagged Multi-Tree Majority Voting',
    howItWorks:
      'Constructs an ensemble of diverse Decision Trees trained on bootstrapped subsamples of station readings and random feature subsets, aggregating their predictions by majority vote.',
    strengths:
      'Resilient to individual sensor noise; captures non-linear interactions between pH, temperature, and dissolved oxygen.',
    limitations:
      'Requires larger labelled datasets for calibration and is less directly interpretable than a single tree.',
    visualDiagram: [
      'Input Vector: [pH, Temp, Turbidity, DO, EC]',
      '├─ Tree 1 (Bootstrap A) ──► Vote: High Risk',
      '├─ Tree 2 (Bootstrap B) ──► Vote: High Risk',
      '└─ Tree N (Bootstrap N) ──► Ensemble Majority Class',
    ],
  },
  {
    id: 'logistic-regression',
    name: 'Multinomial Logistic Regression',
    role: 'Probabilistic Linear Decision Boundary',
    howItWorks:
      'Computes a weighted linear combination of standardized water parameters (z = w₁·pH + w₂·Temp + w₃·Turb + w₄·DO + w₅·EC + b) and applies a Softmax / Sigmoid link function to output class probabilities.',
    strengths:
      'Well-calibrated probability estimates; computationally lightweight for edge microcontrollers.',
    limitations:
      'Assumes linear log-odds boundaries; cannot naturally model complex non-linear chemical equilibria without feature engineering.',
    visualDiagram: [
      'Linear Logit: z = Σ (wᵢ · xᵢ) + b',
      'Probability: P(Risk = High | x) = σ(z)',
      'Threshold Classification: Low / Medium / High',
    ],
  },
];

const EVALUATION_METRICS = [
  {
    metric: 'Accuracy',
    formula: '(TP + TN) / (TP + TN + FP + FN)',
    meaning:
      'Proportion of total station observations correctly classified across all risk categories. Can be misleading if pollution events are rare (class imbalance).',
  },
  {
    metric: 'Precision',
    formula: 'TP / (TP + FP)',
    meaning:
      'Of all stations flagged as High Risk by the model, the fraction that are genuinely polluted upon laboratory verification (controls false alarms).',
  },
  {
    metric: 'Recall (Sensitivity)',
    formula: 'TP / (TP + FN)',
    meaning:
      'Of all genuine pollution events in the river, the fraction successfully detected by the model. Crucial in environmental safety so hazardous plumes are not missed.',
  },
  {
    metric: 'F1-Score',
    formula: '2 × (Precision × Recall) / (Precision + Recall)',
    meaning:
      'Harmonic mean of Precision and Recall, providing a balanced evaluation metric when High-Risk anomaly samples are less frequent than nominal baseline readings.',
  },
];

export const AiRiskAssessmentView: React.FC<AiRiskAssessmentViewProps> = ({
  stations,
  selectedStation,
  onSelectStation,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<string>('random-forest');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(5);
  const [sandboxMode, setSandboxMode] = useState<boolean>(false);
  const [sandboxReadings, setSandboxReadings] = useState<WaterReadings>({
    ...stations[selectedStation].readings,
  });

  const currentInputs = sandboxMode
    ? sandboxReadings
    : stations[selectedStation].readings;

  const activeRisk = evaluateStationRisk(selectedStation, currentInputs);

  const handleSelectStationForRisk = (id: StationId) => {
    onSelectStation(id);
    setSandboxReadings({ ...stations[id].readings });
  };

  return (
    <div className="space-y-6">
      {/* Mandatory Scientific Honesty Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-mono font-bold text-[#0D9488]">
            METHODOLOGY DISCLOSURE — RULE-BASED DEMONSTRATION ENGINE
          </div>
          <span className="text-xs font-mono font-semibold text-[#71869A]">
            NO FABRICATED MODEL ACCURACY METRICS
          </span>
        </div>
        <h1 className="mt-1 text-xl font-extrabold text-[#263B50] sm:text-2xl">
          AI-Inspired Water Quality Risk Assessment &amp; ML Pipeline Framework
        </h1>
        <p className="mt-1 text-sm text-[#52667A]">
          This module demonstrates the proposed Machine Learning workflow and provides a transparent, rule-based preliminary risk assessment using simulated sensor inputs.
        </p>
        <div className="mt-3 glass-subcard rounded-xl px-4 py-2.5 text-xs font-mono font-semibold text-[#0E7490]">
          &quot;Actual machine learning validation requires a suitable labelled dataset and independent testing.&quot;
        </div>
      </div>

      {/* Interactive 6-Stage ML Pipeline Workflow */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#263B50]">
              Proposed Machine Learning Processing Pipeline
            </h2>
            <p className="text-xs text-[#71869A]">
              Click any stage in the pipeline to inspect its data processing role in the framework.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0D9488]">
            Dataset → Preprocessing → Feature Selection → Model Training → Model Evaluation → Prediction
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {ML_PIPELINE_STEPS.map((s, index) => {
            const isActive = activePipelineStep === index;
            return (
              <button
                key={s.step}
                onClick={() => setActivePipelineStep(index)}
                className={`text-left rounded-2xl border p-3.5 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#20CFC6] bg-white shadow-[0_10px_25px_-6px_rgba(32,207,198,0.22)] ring-2 ring-[#20CFC6]/25'
                    : 'border-[#70CFFF]/35 bg-white/60 hover:bg-white/85'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#0D9488] font-bold">STAGE {s.step}</span>
                  {index < 5 && (
                    <ArrowRight className="h-3.5 w-3.5 text-[#71869A] hidden lg:block" />
                  )}
                </div>
                <div className="mt-1.5 text-sm font-bold text-[#263B50]">{s.title}</div>
                <div className="text-xs text-[#71869A]">{s.subtitle}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 glass-subcard rounded-xl p-4">
          <div className="text-xs font-mono font-bold text-[#0D9488]">
            STAGE {ML_PIPELINE_STEPS[activePipelineStep].step}:{' '}
            {ML_PIPELINE_STEPS[activePipelineStep].title.toUpperCase()}
          </div>
          <p className="mt-1 text-sm text-[#263B50]">
            {ML_PIPELINE_STEPS[activePipelineStep].description}
          </p>
        </div>
      </div>

      {/* Interactive Preliminary Risk Assessment Engine (Gauge + Station Breakdown) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Risk Gauge & Station Selection */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-bold text-[#0D9488]">
                PRELIMINARY RISK INDICATOR GAUGE
              </span>
              <span className="text-xs font-mono text-[#71869A]">RULE-BASED DEMO</span>
            </div>

            {/* Station Switcher */}
            <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-[#70CFFF]/40 bg-[#EDF8FF]/90 p-1">
              {(['A', 'B', 'C'] as StationId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => handleSelectStationForRisk(id)}
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

            {/* Semi-Circular SVG Risk Gauge */}
            <div className="mt-6 flex flex-col items-center">
              <svg viewBox="0 0 220 130" className="w-56">
                {/* Background arc */}
                <path
                  d="M 20 110 A 90 90 0 0 1 200 110"
                  fill="none"
                  stroke="var(--chart-grid)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Low Risk Segment */}
                <path
                  d="M 20 110 A 90 90 0 0 1 75 28"
                  fill="none"
                  stroke="#20CFC6"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Medium Risk Segment */}
                <path
                  d="M 80 26 A 90 90 0 0 1 140 26"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="16"
                />
                {/* High Risk Segment */}
                <path
                  d="M 145 28 A 90 90 0 0 1 200 110"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="16"
                  strokeLinecap="round"
                />

                {/* Score Readout inside Gauge */}
                <text
                  x="110"
                  y="85"
                  textAnchor="middle"
                  fill="var(--text-primary)"
                  fontSize="28"
                  fontWeight="800"
                  fontFamily="monospace"
                >
                  {activeRisk.score}/100
                </text>
                <text
                  x="110"
                  y="108"
                  textAnchor="middle"
                  fill={
                    activeRisk.level === 'High'
                      ? '#FB7185'
                      : activeRisk.level === 'Medium'
                      ? '#F59E0B'
                      : '#20CFC6'
                  }
                  fontSize="13"
                  fontWeight="800"
                  fontFamily="monospace"
                >
                  {activeRisk.level.toUpperCase()} RISK TIER
                </text>
              </svg>

              <div className="mt-2 text-center">
                <div className="text-sm font-bold text-[#263B50]">
                  {stations[selectedStation].name}
                </div>
                <div className="text-xs text-[#71869A]">
                  {sandboxMode
                    ? 'Evaluating custom What-If sandbox inputs'
                    : 'Evaluating current simulated station readings'}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Station Risk Comparison Table */}
          <div className="mt-6 border-t border-[#70CFFF]/30 pt-4">
            <div className="text-xs font-bold text-[#263B50] mb-2">
              Cross-Station Risk Comparison:
            </div>
            <div className="space-y-1.5">
              {(['A', 'B', 'C'] as StationId[]).map((id) => {
                const r = evaluateStationRisk(id, stations[id].readings);
                return (
                  <div
                    key={id}
                    className="glass-subcard flex items-center justify-between text-xs font-mono px-3 py-2 rounded-xl"
                  >
                    <span className="font-semibold text-[#263B50]">Station {id}</span>
                    <span
                      className={
                        r.level === 'High'
                          ? 'text-rose-600 font-bold'
                          : r.level === 'Medium'
                          ? 'text-amber-600 font-bold'
                          : 'text-[#0D9488] font-bold'
                      }
                    >
                      {r.level} ({r.score}/100)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Input Parameter Summary, Rule Explanation & What-If Sandbox */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#70CFFF]/30 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#263B50]">
                Input Parameter Summary &amp; Transparent Classification Rules
              </h3>
              <p className="text-xs text-[#71869A]">
                Inspect how each of the 5 simulated parameters contributes to the preliminary risk classification.
              </p>
            </div>
            <button
              onClick={() => {
                setSandboxReadings({ ...stations[selectedStation].readings });
                setSandboxMode(!sandboxMode);
              }}
              className="rounded-xl border border-[#20CFC6]/50 bg-white/85 px-3.5 py-2 text-xs font-bold text-[#0D9488] hover:bg-[#EDF8FF] cursor-pointer"
            >
              {sandboxMode ? 'Exit What-If Sandbox' : 'Test Custom What-If Inputs'}
            </button>
          </div>

          {sandboxMode && (
            <div className="glass-subcard rounded-xl p-4">
              <div className="text-xs font-mono font-bold text-[#0D9488] mb-3">
                WHAT-IF SANDBOX: ADJUST INPUTS TO TEST RULE-BASED CLASSIFICATION
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div>
                  <label className="text-xs font-semibold text-[#263B50]">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sandboxReadings.ph}
                    onChange={(e) =>
                      setSandboxReadings({ ...sandboxReadings, ph: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-[#70CFFF]/50 bg-white px-2.5 py-1.5 text-xs font-mono text-[#263B50]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263B50]">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={sandboxReadings.temperature}
                    onChange={(e) =>
                      setSandboxReadings({
                        ...sandboxReadings,
                        temperature: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#70CFFF]/50 bg-white px-2.5 py-1.5 text-xs font-mono text-[#263B50]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263B50]">Turbidity (NTU)</label>
                  <input
                    type="number"
                    step="1"
                    value={sandboxReadings.turbidity}
                    onChange={(e) =>
                      setSandboxReadings({
                        ...sandboxReadings,
                        turbidity: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#70CFFF]/50 bg-white px-2.5 py-1.5 text-xs font-mono text-[#263B50]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263B50]">DO (mg/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sandboxReadings.dissolvedOxygen}
                    onChange={(e) =>
                      setSandboxReadings({
                        ...sandboxReadings,
                        dissolvedOxygen: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#70CFFF]/50 bg-white px-2.5 py-1.5 text-xs font-mono text-[#263B50]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#263B50]">EC (µS/cm)</label>
                  <input
                    type="number"
                    step="10"
                    value={sandboxReadings.conductivity}
                    onChange={(e) =>
                      setSandboxReadings({
                        ...sandboxReadings,
                        conductivity: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-[#70CFFF]/50 bg-white px-2.5 py-1.5 text-xs font-mono text-[#263B50]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Parameter Flag Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#70CFFF]/35 text-[#71869A] font-mono">
                  <th className="py-2.5 pr-4">PARAMETER</th>
                  <th className="py-2.5 px-4">SIMULATED INPUT</th>
                  <th className="py-2.5 px-4">RULE STATUS</th>
                  <th className="py-2.5 pl-4">CLASSIFICATION RATIONALE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#70CFFF]/25">
                {activeRisk.parameterFlags.map((pf) => (
                  <tr key={pf.parameter}>
                    <td className="py-3 pr-4 font-bold text-[#263B50]">{pf.parameter}</td>
                    <td className="py-3 px-4 font-mono font-bold tabular-nums text-[#0D9488]">
                      {pf.value}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span
                        className={
                          pf.status === 'Critical'
                            ? 'text-rose-600'
                            : pf.status === 'Elevated'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {pf.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-[#52667A]">{pf.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall Reason Summary */}
          <div className="glass-subcard rounded-xl p-4 space-y-2">
            <div className="text-xs font-mono font-bold text-[#263B50]">
              PRIMARY REASONS FOR {activeRisk.level.toUpperCase()} RISK CLASSIFICATION (STATION{' '}
              {selectedStation}):
            </div>
            {activeRisk.reasons.map((r, i) => (
              <div key={i} className="text-xs text-[#52667A]">
                • {r}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Three Candidate ML Algorithms Visual Explanation */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#263B50]">
              Candidate Machine Learning Classifiers (Architectural Comparison)
            </h2>
            <p className="text-xs text-[#71869A]">
              Visual explanation of the three supervised learning algorithms proposed in the RIVER INTELLIGENCE framework.
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-xl bg-[#EDF8FF]/90 p-1 border border-[#70CFFF]/40">
            {CANDIDATE_ALGORITHMS.map((alg) => (
              <button
                key={alg.id}
                onClick={() => setSelectedAlgo(alg.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedAlgo === alg.id
                    ? 'bg-[#20CFC6] text-white shadow-xs'
                    : 'text-[#52667A] hover:text-[#263B50]'
                }`}
              >
                {alg.name.split(' ')[0]} {alg.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {CANDIDATE_ALGORITHMS.map((alg) => {
            const isSelected = selectedAlgo === alg.id;
            return (
              <div
                key={alg.id}
                onClick={() => setSelectedAlgo(alg.id)}
                className={`glass-card rounded-2xl p-5 cursor-pointer ${
                  isSelected
                    ? 'border-[#20CFC6] ring-2 ring-[#20CFC6]/25'
                    : ''
                }`}
              >
                <div className="text-xs font-mono font-bold text-[#0D9488]">{alg.role}</div>
                <h3 className="mt-1 text-base font-bold text-[#263B50]">{alg.name}</h3>
                <p className="mt-2 text-xs text-[#52667A] leading-relaxed">{alg.howItWorks}</p>

                <div className="mt-3 glass-subcard rounded-xl p-3 font-mono text-[11px] text-[#263B50] space-y-1">
                  {alg.visualDiagram.map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="text-[#52667A]">
                    <span className="font-bold text-emerald-700">Advantage:</span>{' '}
                    {alg.strengths}
                  </div>
                  <div className="text-[#52667A]">
                    <span className="font-bold text-amber-700">Constraint:</span>{' '}
                    {alg.limitations}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Evaluation Metrics Methodology */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-[#263B50]">
              Model Evaluation Metrics Methodology (Accuracy, Precision, Recall &amp; F1-Score)
            </h2>
            <p className="text-xs text-[#71869A]">
              How candidate classifiers will be benchmarked once paired field and laboratory datasets are compiled.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-700">
            STATUS: AWAITING LABELLED DATASET FOR EMPIRICAL SCORING
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVALUATION_METRICS.map((m) => (
            <div
              key={m.metric}
              className="glass-card rounded-2xl p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-bold text-[#263B50]">{m.metric}</div>
                <div className="mt-1.5 rounded-lg bg-[#EDF8FF] border border-[#70CFFF]/40 px-2.5 py-1.5 font-mono text-xs font-bold text-[#0D9488]">
                  {m.formula}
                </div>
                <p className="mt-2.5 text-xs text-[#52667A] leading-relaxed">{m.meaning}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#70CFFF]/25 text-[11px] font-mono text-[#71869A]">
                Empirical Score: Pending Labelled Test Set
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
