import { Property, PropertyPurpose } from '../types.ts';

export interface ParsedRoute {
  view: 'catalog' | 'property' | 'neighborhood_guide';
  propertyCode?: string;
  neighborhoodSlug?: string;
  purpose?: PropertyPurpose | 'Todos';
  type?: string;
  neighborhood?: string;
}

// Convert string to URL-friendly slug
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/\s+/g, '-') // spaces to -
    .replace(/[^\w\-]+/g, '') // remove non-word chars
    .replace(/\-\-+/g, '-') // collapse dashes
    .replace(/^-+/, '') // trim starting dash
    .replace(/-+$/, ''); // trim ending dash
}

// Generate 100% clean URL for single property (e.g. /imovel/rw-101-cobertura-duplex-umarizal-belem-pa)
export function getPropertyCleanUrl(property: Property): string {
  const codeSlug = slugify(property.code);
  const titleSlug = slugify(property.title).substring(0, 45);
  const neighborhoodSlug = slugify(property.neighborhood);
  return `/imovel/${codeSlug}-${titleSlug}-${neighborhoodSlug}-belem-pa`;
}

// Generate 100% clean URL for search & filter combinations (e.g. /apartamentos-venda-umarizal-belem-pa)
export function getSearchCleanUrl(options: {
  purpose?: PropertyPurpose | 'Todos';
  type?: string;
  neighborhood?: string;
}): string {
  const { purpose = 'Todos', type = 'Todos', neighborhood } = options;

  let typeSegment = 'imoveis';
  if (type && type !== 'Todos' && type !== 'Tipo de Imóvel') {
    if (type.toLowerCase() === 'apartamento') typeSegment = 'apartamentos';
    else if (type.toLowerCase() === 'casa') typeSegment = 'casas';
    else if (type.toLowerCase() === 'cobertura') typeSegment = 'coberturas';
    else if (type.toLowerCase() === 'studio') typeSegment = 'studios';
    else typeSegment = slugify(type);
  }

  let purposeSegment = '';
  if (purpose === 'Comprar') purposeSegment = 'venda';
  else if (purpose === 'Alugar') purposeSegment = 'locacao';
  else if (purpose === 'Lançamentos') purposeSegment = 'lancamentos';

  let neighborhoodSegment = '';
  if (neighborhood && neighborhood !== 'Todos' && neighborhood !== 'Todos os Bairros') {
    neighborhoodSegment = slugify(neighborhood);
  }

  // Construct canonical semantic URL
  const parts: string[] = [];
  if (typeSegment) parts.push(typeSegment);
  if (purposeSegment) parts.push(purposeSegment);
  if (neighborhoodSegment) parts.push(neighborhoodSegment);
  parts.push('belem-pa');

  return `/${parts.join('-')}`;
}

// Generate clean URL for neighborhood guide (e.g. /bairros/guia-umarizal-belem-pa)
export function getNeighborhoodGuideCleanUrl(slug: string): string {
  return `/bairros/guia-${slug}-belem-pa`;
}

// Parse pathname to restore state on initial page load or browser back/forward
export function parseCurrentUrl(pathname: string): ParsedRoute {
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, '');

  // 1. Single property URL: /imovel/rw-101-...
  if (cleanPath.startsWith('/imovel/')) {
    const rest = cleanPath.replace('/imovel/', '');
    const codeMatch = rest.match(/^(rw-\d+)/i);
    if (codeMatch) {
      return {
        view: 'property',
        propertyCode: codeMatch[1].toUpperCase()
      };
    }
  }

  // 2. Neighborhood guide URL: /bairros/guia-...-belem-pa
  if (cleanPath.startsWith('/bairros/')) {
    const rest = cleanPath.replace('/bairros/', '');
    const slugMatch = rest.replace(/^guia-/, '').replace(/-belem-pa$/, '');
    return {
      view: 'neighborhood_guide',
      neighborhoodSlug: slugMatch
    };
  }

  // 3. Search listing clean URL (e.g. /apartamentos-venda-umarizal-belem-pa)
  const segments = cleanPath.replace(/^\//, '').split('-');
  
  let type: string | undefined = undefined;
  let purpose: PropertyPurpose | 'Todos' = 'Todos';
  let neighborhood: string | undefined = undefined;

  if (segments.includes('apartamentos')) type = 'Apartamento';
  else if (segments.includes('casas')) type = 'Casa';
  else if (segments.includes('coberturas')) type = 'Cobertura';
  else if (segments.includes('studios')) type = 'Studio';

  if (segments.includes('venda')) purpose = 'Comprar';
  else if (segments.includes('locacao')) purpose = 'Alugar';
  else if (segments.includes('lancamentos')) purpose = 'Lançamentos';

  if (segments.includes('umarizal')) neighborhood = 'Umarizal';
  else if (segments.includes('nazare')) neighborhood = 'Nazaré';
  else if (segments.includes('batista') || cleanPath.includes('batista-campos')) neighborhood = 'Batista Campos';
  else if (segments.includes('marco')) neighborhood = 'Marco';
  else if (segments.includes('parque') || cleanPath.includes('parque-verde')) neighborhood = 'Parque Verde';

  return {
    view: 'catalog',
    type,
    purpose,
    neighborhood
  };
}
