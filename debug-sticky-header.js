// Debug script para el sticky header
// Ejecutar en la consola del navegador para ver el estado del header

function debugStickyHeader() {
  console.log('=== DEBUG STICKY HEADER ===');
  
  // Estado actual
  const header = document.querySelector('header');
  if (!header) {
    console.error('Header no encontrado');
    return;
  }
  
  console.log('Header element:', header);
  console.log('Header classes:', header.className);
  console.log('Header computed styles:', {
    transform: getComputedStyle(header).transform,
    position: getComputedStyle(header).position,
    top: getComputedStyle(header).top,
    zIndex: getComputedStyle(header).zIndex
  });
  
  // Scroll position
  console.log('Current scroll position:', window.scrollY);
  
  // Test scroll events
  let lastY = window.scrollY;
  const testHandler = () => {
    const currentY = window.scrollY;
    const delta = currentY - lastY;
    console.log(`Scroll: ${currentY}px, Delta: ${delta}px`);
    lastY = currentY;
  };
  
  console.log('Attaching test scroll handler for 10 seconds...');
  window.addEventListener('scroll', testHandler);
  
  setTimeout(() => {
    window.removeEventListener('scroll', testHandler);
    console.log('Test scroll handler removed');
  }, 10000);
  
  // React DevTools check
  if (window.React) {
    console.log('React detected, check React DevTools for component state');
  }
}

// Auto-execute
debugStickyHeader();