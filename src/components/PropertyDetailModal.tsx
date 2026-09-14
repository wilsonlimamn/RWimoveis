import React, { useState } from 'react';
import { 
  X, MapPin, Bed, Bath, Car, Maximize, Shield, 
  Calendar, CheckCircle2, Phone, Send, Heart, Eye, 
  ChevronLeft, ChevronRight, Share2 
} from 'lucide-react';
import { Property } from '../types.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { getPropertyCleanUrl } from '../utils/seoRouter.ts';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onSubmitLead: (leadData: {
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    source: 'Formulário de Interesse' | 'Agendamento de Visita' | 'Botão WhatsApp' | 'Visualização de Anúncio';
    notes: string;
  }) => Promise<void>;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onSubmitLead,
  isFavorite,
  onToggleFavorite
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`Olá! Tenho interesse no imóvel ${property.code} (${property.title}). Gostaria de mais informações e agendar uma visita.`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) return;

    setIsSubmitting(true);
    try {
      await onSubmitLead({
        name,
        email,
        phone,
        propertyId: property.id,
        source: 'Formulário de Interesse',
        notes: message
      });
      setSubmitSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanUrl = getPropertyCleanUrl(property);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}${cleanUrl}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppDirect = () => {
    // Also record lead to CRM from whatsapp click
    onSubmitLead({
      name: name.trim() || 'Visitante WhatsApp',
      email: email.trim() || 'whatsapp@lead.com',
      phone: phone.trim() || 'Não informado',
      propertyId: property.id,
      source: 'Botão WhatsApp',
      notes: `Lead clicou no botão de contato direto WhatsApp para o imóvel ${property.code} em ${property.neighborhood}, Belém-PA`
    });

    const text = encodeURIComponent(`Olá! Gostaria de falar sobre o imóvel ${property.code} - ${property.title} anunciado na RWimóveis Belém.`);
    window.open(`https://wa.me/5591981234567?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-neutral-900 text-white px-2.5 py-1 rounded-md">
              {property.code}
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
              {property.purpose}
            </span>
            <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-500">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>{property.viewsCount} visualizações registradas</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-full border transition-all ${
                isFavorite 
                  ? 'bg-red-50 border-red-200 text-red-600' 
                  : 'border-neutral-200 text-neutral-600 hover:text-red-600'
              }`}
              title="Favoritar"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-all relative"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 bg-neutral-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                  Link copiado!
                </span>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-2xl overflow-hidden bg-neutral-900 group">
              <img
                src={images[activeImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-mono px-2.5 py-1 rounded-md">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-red-600 scale-102 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main Details & Lead Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column (8 cols): Info, Description, Features */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-neutral-900">
                    {formatCurrency(property.price)}
                    {property.purpose === 'Alugar' && <span className="text-sm font-normal text-neutral-500"> /mês</span>}
                  </h2>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 leading-snug">
                  {property.title}
                </h1>

                <p className="text-sm text-neutral-600 flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{property.address} • {property.neighborhood}, {property.city} - {property.state}</span>
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-neutral-500 font-mono bg-neutral-100 px-3 py-1.5 rounded-lg border border-neutral-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-neutral-400 shrink-0">URL SEO:</span>
                  <span className="text-neutral-800 font-semibold truncate">{cleanUrl}</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 border border-neutral-200 shadow-xs">
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500">Quartos</span>
                    <span className="font-bold text-sm text-neutral-900">{property.bedrooms} ({property.suites} suítes)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 border border-neutral-200 shadow-xs">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500">Banheiros</span>
                    <span className="font-bold text-sm text-neutral-900">{property.bathrooms} banheiros</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 border border-neutral-200 shadow-xs">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500">Vagas</span>
                    <span className="font-bold text-sm text-neutral-900">{property.parkingSpots} vagas</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 border border-neutral-200 shadow-xs">
                    <Maximize className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-neutral-500">Área Útil</span>
                    <span className="font-bold text-sm text-neutral-900">{property.area} m²</span>
                  </div>
                </div>
              </div>

              {/* Monthly Costs Badges */}
              {(property.condoFee || property.iptu) && (
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-neutral-700 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  {property.condoFee ? <span>Condomínio estimado: <strong>{formatCurrency(property.condoFee)}/mês</strong></span> : null}
                  {property.iptu ? <span>IPTU: <strong>{formatCurrency(property.iptu)}/mês</strong></span> : null}
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Sobre este imóvel</h3>
                <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features and Amenities */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-neutral-900 mb-3">Diferenciais e Lazer</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-medium text-neutral-800 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                        <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (5 cols): CRM Lead Capture Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-4 bg-white rounded-3xl border border-neutral-200 p-6 shadow-xl space-y-5">
                <div className="border-b border-neutral-100 pb-4">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    Atendimento Exclusivo
                  </span>
                  <h3 className="text-lg font-extrabold text-neutral-900 mt-2">
                    Gostou deste imóvel?
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Preencha o formulário abaixo. Nossa equipe entrará em contato em minutos ou agende sua visita.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-emerald-900 text-base">
                      Solicitação Enviada com Sucesso!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Seu interesse foi registrado no CRM RWimóveis. Um consultor entrará em contato via WhatsApp ou telefone.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="text-xs text-neutral-700 underline font-semibold mt-2 block mx-auto"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Eduardo"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Telefone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="(11) 99999-9999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          E-mail
                        </label>
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Mensagem / Pergunta
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-xs text-neutral-700 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Registrando Lead...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Tenho Interesse / Agendar Visita</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Direct WhatsApp Call */}
                <div className="pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Falar Imediatamente no WhatsApp</span>
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-neutral-600 flex items-center justify-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-neutral-600" />
                    Seus dados estão protegidos pela RWimóveis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
