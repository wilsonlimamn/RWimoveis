-- ==========================================================
-- RWimóveis - PostgreSQL Schema DDL
-- Compatível com PostgreSQL 14, 15, 16 e Docker Compose
-- Contém apenas a estrutura de tabelas, índices e conta admin inicial com hash bcrypt
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

-- SEED MÍNIMO OBRIGATÓRIO: CONTA ADMINISTRADOR COM HASH BCRYPT
-- Usuário: admin | Senha: password_hash com bcrypt ($2b$10$UR6dR0Kw2VIZowl3gIdpROei3I7bzixn3Jle.O0mEnApCoph0JD.u para a senha padrão '121212')
INSERT INTO admin_users (id, username, password_hash, name, role)
VALUES ('admin-1', 'admin', '$2b$10$UR6dR0Kw2VIZowl3gIdpROei3I7bzixn3Jle.O0mEnApCoph0JD.u', 'Administrador RWimóveis', 'admin')
ON CONFLICT (username) DO NOTHING;

-- OBSERVAÇÃO PARA PRODUÇÃO:
-- Imóveis de demonstração foram separados no arquivo 'seed_demo.sql'.
-- Para carregar dados fictícios de teste, execute: psql -U <user> -d <db> -f seed_demo.sql
