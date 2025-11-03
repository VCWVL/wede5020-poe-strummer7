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

  // ADD BASIC SEO META IF MISSING (document.title left if already set)
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('meta[name="description"]')) {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = 'Goal Gear — premium soccer jerseys and kits. Browse products, contact support and shop online.';
      document.head.appendChild(m);
    }

    // Inject JSON-LD organization if missing
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
    .scroll-top:focus{ outline: 3px solid rgba(11,83,193,0.25); }
  `;
  document.head.appendChild(styleEl);

})();