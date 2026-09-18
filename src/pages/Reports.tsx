import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Cpu,
  BarChart3,
  Printer
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Tabs, TabItem } from '../components/ui/Tabs';

export const Reports: React.FC = () => {
  const { currentOrganization, risks, controls, auditFindings, aiSystems, evidences } = useStore();
  const [activeTab, setActiveTab] = useState('executive');
  const [exporting, setExporting] = useState<string | null>(null);

  const tabs: TabItem[] = [
    { id: 'executive', label: 'Informes Ejecutivos para Dirección' },
    { id: 'regulatory', label: 'Dossiers para Auditores & Regulador' },
    { id: 'exports', label: 'Exportador de Datos Crudos (CSV / JSON)' }
  ];

  const triggerExport = (name: string, type: 'json' | 'csv') => {
    setExporting(name);
    setTimeout(() => {
      let content = '';
      let mimeType = 'text/plain';
      let filename = `${name}_${new Date().toISOString().slice(0, 10)}`;

      if (type === 'json') {
        content = JSON.stringify(
          {
            reportTitle: name,
            generatedAt: new Date().toISOString(),
            organization: currentOrganization,
            totalRisks: risks.length,
            totalControls: controls.length,
            totalAISystems: aiSystems.length,
            totalFindings: auditFindings.length,
            totalEvidences: evidences.length
          },
          null,
          2
        );
        mimeType = 'application/json';
        filename += '.json';
      } else {
        content = 'Code,Title,Category,Status\n' + risks.map((r) => `${r.code},"${r.name}","${r.category || r.type}","${r.status}"`).join('\n');
        mimeType = 'text/csv';
        filename += '.csv';
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      setExporting(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Centro de Reportes & Dossiers Normativos
            </h1>
            <Badge variant="teal">Informes Certificados</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Generación automatizada de informes ejecutivos, declaraciones de aplicabilidad y dossiers para auditores externos.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          Imprimir / Guardar PDF
        </Button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB 1: INFORMES EJECUTIVOS */}
      {activeTab === 'executive' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
                  Dirección General / Board
                </span>
                <span className="text-xs text-slate-400">Mensual</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Informe Ejecutivo de Madurez del SGIA (ISO/IEC 42001)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Resumen de alto nivel con índice de salud global (88.5%), desglose por pilares normativos, mapa de calor de riesgos críticos y estado de planes de acción.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Formato: Dossier Oficial</span>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                loading={exporting === 'Informe_Madurez_SGIA'}
                onClick={() => triggerExport('Informe_Madurez_SGIA', 'json')}
              >
                Generar Informe
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Comité de Ética & Riesgos
                </span>
                <span className="text-xs text-slate-400">Trimestral</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Dossier de Evaluaciones de Impacto (FRIA & Algoritmos)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidado de evaluaciones de impacto en derechos fundamentales para los sistemas de IA clasificados en Alto Riesgo según Art. 27 del EU AI Act.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Formato: Informe Técnico</span>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                loading={exporting === 'Dossier_FRIA_EU_AI_Act'}
                onClick={() => triggerExport('Dossier_FRIA_EU_AI_Act', 'json')}
              >
                Generar Informe
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGULATORY DOSSIERS */}
      {activeTab === 'regulatory' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                  Auditor Externo (Fase 1 / Fase 2)
                </span>
                <span className="text-xs text-slate-400">Certificación</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Declaración de Aplicabilidad Oficial (SoA Integrada)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tabla completa de los 38 controles de ISO/IEC 42001 y 93 controles de ISO/IEC 27001 con justificaciones, niveles CMMI y referencias a evidencias probatorias.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Formato: SoA Certificada</span>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                loading={exporting === 'Declaracion_Aplicabilidad_SoA'}
                onClick={() => triggerExport('Declaracion_Aplicabilidad_SoA', 'json')}
              >
                Descargar SoA
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  Autoridad Supervisora
                </span>
                <span className="text-xs text-slate-400">Regulatorio</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Dossier de Documentación Técnica (Anexo IV EU AI Act)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paquete técnico estructurado que describe la arquitectura del modelo, datasets de entrenamiento, validación y medidas de ciberseguridad.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Formato: Expediente Regulador</span>
              <Button
                variant="primary"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                loading={exporting === 'Dossier_Tecnico_Anexo_IV'}
                onClick={() => triggerExport('Dossier_Tecnico_Anexo_IV', 'json')}
              >
                Descargar Dossier
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPORTS */}
      {activeTab === 'exports' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 max-w-2xl">
          <h3 className="text-base font-bold text-slate-900">Exportación de Datos para Análisis Externo</h3>
          <p className="text-xs text-slate-500">
            Descarga los datos tabulares en formato CSV para procesamiento en hojas de cálculo (Excel, BI) o JSON para integraciones API.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Inventario de Riesgos & Amenazas IA</h4>
                <span className="text-[11px] text-slate-500">{risks.length} registros</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => triggerExport('Riesgos_AIGobernanza', 'csv')}
              >
                Descargar CSV
              </Button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Catálogo de Controles & Efectividad SoA</h4>
                <span className="text-[11px] text-slate-500">{controls.length} registros</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-4 h-4" />}
                onClick={() => triggerExport('Controles_AIGobernanza', 'csv')}
              >
                Descargar CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
