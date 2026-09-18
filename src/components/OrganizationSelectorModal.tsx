import React from 'react';
import { Building2, Check, Globe2, MapPin, Users, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface OrganizationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrganizationSelectorModal: React.FC<OrganizationSelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { organizations, currentOrganization, setOrganization } = useStore();

  const handleSelect = (id: string) => {
    setOrganization(id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleccionar Organización"
      subtitle="Elige el entorno de gobernanza y cumplimiento normativo corporativo"
      size="lg"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <div className="space-y-3">
        {organizations.map((org) => {
          const isSelected = org.id === currentOrganization.id;
          return (
            <div
              key={org.id}
              onClick={() => handleSelect(org.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{org.name}</h4>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Activa
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{org.legalName}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                      {org.sector}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {org.city}, {org.country}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {org.headcount} empleados
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {org.activeStandards.map((std) => (
                      <Badge key={std} variant="teal" size="sm" showDot={false}>
                        <Shield className="w-3 h-3 mr-1" />
                        {std}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant={isSelected ? 'primary' : 'outline'}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(org.id);
                }}
              >
                {isSelected ? 'Seleccionada' : 'Cambiar a esta'}
              </Button>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
