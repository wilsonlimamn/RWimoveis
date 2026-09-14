import React, { useState, useEffect } from 'react';
import { 
  X, BarChart3, Users, Building, Database, 
  ArrowRight, ArrowLeft, Plus, Trash2, Edit3, 
  CheckCircle2, AlertCircle, RefreshCw, Sparkles, 
  Eye, TrendingUp, DollarSign, Calendar, MessageSquare, 
  Phone, Mail, Copy, Check, Filter, ExternalLink,
  GripVertical
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, 
  Cell 
} from 'recharts';
import { Property, Lead, LeadStage, AnalyticsSummary, PropertyType, PropertyPurpose } from '../types.ts';
import { formatCurrency, formatDate } from '../utils/formatters.ts';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  properties: Property[];
  onRefreshProperties: () => Promise<void>;
  onSelectPropertyForView: (prop: Property) => void;
}

type AdminTab = 'analytics' | 'crm' | 'properties' | 'database';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onLogout,
  properties,
  onRefreshProperties,
  onSelectPropertyForView
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [dbStats, setDbStats] = useState<any>(null);

  // New Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [propForm, setPropForm] = useState({
    title: '',
    type: 'Apartamento' as PropertyType,
    purpose: 'Comprar' as PropertyPurpose,
    price: 950000,
    condoFee: 800,
    iptu: 300,
    address: 'Av. Paulista, 1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    bedrooms: 2,
    suites: 1,
    bathrooms: 2,
    parkingSpots: 1,
    area: 75,
    description: 'Excelente oportunidade em localização privilegiada, acabamentos de primeira linha.',
    features: 'Piscina, Academia, Varanda Gourmet, Portaria 24h',
    images: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
    featured: true
  });

  // New Lead Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    propertyId: '',
    stage: 'novo' as LeadStage,
    source: 'Cadastro Manual' as Lead['source'],
    notes: '',
    value: 500000
  });

  // Kanban Drag & Drop State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  // Code preview tabs for Docker & PostgreSQL
  const [codeTab, setCodeTab] = useState<'docker' | 'schema' | 'seed' | 'compose'>('docker');
  const [copiedCode, setCopiedCode] = useState(false);

  // Load analytics & leads
  const fetchDashboardData = async () => {
    setLoadingAnalytics(true);
    setLoadingLeads(true);
    try {
      const [resAnalytics, resLeads, resDb] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/crm/leads'),
        fetch('/api/db/status')
      ]);

      if (resAnalytics.ok) {
        const data = await resAnalytics.json();
        setAnalytics(data);
      }
      if (resLeads.ok) {
        const data = await resLeads.json();
        setLeads(data);
      }
      if (resDb.ok) {
        const data = await resDb.json();
        setDbStats(data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingAnalytics(false);
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDashboardData();
    }
  }, [isOpen]);

  // Lead Kanban stage change
  const handleMoveLeadStage = async (leadId: string, newStage: LeadStage) => {
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage })
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: newStage, updatedAt: new Date().toISOString() } : l));
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error moving lead stage:', err);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Deseja realmente remover este lead?')) return;
    try {
      const res = await fetch(`/api/crm/leads/${leadId}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Lead (Create / Edit)
  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLead) {
        const res = await fetch(`/api/crm/leads/${editingLead.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadForm)
        });
        if (res.ok) {
          setIsLeadModalOpen(false);
          setEditingLead(null);
          fetchDashboardData();
        }
      } else {
        const res = await fetch('/api/crm/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadForm)
        });
        if (res.ok) {
          setIsLeadModalOpen(false);
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Property (Create / Edit)
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...propForm,
      features: propForm.features.split(',').map(f => f.trim()).filter(Boolean),
      images: propForm.images.split('\n').map(i => i.trim()).filter(Boolean),
      price: Number(propForm.price),
      condoFee: Number(propForm.condoFee) || 0,
      iptu: Number(propForm.iptu) || 0,
      area: Number(propForm.area),
      bedrooms: Number(propForm.bedrooms),
      suites: Number(propForm.suites),
      bathrooms: Number(propForm.bathrooms),
      parkingSpots: Number(propForm.parkingSpots),
      status: 'Disponível'
    };

    try {
      if (editingProperty) {
        const res = await fetch(`/api/properties/${editingProperty.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setIsPropertyModalOpen(false);
          setEditingProperty(null);
          await onRefreshProperties();
          fetchDashboardData();
        }
      } else {
        const res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setIsPropertyModalOpen(false);
          await onRefreshProperties();
          fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Property
  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio permanentemente do banco de dados?')) return;
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefreshProperties();
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Featured
  const handleToggleFeatured = async (prop: Property) => {
    try {
      const res = await fetch(`/api/properties/${prop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !prop.featured })
      });
      if (res.ok) {
        await onRefreshProperties();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset database to initial seed
  const handleResetDb = async () => {
    if (!confirm('Deseja restaurar o banco de dados com os 6 anúncios de teste originais?')) return;
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) {
        await onRefreshProperties();
        fetchDashboardData();
        alert('Banco de dados restaurado com sucesso!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Kanban Stage Columns definition
  const KANBAN_STAGES: { id: LeadStage; label: string; color: string }[] = [
    { id: 'novo', label: 'Novos Leads', color: 'border-blue-500 text-blue-700 bg-blue-50' },
    { id: 'contato', label: 'Em Atendimento', color: 'border-amber-500 text-amber-700 bg-amber-50' },
    { id: 'visita', label: 'Visita Agendada', color: 'border-purple-500 text-purple-700 bg-purple-50' },
    { id: 'proposta', label: 'Proposta Enviada', color: 'border-indigo-500 text-indigo-700 bg-indigo-50' },
    { id: 'fechado', label: 'Contrato Fechado', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
    { id: 'perdido', label: 'Perdido', color: 'border-neutral-400 text-neutral-600 bg-neutral-100' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 lg:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-7xl h-full max-h-[96vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-serif font-black text-lg shadow-md shadow-red-600/40">
              RW
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Painel Administrativo RWimóveis</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                  Online
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Logado como <strong className="text-white">admin</strong> • Sistema PostgreSQL & Node.js
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-neutral-800/90 p-1.5 rounded-2xl border border-neutral-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gráficos & Visitas</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'crm'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>CRM & Funil Kanban</span>
              {leads.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {leads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'properties'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Gestão de Anúncios</span>
              <span className="text-neutral-400 text-[10px] font-mono">({properties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'database'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>PostgreSQL & Docker</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              title="Atualizar Dados"
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingAnalytics ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onLogout}
              className="text-xs font-bold text-neutral-400 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Sair
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-50">
          
          {/* TAB 1: GRÁFICOS & VISITAS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Visitas</span>
                    <Eye className="w-4 h-4 text-red-600" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                    {analytics?.totalViews || 0}
                  </span>
                  <span className="block text-[11px] text-emerald-600 font-semibold mt-1">
                    +18% nesta semana
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Leads no CRM</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                    {analytics?.totalLeads || leads.length}
                  </span>
                  <span className="block text-[11px] text-blue-600 font-semibold mt-1">
                    Captados em tempo real
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Taxa Conversão</span>
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                    {analytics?.conversionRate || 0}%
                  </span>
                  <span className="block text-[11px] text-neutral-500 font-medium mt-1">
                    Visita para Lead
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Pipeline</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 truncate block">
                    {formatCurrency(analytics?.pipelineValue || 0)}
                  </span>
                  <span className="block text-[11px] text-emerald-600 font-medium mt-1">
                    Em negociação ativa
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Anúncios Ativos</span>
                    <Building className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-neutral-900">
                    {properties.length}
                  </span>
                  <span className="block text-[11px] text-neutral-500 font-medium mt-1">
                    No banco de dados
                  </span>
                </div>
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Views per Property Bar Chart */}
                <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-neutral-900">
                        Visualizações por Anúncio de Imóvel
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Métricas de engajamento acumuladas no banco de dados
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                      Tempo Real
                    </span>
                  </div>

                  <div className="h-72 w-full">
                    {analytics?.viewsByProperty && analytics.viewsByProperty.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.viewsByProperty}
                          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="title" 
                            tick={{ fontSize: 11, fill: '#666' }} 
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                          />
                          <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                          <Tooltip 
                            formatter={(value: any) => [`${value} visitas`, 'Acessos']}
                            contentStyle={{ borderRadius: '12px', borderColor: '#e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                          />
                          <Bar dataKey="views" radius={[6, 6, 0, 0]}>
                            {analytics.viewsByProperty.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={index === 0 ? '#dc2626' : index === 1 ? '#ef4444' : '#b91c1c'} 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-neutral-400 text-xs">
                        Carregando estatísticas...
                      </div>
                    )}
                  </div>
                </div>

                {/* Daily Visits Timeline Area Chart */}
                <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-extrabold text-neutral-900">
                        Evolução Diária de Visitas
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Últimos 7 dias de tráfego captado
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    {analytics?.viewsByDate && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={analytics.viewsByDate}
                          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                        >
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#666' }} />
                          <YAxis tick={{ fontSize: 11, fill: '#666' }} />
                          <Tooltip 
                            formatter={(val: any) => [`${val} visualizações`, 'Visitas']}
                            contentStyle={{ borderRadius: '12px', borderColor: '#e5e7eb' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="views" 
                            stroke="#dc2626" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorViews)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

              </div>

              {/* CRM Funnel Stage Distribution Chart */}
              <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900">
                      Funil de Vendas do CRM (Distribuição por Etapa)
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Quantidade de clientes e valor total negociado por estágio
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('crm')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <span>Ver no Kanban</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {analytics?.leadsByStage.map((stage) => (
                    <div 
                      key={stage.stage}
                      className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center"
                    >
                      <span className="text-xs font-bold text-neutral-600 block mb-1">
                        {stage.label}
                      </span>
                      <span className="text-2xl font-black text-neutral-900">
                        {stage.count}
                      </span>
                      <span className="text-[11px] text-neutral-500 block truncate mt-0.5">
                        {formatCurrency(stage.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CRM FUNIL DE VENDAS KANBAN */}
          {activeTab === 'crm' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-neutral-900">
                    Funil de Vendas Kanban (CRM RWimóveis)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Leads captados automaticamente ao visualizar anúncios e interagir no site. Mova os cards entre as etapas do funil.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingLead(null);
                      setLeadForm({
                        name: '',
                        email: '',
                        phone: '',
                        propertyId: properties[0]?.id || '',
                        stage: 'novo',
                        source: 'Cadastro Manual',
                        notes: '',
                        value: properties[0]?.price || 500000
                      });
                      setIsLeadModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Novo Lead</span>
                  </button>
                </div>
              </div>

              {/* Kanban Drag and Drop Tip Banner */}
              <div className="flex items-center justify-between text-xs bg-amber-50/80 border border-amber-200 text-amber-900 px-4 py-2 rounded-xl">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-amber-600" />
                  <span><strong>Arrastar e Soltar:</strong> Você pode clicar com o mouse em qualquer card e arrastá-lo diretamente para outra coluna do funil para atualizar a etapa automaticamente!</span>
                </div>
                <span className="text-[11px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-semibold hidden sm:inline-block">
                  Drag & Drop Ativo
                </span>
              </div>

              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 min-h-[600px] overflow-x-auto pb-4">
                {KANBAN_STAGES.map((col, colIdx) => {
                  const stageLeads = leads.filter(l => l.stage === col.id);
                  const totalStageValue = stageLeads.reduce((acc, l) => acc + (l.value || l.propertyPrice || 0), 0);
                  const isOverThisColumn = dragOverStage === col.id;

                  return (
                    <div
                      key={col.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                        if (dragOverStage !== col.id) {
                          setDragOverStage(col.id);
                        }
                      }}
                      onDragLeave={(e) => {
                        // Only clear if leaving the column itself
                        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                        if (dragOverStage === col.id) {
                          setDragOverStage(null);
                        }
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        const droppedLeadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
                        setDragOverStage(null);
                        setDraggedLeadId(null);

                        if (droppedLeadId) {
                          const currentLead = leads.find(l => l.id === droppedLeadId);
                          if (currentLead && currentLead.stage !== col.id) {
                            await handleMoveLeadStage(droppedLeadId, col.id);
                          }
                        }
                      }}
                      className={`rounded-2xl p-3 border flex flex-col min-w-[240px] transition-all duration-200 ${
                        isOverThisColumn 
                          ? 'bg-red-50/70 border-red-400 ring-2 ring-red-400 ring-opacity-50 shadow-md' 
                          : 'bg-neutral-100/80 border-neutral-200'
                      }`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-200">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            col.id === 'novo' ? 'bg-blue-600' :
                            col.id === 'contato' ? 'bg-amber-600' :
                            col.id === 'visita' ? 'bg-purple-600' :
                            col.id === 'proposta' ? 'bg-indigo-600' :
                            col.id === 'fechado' ? 'bg-emerald-600' : 'bg-neutral-500'
                          }`} />
                          <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider">
                            {col.label}
                          </h4>
                        </div>
                        <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-neutral-200 text-neutral-700">
                          {stageLeads.length}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-neutral-500 mb-2">
                        Total: {formatCurrency(totalStageValue)}
                      </div>

                      {/* Drop Zone Visual Hint when dragging */}
                      {isOverThisColumn && draggedLeadId && (
                        <div className="mb-2.5 py-2 px-3 border-2 border-dashed border-red-400 bg-red-100/50 rounded-xl text-center text-xs font-bold text-red-700 animate-pulse">
                          Solte aqui para mover para "{col.label}"
                        </div>
                      )}

                      {/* Leads Cards List */}
                      <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[520px] pr-1">
                        {stageLeads.map((lead) => {
                          const isBeingDragged = draggedLeadId === lead.id;

                          return (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={(e) => {
                                setDraggedLeadId(lead.id);
                                e.dataTransfer.setData('text/plain', lead.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onDragEnd={() => {
                                setDraggedLeadId(null);
                                setDragOverStage(null);
                              }}
                              className={`bg-white rounded-xl p-3 border shadow-xs hover:shadow-md transition-all space-y-2 group cursor-grab active:cursor-grabbing select-none ${
                                isBeingDragged 
                                  ? 'opacity-40 border-dashed border-red-400 scale-[0.98]' 
                                  : 'border-neutral-200 hover:border-red-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  <GripVertical className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 cursor-grab" />
                                  <span className="font-bold text-xs text-neutral-900 line-clamp-1">
                                    {lead.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                                  {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                </span>
                              </div>

                              {/* Origin Source Badge */}
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-semibold bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100 line-clamp-1">
                                  {lead.source}
                                </span>
                              </div>

                              {/* Property Reference */}
                              {lead.propertyTitle && (
                                <div className="text-[11px] text-neutral-600 bg-neutral-50 p-1.5 rounded border border-neutral-100 line-clamp-1">
                                  <span className="font-semibold text-neutral-800">Imóvel: </span>
                                  {lead.propertyTitle}
                                </div>
                              )}

                              {/* Contact Details */}
                              <div className="space-y-0.5 text-[11px] text-neutral-600">
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-red-600 shrink-0" />
                                  <span className="font-mono">{lead.phone}</span>
                                </div>
                                {lead.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-neutral-400 shrink-0" />
                                    <span className="truncate">{lead.email}</span>
                                  </div>
                                )}
                              </div>

                              {/* Value */}
                              <div className="text-xs font-black text-neutral-900 pt-1 border-t border-neutral-100 flex items-center justify-between">
                                <span>Valor Estimado:</span>
                                <span className="text-red-700">{formatCurrency(lead.value || 0)}</span>
                              </div>

                              {/* Notes Snippet */}
                              {lead.notes && (
                                <p className="text-[10px] text-neutral-500 italic bg-amber-50/60 p-1 rounded border border-amber-100 line-clamp-2">
                                  {lead.notes}
                                </p>
                              )}

                              {/* Stage Move Controls (Arrow buttons fallback + drag handle) */}
                              <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                                <button
                                  type="button"
                                  disabled={colIdx === 0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveLeadStage(lead.id, KANBAN_STAGES[colIdx - 1].id);
                                  }}
                                  className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 text-neutral-700 cursor-pointer"
                                  title="Voltar etapa"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingLead(lead);
                                      setLeadForm({
                                        name: lead.name,
                                        email: lead.email,
                                        phone: lead.phone,
                                        propertyId: lead.propertyId || '',
                                        stage: lead.stage,
                                        source: lead.source,
                                        notes: lead.notes || '',
                                        value: lead.value || 0
                                      });
                                      setIsLeadModalOpen(true);
                                    }}
                                    className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                                    title="Editar lead"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteLead(lead.id);
                                    }}
                                    className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                                    title="Remover lead"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  disabled={colIdx === KANBAN_STAGES.length - 1}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMoveLeadStage(lead.id, KANBAN_STAGES[colIdx + 1].id);
                                  }}
                                  className="p-1 rounded bg-red-50 hover:bg-red-100 disabled:opacity-30 text-red-700 cursor-pointer"
                                  title="Avançar etapa"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {stageLeads.length === 0 && (
                          <div className={`h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center p-3 transition-colors ${
                            isOverThisColumn ? 'border-red-400 bg-red-50/40 text-red-600' : 'border-neutral-200 text-neutral-400'
                          }`}>
                            <span className="text-[11px] font-medium">
                              {isOverThisColumn ? 'Solte o lead aqui' : 'Nenhum lead nesta etapa'}
                            </span>
                            <span className="text-[10px] text-neutral-400 mt-1">
                              Arraste um card até aqui
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: GESTÃO DE ANÚNCIOS */}
          {activeTab === 'properties' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <div>
                  <h3 className="text-base font-black text-neutral-900">
                    Anúncios no Banco de Dados ({properties.length})
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Gerencie os imóveis cadastrados, destaque no hero, fotos e valores.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProperty(null);
                      setPropForm({
                        title: '',
                        type: 'Apartamento',
                        purpose: 'Comprar',
                        price: 850000,
                        condoFee: 750,
                        iptu: 280,
                        address: 'Rua Oscar Freire, 500',
                        neighborhood: 'Cerqueira César',
                        city: 'São Paulo',
                        state: 'SP',
                        bedrooms: 2,
                        suites: 1,
                        bathrooms: 2,
                        parkingSpots: 1,
                        area: 72,
                        description: 'Imóvel espetacular pronto para morar.',
                        features: 'Piscina, Academia, Varanda Gourmet',
                        images: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                        featured: false
                      });
                      setIsPropertyModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Novo Anúncio</span>
                  </button>
                </div>
              </div>

              {/* Properties Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3.5 px-4">Imóvel</th>
                        <th className="py-3.5 px-4">Tipo & Finalidade</th>
                        <th className="py-3.5 px-4">Preço</th>
                        <th className="py-3.5 px-4">Localização</th>
                        <th className="py-3.5 px-4">Visitas</th>
                        <th className="py-3.5 px-4">Hero Destaque</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {properties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=150&q=80'}
                                alt={prop.title}
                                className="w-12 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                              />
                              <div>
                                <span className="font-mono text-[10px] font-bold text-red-600 block">
                                  {prop.code}
                                </span>
                                <span className="font-bold text-neutral-900 line-clamp-1 max-w-xs">
                                  {prop.title}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-neutral-800">{prop.type}</span>
                            <span className="block text-neutral-500 text-[10px]">{prop.purpose}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-black text-neutral-900">{formatCurrency(prop.price)}</span>
                            {prop.purpose === 'Alugar' && <span className="text-[10px] text-neutral-500"> /mês</span>}
                          </td>

                          <td className="py-3 px-4 text-neutral-600">
                            {prop.neighborhood}, {prop.city} - {prop.state}
                          </td>

                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-md font-bold">
                              <Eye className="w-3 h-3" />
                              <span>{prop.viewsCount || 0}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(prop)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                                prop.featured
                                  ? 'bg-red-600 text-white'
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                              }`}
                            >
                              {prop.featured ? 'Sim (Destaque)' : 'Não'}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onSelectPropertyForView(prop)}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                                title="Visualizar anúncio"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setEditingProperty(prop);
                                  setPropForm({
                                    title: prop.title,
                                    type: prop.type,
                                    purpose: prop.purpose,
                                    price: prop.price,
                                    condoFee: prop.condoFee || 0,
                                    iptu: prop.iptu || 0,
                                    address: prop.address,
                                    neighborhood: prop.neighborhood,
                                    city: prop.city,
                                    state: prop.state,
                                    bedrooms: prop.bedrooms,
                                    suites: prop.suites,
                                    bathrooms: prop.bathrooms,
                                    parkingSpots: prop.parkingSpots,
                                    area: prop.area,
                                    description: prop.description,
                                    features: prop.features.join(', '),
                                    images: prop.images.join('\n'),
                                    featured: prop.featured
                                  });
                                  setIsPropertyModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                                title="Editar"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteProperty(prop.id)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: POSTGRESQL & DOCKER */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              {/* Database Overview Card */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-neutral-900">
                        Status do Banco de Dados Funcional
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Estrutura relacional PostgreSQL, persistência em disco e integração Docker pronta
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleResetDb}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Restaurar 6 Anúncios Originais</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Tabela: properties</span>
                    <span className="text-xl font-black text-neutral-900">{properties.length} registros</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Tabela: leads (CRM)</span>
                    <span className="text-xl font-black text-neutral-900">{leads.length} registros</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Tabela: visits</span>
                    <span className="text-xl font-black text-neutral-900">{analytics?.totalViews || 0} acessos</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Tabela: admin_users</span>
                    <span className="text-xl font-black text-neutral-900">admin / 121212</span>
                  </div>
                </div>
              </div>

              {/* Docker & PostgreSQL Technical Specifications */}
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 bg-neutral-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-xl">
                      <button
                        onClick={() => setCodeTab('docker')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          codeTab === 'docker' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        Dockerfile
                      </button>
                      <button
                        onClick={() => setCodeTab('compose')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          codeTab === 'compose' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        docker-compose.yml
                      </button>
                      <button
                        onClick={() => setCodeTab('schema')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          codeTab === 'schema' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        schema.sql (Estrutura DDL)
                      </button>
                      <button
                        onClick={() => setCodeTab('seed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          codeTab === 'seed' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        seed_demo.sql (Dados Fake)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const code = codeTab === 'docker' ? 
`# Multi-stage Dockerfile for RWimóveis
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:22-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/schema.sql ./schema.sql
COPY --from=builder /app/seed_demo.sql ./seed_demo.sql
EXPOSE 3000
CMD ["node", "dist/server.cjs"]` : codeTab === 'compose' ?
`version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    container_name: rwimoveis_postgres
    restart: always
    environment:
      POSTGRES_DB: rwimoveis
      POSTGRES_USER: rwimoveis_user
      POSTGRES_PASSWORD: rwimoveis_secret_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rwimoveis_user -d rwimoveis"]
      interval: 5s
      timeout: 5s
      retries: 5
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: \${DATABASE_URL:-postgres://rwimoveis_user:rwimoveis_secret_password@postgres:5432/rwimoveis}
      ADMIN_USER: \${ADMIN_USER:-admin}
      ADMIN_PASSWORD: \${ADMIN_PASSWORD:-121212}
    depends_on:
      postgres:
        condition: service_healthy
        required: false` : codeTab === 'schema' ?
`CREATE TABLE admin_users (id, username, password_hash, name, role...);
CREATE TABLE properties (...);
CREATE TABLE leads (...);
CREATE TABLE visits (...);` :
`INSERT INTO properties (...) VALUES ('prop-1', ...);`;
                      copySnippet(code);
                    }}
                    className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 px-3 py-1.5 rounded-lg"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <div className="p-6 bg-neutral-950 text-neutral-200 font-mono text-xs overflow-x-auto max-h-96">
                  {codeTab === 'docker' && (
                    <pre>{`# Multi-stage Dockerfile for RWimóveis Fullstack Application
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package descriptors & install
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend and bundled Node server
RUN npm run build

# Production runner image
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/schema.sql ./schema.sql
COPY --from=builder /app/seed_demo.sql ./seed_demo.sql

EXPOSE 3000
CMD ["node", "dist/server.cjs"]`}</pre>
                  )}

                  {codeTab === 'compose' && (
                    <pre>{`version: '3.8'

services:
  # 1. Serviço Postgres Embutido (Padrão)
  postgres:
    image: postgres:16-alpine
    container_name: rwimoveis_postgres
    restart: always
    environment:
      POSTGRES_DB: rwimoveis
      POSTGRES_USER: rwimoveis_user
      POSTGRES_PASSWORD: rwimoveis_secret_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./schema.sql:/docker-entrypoint-initdb.d/init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rwimoveis_user -d rwimoveis"]
      interval: 5s
      timeout: 5s
      retries: 5

  # 2. Aplicação RWimóveis Node.js (Suporta Postgres Embutido ou Externo)
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: rwimoveis_app
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      # Sobrescreva DATABASE_URL no .env caso use banco externo!
      DATABASE_URL: \${DATABASE_URL:-postgres://rwimoveis_user:rwimoveis_secret_password@postgres:5432/rwimoveis}
      ADMIN_USER: \${ADMIN_USER:-admin}
      ADMIN_PASSWORD: \${ADMIN_PASSWORD:-121212}
    depends_on:
      postgres:
        condition: service_healthy
        required: false

# DICA PARA POSTGRES EXTERNO:
# docker compose run --no-deps -e DATABASE_URL="postgres://user:pass@meu-rds:5432/db" -p 3000:3000 app
# ou defina DATABASE_URL no .env e suba apenas: docker compose up -d --no-deps app`}</pre>
                  )}

                  {codeTab === 'schema' && (
                    <pre>{`-- RWimóveis PostgreSQL Schema DDL (Apenas Estrutura Limpa para Produção)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Usuários Administrativos (Senha com bcrypt)
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Imóveis
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    purpose VARCHAR(32) NOT NULL,
    price NUMERIC(14, 2) NOT NULL,
    condo_fee NUMERIC(10, 2) DEFAULT 0,
    iptu NUMERIC(10, 2) DEFAULT 0,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(128) NOT NULL,
    city VARCHAR(128) NOT NULL,
    state VARCHAR(4) NOT NULL,
    bedrooms INT NOT NULL DEFAULT 0,
    suites INT NOT NULL DEFAULT 0,
    bathrooms INT NOT NULL DEFAULT 0,
    parking_spots INT NOT NULL DEFAULT 0,
    area NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    images JSONB NOT NULL DEFAULT '[]',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'Disponível',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRM Leads & Funil Kanban
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE SET NULL,
    stage VARCHAR(32) NOT NULL DEFAULT 'novo',
    source VARCHAR(64) NOT NULL,
    notes TEXT,
    value NUMERIC(14, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_contact_date TIMESTAMP WITH TIME ZONE
);

-- 4. Métricas e Visitas
CREATE TABLE IF NOT EXISTS visits (
    id VARCHAR(64) PRIMARY KEY,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE CASCADE,
    property_title VARCHAR(255),
    user_agent TEXT,
    referrer TEXT,
    city VARCHAR(128),
    device VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed de Segurança: Administrador com hash bcrypt
INSERT INTO admin_users (id, username, password_hash, name, role)
VALUES ('admin-1', 'admin', '$2b$10$UR6dR0Kw2VIZowl3gIdpROei3I7bzixn3Jle.O0mEnApCoph0JD.u', 'Administrador RWimóveis', 'admin')
ON CONFLICT (username) DO NOTHING;`}</pre>
                  )}

                  {codeTab === 'seed' && (
                    <pre>{`-- RWimóveis - seed_demo.sql (Dados de Teste com 6 Imóveis)
-- Execute apenas se desejar popular o banco com anúncios demonstrativos:
-- psql -U rwimoveis_user -d rwimoveis -f seed_demo.sql

INSERT INTO properties (
    id, code, title, type, purpose, price, condo_fee, iptu,
    address, neighborhood, city, state, bedrooms, suites, bathrooms,
    parking_spots, area, description, features, images, featured, views_count, status
) VALUES 
(
    'prop-1', 'RW-101', 'Cobertura Duplex com Vista Panorâmica para a Baía do Guajará na Doca', 'Cobertura', 'Comprar',
    2750000.00, 2600.00, 920.00, 'Avenida Visconde de Souza Franco (Doca), 1150', 'Umarizal', 'Belém', 'PA',
    4, 4, 6, 4, 310.00,
    'Espetacular cobertura duplex no trecho mais nobre da Doca de Souza Franco...',
    '["Vista Eterna para a Baía do Guajará", "Piscina Privativa no Terraço", "Varanda Gourmet com Churrasqueira"]',
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80"]',
    true, 412, 'Disponível'
),
-- [Mais 5 imóveis de exemplo no arquivo seed_demo.sql]
ON CONFLICT (id) DO NOTHING;`}</pre>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Property Create / Edit Modal */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-lg font-black text-neutral-900">
                {editingProperty ? 'Editar Anúncio' : 'Cadastrar Novo Anúncio'}
              </h3>
              <button onClick={() => setIsPropertyModalOpen(false)} className="p-1 rounded text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Título do Imóvel *</label>
                <input
                  type="text"
                  required
                  value={propForm.title}
                  onChange={e => setPropForm({ ...propForm, title: e.target.value })}
                  placeholder="Ex: Cobertura Triplex com Vista Maravilhosa"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Tipo</label>
                  <select
                    value={propForm.type}
                    onChange={e => setPropForm({ ...propForm, type: e.target.value as PropertyType })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Studio">Studio</option>
                    <option value="Terreno">Terreno</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Finalidade</label>
                  <select
                    value={propForm.purpose}
                    onChange={e => setPropForm({ ...propForm, purpose: e.target.value as PropertyPurpose })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  >
                    <option value="Comprar">Comprar</option>
                    <option value="Alugar">Alugar</option>
                    <option value="Lançamentos">Lançamentos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    required
                    value={propForm.price}
                    onChange={e => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Área (m²) *</label>
                  <input
                    type="number"
                    required
                    value={propForm.area}
                    onChange={e => setPropForm({ ...propForm, area: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Quartos</label>
                  <input
                    type="number"
                    value={propForm.bedrooms}
                    onChange={e => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Suítes</label>
                  <input
                    type="number"
                    value={propForm.suites}
                    onChange={e => setPropForm({ ...propForm, suites: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Banheiros</label>
                  <input
                    type="number"
                    value={propForm.bathrooms}
                    onChange={e => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Vagas</label>
                  <input
                    type="number"
                    value={propForm.parkingSpots}
                    onChange={e => setPropForm({ ...propForm, parkingSpots: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Endereço</label>
                  <input
                    type="text"
                    value={propForm.address}
                    onChange={e => setPropForm({ ...propForm, address: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={propForm.neighborhood}
                    onChange={e => setPropForm({ ...propForm, neighborhood: e.target.value })}
                    className="w-full p-2 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Cidade / UF</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={propForm.city}
                      onChange={e => setPropForm({ ...propForm, city: e.target.value })}
                      placeholder="Cidade"
                      className="w-3/4 p-2 rounded-xl border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={propForm.state}
                      onChange={e => setPropForm({ ...propForm, state: e.target.value })}
                      placeholder="UF"
                      className="w-1/4 p-2 rounded-xl border border-neutral-300 uppercase"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Descrição</label>
                <textarea
                  rows={3}
                  value={propForm.description}
                  onChange={e => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Diferenciais (separados por vírgula)</label>
                <input
                  type="text"
                  value={propForm.features}
                  onChange={e => setPropForm({ ...propForm, features: e.target.value })}
                  placeholder="Piscina, Churrasqueira, Varanda Gourmet"
                  className="w-full p-2 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">URLs das Fotos (uma por linha)</label>
                <textarea
                  rows={2}
                  value={propForm.images}
                  onChange={e => setPropForm({ ...propForm, images: e.target.value })}
                  className="w-full p-2 rounded-xl border border-neutral-300 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={propForm.featured}
                  onChange={e => setPropForm({ ...propForm, featured: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="featuredCheck" className="font-bold text-neutral-800 cursor-pointer">
                  Exibir em destaque no Hero da página inicial
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Salvar no Banco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Create / Edit Modal */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-lg font-black text-neutral-900">
                {editingLead ? 'Editar Lead CRM' : 'Cadastrar Novo Lead'}
              </h3>
              <button onClick={() => setIsLeadModalOpen(false)} className="p-1 rounded text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="Nome do cliente"
                  className="w-full p-2.5 rounded-xl border border-neutral-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                    placeholder="email@cliente.com"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Etapa do Funil</label>
                  <select
                    value={leadForm.stage}
                    onChange={e => setLeadForm({ ...leadForm, stage: e.target.value as LeadStage })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  >
                    <option value="novo">Novos Leads</option>
                    <option value="contato">Em Atendimento</option>
                    <option value="visita">Visita Agendada</option>
                    <option value="proposta">Proposta Enviada</option>
                    <option value="fechado">Contrato Fechado</option>
                    <option value="perdido">Perdido</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={leadForm.value}
                    onChange={e => setLeadForm({ ...leadForm, value: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Imóvel de Interesse</label>
                <select
                  value={leadForm.propertyId}
                  onChange={e => setLeadForm({ ...leadForm, propertyId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                >
                  <option value="">Geral / Sem imóvel específico</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Observações & Histórico</label>
                <textarea
                  rows={3}
                  value={leadForm.notes}
                  onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="Informações sobre perfil, horários de preferência, etc."
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
