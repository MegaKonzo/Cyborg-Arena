function init() {
    import('./index.arrow-to-top.js');
    import('./index.contacts.js');
    import('./index.section-header.js');
    import('./comments.js');
    import('./index.book.js');
  }
  
  const totalPartials = document.querySelectorAll(
    '[hx-trigger="load"], [data-hx-trigger="load"]',
  ).length;
  let loadedPartialsCount = 0;
  
  document.body.addEventListener('htmx:afterOnLoad', () => {
    loadedPartialsCount++;
    if (loadedPartialsCount === totalPartials) init();
  });