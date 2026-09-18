import React, { useState } from 'react';
import {
  Network,
  Plus,
  Search,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  BarChart,
  Users,
  Award,
  Layers,
  ChevronRight,
  Target,
  Edit2,
  Trash2,
  FileCheck
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Process, Stakeholder, GovernanceRole, Objective, ProcessCategory } from '../types';

export const Governance: React.FC = () => {
  const {
    processes,
    addProcess,
    updateProcess,
    deleteProcess,
    stakeholders,
    addStakeholder,
    deleteStakeholder,
    governanceRoles,
    addGovernanceRole,
    deleteGovernanceRole,
    objectives,
    indicators,
    risks,
    controls,
    aiSystems
  } = useStore();

  const [activeTab, setActiveTab] = useState('processes');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Process 360 Drawer
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [isProcessDrawerOpen, setProcessDrawerOpen] = useState(false);

  // New Process Modal
  const [isProcessModalOpen, setProcessModalOpen] = useState(false);
  const [pCode, setPCode] = useState('');
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pObjective, setPObjective] = useState('');
  const [pScope, setPScope] = useState('');
  const [pCategory, setPCategory] = useState<ProcessCategory>('misional');
  const [pOwner, setPOwner] = useState('');
  const [pCriticality, setPCriticality] = useState<'Baja' | 'Media' | 'Alta' | 'Crítica'>('Alta');

  // Stakeholder Modal
  const [isStakeholderModalOpen, setStakeholderModalOpen] = useState(false);
  const [stkName, setStkName] = useState('');
  const [stkType, setStkType] = useState<'Interno' | 'Externo'>('Externo');
  const [stkCategory, setStkCategory] = useState<'Clientes' | 'Reguladores' | 'Accionistas' | 'Empleados' | 'Proveedores' | 'Comunidad'>('Reguladores');
  const [stkNeeds, setStkNeeds] = useState('');
  const [stkExpectations, setStkExpectations] = useState('');
  const [stkOwner, setStkOwner] = useState('Jorge Hosato');

  const tabs: TabItem[] = [
    { id: 'processes', label: 'Procesos', count: processes.length },
    { id: 'map', label: 'Mapa de Procesos' },
    { id: 'stakeholders', label: 'Partes Interesadas (Stakeholders)', count: stakeholders.length },
    { id: 'roles', label: 'Roles de Gobernanza', count: governanceRoles.length },
    { id: 'objectives', label: 'Objetivos & Indicadores', count: objectives.length }
  ];

  const filteredProcesses = processes.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenProcess360 = (proc: Process) => {
    setSelectedProcess(proc);
    setProcessDrawerOpen(true);
  };

  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pCode || !pName) return;

    addProcess({
      organizationId: 'org-nova-1',
      code: pCode,
      name: pName,
      description: pDesc,
      objective: pObjective,
      scope: pScope,
      category: pCategory,
      owner: pOwner || 'Jorge Hosato',
      criticality: pCriticality,
      reviewFrequency: 'Trimestral',
      lastReviewDate: new Date().toISOString().slice(0, 10),
      nextReviewDate: '2026-12-31',
      status: 'Activo',
      inputs: ['Directrices corporativas'],
      activities: ['Ejecución y monitoreo'],
      outputs: ['Reportes de gestión'],
      clients: ['Comité de Gobernanza'],
      suppliers: ['Unidades operativas'],
      kpiIds: [],
      riskIds: [],
      controlIds: [],
      aiSystemIds: []
    });

    setPCode('');
    setPName('');
    setPDesc('');
    setPObjective('');
    setPScope('');
    setProcessModalOpen(false);
  };

  const handleCreateStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stkName) return;

    addStakeholder({
      organizationId: 'org-nova-1',
      name: stkName,
      type: stkType,
      category: stkCategory,
      needs: stkNeeds,
      expectations: stkExpectations,
      requirements: ['Cumplimiento legal y normativo'],
      legalRequirements: [],
      contractualRequirements: [],
      affectedProcesses: ['prc-01'],
      standards: ['ISO/IEC 42001'],
      owner: stkOwner,
      communicationFrequency: 'Trimestral',
      status: 'Activo'
    });

    setStkName('');
    setStkNeeds('');
    setStkExpectations('');
    setStakeholderModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gobernanza Corporativa
            </h1>
            <Badge variant="teal">Modelo ISO 42001 / 27001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Estructura de procesos, partes interesadas, roles de autoridad y cuadro de mando de objetivos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'processes' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setProcessModalOpen(true)}
            >
              Nuevo Proceso
            </Button>
          )}
          {activeTab === 'stakeholders' && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setStakeholderModalOpen(true)}
            >
              Registrar Stakeholder
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: PROCESOS */}
      {activeTab === 'processes' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, nombre de proceso o propietario..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                <option value="estratégico">Estratégico</option>
                <option value="misional">Misional</option>
                <option value="apoyo">Apoyo</option>
                <option value="control">Control</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProcesses.map((p) => {
              const pRisks = risks.filter((r) => r.processId === p.id);
              const pAIs = aiSystems.filter((s) => s.processId === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenProcess360(p)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs p-5 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {p.code}
                      </span>
                      <Badge variant="auto" statusText={p.category}>
                        {p.category.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span>Líder: <strong>{p.owner.split('(')[0]}</strong></span>
                      <span className="font-semibold text-slate-700">Criticidad: {p.criticality}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1" title="Sistemas IA asociados">
                        <Cpu className="w-3.5 h-3.5 text-teal-600" />
                        {pAIs.length} IA
                      </span>
                      <span className="flex items-center gap-1" title="Riesgos identificados">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        {pRisks.length} Riesgos
                      </span>
                    </div>

                    <span className="text-teal-700 font-bold flex items-center gap-1 hover:underline">
                      Ver 360° <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MAPA DE PROCESOS INTERACTIVO */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">Mapa Visual de Procesos de la Organización</h3>
            <p className="text-xs text-slate-500">
              Interacción entre Procesos Estratégicos, Misionales, de Apoyo y de Control. Haz click en cualquier bloque para inspeccionar su vista 360°.
            </p>
          </div>

          <div className="space-y-6 bg-slate-100/60 p-6 rounded-2xl border border-slate-200">
            {/* 1. Estratégicos */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Procesos Estratégicos & Gobernanza
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {processes
                  .filter((p) => p.category === 'estratégico')
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenProcess360(p)}
                      className="p-4 bg-white border border-teal-200 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer transition-all border-l-4 border-l-teal-600"
                    >
                      <span className="text-xs font-bold text-teal-700">{p.code}</span>
                      <h5 className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</h5>
                      <p className="text-xs text-slate-500 mt-1">{p.objective}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Down arrow connector */}
            <div className="flex justify-center">
              <span className="text-xs text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                ↓ Despliegue hacia la Cadena de Valor
              </span>
            </div>

            {/* 2. Misionales */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Procesos Misionales / Operativos (Core AI Lifecycle)
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {processes
                  .filter((p) => p.category === 'misional')
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenProcess360(p)}
                      className="p-4 bg-white border border-blue-200 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer transition-all border-l-4 border-l-blue-600"
                    >
                      <span className="text-xs font-bold text-blue-700">{p.code}</span>
                      <h5 className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</h5>
                      <p className="text-xs text-slate-500 mt-1">{p.objective}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* Down arrow connector */}
            <div className="flex justify-center">
              <span className="text-xs text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                ↓ Sustento Tecnológico y Salvaguardas
              </span>
            </div>

            {/* 3. Apoyo & 4. Control */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Procesos de Apoyo & Ciberseguridad
                  </h4>
                </div>
                {processes
                  .filter((p) => p.category === 'apoyo')
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenProcess360(p)}
                      className="p-4 bg-white border border-purple-200 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer transition-all border-l-4 border-l-purple-600"
                    >
                      <span className="text-xs font-bold text-purple-700">{p.code}</span>
                      <h5 className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</h5>
                      <p className="text-xs text-slate-500 mt-1">{p.objective}</p>
                    </div>
                  ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Procesos de Control, Evaluación & Auditoría
                  </h4>
                </div>
                {processes
                  .filter((p) => p.category === 'control')
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleOpenProcess360(p)}
                      className="p-4 bg-white border border-emerald-200 rounded-xl shadow-2xs hover:shadow-xs cursor-pointer transition-all border-l-4 border-l-emerald-600"
                    >
                      <span className="text-xs font-bold text-emerald-700">{p.code}</span>
                      <h5 className="text-sm font-bold text-slate-900 mt-0.5">{p.name}</h5>
                      <p className="text-xs text-slate-500 mt-1">{p.objective}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STAKEHOLDERS */}
      {activeTab === 'stakeholders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakeholders.map((stk) => (
              <div key={stk.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {stk.type} • {stk.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{stk.name}</h4>
                  </div>
                  <Badge variant="auto" statusText={stk.status}>
                    {stk.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Necesidades:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{stk.needs}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800">Expectativas:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{stk.expectations}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Responsable: <strong>{stk.owner.split('(')[0]}</strong></span>
                  <button
                    onClick={() => deleteStakeholder(stk.id)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    title="Eliminar stakeholder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ROLES DE GOBERNANZA */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {governanceRoles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <Badge variant="auto" statusText={role.status}>
                    {role.status}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{role.title}</h4>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{role.holderName}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p className="font-semibold text-slate-800">Nivel de Autoridad:</p>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {role.authorityLevel}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-800">Responsabilidades Clave:</p>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    {role.responsibilities.slice(0, 3).map((r, i) => (
                      <li key={i} className="line-clamp-2">
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: OBJECTIVES & INDICATORS */}
      {activeTab === 'objectives' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectives.map((obj) => {
              const relIndicators = indicators.filter((ind) => ind.objectiveId === obj.id);
              const progressPct = Math.min(100, Math.round((obj.currentValue / obj.target) * 100));

              return (
                <div key={obj.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {obj.code}
                    </span>
                    <Badge variant="auto" statusText={obj.status}>
                      {obj.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{obj.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{obj.description}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Línea Base: {obj.baseline} {obj.unit}</span>
                      <span className="font-bold text-slate-900">Meta: {obj.target} {obj.unit}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-teal-700">Actual: {obj.currentValue} {obj.unit}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-600 h-2 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                    <span>Líder: <strong>{obj.owner}</strong></span>
                    <span>{obj.frequency}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PROCESS 360 DRAWER */}
      {selectedProcess && (
        <Drawer
          isOpen={isProcessDrawerOpen}
          onClose={() => setProcessDrawerOpen(false)}
          title={`Proceso ${selectedProcess.code}: ${selectedProcess.name}`}
          subtitle={`Categoría: ${selectedProcess.category.toUpperCase()} • Líder: ${selectedProcess.owner}`}
          badge={
            <Badge variant="auto" statusText={selectedProcess.status}>
              {selectedProcess.status}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setProcessDrawerOpen(false)}>
              Cerrar Vista 360°
            </Button>
          }
        >
          <div className="space-y-6">
            {/* General Info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Objetivo & Alcance</h4>
              <p className="text-slate-700 leading-relaxed">{selectedProcess.objective}</p>
              <div className="pt-2 border-t border-slate-200 text-slate-600">
                <strong>Alcance:</strong> {selectedProcess.scope}
              </div>
            </div>

            {/* SIPOC Table (Inputs, Activities, Outputs, Clients, Suppliers) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Ficha SIPOC del Proceso
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-teal-700 block">Entradas (Inputs):</span>
                  <ul className="list-disc list-inside text-slate-600">
                    {selectedProcess.inputs.map((inp, i) => (
                      <li key={i}>{inp}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 block">Salidas (Outputs):</span>
                  <ul className="list-disc list-inside text-slate-600">
                    {selectedProcess.outputs.map((out, i) => (
                      <li key={i}>{out}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-800 block">Actividades Principales:</span>
                <ol className="list-decimal list-inside text-slate-600 space-y-1">
                  {selectedProcess.activities.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Related AI Systems */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-teal-600" />
                <span>Sistemas de IA Utilizados en este Proceso</span>
              </h4>
              {aiSystems.filter((s) => s.processId === selectedProcess.id).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay modelos de IA vinculados directamente.</p>
              ) : (
                <div className="space-y-2">
                  {aiSystems
                    .filter((s) => s.processId === selectedProcess.id)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{s.name}</span>
                          <span className="text-slate-500 block text-[11px]">{s.type} • {s.model}</span>
                        </div>
                        <Badge variant="auto" statusText={s.riskLevel}>
                          {s.riskLevel}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Related Risks */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Riesgos Asociados al Proceso</span>
              </h4>
              {risks.filter((r) => r.processId === selectedProcess.id).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay riesgos abiertos específicos para este proceso.</p>
              ) : (
                <div className="space-y-2">
                  {risks
                    .filter((r) => r.processId === selectedProcess.id)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div className="max-w-[300px]">
                          <span className="font-bold text-slate-900">{r.code}: {r.name}</span>
                        </div>
                        <Badge variant="auto" statusText={r.residualLevel}>
                          Residual: {r.residualLevel}
                        </Badge>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Drawer>
      )}

      {/* CREATE PROCESS MODAL */}
      <Modal
        isOpen={isProcessModalOpen}
        onClose={() => setProcessModalOpen(false)}
        title="Registrar Nuevo Proceso de Gobernanza"
        subtitle="Alta formal en el mapa de procesos y alcance ISO 42001 / ISO 27001"
      >
        <form onSubmit={handleCreateProcess} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Código de Proceso
              </label>
              <input
                type="text"
                required
                value={pCode}
                onChange={(e) => setPCode(e.target.value)}
                placeholder="Ej. MIS-03"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Categoría
              </label>
              <select
                value={pCategory}
                onChange={(e) => setPCategory(e.target.value as ProcessCategory)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="estratégico">Estratégico</option>
                <option value="misional">Misional</option>
                <option value="apoyo">Apoyo</option>
                <option value="control">Control</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Nombre del Proceso
            </label>
            <input
              type="text"
              required
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              placeholder="Ej. Validación Continua de Modelos LLM"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <textarea
              rows={2}
              value={pDesc}
              onChange={(e) => setPDesc(e.target.value)}
              placeholder="Resumen del proceso..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Líder / Propietario
              </label>
              <input
                type="text"
                value={pOwner}
                onChange={(e) => setPOwner(e.target.value)}
                placeholder="Ej. Ing. Mateo Rivas"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Criticidad
              </label>
              <select
                value={pCriticality}
                onChange={(e) => setPCriticality(e.target.value as any)}
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
            <Button type="button" variant="outline" onClick={() => setProcessModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Proceso
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE STAKEHOLDER MODAL */}
      <Modal
        isOpen={isStakeholderModalOpen}
        onClose={() => setStakeholderModalOpen(false)}
        title="Registrar Parte Interesada (Stakeholder)"
        subtitle="Requisito Cláusula 4.2 ISO 42001 & ISO 27001"
      >
        <form onSubmit={handleCreateStakeholder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Nombre de la Entidad o Colectivo
            </label>
            <input
              type="text"
              required
              value={stkName}
              onChange={(e) => setStkName(e.target.value)}
              placeholder="Ej. Comité de Protección al Consumidor"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Tipo
              </label>
              <select
                value={stkType}
                onChange={(e) => setStkType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Externo">Externo</option>
                <option value="Interno">Interno</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Categoría
              </label>
              <select
                value={stkCategory}
                onChange={(e) => setStkCategory(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Reguladores">Reguladores</option>
                <option value="Clientes">Clientes</option>
                <option value="Accionistas">Accionistas</option>
                <option value="Empleados">Empleados</option>
                <option value="Proveedores">Proveedores</option>
                <option value="Comunidad">Comunidad</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Necesidades Identificadas
            </label>
            <textarea
              rows={2}
              value={stkNeeds}
              onChange={(e) => setStkNeeds(e.target.value)}
              placeholder="¿Qué necesita este grupo de interés?"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Expectativas
            </label>
            <textarea
              rows={2}
              value={stkExpectations}
              onChange={(e) => setStkExpectations(e.target.value)}
              placeholder="¿Qué espera de nuestra gobernanza de IA?"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setStakeholderModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Stakeholder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
