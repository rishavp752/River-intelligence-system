import React from 'react';
import {
  StationData,
  StationId,
  GisHotspot,
  DroneObservationRecord,
} from '../types/monitoring';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
  const isNight = theme === 'night';

  const riverPath =
    'M 30 120 C 160 110, 230 195, 355 215 C 475 235, 530 250, 645 215 C 760 180, 845 145, 970 165';

  const plaqueBg = isNight ? '#08182E' : '#FFFFFF';
  const plaqueTextPrimary = isNight ? '#ECF6FF' : '#263B50';
  const plaqueTextSecondary = isNight ? '#9CC0E0' : '#52667A';
  const sectorLabelColor = isNight ? '#9CC0E0' : '#52667A';
  const sectorMidLabelColor = isNight ? '#ECF6FF' : '#263B50';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border bg-tech-grid select-none transition-colors duration-500 ${
        isNight
          ? 'border-[#00F2FE]/30 bg-gradient-to-br from-[#040E1D] via-[#07182E] to-[#0A2240] shadow-[0_18px_44px_-12px_rgba(0,242,254,0.16)]'
          : 'border-[#20CFC6]/35 bg-gradient-to-br from-[#F7FCFF] via-[#EDF8FF] to-[#E2F4FF] shadow-[0_14px_38px_-12px_rgba(32,207,198,0.16)]'
      }`}
    >
      {/* Top Translucent Glass Telemetry Ribbon */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b backdrop-blur-md px-4 py-2.5 text-xs transition-colors duration-500 ${
          isNight
            ? 'border-[#00F2FE]/20 bg-[#07162C]/80'
            : 'border-[#20CFC6]/20 bg-white/75'
        }`}
      >
        <div className="flex items-center gap-3 text-[#263B50]">
          <span className="font-mono font-bold text-[#0D9488]">
            HYDROLOGICAL CORRIDOR SCHEMATIC
          </span>
          <span aria-hidden="true" className="text-[#71869A]">·</span>
          <span className="text-[#71869A] font-medium">
            Flow Direction: West (Upstream) → East (Downstream)
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[#263B50]">
            TELEMETRY: {isSimulationRunning ? 'ACTIVE STREAM' : 'STATIC SNAPSHOT'}
          </span>
          <span aria-hidden="true" className="text-[#71869A]">·</span>
          <span className="text-[#D97706] font-semibold">
            ILLUSTRATIVE GIS VISUALIZATION — NOT ACTUAL SURVEY DATA
          </span>
        </div>
      </div>

      {/* Main Interactive SVG Stage */}
      <div
        className={
          compact
            ? 'aspect-[21/8] min-h-[260px] w-full'
            : 'aspect-[21/9] min-h-[360px] w-full'
        }
      >
        <svg
          viewBox="0 0 1000 360"
          className="h-full w-full"
          role="img"
          aria-label="Interactive River Corridor Map showing Station A, Station B, and Station C"
        >
          <defs>
            {/* Luminous River Outer Channel */}
            <linearGradient id="riverChannelGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isNight ? '#00F2FE' : '#70CFFF'} stopOpacity={isNight ? '0.28' : '0.38'} />
              <stop offset="45%" stopColor="#20CFC6" stopOpacity={isNight ? '0.35' : '0.45'} />
              <stop offset="56%" stopColor="#F59E0B" stopOpacity={isNight ? '0.32' : '0.35'} />
              <stop offset="100%" stopColor="#20CFC6" stopOpacity={isNight ? '0.34' : '0.42'} />
            </linearGradient>

            {/* River Core Flow Gradient */}
            <linearGradient id="riverCoreGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isNight ? '#00F2FE' : '#0EA5E9'} />
              <stop offset="46%" stopColor="#20CFC6" />
              <stop offset="55%" stopColor="#F43F5E" />
              <stop offset="82%" stopColor={isNight ? '#20E3B2' : '#0D9488'} />
              <stop offset="100%" stopColor={isNight ? '#00F2FE' : '#20CFC6'} />
            </linearGradient>

            {/* Radial Gradients for Illustrative Heatmap */}
            <radialGradient id="heatmapHighLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity={isNight ? '0.42' : '0.36'} />
              <stop offset="48%" stopColor="#F59E0B" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="heatmapModerateLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={isNight ? '0.35' : '0.30'} />
              <stop offset="55%" stopColor="#20CFC6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#20CFC6" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="heatmapNominalLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#20CFC6" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#70CFFF" stopOpacity="0" />
            </radialGradient>

            <filter id="cardDropShadow" x="-15%" y="-15%" width="130%" height="140%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation="6"
                floodColor={isNight ? '#000000' : '#263B50'}
                floodOpacity={isNight ? '0.45' : '0.12'}
              />
            </filter>
          </defs>

          {/* Subtle Topographic Contours & Hydrological Reach Dividers */}
          <g>
            <line
              x1="333"
              y1="0"
              x2="333"
              y2="360"
              stroke={isNight ? '#38BDF8' : '#70CFFF'}
              strokeOpacity={isNight ? '0.28' : '0.45'}
              strokeDasharray="5 5"
            />
            <line
              x1="666"
              y1="0"
              x2="666"
              y2="360"
              stroke={isNight ? '#38BDF8' : '#70CFFF'}
              strokeOpacity={isNight ? '0.28' : '0.45'}
              strokeDasharray="5 5"
            />
            <text
              x="24"
              y="30"
              fill={sectorLabelColor}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              SECTOR I: UPSTREAM REFERENCE REACH
            </text>
            <text
              x="350"
              y="30"
              fill={sectorMidLabelColor}
              fontSize="11"
              fontWeight="700"
              fontFamily="monospace"
            >
              SECTOR II: MIDSTREAM INFLUX CORRIDOR
            </text>
            <text
              x="684"
              y="30"
              fill={sectorLabelColor}
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              SECTOR III: DOWNSTREAM RECOVERY REACH
            </text>
            <path
              d="M 10 72 Q 260 60, 480 140 T 980 95"
              fill="none"
              stroke={isNight ? '#38BDF8' : '#70CFFF'}
              strokeOpacity={isNight ? '0.25' : '0.45'}
              strokeWidth="1.2"
              strokeDasharray="6 6"
            />
            <path
              d="M 10 268 Q 320 292, 560 310 T 980 255"
              fill="none"
              stroke="#20CFC6"
              strokeOpacity={isNight ? '0.28' : '0.45'}
              strokeWidth="1.2"
              strokeDasharray="6 6"
            />
          </g>

          {/* Tributary / Midstream Drainage Channel near Station B */}
          {layers.riverRoute && (
            <g>
              <path
                d="M 410 45 C 425 110, 440 165, 465 222"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="14"
                strokeOpacity="0.22"
                strokeLinecap="round"
              />
              <path
                d="M 410 45 C 425 110, 440 165, 465 222"
                fill="none"
                stroke="#FB7185"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
              <text
                x="348"
                y="62"
                fill={isNight ? '#FBBF24' : '#B45309'}
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
              >
                MIDSTREAM RUNOFF / EFFLUENT INFLUX
              </text>
            </g>
          )}

          {/* Layer: Illustrative Pollution Heatmap */}
          {layers.heatmap && (
            <g className="pointer-events-none">
              <circle cx="165" cy="145" r="88" fill="url(#heatmapNominalLight)" />
              <ellipse cx="495" cy="232" rx="160" ry="96" fill="url(#heatmapHighLight)" />
              <ellipse cx="715" cy="195" rx="122" ry="76" fill="url(#heatmapModerateLight)" />
              <circle cx="830" cy="170" r="88" fill="url(#heatmapModerateLight)" />
            </g>
          )}

          {/* Layer: River Route & Animated Water Flow Particles */}
          {layers.riverRoute && (
            <g>
              {/* Soft outer bank */}
              <path
                d={riverPath}
                fill="none"
                stroke={isNight ? '#0C2D4E' : '#C9F5F5'}
                strokeWidth="62"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Aquatic channel aura */}
              <path
                d={riverPath}
                fill="none"
                stroke="url(#riverChannelGradLight)"
                strokeWidth="44"
                strokeLinecap="round"
              />
              {/* Main river water path */}
              <path
                d={riverPath}
                fill="none"
                stroke="url(#riverCoreGradLight)"
                strokeWidth="9"
                strokeLinecap="round"
                opacity="0.92"
              />
              {/* Animated white & cyan flowing water particles */}
              <path
                d={riverPath}
                fill="none"
                stroke={isNight ? '#E0F7FF' : '#FFFFFF'}
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.95"
                className={isSimulationRunning ? 'animate-river-flow' : ''}
              />
              <path
                d="M 30 132 C 160 122, 230 207, 355 227 C 475 247, 530 262, 645 227 C 760 192, 845 157, 970 177"
                fill="none"
                stroke={isNight ? '#00F2FE' : '#0D9488'}
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.7"
                className={isSimulationRunning ? 'animate-river-flow-slow' : ''}
              />

              {/* Upstream & Downstream Flow Direction Plaques */}
              <g transform="translate(38, 84)" filter="url(#cardDropShadow)">
                <rect
                  x="0"
                  y="0"
                  width="124"
                  height="24"
                  rx="6"
                  fill={plaqueBg}
                  fillOpacity="0.92"
                  stroke="#20CFC6"
                  strokeWidth="1.2"
                />
                <text
                  x="10"
                  y="15.5"
                  fill={isNight ? '#20E3B2' : '#0D9488'}
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  UPSTREAM INFLOW →
                </text>
              </g>

              <g transform="translate(830, 114)" filter="url(#cardDropShadow)">
                <rect
                  x="0"
                  y="0"
                  width="138"
                  height="24"
                  rx="6"
                  fill={plaqueBg}
                  fillOpacity="0.92"
                  stroke="#20CFC6"
                  strokeWidth="1.2"
                />
                <text
                  x="10"
                  y="15.5"
                  fill={isNight ? '#20E3B2' : '#0D9488'}
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="monospace"
                >
                  DOWNSTREAM OUTFLOW →
                </text>
              </g>
            </g>
          )}

          {/* Layer: Illustrative Potential Pollution Hotspots */}
          {layers.hotspots &&
            hotspots.map((hs) => {
              const isSelected = selectedHotspotId === hs.id;
              const strokeColor = hs.severity === 'High' ? '#FB7185' : '#F59E0B';
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
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                  />
                  <polygon
                    points="0,-11 10,8 -10,8"
                    fill={strokeColor}
                    stroke={plaqueBg}
                    strokeWidth="1.8"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    !
                  </text>
                  <g transform="translate(-62, -36)" filter="url(#cardDropShadow)">
                    <rect
                      x="0"
                      y="0"
                      width="124"
                      height="20"
                      rx="5"
                      fill={plaqueBg}
                      fillOpacity="0.95"
                      stroke={strokeColor}
                      strokeWidth="1.2"
                    />
                    <text
                      x="62"
                      y="13.5"
                      textAnchor="middle"
                      fill={strokeColor}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight="700"
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
                filter="url(#cardDropShadow)"
              >
                <rect
                  x="-13"
                  y="-13"
                  width="26"
                  height="26"
                  rx="7"
                  fill={plaqueBg}
                  stroke="#38BDF8"
                  strokeWidth="2"
                />
                <circle cx="0" cy="0" r="4.5" fill="#20CFC6" />
                <text
                  x="0"
                  y="26"
                  textAnchor="middle"
                  fill={isNight ? '#38BDF8' : '#0369A1'}
                  fontSize="9.5"
                  fontWeight="700"
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
                ? '#FB7185'
                : id === 'C'
                ? '#F59E0B'
                : isNight
                ? '#20E3B2'
                : '#0D9488';

              return (
                <g
                  key={id}
                  transform={`translate(${st.schematicCoords.x}, ${st.schematicCoords.y})`}
                  onClick={() => onSelectStation(id)}
                  className="cursor-pointer"
                >
                  {/* Outer selection or flag ring */}
                  <circle
                    r={isSelected ? 31 : 24}
                    fill={accent}
                    fillOpacity={isSelected ? 0.24 : 0.14}
                    stroke={accent}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  {/* Inner station node */}
                  <circle
                    r="14"
                    fill={plaqueBg}
                    stroke={accent}
                    strokeWidth="3"
                  />
                  <text
                    x="0"
                    y="4.5"
                    textAnchor="middle"
                    fill={plaqueTextPrimary}
                    fontSize="12.5"
                    fontWeight="800"
                    fontFamily="monospace"
                  >
                    {id}
                  </text>

                  {/* Frosted Glass Station Telemetry Callout Plaque */}
                  <g
                    transform={`translate(-86, ${id === 'B' ? 35 : -86})`}
                    filter="url(#cardDropShadow)"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="172"
                      height="50"
                      rx="8"
                      fill={plaqueBg}
                      fillOpacity="0.94"
                      stroke={isSelected ? '#20CFC6' : accent}
                      strokeWidth={isSelected ? 2 : 1.2}
                    />
                    <text
                      x="10"
                      y="17"
                      fill={plaqueTextPrimary}
                      fontSize="10.5"
                      fontWeight="700"
                    >
                      Station {id} {isFlagged ? '▲ FLAGGED' : '● ONLINE'}
                    </text>
                    <text
                      x="10"
                      y="31"
                      fill={plaqueTextSecondary}
                      fontSize="9.5"
                      fontFamily="monospace"
                    >
                      Turb: {st.readings.turbidity} NTU · DO: {st.readings.dissolvedOxygen}
                    </text>
                    <text
                      x="10"
                      y="43"
                      fill={accent}
                      fontSize="9.5"
                      fontWeight="700"
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
