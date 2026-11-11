import React from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Camera,
  Cpu,
  FlaskConical,
  Layers,
  Map,
  ShieldAlert,
} from 'lucide-react';
import { NavigationTab } from '../types/monitoring';

interface AboutProjectViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

const TEAM_MEMBERS = [
  {
    roll: '139',
    name: 'Rijoy Biswas',
    role: 'IoT Telemetry Simulation & System Architecture',
  },
  {
    roll: '140',
    name: 'Rishabh Kumar Shaw',
    role: 'Water Quality Analytics & Data Visualization',
  },
  {
    roll: '141',
    name: 'Rishan Nandi',
    role: 'ML Pipeline Design & Preliminary Risk Logic',
  },
  {
    roll: '142',
    name: 'Rishav Kumar Pandey',
    role: 'Full-Stack Interface, GIS Corridor & Heavy Metal Framework',
  },
  {
    roll: '144',
    name: 'Ritik Kumar Ram',
    role: 'Drone Intelligence Workflow & Reporting System',
  },
];

const CORE_SYSTEM_PILLARS: {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  targetTab: NavigationTab;
  actionLabel: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    code: 'PILLAR 01',
    title: 'Environmental Monitoring System',
    subtitle: 'Simulated Multi-Station IoT Telemetry Corridor',
    description:
      'Models a three-node river monitoring corridor across Upstream Reference (Station A), Midstream Influx (Station B), and Downstream Recovery (Station C), tracking five core physico-chemical water parameters.',
    highlights: [
      'Parameters: pH, Water Temperature (°C), Turbidity (NTU), Dissolved Oxygen (mg/L), and Electrical Conductivity (µS/cm)',
      'Captures midstream influx anomalies at Station B (35 NTU turbidity, 650 µS/cm conductivity, 4.8 mg/L DO)',
      'Interactive simulation controls and temporal comparison analytics',
    ],
    targetTab: 'live-monitoring',
    actionLabel: 'Explore Live Monitoring',
    icon: Activity,
  },
  {
    code: 'PILLAR 02',
    title: 'AI-Based Analysis & Heavy Metal Screening',
    subtitle: 'ML Pipeline Architecture & Preliminary Risk Engine',
    description:
      'Demonstrates the structured machine learning pipeline from dataset preprocessing and feature selection to candidate classifier comparison, paired with a transparent rule-based preliminary risk assessment.',
    highlights: [
      'Pipeline: Dataset → Preprocessing → Feature Selection → Model Training → Model Evaluation → Prediction',
      'Evaluates Decision Tree, Random Forest, and Logistic Regression architectures',
      'Distinguishes preliminary risk screening from laboratory-confirmed heavy metal analysis (Pb, Hg, As, Cd)',
    ],
    targetTab: 'ai-risk',
    actionLabel: 'Explore AI Risk Assessment',
    icon: BrainCircuit,
  },
  {
    code: 'PILLAR 03',
    title: 'GIS Mapping & Spatial Intelligence',
    subtitle: 'Multi-Layer Hydrological Corridor Visualization',
    description:
      'Provides a schematic geospatial river visualization integrating upstream-to-downstream flow dynamics, station telemetry nodes, illustrative pollution hotspots, and thermal/ionic anomaly zones.',
    highlights: [
      'Five independently toggleable spatial layers (River Route, Stations, Hotspots, Heatmap, Drone Tags)',
      'Contextual inspection panels for Station A, B, and C and midstream hotspots',
      'Visualizes spatial dilution between midstream influx and downstream recovery reaches',
    ],
    targetTab: 'gis-map',
    actionLabel: 'Explore GIS Pollution Map',
    icon: Map,
  },
  {
    code: 'PILLAR 04',
    title: 'Drone-Assisted Pollution Analysis',
    subtitle: 'Aerial Visual Inspection & Surface Geo-Tagging',
    description:
      'Complements submerged sensor readings with an aerial visual observation workflow to identify and tag visible surface pollution along riverbanks and outfall channels.',
    highlights: [
      'Categories: Solid waste, Waste accumulation, Possible discharge outlet, Unusual water discoloration',
      'Interactive hotspot pin annotation and direct association with Station A, B, or C',
      'Synchronizes surface visual observations directly onto the GIS Pollution Map',
    ],
    targetTab: 'drone-intelligence',
    actionLabel: 'Explore Drone Intelligence',
    icon: Camera,
  },
];

const METHODOLOGY_STAGES = [
  {
    step: '01',
    title: 'Multi-Point Parameter Acquisition',
    detail:
      'Establish baseline readings at Upstream Station A (pH 7.2, 24°C, 5 NTU, 7.5 mg/L DO, 250 µS/cm EC) to compare against Midstream Station B and Downstream Station C.',
  },
  {
    step: '02',
    title: 'Comparative Gradient & Time-Series Analysis',
    detail:
      'Track cross-station variations to detect concurrent spikes in turbidity and electrical conductivity accompanied by dissolved oxygen depletion.',
  },
  {
    step: '03',
    title: 'Rule-Based Preliminary Risk Classification',
    detail:
      'Classify station states into Low, Medium, or High preliminary risk tiers using transparent domain rules while awaiting paired laboratory datasets for supervised ML training.',
  },
  {
    step: '04',
    title: 'Spatial & Aerial Correlation',
    detail:
      'Combine GIS hotspot mapping and aerial surface annotations to guide targeted field verification and laboratory spectroscopic testing (ICP-MS / AAS).',
  },
];

const FUTURE_SCOPE_ITEMS = [
  {
    title: 'Real-Time IoT Sensor Integration',
    description:
      'Interfacing physical waterproof sensor probes (pH, RTD temperature, optical turbidity, galvanic DO, and 4-electrode EC) with LoRaWAN/MQTT edge gateways.',
  },
  {
    title: 'Physical Sensor Deployment',
    description:
      'Solar-powered floating buoy stations anchored across upstream, midstream urban influx, and downstream recovery zones.',
  },
  {
    title: 'Laboratory Validation',
    description:
      'Periodic grab-sample collection analyzed via ICP-MS and Atomic Absorption Spectroscopy (AAS) to establish ground-truth heavy metal concentrations (Pb, Hg, As, Cd).',
  },
  {
    title: 'Independently Validated ML Models',
    description:
      'Training and benchmarking Decision Tree, Random Forest, and Logistic Regression classifiers on multi-season paired field-and-laboratory datasets.',
  },
  {
    title: 'Advanced Drone Imaging',
    description:
      'Automated UAV flight corridors capturing geotagged nadir RGB and multispectral imagery for shoreline waste and plume boundary tracking.',
  },
  {
    title: 'Continuous GIS-Based Monitoring',
    description:
      'Integration with spatial watershed databases for automated catchment-wide anomaly alerts and regulatory reporting.',
  },
];

export const AboutProjectView: React.FC<AboutProjectViewProps> = ({
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Academic Research Presentation Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border border-[#20D6D0]/35 bg-[#0B2030] p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#20D6D0]">
          <span>ASANSOL ENGINEERING COLLEGE</span>
          <span aria-hidden="true">·</span>
          <span>DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING</span>
          <span aria-hidden="true">·</span>
          <span>ACADEMIC SESSION 2026–2027</span>
          <span aria-hidden="true">·</span>
          <span>GROUP NUMBER: 4</span>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          PROJECT: RIVER INTELLIGENCE
        </h1>
        <p className="mt-1 text-sm sm:text-base font-medium text-[#20D6D0]">
          IoT- and AI-Based River Water Quality Monitoring with Heavy Metal Risk Prediction and Drone-Assisted Pollution Mapping
        </p>

        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          An integrated environmental monitoring and decision-support framework designed to bridge water-quality sensor telemetry, preliminary risk screening, heavy-metal laboratory verification workflows, schematic GIS mapping, and aerial surface observation.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-slate-800 pt-4 text-xs">
          <div>
            <div className="text-slate-400">Institution</div>
            <div className="mt-0.5 font-semibold text-white">
              Asansol Engineering College
            </div>
          </div>
          <div>
            <div className="text-slate-400">Department</div>
            <div className="mt-0.5 font-semibold text-white">
              Computer Science and Engineering
            </div>
          </div>
          <div>
            <div className="text-slate-400">Academic Session</div>
            <div className="mt-0.5 font-mono font-semibold text-white">
              2026–2027
            </div>
          </div>
          <div>
            <div className="text-slate-400">Research Group</div>
            <div className="mt-0.5 font-mono font-semibold text-[#20D6D0]">
              Group Number 4 (First-Year CSE)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project Overview & Integrated Framework Pillars */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              PROJECT OVERVIEW & INTEGRATED ARCHITECTURE
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
              Core Domains of the RIVER INTELLIGENCE Framework
            </h2>
          </div>
          <button
            onClick={() => onNavigate('system-architecture')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20D6D0] hover:underline cursor-pointer"
          >
            <span>Inspect Full Dual-Track System Architecture</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {CORE_SYSTEM_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.code}
                className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 flex flex-col justify-between hover:border-[#20D6D0]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#20D6D0]">
                      {pillar.code}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#20D6D0]/30 bg-[#061421] text-[#20D6D0]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {pillar.title}
                    </h3>
                    <div className="text-xs font-mono text-slate-400">
                      {pillar.subtitle}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="rounded-lg border border-slate-800 bg-[#061421] p-3.5 space-y-1.5 text-xs text-slate-300">
                    {pillar.highlights.map((item, idx) => (
                      <div key={idx} className="leading-relaxed">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
                  <button
                    onClick={() => onNavigate(pillar.targetTab)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#20D6D0] hover:underline cursor-pointer"
                  >
                    <span>{pillar.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vision & Core Objectives + Research Gap & Scientific Limitations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6 space-y-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              01 · VISION & CORE OBJECTIVES
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              Project Vision & Engineering Objectives
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Conventional river monitoring relies on infrequent manual grab sampling, creating blind spots between upstream baselines and midstream industrial or urban discharge zones. <strong>RIVER INTELLIGENCE</strong> demonstrates a unified environmental intelligence framework that combines continuous physico-chemical telemetry, preliminary risk screening, spatial GIS mapping, and aerial surface inspection.
          </p>

          <div className="rounded-lg border border-slate-800 bg-[#061421] p-4 space-y-2.5 text-xs text-slate-200">
            <div>
              • <strong>Multi-Point Corridor Comparison:</strong> Monitor Upstream Reference (Station A), Midstream Influx (Station B), and Downstream Recovery (Station C) across pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity.
            </div>
            <div>
              • <strong>Transparent Preliminary Screening:</strong> Flag multi-parameter anomalies (such as Station B’s elevated turbidity and conductivity and depleted dissolved oxygen) to prioritize targeted laboratory sampling.
            </div>
            <div>
              • <strong>Spatial & Aerial Context:</strong> Fuse submerged sensor anomalies with drone-assisted surface pollution mapping on an interactive GIS schematic.
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6 space-y-4">
          <div>
            <div className="text-xs font-mono text-[#F4B942]">
              02 · RESEARCH GAP & SCIENTIFIC LIMITATIONS
            </div>
            <h3 className="mt-1 text-lg font-bold text-white">
              Research Gap & Honest Prototype Boundaries
            </h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              <strong className="text-white">Identified Research Gap:</strong> Low-cost IoT stations measure bulk physical and chemical parameters rapidly, whereas quantitative heavy metal analysis (Pb, Hg, As, Cd) requires specialized, time-intensive laboratory spectroscopy. Bridging this gap requires combining continuous sensor anomaly screening with targeted laboratory verification.
            </p>
            <div className="rounded-lg border border-[#F4B942]/30 bg-[#061421] p-4 space-y-2">
              <div className="font-semibold text-[#F4B942]">
                Mandatory Scientific & Prototype Limitations:
              </div>
              <div>
                1. The five basic water-quality parameters (pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity) cannot directly measure dissolved heavy metal concentrations.
              </div>
              <div>
                2. Aerial drone imagery identifies visible surface pollution only and cannot independently detect dissolved trace metals.
              </div>
              <div>
                3. All sensor readings, GIS coordinates, and preliminary risk rules in this prototype are simulated for academic demonstration; actual machine learning validation requires a suitable labelled dataset and independent testing.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology and Methodology Section */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              03 · TECHNOLOGY AND METHODOLOGY
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              Analytical Methodology & Framework Workflow
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            SIMULATED TELEMETRY · RULE-BASED RISK · SCHEMATIC GIS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METHODOLOGY_STAGES.map((stage) => (
            <div
              key={stage.step}
              className="rounded-xl border border-slate-800 bg-[#061421] p-4 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono font-bold text-[#20D6D0]">
                  METHODOLOGY STEP {stage.step}
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-white">
                  {stage.title}
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {stage.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members Directory (Group 4: 139, 140, 141, 142, 144) */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              04 · PROJECT RESEARCH & ENGINEERING TEAM
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              Group 4 Team Members — Asansol Engineering College (CSE)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            5 MEMBERS · ACADEMIC SESSION 2026–2027
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.roll}
              className="rounded-xl border border-slate-800 bg-[#061421] p-4 flex items-start gap-3.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#20D6D0]/40 bg-[#0B2030] font-mono text-sm font-bold text-[#20D6D0]">
                {member.roll}
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400">
                  ROLL NO. {member.roll}
                </div>
                <div className="text-base font-bold text-white">{member.name}</div>
                <div className="mt-1 text-xs text-slate-400">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Scope Roadmap */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              05 · FUTURE SCOPE & FIELD DEPLOYMENT ROADMAP
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              Proposed Extensions for Real-World River Basin Deployment
            </h2>
          </div>
          <button
            onClick={() => onNavigate('overview')}
            className="min-h-[40px] rounded-lg bg-[#20D6D0] px-4 py-2 text-xs font-semibold text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors cursor-pointer"
          >
            Return to Command Centre →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE_SCOPE_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-800 bg-[#061421] p-4"
            >
              <div className="text-xs font-mono font-bold text-[#20D6D0]">
                PHASE 0{idx + 1}
              </div>
              <h3 className="mt-1 text-sm font-bold text-white">{item.title}</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
