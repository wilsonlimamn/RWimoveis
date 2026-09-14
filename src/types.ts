export type PropertyType = 'Apartamento' | 'Casa' | 'Cobertura' | 'Studio' | 'Terreno' | 'Comercial';
export type PropertyPurpose = 'Comprar' | 'Alugar' | 'Lançamentos';

export interface Property {
  id: string;
  code: string;
  title: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  condoFee?: number;
  iptu?: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  area: number; // in m²
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  viewsCount: number;
  status: 'Disponível' | 'Reservado' | 'Vendido';
  createdAt: string;
  updatedAt: string;
}

export type LeadStage = 
  | 'novo'
  | 'contato'
  | 'visita'
  | 'proposta'
  | 'fechado'
  | 'perdido';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyPrice?: number;
  stage: LeadStage;
  source: 'Visualização de Anúncio' | 'Formulário de Interesse' | 'Agendamento de Visita' | 'Botão WhatsApp' | 'Cadastro Manual';
  notes: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
  lastContactDate?: string;
}

export interface VisitRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
  city?: string;
  device?: string;
}

export interface AnalyticsSummary {
  totalProperties: number;
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  pipelineValue: number;
  viewsByProperty: { propertyId: string; title: string; views: number; price: number }[];
  viewsByDate: { date: string; views: number; leads: number }[];
  leadsByStage: { stage: LeadStage; label: string; count: number; value: number }[];
}

export interface AdminAuth {
  isAuthenticated: boolean;
  username: string | null;
  token?: string | null;
}

export interface PropertyFilterState {
  purpose: PropertyPurpose | 'Todos';
  type: string;
  city: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  searchQuery: string;
  sortBy: 'recent' | 'views' | 'price-asc' | 'price-desc';
}
