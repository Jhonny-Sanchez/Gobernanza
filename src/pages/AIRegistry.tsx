import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Layers,
  Activity,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Eye,
  AlertTriangle,
  Zap,
  Network
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Progress } from '../components/ui/Progress';
import { AISystem, AIRiskLevel, AISystemType } from '../types';

export const AIRegistry: React.FC = () => {
  const {
    aiSystems,
    addAISystem,
    updateAISystem,
    risks,
    controls,
    processes,
    impactAssessments
  } = useStore();

  const [activeTab, setActiveTab] = useState('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [envFilter, setEnvFilter] = useState<string>('all');

  // AI 360 Drawer State
  const [selectedAI, setSelectedAI] = useState<AISystem | null>(null);
  const [isAIDrawerOpen, setAIDrawerOpen] = useState(false);

  // New AI Modal State
  const [isNewAIModalOpen, setNewAIModalOpen] = useState(false);
  const [aiName, setAiName] = useState('');
  const [aiCode, setAiCode] = useState('');
  const [aiType, setAiType] = useState<AISystemType>('Generativo (LLM)');
  const [aiUseCase, setAiUseCase] = useState('');
  const [aiProcessId, setAiProcessId] = useState('prc-02');
  const [aiRiskLevel, setAiRiskLevel] = useState<AIRiskLevel>('Alto');
  const [aiModel, setAiModel] = useState('Gemini 1.5 Pro');
  const [aiProvider, setAiProvider] = useState('Google Cloud Vertex AI');
  const [aiEnvironment, setAiEnvironment] = useState<'Desarrollo' | 'Pruebas' | 'Producción'>('Producción');
  const [aiTechOwner, setAiTechOwner] = useState('Jorge Hosato');
  const [aiBusinessOwner, setAiBusinessOwner] = useState('Dirección de Operaciones');
  const [aiHumanOversight, setAiHumanOversight] = useState<'Human-in-the-loop' | 'Human-on-the-loop' | 'Human-out-of-the-loop'>('Human-in-the-loop');

  const tabs: TabItem[] = [
    { id: 'catalog', label: 'Catálogo de Sistemas IA', count: aiSystems.length },
    { id: 'impact', label: 'Evaluaciones de Impacto (FRIA)', count: impactAssessments.length },
    { id: 'components', label: 'Model Cards & Arquitectura' },
    { id: 'network', label: 'Mapa Relacional' },
    { id: 'shadow', label: 'Shadow AI & Detección' }
  ];

  const filteredSystems = aiSystems.filter((sys) => {
    const matchesSearch =
      sys.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sys.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || sys.riskLevel === riskFilter;
    const matchesType = typeFilter === 'all' || sys.type === typeFilter;
    const matchesEnv = envFilter === 'all' || sys.environment === envFilter;
    return matchesSearch && matchesRisk && matchesType && matchesEnv;
  });

  const handleOpen360 = (sys: AISystem) => {
    setSelectedAI(sys);
    setAIDrawerOpen(true);
  };

  const handleCreateAISystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiName || !aiCode) return;

    addAISystem({
      organizationId: 'org-nova-1',
      code: aiCode,
      name: aiName,
      type: aiType,
      useCase: aiUseCase,
      processId: aiProcessId,
      riskLevel: aiRiskLevel,
      model: aiModel,
      provider: aiProvider,
      environment: aiEnvironment,
      governanceStatus: 'En evaluación',
      deploymentDate: new Date().toISOString().slice(0, 10),
      technicalOwner: aiTechOwner,
      businessOwner: aiBusinessOwner,
      ethicalImpact: aiRiskLevel === 'Alto' ? 'Alto' : 'Medio',
      humanOversight: aiHumanOversight,
      architecture: 'Microservicios con API Gateway y Guardrails de LLM',
      dataLineage: ['PostgreSQL Database', 'Datashare anonymized tables'],
      friaCompleted: false
    });

    setAiName('');
    setAiCode('');
    setAiUseCase('');
    setNewAIModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Registry & Inventario Algorítmico
            </h1>
            <Badge variant="teal">EU AI Act & ISO 42001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Catálogo unificado de modelos, clasificación por nivel de riesgo, supervisión humana y evaluaciones de impacto ético.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setNewAIModalOpen(true)}
        >
          Registrar Sistema IA
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, código, modelo base o proveedor..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los riesgos</option>
                <option value="Inaceptable">Inaceptable (Prohibido)</option>
                <option value="Alto">Alto Riesgo (Anexo III)</option>
                <option value="Limitado">Riesgo Limitado</option>
                <option value="Mínimo">Riesgo Mínimo</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los tipos</option>
                <option value="Predictivo">Predictivo</option>
                <option value="Generativo (LLM)">Generativo (LLM)</option>
                <option value="Visión por Computador">Visión por Computador</option>
                <option value="Audio / Voz">Audio / Voz</option>
                <option value="Recomendación">Recomendación</option>
              </select>

              <select
                value={envFilter}
                onChange={(e) => setEnvFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los entornos</option>
                <option value="Producción">Producción</option>
                <option value="Pruebas">Pruebas / Staging</option>
                <option value="Desarrollo">Desarrollo</option>
              </select>
            </div>
          </div>

          {/* AI Systems Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSystems.map((sys) => {
              const relRisks = risks.filter((r) => r.aiSystemId === sys.id);
              const proc = processes.find((p) => p.id === sys.processId);

              return (
                <div
                  key={sys.id}
                  onClick={() => handleOpen360(sys)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-xs p-5 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {sys.code}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {sys.environment}
                        </span>
                      </div>
                      <Badge variant="auto" statusText={sys.riskLevel}>
                        {sys.riskLevel === 'Alto' ? 'Alto Riesgo' : sys.riskLevel}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-teal-700 transition-colors">
                        {sys.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {sys.useCase}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Modelo Base:</span>
                        <span className="font-semibold text-slate-800">{sys.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Proveedor:</span>
                        <span className="text-slate-700 truncate max-w-[140px] text-right">{sys.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Supervisión:</span>
                        <span className="text-slate-700 font-medium">{sys.humanOversight}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-slate-500">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        {relRisks.length} Riesgos
                      </span>
                      {sys.friaCompleted ? (
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          FRIA OK
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          FRIA Pendiente
                        </span>
                      )}
                    </div>

                    <span className="text-teal-700 font-bold flex items-center gap-1">
                      Ficha 360° <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: FRIA & EVALUACIONES DE IMPACTO */}
      {activeTab === 'impact' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">Evaluaciones de Impacto en Derechos Fundamentales (FRIA)</h3>
            <p className="text-xs text-slate-500">
              Cumplimiento obligatorio para sistemas de Alto Riesgo bajo el Artículo 27 del EU AI Act e ISO/IEC 42001 Cláusula 6.1.2.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactAssessments.map((fria) => {
              const sys = aiSystems.find((s) => s.id === fria.aiSystemId);
              return (
                <div key={fria.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {sys?.code || 'SYS-IA'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{fria.title}</h4>
                      <p className="text-xs text-slate-500">{sys?.name}</p>
                    </div>
                    <Badge variant="auto" statusText={fria.status}>
                      {fria.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <strong className="text-slate-800 block mb-1">Impactos Identificados:</strong>
                      <p className="text-slate-600 leading-relaxed">{fria.impactSummary}</p>
                    </div>

                    <div className="p-3 bg-teal-50/50 rounded-lg border border-teal-100">
                      <strong className="text-teal-900 block mb-1">Salvaguardas Exigidas:</strong>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {(Array.isArray(fria.mitigationMeasures) ? fria.mitigationMeasures : [fria.mitigationMeasures]).map((m: string, i: number) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Evaluador: <strong>{(fria as any).evaluator || fria.responsible}</strong></span>
                    <span>Fecha: {fria.date || fria.evaluationDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MODEL CARDS */}
      {activeTab === 'components' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiSystems.map((sys) => (
              <div key={sys.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Model Card</span>
                    <h4 className="text-base font-bold text-slate-900">{sys.name}</h4>
                  </div>
                  <Badge variant="auto" statusText={sys.type}>
                    {sys.type}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Arquitectura:</strong>
                    <p className="text-slate-600">{sys.architecture || sys.model || 'Arquitectura Neuronal Transformer'}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800">Linaje de Datos & Fuentes:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(sys.dataLineage || ['Data Warehouse Corporativo', 'Logs de Inferencia']).map((src: string, i: number) => (
                        <span key={i} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong className="text-slate-800">Mecanismo de Supervisión:</strong>
                    <p className="text-slate-600">{sys.humanOversight || sys.humanSupervisionLevel || 'Supervisión HITL'} con parada de emergencia manual.</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleOpen360(sys)}>
                    Ver Model Card Completo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MAPA RELACIONAL */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-teal-600" />
              <span>Grafo de Relaciones: Modelos, Procesos y Riesgos</span>
            </h3>
            <p className="text-xs text-slate-500">
              Visualización de interconexión entre sistemas de Inteligencia Artificial, procesos de negocio receptores y salvaguardas normativas.
            </p>
          </div>

          <div className="space-y-4">
            {aiSystems.map((sys) => {
              const proc = processes.find((p) => p.id === sys.processId);
              const relRisks = risks.filter((r) => r.aiSystemId === sys.id);

              return (
                <div key={sys.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Source AI */}
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg min-w-[200px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                        Sistema IA
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{sys.name}</h4>
                      <p className="text-xs text-slate-500">{sys.model} • {sys.provider}</p>
                    </div>

                    <div className="text-slate-400 font-bold text-center">
                      <span className="hidden md:inline">──────▶</span>
                      <span className="md:hidden">▼</span>
                    </div>

                    {/* Target Process */}
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg min-w-[200px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                        Proceso Negocio Receptor
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{proc?.name || 'Proceso Core'}</h4>
                      <p className="text-xs text-slate-500">{proc?.code} • {proc?.category}</p>
                    </div>

                    <div className="text-slate-400 font-bold text-center">
                      <span className="hidden md:inline">──────▶</span>
                      <span className="md:hidden">▼</span>
                    </div>

                    {/* Mitigated Risks */}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg min-w-[220px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                        Riesgos Monitoreados ({relRisks.length})
                      </span>
                      {relRisks.slice(0, 2).map((r) => (
                        <p key={r.id} className="text-xs text-slate-700 truncate">
                          • {r.code}: {r.name}
                        </p>
                      ))}
                      {relRisks.length === 0 && (
                        <p className="text-xs text-slate-400 italic">Sin riesgos críticos reportados</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SHADOW AI */}
      {activeTab === 'shadow' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Detección de Shadow AI en la Red Corporativa</span>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              Monitoreo continuo de tráfico DNS y extensiones en navegadores para detectar herramientas de IA generativa no autorizadas que puedan fugar datos corporativos.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Herramienta Detectada</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Peticiones (7d)</th>
                  <th className="py-3 px-4">Usuarios Activos</th>
                  <th className="py-3 px-4">Riesgo DLP</th>
                  <th className="py-3 px-4 text-right">Estado / Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">ChatGPT (Cuentas Personales Web)</td>
                  <td className="py-3 px-4 text-slate-600">LLM Público</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">1,420 requests</td>
                  <td className="py-3 px-4 text-slate-600">18 empleados</td>
                  <td className="py-3 px-4">
                    <Badge variant="auto" statusText="Crítica">Alto (Sin Guardrails)</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-xs font-semibold">
                      Redirigir a Portal Corporativo
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Perplexity.ai Web</td>
                  <td className="py-3 px-4 text-slate-600">Búsqueda Aumentada</td>
                  <td className="py-3 px-4 text-slate-800 font-semibold">340 requests</td>
                  <td className="py-3 px-4 text-slate-600">6 empleados</td>
                  <td className="py-3 px-4">
                    <Badge variant="auto" statusText="Media">Medio</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold">
                      En Evaluación de Seguridad
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI SYSTEM 360 DRAWER */}
      {selectedAI && (
        <Drawer
          isOpen={isAIDrawerOpen}
          onClose={() => setAIDrawerOpen(false)}
          title={`Ficha 360°: ${selectedAI.name}`}
          subtitle={`Código: ${selectedAI.code} • Proveedor: ${selectedAI.provider}`}
          badge={
            <Badge variant="auto" statusText={selectedAI.riskLevel}>
              {selectedAI.riskLevel === 'Alto' ? 'Alto Riesgo (Anexo III)' : selectedAI.riskLevel}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setAIDrawerOpen(false)}>
              Cerrar Vista 360°
            </Button>
          }
        >
          <div className="space-y-6">
            {/* General info */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Caso de Uso & Propósito Previsto</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{selectedAI.useCase || selectedAI.purpose || selectedAI.intendedUse}</p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block font-medium">Líder Técnico:</span>
                  <span className="font-bold text-slate-800">{selectedAI.technicalOwner}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Líder de Negocio:</span>
                  <span className="font-bold text-slate-800">{selectedAI.businessOwner}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Entorno:</span>
                  <span className="font-bold text-slate-800">{selectedAI.environment || selectedAI.deploymentEnvironment}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fecha de Despliegue:</span>
                  <span className="font-bold text-slate-800">{selectedAI.deploymentDate || selectedAI.firstUseDate}</span>
                </div>
              </div>
            </div>

            {/* Model Card & Safeguards */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Especificaciones de Arquitectura & Guardrails
              </h4>
              <div className="space-y-2 text-xs text-slate-700">
                <p>
                  <strong>Modelo Base:</strong> {selectedAI.model} ({selectedAI.provider})
                </p>
                <p>
                  <strong>Supervisión Humana:</strong> {selectedAI.humanOversight || selectedAI.humanSupervisionLevel || 'Supervisión Continua HITL'}
                </p>
                <p>
                  <strong>Arquitectura Técnica:</strong> {selectedAI.architecture || selectedAI.model}
                </p>
                <div>
                  <strong>Linaje de Datos de Entrenamiento/Inferencia:</strong>
                  <ul className="list-disc list-inside text-slate-600 mt-1">
                    {(selectedAI.dataLineage || ['Datasets de producción validados y anonimizados']).map((dl: string, i: number) => (
                      <li key={i}>{dl}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Associated Risks */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Riesgos Asociados a este Sistema IA</span>
              </h4>
              {risks.filter((r) => r.aiSystemId === selectedAI.id).length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay riesgos específicos vinculados a este modelo.</p>
              ) : (
                <div className="space-y-2">
                  {risks
                    .filter((r) => r.aiSystemId === selectedAI.id)
                    .map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{r.code}: {r.name}</span>
                          <span className="text-slate-500 block text-[11px] mt-0.5">{r.category}</span>
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

      {/* CREATE AI SYSTEM MODAL */}
      <Modal
        isOpen={isNewAIModalOpen}
        onClose={() => setNewAIModalOpen(false)}
        title="Registrar Nuevo Sistema de Inteligencia Artificial"
        subtitle="Catalogación formal para cumplimiento ISO/IEC 42001 & EU AI Act"
        size="lg"
      >
        <form onSubmit={handleCreateAISystem} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Código del Sistema
              </label>
              <input
                type="text"
                required
                value={aiCode}
                onChange={(e) => setAiCode(e.target.value)}
                placeholder="Ej. IA-SYS-04"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Nivel de Riesgo (EU AI Act)
              </label>
              <select
                value={aiRiskLevel}
                onChange={(e) => setAiRiskLevel(e.target.value as AIRiskLevel)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Inaceptable">Inaceptable (Prohibido)</option>
                <option value="Alto">Alto Riesgo (Anexo III)</option>
                <option value="Limitado">Riesgo Limitado</option>
                <option value="Mínimo">Riesgo Mínimo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Nombre Comercial / Técnico del Sistema
            </label>
            <input
              type="text"
              required
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              placeholder="Ej. Asistente RAG de Análisis de Fraude"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Tipo de Sistema IA
              </label>
              <select
                value={aiType}
                onChange={(e) => setAiType(e.target.value as AISystemType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Generativo (LLM)">Generativo (LLM)</option>
                <option value="Predictivo">Predictivo</option>
                <option value="Visión por Computador">Visión por Computador</option>
                <option value="Audio / Voz">Audio / Voz</option>
                <option value="Recomendación">Recomendación</option>
                <option value="Autónomo">Autónomo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Proceso Asociado
              </label>
              <select
                value={aiProcessId}
                onChange={(e) => setAiProcessId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                {processes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Caso de Uso y Alcance Previsto
            </label>
            <textarea
              rows={2}
              value={aiUseCase}
              onChange={(e) => setAiUseCase(e.target.value)}
              placeholder="Describa el objetivo operativo y destinatarios del sistema..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Modelo Base
              </label>
              <input
                type="text"
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                placeholder="Ej. Gemini 1.5 Flash / GPT-4o"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Proveedor / Infraestructura
              </label>
              <input
                type="text"
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                placeholder="Ej. Google Cloud Platform"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setNewAIModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Registrar Sistema
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
