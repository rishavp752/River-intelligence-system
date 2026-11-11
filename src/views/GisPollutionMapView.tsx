import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Layers,
  MapPin,
  Navigation,
  Radio,
  ShieldAlert,
} from 'lucide-react';
import {
  StationData,
  StationId,
  GisHotspot,
  DroneObservationRecord,
  NavigationTab,
} from '../types/monitoring';
import { evaluateStationRisk } from '../data/initialData';
import { RiverCorridorSvg } from '../components/RiverCorridorSvg';

interface GisPollutionMapViewProps {
  stations: Record<StationId, StationData>;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
  hotspots: GisHotspot[];
  droneObservations: DroneObservationRecord[];
  isSimulationRunning: boolean;
  onNavigate: (tab: NavigationTab) => void;
}

export const GisPollutionMapView: React.FC<GisPollutionMapViewProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  hotspots,
  droneObservations,
  isSimulationRunning,
  onNavigate,
}) => {
  const [layers, setLayers] = useState({
    riverRoute: true,
    stations: true,
    hotspots: true,
    heatmap: true,
    droneObservations: true,
  });

  const [inspectionMode, setInspectionMode] = useState<'station' | 'hotspot' | 'drone'>('station');
  const [selectedHotspot, setSelectedHotspot] = useState<GisHotspot>(hotspots[0]);
  const [selectedDroneObs, setSelectedDroneObs] = useState<DroneObservationRecord | null>(
    droneObservations[0] || null
  );

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectStationOnMap = (id: StationId) => {
    onSelectStation(id);
    setInspectionMode('station');
  };

  const handleSelectHotspotOnMap = (hs: GisHotspot) => {
    setSelectedHotspot(hs);
    setInspectionMode('hotspot');
  };

  const handleSelectDroneOnMap = (obs: DroneObservationRecord) => {
    setSelectedDroneObs(obs);
    setInspectionMode('drone');
  };

  const activeStation = stations[selectedStation];
  const activeStationRisk = evaluateStationRisk(selectedStation, activeStation.readings);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#20D6D0]/30 bg-[#0B2030] p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F4B942]">
            <span>ILLUSTRATIVE GIS VISUALIZATION — NOT ACTUAL SURVEY DATA</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-[#20D6D0]">SCHEMATIC RIVER CORRIDOR COORDINATES</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            GIS Pollution Mapping & Spatial Anomaly Visualization
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Interactive multi-layer schematic river map showing upstream-to-downstream flow, monitoring stations, illustrative pollution hotspots, heatmap zones, and drone observations.
          </p>
        </div>

        {/* Quick Layer Presets */}
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setLayers({
                riverRoute: true,
                stations: true,
                hotspots: true,
                heatmap: true,
                droneObservations: true,
              })
            }
            className="rounded-lg border border-[#20D6D0]/40 bg-[#061421] px-3.5 py-2 text-xs font-semibold text-[#20D6D0] hover:bg-[#20D6D0]/10 cursor-pointer"
          >
            Enable All Layers
          </button>
          <button
            onClick={() =>
              setLayers({
                riverRoute: true,
                stations: true,
                hotspots: false,
                heatmap: false,
                droneObservations: false,
              })
            }
            className="rounded-lg border border-slate-700 bg-[#061421] px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
          >
            Stations Only
          </button>
        </div>
      </div>

      {/* Layer Control Bar (5 Required Switchable Layers) */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Layers className="h-4 w-4 text-[#20D6D0]" />
            <span>INTERACTIVE GIS LAYER CONTROLLER (CLICK TO TOGGLE):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'riverRoute', label: '1. River Route & Flow' },
              { key: 'stations', label: '2. Monitoring Stations (A, B, C)' },
              { key: 'hotspots', label: '3. Potential Hotspots (2)' },
              { key: 'heatmap', label: '4. Illustrative Heatmap' },
              {
                key: 'droneObservations',
                label: `5. Drone Observations (${droneObservations.length})`,
              },
            ].map((item) => {
              const active = layers[item.key as keyof typeof layers];
              return (
                <button
                  key={item.key}
                  onClick={() => toggleLayer(item.key as keyof typeof layers)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#20D6D0] bg-[#20D6D0]/15 text-[#20D6D0]'
                      : 'border-slate-800 bg-[#061421] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Interactive GIS Canvas + Detailed Inspection Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: SVG GIS Map + Map Legend */}
        <div className="lg:col-span-2 space-y-4">
          <RiverCorridorSvg
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStationOnMap}
            hotspots={hotspots}
            selectedHotspotId={inspectionMode === 'hotspot' ? selectedHotspot.id : null}
            onSelectHotspot={handleSelectHotspotOnMap}
            droneObservations={droneObservations}
            onSelectDroneObs={handleSelectDroneOnMap}
            layers={layers}
            isSimulationRunning={isSimulationRunning}
          />

          {/* Map Legend & Quick Feature Selector */}
          <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4">
            <div className="text-xs font-mono font-semibold text-slate-300 mb-3">
              GIS SYMBOLOGY LEGEND & DIRECT FEATURE SELECTOR
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div className="rounded-lg border border-slate-800 bg-[#061421] p-3 space-y-2">
                <div className="font-semibold text-white">Monitoring Stations</div>
                <div className="flex flex-wrap gap-1.5">
                  {(['A', 'B', 'C'] as StationId[]).map((id) => (
                    <button
                      key={id}
                      onClick={() => handleSelectStationOnMap(id)}
                      className={`rounded px-2.5 py-1 font-mono text-xs cursor-pointer ${
                        inspectionMode === 'station' && selectedStation === id
                          ? 'bg-[#20D6D0] text-[#061421] font-bold'
                          : 'bg-[#0B2030] text-slate-300 hover:text-white'
                      }`}
                    >
                      Station {id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#061421] p-3 space-y-2">
                <div className="font-semibold text-white">Illustrative Hotspots</div>
                <div className="flex flex-wrap gap-1.5">
                  {hotspots.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => handleSelectHotspotOnMap(hs)}
                      className={`rounded px-2.5 py-1 font-mono text-xs cursor-pointer ${
                        inspectionMode === 'hotspot' && selectedHotspot.id === hs.id
                          ? 'bg-[#FF7068] text-[#061421] font-bold'
                          : 'bg-[#0B2030] text-[#F4B942] hover:text-white'
                      }`}
                    >
                      {hs.id} ({hs.severity})
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#061421] p-3 space-y-2">
                <div className="font-semibold text-white">Drone Geo-Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {droneObservations.map((obs) => (
                    <button
                      key={obs.id}
                      onClick={() => handleSelectDroneOnMap(obs)}
                      className={`rounded px-2.5 py-1 font-mono text-xs cursor-pointer ${
                        inspectionMode === 'drone' && selectedDroneObs?.id === obs.id
                          ? 'bg-[#20D6D0] text-[#061421] font-bold'
                          : 'bg-[#0B2030] text-[#20D6D0] hover:text-white'
                      }`}
                    >
                      {obs.id} (Stn {obs.stationId})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contextual Feature Information Panel */}
        <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-5 flex flex-col justify-between">
          {inspectionMode === 'station' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-[#20D6D0]">
                  STATION GEOSPATIAL INSPECTOR · {activeStation.code}
                </div>
                <h2 className="mt-1 text-lg font-bold text-white">
                  {activeStation.name}
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Schematic Position: {activeStation.schematicCoords.label}
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activeStation.zoneDescription}
              </p>

              <div className="rounded-lg border border-slate-800 bg-[#061421] p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-white border-b border-slate-800 pb-1.5">
                  Simulated Sensor Readings at Node
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">pH:</span>
                  <span className="font-mono font-bold text-white">
                    {activeStation.readings.ph}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Temperature:</span>
                  <span className="font-mono font-bold text-white">
                    {activeStation.readings.temperature}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Turbidity:</span>
                  <span className="font-mono font-bold text-[#FF7068]">
                    {activeStation.readings.turbidity} NTU
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dissolved Oxygen:</span>
                  <span className="font-mono font-bold text-[#20D6D0]">
                    {activeStation.readings.dissolvedOxygen} mg/L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Electrical Conductivity:</span>
                  <span className="font-mono font-bold text-[#F4B942]">
                    {activeStation.readings.conductivity} µS/cm
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-400">Preliminary Risk Tier:</span>
                  <span className="font-mono font-bold text-white">
                    {activeStationRisk.level} ({activeStationRisk.score}/100)
                  </span>
                </div>
              </div>
            </div>
          )}

          {inspectionMode === 'hotspot' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-[#FF7068]">
                  ILLUSTRATIVE HOTSPOT INSPECTOR · {selectedHotspot.id}
                </div>
                <h2 className="mt-1 text-lg font-bold text-white">
                  {selectedHotspot.title}
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  {selectedHotspot.schematicLocation}
                </p>
              </div>

              <div className="rounded-lg border border-[#FF7068]/30 bg-[#061421] p-3 text-xs">
                <div className="font-semibold text-[#FF7068]">
                  Classification: {selectedHotspot.type} (Severity: {selectedHotspot.severity})
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed">
                  {selectedHotspot.description}
                </p>
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#061421] p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-white">
                  Correlated Station {selectedHotspot.nearestStation} Telemetry:
                </div>
                <div className="font-mono text-[#F4B942]">
                  {selectedHotspot.linkedParameters.join(' · ')}
                </div>
                <div className="pt-2 border-t border-slate-800 text-slate-300">
                  <span className="font-semibold text-white">Recommended Protocol: </span>
                  {selectedHotspot.suggestedAction}
                </div>
              </div>
            </div>
          )}

          {inspectionMode === 'drone' && selectedDroneObs && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-[#20D6D0]">
                  DRONE GEO-TAGGED OBSERVATION · {selectedDroneObs.id}
                </div>
                <h2 className="mt-1 text-lg font-bold text-white">
                  {selectedDroneObs.title}
                </h2>
                <p className="text-xs font-mono text-slate-400">
                  Associated with Station {selectedDroneObs.stationId} · {selectedDroneObs.timestamp}
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-800 bg-[#061421]">
                <img
                  src={selectedDroneObs.imageUrl}
                  alt={selectedDroneObs.title}
                  referrerPolicy="no-referrer"
                  className="h-36 w-full object-cover"
                />
              </div>

              <div className="rounded-lg border border-slate-800 bg-[#061421] p-3 text-xs space-y-1.5">
                <div className="font-semibold text-white">Tagged Categories:</div>
                <div className="text-[#20D6D0] font-mono">
                  {selectedDroneObs.categories.join(' · ')}
                </div>
                <p className="text-slate-300 pt-1">{selectedDroneObs.detectionStatus}</p>
              </div>

              <button
                onClick={() => onNavigate('drone-intelligence')}
                className="w-full rounded-lg bg-[#20D6D0] py-2 text-xs font-semibold text-[#061421] hover:bg-[#00AFA7] hover:text-white cursor-pointer"
              >
                Open in Drone Intelligence Module →
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-slate-800 pt-3 text-xs text-slate-400">
            Click any station node (A, B, C), hotspot marker (HS-01, HS-02), or UAV tag on the map to switch inspection focus.
          </div>
        </div>
      </div>
    </div>
  );
};
