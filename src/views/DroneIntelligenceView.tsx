import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Scan,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  StationId,
  ObservationCategory,
  DroneAnnotationPin,
  DroneObservationRecord,
} from '../types/monitoring';

interface DroneIntelligenceViewProps {
  droneObservations: DroneObservationRecord[];
  onAddDroneObservation: (obs: DroneObservationRecord) => void;
  selectedStation: StationId;
  onSelectStation: (id: StationId) => void;
}

const ALL_CATEGORIES: ObservationCategory[] = [
  'Solid waste',
  'Waste accumulation',
  'Possible discharge outlet',
  'Unusual water discoloration',
];

const SAMPLE_FRAMES = [
  {
    id: 'sample-1',
    label: 'Demo Aerial Frame 1: Midstream Outfall Plume',
    url: '/src/assets/images/drone_river_outfall_sample_1794342706529.jpg',
    defaultStation: 'B' as StationId,
    defaultCategories: [
      'Possible discharge outlet',
      'Unusual water discoloration',
    ] as ObservationCategory[],
    defaultPins: [
      {
        id: 'pin-init-1',
        xPercent: 74,
        yPercent: 49,
        label: 'Concrete Discharge Outlet',
        category: 'Possible discharge outlet' as ObservationCategory,
      },
      {
        id: 'pin-init-2',
        xPercent: 52,
        yPercent: 60,
        label: 'Brown Turbid Plume Boundary',
        category: 'Unusual water discoloration' as ObservationCategory,
      },
    ],
  },
  {
    id: 'sample-2',
    label: 'Demo Aerial Frame 2: Shoreline Waste Accumulation',
    url: '/src/assets/images/drone_river_waste_sample_1794342706567.jpg',
    defaultStation: 'C' as StationId,
    defaultCategories: [
      'Solid waste',
      'Waste accumulation',
      'Unusual water discoloration',
    ] as ObservationCategory[],
    defaultPins: [
      {
        id: 'pin-init-3',
        xPercent: 44,
        yPercent: 64,
        label: 'Riparian Solid Debris Cluster',
        category: 'Waste accumulation' as ObservationCategory,
      },
    ],
  },
];

export const DroneIntelligenceView: React.FC<DroneIntelligenceViewProps> = ({
  droneObservations,
  onAddDroneObservation,
  onSelectStation,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_FRAMES[0].url);
  const [imageTitle, setImageTitle] = useState<string>(SAMPLE_FRAMES[0].label);
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(false);
  const [associatedStation, setAssociatedStation] = useState<StationId>('B');
  const [selectedCategories, setSelectedCategories] = useState<ObservationCategory[]>(
    SAMPLE_FRAMES[0].defaultCategories
  );
  const [pins, setPins] = useState<DroneAnnotationPin[]>(SAMPLE_FRAMES[0].defaultPins);
  const [activePinCategory, setActivePinCategory] = useState<ObservationCategory>(
    'Possible discharge outlet'
  );
  const [newPinLabel, setNewPinLabel] = useState<string>('Manual Surface Anomaly Tag');
  const [demoExecuted, setDemoExecuted] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [observationNotes, setObservationNotes] = useState<string>(
    'Manual & simulated aerial visual inspection completed. Visible surface anomaly requires on-ground field verification and laboratory water sampling.'
  );
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setImageTitle(`Uploaded Local Frame: ${file.name}`);
        setIsCustomUpload(true);
        setPins([]);
        setDemoExecuted(false);
        setSavedBanner(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetImage = () => {
    setImageUrl(SAMPLE_FRAMES[0].url);
    setImageTitle(SAMPLE_FRAMES[0].label);
    setIsCustomUpload(false);
    setAssociatedStation('B');
    setSelectedCategories(SAMPLE_FRAMES[0].defaultCategories);
    setPins(SAMPLE_FRAMES[0].defaultPins);
    setDemoExecuted(true);
    setSavedBanner(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectSampleFrame = (index: number) => {
    const sample = SAMPLE_FRAMES[index];
    setImageUrl(sample.url);
    setImageTitle(sample.label);
    setIsCustomUpload(false);
    setAssociatedStation(sample.defaultStation);
    setSelectedCategories(sample.defaultCategories);
    setPins(sample.defaultPins);
    setDemoExecuted(true);
    setSavedBanner(null);
  };

  const toggleCategory = (cat: ObservationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleImageCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPercent = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPercent = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newPin: DroneAnnotationPin = {
      id: `PIN-${Date.now()}`,
      xPercent,
      yPercent,
      label: newPinLabel.trim() || activePinCategory,
      category: activePinCategory,
    };

    setPins((prev) => [...prev, newPin]);
    if (!selectedCategories.includes(activePinCategory)) {
      setSelectedCategories((prev) => [...prev, activePinCategory]);
    }
  };

  const handleRunAnalysisDemo = () => {
    setIsScanning(true);
    setDemoExecuted(true);
    window.setTimeout(() => {
      setIsScanning(false);
    }, 1800);
    if (pins.length === 0) {
      setPins([
        {
          id: `PIN-${Date.now()}`,
          xPercent: 54,
          yPercent: 55,
          label: 'Simulated Surface Anomaly Region',
          category: selectedCategories[0] || 'Unusual water discoloration',
        },
      ]);
    }
  };

  const handleSaveObservationToGis = () => {
    const stationCoordMap: Record<StationId, { x: number; y: number }> = {
      A: { x: 195, y: 120 },
      B: { x: 515, y: 265 },
      C: { x: 805, y: 145 },
    };

    const newRecord: DroneObservationRecord = {
      id: `DRN-${100 + droneObservations.length + 1}`,
      title: imageTitle,
      stationId: associatedStation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl,
      isCustomUpload,
      categories:
        selectedCategories.length > 0
          ? selectedCategories
          : ['Unusual water discoloration'],
      detectionStatus: `Illustrative Visual Assessment: ${
        selectedCategories.length
      } surface category tag(s) & ${pins.length} hotspot annotation(s) recorded near Station ${associatedStation}. Requires field verification.`,
      notes: observationNotes,
      annotations: pins,
      svgMapCoords: stationCoordMap[associatedStation],
    };

    onAddDroneObservation(newRecord);
    onSelectStation(associatedStation);
    setSavedBanner(
      `Observation ${newRecord.id} linked to Station ${associatedStation} and added to the GIS Pollution Map.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Scientific Honesty & Prototype Scope Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="text-amber-700 font-bold">
            PROTOTYPE DISCLOSURE — NO ACTUAL DRONE SURVEY CONDUCTED
          </span>
          <span className="text-[#0D9488] font-bold">
            LOCAL VISUAL-ANALYSIS SIMULATION &amp; MANUAL ANNOTATION WORKFLOW
          </span>
        </div>
        <h1 className="mt-1 text-xl font-extrabold text-[#263B50] sm:text-2xl">
          Drone-Assisted Visible Pollution Analysis &amp; Geo-Tagging
        </h1>
        <p className="mt-1 text-sm text-[#52667A] leading-relaxed">
          Upload a local aerial image or inspect the demonstration river frames, select visible surface pollution categories, click on the image to place manual hotspot annotations, and associate observations with Station A, B, or C.
        </p>
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/75 px-4 py-2.5 text-xs text-[#263B50]">
          <strong className="text-rose-600">Scientific Limitation:</strong> Aerial imagery can only identify visible surface features (solid waste, surface plumes, outfall pipes, water discoloration) and <strong>cannot independently identify dissolved heavy metals</strong>. All aerial observations require on-ground field verification.
        </div>
      </div>

      {/* Upload & Sample Selection Toolbar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="drone-image-upload"
            />
            <label
              htmlFor="drone-image-upload"
              className="min-h-[40px] inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Local Drone Image</span>
            </label>

            <button
              onClick={() => handleSelectSampleFrame(0)}
              className="min-h-[40px] rounded-xl border border-[#70CFFF]/50 bg-white/85 px-3.5 py-2 text-xs font-semibold text-[#263B50] hover:border-[#20CFC6] cursor-pointer whitespace-nowrap shrink-0"
            >
              Load Sample 1 (Midstream Outfall)
            </button>

            <button
              onClick={() => handleSelectSampleFrame(1)}
              className="min-h-[40px] rounded-xl border border-[#70CFFF]/50 bg-white/85 px-3.5 py-2 text-xs font-semibold text-[#263B50] hover:border-[#20CFC6] cursor-pointer whitespace-nowrap shrink-0"
            >
              Load Sample 2 (Shoreline Waste)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAnalysisDemo}
              className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-[#20CFC6] bg-[#C9F5F5]/65 px-3.5 py-2 text-xs font-bold text-[#0E7490] hover:bg-[#C9F5F5] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Scan className="h-3.5 w-3.5" />
              <span>{isScanning ? 'Scanning Frame...' : 'Analysis Demonstration'}</span>
            </button>

            <button
              onClick={handleResetImage}
              className="min-h-[40px] inline-flex items-center gap-1.5 rounded-xl border border-[#70CFFF]/50 bg-white/85 px-3.5 py-2 text-xs font-semibold text-[#52667A] hover:text-[#263B50] cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace: Annotated Image Canvas + Observation Controls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Interactive Image Preview & Click-to-Annotate Stage */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="font-bold text-[#263B50]">{imageTitle}</div>
              <div className="font-mono font-bold text-[#0D9488]">
                CLICK ANYWHERE ON IMAGE TO PLACE MANUAL HOTSPOT PIN ({pins.length} PINS)
              </div>
            </div>

            {/* Interactive Image Container */}
            <div
              onClick={handleImageCanvasClick}
              className="relative overflow-hidden rounded-2xl border-2 border-[#20CFC6]/45 bg-[#EDF8FF] cursor-crosshair select-none aspect-video shadow-inner"
            >
              <img
                src={imageUrl}
                alt={imageTitle}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />

              {/* Animated Optical Scanning Line Overlay */}
              {isScanning && (
                <div
                  className="pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#20CFC6] to-transparent shadow-[0_0_20px_4px_rgba(32,207,198,0.85)] animate-drone-scan"
                />
              )}

              {/* Frosted Glass HUD Badges */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-3 left-3 rounded-lg border border-white/80 bg-white/85 backdrop-blur-md px-3 py-1 font-mono text-[11px] font-bold text-[#0D9488] shadow-xs">
                  STATION LINK: STN-{associatedStation} · MODE: LOCAL VISUAL DEMO
                </div>
                <div className="absolute bottom-3 right-3 rounded-lg border border-amber-300 bg-white/90 backdrop-blur-md px-3 py-1 font-mono text-[11px] font-bold text-amber-700 shadow-xs">
                  FIELD VERIFICATION REQUIRED
                </div>
              </div>

              {/* Manual & Demo Hotspot Annotation Pins */}
              {pins.map((pin, idx) => (
                <div
                  key={pin.id}
                  style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-rose-600 bg-white/95 font-mono text-xs font-extrabold text-rose-600 shadow-md">
                    {idx + 1}
                  </div>
                  <div className="mt-1 whitespace-nowrap rounded-lg border border-rose-300 bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#263B50] shadow-sm">
                    {pin.label} ({pin.category})
                  </div>
                </div>
              ))}
            </div>

            {/* Pin Placement Configuration Bar */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#52667A] mb-1">
                  New Pin Category (When Clicking Image):
                </label>
                <select
                  value={activePinCategory}
                  onChange={(e) => setActivePinCategory(e.target.value as ObservationCategory)}
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-xs font-medium text-[#263B50]"
                >
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#52667A] mb-1">
                  New Pin Custom Label:
                </label>
                <input
                  type="text"
                  value={newPinLabel}
                  onChange={(e) => setNewPinLabel(e.target.value)}
                  className="w-full rounded-xl border border-[#70CFFF]/50 bg-white px-3 py-2 text-xs text-[#263B50]"
                  placeholder="Enter hotspot label..."
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setPins([])}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All Pins ({pins.length})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Observation Category Selector, Station Association & Demonstration Output */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#0D9488]">
                OBSERVATION TAGGING &amp; STATION LINK
              </div>
              <h2 className="mt-1 text-lg font-bold text-[#263B50]">
                Visible Pollution Classification
              </h2>
            </div>

            {/* 1. Associate with Station A, B, or C */}
            <div>
              <label className="block text-xs font-bold text-[#263B50] mb-2">
                Associate Observation with Monitoring Station:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['A', 'B', 'C'] as StationId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => setAssociatedStation(id)}
                    className={`rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer ${
                      associatedStation === id
                        ? 'border-[#20CFC6] bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] text-white shadow-xs'
                        : 'border-[#70CFFF]/40 bg-white/80 text-[#52667A] hover:text-[#263B50]'
                    }`}
                  >
                    Station {id}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Visible Pollution Category Selection */}
            <div>
              <label className="block text-xs font-bold text-[#263B50] mb-2">
                Select Visible Pollution Categories:
              </label>
              <div className="space-y-2">
                {ALL_CATEGORIES.map((cat) => {
                  const checked = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                        checked
                          ? 'border-[#20CFC6] bg-[#C9F5F5]/65 text-[#263B50]'
                          : 'border-[#70CFFF]/35 bg-white/75 text-[#71869A] hover:text-[#263B50]'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="font-mono text-[11px] font-bold text-[#0D9488]">
                        {checked ? '[SELECTED]' : '[CLICK TO TAG]'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Field Verification Notes */}
            <div>
              <label className="block text-xs font-bold text-[#263B50] mb-1">
                Observation &amp; Field Verification Notes:
              </label>
              <textarea
                rows={2}
                value={observationNotes}
                onChange={(e) => setObservationNotes(e.target.value)}
                className="w-full rounded-xl border border-[#70CFFF]/50 bg-white p-2.5 text-xs text-[#263B50]"
              />
            </div>

            {/* 4. Demonstration Output Summary */}
            {demoExecuted && (
              <div className="glass-subcard rounded-xl p-3.5 space-y-2 text-xs">
                <div className="font-mono font-bold text-[#0D9488]">
                  DEMONSTRATION ASSESSMENT SUMMARY
                </div>
                <div>
                  <span className="text-[#71869A]">Linked Station: </span>
                  <span className="font-bold text-[#263B50]">Station {associatedStation}</span>
                </div>
                <div>
                  <span className="text-[#71869A]">Tagged Categories: </span>
                  <span className="font-mono font-bold text-[#0284C7]">
                    {selectedCategories.length > 0
                      ? selectedCategories.join(' · ')
                      : 'None selected'}
                  </span>
                </div>
                <div>
                  <span className="text-[#71869A]">Illustrative Detection Status: </span>
                  <span className="text-[#263B50]">
                    Local visual inspection complete ({pins.length} annotated region(s)).
                  </span>
                </div>
                <div className="pt-1 text-rose-600 font-semibold">
                  Mandatory Verification Notice: Visual observation requires on-site field verification and cannot detect dissolved heavy metals.
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={handleSaveObservationToGis}
              className="w-full rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] py-2.5 text-xs font-bold text-white shadow-[0_8px_20px_-6px_rgba(32,207,198,0.5)] hover:opacity-95 transition-all cursor-pointer"
            >
              Save &amp; Link Observation to Station {associatedStation} GIS Map
            </button>
            {savedBanner && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
                {savedBanner}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
