// Back to Top Button
const topBtn = document.createElement('button');
topBtn.innerText = '↑ Top';
topBtn.id = 'backToTop';
topBtn.style.position = 'fixed';
topBtn.style.bottom = '30px';
topBtn.style.right = '30px';
topBtn.style.display = 'none';
topBtn.style.padding = '10px 15px';
topBtn.style.borderRadius = '5px';
topBtn.style.border = 'none';
topBtn.style.background = '#333';
topBtn.style.color = '#fff';
topBtn.style.cursor = 'pointer';
topBtn.style.zIndex = '1000';
document.body.appendChild(topBtn);

window.addEventListener('scroll', () => {
  topBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
});
topBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Dark/Light Mode Toggle
const modeBtn = document.createElement('button');
modeBtn.innerText = '🌙 Dark Mode';
modeBtn.id = 'modeToggle';
modeBtn.style.position = 'fixed';
modeBtn.style.top = '30px';
modeBtn.style.right = '30px';
modeBtn.style.padding = '10px 15px';
modeBtn.style.borderRadius = '5px';
modeBtn.style.border = 'none';
modeBtn.style.background = '#eee';
modeBtn.style.color = '#333';
modeBtn.style.cursor = 'pointer';
modeBtn.style.zIndex = '1000';
document.body.appendChild(modeBtn);

modeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  modeBtn.innerText = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Add dark mode styles
const darkStyle = document.createElement('style');
darkStyle.innerHTML = `
  .dark-mode {
    background: #222 !important;
    color: #eee !important;
    transition: background 0.3s, color 0.3s;
  }
  .dark-mode a { color: #90cdf4 !important; }
  .dark-mode .main-footer { background: #111 !important; }
  .dark-mode h1, 
  .dark-mode h3, 
  .dark-mode h5, 
  .dark-mode p, 
  .dark-mode td, 
  .dark-mode strong {
    color: #eee !important;
    background: transparent !important;
  }
`;
document.head.appendChild(darkStyle);

// Gallery Lightbox for table images
(function () {
  const galleryImgs = Array.from(document.querySelectorAll('table img'));
  if (!galleryImgs.length) return;

  // Create style for lightbox
  const lbStyle = document.createElement('style');
  lbStyle.innerHTML = `
    #lightboxOverlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.85);
      z-index: 2500;
      opacity: 0;
      visibility: hidden;
      transition: opacity .22s ease, visibility .22s;
      -webkit-tap-highlight-color: transparent;
    }
    #lightboxOverlay.open { opacity: 1; visibility: visible; }
    .lightbox-content { max-width: 92%; max-height: 92%; text-align: center; }
    .lightbox-content img { max-width: 100%; max-height: 80vh; border-radius: 8px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); display:block; margin:0 auto; }
    .lightbox-caption { color: #eee; margin-top: 10px; font-size: 0.95rem; }
    .lb-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.45);
      color: #fff;
      border: none;
      width: 48px;
      height: 48px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      backdrop-filter: blur(4px);
    }
    .lb-prev { left: 18px; }
    .lb-next { right: 18px; }
    .lb-close {
      position: absolute;
      top: 16px;
      right: 18px;
      background: rgba(0,0,0,0.45);
      color: #fff;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 18px;
    }
    @media (prefers-reduced-motion: reduce) {
      #lightboxOverlay, #lightboxOverlay * { transition: none !important; }
    }
  `;
  document.head.appendChild(lbStyle);

  // Build overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightboxOverlay';
  overlay.innerHTML = `
    <div class="lightbox-content" role="dialog" aria-modal="true">
      <button class="lb-close" aria-label="Close">✕</button>
      <button class="lb-btn lb-prev" aria-label="Previous">‹</button>
      <img src="" alt="" />
      <button class="lb-btn lb-next" aria-label="Next">›</button>
      <div class="lightbox-caption"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector('img');
  const captionEl = overlay.querySelector('.lightbox-caption');
  const btnClose = overlay.querySelector('.lb-close');
  const btnPrev = overlay.querySelector('.lb-prev');
  const btnNext = overlay.querySelector('.lb-next');

  let current = 0;
  function openLightbox(idx) {
    current = idx;
    const el = galleryImgs[current];
    lbImg.src = el.src;
    lbImg.alt = el.alt || '';
    captionEl.textContent = el.getAttribute('data-caption') || el.alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // focus management
    btnClose.focus();
  }
  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }
  function showNext() { current = (current + 1) % galleryImgs.length; openLightbox(current); }
  function showPrev() { current = (current - 1 + galleryImgs.length) % galleryImgs.length; openLightbox(current); }

  // Attach click handlers to gallery images
  galleryImgs.forEach((img, i) => {
    img.style.cursor = 'zoom-in';
    img.setAttribute('data-gallery-index', i);
    img.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(i);
    });
  });

  // Controls
  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);

  // Click outside content closes
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Simple touch swipe for mobile
  let touchStartX = 0;
  lbImg.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, {passive: true});
  lbImg.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) showNext(); else showPrev();
    }
  }, {passive: true});

  // Ensure dark-mode contrast for caption when body toggles class
  const obs = new MutationObserver(() => {
    if (document.body.classList.contains('dark-mode')) {
      captionEl.style.color = '#eee';
      overlay.style.background = 'rgba(0,0,0,0.9)';
    } else {
      captionEl.style.color = '#fff';
      overlay.style.background = 'rgba(0,0,0,0.85)';
    }
  });
  obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const seo = {
      title: 'Goal Gear — Premium Soccer Jerseys & Custom Kits',
      description: 'Shop Goal Gear for authentic and custom soccer jerseys. High-quality club and national team kits, custom designs and reliable shipping.',
      keywords: 'soccer jerseys, football kits, custom jerseys, Goal Gear, club jerseys, national team kits, soccer apparel',
      canonical: 'https://example.com/', // replace with your site URL
      ogImage: 'https://example.com/images/og-image.jpg', // replace with your image URL
      logo: 'https://example.com/images/logo.png' // replace with your logo URL
    };

    // set document title
    if (seo.title) document.title = seo.title;

    // helper to upsert meta/link tags
    function upsertMeta(selector, createTagFn) {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = createTagFn();
        document.head.appendChild(el);
      }
      return el;
    }

    // standard meta
    upsertMeta('meta[name="description"]', () => {
      const m = document.createElement('meta'); m.name = 'description'; return m;
    }).content = seo.description || '';

    upsertMeta('meta[name="keywords"]', () => {
      const m = document.createElement('meta'); m.name = 'keywords'; return m;
    }).content = seo.keywords || '';

    upsertMeta('meta[name="robots"]', () => {
      const m = document.createElement('meta'); m.name = 'robots'; return m;
    }).content = 'index, follow';

    // canonical link
    upsertMeta('link[rel="canonical"]', () => {
      const l = document.createElement('link'); l.rel = 'canonical'; return l;
    }).href = seo.canonical || location.href;

    // Open Graph
    upsertMeta('meta[property="og:type"]', () => { const m=document.createElement('meta'); m.setAttribute('property','og:type'); return m; }).content = 'website';
    upsertMeta('meta[property="og:title"]', () => { const m=document.createElement('meta'); m.setAttribute('property','og:title'); return m; }).content = seo.title || document.title;
    upsertMeta('meta[property="og:description"]', () => { const m=document.createElement('meta'); m.setAttribute('property','og:description'); return m; }).content = seo.description || '';
    upsertMeta('meta[property="og:url"]', () => { const m=document.createElement('meta'); m.setAttribute('property','og:url'); return m; }).content = seo.canonical || location.href;
    upsertMeta('meta[property="og:image"]', () => { const m=document.createElement('meta'); m.setAttribute('property','og:image'); return m; }).content = seo.ogImage || '';

    // Twitter card
    upsertMeta('meta[name="twitter:card"]', () => { const m=document.createElement('meta'); m.name='twitter:card'; return m; }).content = 'summary_large_image';
    upsertMeta('meta[name="twitter:title"]', () => { const m=document.createElement('meta'); m.name='twitter:title'; return m; }).content = seo.title || document.title;
    upsertMeta('meta[name="twitter:description"]', () => { const m=document.createElement('meta'); m.name='twitter:description'; return m; }).content = seo.description || '';
    upsertMeta('meta[name="twitter:image"]', () => { const m=document.createElement('meta'); m.name='twitter:image'; return m; }).content = seo.ogImage || '';

    // favicon (add/update)
    upsertMeta('link[rel="icon"]', () => {
      const l = document.createElement('link'); l.rel = 'icon'; l.href = 'favicon.ico'; return l;
    }).href = 'favicon.ico';

    // JSON-LD structured data (replace details as needed)
    const jsonLdSelector = 'script[type="application/ld+json"][data-gen="gg-seo"]';
    const existingLd = document.head.querySelector(jsonLdSelector);
    if (existingLd) existingLd.remove();
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.setAttribute('data-gen', 'gg-seo');
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "Goal Gear",
      "url": seo.canonical || location.origin,
      "logo": seo.logo || '',
      "description": seo.description || ''
    });
    document.head.appendChild(ld);
  });
})();