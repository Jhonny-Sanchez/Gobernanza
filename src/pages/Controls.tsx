import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  FileCheck,
  Zap,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Progress } from '../components/ui/Progress';
import { Control, StandardType, ControlImplementationStatus } from '../types';

export const Controls: React.FC = () => {
  const {
    controls,
    updateControl,
    evidences,
    risks,
    requirements
  } = useStore();

  const [activeTab, setActiveTab] = useState('soa');
  const [searchTerm, setSearchTerm] = useState('');
  const [standardFilter, setStandardFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [maturityFilter, setMaturityFilter] = useState<string>('all');

  // Control 360 Drawer
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isControlDrawerOpen, setControlDrawerOpen] = useState(false);

  const tabs: TabItem[] = [
    { id: 'soa', label: 'SoA Integrada (Declaración de Aplicabilidad)', count: controls.length },
    { id: 'ai-controls', label: 'Controles Específicos IA (ISO 42001)' },
    { id: 'effectiveness', label: 'Evaluación de Efectividad' }
  ];

  const filteredControls = controls.filter((ctrl) => {
    const matchesSearch =
      ctrl.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ctrl.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard = standardFilter === 'all' || ctrl.standard === standardFilter;
    const matchesStatus = statusFilter === 'all' || ctrl.status === statusFilter;
    const matchesMaturity =
      maturityFilter === 'all' || ctrl.maturityLevel.toString() === maturityFilter;

    return matchesSearch && matchesStandard && matchesStatus && matchesMaturity;
  });

  const handleOpen360 = (ctrl: Control) => {
    setSelectedControl(ctrl);
    setControlDrawerOpen(true);
  };

  const handleUpdateEffectiveness = (val: number) => {
    if (!selectedControl) return;
    updateControl(selectedControl.id, { effectiveness: val });
    setSelectedControl({ ...selectedControl, effectiveness: val });
  };

  const handleUpdateMaturity = (val: number) => {
    if (!selectedControl) return;
    const maturity = Math.max(0, Math.min(5, Math.round(val))) as 0 | 1 | 2 | 3 | 4 | 5;
    updateControl(selectedControl.id, { maturityLevel: maturity });
    setSelectedControl({ ...selectedControl, maturityLevel: maturity });
  };

  // SoA Statistics
  const totalControls = controls.length;
  const applicableControls = controls.filter((c) => c.applicability ?? c.applicable).length;
  const implementedControls = controls.filter(
    (c) => c.status === 'Implementado' || c.status === 'Implementado y verificado'
  ).length;
  const avgEffectiveness = Math.round(
    controls.reduce((acc, c) => acc + c.effectiveness, 0) / (totalControls || 1)
  );

  const exportSoA = () => {
    const jsonStr = JSON.stringify(controls, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SoA_AIGobernanza360_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Controles & SoA Integrada
            </h1>
            <Badge variant="teal">SoA ISO 42001 & ISO 27001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Declaración de Aplicabilidad (Statement of Applicability), efectividad de salvaguardas y madurez CMMI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportSoA}
          >
            Exportar SoA (JSON)
          </Button>
        </div>
      </div>

      {/* SoA Quick Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Total de Controles</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{totalControls}</span>
          <span className="text-[11px] text-teal-700 font-semibold">Catálogo Unificado</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Aplicabilidad Declarada</span>
          <span className="text-xl font-bold text-teal-700 mt-1 block">
            {Math.round((applicableControls / totalControls) * 100)}%
          </span>
          <span className="text-[11px] text-slate-500">{applicableControls} de {totalControls} Aplican</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Implementados / Verificados</span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">
            {Math.round((implementedControls / totalControls) * 100)}%
          </span>
          <span className="text-[11px] text-slate-500">{implementedControls} controles operativos</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block">Efectividad Promedio</span>
          <span className="text-xl font-bold text-blue-700 mt-1 block">{avgEffectiveness}%</span>
          <span className="text-[11px] text-slate-500">Métricas de prueba vigentes</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: SOA INTEGRADA */}
      {activeTab === 'soa' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, nombre, dominio o responsable..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={standardFilter}
                onChange={(e) => setStandardFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todas las normas</option>
                <option value="ISO/IEC 42001">ISO/IEC 42001 (IA)</option>
                <option value="ISO/IEC 27001">ISO/IEC 27001 (Seguridad)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="Implementado y verificado">Implementado y verificado</option>
                <option value="Implementado">Implementado</option>
                <option value="Parcialmente implementado">Parcialmente implementado</option>
                <option value="Planificado">Planificado</option>
              </select>

              <select
                value={maturityFilter}
                onChange={(e) => setMaturityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Toda la madurez</option>
                <option value="5">Nivel 5 - Optimizado</option>
                <option value="4">Nivel 4 - Gestionado</option>
                <option value="3">Nivel 3 - Definido</option>
                <option value="2">Nivel 2 - Repetible</option>
                <option value="1">Nivel 1 - Inicial</option>
              </select>
            </div>
          </div>

          {/* Controls Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código & Norma</th>
                    <th className="py-3 px-4">Nombre del Control & Dominio</th>
                    <th className="py-3 px-4">Aplicable</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Madurez CMMI</th>
                    <th className="py-3 px-4">Efectividad</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredControls.map((ctrl) => (
                    <tr
                      key={ctrl.id}
                      onClick={() => handleOpen360(ctrl)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{ctrl.code}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">{ctrl.standard}</span>
                      </td>
                      <td className="py-3 px-4 max-w-[280px]">
                        <p className="font-semibold text-slate-900 leading-snug">{ctrl.name}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{ctrl.domain}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {(ctrl.applicability ?? ctrl.applicable) ? (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">
                            Sí Aplica
                          </span>
                        ) : (
                          <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            No Aplica
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="auto" statusText={ctrl.status}>
                          {ctrl.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800">Nivel {ctrl.maturityLevel} / 5</span>
                      </td>
                      <td className="py-3 px-4 w-28 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-teal-600 h-1.5 rounded-full"
                              style={{ width: `${ctrl.effectiveness}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-800">{ctrl.effectiveness}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ctrl.owner}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen360(ctrl)}>
                          Ficha 360°
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTROLES ESPECÍFICOS IA (ISO 42001) */}
      {activeTab === 'ai-controls' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">
              Controles Especializados del Anexo A de ISO/IEC 42001
            </h3>
            <p className="text-xs text-slate-500">
              Salvaguardas de gobernanza, transparencia, linaje de datos y supervisión continua de algoritmos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {controls
              .filter((c) => c.standard === 'ISO/IEC 42001')
              .map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {c.code}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{c.name}</h4>
                      <p className="text-xs text-slate-500">{c.domain}</p>
                    </div>
                    <Badge variant="auto" statusText={c.status}>
                      {c.status}
                    </Badge>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                    <strong className="block text-slate-900">Justificación de Aplicabilidad:</strong>
                    <p className="text-slate-600 leading-relaxed">{c.justification}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 block">Madurez CMMI:</span>
                      <strong className="text-slate-900">Nivel {c.maturityLevel} de 5</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200">
                      <span className="text-slate-500 block">Efectividad Evaluada:</span>
                      <strong className="text-teal-700">{c.effectiveness}%</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Líder: <strong>{c.owner}</strong></span>
                    <Button variant="ghost" size="sm" onClick={() => handleOpen360(c)}>
                      Ver Ficha 360° <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVALUACIÓN DE EFECTIVIDAD */}
      {activeTab === 'effectiveness' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600" />
              <span>Pruebas Periódicas de Efectividad de Controles</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluación basada en evidencias técnicas de auditoría para verificar la operatividad real de las defensas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {controls.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-bold text-teal-700">{c.code}</span>
                  <span className="text-xs font-bold text-slate-800">{c.effectiveness}% Efectivo</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{c.name}</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Método: {c.verificationMethod || 'Inspección técnica'}</span>
                    <span>Frecuencia: {c.frequency || 'Trimestral'}</span>
                  </div>
                  <Progress value={c.effectiveness} color="teal" size="sm" />
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                  <span>Última eval: {c.lastEvaluatedDate || c.lastReviewDate}</span>
                  <button
                    onClick={() => handleOpen360(c)}
                    className="text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Calibrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTROL 360 DRAWER */}
      {selectedControl && (
        <Drawer
          isOpen={isControlDrawerOpen}
          onClose={() => setControlDrawerOpen(false)}
          title={`Control ${selectedControl.code}: ${selectedControl.name}`}
          subtitle={`Estándar: ${selectedControl.standard} • Dominio: ${selectedControl.domain}`}
          badge={
            <Badge variant="auto" statusText={selectedControl.status}>
              {selectedControl.status}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setControlDrawerOpen(false)}>
              Cerrar Vista 360°
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Justificación de Aplicabilidad</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{selectedControl.justification}</p>
            </div>

            {/* Maturity & Effectiveness Calibration Sliders */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Calibración de Madurez CMMI & Efectividad
              </h4>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Nivel de Madurez (Escala CMMI 0 a 5)</span>
                    <span className="font-bold text-teal-700">Nivel {selectedControl.maturityLevel}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={1}
                    value={selectedControl.maturityLevel}
                    onChange={(e) => handleUpdateMaturity(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0: Inexistente</span>
                    <span>1: Inicial</span>
                    <span>2: Repetible</span>
                    <span>3: Definido</span>
                    <span>4: Gestionado</span>
                    <span>5: Optimizado</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Efectividad Operativa (%)</span>
                    <span className="font-bold text-teal-700">{selectedControl.effectiveness}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={selectedControl.effectiveness}
                    onChange={(e) => handleUpdateEffectiveness(Number(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Linked Evidences */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>Evidencias Documentales Vinculadas ({selectedControl.evidenceIds.length})</span>
              </h4>
              {selectedControl.evidenceIds.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No hay evidencias probatorias asignadas a este control.</p>
              ) : (
                <div className="space-y-2">
                  {selectedControl.evidenceIds.map((evId: string) => {
                    const ev = evidences.find((e) => e.id === evId);
                    return (
                      <div
                        key={evId}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <span className="font-bold text-slate-800">{ev?.code}: {ev?.title}</span>
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
    </div>
  );
};
