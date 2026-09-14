import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Building2,
  TreePine,
  Sparkles
} from 'lucide-react';
import { BelemNeighborhood } from '../data/belem-neighborhoods.ts';
import { getNeighborhoodGuideCleanUrl } from '../utils/seoRouter.ts';

interface NeighborhoodGuideModalProps {
  neighborhood: BelemNeighborhood;
  onClose: () => void;
  onFilterNeighborhood: (neighborhoodName: string) => void;
  onLeadSubmitted: (lead: any) => void;
}

export const NeighborhoodGuideModal: React.FC<NeighborhoodGuideModalProps> = ({
  neighborhood,
  onClose,
  onFilterNeighborhood,
  onLeadSubmitted
}) => {
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPropertyType, setOwnerPropertyType] = useState('Apartamento');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const handleOwnerLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || (!ownerPhone && !ownerEmail)) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ownerName,
          phone: ownerPhone,
          email: ownerEmail,
          source: 'Formulário de Interesse',
          notes: `Proprietário solicitando avaliação gratuita de ${ownerPropertyType} no bairro ${neighborhood.name}, Belém-PA.`,
          stage: 'novo'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setLeadSuccess(true);
        if (onLeadSubmitted) onLeadSubmitted(data.lead);
      }
    } catch (err) {
      console.error('Erro ao enviar contato de captação:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanUrl = getNeighborhoodGuideCleanUrl(neighborhood.slug);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 my-8">
        
        {/* Header with image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img 
            src={neighborhood.heroImage} 
            alt={`Bairro ${neighborhood.name} Belém PA`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges and titles */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Compass className="w-3.5 h-3.5" />
                Guia de Bairro • Belém - PA
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                SEO & GEO Local
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-serif">
              {neighborhood.name}
            </h2>
            <p className="text-sm sm:text-base text-neutral-200 mt-1 max-w-2xl">
              {neighborhood.tagline}
            </p>
          </div>
        </div>

        {/* URL Limpa Indicator */}
        <div className="bg-neutral-900 text-neutral-300 px-6 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-400">URL Canônica Indexável pelo Google:</span>
            <code className="font-mono text-emerald-400 bg-neutral-800 px-2 py-0.5 rounded text-[11px]">
              {cleanUrl}
            </code>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">
            Sem parâmetros (?) • 100% Otimizado para Busca Local
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[calc(85vh-20rem)] overflow-y-auto">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Preço Médio / m²</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-neutral-900 font-serif">
                R$ {neighborhood.averagePriceM2.toLocaleString('pt-BR')}
              </p>
              <span className="text-[11px] text-neutral-500">Base Belém 2026</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mb-1">
                <TrendingUp className="w-4 h-4 text-red-600" />
                <span>Valorização Anual</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-red-600 font-serif">
                +{neighborhood.appreciationRateYear}%
              </p>
              <span className="text-[11px] text-neutral-500">Últimos 12 meses</span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Segurança</span>
              </div>
              <p className="text-sm font-bold text-neutral-900 mt-1 line-clamp-2">
                {neighborhood.safetyRating}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 mb-1">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Estilo de Vida</span>
              </div>
              <p className="text-xs font-medium text-neutral-800 mt-1 line-clamp-3">
                {neighborhood.lifestyle}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-600" />
              <span>Sobre o bairro {neighborhood.name} em Belém</span>
            </h3>
            <p className="text-neutral-700 leading-relaxed text-sm sm:text-base">
              {neighborhood.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-600" />
              <span>Diferenciais e Pontos de Referência</span>
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {neighborhood.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-neutral-700 bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avenues */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 flex flex-wrap items-center gap-2">
            <span className="font-bold text-neutral-900 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" /> Principais vias:
            </span>
            {neighborhood.keyAvenues.map((ave, i) => (
              <span key={i} className="px-2.5 py-1 bg-white rounded-md border border-neutral-300 font-medium">
                {ave}
              </span>
            ))}
          </div>

          {/* CTA: Ver Imóveis */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-red-600 to-red-700 rounded-xl text-white shadow-md">
            <div>
              <h4 className="font-bold text-base">Encontre seu imóvel em {neighborhood.name}</h4>
              <p className="text-xs text-red-100">Veja as oportunidades selecionadas com vista e localização privilegiada.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onFilterNeighborhood(neighborhood.name);
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white text-red-700 font-bold text-xs hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>Ver Imóveis em {neighborhood.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Proprietário: Captação de Imóveis (Lead capture for sellers) */}
          <div className="p-6 rounded-xl bg-neutral-900 text-white border border-neutral-800">
            <div className="max-w-xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">
                Para Proprietários
              </span>
              <h4 className="text-lg font-bold text-white mt-1">
                Quer vender ou avaliar seu imóvel em {neighborhood.name}?
              </h4>
              <p className="text-xs text-neutral-400 mt-1">
                Receba uma avaliação mercadológica precisa com base nos valores praticados no metro quadrado do bairro.
              </p>
            </div>

            {leadSuccess ? (
              <div className="mt-4 p-4 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Solicitação recebida com sucesso! Nosso especialista no bairro {neighborhood.name} entrará em contato em instantes.</span>
              </div>
            ) : (
              <form onSubmit={handleOwnerLeadSubmit} className="mt-4 grid sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-xs placeholder:text-neutral-500 focus:outline-hidden focus:border-red-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp com DDD (91)"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="px-3.5 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-xs placeholder:text-neutral-500 focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Enviando...' : 'Avaliar Gratuitamente'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
