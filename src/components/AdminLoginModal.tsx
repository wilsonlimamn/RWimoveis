import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, KeyRound, User } from 'lucide-react';
import { AdminAuth } from '../types.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (authData: AdminAuth) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('121212');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess({
          isAuthenticated: true,
          username: data.user.username,
          token: data.token
        });
        onClose();
      } else {
        setError(data.error || 'Credenciais inválidas.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('121212');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-200 animate-scale-in">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-black tracking-tight">Área Administrativa RWimóveis</h3>
          <p className="text-xs text-neutral-300 mt-1">
            Acesso ao CRM de Leads, Funil Kanban, Métricas de Visitas e Gestão de Anúncios.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Credential hint box */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 block text-[11px]">Credenciais do Sistema:</span>
              <span className="font-mono font-bold text-neutral-900">admin / 121212</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200"
            >
              Preencher
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Usuário
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm font-medium text-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="121212"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm font-medium text-neutral-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm tracking-wide shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
