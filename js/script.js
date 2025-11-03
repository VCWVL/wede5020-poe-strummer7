// Single, self-contained site script: nav highlight, smooth scroll, images, forms, SEO bits, scroll-top.

(function () {
  'use strict';

  // Helpers
  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));
  const filename = () => location.pathname.split('/').pop() || 'index.html';

  // NAV HIGHLIGHT
  document.addEventListener('DOMContentLoaded', () => {
    const current = filename();
    qa('.main-nav a, .nav-links a, nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === current || href === './' || (href.endsWith(current) && current !== '')) {
        a.classList.add('active-link');
        a.setAttribute('aria-current', 'page');
      }
    });
  });

  // SMOOTH SCROLL FOR INTERNAL LINKS
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
    }
  });

  // SCROLL-TO-TOP BUTTON
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-top';
  scrollBtn.title = 'Back to top';
  scrollBtn.textContent = '↑';
  Object.assign(scrollBtn.style, {
    position: 'fixed', right: '18px', bottom: '18px', width: '44px', height: '44px',
    borderRadius: '50%', border: 'none', background: '#1a73e8', color: '#fff',
    cursor: 'pointer', display: 'none', zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  });
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(scrollBtn));
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = (window.scrollY > 300) ? 'block' : 'none';
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // IMAGE HANDLING: fix absolute Windows paths, lazy-load, fallback placeholder, logging
  document.addEventListener('DOMContentLoaded', () => {
    const images = qa('img');
    images.forEach(img => {
      // Fix accidental absolute Windows file paths by using just the filename in ./images/
      try {
        const src = img.getAttribute('src') || '';
        if (/^[a-zA-Z]:\\|^file:\/\//.test(src)) {
          const parts = src.replace(/\\/g, '/').split('/');
          const name = parts.pop();
          if (name) img.src = `images/${name}`;
        }
      } catch (err) { /* ignore */ }

      // Prefer native lazy loading
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');

      // Log load/error and fallback to placeholder
      img.addEventListener('load', () => console.info('Image loaded:', img.src));
      img.addEventListener('error', () => {
        console.error('Image failed to load:', img.src);
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = '1';
          img.src = 'images/placeholder.jpg';
        }
      });
    });
  });

  // SIMPLE FORM VALIDATION (for contact/enquiry forms)
  document.addEventListener('submit', e => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    // Only validate forms that have data-validate or id containing "enquir" or "contact"
    const id = (form.id || '').toLowerCase();
    if (!form.dataset.validate && !/enquir|contact|form/.test(id)) return;

    const required = Array.from(form.querySelectorAll('[required], [data-required]'));
    let valid = true;
    required.forEach(field => {
      field.classList.remove('field-error');
      if (!field.value || (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))) {
        valid = false;
        field.classList.add('field-error');
      }
    });

    if (!valid) {
      e.preventDefault();
      const msg = form.querySelector('.form-error') || (function () {
        const el = document.createElement('div');
        el.className = 'form-error';
        el.style.color = '#a00';
        el.style.marginTop = '8px';
        el.textContent = 'Please complete required fields and provide a valid email address.';
        form.prepend(el);
        return el;
      })();
      msg.style.display = 'block';
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // ADD BASIC SEO META IF MISSING + page-specific titles/descriptions + internal link polishing
  document.addEventListener('DOMContentLoaded', () => {
    const file = filename();

    // site SEO map - edit text to suit your brand
    const seoMap = {
      'index.html': {
        title: 'Goal Gear — Premium Soccer Jerseys & Kits',
        description: 'Shop authentic and custom soccer jerseys at Goal Gear. Latest club and national kits, durable materials, fast shipping.'
      },
      'about.html': {
        title: 'About Goal Gear — Our Story & Vision',
        description: 'Learn about Goal Gear — our history, vision for sustainable jerseys, and commitment to quality soccer apparel.'
      },
      'products.html': {
        title: 'Products — Kits, Jerseys & Custom Orders | Goal Gear',
        description: 'Browse Goal Gear products: club kits, national team jerseys, and custom orders. Sizes for all ages and fast delivery.'
      },
      'enquiries.html': {
        title: 'Enquiries — Quotes & Orders | Goal Gear',
        description: 'Contact Goal Gear for bulk orders, quotes, and custom kit enquiries. Fast responses and friendly support.'
      },
      'contact.html': {
        title: 'Contact Goal Gear — Support & Returns',
        description: 'Get in touch with Goal Gear support for order help, returns, and size guidance. We’re happy to assist.'
      }
    };

    // apply title + meta description
    const seo = seoMap[file] || seoMap['index.html'];
    if (seo && seo.title) document.title = seo.title;
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seo.description;

    // canonical link
    if (!document.querySelector('link[rel="canonical"]')) {
      const canon = document.createElement('link');
      canon.rel = 'canonical';
      const path = (file === 'index.html') ? '/' : `/${file}`;
      canon.href = location.origin + path;
      document.head.appendChild(canon);
    }

    // polish nav link text and add titles for clearer internal linking
    const navText = {
      'index.html': 'Home',
      'about.html': 'About Us',
      'products.html': 'Products & Kits',
      'enquiries.html': 'Enquiries',
      'contact.html': 'Contact & Support'
    };
    qa('.main-nav a, .nav-links a').forEach(a => {
      const href = (a.getAttribute('href') || '').replace('./', '').split('#')[0];
      if (navText[href]) {
        a.textContent = navText[href];
        a.title = navText[href];
        a.setAttribute('data-internal', '1');
      }
    });

    // build small internal quick-links in footer if footer exists
    const footer = q('footer') || q('.main-footer');
    if (footer) {
      const quick = document.createElement('nav');
      quick.className = 'quick-links';
      quick.setAttribute('aria-label', 'Quick links');
      const links = [
        {id: 'kits', text: 'Kits'},
        {id: 'featured', text: 'Featured'},
        {id: 'support', text: 'Support'}
      ];
      links.forEach(l => {
        // add link only if there is an element with that id on page
        if (document.getElementById(l.id)) {
          const a = document.createElement('a');
          a.href = `#${l.id}`;
          a.textContent = l.text;
          a.style.marginRight = '10px';
          quick.appendChild(a);
        }
      });
      if (quick.children.length) {
        footer.insertBefore(quick, footer.firstChild);
      }
    }

    // add/update Open Graph basics if missing
    if (!document.querySelector('meta[property="og:title"]')) {
      const ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.content = document.title;
      document.head.appendChild(ogTitle);
    }
    if (!document.querySelector('meta[property="og:description"]')) {
      const ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      ogDesc.content = metaDesc.content;
      document.head.appendChild(ogDesc);
    }

    // inject basic JSON-LD organization (if not present)
    if (!document.querySelector('script[type="application/ld+json"]')) {
      const ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Goal Gear",
        "url": location.origin + '/',
        "logo": location.origin + '/images/logo.png'
      });
      document.head.appendChild(ld);
    }
  });

  // SMALL UI STYLES FOR ERRORS/ACTIVE LINK (applied dynamically so you don't need to edit CSS)
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .active-link { background: #0b53c1; color: #fff !important; padding: 6px 8px; border-radius: 4px; }
    .field-error { outline: 2px solid #e53935; background: #fff7f7; }
    .form-error { background:#fff0f0; border:1px solid #f2c6c6; padding:8px; border-radius:6px; }
    .quick-links a { color: #1a73e8; text-decoration: none; font-weight: bold; margin-right: 8px; }
    .quick-links a:hover { text-decoration: underline; }
    .scroll-top:focus{ outline: 3px solid rgba(11,83,193,0.25); }
  `;
  document.head.appendChild(styleEl);

})();

// Off-page SEO helpers: social meta, share bar, copy link, and backlink outreach export.

(function () {
  'use strict';

  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));
  const pageUrl = () => location.href;
  const pageTitle = () => document.title || q('h1')?.textContent?.trim() || 'Goal Gear';
  const pageDesc = () => (document.querySelector('meta[name="description"]')?.content) || '';

  // Inject Open Graph & Twitter meta if missing
  function ensureMeta() {
    const og = (prop, content) => {
      if (!document.querySelector(`meta[property="${prop}"]`)) {
        const m = document.createElement('meta');
        m.setAttribute('property', prop);
        m.content = content;
        document.head.appendChild(m);
      }
    };
    const tw = (name, content) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const m = document.createElement('meta');
        m.name = name;
        m.content = content;
        document.head.appendChild(m);
      }
    };

    const title = pageTitle();
    const desc = pageDesc();
    const url = pageUrl();
    const image = location.origin + '/images/rmHomeKit.jpg'; // update to a real image path if available

    og('og:title', title);
    og('og:description', desc || 'Goal Gear — premium soccer jerseys and kits.');
    og('og:url', url);
    og('og:type', 'website');
    og('og:image', image);

    tw('twitter:card', 'summary_large_image');
    tw('twitter:title', title);
    tw('twitter:description', desc || 'Goal Gear — premium soccer jerseys and kits.');
    tw('twitter:image', image);
  }

  // JSON-LD SocialProfile (sameAs) injection - edit profiles array as needed
  function injectSocialJsonLd() {
    if (document.querySelector('script[type="application/ld+json"][data-offpage]')) return;
    const profiles = [
      'https://www.facebook.com/yourpage',
      'https://twitter.com/yourhandle',
      'https://www.instagram.com/yourprofile',
      'https://www.linkedin.com/company/yourcompany'
    ];
    const ld = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Goal Gear",
      "url": location.origin + '/',
      "sameAs": profiles
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-offpage', '1');
    s.text = JSON.stringify(ld);
    document.head.appendChild(s);
  }

  // Create share bar with icons
  function createShareBar() {
    if (q('#share-bar-offpage')) return;

    const container = document.createElement('div');
    container.id = 'share-bar-offpage';
    container.setAttribute('aria-label', 'Share this page');
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'white',
      padding: '12px',
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999
    });

    const makeIconBtn = (icon, href, target = '_blank', title) => {
      const a = document.createElement('a');
      a.className = 'share-btn';
      a.innerHTML = icon;
      a.href = href;
      a.target = target;
      a.rel = 'noopener noreferrer';
      a.title = title;
      Object.assign(a.style, {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#f8f9fa',
        color: '#000',
        textDecoration: 'none',
        fontSize: '20px',
        transition: 'transform 0.2s',
        cursor: 'pointer'
      });
      a.addEventListener('mouseover', () => {
        a.style.transform = 'scale(1.1)';
      });
      a.addEventListener('mouseout', () => {
        a.style.transform = 'scale(1)';
      });
      return a;
    };

    const url = encodeURIComponent(pageUrl());
    const title = encodeURIComponent(pageTitle());
    const desc = encodeURIComponent(pageDesc());

    // Icons using Unicode or emoji (can be replaced with SVG for better quality)
    const wa = makeIconBtn('📱', `https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank', 'Share on WhatsApp');
    const ig = makeIconBtn('📸', `https://instagram.com`, '_blank', 'Follow us on Instagram');
    const mail = makeIconBtn('✉️', `mailto:?subject=${title}&body=${desc}%0A%0A${url}`, '_self', 'Share via Email');

    // Style specific icons
    wa.style.background = '#25D366';
    wa.style.color = '#fff';
    ig.style.background = '#E4405F';
    ig.style.color = '#fff';
    mail.style.background = '#EA4335';
    mail.style.color = '#fff';

    [wa, ig, mail].forEach(el => container.appendChild(el));
    
    // Add margin to body to prevent share bar from overlapping content
    document.body.style.marginBottom = '70px';
    
    document.body.appendChild(container);

    // Add hover styles
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .share-btn:hover {
        opacity: 0.9;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Initialize only meta and share bar
  document.addEventListener('DOMContentLoaded', () => {
    ensureMeta();
    injectSocialJsonLd();
    createShareBar();
  });

  // Remove backlink export function and keep only share functionality
  window.OffpageSEO = {
    ensureMeta,
    createShareBar
  };
})();

/* ----------------- Interactive features & map integration ----------------- */
(function () {
  'use strict';

  const q = s => document.querySelector(s);
  const qa = s => Array.from(document.querySelectorAll(s));

  // inject small UI styles for modal/tooltips/map
  (function injectStyles() {
    if (document.getElementById('interactive-styles')) return;
    const css = `
      /* Lightbox modal */
      .ig-modal { position: fixed; inset: 0; display:flex;align-items:center;justify-content:center;
                  background: rgba(0,0,0,0.75); z-index: 12000; }
      .ig-modal .ig-content { max-width: 90%; max-height: 90%; display:flex;flex-direction:column;align-items:center; }
      .ig-modal img { max-width: 100%; max-height: calc(100vh - 120px); border-radius:6px; }
      .ig-modal .ig-caption { color:#fff; margin-top:8px; font-size:0.95rem; text-align:center; }
      .ig-modal .ig-close { position:absolute; top:18px; right:22px; background:#fff;color:#111;border-radius:50%;width:36px;height:36px;border:none;cursor:pointer; }

      /* tooltip */
      .ig-tooltip { position: absolute; background: rgba(0,0,0,0.85); color: #fff; padding:6px 8px; border-radius:4px; font-size:12px; pointer-events:none; transform: translateY(-8px); z-index:13000; }

      /* map container */
      #store-map { width: 100%; height: 360px; border-radius:8px; margin-top:12px; border:1px solid #e0e0e0; }

      /* product filter bar */
      .ig-filterbar { display:flex; gap:12px; flex-wrap:wrap; align-items:center; margin:14px 0; }
      .ig-filterbar select, .ig-filterbar input[type="range"], .ig-filterbar button { padding:8px; border-radius:6px; border:1px solid #d0d0d0; }
    `;
    const s = document.createElement('style');
    s.id = 'interactive-styles';
    s.textContent = css;
    document.head.appendChild(s);
  })();

  // ---------- Lightbox for images ----------
  function initLightbox() {
    if (window._igLightboxInit) return;
    window._igLightboxInit = true;

    function openLightbox(src, caption) {
      const modal = document.createElement('div');
      modal.className = 'ig-modal';
      modal.innerHTML = `
        <button class="ig-close" aria-label="Close">✕</button>
        <div class="ig-content">
          <img src="${src}" alt="${caption || ''}">
          <div class="ig-caption">${caption || ''}</div>
        </div>
      `;
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('ig-close')) modal.remove();
      });
      document.body.appendChild(modal);
    }

    qa('.card img, img.product-thumb').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => openLightbox(img.src, img.alt || img.title || ''));
    });
  }

  // ---------- Simple tooltip system ----------
  function initTooltips() {
    let tipEl = null;
    function createTip() {
      tipEl = document.createElement('div');
      tipEl.className = 'ig-tooltip';
      document.body.appendChild(tipEl);
    }
    function showTip(text, x, y) {
      if (!tipEl) createTip();
      tipEl.textContent = text;
      tipEl.style.display = 'block';
      tipEl.style.left = `${x}px`;
      tipEl.style.top = `${y}px`;
    }
    function hideTip() { if (tipEl) tipEl.style.display = 'none'; }

    qa('[data-tooltip]').forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        const r = el.getBoundingClientRect();
        showTip(el.getAttribute('data-tooltip'), r.left + r.width/2, r.top + window.scrollY - 8);
      });
      el.addEventListener('mouseleave', hideTip);
      el.addEventListener('mousemove', (e) => {
        if (tipEl) { tipEl.style.left = `${e.pageX + 12}px`; tipEl.style.top = `${e.pageY - 18}px`; }
      });
    });
  }

  // ---------- Product filters (category + price + sort) ----------
  function initProductFilters() {
    const productContainer = q('.container') || q('.product-list') || q('#products');
    if (!productContainer) return;

    // determine product cards
    const cards = qa('.card', productContainer) || qa('.product-card', productContainer);
    if (!cards.length) return;

    // collect categories & price range
    const categories = new Set();
    let minPrice = Infinity, maxPrice = 0;
    cards.forEach(c => {
      const cat = c.dataset.category || c.getAttribute('data-cat') || 'Other';
      categories.add(cat);
      const p = parseFloat(c.dataset.price || c.getAttribute('data-price') || '0') || 0;
      minPrice = Math.min(minPrice, p);
      maxPrice = Math.max(maxPrice, p);
    });

    // create filter bar
    const bar = document.createElement('div');
    bar.className = 'ig-filterbar';

    const catSelect = document.createElement('select');
    const optAll = document.createElement('option'); optAll.value=''; optAll.textContent = 'All Categories';
    catSelect.appendChild(optAll);
    Array.from(categories).sort().forEach(cat => {
      const o = document.createElement('option'); o.value = cat; o.textContent = cat; catSelect.appendChild(o);
    });

    const priceLabel = document.createElement('label');
    priceLabel.textContent = `Max price: R${Math.round(maxPrice)}`;
    const priceRange = document.createElement('input');
    priceRange.type = 'range';
    priceRange.min = Math.floor(minPrice || 0);
    priceRange.max = Math.ceil(maxPrice || 1000);
    priceRange.value = Math.ceil(maxPrice || 1000);
    priceRange.addEventListener('input', () => {
      priceLabel.textContent = `Max price: R${priceRange.value}`;
      applyFilters();
    });

    const sortSelect = document.createElement('select');
    ['Default','Price: Low → High','Price: High → Low','Newest'].forEach(oText => {
      const o = document.createElement('option'); o.value = oText; o.textContent = oText; sortSelect.appendChild(o);
    });

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', () => {
      catSelect.value = ''; priceRange.value = priceRange.max; sortSelect.value = 'Default'; applyFilters();
    });

    bar.appendChild(catSelect);
    bar.appendChild(priceLabel);
    bar.appendChild(priceRange);
    bar.appendChild(sortSelect);
    bar.appendChild(resetBtn);

    productContainer.parentNode.insertBefore(bar, productContainer);

    function applyFilters() {
      const chosenCat = catSelect.value;
      const maxP = parseFloat(priceRange.value);
      const sortBy = sortSelect.value;

      const visible = [];
      cards.forEach(c => {
        const cat = c.dataset.category || c.getAttribute('data-cat') || '';
        const p = parseFloat(c.dataset.price || c.getAttribute('data-price') || '0') || 0;
        const ok = (chosenCat === '' || cat === chosenCat) && p <= maxP;
        c.style.display = ok ? '' : 'none';
        if (ok) visible.push(c);
      });

      // simple sort
      if (sortBy !== 'Default') {
        const parent = cards[0].parentNode;
        const sorted = visible.sort((a,b) => {
          const pa = parseFloat(a.dataset.price||a.getAttribute('data-price')||0) || 0;
          const pb = parseFloat(b.dataset.price||b.getAttribute('data-price')||0) || 0;
          if (sortBy.startsWith('Price: Low')) return pa - pb;
          if (sortBy.startsWith('Price: High')) return pb - pa;
          return (b.dataset.date || 0) - (a.dataset.date || 0);
        });
        sorted.forEach(n => parent.appendChild(n));
      }
    }

    // handle change events
    catSelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  }

  // ---------- Leaflet Map (dynamic load) ----------
  function ensureLeafletLoaded(callback) {
    if (window.L) return callback();
    // add CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const lcss = document.createElement('link');
      lcss.rel = 'stylesheet';
      lcss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(lcss);
    }
    // add script
    const s = document.createElement('script');
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload = () => callback();
    document.body.appendChild(s);
  }

  function initStoreMap() {
    // create container if not present
    let mapWrap = q('#store-map-wrap');
    if (!mapWrap) {
      mapWrap = document.createElement('div');
      mapWrap.id = 'store-map-wrap';
      mapWrap.style.maxWidth = '1100px';
      mapWrap.style.margin = '20px auto';
      mapWrap.innerHTML = `
        <h3 style="margin:0 0 8px">Find Us / Store Locator</h3>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <input id="ig-map-search" placeholder="Search address (e.g. Cape Town)" style="flex:1;padding:8px;border-radius:6px;border:1px solid #d0d0d0">
          <button id="ig-map-search-btn" style="padding:8px 12px;border-radius:6px;background:#1a73e8;color:#fff;border:none;cursor:pointer">Search</button>
          <button id="ig-map-locate" title="Use my location" style="padding:8px;border-radius:6px;border:1px solid #d0d0d0;background:#fff;cursor:pointer">Locate</button>
        </div>
        <div id="store-map"></div>
      `;
      const footer = q('footer') || q('.main-footer') || document.body;
      footer.parentNode.insertBefore(mapWrap, footer);
    }

    ensureLeafletLoaded(() => {
      // initialize map
      const map = L.map('store-map', { scrollWheelZoom: false }).setView([-33.9249, 18.4241], 12); // default Cape Town
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // sample store markers (edit to real coords)
      const stores = [
        { name: 'Goal Gear Cape Town', lat: -33.9249, lon: 18.4241, addr: 'Cape Town CBD' },
        { name: 'Goal Gear Stellenbosch', lat: -33.9346, lon: 18.8600, addr: 'Stellenbosch' },
        { name: 'Goal Gear Durbanville', lat: -33.8168, lon: 18.6476, addr: 'Durbanville' }
      ];

      const markers = L.layerGroup().addTo(map);
      stores.forEach(s => {
        const m = L.marker([s.lat, s.lon]).addTo(markers);
        m.bindPopup(`<strong>${s.name}</strong><br>${s.addr}<br><a target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}">Get directions</a>`);
      });

      // locate button behavior
      q('#ig-map-locate').addEventListener('click', () => {
        map.locate({ setView: true, maxZoom: 14 });
      });
      map.on('locationerror', () => {
        alert('Unable to determine location. Please allow location access or search manually.');
      });

      // search using Nominatim
      const searchBtn = q('#ig-map-search-btn');
      const searchInput = q('#ig-map-search');
      searchBtn.addEventListener('click', () => {
        const val = (searchInput.value || '').trim();
        if (!val) return;
        searchBtn.disabled = true;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=1`)
          .then(r => r.json()).then(data => {
            if (data && data[0]) {
              const lat = parseFloat(data[0].lat), lon = parseFloat(data[0].lon);
              L.marker([lat, lon]).addTo(markers).bindPopup(`<strong>Search result</strong><br>${data[0].display_name}`).openPopup();
              map.setView([lat, lon], 14);
            } else {
              alert('No results found.');
            }
          }).catch(() => alert('Search failed.')).finally(() => searchBtn.disabled = false);
      });
    });
  }

  // ---------- Init everything after DOM ready ----------
  document.addEventListener('DOMContentLoaded', () => {
    try { initLightbox(); } catch (e) { /* ignore */ }
    try { initTooltips(); } catch (e) { /* ignore */ }
    try { initProductFilters(); } catch (e) { /* ignore */ }
    try { initStoreMap(); } catch (e) { /* ignore */ }
  });
})();
