/**
 * printHelper.js — AkEsevai Direct Browser Print Utility
 * 
 * Invokes native browser print dialog (window.print()) directly on the active window.
 * Bypasses detached iframes to prevent "Waiting for printer connection..." delays.
 * Isolates and renders only the target element with exact print styling.
 * 
 * Usage:
 *   printElement('my-element-id')
 *   printElement(domElement)
 */

export function printElement(elementOrId) {
  let el;
  if (typeof elementOrId === 'string') {
    el = document.getElementById(elementOrId);
  } else {
    el = elementOrId;
  }

  if (!el) {
    console.warn('[printHelper] Target element not found:', elementOrId);
    window.focus();
    window.print();
    return;
  }

  // 1. Remove any previous lingering print container or styles
  const prevContainer = document.getElementById('ake-print-isolated-container');
  if (prevContainer) prevContainer.remove();
  const prevStyle = document.getElementById('ake-print-dynamic-style');
  if (prevStyle) prevStyle.remove();

  // 2. Clone the element's content for direct main-window print isolation
  const printContainer = document.createElement('div');
  printContainer.id = 'ake-print-isolated-container';
  printContainer.appendChild(el.cloneNode(true));
  document.body.appendChild(printContainer);

  // 3. Inject print-only stylesheet into current document
  const styleTag = document.createElement('style');
  styleTag.id = 'ake-print-dynamic-style';
  styleTag.textContent = `
    @media screen {
      #ake-print-isolated-container {
        display: none !important;
      }
    }
    @media print {
      @page {
        margin: 8mm;
        size: auto;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body > *:not(#ake-print-isolated-container) {
        display: none !important;
      }
      #ake-print-isolated-container {
        display: block !important;
        position: static !important;
        width: 100% !important;
        max-width: 190mm !important;
        margin: 0 auto !important;
        padding: 4mm !important;
        visibility: visible !important;
      }
      #ake-print-isolated-container * {
        visibility: visible !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      #ake-print-isolated-container button,
      #ake-print-isolated-container .no-print,
      #ake-print-isolated-container [data-no-print],
      #ake-print-isolated-container .token-action-footer,
      #ake-print-isolated-container .print-hide {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(styleTag);

  // 4. Cleanup function after print preview closes
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    try {
      if (printContainer && printContainer.parentNode) printContainer.remove();
      if (styleTag && styleTag.parentNode) styleTag.remove();
    } catch (e) {}
  };

  window.addEventListener('afterprint', cleanup, { once: true });

  // 5. Trigger direct main window print
  try {
    window.focus();
    window.print();
  } catch (err) {
    console.error('[printHelper] window.print error:', err);
  }

  // Fallback cleanup in case afterprint does not fire in some environments
  setTimeout(cleanup, 2500);
}

