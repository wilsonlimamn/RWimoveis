import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Building2, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Bed, Car, Maximize } from 'lucide-react';
import { Property, PropertyPurpose } from '../types.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface HeroSectionProps {
  featuredProperties: Property[];
  onSearch: (params: { purpose: PropertyPurpose | 'Todos'; type: string; query: string }) => void;
  onSelectProperty: (property: Property) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProperties,
  onSearch,
  onSelectProperty
}) => {
  const [selectedType, setSelectedType] = useState<string>('Tipo de Imóvel');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalFeatured = featuredProperties.length;

  // Auto rotate hero featured properties every 6 seconds (pauses on hover)
  useEffect(() => {
    if (totalFeatured <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % totalFeatured);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalFeatured, isPaused]);

  const currentProperty = totalFeatured > 0 ? featuredProperties[currentHeroIndex] : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      purpose: 'Todos',
      type: selectedType,
      query: searchQuery
    });
  };

  const handlePrevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalFeatured === 0) return;
    setCurrentHeroIndex(prev => (prev === 0 ? totalFeatured - 1 : prev - 1));
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalFeatured === 0) return;
    setCurrentHeroIndex(prev => (prev + 1) % totalFeatured);
  };

  return (
    <div 
      className="relative min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-between overflow-hidden bg-neutral-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slideshow of Featured Properties - 100% Bright, Natural & Clear (No dark filter) */}
      {featuredProperties.map((prop, idx) => (
        <div
          key={prop.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentHeroIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
          }`}
          style={{
            backgroundImage: `url(${prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />
      ))}

      {/* Manual Slide Navigation Arrows on the edges */}
      {totalFeatured > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-red-600 shadow-xl border border-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            aria-label="Imóvel em destaque anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-neutral-800 hover:text-red-600 shadow-xl border border-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            aria-label="Próximo imóvel em destaque"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Top Floating Search Bar */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Search Inputs Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-2xl flex flex-col md:flex-row items-center gap-2 text-neutral-800 border border-white/80"
        >
          {/* Property Type Dropdown */}
          <div className="w-full md:w-56 relative flex items-center border-b md:border-b-0 md:border-r border-neutral-200 px-3 py-2">
            <Building2 className="w-4 h-4 text-red-600 shrink-0 mr-2" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 focus:outline-hidden cursor-pointer"
            >
              <option value="Tipo de Imóvel">Tipo de Imóvel</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Cobertura">Cobertura</option>
              <option value="Studio">Studio</option>
              <option value="Terreno">Terreno</option>
            </select>
          </div>

          {/* City / Neighborhood Input */}
          <div className="w-full md:flex-1 relative flex items-center px-3 py-2">
            <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mr-2" />
            <input
              type="text"
              placeholder="Bairro ou região em Belém (ex: Umarizal, Nazaré, Batista Campos, Marco...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-hidden"
            >
            </input>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </form>
      </div>

      {/* Bottom Floating Featured Property Showcase Card with Compact Brief Description & Transparent Glass Frame */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-7 pt-4">
        {currentProperty && (
          <div className="max-w-lg sm:max-w-xl bg-black/45 hover:bg-black/55 backdrop-blur-md rounded-2xl p-4 sm:p-4.5 shadow-2xl border border-white/25 text-white transition-all">
            
            {/* Header: Badge Destaque + Localização + Contador */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-red-300 bg-red-950/80 border border-red-800/60 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-red-400 fill-red-400" />
                  Destaque
                </span>
                <span className="text-[11px] sm:text-xs font-medium text-neutral-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                  {currentProperty.neighborhood}, {currentProperty.city}
                </span>
              </div>

              {/* Slide numbers indicator */}
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-neutral-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                <span className="text-red-400">{currentHeroIndex + 1}</span>
                <span className="text-neutral-500">/</span>
                <span>{totalFeatured}</span>
              </div>
            </div>

            {/* Title */}
            <h3 
              onClick={() => onSelectProperty(currentProperty)}
              className="text-sm sm:text-base font-bold text-white tracking-tight hover:text-red-300 transition-colors cursor-pointer line-clamp-1 drop-shadow-xs"
            >
              {currentProperty.title}
            </h3>

            {/* Breve Descrição menor solicitada */}
            <p className="text-[11px] sm:text-xs text-neutral-200/90 mt-1 line-clamp-1 leading-relaxed">
              {currentProperty.description}
            </p>

            {/* Quick Specs / Características + Preço + Botão Ver Imóvel */}
            <div className="flex items-center justify-between gap-3 mt-2.5 pt-2.5 border-t border-white/15">
              <div className="flex items-center gap-3 text-[11px] font-medium text-neutral-200">
                <div className="flex items-center gap-1">
                  <Maximize className="w-3.5 h-3.5 text-red-400" />
                  <span>{currentProperty.area} m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-red-400" />
                  <span>{currentProperty.bedrooms} qtos</span>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-red-400" />
                  <span>{currentProperty.parkingSpots} vagas</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Dots indicators */}
                {totalFeatured > 1 && (
                  <div className="hidden sm:flex items-center gap-1">
                    {featuredProperties.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentHeroIndex(i)}
                        className={`transition-all rounded-full cursor-pointer ${
                          i === currentHeroIndex
                            ? 'w-4 h-1.5 bg-red-500'
                            : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Ir para imóvel em destaque ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                <div className="text-right">
                  <span className="text-sm sm:text-base font-extrabold text-white drop-shadow-xs">
                    {formatCurrency(currentProperty.price)}
                    {currentProperty.purpose === 'Alugar' && <span className="text-[10px] font-normal text-neutral-300">/mês</span>}
                  </span>
                </div>

                <button
                  onClick={() => onSelectProperty(currentProperty)}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Imóvel</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
