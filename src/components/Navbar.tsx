import React from 'react';
import { Home, ShieldCheck, Heart, Phone, Menu, X, User } from 'lucide-react';
import { AdminAuth, PropertyPurpose } from '../types.ts';

interface NavbarProps {
  adminAuth?: AdminAuth;
  onOpenAdmin: () => void;
  activePurpose: PropertyPurpose | 'Todos';
  onSelectPurpose: (purpose: PropertyPurpose | 'Todos') => void;
  favoritesCount: number;
  onToggleFavoritesView?: () => void;
  showingFavoritesOnly?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  adminAuth = { isAuthenticated: false, username: null },
  onOpenAdmin,
  activePurpose,
  onSelectPurpose,
  favoritesCount,
  onToggleFavoritesView,
  showingFavoritesOnly = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isAuthenticated = Boolean(adminAuth?.isAuthenticated);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo RWimóveis */}
          <div className="flex items-center gap-8">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onSelectPurpose('Todos'); }}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-extrabold tracking-tight text-neutral-900 font-serif">RW</span>
                  <span className="text-2xl font-extrabold tracking-tight text-red-600">imóveis</span>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-600 -mt-1">
                  Imóveis Selecionados
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-neutral-200">
              {(['Todos', 'Comprar', 'Alugar', 'Lançamentos'] as const).map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => onSelectPurpose(purpose)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    activePurpose === purpose && !showingFavoritesOnly
                      ? 'text-red-600 bg-red-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <a 
              href="https://wa.me/5591981234567?text=Ol%C3%A1,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20im%C3%B3veis%20em%20Bel%C3%A9m%20da%20RWim%C3%B3veis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-red-600 transition-colors py-2 px-3 rounded-lg hover:bg-red-50/60"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>(91) 3210-9876</span>
            </a>

            {/* Favorites Counter indicator */}
            {favoritesCount > 0 && onToggleFavoritesView && (
              <button
                type="button"
                onClick={onToggleFavoritesView}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  showingFavoritesOnly
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                }`}
                title="Ver favoritos"
              >
                <Heart className={`w-3.5 h-3.5 ${showingFavoritesOnly ? 'fill-white text-white' : 'fill-red-600 text-red-600'}`} />
                <span>{favoritesCount} salvos</span>
              </button>
            )}

            {/* Admin & CRM Access Button */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all border border-neutral-700 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Painel CRM & Admin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-600/25 hover:shadow-red-600/35 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Área Admin & CRM</span>
                <span className="text-[10px] bg-red-700 px-1.5 py-0.5 rounded text-red-100 font-mono">
                  admin
                </span>
              </button>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            {favoritesCount > 0 && onToggleFavoritesView && (
              <button
                type="button"
                onClick={onToggleFavoritesView}
                className="p-2 rounded-lg text-red-600 bg-red-50"
              >
                <Heart className="w-5 h-5 fill-red-600" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-neutral-700 hover:bg-neutral-100"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 mb-2">
              {(['Comprar', 'Alugar', 'Lançamentos', 'Todos'] as const).map((purpose) => (
                <button
                  key={purpose}
                  onClick={() => { onSelectPurpose(purpose); setMobileMenuOpen(false); }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold text-center ${
                    activePurpose === purpose && !showingFavoritesOnly 
                      ? 'bg-red-600 text-white' 
                      : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  {purpose}
                </button>
              ))}
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-neutral-900 text-white text-sm font-bold flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Acessar Painel CRM & Admin</span>
              </button>
            ) : (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-red-600 text-white text-sm font-bold flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Entrar no Painel Administrativo (admin / 121212)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
