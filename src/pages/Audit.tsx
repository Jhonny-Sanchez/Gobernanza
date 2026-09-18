import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  TrendingUp,
  Award
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Progress } from '../components/ui/Progress';
import { AuditProgram, AuditFinding, FindingType, FindingStatus } from '../types';

export const Audit: React.FC = () => {
  const {
    auditPrograms,
    addAuditProgram,
    auditFindings,
    addAuditFinding,
    updateAuditFinding,
    requirements
  } = useStore();

  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Finding 360 Drawer
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [isFindingDrawerOpen, setFindingDrawerOpen] = useState(false);

  // New Finding Modal
  const [isNewFindingModalOpen, setNewFindingModalOpen] = useState(false);
  const [fCode, setFCode] = useState('');
  const [fTitle, setFTitle] = useState('');
  const [fDesc, setFDesc] = useState('');
  const [fType, setFType] = useState<FindingType>('No conformidad Menor');
  const [fClause, setFClause] = useState('ISO/IEC 42001 - 6.1.2');
  const [fRootCause, setFRootCause] = useState('');
  const [fAction, setFAction] = useState('');
  const [fOwner, setFOwner] = useState('Jorge Hosato');
  const [fDueDate, setFDueDate] = useState('2026-11-20');

  const tabs: TabItem[] = [
    { id: 'programs', label: 'Programas de Auditoría', count: auditPrograms.length },
    { id: 'findings', label: 'Hallazgos & No Conformidades', count: auditFindings.length },
    { id: 'capa', label: 'Planes CAPA' },
    { id: 'checklist', label: 'Checklist de Verificación' },
    { id: 'readiness', label: 'Audit Readiness' }
  ];

  const filteredFindings = auditFindings.filter((f: AuditFinding) => {
    const matchesSearch =
      f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.owner || f.responsible || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || f.type === severityFilter;
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleOpen360 = (f: AuditFinding) => {
    setSelectedFinding(f);
    setFindingDrawerOpen(true);
  };

  const handleCreateFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fCode || !fTitle) return;

    addAuditFinding({
      auditId: 'audit-01',
      code: fCode,
      title: fTitle,
      type: fType,
      standard: 'ISO/IEC 42001',
      clauseRef: fClause,
      clause: fClause,
      description: fDesc,
      evidenceRef: 'EV-01',
      rootCause: fRootCause || 'Falta de procedimiento operativo formalizado.',
      correctiveAction: fAction || 'Actualizar manual e impartir capacitación a los operadores.',
      responsible: fOwner,
      owner: fOwner,
      dueDate: fDueDate,
      targetClosureDate: fDueDate,
      identifiedDate: new Date().toISOString().slice(0, 10),
      status: 'Plan de acción'
    });

    setFCode('');
    setFTitle('');
    setFDesc('');
    setNewFindingModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión de Auditoría & Conformidad (Audit Hub)
            </h1>
            <Badge variant="teal">ISO 19011 & ISO 42001</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Programas de auditoría interna y externa, no conformidades, análisis de causa raíz y planes CAPA.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setNewFindingModalOpen(true)}
        >
          Registrar Hallazgo / NC
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: PROGRAMAS DE AUDITORÍA */}
      {activeTab === 'programs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditPrograms.map((prog) => (
              <div key={prog.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {prog.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{prog.title}</h3>
                    <p className="text-xs text-slate-500">{prog.type}</p>
                  </div>
                  <Badge variant="auto" statusText={prog.status}>
                    {prog.status}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p><strong>Alcance Normativo:</strong> {(prog.standards || [prog.standard]).join(' + ')}</p>
                  <p><strong>Auditor Líder:</strong> {prog.leadAuditor}</p>
                  <p><strong>Período:</strong> {prog.startDate} al {prog.endDate}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-500">
                    Equipo: <strong>{(prog.teamMembers || [prog.leadAuditor]).join(', ')}</strong>
                  </span>
                  <span className="text-teal-700 font-bold flex items-center gap-1">
                    Ver Plan de Auditoría <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HALLAZGOS & NO CONFORMIDADES */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, título o responsable..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todas las gravedades</option>
                <option value="No conformidad Mayor">No conformidad Mayor</option>
                <option value="No conformidad Menor">No conformidad Menor</option>
                <option value="Observación">Observación</option>
                <option value="Oportunidad de mejora">Oportunidad de mejora</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="Abierto">Abierto</option>
                <option value="En tratamiento">En tratamiento</option>
                <option value="Implementado">Implementado</option>
                <option value="Cerrado y verificado">Cerrado y verificado</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código</th>
                    <th className="py-3 px-4">Hallazgo & Descripción</th>
                    <th className="py-3 px-4">Clasificación</th>
                    <th className="py-3 px-4">Cláusula / Requisito</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4">Fecha Límite</th>
                    <th className="py-3 px-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFindings.map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => handleOpen360(f)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">{f.code}</td>
                      <td className="py-3 px-4 max-w-[300px]">
                        <p className="font-semibold text-slate-900 leading-snug">{f.title}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{f.description}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="auto" statusText={f.type}>
                          {f.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{f.clause || f.clauseRef}</td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{f.owner || f.responsible}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{f.dueDate || f.targetClosureDate}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Badge variant="auto" statusText={f.status}>
                          {f.status}
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

      {/* TAB 3: PLANES CAPA */}
      {activeTab === 'capa' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auditFindings.map((f) => (
              <div key={f.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      CAPA: {f.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{f.title}</h4>
                  </div>
                  <Badge variant="auto" statusText={f.status}>
                    {f.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-red-50/60 rounded-lg border border-red-100">
                    <strong className="text-red-900 block mb-0.5">Análisis de Causa Raíz (5 Porqués / Ishikawa):</strong>
                    <p className="text-slate-700 leading-relaxed">{f.rootCause}</p>
                  </div>

                  <div className="p-3 bg-teal-50/60 rounded-lg border border-teal-100">
                    <strong className="text-teal-900 block mb-0.5">Acción Correctiva & Preventiva (CAPA):</strong>
                    <p className="text-slate-700 leading-relaxed">{f.correctiveAction}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Responsable: <strong>{f.owner}</strong></span>
                  <span>Vencimiento: <strong>{f.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">Lista de Verificación de Cláusulas ISO/IEC 42001</h3>
            <p className="text-xs text-slate-500">Evaluación rápida de conformidad por capítulos normativos</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Cláusula</th>
                  <th className="py-3 px-4">Requisito Auditable</th>
                  <th className="py-3 px-4">Pregunta de Verificación</th>
                  <th className="py-3 px-4 text-right">Dictamen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">4.1</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Comprensión de la organización</td>
                  <td className="py-3 px-4 text-slate-600">¿Están identificadas las cuestiones externas e internas de IA?</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-xs">
                      Conforme
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">5.2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Política de Inteligencia Artificial</td>
                  <td className="py-3 px-4 text-slate-600">¿La política de IA está documentada y comunicada a todas las áreas?</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-xs">
                      Conforme
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">6.1.2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Evaluación del impacto del sistema de IA</td>
                  <td className="py-3 px-4 text-slate-600">¿Se realizan FRIA para todos los sistemas clasificados en Alto Riesgo?</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold text-xs">
                      En Observación
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">9.2</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">Auditoría Interna</td>
                  <td className="py-3 px-4 text-slate-600">¿Se ejecutan auditorías internas a intervalos planificados?</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-xs">
                      Conforme
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: READINESS */}
      {activeTab === 'readiness' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Simulador de Auditoría de Certificación
              </span>
              <h2 className="text-2xl font-bold tracking-tight">Audit Readiness Index: 88.5%</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tu organización cumple con los criterios mínimos de solvencia documental, efectividad de controles y trazabilidad para la Auditoría Fase 1 de ISO/IEC 42001.
              </p>
            </div>
            <div className="w-32 h-32 rounded-full border-4 border-teal-400 flex flex-col items-center justify-center shrink-0 bg-teal-950/40">
              <Award className="w-8 h-8 text-teal-400 mb-1" />
              <span className="text-xl font-extrabold text-white">88.5%</span>
              <span className="text-[10px] text-teal-200 uppercase font-semibold">Listo</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Requisitos Mandatorios</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Cláusulas 4-10</span>
                  <span className="font-bold text-teal-700">92%</span>
                </div>
                <Progress value={92} color="teal" size="sm" />
                <p className="text-[11px] text-slate-400">Sin no conformidades mayores activas</p>
              </div>
            </Card>

            <Card>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Evidencias Probatorias</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Custodia y Vigencia</span>
                  <span className="font-bold text-blue-700">85%</span>
                </div>
                <Progress value={85} color="blue" size="sm" />
                <p className="text-[11px] text-slate-400">2 evidencias pendientes de renovación</p>
              </div>
            </Card>

            <Card>
              <h4 className="text-sm font-bold text-slate-900 mb-2">Efectividad SoA</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Controles Probados</span>
                  <span className="font-bold text-emerald-700">88%</span>
                </div>
                <Progress value={88} color="emerald" size="sm" />
                <p className="text-[11px] text-slate-400">Controles críticos verificados al 100%</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* FINDING 360 DRAWER */}
      {selectedFinding && (
        <Drawer
          isOpen={isFindingDrawerOpen}
          onClose={() => setFindingDrawerOpen(false)}
          title={`Hallazgo ${selectedFinding.code}: ${selectedFinding.title}`}
          subtitle={`Clasificación: ${selectedFinding.type} • Cláusula: ${selectedFinding.clause}`}
          badge={
            <Badge variant="auto" statusText={selectedFinding.status}>
              {selectedFinding.status}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setFindingDrawerOpen(false)}>
              Cerrar
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Detalle del Hallazgo</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{selectedFinding.description}</p>
            </div>

            <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-red-900 uppercase tracking-wider">Causa Raíz Identificada</h4>
              <p className="text-slate-700 leading-relaxed">{selectedFinding.rootCause || 'Análisis en progreso'}</p>
            </div>

            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-teal-900 uppercase tracking-wider">Acción Correctiva Comprometida</h4>
              <p className="text-slate-700 leading-relaxed">{selectedFinding.correctiveAction || 'Plan de acción en formulación'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-xl p-4">
              <div>
                <span className="text-slate-400 block font-medium">Responsable CAPA:</span>
                <span className="font-bold text-slate-800">{selectedFinding.owner || selectedFinding.responsible}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha Límite:</span>
                <span className="font-bold text-slate-800">{selectedFinding.dueDate || selectedFinding.targetClosureDate}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* CREATE FINDING MODAL */}
      <Modal
        isOpen={isNewFindingModalOpen}
        onClose={() => setNewFindingModalOpen(false)}
        title="Registrar Hallazgo o No Conformidad"
        subtitle="Alta formal en el ciclo CAPA según ISO 19011"
      >
        <form onSubmit={handleCreateFinding} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Código del Hallazgo
              </label>
              <input
                type="text"
                required
                value={fCode}
                onChange={(e) => setFCode(e.target.value)}
                placeholder="Ej. NC-2026-03"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Clasificación
              </label>
              <select
                value={fType}
                onChange={(e) => setFType(e.target.value as FindingType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="No conformidad Mayor">No conformidad Mayor</option>
                <option value="No conformidad Menor">No conformidad Menor</option>
                <option value="Observación">Observación</option>
                <option value="Oportunidad de mejora">Oportunidad de mejora</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Título del Hallazgo
            </label>
            <input
              type="text"
              required
              value={fTitle}
              onChange={(e) => setFTitle(e.target.value)}
              placeholder="Ej. Ausencia de pruebas de estrés adversarial en modelo LLM"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Descripción del Hallazgo
            </label>
            <textarea
              rows={2}
              value={fDesc}
              onChange={(e) => setFDesc(e.target.value)}
              placeholder="Describa la no conformidad evidenciada..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Responsable de Cierre
              </label>
              <input
                type="text"
                value={fOwner}
                onChange={(e) => setFOwner(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Fecha Límite
              </label>
              <input
                type="date"
                value={fDueDate}
                onChange={(e) => setFDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setNewFindingModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Registrar Hallazgo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
