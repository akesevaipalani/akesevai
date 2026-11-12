import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'patta-chitta',
  title: SEO03_SERVICE_PAGES['patta-chitta'].seo.title
};

export default function PattaChittaPage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['patta-chitta']}
      navigate={navigate}
      lang={lang}
    />
  );
}

