import React from 'react';

export function buildHref(to) {
  if (!to || to === 'home' || to === '/') return '/';
  return to.startsWith('/') ? to : `/${to}`;
}

export function toPageId(to) {
  if (!to || to === '/' || to === 'home') return 'home';
  return to.replace(/^\/+/, '').replace(/\/$/, '');
}

export default function SpaLink({
  to = 'home',
  navigate,
  onClick,
  children,
  className = '',
  style = {},
  scrollToTop = false,
  ...rest
}) {
  const href = buildHref(to);
  const pageId = toPageId(to);

  const handleClick = (e) => {
    // Allow standard browser open-in-new-tab / middle-click behavior
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    if (typeof onClick === 'function') {
      onClick(e);
    }
    if (typeof navigate === 'function') {
      e.preventDefault();
      navigate(pageId);
      if (scrollToTop && typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </a>
  );
}
