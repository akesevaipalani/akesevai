import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'income-certificate',
  title: SEO03_SERVICE_PAGES['income-certificate'].seo.title
};

export default function IncomeCertificatePage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['income-certificate']}
      navigate={navigate}
      lang={lang}
    />
  );
}

