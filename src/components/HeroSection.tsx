import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Property, PropertyPurpose, PropertyType } from '../types.ts';
import { formatCurrency } from '../utils/formatters.ts';

interface HeroSectionProps {
  featuredProperties: Property[];
  onSearch: (params: { purpose: PropertyPurpose; type: string; query: string }) => void;
  onSelectProperty: (property: Property) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredProperties,
  onSearch,
  onSelectProperty
}) => {
  const [activePurpose, setActivePurpose] = useState<PropertyPurpose>('Comprar');
  const [selectedType, setSelectedType] = useState<string>('Tipo de Imóvel');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);

  // Auto rotate hero featured properties every 6 seconds
  useEffect(() => {
    if (!featuredProperties || featuredProperties.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % featuredProperties.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredProperties]);

  const currentProperty = featuredProperties && featuredProperties.length > 0 
    ? featuredProperties[currentHeroIndex] 
    : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      purpose: activePurpose,
      type: selectedType,
      query: searchQuery
    });
  };

  const handlePrevSlide = () => {
    if (!featuredProperties.length) return;
    setCurrentHeroIndex(prev => (prev === 0 ? featuredProperties.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    if (!featuredProperties.length) return;
    setCurrentHeroIndex(prev => (prev + 1) % featuredProperties.length);
  };

  return (
    <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-neutral-950 text-white">
      {/* Background Slideshow of Featured Properties */}
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
        >
          {/* Dark gradient overlay for contrast and sleek luxury atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-900/60" />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full flex flex-col items-center text-center">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide mb-6">
          <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>Portfólio Exclusivo RWimóveis</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="text-neutral-300">Alto Padrão</span>
        </div>

        {/* Main Headline (Directly matching the prompt & image: "Encontre o imóvel ideal para você") */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight mb-8 drop-shadow-md">
          Encontre o imóvel <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-red-400">
            ideal para você
          </span>
        </h1>

        {/* Search Box Card Structure (matching layout from image) */}
        <div className="w-full max-w-4xl">
          {/* Tabs: Comprar, Alugar, Lançamentos */}
          <div className="flex items-center gap-2 pl-4 mb-2">
            {(['Comprar', 'Alugar', 'Lançamentos'] as PropertyPurpose[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePurpose(tab)}
                className={`px-5 py-2.5 rounded-t-xl text-sm font-bold transition-all ${
                  activePurpose === tab
                    ? 'bg-white text-neutral-900 shadow-lg'
                    : 'bg-black/60 text-neutral-300 hover:text-white hover:bg-black/80 backdrop-blur-md'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Inputs Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-2 text-neutral-800 border border-neutral-200"
          >
            {/* Property Type Dropdown */}
            <div className="w-full md:w-56 relative flex items-center border-b md:border-b-0 md:border-r border-neutral-200 px-3 py-2">
              <Building2 className="w-5 h-5 text-red-600 shrink-0 mr-2.5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-neutral-800 focus:outline-hidden cursor-pointer"
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
              <MapPin className="w-5 h-5 text-neutral-600 shrink-0 mr-2.5" />
              <input
                type="text"
                placeholder="Bairro ou região em Belém (ex: Umarizal, Nazaré, Batista Campos, Marco...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Button (Red & White Brand colors) */}
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Buscar</span>
            </button>
          </form>
        </div>

        {/* Featured Property Highlight Floating Bar (Hero Showcase) */}
        {currentProperty && (
          <div className="mt-8 sm:mt-10 flex items-center justify-between gap-4 max-w-2xl w-full bg-black/60 hover:bg-black/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 transition-all text-left">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={currentProperty.images[0]}
                alt={currentProperty.title}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0 border border-white/20"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/50">
                    Destaque #{currentHeroIndex + 1}
                  </span>
                  <span className="text-xs text-neutral-400 truncate">
                    {currentProperty.neighborhood}, {currentProperty.city} - {currentProperty.state}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white truncate mt-0.5">
                  {currentProperty.title}
                </h4>
                <p className="text-sm font-extrabold text-white">
                  {formatCurrency(currentProperty.price)}
                  {currentProperty.purpose === 'Alugar' && <span className="text-xs font-normal text-neutral-400">/mês</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectProperty(currentProperty)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors"
              >
                <span>Ver Imóvel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Slider controls */}
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                  onClick={handlePrevSlide}
                  className="p-1 rounded text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Anúncio anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1 text-neutral-400">
                  {currentHeroIndex + 1}/{featuredProperties.length}
                </span>
                <button
                  onClick={handleNextSlide}
                  className="p-1 rounded text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Próximo anúncio"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
