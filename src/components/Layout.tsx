import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { CopilotDrawer } from './CopilotDrawer';
import { OrganizationSelectorModal } from './OrganizationSelectorModal';

interface LayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPath, onNavigate, children }) => {
  const [isOrgModalOpen, setOrgModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Fixed Sidebar */}
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />

      {/* Main App Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenOrgSelector={() => setOrgModalOpen(true)}
          onNavigateAlerts={() => onNavigate('/alerts')}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/80 p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global Drawers & Modals */}
      <CopilotDrawer />
      <OrganizationSelectorModal
        isOpen={isOrgModalOpen}
        onClose={() => setOrgModalOpen(false)}
      />
    </div>
  );
};
