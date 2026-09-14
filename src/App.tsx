import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, Filter, SlidersHorizontal, ArrowUpDown, 
  Search, Phone, Sparkles, MessageCircle, Heart, 
  MapPin, Check, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Property, PropertyFilterState, AdminAuth, PropertyPurpose } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { PropertyCard } from './components/PropertyCard.tsx';
import { PropertyDetailModal } from './components/PropertyDetailModal.tsx';
import { LeadCaptureModal } from './components/LeadCaptureModal.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { Footer } from './components/Footer.tsx';
import { SeoStructuredData } from './components/SeoStructuredData.tsx';
import { SeoUrlTestBar } from './components/SeoUrlTestBar.tsx';
import { NeighborhoodsSection } from './components/NeighborhoodsSection.tsx';
import { NeighborhoodGuideModal } from './components/NeighborhoodGuideModal.tsx';
import { BELEM_NEIGHBORHOODS, BelemNeighborhood } from './data/belem-neighborhoods.ts';
import { 
  getPropertyCleanUrl, 
  getSearchCleanUrl, 
  getNeighborhoodGuideCleanUrl, 
  parseCurrentUrl 
} from './utils/seoRouter.ts';

export function App() {
  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState<PropertyFilterState>({
    purpose: 'Todos',
    type: 'Todos',
    city: 'Belém',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    searchQuery: '',
    sortBy: 'recent'
  });

  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('Todos');

  // Modals & Selected items
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeGuideNeighborhood, setActiveGuideNeighborhood] = useState<BelemNeighborhood | null>(null);
  const [interestProperty, setInterestProperty] = useState<Property | null>(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [adminAuth, setAdminAuth] = useState<AdminAuth>({
    isAuthenticated: false,
    username: null,
    token: null
  });

  // Current Clean Canonical URL state for the "Teste dos 30 Segundos"
  const [currentCleanUrl, setCurrentCleanUrl] = useState<string>('/imoveis-belem-pa');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rwimoveis_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Load properties from server database
  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties');
      if (!res.ok) throw new Error('Falha ao carregar imóveis do servidor');
      const data: Property[] = await res.json();
      setProperties(data);
      setError(null);

      // Handle initial route after properties load
      const initialRoute = parseCurrentUrl(window.location.pathname);
      if (initialRoute.view === 'property' && initialRoute.propertyCode) {
        const found = data.find(p => p.code.toUpperCase() === initialRoute.propertyCode?.toUpperCase());
        if (found) {
          setSelectedProperty(found);
        }
      } else if (initialRoute.view === 'neighborhood_guide' && initialRoute.neighborhoodSlug) {
        const foundN = BELEM_NEIGHBORHOODS.find(n => n.slug === initialRoute.neighborhoodSlug);
        if (foundN) {
          setActiveGuideNeighborhood(foundN);
        }
      } else if (initialRoute.view === 'catalog') {
        if (initialRoute.purpose) setFilters(f => ({ ...f, purpose: initialRoute.purpose! }));
        if (initialRoute.type) setFilters(f => ({ ...f, type: initialRoute.type! }));
        if (initialRoute.neighborhood) setSelectedNeighborhood(initialRoute.neighborhood);
      }
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar anúncios do banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Sync Clean URL whenever filters, property or neighborhood change (without page reload)
  useEffect(() => {
    let cleanUrl = '/imoveis-belem-pa';

    if (selectedProperty) {
      cleanUrl = getPropertyCleanUrl(selectedProperty);
    } else if (activeGuideNeighborhood) {
      cleanUrl = getNeighborhoodGuideCleanUrl(activeGuideNeighborhood.slug);
    } else {
      cleanUrl = getSearchCleanUrl({
        purpose: filters.purpose,
        type: filters.type,
        neighborhood: selectedNeighborhood !== 'Todos' ? selectedNeighborhood : undefined
      });
    }

    setCurrentCleanUrl(cleanUrl);

    // Update browser URL bar cleanly (no question marks, 100% SEO local indexable)
    if (window.location.pathname !== cleanUrl) {
      window.history.pushState(null, '', cleanUrl);
    }
  }, [selectedProperty, activeGuideNeighborhood, filters.purpose, filters.type, selectedNeighborhood]);

  // Handle browser back/forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseCurrentUrl(window.location.pathname);
      if (parsed.view === 'property' && parsed.propertyCode) {
        const found = properties.find(p => p.code.toUpperCase() === parsed.propertyCode?.toUpperCase());
        if (found) setSelectedProperty(found);
      } else if (parsed.view === 'neighborhood_guide' && parsed.neighborhoodSlug) {
        const foundN = BELEM_NEIGHBORHOODS.find(n => n.slug === parsed.neighborhoodSlug);
        if (foundN) setActiveGuideNeighborhood(foundN);
      } else {
        setSelectedProperty(null);
        setActiveGuideNeighborhood(null);
        if (parsed.purpose) setFilters(f => ({ ...f, purpose: parsed.purpose! }));
        if (parsed.type) setFilters(f => ({ ...f, type: parsed.type! }));
        if (parsed.neighborhood) setSelectedNeighborhood(parsed.neighborhood);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties]);

  // Save favorites to localStorage
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('rwimoveis_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Record visit and open detail modal
  const handleSelectProperty = async (prop: Property) => {
    setSelectedProperty(prop);

    // Track visit in database & update view count
    try {
      await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: prop.id,
          propertyTitle: prop.title,
          city: prop.city
        })
      });

      // Increment local count seamlessly
      setProperties(prev => prev.map(p => p.id === prop.id ? { ...p, viewsCount: (p.viewsCount || 0) + 1 } : p));
    } catch (err) {
      console.error('Error logging visit:', err);
    }
  };

  // Submit Lead to CRM (Captures lead into PostgreSQL database)
  const handleSubmitLead = async (leadData: {
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    source: 'Formulário de Interesse' | 'Agendamento de Visita' | 'Botão WhatsApp' | 'Visualização de Anúncio';
    notes: string;
  }) => {
    try {
      const prop = properties.find(p => p.id === leadData.propertyId);
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          value: prop?.price || 500000,
          stage: 'novo'
        })
      });
      if (!res.ok) throw new Error('Erro ao salvar lead');
    } catch (err) {
      console.error('Error submitting lead to CRM:', err);
      throw err;
    }
  };

  // Hero search trigger
  const handleHeroSearch = (params: { purpose: PropertyPurpose; type: string; query: string }) => {
    setFilters(prev => ({
      ...prev,
      purpose: params.purpose,
      type: params.type === 'Tipo de Imóvel' ? 'Todos' : params.type,
      searchQuery: params.query
    }));

    // Detect if user typed a Belém neighborhood name
    const qLower = params.query.toLowerCase();
    const matchedNeighborhood = BELEM_NEIGHBORHOODS.find(n => qLower.includes(n.name.toLowerCase()));
    if (matchedNeighborhood) {
      setSelectedNeighborhood(matchedNeighborhood.name);
    }

    // Smooth scroll to results
    const section = document.getElementById('imoveis-catalogo');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick filter helper for the "Teste dos 30 Segundos"
  const handleQuickTestFilter = (purpose: PropertyPurpose | 'Todos', type: string, neighborhood: string) => {
    setFilters(prev => ({
      ...prev,
      purpose,
      type,
      searchQuery: ''
    }));
    setSelectedNeighborhood(neighborhood);
    setShowOnlyFavorites(false);

    const section = document.getElementById('imoveis-catalogo');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered and sorted properties
  const filteredProperties = properties.filter(prop => {
    if (showOnlyFavorites && !favorites.includes(prop.id)) return false;
    if (filters.purpose !== 'Todos' && prop.purpose !== filters.purpose) return false;
    if (filters.type !== 'Todos' && prop.type !== filters.type) return false;
    if (selectedNeighborhood !== 'Todos' && prop.neighborhood.toLowerCase() !== selectedNeighborhood.toLowerCase()) return false;
    if (filters.bedrooms && prop.bedrooms < filters.bedrooms) return false;
    if (filters.minPrice && prop.price < filters.minPrice) return false;
    if (filters.maxPrice && prop.price > filters.maxPrice) return false;

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match = 
        prop.title.toLowerCase().includes(q) ||
        prop.neighborhood.toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q) ||
        prop.code.toLowerCase().includes(q) ||
        prop.type.toLowerCase().includes(q) ||
        prop.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featuredProperties = properties.filter(p => p.featured);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans selection:bg-red-600 selection:text-white">
      
      {/* Schema.org JSON-LD Structured Data for Google Rich Snippets */}
      <SeoStructuredData
        property={selectedProperty}
        neighborhood={activeGuideNeighborhood}
        canonicalUrl={currentCleanUrl}
      />

      {/* Navigation Header */}
      <Navbar
        adminAuth={adminAuth}
        onOpenAdmin={() => {
          if (adminAuth?.isAuthenticated) {
            setIsAdminPanelOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        activePurpose={filters.purpose}
        onSelectPurpose={(purpose) => {
          setFilters(prev => ({ ...prev, purpose }));
          setShowOnlyFavorites(false);
          const section = document.getElementById('imoveis-catalogo');
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
        onToggleFavoritesView={() => setShowOnlyFavorites(prev => !prev)}
        showingFavoritesOnly={showOnlyFavorites}
      />

      {/* Teste dos 30 Segundos: Clean URL Bar & SEO Local Proof */}
      <SeoUrlTestBar
        currentCleanUrl={currentCleanUrl}
        onQuickFilter={handleQuickTestFilter}
      />

      {/* Hero Section with Live Featured Classifieds Slideshow */}
      {!showOnlyFavorites && (
        <HeroSection
          featuredProperties={featuredProperties.length > 0 ? featuredProperties : properties.slice(0, 3)}
          onSearch={handleHeroSearch}
          onSelectProperty={handleSelectProperty}
        />
      )}

      {/* Main Catalog Section */}
      <main id="imoveis-catalogo" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
        
        {/* Header visible only when viewing favorites */}
        {showOnlyFavorites && (
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                Meus Imóveis Salvos
              </span>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight font-serif mt-1">
                Imóveis Favoritos
              </h2>
            </div>
            <button
              onClick={() => setShowOnlyFavorites(false)}
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Voltar ao Catálogo
            </button>
          </div>
        )}

        {/* Detailed Filters Row */}
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 mb-8 flex flex-wrap items-center gap-3">
          {/* Keyword Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por bairro, condomínio (Greenville, Doca, etc.)..."
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-neutral-300 text-xs font-medium focus:border-red-600 focus:ring-1 focus:ring-red-600"
            />
          </div>

          {/* Finalidade: Todos, Comprar, Alugar, Lançamentos */}
          <div className="w-36">
            <select
              value={filters.purpose}
              onChange={(e) => setFilters(prev => ({ ...prev, purpose: e.target.value as any }))}
              className="w-full p-2 bg-white rounded-xl border border-neutral-300 text-xs font-semibold cursor-pointer"
            >
              <option value="Todos">Finalidade: Todas</option>
              <option value="Comprar">Comprar</option>
              <option value="Alugar">Alugar</option>
              <option value="Lançamentos">Lançamentos</option>
            </select>
          </div>

          {/* Neighborhood Select */}
          <div className="w-48">
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full p-2 bg-white rounded-xl border border-neutral-300 text-xs font-semibold cursor-pointer"
            >
              <option value="Todos">Bairro: Todos de Belém</option>
              {BELEM_NEIGHBORHOODS.map(n => (
                <option key={n.id} value={n.name}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* Type Select */}
          <div className="w-40">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 bg-white rounded-xl border border-neutral-300 text-xs font-semibold cursor-pointer"
            >
              <option value="Todos">Todos os Tipos</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Cobertura">Cobertura</option>
              <option value="Studio">Studio</option>
            </select>
          </div>

          {/* Bedrooms Select */}
          <div className="w-36">
            <select
              value={filters.bedrooms || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value ? Number(e.target.value) : undefined }))}
              className="w-full p-2 bg-white rounded-xl border border-neutral-300 text-xs font-semibold cursor-pointer"
            >
              <option value="">Quartos: Qualquer</option>
              <option value="1">1+ quarto</option>
              <option value="2">2+ quartos</option>
              <option value="3">3+ quartos</option>
              <option value="4">4+ quartos</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-40">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full p-2 bg-white rounded-xl border border-neutral-300 text-xs font-semibold cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="views">Mais Visitados</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(filters.searchQuery || filters.type !== 'Todos' || selectedNeighborhood !== 'Todos' || filters.bedrooms || filters.purpose !== 'Todos' || showOnlyFavorites) && (
            <button
              onClick={() => {
                setFilters({
                  purpose: 'Todos',
                  type: 'Todos',
                  city: 'Belém',
                  minPrice: undefined,
                  maxPrice: undefined,
                  bedrooms: undefined,
                  searchQuery: '',
                  sortBy: 'recent'
                });
                setSelectedNeighborhood('Todos');
                setShowOnlyFavorites(false);
              }}
              className="px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-neutral-600">
              Carregando imóveis de Belém do banco de dados...
            </p>
          </div>
        )}

        {error && (
          <div className="py-12 px-6 bg-red-50 border border-red-200 rounded-2xl text-center max-w-md mx-auto space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-base font-bold text-red-900">{error}</h3>
            <button
              onClick={loadProperties}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Property Grid (Cards Matching User's Image Layout) */}
        {!loading && !error && (
          <>
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelect={handleSelectProperty}
                    onOpenInterestModal={(prop) => setInterestProperty(prop)}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-neutral-50 rounded-3xl border border-neutral-200 p-8 space-y-4">
                <Building2 className="w-12 h-12 text-neutral-400 mx-auto" />
                <h3 className="text-lg font-bold text-neutral-800">
                  Nenhum imóvel encontrado para este filtro em Belém
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Tente selecionar outro bairro (como Umarizal ou Nazaré), outra finalidade ou limpar os filtros para ver todos os anúncios.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      purpose: 'Todos',
                      type: 'Todos',
                      city: 'Belém',
                      minPrice: undefined,
                      maxPrice: undefined,
                      bedrooms: undefined,
                      searchQuery: '',
                      sortBy: 'recent'
                    });
                    setSelectedNeighborhood('Todos');
                    setShowOnlyFavorites(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Ver Todos os Anúncios de Belém
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* Floating Direct Contact WhatsApp Button with Belém DDD 91 */}
      <a
        href="https://wa.me/5591984853113?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20im%C3%B3veis%20de%20alto%20padr%C3%A3o%20em%20Bel%C3%A9m%20da%20RWim%C3%B3veis"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all group"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
          WhatsApp (91) 98485-3113
        </span>
      </a>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onSubmitLead={handleSubmitLead}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Neighborhood Guide Modal (Full local data & seller lead capture) */}
      {activeGuideNeighborhood && (
        <NeighborhoodGuideModal
          neighborhood={activeGuideNeighborhood}
          onClose={() => setActiveGuideNeighborhood(null)}
          onFilterNeighborhood={(neighborhoodName) => {
            setSelectedNeighborhood(neighborhoodName);
            setActiveGuideNeighborhood(null);
            const section = document.getElementById('imoveis-catalogo');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
          }}
          onLeadSubmitted={(lead) => {
            // Success callback
          }}
        />
      )}

      {/* Standalone Lead Capture Modal */}
      <LeadCaptureModal
        property={interestProperty}
        isOpen={Boolean(interestProperty)}
        onClose={() => setInterestProperty(null)}
        onSubmit={handleSubmitLead}
      />

      {/* Admin Login Modal (admin / 121212) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(auth) => {
          setAdminAuth(auth);
          setIsAdminPanelOpen(true);
        }}
      />

      {/* Admin Panel & CRM */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        onLogout={() => {
          setAdminAuth({ isAuthenticated: false, username: null, token: null });
          setIsAdminPanelOpen(false);
        }}
        properties={properties}
        onRefreshProperties={loadProperties}
        onSelectPropertyForView={(prop) => {
          setIsAdminPanelOpen(false);
          handleSelectProperty(prop);
        }}
      />

      {/* Footer with CRECI and Admin Link */}
      <Footer onOpenAdmin={() => {
        if (adminAuth?.isAuthenticated) {
          setIsAdminPanelOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }} />

    </div>
  );
}

export default App;
