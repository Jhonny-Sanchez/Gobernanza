import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Shield,
  Layers,
  Key,
  Database,
  CheckCircle2,
  Plus,
  Save,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Tabs, TabItem } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Organization, UserProfile, UserRole, StandardType } from '../types';

export const Settings: React.FC = () => {
  const {
    currentOrganization,
    currentUser,
    updateOrganization,
    users,
    addUser
  } = useStore();

  const [activeTab, setActiveTab] = useState('organization');

  // Org form state
  const [orgName, setOrgName] = useState(currentOrganization?.name || 'NovaTech Solutions S.A.');
  const [orgSector, setOrgSector] = useState(currentOrganization?.sector || 'Fintech & Inteligencia Artificial');
  const [orgCountry, setOrgCountry] = useState(currentOrganization?.country || 'España / Unión Europea');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New User Modal
  const [isNewUserModalOpen, setNewUserModalOpen] = useState(false);
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uRole, setURole] = useState<UserRole>('Oficial de Cumplimiento');

  // Standards toggles
  const [enabledStandards, setEnabledStandards] = useState<Record<string, boolean>>({
    'ISO/IEC 42001': true,
    'ISO/IEC 27001': true,
    'EU AI Act': true,
    'NIST AI RMF': false
  });

  const tabs: TabItem[] = [
    { id: 'organization', label: 'Organización & Datos' },
    { id: 'users', label: 'Usuarios & Roles (RBAC)', count: users.length },
    { id: 'standards', label: 'Alcance Normativo' },
    { id: 'integrations', label: 'Integraciones MLOps & DevSecOps' },
    { id: 'backups', label: 'Exportación & Respaldos' }
  ];

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentOrganization) {
      updateOrganization(currentOrganization.id, {
        name: orgName,
        sector: orgSector,
        country: orgCountry
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uName || !uEmail) return;

    addUser({
      organizationIds: [currentOrganization?.id || 'org-nova-1'],
      name: uName,
      email: uEmail,
      role: uRole,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`
    });

    setUName('');
    setUEmail('');
    setNewUserModalOpen(false);
  };

  const handleExportData = () => {
    const stateSnapshot = useStore.getState();
    const dataStr = JSON.stringify(stateSnapshot, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_AIGobernanza360_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Configuración del Tenant & Plataforma
            </h1>
            <Badge variant="teal">Multi-Tenant</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configuración de la entidad, control de accesos basado en roles (RBAC), conectores MLOps y alcances normativos.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: ORGANIZACIÓN */}
      {activeTab === 'organization' && (
        <div className="max-w-3xl bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Datos Corporativos</h3>
              <p className="text-xs text-slate-500">Información principal del tenant de la organización</p>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Cambios Guardados
              </span>
            )}
          </div>

          <form onSubmit={handleSaveOrg} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Razón Social / Nombre Comercial
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Sector Industrial
                </label>
                <input
                  type="text"
                  value={orgSector}
                  onChange={(e) => setOrgSector(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Jurisdicción / País
                </label>
                <input
                  type="text"
                  value={orgCountry}
                  onChange={(e) => setOrgCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <Button type="submit" variant="primary" icon={<Save className="w-4 h-4" />}>
                Guardar Configuración
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: USUARIOS & RBAC */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Control de Acceso Basado en Roles (RBAC)</h3>
              <p className="text-xs text-slate-500">
                Usuarios con privilegios en el Sistema Integrado de Gestión
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setNewUserModalOpen(true)}
            >
              Invitar Usuario
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="teal">{u.role}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ALCANCE NORMATIVO */}
      {activeTab === 'standards' && (
        <div className="max-w-3xl space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Normas & Regulaciones Activas</h3>
            <p className="text-xs text-slate-500">
              Activa los marcos de cumplimiento que aplican al alcance de auditoría de tu organización.
            </p>

            <div className="space-y-3 pt-2">
              {[
                {
                  id: 'ISO/IEC 42001',
                  name: 'ISO/IEC 42001:2023 - Sistema de Gestión de Inteligencia Artificial (AIMS)',
                  desc: 'Estándar internacional certificable de gobernanza, ciclo de vida de IA y controles del Anexo A.'
                },
                {
                  id: 'ISO/IEC 27001',
                  name: 'ISO/IEC 27001:2022 - Seguridad de la Información (SGSI)',
                  desc: '93 controles de ciberseguridad, gestión de accesos y resiliencia de infraestructura.'
                },
                {
                  id: 'EU AI Act',
                  name: 'Reglamento de Inteligencia Artificial de la UE (EU AI Act)',
                  desc: 'Clasificación de riesgo, requisitos de sistemas de alto riesgo (FRIA) y transparencia obligatoria.'
                },
                {
                  id: 'NIST AI RMF',
                  name: 'NIST AI Risk Management Framework 1.0',
                  desc: 'Marco de gobernanza de EE.UU.: Govern, Map, Measure y Manage.'
                }
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!enabledStandards[item.id]}
                    onChange={(e) =>
                      setEnabledStandards({
                        ...enabledStandards,
                        [item.id]: e.target.checked
                      })
                    }
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer mt-1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRACIONES */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Evidently AI / MLflow',
              type: 'Telemetría de Modelos & Drift',
              status: 'Conectado',
              desc: 'Ingesta de métricas de data drift, predicciones y alertas en tiempo real.'
            },
            {
              name: 'Jira Software / GitHub',
              type: 'Gestión de Acciones & CAPA',
              status: 'Conectado',
              desc: 'Sincronización bidireccional de tareas del plan de trabajo y no conformidades.'
            },
            {
              name: 'Google Vertex AI & Gemini',
              type: 'Plataforma LLM & RAG',
              status: 'Conectado',
              desc: 'Registro automático de modelos, endpoints y cuotas de inferencia.'
            },
            {
              name: 'LangSmith / Langfuse',
              type: 'Trazabilidad de Prompts',
              status: 'Disponible',
              desc: 'Auditoría de ejecuciones de cadenas RAG, latencias y tokens.'
            },
            {
              name: 'AWS Bedrock / SageMaker',
              type: 'Infraestructura Cloud',
              status: 'Disponible',
              desc: 'Model Cards automáticas y monitoreo de sesgo con SageMaker Clarify.'
            },
            {
              name: 'Azure AI Studio',
              type: 'Seguridad & Content Safety',
              status: 'Disponible',
              desc: 'Filtros de contenido y detección de inyecciones de prompt.'
            }
          ].map((int, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{int.name}</h4>
                    <span className="text-xs text-slate-500">{int.type}</span>
                  </div>
                  <Badge variant={int.status === 'Conectado' ? 'teal' : 'default'}>
                    {int.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{int.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button variant="outline" size="sm">
                  {int.status === 'Conectado' ? 'Configurar' : 'Conectar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: BACKUPS */}
      {activeTab === 'backups' && (
        <div className="max-w-2xl bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Respaldo & Exportación Inmutable</h3>
          <p className="text-xs text-slate-500">
            Descarga una instantánea criptográfica completa con todos los inventarios de IA, registros de riesgos, evidencias y actas de auditoría.
          </p>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Formato de Exportación:</span>
              <span className="font-bold text-slate-900">JSON Certificado</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Custodia de Datos:</span>
              <span className="text-teal-700 font-bold">Multi-Tenant Aislado</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full mt-2"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExportData}
            >
              Descargar Snapshot Completo (.JSON)
            </Button>
          </div>
        </div>
      )}

      {/* INVITE USER MODAL */}
      <Modal
        isOpen={isNewUserModalOpen}
        onClose={() => setNewUserModalOpen(false)}
        title="Invitar Nuevo Usuario al Sistema"
        subtitle="Asignación de credenciales y roles RBAC"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={uName}
              onChange={(e) => setUName(e.target.value)}
              placeholder="Ej. Dra. Elena Vega"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Correo Electrónico Corporativo
            </label>
            <input
              type="email"
              required
              value={uEmail}
              onChange={(e) => setUEmail(e.target.value)}
              placeholder="elena.vega@novatech.ai"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Rol Asignado
            </label>
            <select
              value={uRole}
              onChange={(e) => setURole(e.target.value as UserRole)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 cursor-pointer"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="AI Governance Lead">AI Governance Lead</option>
              <option value="CISO">CISO</option>
              <option value="AI Ethics Officer">AI Ethics Officer</option>
              <option value="Auditor Interno">Auditor Interno</option>
              <option value="Auditor Externo">Auditor Externo</option>
              <option value="Propietario de Sistema IA">Propietario de Sistema IA</option>
              <option value="Operador">Operador</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setNewUserModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Enviar Invitación
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
