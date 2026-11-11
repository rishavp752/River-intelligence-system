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

  // Generate and download CSV of current simulated station readings
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#20D6D0]/30 bg-[#0B2030] p-4 sm:p-5 no-print">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#20D6D0]">
            <span>ANOMALY ALERTS & EXPORTABLE TELEMETRY REPORTS</span>
            <span aria-hidden="true">·</span>
            <span>LOCAL CSV & PRINT SUMMARY</span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
            Environmental Alerts & Monitoring Report Generator
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review demonstration water-quality alerts, filter by station or severity, export CSV data, or print a formal monitoring summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadCsv}
            className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-lg bg-[#20D6D0] px-4 py-2 text-xs font-semibold text-[#061421] hover:bg-[#00AFA7] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-lg border border-[#20D6D0]/40 bg-[#061421] px-4 py-2 text-xs font-semibold text-[#20D6D0] hover:bg-[#20D6D0]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Print Monitoring Summary</span>
          </button>
        </div>
      </div>

      {/* Mandatory Highlighted Station B Demonstration Alert Banner */}
      <div className="rounded-xl border border-[#FF7068]/60 bg-[#0B2030] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="font-bold text-[#FF7068]">
            ▲ PRIMARY DEMONSTRATION ALERT · AFFECTED STATION: STATION B
          </span>
          <span className="text-slate-400">SEVERITY: HIGH PRIORITY</span>
        </div>
        <blockquote className="mt-2 text-sm sm:text-base font-semibold text-white leading-relaxed">
          "Station B shows the highest turbidity and conductivity and the lowest dissolved oxygen among the three simulated stations. Further investigation is recommended."
        </blockquote>
        <div className="mt-2 text-xs text-slate-300 font-mono">
          Simulated Readings at Station B: Turbidity = {stations.B.readings.turbidity} NTU · Electrical Conductivity = {stations.B.readings.conductivity} µS/cm · Dissolved Oxygen = {stations.B.readings.dissolvedOxygen} mg/L · pH = {stations.B.readings.ph}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4 no-print">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Filter by Station:</span>
            {(['ALL', 'A', 'B', 'C'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  stationFilter === st
                    ? 'bg-[#20D6D0] text-[#061421]'
                    : 'bg-[#061421] text-slate-300 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All Stations' : `Station ${st}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Filter by Severity:</span>
            {(['ALL', 'High', 'Medium', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`min-h-[38px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-[#20D6D0] text-[#061421]'
                    : 'bg-[#061421] text-slate-300 hover:text-white'
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
            className={`rounded-xl border p-4 sm:p-5 transition-colors ${
              alert.severity === 'High'
                ? 'border-[#FF7068]/50 bg-[#0B2030]'
                : alert.severity === 'Medium'
                ? 'border-[#F4B942]/40 bg-[#0B2030]'
                : 'border-slate-800 bg-[#0B2030]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span
                    className={
                      alert.severity === 'High'
                        ? 'text-[#FF7068] font-bold'
                        : alert.severity === 'Medium'
                        ? 'text-[#F4B942] font-bold'
                        : 'text-[#20D6D0] font-bold'
                    }
                  >
                    SEVERITY: {alert.severity.toUpperCase()}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-white font-semibold">
                    AFFECTED: STATION {alert.stationId}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">TIMESTAMP: {alert.timestamp}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span
                    className={
                      alert.acknowledged ? 'text-emerald-400' : 'text-[#F4B942]'
                    }
                  >
                    STATUS: {alert.acknowledged ? 'ACKNOWLEDGED' : 'UNACKNOWLEDGED'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{alert.title}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{alert.message}</p>
                <div className="pt-1 text-xs text-slate-400">
                  <strong className="text-slate-300">Diagnostic Reason:</strong> {alert.reason}
                </div>
              </div>

              <button
                onClick={() => onToggleAcknowledgeAlert(alert.id)}
                className={`no-print min-h-[40px] inline-flex items-center justify-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  alert.acknowledged
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-[#20D6D0] bg-[#20D6D0] text-[#061421] hover:bg-[#00AFA7] hover:text-white'
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
      <div className="rounded-xl border border-slate-800 bg-[#0B2030] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-mono text-[#20D6D0]">
              CONSOLIDATED MONITORING SUMMARY REPORT (SIMULATED DATA)
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">
              RIVER INTELLIGENCE — Station A, B & C Telemetry Snapshot
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Asansol Engineering College · CSE Group 4 (2026–2027)
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 pr-4">STATION</th>
                <th className="py-2.5 px-3">pH</th>
                <th className="py-2.5 px-3">TEMP (°C)</th>
                <th className="py-2.5 px-3">TURBIDITY (NTU)</th>
                <th className="py-2.5 px-3">DISSOLVED O₂ (mg/L)</th>
                <th className="py-2.5 px-3">CONDUCTIVITY (µS/cm)</th>
                <th className="py-2.5 pl-3">PRELIMINARY RISK (DEMO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(['A', 'B', 'C'] as StationId[]).map((id) => {
                const s = stations[id];
                const r = evaluateStationRisk(id, s.readings);
                return (
                  <tr key={id}>
                    <td className="py-3 pr-4 font-semibold text-white">{s.name}</td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-200">
                      {s.readings.ph}
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-slate-200">
                      {s.readings.temperature}°C
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums font-bold text-[#FF7068]">
                      {s.readings.turbidity} NTU
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#20D6D0]">
                      {s.readings.dissolvedOxygen} mg/L
                    </td>
                    <td className="py-3 px-3 font-mono tabular-nums text-[#F4B942]">
                      {s.readings.conductivity} µS/cm
                    </td>
                    <td className="py-3 pl-3 font-mono font-bold text-white">
                      {r.level} ({r.score}/100)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Printable Academic Team Credits Footer */}
        <div className="mt-4 border-t border-slate-800 pt-3 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong className="text-slate-200">Project Team (Group 4):</strong> 139 — Rijoy Biswas · 140 — Rishabh Kumar Shaw · 141 — Rishan Nandi · 142 — Rishav Kumar Pandey · 144 — Ritik Kumar Ram
          </span>
          <span className="font-mono text-[#20D6D0]">SIMULATED TELEMETRY REPORT</span>
        </div>
      </div>
    </div>
  );
};
