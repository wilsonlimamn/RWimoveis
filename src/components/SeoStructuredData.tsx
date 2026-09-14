import React, { useEffect } from 'react';
import { Property } from '../types.ts';
import { BelemNeighborhood } from '../data/belem-neighborhoods.ts';
import { getPropertyCleanUrl, getNeighborhoodGuideCleanUrl } from '../utils/seoRouter.ts';

interface SeoStructuredDataProps {
  property?: Property | null;
  neighborhood?: BelemNeighborhood | null;
  pageTitle?: string;
  pageDescription?: string;
  canonicalUrl?: string;
}

export const SeoStructuredData: React.FC<SeoStructuredDataProps> = ({
  property,
  neighborhood,
  pageTitle,
  pageDescription,
  canonicalUrl
}) => {
  useEffect(() => {
    // Dynamic update of document title and meta description
    if (pageTitle) {
      document.title = `${pageTitle} | RWimóveis Belém`;
    } else if (property) {
      document.title = `${property.code} - ${property.title} | ${property.neighborhood}, Belém-PA | RWimóveis`;
    } else if (neighborhood) {
      document.title = `Guia do Bairro ${neighborhood.name} em Belém-PA | Imóveis e Preço do m² | RWimóveis`;
    } else {
      document.title = 'RWimóveis | Imóveis de Alto Padrão em Belém - PA';
    }

    const desc = pageDescription || 
      (property ? `${property.title}. ${property.bedrooms} quartos, ${property.suites} suítes, ${property.area}m² no bairro ${property.neighborhood}, Belém-PA. R$ ${property.price.toLocaleString('pt-BR')}.` : 
      neighborhood ? `Conheça o bairro ${neighborhood.name} em Belém-PA: preço médio de R$ ${neighborhood.averagePriceM2}/m², infraestrutura e imóveis selecionados à venda.` :
      'Encontre os melhores imóveis de alto padrão em Belém do Pará. Coberturas e apartamentos no Umarizal, Batista Campos, Nazaré, Marco e Greenville.');

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', document.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', desc);
    }

    // Inject or update Schema.org JSON-LD in head
    const existingScript = document.getElementById('rwimoveis-schema-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'rwimoveis-schema-jsonld';
    script.type = 'application/ld+json';

    const baseUrl = window.location.origin;

    // RealEstateAgent Organization schema
    const agencySchema = {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      '@id': `${baseUrl}/#realestateagent`,
      name: 'RWimóveis Belém',
      legalName: 'RW Imóveis Selecionados Belém Ltda.',
      description: 'Imobiliária especialista em imóveis residenciais de alto padrão em Belém - PA (Umarizal, Batista Campos, Nazaré, Marco, Parque Verde).',
      url: baseUrl,
      telephone: '+55-91-3210-9876',
      priceRange: '$$$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Avenida Visconde de Souza Franco, 1150 - Edifício Metropolitan Tower',
        addressLocality: 'Belém',
        addressRegion: 'PA',
        postalCode: '66055-000',
        addressCountry: 'BR'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -1.4428,
        longitude: -48.4878
      },
      areaServed: [
        'Umarizal, Belém - PA',
        'Nazaré, Belém - PA',
        'Batista Campos, Belém - PA',
        'Marco, Belém - PA',
        'Parque Verde, Belém - PA',
        'Belém, Pará'
      ]
    };

    let payload: any = agencySchema;

    if (property) {
      const propCleanUrl = `${baseUrl}${getPropertyCleanUrl(property)}`;
      const propertySchema = {
        '@context': 'https://schema.org',
        '@type': ['RealEstateListing', property.type === 'Casa' ? 'SingleFamilyResidence' : 'Apartment'],
        '@id': propCleanUrl,
        name: property.title,
        description: property.description,
        url: propCleanUrl,
        identifier: property.code,
        image: property.images,
        numberOfRooms: property.bedrooms + 2,
        numberOfBedrooms: property.bedrooms,
        numberOfBathroomsTotal: property.bathrooms,
        floorSize: {
          '@type': 'QuantitativeValue',
          value: property.area,
          unitCode: 'MTK'
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: property.address,
          addressLocality: property.city,
          addressRegion: property.state,
          addressCountry: 'BR'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -1.445,
          longitude: -48.485
        },
        offers: {
          '@type': 'Offer',
          price: property.price,
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
          validFrom: property.createdAt,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: property.price,
            priceCurrency: 'BRL',
            unitText: property.purpose === 'Alugar' ? 'mês' : 'imóvel'
          }
        },
        provider: {
          '@id': `${baseUrl}/#realestateagent`
        }
      };

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: baseUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `Imóveis em ${property.neighborhood}, Belém-PA`,
            item: `${baseUrl}/apartamentos-venda-${property.neighborhood.toLowerCase()}-belem-pa`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: property.title,
            item: propCleanUrl
          }
        ]
      };

      payload = [agencySchema, propertySchema, breadcrumbSchema];
    } else if (neighborhood) {
      const guideCleanUrl = `${baseUrl}${getNeighborhoodGuideCleanUrl(neighborhood.slug)}`;
      const neighborhoodSchema = {
        '@context': 'https://schema.org',
        '@type': 'Place',
        '@id': guideCleanUrl,
        name: `Bairro ${neighborhood.name} em Belém, Pará`,
        description: neighborhood.description,
        url: guideCleanUrl,
        image: neighborhood.heroImage,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Belém',
          addressRegion: 'PA',
          addressCountry: 'BR'
        },
        containedInPlace: {
          '@type': 'City',
          name: 'Belém'
        }
      };

      payload = [agencySchema, neighborhoodSchema];
    }

    script.textContent = JSON.stringify(payload, null, 2);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('rwimoveis-schema-jsonld');
      if (el) el.remove();
    };
  }, [property, neighborhood, pageTitle, pageDescription, canonicalUrl]);

  return null;
};
