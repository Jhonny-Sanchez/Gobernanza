import React, { useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  TrendingUp,
  Cpu,
  Zap,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Calendar,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { KPIMetric, ModelMetric } from '../types';

export const Performance: React.FC = () => {
  const { kpiMetrics = [], modelMetrics = [], aiSystems } = useStore();

  const [activeTab, setActiveTab] = useState('kpis');
  const [selectedSystemFilter, setSelectedSystemFilter] = useState<string>('all');

  const tabs: TabItem[] = [
    { id: 'kpis', label: 'KPIs del Sistema Integrado (SGIA + SGSI)', count: kpiMetrics.length },
    { id: 'model-metrics', label: 'Telemetría de Modelos IA en Producción', count: modelMetrics.length },
    { id: 'management-review', label: 'Revisión por la Dirección (Cláusula 9.3)' }
  ];

  const filteredModelMetrics = modelMetrics.filter((m: ModelMetric) => {
    if (selectedSystemFilter === 'all') return true;
    return (m as any).aiSystemId === selectedSystemFilter || m.modelName.toLowerCase().includes(selectedSystemFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Evaluación del Desempeño & Telemetría de Modelos
            </h1>
            <Badge variant="teal">Cláusula 9 ISO 42001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Indicadores de gestión (KPIs), telemetría continua de modelos en producción (drift, alucinación, latencia) y actas de revisión por la dirección.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: KPIS DEL SISTEMA */}
      {activeTab === 'kpis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiMetrics.map((kpi: KPIMetric) => {
              const current = kpi.currentValue ?? (kpi as any).current ?? 0;
              const target = kpi.target || 1;
              const progressPct = Math.min(100, Math.round((current / target) * 100));

              return (
                <div key={kpi.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase">{kpi.category}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{kpi.name}</h3>
                    </div>
                    <Badge variant="auto" statusText={kpi.status}>
                      {kpi.status}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-900">
                      {current}{kpi.unit}
                    </span>
                    <span className="text-xs text-slate-500">
                      Meta: <strong>{target}{kpi.unit}</strong>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Cumplimiento del Objetivo</span>
                      <span className="font-bold text-slate-700">{progressPct}%</span>
                    </div>
                    <Progress
                      value={progressPct}
                      color={progressPct >= 90 ? 'teal' : 'amber'}
                      size="sm"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Frecuencia: {kpi.frequency}</span>
                    <span>Código: {kpi.code}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TELEMETRÍA DE MODELOS IA */}
      {activeTab === 'model-metrics' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Telemetría de Modelos en Tiempo Real</h3>
              <p className="text-xs text-slate-500">
                Monitoreo de deriva de datos (Evidently AI), fidelidad RAG y tasas de alucinación.
              </p>
            </div>

            <select
              value={selectedSystemFilter}
              onChange={(e) => setSelectedSystemFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Todos los modelos de IA</option>
              {modelMetrics.map((m: ModelMetric) => (
                <option key={m.id} value={m.id}>
                  {m.modelName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModelMetrics.map((metric: ModelMetric) => {
              return (
                <div key={metric.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Producción MLOps
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {metric.modelName}
                      </h4>
                    </div>
                    <Badge variant="auto" statusText={metric.status}>
                      {metric.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Precisión / F1-Score</span>
                      <strong className="text-base text-slate-900 font-extrabold">{metric.accuracy}%</strong>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">Óptimo (&gt;90%)</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Data Drift Score</span>
                      <strong className="text-base text-teal-700 font-extrabold">{metric.drift}%</strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Bajo el umbral 3.0%</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Latencia Media</span>
                      <strong className="text-base text-slate-900 font-extrabold">{metric.latency} ms</strong>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">SLA: &lt;500 ms</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-500 block">Peticiones Mensuales</span>
                      <strong className="text-base text-slate-900 font-extrabold">
                        {metric.requestsCount?.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 block mt-0.5">Tráfico validado</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Monitoreo Continuo</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Estado Conforme
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REVISIÓN POR LA DIRECCIÓN */}
      {activeTab === 'management-review' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Acta Oficial RD-2026-01
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Revisión por la Dirección del SGIA & SGSI Integrado
                </h3>
                <p className="text-xs text-slate-500">Fecha de Sesión: 15 de Enero de 2026 • Presidida por: CEO & Comité Directivo</p>
              </div>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold text-xs px-3 py-1 rounded-full">
                Acta Aprobada
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Entradas Requeridas (ISO/IEC 42001 Cláusula 9.3)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">a) Estado de Acciones Previas:</strong>
                  <p className="text-slate-600">Se completaron el 100% de las acciones comprometidas en la sesión anterior.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">b) Cambios en el Contexto Externo:</strong>
                  <p className="text-slate-600">Entrada en vigor de las obligaciones del AI Act para modelos de riesgo alto.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">c) Desempeño del SGIA:</strong>
                  <p className="text-slate-600">Madurez promedio de controles en 3.4/5 y 0 incidentes críticos de seguridad de IA.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">d) Asignación de Recursos:</strong>
                  <p className="text-slate-600">Aprobación de presupuesto para herramientas de escaneo y auditoría continua.</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-1">
              <h4 className="font-bold text-teal-900 uppercase tracking-wider">
                Decisiones de Mejora Continua (Salidas de la Dirección)
              </h4>
              <p className="text-teal-800 leading-relaxed">
                Se ratifica el compromiso con la certificación ISO/IEC 42001 para el Q3 2026. Se instruye reforzar la capacitación de los ingenieros de prompts y habilitar el Comité de Ética con potestad de veto sobre modelos en producción.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
