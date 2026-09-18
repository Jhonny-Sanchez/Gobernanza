import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  ClipboardList,
  FileCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const CalendarPage: React.FC = () => {
  const { auditPrograms, auditFindings, evidences } = useStore();

  const events = [
    {
      id: 'ev-1',
      title: 'Auditoría Interna SGIA Fase 1 (Cláusulas 4 a 7)',
      date: '2026-10-15',
      time: '09:00 - 14:00',
      type: 'Auditoría',
      standard: 'ISO/IEC 42001',
      owner: 'Jorge Hosato',
      status: 'Confirmado'
    },
    {
      id: 'ev-2',
      title: 'Reunión Ordinaria del Comité de Ética y Algoritmos',
      date: '2026-10-22',
      time: '11:00 - 12:30',
      type: 'Comité',
      standard: 'Gobierno Corporativo',
      owner: 'Dra. Elena Vega',
      status: 'Programado'
    },
    {
      id: 'ev-3',
      title: 'Vencimiento de Evidencia: Política de Uso Aceptable de LLMs',
      date: '2026-11-10',
      time: '23:59',
      type: 'Vencimiento',
      standard: 'ISO/IEC 27001',
      owner: 'Jorge Hosato',
      status: 'Crítico'
    },
    {
      id: 'ev-4',
      title: 'Auditoría Externa de Certificación (Entidad Acreditada)',
      date: '2026-11-25',
      time: '08:30 - 18:00',
      type: 'Auditoría',
      standard: 'ISO/IEC 42001',
      owner: 'Auditor Certificador',
      status: 'Hito Clave'
    },
    {
      id: 'ev-5',
      title: 'Revisión por la Dirección - Cierre Anual 2026',
      date: '2026-12-15',
      time: '15:00 - 17:00',
      type: 'Dirección',
      standard: 'Cláusula 9.3',
      owner: 'CEO & Directores',
      status: 'Programado'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Calendario de Cumplimiento & Auditorías
            </h1>
            <Badge variant="teal">Hitos de Gobernanza</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Programación de comités de ética, vencimientos documentales, auditorías internas y sesiones de dirección.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
          Agendar Hito
        </Button>
      </div>

      {/* Agenda list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: upcoming events timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Próximos Hitos & Compromisos Normativos
            </h3>
            <span className="text-xs text-slate-500">{events.length} eventos programados</span>
          </div>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-teal-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-center shrink-0 w-16">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">
                      {new Date(ev.date).toLocaleDateString('es-ES', { month: 'short' })}
                    </span>
                    <span className="block text-xl font-extrabold text-slate-900">
                      {ev.date.split('-')[2]}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {ev.standard}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{ev.type}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {ev.time}
                      </span>
                      <span>Responsable: {ev.owner}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <Badge variant="auto" statusText={ev.status}>
                    {ev.status}
                  </Badge>
                  <button className="text-xs text-teal-700 font-bold hover:underline cursor-pointer">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col: mini calendar widget / reminder card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Resumen del Cuatrimestre</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-600">Auditorías Previstas:</span>
                <strong className="text-slate-900">2</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-600">Sesiones Comité de Ética:</span>
                <strong className="text-slate-900">4</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-600">Evidencias por Renovar:</span>
                <strong className="text-amber-700">1</strong>
              </div>
              <div className="flex justify-between p-2.5 bg-teal-50 rounded-lg border border-teal-100">
                <span className="text-teal-900 font-semibold">Auditoría Externa Fase 1:</span>
                <strong className="text-teal-900">25 Nov 2026</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
