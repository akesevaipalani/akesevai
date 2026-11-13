import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'pan-card-service',
  title: SEO03_SERVICE_PAGES['pan-card-service'].seo.title
};

export default function PanCardServicePage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['pan-card-service']}
      navigate={navigate}
      lang={lang}
    />
  );
}

