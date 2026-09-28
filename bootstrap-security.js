'use strict';
(() => {
  const BUILD='20260928-HANE-WORK-V141-CARD-VISUAL-ACTIONS';
  const KEY='hane_app_shell_build';
  const RELOAD_KEY='hane_auto_update_reload';
  const CHECK_MS=60*60*1000;

  async function checkForUpdate(){
    if(!('serviceWorker' in navigator)) return;
    try{
      let reg=await navigator.serviceWorker.getRegistration('./');
      if(!reg) reg=await navigator.serviceWorker.register('./sw.js?v='+BUILD,{scope:'./',updateViaCache:'none'});
      await reg.update();
      const waiting=reg.waiting;
      if(waiting) waiting.postMessage({type:'SKIP_WAITING'});
    }catch(e){ console.warn('HANE update check:',e); }
  }

  try{
    if(localStorage.getItem(KEY)!==BUILD) localStorage.setItem(KEY,BUILD);
  }catch(e){}
  // V133: her sayfa açılışında SW güncellemesini hemen kontrol et; hard-refresh gerektirme.
  checkForUpdate();

  // V134: sayfayı eski worker kontrol ediyorsa build'i ping ile doğrula; yeni worker devralınca yalnız bir kez yenile.
  (async()=>{try{const c=navigator.serviceWorker&&navigator.serviceWorker.controller;if(!c)return;const ch=new MessageChannel();const ok=await new Promise(r=>{const t=setTimeout(()=>r(false),1200);ch.port1.onmessage=e=>{clearTimeout(t);r(e.data&&e.data.build===BUILD)};c.postMessage({type:'PING'},[ch.port2])});if(!ok){const reg=await navigator.serviceWorker.getRegistration('./');if(reg){await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'})}}}catch(e){}})();

  if(!('serviceWorker' in navigator)) return;
  window.addEventListener('load',async()=>{
    try{
      const reg=await navigator.serviceWorker.register('./sw.js?v='+BUILD,{scope:'./',updateViaCache:'none'});
      const activate=worker=>{
        if(!worker)return;
        worker.addEventListener('statechange',()=>{
          if(worker.state==='installed'&&navigator.serviceWorker.controller){
            try{worker.postMessage({type:'SKIP_WAITING'})}catch(e){}
          }
        });
      };
      activate(reg.installing);
      reg.addEventListener('updatefound',()=>activate(reg.installing));
      await reg.update();

      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        try{
          if(sessionStorage.getItem(RELOAD_KEY)===BUILD) return;
          sessionStorage.setItem(RELOAD_KEY,BUILD);
        }catch(e){}
        location.reload();
      });

      // Açık kalan HANE da yeni sürümü düzenli kontrol eder.
      setInterval(checkForUpdate,CHECK_MS);
      window.addEventListener('focus',checkForUpdate);
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdate();});
    }catch(e){console.warn('HANE update worker:',e)}
  });
})();
