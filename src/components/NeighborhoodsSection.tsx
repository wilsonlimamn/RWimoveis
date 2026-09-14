import React from 'react';
import { MapPin, TrendingUp, ArrowRight, BookOpen, Compass, Check } from 'lucide-react';
import { BELEM_NEIGHBORHOODS, BelemNeighborhood } from '../data/belem-neighborhoods.ts';
import { getNeighborhoodGuideCleanUrl } from '../utils/seoRouter.ts';

interface NeighborhoodsSectionProps {
  onSelectNeighborhood: (neighborhoodName: string) => void;
  onOpenGuide: (neighborhood: BelemNeighborhood) => void;
  selectedNeighborhood?: string;
}

export const NeighborhoodsSection: React.FC<NeighborhoodsSectionProps> = ({
  onSelectNeighborhood,
  onOpenGuide,
  selectedNeighborhood
}) => {
  return (
    <section className="py-12 bg-neutral-900 text-white border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-xs">
                <Compass className="w-3.5 h-3.5" />
                Inteligência Imobiliária Local
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                Belém - Pará
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
              Bairros Nobres de Belém: Guias e Preço do m²
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Conteúdo profundo com dados reais de valorização por bairro. Conheça a infraestrutura, diferenciais e os imóveis selecionados em cada região.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>URLs Limpas indexáveis no Google para cada localização</span>
          </div>
        </div>

        {/* Neighborhood Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {BELEM_NEIGHBORHOODS.map((neighborhood) => {
            const isSelected = selectedNeighborhood?.toLowerCase() === neighborhood.name.toLowerCase();
            const cleanUrl = getNeighborhoodGuideCleanUrl(neighborhood.slug);

            return (
              <div
                key={neighborhood.id}
                className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-red-500 ring-2 ring-red-500/40 bg-neutral-800' 
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/60'
                }`}
              >
                {/* Image Cover */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={neighborhood.heroImage}
                    alt={`Bairro ${neighborhood.name} Belém`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-neutral-700/60">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {neighborhood.name}
                  </span>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="font-serif font-black text-white text-base">
                      R$ {neighborhood.averagePriceM2.toLocaleString('pt-BR')}<span className="text-[10px] font-sans font-normal text-neutral-300">/m²</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/70 text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5" />
                      +{neighborhood.appreciationRateYear}%
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {neighborhood.tagline}
                    </p>
                    
                    <div className="mt-2 text-[11px] text-neutral-400 font-mono truncate">
                      {cleanUrl}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                    <button
                      type="button"
                      onClick={() => onOpenGuide(neighborhood)}
                      className="px-2 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Abrir Guia Completo do Bairro"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Guia</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectNeighborhood(neighborhood.name)}
                      className={`px-2 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ativo</span>
                        </>
                      ) : (
                        <>
                          <span>Imóveis</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
