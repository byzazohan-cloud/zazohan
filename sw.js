const CACHE='zazo-player-v1-2-9';
const APP=['./','index.html','styles.css','config.js','app.js','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png'];
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
    e.respondWith((async()=>{
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3500);
      try{const r=await fetch(e.request,{signal:controller.signal});if(!r||!r.ok)throw new Error('network');const copy=r.clone();caches.open(CACHE).then(c=>c.put(normalized,copy));return r}
      catch{const c=await caches.open(CACHE),hit=await c.match(normalized);return hit||(await caches.match(INDEX_URL))}
      finally{clearTimeout(timer)}
    })());
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
