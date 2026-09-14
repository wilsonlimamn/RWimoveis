import React from 'react';
import { Heart, MapPin, Bed, Bath, Car, Maximize, Eye, Sparkles } from 'lucide-react';
import { Property } from '../types.ts';
import { formatCurrency } from '../utils/formatters.ts';
import { getPropertyCleanUrl } from '../utils/seoRouter.ts';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onOpenInterestModal: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (propertyId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onOpenInterestModal,
  isFavorite,
  onToggleFavorite
}) => {
  const cleanUrl = getPropertyCleanUrl(property);

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-red-200 transition-all duration-300 flex flex-col">
      {/* Image container with badges & favorite button */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
        <a 
          href={cleanUrl}
          onClick={(e) => {
            e.preventDefault();
            onSelect(property);
          }}
          className="block w-full h-full cursor-pointer"
        >
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </a>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
          {property.featured && (
            <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Destaque
            </span>
          )}
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
            {property.purpose}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
            isFavorite 
              ? 'bg-red-600 text-white shadow-md' 
              : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-red-600 shadow-sm'
          }`}
          aria-label="Salvar favorito"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Views counter tag */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-medium px-2 py-0.5 rounded flex items-center gap-1 pointer-events-none">
          <Eye className="w-3 h-3 text-red-400" />
          <span>{property.viewsCount || 0} visitas</span>
        </div>

        {/* Code Tag */}
        <div className="absolute bottom-3 right-3 bg-neutral-900/80 backdrop-blur-md text-neutral-200 text-[10px] font-mono px-2 py-0.5 rounded pointer-events-none">
          {property.code}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header (Matching design from image) */}
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl font-black text-neutral-900 tracking-tight">
              {formatCurrency(property.price)}
            </span>
            {property.purpose === 'Alugar' && (
              <span className="text-xs font-semibold text-neutral-500">/mês</span>
            )}
          </div>

          {/* Property Type and Bedrooms (Exact format: "Apartamento • 3 quartos") */}
          <h3 className="line-clamp-1 mb-1">
            <a
              href={cleanUrl}
              onClick={(e) => {
                e.preventDefault();
                onSelect(property);
              }}
              className="text-sm font-bold text-neutral-800 hover:text-red-600 transition-colors cursor-pointer"
            >
              {property.type} • {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}
            </a>
          </h3>

          {/* Location line with map pin */}
          <p className="text-xs text-neutral-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="truncate">{property.neighborhood}, {property.city} - {property.state}</span>
          </p>

          {/* Key Specs Icons Strip */}
          <div className="grid grid-cols-4 gap-2 py-2.5 px-2 bg-neutral-50 rounded-xl text-neutral-700 text-xs border border-neutral-100 mb-4">
            <div className="flex flex-col items-center text-center" title={`${property.bedrooms} Quartos`}>
              <Bed className="w-4 h-4 text-neutral-500 mb-0.5" />
              <span className="font-bold text-[11px]">{property.bedrooms} qtos</span>
            </div>
            <div className="flex flex-col items-center text-center" title={`${property.bathrooms} Banheiros`}>
              <Bath className="w-4 h-4 text-neutral-500 mb-0.5" />
              <span className="font-bold text-[11px]">{property.bathrooms} banh</span>
            </div>
            <div className="flex flex-col items-center text-center" title={`${property.parkingSpots} Vagas`}>
              <Car className="w-4 h-4 text-neutral-500 mb-0.5" />
              <span className="font-bold text-[11px]">{property.parkingSpots} vagas</span>
            </div>
            <div className="flex flex-col items-center text-center" title={`${property.area} m²`}>
              <Maximize className="w-4 h-4 text-neutral-500 mb-0.5" />
              <span className="font-bold text-[11px]">{property.area} m²</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => onSelect(property)}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs font-bold transition-all text-center"
          >
            Ver Detalhes
          </button>
          <button
            type="button"
            onClick={() => onOpenInterestModal(property)}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow-md shadow-red-600/20 text-center"
          >
            Tenho Interesse
          </button>
        </div>
      </div>
    </div>
  );
};
