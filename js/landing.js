(function () {
  'use strict';

  var menuButton = document.querySelector('.menu-toggle');
  var navigation = document.querySelector('.primary-nav');

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  }

  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      navigation.classList.toggle('is-open', !isOpen);
    });

    navigation.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeMenu();
        menuButton.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  var mapElement = document.querySelector('#world-map');
  var countries = window.BILLERO_MARKETS;

  if (!mapElement || !countries) return;

  if (typeof window.jsVectorMap !== 'function') {
    mapElement.setAttribute('hidden', '');
    var mapWrap = mapElement.closest('.map-wrap');
    if (mapWrap) mapWrap.setAttribute('hidden', '');
    return;
  }

  new window.jsVectorMap({
    selector: '#world-map',
    map: 'world',
    backgroundColor: 'transparent',
    zoomOnScroll: false,
    zoomButtons: false,
    regionStyle: {
      initial: { fill: '#1b2b42', stroke: '#07101f', strokeWidth: 0.5 },
      hover: { fill: '#0e7490', cursor: 'pointer' },
      selected: { fill: '#19c6e5' },
      selectedHover: { fill: '#22c7a9' }
    },
    selectedRegions: Object.keys(countries),
    onRegionTooltipShow: function (event, tooltip, code) {
      var country = countries[code];
      if (!country) {
        event.preventDefault();
        return;
      }
      tooltip.text(
        '<strong>' + country[0] + '</strong>' +
        (country[1] ? '<br><span style="color:#a8b3c7">' + country[1] + '</span>' : ''),
        true
      );
    }
  });
})();
