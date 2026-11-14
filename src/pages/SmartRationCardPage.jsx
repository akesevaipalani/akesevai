import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'smart-ration-card',
  title: SEO03_SERVICE_PAGES['smart-ration-card'].seo.title
};

export default function SmartRationCardPage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['smart-ration-card']}
      navigate={navigate}
      lang={lang}
    />
  );
}

