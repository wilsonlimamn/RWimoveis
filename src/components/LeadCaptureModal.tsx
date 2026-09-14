import React, { useState } from 'react';
import { X, Send, CheckCircle2, Shield, Phone, Sparkles } from 'lucide-react';
import { Property } from '../types.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface LeadCaptureModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: {
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    source: 'Formulário de Interesse' | 'Agendamento de Visita' | 'Botão WhatsApp' | 'Visualização de Anúncio';
    notes: string;
  }) => Promise<void>;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  property,
  isOpen,
  onClose,
  onSubmit
}) => {
  if (!isOpen || !property) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestType, setInterestType] = useState<'visita' | 'proposta' | 'duvidas'>('visita');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setLoading(true);
    try {
      const typeLabel = interestType === 'visita' 
        ? 'Agendamento de Visita' 
        : interestType === 'proposta' 
        ? 'Envio de Proposta' 
        : 'Dúvidas Gerais';

      await onSubmit({
        name,
        email: email || 'cliente@site.com',
        phone,
        propertyId: property.id,
        source: 'Formulário de Interesse',
        notes: `[Interesse: ${typeLabel}] ${notes ? notes : `Gostaria de agendar visita ao imóvel ${property.code}`}`
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200 animate-scale-in">
        
        {/* Header with Property Mini Badge */}
        <div className="p-6 bg-gradient-to-br from-neutral-900 to-red-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-12 h-12 rounded-xl object-cover border border-white/20"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-mono font-bold bg-red-600 px-2 py-0.5 rounded text-white uppercase">
                {property.code}
              </span>
              <h4 className="text-sm font-bold text-white truncate max-w-xs mt-0.5">
                {property.title}
              </h4>
              <p className="text-xs font-black text-white">
                {formatCurrency(property.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-neutral-900">
                Interesse Registrado no CRM!
              </h3>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Nossa equipe de corretores especializados entrará em contato via WhatsApp nas próximas horas.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors"
              >
                Concluir e Voltar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setInterestType('visita')}
                  className={`py-2 rounded-lg font-bold transition-all text-center ${
                    interestType === 'visita' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                  }`}
                >
                  Agendar Visita
                </button>
                <button
                  type="button"
                  onClick={() => setInterestType('proposta')}
                  className={`py-2 rounded-lg font-bold transition-all text-center ${
                    interestType === 'proposta' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                  }`}
                >
                  Fazer Proposta
                </button>
                <button
                  type="button"
                  onClick={() => setInterestType('duvidas')}
                  className={`py-2 rounded-lg font-bold transition-all text-center ${
                    interestType === 'duvidas' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                  }`}
                >
                  Tirar Dúvidas
                </button>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  Mensagem Adicional (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de visitar no sábado pela manhã..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirmar Solicitação</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-[11px] text-neutral-500 flex items-center justify-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-neutral-400" />
                  Atendimento seguro direto com a imobiliária RWimóveis
                </span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
