import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Send,
  Sliders,
  Plus
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { AlertItem, AIIncident, AlertSeverity, IncidentStatus } from '../types';

export const Alerts: React.FC = () => {
  const {
    alerts,
    markAlertAsRead,
    aiIncidents,
    addAIIncident,
    aiSystems
  } = useStore();

  const [activeTab, setActiveTab] = useState('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Incident 360 Drawer
  const [selectedIncident, setSelectedIncident] = useState<AIIncident | null>(null);
  const [isIncidentDrawerOpen, setIncidentDrawerOpen] = useState(false);

  // New Incident Modal
  const [isNewIncidentModalOpen, setNewIncidentModalOpen] = useState(false);
  const [incCode, setIncCode] = useState('');
  const [incTitle, setIncTitle] = useState('');
  const [incDesc, setIncDesc] = useState('');
  const [incSeverity, setIncSeverity] = useState<AlertSeverity>('Alta');
  const [incAISystemId, setIncAISystemId] = useState('ai-sys-01');
  const [incVector, setIncVector] = useState('Inyección indirecta de prompt');
  const [incOwner, setIncOwner] = useState('Jorge Hosato');

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const tabs: TabItem[] = [
    { id: 'notifications', label: 'Alertas del Sistema', count: unreadAlertsCount },
    { id: 'incidents', label: 'Registro de Incidentes de IA', count: aiIncidents.length },
    { id: 'playbook', label: 'Protocolo de Respuesta a Incidentes' },
    { id: 'thresholds', label: 'Configuración de Umbrales' }
  ];

  const filteredIncidents = (aiIncidents || []).filter((inc: AIIncident) => {
    const matchesSearch =
      (inc.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.title || inc.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.owner || inc.responsible || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || inc.severity.toLowerCase() === severityFilter.toLowerCase();
    return matchesSearch && matchesSeverity;
  });

  const handleOpen360 = (inc: AIIncident) => {
    setSelectedIncident(inc);
    setIncidentDrawerOpen(true);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incCode || !incTitle) return;

    addAIIncident({
      code: incCode,
      title: incTitle,
      date: new Date().toISOString().slice(0, 10),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'Vulnerabilidad / Inyección',
      severity: (incSeverity === 'ALTO' ? 'Alta' : incSeverity === 'CRÍTICO' ? 'Crítica' : incSeverity === 'MEDIO' ? 'Media' : incSeverity === 'BAJO' ? 'Baja' : incSeverity) as 'Baja' | 'Media' | 'Alta' | 'Crítica',
      aiSystemId: incAISystemId,
      description: incDesc,
      impact: incDesc,
      rootCause: incVector,
      causeVector: incVector,
      status: 'En contención',
      responsible: incOwner,
      owner: incOwner,
      actionsTaken: 'Se aisló temporalmente la API y se reforzó el filtro semántico de entrada.'
    });

    setIncCode('');
    setIncTitle('');
    setIncDesc('');
    setNewIncidentModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Alertas & Gestión de Incidentes de IA
            </h1>
            <Badge variant="teal">Respuesta Rápida</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Centro de monitoreo reactivo y proactivo, contención de anomalías de IA y reportes obligatorios.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setNewIncidentModalOpen(true)}
        >
          Declarar Incidente de IA
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: ALERTAS DEL SISTEMA */}
      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.read || alert.acknowledged
                  ? 'bg-white border-slate-200 text-slate-600'
                  : 'bg-teal-50/40 border-teal-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {(alert.severity === 'Crítica' || alert.severity === 'CRÍTICO') && (
                    <AlertOctagon className="w-5 h-5 text-red-600" />
                  )}
                  {(alert.severity === 'Alta' || alert.severity === 'ALTO') && (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                  {(alert.severity === 'Media' || alert.severity === 'MEDIO') && (
                    <Bell className="w-5 h-5 text-teal-600" />
                  )}
                  {(alert.severity === 'Baja' || alert.severity === 'BAJO') && (
                    <Bell className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">{alert.title || alert.type}</h4>
                    {!alert.read && !alert.acknowledged && (
                      <span className="w-2 h-2 rounded-full bg-teal-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{alert.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {alert.timestamp || alert.date} • Módulo: {alert.module || alert.entityType || 'General'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="auto" statusText={alert.severity}>
                  {alert.severity}
                </Badge>
                {!alert.read && !alert.acknowledged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    Marcar leída
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: REGISTRO DE INCIDENTES DE IA */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar incidentes por código, título o responsable..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Todas las severidades</option>
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIncidents.map((inc: AIIncident) => {
              const system = aiSystems.find((s) => s.id === inc.aiSystemId);
              return (
                <div
                  key={inc.id}
                  onClick={() => handleOpen360(inc)}
                  className="bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs p-5 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {inc.code || 'INC-01'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{inc.title || inc.description}</h3>
                        <p className="text-xs text-slate-500">
                          Sistema: <strong>{system?.name || 'Sistema IA'}</strong>
                        </p>
                      </div>
                      <Badge variant="auto" statusText={inc.severity}>
                        {inc.severity}
                      </Badge>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                      <p><strong>Vector de Causa:</strong> {inc.causeVector}</p>
                      <p><strong>Impacto:</strong> {inc.impact}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Badge variant="auto" statusText={inc.status}>
                      {inc.status}
                    </Badge>
                    <span className="text-teal-700 font-bold flex items-center gap-1">
                      Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PROTOCOLO DE RESPUESTA */}
      {activeTab === 'playbook' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Protocolo de Respuesta ante Incidentes de IA (IRP-IA)
            </h3>
            <p className="text-xs text-slate-500">
              Flujo operativo escalonado ante fallas de robustez, alucinaciones críticas o ciberataques adversariales.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Detección & Triage Inmediato (&lt; 15 min)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Clasificación de la anomalía, aislamiento de la API del modelo y desvío del tráfico a sistema de respaldo o fallback humano.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Contención & Preservación Forense (&lt; 1 hora)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Captura inmutable de prompts, completions, logs de inferencia y metadatos con firma criptográfica para auditoría forense.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Notificación Regulatoria (Art. 73 EU AI Act)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Si el incidente causó daño a derechos fundamentales o peligro grave a la salud, comunicación formal a la Autoridad Supervisora en menos de 72 horas.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Post-Mortem & Lecciones Aprendidas (&lt; 5 días)</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Análisis de causa raíz en Comité de Ética, actualización de guardrails y cierre en el ciclo CAPA de auditoría.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURACIÓN DE UMBRALES */}
      {activeTab === 'thresholds' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Umbrales de Disparo de Alertas Automáticas</h3>
            <p className="text-xs text-slate-500">
              Límites paramétricos que activan notificaciones prioritarias al equipo de gobernanza.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Tasa Máxima de Alucinación Aceptable</span>
                  <span className="text-teal-700 font-bold">2.5%</span>
                </div>
                <input type="range" min={0.5} max={10} step={0.5} defaultValue={2.5} className="w-full accent-teal-600 cursor-pointer" />
                <p className="text-[11px] text-slate-400">Genera alerta si la tasa supera el umbral en una ventana de 1 hora.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Umbral de Data Drift (Evidently p-value)</span>
                  <span className="text-teal-700 font-bold">&lt; 0.05</span>
                </div>
                <input type="range" min={0.01} max={0.2} step={0.01} defaultValue={0.05} className="w-full accent-teal-600 cursor-pointer" />
                <p className="text-[11px] text-slate-400">Genera alerta de re-entrenamiento si la deriva supera el nivel de significancia.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INCIDENT 360 DRAWER */}
      {selectedIncident && (
        <Drawer
          isOpen={isIncidentDrawerOpen}
          onClose={() => setIncidentDrawerOpen(false)}
          title={`Incidente ${selectedIncident.code || 'INC'}: ${selectedIncident.title || selectedIncident.description}`}
          subtitle={`Fecha/Hora: ${selectedIncident.timestamp || selectedIncident.date} • Severidad: ${selectedIncident.severity}`}
          badge={
            <Badge variant="auto" statusText={selectedIncident.status}>
              {selectedIncident.status}
            </Badge>
          }
          width="2xl"
          footer={
            <Button variant="outline" onClick={() => setIncidentDrawerOpen(false)}>
              Cerrar
            </Button>
          }
        >
          <div className="space-y-6">
            <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-red-900 uppercase tracking-wider">Impacto & Consecuencias</h4>
              <p className="text-slate-700 leading-relaxed text-sm">{selectedIncident.impact}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Vector de Causa</h4>
              <p className="text-slate-700 leading-relaxed">{selectedIncident.causeVector || selectedIncident.rootCause}</p>
            </div>

            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-teal-900 uppercase tracking-wider">Acciones de Contención Tomadas</h4>
              <p className="text-slate-700 leading-relaxed">{selectedIncident.actionsTaken}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-xl p-4">
              <div>
                <span className="text-slate-400 block font-medium">Líder del Incidente:</span>
                <span className="font-bold text-slate-800">{selectedIncident.owner || selectedIncident.responsible}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Estado:</span>
                <span className="font-bold text-slate-800">{selectedIncident.status}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}

      {/* NEW INCIDENT MODAL */}
      <Modal
        isOpen={isNewIncidentModalOpen}
        onClose={() => setNewIncidentModalOpen(false)}
        title="Declarar Incidente de Inteligencia Artificial"
        subtitle="Activación del protocolo de contención y preservación forense"
      >
        <form onSubmit={handleCreateIncident} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Código de Incidente
              </label>
              <input
                type="text"
                required
                value={incCode}
                onChange={(e) => setIncCode(e.target.value)}
                placeholder="Ej. INC-IA-2026-02"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Severidad
              </label>
              <select
                value={incSeverity}
                onChange={(e) => setIncSeverity(e.target.value as AlertSeverity)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
              >
                <option value="Crítica">Crítica</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Título del Incidente
            </label>
            <input
              type="text"
              required
              value={incTitle}
              onChange={(e) => setIncTitle(e.target.value)}
              placeholder="Ej. Evasión de filtro semántico y generación de contenido no verificado"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Impacto y Efectos Observados
            </label>
            <textarea
              rows={2}
              value={incDesc}
              onChange={(e) => setIncDesc(e.target.value)}
              placeholder="Describa los efectos en usuarios, datos o reputación..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setNewIncidentModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Declarar Incidente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
