import { useEffect } from 'react';
import {
  BASE_URL,
  DEFAULT_OG_IMAGE,
  resolveRouteSeo
} from '../data/seoRoutesConfig';

export default function SEOHeadManager({ activeTab = 'home', currentToolId = '' }) {
  useEffect(() => {
    const pathname = currentToolId
      ? `/tools/${currentToolId}`
      : activeTab === 'home'
        ? '/'
        : activeTab.startsWith('/')
          ? activeTab
          : `/${activeTab}`;

    let resolved = resolveRouteSeo(pathname);

    // If activeTab is an alias route during client navigation, resolve target canonical
    if (resolved.status === 301 && resolved.redirectTo) {
      resolved = resolveRouteSeo(resolved.redirectTo);
    }

    const seoData = resolved.seo || {
      title: 'AK E-SEVAI Tamil Nadu | Free Photo, PDF Tools & Online e-Sevai Guidance',
      description:
        'Free browser-based photo compressor, passport size photo maker, PDF merge/split/compress tools and online e-Sevai guidance across Tamil Nadu.',
      keywords: 'AK E-SEVAI, Tamil Nadu e-Sevai, photo tools, pdf tools',
      canonical: `${BASE_URL}/`
    };

    // 1. Document Title
    document.title = seoData.title;

    // Helper to create/update <meta name="...">
    const setNamedMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // Helper to create/update <meta property="...">
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    // 2. Standard Meta Tags & Robots Directive
    setNamedMeta('description', seoData.description);
    setNamedMeta('keywords', seoData.keywords || 'AK E-SEVAI');
    setNamedMeta(
      'robots',
      resolved.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // 3. Canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = seoData.canonical || `${BASE_URL}/`;

    // 4. Open Graph Tags
    setOgTag('og:title', seoData.title);
    setOgTag('og:description', seoData.description);
    setOgTag('og:url', canonicalTag.href);
    setOgTag('og:type', seoData.ogType || 'website');
    setOgTag('og:site_name', 'AK E-SEVAI');
    setOgTag('og:image', DEFAULT_OG_IMAGE);

    // 5. Twitter Card Tags
    setNamedMeta('twitter:card', 'summary_large_image');
    setNamedMeta('twitter:url', canonicalTag.href);
    setNamedMeta('twitter:title', seoData.title);
    setNamedMeta('twitter:description', seoData.description);
    setNamedMeta('twitter:image', DEFAULT_OG_IMAGE);

    // 6. Dynamic JSON-LD Structured Data Schema
    const existingScript = document.getElementById('akesevai-jsonld-schema');
    if (!resolved.jsonLd) {
      if (existingScript) {
        existingScript.remove();
      }
    } else {
      let jsonLdScript = existingScript;
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'akesevai-jsonld-schema';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(resolved.jsonLd);
    }
  }, [activeTab, currentToolId]);

  return null;
}
