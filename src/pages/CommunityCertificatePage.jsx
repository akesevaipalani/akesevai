import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'community-certificate',
  title: SEO03_SERVICE_PAGES['community-certificate'].seo.title
};

export default function CommunityCertificatePage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['community-certificate']}
      navigate={navigate}
      lang={lang}
    />
  );
}

