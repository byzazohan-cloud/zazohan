const CACHE='hane-shell-v248-work-payment-status';
const SHELL=['./','./index.html','./styles.css','./design-system.css','./app-v248.js','./central-core.js','./bootstrap-security.js','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;const shell=/\.(?:html|js|css|json)$/.test(u.pathname)||u.pathname.endsWith('/');if(shell){e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));}else{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));}});
