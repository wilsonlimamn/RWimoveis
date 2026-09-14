export interface BelemNeighborhood {
  id: string;
  name: string;
  slug: string;
  cleanListingUrl: string;
  cleanGuideUrl: string;
  heroImage: string;
  averagePriceM2: number; // R$/m²
  appreciationRateYear: number; // % ao ano
  tagline: string;
  highlights: string[];
  description: string;
  keyAvenues: string[];
  lifestyle: string;
  safetyRating: string;
}

export const BELEM_NEIGHBORHOODS: BelemNeighborhood[] = [
  {
    id: 'bairro-umarizal',
    name: 'Umarizal',
    slug: 'umarizal',
    cleanListingUrl: '/apartamentos-venda-umarizal-belem-pa',
    cleanGuideUrl: '/bairros/guia-umarizal-belem-pa',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    averagePriceM2: 9400,
    appreciationRateYear: 14.8,
    tagline: 'O metro quadrado mais cosmopolita e valorizado de Belém',
    highlights: [
      'Avenida Visconde de Souza Franco (A emblemática Doca)',
      'Polo gastronômico com os restaurantes mais premiados da Amazônia',
      'Boulevard Shopping Belém e centros médicos de referência',
      'Edifícios de altíssimo padrão com vista para a Baía do Guajará'
    ],
    description: 'O Umarizal é o coração pulsante da sofisticação paraense. O bairro reúne arranha-céus imponentes, vida noturna requintada e os melhores endereços comerciais e gastronômicos da capital. Com o calçadão da Doca para caminhadas ao entardecer e contemplação da Baía do Guajará, atrai famílias e executivos que não abrem mão de requinte, mobilidade e lazer sofisticado.',
    keyAvenues: ['Av. Visconde de Souza Franco (Doca)', 'Rua Domingos Marreiros', 'Rua Bernal do Couto', 'Av. Senador Lemos'],
    lifestyle: 'Urbano de alto luxo, gastronomia internacional e lazer cosmopolita',
    safetyRating: 'Excelente (patrulhamento contínuo e portarias blindadas)'
  },
  {
    id: 'bairro-nazare',
    name: 'Nazaré',
    slug: 'nazare',
    cleanListingUrl: '/apartamentos-venda-nazare-belem-pa',
    cleanGuideUrl: '/bairros/guia-nazare-belem-pa',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    averagePriceM2: 8900,
    appreciationRateYear: 11.5,
    tagline: 'Tradição, fé e nobreza sob o túnel de mangueiras centenárias',
    highlights: [
      'Basílica Santuário de Nossa Senhora de Nazaré (epicentro do Círio)',
      'Avenida Nazaré e Magalhães Barata com túnel de mangueiras tombadas',
      'Colégios tradicionais (Marista, Santa Catarina) e hospitais de ponta',
      'Plantas amplas clássicas e edifícios de arquitetura atemporal'
    ],
    description: 'Nazaré é a essência cultural e afetiva de Belém. Bairro arborizado, com casarões históricos preservados convivendo em harmonia com empreendimentos residenciais de grande porte. Viver em Nazaré significa ter farmácias, clínicas, colégios e empórios finos a poucos passos, em uma atmosfera nobre e acolhedora.',
    keyAvenues: ['Avenida Nazaré', 'Avenida Generalíssimo Deodoro', 'Avenida Magalhães Barata', 'Travessa 14 de Março'],
    lifestyle: 'Nobreza clássica, ruas arborizadas e conveniência a pé',
    safetyRating: 'Excelente (região nobre consolidada)'
  },
  {
    id: 'bairro-batista-campos',
    name: 'Batista Campos',
    slug: 'batista-campos',
    cleanListingUrl: '/apartamentos-venda-batista-campos-belem-pa',
    cleanGuideUrl: '/bairros/guia-batista-campos-belem-pa',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    averagePriceM2: 9600,
    appreciationRateYear: 15.2,
    tagline: 'O refúgio verde mais charmoso e cobiçado de Belém',
    highlights: [
      'Praça Batista Campos (premiada como uma das mais belas praças do Brasil)',
      'Lagos ornamentais, pontes de ferro e coretos do início do século XX',
      'Ambiente familiar perfeito para esportes ao ar livre e passeios',
      'Proximidade ao Shopping Pátio Belém e centro financeiro'
    ],
    description: 'Batista Campos é sinônimo de qualidade de vida superior. O bairro se desenvolve ao redor da famosa Praça Batista Campos, verdadeiro oásis verde em pleno centro urbano. Os apartamentos que circundam a praça possuem vista perene para as copas das árvores e figuram entre os imóveis mais disputados e valorizados de todo o Norte do país.',
    keyAvenues: ['Travessa Padre Eutíquio', 'Rua dos Mundurucus', 'Rua dos Pariquis', 'Travessa Apinagés'],
    lifestyle: 'Tranquilidade familiar, caminhadas verdes e alta gastronomia',
    safetyRating: 'Excelente (área residencial pacífica e monitorada)'
  },
  {
    id: 'bairro-marco',
    name: 'Marco',
    slug: 'marco',
    cleanListingUrl: '/apartamentos-venda-marco-belem-pa',
    cleanGuideUrl: '/bairros/guia-marco-belem-pa',
    heroImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    averagePriceM2: 7800,
    appreciationRateYear: 13.0,
    tagline: 'Expansão moderna, ruas largas e conexão direta com a natureza',
    highlights: [
      'Bosque Rodrigues Alves (Jardim Zoobotânico da Amazônia)',
      'Avenida Rômulo Maiorana (polo gastronômico e ciclovia ampla)',
      'Polo de saúde e clínicas médicas universitárias',
      'Acesso ágil para saída de Belém e bairros centrais'
    ],
    description: 'O Marco é um dos bairros que mais se modernizou na última década. Com avenidas largas e o privilégio de abrigar o Bosque Rodrigues Alves com sua floresta nativa preservada, oferece excelente infraestrutura para famílias que desejam condomínios clube completos com piscinas, quadras esportivas e varandas gourmet amplas.',
    keyAvenues: ['Avenida Rômulo Maiorana', 'Avenida Almirante Barroso', 'Travessa Mauriti', 'Travessa Lomas Valentinas'],
    lifestyle: 'Moderno, familiar, com clubes privativos e ciclovias',
    safetyRating: 'Muito bom (avenidas iluminadas e comércio ativo)'
  },
  {
    id: 'bairro-parque-verde',
    name: 'Parque Verde / Augusto Montenegro',
    slug: 'parque-verde',
    cleanListingUrl: '/casas-condominio-parque-verde-belem-pa',
    cleanGuideUrl: '/bairros/guia-parque-verde-belem-pa',
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    averagePriceM2: 7100,
    appreciationRateYear: 16.5,
    tagline: 'O paraíso dos condomínios horizontais fechados e mansões de luxo',
    highlights: [
      'Condomínios icônicos: Greenville I e II, Montenegro Boulevard e Água Cristal',
      'Segurança com ronda armada 24 horas e controle biométrico',
      'Parque Shopping Belém com grifes e cinema VIP',
      'Casas imponentes com piscinas privativas e lotes amplos de até 800m²'
    ],
    description: 'Para quem busca o conforto de viver em uma casa imponente com privacidade total, o Parque Verde na Rodovia Augusto Montenegro é o principal endereço de Belém. Condomínios horizontais fechados com infraestrutura de resort internacional, lagos privativos, heliponto e segurança armada, oferecendo um estilo de vida exclusivo para famílias de alto padrão.',
    keyAvenues: ['Rodovia Augusto Montenegro', 'Avenida Mário Covas', 'Acesso ao Parque Shopping'],
    lifestyle: 'Exclusividade horizontal, tranquilidade para crianças e segurança total',
    safetyRating: 'Máxima (condomínios fechados com segurança privada 24h)'
  }
];
