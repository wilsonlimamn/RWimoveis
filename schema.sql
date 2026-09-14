-- ==========================================================
-- RWimóveis - PostgreSQL Schema & Seed Script
-- Compatível com PostgreSQL 14, 15, 16 e Docker Compose
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE USUÁRIOS ADMINISTRATIVOS
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(64) PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(128) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE IMÓVEIS (ANÚNCIOS)
CREATE TABLE IF NOT EXISTS properties (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    purpose VARCHAR(32) NOT NULL, -- 'Comprar', 'Alugar', 'Lançamentos'
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

-- 3. TABELA DE LEADS (CRM & FUNIL DE VENDAS KANBAN)
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(64) NOT NULL,
    property_id VARCHAR(64) REFERENCES properties(id) ON DELETE SET NULL,
    stage VARCHAR(32) NOT NULL DEFAULT 'novo', -- 'novo', 'contato', 'visita', 'proposta', 'fechado', 'perdido'
    source VARCHAR(64) NOT NULL,
    notes TEXT,
    value NUMERIC(14, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_contact_date TIMESTAMP WITH TIME ZONE
);

-- 4. TABELA DE VISITAS E MÉTRICAS
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

-- CRIAÇÃO DE ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_properties_purpose ON properties(purpose);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_visits_property_id ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_timestamp ON visits(timestamp);

-- SEED: CONTA ADMINISTRADOR (admin / 121212)
INSERT INTO admin_users (id, username, password_hash, name, role)
VALUES ('admin-1', 'admin', '121212', 'Administrador RWimóveis', 'admin')
ON CONFLICT (username) DO NOTHING;

-- SEED: 6 ANÚNCIOS REAIS DE TESTE NO BANCO DE DADOS
INSERT INTO properties (
    id, code, title, type, purpose, price, condo_fee, iptu,
    address, neighborhood, city, state, bedrooms, suites, bathrooms,
    parking_spots, area, description, features, images, featured, views_count, status
) VALUES 
(
    'prop-1', 'RW-101', 'Cobertura Duplex com Vista Panorâmica nos Jardins', 'Cobertura', 'Comprar',
    2450000.00, 2400.00, 850.00, 'Alameda Lorena, 1450', 'Jardins', 'São Paulo', 'SP',
    4, 3, 5, 4, 280.00,
    'Espetacular cobertura duplex no coração dos Jardins. Living com pé-direito duplo, terraço gourmet integrado com spa privativo e vista livre de 360° para a cidade.',
    '["Piscina Privativa", "Varanda Gourmet", "Churrasqueira", "Ar Condicionado Central", "Portaria 24h Blindada", "Spa com Hidromassagem", "Adega Climatizada", "Depósito Privativo"]',
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"]',
    true, 384, 'Disponível'
),
(
    'prop-2', 'RW-102', 'Casa Contemporânea em Condomínio Fechado no Cambuí', 'Casa', 'Comprar',
    1850000.00, 1100.00, 480.00, 'Rua Coronel Quirino, 880', 'Cambuí', 'Campinas', 'SP',
    3, 3, 4, 3, 320.00,
    'Projeto arquitetônico assinado com linhas retas, integração total entre área social e jardim. Piscina aquecida com deck molhado, espaço gourmet com chopeira embutida.',
    '["Piscina Aquecida", "Energia Solar Fotovoltaica", "Jardim Paisagístico", "Espaço Gourmet", "Condomínio Fechado", "Segurança e Ronda 24h", "Suíte Master com Hidro", "Escritório"]',
    '["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80"]',
    true, 295, 'Disponível'
),
(
    'prop-3', 'RW-103', 'Apartamento Frente Mar com Varanda na Barra da Tijuca', 'Apartamento', 'Comprar',
    1420000.00, 1650.00, 590.00, 'Avenida Lúcio Costa, 3200', 'Barra da Tijuca', 'Rio de Janeiro', 'RJ',
    3, 2, 3, 2, 145.00,
    'Acorde todos os dias com o mar na sua janela. Apartamento impecável em andar alto no posto 4 da Barra da Tijuca com ampla varanda em cortina de vidro.',
    '["Vista Eterna para o Mar", "Varanda com Cortina de Vidro", "Piscina Olímpica", "Academia Reebok", "Sauna Seca e Úmida", "Quadra de Tênis de Saibro", "Acesso Direto à Praia"]',
    '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80"]',
    true, 420, 'Disponível'
),
(
    'prop-4', 'RW-104', 'Mansão de Luxo com Piscina de Borda Infinita em Alphaville', 'Casa', 'Lançamentos',
    3900000.00, 1950.00, 920.00, 'Avenida das Palmeiras, Residencial 1', 'Alphaville', 'Barueri', 'SP',
    5, 5, 7, 6, 580.00,
    'Obra-prima arquitetônica recém-concluída com elevador panorâmico, adega climatizada para 600 garrafas e piscina de borda infinita.',
    '["Elevador Panorâmico", "Borda Infinita", "Adega Climatizada 600 garrafas", "Cinema Privativo", "Automação Control4", "6 Vagas Cobertas"]',
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1400&q=80"]',
    true, 512, 'Disponível'
),
(
    'prop-5', 'RW-105', 'Apartamento Alto Padrão Face Norte no Batel', 'Apartamento', 'Comprar',
    980000.00, 920.00, 340.00, 'Rua Bispo Dom José, 2100', 'Batel', 'Curitiba', 'PR',
    3, 1, 2, 2, 118.00,
    'Localização nobre e arborizada no Batel com incidência solar perfeita o dia todo, piso aquecido nos banheiros e lareira no living.',
    '["Face Norte Privilegiada", "Churrasqueira a Carvão", "Piso Aquecido nos Banheiros", "Lareira a Lenha", "Salão de Festas", "2 Vagas Livres"]',
    '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80"]',
    true, 231, 'Disponível'
),
(
    'prop-6', 'RW-106', 'Studio Design Mobiliado e Decorado no Itaim Bibi', 'Studio', 'Alugar',
    4600.00, 650.00, 180.00, 'Rua Joaquim Floriano, 750', 'Itaim Bibi', 'São Paulo', 'SP',
    1, 0, 1, 1, 48.00,
    'Studio compacto de luxo totalmente mobiliado e decorado. Rooftop com piscina com borda infinita no 28º andar e coworking 24h.',
    '["Totalmente Mobiliado e Equipado", "Rooftop com Piscina e Bar", "Coworking 24h", "Lavanderia OMO", "Fechadura Biométrica", "Bicicletário"]',
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1502005229762-ee152da7c5d6?auto=format&fit=crop&w=1400&q=80"]',
    true, 468, 'Disponível'
)
ON CONFLICT (id) DO NOTHING;
