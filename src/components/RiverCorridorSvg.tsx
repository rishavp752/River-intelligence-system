import React from 'react';
import {
  StationData,
  StationId,
  GisHotspot,
  DroneObservationRecord,
} from '../types/monitoring';

interface RiverCorridorSvgProps {
  stations: Record<StationId, StationData>;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
  hotspots?: GisHotspot[];
  selectedHotspotId?: string | null;
  onSelectHotspot?: (hotspot: GisHotspot) => void;
  droneObservations?: DroneObservationRecord[];
  onSelectDroneObs?: (obs: DroneObservationRecord) => void;
  layers?: {
    riverRoute: boolean;
    stations: boolean;
    hotspots: boolean;
    heatmap: boolean;
    droneObservations: boolean;
  };
  isSimulationRunning?: boolean;
  compact?: boolean;
}

export const RiverCorridorSvg: React.FC<RiverCorridorSvgProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  hotspots = [],
  selectedHotspotId = null,
  onSelectHotspot,
  droneObservations = [],
  onSelectDroneObs,
  layers = {
    riverRoute: true,
    stations: true,
    hotspots: true,
    heatmap: true,
    droneObservations: true,
  },
  isSimulationRunning = true,
  compact = false,
}) => {
  // Curved SVG path representing the river corridor from West-Northwest (Upstream) to East (Downstream)
  const riverPath =
    'M 30 120 C 160 110, 230 195, 355 215 C 475 235, 530 250, 645 215 C 760 180, 845 145, 970 165';

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[#20D6D0]/20 bg-[#061421] bg-tech-grid select-none">
      {/* Top Overlay Telemetry HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 bg-[#0B2030]/90 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="font-mono font-semibold text-[#20D6D0]">
            SCHEMATIC HYDROLOGICAL CORRIDOR
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">
            Flow Direction: West (Upstream) → East (Downstream)
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono">
          <span>
            SIMULATED TELEMETRY: {isSimulationRunning ? 'ACTIVE STREAM' : 'STATIC SNAPSHOT'}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-[#F4B942]">
            ILLUSTRATIVE GIS VISUALIZATION — NOT ACTUAL SURVEY DATA
          </span>
        </div>
      </div>

      {/* Main Interactive SVG Stage */}
      <div className={compact ? 'aspect-[21/8] min-h-[260px] w-full' : 'aspect-[21/9] min-h-[360px] w-full'}>
        <svg
          viewBox="0 0 1000 360"
          className="h-full w-full"
          role="img"
          aria-label="Interactive River Corridor Map showing Station A, Station B, and Station C"
        >
          <defs>
            {/* River outer glow gradient */}
            <linearGradient id="riverChannelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00AFA7" stopOpacity="0.35" />
              <stop offset="48%" stopColor="#F4B942" stopOpacity="0.45" />
              <stop offset="56%" stopColor="#FF7068" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#20D6D0" stopOpacity="0.4" />
            </linearGradient>

            {/* River core gradient */}
            <linearGradient id="riverCoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#20D6D0" />
              <stop offset="48%" stopColor="#F4B942" />
              <stop offset="55%" stopColor="#FF7068" />
              <stop offset="85%" stopColor="#00AFA7" />
              <stop offset="100%" stopColor="#20D6D0" />
            </linearGradient>

            {/* Radial gradients for Illustrative Heatmap */}
            <radialGradient id="heatmapHigh" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF7068" stopOpacity="0.52" />
              <stop offset="45%" stopColor="#F4B942" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#FF7068" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="heatmapModerate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4B942" stopOpacity="0.42" />
              <stop offset="55%" stopColor="#00AFA7" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#00AFA7" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="heatmapNominal" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#20D6D0" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#20D6D0" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle Topographic Contour Lines & Sector Grid */}
          <g className="opacity-25">
            <line x1="333" y1="0" x2="333" y2="360" stroke="#1E293B" strokeDasharray="4 4" />
            <line x1="666" y1="0" x2="666" y2="360" stroke="#1E293B" strokeDasharray="4 4" />
            <text x="24" y="32" fill="#64748B" fontSize="11" fontFamily="monospace">
              SECTOR I: UPSTREAM REFERENCE REACH
            </text>
            <text x="350" y="32" fill="#94A3B8" fontSize="11" fontFamily="monospace">
              SECTOR II: MIDSTREAM INFLUX CORRIDOR
            </text>
            <text x="684" y="32" fill="#64748B" fontSize="11" fontFamily="monospace">
              SECTOR III: DOWNSTREAM RECOVERY REACH
            </text>
            <path
              d="M 10 70 Q 260 60, 480 140 T 980 95"
              fill="none"
              stroke="#1E3A5F"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
            <path
              d="M 10 265 Q 320 290, 560 310 T 980 255"
              fill="none"
              stroke="#1E3A5F"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
          </g>

          {/* Tributary / Drainage Influx Channel near Station B */}
          {layers.riverRoute && (
            <g>
              <path
                d="M 410 45 C 425 110, 440 165, 465 222"
                fill="none"
                stroke="#F4B942"
                strokeWidth="10"
                strokeOpacity="0.18"
                strokeLinecap="round"
              />
              <path
                d="M 410 45 C 425 110, 440 165, 465 222"
                fill="none"
                stroke="#FF7068"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
              <text x="355" y="65" fill="#F4B942" fontSize="10" fontFamily="monospace">
                MIDSTREAM RUNOFF / EFFLUENT INFLUX
              </text>
            </g>
          )}

          {/* Layer: Illustrative Pollution Heatmap */}
          {layers.heatmap && (
            <g className="pointer-events-none">
              <circle cx="165" cy="145" r="85" fill="url(#heatmapNominal)" />
              <ellipse cx="495" cy="232" rx="155" ry="95" fill="url(#heatmapHigh)" />
              <ellipse cx="715" cy="195" rx="120" ry="75" fill="url(#heatmapModerate)" />
              <circle cx="830" cy="170" r="85" fill="url(#heatmapModerate)" />
            </g>
          )}

          {/* Layer: River Route & Animated Flow Particles */}
          {layers.riverRoute && (
            <g>
              {/* Wide river bed */}
              <path
                d={riverPath}
                fill="none"
                stroke="#0B2030"
                strokeWidth="56"
                strokeLinecap="round"
              />
              {/* Glowing channel aura */}
              <path
                d={riverPath}
                fill="none"
                stroke="url(#riverChannelGrad)"
                strokeWidth="42"
                strokeLinecap="round"
              />
              {/* Main river water path */}
              <path
                d={riverPath}
                fill="none"
                stroke="url(#riverCoreGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Animated flowing streamlines */}
              <path
                d={riverPath}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.7"
                className={isSimulationRunning ? 'animate-river-flow' : ''}
              />
              <path
                d="M 30 132 C 160 122, 230 207, 355 227 C 475 247, 530 262, 645 227 C 760 192, 845 157, 970 177"
                fill="none"
                stroke="#20D6D0"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.55"
                className={isSimulationRunning ? 'animate-river-flow-slow' : ''}
              />

              {/* Upstream & Downstream Flow Direction Labels */}
              <g transform="translate(42, 88)">
                <rect
                  x="0"
                  y="0"
                  width="118"
                  height="22"
                  rx="4"
                  fill="#0B2030"
                  stroke="#20D6D0"
                  strokeOpacity="0.4"
                />
                <text x="10" y="15" fill="#20D6D0" fontSize="10" fontFamily="monospace">
                  UPSTREAM INFLOW →
                </text>
              </g>

              <g transform="translate(838, 118)">
                <rect
                  x="0"
                  y="0"
                  width="132"
                  height="22"
                  rx="4"
                  fill="#0B2030"
                  stroke="#00AFA7"
                  strokeOpacity="0.4"
                />
                <text x="10" y="15" fill="#20D6D0" fontSize="10" fontFamily="monospace">
                  DOWNSTREAM OUTFLOW →
                </text>
              </g>
            </g>
          )}

          {/* Layer: Illustrative Potential Pollution Hotspots */}
          {layers.hotspots &&
            hotspots.map((hs) => {
              const isSelected = selectedHotspotId === hs.id;
              const strokeColor = hs.severity === 'High' ? '#FF7068' : '#F4B942';
              return (
                <g
                  key={hs.id}
                  transform={`translate(${hs.svgX}, ${hs.svgY})`}
                  onClick={() => onSelectHotspot && onSelectHotspot(hs)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 28 : 22}
                    fill={strokeColor}
                    fillOpacity="0.18"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <polygon
                    points="0,-10 9,7 -9,7"
                    fill={strokeColor}
                    stroke="#061421"
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#061421"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    !
                  </text>
                  <g transform="translate(-58, -34)">
                    <rect
                      x="0"
                      y="0"
                      width="116"
                      height="18"
                      rx="3"
                      fill="#061421"
                      stroke={strokeColor}
                      strokeWidth="1"
                    />
                    <text
                      x="58"
                      y="12"
                      textAnchor="middle"
                      fill={strokeColor}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {hs.id}: {hs.severity.toUpperCase()} HOTSPOT
                    </text>
                  </g>
                </g>
              );
            })}

          {/* Layer: Drone Observations */}
          {layers.droneObservations &&
            droneObservations.map((obs) => (
              <g
                key={obs.id}
                transform={`translate(${obs.svgMapCoords.x}, ${obs.svgMapCoords.y})`}
                onClick={() => onSelectDroneObs && onSelectDroneObs(obs)}
                className="cursor-pointer"
              >
                <rect
                  x="-12"
                  y="-12"
                  width="24"
                  height="24"
                  rx="5"
                  fill="#0B2030"
                  stroke="#20D6D0"
                  strokeWidth="1.5"
                />
                <circle cx="0" cy="0" r="4" fill="#20D6D0" />
                <text
                  x="0"
                  y="24"
                  textAnchor="middle"
                  fill="#20D6D0"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  UAV:{obs.id}
                </text>
              </g>
            ))}

          {/* Layer: Monitoring Stations (A, B, C) */}
          {layers.stations &&
            (['A', 'B', 'C'] as StationId[]).map((id) => {
              const st = stations[id];
              const isSelected = selectedStation === id;
              const isFlagged = st.isFlagged;
              const accent = isFlagged
                ? '#FF7068'
                : id === 'C'
                ? '#F4B942'
                : '#20D6D0';

              return (
                <g
                  key={id}
                  transform={`translate(${st.schematicCoords.x}, ${st.schematicCoords.y})`}
                  onClick={() => onSelectStation(id)}
                  className="cursor-pointer"
                >
                  {/* Outer selection or flag ring */}
                  <circle
                    r={isSelected ? 30 : 24}
                    fill={accent}
                    fillOpacity={isSelected ? 0.24 : 0.12}
                    stroke={accent}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  {/* Inner station node */}
                  <circle
                    r="13"
                    fill="#0B2030"
                    stroke={accent}
                    strokeWidth="2.5"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {id}
                  </text>

                  {/* Station Telemetry Callout Plaque */}
                  <g transform={`translate(-82, ${id === 'B' ? 34 : -82})`}>
                    <rect
                      x="0"
                      y="0"
                      width="164"
                      height="48"
                      rx="6"
                      fill="#0B2030"
                      fillOpacity="0.95"
                      stroke={isSelected ? '#20D6D0' : accent}
                      strokeWidth={isSelected ? 1.8 : 1}
                    />
                    <text
                      x="10"
                      y="16"
                      fill="#FFFFFF"
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      Station {id} {isFlagged ? '▲ FLAGGED' : '● ONLINE'}
                    </text>
                    <text
                      x="10"
                      y="30"
                      fill="#94A3B8"
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      Turb: {st.readings.turbidity} NTU · DO: {st.readings.dissolvedOxygen}
                    </text>
                    <text
                      x="10"
                      y="42"
                      fill={accent}
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      EC: {st.readings.conductivity} µS/cm · pH {st.readings.ph}
                    </text>
                  </g>
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
};
