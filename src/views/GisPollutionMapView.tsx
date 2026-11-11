import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Layers,
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
      <div className="glass-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#D97706]">
            <span>ILLUSTRATIVE GIS VISUALIZATION — NOT ACTUAL SURVEY DATA</span>
            <span aria-hidden="true" className="text-[#71869A]">·</span>
            <span className="text-[#0D9488]">SCHEMATIC RIVER CORRIDOR COORDINATES</span>
          </div>
          <h1 className="mt-1 text-xl font-extrabold text-[#263B50] sm:text-2xl">
            GIS Pollution Mapping &amp; Spatial Anomaly Visualization
          </h1>
          <p className="mt-1 text-sm text-[#52667A]">
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
            className="rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
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
            className="rounded-xl border border-[#70CFFF]/50 bg-white/85 px-3.5 py-2 text-xs font-semibold text-[#52667A] hover:text-[#263B50] cursor-pointer"
          >
            Stations Only
          </button>
        </div>
      </div>

      {/* Translucent Glass Layer Control Bar (5 Switchable Layers) */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#263B50]">
            <Layers className="h-4 w-4 text-[#0D9488]" />
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
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#20CFC6] bg-[#C9F5F5]/65 text-[#0E7490] shadow-xs'
                      : 'border-[#70CFFF]/35 bg-white/70 text-[#71869A] hover:text-[#263B50]'
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
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <div className="text-xs font-mono font-bold text-[#0D9488] mb-3">
              GIS SYMBOLOGY LEGEND &amp; DIRECT FEATURE SELECTOR
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
              <div className="glass-subcard rounded-xl p-3 space-y-2">
                <div className="font-bold text-[#263B50]">Monitoring Stations</div>
                <div className="flex flex-wrap gap-1.5">
                  {(['A', 'B', 'C'] as StationId[]).map((id) => (
                    <button
                      key={id}
                      onClick={() => handleSelectStationOnMap(id)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-xs cursor-pointer transition-colors ${
                        inspectionMode === 'station' && selectedStation === id
                          ? 'bg-[#20CFC6] text-white font-bold'
                          : 'bg-white text-[#52667A] hover:text-[#263B50] border border-[#70CFFF]/35'
                      }`}
                    >
                      Station {id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-subcard rounded-xl p-3 space-y-2">
                <div className="font-bold text-[#263B50]">Illustrative Hotspots</div>
                <div className="flex flex-wrap gap-1.5">
                  {hotspots.map((hs) => (
                    <button
                      key={hs.id}
                      onClick={() => handleSelectHotspotOnMap(hs)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-xs cursor-pointer transition-colors ${
                        inspectionMode === 'hotspot' && selectedHotspot.id === hs.id
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-white text-rose-600 hover:bg-rose-50 border border-rose-200'
                      }`}
                    >
                      {hs.id} ({hs.severity})
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-subcard rounded-xl p-3 space-y-2">
                <div className="font-bold text-[#263B50]">Drone Geo-Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {droneObservations.map((obs) => (
                    <button
                      key={obs.id}
                      onClick={() => handleSelectDroneOnMap(obs)}
                      className={`rounded-lg px-2.5 py-1 font-mono text-xs cursor-pointer transition-colors ${
                        inspectionMode === 'drone' && selectedDroneObs?.id === obs.id
                          ? 'bg-[#0284C7] text-white font-bold'
                          : 'bg-white text-[#0284C7] hover:bg-[#EDF8FF] border border-[#70CFFF]/40'
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
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          {inspectionMode === 'station' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#0D9488]">
                  STATION GEOSPATIAL INSPECTOR · {activeStation.code}
                </div>
                <h2 className="mt-1 text-lg font-bold text-[#263B50]">
                  {activeStation.name}
                </h2>
                <p className="text-xs font-mono text-[#71869A]">
                  Schematic Position: {activeStation.schematicCoords.label}
                </p>
              </div>

              <p className="text-xs text-[#52667A] leading-relaxed">
                {activeStation.zoneDescription}
              </p>

              <div className="glass-subcard rounded-xl p-4 space-y-2 text-xs">
                <div className="font-bold text-[#263B50] border-b border-[#70CFFF]/30 pb-1.5">
                  Simulated Sensor Readings at Node
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71869A]">pH:</span>
                  <span className="font-mono font-bold text-[#263B50]">
                    {activeStation.readings.ph}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71869A]">Temperature:</span>
                  <span className="font-mono font-bold text-[#263B50]">
                    {activeStation.readings.temperature}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71869A]">Turbidity:</span>
                  <span className="font-mono font-bold text-rose-600">
                    {activeStation.readings.turbidity} NTU
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71869A]">Dissolved Oxygen:</span>
                  <span className="font-mono font-bold text-[#0D9488]">
                    {activeStation.readings.dissolvedOxygen} mg/L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71869A]">Electrical Conductivity:</span>
                  <span className="font-mono font-bold text-[#0284C7]">
                    {activeStation.readings.conductivity} µS/cm
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#70CFFF]/30 pt-2">
                  <span className="text-[#71869A]">Preliminary Risk Tier:</span>
                  <span className="font-mono font-bold text-[#263B50]">
                    {activeStationRisk.level} ({activeStationRisk.score}/100)
                  </span>
                </div>
              </div>
            </div>
          )}

          {inspectionMode === 'hotspot' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-rose-600">
                  ILLUSTRATIVE HOTSPOT INSPECTOR · {selectedHotspot.id}
                </div>
                <h2 className="mt-1 text-lg font-bold text-[#263B50]">
                  {selectedHotspot.title}
                </h2>
                <p className="text-xs font-mono text-[#71869A]">
                  {selectedHotspot.schematicLocation}
                </p>
              </div>

              <div className="rounded-xl border border-rose-200 bg-rose-50/75 p-3.5 text-xs">
                <div className="font-bold text-rose-600">
                  Classification: {selectedHotspot.type} (Severity: {selectedHotspot.severity})
                </div>
                <p className="mt-1.5 text-[#52667A] leading-relaxed">
                  {selectedHotspot.description}
                </p>
              </div>

              <div className="glass-subcard rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-bold text-[#263B50]">
                  Correlated Station {selectedHotspot.nearestStation} Telemetry:
                </div>
                <div className="font-mono font-bold text-[#0284C7]">
                  {selectedHotspot.linkedParameters.join(' · ')}
                </div>
                <div className="pt-2 border-t border-[#70CFFF]/30 text-[#52667A]">
                  <span className="font-bold text-[#263B50]">Recommended Protocol: </span>
                  {selectedHotspot.suggestedAction}
                </div>
              </div>
            </div>
          )}

          {inspectionMode === 'drone' && selectedDroneObs && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono font-bold text-[#0284C7]">
                  DRONE GEO-TAGGED OBSERVATION · {selectedDroneObs.id}
                </div>
                <h2 className="mt-1 text-lg font-bold text-[#263B50]">
                  {selectedDroneObs.title}
                </h2>
                <p className="text-xs font-mono text-[#71869A]">
                  Associated with Station {selectedDroneObs.stationId} · {selectedDroneObs.timestamp}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#70CFFF]/40 bg-white">
                <img
                  src={selectedDroneObs.imageUrl}
                  alt={selectedDroneObs.title}
                  referrerPolicy="no-referrer"
                  className="h-36 w-full object-cover"
                />
              </div>

              <div className="glass-subcard rounded-xl p-3.5 text-xs space-y-1.5">
                <div className="font-bold text-[#263B50]">Tagged Categories:</div>
                <div className="text-[#0D9488] font-mono font-semibold">
                  {selectedDroneObs.categories.join(' · ')}
                </div>
                <p className="text-[#52667A] pt-1">{selectedDroneObs.detectionStatus}</p>
              </div>

              <button
                onClick={() => onNavigate('drone-intelligence')}
                className="w-full rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 cursor-pointer"
              >
                Open in Drone Analysis Module →
              </button>
            </div>
          )}

          <div className="mt-6 border-t border-[#70CFFF]/30 pt-3 text-xs text-[#71869A]">
            Click any station node (A, B, C), hotspot marker (HS-01, HS-02), or UAV tag on the map to switch inspection focus.
          </div>
        </div>
      </div>
    </div>
  );
};
