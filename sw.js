const CACHE='zazo-player-v1-2-3';
const APP=['./','index.html','styles.css','app.js','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png'];
const APP_URLS=new Set(APP.map(x=>new URL(x,self.registration.scope).href));
const INDEX_URL=new URL('index.html',self.registration.scope).href;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('zazo-player-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  u.hash='';u.search='';
  const normalized=u.href;
  const isAppShell=APP_URLS.has(normalized);
  if(isAppShell){
    e.respondWith(fetch(e.request).then(r=>{
      if(r&&r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(normalized,copy));}
      return r;
    }).catch(()=>caches.open(CACHE).then(c=>c.match(normalized)).then(r=>r||caches.match(INDEX_URL))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
