import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Clock, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
                <Building2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-black text-white font-serif">RW</span>
                <span className="text-xl font-black text-red-500">imóveis</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Referência em imóveis de alto padrão, coberturas exclusivas e casas em condomínio fechado nos bairros mais nobres de Belém do Pará.
            </p>
            <div className="text-xs text-neutral-500 font-mono">
              CRECI 12ª Região PA/AP: 8.942-J • CNPJ: 45.890.123/0001-90
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Bairros & Imóveis em Belém
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/apartamentos-venda-umarizal-belem-pa" className="hover:text-red-400 transition-colors">Apartamentos no Umarizal (Doca)</a></li>
              <li><a href="/apartamentos-venda-batista-campos-belem-pa" className="hover:text-red-400 transition-colors">Imóveis na Praça Batista Campos</a></li>
              <li><a href="/coberturas-venda-nazare-belem-pa" className="hover:text-red-400 transition-colors">Coberturas em Nazaré</a></li>
              <li><a href="/casas-condominio-parque-verde-belem-pa" className="hover:text-red-400 transition-colors">Condomínio Fechado Greenville</a></li>
              <li><a href="/apartamentos-venda-marco-belem-pa" className="hover:text-red-400 transition-colors">Apartamentos no Marco</a></li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Atendimento & Contato
            </h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href="tel:+5591984853113" className="hover:text-red-400 transition-colors">
                  (91) 98485-3113
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href="mailto:contato@rwimoveis.com.br" className="hover:text-red-400 transition-colors">
                  contato@rwimoveis.com.br
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Ed. Nassar - Tv. 1º de Março, 96 - Sala: 205 - Campina, Belém - PA, 66010-080</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500 shrink-0" />
                <span>Segunda a Sábado: 08:00 às 19:30</span>
              </div>
            </div>
          </div>

          {/* Technology & Administration */}
          <div className="space-y-3 bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Painel do Corretor & CRM</span>
            </h4>
            <p className="text-xs text-neutral-400">
              Acesso exclusivo para corretores e administradores para gestão de leads, funil Kanban e métricas.
            </p>
            <button
              onClick={onOpenAdmin}
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acessar Administrativo</span>
            </button>
            <div className="text-[10px] text-neutral-500 text-center font-mono">
              Node.js • PostgreSQL Engine • Docker Ready
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} RWimóveis Empreendimentos Imobiliários. Todos os direitos reservados.</p>
          <p className="text-[11px] text-neutral-400">
            Tecnologia com Banco de Dados Funcional e CRM Integrado
          </p>
        </div>
      </div>
    </footer>
  );
};
