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
    <div className="space-y-8">
      {/* Header & Export Actions */}
      <div className="glass-panel flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-3xl p-6 sm:p-8 no-print">
        <div className="space-y-1.5">
          <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#0D9488]">
            Anomaly Alerts &amp; Telemetry Reports
          </div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-[#263B50]">
            Environmental Alerts &amp; Exportable Summary
          </h2>
          <p className="text-sm text-[#52667A]">
            Review simulated water-quality alerts, filter by station or severity, export CSV data, or print a monitoring summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadCsv}
            className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-5 py-2.5 text-xs font-medium text-white cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={handlePrintSummary}
            className="min-h-[42px] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-[#70CFFF]/45 bg-white/85 px-5 py-2.5 text-xs font-medium text-[#263B50] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 no-print">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#52667A]">Station:</span>
            {(['ALL', 'A', 'B', 'C'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStationFilter(st)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  stationFilter === st
                    ? 'bg-[#20CFC6] text-white'
                    : 'bg-white/80 text-[#52667A] hover:text-[#263B50] border border-[#70CFFF]/35'
                }`}
              >
                {st === 'ALL' ? 'All Stations' : `Station ${st}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#52667A]">Severity:</span>
            {(['ALL', 'High', 'Medium', 'Low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                  severityFilter === sev
                    ? 'bg-[#20CFC6] text-white'
                    : 'bg-white/80 text-[#52667A] hover:text-[#263B50] border border-[#70CFFF]/35'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : `${sev}`}
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
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                  <span
                    className={
                      alert.severity === 'High'
                        ? 'text-rose-600 font-semibold'
                        : alert.severity === 'Medium'
                        ? 'text-amber-600 font-semibold'
                        : 'text-[#0D9488] font-semibold'
                    }
                  >
                    {alert.severity.toUpperCase()} PRIORITY
                  </span>
                  <span aria-hidden="true" className="text-[#71869A]">·</span>
                  <span className="text-[#263B50]">STATION {alert.stationId}</span>
                  <span aria-hidden="true" className="text-[#71869A]">·</span>
                  <span className="text-[#71869A]">{alert.timestamp}</span>
                </div>

                <h3 className="text-base font-medium text-[#263B50]">{alert.title}</h3>
                <p className="text-sm text-[#52667A] leading-relaxed">{alert.message}</p>
                <div className="pt-1 text-xs text-[#71869A]">
                  <strong className="text-[#263B50] font-medium">Diagnostic Basis:</strong> {alert.reason}
                </div>
              </div>

              <button
                onClick={() => onToggleAcknowledgeAlert(alert.id)}
                className={`no-print min-h-[38px] inline-flex items-center justify-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  alert.acknowledged
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-[#20CFC6] bg-white/80 text-[#263B50]'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable & Live Monitoring Summary Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#70CFFF]/30 pb-4">
          <div>
            <div className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#0D9488]">
              Consolidated Telemetry Snapshot (Simulated Data)
            </div>
            <h3 className="mt-1 text-lg font-medium text-[#263B50]">
              Station A, B &amp; C Comparative Summary
            </h3>
          </div>
          <span className="text-xs font-mono text-[#71869A]">
            RIVER INTELLIGENCE FRAMEWORK
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#70CFFF]/35 text-[#71869A] font-mono">
                <th className="py-3 pr-4">STATION</th>
                <th className="py-3 px-3">pH</th>
                <th className="py-3 px-3">TEMP (°C)</th>
                <th className="py-3 px-3">TURBIDITY (NTU)</th>
                <th className="py-3 px-3">DISSOLVED O₂ (mg/L)</th>
                <th className="py-3 px-3">CONDUCTIVITY (µS/cm)</th>
                <th className="py-3 pl-3">PRELIMINARY RISK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#70CFFF]/25">
              {(['A', 'B', 'C'] as StationId[]).map((id) => {
                const s = stations[id];
                const r = evaluateStationRisk(id, s.readings);
                return (
                  <tr key={id}>
                    <td className="py-3.5 pr-4 font-medium text-[#263B50]">{s.name}</td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-[#263B50]">
                      {s.readings.ph}
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-[#263B50]">
                      {s.readings.temperature}°C
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-rose-600">
                      {s.readings.turbidity} NTU
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-[#0D9488]">
                      {s.readings.dissolvedOxygen} mg/L
                    </td>
                    <td className="py-3.5 px-3 font-mono tabular-nums text-[#0284C7]">
                      {s.readings.conductivity} µS/cm
                    </td>
                    <td className="py-3.5 pl-3 font-mono text-[#263B50]">
                      {r.level} ({r.score}/100)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
