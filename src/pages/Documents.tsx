import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle2,
  Clock,
  UserCheck,
  ChevronRight,
  Sparkles,
  FileCheck2,
  BookOpen
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { DocumentItem } from '../types';

export const Documents: React.FC = () => {
  const { documents, addDocument } = useStore();

  const [activeTab, setActiveTab] = useState('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Document 360 Drawer
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isDocDrawerOpen, setDocDrawerOpen] = useState(false);

  // New Document Modal
  const [isNewDocModalOpen, setNewDocModalOpen] = useState(false);
  const [docCode, setDocCode] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Política');
  const [docContent, setDocContent] = useState('');
  const [docAuthor, setDocAuthor] = useState('Jorge Hosato');

  const tabs: TabItem[] = [
    { id: 'library', label: 'Biblioteca Documental', count: documents.length },
    { id: 'approvals', label: 'Flujo de Aprobaciones' },
    { id: 'templates', label: 'Plantillas ISO 42001 & 27001' }
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleOpen360 = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setDocDrawerOpen(true);
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docCode || !docTitle) return;

    addDocument({
      organizationId: 'org-nova-1',
      code: docCode,
      title: docTitle,
      type: docType,
      version: '1.0',
      status: 'Aprobado',
      author: docAuthor,
      approver: 'Comité de Dirección y Ética',
      approvalDate: new Date().toISOString().slice(0, 10),
      nextReviewDate: '2027-09-15',
      standards: ['ISO/IEC 42001'],
      content: docContent || 'Texto oficial aprobado del documento normativo corporativo.'
    });

    setDocCode('');
    setDocTitle('');
    setDocContent('');
    setNewDocModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Gestión Documental & Políticas SGIA
            </h1>
            <Badge variant="teal">Control de Versiones</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Políticas corporativas de IA ética, procedimientos de ciberseguridad y flujos formales de aprobación.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setNewDocModalOpen(true)}
        >
          Nuevo Documento
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: BIBLIOTECA */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, título o autor..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los tipos</option>
                <option value="Política">Política</option>
                <option value="Procedimiento">Procedimiento</option>
                <option value="Manual">Manual</option>
                <option value="Código Ético">Código Ético</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="Aprobado">Aprobado / Publicado</option>
                <option value="En revisión">En revisión</option>
                <option value="Borrador">Borrador</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleOpen360(doc)}
                className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs p-5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {doc.code}
                    </span>
                    <Badge variant="auto" statusText={doc.status}>
                      {doc.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {doc.content}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Versión: <strong className="font-mono text-slate-800">v{doc.version}</strong></span>
                    <span>Tipo: {doc.type}</span>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Aprobó: {doc.approver}</span>
                  <span className="text-teal-700 font-bold flex items-center gap-1">
                    Leer <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FLUJO DE APROBACIONES */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Circuito Formal de Aprobación Documental</h3>
            <p className="text-xs text-slate-500">
              Gobernanza de doble firma requerida para la aprobación de políticas y modificaciones del SGIA.
            </p>
          </div>

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold text-teal-700">{doc.code}</span>
                  <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                  <p className="text-xs text-slate-500">
                    Autor: <strong>{doc.author}</strong> • Aprobador: <strong>{doc.approver || doc.approvedBy || 'Comité de Dirección'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[11px]">Fecha Aprobación:</span>
                    <span className="font-bold text-slate-700">{doc.approvalDate || doc.lastUpdated}</span>
                  </div>
                  <Badge variant="auto" statusText={doc.status}>
                    {doc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PLANTILLAS */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
                <BookOpen className="w-5 h-5" />
                <span>Política de Inteligencia Artificial (ISO 42001)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Plantilla marco con principios de equidad, explicabilidad, seguridad, rendición de cuentas y derechos fundamentales.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Usar Plantilla
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <BookOpen className="w-5 h-5" />
                <span>Procedimiento de Evaluación de Impacto Ético (FRIA)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Metodología estandarizada para evaluar el impacto en derechos humanos según Art. 27 del Reglamento Europeo de IA.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Usar Plantilla
              </Button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <BookOpen className="w-5 h-5" />
                <span>Procedimiento de Respuesta ante Incidentes de IA</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Guía de contención inmediata ante fuga de datos por alucinación, jailbreaks o comportamiento no previsto de modelos.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Usar Plantilla
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT 360 DRAWER */}
      {selectedDoc && (
        <Drawer
          isOpen={isDocDrawerOpen}
          onClose={() => setDocDrawerOpen(false)}
          title={`Documento: ${selectedDoc.title}`}
          subtitle={`Código: ${selectedDoc.code} • Versión: v${selectedDoc.version}`}
          badge={
            <Badge variant="auto" statusText={selectedDoc.status}>
              {selectedDoc.status}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setDocDrawerOpen(false)}>
              Cerrar
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Contenido Aprobado del Documento
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line font-serif">
                {selectedDoc.content || 'Este documento establece los lineamientos de cumplimiento, gobernanza y directrices operativas bajo ISO/IEC 42001 e ISO/IEC 27001 para la organización.'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-xl p-4">
              <div>
                <span className="text-slate-400 block font-medium">Autor / Redactor:</span>
                <span className="font-bold text-slate-800">{selectedDoc.author}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Aprobador Formal:</span>
                <span className="font-bold text-slate-800">{selectedDoc.approver || selectedDoc.approvedBy || 'Comité Directivo'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Fecha de Aprobación:</span>
                <span className="font-bold text-slate-800">{selectedDoc.approvalDate || selectedDoc.lastUpdated}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Próxima Revisión Anual:</span>
                <span className="font-bold text-slate-800">{selectedDoc.nextReviewDate || '2027-01-15'}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* NEW DOCUMENT MODAL */}
      <Modal
        isOpen={isNewDocModalOpen}
        onClose={() => setNewDocModalOpen(false)}
        title="Crear Nuevo Documento Normativo"
        subtitle="Registro oficial en el sistema de gestión integrada"
      >
        <form onSubmit={handleCreateDoc} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Código del Documento
              </label>
              <input
                type="text"
                required
                value={docCode}
                onChange={(e) => setDocCode(e.target.value)}
                placeholder="Ej. POL-IA-03"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Tipo
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Política">Política</option>
                <option value="Procedimiento">Procedimiento</option>
                <option value="Manual">Manual</option>
                <option value="Código Ético">Código Ético</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Título del Documento
            </label>
            <input
              type="text"
              required
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Ej. Política de Supervisión Humana en Modelos Predictivos"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Cuerpo / Texto del Documento
            </label>
            <textarea
              rows={4}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Redacte las directrices o cláusulas del documento..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setNewDocModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Publicar Documento
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
