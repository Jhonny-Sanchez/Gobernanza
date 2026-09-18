import React from 'react';
import {
  Activity,
  CheckCircle2,
  FileCheck2,
  Zap,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  Cpu,
  TrendingUp,
  Filter,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useStore } from '../store/useStore';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { Button } from '../components/ui/Button';
import { calculateGlobalHealth } from '../utils/calculations';
import { StandardType } from '../types';

interface CommandCenterProps {
  onNavigate: (path: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate }) => {
  const {
    filterStandard,
    setFilterStandard,
    filterPeriod,
    setFilterPeriod,
    filterProcessId,
    setFilterProcessId,
    processes,
    requirements,
    controls,
    evidences,
    risks,
    aiSystems,
    implementationActions,
    objectives,
    activityLogs,
    healthSnapshot
  } = useStore();

  // Filter requirements & controls according to filterStandard if not 'Integrado'
  const filteredReqs = filterStandard === 'Integrado'
    ? requirements
    : requirements.filter((r) => r.standard === filterStandard);

  const filteredCtrls = filterStandard === 'Integrado'
    ? controls
    : controls.filter((c) => c.standard === filterStandard);

  const health = calculateGlobalHealth(filteredReqs, filteredCtrls, evidences, risks);

  const openRisksCount = risks.filter((r) => r.status === 'Abierto' || r.status === 'En tratamiento').length;
  const pendingActionsCount = implementationActions.filter((a) => a.status !== 'Completado').length;

  // Maturity distribution calculation
  const maturityDistribution = [
    { level: 'N0 Inexistente', count: controls.filter((c) => c.maturityLevel === 0).length },
    { level: 'N1 Inicial', count: controls.filter((c) => c.maturityLevel === 1).length },
    { level: 'N2 Repetible', count: controls.filter((c) => c.maturityLevel === 2).length },
    { level: 'N3 Definido', count: controls.filter((c) => c.maturityLevel === 3).length },
    { level: 'N4 Gestionado', count: controls.filter((c) => c.maturityLevel === 4).length },
    { level: 'N5 Optimizado', count: controls.filter((c) => c.maturityLevel === 5).length }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Command Center</h1>
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              En Tiempo Real
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Índice interno de salud y preparación del sistema de gestión integrada (ISO/IEC 42001 & ISO/IEC 27001).
          </p>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-1 text-slate-400 pl-2 text-xs font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          {/* Standard Filter */}
          <select
            value={filterStandard}
            onChange={(e) => setFilterStandard(e.target.value as StandardType)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 px-3 py-1.5 outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="Integrado">Norma: Sistema Integrado</option>
            <option value="ISO/IEC 42001">ISO/IEC 42001 (IA)</option>
            <option value="ISO/IEC 27001">ISO/IEC 27001 (Seguridad)</option>
            <option value="EU AI Act">EU AI Act (Reglamento UE)</option>
          </select>

          {/* Process Filter */}
          <select
            value={filterProcessId}
            onChange={(e) => setFilterProcessId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 px-3 py-1.5 outline-none focus:border-teal-500 cursor-pointer max-w-[170px] truncate"
          >
            <option value="all">Proceso: Todos</option>
            {processes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>

          {/* Period Filter */}
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 px-3 py-1.5 outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="Q3 2026">Período: Q3 2026</option>
            <option value="Q2 2026">Período: Q2 2026</option>
            <option value="Q1 2026">Período: Q1 2026</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid (8 indicators as requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Salud Global del Sistema"
          value={`${health.globalHealth}%`}
          subtitle="Índice compuesto"
          trend={{ value: '+2.4% vs mes ant.', isPositive: true }}
          comparison="Meta: >85%"
          icon={<Activity className="w-5 h-5 text-teal-600" />}
          statusColor="teal"
          onClick={() => onNavigate('/implementation')}
        />
        <StatCard
          title="Implementación Normativa"
          value={`${health.implementationScore}%`}
          subtitle={`${filteredReqs.length} requisitos auditados`}
          trend={{ value: '+4.1% este trimestre', isPositive: true }}
          comparison="En fecha"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          statusColor="emerald"
          onClick={() => onNavigate('/implementation')}
        />
        <StatCard
          title="Salud de Evidencias"
          value={`${health.evidenceScore}%`}
          subtitle={`${evidences.length} evidencias vigentes`}
          trend={{ value: '2 por vencer', isPositive: false }}
          comparison="Vigencia 30d"
          icon={<FileCheck2 className="w-5 h-5 text-blue-600" />}
          statusColor="blue"
          onClick={() => onNavigate('/evidences')}
        />
        <StatCard
          title="Efectividad de Controles"
          value={`${health.effectivenessScore}%`}
          subtitle="SoA Integrada"
          trend={{ value: '+1.8% vs Q2', isPositive: true }}
          comparison="Auditado"
          icon={<Zap className="w-5 h-5 text-teal-600" />}
          statusColor="teal"
          onClick={() => onNavigate('/controls')}
        />

        <StatCard
          title="Audit Readiness (Preparación)"
          value={`${health.auditReadiness}%`}
          subtitle="Auditoría Externa Fase 1"
          trend={{ value: 'Faltan 54 días', isNeutral: true }}
          comparison="Nov 2026"
          icon={<ClipboardCheck className="w-5 h-5 text-teal-600" />}
          statusColor="teal"
          onClick={() => onNavigate('/audit')}
        />
        <StatCard
          title="Riesgos Abiertos"
          value={openRisksCount}
          subtitle={`${health.criticalRisksCount} de nivel crítico`}
          trend={{ value: '-1 mitigado', isPositive: true }}
          comparison="Apetito: <3"
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          statusColor={health.criticalRisksCount > 0 ? 'red' : 'amber'}
          onClick={() => onNavigate('/risks')}
        />
        <StatCard
          title="Acciones Pendientes"
          value={pendingActionsCount}
          subtitle="Planes de trabajo & CAPA"
          trend={{ value: '3 prioritarias', isNeutral: true }}
          comparison="Work Plan"
          icon={<Clock className="w-5 h-5 text-blue-600" />}
          statusColor="blue"
          onClick={() => onNavigate('/implementation')}
        />
        <StatCard
          title="Sistemas IA Registrados"
          value={aiSystems.length}
          subtitle="2 Alto Riesgo Anexo III"
          trend={{ value: '100% catalogados', isPositive: true }}
          comparison="EU AI Act"
          icon={<Cpu className="w-5 h-5 text-teal-600" />}
          statusColor="teal"
          onClick={() => onNavigate('/ai-registry')}
        />
      </div>

      {/* Row 2: Health Breakdown & Normative Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Normative Status Widget */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Estado Normativo</h3>
                <p className="text-xs text-slate-500">Cumplimiento desglosado por estándar</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-teal-600" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    ISO/IEC 42001:2023 (Gestión de IA)
                  </span>
                  <span className="font-bold text-slate-900">78.5%</span>
                </div>
                <Progress value={78.5} color="teal" size="md" />
                <p className="text-[11px] text-slate-400 mt-1">28 de 36 requisitos implementados</p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    ISO/IEC 27001:2022 (Seguridad de Información)
                  </span>
                  <span className="font-bold text-slate-900">84.2%</span>
                </div>
                <Progress value={84.2} color="blue" size="md" />
                <p className="text-[11px] text-slate-400 mt-1">78 de 93 controles conformes</p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    EU AI Act (Reglamento de Inteligencia Artificial)
                  </span>
                  <span className="font-bold text-slate-900">68.0%</span>
                </div>
                <Progress value={68.0} color="emerald" size="md" />
                <p className="text-[11px] text-slate-400 mt-1">FRIA y transparencia en fase piloto</p>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Próxima auditoría: 10 Noviembre 2026</span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/implementation')}>
              Ver Gap Assessment <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Action Center Widget */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Action Center</h3>
              <p className="text-xs text-slate-500">Acciones prioritarias y seguimiento de compromisos</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('/implementation')}>
              Ver Plan Completo
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-2.5">Acción</th>
                  <th className="pb-2.5">Responsable</th>
                  <th className="pb-2.5">Prioridad</th>
                  <th className="pb-2.5">Fecha Límite</th>
                  <th className="pb-2.5">Progreso</th>
                  <th className="pb-2.5 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {implementationActions.slice(0, 4).map((action) => (
                  <tr key={action.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-slate-900 max-w-[220px] truncate">
                      {action.title}
                    </td>
                    <td className="py-3 text-slate-600">{action.assignedTo}</td>
                    <td className="py-3">
                      <Badge variant="auto" statusText={action.priority}>
                        {action.priority}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-600">{action.dueDate}</td>
                    <td className="py-3 w-28">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="bg-teal-600 h-1.5 rounded-full"
                            style={{ width: `${action.progress}%` }}
                          />
                        </div>
                        <span className="font-bold text-[10px] text-slate-700">{action.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="auto" statusText={action.status}>
                        {action.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Row 3: Evolution Chart & Maturity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Evolution Chart (Recharts) */}
        <Card className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Evolución Histórica</h3>
              <p className="text-xs text-slate-500">
                Tendencia de salud, implementación, evidencias y efectividad (Últimos 6 meses)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Salud
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Implementación
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Evidencias
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={healthSnapshot.evolutionHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorImpl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="health"
                  name="Salud Global"
                  stroke="#0d9488"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorHealth)"
                />
                <Area
                  type="monotone"
                  dataKey="implementation"
                  name="Implementación"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorImpl)"
                />
                <Area
                  type="monotone"
                  dataKey="evidences"
                  name="Evidencias"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Maturity Distribution Widget */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Distribución de Madurez</h3>
              <p className="text-xs text-slate-500">Controles por nivel CMMI (0 a 5)</p>
            </div>
            <TrendingUp className="w-5 h-5 text-teal-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={maturityDistribution}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="level" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  formatter={(val: any) => [`${val} controles`, 'Cantidad']}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Mayoría en N4 Gestionado</span>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/controls')}>
              Ver Controles <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Row 4: Objectives Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Objectives Status */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Objetivos de Gobernanza</h3>
              <p className="text-xs text-slate-500">Seguimiento de metas clave</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/governance')}>
              Ver Todos
            </Button>
          </div>

          <div className="space-y-4">
            {objectives.map((obj) => (
              <div key={obj.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 leading-snug">
                    {obj.code}: {obj.name}
                  </span>
                  <Badge variant="auto" statusText={obj.status}>
                    {obj.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Actual: {obj.currentValue} {obj.unit}</span>
                  <span className="font-semibold text-slate-800">Meta: {obj.target} {obj.unit}</span>
                </div>
                <Progress
                  value={Math.round((obj.currentValue / obj.target) * 100)}
                  color={obj.status === 'En riesgo' ? 'amber' : 'teal'}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Activity List */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Actividad Reciente del Sistema</h3>
              <p className="text-xs text-slate-500">Trazabilidad y auditoría de eventos</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Últimos registros</span>
          </div>

          <div className="space-y-3">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0 text-xs font-bold">
                  {log.category.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900">{log.action}</p>
                    <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span>Por: <strong className="text-slate-600">{log.user}</strong></span>
                    <span>•</span>
                    <Badge variant="auto" statusText={log.category} size="sm" showDot={false}>
                      {log.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
