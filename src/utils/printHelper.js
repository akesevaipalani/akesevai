/**
 * printHelper.js — AkEsevai Print Utility
 * 
 * Prints ONLY the target element content without printing the full page.
 * Works by injecting a temporary <style> tag that hides everything except
 * the target element's content during printing.
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
    console.warn('[printHelper] Element not found:', elementOrId);
    window.print();
    return;
  }

  // Get inner HTML of the element
  const printContent = el.innerHTML;
  const outerStyle = window.getComputedStyle(el);

  // Collect all stylesheets from the page
  const styleLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map(link => `<link rel="stylesheet" href="${link.href}" />`)
    .join('\n');

  const styleBlocks = Array.from(document.querySelectorAll('style'))
    .map(s => `<style>${s.innerHTML}</style>`)
    .join('\n');

  // Open a hidden iframe for isolated printing
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    position: fixed;
    top: -10000px;
    left: -10000px;
    width: 210mm;
    height: 297mm;
    border: none;
    visibility: hidden;
  `;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AkEsevai Print</title>
  ${styleLinks}
  ${styleBlocks}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800;900&display=swap');

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: white;
      font-family: 'Manrope', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      padding: 8mm;
    }

    /* Make the printed content fit the page nicely */
    .print-root {
      max-width: 190mm;
      margin: 0 auto;
    }

    /* Hide action buttons, footer buttons, etc. */
    button,
    .no-print,
    [data-no-print],
    .token-action-footer,
    .print-hide {
      display: none !important;
    }

    /* Ensure gradients and colors print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    @media print {
      html, body {
        margin: 0;
        padding: 4mm;
      }

      .print-root {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="print-root">
    ${printContent}
  </div>
</body>
</html>`);
  doc.close();

  // Instant print execution with clean fallback
  const triggerPrint = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } catch (e) {
      console.error('[printHelper] Print failed:', e);
    }
    setTimeout(() => {
      try {
        if (iframe.parentNode) document.body.removeChild(iframe);
      } catch (e) {}
    }, 1500);
  };

  setTimeout(triggerPrint, 100);
}
