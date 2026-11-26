(function () {
  'use strict';
  // Only an explicit language choice changes the preference; ordinary page visits do not.
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[data-lang]');
    if (!link || !/^(sl|en|de|es|hr|cs|sk|pl|nl|pt|ja|th)$/.test(link.dataset.lang)) return;
    try {
      document.cookie = 'lang=' + link.dataset.lang + '; Path=/; Max-Age=31536000; SameSite=Lax' +
        (location.protocol === 'https:' ? '; Secure' : '');
    } catch (_) { /* The selected link still works when cookies are blocked. */ }
  });
})();
