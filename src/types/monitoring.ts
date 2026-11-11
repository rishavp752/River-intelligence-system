export type StationId = 'A' | 'B' | 'C';

export type NavigationTab =
  | 'overview'
  | 'live-monitoring'
  | 'water-analytics'
  | 'ai-risk'
  | 'heavy-metals'
  | 'gis-map'
  | 'drone-intelligence'
  | 'alerts-reports'
  | 'system-architecture'
  | 'about-project';

export type ParameterKey = 'ph' | 'temperature' | 'turbidity' | 'dissolvedOxygen' | 'conductivity';

export interface WaterReadings {
  ph: number;
  temperature: number; // °C
  turbidity: number; // NTU
  dissolvedOxygen: number; // mg/L
  conductivity: number; // µS/cm
}

export interface StationData {
  id: StationId;
  code: string;
  name: string;
  role: string;
  zoneDescription: string;
  schematicCoords: { x: number; y: number; label: string };
  status: 'Nominal' | 'Flagged' | 'Monitoring';
  isFlagged: boolean;
  highlightSummary?: string[];
  readings: WaterReadings;
  baselineReadings: WaterReadings;
  lastUpdated: string;
  sensorLatencyMs: number;
}

export interface TimeSeriesPoint {
  timestamp: string;
  timeLabel: string;
  A: WaterReadings;
  B: WaterReadings;
  C: WaterReadings;
}

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskEvaluationResult {
  stationId: StationId;
  level: RiskLevel;
  score: number; // 0 to 100 illustrative index
  reasons: string[];
  parameterFlags: {
    parameter: string;
    value: string;
    status: 'Normal' | 'Elevated' | 'Critical';
    explanation: string;
  }[];
}

export interface HeavyMetalInfo {
  symbol: 'Pb' | 'Hg' | 'As' | 'Cd';
  name: string;
  atomicNumber: number;
  atomicMass: string;
  significance: string;
  potentialSources: string[];
  ecologicalImpact: string;
  labTestingMethod: string;
  datasetStatus: 'Awaiting labelled dataset';
  predictionStatus: 'Preliminary Indirect Indicator Only — Unvalidated';
  labConfirmationStatus: 'Required for Quantitative Verification';
  proxyCorrelationNote: string;
}

export interface GisHotspot {
  id: string;
  title: string;
  nearestStation: StationId;
  schematicLocation: string;
  svgX: number;
  svgY: number;
  severity: 'High' | 'Moderate';
  type: string;
  description: string;
  suggestedAction: string;
  linkedParameters: string[];
}

export type ObservationCategory =
  | 'Solid waste'
  | 'Waste accumulation'
  | 'Possible discharge outlet'
  | 'Unusual water discoloration';

export interface DroneAnnotationPin {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  category: ObservationCategory;
}

export interface DroneObservationRecord {
  id: string;
  title: string;
  stationId: StationId;
  timestamp: string;
  imageUrl: string;
  isCustomUpload: boolean;
  categories: ObservationCategory[];
  detectionStatus: string;
  notes: string;
  annotations: DroneAnnotationPin[];
  svgMapCoords: { x: number; y: number };
}

export interface AlertItem {
  id: string;
  stationId: StationId;
  severity: 'High' | 'Medium' | 'Low';
  title: string;
  message: string;
  reason: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  module: string;
  description: string;
  stationId?: StationId;
}
