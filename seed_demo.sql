-- ==========================================================
-- RWimóveis - Dados de Demonstração (Seed Demo)
-- Execute este script APENAS se desejar carregar imóveis fictícios de exemplo
-- Uso: psql -U rwimoveis_user -d rwimoveis -f seed_demo.sql
-- ==========================================================

INSERT INTO properties (
    id, code, title, type, purpose, price, condo_fee, iptu,
    address, neighborhood, city, state, bedrooms, suites, bathrooms,
    parking_spots, area, description, features, images, featured, views_count, status
) VALUES 
(
    'prop-1', 'RW-101', 'Cobertura Duplex com Vista Panorâmica para a Baía do Guajará na Doca', 'Cobertura', 'Comprar',
    2750000.00, 2600.00, 920.00, 'Avenida Visconde de Souza Franco (Doca), 1150', 'Umarizal', 'Belém', 'PA',
    4, 4, 6, 4, 310.00,
    'Espetacular cobertura duplex no trecho mais nobre da Doca de Souza Franco. Vista eterna e cinematográfica para a Baía do Guajará e o pôr do sol paraense. Living com pé-direito duplo, terraço gourmet integrado com piscina privativa aquecida, espaço de spa, marcenaria de alto luxo e automação completa de iluminação e climatização.',
    '["Vista Eterna para a Baía do Guajará", "Piscina Privativa no Terraço", "Varanda Gourmet com Churrasqueira", "4 Suítes com Closets Planejados", "Portaria 24h Blindada com Reconhecimento Facial", "Spa com Banheira de Hidromassagem", "Adega Climatizada para 120 Rótulos", "4 Vagas de Garagem Cobertas e Livres"]',
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"]',
    true, 412, 'Disponível'
),
(
    'prop-2', 'RW-102', 'Apartamento de Altíssimo Padrão Frente à Praça Batista Campos', 'Apartamento', 'Comprar',
    1980000.00, 1750.00, 640.00, 'Travessa Padre Eutíquio, 1850', 'Batista Campos', 'Belém', 'PA',
    3, 3, 5, 3, 230.00,
    'Um por andar com vista privilegiada para o verde exuberante da Praça Batista Campos. Amplo living integrado para três ambientes, varanda gourmet com fechamento em cortina de vidro e bancada em ilha. Suíte master com sala de banho com hidromassagem e acabamentos importados em mármore calacatta.',
    '["1 Apartamento por Andar Privativo", "Vista Panorâmica da Praça Batista Campos", "Varanda Gourmet com Cortina de Vidro", "Gerador de Energia 100% que atende o apartamento", "Elevador Social com Biometria", "Condomínio com Academia Reebok e Piscina Aquecida", "Suíte Master com Closet Walk-in", "3 Vagas de Garagem Soltas"]',
    '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80"]',
    true, 389, 'Disponível'
),
(
    'prop-3', 'RW-103', 'Mansão Contemporânea em Condomínio Fechado Greenville', 'Casa', 'Comprar',
    3850000.00, 1600.00, 880.00, 'Alameda das Castanheiras, Condomínio Greenville I', 'Parque Verde', 'Belém', 'PA',
    4, 4, 6, 4, 520.00,
    'Projeto arquitetônico de tirar o fôlego no condomínio fechado mais desejado de Belém. Casa nova recém-construída em lote de esquina de 800m². Sala com pé-direito quádruplo, piscina com borda infinita e cascata em pedras naturais, espaço gourmet com forno de pizza e chopeira embutida, energia solar fotovoltaica e poço artesiano próprio.',
    '["Condomínio Fechado com Segurança e Ronda Armada 24h", "Piscina Aquecida com Deck Molhado e Cascata", "Energia Solar Fotovoltaica e Poço Artesiano", "Adega Climatizada e Espaço Gourmet Completo", "Heliponto e Quadras de Tênis de Saibro no Condomínio", "Lote Amplo de 800m² com Paisagismo Tropical", "Suíte Master com Sacada e Banheira de Imersão", "Dependência Completa de Funcionários"]',
    '["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80"]',
    true, 524, 'Disponível'
),
(
    'prop-4', 'RW-104', 'Apartamento Nobre em Andar Alto na Tradicional Avenida Nazaré', 'Apartamento', 'Lançamentos',
    1350000.00, 1400.00, 490.00, 'Avenida Nazaré, 890 (Próximo à Basílica)', 'Nazaré', 'Belém', 'PA',
    3, 3, 4, 2, 195.00,
    'Tradição, imponência e elegância sob as mangueiras centenárias de Nazaré. Andar alto com ventilação nordeste abundante e vista aberta. Living integrado a varanda ampla, pisos em tábua corrida de madeira nobre restaurada e mármore, condomínio reformado com gerador de energia e salão de festas climatizado.',
    '["Localização Histórica a Passos da Basílica de Nazaré", "Ventilação Nordeste Constante e Andar Alto", "Pisos em Madeira Nobre e Mármore", "Varanda Arejada com Vista para a Copa das Mangueiras", "Gerador Total para Áreas Comuns e Apartamentos", "Portaria 24h com Circuito Interno de TV", "Salão de Festas Climatizado e Espaço Fitness", "2 Vagas de Garagem Privativas"]',
    '["https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80"]',
    true, 310, 'Disponível'
),
(
    'prop-5', 'RW-105', 'Apartamento Contemporâneo com Varanda Gourmet no Bairro do Marco', 'Apartamento', 'Comprar',
    890000.00, 780.00, 320.00, 'Avenida Rômulo Maiorana (Antiga Duque), 1420', 'Marco', 'Belém', 'PA',
    3, 1, 3, 2, 125.00,
    'Condomínio clube de última geração em localização estratégica no Marco, a poucos minutos do Bosque Rodrigues Alves. Varanda gourmet ampla com churrasqueira a carvão e bancada em granito São Gabriel. Lazer de resort com piscina adulto de 25m, quadra poliesportiva, brinquedoteca e espaço pet.',
    '["Próximo ao Bosque Rodrigues Alves e Ciclovia", "Varanda Gourmet com Churrasqueira a Carvão", "Condomínio Clube com Piscina de 25 metros", "Academia com Equipamentos de Linha Profissional", "Quadra Poliesportiva e Espaço Gourmet com Forno de Pizza", "Salão de Jogos e Coworking Integrado", "2 Vagas de Garagem Cobertas", "Segurança e Acesso por Biometria"]',
    '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80"]',
    true, 275, 'Disponível'
),
(
    'prop-6', 'RW-106', 'Studio Design Mobiliado e Decorado na Doca com Vista Baía', 'Studio', 'Alugar',
    4200.00, 580.00, 150.00, 'Avenida Visconde de Souza Franco (Doca), 720', 'Umarizal', 'Belém', 'PA',
    1, 1, 1, 1, 52.00,
    'Studio compacto de luxo totalmente decorado e mobiliado por renomado escritório paraense de arquitetura. Cama queen com baú, cooktop por indução, fechadura digital e varanda com vista aberta para a movimentação charmosa da Doca e Baía do Guajará. Rooftop com piscina de borda infinita, bar e coworking 24h no 26º andar.',
    '["Totalmente Mobiliado e Decorado com Eletros em Inox", "Rooftop no 26º Andar com Piscina de Borda Infinita e Vista Baía", "Coworking 24h com Sala de Reuniões Climatizada", "Lavanderia Coletiva OMO Inteligente", "Fechadura Biométrica Digital e Automação de Luzes", "Serviço de Concierge e Recepção 24h", "Bicicletário com Bikes Compartilhadas", "Academia com Vista Panorâmica"]',
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1502005229762-ee152da7c5d6?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80"]',
    true, 498, 'Disponível'
)
ON CONFLICT (id) DO NOTHING;
