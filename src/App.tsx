import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { CommandCenter } from './pages/CommandCenter';
import { Implementation } from './pages/Implementation';
import { Governance } from './pages/Governance';
import { AIRegistry } from './pages/AIRegistry';
import { Risks } from './pages/Risks';
import { Controls } from './pages/Controls';
import { Evidences } from './pages/Evidences';
import { Documents } from './pages/Documents';
import { Audit } from './pages/Audit';
import { Performance } from './pages/Performance';
import { Reports } from './pages/Reports';
import { CalendarPage } from './pages/CalendarPage';
import { Alerts } from './pages/Alerts';
import { Settings } from './pages/Settings';

const AppShell: React.FC = () => {
  const { currentUser } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentUser) {
    return <Login onLoginSuccess={() => navigate('/')} />;
  }

  return (
    <Layout currentPath={location.pathname} onNavigate={(path) => navigate(path)}>
      <Routes>
        <Route path="/" element={<CommandCenter onNavigate={(path) => navigate(path)} />} />
        <Route path="/implementation" element={<Implementation />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/ai-registry" element={<AIRegistry />} />
        <Route path="/risks" element={<Risks />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/evidences" element={<Evidences />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
