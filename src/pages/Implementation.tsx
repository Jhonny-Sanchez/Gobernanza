import React, { useState } from 'react';
import {
  CheckCircle2,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  FileCheck,
  Calendar,
  User,
  Shield,
  Clock,
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { RequirementAssessment, RequirementStatus, PriorityLevel, StandardType } from '../types';

export const Implementation: React.FC = () => {
  const {
    requirements,
    updateRequirement,
    implementationActions,
    addImplementationAction,
    updateImplementationAction,
    evidences
  } = useStore();

  const [activeTab, setActiveTab] = useState('gap');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStandard, setSelectedStandard] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Drawer state for requirement 360 detail
  const [selectedRequirement, setSelectedRequirement] = useState<RequirementAssessment | null>(null);
  const [isRequirementDrawerOpen, setRequirementDrawerOpen] = useState(false);

  // Modal for new Roadmap/WorkPlan action
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionStandard, setNewActionStandard] = useState<StandardType>('ISO/IEC 42001');
  const [newActionPhase, setNewActionPhase] = useState('Fase 3: Controles Técnicos');
  const [newActionAssignee, setNewActionAssignee] = useState('Jorge Hosato');
  const [newActionDueDate, setNewActionDueDate] = useState('2026-11-15');
  const [newActionPriority, setNewActionPriority] = useState<PriorityLevel>('Alta');

  const tabs: TabItem[] = [
    { id: 'gap', label: 'Gap Assessment', count: requirements.length },
    { id: 'roadmap', label: 'Roadmap & Timeline' },
    { id: 'workplan', label: 'Work Plan', count: implementationActions.length },
    { id: 'evolution', label: 'Evolución por Norma' }
  ];

  // Filtering requirements
  const filteredRequirements = requirements.filter((r) => {
    const matchesSearch =
      r.clause.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requirement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStandard = selectedStandard === 'all' || r.standard === selectedStandard;
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || r.priority === selectedPriority;

    return matchesSearch && matchesStandard && matchesStatus && matchesPriority;
  });

  const handleOpenRequirementDrawer = (req: RequirementAssessment) => {
    setSelectedRequirement(req);
    setRequirementDrawerOpen(true);
  };

  const handleUpdateStatus = (status: RequirementStatus) => {
    if (!selectedRequirement) return;
    updateRequirement(selectedRequirement.id, { status });
    setSelectedRequirement({ ...selectedRequirement, status });
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle) return;

    addImplementationAction({
      organizationId: 'org-nova-1',
      title: newActionTitle,
      standard: newActionStandard,
      phase: newActionPhase,
      assignedTo: newActionAssignee,
      startDate: new Date().toISOString().slice(0, 10),
      dueDate: newActionDueDate,
      progress: 0,
      priority: newActionPriority,
      status: 'Por iniciar',
      dependencies: []
    });

    setNewActionTitle('');
    setActionModalOpen(false);
  };

  // Group roadmap by phases
  const phases = [
    'Fase 1: Diagnóstico & Alcance',
    'Fase 2: Evaluación de Aplicabilidad',
    'Fase 3: Controles Técnicos',
    'Fase 4: Cultura y Capacitación',
    'Fase 5: Certificación'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Centro de Implementación
            </h1>
            <Badge variant="teal">ISO 42001 & ISO 27001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Auditoría de brechas, plan de trabajo de adecuación y hoja de ruta para certificación.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setActionModalOpen(true)}
          >
            Nueva Acción de Trabajo
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: GAP ASSESSMENT */}
      {activeTab === 'gap' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por cláusula, requisito, descripción o responsable..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todas las normas</option>
                <option value="ISO/IEC 42001">ISO/IEC 42001</option>
                <option value="ISO/IEC 27001">ISO/IEC 27001</option>
                <option value="EU AI Act">EU AI Act</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="Implementado y mantenido">Implementado y mantenido</option>
                <option value="Implementado">Implementado</option>
                <option value="Documentado">Documentado</option>
                <option value="Planificado">Planificado</option>
                <option value="Brecha">Brecha</option>
                <option value="No evaluado">No evaluado</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todas las prioridades</option>
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          {/* Requirements Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Cláusula & Norma</th>
                    <th className="py-3.5 px-4">Requisito Normativo</th>
                    <th className="py-3.5 px-4">Estado</th>
                    <th className="py-3.5 px-4">% Avance</th>
                    <th className="py-3.5 px-4">Efectividad</th>
                    <th className="py-3.5 px-4">Prioridad</th>
                    <th className="py-3.5 px-4">Responsable</th>
                    <th className="py-3.5 px-4">Fecha Meta</th>
                    <th className="py-3.5 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRequirements.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No se encontraron requisitos que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredRequirements.map((req) => (
                      <tr
                        key={req.id}
                        onClick={() => handleOpenRequirementDrawer(req)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">{req.clause}</span>
                          <span className="text-[10px] text-teal-700 font-semibold">{req.standard}</span>
                        </td>
                        <td className="py-3 px-4 max-w-[280px]">
                          <p className="font-semibold text-slate-900 leading-snug">{req.requirement}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{req.description}</p>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge variant="auto" statusText={req.status}>
                            {req.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 w-28 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${
                                  req.implementationPercentage >= 80
                                    ? 'bg-emerald-600'
                                    : req.implementationPercentage >= 50
                                    ? 'bg-teal-600'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${req.implementationPercentage}%` }}
                              />
                            </div>
                            <span className="font-bold text-slate-800">{req.implementationPercentage}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{req.effectiveness}%</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Badge variant="auto" statusText={req.priority}>
                            {req.priority}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{req.owner}</td>
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{req.targetDate}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenRequirementDrawer(req)}>
                            Detalle 360°
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Hoja de Ruta hacia la Certificación 2026</h3>
              <p className="text-xs text-slate-500">Cronograma de hitos estratégicos y dependencias</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Meta Global: <strong>Fase 1 en Noviembre</strong></span>
            </div>
          </div>

          <div className="space-y-4">
            {phases.map((phase, idx) => {
              const actionsInPhase = implementationActions.filter((a) => a.phase === phase);
              return (
                <div key={phase} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{phase}</h4>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      {actionsInPhase.length} acciones asociadas
                    </span>
                  </div>

                  {actionsInPhase.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No hay tareas asignadas a esta fase actualmente.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {actionsInPhase.map((act) => (
                        <div
                          key={act.id}
                          className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">{act.title}</span>
                            <Badge variant="auto" statusText={act.status} size="sm">
                              {act.status}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              {act.assignedTo}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {act.dueDate}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                              <span>Progreso</span>
                              <span>{act.progress}%</span>
                            </div>
                            <Progress value={act.progress} color="teal" size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: WORK PLAN */}
      {activeTab === 'workplan' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Plan de Trabajo Operativo</h3>
              <p className="text-xs text-slate-500">Gestión de tareas, avance y dependencias directas</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setActionModalOpen(true)}
            >
              Agregar Tarea
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Tarea / Acción</th>
                  <th className="py-3 px-4">Fase</th>
                  <th className="py-3 px-4">Norma</th>
                  <th className="py-3 px-4">Responsable</th>
                  <th className="py-3 px-4">Prioridad</th>
                  <th className="py-3 px-4">Fecha Límite</th>
                  <th className="py-3 px-4">Progreso</th>
                  <th className="py-3 px-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {implementationActions.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{act.title}</td>
                    <td className="py-3 px-4 text-slate-600">{act.phase}</td>
                    <td className="py-3 px-4 text-teal-700 font-semibold">{act.standard}</td>
                    <td className="py-3 px-4 text-slate-700">{act.assignedTo}</td>
                    <td className="py-3 px-4">
                      <Badge variant="auto" statusText={act.priority}>
                        {act.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{act.dueDate}</td>
                    <td className="py-3 px-4 w-32">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={act.progress}
                          onChange={(e) =>
                            updateImplementationAction(act.id, { progress: Number(e.target.value) })
                          }
                          className="w-20 accent-teal-600 cursor-pointer"
                        />
                        <span className="font-bold text-slate-800">{act.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={act.status}
                        onChange={(e) =>
                          updateImplementationAction(act.id, { status: e.target.value as any })
                        }
                        className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold cursor-pointer"
                      >
                        <option value="Por iniciar">Por iniciar</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Bloqueado">Bloqueado</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EVOLUTION */}
      {activeTab === 'evolution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-1">Madurez ISO/IEC 42001 (IA)</h3>
            <p className="text-xs text-slate-500 mb-4">Progreso por dominio del Anexo A</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.2 Políticas relacionadas con IA</span>
                  <span className="text-teal-700">92%</span>
                </div>
                <Progress value={92} color="teal" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.3 Organización interna y roles</span>
                  <span className="text-teal-700">85%</span>
                </div>
                <Progress value={85} color="teal" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.5 Ciclo de vida de sistemas IA</span>
                  <span className="text-teal-700">76%</span>
                </div>
                <Progress value={76} color="teal" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.6 Recursos de datos y linaje</span>
                  <span className="text-teal-700">80%</span>
                </div>
                <Progress value={80} color="teal" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.8 Impacto en personas y sociedad</span>
                  <span className="text-teal-700">68%</span>
                </div>
                <Progress value={68} color="teal" size="sm" />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-bold text-slate-900 mb-1">Madurez ISO/IEC 27001 (Seguridad)</h3>
            <p className="text-xs text-slate-500 mb-4">Progreso por controles organizacionales y técnicos</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.5 Controles Organizacionales (37)</span>
                  <span className="text-blue-700">88%</span>
                </div>
                <Progress value={88} color="blue" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.6 Controles de Personas (8)</span>
                  <span className="text-blue-700">82%</span>
                </div>
                <Progress value={82} color="blue" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.7 Controles Físicos (14)</span>
                  <span className="text-blue-700">95%</span>
                </div>
                <Progress value={95} color="blue" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>A.8 Controles Tecnológicos (34)</span>
                  <span className="text-blue-700">79%</span>
                </div>
                <Progress value={79} color="blue" size="sm" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* REQUIREMENT 360 DRAWER */}
      {selectedRequirement && (
        <Drawer
          isOpen={isRequirementDrawerOpen}
          onClose={() => setRequirementDrawerOpen(false)}
          title={`${selectedRequirement.clause}: ${selectedRequirement.requirement}`}
          subtitle={`Estándar: ${selectedRequirement.standard} • Responsable: ${selectedRequirement.owner}`}
          badge={
            <Badge variant="auto" statusText={selectedRequirement.status}>
              {selectedRequirement.status}
            </Badge>
          }
          width="2xl"
          footer={
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setRequirementDrawerOpen(false)}>
                Cerrar
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Description Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Descripción del Requisito
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed">
                {selectedRequirement.description}
              </p>
              {selectedRequirement.notes && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800">Notas de auditoría:</strong> {selectedRequirement.notes}
                </div>
              )}
            </div>

            {/* Change Status & Percentage */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Evaluación & Estado Actual
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Estado de Cumplimiento
                  </label>
                  <select
                    value={selectedRequirement.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as RequirementStatus)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="No evaluado">No evaluado</option>
                    <option value="Brecha">Brecha</option>
                    <option value="Planificado">Planificado</option>
                    <option value="Documentado">Documentado</option>
                    <option value="Implementado">Implementado</option>
                    <option value="Implementado y mantenido">Implementado y mantenido</option>
                    <option value="Verificado">Verificado</option>
                    <option value="No aplica">No aplica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Porcentaje de Implementación ({selectedRequirement.implementationPercentage}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedRequirement.implementationPercentage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateRequirement(selectedRequirement.id, { implementationPercentage: val });
                      setSelectedRequirement({ ...selectedRequirement, implementationPercentage: val });
                    }}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Linked Evidences */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-teal-600" />
                  <span>Evidencias Documentales Vinculadas ({selectedRequirement.evidenceIds.length})</span>
                </h4>
              </div>

              {selectedRequirement.evidenceIds.length === 0 ? (
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>No hay evidencias adjuntas a este requisito. Se requiere cargar documento probatorio.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedRequirement.evidenceIds.map((evId) => {
                    const ev = evidences.find((e) => e.id === evId);
                    return (
                      <div
                        key={evId}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{ev?.code || evId}</span>
                          <span className="text-slate-600 truncate max-w-[280px]">
                            {ev?.title || 'Documento de respaldo'}
                          </span>
                        </div>
                        <Badge variant="auto" statusText={ev?.status || 'Válido'}>
                          {ev?.status || 'Válido'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* CREATE ACTION MODAL */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setActionModalOpen(false)}
        title="Crear Nueva Acción de Implementación"
        subtitle="Asignar tarea al plan de trabajo y hoja de ruta"
      >
        <form onSubmit={handleCreateAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Título de la Tarea
            </label>
            <input
              type="text"
              required
              value={newActionTitle}
              onChange={(e) => setNewActionTitle(e.target.value)}
              placeholder="Ej. Auditoría de robustez adversarial en modelo de crédito"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Estándar
              </label>
              <select
                value={newActionStandard}
                onChange={(e) => setNewActionStandard(e.target.value as StandardType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="ISO/IEC 42001">ISO/IEC 42001</option>
                <option value="ISO/IEC 27001">ISO/IEC 27001</option>
                <option value="EU AI Act">EU AI Act</option>
                <option value="Integrado">Integrado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Fase de Roadmap
              </label>
              <select
                value={newActionPhase}
                onChange={(e) => setNewActionPhase(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                {phases.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Responsable
              </label>
              <input
                type="text"
                value={newActionAssignee}
                onChange={(e) => setNewActionAssignee(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Fecha Límite
              </label>
              <input
                type="date"
                value={newActionDueDate}
                onChange={(e) => setNewActionDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Prioridad
              </label>
              <select
                value={newActionPriority}
                onChange={(e) => setNewActionPriority(e.target.value as PriorityLevel)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setActionModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Acción
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
