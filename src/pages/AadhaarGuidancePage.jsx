import React from 'react';
import ServiceGuidancePageTemplate from '../components/ServiceGuidancePageTemplate';
import { SEO03_SERVICE_PAGES } from '../data/seo03ServicePagesData';

export const pageMeta = {
  id: 'aadhaar-guidance',
  title: SEO03_SERVICE_PAGES['aadhaar-guidance'].seo.title
};

export default function AadhaarGuidancePage({ navigate, lang = 'ta' }) {
  return (
    <ServiceGuidancePageTemplate
      service={SEO03_SERVICE_PAGES['aadhaar-guidance']}
      navigate={navigate}
      lang={lang}
    />
  );
}

