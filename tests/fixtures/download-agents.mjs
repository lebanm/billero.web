// Representative UA strings; embedded-browser identity is a heuristic, not a device test.
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
const android = 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/130.0.0.0 Mobile Safari/537.36';
export const agents = [
  { name: 'iPhone Safari', store: 'apple', userAgent: `${iphone} Version/18.0 Safari/604.1` },
  { name: 'iPad Safari', store: 'apple', userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1' },
  { name: 'iPad desktop mode', store: 'apple', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15', platform: 'MacIntel', maxTouchPoints: 5 },
  { name: 'Android Chrome', store: 'play', userAgent: android },
  { name: 'Facebook iPhone', store: 'apple', userAgent: `${iphone} [FBAN/FBIOS;FBAV/490.0.0.0.0;FBDV/iPhone15,2;]` },
  { name: 'Instagram iPhone', store: 'apple', userAgent: `${iphone} Instagram 360.0.0.0.0 (iPhone15,2; iOS 18_0; es_US)` },
  { name: 'TikTok iPhone', store: 'apple', userAgent: `${iphone} BytedanceWebview/d8a21a6 musical_ly_37.0.0 JsSdk/2.0` },
  { name: 'Facebook Android', store: 'play', userAgent: `${android} [FB_IAB/FB4A;FBAV/490.0.0.0.0;]` },
  { name: 'Instagram Android', store: 'play', userAgent: `${android} Instagram 360.0.0.0.0 Android (34/14; 420dpi; 1080x2400; Google; Pixel 7; es_US)` },
  { name: 'TikTok Android', store: 'play', userAgent: `${android} BytedanceWebview/d8a21a6 musical_ly_37.0.0 JsSdk/2.0` },
  { name: 'Windows desktop', store: null, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36' },
  { name: 'Mac desktop', store: null, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15', platform: 'MacIntel', maxTouchPoints: 0 },
  { name: 'Windows touch laptop', store: null, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32', maxTouchPoints: 10 },
];
