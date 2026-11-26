// Static-host fallback; the edge provides the real HTTP 302.
(function () {
  'use strict';
  var available = ["sl", "en", "de", "es", "nl", "th"];
  var known = ["sl", "en", "de", "es", "nl", "th", "cs", "hr", "ja", "pl", "pt", "sk"];
  var chosen;
  try {
    var saved = document.cookie.split(';').map(function (v) { return v.trim(); }).find(function (v) { return v.indexOf('lang=') === 0; });
    if (saved) {
      var code = decodeURIComponent(saved.slice(5)).toLowerCase();
      if (known.indexOf(code) !== -1) chosen = available.indexOf(code) !== -1 ? code : 'en';
    }
  } catch (_) {}
  if (!chosen) {
    var preferences = navigator.languages || [navigator.language || 'en'];
    chosen = preferences.map(function (v) { return v.toLowerCase().split('-')[0]; }).find(function (v) { return available.indexOf(v) !== -1; }) || 'en';
  }
  location.replace('/' + chosen + '/' + location.search + location.hash);
})();
