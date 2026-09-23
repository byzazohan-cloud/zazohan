/* ZAZOHAN V0.4 - RUTIN backup -> central + visible work migration */
(()=>{'use strict';
 async function importRutinFile(file){const text=await file.text();let obj;try{obj=JSON.parse(text)}catch(_){throw new Error('RUTİN yedeği JSON olarak okunamadı')};if(window.ZAZOHAN_CORE.detectBackup(obj)!=='RUTIN-BACKUP-V3')throw new Error('Desteklenmeyen RUTİN yedek biçimi');const result=window.ZAZOHAN_CORE.importRutin(obj,file.name||'RUTIN yedeği');sessionStorage.setItem('ZAZOHAN_LAST_RUTIN_IMPORT',JSON.stringify(obj));return result}
 const key=x=>String(x?._sourceId||x?.id||'');
 function applyRutinWorkToApp(state){const raw=sessionStorage.getItem('ZAZOHAN_LAST_RUTIN_IMPORT');if(!raw)throw new Error('Aktarım oturumu bulunamadı');const obj=JSON.parse(raw),s=obj.state||{};state.work=Array.isArray(state.work)?state.work:[];state.expenses=Array.isArray(state.expenses)?state.expenses:[];let workAdded=0,workSkipped=0,roadAdded=0,roadSkipped=0;
   const existingWork=new Set(state.work.map(x=>String(x.rutinSourceId||'' )).filter(Boolean));
   const workMap=new Map();
   for(const w of (s.work||[])){const sid=String(w.id||'');if(!sid)continue;const zid='rutin_work_'+sid;workMap.set(sid,zid);if(existingWork.has(sid)||state.work.some(x=>x.id===zid)){workSkipped++;continue}state.work.push({...w,id:zid,rutinSourceId:sid,_source:'RUTIN',paymentStatus:w.paymentStatus||'legacy',roadAmount:0,roadSource:'cash'});existingWork.add(sid);workAdded++}
   const existingRoad=new Set(state.expenses.map(x=>String(x.rutinSourceId||'')).filter(Boolean));
   for(const e of (s.expenses||[])){if(!e.workId)continue;const sid=String(e.id||'');if(!sid)continue;const zid='rutin_exp_'+sid;if(existingRoad.has(sid)||state.expenses.some(x=>x.id===zid)){roadSkipped++;continue}const method=String(e.method||'').toLocaleUpperCase('tr-TR');state.expenses.push({...e,id:zid,rutinSourceId:sid,_source:'RUTIN',workId:workMap.get(String(e.workId))||('rutin_work_'+e.workId),title:e.title||'YOL',category:String(e.category||'').toLocaleUpperCase('tr-TR')==='YOL'?'Ulaşım':(e.category||'Diğer'),actualAmount:Number(e.amount)||0,paid:true,recurring:false,source:method.includes('KREDİ')?'card':'cash'});existingRoad.add(sid);roadAdded++}
   // Preserve legacy payment semantics: old RUTIN work has no reliable paid/receivable field.
   // Do not invent income or receivable records during migration.
   sessionStorage.removeItem('ZAZOHAN_LAST_RUTIN_IMPORT');return {workAdded,workSkipped,roadAdded,roadSkipped}
 }
 window.ZAZOHAN_IMPORT=Object.freeze({importRutinFile,applyRutinWorkToApp,summary:()=>window.ZAZOHAN_CORE.summary()});
})();
