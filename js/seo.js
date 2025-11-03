// ...existing code...

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    // Update document title from H1 if present (keeps SEO friendly titles)
    const mainH1 = document.querySelector('h1');
    if (mainH1 && mainH1.textContent.trim()) {
      document.title = `${mainH1.textContent.trim()} — Goal Gear`;
    } else {
      document.title = document.title || 'Goal Gear — Premium Soccer Jerseys';
    }

    // Inject styles for cleaner H1 and social buttons
    const s = document.createElement('style');
    s.textContent = `
      /* Cleaner H1 styles */
      h1 {
        font-family: "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-weight: 700;
        font-size: clamp(28px, 4.5vw, 48px);
        line-height: 1.08;
        letter-spacing: 0.4px;
        text-align: center;
        color: #0b1220;
        margin: 20px auto;
        padding: 14px 20px;
        max-width: 980px;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,250,250,0.95));
        box-shadow: 0 10px 30px rgba(3,12,34,0.06);
      }
      @media (prefers-color-scheme: dark) {
        h1 { color:#f3f4f6; background: linear-gradient(180deg, rgba(24,24,24,0.8), rgba(12,12,12,0.8)); box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
      }

      /* Floating social/contact icon bar */
      #gg-socials {
        position: fixed;
        left: 18px;
        bottom: 18px;
        display: flex;
        gap: 10px;
        z-index: 10001;
        align-items: center;
        pointer-events: auto;
      }
      .gg-social-btn {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:44px;
        height:44px;
        border-radius:10px;
        background: #fff;
        color: #111;
        box-shadow: 0 8px 20px rgba(2,6,23,0.08);
        text-decoration: none;
        transition: transform .12s ease, box-shadow .12s;
      }
      .gg-social-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(2,6,23,0.12); }
      .gg-social-btn svg { width:20px; height:20px; display:block; }
      .gg-social-label {
        display:none;
        font-size:12px;
        margin-left:6px;
        color:inherit;
      }

      /* compact on small screens */
      @media (max-width:420px) {
        #gg-socials { left: 12px; bottom: 12px; gap:8px; }
        .gg-social-btn { width:40px; height:40px; border-radius:8px; }
      }

      /* dark mode */
      .dark-mode .gg-social-btn { background:#1f1f1f; color:#fff; box-shadow: 0 8px 20px rgba(0,0,0,0.6); }
    `;
    document.head.appendChild(s);

    // Build social/contact links (replace placeholders with your actual URLs/numbers)
    const contact = {
      twitter: 'https://twitter.com/yourhandle',          // replace
      whatsapp: 'https://wa.me/27123456789',             // replace with full phone number (country code + number)
      email: 'mailto:info@example.com?subject=Goal%20Gear%20Enquiry' // replace
    };

    // If a global siteContact existed earlier, prefer its values
    try {
      if (window.siteContact && typeof window.siteContact === 'object') {
        if (window.siteContact.sameAs && window.siteContact.sameAs[1]) contact.twitter = window.siteContact.sameAs[1] || contact.twitter;
        if (window.siteContact.phone) contact.whatsapp = 'https://wa.me/' + window.siteContact.phone.replace(/\D/g,'');
        if (window.siteContact.email) contact.email = 'mailto:' + window.siteContact.email + '?subject=Goal%20Gear%20Enquiry';
      }
    } catch (_) { /* ignore */ }

    // Create container
    if (!document.getElementById('gg-socials')) {
      const wrap = document.createElement('div');
      wrap.id = 'gg-socials';
      wrap.innerHTML = `
        <a class="gg-social-btn" id="gg-twitter" href="${contact.twitter}" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.92c-.63.28-1.3.47-2.01.56.72-.43 1.27-1.11 1.53-1.92-.68.4-1.44.67-2.25.82A3.52 3.52 0 0016.11 4c-1.94 0-3.51 1.7-3.08 3.56-2.92-.15-5.51-1.56-7.25-3.71-.96 1.66-.42 3.9 1.2 4.99-.56-.02-1.09-.17-1.55-.42v.04c0 1.72 1.19 3.15 2.77 3.48-.51.13-1.04.14-1.56.05.44 1.4 1.71 2.42 3.22 2.45A7.07 7.07 0 012 19.54a9.97 9.97 0 005.41 1.58c6.5 0 10.05-5.4 9.84-10.23.68-.5 1.27-1.12 1.74-1.83-.63.28-1.31.48-2.02.57z"/></svg>
        </a>
        <a class="gg-social-btn" id="gg-whatsapp" href="${contact.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.9 11.9 0 0012 .048 11.93 11.93 0 001.86 10.16c0 2.09.55 4.14 1.6 5.94L.03 23.99l7.13-1.9a11.9 11.9 0 005.83 1.54h.01c6.62 0 11.98-5.39 11.98-12.04 0-3.21-1.25-6.22-3.67-8.59zM12 21.69h-.01c-1.78 0-3.53-.48-5.03-1.38l-.36-.22-4.23 1.11 1.13-4.11-.24-.38A9.9 9.9 0 012.1 10.16c0-5.44 4.45-9.87 9.9-9.87 2.65 0 5.13 1.03 7 2.9 1.9 1.89 2.95 4.41 2.95 7.08 0 5.48-4.57 9.71-10 9.71z"/><path d="M17.56 14.17c-.3-.15-1.78-.88-2.05-.98-.27-.1-.46-.15-.65.15-.19.3-.75.98-.92 1.18-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.77-1.64-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2 0-.37-.01-.51-.02-.14-.65-1.56-.89-2.14-.23-.56-.46-.49-.64-.5l-.55-.01c-.19 0-.5.07-.76.37-.26.3-1 1-1 2.44 0 1.43 1.03 2.81 1.17 3.01.14.2 1.98 3.04 4.8 4.27 3.32 1.44 3.32 0 3.92-.28.6-.28 1.95-.78 2.23-1.37.28-.6.28-1.12.2-1.23-.08-.11-.27-.16-.57-.31z"/></svg>
        </a>
        <a class="gg-social-btn" id="gg-email" href="${contact.email}" aria-label="Email">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
      `;
      document.body.appendChild(wrap);
    }

    // small enhancement: open WhatsApp links in new tab on mobile & desktop (wa.me supports)
    const waEl = document.getElementById('gg-whatsapp');
    if (waEl) waEl.addEventListener('click', (e) => {
      // allow default navigation; but ensure it's external
      // no-op - link already targets _blank
    });

    // Accessibility: keyboard focus outlines
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.querySelectorAll('.gg-social-btn').forEach(btn => btn.style.boxShadow = '0 12px 30px rgba(0,0,0,0.18)');
      }
    });
  });
})();

// ...existing code...