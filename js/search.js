// Fixed search UI insertion and full search behavior
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const productCells = Array.from(document.querySelectorAll('table td'));
    if (!productCells.length) return; // no products, nothing to do

    const products = productCells.map((td, i) => {
      const img = td.querySelector('img');
      const titleEl = td.querySelector('strong') || td.querySelector('figcaption') || td.querySelector('p');
      const title = titleEl ? titleEl.textContent.trim() : (img ? img.alt || `Product ${i+1}` : `Product ${i+1}`);
      const desc = img && img.dataset.desc ? img.dataset.desc : `High-quality ${title}.`;
      const price = img && img.dataset.price ? parseFloat(img.dataset.price) : null;
      if (img) {
        img.dataset.productIndex = i;
      }
      td.dataset.productIndex = i;
      return { index: i, title, img: img ? img.src : '', alt: img ? img.alt : '', desc, price };
    });

    // Inject minimal styles
    const dynStyle = document.createElement('style');
    dynStyle.textContent = `
      .search-wrap { display:flex; gap:8px; align-items:center; max-width:720px; margin:12px auto; position:relative; padding:0 12px; }
      .search-input { flex:1; padding:10px 12px; border-radius:8px; border:1px solid #ccc; font-size:14px; }
      .search-clear { background:#eee;border:0;padding:8px;border-radius:8px;cursor:pointer }
      .search-results { position:absolute; left:12px; right:12px; top:56px; background:#fff; box-shadow:0 8px 28px rgba(0,0,0,0.12); border-radius:8px; overflow:hidden; z-index:3000; display:none; max-height:320px; overflow:auto; }
      .search-item { display:flex; gap:8px; padding:8px; align-items:center; cursor:pointer; border-bottom:1px solid #f2f2f2; }
      .search-item:hover { background:#f7f7f7; }
      .search-thumb { width:48px; height:48px; object-fit:cover; border-radius:6px; }
      .highlight { outline:3px solid #ffd54f; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.06); }
      .dark-mode .search-results { background:#2b2b2b; color:#eee; }
      @media (max-width:520px){ .search-wrap{padding:0 8px} .search-results{left:8px; right:8px} }
    `;
    document.head.appendChild(dynStyle);

    // Build search UI
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-wrap';
    searchContainer.innerHTML = `
      <input type="search" class="search-input" placeholder="Search kits, e.g. 'Real Madrid'…" aria-label="Search products" />
      <button class="search-clear" title="Clear">✕</button>
      <div class="search-results" aria-live="polite"></div>
    `;

    // Insert search container immediately above product table
    const productImg = document.querySelector('table img');
    const productTable = productImg ? productImg.closest('table') : document.querySelector('table');
    const fallbackHeading = document.querySelector('h1');

    if (productTable) {
      productTable.parentNode.insertBefore(searchContainer, productTable);
    } else if (fallbackHeading) {
      fallbackHeading.parentNode.insertBefore(searchContainer, fallbackHeading.nextSibling);
    } else {
      document.body.insertBefore(searchContainer, document.body.firstChild);
    }

    const input = searchContainer.querySelector('.search-input');
    const clearBtn = searchContainer.querySelector('.search-clear');
    const resultsBox = searchContainer.querySelector('.search-results');

    // Helpers
    function escapeHtml(s){ return String(s||'').replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
    function highlightText(text, q){ if(!q) return escapeHtml(text); const r = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\$&')})`,'ig'); return escapeHtml(text).replace(r,'<mark style="background:#ffd54f;color:#000;">$1</mark>'); }
    function clearHighlights(){ document.querySelectorAll('table td').forEach(td => td.classList.remove('highlight')); }

    function searchProducts(q) {
      const qClean = String(q||'').trim().toLowerCase();
      if (!qClean) return [];
      const terms = qClean.split(/\s+/).filter(Boolean);
      return products
        .map(p => ({...p, score: terms.reduce((s,t)=> s + ((p.title||'').toLowerCase().includes(t) ? 2 : ((p.alt||'').toLowerCase().includes(t)?1:0)), 0)}))
        .filter(p => p.score > 0)
        .sort((a,b)=>b.score - a.score);
    }

    function renderResults(list, q) {
      if (!list || !list.length) { resultsBox.style.display='none'; resultsBox.innerHTML=''; return; }
      resultsBox.style.display='block';
      resultsBox.innerHTML = '';
      list.slice(0,8).forEach(p => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.tabIndex = 0;
        item.dataset.index = p.index;
        item.innerHTML = `
          <img class="search-thumb" src="${p.img}" alt="${escapeHtml(p.alt||p.title)}">
          <div>
            <div style="font-weight:600;">${highlightText(p.title, q)}</div>
            <div style="font-size:12px;color:#666;margin-top:4px;">${p.price ? `R ${p.price.toFixed(2)}` : ''}</div>
          </div>
        `;
        item.addEventListener('click', () => {
          // scroll to product and highlight
          const cell = document.querySelector(`table td[data-product-index="${p.index}"]`);
          if (cell) {
            cell.scrollIntoView({ behavior:'smooth', block:'center' });
            clearHighlights();
            cell.classList.add('highlight');
            setTimeout(() => cell.classList.remove('highlight'), 2400);
          }
          resultsBox.style.display = 'none';
        });
        item.addEventListener('keydown', (e)=> { if (e.key === 'Enter') item.click(); });
        resultsBox.appendChild(item);
      });
    }

    // Input handlers
    input.addEventListener('input', (e) => {
      const q = e.target.value;
      const res = searchProducts(q);
      clearHighlights();
      res.forEach(r => {
        const cell = document.querySelector(`table td[data-product-index="${r.index}"]`);
        if (cell) cell.classList.add('highlight');
      });
      renderResults(res, q);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { resultsBox.style.display='none'; clearHighlights(); input.blur(); }
      if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
      resultsBox.style.display = 'none';
      clearHighlights();
    });

    // Close results on outside click
    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) {
        resultsBox.style.display = 'none';
      }
    });

    // Accessibility: focus opens results if value exists
    input.addEventListener('focus', () => {
      if (input.value.trim()) {
        renderResults(searchProducts(input.value.trim()), input.value.trim());
      }
    });
  });
})();