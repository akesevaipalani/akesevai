import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

// Dark mode toggle - stores in localStorage
export function useDarkMode() {
  const [isDark, setIsDark] = React.useState(() => {
    try {
      const match = document.cookie.match(/akesevai-dark-mode=(true|false)/);
      if (match && match[1]) return match[1] === 'true';

      const stored = localStorage.getItem('akesevai-dark-mode');
      if (stored !== null) return stored === 'true';
    } catch (e) {}
    return false;
  });

  React.useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('akesevai-dark-mode', 'true');
        document.cookie = "akesevai-dark-mode=true; path=/; max-age=31536000; SameSite=Lax";
      } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('akesevai-dark-mode', 'false');
        document.cookie = "akesevai-dark-mode=false; path=/; max-age=31536000; SameSite=Lax";
      }
    } catch (e) {}
  }, [isDark]);

  return [isDark, setIsDark];
}

export default function DarkModeToggle({ isDark, setIsDark }) {
  return (
    <button
      onClick={() => setIsDark(d => !d)}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: isDark
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
        border: isDark ? '1.5px solid #475569' : '1.5px solid #fbbf24',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(251,191,36,0.35)',
        flexShrink: 0
      }}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark
        ? <Sun size={17} color="#fbbf24" />
        : <Moon size={17} color="#1e293b" />
      }
    </button>
  );
}
