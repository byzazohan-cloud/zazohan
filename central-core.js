/* HANE V0.3 - CENTRAL WORKFLOW
   Finans için tek merkezi veri sahibi. Çalışma ve Nakit Para bu modelin dışındadır;
   finans alanları uygulama state üzerinde erişim köprüsüyle bu çekirdeğe yönlendirilir. */
(()=>{
  'use strict';
  const KEY='HANE_CENTRAL_V4', LEGACY_KEY=['ZAZO','HAN_CENTRAL_V2'].join(''), SCHEMA=4;
  const now=()=>new Date().toISOString();
  const uid=()=>crypto.randomUUID?.()||('z_'+Date.now().toString(36)+Math.random().toString(36).slice(2));
  const clone=v=>{try{return structuredClone(v)}catch(_){return JSON.parse(JSON.stringify(v))}};
  const blank=()=>({
    schema:SCHEMA,app:'HANE',createdAt:now(),updatedAt:now(),profile:{},settings:{},
    finance:{expenses:[],incomes:[],cards:[],flexAccounts:[],accounts:[],categories:[],categoryRegistry:{},categoryMeta:{},statements:[],investments:[],cardTransactions:[],cardPayments:[],statementImports:[],statementCategoryRules:{},flexTransactions:[],installments:[],customCategories:[]},
    organization:{notes:[],reminders:[],members:[]},
    links:[],imports:{hane:[],rutin:[]},han:{reviewed:[],findings:[]},migration:{log:[]}
  });
  function normalize(db){const b=blank(),x=db&&typeof db==='object'?db:{};return {...b,...x,finance:{...b.finance,...(x.finance||{})},organization:{...b.organization,...(x.organization||{})},imports:{...b.imports,...(x.imports||{})},han:{...b.han,...(x.han||{})},migration:{...b.migration,...(x.migration||{})},schema:SCHEMA,app:'HANE'};}
  // SECURITY: The central model is a derived working view only. It must never create a
  // second plaintext copy of PIN-protected HANE/RUTIN financial data in Web Storage.
  let volatileDb=null,attachedState=null;
  function read(){return normalize(volatileDb?clone(volatileDb):blank())}
  function write(v){const x=normalize(v);x.updatedAt=now();volatileDb=clone(x);return clone(x)}
  function detectBackup(o){if(o?.format==='RUTIN-BACKUP-V3'&&o.state)return 'RUTIN-BACKUP-V3';if(o?.state&&Array.isArray(o.state.expenses)&&Array.isArray(o.state.cards))return 'HANE-STATE';if(o&&Array.isArray(o.expenses)&&Array.isArray(o.cards))return 'HANE-STATE';return 'UNKNOWN'}
  const src=(x,source)=>({...clone(x),_source:source,_sourceId:String(x?.id??'')});
  function convertRutin(o){if(detectBackup(o)!=='RUTIN-BACKUP-V3')throw new Error('RUTIN-BACKUP-V3 bekleniyor');const s=o.state||{},z=blank();z.profile=clone(s.profile||{});z.settings=clone(s.settings||{});z.finance.expenses=(s.expenses||[]).map(x=>src(x,'RUTIN'));z.finance.incomes=(s.incomes||[]).map(x=>src(x,'RUTIN'));z.finance.cards=(s.cards||[]).map(x=>src(x,'RUTIN'));z.finance.flexAccounts=(s.flexAccounts||[]).map(x=>src(x,'RUTIN'));z.finance.accounts=clone(s.accounts||{});z.finance.categories=clone(s.categories||[]);z.finance.categoryMeta=clone(s.categoryMeta||{});z.finance.investments=(s.investments||[]).map(x=>src(x,'RUTIN'));z.organization.notes=(s.notes||[]).map(x=>src(x,'RUTIN'));z.organization.reminders=clone(s.manualReminders||[]);return z}
  function mergeUnique(a,b){const out=[...(a||[])],seen=new Set(out.map(x=>`${x._source||''}|${x._sourceId||x.id||''}`));for(const x of b||[]){const k=`${x._source||''}|${x._sourceId||x.id||''}`;if(!seen.has(k)){seen.add(k);out.push(clone(x))}}return out}
  function mergeConverted(db,c){db.profile=Object.keys(db.profile||{}).length?db.profile:clone(c.profile);db.settings={...(c.settings||{}),...(db.settings||{})};for(const k of ['expenses','incomes','cards','flexAccounts','categories','statements','investments']){if(k==='categories')db.finance[k]=[...new Set([...(db.finance[k]||[]),...(c.finance[k]||[])])];else db.finance[k]=mergeUnique(db.finance[k],c.finance[k])}db.finance.accounts={...(c.finance.accounts||{}),...(db.finance.accounts||{})};db.finance.categoryMeta={...(c.finance.categoryMeta||{}),...(db.finance.categoryMeta||{})};db.organization.notes=mergeUnique(db.organization.notes,c.organization.notes);db.organization.reminders=mergeUnique(db.organization.reminders,c.organization.reminders);return db}
  function importRutin(o,label='RUTIN yedeği'){const c=convertRutin(o),db=read(),before={expenses:db.finance.expenses.length};mergeConverted(db,c);const entry={id:uid(),type:'RUTIN-BACKUP-V3',label,importedAt:now(),counts:{expenses:c.finance.expenses.length,incomes:c.finance.incomes.length,cards:c.finance.cards.length,notes:c.organization.notes.length}};db.imports.rutin.push(entry);db.migration.log.push({...entry,action:'IMPORT'});write(db);return {ok:true,...entry,before,after:{expenses:db.finance.expenses.length}}}
  const FINANCE_BINDINGS={expenses:'expenses',incomes:'incomes',cards:'cards',flexAccounts:'flexAccounts',accounts:'accounts',customCategories:'customCategories',categoryMeta:'categoryMeta',categoryRegistry:'categoryRegistry',statementImports:'statementImports',statementCategoryRules:'statementCategoryRules',cardTransactions:'cardTransactions',cardPayments:'cardPayments',flexTransactions:'flexTransactions',installments:'installments'};
  function attachFinanceState(s){
    if(!s||typeof s!=='object')return null;
    const db=read();
    // V103: Finance Core is the owner. Çalışma (work/workRoads/workPayments/workDeductions)
    // and Nakit Para (cashGiven/cashManual/cashExcluded) intentionally stay outside.
    for(const [prop,key] of Object.entries(FINANCE_BINDINGS)){
      const current=s[prop];
      if(Array.isArray(db.finance[key]))db.finance[key]=Array.isArray(current)?current:[];
      else db.finance[key]=(current&&typeof current==='object')?current:{};
    }
    db.finance.categories=Array.isArray(s.customCategories)?s.customCategories:[];
    db.profile=clone(s.profile||db.profile||{});db.settings={...(db.settings||{}),hane:clone(s.settings||{})};db.organization.members=clone(s.members||[]);db.migration.lastHaneSyncAt=now();
    volatileDb=normalize(db);attachedState=s;
    for(const [prop,key] of Object.entries(FINANCE_BINDINGS)){
      const desc=Object.getOwnPropertyDescriptor(s,prop);
      if(desc&&desc.configurable===false)continue;
      Object.defineProperty(s,prop,{enumerable:true,configurable:true,get(){return volatileDb.finance[key]},set(v){if(Array.isArray(volatileDb.finance[key]))volatileDb.finance[key]=Array.isArray(v)?v:[];else volatileDb.finance[key]=(v&&typeof v==='object')?v:{}}});
    }
    return s;
  }
  function syncFromHaneState(s){
    if(!s||typeof s!=='object')return null;
    if(attachedState){const db=volatileDb;db.profile=clone(s.profile||db.profile||{});db.settings={...(db.settings||{}),hane:clone(s.settings||{})};db.organization.members=clone(s.members||[]);db.migration.lastHaneSyncAt=now();db.updatedAt=now();return read()}
    attachFinanceState(s);return read();
  }
  function finance(){return volatileDb?volatileDb.finance:blank().finance}
  const dayNum=d=>{const t=Date.parse(String(d||'').slice(0,10)+'T00:00:00Z');return Number.isFinite(t)?Math.floor(t/86400000):null};
  const cents=v=>Math.round((Number(v)||0)*100);
  const normText=v=>String(v||'').toLocaleUpperCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9ÇĞİÖŞÜ]+/g,' ').trim();
  function reconcileFinance(){const db=read(),existing=new Set((db.links||[]).filter(x=>x.type==='HANE_RUTIN_EQUIVALENT').map(x=>x.haneId+'|'+x.rutinId)),result={exact:[],possible:[],unmatchedHane:[],unmatchedRutin:[]};
    const h=(db.finance.expenses||[]).filter(x=>x._source==='HANE'),r=(db.finance.expenses||[]).filter(x=>x._source==='RUTIN');const usedH=new Set(),usedR=new Set();
    const candidates=[];for(const a of h){for(const b of r){if(cents(a.amount)!==cents(b.amount))continue;const da=dayNum(a.date),dbn=dayNum(b.date);if(da==null||dbn==null)continue;const dd=Math.abs(da-dbn);if(dd>2)continue;const ta=normText(a.title||a.name||a.description),tb=normText(b.title||b.name||b.description);const sameText=!!ta&&!!tb&&(ta===tb||ta.includes(tb)||tb.includes(ta));candidates.push({a,b,dd,sameText});}}
    const exact=candidates.filter(x=>x.dd===0);for(const c of exact){const ak=String(c.a._sourceId||c.a.id),bk=String(c.b._sourceId||c.b.id);if(usedH.has(ak)||usedR.has(bk))continue;const ac=exact.filter(x=>String(x.a._sourceId||x.a.id)===ak).length,bc=exact.filter(x=>String(x.b._sourceId||x.b.id)===bk).length;if(ac===1&&bc===1){usedH.add(ak);usedR.add(bk);result.exact.push({haneId:ak,rutinId:bk,date:c.a.date,amount:Number(c.a.amount)||0,haneTitle:c.a.title||'',rutinTitle:c.b.title||'',reason:'AYNI TARİH + AYNI TUTAR'});if(!existing.has(ak+'|'+bk)){db.links.push({id:uid(),type:'HANE_RUTIN_EQUIVALENT',haneId:ak,rutinId:bk,matchedAt:now(),method:'EXACT_DATE_AMOUNT',status:'matched'});existing.add(ak+'|'+bk)}}}
    for(const c of candidates){const ak=String(c.a._sourceId||c.a.id),bk=String(c.b._sourceId||c.b.id);if(usedH.has(ak)||usedR.has(bk))continue;if(c.dd<=2)result.possible.push({haneId:ak,rutinId:bk,dateHane:c.a.date,dateRutin:c.b.date,amount:Number(c.a.amount)||0,haneTitle:c.a.title||'',rutinTitle:c.b.title||'',dayDiff:c.dd,nameSimilar:c.sameText,reason:`AYNI TUTAR + ${c.dd} GÜN FARK`});}
    result.unmatchedHane=h.filter(x=>!usedH.has(String(x._sourceId||x.id))).map(x=>String(x._sourceId||x.id));result.unmatchedRutin=r.filter(x=>!usedR.has(String(x._sourceId||x.id))).map(x=>String(x._sourceId||x.id));db.migration.lastReconciliation={at:now(),exact:result.exact.length,possible:result.possible.length,unmatchedHane:result.unmatchedHane.length,unmatchedRutin:result.unmatchedRutin.length};db.han.findings=(db.han.findings||[]).filter(x=>x.kind!=='MIGRATION_POSSIBLE_MATCH');for(const x of result.possible.slice(0,200))db.han.findings.push({id:uid(),kind:'MIGRATION_POSSIBLE_MATCH',severity:'suspicious',category:'FİNANS',createdAt:now(),...x});write(db);return result}

  function migrationFinding(id){const d=read();return (d.han.findings||[]).find(x=>String(x.id)===String(id)&&x.kind==='MIGRATION_POSSIBLE_MATCH')||null}
  function resolveMigrationFinding(id,decision){const db=read(),i=(db.han.findings||[]).findIndex(x=>String(x.id)===String(id)&&x.kind==='MIGRATION_POSSIBLE_MATCH');if(i<0)throw new Error('Olası eşleşme bulunamadı');const f=db.han.findings[i],same=decision==='same',type=same?'HANE_RUTIN_EQUIVALENT':'HANE_RUTIN_DISTINCT';const exists=(db.links||[]).some(x=>x.type===type&&String(x.haneId)===String(f.haneId)&&String(x.rutinId)===String(f.rutinId));if(!exists)db.links.push({id:uid(),type,haneId:String(f.haneId),rutinId:String(f.rutinId),matchedAt:now(),method:'USER_REVIEW',status:same?'matched':'distinct',reviewFindingId:String(f.id)});db.han.reviewed=db.han.reviewed||[];db.han.reviewed.push({...f,reviewedAt:now(),decision:same?'same':'different'});db.han.findings.splice(i,1);write(db);return {decision:same?'same':'different',finding:f}}
  function summary(){const d=read();return {schema:d.schema,expenses:d.finance.expenses.length,incomes:d.finance.incomes.length,cards:d.finance.cards.length,flexAccounts:d.finance.flexAccounts.length,cardTransactions:d.finance.cardTransactions.length,cardPayments:d.finance.cardPayments.length,statements:d.finance.statementImports.length,categories:Object.keys(d.finance.categoryRegistry||{}).length,notes:d.organization.notes.length,rutinImports:d.imports.rutin.length,lastHaneSyncAt:d.migration.lastHaneSyncAt||null}}
  window.HANE_CORE=Object.freeze({KEY,SCHEMA,blank,read,write,detectBackup,convertRutin,importRutin,attachFinanceState,syncFromHaneState,finance,reconcileFinance,migrationFinding,resolveMigrationFinding,summary});
  write(blank());
})();
