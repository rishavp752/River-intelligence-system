import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Printer,
} from 'lucide-react';
import {
  StationData,
  StationId,
  AlertItem,
} from '../types/monitoring';
import { evaluateStationRisk } from '../data/initialData';

interface AlertsReportsViewProps {
  stations: Record<StationId, StationData>;
  alerts: AlertItem[];
  onToggleAcknowledgeAlert: (alertId: string) => void;
}

const FIVE_TEAM_MEMBERS_SUMMARY =
  '139 - Rijoy Biswas | 140 - Rishabh Kumar Shaw | 141 - Rishan Nandi | 142 - Rishav Kumar Pandey | 144 - Ritik Kumar Ram';

export const AlertsReportsView: React.FC<AlertsReportsViewProps> = ({
  stations,
  alerts,
  onToggleAcknowledgeAlert,
}) => {
  const [stationFilter, setStationFilter] = useState<'ALL' | StationId>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'High' | 'Medium' | 'Low'>('ALL');

  const filteredAlerts = alerts.filter((item) => {
    const matchSt = stationFilter === 'ALL' || item.stationId === stationFilter;
    const matchSev = severityFilter === 'ALL' || item.severity === severityFilter;
    return matchSt && matchSev;
  });

  const handleDownloadCsv = () => {
    const headers = [
      'Station ID',
      'Station Name',
      'Status',
      'pH (Simulated)',
      'Temperature_C (Simulated)',
      'Turbidity_NTU (Simulated)',
      'Dissolved_Oxygen_mg_L (Simulated)',
      'Electrical_Conductivity_uS_cm (Simulated)',
      'Preliminary_Risk_Level (Rule-Based Demo)',
      'Preliminary_Risk_Score',
      'Last_Updated',
      'Project_Group_Credits',
    ];

    const rows = (['A', 'B', 'C'] as StationId[]).map((id) => {
      const s = stations[id];
      const r = evaluateStationRisk(id, s.readings);
      return [
        `Station ${s.id}`,
        `"${s.name}"`,
        s.status,
        s.readings.ph,
        s.readings.temperature,
        s.readings.turbidity,
        s.readings.dissolvedOxygen,
        s.readings.conductivity,
        r.level,
        r.score,
        `"${s.lastUpdated} (SIMULATED DATA)"`,
        `"AEC CSE Group 4 (2026-2027): ${FIVE_TEAM_MEMBERS_SUMMARY}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIVER_INTELLIGENCE_Simulated_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="glass-panel flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl p-5 sm:p-6 no-print">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#0D9488]">
            <span>ANOMALY ALERTS &amp; EXPORTABLE TELEMETRY REPORTS</span>
            <span aria-hidden="true" className="text-[#71869A]">·</span>
            <span className="text-[#0284C7]">LOCAL CSV &amp; PRINT SUMMARY</span>
          </div>
          <h1 className="mt-1 text-xl font-extrabold text-[#263B50] sm:text-2xl">
            Environmental Alerts &amp; Monitoring Report Generator
          </h1>
          <p className="mt-1 text-sm text-[#52667A]">
            Review demonstration water-quality alerts, filter by station or severity, export CSV data, or print a formal monitoring summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadCsv}
            className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-4 py-2 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-[#20CFC6]/55 bg-white/85 px-4 py-2 text-xs font-bold text-[#0D9488] hover:bg-[#EDF8FF] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Print Monitoring Summary</span>
          </button>
        </div>
      </div>

      {/* Mandatory Highlighted Station B Demonstration Alert Banner */}
      <div className="glass-card rounded-2xl border-rose-300/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-rose-600">
            ▲ PRIMARY DEMONSTRATION ALERT · AFFECTED STATION: STATION B
          </span>
          <span className="font-bold text-rose-600">SEVERITY: HIGH PRIORITY</span>
        </div>
        <blockquote className="mt-2 text-sm sm:text-base font-bold text-[#263B50] leading-relaxed">
          &quot;Station B shows the highest turbidity and conductivity and the lowest dissolved oxygen among the three simulated stations. Further investigation is recommended.&quot;
        </blockquote>
        <div className="mt-2 text-xs text-[#52667A] font-mono">
          Simulated Readings at Station B: Turbidity = {stations.B.readings.turbidity} NTU · Electrical Conductivity = {stations.B.readings.conductivity} µS/cm · Dissolved Oxygen = {stations.B.readings.dissolvedOxygen} mg/L · pH = {stations.B.readings.ph}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card rounded-2xl p-4 no-print">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#52667A]">Filter by Station:</span>
            {(['ALL', 'A', 'B', 'C'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  stationFilter === st
                    ? 'bg-[#20CFC6] text-white shadow-xs'
                    : 'bg-white/80 text-[#52667A] hover:text-[#263B50] border border-[#70CFFF]/35'
                }`}
              >
                {st === 'ALL' ? 'All Stations' : `Station ${st}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#52667A]">Filter by Severity:</span>
            {(['ALL', 'High', 'Medium', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`min-h-[38px] rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-[#20CFC6] text-white shadow-xs'
                    : 'bg-white/80 text-[#52667A] hover:text-[#263B50] border border-[#70CFFF]/35'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : `${sev} Severity`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-card rounded-2xl p-5 ${
              alert.severity === 'High'
                ? 'border-rose-300/75'
                : alert.severity === 'Medium'
                ? 'border-amber-300/75'
                : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span
                    className={
                      alert.severity === 'High'
                        ? 'text-rose-600 font-bold'
                        : alert.severity === 'Medium'
                        ? 'text-amber-600 font-bold'
                        : 'text-[#0D9488] font-bold'
                    }
                  >
                    SEVERITY: {alert.severity.toUpperCase()}
                  </span>
                  <span aria-hidden="true" className="text-[#71869A]">·</span>
                  <span className="text-[#263B50] font-bold">
                    AFFECTED: STATION {alert.stationId}
                  </span>
                  <span aria-hidden="true" className="text-[#71869A]">·</span>
                  <span className="text-[#71869A]">TIMESTAMP: {alert.timestamp}</span>
                  <span aria-hidden="true" className="text-[#71869A]">·</span>
                  <span
                    className={
                      alert.acknowledged
                        ? 'text-emerald-700 font-bold'
                        : 'text-amber-700 font-bold'
                    }
                  >
                    STATUS: {alert.acknowledged ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#263B50]">{alert.title}</h3>
                <p className="text-sm text-[#52667A] leading-relaxed">{alert.message}</p>
                <div className="pt-1 text-xs text-[#71869A]">
                  <strong className="text-[#263B50]">Diagnostic Reason:</strong> {alert.reason}
                </div>
              </div>

              <button
                onClick={() => onToggleAcknowledgeAlert(alert.id)}
                className={`no-print min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  alert.acknowledged
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border-[#20CFC6] bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] text-white shadow-xs hover:opacity-95'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {alert.acknowledged ? 'Acknowledged (Click to Undo)' : 'Acknowledge Alert'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable & Live Monitoring Summary Table */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#70CFFF]/30 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#0D9488]">
              CONSOLIDATED MONITORING SUMMARY REPORT (SIMULATED DATA)
            </div>
            <h2 className="mt-1 text-lg font-bold text-[#263B50]">
              RIVER INTELLIGENCE — Station A, B &amp; C Telemetry Snapshot
            </h2>
          </div>
          <span className="text-xs font-mono text-[#71869A]">
            Asansol Engineering College · CSE Group 4 (2026–2027)
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#70CFFF]/35 text-[#71869A] font-mono">
                <th className="py-2.5 pr-4">STATION</th>
                <th className="py-2.5 px-3">pH</th>
                <th className="py-2.5 px-3">TEMP (°C)</th>
                <th className="py-2.5 px-3">TURBIDITY (NTU)</th>
                <th className="py-2.5 px-3">DISSOLVED O₂ (mg/L)</th>
                <th className="py-2.5 px-3">CONDUCTIVITY (µS/cm)</th>
                <th className="py-2.5 pl-3">PRELIMINARY RISK (DEMO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#70CFFF]/25">
              {(['A', 'B', 'C'] as StationId[]).map((id) => {
                const s = stations[id];
                const r = evaluateStationRisk(id, s.readings);
                return (
                  <tr key={id}>
                    <td className="py-3 pr-4 font-bold text-[#263B50]">{s.name}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#263B50]">
                      {s.readings.ph}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#263B50]">
                      {s.readings.temperature}°C
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums font-bold text-rose-600">
                      {s.readings.turbidity} NTU
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums font-bold text-[#0D9488]">
                      {s.readings.dissolvedOxygen} mg/L
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums font-bold text-[#0284C7]">
                      {s.readings.conductivity} µS/cm
                    </td>
                    <td className="py-3 pl-3 font-mono font-bold text-[#263B50]">
                      {r.level} ({r.score}/100)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Printable Academic Team Credits Footer */}
        <div className="mt-4 border-t border-[#70CFFF]/30 pt-3 text-xs text-[#71869A] flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong className="text-[#263B50]">Project Team (Group 4):</strong> 139 — Rijoy Biswas · 140 — Rishabh Kumar Shaw · 141 — Rishan Nandi · 142 — Rishav Kumar Pandey · 144 — Ritik Kumar Ram
          </span>
          <span className="font-mono font-bold text-[#0D9488]">SIMULATED TELEMETRY REPORT</span>
        </div>
      </div>
    </div>
  );
};
