import React, { useState } from 'react';
import { Search, CheckCircle2, Copy, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { PropertyPurpose } from '../types.ts';
import { getSearchCleanUrl } from '../utils/seoRouter.ts';

interface SeoUrlTestBarProps {
  currentCleanUrl: string;
  onQuickFilter: (purpose: PropertyPurpose | 'Todos', type: string, neighborhood: string) => void;
}

export const SeoUrlTestBar: React.FC<SeoUrlTestBarProps> = ({
  currentCleanUrl,
  onQuickFilter
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${currentCleanUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickTests = [
    { label: 'Aptos à Venda no Umarizal', purpose: 'Comprar' as const, type: 'Apartamento', neighborhood: 'Umarizal' },
    { label: 'Coberturas em Nazaré', purpose: 'Comprar' as const, type: 'Cobertura', neighborhood: 'Nazaré' },
    { label: 'Casas no Parque Verde', purpose: 'Comprar' as const, type: 'Casa', neighborhood: 'Parque Verde' },
    { label: 'Aptos em Batista Campos', purpose: 'Comprar' as const, type: 'Apartamento', neighborhood: 'Batista Campos' },
    { label: 'Studios para Alugar na Doca', purpose: 'Alugar' as const, type: 'Studio', neighborhood: 'Umarizal' }
  ];

  const hasParams = currentCleanUrl.includes('?');

  return (
    <div className="bg-white border-b border-neutral-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Label and Badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
              SEO
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  Teste dos 30 Segundos do Google (SEO Local)
                </span>
                {!hasParams ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    URL 100% Limpa (Aprovada)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    URL com parâmetros
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500 hidden sm:block">
                Sem "?" na URL. O Google indexa o catálogo por tipo e bairro em Belém-PA com alta intenção de compra.
              </p>
            </div>
          </div>

          {/* Active URL bar */}
          <div className="w-full md:w-auto flex items-center gap-2 bg-neutral-50 p-1.5 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-1.5 px-2 text-xs font-mono text-neutral-700 max-w-[280px] sm:max-w-md truncate">
              <span className="text-neutral-400 select-none">rwimoveis.com.br</span>
              <span className="font-bold text-red-600">{currentCleanUrl}</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              title="Copiar URL amigável"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="px-2.5 py-1 text-[11px] font-bold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {isOpen ? 'Fechar Testes' : 'Testar Filtros'}
            </button>
          </div>

        </div>

        {/* Quick Tests Dropdown / Panel */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-neutral-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-700">
                Clique em uma busca geográfica para ver a URL limpa mudando instantaneamente:
              </span>
              <span className="text-[10px] font-mono text-neutral-400">Schema.org JSON-LD gerado em tempo real</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickTests.map((t, idx) => {
                const targetCleanUrl = getSearchCleanUrl({
                  purpose: t.purpose,
                  type: t.type,
                  neighborhood: t.neighborhood
                });
                const isActive = currentCleanUrl === targetCleanUrl;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onQuickFilter(t.purpose, t.type, t.neighborhood)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-red-600 text-white border-red-600 shadow-xs font-bold'
                        : 'bg-white text-neutral-800 border-neutral-300 hover:border-red-400 hover:bg-red-50/50'
                    }`}
                  >
                    <span>{t.label}</span>
                    <span className="text-[10px] font-mono opacity-70">
                      ({targetCleanUrl})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
