import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Camera,
  Map,
} from 'lucide-react';
import { NavigationTab } from '../types/monitoring';
import { SystemArchitectureView } from './SystemArchitectureView';

interface AboutProjectViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

const CORE_SYSTEM_PILLARS: {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  targetTab: NavigationTab;
  actionLabel: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    code: '01',
    title: 'Environmental Monitoring System',
    subtitle: 'Multi-Station Telemetry Corridor',
    description:
      'Models a three-node river corridor across Upstream Reference (Station A), Midstream Influx (Station B), and Downstream Recovery (Station C), tracking pH, water temperature, turbidity, dissolved oxygen, and electrical conductivity.',
    targetTab: 'live-monitoring',
    actionLabel: 'Explore Live Monitoring',
    icon: Activity,
  },
  {
    code: '02',
    title: 'AI-Based Analysis & Heavy Metal Screening',
    subtitle: 'ML Pipeline & Preliminary Risk Engine',
    description:
      'Demonstrates a six-stage machine learning pipeline comparing Decision Tree, Random Forest, and Logistic Regression architectures alongside rule-based preliminary screening for laboratory heavy metal verification (Pb, Hg, As, Cd).',
    targetTab: 'live-monitoring',
    actionLabel: 'Explore Risk & Metal Screening',
    icon: BrainCircuit,
  },
  {
    code: '03',
    title: 'GIS Mapping & Spatial Intelligence',
    subtitle: 'Multi-Layer Hydrological Schematic',
    description:
      'Integrates upstream-to-downstream flow dynamics, station telemetry nodes, illustrative pollution hotspots, and thermal/ionic anomaly zones on an interactive spatial schematic.',
    targetTab: 'gis-map',
    actionLabel: 'Explore GIS Map',
    icon: Map,
  },
  {
    code: '04',
    title: 'Drone-Assisted Pollution Analysis',
    subtitle: 'Aerial Visual Inspection & Geo-Tagging',
    description:
      'Complements submerged sensor readings with an aerial surface inspection workflow to annotate solid waste, waste accumulation, discharge outlets, and water discoloration.',
    targetTab: 'drone-intelligence',
    actionLabel: 'Explore Drone Analysis',
    icon: Camera,
  },
];

const METHODOLOGY_STAGES = [
  {
    step: '01',
    title: 'Baseline Parameter Acquisition',
    detail:
      'Establish reference readings at Upstream Station A (pH 7.2, 24°C, 5 NTU, 7.5 mg/L DO, 250 µS/cm EC) for comparison against Midstream Station B and Downstream Station C.',
  },
  {
    step: '02',
    title: 'Gradient & Time-Series Analysis',
    detail:
      'Track cross-station variations to detect concurrent spikes in turbidity and electrical conductivity accompanied by dissolved oxygen depletion.',
  },
  {
    step: '03',
    title: 'Rule-Based Preliminary Screening',
    detail:
      'Classify station states into Low, Medium, or High preliminary risk tiers using transparent domain rules while awaiting paired laboratory datasets for supervised ML training.',
  },
  {
    step: '04',
    title: 'Spatial & Laboratory Correlation',
    detail:
      'Combine GIS hotspot mapping and aerial surface annotations to guide targeted field verification and laboratory spectroscopic testing (ICP-MS / AAS).',
  },
];

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({
  onNavigate,
}) => {
  const [showArchitectureMatrix, setShowArchitectureMatrix] = useState(false);

  return (
    <div className="space-y-16 sm:space-y-20 py-4 sm:py-8">
      {/* Editorial Research Presentation Header */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel rounded-3xl p-8 sm:p-12 space-y-5"
      >
        <div className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#0D9488]">
          Scientific Framework &amp; Methodology
        </div>

        <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-[#263B50] leading-tight max-w-4xl">
          IoT- and AI-Based River Water Quality Monitoring with{' '}
          <span className="font-serif-editorial italic font-normal text-[#0D9488]">
            Heavy Metal Risk Prediction
          </span>{' '}
          and Drone-Assisted Pollution Mapping.
        </h1>

        <p className="text-sm sm:text-base text-[#52667A] leading-relaxed max-w-3xl">
          RIVER INTELLIGENCE is an integrated environmental monitoring and decision-support framework designed to bridge continuous water-quality telemetry, preliminary risk screening, laboratory heavy-metal verification workflows, schematic GIS mapping, and aerial surface observation.
        </p>
      </motion.section>

      {/* Vision & Core Objectives + Research Gap & Scientific Limitations */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-7 sm:p-9 space-y-5">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0D9488]">
              01 · Vision &amp; Core Objectives
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-[#263B50]">
              Bridging Continuous Telemetry &amp; Field Action
            </h2>
          </div>

          <p className="text-sm text-[#52667A] leading-relaxed">
            Conventional river monitoring relies on infrequent manual grab sampling, leaving blind spots between upstream baselines and midstream discharge zones. This framework demonstrates how continuous physico-chemical sensing and spatial context can prioritize where laboratory testing is needed most.
          </p>

          <div className="rounded-2xl glass-subcard p-5 space-y-3 text-xs sm:text-sm text-[#263B50] leading-relaxed">
            <div>
              • <strong className="font-medium">Corridor Comparison:</strong> Monitor Upstream Reference (Station A), Midstream Influx (Station B), and Downstream Recovery (Station C) across five core water parameters.
            </div>
            <div>
              • <strong className="font-medium">Transparent Risk Screening:</strong> Flag multi-parameter anomalies—such as Station B’s 35 NTU turbidity, 650 µS/cm conductivity, and 4.8 mg/L dissolved oxygen—for targeted sampling.
            </div>
            <div>
              • <strong className="font-medium">Spatial &amp; Aerial Context:</strong> Correlate submerged sensor anomalies with surface pollution mapping on an interactive GIS schematic.
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-7 sm:p-9 space-y-5">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-amber-600">
              02 · Research Gap &amp; Scientific Limitations
            </div>
            <h2 className="text-xl sm:text-2xl font-light text-[#263B50]">
              Instrumentation Boundaries &amp; Honest Scope
            </h2>
          </div>

          <p className="text-sm text-[#52667A] leading-relaxed">
            In situ water probes measure bulk physical and chemical properties rapidly, whereas quantitative trace metal determination (Pb, Hg, As, Cd) requires specialized laboratory spectroscopy.
          </p>

          <div className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-5 space-y-2.5 text-xs sm:text-sm text-[#263B50] leading-relaxed">
            <div>
              1. The five monitored parameters (pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity) cannot directly measure dissolved heavy metal concentrations.
            </div>
            <div>
              2. Aerial drone imagery identifies visible surface features only and cannot independently detect dissolved trace metals.
            </div>
            <div>
              3. All sensor readings, GIS coordinates, and preliminary risk rules in this prototype are simulated for demonstration; actual machine learning validation requires a suitable labelled dataset and independent testing.
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Domains */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3 px-1">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0D9488]">
              03 · Project Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#263B50]">
              Four Integrated System Domains
            </h2>
          </div>

          <button
            onClick={() => setShowArchitectureMatrix(!showArchitectureMatrix)}
            className="rounded-full border border-[#70CFFF]/45 bg-white/80 px-4 py-2 text-xs font-medium text-[#0D9488] hover:text-[#263B50] cursor-pointer"
          >
            {showArchitectureMatrix
              ? 'Hide Dual-Track Architecture Matrix'
              : 'Inspect Dual-Track Architecture Matrix →'}
          </button>
        </div>

        {showArchitectureMatrix && (
          <div className="pt-2">
            <SystemArchitectureView onNavigate={onNavigate} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CORE_SYSTEM_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.code}
                className="glass-card rounded-3xl p-7 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#0D9488]">
                      DOMAIN {pillar.code}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl glass-subcard text-[#0D9488]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-[#263B50]">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-mono text-[#71869A]">
                      {pillar.subtitle}
                    </div>
                  </div>

                  <p className="text-sm text-[#52667A] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#70CFFF]/25 flex justify-end">
                  <button
                    onClick={() => onNavigate(pillar.targetTab)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D9488] hover:underline cursor-pointer"
                  >
                    <span>{pillar.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytical Methodology Workflow */}
      <section className="glass-panel rounded-3xl p-7 sm:p-10 space-y-6">
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#0D9488]">
            04 · Analytical Methodology
          </div>
          <h2 className="text-2xl font-light tracking-tight text-[#263B50]">
            Four-Stage Assessment Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {METHODOLOGY_STAGES.map((stage) => (
            <div
              key={stage.step}
              className="rounded-2xl glass-subcard p-5 space-y-2.5"
            >
              <div className="text-xs font-mono text-[#0D9488]">
                STEP {stage.step}
              </div>
              <h3 className="text-sm font-medium text-[#263B50]">
                {stage.title}
              </h3>
              <p className="text-xs text-[#52667A] leading-relaxed">
                {stage.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Exclusive Minimal Developer Credit — Displayed Only Once on the Entire Website */}
      <div className="pt-8 pb-4 text-center">
        <p className="text-xs font-mono tracking-[0.18em] uppercase text-[#71869A]">
          Developed by Rishav Kumar Pandey
        </p>
      </div>
    </div>
  );
};
