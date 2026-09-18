import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Search,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Risk, RiskLevel, RiskTreatment } from '../types';
import { getCellRiskLevel, getCellColor } from '../utils/calculations';

export const Risks: React.FC = () => {
  const {
    risks,
    addRisk,
    controls,
    aiSystems,
    processes
  } = useStore();

  const [activeTab, setActiveTab] = useState('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [matrixViewType, setMatrixViewType] = useState<'inherent' | 'residual'>('residual');

  // Matrix cell filter
  const [selectedMatrixCell, setSelectedMatrixCell] = useState<{ prob: number; imp: number } | null>(null);

  // Risk 360 Drawer
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isRiskDrawerOpen, setRiskDrawerOpen] = useState(false);

  // New Risk Modal
  const [isNewRiskModalOpen, setNewRiskModalOpen] = useState(false);
  const [rCode, setRCode] = useState('');
  const [rName, setRName] = useState('');
  const [rDesc, setRDesc] = useState('');
  const [rType, setRType] = useState<Risk['type']>('Gobernanza de IA');
  const [rProb, setRProb] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [rImp, setRImp] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [rTreatment, setRTreatment] = useState<RiskTreatment>('Mitigar');
  const [rOwner, setROwner] = useState('Jorge Hosato');
  const [rAISystemId, setRAISystemId] = useState('');

  const tabs: TabItem[] = [
    { id: 'matrix', label: 'Matriz de Riesgos 5x5' },
    { id: 'register', label: 'Registro de Riesgos', count: risks.length },
    { id: 'treatment', label: 'Planes de Tratamiento' },
    { id: 'ai-threats', label: 'Riesgos Específicos de IA' }
  ];

  const filteredRisks = risks.filter((r) => {
    const matchesSearch =
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || r.type === typeFilter;

    let matchesCell = true;
    if (selectedMatrixCell) {
      if (matrixViewType === 'residual') {
        matchesCell =
          r.residualProbability === selectedMatrixCell.prob &&
          r.residualImpact === selectedMatrixCell.imp;
      } else {
        matchesCell =
          r.probability === selectedMatrixCell.prob &&
          r.impact === selectedMatrixCell.imp;
      }
    }

    return matchesSearch && matchesType && matchesCell;
  });

  const handleOpen360 = (risk: Risk) => {
    setSelectedRisk(risk);
    setRiskDrawerOpen(true);
  };

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rCode || !rName) return;

    const inherentLevel = getCellRiskLevel(rProb, rImp);
    const residualProb = Math.max(1, rProb - 1) as 1 | 2 | 3 | 4 | 5;
    const residualImp = Math.max(1, rImp - 1) as 1 | 2 | 3 | 4 | 5;
    const residualLevel = getCellRiskLevel(residualProb, residualImp);

    addRisk({
      organizationId: 'org-nova-1',
      code: rCode,
      name: rName,
      type: rType,
      description: rDesc,
      probability: rProb,
      impact: rImp,
      inherentLevel,
      controlsApplied: ['ctrl-01'],
      owner: rOwner,
      treatment: rTreatment,
      residualProbability: residualProb,
      residualImpact: residualImp,
      residualLevel,
      status: 'En tratamiento',
      processId: 'proc-01',
      aiSystemId: rAISystemId || undefined
    });

    setRCode('');
    setRName('');
    setRDesc('');
    setNewRiskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión Integral de Riesgos (Risk Hub)
            </h1>
            <Badge variant="teal">ISO 31000 & ISO 42001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Matriz de calor interactiva 5x5, análisis de riesgo inherente vs. residual y taxonomía de amenazas específicas de IA.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setNewRiskModalOpen(true)}
        >
          Nuevo Riesgo
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: MATRIZ 5x5 */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* View toggle */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Visualización de Matriz de Calor ({matrixViewType === 'residual' ? 'Riesgo Residual con Controles' : 'Riesgo Inherente Puro'})
              </h3>
              <p className="text-xs text-slate-500">
                Haz click en cualquier celda para filtrar los riesgos ubicados en esa coordenada.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => {
                  setMatrixViewType('residual');
                  setSelectedMatrixCell(null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  matrixViewType === 'residual'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Riesgo Residual (Actual)
              </button>
              <button
                onClick={() => {
                  setMatrixViewType('inherent');
                  setSelectedMatrixCell(null);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  matrixViewType === 'inherent'
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Riesgo Inherente
              </button>
            </div>
          </div>

          {/* 5x5 Heatmap Matrix Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
            <div className="min-w-[580px] max-w-3xl mx-auto">
              <div className="grid grid-cols-6 gap-2">
                <div className="h-12 flex items-center justify-center text-xs font-bold text-slate-400">
                  P \ I
                </div>
                {['1 Insignificante', '2 Menor', '3 Moderado', '4 Mayor', '5 Catastrófico'].map((lbl, idx) => (
                  <div key={idx} className="h-12 flex items-center justify-center text-center text-xs font-bold text-slate-600 px-1 leading-tight">
                    {lbl}
                  </div>
                ))}

                {[5, 4, 3, 2, 1].map((prob) => {
                  const probLabels: Record<number, string> = {
                    5: '5 Muy Alta',
                    4: '4 Alta',
                    3: '3 Media',
                    2: '2 Baja',
                    1: '1 Muy Baja'
                  };

                  return (
                    <React.Fragment key={prob}>
                      <div className="flex items-center justify-end pr-2 text-xs font-bold text-slate-600">
                        {probLabels[prob]}
                      </div>

                      {[1, 2, 3, 4, 5].map((imp) => {
                        const cellRisks = risks.filter((r) => {
                          if (matrixViewType === 'residual') {
                            return r.residualProbability === prob && r.residualImpact === imp;
                          }
                          return r.probability === prob && r.impact === imp;
                        });
                        const count = cellRisks.length;
                        const level = getCellRiskLevel(prob, imp);
                        const isSelected =
                          selectedMatrixCell?.prob === prob && selectedMatrixCell?.imp === imp;

                        return (
                          <div
                            key={`${prob}-${imp}`}
                            onClick={() =>
                              setSelectedMatrixCell(isSelected ? null : { prob, imp })
                            }
                            className={`h-16 rounded-xl border flex flex-col items-center justify-center p-2 cursor-pointer transition-all ${getCellColor(
                              level
                            )} ${
                              isSelected
                                ? 'ring-3 ring-teal-600 ring-offset-2 scale-102 shadow-md'
                                : 'hover:scale-101'
                            }`}
                          >
                            <span className="text-base font-extrabold">{count}</span>
                            <span className="text-[10px] font-semibold opacity-75">
                              P:{prob} × I:{imp}
                            </span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Legend bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-semibold text-teal-800">
                    <span className="w-3 h-3 rounded bg-teal-200 border border-teal-400" /> Bajo (1-4)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-blue-800">
                    <span className="w-3 h-3 rounded bg-blue-200 border border-blue-400" /> Medio (5-9)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-amber-800">
                    <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400" /> Alto (10-15)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-red-800">
                    <span className="w-3 h-3 rounded bg-red-200 border border-red-400" /> Crítico (16-25)
                  </span>
                </div>

                {selectedMatrixCell && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMatrixCell(null)}
                  >
                    Limpiar Filtro
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Risks list */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                {selectedMatrixCell
                  ? `Riesgos en Coordenada P:${selectedMatrixCell.prob} × I:${selectedMatrixCell.imp} (${filteredRisks.length})`
                  : `Todos los Riesgos Registrados (${filteredRisks.length})`}
              </h4>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredRisks.map((risk) => (
                <div
                  key={risk.id}
                  onClick={() => handleOpen360(risk)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{risk.code}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{risk.type}</span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 leading-snug">{risk.name}</h5>
                    <p className="text-xs text-slate-500 line-clamp-1">{risk.description}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[10px]">Inherente ➔ Residual</span>
                      <span className="font-bold text-slate-700">
                        {risk.probability * risk.impact} ➔{' '}
                        <strong className="text-teal-700">
                          {risk.residualProbability * risk.residualImpact}
                        </strong>
                      </span>
                    </div>
                    <Badge variant="auto" statusText={risk.residualLevel}>
                      {risk.residualLevel}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, nombre o responsable..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Todos los tipos</option>
              <option value="Gobernanza de IA">Gobernanza de IA</option>
              <option value="Seguridad de Información">Seguridad de Información</option>
              <option value="Privacidad">Privacidad</option>
              <option value="Legal y Regulatorio">Legal y Regulatorio</option>
              <option value="Operativo">Operativo</option>
              <option value="Ético">Ético</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Riesgo & Amenaza</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Inherente</th>
                    <th className="py-3 px-4">Residual</th>
                    <th className="py-3 px-4">Tratamiento</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRisks.map((risk) => (
                    <tr
                      key={risk.id}
                      onClick={() => handleOpen360(risk)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{risk.code}</td>
                      <td className="py-3 px-4 max-w-[280px]">
                        <p className="font-semibold text-slate-900 leading-snug">{risk.name}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{risk.type}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="auto" statusText={risk.inherentLevel}>
                          {risk.inherentLevel} ({risk.probability * risk.impact})
                        </Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="auto" statusText={risk.residualLevel}>
                          {risk.residualLevel} ({risk.residualProbability * risk.residualImpact})
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {risk.treatment}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{risk.owner}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Badge variant="auto" statusText={risk.status}>
                          {risk.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TREATMENT */}
      {activeTab === 'treatment' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((r) => {
            const relControls = controls.filter((c) => r.controlsApplied.includes(c.id) || r.controlsApplied.includes(c.code));
            return (
              <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {r.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{r.name}</h4>
                  </div>
                  <Badge variant="auto" statusText={r.treatment}>
                    {r.treatment}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Riesgo Inherente: <strong>{r.inherentLevel} ({r.probability * r.impact})</strong>
                    </span>
                    <span>
                      Riesgo Residual:{' '}
                      <strong className="text-teal-700">
                        {r.residualLevel} ({r.residualProbability * r.residualImpact})
                      </strong>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200">
                    <span>Responsable: <strong>{r.owner}</strong></span>
                    <span>Estado: <strong>{r.status}</strong></span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 block">Controles de Mitigación:</span>
                  {relControls.length === 0 ? (
                    <p className="text-slate-400 italic">No tiene controles asociados registrados.</p>
                  ) : (
                    <div className="space-y-1">
                      {relControls.map((c) => (
                        <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                          <span className="font-semibold text-slate-800">{c.code}: {c.name}</span>
                          <span className="text-teal-700 font-bold">{c.effectiveness}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: RIESGOS ESPECÍFICOS DE IA */}
      {activeTab === 'ai-threats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-red-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Prompt Injection / Jailbreak</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inyección de directivas en lenguaje natural que eluden las instrucciones del sistema en el LLM para forzar divulgación de secretos.
              </p>
              <div className="p-2.5 bg-red-50 rounded-lg text-xs text-red-800 font-medium">
                Controles: Sanitización de inputs, Llama-Guard, delimitadores XML y separación de contexto.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-amber-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Fuga de Datos Sensibles / DLP en RAG</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exposición de datos PII o secretos comerciales en las respuestas generadas por los modelos de lenguaje.
              </p>
              <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 font-medium">
                Controles: Anonimización previa al indexado y control de acceso RBAC a la base vectorial.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-yellow-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-yellow-700 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Alucinación & Respuestas Falsas</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generación de información incorrecta o ficticia con alta confianza por parte del modelo en decisiones críticas.
              </p>
              <div className="p-2.5 bg-yellow-50 rounded-lg text-xs text-yellow-800 font-medium">
                Controles: Grounding estricto con fuentes verificadas y supervisión humana periódica.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RISK 360 DRAWER */}
      {selectedRisk && (
        <Drawer
          isOpen={isRiskDrawerOpen}
          onClose={() => setRiskDrawerOpen(false)}
          title={`Riesgo ${selectedRisk.code}: ${selectedRisk.name}`}
          subtitle={`Tipo: ${selectedRisk.type} • Responsable: ${selectedRisk.owner}`}
          badge={
            <Badge variant="auto" statusText={selectedRisk.residualLevel}>
              Residual: {selectedRisk.residualLevel}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setRiskDrawerOpen(false)}>
              Cerrar Vista 360°
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Descripción de la Amenaza</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{selectedRisk.description}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Comparativa: Riesgo Inherente vs. Residual
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-red-900 block">Riesgo Inherente</span>
                  <p className="text-slate-700">Probabilidad: <strong>{selectedRisk.probability}/5</strong></p>
                  <p className="text-slate-700">Impacto: <strong>{selectedRisk.impact}/5</strong></p>
                  <div className="pt-1 font-bold text-red-800">
                    Puntaje: {selectedRisk.probability * selectedRisk.impact} ({selectedRisk.inherentLevel})
                  </div>
                </div>

                <div className="p-3 bg-teal-50/60 border border-teal-200 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-teal-900 block">Riesgo Residual (Mitigado)</span>
                  <p className="text-slate-700">Probabilidad: <strong>{selectedRisk.residualProbability}/5</strong></p>
                  <p className="text-slate-700">Impacto: <strong>{selectedRisk.residualImpact}/5</strong></p>
                  <div className="pt-1 font-bold text-teal-800">
                    Puntaje: {selectedRisk.residualProbability * selectedRisk.residualImpact} ({selectedRisk.residualLevel})
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Controles Implementados ({selectedRisk.controlsApplied.length})</span>
              </h4>
              {selectedRisk.controlsApplied.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No tiene controles asociados registrados.</p>
              ) : (
                <div className="space-y-2">
                  {selectedRisk.controlsApplied.map((cCode) => {
                    const c = controls.find((ctrl) => ctrl.id === cCode || ctrl.code === cCode);
                    return (
                      <div
                        key={cCode}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{c?.code || cCode}</span>
                          <span className="text-slate-600 block text-[11px] mt-0.5">{c?.name || 'Control mitigador'}</span>
                        </div>
                        <Badge variant="auto" statusText={c?.implementationStatus || 'Implementado'}>
                          {c?.implementationStatus || 'Implementado'}
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

      {/* CREATE RISK MODAL */}
      <Modal
        isOpen={isNewRiskModalOpen}
        onClose={() => setNewRiskModalOpen(false)}
        title="Registrar Nuevo Riesgo de IA / Seguridad"
        subtitle="Evaluación según metodología ISO 31000 & ISO 42001"
      >
        <form onSubmit={handleCreateRisk} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Código de Riesgo
              </label>
              <input
                type="text"
                required
                value={rCode}
                onChange={(e) => setRCode(e.target.value)}
                placeholder="Ej. RSK-IA-04"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Tipo
              </label>
              <select
                value={rType}
                onChange={(e) => setRType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Gobernanza de IA">Gobernanza de IA</option>
                <option value="Seguridad de Información">Seguridad de Información</option>
                <option value="Privacidad">Privacidad</option>
                <option value="Legal y Regulatorio">Legal y Regulatorio</option>
                <option value="Operativo">Operativo</option>
                <option value="Ético">Ético</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Nombre de la Amenaza / Riesgo
            </label>
            <input
              type="text"
              required
              value={rName}
              onChange={(e) => setRName(e.target.value)}
              placeholder="Ej. Exposición de PII por recuperación no filtrada en base vectorial"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Descripción del Evento y Consecuencias
            </label>
            <textarea
              rows={2}
              value={rDesc}
              onChange={(e) => setRDesc(e.target.value)}
              placeholder="Detalle de causas, vectores de ataque y consecuencias..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Probabilidad Inherente (1 a 5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={rProb}
                onChange={(e) => setRProb(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Impacto Inherente (1 a 5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={rImp}
                onChange={(e) => setRImp(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Estrategia de Tratamiento
              </label>
              <select
                value={rTreatment}
                onChange={(e) => setRTreatment(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Mitigar">Mitigar</option>
                <option value="Aceptar">Aceptar</option>
                <option value="Transferir">Transferir</option>
                <option value="Evitar">Evitar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Sistema IA Afectado (Opcional)
              </label>
              <select
                value={rAISystemId}
                onChange={(e) => setRAISystemId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="">Ninguno / General</option>
                {aiSystems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setNewRiskModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Registrar Riesgo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
