/* Pass 24 release-candidate cache. All content lives on this site. */
const CACHE = 'ouat-pass24-rc1';
const FILES = ['./index.html','./privacy.html','./styles.css','./manifest.webmanifest','./story.js','./realm_expansion.js','./act2.js','./act3.js','./act4.js','./act5.js','./act6.js','./act7.js','./act8.js','./save-resilience.js','./scene-engine.js','./story-depth.js','./branch-adventures.js','./litrpg.js','./legacy-adventures.js','./puzzle-adventures.js','./presentation.js','./game.js','./assets/archive-glow.webp','./assets/archive.webp','./assets/bakery.webp','./assets/ballroom.webp','./assets/bell-tower.webp','./assets/bridge.webp','./assets/cabinet.webp','./assets/catalog.webp','./assets/cinderella.webp','./assets/clock.webp','./assets/cloud-lantern.webp','./assets/cloud.webp','./assets/court-rays.webp','./assets/court.webp','./assets/crow.webp','./assets/echo.webp','./assets/engine.webp','./assets/festival.webp','./assets/giant.webp','./assets/glass.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon.svg','./assets/ink.webp','./assets/invitation.webp','./assets/jack.webp','./assets/king.webp','./assets/kingdom.webp','./assets/landscape.webp','./assets/last-chime.webp','./assets/ledger.webp','./assets/march.webp','./assets/margin-stars.webp','./assets/margin.webp','./assets/midnight-clock.webp','./assets/orders.webp','./assets/page.webp','./assets/palace.webp','./assets/preservation.webp','./assets/red.webp','./assets/seed.webp','./assets/servants.webp','./assets/shadow.webp','./assets/shop.webp','./assets/silver-path.webp','./assets/sugar-lights.webp','./assets/sugar.webp','./assets/tracks.webp','./assets/tunnels.webp','./assets/village.webp','./assets/wolf.webp','./assets/woods.webp','./audio/bell.mp3','./audio/bookshop.mp3','./audio/choose.mp3','./audio/discovery.mp3','./audio/forest.mp3','./audio/kingdom.mp3','./audio/margin.mp3','./audio/mystery.mp3','./audio/page.mp3'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('ouat-pass') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => res.ok ? res : Promise.reject()).catch(() => caches.match(req).then(found => found || caches.match('./index.html'))));
    return;
  }
  // Cache-first static assets: no misleading HTML fallback for missing JS, CSS or audio.
  e.respondWith(caches.match(req).then(found => found || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => new Response('Offline file unavailable', {status:503, headers:{'Content-Type':'text/plain'}}))));
});
