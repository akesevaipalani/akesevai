import { useEffect } from 'react';
import {
  BASE_URL,
  DEFAULT_OG_IMAGE,
  resolveRouteSeo
} from '../data/seoRoutesConfig';

function resolvePreferredLanguage() {
  try {
    const params = new URLSearchParams(window.location.search || '');
    const queryLang = params.get('lang');
    if (queryLang === 'en' || queryLang === 'ta') return queryLang;

    const stored = window.localStorage?.getItem('akesevai-lang');
    if (stored === 'en' || stored === 'ta') return stored;

    const match = document.cookie.match(/(?:^|;\s*)akesevai-lang=(en|ta)(?:;|$)/);
    if (match) return match[1];
  } catch (_) {
    // Default safely to Tamil if storage access is restricted
  }
  return 'ta';
}

export default function SEOHeadManager({ activeTab = 'home', currentToolId = '' }) {
  useEffect(() => {
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const syncHtmlLang = () => {
      const lang = resolvePreferredLanguage();
      if (document.documentElement.lang !== lang) {
        document.documentElement.lang = lang;
      }
      setOgTag('og:locale', lang === 'en' ? 'en_IN' : 'ta_IN');
      setOgTag('og:locale:alternate', lang === 'en' ? 'ta_IN' : 'en_IN');
    };

    syncHtmlLang();
    const handleLangTrigger = () => {
      queueMicrotask(syncHtmlLang);
    };
    window.addEventListener('storage', syncHtmlLang);
    document.addEventListener('click', handleLangTrigger);

    return () => {
      window.removeEventListener('storage', syncHtmlLang);
      document.removeEventListener('click', handleLangTrigger);
    };
  }, []);

  useEffect(() => {
    const lang = resolvePreferredLanguage();
    if (document.documentElement.lang !== lang) {
      document.documentElement.lang = lang;
    }

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
    const activeLang = resolvePreferredLanguage();
    setOgTag('og:title', seoData.title);
    setOgTag('og:description', seoData.description);
    setOgTag('og:url', canonicalTag.href);
    setOgTag('og:type', seoData.ogType || 'website');
    setOgTag('og:site_name', 'AK E-SEVAI');
    setOgTag('og:image', DEFAULT_OG_IMAGE);
    setOgTag('og:locale', activeLang === 'en' ? 'en_IN' : 'ta_IN');
    setOgTag('og:locale:alternate', activeLang === 'en' ? 'ta_IN' : 'en_IN');

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
