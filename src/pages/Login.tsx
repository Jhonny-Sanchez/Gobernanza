import React, { useState } from 'react';
import { Cpu, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login } = useStore();
  const [email, setEmail] = useState('j-hosato@hotmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor introduce tu correo corporativo');
      return;
    }
    const success = login(email, password);
    if (success) {
      onLoginSuccess();
    }
  };

  const handleDemoLogin = () => {
    login('j-hosato@hotmail.com', 'password123');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Left side: Branding & Value proposition */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-12 flex-col justify-between border-r border-slate-800 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white tracking-wide">AIGobernanza</span>
              <span className="text-xl font-extrabold text-teal-400">360</span>
            </div>
            <p className="text-xs text-slate-400">Enterprise AI Trust & Compliance Operating System</p>
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-6 max-w-lg relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ISO/IEC 42001 & ISO/IEC 27001 Certified Ready</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Gobernanza holística de Inteligencia Artificial para empresas líderes.
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed">
            Plataforma 360° para inventario algorítmico, mitigación de sesgo, prevención de fuga de datos en LLMs, evaluación de impacto ético y preparación continua para auditoría externa.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>AI Registry 360</span>
              </div>
              <p className="text-xs text-slate-400">Catálogo auditable y mapeo relacional de modelos y RAG.</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Audit Workspace</span>
              </div>
              <p className="text-xs text-slate-400">Gestión de no conformidades, hallazgos y planes CAPA.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 relative z-10 flex items-center justify-between">
          <span>© 2026 AIGobernanza 360 Inc.</span>
          <span>Cumplimiento con EU AI Act & RGPD</span>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-600">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">AIGobernanza</span>
              <span className="text-lg font-extrabold text-teal-600">360</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Acceso Corporativo</h2>
            <p className="text-sm text-slate-500 mt-1">
              Ingresa tus credenciales para acceder al centro de gobernanza
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Correo Electrónico Corporativo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@corporacion.com"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => alert('Para soporte o restablecimiento contacte a ciso@aigobernanza.com')}
                  className="text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer">
                Recordar esta sesión en este dispositivo seguro
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-3">Acceso rápido para evaluación de plataforma:</p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={handleDemoLogin}
            >
              Entrar como Lead AI Auditor (Demo Nova)
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              Autenticación protegida con TLS 1.3, MFA y arquitectura compatible con Firebase Auth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
