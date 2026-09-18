import { Risk, RequirementAssessment, ControlAssessment, EvidenceItem, AISystem } from '../types';

export function calculateGlobalHealth(
  requirements: RequirementAssessment[],
  controls: ControlAssessment[],
  evidences: EvidenceItem[],
  risks: Risk[]
) {
  // 1. Implementation score (0-100)
  const reqTotal = requirements.length || 1;
  const reqImplemented = requirements.filter(
    (r) => r.status === 'Implementado' || r.status === 'Implementado y mantenido' || r.status === 'Verificado'
  ).length;
  const implementationScore = Math.round((reqImplemented / reqTotal) * 100);

  // 2. Control effectiveness (0-100)
  const ctrlTotal = controls.length || 1;
  const ctrlSum = controls.reduce((acc, c) => acc + (c.effectiveness || 0), 0);
  const effectivenessScore = Math.round(ctrlSum / ctrlTotal);

  // 3. Evidence health (0-100)
  const evTotal = evidences.length || 1;
  const evValid = evidences.filter((e) => e.status === 'Válido').length;
  const evidenceScore = Math.round((evValid / evTotal) * 100);

  // 4. Risk penalty
  const criticalRisks = risks.filter((r) => r.residualLevel === 'Crítico' || r.inherentLevel === 'Crítico').length;
  const riskPenalty = criticalRisks * 3;

  // Composite health
  const rawHealth = implementationScore * 0.35 + effectivenessScore * 0.35 + evidenceScore * 0.30 - riskPenalty;
  const globalHealth = Math.max(10, Math.min(99, Math.round(rawHealth)));

  // Audit readiness
  const auditReadiness = Math.round((implementationScore * 0.5) + (evidenceScore * 0.3) + (effectivenessScore * 0.2));

  return {
    globalHealth,
    implementationScore,
    effectivenessScore,
    evidenceScore,
    auditReadiness,
    criticalRisksCount: criticalRisks
  };
}

export function getRiskMatrixData(risks: Risk[]) {
  // 5x5 matrix: Impact (1-5) on Y axis (5 top, 1 bottom) and Probability (1-5) on X axis
  const matrix: { [key: string]: Risk[] } = {};

  for (let p = 1; p <= 5; p++) {
    for (let i = 1; i <= 5; i++) {
      matrix[`${p}-${i}`] = [];
    }
  }

  risks.forEach((r) => {
    const key = `${r.probability}-${r.impact}`;
    if (matrix[key]) {
      matrix[key].push(r);
    }
  });

  return matrix;
}

export function getCellRiskLevel(probability: number, impact: number): 'Bajo' | 'Medio' | 'Alto' | 'Crítico' {
  const score = probability * impact;
  if (score >= 16) return 'Crítico';
  if (score >= 10) return 'Alto';
  if (score >= 5) return 'Medio';
  return 'Bajo';
}

export function getCellColor(level: 'Bajo' | 'Medio' | 'Alto' | 'Crítico'): string {
  switch (level) {
    case 'Crítico':
      return 'bg-red-500/15 border-red-300 text-red-700 hover:bg-red-500/25';
    case 'Alto':
      return 'bg-amber-500/15 border-amber-300 text-amber-700 hover:bg-amber-500/25';
    case 'Medio':
      return 'bg-blue-500/15 border-blue-300 text-blue-700 hover:bg-blue-500/25';
    case 'Bajo':
      return 'bg-teal-500/15 border-teal-300 text-teal-700 hover:bg-teal-500/25';
  }
}

export function getBadgeColor(status: string): { bg: string; text: string; border: string; dot: string } {
  const s = status.toLowerCase();

  if (s.includes('crítico') || s.includes('rechazado') || s.includes('mayor') || s.includes('brecha') || s.includes('inaceptable')) {
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
  }
  if (s.includes('alto') || s.includes('por vencer') || s.includes('en riesgo') || s.includes('condicional') || s.includes('menor')) {
    return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
  }
  if (s.includes('medio') || s.includes('planificado') || s.includes('en progreso') || s.includes('en revisión') || s.includes('observación')) {
    return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
  }
  if (s.includes('implementado') || s.includes('válido') || s.includes('aprobado') || s.includes('cerrado') || s.includes('conforme') || s.includes('activo') || s.includes('vigente') || s.includes('mínimo') || s.includes('optimizado')) {
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
  }

  return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
}
