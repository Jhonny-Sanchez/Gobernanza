export type StandardType = 'ISO/IEC 27001' | 'ISO/IEC 42001' | 'EU AI Act' | 'NIST AI RMF' | 'Integrado';

export type PriorityLevel = 'Baja' | 'Media' | 'Alta' | 'Crítica';

export type UserRole = 'Administrador' | 'Oficial de Cumplimiento' | 'Auditor Líder' | 'CISO / Seguridad' | 'AI Engineer / ML Lead' | 'Consultor' | 'Visualizador';

export type RiskCategory = 'Seguridad de Información' | 'Gobernanza de IA' | 'Privacidad' | 'Legal y Regulatorio' | 'Operativo' | 'Ético';

export type RequirementStatus = 
  | 'No evaluado'
  | 'Brecha'
  | 'Planificado'
  | 'Documentado'
  | 'Implementado'
  | 'Implementado y mantenido'
  | 'Verificado'
  | 'No aplica';

export type ProcessCategory = 'estratégico' | 'misional' | 'apoyo' | 'control';

export type RiskLevel = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

export type RiskTreatment = 'Mitigar' | 'Aceptar' | 'Transferir' | 'Evitar';

export type AIAutonomyLevel = 'Asistido' | 'Semi-autónomo' | 'Autónomo con supervisión' | 'Totalmente autónomo';

export type AISupervisionLevel = 'Human-in-the-loop' | 'Human-on-the-loop' | 'Human-in-command';

export type AICriticality = 'Baja' | 'Media' | 'Alta' | 'Extrema';

export type AILifecycleStage = 
  | 'Idea'
  | 'Evaluación'
  | 'Diseño'
  | 'Desarrollo'
  | 'Validación'
  | 'Aprobación'
  | 'Despliegue'
  | 'Operación'
  | 'Monitoreo'
  | 'Cambio'
  | 'Suspensión'
  | 'Retiro'
  | 'Baja definitiva';

export type AIApprovalStatus = 'Aprobado' | 'En revisión' | 'Pendiente' | 'Rechazado' | 'Condicional';

export type EvidenceStatus = 'Válido' | 'Por vencer' | 'Pendiente' | 'Expirado' | 'Rechazado';

export type DocumentStatus = 'Borrador' | 'En revisión' | 'Aprobado' | 'Obsoleto';

export type FindingType = 'No conformidad mayor' | 'No conformidad menor' | 'Observación' | 'Oportunidad de mejora' | 'No conformidad Mayor' | 'No conformidad Menor';

export type FindingStatus = 'Abierto' | 'En análisis' | 'Plan de acción' | 'Verificación de eficacia' | 'Cerrado';

export type CAPAType = 'Correctiva' | 'Preventiva' | 'Mejora';

export type CAPAStatus = 'Planeada' | 'En Progreso' | 'Implementada' | 'Verificada' | 'Cerrada';

export type AlertSeverity = 'CRÍTICO' | 'ALTO' | 'MEDIO' | 'BAJO' | 'Crítica' | 'Alta' | 'Media' | 'Baja';

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  sector: string;
  country: string;
  city: string;
  activeStandards: string[];
  headcount: number;
  logoUrl?: string;
  cisoName: string;
  aiOfficerName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  title?: string;
  avatarUrl?: string;
  organizationIds: string[];
}

export interface RequirementAssessment {
  id: string;
  organizationId: string;
  standard: StandardType;
  clause: string;
  requirement: string;
  description: string;
  applicability: boolean;
  justification?: string;
  status: RequirementStatus;
  implementationPercentage: number;
  evidenceIds: string[];
  effectiveness: number; // 0-100
  priority: PriorityLevel;
  owner: string;
  targetDate: string;
  notes?: string;
}

export interface ImplementationAction {
  id: string;
  organizationId: string;
  title: string;
  standard: StandardType;
  phase: string;
  assignedTo: string;
  dueDate: string;
  startDate: string;
  progress: number;
  priority: PriorityLevel;
  status: 'Por iniciar' | 'En progreso' | 'Bloqueado' | 'Completado';
  dependencies: string[];
  clauseRef?: string;
}

export interface Process {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description: string;
  objective: string;
  scope: string;
  category: ProcessCategory;
  owner: string;
  criticality: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  reviewFrequency: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
  lastReviewDate: string;
  nextReviewDate: string;
  status: 'Activo' | 'En revisión' | 'Inactivo';
  inputs: string[];
  activities: string[];
  outputs: string[];
  clients: string[];
  suppliers: string[];
  kpiIds: string[];
  riskIds: string[];
  controlIds: string[];
  aiSystemIds: string[];
}

export interface Stakeholder {
  id: string;
  organizationId: string;
  name: string;
  type: 'Interno' | 'Externo';
  category: 'Clientes' | 'Reguladores' | 'Accionistas' | 'Empleados' | 'Proveedores' | 'Comunidad';
  needs: string;
  expectations: string;
  requirements: string[];
  legalRequirements: string[];
  contractualRequirements: string[];
  affectedProcesses: string[];
  standards: StandardType[];
  owner: string;
  communicationFrequency: string;
  status: 'Activo' | 'Monitoreado' | 'Inactivo';
}

export interface GovernanceRole {
  id: string;
  organizationId: string;
  title: string;
  holderName: string;
  authorityLevel: string;
  responsibilities: string[];
  associatedProcesses: string[];
  standards: StandardType[];
  assignedDate: string;
  reviewDate: string;
  evidenceRef: string;
  status: 'Vigente' | 'Pendiente revisión' | 'Vacante';
}

export interface Objective {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description: string;
  expectedResult: string;
  baseline: number;
  target: number;
  currentValue: number;
  unit: string;
  owner: string;
  frequency: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';
  measurementMethod: string;
  status: 'En curso' | 'En riesgo' | 'Retrasado' | 'Completado';
}

export interface Indicator {
  id: string;
  organizationId: string;
  objectiveId: string;
  name: string;
  code: string;
  formula: string;
  targetValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  dataSource: string;
  currentValue: number;
  unit: string;
  history: { date: string; value: number }[];
}

export interface AISystem {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description?: string;
  type: 'LLM Generativo' | 'Modelo Predictivo' | 'Visión por Computadora' | 'Procesamiento de Lenguaje' | 'Recomendador' | 'Automatización / Agente' | 'Generativo (LLM)' | 'Predictivo' | 'NLP' | 'Visión' | 'Agente Autónomo' | string;
  processId: string;
  businessOwner: string;
  technicalOwner: string;
  provider: string;
  model: string;
  version?: string;
  purpose?: string;
  intendedUse?: string;
  prohibitedUses?: string[];
  usersDescription?: string;
  affectedGroups?: string[];
  developmentType?: 'Interno' | 'Externo' | 'Híbrido' | 'SaaS Tercero';
  deploymentEnvironment?: 'Cloud Propio' | 'Cloud Proveedor' | 'On-Premise' | 'Edge';
  autonomyLevel?: AIAutonomyLevel;
  humanSupervisionLevel?: AISupervisionLevel;
  humanOverrideCapability?: boolean;
  personalDataUsed?: boolean;
  sensitiveDataUsed?: boolean;
  confidentialDataUsed?: boolean;
  decisionImpact?: 'Decisión Automatizada Crítica' | 'Soporte a la Decisión' | 'Recomendación Informativa' | 'Generación de Contenido';
  impactLevel?: 'Bajo' | 'Medio' | 'Alto' | 'Muy Alto';
  riskLevel: RiskLevel;
  classification?: 'Riesgo Inaceptable' | 'Alto Riesgo (Anexo III)' | 'Riesgo de Transparencia' | 'Riesgo Mínimo';
  approvalStatus?: AIApprovalStatus;
  lifecycleStage?: AILifecycleStage;
  firstUseDate?: string;
  lastReviewDate?: string;
  nextReviewDate?: string;
  jurisdictions?: string[];
  criticality?: AICriticality;
  dataResourceIds?: string[];
  incidentCount?: number;
  useCase?: string;
  environment?: string;
  deploymentDate?: string;
  humanOversight?: string;
  architecture?: string;
  dataLineage?: string[];
  governanceStatus?: string;
  ethicalImpact?: string;
  friaCompleted?: boolean;
}

export type AIRiskLevel = RiskLevel;
export type AISystemType = AISystem['type'];

export interface AIImpactAssessment {
  id: string;
  aiSystemId: string;
  category: 'Personas' | 'Sociedad' | 'Ética' | 'Privacidad' | 'Seguridad' | 'Discriminación / Sesgo' | 'Transparencia' | 'Explicabilidad' | 'Derechos Fundamentales' | 'Impacto Operativo';
  evaluationScore: number; // 1-5
  level: RiskLevel;
  justification: string;
  mitigationMeasures: string | string[];
  responsible: string;
  evaluationDate: string;
  date?: string;
  title?: string;
  impactSummary?: string;
  status: 'Evaluado' | 'En revisión' | 'Mitigación requerida' | 'Aprobado';
}

export interface AIDataResource {
  id: string;
  aiSystemId: string;
  datasetName: string;
  origin: string;
  owner: string;
  purpose: string;
  classification: 'Pública' | 'Interna' | 'Confidencial' | 'Altamente Confidencial';
  personalData: boolean;
  sensitiveData: boolean;
  qualityScore: number; // 0-100
  traceabilityStatus: 'Completa' | 'Parcial' | 'No documentada';
  retentionPeriod: string;
  controlsApplied: string[];
}

export interface AILifecycleEvent {
  id: string;
  aiSystemId: string;
  stage: AILifecycleStage;
  date: string;
  author: string;
  description: string;
  approvalReference?: string;
}

export type IncidentStatus = 'Abierto' | 'Investigando' | 'Mitigado' | 'Cerrado' | 'En contención';

export interface AIIncident {
  id: string;
  code?: string;
  title?: string;
  aiSystemId: string;
  date: string;
  timestamp?: string;
  type: 'Alucinación crítica' | 'Fuga de datos' | 'Sesgo discriminatorio' | 'Indisponibilidad del modelo' | 'Vulnerabilidad / Inyección' | 'Decisión anómala';
  severity: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  description: string;
  impact: string;
  rootCause: string;
  causeVector?: string;
  actionsTaken: string;
  responsible: string;
  owner?: string;
  status: IncidentStatus;
  resolutionDate?: string;
}

export interface AIMetrics {
  aiSystemId: string;
  accuracy: number;
  biasScore: number; // lower is better, 0-10
  latencyMs: number;
  availabilityPercent: number;
  reliabilityScore: number;
  driftRate: number; // %
  monthlyErrors: number;
  history: {
    date: string;
    accuracy: number;
    latency: number;
    drift: number;
  }[];
}

export interface AIProvider {
  id: string;
  organizationId: string;
  name: string;
  service: string;
  modelsProvided: string[];
  contractRef: string;
  country: string;
  jurisdiction: string;
  risksIdentified: string[];
  evaluationScore: number; // 0-100
  status: 'Homologado' | 'En evaluación' | 'Condicional' | 'No recomendado';
  lastReviewDate: string;
  nextReviewDate: string;
}

export interface Risk {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  type: 'Seguridad de Información' | 'Gobernanza de IA' | 'Privacidad' | 'Legal y Regulatorio' | 'Operativo' | 'Ético';
  category?: string;
  description: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  inherentProbability?: number;
  inherentImpact?: number;
  inherentScore?: number;
  inherentLevel: RiskLevel;
  controlsApplied: string[];
  controlIds?: string[];
  owner: string;
  treatment: RiskTreatment;
  treatmentStrategy?: string;
  residualProbability: 1 | 2 | 3 | 4 | 5;
  residualImpact: 1 | 2 | 3 | 4 | 5;
  residualScore?: number;
  residualLevel: RiskLevel;
  status: 'Abierto' | 'En tratamiento' | 'Mitigado' | 'Aceptado';
  aiSystemId?: string;
  processId?: string;
}

export type ControlImplementationStatus = 'No implementado' | 'Planificado' | 'En implementación' | 'Implementado' | 'Optimizado';

export interface ControlAssessment {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  standard: StandardType;
  domain: string;
  description: string;
  applicability: boolean;
  applicable?: boolean;
  justification: string;
  implementationStatus: ControlImplementationStatus;
  status?: string;
  maturityLevel: 0 | 1 | 2 | 3 | 4 | 5;
  owner: string;
  evidenceIds: string[];
  testResult: 'Conforme' | 'No conforme' | 'Pendiente de prueba' | 'Con observaciones';
  effectiveness: number; // 0-100
  lastReviewDate: string;
  lastEvaluatedDate?: string;
  verificationMethod?: string;
  frequency?: string;
}

export type Control = ControlAssessment;

export interface EvidenceItem {
  id: string;
  organizationId: string;
  code: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  expirationDate: string;
  status: EvidenceStatus | string;
  owner: string;
  controlCodes: string[];
  requirementClauses: string[];
  auditRef?: string;
  downloadUrl?: string;
  type?: string;
  standard?: StandardType | string;
  version?: string;
  issueDate?: string;
  expiryDate?: string;
  sha256Hash?: string;
}

export type Evidence = EvidenceItem;

export interface DocumentItem {
  id: string;
  organizationId: string;
  code: string;
  title: string;
  category?: 'Política' | 'Procedimiento' | 'Manual' | 'Instructivo' | 'Registro' | 'Plantilla' | string;
  type?: string;
  version: string;
  standards: StandardType[];
  processId?: string;
  controlCodes?: string[];
  status: DocumentStatus;
  author: string;
  approvedBy?: string;
  approver?: string;
  approvalDate?: string;
  nextReviewDate?: string;
  content?: string;
  lastUpdated?: string;
}

export interface KPIMetric {
  id: string;
  code: string;
  name: string;
  category: string;
  target: number;
  currentValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  frequency: string;
  status: string;
  history?: { date: string; value: number }[];
}

export interface ModelMetric {
  id: string;
  modelName: string;
  latency: number;
  drift: number;
  accuracy: number;
  requestsCount: number;
  status: string;
}

export interface AuditSession {
  id: string;
  organizationId: string;
  code: string;
  title: string;
  standard: StandardType;
  standards?: string[];
  type: 'Interna' | 'Externa' | 'Revisión por la Dirección';
  status: 'Planificada' | 'En ejecución' | 'Completada' | 'Informe emitido';
  startDate: string;
  endDate: string;
  leadAuditor: string;
  teamMembers?: string[];
  scope: string;
  findingsCount: {
    major: number;
    minor: number;
    observation: number;
    opportunity: number;
  };
}

export interface AuditFinding {
  id: string;
  auditId: string;
  code: string;
  title: string;
  type: FindingType;
  standard: StandardType;
  clauseRef: string;
  clause?: string;
  description: string;
  evidenceRef: string;
  status: FindingStatus;
  identifiedDate: string;
  responsible: string;
  owner?: string;
  dueDate?: string;
  rootCause?: string;
  correctiveAction?: string;
  targetClosureDate: string;
  capaId?: string;
}

export type AuditProgram = AuditSession;

export interface CAPAItem {
  id: string;
  organizationId: string;
  code: string;
  title: string;
  findingId?: string;
  type: CAPAType;
  rootCauseAnalysis: string;
  actionPlan: string;
  responsible: string;
  dueDate: string;
  status: CAPAStatus;
  effectivenessVerified: boolean;
  verificationDate?: string;
}

export interface SystemAlert {
  id: string;
  organizationId: string;
  severity: AlertSeverity;
  type: 'Riesgo Crítico' | 'Evidencia por Vencer' | 'Desviación de Métrica IA' | 'Incidente Activo' | 'Auditoría Pendiente' | 'Brecha Normativa' | string;
  message: string;
  title?: string;
  entityType?: 'aiSystem' | 'risk' | 'evidence' | 'audit' | 'requirement' | string;
  entityId?: string;
  date?: string;
  timestamp?: string;
  module?: string;
  resolved: boolean;
  acknowledged?: boolean;
  read?: boolean;
}

export type AlertItem = SystemAlert;

export interface ActivityLog {
  id: string;
  organizationId: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'AI' | 'Riesgo' | 'Control' | 'Auditoría' | 'Gobernanza' | 'Evidencia';
  details: string;
}

export interface HealthSnapshot {
  globalHealth: number;
  implementation: number;
  evidences: number;
  effectiveness: number;
  auditReadiness: number;
  evolutionHistory: {
    date: string;
    health: number;
    implementation: number;
    evidences: number;
    effectiveness: number;
  }[];
}
