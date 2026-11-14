import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'esevai-application-assistance',
  title: SEO03_SERVICE_PAGES['esevai-application-assistance'].seo.title
};

export default function EsevaiApplicationAssistancePage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['esevai-application-assistance']}
      navigate={navigate}
      lang={lang}
    />
  );
}

