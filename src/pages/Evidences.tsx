import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Upload,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  FileCode,
  Hash,
  Download,
  ChevronRight,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { Evidence, EvidenceStatus, StandardType } from '../types';

export const Evidences: React.FC = () => {
  const {
    evidences,
    addEvidence,
    updateEvidence,
    requirements,
    controls
  } = useStore();

  const [activeTab, setActiveTab] = useState('repository');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Evidence 360 Drawer
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [isEvidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);

  // New Evidence Modal / Drag & Drop
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Registro de Auditoría');
  const [newStandard, setNewStandard] = useState<StandardType>('ISO/IEC 42001');
  const [newOwner, setNewOwner] = useState('Jorge Hosato');
  const [newExpiry, setNewExpiry] = useState('2027-06-30');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const tabs: TabItem[] = [
    { id: 'repository', label: 'Repositorio de Evidencias', count: evidences.length },
    { id: 'expirations', label: 'Vencimientos & Calendario' },
    { id: 'integrity', label: 'Integridad Criptográfica (SHA-256)' }
  ];

  const filteredEvidences = evidences.filter((ev) => {
    const matchesSearch =
      ev.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    const matchesType = typeFilter === 'all' || ev.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpen360 = (ev: Evidence) => {
    setSelectedEvidence(ev);
    setEvidenceDrawerOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (!newTitle) {
        setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleCreateEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    // Generate pseudo SHA-256 hash
    const fakeHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    addEvidence({
      organizationId: 'org-nova-1',
      code: `EVD-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      type: newType,
      standard: newStandard,
      controlCodes: ['A.5.1'],
      requirementClauses: ['4.1'],
      downloadUrl: '/evidence_sample.pdf',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      sha256Hash: fakeHash,
      issueDate: new Date().toISOString().slice(0, 10),
      uploadDate: new Date().toISOString().slice(0, 10),
      expirationDate: newExpiry,
      expiryDate: newExpiry,
      status: 'Válido',
      owner: newOwner,
      version: '1.0',
      description: 'Evidencia documental cargada al repositorio institucional para proceso de auditoría.'
    });

    setNewTitle('');
    setUploadedFileName('');
    setUploadModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Repositorio de Evidencias & Confiabilidad
            </h1>
            <Badge variant="teal">Custodia Inmutable</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Gestión documental probatoria, hashes de integridad SHA-256 y control riguroso de caducidad.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Upload className="w-4 h-4" />}
          onClick={() => setUploadModalOpen(true)}
        >
          Cargar Evidencia
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: REPOSITORIO */}
      {activeTab === 'repository' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, título de documento o responsable..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="Vigente">Vigente</option>
                <option value="Próxima a vencer">Próxima a vencer (&lt;30d)</option>
                <option value="Vencida">Vencida</option>
                <option value="En revisión">En revisión</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los tipos</option>
                <option value="Política">Política</option>
                <option value="Procedimiento">Procedimiento</option>
                <option value="Registro de Auditoría">Registro de Auditoría</option>
                <option value="Log Técnico">Log Técnico</option>
                <option value="Evaluación de Impacto">Evaluación de Impacto</option>
              </select>
            </div>
          </div>

          {/* Evidences Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Código & Norma</th>
                    <th className="py-3 px-4">Título de la Evidencia</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Versión</th>
                    <th className="py-3 px-4">Emisión</th>
                    <th className="py-3 px-4">Vencimiento</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvidences.map((ev) => (
                    <tr
                      key={ev.id}
                      onClick={() => handleOpen360(ev)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900 block">{ev.code}</span>
                        <span className="text-[10px] text-teal-700 font-semibold">{ev.standard || 'ISO/IEC 42001'}</span>
                      </td>
                      <td className="py-3 px-4 max-w-[280px]">
                        <p className="font-semibold text-slate-900 leading-snug">{ev.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                          SHA: {(ev.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855').slice(0, 16)}...
                        </p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ev.type || ev.fileType || 'Registro'}</td>
                      <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">v{ev.version || '1.0'}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{ev.issueDate || ev.uploadDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${
                            ev.status === 'Expirado'
                              ? 'text-red-600'
                              : ev.status === 'Por vencer'
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {ev.expiryDate || ev.expirationDate}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{ev.owner}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="auto" statusText={ev.status}>
                          {ev.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => handleOpen360(ev)}>
                          Detalle 360°
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

      {/* TAB 2: VENCIMIENTOS & CALENDARIO */}
      {activeTab === 'expirations' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Control Preventivo de Caducidad Documental</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Las evidencias próximas a vencer deben renovarse antes de la fecha límite para evitar no conformidades en auditoría externa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidences.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-700">{ev.code}</span>
                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                  </div>
                  <Badge variant="auto" statusText={ev.status}>
                    {ev.status}
                  </Badge>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex justify-between text-xs text-slate-600">
                  <span>Emitido: {ev.issueDate || ev.uploadDate}</span>
                  <span>Vence: <strong className="text-slate-900">{ev.expiryDate || ev.expirationDate}</strong></span>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Custodio: {ev.owner}</span>
                  <button
                    onClick={() => handleOpen360(ev)}
                    className="text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Renovar Versión
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRIDAD CRIPTOGRÁFICA */}
      {activeTab === 'integrity' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Hash className="w-4 h-4 text-teal-600" />
              <span>Verificación Criptográfica de Inmutabilidad</span>
            </h3>
            <p className="text-xs text-slate-500">
              Cada documento es sellado con un hash SHA-256 para garantizar ante auditores externos que los registros de gobernanza no han sido alterados.
            </p>
          </div>

          <div className="space-y-3">
            {evidences.map((ev) => (
              <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ev.code}</span>
                    <span className="text-xs text-slate-500">{ev.title}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 break-all select-all">
                    SHA-256: {ev.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Firma Válida
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVIDENCE 360 DRAWER */}
      {selectedEvidence && (
        <Drawer
          isOpen={isEvidenceDrawerOpen}
          onClose={() => setEvidenceDrawerOpen(false)}
          title={`Evidencia: ${selectedEvidence.title}`}
          subtitle={`Código: ${selectedEvidence.code} • Custodio: ${selectedEvidence.owner}`}
          badge={
            <Badge variant="auto" statusText={selectedEvidence.status}>
              {selectedEvidence.status}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setEvidenceDrawerOpen(false)}>
              Cerrar Vista 360°
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Ficha de Respaldo</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{selectedEvidence.description}</p>
            </div>

            {/* Inmutability */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-teal-600" />
                <span>Hash Criptográfico de Integridad (SHA-256)</span>
              </h4>
              <p className="font-mono text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 break-all select-all">
                {selectedEvidence.sha256Hash}
              </p>
              <p className="text-[11px] text-slate-400">
                Sello temporal de inmutabilidad emitido el {selectedEvidence.issueDate} a las 09:30 UTC.
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-xl p-4">
              <div>
                <span className="text-slate-400 block font-medium">Tipo:</span>
                <span className="font-bold text-slate-800">{selectedEvidence.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Versión:</span>
                <span className="font-bold text-slate-800">v{selectedEvidence.version}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha de Emisión:</span>
                <span className="font-bold text-slate-800">{selectedEvidence.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha de Caducidad:</span>
                <span className="font-bold text-slate-800">{selectedEvidence.expiryDate}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* UPLOAD EVIDENCE MODAL */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Cargar Nueva Evidencia Probatoria"
        subtitle="Registro con firma hash e inmutabilidad para auditorías"
      >
        <form onSubmit={handleCreateEvidence} className="space-y-4">
          {/* Drag and drop area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">
              {uploadedFileName || 'Arrastra tu archivo aquí o haz click para explorar'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Soporta PDF, DOCX, XLSX, JSON, CSV hasta 50MB. Se calculará el hash SHA-256 automáticamente.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Título de la Evidencia
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ej. Acta de Aprobación de Políticas de IA por el Directorio"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Tipo de Evidencia
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Política">Política</option>
                <option value="Procedimiento">Procedimiento</option>
                <option value="Registro de Auditoría">Registro de Auditoría</option>
                <option value="Log Técnico">Log Técnico</option>
                <option value="Evaluación de Impacto">Evaluación de Impacto</option>
                <option value="Métrica de Desempeño">Métrica de Desempeño</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Estándar Vinculado
              </label>
              <select
                value={newStandard}
                onChange={(e) => setNewStandard(e.target.value as StandardType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="ISO/IEC 42001">ISO/IEC 42001 (IA)</option>
                <option value="ISO/IEC 27001">ISO/IEC 27001 (Seguridad)</option>
                <option value="EU AI Act">EU AI Act</option>
                <option value="Integrado">Sistema Integrado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Custodio / Responsable
              </label>
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={newExpiry}
                onChange={(e) => setNewExpiry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar y Certificar Hash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
