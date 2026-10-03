/* HANE - CENTRAL WORKFLOW
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
    appState:{selectedMonth:'',theme:{},homeLayout:[],homeHidden:[]},
    finance:{expenses:[],incomes:[],cards:[],flexAccounts:[],accounts:[],categories:[],categoryRegistry:{},categoryMeta:{},statements:[],investments:[],cardTransactions:[],cardPayments:[],statementImports:[],statementCategoryRules:{},flexTransactions:[],installments:[],customCategories:[]},
    organization:{notes:[],reminders:[],members:[]},
    links:[],imports:{hane:[]},han:{reviewed:[],findings:[]},migration:{log:[]}
  });
  function normalize(db){const b=blank(),x=db&&typeof db==='object'?db:{};return {...b,...x,appState:{...b.appState,...(x.appState||{})},finance:{...b.finance,...(x.finance||{})},organization:{...b.organization,...(x.organization||{})},imports:{...b.imports,...(x.imports||{})},han:{...b.han,...(x.han||{})},migration:{...b.migration,...(x.migration||{})},schema:SCHEMA,app:'HANE'};}
  // SECURITY: The central model is a derived working view only. It must never create a
  // second plaintext copy of PIN-protected HANE financial data in Web Storage.
  let volatileDb=null,attachedState=null;
  function read(){return normalize(volatileDb?clone(volatileDb):blank())}
  function write(v){const x=normalize(v);x.updatedAt=now();volatileDb=clone(x);return clone(x)}
  function detectBackup(o){if(o?.state&&Array.isArray(o.state.expenses)&&Array.isArray(o.state.cards))return 'HANE-STATE';if(o&&Array.isArray(o.expenses)&&Array.isArray(o.cards))return 'HANE-STATE';return 'UNKNOWN'}
  const APP_BINDINGS={profile:'profile',settings:'settings'};
  const APPSTATE_BINDINGS={selectedMonth:'selectedMonth',theme:'theme',homeLayout:'homeLayout',homeHidden:'homeHidden'};
  const ORG_BINDINGS={notes:'notes',reminders:'reminders',members:'members'};
  const FINANCE_BINDINGS={expenses:'expenses',incomes:'incomes',cards:'cards',flexAccounts:'flexAccounts',accounts:'accounts',customCategories:'customCategories',categoryMeta:'categoryMeta',categoryRegistry:'categoryRegistry',statements:'statements',investments:'investments',statementImports:'statementImports',statementCategoryRules:'statementCategoryRules',cardTransactions:'cardTransactions',cardPayments:'cardPayments',flexTransactions:'flexTransactions',installments:'installments'};
  function attachFinanceState(s){
    if(!s||typeof s!=='object')return null;
    const db=read();
    // V109: Finance Core is the owner. Çalışma (work/workRoads/workPayments/workDeductions)
    // and Nakit Para (cashGiven/cashManual/cashExcluded) intentionally stay outside.
    // SAFETY: Do not add work*, cash* fields to any binding map in this file.
    for(const [prop,key] of Object.entries(FINANCE_BINDINGS)){
      const current=s[prop];
      if(Array.isArray(db.finance[key]))db.finance[key]=Array.isArray(current)?current:[];
      else db.finance[key]=(current&&typeof current==='object')?current:{};
    }
    db.finance.categories=Array.isArray(s.customCategories)?s.customCategories:[];
    db.profile=(s.profile&&typeof s.profile==='object')?s.profile:{};
    db.settings=(s.settings&&typeof s.settings==='object')?s.settings:{};
    db.appState.selectedMonth=String(s.selectedMonth||'');
    db.appState.theme=(s.theme&&typeof s.theme==='object')?s.theme:{};
    db.appState.homeLayout=Array.isArray(s.homeLayout)?s.homeLayout:[];
    db.appState.homeHidden=Array.isArray(s.homeHidden)?s.homeHidden:[];
    db.organization.notes=Array.isArray(s.notes)?s.notes:[];
    db.organization.reminders=Array.isArray(s.reminders)?s.reminders:[];
    db.organization.members=Array.isArray(s.members)?s.members:[];
    db.migration.lastHaneSyncAt=now();
    volatileDb=normalize(db);attachedState=s;
    const bind=(prop,getter,setter)=>{const desc=Object.getOwnPropertyDescriptor(s,prop);if(desc&&desc.configurable===false)return;Object.defineProperty(s,prop,{enumerable:true,configurable:true,get:getter,set:setter})};
    bind('profile',()=>volatileDb.profile,v=>{volatileDb.profile=(v&&typeof v==='object')?v:{}});
    bind('settings',()=>volatileDb.settings,v=>{volatileDb.settings=(v&&typeof v==='object')?v:{}});
    for(const [prop,key] of Object.entries(APPSTATE_BINDINGS)){bind(prop,()=>volatileDb.appState[key],v=>{if(Array.isArray(volatileDb.appState[key]))volatileDb.appState[key]=Array.isArray(v)?v:[];else if(key==='selectedMonth')volatileDb.appState[key]=String(v||'');else volatileDb.appState[key]=(v&&typeof v==='object')?v:{}})}
    for(const [prop,key] of Object.entries(ORG_BINDINGS)){bind(prop,()=>volatileDb.organization[key],v=>{volatileDb.organization[key]=Array.isArray(v)?v:[]})}
    for(const [prop,key] of Object.entries(FINANCE_BINDINGS)){
      const desc=Object.getOwnPropertyDescriptor(s,prop);
      if(desc&&desc.configurable===false)continue;
      Object.defineProperty(s,prop,{enumerable:true,configurable:true,get(){return volatileDb.finance[key]},set(v){if(Array.isArray(volatileDb.finance[key]))volatileDb.finance[key]=Array.isArray(v)?v:[];else volatileDb.finance[key]=(v&&typeof v==='object')?v:{}}});
    }
    return s;
  }
  function syncFromHaneState(s){
    if(!s||typeof s!=='object')return null;
    if(attachedState){const db=volatileDb;db.migration.lastHaneSyncAt=now();db.updatedAt=now();return read()}
    attachFinanceState(s);return read();
  }
  function finance(){return volatileDb?volatileDb.finance:blank().finance}
  function app(){const d=volatileDb||blank();return {profile:d.profile,settings:d.settings,appState:d.appState,organization:d.organization}}
  function summary(){const d=read();return {schema:d.schema,expenses:d.finance.expenses.length,incomes:d.finance.incomes.length,cards:d.finance.cards.length,flexAccounts:d.finance.flexAccounts.length,cardTransactions:d.finance.cardTransactions.length,cardPayments:d.finance.cardPayments.length,statements:d.finance.statementImports.length,categories:Object.keys(d.finance.categoryRegistry||{}).length,notes:d.organization.notes.length,lastHaneSyncAt:d.migration.lastHaneSyncAt||null}}
  window.HANE_CORE=Object.freeze({KEY,SCHEMA,blank,read,write,detectBackup,attachFinanceState,syncFromHaneState,finance,app,summary});
  write(blank());
})();
