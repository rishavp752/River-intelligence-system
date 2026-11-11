import {
  StationData,
  StationId,
  WaterReadings,
  TimeSeriesPoint,
  RiskEvaluationResult,
  HeavyMetalInfo,
  GisHotspot,
  DroneObservationRecord,
  AlertItem,
  ParameterKey,
} from '../types/monitoring';

export const BASELINE_STATIONS: Record<StationId, StationData> = {
  A: {
    id: 'A',
    code: 'STN-A // UPSTREAM',
    name: 'Station A — Upstream Reference',
    role: 'Baseline Entry Corridor',
    zoneDescription:
      'Located in the upper river reach prior to urban drainage channels and industrial discharge points. Serves as the reference baseline for comparative water-quality analysis.',
    schematicCoords: { x: 165, y: 145, label: 'Sector N-01 (Km 0.0 Reference)' },
    status: 'Nominal',
    isFlagged: false,
    highlightSummary: [
      'Lowest turbidity baseline (5 NTU)',
      'Highest dissolved oxygen (7.5 mg/L)',
      'Lowest electrical conductivity (250 µS/cm)',
    ],
    readings: {
      ph: 7.2,
      temperature: 24,
      turbidity: 5,
      dissolvedOxygen: 7.5,
      conductivity: 250,
    },
    baselineReadings: {
      ph: 7.2,
      temperature: 24,
      turbidity: 5,
      dissolvedOxygen: 7.5,
      conductivity: 250,
    },
    lastUpdated: '12:30:00',
    sensorLatencyMs: 42,
  },
  B: {
    id: 'B',
    code: 'STN-B // MIDSTREAM',
    name: 'Station B — Middle / Midstream Influx',
    role: 'Primary Influx & Anomaly Zone',
    zoneDescription:
      'Positioned adjacent to midstream surface runoff channels and effluent mixing zones. Flagged due to elevated suspended solids, high ionic conductivity, and depleted dissolved oxygen.',
    schematicCoords: { x: 495, y: 235, label: 'Sector M-04 (Km 4.8 Midstream)' },
    status: 'Flagged',
    isFlagged: true,
    highlightSummary: [
      'Highest turbidity (35 NTU)',
      'Highest electrical conductivity (650 µS/cm)',
      'Lowest dissolved oxygen (4.8 mg/L)',
    ],
    readings: {
      ph: 6.5,
      temperature: 27,
      turbidity: 35,
      dissolvedOxygen: 4.8,
      conductivity: 650,
    },
    baselineReadings: {
      ph: 6.5,
      temperature: 27,
      turbidity: 35,
      dissolvedOxygen: 4.8,
      conductivity: 650,
    },
    lastUpdated: '12:30:00',
    sensorLatencyMs: 48,
  },
  C: {
    id: 'C',
    code: 'STN-C // DOWNSTREAM',
    name: 'Station C — Downstream Recovery',
    role: 'Dilution & Natural Attenuation Reach',
    zoneDescription:
      'Situated 6.4 km downstream of the midstream influx zone. Demonstrates partial natural dilution and re-aeration, though conductivity and turbidity remain above upstream baseline.',
    schematicCoords: { x: 830, y: 170, label: 'Sector S-09 (Km 11.2 Downstream)' },
    status: 'Monitoring',
    isFlagged: false,
    highlightSummary: [
      'Moderate turbidity attenuation (15 NTU)',
      'Partial dissolved oxygen recovery (6.2 mg/L)',
      'Intermediate conductivity (400 µS/cm)',
    ],
    readings: {
      ph: 7.8,
      temperature: 29,
      turbidity: 15,
      dissolvedOxygen: 6.2,
      conductivity: 400,
    },
    baselineReadings: {
      ph: 7.8,
      temperature: 29,
      turbidity: 15,
      dissolvedOxygen: 6.2,
      conductivity: 400,
    },
    lastUpdated: '12:30:00',
    sensorLatencyMs: 39,
  },
};

export interface ParameterMetadata {
  key: ParameterKey;
  label: string;
  shortLabel: string;
  unit: string;
  minRange: number;
  maxRange: number;
  step: number;
  demoReferenceLabel: string;
  demoReferenceValue: number;
  demoReferenceDirection: 'above-bad' | 'below-bad' | 'band';
  whatItMeasures: string;
  whyItMatters: string;
  sensorPrinciple: string;
}

export const PARAMETER_METADATA: Record<ParameterKey, ParameterMetadata> = {
  ph: {
    key: 'ph',
    label: 'pH Level',
    shortLabel: 'pH',
    unit: 'pH units',
    minRange: 4.5,
    maxRange: 9.5,
    step: 0.1,
    demoReferenceLabel: 'Configurable Demo Neutral Band (6.8 – 8.0)',
    demoReferenceValue: 6.8,
    demoReferenceDirection: 'band',
    whatItMeasures:
      'Measures the hydrogen ion activity (acidity or alkalinity) of the river water on a logarithmic scale from 0 to 14.',
    whyItMatters:
      'Shifts in pH alter aquatic metabolic rates and significantly affect the solubility and chemical bioavailability of dissolved compounds and metallic ions.',
    sensorPrinciple: 'Glass bulb Ag/AgCl potentiometric electrode with temperature compensation.',
  },
  temperature: {
    key: 'temperature',
    label: 'Water Temperature',
    shortLabel: 'Temp',
    unit: '°C',
    minRange: 10,
    maxRange: 40,
    step: 0.5,
    demoReferenceLabel: 'Configurable Demo Reference (28.0 °C)',
    demoReferenceValue: 28,
    demoReferenceDirection: 'above-bad',
    whatItMeasures:
      'Measures the thermal energy state of the water column at the submerged sensor probe depth.',
    whyItMatters:
      'Warmer water holds less dissolved oxygen, accelerates microbial decomposition, and can indicate thermal discharge or shallow solar heating.',
    sensorPrinciple: 'Waterproof digital NTC thermistor / Platinum RTD (PT1000) probe.',
  },
  turbidity: {
    key: 'turbidity',
    label: 'Turbidity',
    shortLabel: 'Turbidity',
    unit: 'NTU',
    minRange: 0,
    maxRange: 80,
    step: 1,
    demoReferenceLabel: 'Configurable Demo Alert Reference (25 NTU)',
    demoReferenceValue: 25,
    demoReferenceDirection: 'above-bad',
    whatItMeasures:
      'Quantifies optical cloudiness or haziness caused by suspended particulate matter (silt, clay, organic detritus, and surface runoff plumes).',
    whyItMatters:
      'High turbidity blocks photosynthetic light penetration, smothers benthic habitats, and provides particle surfaces to which contaminants may adsorb.',
    sensorPrinciple: '90° Infrared Nephelometric light-scattering optical photodiode sensor.',
  },
  dissolvedOxygen: {
    key: 'dissolvedOxygen',
    label: 'Dissolved Oxygen (DO)',
    shortLabel: 'Dissolved O₂',
    unit: 'mg/L',
    minRange: 1.0,
    maxRange: 12.0,
    step: 0.1,
    demoReferenceLabel: 'Configurable Demo Minimum Reference (5.5 mg/L)',
    demoReferenceValue: 5.5,
    demoReferenceDirection: 'below-bad',
    whatItMeasures:
      'Measures the concentration of free, non-compound molecular oxygen (O₂) dissolved in the river water.',
    whyItMatters:
      'Dissolved oxygen is essential for fish and aerobic aquatic organisms. Rapid drops in DO often signal organic waste influx or biochemical oxygen demand spikes.',
    sensorPrinciple: 'Galvanic / Optical luminescent dissolved oxygen probe.',
  },
  conductivity: {
    key: 'conductivity',
    label: 'Electrical Conductivity (EC)',
    shortLabel: 'Conductivity',
    unit: 'µS/cm',
    minRange: 50,
    maxRange: 1200,
    step: 10,
    demoReferenceLabel: 'Configurable Demo Elevated Reference (500 µS/cm)',
    demoReferenceValue: 500,
    demoReferenceDirection: 'above-bad',
    whatItMeasures:
      'Measures the ability of water to conduct an electrical current, which directly correlates with total dissolved ionic solids (salts, minerals, and inorganic discharges).',
    whyItMatters:
      'Sudden increases in electrical conductivity between upstream and midstream stations are a primary indicator of dissolved effluent or runoff entering the river.',
    sensorPrinciple: 'Two-cell or four-electrode alternating-current conductivity cell.',
  },
};

export function generateInitialTimeSeries(count = 16): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const baseTime = new Date(2026, 10, 10, 12, 0, 0);

  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(baseTime.getTime() - i * 15 * 60 * 1000);
    const hh = String(t.getHours()).padStart(2, '0');
    const mm = String(t.getMinutes()).padStart(2, '0');
    const wave = Math.sin(i * 0.65);
    const cosWave = Math.cos(i * 0.5);

    points.push({
      timestamp: t.toISOString(),
      timeLabel: `${hh}:${mm}`,
      A: {
        ph: Number((7.2 + wave * 0.08).toFixed(2)),
        temperature: Number((24 + cosWave * 0.3).toFixed(1)),
        turbidity: Math.max(2, Number((5 + wave * 0.8).toFixed(1))),
        dissolvedOxygen: Number((7.5 + cosWave * 0.15).toFixed(2)),
        conductivity: Math.round(250 + wave * 8),
      },
      B: {
        ph: Number((6.5 + cosWave * 0.1).toFixed(2)),
        temperature: Number((27 + wave * 0.4).toFixed(1)),
        turbidity: Math.max(15, Number((35 + wave * 2.4).toFixed(1))),
        dissolvedOxygen: Number((4.8 - wave * 0.2).toFixed(2)),
        conductivity: Math.round(650 + cosWave * 18),
      },
      C: {
        ph: Number((7.8 + wave * 0.09).toFixed(2)),
        temperature: Number((29 + cosWave * 0.35).toFixed(1)),
        turbidity: Math.max(8, Number((15 + cosWave * 1.3).toFixed(1))),
        dissolvedOxygen: Number((6.2 + wave * 0.18).toFixed(2)),
        conductivity: Math.round(400 + wave * 12),
      },
    });
  }

  // Ensure the final point matches the exact baseline readings
  if (points.length > 0) {
    points[points.length - 1] = {
      ...points[points.length - 1],
      timeLabel: '12:30',
      A: { ...BASELINE_STATIONS.A.baselineReadings },
      B: { ...BASELINE_STATIONS.B.baselineReadings },
      C: { ...BASELINE_STATIONS.C.baselineReadings },
    };
  }

  return points;
}

/**
 * Transparent Rule-Based Preliminary Risk Engine
 * Honest demonstration rules — NOT a trained ML model.
 */
export function evaluateStationRisk(
  stationId: StationId,
  readings: WaterReadings
): RiskEvaluationResult {
  let score = 12;
  const reasons: string[] = [];
  const parameterFlags: RiskEvaluationResult['parameterFlags'] = [];

  // 1. Turbidity evaluation
  if (readings.turbidity >= 28) {
    score += 32;
    reasons.push(
      `High turbidity (${readings.turbidity} NTU) indicates elevated suspended particulate load compared to upstream reference.`
    );
    parameterFlags.push({
      parameter: 'Turbidity',
      value: `${readings.turbidity} NTU`,
      status: 'Critical',
      explanation: 'Exceeds illustrative demo alert level (25 NTU); high suspended solids.',
    });
  } else if (readings.turbidity >= 12) {
    score += 14;
    reasons.push(
      `Moderate turbidity (${readings.turbidity} NTU) shows partial particulate attenuation above upstream baseline.`
    );
    parameterFlags.push({
      parameter: 'Turbidity',
      value: `${readings.turbidity} NTU`,
      status: 'Elevated',
      explanation: 'Above upstream baseline (5 NTU) but below critical midstream peak.',
    });
  } else {
    parameterFlags.push({
      parameter: 'Turbidity',
      value: `${readings.turbidity} NTU`,
      status: 'Normal',
      explanation: 'Clear water column within baseline demonstration range.',
    });
  }

  // 2. Electrical Conductivity evaluation
  if (readings.conductivity >= 550) {
    score += 28;
    reasons.push(
      `Elevated electrical conductivity (${readings.conductivity} µS/cm) signals substantial dissolved ionic influx.`
    );
    parameterFlags.push({
      parameter: 'Electrical Conductivity',
      value: `${readings.conductivity} µS/cm`,
      status: 'Critical',
      explanation: 'Exceeds illustrative demo reference (500 µS/cm); strong ionic anomaly.',
    });
  } else if (readings.conductivity >= 350) {
    score += 12;
    reasons.push(
      `Intermediate electrical conductivity (${readings.conductivity} µS/cm) reflects downstream dilution of dissolved ions.`
    );
    parameterFlags.push({
      parameter: 'Electrical Conductivity',
      value: `${readings.conductivity} µS/cm`,
      status: 'Elevated',
      explanation: 'Moderately above upstream reference (250 µS/cm).',
    });
  } else {
    parameterFlags.push({
      parameter: 'Electrical Conductivity',
      value: `${readings.conductivity} µS/cm`,
      status: 'Normal',
      explanation: 'Low baseline ionic conductivity.',
    });
  }

  // 3. Dissolved Oxygen evaluation
  if (readings.dissolvedOxygen <= 5.2) {
    score += 24;
    reasons.push(
      `Depleted dissolved oxygen (${readings.dissolvedOxygen} mg/L) indicates oxygen consumption stress in the water column.`
    );
    parameterFlags.push({
      parameter: 'Dissolved Oxygen',
      value: `${readings.dissolvedOxygen} mg/L`,
      status: 'Critical',
      explanation: 'Below illustrative demo minimum (5.5 mg/L); potential aquatic stress.',
    });
  } else if (readings.dissolvedOxygen <= 6.5) {
    score += 10;
    reasons.push(
      `Dissolved oxygen (${readings.dissolvedOxygen} mg/L) shows partial re-aeration recovery.`
    );
    parameterFlags.push({
      parameter: 'Dissolved Oxygen',
      value: `${readings.dissolvedOxygen} mg/L`,
      status: 'Elevated',
      explanation: 'Recovering toward upstream baseline (7.5 mg/L).',
    });
  } else {
    parameterFlags.push({
      parameter: 'Dissolved Oxygen',
      value: `${readings.dissolvedOxygen} mg/L`,
      status: 'Normal',
      explanation: 'Healthy oxygenation level in simulated stream.',
    });
  }

  // 4. pH evaluation
  if (readings.ph < 6.7 || readings.ph > 8.2) {
    score += 10;
    reasons.push(
      `pH reading (${readings.ph}) deviates from the central neutral demonstration band (6.8 – 8.0).`
    );
    parameterFlags.push({
      parameter: 'pH Level',
      value: `${readings.ph}`,
      status: 'Elevated',
      explanation: 'Slightly outside neutral demo band (6.8 – 8.0).',
    });
  } else {
    parameterFlags.push({
      parameter: 'pH Level',
      value: `${readings.ph}`,
      status: 'Normal',
      explanation: 'Within neutral demonstration range.',
    });
  }

  // 5. Temperature evaluation
  if (readings.temperature >= 28.5) {
    score += 8;
    reasons.push(
      `Higher water temperature (${readings.temperature}°C) slightly reduces oxygen saturation capacity.`
    );
    parameterFlags.push({
      parameter: 'Temperature',
      value: `${readings.temperature}°C`,
      status: 'Elevated',
      explanation: 'Above illustrative thermal reference (28.0°C).',
    });
  } else {
    parameterFlags.push({
      parameter: 'Temperature',
      value: `${readings.temperature}°C`,
      status: 'Normal',
      explanation: 'Normal ambient river thermal regime.',
    });
  }

  const clampedScore = Math.min(98, Math.max(8, score));
  let level: 'Low' | 'Medium' | 'High' = 'Low';
  if (clampedScore >= 65) {
    level = 'High';
  } else if (clampedScore >= 35) {
    level = 'Medium';
  }

  if (reasons.length === 0) {
    reasons.push(
      'All five simulated water-quality parameters remain within nominal upstream reference ranges.'
    );
  }

  return {
    stationId,
    level,
    score: clampedScore,
    reasons,
    parameterFlags,
  };
}

export const HEAVY_METALS_DATA: HeavyMetalInfo[] = [
  {
    symbol: 'Pb',
    name: 'Lead',
    atomicNumber: 82,
    atomicMass: '207.2 u',
    significance:
      'Persistent bioaccumulative neurotoxin that binds strongly to riverine sediments and suspended particulate matter.',
    potentialSources: [
      'Battery manufacturing & recycling effluents',
      'Aging industrial piping & solder runoff',
      'Urban road dust and pigment discharges',
    ],
    ecologicalImpact:
      'Accumulates in benthic invertebrates and fish gills; solubility increases when river pH drops toward acidic conditions (such as Station B pH 6.5).',
    labTestingMethod:
      'Inductively Coupled Plasma Mass Spectrometry (ICP-MS) or Graphite Furnace Atomic Absorption Spectroscopy (GF-AAS) after acid digestion.',
    datasetStatus: 'Awaiting labelled dataset',
    predictionStatus: 'Preliminary Indirect Indicator Only — Unvalidated',
    labConfirmationStatus: 'Required for Quantitative Verification',
    proxyCorrelationNote:
      'Basic sensors (pH, EC, Turbidity) cannot directly detect Pb²⁺ ions. However, high turbidity (35 NTU) and lower pH (6.5) at Station B are used in research literature as environmental covariates when training proxy risk screening models on paired lab datasets.',
  },
  {
    symbol: 'Hg',
    name: 'Mercury',
    atomicNumber: 80,
    atomicMass: '200.59 u',
    significance:
      'Highly toxic trace element capable of microbial methylation into methylmercury in low-oxygen benthic sediments.',
    potentialSources: [
      'Coal combustion atmospheric deposition & ash runoff',
      'Chlor-alkali & chemical processing discharges',
      'Improperly disposed electronic & medical waste',
    ],
    ecologicalImpact:
      'Biomagnifies rapidly across aquatic trophic chains. Anoxic or low-DO zones (e.g., Station B DO 4.8 mg/L) can promote sulfate-reducing bacterial methylation.',
    labTestingMethod:
      'Cold Vapor Atomic Absorption Spectroscopy (CV-AAS) or Cold Vapor Atomic Fluorescence Spectrometry (CV-AFS).',
    datasetStatus: 'Awaiting labelled dataset',
    predictionStatus: 'Preliminary Indirect Indicator Only — Unvalidated',
    labConfirmationStatus: 'Required for Quantitative Verification',
    proxyCorrelationNote:
      'Trace mercury occurs at parts-per-billion/trillion levels invisible to bulk electrical conductivity probes. Any ML screening requires paired CV-AAS laboratory truth labels.',
  },
  {
    symbol: 'As',
    name: 'Arsenic',
    atomicNumber: 33,
    atomicMass: '74.92 u',
    significance:
      'Metalloid carcinogen whose mobility in alluvial river basins is strongly governed by redox potential and pH.',
    potentialSources: [
      'Geogenic alluvial sediment leaching',
      'Agricultural agrochemical & wood-preservative runoff',
      'Industrial glass & metallurgical effluents',
    ],
    ecologicalImpact:
      'Exists primarily as arsenite As(III) under reducing conditions and arsenate As(V) in oxygenated water; toxic to phytoplankton and human water intakes.',
    labTestingMethod:
      'Hydride Generation Atomic Absorption Spectroscopy (HG-AAS) or ICP-MS.',
    datasetStatus: 'Awaiting labelled dataset',
    predictionStatus: 'Preliminary Indirect Indicator Only — Unvalidated',
    labConfirmationStatus: 'Required for Quantitative Verification',
    proxyCorrelationNote:
      'Arsenic species frequently co-migrate with iron/manganese oxides in suspended particulates and dissolved ion plumes, requiring laboratory calibration before any ML inference.',
  },
  {
    symbol: 'Cd',
    name: 'Cadmium',
    atomicNumber: 48,
    atomicMass: '112.41 u',
    significance:
      'Highly mobile toxic metal with high dissolved ionic solubility compared to other heavy metals.',
    potentialSources: [
      'Electroplating & metal surface treatment workshops',
      'Phosphate fertilizer runoff',
      'Ni-Cd battery and plastic stabilizer waste',
    ],
    ecologicalImpact:
      'Disrupts calcium metabolism in aquatic fauna and causes severe nephrotoxicity upon chronic exposure.',
    labTestingMethod:
      'ICP-Optical Emission Spectrometry (ICP-OES), ICP-MS, or Anodic Stripping Voltammetry (ASV).',
    datasetStatus: 'Awaiting labelled dataset',
    predictionStatus: 'Preliminary Indirect Indicator Only — Unvalidated',
    labConfirmationStatus: 'Required for Quantitative Verification',
    proxyCorrelationNote:
      'While elevated electrical conductivity (650 µS/cm at Station B) indicates bulk dissolved ions, distinguishing trace Cd²⁺ from benign salts (Ca²⁺, Mg²⁺, Na⁺) is impossible without ion-selective or spectroscopic lab assays.',
  },
];

export const INITIAL_GIS_HOTSPOTS: GisHotspot[] = [
  {
    id: 'HS-01',
    title: 'Hotspot Alpha — Midstream Outfall Plume',
    nearestStation: 'B',
    schematicLocation: 'Schematic Grid M-04 (120m Upstream of Station B)',
    svgX: 455,
    svgY: 215,
    severity: 'High',
    type: 'Suspected Effluent & Sediment Influx',
    description:
      'Illustrative point-source mixing zone correlating with Station B anomalies: peak turbidity (35 NTU), peak electrical conductivity (650 µS/cm), and depressed dissolved oxygen (4.8 mg/L).',
    suggestedAction:
      'Collect grab water samples for laboratory ICP-MS heavy metal assay and verify outfall source via field inspection.',
    linkedParameters: ['Turbidity: 35 NTU', 'Conductivity: 650 µS/cm', 'DO: 4.8 mg/L'],
  },
  {
    id: 'HS-02',
    title: 'Hotspot Beta — Shoreline Waste Accumulation',
    nearestStation: 'C',
    schematicLocation: 'Schematic Grid S-07 (Meander Bend Above Station C)',
    svgX: 690,
    svgY: 205,
    severity: 'Moderate',
    type: 'Riparian Solid Waste & Surface Discoloration',
    description:
      'Illustrative low-velocity river bend where floating solid debris and organic surface film accumulate before partial downstream dilution at Station C.',
    suggestedAction:
      'Cross-check with aerial drone imagery annotations and schedule shoreline solid-waste clearance.',
    linkedParameters: ['Turbidity: 15 NTU', 'Conductivity: 400 µS/cm', 'Temperature: 29°C'],
  },
];

export const INITIAL_DRONE_OBSERVATIONS: DroneObservationRecord[] = [
  {
    id: 'DRN-101',
    title: 'Midstream Outfall Plume Survey (Demo Sample 1)',
    stationId: 'B',
    timestamp: '2026-11-10 11:45',
    imageUrl: '/src/assets/images/drone_river_outfall_sample_1794342706529.jpg',
    isCustomUpload: false,
    categories: ['Possible discharge outlet', 'Unusual water discoloration'],
    detectionStatus:
      'Illustrative Visual Flag: High-contrast brown sediment plume & concrete outfall structure tagged near Station B.',
    notes:
      'Demonstration aerial frame showing visible turbidity plume entering main channel. Requires on-ground grab sampling to test chemical composition.',
    annotations: [
      {
        id: 'PIN-1',
        xPercent: 74,
        yPercent: 49,
        label: 'Concrete Discharge Pipe',
        category: 'Possible discharge outlet',
      },
      {
        id: 'PIN-2',
        xPercent: 52,
        yPercent: 60,
        label: 'Turbid Sediment Mixing Plume',
        category: 'Unusual water discoloration',
      },
    ],
    svgMapCoords: { x: 470, y: 260 },
  },
  {
    id: 'DRN-102',
    title: 'Downstream Meander Bank Debris (Demo Sample 2)',
    stationId: 'C',
    timestamp: '2026-11-10 12:10',
    imageUrl: '/src/assets/images/drone_river_waste_sample_1794342706567.jpg',
    isCustomUpload: false,
    categories: ['Solid waste', 'Waste accumulation', 'Unusual water discoloration'],
    detectionStatus:
      'Illustrative Visual Flag: Shoreline solid waste accumulation & surface algal/organic discoloration tagged.',
    notes:
      'Demonstration aerial frame illustrating riparian waste accumulation along inner meander bank.',
    annotations: [
      {
        id: 'PIN-3',
        xPercent: 44,
        yPercent: 64,
        label: 'Shoreline Solid Waste Cluster',
        category: 'Waste accumulation',
      },
      {
        id: 'PIN-4',
        xPercent: 25,
        yPercent: 48,
        label: 'Near-Bank Surface Discoloration',
        category: 'Unusual water discoloration',
      },
    ],
    svgMapCoords: { x: 735, y: 175 },
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-001',
    stationId: 'B',
    severity: 'High',
    title: 'Multi-Parameter Anomaly Detected at Station B',
    message:
      'Station B shows the highest turbidity and conductivity and the lowest dissolved oxygen among the three simulated stations. Further investigation is recommended.',
    reason:
      'Turbidity (35 NTU) is 7× upstream baseline; Electrical Conductivity (650 µS/cm) is 2.6× upstream baseline; Dissolved Oxygen (4.8 mg/L) is below 5.5 mg/L demo reference.',
    timestamp: '2026-11-10 12:30:00',
    acknowledged: false,
  },
  {
    id: 'ALT-002',
    stationId: 'C',
    severity: 'Medium',
    title: 'Downstream Residual Conductivity & Thermal Elevation',
    message:
      'Station C exhibits partial recovery from Station B but retains elevated conductivity (400 µS/cm), turbidity (15 NTU), and peak temperature (29°C).',
    reason:
      'Incomplete dilution of midstream ionic load 6.4 km downstream of Station B.',
    timestamp: '2026-11-10 12:25:00',
    acknowledged: false,
  },
  {
    id: 'ALT-003',
    stationId: 'A',
    severity: 'Low',
    title: 'Upstream Reference Calibration Nominal',
    message:
      'Station A parameters remain within baseline reference bounds (pH 7.2, DO 7.5 mg/L, Turbidity 5 NTU, EC 250 µS/cm).',
    reason: 'Routine automated baseline check in simulation mode.',
    timestamp: '2026-11-10 12:00:00',
    acknowledged: true,
  },
];
