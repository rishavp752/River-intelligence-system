import React, { useState } from 'react';
import {
  ArrowDown,
  Camera,
  Cpu,
  Database,
  Globe,
  Layers,
  Monitor,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import { NavigationTab } from '../types/monitoring';

interface SystemArchitectureViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

interface ArchNode {
  id: string;
  track: 'iot' | 'drone';
  stepNumber: string;
  title: string;
  implementationState: 'Simulated in Prototype' | 'Proposed / Conceptual Layer';
  prototypeMechanism: string;
  proposedFieldSpec: string;
  linkedModule: NavigationTab;
}

const IOT_TRACK_NODES: ArchNode[] = [
  {
    id: 'iot-1',
    track: 'iot',
    stepNumber: '01',
    title: 'Simulated IoT Sensor Network',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Virtual station telemetry engine generating controlled readings for Station A, B, and C across pH, Temperature, Turbidity, Dissolved Oxygen, and Electrical Conductivity.',
    proposedFieldSpec:
      'Submerged multi-parameter probe buoys (ESP32 / STM32 nodes with LoRaWAN / GSM telemetry) deployed along river reaches.',
    linkedModule: 'live-monitoring',
  },
  {
    id: 'iot-2',
    track: 'iot',
    stepNumber: '02',
    title: 'Python Data Processing',
    implementationState: 'Proposed / Conceptual Layer',
    prototypeMechanism:
      'Represented in-browser via TypeScript data normalization, time-series windowing, and anomaly delta calculations.',
    proposedFieldSpec:
      'Python (Pandas / NumPy / SciPy) ingestion pipeline for missing-packet interpolation, outlier rejection, and feature scaling.',
    linkedModule: 'water-analytics',
  },
  {
    id: 'iot-3',
    track: 'iot',
    stepNumber: '03',
    title: 'Machine Learning Model',
    implementationState: 'Proposed / Conceptual Layer',
    prototypeMechanism:
      'Architectural workflow demonstration of Decision Tree, Random Forest, and Logistic Regression classifiers.',
    proposedFieldSpec:
      'Scikit-Learn supervised models trained and cross-validated on paired sensor and ICP-MS laboratory datasets.',
    linkedModule: 'ai-risk',
  },
  {
    id: 'iot-4',
    track: 'iot',
    stepNumber: '04',
    title: 'Pollution / Risk Assessment',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Transparent, deterministic rule-based preliminary risk engine classifying stations into Low, Medium, and High risk tiers.',
    proposedFieldSpec:
      'Calibrated multi-class probabilistic risk inference combined with laboratory heavy-metal confirmation protocols.',
    linkedModule: 'heavy-metals',
  },
  {
    id: 'iot-5',
    track: 'iot',
    stepNumber: '05',
    title: 'GIS Mapping',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Interactive multi-layer SVG river schematic with toggleable stations, illustrative hotspots, heatmap aura, and UAV tags.',
    proposedFieldSpec:
      'GeoJSON / PostGIS spatial database with real-world GNSS coordinates and hydrological watershed layers.',
    linkedModule: 'gis-map',
  },
  {
    id: 'iot-6',
    track: 'iot',
    stepNumber: '06',
    title: 'Streamlit Dashboard Concept',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Realized in this self-contained React + TypeScript interactive web application for exhibition and demonstration.',
    proposedFieldSpec:
      'Python Streamlit / FastAPI analytical web portal connected to live sensor ingestion and lab LIMS databases.',
    linkedModule: 'overview',
  },
];

const DRONE_TRACK_NODES: ArchNode[] = [
  {
    id: 'drn-1',
    track: 'drone',
    stepNumber: '01',
    title: 'Aerial Image Acquisition',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Local image file upload and curated sample aerial river frames (no physical drone survey conducted).',
    proposedFieldSpec:
      'Quadcopter UAV equipped with nadir RGB camera and RTK-GNSS flight path logging along river banks.',
    linkedModule: 'drone-intelligence',
  },
  {
    id: 'drn-2',
    track: 'drone',
    stepNumber: '02',
    title: 'Image Processing',
    implementationState: 'Proposed / Conceptual Layer',
    prototypeMechanism:
      'Browser-based interactive image canvas with coordinate normalization and visual region inspection.',
    proposedFieldSpec:
      'Orthomosaic stitching, radiometric correction, and water-channel segmentation using OpenCV.',
    linkedModule: 'drone-intelligence',
  },
  {
    id: 'drn-3',
    track: 'drone',
    stepNumber: '03',
    title: 'Visible Pollution Identification',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Interactive category tagging & manual hotspot pin annotation for solid waste, waste accumulation, discharge outlets, and discoloration.',
    proposedFieldSpec:
      'Assisted visual inspection & object detection models verified by field environmental engineers.',
    linkedModule: 'drone-intelligence',
  },
  {
    id: 'drn-4',
    track: 'drone',
    stepNumber: '04',
    title: 'Geographical Tagging',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Direct association of annotated aerial observations with Monitoring Station A, B, or C.',
    proposedFieldSpec:
      'EXIF GPS metadata extraction mapping image bounding boxes to river kilometer markers.',
    linkedModule: 'drone-intelligence',
  },
  {
    id: 'drn-5',
    track: 'drone',
    stepNumber: '05',
    title: 'GIS Integration',
    implementationState: 'Simulated in Prototype',
    prototypeMechanism:
      'Live synchronization of saved UAV observations onto the GIS Pollution Map Drone Observations layer.',
    proposedFieldSpec:
      'Unified spatial overlay correlating surface visual anomalies with submerged IoT probe spikes.',
    linkedModule: 'gis-map',
  },
];

export const SystemArchitectureView: React.FC<SystemArchitectureViewProps> = ({
  onNavigate,
}) => {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(IOT_TRACK_NODES[0]);

  return (
    <div className="space-y-6">
      {/* Architecture Prototype Honesty Header */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-[#0D9488] font-bold">
            DUAL-TRACK ENVIRONMENTAL MONITORING ARCHITECTURE
          </span>
          <span className="text-amber-600 font-semibold">
            INTERACTIVE WEB PROTOTYPE OF PROPOSED FRAMEWORK
          </span>
        </div>
        <h1 className="mt-1.5 text-xl font-extrabold text-[#263B50] sm:text-2xl">
          System Architecture & Implementation Transparency Matrix
        </h1>
        <p className="mt-1.5 text-sm text-[#52667A] leading-relaxed">
          This interactive diagram illustrates the two parallel tracks of the <strong>RIVER INTELLIGENCE</strong> framework: the <strong>IoT & Machine Learning Telemetry Pipeline</strong> and the <strong>Drone-Assisted Visual GIS Track</strong>. Click any architectural node to inspect what is simulated in this web prototype versus what is proposed for future field deployment.
        </p>
        <div className="mt-3 rounded-xl glass-subcard px-4 py-3 text-xs text-[#263B50]">
          <strong className="text-[#0D9488]">Prototype Transparency Note:</strong> This web application is a self-contained React + TypeScript interactive demonstration of the proposed framework. It does not claim to be an active Python/Streamlit server deployment or a live physical IoT hardware installation.
        </div>
      </div>

      {/* Main Dual-Track Architecture Interactive Diagram + Inspector Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Dual Track Pipelines (2 Columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Track 1: IoT & ML Pipeline */}
          <div className="glass-card rounded-2xl p-5">
            <div className="border-b border-[#70CFFF]/30 pb-3 mb-4">
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                TRACK 01 · SENSOR & ML PIPELINE
              </div>
              <h2 className="mt-0.5 text-base font-bold text-[#263B50]">
                IoT Telemetry to Dashboard Flow
              </h2>
            </div>

            <div className="space-y-3">
              {IOT_TRACK_NODES.map((node, index) => {
                const isSelected = selectedNode.id === node.id;
                const isSimulated = node.implementationState === 'Simulated in Prototype';

                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#20CFC6] bg-white/95 shadow-md ring-2 ring-[#20CFC6]/20'
                          : 'border-[#70CFFF]/30 bg-white/60 hover:border-[#20CFC6]/60 hover:bg-white/85'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#0D9488] font-bold">
                          NODE {node.stepNumber}
                        </span>
                        <span
                          className={
                            isSimulated ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'
                          }
                        >
                          {node.implementationState}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-[#263B50]">
                        {node.title}
                      </div>
                      <p className="mt-1 text-xs text-[#52667A] line-clamp-2">
                        {node.prototypeMechanism}
                      </p>
                    </div>

                    {index < IOT_TRACK_NODES.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-0.5 bg-[#20CFC6]/60" />
                          <ArrowDown className="h-3.5 w-3.5 text-[#0D9488]" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Track 2: Parallel Drone-Assisted Analysis Track */}
          <div className="glass-card rounded-2xl p-5">
            <div className="border-b border-[#70CFFF]/30 pb-3 mb-4">
              <div className="text-xs font-mono font-bold text-[#0284C7]">
                TRACK 02 · PARALLEL AERIAL TRACK
              </div>
              <h2 className="mt-0.5 text-base font-bold text-[#263B50]">
                Drone-Assisted GIS Integration
              </h2>
            </div>

            <div className="space-y-3">
              {DRONE_TRACK_NODES.map((node, index) => {
                const isSelected = selectedNode.id === node.id;
                const isSimulated = node.implementationState === 'Simulated in Prototype';

                return (
                  <React.Fragment key={node.id}>
                    <div
                      onClick={() => setSelectedNode(node)}
                      className={`rounded-xl border p-3.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#20CFC6] bg-white/95 shadow-md ring-2 ring-[#20CFC6]/20'
                          : 'border-[#70CFFF]/30 bg-white/60 hover:border-[#20CFC6]/60 hover:bg-white/85'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#0284C7] font-bold">
                          AERIAL {node.stepNumber}
                        </span>
                        <span
                          className={
                            isSimulated ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'
                          }
                        >
                          {node.implementationState}
                        </span>
                      </div>
                      <div className="mt-1 text-sm font-bold text-[#263B50]">
                        {node.title}
                      </div>
                      <p className="mt-1 text-xs text-[#52667A] line-clamp-2">
                        {node.prototypeMechanism}
                      </p>
                    </div>

                    {index < DRONE_TRACK_NODES.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-0.5 bg-[#70CFFF]/70" />
                          <ArrowDown className="h-3.5 w-3.5 text-[#0284C7]" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Convergence Indicator into GIS Mapping */}
              <div className="mt-4 rounded-xl border border-[#20CFC6]/45 bg-[#EDF8FF]/90 p-3.5 text-xs text-[#263B50]">
                <div className="font-mono font-bold text-[#0D9488]">
                  ⇄ CONVERGENCE POINT: GIS MAPPING & DASHBOARD
                </div>
                <p className="mt-1 text-[#52667A]">
                  Both tracks converge in the GIS Pollution Map, overlaying surface drone annotations with submerged station telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Node Inspector */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                ARCHITECTURAL NODE SPECIFICATION
              </div>
              <h2 className="mt-1 text-xl font-bold text-[#263B50]">
                {selectedNode.title}
              </h2>
              <div className="mt-1 text-xs font-mono font-semibold text-amber-600">
                Status: {selectedNode.implementationState}
              </div>
            </div>

            <div className="rounded-xl glass-subcard p-4 space-y-1.5">
              <div className="text-xs font-bold text-[#0D9488]">
                What Is Implemented in This Prototype:
              </div>
              <p className="text-xs text-[#263B50] leading-relaxed">
                {selectedNode.prototypeMechanism}
              </p>
            </div>

            <div className="rounded-xl glass-subcard p-4 space-y-1.5">
              <div className="text-xs font-bold text-[#0284C7]">
                Proposed Future Field / Production Specification:
              </div>
              <p className="text-xs text-[#52667A] leading-relaxed">
                {selectedNode.proposedFieldSpec}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-[#70CFFF]/30 pt-4">
            <button
              onClick={() => onNavigate(selectedNode.linkedModule)}
              className="w-full rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] py-2.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              Open Corresponding Prototype Module →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
