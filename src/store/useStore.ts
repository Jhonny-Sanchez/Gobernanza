import { create } from 'zustand';
import { 
  Organization, 
  UserProfile, 
  Process, 
  AISystem, 
  Risk, 
  RequirementAssessment, 
  ControlAssessment, 
  EvidenceItem, 
  DocumentItem, 
  Objective, 
  Indicator, 
  Stakeholder, 
  GovernanceRole, 
  AIImpactAssessment, 
  AIDataResource, 
  AILifecycleEvent, 
  AIIncident, 
  AIProvider, 
  AuditSession, 
  AuditFinding, 
  CAPAItem, 
  SystemAlert, 
  ActivityLog, 
  ImplementationAction,
  HealthSnapshot,
  StandardType,
  KPIMetric,
  ModelMetric
} from '../types';

import {
  mockOrganizations,
  mockUser,
  mockProcesses,
  mockAISystems,
  mockRisks,
  mockRequirements,
  mockControls,
  mockEvidences,
  mockDocuments,
  mockStakeholders,
  mockGovernanceRoles,
  mockObjectives,
  mockIndicators,
  mockImpactAssessments,
  mockDataResources,
  mockLifecycleEvents,
  mockIncidents,
  mockProviders,
  mockAudits,
  mockFindings,
  mockCAPAs,
  mockAlerts,
  mockActivityLogs,
  mockImplementationActions,
  mockHealthSnapshot
} from '../data/mockData';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedActions?: { label: string; actionType: string; payload?: any }[];
}

interface AppState {
  // Auth & Org
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  organizations: Organization[];
  currentOrganization: Organization;
  users: UserProfile[];
  addUser: (user: Omit<UserProfile, 'id'>) => void;
  updateOrganization: (id: string, org: Partial<Organization>) => void;
  setOrganization: (orgId: string) => void;
  login: (email: string, pass: string) => boolean;
  logout: () => void;

  // Global filters
  filterStandard: StandardType;
  setFilterStandard: (standard: StandardType) => void;
  filterProcessId: string;
  setFilterProcessId: (processId: string) => void;
  filterPeriod: string;
  setFilterPeriod: (period: string) => void;

  // Entities
  processes: Process[];
  aiSystems: AISystem[];
  risks: Risk[];
  requirements: RequirementAssessment[];
  controls: ControlAssessment[];
  evidences: EvidenceItem[];
  documents: DocumentItem[];
  stakeholders: Stakeholder[];
  governanceRoles: GovernanceRole[];
  objectives: Objective[];
  indicators: Indicator[];
  impactAssessments: AIImpactAssessment[];
  dataResources: AIDataResource[];
  lifecycleEvents: AILifecycleEvent[];
  incidents: AIIncident[];
  aiIncidents: AIIncident[];
  providers: AIProvider[];
  audits: AuditSession[];
  auditPrograms: AuditSession[];
  findings: AuditFinding[];
  auditFindings: AuditFinding[];
  capas: CAPAItem[];
  kpiMetrics: KPIMetric[];
  modelMetrics: ModelMetric[];
  alerts: SystemAlert[];
  activityLogs: ActivityLog[];
  implementationActions: ImplementationAction[];
  healthSnapshot: HealthSnapshot;

  // CRUD Operations
  addProcess: (proc: Omit<Process, 'id'>) => void;
  updateProcess: (id: string, proc: Partial<Process>) => void;
  deleteProcess: (id: string) => void;

  addAISystem: (system: Omit<AISystem, 'id'>) => string;
  updateAISystem: (id: string, system: Partial<AISystem>) => void;
  deleteAISystem: (id: string) => void;

  addRisk: (risk: Omit<Risk, 'id'>) => void;
  updateRisk: (id: string, risk: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;

  updateRequirement: (id: string, req: Partial<RequirementAssessment>) => void;
  updateControl: (id: string, ctrl: Partial<ControlAssessment>) => void;

  addEvidence: (evidence: Omit<EvidenceItem, 'id'>) => void;
  updateEvidence: (id: string, evidence: Partial<EvidenceItem>) => void;
  deleteEvidence: (id: string) => void;

  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  updateDocument: (id: string, doc: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  addStakeholder: (stk: Omit<Stakeholder, 'id'>) => void;
  updateStakeholder: (id: string, stk: Partial<Stakeholder>) => void;
  deleteStakeholder: (id: string) => void;

  addGovernanceRole: (role: Omit<GovernanceRole, 'id'>) => void;
  updateGovernanceRole: (id: string, role: Partial<GovernanceRole>) => void;
  deleteGovernanceRole: (id: string) => void;

  addObjective: (obj: Omit<Objective, 'id'>) => void;
  updateObjective: (id: string, obj: Partial<Objective>) => void;

  addImpactAssessment: (assessment: Omit<AIImpactAssessment, 'id'>) => void;
  addAIDataResource: (data: Omit<AIDataResource, 'id'>) => void;
  addAILifecycleEvent: (event: Omit<AILifecycleEvent, 'id'>) => void;
  addAIIncident: (incident: Omit<AIIncident, 'id'>) => void;
  updateAIIncident: (id: string, incident: Partial<AIIncident>) => void;

  addAudit: (audit: Omit<AuditSession, 'id'>) => void;
  addAuditProgram: (audit: Omit<AuditSession, 'id'>) => void;
  addFinding: (finding: Omit<AuditFinding, 'id'>) => void;
  addAuditFinding: (finding: Omit<AuditFinding, 'id'>) => void;
  updateFinding: (id: string, finding: Partial<AuditFinding>) => void;
  updateAuditFinding: (id: string, finding: Partial<AuditFinding>) => void;

  addCAPA: (capa: Omit<CAPAItem, 'id'>) => void;
  updateCAPA: (id: string, capa: Partial<CAPAItem>) => void;

  resolveAlert: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  markAlertAsRead: (id: string) => void;

  updateImplementationAction: (id: string, action: Partial<ImplementationAction>) => void;
  addImplementationAction: (action: Omit<ImplementationAction, 'id'>) => void;

  // UI state
  activeDrawer: { type: string; id: string; data?: any } | null;
  openDrawer: (type: string, id: string, data?: any) => void;
  closeDrawer: () => void;

  activeModal: { type: string; data?: any } | null;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;

  isCopilotOpen: boolean;
  toggleCopilot: () => void;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  sendCopilotMessage: (userText: string) => void;
  clearCopilotMessages: () => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  isAuthenticated: true,
  currentUser: mockUser,
  organizations: mockOrganizations,
  currentOrganization: mockOrganizations[0],
  users: [
    mockUser,
    {
      id: 'usr-2',
      name: 'Dra. Elena Vega',
      email: 'e.vega@novafinance.com',
      role: 'Auditor Líder',
      title: 'Auditora Senior SGIA',
      organizationIds: ['org-nova-1']
    },
    {
      id: 'usr-3',
      name: 'Ing. Carlos Mendoza',
      email: 'c.mendoza@novafinance.com',
      role: 'AI Engineer / ML Lead',
      title: 'Lead MLOps Architect',
      organizationIds: ['org-nova-1']
    }
  ],
  addUser: (userData) => {
    set((state) => ({
      users: [...state.users, { ...userData, id: `usr-${Date.now()}` }]
    }));
  },
  updateOrganization: (id, orgData) => {
    set((state) => ({
      currentOrganization:
        state.currentOrganization.id === id
          ? { ...state.currentOrganization, ...orgData }
          : state.currentOrganization,
      organizations: state.organizations.map((o) =>
        o.id === id ? { ...o, ...orgData } : o
      )
    }));
  },

  setOrganization: (orgId: string) => {
    const org = get().organizations.find((o) => o.id === orgId);
    if (org) {
      set({ currentOrganization: org });
    }
  },

  login: (email: string, _pass: string) => {
    set({
      isAuthenticated: true,
      currentUser: {
        ...mockUser,
        email: email || mockUser.email
      }
    });
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
  },

  filterStandard: 'Integrado',
  setFilterStandard: (standard: StandardType) => set({ filterStandard: standard }),

  filterProcessId: 'all',
  setFilterProcessId: (processId: string) => set({ filterProcessId: processId }),

  filterPeriod: 'Q3 2026',
  setFilterPeriod: (period: string) => set({ filterPeriod: period }),

  processes: mockProcesses,
  aiSystems: mockAISystems,
  risks: mockRisks,
  requirements: mockRequirements,
  controls: mockControls,
  evidences: mockEvidences,
  documents: mockDocuments,
  stakeholders: mockStakeholders,
  governanceRoles: mockGovernanceRoles,
  objectives: mockObjectives,
  indicators: mockIndicators,
  impactAssessments: mockImpactAssessments,
  dataResources: mockDataResources,
  lifecycleEvents: mockLifecycleEvents,
  incidents: mockIncidents,
  aiIncidents: mockIncidents,
  providers: mockProviders,
  audits: mockAudits,
  auditPrograms: mockAudits,
  findings: mockFindings,
  auditFindings: mockFindings,
  capas: mockCAPAs,
  kpiMetrics: [
    {
      id: 'kpi-1',
      code: 'KPI-SGIA-01',
      name: 'Efectividad General de Controles SoA',
      category: 'Gobernanza',
      target: 85,
      currentValue: 88,
      unit: '%',
      trend: 'up',
      frequency: 'Mensual',
      status: 'Conforme',
      history: [
        { date: 'May', value: 72 },
        { date: 'Jun', value: 76 },
        { date: 'Jul', value: 81 },
        { date: 'Ago', value: 85 },
        { date: 'Sep', value: 88 }
      ]
    },
    {
      id: 'kpi-2',
      code: 'KPI-SEC-02',
      name: 'Vulnerabilidades Críticas en Modelos IA',
      category: 'Seguridad',
      target: 0,
      currentValue: 0,
      unit: 'vulns',
      trend: 'stable',
      frequency: 'Semanal',
      status: 'Conforme',
      history: [
        { date: 'May', value: 2 },
        { date: 'Jun', value: 1 },
        { date: 'Jul', value: 1 },
        { date: 'Ago', value: 0 },
        { date: 'Sep', value: 0 }
      ]
    },
    {
      id: 'kpi-3',
      code: 'KPI-AUD-03',
      name: 'No Conformidades Mayores Abiertas',
      category: 'Auditoría',
      target: 0,
      currentValue: 0,
      unit: 'NC',
      trend: 'stable',
      frequency: 'Trimestral',
      status: 'Conforme',
      history: [
        { date: 'Q1', value: 1 },
        { date: 'Q2', value: 0 },
        { date: 'Q3', value: 0 }
      ]
    },
    {
      id: 'kpi-4',
      code: 'KPI-ETH-04',
      name: 'Índice de Sesgo Algorítmico (Paridad Demográfica)',
      category: 'Ética y Derechos',
      target: 95,
      currentValue: 97.4,
      unit: '%',
      trend: 'up',
      frequency: 'Mensual',
      status: 'Conforme',
      history: [
        { date: 'May', value: 92.1 },
        { date: 'Jun', value: 94.0 },
        { date: 'Jul', value: 95.8 },
        { date: 'Ago', value: 96.5 },
        { date: 'Sep', value: 97.4 }
      ]
    }
  ],
  modelMetrics: [
    {
      id: 'mm-1',
      modelName: 'Nova-CreditRisk-v2',
      latency: 42,
      drift: 1.4,
      accuracy: 94.8,
      requestsCount: 142000,
      status: 'Normal'
    },
    {
      id: 'mm-2',
      modelName: 'Nova-Copilot-LLM',
      latency: 280,
      drift: 2.1,
      accuracy: 92.3,
      requestsCount: 89000,
      status: 'Normal'
    },
    {
      id: 'mm-3',
      modelName: 'Nova-FraudGuard-ML',
      latency: 18,
      drift: 0.8,
      accuracy: 98.2,
      requestsCount: 310000,
      status: 'Normal'
    }
  ],
  alerts: mockAlerts,
  activityLogs: mockActivityLogs,
  implementationActions: mockImplementationActions,
  healthSnapshot: mockHealthSnapshot,

  // CRUD Processes
  addProcess: (procData) => {
    const newProc: Process = {
      ...procData,
      id: `prc-${Date.now()}`
    };
    set((state) => ({
      processes: [newProc, ...state.processes],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          organizationId: state.currentOrganization.id,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          user: state.currentUser?.name || 'Usuario',
          action: 'Creación de Proceso',
          category: 'Gobernanza',
          details: `Se registró el proceso ${newProc.code}: ${newProc.name}`
        },
        ...state.activityLogs
      ]
    }));
  },

  updateProcess: (id, updateData) => {
    set((state) => ({
      processes: state.processes.map((p) => (p.id === id ? { ...p, ...updateData } : p))
    }));
  },

  deleteProcess: (id) => {
    set((state) => ({
      processes: state.processes.filter((p) => p.id !== id)
    }));
  },

  // CRUD AI Systems
  addAISystem: (systemData) => {
    const newId = `ai-${Date.now()}`;
    const newSystem: AISystem = {
      ...systemData,
      id: newId
    };
    set((state) => ({
      aiSystems: [newSystem, ...state.aiSystems],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          organizationId: state.currentOrganization.id,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          user: state.currentUser?.name || 'Usuario',
          action: 'Alta de Sistema de IA',
          category: 'AI',
          details: `Se registró en el inventario el sistema ${newSystem.name} (${newSystem.code})`
        },
        ...state.activityLogs
      ]
    }));
    return newId;
  },

  updateAISystem: (id, updateData) => {
    set((state) => ({
      aiSystems: state.aiSystems.map((s) => (s.id === id ? { ...s, ...updateData } : s))
    }));
  },

  deleteAISystem: (id) => {
    set((state) => ({
      aiSystems: state.aiSystems.filter((s) => s.id !== id)
    }));
  },

  // CRUD Risks
  addRisk: (riskData) => {
    const newRisk: Risk = {
      ...riskData,
      id: `rsk-${Date.now()}`
    };
    set((state) => ({
      risks: [newRisk, ...state.risks],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          organizationId: state.currentOrganization.id,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          user: state.currentUser?.name || 'Usuario',
          action: 'Registro de Riesgo',
          category: 'Riesgo',
          details: `Identificado riesgo ${newRisk.code}: ${newRisk.name}`
        },
        ...state.activityLogs
      ]
    }));
  },

  updateRisk: (id, updateData) => {
    set((state) => ({
      risks: state.risks.map((r) => (r.id === id ? { ...r, ...updateData } : r))
    }));
  },

  deleteRisk: (id) => {
    set((state) => ({
      risks: state.risks.filter((r) => r.id !== id)
    }));
  },

  // Requirements & Controls
  updateRequirement: (id, updateData) => {
    set((state) => ({
      requirements: state.requirements.map((r) => (r.id === id ? { ...r, ...updateData } : r))
    }));
  },

  updateControl: (id, updateData) => {
    set((state) => ({
      controls: state.controls.map((c) => (c.id === id ? { ...c, ...updateData } : c))
    }));
  },

  // Evidences
  addEvidence: (evidenceData) => {
    const newEv: EvidenceItem = {
      ...evidenceData,
      id: `ev-${Date.now()}`
    };
    set((state) => ({
      evidences: [newEv, ...state.evidences],
      activityLogs: [
        {
          id: `act-${Date.now()}`,
          organizationId: state.currentOrganization.id,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          user: state.currentUser?.name || 'Usuario',
          action: 'Carga de Evidencia',
          category: 'Evidencia',
          details: `Cargada evidencia ${newEv.code}: ${newEv.title}`
        },
        ...state.activityLogs
      ]
    }));
  },

  updateEvidence: (id, updateData) => {
    set((state) => ({
      evidences: state.evidences.map((e) => (e.id === id ? { ...e, ...updateData } : e))
    }));
  },

  deleteEvidence: (id) => {
    set((state) => ({
      evidences: state.evidences.filter((e) => e.id !== id)
    }));
  },

  // Documents
  addDocument: (docData) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`
    };
    set((state) => ({
      documents: [newDoc, ...state.documents]
    }));
  },

  updateDocument: (id, updateData) => {
    set((state) => ({
      documents: state.documents.map((d) => (d.id === id ? { ...d, ...updateData } : d))
    }));
  },

  deleteDocument: (id) => {
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id)
    }));
  },

  // Stakeholders
  addStakeholder: (stkData) => {
    const newStk: Stakeholder = {
      ...stkData,
      id: `stk-${Date.now()}`
    };
    set((state) => ({
      stakeholders: [newStk, ...state.stakeholders]
    }));
  },

  updateStakeholder: (id, updateData) => {
    set((state) => ({
      stakeholders: state.stakeholders.map((s) => (s.id === id ? { ...s, ...updateData } : s))
    }));
  },

  deleteStakeholder: (id) => {
    set((state) => ({
      stakeholders: state.stakeholders.filter((s) => s.id !== id)
    }));
  },

  // Governance Roles
  addGovernanceRole: (roleData) => {
    const newRole: GovernanceRole = {
      ...roleData,
      id: `rol-${Date.now()}`
    };
    set((state) => ({
      governanceRoles: [newRole, ...state.governanceRoles]
    }));
  },

  updateGovernanceRole: (id, updateData) => {
    set((state) => ({
      governanceRoles: state.governanceRoles.map((r) => (r.id === id ? { ...r, ...updateData } : r))
    }));
  },

  deleteGovernanceRole: (id) => {
    set((state) => ({
      governanceRoles: state.governanceRoles.filter((r) => r.id !== id)
    }));
  },

  // Objectives
  addObjective: (objData) => {
    const newObj: Objective = {
      ...objData,
      id: `obj-${Date.now()}`
    };
    set((state) => ({
      objectives: [newObj, ...state.objectives]
    }));
  },

  updateObjective: (id, updateData) => {
    set((state) => ({
      objectives: state.objectives.map((o) => (o.id === id ? { ...o, ...updateData } : o))
    }));
  },

  // AI Sub-entities
  addImpactAssessment: (assessment) => {
    set((state) => ({
      impactAssessments: [{ ...assessment, id: `imp-${Date.now()}` }, ...state.impactAssessments]
    }));
  },

  addAIDataResource: (data) => {
    set((state) => ({
      dataResources: [{ ...data, id: `dat-${Date.now()}` }, ...state.dataResources]
    }));
  },

  addAILifecycleEvent: (event) => {
    set((state) => ({
      lifecycleEvents: [{ ...event, id: `evt-${Date.now()}` }, ...state.lifecycleEvents]
    }));
  },

  addAIIncident: (incident) => {
    const newInc: AIIncident = { ...incident, id: `inc-${Date.now()}` };
    set((state) => ({
      incidents: [newInc, ...state.incidents],
      alerts: [
        {
          id: `alt-${Date.now()}`,
          organizationId: state.currentOrganization.id,
          severity: incident.severity === 'Crítica' ? 'CRÍTICO' : 'ALTO',
          type: 'Incidente Activo',
          message: `Nuevo incidente registrado: ${incident.type} en sistema IA (${incident.severity})`,
          entityType: 'aiSystem',
          entityId: incident.aiSystemId,
          date: new Date().toISOString(),
          resolved: false,
          acknowledged: false
        },
        ...state.alerts
      ]
    }));
  },

  updateAIIncident: (id, updateData) => {
    set((state) => ({
      incidents: state.incidents.map((i) => (i.id === id ? { ...i, ...updateData } : i))
    }));
  },

  // Audits & Findings
  addAudit: (auditData) => {
    const newAudit = { ...auditData, id: `aud-${Date.now()}` };
    set((state) => ({
      audits: [newAudit, ...state.audits],
      auditPrograms: [newAudit, ...state.auditPrograms]
    }));
  },
  addAuditProgram: (auditData) => {
    const newAudit = { ...auditData, id: `aud-${Date.now()}` };
    set((state) => ({
      audits: [newAudit, ...state.audits],
      auditPrograms: [newAudit, ...state.auditPrograms]
    }));
  },

  addFinding: (findingData) => {
    const newFinding: AuditFinding = { ...findingData, id: `fnd-${Date.now()}` };
    set((state) => ({
      findings: [newFinding, ...state.findings],
      auditFindings: [newFinding, ...state.auditFindings]
    }));
  },
  addAuditFinding: (findingData) => {
    const newFinding: AuditFinding = { ...findingData, id: `fnd-${Date.now()}` };
    set((state) => ({
      findings: [newFinding, ...state.findings],
      auditFindings: [newFinding, ...state.auditFindings]
    }));
  },

  updateFinding: (id, updateData) => {
    set((state) => ({
      findings: state.findings.map((f) => (f.id === id ? { ...f, ...updateData } : f)),
      auditFindings: state.auditFindings.map((f) => (f.id === id ? { ...f, ...updateData } : f))
    }));
  },
  updateAuditFinding: (id, updateData) => {
    set((state) => ({
      findings: state.findings.map((f) => (f.id === id ? { ...f, ...updateData } : f)),
      auditFindings: state.auditFindings.map((f) => (f.id === id ? { ...f, ...updateData } : f))
    }));
  },

  // CAPA
  addCAPA: (capaData) => {
    set((state) => ({
      capas: [{ ...capaData, id: `capa-${Date.now()}` }, ...state.capas]
    }));
  },

  updateCAPA: (id, updateData) => {
    set((state) => ({
      capas: state.capas.map((c) => (c.id === id ? { ...c, ...updateData } : c))
    }));
  },

  // Alerts
  resolveAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, resolved: true, read: true } : a))
    }));
  },

  acknowledgeAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, acknowledged: true, read: true } : a))
    }));
  },

  markAlertAsRead: (id) => {
    set((state) => ({
      alerts: state.alerts.map((a) => (a.id === id ? { ...a, read: true, acknowledged: true } : a))
    }));
  },

  // Implementation Actions
  updateImplementationAction: (id, updateData) => {
    set((state) => ({
      implementationActions: state.implementationActions.map((a) =>
        a.id === id ? { ...a, ...updateData } : a
      )
    }));
  },

  addImplementationAction: (actionData) => {
    set((state) => ({
      implementationActions: [
        { ...actionData, id: `act-plan-${Date.now()}` },
        ...state.implementationActions
      ]
    }));
  },

  // UI State
  activeDrawer: null,
  openDrawer: (type, id, data) => set({ activeDrawer: { type, id, data } }),
  closeDrawer: () => set({ activeDrawer: null }),

  activeModal: null,
  openModal: (type, data) => set({ activeModal: { type, data } }),
  closeModal: () => set({ activeModal: null }),

  isCopilotOpen: false,
  toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
  setCopilotOpen: (open) => set({ isCopilotOpen: open }),

  copilotMessages: [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: '¡Hola, Jorge! Soy tu **Copilot de Gobernanza 360**. Estoy conectado al estado en tiempo real de Nova Compliance & AI.\n\nPuedo responder dudas sobre tus sistemas de IA registrados, la madurez ante ISO/IEC 42001 e ISO/IEC 27001, riesgos críticos abiertos y el estado de la auditoría en curso.',
      timestamp: 'Ahora',
      suggestedActions: [
        { label: '¿Cuáles son los riesgos críticos?', actionType: 'query_critical_risks' },
        { label: '¿Qué requisitos tienen brechas?', actionType: 'query_gaps' },
        { label: '¿Qué sistemas IA requieren revisión?', actionType: 'query_ai_review' },
        { label: '¿Qué evidencias están próximas a vencer?', actionType: 'query_expiring_evidences' }
      ]
    }
  ],

  sendCopilotMessage: (userText: string) => {
    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    set((state) => ({
      copilotMessages: [...state.copilotMessages, userMsg]
    }));

    // Generate smart context-aware response based on app state
    setTimeout(() => {
      const state = get();
      const lower = userText.toLowerCase();
      let reply = '';
      let sources: string[] = [];

      if (lower.includes('riesgo') || lower.includes('crítico')) {
        const critRisks = state.risks.filter(r => r.inherentLevel === 'Crítico' || r.residualLevel === 'Crítico');
        reply = `He analizado la matriz de riesgos corporativa:\n\n` +
          `• Actualmente tienes **${critRisks.length} riesgos de nivel crítico** identificados.\n` +
          `• El riesgo prioritario es **${critRisks[0]?.name || 'RSK-IA-02 (Sesgo discriminatorio)'}**, asociado al sistema **NovaScore**.\n` +
          `• Controles clave mitigantes: **CTRL-IA-02 (Pruebas Fairlearn)** y **CTRL-SEC-04**.\n\n` +
          `¿Deseas abrir la vista 360 de este riesgo o revisar las acciones de mitigación?`;
        sources = ['Matriz de Riesgos ISO 42001', 'Módulo Risk Hub'];
      } else if (lower.includes('brecha') || lower.includes('requisito') || lower.includes('gap')) {
        const gaps = state.requirements.filter(r => r.status === 'Brecha');
        reply = `En el Gap Assessment de estándares encontramos **${gaps.length} brecha(s) activa(s)**:\n\n` +
          `• **Cláusula A.8.12 (ISO/IEC 27001)**: *Prevención de Fuga de Datos (DLP)* con solo un **45% de implementación**.\n` +
          `• Causa: Los guardrails de salida para modelos generativos aún no filtran números de cuenta ofuscados.\n` +
          `• Fecha objetivo de regularización: **30 de Octubre de 2026** (Responsable: Ing. Rodrigo Méndez).`;
        sources = ['Gap Assessment ISO 27001', 'Declaración de Aplicabilidad'];
      } else if (lower.includes('sistema') || lower.includes('ia') || lower.includes('revisión')) {
        const reviewAIs = state.aiSystems.filter(s => s.approvalStatus === 'Condicional' || s.riskLevel === 'Crítico');
        reply = `En el Registro de Sistemas de IA (AI Registry 360):\n\n` +
          `1. **TalentScout AI Candidate Sifter (SYS-AI-03)**: Se encuentra en estado **Condicional** en etapa de Evaluación. Requiere completar la evaluación de impacto en derechos fundamentales (FRIA).\n` +
          `2. **NovaScore Credit Scorer (SYS-AI-02)**: Clasificado como **Alto Riesgo (Anexo III EU AI Act)** con drift rate en 4.8%. Requiere re-calibración de pesos antes del 22 de Octubre.`;
        sources = ['AI Registry 360', 'Inventario Anexo III EU AI Act'];
      } else if (lower.includes('evidencia') || lower.includes('vencer') || lower.includes('expir')) {
        const expiring = state.evidences.filter(e => e.status === 'Por vencer' || e.status === 'Rechazado');
        reply = `En el Evidence Vault se registran **${expiring.length} evidencias que requieren atención urgente**:\n\n` +
          `• **EVD-2026-003**: Informe de Evaluación de Riesgos Algorítmicos (vence en 35 días).\n` +
          `• **EVD-2026-005**: Reporte de Paridad Estadística Q2-2026 (vence el 30 de Septiembre).\n` +
          `• **EVD-2026-008**: Reporte de Incidente PII (Estado: **Rechazado** por falta de firmas formales).`;
        sources = ['Evidence Vault', 'Repositorio de Auditoría SGIA'];
      } else if (lower.includes('auditor') || lower.includes('hallazgo') || lower.includes('no conformidad')) {
        const majFindings = state.findings.filter(f => f.type === 'No conformidad mayor');
        reply = `Actualmente está **En Ejecución** la *Auditoría Interna Anual del SGIA (AUD-INT-2026-01)* liderada por Jorge Hosato:\n\n` +
          `• Se ha levantado **1 No Conformidad Mayor (NC-MAJ-01)** por fuga de PII en salidas no estructuradas de LLM.\n` +
          `• Tiene asignado el plan de acción **CAPA-2026-01** a cargo del Ing. Rodrigo Méndez con fecha límite al 15 de Octubre.\n` +
          `• Preparación global para auditoría externa (Audit Readiness): **77.8%**.`;
        sources = ['Audit Workspace', 'Módulo CAPA'];
      } else {
        reply = `He procesado tu consulta: "${userText}".\n\n` +
          `Dentro del ecosistema integrado de gobernanza de Nova Compliance & AI:\n` +
          `• Salud Global del Sistema: **81.4%**\n` +
          `• Implementación Normativa: **78.5%**\n` +
          `• Sistemas de IA Operativos: **4 registrados**\n` +
          `• Controles ISO 42001/27001 Conformes: **83.2% de efectividad**.\n\n` +
          `Puedes preguntarme por auditorías, métricas de drift, inventario de datos o planes de acción.`;
        sources = ['Command Center Metrics', 'AIGobernanza Knowledge Engine'];
      }

      const assistantMsg: CopilotMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources
      };

      set((s) => ({
        copilotMessages: [...s.copilotMessages, assistantMsg]
      }));
    }, 600);
  },

  clearCopilotMessages: () => set({ copilotMessages: [] }),

  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q })
}));
