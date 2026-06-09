// Billero – Legal Info rendering (shared across all language pages)
// Requires: legal-info-data.js loaded first, and L (translations object) defined in the page.

(function () {
  function buildCard(c) {
    const items = MANDATORY_SETS[c.items] || [];
    const itemsHtml = items.map(k =>
      `<li>${L[k] || k}</li>`
    ).join('');

    const notesHtml = c.notes
      ? `<div class="li-notes">${c.notes}</div>`
      : '';

    return `
      <div class="li-card" data-name="${c.name.toLowerCase()} ${c.code.toLowerCase()}">
        <div class="li-card-header">
          <div class="li-flag-name">
            <span class="li-flag">${c.flag}</span>
            <span>${c.name}</span>
          </div>
          <span class="li-verified">${L.lastVerified}: ${c.lastVerified}</span>
        </div>
        <div class="li-rows">
          <div class="li-row">
            <span class="li-label">${L.taxAuthority}</span>
            <span class="li-value">${c.authority}<br><a href="${c.url}" target="_blank" rel="noopener">${c.url.replace('https://','')}</a></span>
          </div>
          <div class="li-row">
            <span class="li-label">${L.law}</span>
            <span class="li-value">${c.law}</span>
          </div>
          <div class="li-row">
            <span class="li-label">${L.currency}</span>
            <span class="li-value">${c.currency}</span>
          </div>
          <div class="li-row">
            <span class="li-label">${L.vat}</span>
            <span class="li-value">${c.vat}</span>
          </div>
          <div class="li-row">
            <span class="li-label">${L.threshold}</span>
            <span class="li-value">${c.threshold}</span>
          </div>
          <div class="li-row">
            <span class="li-label">${L.retention}</span>
            <span class="li-value">${c.retention} ${L.years}</span>
          </div>
        </div>
        <button class="li-items-toggle" onclick="toggleItems(this)">${L.showItems}</button>
        <ul class="li-items-list">${itemsHtml}</ul>
        ${notesHtml}
      </div>`;
  }

  function render() {
    const grid = document.getElementById('countryGrid');
    if (!grid) return;
    grid.innerHTML = COUNTRIES.map(buildCard).join('');
  }

  window.filterCards = function () {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.li-card');
    let visible = 0;
    cards.forEach(card => {
      const match = !q || card.dataset.name.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    const none = document.getElementById('noResults');
    if (none) none.style.display = visible === 0 ? '' : 'none';
  };

  window.toggleItems = function (btn) {
    const list = btn.nextElementSibling;
    const open = list.classList.toggle('open');
    btn.textContent = open ? L.hideItems : L.showItems;
  };

  render();
})();
