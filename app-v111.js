// S16 KATEGORI YONETIMI + ISLEM TURU / S15 AUDIT FIX TABANI

// V17 native/PWA feel helpers — no business logic changes.
(function(){
  const root=document.documentElement;
  const standalone=window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone===true;
  if(standalone) root.classList.add('is-standalone');
  else root.classList.add('is-browser');

  document.addEventListener('touchstart',()=>{}, {passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'){
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
  });
  const setVh=()=>document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  setVh();
  window.addEventListener('resize',setVh,{passive:true});
})();

'use strict';
const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)];
const META='HANE_LOCKED_META_V1',DATA='HANE_LOCKED_DATA_V1',STORAGE_TXN='HANE_STORAGE_TXN_V1';
const enc=new TextEncoder(),dec=new TextDecoder();let state=null,key=null,current='home',modal=null,pin='',timer=null,setupPhoto='',themeDraft=null,reportPeriod='month',reportCustomStart='',reportCustomEnd='',txFilter='all',txView='list',financeTab='cards',navHistory=[],calendarMonth='',calendarDay='',calendarView='month',txSearch='',txDate='',txCategory='',txPay='',txMin='',txMax='',txMember='',cardStatementMonth='',financeCardIndex=0,reportView='summary',reportMonths=6,reportFlowMonths=6,reportCategoryMonths=1,statementImportCardId='',statementImportRows=[],statementImportMeta={},statementImportBusy=false,statementReadDiagnostics={},hanFilter='TÜMÜ',hanSeverity='TÜMÜ',zWorkFilter='all';
let browserNavReady=false;
let normalExpensesOpen=true,fixedExpensesOpen=true,returnScrollTop=null,expenseView='normal';
const Q=['Bugün küçük adımlar, yarın büyük rahatlık getirir.','Disiplin, özgürlüğün kapısını açar.','Küçük birikimler büyük huzur getirir.','Planlı para, güçlü yarınlar demektir.'];
const BASE_C=['Kira','Aidat','Market','Manav','Fırın','Harçlık','Kafe','Yemek','Restoran','Giyim','Online Alışveriş','Elektronik','Mobilya','Ev Bakım','Kırtasiye','Kitap','Kozmetik','Kişisel Bakım','Spor','Oyun','Abonelik','Akaryakıt','Otopark','Otoyol/Köprü','Araç Bakım','Ulaşım','Kuyumculuk','Kargo','Sağlık','Eğitim','Çocuk','Evcil Hayvan','Ev','Temizlik','Eğlence','Tatil','Konaklama','Uçak','Hediye','Bağış','Sigorta','Vergi & Faiz','Vergi','Banka Masrafı','Faiz','Faturalar','İnternet','Elektrik','Su','Doğalgaz','Cep Telefonu','Diğer'];
const BASE_NORMAL_C=['Market','Manav','Fırın','Harçlık','Kafe','Yemek','Restoran','Giyim','Online Alışveriş','Elektronik','Mobilya','Ev Bakım','Kırtasiye','Kitap','Kozmetik','Kişisel Bakım','Spor','Oyun','Abonelik','Akaryakıt','Otopark','Otoyol/Köprü','Araç Bakım','Ulaşım','Kuyumculuk','Kargo','Sağlık','Eğitim','Çocuk','Evcil Hayvan','Ev','Temizlik','Eğlence','Tatil','Konaklama','Uçak','Hediye','Bağış','Sigorta','Vergi & Faiz','Vergi','Banka Masrafı','Faiz','Diğer'];
const BASE_FIXED_C=['Konut','Kira','Aidat','Faturalar','İnternet','Elektrik','Su','Doğalgaz','Cep Telefonu','Abonelik','Sigorta','Vergi'];
let C=[...BASE_C];
let NORMAL_C=[...BASE_NORMAL_C];
let FIXED_C=[...BASE_FIXED_C];
const I={Kira:'🏠',Aidat:'🏢',Market:'🛒',Manav:'🍎',Fırın:'🥖',Harçlık:'💵',Kafe:'☕',Yemek:'🍽️',Restoran:'🍴',Giyim:'👕',Akaryakıt:'⛽',Faturalar:'🧾',İnternet:'📡',Elektrik:'⚡',Su:'💧',Doğalgaz:'🔥','Cep Telefonu':'📱',Ulaşım:'◆',Sağlık:'✚',Eğitim:'✎',Ev:'⌂',Temizlik:'✦',Çocuk:'★','Evcil Hayvan':'♣','Kişisel Bakım':'✧',Abonelik:'◎',Eğlence:'♪',Tatil:'☀',Hediye:'🎁',Sigorta:'◇',Vergi:'▤','Vergi & Faiz':'▤',Diğer:'●'};
const CAT_COLORS={Kira:'#d8ad4f',Aidat:'#a86ef7',Market:'#19d77d',Manav:'#7ed957',Fırın:'#e5a85b',Harçlık:'#d9b44a',Kafe:'#c58a52',Yemek:'#ff8b5c',Restoran:'#ff6f61',Giyim:'#c084fc','Online Alışveriş':'#8b5cf6',Elektronik:'#38bdf8',Mobilya:'#c4a484','Ev Bakım':'#f59e0b',Kırtasiye:'#60a5fa',Kitap:'#818cf8',Kozmetik:'#f472b6','Kişisel Bakım':'#ec4899',Spor:'#22c55e',Oyun:'#a78bfa',Abonelik:'#6366f1',Akaryakıt:'#f59e0b',Otopark:'#64748b','Otoyol/Köprü':'#94a3b8','Araç Bakım':'#f97316',Ulaşım:'#4dd6c7',Kuyumculuk:'#e0b341',Kargo:'#06b6d4',Sağlık:'#ff5f78',Eğitim:'#60a5fa',Çocuk:'#fb7185','Evcil Hayvan':'#34d399',Ev:'#d8ad4f',Temizlik:'#22d3ee',Eğlence:'#f06dad',Tatil:'#fbbf24',Konaklama:'#eab308',Uçak:'#0ea5e9',Hediye:'#e879f9',Bağış:'#14b8a6',Sigorta:'#38bdf8','Vergi & Faiz':'#f59e0b',Vergi:'#94a3b8','Banka Masrafı':'#a3a3a3',Faiz:'#ef4444',Faturalar:'#ff8c42','İnternet':'#6ed4ff',Elektrik:'#ffd84d',Su:'#3fa9ff','Doğalgaz':'#ff6b45','Cep Telefonu':'#b879ff',Diğer:'#9ca3af'};
function categoryIconSvg(cat,size=22){
  const P={
    'Kira':'<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v10h11V10"/><path d="M10 20v-6h4v6"/>',
    'Aidat':'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h2m2 0h2M9 11h2m2 0h2M9 15h2m2 0h2M10 21v-3h4v3"/>',
    'Market':'<path d="M3 5h2l2.2 10h10.7l2-7H6"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
    'Manav':'<path d="M12 8c-5-2-8 2-6.5 7.5C7 20 12 21 12 21s5-1 6.5-5.5C20 11 17 6 12 8Z"/><path d="M12 8c0-3 2-5 5-5M12 7c-2-2-4-2-6-1"/>',
    'Fırın':'<path d="M5 18c1-5 4-10 7-13 3 3 6 8 7 13-4 2-10 2-14 0Z"/><path d="M9 10l6 2M8 14l8 2"/>',
    'Harçlık':'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h1M17 15h1"/>',
    'Kafe':'<path d="M5 8h11v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z"/><path d="M16 10h2a3 3 0 0 1 0 6h-2M8 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2"/>',
    'Yemek':'<path d="M7 3v8m-3-8v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 2 4 6 0 9"/>',
    'Restoran':'<path d="M6 3v18M3 3v5a3 3 0 0 0 6 0V3M17 3v18M14 3c4 1 6 5 3 9"/>',
    'Giyim':'<path d="m8 5-4 3 3 4 2-1v10h6V11l2 1 3-4-4-3c-1 2-7 2-8 0Z"/>',
    'Akaryakıt':'<path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h15M8 7h5v4H8z"/><path d="M16 8h2l2 3v6a2 2 0 0 1-4 0v-2"/>',
    'Ulaşım':'<rect x="4" y="5" width="16" height="13" rx="3"/><path d="M7 18v2m10-2v2M7 9h10M8 14h.1M16 14h.1"/>',
    'Sağlık':'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    'Eğitim':'<path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5M21 9v7"/>',
    'Ev':'<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v10h11V10M9 15h6"/>',
    'Temizlik':'<path d="M7 20h10M9 20l1-9h4l1 9M10 8h4M12 3v5"/><path d="M5 6h2M17 6h2M6 3l1 1M18 3l-1 1"/>',
    'Eğlence':'<path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/>',
    'Faturalar':'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
    'İnternet':'<path d="M4 9a12 12 0 0 1 16 0M7 13a8 8 0 0 1 10 0M10 17a3 3 0 0 1 4 0"/><circle cx="12" cy="20" r="1"/>',
    'Elektrik':'<path d="m13 2-7 11h6l-1 9 7-12h-6z"/>',
    'Su':'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z"/><path d="M9 15c.5 1.5 1.5 2 3 2"/>',
    'Doğalgaz':'<path d="M13 2c1 5-4 6-2 10 1-2 3-3 4-5 3 3 4 6 3 9-1 4-5 6-8 5-4-1-6-5-4-9 1-3 3-5 5-7 0 3 1 4 2 5 1-2 1-5 0-8Z"/>',
    'Cep Telefonu':'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',
    'Diğer':'<circle cx="12" cy="12" r="9"/><circle cx="8" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="16" cy="12" r="1"/>'
  };
  const alias={'Online Alışveriş':'Market','Elektronik':'Cep Telefonu','Mobilya':'Ev','Ev Bakım':'Ev','Kırtasiye':'Eğitim','Kitap':'Eğitim','Kozmetik':'Sağlık','Kişisel Bakım':'Sağlık','Spor':'Sağlık','Oyun':'Eğlence','Abonelik':'Faturalar','Otopark':'Ulaşım','Otoyol/Köprü':'Ulaşım','Araç Bakım':'Akaryakıt','Kuyumculuk':'Hediye','Kargo':'Ulaşım','Çocuk':'Harçlık','Evcil Hayvan':'Sağlık','Tatil':'Eğlence','Konaklama':'Ev','Uçak':'Ulaşım','Hediye':'Harçlık','Bağış':'Harçlık','Sigorta':'Faturalar','Vergi & Faiz':'Faturalar','Vergi':'Faturalar','Banka Masrafı':'Faturalar','Faiz':'Faturalar'};
  const iconKey=state?.categoryMeta?.[cat]?.iconKey||cat;
  const path=P[iconKey]||P[alias[iconKey]]||P[cat]||P[alias[cat]]||P['Diğer'];
  return `<svg class="catSvg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">${path}</svg>`;
}
function catIcon(cat){return categoryIconSvg(cat,22)}
function catColor(cat){return state?.categoryMeta?.[cat]?.color||CAT_COLORS[cat]||'#d8ad4f'}
function catPremiumIcon(cat){return `<span class="catGem" style="--cat:${catColor(cat)}">${categoryIconSvg(cat,22)}</span>`}
function paymentLabel(x){if(x.source==='card'){const c=state.cards.find(c=>c.id===x.cardId);return c?`KART · ${esc(c.bank)} ${esc(c.name)}`:'KART'}return 'NAKİT'}
const id=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2),iso=(d=new Date())=>{const x=d instanceof Date?d:new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')},ym=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
const moneyCents=n=>Math.round((Number(n)||0)*100),moneyFromCents=c=>(Number(c)||0)/100,money2=n=>moneyFromCents(moneyCents(n)),parseMoneyInput=v=>{const n=Number(String(v??'0').trim().replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?money2(n):NaN};
const money=n=>state?.settings?.privacy?'••••••':new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',minimumFractionDigits:2,maximumFractionDigits:2}).format(money2(n)),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const upper=v=>String(v??'').toLocaleUpperCase('tr-TR');
// S6 — Merkezi arayüz altyapısı. Görünümü değiştirmeden buton, ikon ve logo tanımları tek merkezden yönetilir.
const HANE_UI=Object.freeze({
  build:'20260928-HANE-WORK-V109-CLEAN',
  brand:Object.freeze({name:'HANE',logo:'icons/hane-app-icon.png',logoVersion:'hane-blue-frame-v53'}),
  buttons:Object.freeze({base:'btn',primary:'btn gold',icon:'ib premiumTopIcon'}),
  nav:Object.freeze([
    Object.freeze({tab:'home',icon:'home',label:'ANA SAYFA'}),
    Object.freeze({tab:'workCenter',icon:'calendar',label:'ÇALIŞMA'}),
    Object.freeze({tab:'fixed',icon:'fixed',label:'GİDERLER'}),
    Object.freeze({tab:'cards',icon:'cards',label:'FİNANS'}),
    Object.freeze({tab:'calendar',icon:'fixed',label:'TAKVİM'}),
    Object.freeze({tab:'reports',icon:'report',label:'RAPORLAR'})
  ])
});
function uiButtonClass(kind='base',extra=''){return `${HANE_UI.buttons[kind]||HANE_UI.buttons.base}${extra?' '+extra:''}`}
function haneLogo(size=54,cls=''){
  const n=Math.max(28,Number(size)||54);
  return `<img class="haneLogoImg ${cls}" src="${HANE_UI.brand.logo}?v=${HANE_UI.brand.logoVersion}" width="${n}" alt="HANE">`;
}
function haneFullLogo(cls=''){
  return `<img class="haneFullLogo ${cls}" src="${HANE_UI.brand.logo}?v=${HANE_UI.brand.logoVersion}" alt="HANE">`;
}
function premiumIcon(name,size=26){
  const p={
home:`<path d="M4 11.5 12 4l8 7.5"/><path d="M6.5 10v10h11V10"/><path d="M10 20v-6h4v6"/>`,
transactions:`<path d="M6 5h12M6 10h12M6 15h8M6 20h10"/><circle cx="3" cy="5" r="1"/><circle cx="3" cy="10" r="1"/><circle cx="3" cy="15" r="1"/><circle cx="3" cy="20" r="1"/>`,
fixed:`<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h6"/>`,
cards:`<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 9h18M7 15h5"/>`,
profile:`<circle cx="12" cy="8" r="4"/><path d="M4.5 21c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/>`,
settings:`<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5 7 7M17 17l1.5 1.5M18.5 5.5 17 7M7 17l-1.5 1.5"/><path d="M8.3 4.3 9 2.5h6l.7 1.8 1.7.7 1.8-.8 2.6 2.6-.8 1.8.7 1.7 1.8.7v3.7l-1.8.7-.7 1.7.8 1.8-2.6 2.6-1.8-.8-1.7.7-.7 1.8H9l-.7-1.8-1.7-.7-1.8.8-2.6-2.6.8-1.8-.7-1.7-1.8-.7V11l1.8-.7L3 8.6l-.8-1.8 2.6-2.6 1.8.8z"/>`,
income:`<path d="M12 20V5m-5 5 5-5 5 5M5 20h14"/>`,
expense:`<path d="M12 4v15m-5-5 5 5 5-5M5 4h14"/>`,
report:`<path d="M5 20V10M10 20V5M15 20v-8M20 20V8M3 20h19"/>`,
pluscard:`<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M12 13v5M9.5 15.5h5"/>`,
bell:`<path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5zM10 20h4"/>`,
lock:`<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15" r="1"/>`,
palette:`<path d="M12 3a9 9 0 0 0 0 18h2a2 2 0 0 0 0-4h-1a1.5 1.5 0 0 1 0-3h2a6 6 0 0 0-3-11Z"/><circle cx="7.5" cy="9" r="1"/><circle cx="10" cy="6.5" r="1"/><circle cx="15" cy="7.5" r="1"/>`,
backup:`<path d="M6 16a4 4 0 0 1 .5-8A6 6 0 0 1 18 9a3.5 3.5 0 0 1 0 7M12 11v9m-3.5-5 3.5-4 3.5 4"/>`,
info:`<circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><circle cx="12" cy="7" r=".8"/>`,
trash:`<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/>`,
globe:`<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>`,
note:`<path d="M5 3h14v18H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>`
  };
  return `<svg class="premiumSvg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true">${p[name]||p.home}</svg>`;
}
function financeCategoryId(name){
  const raw=String(name||'Diğer').trim()||'Diğer';
  const slug=raw.toLocaleUpperCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9ÇĞİÖŞÜ]+/g,'_').replace(/^_+|_+$/g,'').toLowerCase();
  return 'cat_'+(slug||'diger');
}
function normalizeFinanceCategoryIds(st){
  const rows=[...(st.expenses||[]),...(st.cardTransactions||[]),...(st.installments||[])];
  rows.forEach(x=>{if(!x)return;const name=String(x.category||'Diğer').trim()||'Diğer';x.category=name;x.categoryId=financeCategoryId(name)});
  (st.incomes||[]).forEach(x=>{if(x&&x.category)x.categoryId=financeCategoryId(x.category)});
  st.categoryRegistry=st.categoryRegistry&&typeof st.categoryRegistry==='object'?st.categoryRegistry:{};
  const names=[...BASE_C,...(st.customCategories||[]),...rows.map(x=>x&&x.category).filter(Boolean)];
  names.forEach(name=>{const cid=financeCategoryId(name);st.categoryRegistry[cid]={id:cid,name,meta:{...(st.categoryMeta?.[name]||{})}}});
  return st;
}
function normalizeV19(st){
  st.cardPayments=Array.isArray(st.cardPayments)?st.cardPayments:[];
  st.fixedPayments=Array.isArray(st.fixedPayments)?st.fixedPayments:[];
  st.flexTransactions=Array.isArray(st.flexTransactions)?st.flexTransactions:[];
  st.installments=Array.isArray(st.installments)?st.installments:[];
  st.cardTransactions=Array.isArray(st.cardTransactions)?st.cardTransactions:[];
  st.statementImports=Array.isArray(st.statementImports)?st.statementImports:[];
  st.statementCategoryRules=st.statementCategoryRules&&typeof st.statementCategoryRules==='object'?st.statementCategoryRules:{};
  st.expenses=Array.isArray(st.expenses)?st.expenses:[];
  st.work=Array.isArray(st.work)?st.work:[];st.receivables=Array.isArray(st.receivables)?st.receivables:[];st.workPayments=Array.isArray(st.workPayments)?st.workPayments:[];st.workRoads=Array.isArray(st.workRoads)?st.workRoads:[];st.workDeductions=Array.isArray(st.workDeductions)?st.workDeductions:[];
  // FIX19: Eski çalışma ödemelerini tek seferde çalışma ayına sabitle. Önce workId tarihi, yoksa ödeme tarihi kullanılır.
  const workDateById=new Map(st.work.map(w=>[w.id,String(w.date||'')]));
  st.workPayments.forEach(p=>{if(!p.workMonth){const ds=(p.workId&&workDateById.get(p.workId))||p.date||'';const wm=String(ds).slice(0,7);if(/^\d{4}-\d{2}$/.test(wm))p.workMonth=wm}});
  // S2: Kalıcı finansal bağlantı kimliği. Eski kayıtlar veri kaybı olmadan yerinde yükseltilir.
  const ensureFinanceLink=x=>{if(x&&(!x.financeLinkId||!String(x.financeLinkId).trim()))x.financeLinkId='fin_'+id();return x?.financeLinkId||''};
  st.expenses.forEach(ensureFinanceLink);st.cardPayments.forEach(ensureFinanceLink);st.cardTransactions.forEach(ensureFinanceLink);
  st.incomes=Array.isArray(st.incomes)?st.incomes:[];
  st.cashGiven=Array.isArray(st.cashGiven)?st.cashGiven:[];
  st.cashManual=Array.isArray(st.cashManual)?st.cashManual:[];
  st.cashExcluded=Array.isArray(st.cashExcluded)?st.cashExcluded:[];
  st.cards=Array.isArray(st.cards)?st.cards:[];
  // S1: Kart ortak-limit alanları geriye uyumlu biçimde normalize edilir.
  st.cards.forEach(c=>{if(c.sharedLimitGroup==null)c.sharedLimitGroup='';if(c.sharedLimit==null)c.sharedLimit=0});
  st.accounts=Array.isArray(st.accounts)?st.accounts:[];st.flexAccounts=Array.isArray(st.flexAccounts)?st.flexAccounts:[];st.categoryMeta=st.categoryMeta||{};st.customCategories=Array.isArray(st.customCategories)?st.customCategories:[];
  // V10: Toplu Taşıma ayrı kategori değil; tüm yol/toplu taşıma giderleri Ulaşım altında birleşir.
  if(!st.settings)st.settings={};
  // V98: Sabit gelir kaldırıldı. Eski şablonlar arşivlenir ve yalnız kendi gerçek tarihindeki tek gelir kaydı olarak korunur.
  if(!st.settings.legacyRecurringIncomeRetiredV98){
    const recurringIncome=(st.incomes||[]).filter(x=>x&&x.recurring);
    if(recurringIncome.length)st.settings.legacyRecurringIncomeArchiveV98=recurringIncome.map(x=>({...x}));
    (st.incomes||[]).forEach(x=>{if(x&&x.recurring)x.recurring=false});
    st.settings.legacyRecurringIncomeRetiredV98=true;
  }
  if(!st.settings.transportMergedToUlasim20260919){
    const mergeCat=x=>{if(x&&x.category==='Toplu Taşıma')x.category='Ulaşım'};
    (st.expenses||[]).forEach(mergeCat);(st.cardTransactions||[]).forEach(mergeCat);(st.installments||[]).forEach(mergeCat);
    Object.keys(st.statementCategoryRules||{}).forEach(k=>{if(st.statementCategoryRules[k]==='Toplu Taşıma')st.statementCategoryRules[k]='Ulaşım'});
    st.customCategories=(st.customCategories||[]).filter(c=>c!=='Toplu Taşıma');
    if(st.categoryMeta['Toplu Taşıma'])delete st.categoryMeta['Toplu Taşıma'];
    st.settings.transportMergedToUlasim20260919=true;
  }
  const persistedNormal=[...(st.expenses||[]).map(x=>x.category),...(st.cardTransactions||[]).map(x=>x.category),...(st.installments||[]).map(x=>x.category),...(st.workRoads||[]).map(x=>x.category)].filter(Boolean);
  C=[...new Set([...BASE_C,...st.customCategories,...persistedNormal])];NORMAL_C=[...new Set([...BASE_NORMAL_C,...st.customCategories,...persistedNormal])];FIXED_C=[];
  normalizeFinanceCategoryIds(st);
  st.profile=st.profile||{name:'',photo:'',motto:''};st.profile.username=st.profile.username||'';st.profile.city=st.profile.city||'';st.profile.job=st.profile.job||'';st.profile.birthDate=st.profile.birthDate||'';st.profile.memberSince=st.profile.memberSince||'';
  st.notes=Array.isArray(st.notes)?st.notes:[];
  st.settings=st.settings||{};if(typeof st.settings.darkMode!=='boolean')st.settings.darkMode=true;
  if(!/^\d{4}-\d{2}$/.test(String(st.selectedMonth||'')))st.selectedMonth=ym(new Date());
  if(!st.settings.monthCoreGroup2Migrated)st.settings.monthCoreGroup2Migrated=true;
  if(typeof st.settings.privacy!=='boolean')st.settings.privacy=false;st.members=Array.isArray(st.members)?st.members:[];if(!st.members.length)st.members=[{id:'me',name:(st.profile?.name||'BEN'),icon:'👤',role:'admin',color:'#ff3344'}];if(!st.members.some(m=>m.id==='me'))st.members.unshift({id:'me',name:(st.profile?.name||'BEN'),icon:'👤',role:'admin',color:'#ff3344'});st.settings.activeMemberId=st.settings.activeMemberId||'me';st.homeLayout=Array.isArray(st.homeLayout)?st.homeLayout:['summary','quick','monthly','recent'];st.homeHidden=Array.isArray(st.homeHidden)?st.homeHidden:[];
  st.expenses.forEach((x,i)=>{if(typeof x.sortOrder!=='number')x.sortOrder=i;if(!Array.isArray(x.paidMonths))x.paidMonths=[];if(!x.source)x.source='cash'});
  // V64: Sabit gider sistemi emekli edildi. Geçmiş gerçek ödemeler normal Gider kaydına dönüştürülür; şablonlar yalnız şifreli arşivde korunur.
  if(!st.settings.legacyFixedToExpenseV64){
    const recurring=(st.expenses||[]).filter(x=>x.recurring),payments=[...(st.fixedPayments||[])];
    if(recurring.length||payments.length){
      st.settings.legacyFixedArchiveV64={templates:recurring.map(x=>({...x})),payments:payments.map(x=>({...x}))};
      const existingIds=new Set((st.expenses||[]).map(x=>String(x.id)));
      payments.forEach(fp=>{
        const ex=recurring.find(x=>String(x.id)===String(fp.expenseId));
        let nid='legacy_fixed_'+String(fp.id||id()); while(existingIds.has(nid))nid='legacy_fixed_'+id(); existingIds.add(nid);
        st.expenses.push({id:nid,financeLinkId:fp.financeLinkId||('fin_'+id()),title:fp.title||ex?.title||'GİDER',category:fp.category||ex?.category||'Diğer',amount:+(fp.actualAmount??fp.amount??ex?.amount??0)||0,actualAmount:+(fp.actualAmount??fp.amount??ex?.amount??0)||0,date:fp.date||ex?.date||iso(),source:fp.source||ex?.source||'cash',cardId:(fp.source||ex?.source)==='card'?(fp.cardId||ex?.cardId||null):null,recurring:false,legacyFixedMigrated:true,legacyFixedPaymentId:fp.id||'',legacyFixedTemplateId:fp.expenseId||ex?.id||'',note:'Eski sabit gider sisteminden V64 ile normal Gider kaydına dönüştürüldü.'});
      });
      st.expenses=st.expenses.filter(x=>!x.recurring);
      st.fixedPayments=[];
    }
    st.settings.legacyFixedToExpenseV64=true;
  }
  // V109: Sabit Gider için ikinci paralel migrasyon kaldırıldı; tek kaynak yukarıdaki V64 tek-seferlik migrasyondur.
  // V109: aktif finans modelinde sabit gider/gelir yok; legacy veriler yalnız yukarıdaki tek-seferlik migrasyonda okunur.
  st.expenses=(st.expenses||[]).map(x=>({...x,recurring:false}));
  st.incomes=(st.incomes||[]).map(x=>({...x,recurring:false}));
  st.fixedPayments=[];
  // FIX12: Çalışma modülü finans sisteminden tamamen bağımsızdır. Eski çalışma gelir/yol kayıtlarını kendi depolarına taşı.
  const oldWorkIncome=st.incomes.filter(x=>x.source==='work'||x.workId);oldWorkIncome.forEach(x=>{if(!st.workPayments.some(p=>p.id===x.id))st.workPayments.push({...x,source:'work'})});st.incomes=st.incomes.filter(x=>!(x.source==='work'||x.workId));
  const oldWorkRoad=st.expenses.filter(x=>x.workId);oldWorkRoad.forEach(x=>{if(!st.workRoads.some(r=>r.id===x.id))st.workRoads.push({...x})});st.expenses=st.expenses.filter(x=>!x.workId);
  // Kategori kaynağı yalnızca kaydın kendi category alanıdır; başlık/ikon üzerinden sürekli kategori tahmini yapılmaz.
  st.expenses.forEach(x=>{if(!x.category||!String(x.category).trim())x.category='Diğer'});
  // V101 tek-seferlik onarım: V96-V101 döneminde Kira/Aidat seçildiği halde Market yazılmış açık kayıtları düzelt.
  if(!st.settings.v101CategoryRepair){let repaired=0;for(const x of (st.expenses||[])){if(String(x.category||'')!=='Market')continue;const t=String(x.title||'').toLocaleUpperCase('tr-TR').trim();if(/^K[İI]RA(?:\b|\s|$)/.test(t)){x.category='Kira';repaired++}else if(/^A[İI]DAT(?:\b|\s|$)/.test(t)){x.category='Aidat';repaired++}}st.settings.v101CategoryRepair={at:new Date().toISOString(),repaired}}
  if(!st.settings.financeCoreGroup1Migrated){
    // Eski kart hareketlerinden ana gider kaydı olmayanları veri kaybetmeden gider kaydına taşı.
    (st.cardTransactions||[]).forEach(t=>{if((st.expenses||[]).some(e=>e.cardTxId===t.id))return;st.expenses.push({id:id(),cardTxId:t.id,source:'card',cardId:t.cardId,title:t.title||'KART HARCAMASI',amount:+t.amount||0,actualAmount:+t.amount||0,category:t.category||'Diğer',date:t.date||iso(),dueDate:t.date||iso(),recurring:false,paid:true,attachment:t.attachment||'',installmentGroup:t.installmentGroup,installmentNo:t.installmentNo,installmentCount:t.installmentCount})});
    // Legacy sabit-gider kayıtları yukarıdaki tek-seferlik migrasyonda normal Gider'e dönüştürülür; aktif finans motorunda kullanılmaz.
    // Mevcut görünen kart borcunu aynen koruyacak açılış bakiyesini hesapla.
    st.cards.forEach(c=>{const normal=st.expenses.filter(x=>x.source==='card'&&x.cardId===c.id).reduce((a,x)=>a+(+(x.actualAmount??x.amount)||0),0),roads=(st.workRoads||[]).filter(x=>x.source==='card'&&x.cardId===c.id).reduce((a,x)=>a+(+(x.actualAmount??x.amount)||0),0),paid=st.cardPayments.filter(p=>p.cardId===c.id).reduce((a,p)=>a+(+p.amount||0),0);c.openingBalance=(+c.balance||0)-normal-roads+paid});
    st.settings.financeCoreGroup1Migrated=true;
  }
  return st;
}
function usedCategorySet(){
  const used=new Set();
  const add=v=>{if(v&&String(v).trim())used.add(String(v).trim())};
  (state?.expenses||[]).forEach(x=>add(x.category));
  (state?.cardTransactions||[]).forEach(x=>add(x.category));
  (state?.installments||[]).forEach(x=>add(x.category));
  (state?.workRoads||[]).forEach(x=>add(x.category));
  return used
}
function visibleCategoryList(){
  // V101 CENTRAL CORE: Kategori yönetimi kullanım durumundan bağımsız tek kayıt defteridir.
  // Böylece Kira/Aidat dahil bütün kategoriler her zaman düzenlenebilir.
  return [...new Set([...(C||[]),...(state?.customCategories||[])])].filter(Boolean)
}
function actualExpenseEntriesForMonth(m=state?.selectedMonth){
  const normal=(state?.expenses||[]).filter(x=>String(x.date||'').startsWith(m)).map(x=>({...x,recurring:false,amount:+(x.actualAmount??x.amount??0)||0,_actual:true}));
  const roads=(state?.workRoads||[]).filter(x=>String(x.date||'').startsWith(m)).map(x=>({...x,recurring:false,amount:+(x.actualAmount??x.amount??0)||0,_actual:true,_workRoad:true}));
  return [...normal,...roads]
}
function actualExpenseEntriesInRange(start,end){
  const normal=(state?.expenses||[]).filter(x=>String(x.date||'')>=start&&String(x.date||'')<=end).map(x=>({...x,recurring:false,amount:+(x.actualAmount??x.amount??0)||0,_actual:true}));
  const roads=(state?.workRoads||[]).filter(x=>String(x.date||'')>=start&&String(x.date||'')<=end).map(x=>({...x,recurring:false,amount:+(x.actualAmount??x.amount??0)||0,_actual:true,_workRoad:true}));
  return [...normal,...roads]
}
function isCardRefund(x){return !!x?.importedRefund||(+((x?.actualAmount??x?.amount)??0)<0)}
function cardDerivedNet(cardId){
  const c=(state?.cards||[]).find(x=>x.id===cardId),anchor=String(c?.balanceAnchorDate||'');
  const after=d=>!anchor||String(d||'')>anchor;
  const normal=(state?.expenses||[]).filter(x=>x.source==='card'&&x.cardId===cardId&&after(x.date)).reduce((a,x)=>a+(+(x.actualAmount??x.amount)||0),0);
  const roads=(state?.workRoads||[]).filter(x=>x.source==='card'&&x.cardId===cardId&&after(x.date)).reduce((a,x)=>a+(+(x.actualAmount??x.amount)||0),0);
  const paid=(state?.cardPayments||[]).filter(p=>p.cardId===cardId&&after(p.date)).reduce((a,p)=>a+(+p.amount||0),0);
  return normal+roads-paid
}
function syncDerivedCardTransactions(){
  const out=[];
  (state?.expenses||[]).filter(x=>x.source==='card'&&x.cardId).forEach(x=>{if(!x.cardTxId)x.cardTxId=id();const c=state.cards.find(c=>c.id===x.cardId);out.push({id:x.cardTxId,financeLinkId:x.financeLinkId||(x.financeLinkId='fin_'+id()),expenseId:x.id,cardId:x.cardId,amount:+(x.actualAmount??x.amount)||0,totalAmount:x.totalAmount,title:x.title,baseTitle:x.baseTitle,category:x.category,date:x.date,purchaseDate:x.purchaseDate||x.date,statementMonth:c?statementMonthFor(c,x.date):String(x.date||'').slice(0,7),attachment:x.attachment||'',installmentGroup:x.installmentGroup,installmentNo:x.installmentNo,installmentCount:x.installmentCount,importedRefund:isCardRefund(x),derived:true})});
  (state?.workRoads||[]).filter(x=>x.source==='card'&&x.cardId).forEach(x=>{if(!x.cardTxId)x.cardTxId=id();const c=state.cards.find(c=>c.id===x.cardId);out.push({id:x.cardTxId,financeLinkId:x.financeLinkId||(x.financeLinkId='fin_'+id()),workRoadId:x.id,cardId:x.cardId,amount:+(x.actualAmount??x.amount)||0,title:x.title||'YOL ÜCRETİ',category:x.category||'Ulaşım',date:x.date||iso(),statementMonth:c?statementMonthFor(c,x.date||iso()):String(x.date||'').slice(0,7),derived:true})});
  state.cardTransactions=out
}
function recalculateFinanceCore(){
  if(!state)return;
  syncDerivedCardTransactions();
  (state.cards||[]).forEach(c=>{if(!Number.isFinite(+c.openingBalance))c.openingBalance=+c.balance||0;const anchored=!!c.balanceAnchorDate&&Number.isFinite(+c.balanceAnchorAmount),base=anchored?(+c.balanceAnchorAmount||0):(+c.openingBalance||0);c.balance=base+cardDerivedNet(c.id)})
}

function hanStableHash(v){let h=2166136261>>>0;for(const ch of String(v??'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}return h.toString(36)}
function hanIssueFingerprint(action,id,id2=''){
 const pick=x=>x?{id:x.id,date:x.date,title:x.title,category:x.category,amount:x.actualAmount??x.amount,source:x.source,cardId:x.cardId,bank:x.bank,name:x.name,last4:x.last4,limit:x.limit,balance:x.balance,sharedLimitGroup:x.sharedLimitGroup,sharedLimit:x.sharedLimit,statementType:x.statementType,transactionType:x.transactionType,paidMonths:x.paidMonths,memberId:x.memberId,type:x.type,dayStatus:x.dayStatus,leaveType:x.leaveType,hours:x.hours,rate:x.rate,overtimeHours:x.overtimeHours,workMonth:x.workMonth,dailyWage:x.dailyWage,startDate:x.startDate,leavePolicy:x.leavePolicy,color:x.color}:null;
 let data=[];
 if(action==='editExpense')data=[pick((state.expenses||[]).find(x=>String(x.id)===String(id))),pick((state.expenses||[]).find(x=>String(x.id)===String(id2)))];
 else if(action==='editIncome')data=[pick((state.incomes||[]).find(x=>String(x.id)===String(id))),pick((state.incomes||[]).find(x=>String(x.id)===String(id2)))];
 else if(action==='editCardPayment')data=[pick((state.cardPayments||[]).find(x=>String(x.id)===String(id))),pick((state.cardPayments||[]).find(x=>String(x.id)===String(id2)))];
 else if(action==='zWorkEdit')data=[pick((state.work||[]).find(x=>String(x.id)===String(id))),pick((state.work||[]).find(x=>String(x.id)===String(id2)))];
 else if(action==='zWorkPaymentEdit')data=[pick((state.workPayments||[]).find(x=>String(x.id)===String(id))),pick((state.workPayments||[]).find(x=>String(x.id)===String(id2)))];
 else if(action==='zWorkRoadDayEdit')data=[pick((state.workRoads||[]).find(x=>String(x.id)===String(id))),pick((state.workRoads||[]).find(x=>String(x.id)===String(id2)))];
 else if(action==='editMember')data=[pick((state.members||[]).find(x=>String(x.id)===String(id)))];
 else if(action==='editCard')data=[pick((state.cards||[]).find(x=>String(x.id)===String(id)))];
 else if(action==='roadFeeGroup')data=roadFeeItemsForDate(id).map(pick);
 else if(action==='categoryDayGroup')data=(state.expenses||[]).filter(x=>!x.recurring&&String(x.date||'')===String(id)&&String(x.category||'Diğer')===String(id2)).map(pick);
 else if(action==='sharedLimitGroup')data=(state.cards||[]).filter(x=>String(x.sharedLimitGroup||'').trim()===String(id)).map(pick);
 else if(action==='hanStatementReview')data=[...(state.statementImports||[]).filter(x=>String(x.cardId)===String(id)&&String(x.month)===String(id2)),...(state.expenses||[]).filter(x=>String(x.cardId)===String(id)&&String(x.statementImportMonth)===String(id2)&&x.statementMatched).map(pick)];
 else if(action==='hanMigrationReview')data=[window.HANE_CORE?.migrationFinding?.(id)||null];
 else data=[String(action||''),String(id||''),String(id2||'')];
 return hanStableHash(JSON.stringify(data));
}
function hanAudit(){
 const issues=[],seen=new Map(),all=[];
 const add=(level,group,title,detail,recordAction='',recordId='',recordId2='')=>issues.push({level,group,title,detail,recordAction,recordId,recordId2});
 const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(String(v||''))&&!Number.isNaN(new Date(String(v)+'T00:00:00').getTime());
 const amt=x=>+(x?.actualAmount??x?.amount);
 const collect=(name,arr)=>{(arr||[]).forEach(x=>{if(!x||!x.id)return add('bad','VERİ',name+' KAYDI KİMLİKSİZ','Bir kayıtta kalıcı kimlik yok.');const key=String(x.id);if(seen.has(key))add('bad','VERİ','MÜKERRER KAYIT KİMLİĞİ',key+' · '+seen.get(key)+' / '+name);else seen.set(key,name);all.push(x)})};
 collect('GİDER',state.expenses);collect('GELİR',state.incomes);collect('KART ÖDEMESİ',state.cardPayments);collect('KART',state.cards);collect('EKSTRE',state.statementImports);
 // VERİ: geçersiz tarih/tutar ve bağlantı kimlikleri.
 (state.expenses||[]).forEach(x=>{if(x.date&&!validDate(x.date))add('bad','VERİ','GEÇERSİZ GİDER TARİHİ',`${x.title||'Gider'} · ${x.date}`,'editExpense',x.id);if(!x.recurring&&(!Number.isFinite(amt(x))||amt(x)<0))add('bad','VERİ','GEÇERSİZ GİDER TUTARI',`${x.title||'Gider'} · ${String(x.actualAmount??x.amount)}`,'editExpense',x.id)});
 (state.incomes||[]).forEach(x=>{if(x.date&&!validDate(x.date))add('bad','VERİ','GEÇERSİZ GELİR TARİHİ',`${x.title||'Gelir'} · ${x.date}`);if(!Number.isFinite(+(x.actualAmount??x.amount)))add('bad','VERİ','GEÇERSİZ GELİR TUTARI',x.title||'Gelir')});
 // HAN 2.0: gelişmiş mükerrer / benzer işlem / veri kalitesi / anomali taraması.
 const normText=v=>String(v||'').toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ0-9]+/g,' ').trim();
 const dayDiff=(a,b)=>Math.abs((new Date(String(a)+'T00:00:00')-new Date(String(b)+'T00:00:00'))/86400000);
 const sameSource=(a,b)=>String(a.source||'')===String(b.source||'')&&(a.source!=='card'||String(a.cardId||'')===String(b.cardId||''));
 const expenses=(state.expenses||[]).filter(x=>!x.recurring&&validDate(x.date)&&Number.isFinite(amt(x))&&amt(x)>=0);
 const pairSeen=new Set();
 for(let i=0;i<expenses.length;i++)for(let j=i+1;j<expenses.length;j++){
   const a=expenses[i],b=expenses[j],dd=dayDiff(a.date,b.date); if(dd>2)continue;
   const aa=Math.abs(amt(a)),bb=Math.abs(amt(b)),diff=Math.abs(aa-bb),sameDay=dd===0,sourceOk=sameSource(a,b),catOk=normText(a.category)===normText(b.category),ta=normText(a.title),tb=normText(b.title),titleOk=ta&&tb&&(ta===tb||ta.includes(tb)||tb.includes(ta));
   const exact=diff<=.01, near=diff<=Math.max(1,Math.min(10,Math.max(aa,bb)*.005));
   if(!(sourceOk&&(exact||(sameDay&&catOk&&near))))continue;
   const k=[a.id,b.id].sort().join('|');if(pairSeen.has(k))continue;pairSeen.add(k);
   const why=[sameDay?'aynı gün':`${dd} gün fark`,a.source==='card'?'aynı kart':'aynı ödeme kaynağı',catOk?'aynı kategori':null,exact?'aynı tutar':`tutar farkı ${money(diff)}`,titleOk?'açıklama benzer':null].filter(Boolean).join(' · ');
   add(exact&&sameDay&&titleOk?'bad':'warn','FİNANS',exact?'OLASI MÜKERRER HARCAMA':'YAKIN TUTARLI ŞÜPHELİ HARCAMA',`${a.title||'Gider'} (${money(aa)}) ↔ ${b.title||'Gider'} (${money(bb)}) · ${why}`,'editExpense',a.id,b.id);
 }
 // Boş/eksik alanlar ve gelecek tarihleri kullanıcıya görünür kıl.
 const today=iso();
 (state.expenses||[]).filter(x=>!x.recurring).forEach(x=>{if(!String(x.title||'').trim())add('warn','VERİ','GİDER AÇIKLAMASI EKSİK',`${x.date||'—'} · ${money(amt(x)||0)}`,'editExpense',x.id);if(!String(x.category||'').trim())add('warn','VERİ','GİDER KATEGORİSİ EKSİK',`${x.title||'Gider'} · ${x.date||'—'}`,'editExpense',x.id);if(validDate(x.date)&&x.date>today&&!x.installmentGroup&&!x.installmentCount)add('warn','VERİ','GELECEK TARİHLİ GİDER',`${x.title||'Gider'} · ${x.date}`,'editExpense',x.id)});
 // Harcama düzenine göre yalnızca inceleme amaçlı tutar anomalisi: kategori içinde yeterli geçmiş varsa.
 const byCat={};expenses.forEach(x=>(byCat[normText(x.category)||'DİĞER']??=[]).push(x));
 Object.values(byCat).forEach(rows=>{if(rows.length<6)return;const vals=rows.map(x=>Math.abs(amt(x))).filter(v=>v>0).sort((a,b)=>a-b);if(vals.length<6)return;const med=vals[Math.floor(vals.length/2)];if(!(med>0))return;rows.forEach(x=>{const v=Math.abs(amt(x));if(v>=med*5&&v-med>=1000)add('warn','FİNANS','OLAĞANDIŞI YÜKSEK HARCAMA',`${x.title||'Gider'} · ${money(v)} · kategori medyanı yaklaşık ${money(med)}. Bu bir hata hükmü değildir; kontrol önerisidir.`,'editExpense',x.id)})});
 // HAN 4.0: Sabit gider denetimi kaldırıldı. HANE'de tüm ödemeler Gider olarak izlenir; fatura türleri Faturalar altında sınıflanır.
 // KARTLAR: kart bağlantıları, borç/limit ve ortak limit kontrolü.
 (state.expenses||[]).filter(x=>!x.recurring&&x.source==='card').forEach(x=>{if(!x.cardId||!(state.cards||[]).some(c=>c.id===x.cardId))add('bad','KARTLAR','KART BAĞLANTISI EKSİK',(x.title||'Harcama')+' · kart bulunamadı.','editExpense',x.id);if(!x.financeLinkId)add('warn','VERİ','FİNANSAL KİMLİK EKSİK',(x.title||'Harcama')+' finansal bağlantı kimliği taşımıyor.','editExpense',x.id)});
 (state.cardPayments||[]).forEach(p=>{if(!p.cardId||!(state.cards||[]).some(c=>c.id===p.cardId))add('bad','KARTLAR','KART ÖDEMESİ BAĞLANTISIZ',`${p.date||''} · ${money(+p.amount||0)}`,'editCardPayment',p.id)});
 (state.cards||[]).forEach(c=>{const expected=(Number.isFinite(+c.balanceAnchorAmount)&&c.balanceAnchorDate?+c.balanceAnchorAmount:+c.openingBalance||0)+cardDerivedNet(c.id);if(Math.abs((+c.balance||0)-expected)>.01)add('warn','KARTLAR','KART BORCU TUTARSIZ',`${c.bank||''} ${c.name||''} · hesaplanan ${money(expected)}, kayıtlı ${money(+c.balance||0)}`,'editCard',c.id);if((+c.balance||0)>.01&&(!Number.isFinite(+c.limit)||+c.limit<=0))add('warn','KARTLAR','KART LİMİTİ EKSİK',`${c.bank||''} ${c.name||''} · borç ${money(+c.balance||0)} ancak kart limiti girilmemiş.`,'editCard',c.id);else if(Number.isFinite(+c.limit)&&+c.limit>0&&(+c.balance||0)>(+c.limit)+.01)add('warn','KARTLAR','KART LİMİTİ AŞIMI',`${c.bank||''} ${c.name||''} · borç ${money(+c.balance||0)}, limit ${money(+c.limit||0)}`,'editCard',c.id)});
 const sharedGroups=new Map();(state.cards||[]).forEach(c=>{const g=String(c.sharedLimitGroup||'').trim();if(!g)return;if(!sharedGroups.has(g))sharedGroups.set(g,[]);sharedGroups.get(g).push(c)});
 sharedGroups.forEach((members,group)=>{const limits=members.map(c=>Math.max(0,+c.sharedLimit||0)),positive=limits.filter(v=>v>0),limit=positive.length?Math.max(...positive):0,used=members.reduce((n,c)=>n+Math.max(0,+c.balance||0),0),names=members.map(c=>`${c.bank||''} ${c.name||''}`).join(' + ');if(!limit)add('warn','KARTLAR','ORTAK LİMİT EKSİK',`${group} · ${members.length} kart ortak limite bağlı ancak ortak limit tutarı girilmemiş.`,'sharedLimitGroup',group);else{if(positive.some(v=>Math.abs(v-limit)>.01))add('warn','KARTLAR','ORTAK LİMİT TANIMI UYUŞMUYOR',`${group} · aynı gruptaki kartlarda farklı ortak limit tutarları var. Kullanılan üst limit ${money(limit)}.`,'sharedLimitGroup',group);if(used>limit+.01)add('bad','KARTLAR','ORTAK LİMİT AŞIMI',`${group} · ${names} · toplam borç ${money(used)}, ortak limit ${money(limit)}, aşım ${money(used-limit)}.`,'sharedLimitGroup',group);else if(limit>0&&used/limit>=.9)add('warn','KARTLAR','ORTAK LİMİT %90 ÜZERİNDE',`${group} · toplam borç ${money(used)}, ortak limit ${money(limit)}, kalan ${money(limit-used)}.`,'sharedLimitGroup',group)}});
 // EKSTRE: parmak izi, özet matematiği, HANE toplamı ve dönem borcu mutabakatı.
 const fps=new Map();(state.expenses||[]).filter(x=>x.importedFromStatement).forEach(x=>{const k=x.importFingerprint||x.importBaseFingerprint;if(k){if(fps.has(k))add('bad','EKSTRE','MÜKERRER EKSTRE HAREKETİ',(x.title||'Ekstre hareketi')+' aynı parmak iziyle birden fazla kayıtlı.','editExpense',x.id);else fps.set(k,x.id)}});
 (state.statementImports||[]).forEach(s=>{const c=(state.cards||[]).find(x=>x.id===s.cardId);if(!c){add('bad','EKSTRE','EKSTRE KARTI BULUNAMADI',`${s.month||''} dönem ekstresi bağlı olduğu kartı bulamıyor.`);return}const rows=(state.expenses||[]).filter(x=>x.cardId===s.cardId&&x.statementImportMonth===s.month&&x.statementMatched),prev=+s.previousBalance||0,sp=+s.spendingTotal||0,fees=+s.feesTotal||0,pays=+s.paymentsTotal||0,refunds=Number.isFinite(+s.refundsTotal)?Math.max(0,+s.refundsTotal):rows.filter(x=>isCardRefund(x)).reduce((n,x)=>n+Math.abs(amt(x)||0),0),debt=+s.periodDebt;const calc=prev+sp+fees-pays-refunds;if(Number.isFinite(debt)&&Math.abs(calc-debt)>.02)add('warn','EKSTRE','BANKA EKSTRE ÖZETİ UYUŞMUYOR',`${c.bank||''} · ${s.month||''} · devreden + harcama + faiz/ücret − ödeme − iade = ${money(calc)}, dönem borcu ${money(debt)}${refunds?` · iade ${money(refunds)}`:''}`);const importedRows=rows.filter(x=>x.importedFromStatement),importedSpend=importedRows.filter(x=>!isCardRefund(x)&&!/(faiz|masraf|vergi|fee)/i.test(String(x.statementType||x.transactionType||''))).reduce((n,x)=>n+Math.max(0,amt(x)||0),0);if(importedRows.length&&Number.isFinite(+s.spendingTotal)&&Math.abs(importedSpend-(+s.spendingTotal||0))>.02)add('warn','EKSTRE','EKSTRE / HANE HARCAMA FARKI',`${c.bank||''} · ${s.month||''} · banka ${money(+s.spendingTotal||0)}, içe aktarılan ${money(importedSpend)}`,'hanStatementReview',c.id,s.month)});
 const exps=(state.expenses||[]).filter(x=>!x.recurring&&x.date&&Number.isFinite(amt(x)));
 const norm=t=>String(t||'').toLocaleUpperCase('tr-TR').replace(/[^A-ZÇĞİÖŞÜ0-9 ]/g,' ').replace(/\s+/g,' ').trim();
 // V64: Eski ikinci yakın-tutar motoru kaldırıldı; tüm mükerrer/benzer işlem kararları yukarıdaki tek gelişmiş motordan gelir.
 const merchants=new Map();exps.forEach(x=>{const k=norm(x.baseTitle||x.title);if(!k)return;const key=k.split(' ').slice(0,3).join(' ');if(!merchants.has(key))merchants.set(key,[]);merchants.get(key).push(x)});merchants.forEach(rows=>{if(rows.length<3)return;const counts={};rows.forEach(x=>counts[x.category||'Diğer']=(counts[x.category||'Diğer']||0)+1);const cats=Object.keys(counts);if(cats.length<2)return;const main=cats.sort((a,b)=>counts[b]-counts[a])[0];rows.filter(x=>(x.category||'Diğer')!==main).forEach(x=>add('warn','FİNANS','KATEGORİ TUTARSIZLIĞI',`${x.title||'İşlem'} · ${x.category||'Diğer'}; benzer kayıtların çoğu ${main} kategorisinde.`,'editExpense',x.id))});
 const dayCategory=new Map();exps.forEach(x=>{const cat=String(x.category||'Diğer').trim()||'Diğer',k=`${x.date}|${cat}`;if(!dayCategory.has(k))dayCategory.set(k,{date:x.date,cat,rows:[]});dayCategory.get(k).rows.push(x)});dayCategory.forEach(({date,cat,rows})=>{if(rows.length<5||/ULAŞIM|ULASIM|YOL/i.test(cat))return;add('warn','FİNANS','AYNI GÜN ÇOKLU KATEGORİ KAYDI',`${date} tarihinde ${rows.length} adet ${cat} işlemi bulundu. Günlük toplam ${money(rows.reduce((a,x)=>a+(amt(x)||0),0))}.`,'categoryDayGroup',date,cat)});
 const road=new Map();exps.filter(x=>/ULAŞIM|ULASIM|YOL/i.test(String(x.category||'')+' '+String(x.title||''))).forEach(x=>{if(!road.has(x.date))road.set(x.date,[]);road.get(x.date).push(x)});road.forEach((rows,date)=>{if(rows.length>=5)add('warn','FİNANS','AYNI GÜN ÇOKLU ULAŞIM KAYDI',`${date} tarihinde ${rows.length} ulaşım/yol kaydı bulundu. Toplam ${money(rows.reduce((a,x)=>a+(amt(x)||0),0))}.`,'roadFeeGroup',date)});
 exps.filter(x=>x.importedFromStatement).forEach(x=>{const bank=norm(x.bankDescription||x.statementDescription||x.originalDescription||'');if(bank&&/(FAIZ|FAİZ|BSMV|KKDF|KOMISYON|KOMİSYON|UCRET|ÜCRET)/.test(bank)&&!/(faiz|masraf|vergi|fee)/i.test(String(x.statementType||x.transactionType||'')))add('warn','EKSTRE','İŞLEM TÜRÜ ŞÜPHESİ',`${x.bankDescription||x.statementDescription||x.title||'Ekstre hareketi'} · ${money(amt(x)||0)} · banka açıklaması faiz/masraf/vergi ifadesi içeriyor.`,'editExpense',x.id)});
 // HAN 4.0: gelişmiş finansal denetçi katmanı.
 const monthShift=(m,d)=>{const [y,mo]=String(m||ym(new Date())).split('-').map(Number),x=new Date(y,mo-1+d,1);return ym(x)};
 const selected=state.selectedMonth||ym(new Date()),prevMonth=monthShift(selected,-1),nowMonth=ym(new Date());
 const monthRows=m=>exps.filter(x=>String(x.date||'').startsWith(m));
 const monthTotal=m=>monthRows(m).reduce((n,x)=>n+Math.max(0,amt(x)||0),0);
 const curTotal=monthTotal(selected),prevTotal=monthTotal(prevMonth),delta=curTotal-prevTotal;
 if(prevTotal>0&&Math.abs(delta)>=Math.max(1000,prevTotal*.15)){
   const cats={};monthRows(selected).forEach(x=>cats[x.category||'Diğer']=(cats[x.category||'Diğer']||0)+Math.max(0,amt(x)||0));
   const pc={};monthRows(prevMonth).forEach(x=>pc[x.category||'Diğer']=(pc[x.category||'Diğer']||0)+Math.max(0,amt(x)||0));
   const drivers=Object.keys({...cats,...pc}).map(k=>[k,(cats[k]||0)-(pc[k]||0)]).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3).filter(x=>Math.abs(x[1])>=100);
   add('info','ANALİZ','PARA NEREYE GİTTİ?',`${monthLabel(selected)} gideri ${money(curTotal)}; ${monthLabel(prevMonth)} ${money(prevTotal)}. Fark ${delta>=0?'+':''}${money(delta)}.${drivers.length?' En büyük değişimler: '+drivers.map(([k,v])=>`${k} ${v>=0?'+':''}${money(v)}`).join(' · '):''}`);
 }
 // Fatura sınıflandırması: sabit gider yok; fatura niteliğindeki giderler Faturalar ailesinde olmalı.
 const billCats=new Set(['Faturalar','İnternet','Elektrik','Su','Doğalgaz','Cep Telefonu','Abonelik','Sigorta','Vergi','Vergi & Faiz','Banka Masrafı','Faiz']);
 exps.forEach(x=>{const t=normText((x.baseTitle||'')+' '+(x.title||''));if(/ELEKTRİK|ELEKTRIK|DOĞALGAZ|DOGALGAZ|İNTERNET|INTERNET|TELEFON|FATURA|SU FATURA|TURKCELL|VODAFONE|TURK TELEKOM/.test(t)&&!billCats.has(x.category||''))add('warn','FİNANS','FATURA KATEGORİSİ ŞÜPHESİ',`${x.title||'Gider'} · ${x.date||'—'} · ${money(amt(x)||0)} şu anda “${x.category||'Diğer'}”. Açıklama fatura niteliğinde; Faturalar altında olması beklenebilir.`,'editExpense',x.id)});
 // Ekstre dönem çakışması / banka satırı ile HANE zinciri.
 const stmtPeriod=new Map();(state.statementImports||[]).forEach(st=>{const k=`${st.cardId}|${st.month}`;if(stmtPeriod.has(k))add('bad','EKSTRE','AYNI DÖNEMDE BİRDEN FAZLA EKSTRE',`${st.month||'—'} · aynı kart ve dönem için ${stmtPeriod.get(k)+1}. ekstre kaydı bulundu.`,'hanStatementReview',st.cardId,st.month);stmtPeriod.set(k,(stmtPeriod.get(k)||0)+1);const accounted=(+st.rowCount||0)+(+st.matchedExistingCount||0)+(+st.paymentRowCount||0)+(+st.adjustmentRowCount||0);if((+st.unresolvedRowCount||0)>0)add('warn','EKSTRE','ÇÖZÜMLENEMEYEN BANKA SATIRI',`${st.month||'—'} · ${st.unresolvedRowCount} fiziksel işlem adayı parser tarafından çözümlenemedi. Ekstre yeniden incelenmeli.`,'hanStatementReview',st.cardId,st.month);if(st.verificationStatus&&st.verificationStatus!=='verified')add('info','EKSTRE','EKSTRE TAM DOĞRULANMADI',`${st.month||'—'} · doğrulama durumu ${String(st.verificationStatus).toLocaleUpperCase('tr-TR')}. Fiziksel ${st.bankRowCount||0}, parser ${st.parsedRowCount||0}.`,'hanStatementReview',st.cardId,st.month);if((+st.bankRowCount||0)>0&&accounted<+st.bankRowCount)add('warn','EKSTRE','BANKA SATIRI / HANE ZİNCİRİ EKSİK',`${st.month||'—'} · banka ${st.bankRowCount} satır, HANE zincirinde ${accounted} işlenmiş/eşleşmiş satır. ${(+st.bankRowCount||0)-accounted} satır ayrıca incelenmeli.`,'hanStatementReview',st.cardId,st.month)});
 // Taksit bütünlüğü.
 const instGroups=new Map();exps.filter(x=>x.installmentGroup||x.installmentCount).forEach(x=>{const k=x.installmentGroup||`${x.cardId}|${x.baseTitle||x.title}|${x.installmentCount}`;if(!instGroups.has(k))instGroups.set(k,[]);instGroups.get(k).push(x)});instGroups.forEach(rows=>{const count=Math.max(...rows.map(x=>+x.installmentCount||0));if(count<2)return;const nums=rows.map(x=>+x.installmentNo||0).filter(Boolean),uniq=new Set(nums);if(uniq.size!==nums.length)add('bad','TAKSİT','MÜKERRER TAKSİT NUMARASI',`${rows[0].baseTitle||rows[0].title||'Taksit'} · ${count} taksit planında aynı taksit numarası birden fazla kez bulundu.`,'editExpense',rows[0].id);for(let n=1;n<=Math.min(count,Math.max(...nums,0));n++)if(!uniq.has(n)){add('warn','TAKSİT','EKSİK TAKSİT HALKASI',`${rows[0].baseTitle||rows[0].title||'Taksit'} · ${n}/${count} taksiti bulunamadı; zincir ${nums.sort((a,b)=>a-b).join(', ')} olarak görünüyor.`,'editExpense',rows[0].id);break}if(nums.some(n=>n>count))add('bad','TAKSİT','TAKSİT SAYISI AŞILMIŞ',`${rows[0].baseTitle||rows[0].title||'Taksit'} · plan ${count}, bulunan taksit numarası ${Math.max(...nums)}.`,'editExpense',rows[0].id)});
 // Kart ödeme denetimi: mükerrer / dönem borcundan belirgin fazla ödeme.
 const payRows=(state.cardPayments||[]).filter(p=>validDate(p.date)&&Number.isFinite(+p.amount));for(let i=0;i<payRows.length;i++)for(let j=i+1;j<payRows.length;j++){const a=payRows[i],b=payRows[j];if(a.cardId===b.cardId&&a.date===b.date&&Math.abs((+a.amount||0)-(+b.amount||0))<=.01)add('warn','KARTLAR','OLASI MÜKERRER KART ÖDEMESİ',`${a.date} · ${money(+a.amount||0)} · aynı karta aynı gün aynı tutarda iki ödeme kaydı.`,'editCardPayment',a.id,b.id)}
 payRows.forEach(p=>{const st=(state.statementImports||[]).filter(x=>x.cardId===p.cardId&&String(p.date||'').slice(0,7)>=String(x.month||'')).sort((a,b)=>String(b.month).localeCompare(String(a.month)))[0];if(st&&+st.periodDebt>0&&+p.amount>(+st.periodDebt*1.25)+100)add('warn','KARTLAR','KART ÖDEMESİ DÖNEM BORCUNDAN YÜKSEK',`${p.date} · ödeme ${money(+p.amount||0)}, yakın dönem borcu ${money(+st.periodDebt||0)}. Önceki borç/ek ödeme olabilir; kontrol önerisidir.`,'editCardPayment',p.id)});
 // Gelir düzeni ve çalışma ↔ ödeme mutabakatı.
 const incomes=(state.incomes||[]).filter(x=>validDate(x.date)&&Number.isFinite(+(x.actualAmount??x.amount)));const incomeByTitle=new Map();incomes.forEach(x=>{const k=normText(x.title);if(!k)return;if(!incomeByTitle.has(k))incomeByTitle.set(k,[]);incomeByTitle.get(k).push(x)});incomeByTitle.forEach((rows,k)=>{if(rows.length<3)return;const hist=rows.filter(x=>String(x.date).slice(0,7)<selected);const thisRows=rows.filter(x=>String(x.date).startsWith(selected));if(hist.length>=3&&!thisRows.length&&selected<=nowMonth){const last=[...hist].sort((a,b)=>String(b.date).localeCompare(String(a.date)))[0];add('warn','GELİR','BEKLENEN GELİR BULUNAMADI',`${rows[0].title||'Gelir'} geçmişte düzenli görünüyor ancak ${monthLabel(selected)} için kayıt bulunamadı.`,'editIncome',last?.id||'')}if(thisRows.length){const vals=hist.map(x=>+(x.actualAmount??x.amount)||0).filter(v=>v>0).sort((a,b)=>a-b),med=vals[Math.floor(vals.length/2)]||0,cur=thisRows.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);if(med>0&&Math.abs(cur-med)>=Math.max(1000,med*.25))add('warn','GELİR','OLAĞANDIŞI GELİR TUTARI',`${rows[0].title||'Gelir'} · bu ay ${money(cur)}, geçmiş tipik tutar yaklaşık ${money(med)}.`,'editIncome',thisRows[0].id)}});
 (state.members||[]).forEach(mem=>{const months=new Set((state.work||[]).filter(w=>w.memberId===mem.id).map(w=>String(w.date||'').slice(0,7)).filter(Boolean));months.forEach(m=>{if(m>nowMonth)return;const ent=zMemberMonthEntitlement(mem,m).total,paid=zMemberMonthPaid(mem.id,m),diff=ent-paid;if(ent>0&&Math.abs(diff)>.01){const wr=(state.work||[]).find(w=>w.memberId===mem.id&&String(w.date||'').startsWith(m));add(diff>0&&m<nowMonth?'warn':'info','ÇALIŞMA','ÇALIŞMA / HAKEDİŞ MUTABAKATI',`${mem.name||'Üye'} · ${monthLabel(m)} · hakediş ${money(ent)} · alınan ${money(paid)} · fark ${money(diff)}.`,'zWorkEdit',wr?.id||'')}})});
 // Ortak limit öngörüsü: seçili ay harcama hızına göre yalnız bilgi/inceleme.
 const dayOfMonth=Math.max(1,new Date().getDate()),daysInMonth=new Date(new Date().getFullYear(),new Date().getMonth()+1,0).getDate();sharedGroups.forEach((members,group)=>{const limit=Math.max(0,...members.map(c=>+c.sharedLimit||0));if(!limit||selected!==nowMonth)return;const ids=new Set(members.map(c=>c.id)),spent=monthRows(selected).filter(x=>x.source==='card'&&ids.has(x.cardId)).reduce((n,x)=>n+Math.max(0,amt(x)||0),0),projectedTotal=spent/dayOfMonth*daysInMonth,remainingProjected=Math.max(0,projectedTotal-spent),used=members.reduce((n,c)=>n+Math.max(0,+c.balance||0),0);if(used<limit*.9&&used+remainingProjected>limit*.9)add('info','KARTLAR','ORTAK LİMİT HARCAMA HIZI',`${group} · mevcut borç ${money(used)}, bu ay gerçekleşen kart harcaması ${money(spent)}. Bugünden ay sonuna beklenen ek harcama yaklaşık ${money(remainingProjected)}; bu kesin tahmin değildir.`,'sharedLimitGroup',group)});
 // Yedek güvenliği.
 if(state.settings?.hanLastBackupAt){const age=(Date.now()-new Date(state.settings.hanLastBackupAt).getTime())/86400000;if(age>7)add('warn','YEDEK','YEDEK ESKİ',`Son doğrulanmış HANE yedeği yaklaşık ${Math.floor(age)} gün önce oluşturuldu.`)}else add('info','YEDEK','YEDEK TARİHİ BİLİNMİYOR','HAN henüz bu sürümde oluşturulmuş bir yedek tarihi görmüyor. Bir sonraki Yedek Oluştur işleminden sonra tarih izlenecek.');
 // Aylık HAN özeti.
 const monthIncome=incomes.filter(x=>String(x.date).startsWith(selected)).reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0),cardDebt=(state.cards||[]).reduce((n,c)=>n+Math.max(0,+c.balance||0),0),cardPaid=payRows.filter(x=>String(x.date).startsWith(selected)).reduce((n,x)=>n+(+x.amount||0),0),feeTotal=monthRows(selected).filter(x=>/(faiz|masraf|vergi|fee)/i.test(String(x.statementType||x.transactionType||x.category||''))).reduce((n,x)=>n+Math.max(0,amt(x)||0),0);add('info','AYLIK ÖZET','HAN AYLIK FİNANS ÖZETİ',`${monthLabel(selected)} · gelir ${money(monthIncome)} · gider ${money(curTotal)} · net ${money(monthIncome-curTotal)} · toplam kart borcu ${money(cardDebt)} · kart ödemesi ${money(cardPaid)} · faiz/vergi/masraf ${money(feeTotal)}.`);
 // EKRANLAR / NAVİGASYON: ana render fonksiyonları ve hedefleri mevcut mu?
 const screenFns={home,transactions,fixed,cards,calendar,reports,cashMoney,tara,profile,adminProfile,backup,settings,categories,theme,alerts,about,monthSpent,monthPaid,members,homeEdit,notes,workCenter};Object.entries(screenFns).forEach(([k,v])=>{if(typeof v!=='function')add('bad','EKRANLAR','EKRAN FONKSİYONU EKSİK',`${k} ekranı oluşturulamıyor.`)});
 const requiredNav=['home','transactions','fixed','cards','calendar','reports','workCenter','tara','profile','backup','settings'];requiredNav.forEach(k=>{if(typeof screenFns[k]!=='function')add('bad','NAVİGASYON','NAVİGASYON HEDEFİ EKSİK',`${k} hedefi bulunamadı.`)});if(typeof goTo!=='function'||typeof goBack!=='function')add('bad','NAVİGASYON','GEZİNME MOTORU EKSİK','goTo/goBack fonksiyonlarından biri bulunamadı.');
 // CACHE-BUILD: bu paket içindeki çalışma sürümü tek kimlikte olmalı.
 const runtimeBuild=String(HANE_UI?.build||'');if(runtimeBuild!=='20260928-HANE-WORK-V109-CLEAN')add('warn','CACHE-BUILD','BUILD KİMLİĞİ UYUŞMUYOR',`Çalışan arayüz kimliği: ${runtimeBuild||'yok'}. Beklenen: 20260928-HANE-WORK-V109-CLEAN.`);
 if(!('serviceWorker' in navigator))add('warn','CACHE-BUILD','SERVICE WORKER DESTEĞİ YOK','Bu tarayıcı PWA önbellek denetimini desteklemiyor.');
 // YEDEK: şema ve şifreli depo için gerekli temel yapı.
 if(+state.version!==19)add('bad','YEDEK','VERİ ŞEMASI SÜRÜMÜ UYUŞMUYOR',`Beklenen şema 19, bulunan ${String(state.version)}`);if(!state.settings||!Array.isArray(state.expenses)||!Array.isArray(state.incomes)||!Array.isArray(state.cards))add('bad','YEDEK','YEDEK ŞEMASI EKSİK','Temel HANE veri alanlarından biri eksik.');try{const m=meta();if(!m||!m.salt)add('warn','YEDEK','ŞİFRELİ DEPO METASI EKSİK','PIN/şifreli veri metası doğrulanamadı.')}catch(e){add('warn','YEDEK','YEDEK METASI OKUNAMADI','Şifreli depo metası okunurken hata oluştu.')}
 // HANE FULL AUDIT: çalışma / alacak / yol / merkezi bağlantılar / aktarım sağlığı.
 try{
  const zdb=window.HANE_CORE?.read?.();
  if(!zdb) add('bad','MERKEZ','MERKEZİ VERİ OKUNAMIYOR','HANE merkezi veri deposu okunamadı.');
  else{
   const works=state.work||[], incs=state.workPayments||[], roads=state.workRoads||[];
   const members=state.members||[], memberIds=new Set(members.map(m=>String(m.id))), memberDay=new Map();
   works.filter(w=>w.memberId).forEach(w=>{const k=String(w.memberId)+'|'+String(w.date||''),rows=memberDay.get(k)||[];rows.push(w);memberDay.set(k,rows);if(!memberIds.has(String(w.memberId)))add('bad','ÇALIŞMA','ÇALIŞMA ÜYESİ BULUNAMADI',`${w.date||'—'} · ${w.title||'Çalışma'} · bağlı hane üyesi bulunamıyor.`,'zWorkEdit',w.id);const mem=members.find(m=>String(m.id)===String(w.memberId));if(mem?.startDate&&w.date&&w.date<mem.startDate)add('warn','ÇALIŞMA','İŞE BAŞLAMADAN ÖNCE ÇALIŞMA',`${mem.name||'Üye'} · ${w.date} · işe başlangıç ${mem.startDate}`,'zWorkEdit',w.id);const wy=roads.filter(x=>x.workId===w.id),expectedRoad=+(w.roadAmount||0),linkedRoad=wy.reduce((n,e)=>n+(+(e.actualAmount??e.amount)||0),0);if(expectedRoad>0&&!wy.length)add('warn','ÇALIŞMA','YOL GİDERİ BAĞLANTISI EKSİK',`${w.date||''} · ${w.title||'Çalışma'} · yol ${money(expectedRoad)} · bağlı yol kaydı yok`,'zWorkEdit',w.id);if(wy.length&&Math.abs(expectedRoad-linkedRoad)>.01)add('warn','ÇALIŞMA','YOL GİDERİ TOPLAMI UYUŞMUYOR',`${w.date||''} · ${w.title||'Çalışma'} · çalışma ${money(expectedRoad)} · bağlı ${money(linkedRoad)}`,'zWorkEdit',w.id)});
   memberDay.forEach((rows,k)=>{const [mid,date]=k.split('|'),mem=members.find(m=>String(m.id)===mid),byType=new Map();rows.forEach(w=>{const typ=String(w.type||'daily');if(!byType.has(typ))byType.set(typ,[]);byType.get(typ).push(w)});byType.forEach(same=>{if(same.length>1)add('bad','ÇALIŞMA','AYNI GÜN MÜKERRER ÇALIŞMA',`${mem?.name||'Hane üyesi'} · ${date||'—'} · aynı türde ${same.length} çalışma kaydı var. Tam gün + mesai/saatlik kombinasyonları normal kabul edilir.`,'zWorkEdit',same[0].id,same[1]?.id||'')})});
   members.forEach(mem=>{if(!mem.startDate)add('warn','ÇALIŞMA','İŞE BAŞLAMA TARİHİ EKSİK',`${mem.name||'Hane üyesi'} için otomatik takvim başlangıcı belirlenemiyor.`,'editMember',mem.id);if(!(+mem.dailyWage>0))add('warn','ÇALIŞMA','GÜNLÜK ÜCRET EKSİK',`${mem.name||'Hane üyesi'} için 30 günlük ücret hesabı yapılamıyor.`,'editMember',mem.id);if(!String(mem.color||'').trim())add('warn','ÇALIŞMA','ÜYE RENGİ EKSİK',`${mem.name||'Hane üyesi'} takvimde ayırt edilemiyor.`,'editMember',mem.id);const months=new Set(works.filter(w=>w.memberId===mem.id).map(w=>String(w.date||'').slice(0,7)).filter(Boolean));months.forEach(m=>{const paid=zMemberMonthPaid(mem.id,m),ent=zMemberMonthEntitlement(mem,m).total;if(paid>ent+.01){const wp=(state.workPayments||[]).find(p=>p.memberId===mem.id&&(p.workMonth===m||String(p.date||'').startsWith(m)));add('bad','ÇALIŞMA','HAKEDİŞTEN FAZLA AYLIK ÖDEME',`${mem.name||'Üye'} · ${monthLabel(m)} · hakediş ${money(ent)} · alınan ${money(paid)}`,wp?'zWorkPaymentEdit':'editMember',wp?.id||mem.id)}})});
   roads.forEach(r=>{if(!works.some(w=>w.id===r.workId))add('bad','ÇALIŞMA','SAHİPSİZ YOL GİDERİ',`${r.date||''} · ${r.title||'Yol'} · bağlı çalışma bulunamadı.`,'zWorkRoadDayEdit',r.id)});
   const links=zdb.links||[], lk=new Set();links.forEach(l=>{const k=[l.type,l.haneId||'',l.rutinId||'',l.workId||'',l.financeId||''].join('|');if(lk.has(k))add('warn','BAĞLANTILAR','MÜKERRER MERKEZİ BAĞLANTI',`${l.type||'BAĞLANTI'} · aynı bağlantı birden fazla kayıtlı.`);else lk.add(k)});
   if(!zdb.finance||!Array.isArray(zdb.finance.expenses)||!Array.isArray(zdb.work?.records))add('bad','MERKEZ','MERKEZİ ŞEMA EKSİK','Finans veya çalışma veri alanları beklenen yapıda değil.');
   const hs=zdb.migration?.lastHaneSyncAt;if(!hs)add('warn','MERKEZ','HANE MERKEZ SENKRONU YOK','Merkezi çekirdekte HANE senkron zamanı bulunamadı.');
   const centralHaneWork=(zdb.work?.records||[]).filter(x=>x._source==='HANE').length;if(centralHaneWork!==works.length)add('warn','MERKEZ','ÇALIŞMA MERKEZ SAYISI UYUŞMUYOR',`Uygulama ${works.length} · merkez HANE kaynağı ${centralHaneWork}.`);
   const centralHaneExp=(zdb.finance?.expenses||[]).filter(x=>x._source==='HANE').length;if(centralHaneExp!==(state.expenses||[]).length)add('warn','MERKEZ','GİDER MERKEZ SAYISI UYUŞMUYOR',`Uygulama ${(state.expenses||[]).length} · merkez HANE kaynağı ${centralHaneExp}.`);
   (zdb.imports?.rutin||[]).forEach(im=>{if(!im.importedAt)add('warn','YEDEK','RUTİN AKTARIM KAYDI EKSİK',`${im.label||'RUTİN aktarımı'} zaman damgası taşımıyor.`)});
  }
 }catch(e){add('bad','MERKEZ','FULL AUDIT ÇALIŞTIRILAMADI',String(e?.message||e));}
 const migrationFindings=(window.HANE_CORE?.read?.()?.han?.findings||[]).filter(x=>x.kind==='MIGRATION_POSSIBLE_MATCH');migrationFindings.forEach(x=>add('warn','FİNANS','HANE ↔ RUTİN OLASI EŞLEŞME',`${x.dateHane||'—'} HANE: ${x.haneTitle||'Gider'} ↔ ${x.dateRutin||'—'} RUTİN: ${x.rutinTitle||'Gider'} · ${money(+x.amount||0)} · ${x.dayDiff||0} gün fark${x.nameSimilar?' · ad benzer':''}`,'hanMigrationReview',x.id));
 const ignored=new Set((state.settings?.hanIgnored||[]).map(String));const visibleIssues=issues.filter(x=>!ignored.has(hanIssueKey(x.title,x.recordId,x.recordId2,x.recordAction)));const month=financeMonthSnapshot(state.selectedMonth);return {issues:visibleIssues,month,checked:all.length,ok:visibleIssues.length===0}
}
function hanIssueKey(title,id,id2='',action=''){return [String(title||''),String(id||''),String(id2||''),hanIssueFingerprint(action,id,id2)].join('|')}
function hanRecordCard(id){const x=(state.expenses||[]).find(z=>String(z.id)===String(id));if(!x)return '';const card=x.cardId?(state.cards||[]).find(c=>c.id===x.cardId):null;const src=x.source==='card'?`KART${card?' · '+esc(card.bank||'')+' '+esc(card.name||''):''}`:(x.source==='cash'?'NAKİT':String(x.source||'—').toUpperCase());return `<div class="notice hanCompare"><b>${esc(x.title||'Gider')}</b><br><span>${esc(x.date||'—')} · ${money(+(x.actualAmount??x.amount)||0)} · ${esc(x.category||'Diğer')} · ${src}</span><div class="hanReviewActions"><button class="btn" data-action="hanEditFromInspect" data-record-action="editExpense" data-record-id="${esc(x.id)}">DÜZENLE</button><button class="btn danger" data-action="hanDeleteFromInspect" data-record-action="editExpense" data-record-id="${esc(x.id)}">SİL</button></div></div>`}
function hanGenericRecordCard(action,id){
 const spec=haneRecordDetailSpec(action,id); if(!spec)return '';
 const map={editIncome:'delIncome',editExpense:'delExpense',editCardPayment:'delCardPayment',editFlexPayment:'delFlexPayment',editCard:'delCard',editFlex:'delFlex',editAccount:'delAccount',editMember:'delMember',zWorkEdit:'zWorkDelete',zWorkPaymentEdit:'zWorkPaymentDelete',zWorkRoadDayEdit:'zWorkRoadDayDelete'};
 const del=map[action]||'';
 return `<div class="notice hanCompare"><b>${esc(spec.title||'KAYIT')}</b><div class="hanReviewActions"><button class="btn" data-action="hanEditFromInspect" data-record-action="${esc(action)}" data-record-id="${esc(id)}">DÜZENLE</button>${del?`<button class="btn danger" data-action="hanDeleteGeneric" data-delete-action="${esc(del)}" data-record-id="${esc(id)}">SİL</button>`:''}</div></div>`;
}
function hanMigrationReviewBody(id){const f=window.HANE_CORE?.migrationFinding?.(id);if(!f)return '<div class="notice">Bu olası eşleşme daha önce karara bağlanmış veya artık bulunmuyor.</div>';return `<div class="notice"><b>NEDEN ŞÜPHELİ?</b><br>İki kaynakta tutar aynı; tarihler arasında ${esc(String(f.dayDiff||0))} gün fark var${f.nameSimilar?' ve açıklamalar benzer':''}. HAN otomatik birleştirme yapmadı.</div><div class="section"><b>HANE KAYDI</b><span>${esc(f.dateHane||'—')}</span></div><div class="notice hanCompare"><b>${esc(f.haneTitle||'Gider')}</b><br><span>${money(+f.amount||0)} · HANE</span></div><div class="section"><b>RUTİN KAYDI</b><span>${esc(f.dateRutin||'—')}</span></div><div class="notice hanCompare"><b>${esc(f.rutinTitle||'Gider')}</b><br><span>${money(+f.amount||0)} · RUTİN</span></div><div class="hanReviewActions"><button class="btn gold" data-action="hanMigrationDecision" data-finding-id="${esc(f.id)}" data-decision="same">AYNI KAYIT</button><button class="btn" data-action="hanMigrationDecision" data-finding-id="${esc(f.id)}" data-decision="different">FARKLI KAYIT</button></div><div class="notice taraSafety">AYNI KAYIT yalnızca iki kaydı merkezi bağlantıyla eşleştirir. FARKLI KAYIT bu çifti ayrı olarak işaretler. Hiçbir finans kaydı silinmez veya tutarı değiştirilmez.</div>`}
function hanReasonFor(title,group=''){
 const t=String(title||'').toLocaleUpperCase('tr-TR');
 if(/MÜKERRER|ÇİFT/.test(t))return 'Aynı veya çok benzer kayıtların tarih, tutar, kaynak ya da kimlik alanları birbiriyle çakıştığı için.';
 if(/EKSTRE|BANKA SATIRI/.test(t))return 'Banka ekstresi özeti, dönem satırları ve HANE kayıt zinciri aynı sonucu vermediği için.';
 if(/TAKSİT/.test(t))return 'Taksit numarası, taksit adedi ve aynı taksit grubundaki kayıt sırası beklenen zincirle uyuşmadığı için.';
 if(/ORTAK LİMİT|KART LİMİT/.test(t))return 'Kart borçları ile tanımlı bireysel/ortak limit birlikte hesaplandığında eşik veya tanım uyumsuzluğu oluştuğu için.';
 if(/KATEGORİ|FATURA/.test(t))return 'İşlem açıklaması ve geçmiş benzer kayıtların kategori davranışı mevcut kategoriyle uyuşmadığı için.';
 if(/GELİR|HAKEDİŞ|ÇALIŞMA/.test(t))return 'Geçmiş düzen, çalışma hakedişi veya alınan ödeme toplamları arasında kontrol gerektiren fark bulunduğu için.';
 if(/YEDEK/.test(t))return 'Veri güvenliği için son yedek zamanı veya yedek yapısı beklenen sağlık koşulunu karşılamadığı için.';
 if(/OLAĞANDIŞI|HARCAMA HIZI|PARA NEREYE/.test(t))return 'Geçmiş kayıt düzenine göre belirgin bir sapma görüldüğü için; bu otomatik olarak hata anlamına gelmez.';
 return `${group||'HAN'} denetim kuralı mevcut kayıtlar arasında doğrulanması gereken bir uyumsuzluk veya dikkat noktası bulduğu için.`;
}
function hanInspectBody(title,detail,action,id,id2=''){const key=hanIssueKey(title,id,id2,action),why=hanReasonFor(title);const explain=`<div class="hanExplain"><div><small>NE BULDU?</small><b>${esc(detail)}</b></div><div><small>NEDEN BULDU?</small><span>${esc(why)}</span></div></div>`;if(action==='hanStatementReview'){const c=(state.cards||[]).find(x=>String(x.id)===String(id)),rows=(state.expenses||[]).filter(x=>String(x.cardId)===String(id)&&x.statementImportMonth===id2&&x.importedFromStatement);return `${explain}<div class="section"><b>EKSTRE / HANE İNCELEMESİ</b><span>${esc(c?.bank||'Kart')} · ${esc(id2||'')}</span></div><button class="btn" data-action="hanOpenStatementInspect" data-record-id="${esc(id)}" data-month="${esc(id2)}">EKSTREYİ AÇ</button><div class="section"><b>İÇE AKTARILAN HANE KAYITLARI</b><span>${rows.length} kayıt</span></div>${rows.length?rows.map(x=>hanRecordCard(x.id)).join(''):'<div class="notice">Bu dönem için düzenlenebilir içe aktarılmış HANE kaydı bulunamadı.</div>'}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice taraSafety">Banka PDF satırları doğrudan silinmez. Düzenle / Sil yalnız seçtiğin gerçek HANE kaydını etkiler.</div>`}if(action==='roadFeeGroup'){const rows=roadFeeItemsForDate(id),total=rows.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);return `${explain}<div class="section"><b>AYNI GÜN ULAŞIM KAYITLARI</b><span>${rows.length} kayıt · ${money(total)}</span></div>${rows.map(x=>hanRecordCard(x.id)).join('')}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice taraSafety">Bu seçim finansal kayıtları değiştirmez; HAN bu uyarıyı tekrar göstermez.</div>`}if(action==='categoryDayGroup'){const rows=(state.expenses||[]).filter(x=>!x.recurring&&String(x.date||'')===String(id)&&String(x.category||'Diğer')===String(id2)),total=rows.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);return `${explain}<div class="section"><b>${esc(id2||'KATEGORİ')} · ${esc(id||'')}</b><span>${rows.length} kayıt · ${money(total)}</span></div>${rows.map(x=>hanRecordCard(x.id)).join('')}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice taraSafety">Kayıtlardan biri değişirse HAN bu kararı otomatik geçersiz sayar ve grubu yeniden inceler.</div>`}if(action==='sharedLimitGroup'){const rows=(state.cards||[]).filter(x=>String(x.sharedLimitGroup||'').trim()===String(id)),limit=Math.max(0,...rows.map(x=>+x.sharedLimit||0)),used=rows.reduce((n,x)=>n+Math.max(0,+x.balance||0),0);return `${explain}<div class="section"><b>ORTAK LİMİT · ${esc(id||'')}</b><span>${rows.length} kart · ${money(used)} / ${money(limit)}</span></div>${rows.map(c=>`<div class="notice hanCompare"><b>${esc(c.bank||'')} · ${esc(c.name||'KART')}</b><br><span>Borç ${money(+c.balance||0)} · ortak limit ${money(+c.sharedLimit||0)}</span><div class="hanReviewActions"><button class="btn" data-action="hanEditFromInspect" data-record-action="editCard" data-record-id="${esc(c.id)}">DÜZENLE</button></div></div>`).join('')}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice taraSafety">Kartlardan birinin borcu veya ortak limit tanımı değişirse HAN bu grubu yeniden denetler.</div>`}const one=action==='editExpense'?hanRecordCard(id):hanGenericRecordCard(action,id);const two=id2?(action==='editExpense'?hanRecordCard(id2):hanGenericRecordCard(action,id2)):'';return `${explain}<div class="section"><b>İLGİLİ KAYITLAR</b><span>Kararı sen verirsin</span></div>${one}${two}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice taraSafety">Düzenle veya Sil yalnız seçtiğin gerçek HANE kaydını etkiler. “Bunda Sıkıntı Yok” finansal kaydı değiştirmez ve bu HAN uyarısını kapatır.</div>`}
function han(){
 const a=hanAudit(),bad=a.issues.filter(x=>x.level==='bad').length,warn=a.issues.filter(x=>x.level==='warn').length,info=a.issues.filter(x=>x.level==='info').length,totalOpen=a.issues.length;
 const groups=[...new Set(a.issues.map(x=>x.group).filter(Boolean))];
 const active=groups.includes(hanFilter)?hanFilter:'TÜMÜ',sev=['KRİTİK','İNCELE','BİLGİ'].includes(hanSeverity)?hanSeverity:'TÜMÜ';
 let shown=active==='TÜMÜ'?a.issues:a.issues.filter(x=>x.group===active);if(sev==='KRİTİK')shown=shown.filter(x=>x.level==='bad');if(sev==='İNCELE')shown=shown.filter(x=>x.level==='warn');if(sev==='BİLGİ')shown=shown.filter(x=>x.level==='info');
 const last=state.settings?.hanLastScan?new Date(state.settings.hanLastScan).toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}):'Henüz taranmadı',delta=state.settings?.hanLastDelta||{},hist=(state.settings?.hanHistory||[]).slice(-5).reverse();
 const issueCard=x=>{const why=hanReasonFor(x.title,x.group),hasAction=x.recordAction&&x.recordId,cls=x.level==='bad'?'critical':x.level==='warn'?'warning':'information',badge=x.level==='bad'?'Kritik':x.level==='warn'?'İncele':'Bilgi';return `<article class="hanIssueCard ${cls}"><div class="hanIssueTop"><span class="hanIssueIcon">${x.level==='bad'?'!':x.level==='warn'?'?':'i'}</span><div class="hanIssueTitle"><b>${esc(x.title)}</b><small>${esc(x.group)}</small></div><span class="hanIssueBadge">${badge}</span></div><div class="hanIssueExplain"><small>NE BULDU?</small><p>${esc(x.detail)}</p><small>NEDEN BULDU?</small><p>${esc(why)}</p></div>${hasAction?`<div class="hanIssueActions"><button data-action="hanInspect" data-record-action="${esc(x.recordAction)}" data-record-id="${esc(x.recordId)}" data-record-id2="${esc(x.recordId2||'')}" data-issue-title="${esc(x.title)}" data-issue-detail="${esc(x.detail)}">⌕ &nbsp; İncele / Düzenle</button><button class="ok" data-action="hanIssueOk" data-issue-key="${esc(hanIssueKey(x.title,x.recordId,x.recordId2||'',x.recordAction))}">✓ &nbsp; Bunda Sıkıntı Yok</button></div>`:''}</article>`};
 const count=g=>g==='TÜMÜ'?a.issues.length:a.issues.filter(x=>x.group===g).length;
 const primary=['FİNANS','EKSTRE','KARTLAR','TAKSİT','GELİR','ÇALIŞMA','ANALİZ','AYLIK ÖZET'].filter(g=>groups.includes(g)),secondary=groups.filter(g=>!primary.includes(g));
 const groupButton=(g,label=g)=>`<button class="${active===g?'active':''}" data-action="hanFilter" data-han-group="${esc(g)}"><b>${esc(label)}</b><small>${count(g)}</small></button>`;
 const history=hist.length?`<section class="hanHistory"><div class="section"><b>SON TARAMALAR</b><span>Son ${hist.length}</span></div>${hist.map(h=>`<div><span>${new Date(h.at).toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</span><b>${h.bad||0} kritik · ${h.warn||0} incele · ${h.info||0} bilgi</b><small>+${h.newCount||0} yeni · ${h.solvedCount||0} çözüldü</small></div>`).join('')}</section>`:'';
 return `<div class="hanDashboard">
   <section class="hanAttentionPanel"><div class="hanPanelTitle"><div class="hanPanelBrand"><img src="icons/han-icon.png?v=v65" alt="HAN"><div><b>HAN · Finansal Denetçi</b><small>${a.checked} kayıt ve bağlantı kontrol edildi</small></div></div><div class="hanLastScan"><small>Son tarama</small><b>${esc(last)}</b></div></div><div class="hanDelta"><span><b>+${delta.newCount||0}</b> Yeni</span><span><b>${delta.solvedCount||0}</b> Çözüldü</span><span><b>${delta.changedCount||0}</b> Değişti</span></div><div class="hanPanelStats"><button class="critical ${sev==='KRİTİK'?'active':''}" data-action="hanSeverity" data-han-severity="KRİTİK"><strong>${bad}</strong><b>Kritik</b><small>Şimdi müdahale et</small></button><button class="warning ${sev==='İNCELE'?'active':''}" data-action="hanSeverity" data-han-severity="İNCELE"><strong>${warn}</strong><b>İncele</b><small>Kararı sen ver</small></button><button class="info ${sev==='BİLGİ'?'active':''}" data-action="hanSeverity" data-han-severity="BİLGİ"><strong>${info}</strong><b>Bilgi</b><small>Analiz / özet</small></button></div><button class="hanMainScan" data-action="hanRun">⌕ <span>HAN TARAMASI YAP</span><b>›</b></button></section>
   <div class="hanCategoryRail">${groupButton('TÜMÜ','Tümü')}${primary.map(g=>groupButton(g,g[0]+g.slice(1).toLocaleLowerCase('tr-TR'))).join('')}${secondary.map(g=>groupButton(g,g[0]+g.slice(1).toLocaleLowerCase('tr-TR'))).join('')}</div>
   <div class="hanFindingsHead"><div><b>${sev==='KRİTİK'?'Şimdi Müdahale Et':sev==='İNCELE'?'İncele':sev==='BİLGİ'?'Bilgi ve Analiz':'Tüm HAN Bulguları'} (${shown.length})</b><small>${active==='TÜMÜ'?'Tüm denetimler':active}</small></div><button data-action="hanSeverity" data-han-severity="TÜMÜ">Filtreyi temizle</button></div>
   <div class="hanIssueList">${shown.length?shown.map(issueCard).join(''):`<div class="hanAllClear"><b>✓ HAN TEMİZ</b><span>Bu filtrede açık bulgu yok.</span></div>`}</div>${history}
   <div class="hanRuleNote"><b>HAN KURALI</b><span>HAN hiçbir finans kaydını otomatik değiştirmez. Ne bulduğunu ve neden bulduğunu açıklar; ilgili gerçek kaydı Düzenle / Sil ile sana bırakır. Sabit gider denetimi yoktur: tüm ödemeler Gider olarak izlenir, fatura niteliğindeki kayıtlar Faturalar ailesinde kontrol edilir.</span></div>
 </div>`
}
function taraAudit(){return hanAudit()}
function tara(){return han()}

function goTo(next,{replace=false,fromPop=false}={}){if(!next||next===current)return;if(!fromPop)navHistory.push(current);current=next;modal=null;if(browserNavReady&&!fromPop){const st={haneView:next};replace?history.replaceState(st,''):history.pushState(st,'')}render()}
function goBack(){if(modal){modal=null;render();return}if(current==='theme'){themeDraft=null;applyTheme();}const prev=navHistory.pop()||'home';current=prev;modal=null;if(browserNavReady)history.replaceState({haneView:current},'');render()}
function initBrowserNav(){if(browserNavReady)return;browserNavReady=true;history.replaceState({haneView:current},'');window.addEventListener('popstate',e=>{if(!state)return;const next=e.state?.haneView||navHistory.pop()||'home';if(next!==current){current=next;modal=null;render()}})}
function summaryDetailBody(kind){
  const m=state.selectedMonth;
  const inc=realizedIncomeEntriesForMonth(m).map(x=>({...x,_kind:'income'}));
  const exp=actualExpenseEntriesForMonth(m).map(x=>({...x,_kind:'expense'}));
  const items=(kind==='income'?inc:kind==='expense'?exp:[...inc,...exp]).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const T=totals(m),title=kind==='income'?'GELİR DETAYI':kind==='expense'?'GİDER DETAYI':'KALAN DETAYI';
  const rows=items.map(x=>{
    const fixed=x._kind==='expense'&&x.recurring&&x.paymentId;
    const edit=x._kind==='income'?'editIncome':fixed?'editStatementFixedPayment':'editExpense';
    const del=x._kind==='income'?'delIncome':fixed?'delFixedPaymentExact':'delExpense';
    const rid=fixed?x.paymentId:x.id;
    const refund=x._kind==='expense'&&isCardRefund(x),label=x._kind==='income'?'GELİR':refund?'İADE':esc(x.category||'DİĞER'),color=x._kind==='income'||refund?'var(--green)':'var(--red)',sign=x._kind==='income'||refund?'+':'-';
    return `<div class="item"><div class="ico premiumIco">${x._kind==='income'?premiumIcon('income',22):catPremiumIcon(x.category)}</div><div><b>${esc(x.title)}</b><small>${x.date} · ${label}${fixed?' · ÖDENDİ':''}</small></div><div class="reportMoveRight"><b style="color:${color}">${sign}${money(Math.abs(x.amount))}</b><div><button data-action="${edit}" data-direct-edit="1" data-id="${rid}">DETAY</button><button class="danger" data-action="${del}" data-id="${rid}">SİL</button></div></div></div>`;
  }).join('');
  return `<div class="summaryDetailBox"><div class="summaryDetailHead"><small>${m}</small><h2>${kind==='income'?money(T.i):kind==='expense'?money(T.e):money(T.r)}</h2><b>${title}</b></div>${kind==='remain'?`<div class="summaryBreakdown"><span>Gelir <b style="color:var(--green)">${money(T.i)}</b></span><span>Gider <b style="color:var(--red)">${money(T.e)}</b></span><span>Kalan <b style="color:var(--gr)">${money(T.r)}</b></span></div>`:''}<div class="list">${rows||'<div class="notice">KAYIT YOK.</div>'}</div></div>`
}



const b64=a=>{let s='';for(const b of new Uint8Array(a))s+=String.fromCharCode(b);return btoa(s)},ub64=s=>{const r=atob(s),a=new Uint8Array(r.length);for(let i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a};
async function derive(p,salt){const m=await crypto.subtle.importKey('raw',enc.encode('HANE|LOCKED|'+p),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function encrypt(st,k){const iv=crypto.getRandomValues(new Uint8Array(12)),data=await crypto.subtle.encrypt({name:'AES-GCM',iv},k,enc.encode(JSON.stringify(st)));return{iv:b64(iv),data:b64(data)}}
async function decrypt(box,k){const p=await crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(box.iv)},k,ub64(box.data));return JSON.parse(dec.decode(p))}
function meta(){try{return JSON.parse(localStorage.getItem(META)||'null')}catch{return null}}
let saveQueue=Promise.resolve();
let storageExclusive=false,storageExclusiveMode='',storageExclusiveWaiters=[];
function cloneStateSnapshot(v){try{return structuredClone(v)}catch{return JSON.parse(JSON.stringify(v))}}
function bindFinanceCoreState(){if(state&&window.HANE_CORE?.attachFinanceState)window.HANE_CORE.attachFinanceState(state);return state}
function waitForStorageAvailable(){
  if(!storageExclusive)return Promise.resolve();
  return new Promise((resolve,reject)=>storageExclusiveWaiters.push({resolve,reject}));
}
async function beginStorageExclusive(mode='maintenance'){
  while(storageExclusive)await waitForStorageAvailable();
  storageExclusive=true;storageExclusiveMode=mode;
  try{await saveQueue}catch{}
}
function endStorageExclusive(){
  storageExclusive=false;storageExclusiveMode='';
  const waiters=storageExclusiveWaiters.splice(0);
  waiters.forEach(w=>w.resolve());
}
function abortStorageExclusiveWaiters(message){
  const waiters=storageExclusiveWaiters.splice(0);
  waiters.forEach(w=>w.reject(new Error(message||'Depolama işlemi nedeniyle kayıt iptal edildi.')));
}
async function save(){
  await waitForStorageAvailable();
  if(!state)throw new Error('Uygulama verisi hazır değil');
  normalizeFinanceCategoryIds(state);
  recalculateFinanceCore();
  setLockPreviewFromState();
  if(!key)throw new Error('Şifreleme anahtarı hazır değil. Uygulamayı kilitleyip PIN ile tekrar girin.');
  const snapshot=cloneStateSnapshot(state),saveKey=key;
  const write=async()=>{
    const box=await encrypt(snapshot,saveKey);
    try{localStorage.setItem(DATA,JSON.stringify(box))}catch(e){throw new Error('Cihaz depolamasına kayıt yapılamadı')}
    // Central view is volatile/derived; update it only after the encrypted source is safely committed.
    try{window.HANE_CORE?.syncFromHaneState(snapshot)}catch(e){console.warn('HANE volatile central view could not be refreshed',e)}
  };
  const task=saveQueue.then(write,write);
  saveQueue=task.catch(()=>{});
  return task;
}
function recoverStorageTransaction(){
  let tx=null;try{tx=JSON.parse(localStorage.getItem(STORAGE_TXN)||'null')}catch{}
  if(!tx)return;
  try{
    if(tx.oldData==null)localStorage.removeItem(DATA);else localStorage.setItem(DATA,tx.oldData);
    if(tx.oldMeta==null)localStorage.removeItem(META);else localStorage.setItem(META,tx.oldMeta);
  }finally{try{localStorage.removeItem(STORAGE_TXN)}catch{}}
}
function commitEncryptedPair(nextMeta,nextData){
  const oldMeta=localStorage.getItem(META),oldData=localStorage.getItem(DATA);
  const tx=JSON.stringify({oldMeta,oldData,startedAt:new Date().toISOString()});
  try{
    localStorage.setItem(STORAGE_TXN,tx);
    localStorage.setItem(DATA,nextData);
    localStorage.setItem(META,nextMeta);
    localStorage.removeItem(STORAGE_TXN);
  }catch(e){
    try{if(oldData==null)localStorage.removeItem(DATA);else localStorage.setItem(DATA,oldData)}catch{}
    try{if(oldMeta==null)localStorage.removeItem(META);else localStorage.setItem(META,oldMeta)}catch{}
    try{localStorage.removeItem(STORAGE_TXN)}catch{}
    throw new Error('Güvenli kayıt tamamlanamadı; önceki veriler korundu.');
  }
}
const LOCK_PREVIEW='hane_lock_preview_v1';
function setLockPreviewSnapshot(profile={}){try{localStorage.setItem(LOCK_PREVIEW,JSON.stringify({name:profile?.name||'HANE',photo:profile?.photo||'',motto:profile?.motto||'Disiplin bugün, özgürlük yarın.'}))}catch{}}
function setLockPreviewFromState(){if(!state)return;const admin=(state.members||[]).find(m=>m.id==='me'||m.role==='admin')||{};const p=state.profile||{};setLockPreviewSnapshot({...p,name:p.name||admin.name||'HANE',photo:admin.photo||p.photo||'',motto:p.motto||'Disiplin bugün, özgürlük yarın.'})}
function getLockPreview(){try{return JSON.parse(localStorage.getItem(LOCK_PREVIEW)||'null')||{}}catch{return {}}}
async function setup(p,st){const salt=crypto.getRandomValues(new Uint8Array(16)),k=await derive(p,salt),box=await encrypt(st,k);localStorage.setItem(DATA,JSON.stringify(box));localStorage.setItem(META,JSON.stringify({salt:b64(salt)}));setLockPreviewSnapshot(st?.profile||{});key=k;state=normalizeV19(st);bindFinanceCoreState()}
async function unlock(p){const m=meta();if(!m)return false;try{
  const k=await derive(p,ub64(m.salt)),st=await decrypt(JSON.parse(localStorage.getItem(DATA)),k);
  st.cardPayments=Array.isArray(st.cardPayments)?st.cardPayments:[];
  st.fixedPayments=Array.isArray(st.fixedPayments)?st.fixedPayments:[];
  st.flexTransactions=Array.isArray(st.flexTransactions)?st.flexTransactions:[];
  st.installments=Array.isArray(st.installments)?st.installments:[];
  st.cardTransactions=Array.isArray(st.cardTransactions)?st.cardTransactions:[];
  key=k;state=normalizeV19(st);bindFinanceCoreState();setLockPreviewFromState();localStorage.setItem(META,JSON.stringify({salt:m.salt}));state.selectedMonth=ym(new Date());calendarMonth=state.selectedMonth;calendarDay='';try{window.HANE_CORE?.syncFromHaneState?.(cloneStateSnapshot(state))}catch(e){console.warn('HANE central sync after unlock failed',e)}applyTheme();return true
}catch{return false}}
function def(){return{version:19,selectedMonth:ym(new Date()),profile:{name:'',photo:'',username:'',city:'',job:'',birthDate:'',memberSince:'',motto:'Disiplin, özgürlüğün kapısını açar.'},settings:{lockMinutes:15,leadDays:3,notifications:false,darkMode:true},theme:{bg:'#05080d',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'},incomes:[],expenses:[],cards:[],accounts:[],flexAccounts:[],customCategories:[],categoryMeta:{},cardTransactions:[],cardPayments:[],statementImports:[],statementCategoryRules:{},fixedPayments:[],flexTransactions:[],installments:[],notes:[],work:[],receivables:[],workPayments:[],workRoads:[],workDeductions:[],cashGiven:[],cashManual:[],cashExcluded:[],members:[{id:'me',name:'BEN',icon:'👤'}],homeLayout:['summary','quick','monthly','recent'],homeHidden:[]}}
function applyTheme(sourceTheme=null){if(!state&&!sourceTheme)return;const t=sourceTheme||state?.theme||{},dark=state?.settings?.darkMode!==false;const z={bg:'#05080d',surface:'#0b1118',surface2:'#0f1720',text:'#eef7ff',muted:'#92a3b5',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'};const a={...z,...t};const rgb=h=>{let s=String(h||'').replace('#','').trim();if(s.length===3)s=s.split('').map(c=>c+c).join('');const n=parseInt(s,16);return Number.isFinite(n)?[(n>>16)&255,(n>>8)&255,n&255]:[71,191,255]},rgba=(h,o)=>{const [r,g,b]=rgb(h);return `rgba(${r},${g},${b},${o})`};const root=document.documentElement;root.classList.toggle('lightMode',!dark);root.classList.toggle('darkMode',dark);root.dataset.skin='z';root.style.setProperty('--bg',dark?a.bg:'#f3f1eb');root.style.setProperty('--gold',a.accent);root.style.setProperty('--gold2',a.accent);root.style.setProperty('--gi',a.income);root.style.setProperty('--ge',a.expense);root.style.setProperty('--gr',a.remain);root.style.setProperty('--green',a.income);root.style.setProperty('--red',a.expense);root.style.setProperty('--blue',a.accent);root.style.setProperty('--z-accent',a.accent);root.style.setProperty('--z-accent-soft',a.remain);root.style.setProperty('--theme-accent',a.accent);root.style.setProperty('--theme-income',a.income);root.style.setProperty('--theme-expense',a.expense);root.style.setProperty('--theme-remain',a.remain);root.style.setProperty('--skin-bg',a.bg);root.style.setProperty('--skin-surface',a.surface);root.style.setProperty('--skin-surface-2',a.surface2);root.style.setProperty('--skin-text',a.text);root.style.setProperty('--skin-muted',a.muted);root.style.setProperty('--skin-border',rgba(a.accent,.22));root.style.setProperty('--skin-border-strong',rgba(a.accent,.52));root.style.setProperty('--skin-glow',rgba(a.accent,.18));root.style.setProperty('--skin-active-bg-1',rgba(a.accent,.22));root.style.setProperty('--skin-active-bg-2',rgba(a.accent,.08));root.style.setProperty('--skin-active-text',a.text);root.style.setProperty('--skin-passive-bg-1',a.surface2);root.style.setProperty('--skin-passive-bg-2',a.surface);root.style.setProperty('--skin-passive-text',a.muted);root.style.setProperty('--skin-purple','#a87eff');root.style.setProperty('--skin-purple-soft','rgba(168,126,255,.14)');root.style.setProperty('--icon-active',a.accent);root.style.setProperty('--icon-border',rgba(a.accent,.20));root.style.setProperty('--icon-border-strong',rgba(a.accent,.50));root.style.setProperty('--icon-glow',rgba(a.accent,.16));}
function incomeEntriesForMonth(m=state.selectedMonth){
  return (state?.incomes||[]).filter(x=>String(x.date||'').startsWith(m)).map(x=>({...x,recurring:false,_incomeTemplate:false}));
}
function realizedIncomeEntriesForMonth(m=state.selectedMonth){
  const today=iso();
  return incomeEntriesForMonth(m).filter(x=>String(x.date||'')<=today)
}
function incomeEntriesInRange(start,end){
  const out=[],seen=new Set(),today=iso(),realEnd=String(end||'')>today?today:end;
  if(String(start||'')>today)return out;
  let d=new Date(start+'T12:00:00'),stop=new Date(realEnd+'T12:00:00');
  while(d<=stop){const m=ym(d);if(!seen.has(m)){seen.add(m);realizedIncomeEntriesForMonth(m).forEach(x=>{if(x.date>=start&&x.date<=realEnd)out.push(x)})}d=new Date(d.getFullYear(),d.getMonth()+1,1,12)}
  return out
}
// S10: 'Diğer' giderleri özet/grafiklerde açıklama-işyeri adına göre ayrı gruplandırılır; veri kategorisi değiştirilmez.
function isOtherCategory(v){return !String(v||'').trim()||roadText(v)==='DIGER'}
function otherExpenseName(x){const raw=String(x?.baseTitle||x?.title||'').trim();return raw||'İsimsiz Gider'}
function expenseCategoryGroup(x){
  const raw=isOtherCategory(x?.category)?otherExpenseName(x):(x?.category||'Diğer');
  if(isRoadFee({...x,type:'expense'}))return 'Ulaşım';
  if(['Kira','Aidat'].includes(raw))return 'Konut';
  if(['Faturalar','İnternet','Elektrik','Su','Doğalgaz','Cep Telefonu'].includes(raw))return 'Faturalar';
  return raw
}
function expenseCategoryDisplay(x){return expenseCategoryGroup(x)}
function financeMonthSnapshot(m=state.selectedMonth){
  const incomes=realizedIncomeEntriesForMonth(m),expenses=actualExpenseEntriesForMonth(m);
  const incomeTotal=incomes.reduce((n,x)=>n+(+x.amount||0),0),expenseTotal=expenses.reduce((n,x)=>n+(+x.amount||0),0);
  const byCategory={};expenses.forEach(x=>{const k=expenseCategoryGroup(x);byCategory[k]=(byCategory[k]||0)+(+x.amount||0)});
  const bySource={cash:0,card:0,flex:0};expenses.forEach(x=>{const k=x.source==='card'?'card':x.source==='flex'?'flex':'cash';bySource[k]+=(+x.amount||0)});
  return {month:m,incomes,expenses,incomeTotal,expenseTotal,remaining:incomeTotal-expenseTotal,byCategory,bySource}
}
function totals(m=state.selectedMonth){const f=financeMonthSnapshot(m);return{i:f.incomeTotal,e:f.expenseTotal,r:f.remaining}}
function cashFlow(m=state.selectedMonth){
  const actual=actualExpenseEntriesForMonth(m),spent=actual.reduce((a,x)=>a+(+x.amount||0),0);
  const directPaid=actual.filter(x=>x.source!=='card').reduce((a,x)=>a+(+x.amount||0),0);
  const cardPaid=(state.cardPayments||[]).filter(x=>String(x.date||'').startsWith(m)).reduce((a,x)=>a+(+x.amount||0),0);
  return{spent,paid:directPaid+cardPaid,directPaid,cardPaid}
}
function paymentSourceStats(m=state.selectedMonth){
  const items=actualExpenseEntriesForMonth(m),cash=items.filter(x=>x.source!=='card'&&x.source!=='flex'),card=items.filter(x=>x.source==='card'),flex=items.filter(x=>x.source==='flex');
  const sum=a=>a.reduce((n,x)=>n+(+x.amount||0),0),cashTotal=sum(cash),cardTotal=sum(card),flexTotal=sum(flex),total=cashTotal+cardTotal+flexTotal;
  return{cash,card,flex,cashTotal,cardTotal,flexTotal,total}
}
function paymentSourceSummary(){
  const s=paymentSourceStats(),pct=v=>s.total?Math.round(v/s.total*100):0;
  const tile=(key,label,total,items,icon)=>`<button class="paySourceTile ${key}" data-action="paymentSourceDetail" data-source="${key}"><span class="paySourceTop"><i>${icon}</i><small>${label}</small></span><b>${money(total)}</b><span class="paySourceMeta"><em>${pct(total)}%</em>${items.length} HAREKET ›</span><span class="paySourceBar"><i style="width:${pct(total)}%"></i></span></button>`;
  return `<div class="paymentDistTotal"><span><small>TOPLAM HARCAMA</small><b>${money(s.total)}</b></span><small>${s.cash.length+s.card.length+s.flex.length} HAREKET</small></div><div class="paySummaryGrid paySummaryGrid3">${tile('cash','NAKİT',s.cashTotal,s.cash,'₺')}${tile('card','KREDİ KARTI',s.cardTotal,s.card,'▣')}${s.flex.length||s.flexTotal?tile('flex','ESNEK HESAP',s.flexTotal,s.flex,'↔'):''}</div>`
}
function paymentSourceDetailBody(source){
  const s=paymentSourceStats(),map={card:['KREDİ KARTI',s.card,s.cardTotal],cash:['NAKİT',s.cash,s.cashTotal],flex:['ESNEK HESAP',s.flex,s.flexTotal]},[label,raw,total]=map[source]||map.cash,all=s.total,pct=all?Math.round(total/all*100):0;
  const groups={};raw.forEach(x=>{const cat=expenseCategoryGroup(x)||'Diğer';(groups[cat]||(groups[cat]=[])).push(x)});
  const rows=Object.entries(groups).map(([cat,items])=>[cat,items.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0),items.length]).sort((a,b)=>b[1]-a[1]);
  return `<div class="paySourceDetail"><div class="reportMetricTotal"><small>${label}</small><b>${money(total)}</b><span>%${pct} · ${raw.length} HAREKET · ${rows.length} KATEGORİ</span></div><div class="list">${rows.map(([cat,amt,count])=>`<button class="item" data-action="fixedCategoryDetail" data-cat="${esc(cat)}" data-scope="period" data-source="${source}"><div class="ico premiumIco">${catPremiumIcon(cat)}</div><div><b>${esc(cat)}</b><small>${count} HARCAMA · AYRINTI ›</small></div><div class="right"><b>${money(amt)}</b></div></button>`).join('')||'<div class="notice">KAYIT YOK.</div>'}</div></div>`
}
function statementPeriodRange(card,m){
  const [y,mo]=String(m||state.selectedMonth).split('-').map(Number),cut=Math.max(1,Math.min(31,Number(card?.statementDay)||1));
  const endDay=Math.min(cut,new Date(y,mo,0).getDate()),end=`${y}-${String(mo).padStart(2,'0')}-${String(endDay).padStart(2,'0')}`;
  const py=mo===1?y-1:y,pm=mo===1?12:mo-1,prevDay=Math.min(cut,new Date(py,pm,0).getDate()),prev=new Date(py,pm-1,prevDay,12),startD=new Date(prev);startD.setDate(startD.getDate()+1);
  const start=`${startD.getFullYear()}-${String(startD.getMonth()+1).padStart(2,'0')}-${String(startD.getDate()).padStart(2,'0')}`;
  return{start,end,label:`${new Date(start+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR')} – ${new Date(end+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR')}`}
}
function cardStatementItems(cardId,m){
  const c=state.cards.find(x=>x.id===cardId);if(!c)return[];const r=statementPeriodRange(c,m),inside=d=>String(d||'')>=r.start&&String(d||'')<=r.end;
  const expenses=(state.expenses||[]).filter(x=>!x.recurring&&x.source==='card'&&x.cardId===cardId&&inside(x.date)).map(x=>({kind:isCardRefund(x)?'refund':'spend',id:x.id,date:x.date,title:x.title,category:x.category,amount:+(x.actualAmount??x.amount)||0,installmentNo:x.installmentNo||null,installmentCount:x.installmentCount||null,totalAmount:x.totalAmount||null,action:'editExpense'}));
  const fixed=[].map(p=>({kind:'fixed',id:p.id,date:p.date,title:p.title||'GİDER',category:p.category,amount:+(p.actualAmount??p.amount)||0,action:'editStatementFixedPayment'}));
  const pays=(state.cardPayments||[]).filter(p=>p.cardId===cardId&&inside(p.date)).map(p=>({kind:'payment',id:p.id,date:p.date,title:'KART ÖDEMESİ',category:'Ödeme',amount:+p.amount||0,action:'editCardPayment'}));
  return [...expenses,...fixed,...pays].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
}
function cardStatementBody(cardId,m=cardStatementMonth||state.selectedMonth){
  const c=state.cards.find(x=>x.id===cardId);if(!c)return '<div class="notice">KART BULUNAMADI.</div>';
  const period=statementPeriodRange(c,m),items=cardStatementItems(cardId,m),purchases=items.filter(x=>x.kind==='spend'||x.kind==='fixed').reduce((n,x)=>n+Math.max(0,x.amount),0),refunds=items.filter(x=>x.kind==='refund').reduce((n,x)=>n+Math.abs(x.amount),0),paid=items.filter(x=>x.kind==='payment').reduce((n,x)=>n+x.amount,0),snap=statementSnapshot(cardId,m),bankSpend=snap&&Number.isFinite(+snap.spendingTotal)?+snap.spendingTotal:null,bankRefunds=snap&&Number.isFinite(+snap.refundsTotal)?Math.max(0,+snap.refundsTotal):refunds,bankDebt=snap&&snap.periodDebt!=null&&Number.isFinite(+snap.periodDebt)?+snap.periodDebt:null,prev=snap&&Number.isFinite(+snap.previousBalance)?+snap.previousBalance:null,fees=snap&&Number.isFinite(+snap.feesTotal)?+snap.feesTotal:0,bankPays=snap&&Number.isFinite(+snap.paymentsTotal)?+snap.paymentsTotal:null,haneNet=purchases-refunds;
  const foundCount=items.filter(x=>x.kind!=='payment').length,payCount=items.filter(x=>x.kind==='payment').length,diff=bankSpend==null?null:purchases-bankSpend,refundDiff=snap?refunds-bankRefunds:null,calcDebt=prev==null?null:prev+(bankSpend==null?purchases:bankSpend)+fees-(bankPays==null?paid:bankPays)-bankRefunds,debtDiff=bankDebt==null||calcDebt==null?null:calcDebt-bankDebt;
  const bankCount=snap&&Number.isFinite(Number(snap.bankRowCount))?Math.max(0,Math.trunc(Number(snap.bankRowCount))):null;
  const stmtCount=(key)=>{if(bankCount==null)return '-';const v=Number(snap?.[key]);return Number.isFinite(v)&&v>=0&&v<=bankCount?Math.trunc(v):'-'};
  const spendOk=diff==null||Math.abs(diff)<=.01,refundOk=refundDiff==null||Math.abs(refundDiff)<=.01,debtOk=debtDiff==null||Math.abs(debtDiff)<=.01,allOk=spendOk&&refundOk&&debtOk;
  const bankBox=snap?`<div class="statementV60Bank">
    <div class="statementV60BankHead"><span><small>BANKA EKSTRESİ</small><b>${esc(monthLabel(m))}</b></span><span class="statementV60Debt"><small>DÖNEM BORCU</small><b>${bankDebt==null?'—':money(bankDebt)}</b></span></div>
    <div class="statementV60Equation"><div><small>DEVREDEN</small><b>${prev==null?'—':money(prev)}</b></div><div><small>HARCAMALAR</small><b>${bankSpend==null?'—':money(bankSpend)}</b></div><div><small>İADELER</small><b>${money(bankRefunds)}</b></div><div><small>FAİZ / ÜCRET</small><b>${money(fees)}</b></div><div><small>ÖDEMELER</small><b>${bankPays==null?'—':money(bankPays)}</b></div></div>
  </div>
  <div class="statementV60Reconcile">
    <div class="statementV60RecHead"><span><small>HANE ↔ BANKA MUTABAKATI</small><b>${allOk?'TUTARLAR UYUMLU':'KONTROL GEREKİYOR'}</b></span><em class="${allOk?'ok':'warn'}">${allOk?'✓ UYUMLU':'! FARK VAR'}</em></div>
    <div class="statementV60CompareRows">
      <div><span><small>HARCAMA</small><b>${foundCount} DÖNEM HAREKETİ</b></span><span><small>HANE</small><b>${money(purchases)}</b></span><span><small>BANKA</small><b>${bankSpend==null?'—':money(bankSpend)}</b></span><strong class="${spendOk?'ok':'warn'}">${diff==null?'—':spendOk?'✓':money(Math.abs(diff))}</strong></div><div><span><small>İADE</small><b>${items.filter(x=>x.kind==='refund').length} İŞLEM</b></span><span><small>HANE</small><b>${money(refunds)}</b></span><span><small>BANKA</small><b>${money(bankRefunds)}</b></span><strong class="${refundOk?'ok':'warn'}">${refundOk?'✓':money(Math.abs(refundDiff||0))}</strong></div>
      <div><span><small>KART ÖDEMESİ</small><b>${payCount} İŞLEM</b></span><span><small>HANE</small><b>${money(paid)}</b></span><span><small>BANKA</small><b>${bankPays==null?'—':money(bankPays)}</b></span><strong>—</strong></div>
      ${calcDebt!=null&&bankDebt!=null?`<div><span><small>HESAPLANAN BORÇ</small><b>MUTABAKAT</b></span><span><small>HANE</small><b>${money(calcDebt)}</b></span><span><small>BANKA</small><b>${money(bankDebt)}</b></span><strong class="${debtOk?'ok':'warn'}">${debtOk?'✓':money(Math.abs(debtDiff))}</strong></div>`:''}
    </div>
    <div class="statementV60Counts"><span><small>BANKA İŞLEM</small><b>${bankCount==null?'-':bankCount}</b></span><span><small>EŞLEŞEN</small><b>${stmtCount('matchedExistingCount')}</b></span><span><small>YENİ</small><b>${stmtCount('newSpendCount')}</b></span><span><small>FAİZ / MASRAF</small><b>${stmtCount('feeRowCount')}</b></span></div>
  </div>`:`<div class="statementV60Bank haneOnlyStatement"><div class="statementV60BankHead"><span><small>HANE DÖNEM ÖZETİ</small><b>${esc(monthLabel(m))}</b></span><span class="statementV60Debt"><small>GÜNCEL BORÇ</small><b>${money(c.balance)}</b></span></div><div class="statementV60Equation"><div><small>HARCAMA</small><b>${money(purchases)}</b></div><div><small>İADE</small><b>${money(refunds)}</b></div><div><small>KART ÖDEMESİ</small><b>${money(paid)}</b></div><div><small>NET HARCAMA</small><b>${money(haneNet)}</b></div></div><div class="statementV60NoBank">Bu dönem için banka ekstresi henüz okunmadı. Banka mutabakatı, Kartlar ekranındaki <b>Ekstre Oku</b> ile eklenebilir.</div></div>`;
  return `<div class="statementV60"><div class="statementHead statementV60Head"><button data-action="cardStatementShift" data-dir="-1" data-id="${c.id}">‹</button><div><small>EKSTRE DÖNEMİ</small><b>${period.label}</b></div><button data-action="cardStatementShift" data-dir="1" data-id="${c.id}">›</button></div>${bankBox}<div class="statementPrivacyNote statementV60Privacy">🔒 EKSTRE CİHAZDA OKUNUR · BELGE DIŞARI GÖNDERİLMEZ</div><div class="statementV60ListHead"><div><small>DÖNEM HAREKETLERİ</small><b>${items.length} İŞLEM</b></div><span>${money(haneNet)}</span></div><div class="list statementV60List">${items.length?items.map(x=>{const refund=x.kind==='refund',payment=x.kind==='payment',label=payment?'KART ÖDEMESİ':refund?'İADE':x.installmentCount?`TAKSİT ${x.installmentNo||'?'} / ${x.installmentCount}`:x.kind==='fixed'?'GİDER':'HARCAMA',color=payment||refund?'var(--green)':'var(--red)',sign=payment||refund?'−':'+';return `<div class="item statementItem ${refund?'refundItem':''}" data-action="${x.action}" data-id="${x.id}" data-direct-edit="1"><div class="ico premiumIco">${payment?premiumIcon('cards',22):catPremiumIcon(x.category)}</div><div><b>${esc(x.title)}</b><small>${x.date} · ${label}${x.category&&!payment?' · '+esc(x.category):''}</small></div><div class="right"><b style="color:${color}">${sign}${money(Math.abs(x.amount))}</b><small class="tapDetailHint">DÜZENLE / SİL ›</small></div></div>`}).join(''):'<div class="notice">BU EKSTRE DÖNEMİNDE HAREKET YOK.</div>'}</div></div>`
}
function statementMonthFor(card,dateStr){
  const d=new Date(dateStr+'T12:00:00');
  const ref=card.statementDate?new Date(card.statementDate+'T12:00:00'):null;
  const cutDay=ref&&!Number.isNaN(ref.getTime())?ref.getDate():Number(card.statementDay||1);
  const x=new Date(d.getFullYear(),d.getMonth()+(d.getDate()>cutDay?1:0),1);
  return ym(x)
}
function cardPaymentInfo(c,base=new Date()){
  const t=new Date(base.getFullYear(),base.getMonth(),base.getDate());
  let statementDate=rollMonthlyDate(c.statementDate,t);
  let dueDate=rollMonthlyDate(c.dueDate,t);

  if(!statementDate){
    const sd=Math.max(1,Math.min(31,Number(c.statementDay)||1));
    statementDate=new Date(t.getFullYear(),t.getMonth(),Math.min(sd,new Date(t.getFullYear(),t.getMonth()+1,0).getDate()));
    if(statementDate<t)statementDate=new Date(t.getFullYear(),t.getMonth()+1,Math.min(sd,new Date(t.getFullYear(),t.getMonth()+2,0).getDate()));
  }
  if(!dueDate){
    const dd=Math.max(1,Math.min(31,Number(c.dueDay)||1));
    dueDate=new Date(statementDate.getFullYear(),statementDate.getMonth(),Math.min(dd,new Date(statementDate.getFullYear(),statementDate.getMonth()+1,0).getDate()));
    if(dueDate<=statementDate)dueDate=new Date(statementDate.getFullYear(),statementDate.getMonth()+1,Math.min(dd,new Date(statementDate.getFullYear(),statementDate.getMonth()+2,0).getDate()));
  }

  while(dueDate<=statementDate){
    const day=dueDate.getDate();
    const next=new Date(dueDate.getFullYear(),dueDate.getMonth()+1,1);
    next.setDate(Math.min(day,new Date(next.getFullYear(),next.getMonth()+1,0).getDate()));
    dueDate=next;
  }
  return{statementDate,dueDate,days:Math.max(0,Math.ceil((dueDate-t)/86400000)),paymentWindowDays:Math.max(0,Math.ceil((dueDate-statementDate)/86400000))}
}
function rec(){const t=new Date();let best=null;state.cards.forEach(c=>{const info=cardPaymentInfo(c,t),u=(+c.balance||0)/Math.max(1,+c.limit||1),score=info.days-(u>.8?20:u>.6?8:0);if(!best||score>best.score)best={...c,...info,score}});return best}
function buildTopBar(){
  if(current==='home'){const admin=(state.members||[]).find(m=>m.id==='me'||m.role==='admin')||{},adminPhoto=admin.photo||state.profile.photo||'',adminName=admin.name||state.profile.name||'H';return`<div class="top homeTop"><button class="ib premiumTopIcon menuBtn" data-action="openMenu">☰</button><div class="topRight"><button class="ib premiumTopIcon" data-tab="alerts">${premiumIcon('bell',30)}</button><button class="ib premiumTopIcon homeIdentityBtn" data-action="showIdentity" aria-label="HANE Kimlik Kartı">${adminPhoto?`<img src="${adminPhoto}" alt="Admin Profil">`:`<span>${esc(String(adminName)[0]||'H')}</span>`}</button></div></div>`;}
  const t={tara:'HAN · FİNANSAL DENETİM',transactions:'HAREKETLER',fixed:'GİDERLER',cards:'FİNANS',calendar:'TAKVİM',reports:'RAPORLAR',profile:'PROFİL',adminProfile:'ADMIN PROFİLİ',backup:'YEDEKLEME',settings:'AYARLAR',members:'HANE ÜYELERİ',homeEdit:'ANA SAYFAYI DÜZENLE',categories:'KATEGORİLER',theme:'TEMA STÜDYOSU',alerts:'HATIRLATMALAR',about:'HAKKINDA',monthSpent:'BU AY HARCANAN',monthPaid:'AYLIK HESAP',cashMoney:'NAKİT PARA',notes:'NOTLAR',workCenter:'ÇALIŞMA'};
  return`<div class="top"><button class="back" data-action="back">‹</button><div class="brand">${t[current]||'HANE'}</div><div class="topRight"><button class="ib premiumTopIcon" data-tab="alerts">${premiumIcon('bell',28)}</button><button class="ib premiumTopIcon" data-tab="settings">${premiumIcon('settings',28)}</button></div></div>`
}
function nav(){return`<nav class="nav premiumNav v1947CleanNav">${HANE_UI.nav.map(x=>`<button data-tab="${x.tab}" class="${current===x.tab?'active':''}"><span class="navIcon">${premiumIcon(x.icon,30)}</span><span>${x.label}</span></button>`).join('')}</nav>`}
function menuBody(){const a=[['home','home','ANA SAYFA'],['transactions','transactions','HAREKETLER'],['fixed','expense','GİDERLER'],['cards','cards','KARTLAR / ESNEK HESAP'],['calendar','fixed','TAKVİM'],['workCenter','calendar','ÇALIŞMA'],['members','profile','HANE ÜYELERİ'],['categories','settings','KATEGORİLER'],['theme','settings','TEMA STÜDYOSU'],['reports','report','RAPORLAR'],['tara','report','HAN · DENETİM'],['backup','backup','YEDEKLEME'],['settings','settings','AYARLAR']];return `<div class="menuList">${a.map(x=>`<button data-action="menuGo" data-go="${x[0]}"><i>${premiumIcon(x[1],24)}</i><b>${x[2]}</b><span>›</span></button>`).join('')}</div>`}

function monthLabel(m=state.selectedMonth){const [y,mo]=m.split('-').map(Number);return new Date(y,mo-1,1).toLocaleDateString('tr-TR',{month:'long',year:'numeric'}).toLocaleUpperCase('tr-TR')}
function monthShiftValue(m,delta){const [y,mo]=String(m||ym(new Date())).split('-').map(Number),d=new Date(y,mo-1+delta,1);return ym(d)}
function monthNavigator(){return `<div class="monthNavigator"><button type="button" data-action="monthPrev">‹</button><b>${monthLabel(state.selectedMonth)}</b><button type="button" data-action="monthNext">›</button><button type="button" class="monthToday" data-action="monthToday">BUGÜN</button></div>`}
function dateForSelectedMonth(baseDate,m=state.selectedMonth){const src=new Date(String(baseDate||iso())+'T12:00:00'),[y,mo]=m.split('-').map(Number),day=Number.isNaN(src.getTime())?1:src.getDate(),last=new Date(y,mo,0).getDate();return `${m}-${String(Math.min(day,last)).padStart(2,'0')}`}
function categoryStats(items){const map={};items.forEach(x=>{const k=expenseCategoryGroup(x);map[k]=(map[k]||0)+(+x.amount||0)});return Object.entries(map).sort((a,b)=>b[1]-a[1])}
function roadText(v){return String(v||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C')}
function isRoadFee(x){if(!x||x.type!=='expense')return false;const t=roadText(x.title),c=roadText(x.category);return t.includes('YOL UCRET')||c.includes('YOL UCRET')||(t.includes('YOL')&&(c==='ULASIM'||c.includes('YOL')))}
function roadFeeItemsForDate(date){return (state?.expenses||[]).filter(x=>!x.recurring&&String(x.date||'')===String(date||'')&&isRoadFee({...x,type:'expense'})).sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'tr'))}
function roadFeeGroupBody(date){const items=roadFeeItemsForDate(date),total=items.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0),cash=items.filter(x=>x.source!=='card').reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0),card=items.filter(x=>x.source==='card').reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);return `<div class="roadFeeGroupDetail"><div class="roadFeeGroupHero"><div><small>${esc(date||'')}</small><h2>YOL ÜCRETLERİ</h2><span>${items.length} HAREKET</span></div><strong>${money(total)}</strong></div><div class="roadFeeMiniGrid"><div><small>NAKİT</small><b>${money(cash)}</b></div><div><small>KREDİ KARTI</small><b>${money(card)}</b></div></div><div class="section"><b>AYRINTILAR</b><span>DÜZENLE / SİL</span></div><div class="list">${items.map(x=>{const cardObj=x.cardId?state.cards.find(c=>c.id===x.cardId):null,pay=x.source==='card'?`KREDİ KARTI${cardObj?' · '+esc(cardObj.bank)+' '+esc(cardObj.name):''}`:'NAKİT';return `<div class="item roadFeeDetailItem" data-action="editExpense" data-id="${x.id}"><div class="ico premiumIco">${catPremiumIcon(x.category||'Ulaşım')}</div><div><b>${esc(x.title||'YOL ÜCRETİ')}</b><small>${esc(pay)}</small></div><div class="right"><b style="color:var(--red)">-${money(x.actualAmount??x.amount)}</b><small class="tapDetailHint">AYRINTI ›</small></div></div>`}).join('')}</div></div>`}
function monthSpent(){
  const m=state.selectedMonth,items=actualExpenseEntriesForMonth(m).sort((a,b)=>String(b.date).localeCompare(String(a.date))),total=items.reduce((a,x)=>a+(+x.amount||0),0),cats=categoryStats(items),palette=['#ff4658','#d8ad4f','#278ff5','#19d77d','#a86ef7','#ff8c42','#6ed4ff','#f06dad'];
  let acc=0;const segs=cats.map((x,i)=>{const p=total?x[1]/total*100:0,st=acc;acc+=p;return`${palette[i%palette.length]} ${st}% ${acc}%`}).join(','),avg=total/Math.max(1,new Date(+m.slice(0,4),+m.slice(5,7),0).getDate());
  return`<div class="monthDetailPage"><div class="detailHero card"><div><small>${monthLabel(m)}</small><h2>${money(total)}</h2><span>TOPLAM HARCAMA</span></div><div class="detailDonut" style="background:${total?`conic-gradient(${segs})`:'#151515'}"><div><b>${items.length}</b><small>İŞLEM</small></div></div></div><div class="detailMiniGrid"><div class="detailMini"><i>◷</i><span>GÜNLÜK ORTALAMA</span><b>${money(avg)}</b></div><div class="detailMini"><i>▦</i><span>KATEGORİ SAYISI</span><b>${cats.length}</b></div></div><div class="section"><b>KATEGORİLER</b><span></span></div><div class="detailCategoryList">${cats.length?cats.map((x,i)=>{const p=total?Math.round(x[1]/total*100):0;return`<div class="detailCat"><div class="detailCatIcon">${catPremiumIcon(x[0])}</div><div class="detailCatMid"><div><b>${esc(x[0])}</b><span>%${p}</span></div><div class="detailBar"><i style="width:${p}%;background:${palette[i%palette.length]}"></i></div></div><strong>${money(x[1])}</strong></div>`}).join(''):'<div class="notice">BU AY HARCAMA YOK.</div>'}</div><div class="section"><b>HARCAMALAR</b><span>${items.length} İŞLEM</span></div><div class="list detailTxList">${items.length?items.map(x=>{const fixed=x.recurring&&x.paymentId,action=fixed?'editStatementFixedPayment':'editExpense',rid=fixed?x.paymentId:x.id;return `<div class="item" data-action="${action}" data-direct-edit="1" data-id="${rid}"><div class="ico premiumIco">${catPremiumIcon(x.category)}</div><div><b>${esc(x.title)}</b><small>${x.date} · ${isCardRefund(x)?'İADE · ':''}${esc(expenseCategoryDisplay(x))}</small></div><div class="right"><b style="color:${isCardRefund(x)?'var(--green)':'var(--red)'}">${isCardRefund(x)?'+':'-'}${money(Math.abs(x.amount))}</b></div></div>`}).join(''):'<div class="notice">BU AY HARCAMA YOK.</div>'}</div></div>`
}
function monthPaid(){
  const m=state.selectedMonth,items=actualExpenseEntriesForMonth(m),groups=categoryStats(items),total=items.reduce((n,x)=>n+(+x.amount||0),0);
  const rows=groups.map(([cat,amt])=>{const count=items.filter(x=>expenseCategoryGroup(x)===cat).length;return `<button type="button" class="monthlyLedgerRow monthlyCategoryRow" data-action="fixedCategoryDetail" data-cat="${esc(cat)}"><span class="monthlyLedgerIcon">${catPremiumIcon(cat)}</span><span class="monthlyLedgerInfo"><b>${esc(cat)}</b><small>${count} HARCAMA · AYRINTILAR İÇİN DOKUN</small></span><strong>${money(amt)}</strong><span class="monthlyCategoryChevron">›</span></button>`}).join('');
  return `<div class="monthlyLedgerPage">${monthNavigator()}<div class="monthlyLedgerHead"><div><small>${monthLabel(m)}</small><b>AYLIK HESAP</b></div><strong>${money(total)}</strong><span>TOPLAM GİDER</span></div><div class="monthlyLedgerList monthlyCategoryDirectList">${rows||'<div class="monthlyLedgerEmpty">BU AY GİDER KAYDI YOK.</div>'}</div>${groups.length?`<div class="monthlyLedgerTotal"><span>AY TOPLAMI<small>${groups.length} KATEGORİ · ${items.length} HARCAMA</small></span><strong>${money(total)}</strong></div>`:''}</div>`
}
function recentMovementsHome(limit=12){
  const m=state.selectedMonth;
  const incomes=realizedIncomeEntriesForMonth(m).map(x=>({...x,_recentKind:'income'}));
  const today=iso();
  const expenses=actualExpenseEntriesForMonth(m).filter(x=>String(x.date||'')<=today).map(x=>({...x,_recentKind:x._workRoad?'workRoad':'expense'}));
  const cardPays=(state.cardPayments||[]).filter(x=>String(x.date||'').startsWith(m)).map(x=>({...x,_recentKind:'cardPayment'}));
  const rows=[...incomes,...expenses,...cardPays].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.id||'').localeCompare(String(a.id||''))).slice(0,limit);
  const html=rows.map(x=>{let action='editExpense',rid=x.id,label='GİDER',sign='-',color='var(--red)',ico=catPremiumIcon(x.category||'Diğer');if(x._recentKind==='income'){action='editIncome';label='GELİR';sign='+';color='var(--green)';ico=premiumIcon('income',22)}else if(x._recentKind==='fixed'){action='editFixedPayment';rid=x.expenseId||x.id;label='GİDER';ico=catPremiumIcon(x.category||'Diğer')}else if(x._recentKind==='cardPayment'){action='editCardPayment';label='KART ÖDEMESİ';sign='';color='var(--gold2)';ico=premiumIcon('cards',22)}const card=x.cardId?state.cards.find(c=>c.id===x.cardId):null;const pay=(x._recentKind==='expense'||x._recentKind==='fixed')?(x.source==='card'?'KART'+(card?' · '+esc(card.name):''):'NAKİT'):'';return `<div class="item recentHomeItem" data-action="${action}" data-id="${rid}"><div class="ico premiumIco">${ico}</div><div><b>${esc(x._recentKind==='expense'?expenseCategoryDisplay(x):(x.title||label))}</b><small>${x.date||''} · ${label}${pay?' · '+pay:''}</small></div><div class="right"><b style="color:${color}">${sign}${money(x.amount)}</b><small class="tapDetailHint">AYRINTI ›</small></div></div>`}).join('');
  return `<div class="section"><b>SON HAREKETLER</b><button class="sectionLinkBtn" data-tab="transactions">TÜMÜ ›</button></div><div class="list recentHomeList">${html||'<div class="notice">BU AY HAREKET YOK.</div>'}</div>`;
}
function monthlyAccountPreview(limit=4){
  const m=state.selectedMonth;
  const card=(state.cardPayments||[]).filter(x=>String(x.date||'').startsWith(m)).map(x=>{const c=state.cards.find(z=>z.id===x.cardId);return {...x,displayTitle:c?`${c.bank} · ${c.name||'KREDİ KARTI'}`:(x.title||'KREDİ KARTI ÖDEMESİ')}});
  const normal=(state.expenses||[]).filter(x=>!x.recurring&&x.source!=='card'&&String(x.date||'').startsWith(m)&&x.paid===true).map(x=>({...x,amount:+(x.actualAmount??x.amount??0)||0,displayTitle:expenseCategoryGroup(x)}));
  const fixed=[].map(x=>{const e=state.expenses.find(z=>z.id===x.expenseId);return {...x,amount:+(x.actualAmount??x.amount??0)||0,displayTitle:expenseCategoryGroup({...e,...x})}});
  const flex=(state.flexTransactions||[]).filter(x=>x.kind==='pay'&&String(x.date||'').startsWith(m)).map(x=>{const f=state.flexAccounts.find(z=>z.id===x.flexId);return {...x,displayTitle:x.title||(f?`${f.bank} · ${f.name||'ESNEK HESAP'}`:'ESNEK HESAP ÖDEMESİ')}});
  const all=[...card,...normal,...fixed,...flex].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))),total=all.reduce((n,x)=>n+(+x.amount||0),0);
  // Ana Sayfa Aylık Hesap önizlemesinde aynı isimli ödemeleri tek satırda birleştir.
  // Gerçek hareketler değişmez; yalnızca önizleme gruplaması yapılır.
  const groupedMap=new Map();
  all.forEach(x=>{
    const title=String(x.displayTitle||'ÖDEME').trim()||'ÖDEME';
    const key=title.toLocaleUpperCase('tr-TR').replace(/\s+/g,' ');
    const g=groupedMap.get(key)||{displayTitle:title,amount:0,count:0};
    g.amount+=(+x.amount||0);g.count++;groupedMap.set(key,g);
  });
  const grouped=[...groupedMap.values()].sort((a,b)=>b.amount-a.amount||a.displayTitle.localeCompare(b.displayTitle,'tr'));
  const rows=grouped.slice(0,limit).map(x=>`<div class="monthlyPreviewRow"><span>${esc(x.displayTitle)}${x.count>1?` <small>(${x.count})</small>`:''}</span><b>${money(x.amount)}</b></div>`).join('');
  return `<button type="button" class="monthlyPreviewHead" data-tab="monthPaid"><span><small>${monthLabel(m)}</small><b>AYLIK HESAP</b></span><em>TÜMÜ ›</em></button><div class="monthlyPreviewRows" data-tab="monthPaid">${rows||'<div class="monthlyPreviewEmpty">BU AY ÖDEME KAYDI YOK.</div>'}</div><button type="button" class="monthlyPreviewTotal" data-tab="monthPaid"><span>AY TOPLAMI</span><strong>${money(total)}</strong></button>`;
}
function home(){const T=totals();return`<button type="button" class="homeHero homeIdentityButton" data-action="showIdentity" aria-label="HANE kimlik kartını aç">
  <div class="homeHeroAvatar ava">${state.profile.photo?`<img src="${state.profile.photo}">`:esc((state.profile.name||'H')[0])}</div>
  <div class="homeHeroText"><small>MERHABA</small><h2>${esc(state.profile.name||'HANE')}</h2><div class="date">${new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric',weekday:'long'})}</div></div>
  <div class="homeHeroBrand" aria-hidden="true">${haneLogo(54,'homeHeroBrandMark')}</div>
</button>
<div class="homeFinancePanel" data-home-month-swipe="1"><div class="homeFinanceMonth">${monthLabel(state.selectedMonth)}</div><div class="homeSummaryNav"><button class="sum" data-action="homeSummaryNav" data-kind="income"><label>Gelir</label><strong style="color:var(--green)">${money(T.i)}</strong></button><button class="sum" data-action="homeSummaryNav" data-kind="expense"><label>Gider</label><strong style="color:var(--red)">${money(T.e)}</strong></button><button class="sum" data-action="homeSummaryNav" data-kind="remain"><label>Kalan</label><strong style="color:var(--gr)">${money(T.r)}</strong></button></div></div>
<div class="homePrimaryActions"><button data-action="addIncome">${premiumIcon('income',25)}<span>GELİR EKLE</span></button><button data-action="addExpense">${premiumIcon('expense',25)}<span>GİDER EKLE</span></button></div>
<div class="section cleanHomeTitle"><b>HIZLI ERİŞİM</b><span></span></div><div class="card quick premiumQuick v1947Quick cleanQuick"><button data-tab="cashMoney" class="cashQuickButton"><i class="cashQuickIcon">₺</i>NAKİT PARA</button><button data-tab="tara" class="hanQuickButton"><i class="hanQuickLogo"><img src="icons/han-icon.png?v=v65" alt="HAN"></i>HAN</button><button data-action="quickCards" class="homeCardsQuick"><i>${premiumIcon("cards",27)}</i><span>KARTLAR<small>${(()=>{const q=cardPaymentSummary();return q.total?`${q.paid} ödendi · ${q.waiting} bekliyor`:`Kart yok`})()}</small></span>${cardPaymentSummary().waiting?`<em class="homeCardAlert">${cardPaymentSummary().waiting}</em>`:""}</button><button data-tab="transactions"><i>${premiumIcon("transactions",27)}</i>HAREKETLER</button><button data-tab="notes"><i>${premiumIcon("note",27)}</i>NOTLAR</button></div>
<div class="card monthlyPreview">${monthlyAccountPreview()}</div>
${recentMovementsHome(5)}`}

function txAdvancedFilterBody(){
  const cats=['',...new Set([...(C||[]),...(state.customCategories||[])])];
  const members=[{id:'',name:'TÜM ÜYELER'},...(state.members||[])];
  return `<form class="form txAdvancedFilterForm" id="txAdvancedFilterForm">
    ${input('date','Tarih',txDate||'','date')}
    <div class="field"><label>Kategori</label><select name="category"><option value="">TÜM KATEGORİLER</option>${cats.filter(Boolean).map(c=>`<option value="${esc(c)}" ${txCategory===c?'selected':''}>${esc(c)}</option>`).join('')}</select></div>
    <div class="field"><label>Ödeme Kaynağı</label><select name="pay"><option value="">TÜMÜ</option><option value="cash" ${txPay==='cash'?'selected':''}>NAKİT</option><option value="card" ${txPay==='card'?'selected':''}>KART</option><option value="flex" ${txPay==='flex'?'selected':''}>ESNEK HESAP</option></select></div>
    <div class="txAmountRange">${input('min','En Az Tutar',txMin||'','number','step="0.01" min="0"')}${input('max','En Çok Tutar',txMax||'','number','step="0.01" min="0"')}</div>
    <div class="field"><label>Hane Üyesi</label><select name="member">${members.map(m=>`<option value="${esc(m.id)}" ${txMember===m.id?'selected':''}>${esc(m.name)}</option>`).join('')}</select></div>
    <button class="btn gold" type="submit">FİLTREYİ UYGULA</button>
    <button class="btn" type="button" data-action="clearTxFilters">FİLTRELERİ TEMİZLE</button>
  </form>`;
}
function transactions(){
  const m=state.selectedMonth,q=txSearch.trim().toLocaleLowerCase('tr-TR');
  let a=[...realizedIncomeEntriesForMonth(m).map(x=>({...x,type:'income'})),...state.expenses.filter(x=>!x.recurring).map(x=>({...x,type:'expense'})),...[],...(state.cardPayments||[]).map(x=>({...x,type:'cardPayment',source:'card'})),...(state.flexTransactions||[]).map(x=>({...x,type:x.kind==='pay'?'flexPayment':'flexSpend',source:'flex'}))];
  if(!q)a=a.filter(x=>String(x.date||'').startsWith(m));
  if(txFilter==='income')a=a.filter(x=>x.type==='income');else if(txFilter==='expense')a=a.filter(x=>['expense','fixedExpense','flexSpend'].includes(x.type));else if(txFilter==='card')a=a.filter(x=>x.type==='cardPayment'||x.type==='flexPayment');
  if(txDate)a=a.filter(x=>String(x.date||'')===txDate);if(txCategory)a=a.filter(x=>String(x.category||'')===txCategory);if(txPay)a=a.filter(x=>String(x.source||'cash')===txPay);if(txMin!=='')a=a.filter(x=>(+x.amount||0)>=+txMin);if(txMax!=='')a=a.filter(x=>(+x.amount||0)<=+txMax);if(txMember)a=a.filter(x=>String(x.memberId||'me')===txMember);
  if(q)a=a.filter(x=>{const card=state.cards.find(c=>c.id===x.cardId),mem=state.members.find(mm=>mm.id===(x.memberId||'me'));return [x.title,x.category,x.note,x.description,x.date,x.amount,card?.bank,card?.name,mem?.name].some(v=>String(v||'').toLocaleLowerCase('tr-TR').includes(q))});
  const B=(k,l)=>`<button data-action="txFilter" data-filter="${k}" class="${txFilter===k?'active':''}">${l}</button>`;
  const expenseItems=a.filter(x=>['expense','fixedExpense','flexSpend'].includes(x.type)).map(x=>({...x,amount:+(x.actualAmount??x.amount)||0}));
  const catRows=categoryStats(expenseItems).map(([cat,amt])=>{const count=expenseItems.filter(x=>expenseCategoryGroup(x)===cat).length;return `<div class="item searchResultItem movementRow categoryMovementRow" data-action="fixedCategoryDetail" data-cat="${esc(cat)}"><div class="ico premiumIco">${catPremiumIcon(cat)}</div><div class="movementMain"><b>${esc(cat)}</b><small>${count} HARCAMA · ${monthLabel(m)}</small></div><div class="right movementAmount"><b style="color:var(--red)">-${money(amt)}</b><small>›</small></div></div>`}).join('');
  const other=a.filter(x=>!['expense','fixedExpense','flexSpend'].includes(x.type)).sort((x,y)=>String(y.date||'').localeCompare(String(x.date||''))).map(x=>{const income=x.type==='income',pay=x.type==='cardPayment'||x.type==='flexPayment',action=income?'editIncome':x.type==='cardPayment'?'editCardPayment':'editFlexPayment';return `<div class="item searchResultItem movementRow" data-action="${action}" data-id="${x.id}"><div class="ico premiumIco">${income?premiumIcon('income',22):premiumIcon('cards',22)}</div><div class="movementMain"><b>${esc(x.title||(income?'GELİR':'ÖDEME'))}</b><small>${x.date||''} · ${income?'GELİR':'ÖDEME'}</small></div><div class="right movementAmount"><b style="color:${income?'var(--green)':'var(--gold2)'}">${income?'+':''}${money(x.amount)}</b><small>›</small></div></div>`}).join('');
  const body=[catRows,other].filter(Boolean).join('')||'<div class="notice movementEmpty">Eşleşen hareket bulunamadı.</div>';
  return `<div class="movementsPage">${monthNavigator()}<div class="movementSearchRow"><div class="liveTxSearch premiumMovementSearch"><span>⌕</span><input id="txSearch" autocomplete="off" placeholder="Hareketlerde ara..." value="${esc(txSearch)}">${q?'<button type="button" data-action="clearTxSearch">×</button>':''}</div><button type="button" class="txAdvancedBtn ${txDate||txCategory||txPay||txMin||txMax||txMember?'active':''}" data-action="openTxFilters" aria-label="Gelişmiş filtre">${premiumIcon('settings',21)}</button></div><div class="seg movementSeg">${B('all','Tümü')}${B('income','Gelir')}${B('expense','Gider')}${B('card','Ödeme')}</div><div class="movementMeta"><b>${q?'ARAMA SONUÇLARI':monthLabel(m)}</b><span>${a.length} KAYIT</span></div><div class="list movementList monthlyGroupedMovements">${body}</div></div>`
}
function reportMonthRange(months=1){
  const n=Math.max(1,Math.min(12,+months||1)),[y,m]=state.selectedMonth.split('-').map(Number),sd=new Date(y,m-n,1),ed=new Date(y,m,0),start=iso(sd),end=iso(ed);
  return {start,end,label:n===1?monthLabel(state.selectedMonth):`SON ${n} AY`}
}
function fixedCategoryDetail(cat,scope='all',source=''){
  const reportScope=/^report\d+$/.test(scope),n=reportScope?Math.max(1,Math.min(12,+scope.replace('report','')||1)):1;
  const useRange=current==='reports'||scope==='period',range=scope==='period'?periodRange():(reportScope?reportMonthRange(n):(useRange?periodRange():{start:state.selectedMonth+'-01',end:state.selectedMonth+'-31',label:monthLabel(state.selectedMonth)}));
  const items=actualExpenseEntriesInRange(range.start,range.end).filter(x=>expenseCategoryGroup(x)===cat).filter(x=>!source||(source==='cash'?x.source!=='card'&&x.source!=='flex':x.source===source)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const total=items.reduce((n,x)=>n+(+x.amount||0),0);
  return `<div class="fixedCatDetail"><button type="button" class="fixedCatDetailHero fixedCatManageHero" data-action="categoryDetailManage" data-cat="${esc(cat)}"><div><small>${esc(range.label)} · KATEGORİ · DÜZENLE ›</small><h2>${esc(cat)}</h2></div><strong>${money(total)}</strong></button><div class="section"><b>HARCAMALAR</b><span>${items.length} KAYIT</span></div><div class="list">${items.map(x=>`<div class="item" data-action="editExpense" data-id="${esc(x.expenseId||x.id)}"><div class="ico premiumIco">${catPremiumIcon(cat)}</div><div><b>${esc(x.title||cat)}</b><small>${prettyDate(x.date)}${x.source==='card'?(()=>{const c=(state.cards||[]).find(q=>q.id===x.cardId);return c?' · '+esc(c.bank)+' · '+esc(c.name):' · KART'})():' · NAKİT'}</small></div><div class="right"><b>${money(x.amount)}</b><small>›</small></div></div>`).join('')||'<div class="notice">KAYIT YOK.</div>'}</div></div>`
}
function fixed(){
  const m=state.selectedMonth;
  const items=actualExpenseEntriesForMonth(m).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const total=items.reduce((n,x)=>n+(isCardRefund(x)?-Math.abs(+x.amount||0):(+x.amount||0)),0);
  const cats=categoryStats(items.map(x=>({...x,amount:+x.amount||0})));
  const summary=`<div class="expenseSummary"><div><small>TOPLAM GİDER</small><b>${money(total)}</b></div><div><small>İŞLEM</small><b>${items.length}</b></div><div><small>KATEGORİ</small><b>${cats.length}</b></div></div>`;
  const rows=cats.map(([cat,amt])=>{const count=items.filter(x=>expenseCategoryGroup(x)===cat).length;return `<div class="item expenseCenterRow categoryExpenseRow" data-action="fixedCategoryDetail" data-scope="all" data-cat="${esc(cat)}"><div class="ico premiumIco">${catPremiumIcon(cat)}</div><div class="expenseCenterMain"><b>${esc(cat)}</b><small>${count} GİDER · ${monthLabel(m)}</small></div><div class="expenseCenterRight"><b>-${money(amt)}</b><small>AYRINTI ›</small></div></div>`}).join('');
  const panel=`<div class="section expenseSectionHead"><b>GİDERLER</b><button class="miniAddBtn" data-action="addExpense">+ GİDER EKLE</button></div><div class="list expenseCenterList">${rows||'<div class="notice">BU AY GİDER YOK.</div>'}</div>`;
  return `<div class="expensesCenter">${monthNavigator()}${summary}${panel}</div>`;
}
function expenseGroupDetailBody(date,cat){
  const items=state.expenses.filter(x=>!x.recurring&&x.date===date&&(x.category||'Diğer')===cat).sort((a,b)=>String(b.id||'').localeCompare(String(a.id||'')));
  const total=items.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);
  return `<div class="expenseGroupHero"><small>${prettyDate(date)} · ${esc(cat)}</small><b>${money(total)}</b><span>${items.length} işlem</span></div><div class="list expenseCenterList">${items.map(x=>{const card=x.cardId?state.cards.find(c=>c.id===x.cardId):null;return `<div class="item expenseCenterRow" data-action="editExpense" data-direct-edit="1" data-id="${x.id}"><div class="ico premiumIco">${catPremiumIcon(x.category)}</div><div class="expenseCenterMain"><b>${esc(x.title||x.category||'GİDER')}</b><small>${x.source==='card'?'KART'+(card?' · '+esc(card.bank):''):'NAKİT'}</small></div><div class="expenseCenterRight"><b>-${money(+(x.actualAmount??x.amount)||0)}</b><small>DETAY ›</small></div></div>`}).join('')}</div>`;
}


function cardPaymentStatus(c,m=state.selectedMonth){
  const r=statementPeriodRange(c,m),snap=statementSnapshot(c.id,m);
  const hasStatement=!!(snap&&snap.periodDebt!=null&&Number.isFinite(+snap.periodDebt));
  const debt=hasStatement?Math.max(0,+snap.periodDebt):0;
  const end=new Date(r.end+'T12:00:00'),pi=cardPaymentInfo(c,end),due=pi.dueDate;
  const payEnd=new Date(due);payEnd.setHours(23,59,59,999);
  const paid=(state.cardPayments||[]).filter(x=>{
    if(String(x.cardId)!==String(c.id))return false;
    if(x.statementMonth)return String(x.statementMonth)===String(m);
    const dt=new Date(String(x.date||'')+'T12:00:00');
    return !Number.isNaN(dt.getTime())&&dt>end&&dt<=payEnd;
  }).reduce((n,x)=>n+(+x.amount||0),0);
  const remaining=Math.max(0,debt-paid),eps=.01;
  let key='none',label='EKSTRE OLUŞMADI';
  if(hasStatement){if(debt<=eps||remaining<=eps){key='paid';label='ÖDENDİ'}else if(paid>eps){key='partial';label='KISMİ ÖDENDİ'}else{key='unpaid';label='ÖDENMEDİ'}}
  return{key,label,debt,paid,remaining,dueDate:due,period:r,hasStatement};
}
function cardPaymentSummary(m=state.selectedMonth){
  const rows=(state.cards||[]).map(c=>cardPaymentStatus(c,m)),count=k=>rows.filter(x=>x.key===k).length;
  return{total:rows.length,paid:count('paid'),partial:count('partial'),unpaid:count('unpaid'),none:count('none'),waiting:count('partial')+count('unpaid')+count('none'),remaining:rows.reduce((n,x)=>n+x.remaining,0)};
}
function cardStatusBadge(st){return `<span class="cardPayStatus ${st.key}">${st.label}</span>`}

function cardStyleKey(v){const s=String(v||'black').toLowerCase();return s==='blackgold'?'black':(['black','gold','titanium','silver','blue','green','burgundy','purple','bej'].includes(s)?s:'black')}
function cards(){
  if(!['cards','accounts','debts'].includes(financeTab))financeTab='cards';
  const panel=financeTab==='accounts'?accountsPanel():financeTab==='debts'?debtsPanel():cardsPanel();
  const tabs=[['cards','KARTLAR'],['accounts','HESAPLAR'],['debts','BORÇLAR']].map(([k,l])=>`<button class="${financeTab===k?'active':''}" data-action="financeTab" data-finance="${k}">${l}</button>`).join('');
  return `<div class="financeHub"><div class="financeSegmented">${tabs}</div>${panel}</div>`
}
function cardsPanel(){
 if(financeCardIndex>=state.cards.length)financeCardIndex=Math.max(0,state.cards.length-1);
 const n=state.cards.length,c=state.cards[financeCardIndex];
 let stage=[];
 if(n===1)stage=[{i:0,pos:'selected'}];
 else if(n>1){const prev=(financeCardIndex-1+n)%n,next=(financeCardIndex+1)%n;stage=[{i:prev,pos:'prev'},{i:financeCardIndex,pos:'selected'}];if(next!==prev)stage.push({i:next,pos:'next'});}
 const stageHtml=stage.map(o=>premiumHaneCard(state.cards[o.i],o.pos)).join('');
 if(!c)return `<div class="cardsV55Page"><div class="cardsV55Top"><b>KARTLAR</b><button data-action="addCard">+ KART EKLE</button></div><div class="notice">HENÜZ KREDİ KARTI EKLENMEDİ.</div></div>`;
 const pi=cardPaymentInfo(c),available=Math.max(0,(+c.limit||0)-(+c.balance||0)),used=Math.max(0,+c.balance||0),style=cardStyleKey(c.style),shared=sharedCardLimitInfo(c);
 const recent=[
   ...(state.expenses||[]).filter(x=>!x.recurring&&x.source==='card'&&String(x.cardId)===String(c.id)).map(x=>({...x,_kind:'spend',_action:'editExpense'})),
   ...(state.cardPayments||[]).filter(x=>String(x.cardId)===String(c.id)).map(x=>({...x,title:'KART ÖDEMESİ',category:'Ödeme',_kind:'payment',_action:'editCardPayment'}))
 ].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,4);
 const recentHtml=recent.length?recent.map(x=>`<button class="cardsV55Tx" data-action="${x._action}" data-id="${x.id}"><i class="${x._kind}">${x._kind==='payment'?'↙':'↗'}</i><span><b>${esc(x.title||x.category||'HARCAMA')}</b><small>${esc(x.category||'')} · ${prettyDate(x.date)}</small></span><strong class="${x._kind}">${x._kind==='payment'?'+':'-'}${money(Math.abs(+x.amount||0))}</strong><em>›</em></button>`).join(''):'<div class="notice">BU KARTTA HENÜZ HAREKET YOK.</div>';
 return `<div class="cardsV55Page">
   <div class="cardsV55Top"><div><small>FİNANS</small><b>KARTLAR</b></div><button data-action="addCard">+ KART EKLE</button></div>
   <div class="cardsV55Stage" data-card-swipe="1">${stageHtml}</div>
   <div class="cardsV55Nav"><button data-action="cardCarouselStep" data-dir="-1">‹</button><span>${financeCardIndex+1} / ${n} · ${esc(c.bank)}</span><button data-action="cardCarouselStep" data-dir="1">›</button></div>
   ${selectedCardBankStatement(c)}
   <div class="cardsV55Info">
     <div class="cardsV55Bank"><div><small>BANKA / KART</small><b>${esc(c.bank)}</b><span>${esc(c.name||'KREDİ KARTI')} · •••• ${esc(c.last4||'0000')}</span></div><button data-action="editCard" data-id="${c.id}">✎ KARTI DÜZENLE</button></div>
     ${shared?`<div class="cardsV60Shared"><div><small>ORTAK LİMİT · ${esc(shared.group)}</small><b>${money(shared.total)}</b></div><div><small>ORTAK KULLANILAN</small><b class="used">${money(shared.used)}</b></div><div><small>ORTAK KALAN</small><b class="remain">${money(shared.available)}</b></div><span>${shared.count} KART AYNI LİMİTİ PAYLAŞIYOR</span></div>`:''}
     <div class="cardsV55Metrics"><div><small>${shared?'KART ALT LİMİTİ':'KART LİMİTİ'}</small><b>${money(c.limit||0)}</b></div><div><small>KULLANILAN</small><b class="used">${money(used)}</b></div><div><small>${shared?'KARTTA KALAN':'KALAN LİMİT'}</small><b class="remain">${money(available)}</b></div><div><small>HESAP KESİM</small><b>${pi.statementDate.toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR')}</b></div><div><small>SON ÖDEME</small><b>${pi.dueDate.toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR')}</b></div></div>
   </div>
   <div class="cardsV55Actions"><button data-action="cardStatement" data-id="${c.id}"><i>▤</i><span>EKSTRE</span></button><button data-action="cardSpend" data-id="${c.id}"><i>＋</i><span>HARCAMA EKLE</span></button><button data-action="statementImport" data-id="${c.id}"><i>⌁</i><span>EKSTRE OKU</span></button><button data-action="cardPay" data-id="${c.id}"><i>₺</i><span>ÖDEME YAP</span></button></div>
   <div class="cardsV55Recent"><div class="cardsV55SectionTitle"><b>SON İŞLEMLER</b><button data-action="cardMovements" data-id="${c.id}">TÜMÜNÜ GÖR ›</button></div>${recentHtml}</div>
 </div>`
}
function cardStatementSnaps(c){return (state.statementImports||[]).filter(x=>String(x.cardId)===String(c.id)).sort((a,b)=>String(b.month||'').localeCompare(String(a.month||'')))}
function selectedCardStatement(c){const snaps=cardStatementSnaps(c);if(!snaps.length)return null;const wanted=cardStatementMonth&&snaps.find(x=>x.month===cardStatementMonth);return wanted||snaps[0]}
function selectedCardBankStatement(c){
 const snaps=cardStatementSnaps(c),snap=selectedCardStatement(c);if(snap)cardStatementMonth=snap.month||'';
 const debt=snap&&Number.isFinite(+snap.periodDebt)?money(+snap.periodDebt):'—',month=snap?.month?monthLabel(snap.month):'HENÜZ OKUNMADI';
 return `<div class="cardsStatementSwipe" data-statement-swipe="1" data-card-id="${c.id}"><button class="statementArrow" data-action="bankStatementStep" data-id="${c.id}" data-dir="-1" ${snaps.length<2?'disabled':''}>‹</button><button class="cardsV57BankStatement" data-action="cardBankStatement" data-id="${c.id}" data-month="${esc(snap?.month||'')}"><span><small>BANKA EKSTRESİ</small><b>${esc(month)}</b></span><span><small>DÖNEM BORCU</small><b>${debt}</b></span><i>›</i></button><button class="statementArrow" data-action="bankStatementStep" data-id="${c.id}" data-dir="1" ${snaps.length<2?'disabled':''}>›</button></div>`
}
function cardBankStatementBody(cardId,month=''){
 const c=state.cards.find(x=>String(x.id)===String(cardId));if(!c)return '<div class="notice">KART BULUNAMADI.</div>';
 const snaps=cardStatementSnaps(c),snap=(month&&snaps.find(x=>x.month===month))||selectedCardStatement(c);
 if(!snap)return `<div class="notice"><b>${esc(c.bank)} · ${esc(c.name||'KREDİ KARTI')}</b><br>Bu kart için henüz banka ekstresi okunmadı.</div><button class="btn gold" data-action="statementImport" data-id="${c.id}">EKSTRE OKU</button>`;
 const prev=Number.isFinite(+snap.previousBalance)?+snap.previousBalance:null,spend=Number.isFinite(+snap.spendingTotal)?+snap.spendingTotal:null,fees=Number.isFinite(+snap.feesTotal)?+snap.feesTotal:0,pays=Number.isFinite(+snap.paymentsTotal)?+snap.paymentsTotal:null,debt=Number.isFinite(+snap.periodDebt)?+snap.periodDebt:null;
 return `<div class="statementBankSummary simpleBankStatement cardsBankStatementModal"><b>BANKA EKSTRESİ · ${esc(monthLabel(snap.month||state.selectedMonth))}</b><div class="statementEquation"><span><small>DEVREDEN</small><b>${prev==null?'—':money(prev)}</b></span><i>+</i><span><small>HARCAMALAR</small><b>${spend==null?'—':money(spend)}</b></span><i>+</i><span><small>FAİZ / ÜCRET</small><b>${money(fees)}</b></span><i>−</i><span><small>ÖDEMELER</small><b>${pays==null?'—':money(pays)}</b></span><i>=</i><span class="debt"><small>DÖNEM BORCU</small><b>${debt==null?'—':money(debt)}</b></span></div></div><div class="notice">${esc(c.bank)} · ${esc(c.name||'KREDİ KARTI')} · •••• ${esc(c.last4||'0000')}<br>${esc(monthLabel(snap.month||state.selectedMonth))} dönem ekstresi.</div>`
}
function premiumHaneCard(c,pos='selected'){
 const cls=pos==='selected'?'isSelectedCard':`isSideCard is${pos==='prev'?'Prev':'Next'}Card`,style=cardStyleKey(c.style);
 const shared=sharedCardLimitInfo(c);
 return `<button class="premiumHanePhysicalV55 ${cls} style-${esc(style)}" data-action="cardDetail" data-id="${c.id}" data-card-id="${c.id}" aria-label="${esc(c.bank)} ${esc(c.name||'kart')} detayını aç"><span class="premiumHaneCardIdentity"><small>${esc(c.bank||'BANKA')}</small><b>${esc(c.name||'KREDİ KARTI')}</b></span>${shared?`<span class="premiumHaneSharedLimit"><small>ORTAK LİMİT</small><b>${money(shared.total)}</b></span>`:''}</button>`
}
function sharedCardLimitInfo(c){
  const group=String(c?.sharedLimitGroup||'').trim();
  if(!group)return null;
  const members=(state.cards||[]).filter(x=>String(x.sharedLimitGroup||'').trim()===group);
  const total=Math.max(0,...members.map(x=>+x.sharedLimit||0));
  const used=members.reduce((n,x)=>n+Math.max(0,+x.balance||0),0);
  return{group,total,used,available:Math.max(0,total-used),count:members.length};
}
function credit(c){const pi=cardPaymentInfo(c),st=cardPaymentStatus(c),network=esc(c.network||'VISA');return `<div class="credit card luxuryCard clickableCredit haneVerticalCard ${cardStyleKey(c.style)}" data-action="cardDetail" data-id="${c.id}" data-card-id="${c.id}" role="button" tabindex="0"><div class="hvcGlow"></div><div class="hvcPattern"></div><div class="hvcTop"><div class="hvcBrand"><img src="icons/hane-app-icon.png" alt="HANE"><div><strong>HANE</strong><small>HAYATINA DENGE KAT</small></div></div></div><div class="hvcBankRow"><div class="hvcBank"><b>${esc(c.bank)}</b><small>${esc(c.name||'KREDİ KARTI')}</small></div><span class="hvcNetwork">${network}</span></div><div class="hvcChip"></div><div class="hvcDebt"><small>GÜNCEL BORÇ</small><b>${money(c.balance)}</b>${cardStatusBadge(st)}${st.key==='partial'?`<small>${money(st.remaining)} KALDI</small>`:''}${sharedCardLimitInfo(c)?`<small>ORTAK LİMİT · ${esc(sharedCardLimitInfo(c).group)} · KALAN ${money(sharedCardLimitInfo(c).available)}</small>`:""}</div><div class="hvcGrid compact"><div class="statementBox"><small>HESAP KESİM TARİHİ</small><b>${pi.statementDate.toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR')}</b></div><div class="dueBox"><small>SON ÖDEME TARİHİ</small><b>${pi.dueDate.toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR')}</b></div></div><div class="hvcFooter"><span>${esc(c.bank)}</span><small>DOKUN · EKSTRE</small></div></div>`}
function accountsPanel(){return `<div class="section financeSectionHead"><b>HESAPLAR</b><button class="miniAddBtn" data-action="addAccount">+ HESAP EKLE</button></div><div class="financeAccountList">${state.accounts.map(a=>`<div class="financeAccountRow" data-action="editAccount" data-id="${a.id}"><div class="financeAccountIcon">${premiumIcon('finance',22)}</div><div><b>${esc(a.bank)}</b><small>${esc(a.name)} · •••• ${esc(a.last4||'0000')}</small></div><strong>${money(a.balance)}</strong><span>›</span></div>`).join('')||'<div class="notice">HENÜZ HESAP EKLENMEDİ.</div>'}</div>`}
function debtsPanel(){
  const cards=(state.cards||[]).map(c=>({kind:'card',id:c.id,title:`${c.bank} · ${c.name||'KREDİ KARTI'}`,last4:c.last4,amount:+c.balance||0,due:cardPaymentInfo(c).dueDate,action:'cardStatement'}));
  const flex=(state.flexAccounts||[]).map(a=>({kind:'flex',id:a.id,title:`${a.bank} · ${a.name||'ESNEK HESAP'}`,amount:+a.balance||0,due:a.dueDate?new Date(a.dueDate+'T12:00:00'):null,action:'editFlex'}));
  const rows=[...cards,...flex].filter(x=>x.amount>0),total=rows.reduce((n,x)=>n+x.amount,0),max=Math.max(1,...rows.map(x=>x.amount));
  const graph=rows.length?`<div class="debtGraph"><div class="debtGraphTitle"><b>BORÇ DAĞILIMI</b><span>${rows.length} KALEM</span></div>${rows.map(x=>`<div class="debtGraphRow"><span>${esc(x.title)}</span><div><i style="width:${Math.max(3,x.amount/max*100).toFixed(1)}%"></i></div><b>${money(x.amount)}</b></div>`).join('')}</div>`:'';
  return `<div class="financeDebtHero"><small>TOPLAM BORÇ</small><b>${money(total)}</b><span>${rows.length} BORÇ KALEMİ</span></div>${graph}<div class="section financeSectionHead"><b>BORÇLAR</b><span>DETAY İÇİN DOKUN</span></div><div class="financeDebtList">${rows.map(x=>`<div class="financeDebtRow" data-action="${x.action}" data-id="${x.id}"><div><b>${esc(x.title)}</b><small>${x.due&&!Number.isNaN(x.due.getTime())?'SON ÖDEME · '+x.due.toLocaleDateString('tr-TR',{day:'numeric',month:'short'}).toLocaleUpperCase('tr-TR'):x.kind==='flex'?'ESNEK HESAP':'KREDİ KARTI'}${x.last4?' · •••• '+esc(x.last4):''}</small></div><strong>${money(x.amount)}</strong><span>›</span></div>`).join('')||'<div class="notice">AKTİF BORÇ YOK.</div>'}</div>`
}
function flexPanel(){return `<div class="section"><b>ESNEK HESAPLAR</b><button class="miniAddBtn" data-action="addFlex">+ ESNEK HESAP</button></div><div class="financeCarousel flexSameCards">${state.flexAccounts.map(a=>{const available=Math.max(0,(+a.limit||0)-(+a.balance||0));return`<div class="credit card luxuryCard ${cardStyleKey(a.style)} flexCredit" data-flex-id="${a.id}"><div class="haneCardBrand"><img src="icons/hane-app-icon.png" alt="HANE"><div><strong>HANE</strong><small>HAYATINA DENGE KAT</small></div></div><div class="cardTop"><b>${esc(a.bank)}</b><span>ESNEK HESAP</span></div><small class="cardName">${esc(a.name||'ESNEK HESAP')}</small><div class="chip"></div><div class="digits flexLabel">KULLANILABİLİR · ${money(available)}</div><div class="grid"><div><small>TOPLAM LİMİT</small><b>${money(a.limit)}</b></div><div><small>KULLANILAN LİMİT</small><b>${money(a.balance)}</b></div><div><small>HESAP KESİM TARİHİ</small><b>${prettyDate(a.statementDate)}</b></div><div><small>SON ÖDEME TARİHİ</small><b>${prettyDate(a.dueDate)}</b></div></div><div class="cardActions"><button class="btn" data-action="flexSpend" data-id="${a.id}">HARCAMA EKLE</button><button class="btn gold" data-action="flexPay" data-id="${a.id}">ÖDEME YAPTIM</button><button class="iconEdit" data-action="editFlex" data-id="${a.id}">✎</button></div></div>`}).join('')||'<div class="notice">HENÜZ ESNEK HESAP EKLENMEDİ.</div>'}</div>`}
function periodRange(){
  const today=new Date(), selected=state.selectedMonth||ym(today);
  if(reportPeriod==='day'){const d=(selected===ym(today)?iso(today):selected+'-01');return{start:d,end:d,label:'GÜN'}}
  if(reportPeriod==='week'){const base=selected===ym(today)?new Date(today):new Date(selected+'-01T12:00:00'),n=(base.getDay()+6)%7,start=new Date(base);start.setDate(base.getDate()-n);const end=new Date(start);end.setDate(start.getDate()+6);return{start:iso(start),end:iso(end),label:'HAFTA'}}
  const monthCount={month:1,month3:3,month6:6,month12:12}[reportPeriod]||1;
  const [y,m]=selected.split('-').map(Number),sd=new Date(y,m-monthCount,1),ed=new Date(y,m,0);return{start:iso(sd),end:iso(ed),label:monthCount===1?'AY':monthCount+' AY'}
}
function periodTotals(){const r=periodRange(),i=incomeEntriesInRange(r.start,r.end).reduce((a,x)=>a+(+x.amount||0),0),e=actualExpenseEntriesInRange(r.start,r.end).reduce((a,x)=>a+(+x.amount||0),0);return{i,e,r:i-e,range:r}}
function prettyDate(v){if(!v)return '-';const d=new Date(v+'T12:00:00');return Number.isNaN(d.getTime())?esc(v):d.toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}
function calendarItems(date){
 const inc=incomeEntriesForMonth(String(date||'').slice(0,7)).filter(x=>x.date===date).map(x=>({...x,_kind:'income'}));
 const exp=state.expenses.filter(x=>!x.recurring&&x.source!=='flex'&&x.date===date).map(x=>({...x,_kind:'expense'}));
 const fixed=[].map(x=>{const e=state.expenses.find(z=>z.id===x.expenseId);return {...x,title:x.title||e?.title||'GİDER',category:x.category||e?.category||'Sabit',memberId:e?.memberId||x.memberId||'',_kind:'fixedPayment',expenseId:x.expenseId}});
 const cp=(state.cardPayments||[]).filter(x=>x.date===date).map(x=>({...x,_kind:'cardPayment'}));
 const ft=(state.flexTransactions||[]).filter(x=>x.date===date).map(x=>({...x,_kind:x.kind==='pay'?'flexPayment':'flexSpend'}));
 return [...inc,...exp,...fixed,...cp,...ft].sort((a,b)=>String(b.createdAt||b.updatedAt||b.id||'').localeCompare(String(a.createdAt||a.updatedAt||a.id||'')));
}
function calendarDayManageBody(date){
 const items=calendarItems(date);
 const rows=items.map(x=>{
  const isIncome=x._kind==='income', isExpense=x._kind==='expense'||x._kind==='flexSpend';
  const idv=x._kind==='flexSpend'?x.expenseId:x.id;
  const edit=isIncome?'editIncome':isExpense?'editExpense':x._kind==='cardPayment'?'editCardPayment':x._kind==='flexPayment'?'editFlexPayment':x._kind==='fixedPayment'?'editStatementFixedPayment':'zWorkEdit';
  const del=isIncome?'delIncome':isExpense?'delExpense':x._kind==='cardPayment'?'delCardPayment':x._kind==='flexPayment'?'delFlexPayment':'';
  return `<div class="notice calendarDayManageRow"><div><b>${esc(x.title||'KAYIT')}</b><br><small>${esc(x.category||x._kind||'')} · ${money(Math.abs(+x.amount||0))}</small></div><div class="calendarDayManageActions"><button class="btn" data-action="${edit}" data-id="${esc(idv)}">DÜZENLE</button>${del?`<button class="btn danger" data-action="${del}" data-id="${esc(idv)}">SİL</button>`:''}</div></div>`;
 }).join('');
 return `<div class="notice"><b>${new Date(date+'T12:00:00').toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}).toLocaleUpperCase('tr-TR')}</b><br>Bu güne kayıt ekleyebilir veya mevcut kayıtları düzenleyip silebilirsin.</div><div class="calendarAddChoices"><button class="btn gold" data-action="calendarDayAddIncome" data-date="${esc(date)}">+ GELİR</button><button class="btn gold" data-action="calendarDayAddExpense" data-date="${esc(date)}">+ GİDER</button></div><div class="section"><b>GÜN KAYITLARI</b><span>${items.length} kayıt</span></div>${rows||'<div class="notice">BU GÜN KAYIT YOK.</div>'}`
}
function calendar(){
 if(!calendarMonth)calendarMonth=state.selectedMonth||ym(new Date());
 const [y,m]=calendarMonth.split('-').map(Number),first=new Date(y,m-1,1),last=new Date(y,m,0).getDate(),offset=(first.getDay()+6)%7;
 if(!calendarDay||!calendarDay.startsWith(calendarMonth))calendarDay=calendarMonth+'-'+String(Math.min(new Date().getDate(),last)).padStart(2,'0');
 const cells=[];for(let i=0;i<offset;i++)cells.push('<div class="calBlank"></div>');
 for(let d=1;d<=last;d++){
   const ds=calendarMonth+'-'+String(d).padStart(2,'0'),items=calendarItems(ds),future=upcomingPayments().filter(x=>x.date===ds&&!x.paid);
   const stripMap={income:['income','GELİR'],expense:['expense','GİDER'],fixedPayment:['expense','GİDER'],cardPayment:['cardPayment','KART'],flexSpend:['flexSpend','ESNEK'],flexPayment:['flexPayment','ÖDEME']};
   // V51: Normal takvimde aynı renk/tür şeridi bir günde yalnız bir kez gösterilir.
   // Günün tüm işlem ayrıntıları güne dokunulduğunda alttaki detay panelinde görünmeye devam eder.
   const rawFinanceStrips=[...items.map(x=>stripMap[x._kind]||['expense','KAYIT']),...future.map(x=>x.kind==='card'?['cardPayment','KART']:x.kind==='flex'?['flexSpend','ESNEK']:['futurefixed','HATIRLATMA'])];
   const financeStrips=[];
   const usedStripColors=new Set();
   for(const z of rawFinanceStrips){if(usedStripColors.has(z[0]))continue;usedStripColors.add(z[0]);financeStrips.push(z)}
   cells.push(`<button class="calDay financeCalDay ${ds===calendarDay?'active':''}" data-action="calendarDay" data-date="${ds}"><b>${d}</b><span class="financeDayStrips count-${financeStrips.length}">${financeStrips.map(z=>`<i class="financeDayBadge ${z[0]}">${z[1]}</i>`).join('')}</span></button>`)
 }
 const futureDue=upcomingPayments().filter(x=>x.date===calendarDay&&!x.paid);
 const items=calendarItems(calendarDay),income=items.filter(x=>x._kind==='income').reduce((a,x)=>a+(+x.amount||0),0),expense=items.filter(x=>['expense','flexSpend'].includes(x._kind)).reduce((a,x)=>a+(+x.amount||0),0);
 const row=x=>{const map={income:['GELİR','var(--green)','editIncome'],expense:['GİDER','var(--red)','editExpense'],fixedPayment:['GİDER','var(--red)','editStatementFixedPayment'],cardPayment:['KART ÖDEMESİ','#35a7ff','editCardPayment'],flexSpend:['ESNEK HESAP','#b66cff','editExpense'],flexPayment:['ESNEK ÖDEME','#29d3c2','editFlexPayment']},refund=x._kind==='expense'&&isCardRefund(x),z=refund?['İADE','var(--green)','editExpense']:map[x._kind]||['KAYIT','var(--z-accent)','zWorkEdit'],idv=x._kind==='fixedPayment'?x.id:x._kind==='flexSpend'?x.expenseId:x.id,c=x.cardId?state.cards.find(q=>q.id===x.cardId):null,member=x.memberId?memberName(x.memberId):'',pay=x._kind==='expense'||x._kind==='fixedPayment'?(x.source==='card'?'KART'+(c?' • '+c.bank+' '+c.name:''):'NAKİT'):'',workMeta='' ;return `<button class="calendarMove calendarMoveTap ${refund?'refund':x._kind}" data-action="${z[2]}" data-id="${idv}" data-direct-edit="1"><i></i><div><b>${esc(x.title||z[0])}</b><small>${z[0]}${workMeta}${x.category?' · '+esc(x.category):''}${pay?' · '+esc(pay):''}${member?' · '+esc(member):''}</small></div><strong style="color:${z[1]}">${x._kind==='income'||refund||x._kind==='receivablePaid'?'+':x._kind==='expense'||x._kind==='flexSpend'?'-':''}${money(Math.abs(x.amount))}</strong><span class="calendarChevron">›</span></button>`};
 const dateObj=new Date(calendarDay+'T12:00:00'),dayTitle=dateObj.toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'}).toLocaleUpperCase('tr-TR'),dayName=dateObj.toLocaleDateString('tr-TR',{weekday:'long'}).toLocaleUpperCase('tr-TR');
 const dailyPanel=`<div class="calendarDayPanel" data-day-panel="1"><div class="calendarDayNav"><button data-action="calendarDayPrev">‹</button><div><b>${dayTitle}</b><small>${dayName}</small></div><button data-action="calendarDayNext">›</button></div><div class="calendarSummary calendarSummary2"><div class="calIncome"><small>GELİR</small><b>${money(income)}</b></div><div class="calExpense"><small>GİDER</small><b>${money(expense)}</b></div></div><div class="calendarMoves">${futureDue.length?futureDue.map(x=>`<div class="calendarMove future${x.kind}"><i></i><div><b>${esc(x.title)}</b><small>HATIRLATMA · ${x.kind==='fixed'?'GİDER':x.kind==='card'?'KART':'ESNEK HESAP'}</small></div><strong>${money(x.amount)}</strong><span class="calendarChevron">›</span></div>`).join(''):''}${items.length?items.map(row).join(''):'<div class="notice">BU GÜN KAYIT YOK.</div>'}</div><button class="calendarAddMain" data-action="calendarAddMenu">＋ KAYIT EKLE</button><div class="calendarSwipeHint">Sağa / sola kaydırarak gün değiştir</div></div>`;
 return `<div class="calendarPage calendarPremium"><div class="calendarHead"><button data-action="calendarPrev">‹</button><b>${new Date(y,m-1,1).toLocaleDateString('tr-TR',{month:'long',year:'numeric'}).toLocaleUpperCase('tr-TR')}</b><button data-action="calendarNext">›</button><button class="calendarTodayBtn" data-action="monthToday">BUGÜN</button></div><div class="calWeek">${['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calGrid">${cells.join('')}</div><div class="calLegend financeStripLegend"><span><i class="financeLegendMark income"></i>Gelir</span><span><i class="financeLegendMark expense"></i>Gider</span><span><i class="financeLegendMark cardPayment"></i>Kart</span><span><i class="financeLegendMark flexSpend"></i>Esnek</span><span><i class="financeLegendMark futurefixed"></i>Hatırlatma</span></div>${dailyPanel}</div>`
}

function cashMoneyGroup(x){
  const raw=String(isOtherCategory(x?.category)?otherExpenseName(x):(x?.category||'')).trim();
  const title=String(x?.title||x?.baseTitle||'').toLocaleLowerCase('tr-TR');
  if(/^kira$/i.test(raw)||((!raw||/^konut$/i.test(raw))&&/\bkira\b/i.test(title)))return 'rent';
  if(/^aidat$/i.test(raw)||((!raw||/^konut$/i.test(raw))&&/\baidat\b/i.test(title)))return 'dues';
  return 'other';
}
function cashMoneyAutoRows(m=state.selectedMonth){
 const excluded=new Set((state.cashExcluded||[]).filter(x=>x.month===m).map(x=>x.key));
 const rows=[];
 // Normal cash expenses: real cash paid at expense date. V101: tüm gerçek nakit giderleri normal Gider kayıtlarından gelir.
 for(const x of (state.expenses||[])){
   if(x.source!=='cash'||!String(x.date||'').startsWith(m))continue;
   const key='expense:'+x.id,cat=String(x.category||expenseCategoryGroup(x)||'Diğer'),group=cashMoneyGroup(x);
   rows.push({key,id:x.id,kind:'expense',group,title:x.title||cat||'NAKİT HARCAMA',date:x.date,amount:+(x.actualAmount??x.amount)||0,excluded:excluded.has(key)});
 }
 // V101: Sabit gider ödeme döngüsü kaldırıldı.
 return rows.filter(x=>x.amount>0).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
}
function cashMoneyTotals(m=state.selectedMonth){
 const given=(state.cashGiven||[]).filter(x=>String(x.date||'').startsWith(m));
 // cashManual eski veri anahtarı geriye uyumluluk için korunur; arayüzde artık sadece EKLENEN KAYITLAR olarak kullanılır.
 const added=(state.cashManual||[]).filter(x=>String(x.date||'').startsWith(m));
 const auto=cashMoneyAutoRows(m),included=auto.filter(x=>!x.excluded);
 const sum=a=>a.reduce((n,x)=>n+(+x.amount||0),0);
 return {given,added,manual:added,auto,givenTotal:sum(given),addedTotal:sum(added),manualTotal:sum(added),rent:sum(included.filter(x=>x.group==='rent')),dues:sum(included.filter(x=>x.group==='dues')),other:sum(included.filter(x=>x.group==='other')),spentTotal:sum(included)+sum(added)};
}
function cashMoneyDetailRows(rows,added=false){
 return `<div class="cashMoneyDetailList">${rows.map(x=>`<div class="cashMoneyDetailRow ${x.excluded?'excluded':''}"><span><b>${esc(x.title||x.description||'NAKİT')}</b><small>${prettyDate(x.date)}</small></span><strong>${money(x.amount)}</strong>${added?`<button class="cashMinus danger" data-action="cashManualDel" data-id="${esc(x.id)}">SİL</button>`:`<button class="cashMinus" data-action="cashToggleInclude" data-key="${esc(x.key)}" data-month="${esc(String(x.date).slice(0,7))}">${x.excluded?'+':'−'}</button>`}</div>`).join('')||'<div class="notice">KAYIT YOK.</div>'}</div>`;
}
function cashMoneyView(m=state.selectedMonth){
 const t=cashMoneyTotals(m),remain=t.givenTotal-t.spentTotal,otherRows=t.auto.filter(x=>x.group==='other'&&!x.excluded),rentRows=t.auto.filter(x=>x.group==='rent'&&!x.excluded),duesRows=t.auto.filter(x=>x.group==='dues'&&!x.excluded);
 return `<div class="cashMoneyPage">${monthNavigator()}<div class="cashMoneyHero"><button><small>VERİLEN</small><b>${money(t.givenTotal)}</b></button><button><small>HARCANAN</small><b>${money(t.spentTotal)}</b></button><button class="result"><small>KALAN NAKİT</small><b>${money(remain)}</b></button></div><div class="cashMoneySection"><div class="reportCardTitle"><b>VERİLEN PARA</b><button data-action="cashGivenAdd">+ PARA EKLE</button></div>${t.given.map(x=>`<div class="cashGivenRow"><span><b>${esc(x.description)}</b><small>${prettyDate(x.date)}</small></span><strong>${money(x.amount)}</strong><button data-action="cashGivenDel" data-id="${esc(x.id)}">SİL</button></div>`).join('')||'<div class="notice">BU AY VERİLEN PARA KAYDI YOK.</div>'}</div><div class="cashMoneySection"><div class="reportCardTitle"><b>HARCANAN PARA</b><button data-action="cashManualAdd">+ KAYIT EKLE</button></div><button class="cashCategoryRow" data-action="cashDetail" data-group="rent"><span>KİRA<small>${rentRows.length} kayıt · sistemden otomatik</small></span><b>${money(t.rent)}</b><i>›</i></button><button class="cashCategoryRow" data-action="cashDetail" data-group="dues"><span>AİDAT<small>${duesRows.length} kayıt · sistemden otomatik</small></span><b>${money(t.dues)}</b><i>›</i></button><button class="cashCategoryRow" data-action="cashDetail" data-group="other"><span>DİĞER NAKİT HARCAMALAR<small>${otherRows.length} kayıt · kira/aidat hariç otomatik</small></span><b>${money(t.other)}</b><i>›</i></button><div class="cashAddedHead"><b>EKLENEN KAYITLAR</b><small>DenizBank, İş Bankası vb. bağımsız kalemler</small></div>${t.added.map(x=>`<div class="cashGivenRow cashAddedRow"><span><b>${esc(x.description)}</b><small>${prettyDate(x.date)}</small></span><strong>${money(x.amount)}</strong><button data-action="cashManualDel" data-id="${esc(x.id)}">SİL</button></div>`).join('')||'<div class="notice">BU AY EKLENEN BAĞIMSIZ KAYIT YOK.</div>'}</div><div class="notice cashMoneyNote">Kira ve Aidat sistemden otomatik olarak kendi ayrı alanlarına gelir. Diğer Nakit Harcamalar bölümüne Kira/Aidat karışmaz; yalnız diğer nakit giderler otomatik eklenir. − ile otomatik bir kayıt yalnız Nakit Para toplamından çıkarılır; asıl gider silinmez.</div></div>`;
}
function cashEntryForm(kind){return `<form class="form" id="${kind==='given'?'cashGivenForm':'cashManualForm'}">${input('description','Açıklama','','text','required')}${input('date','Tarih',iso(),'date','required')}${input('amount','Tutar','','number','step="0.01" min="0.01" required')}<button class="btn gold">KAYDET</button></form>`}
function cashMoney(){return cashMoneyView(state.selectedMonth)}
function reportCompareDetailBody(){
 const m=state.selectedMonth,[yy,mm]=m.split('-').map(Number),pm=ym(new Date(yy,mm-2,1)),cur=totals(m),prev=totals(pm);
 const diff=(a,b)=>a-b,pct=(a,b)=>b?((a-b)/Math.abs(b)*100):0,fp=n=>(n>=0?'+':'')+n.toFixed(1)+'%';
 return `<div class="reportCompareDetail"><div class="reportCompareHead"><small>${monthLabel(m)} ↔ ${monthLabel(pm)}</small><b>GEÇEN AY KARŞILAŞTIRMASI</b></div><div class="reportCompareRows"><div><span>GELİR</span><b class="inc">${money(cur.i)}</b><small>Geçen ay ${money(prev.i)} · ${diff(cur.i,prev.i)>=0?'+':''}${money(diff(cur.i,prev.i))} · ${fp(pct(cur.i,prev.i))}</small></div><div><span>GİDER</span><b class="exp">${money(cur.e)}</b><small>Geçen ay ${money(prev.e)} · ${diff(cur.e,prev.e)>=0?'+':''}${money(diff(cur.e,prev.e))} · ${fp(pct(cur.e,prev.e))}</small></div><div><span>NET</span><b class="net">${money(cur.r)}</b><small>Geçen ay ${money(prev.r)} · ${diff(cur.r,prev.r)>=0?'+':''}${money(diff(cur.r,prev.r))} · ${fp(pct(cur.r,prev.r))}</small></div></div></div>`
}
function reportCardMetricDetailBody(kind){
 const m=state.selectedMonth,monthExpenses=actualExpenseEntriesForMonth(m),title=kind==='spend'?'KART HARCAMALARI':kind==='paid'?'KART ÖDEMELERİ':'FAİZ / VERGİ';
 let rows=[];
 if(kind==='spend') rows=monthExpenses.filter(x=>x.source==='card').map(x=>({title:x.title||x.category||'KART HARCAMASI',date:x.date,amount:+x.amount||0,cardId:x.cardId}));
 else if(kind==='paid') rows=(state.cardPayments||[]).filter(x=>String(x.date||'').startsWith(m)).map(x=>({title:x.title||'KART ÖDEMESİ',date:x.date,amount:+x.amount||0,cardId:x.cardId}));
 else rows=monthExpenses.filter(x=>/faiz|vergi|kkdf|bsmv/i.test((x.category||'')+' '+(x.title||''))).map(x=>({title:x.title||x.category||'FAİZ / VERGİ',date:x.date,amount:+x.amount||0,cardId:x.cardId}));
 const total=rows.reduce((a,x)=>a+(+x.amount||0),0);
 const grouped={};rows.forEach(x=>{const original=monthExpenses.find(e=>e.date===x.date&&Math.abs((+e.amount||0)-(+x.amount||0))<.001&&e.cardId===x.cardId),cat=expenseCategoryGroup(original||x)||'Diğer';(grouped[cat]||(grouped[cat]=[])).push(x)});const grows=Object.entries(grouped).map(([cat,a])=>[cat,a.reduce((n,x)=>n+(+x.amount||0),0),a.length]).sort((a,b)=>b[1]-a[1]);return `<div class="reportMetricDetail"><div class="reportCompareHead"><small>${monthLabel(m)}</small><b>${title}</b></div><div class="reportMetricTotal"><small>TOPLAM</small><b>${money(total)}</b><span>${rows.length} KAYIT</span></div><div class="list">${kind==='spend'?grows.map(([cat,amt,count])=>`<button class="item" data-action="fixedCategoryDetail" data-cat="${esc(cat)}"><div class="ico premiumIco">${catPremiumIcon(cat)}</div><div><b>${esc(cat)}</b><small>${count} KART HARCAMASI · AYRINTI ›</small></div><div class="right"><b>${money(amt)}</b></div></button>`).join(''):rows.map(x=>{const c=(state.cards||[]).find(q=>q.id===x.cardId);return `<div class="item"><div class="ico premiumIco">${premiumIcon('cards',20)}</div><div><b>${esc(x.title)}</b><small>${prettyDate(x.date)}${c?' · '+esc(c.bank)+' · '+esc(c.name):''}</small></div><div class="right"><b>${money(x.amount)}</b></div></div>`}).join('')||'<div class="notice">KAYIT YOK.</div>'}</div></div>`
}
function reports(){
 const diff=(a,b)=>(+a||0)-(+b||0);
 const m=state.selectedMonth;if(reportView==='fixed')reportView='summary';
 const [yy,mm]=m.split('-').map(Number),pm=ym(new Date(yy,mm-2,1)),cur=totals(m),prev=totals(pm);
 const monthExpenses=actualExpenseEntriesForMonth(m),catRange=reportMonthRange(reportCategoryMonths),catExpenses=actualExpenseEntriesInRange(catRange.start,catRange.end),cats={};catExpenses.forEach(x=>{const k=expenseCategoryGroup(x);cats[k]=(cats[k]||0)+(+x.amount||0)});const catRows=Object.entries(cats).sort((a,b)=>b[1]-a[1]),catTotal=catRows.reduce((a,x)=>a+x[1],0)||1;
 const cardSpend=monthExpenses.filter(x=>x.source==='card').reduce((a,x)=>a+(+x.amount||0),0),cardPaid=(state.cardPayments||[]).filter(x=>String(x.date||'').startsWith(m)).reduce((a,x)=>a+(+x.amount||0),0),interestRows=monthExpenses.filter(x=>/faiz|vergi|kkdf|bsmv/i.test((x.category||'')+' '+(x.title||''))),interest=interestRows.reduce((a,x)=>a+(+x.amount||0),0);
 const nav=`<div class="reportModeShell"><div class="reportModeTabs"><button data-action="reportView" data-view="summary" class="${reportView==='summary'?'active':''}">${premiumIcon('report',17)}<span>ÖZET</span></button><button data-action="reportView" data-view="categories" class="${reportView==='categories'?'active':''}"><span class="reportMiniPie">◔</span><span>GİDERLER</span></button><button data-action="reportView" data-view="cards" class="${reportView==='cards'?'active':''}">${premiumIcon('cards',17)}<span>KARTLAR</span></button></div></div>`;
 const head=`<div class="reportDateShell"><button type="button" data-action="monthPrev" class="reportDateArrow">‹</button><b>${monthLabel(m)}</b><button type="button" data-action="monthNext" class="reportDateArrow">›</button><button type="button" data-action="monthToday" class="reportDateToday">BUGÜN</button></div><div class="reportPeriodV97">${[['day','GÜN'],['week','HAFTA'],['month','AY'],['month3','3 AY'],['month6','6 AY'],['month12','12 AY']].map(([k,l])=>`<button data-action="reportPeriod" data-period="${k}" class="${reportPeriod===k?'active':''}">${l}</button>`).join('')}</div>`;
 const topRange=periodRange(),topIncome=incomeEntriesInRange(topRange.start,topRange.end).reduce((a,x)=>a+(+x.amount||0),0),topExpense=actualExpenseEntriesInRange(topRange.start,topRange.end).reduce((a,x)=>a+(+x.amount||0),0),topNet=topIncome-topExpense,topMax=Math.max(1,Math.abs(topIncome),Math.abs(topExpense),Math.abs(topNet));
 const totalBars=`<div class="reportTotalBars"><div class="reportTotalBar inc"><span><small>TOPLAM GELİR</small><b>${money(topIncome)}</b></span><i><em style="width:${Math.max(2,Math.abs(topIncome)/topMax*100)}%"></em></i></div><div class="reportTotalBar exp"><span><small>TOPLAM GİDER</small><b>${money(topExpense)}</b></span><i><em style="width:${Math.max(2,Math.abs(topExpense)/topMax*100)}%"></em></i></div><div class="reportTotalBar net"><span><small>NET DURUM</small><b>${money(topNet)}</b></span><i><em style="width:${Math.max(2,Math.abs(topNet)/topMax*100)}%"></em></i></div></div>`;
 const flowRange=[1,3,6,12].map(n=>`<button data-action="reportFlowMonths" data-months="${n}" class="${reportFlowMonths===n?'active':''}">${n} AY</button>`).join('');
 const compareTable=`<button class="reportCompareTableBtn" data-action="reportCompareDetail"><div class="reportCompareTableTitle"><span><b>GEÇEN AY İLE KARŞILAŞTIR</b><small>${monthLabel(m)} ↔ ${monthLabel(pm)}</small></span><i>›</i></div><div class="reportCompareTable"><span></span><small>BU AY</small><small>GEÇEN AY</small><small>FARK</small><b>GELİR</b><em>${money(cur.i)}</em><em>${money(prev.i)}</em><strong>${diff(cur.i,prev.i)>=0?'+':''}${money(diff(cur.i,prev.i))}</strong><b>GİDER</b><em>${money(cur.e)}</em><em>${money(prev.e)}</em><strong>${diff(cur.e,prev.e)>=0?'+':''}${money(diff(cur.e,prev.e))}</strong><b>NET</b><em>${money(cur.r)}</em><em>${money(prev.r)}</em><strong>${diff(cur.r,prev.r)>=0?'+':''}${money(diff(cur.r,prev.r))}</strong></div></button>`;
 const summary=`<div class="reportChartCard reportTotalCard"><div class="reportCardTitle"><b>TOPLAM GELİR · GİDER · NET DURUM</b><span>${topRange.label}</span></div>${totalBars}</div><div class="reportPanel reportPaymentPanel"><div class="reportCardTitle"><b>ÖDEME DAĞILIMI</b><span>${monthLabel(m)}</span></div>${paymentSourceSummary()}</div><div class="reportChartCard reportFlowChart"><div class="reportCardTitle"><b>GELİR / GİDER DAĞILIMI</b><div class="reportFlowRange">${flowRange}</div></div><canvas id="reportFlowChart" data-report-chart="flow"></canvas></div>${compareTable}`;
 const catRangeButtons='';
 const catPalette=['#35c8ff','#8f7cff','#ff6575','#2bd48e','#f0bd59','#ff8a55','#62d4c8','#c97cff'];let acc=0;const donutStops=catRows.map(([k,v],i)=>{const a=acc/catTotal*100;acc+=v;const b=acc/catTotal*100;return `${catPalette[i%catPalette.length]} ${a}% ${b}%`}).join(',');const distributionChart=catRows.length?`<div class="expenseDistributionChart"><div class="expenseDonut" style="background:conic-gradient(${donutStops})"><div><b>${money(catRows.reduce((n,x)=>n+x[1],0))}</b><small>TOPLAM GİDER</small></div></div><div class="expenseLegend">${catRows.map(([k,v],i)=>`<span><i style="background:${catPalette[i%catPalette.length]}"></i><b>${esc(k)}</b><small>${(v/catTotal*100).toFixed(1)}% · ${money(v)}</small></span>`).join('')}</div></div>`:'';
 const categories=`<div class="reportPanel reportFull"><div class="reportCardTitle reportCategoryHead"><div><b>GİDER DAĞILIMI</b><span>${catRange.label} · ${catRows.length} kategori</span></div><div class="reportFlowRange reportCategoryRange">${catRangeButtons}</div></div>${distributionChart}${catRows.map(([k,v])=>`<button class="reportBarRow large" data-action="fixedCategoryDetail" data-cat="${esc(k)}" data-scope="period"><span>${esc(k)}<small>${(v/catTotal*100).toFixed(1)}%</small></span><i><em style="width:${Math.max(3,v/catTotal*100)}%"></em></i><b>${money(v)}</b></button>`).join('')||'<div class="notice">SEÇİLEN DÖNEMDE GİDER YOK.</div>'}</div>`;
 const cardsView=`<div class="reportCardMetricStack reportCardMetricStackV60"><button data-action="reportCardMetricDetail" data-kind="spend"><span class="reportMetricLeft">${premiumIcon('cards',21)}<span><b>KART HARCAMASI</b><small>${monthExpenses.filter(x=>x.source==='card').length} işlem · detay için dokun</small></span></span><strong>${money(cardSpend)}</strong><i>›</i></button><button data-action="reportCardMetricDetail" data-kind="paid"><span class="reportMetricLeft"><span class="reportActionIcon">✓</span><span><b>KART ÖDEMESİ</b><small>${(state.cardPayments||[]).filter(x=>String(x.date||'').startsWith(m)).length} ödeme · detay için dokun</small></span></span><strong>${money(cardPaid)}</strong><i>›</i></button><button data-action="reportCardMetricDetail" data-kind="interest"><span class="reportMetricLeft"><span class="reportActionIcon">%</span><span><b>FAİZ / VERGİ</b><small>${interestRows.length} kayıt · detay için dokun</small></span></span><strong>${money(interest)}</strong><i>›</i></button></div><div class="reportPanel reportFull"><div class="reportCardTitle"><b>KART DETAYLARI</b><span>${monthLabel(m)}</span></div>${(state.cards||[]).map(c=>{const sp=monthExpenses.filter(x=>x.cardId===c.id&&x.source==='card').reduce((a,x)=>a+(+x.amount||0),0),pa=(state.cardPayments||[]).filter(x=>x.cardId===c.id&&String(x.date||'').startsWith(m)).reduce((a,x)=>a+(+x.amount||0),0),sh=sharedCardLimitInfo(c);return `<button class="cardReportRow" data-action="openCardStatement" data-id="${c.id}"><span><b>${esc(c.bank)} · ${esc(c.name)}</b><small>${sh?`ORTAK LİMİT ${money(sh.total)} · KALAN ${money(sh.available)}`:'Bu ay'}</small></span><span><small>HARCAMA</small><b>${money(sp)}</b></span><span><small>ÖDEME</small><b>${money(pa)}</b></span><i>›</i></button>`}).join('')||'<div class="notice">KART YOK.</div>'}</div>`;
 return `<div class="reportsPremium reportV54">${nav}${head}${reportView==='summary'?summary:reportView==='categories'?categories:cardsView}</div>`
}
function activeMember(){return (state.members||[]).find(m=>m.id===(state.settings?.activeMemberId||'me'))||(state.members||[]).find(m=>m.id==='me')||state.members?.[0]||{id:'me',name:state.profile?.name||'ADMIN',icon:'👤',role:'admin'}}
function profile(){const m=activeMember(),isAdmin=m.id==='me'||m.role==='admin';return `<div class="profile card v2ProfileOnly"><div class="ava profileAvatarLarge" style="--mc:${esc(m.color||'#ff3344')}">${m.photo?`<img src="${m.photo}">`:esc(m.icon||((m.name||'A')[0]))}</div><h2>${esc(m.name||'ADMIN')}</h2><small>${isAdmin?'ADMIN · HANE YÖNETİCİSİ':esc(m.job||'HANE ÜYESİ')}</small><div class="activeProfileBadge">● AKTİF PROFİL</div><button class="btn profileEditBtn" data-action="editMember" data-id="${esc(m.id)}">PROFİLİ DÜZENLE</button><button class="btn" data-tab="members">HANE PROFİL ›</button></div>`}
function memberIdentityCard(mem){
 const admin=mem.id==='me'||mem.role==='admin',active=(state.settings?.activeMemberId||'me')===mem.id,p=admin?(state.profile||{}):{};
 const name=mem.name||p.name||'ÜYE',photo=mem.photo||p.photo||'',job=mem.job||p.job||'Hane üyesi',joined=mem.startDate||p.memberSince||'—',code=String(mem.id||'uye').replace(/[^a-z0-9]/gi,'').toUpperCase().slice(-8)||'UYE';
 const salary=+mem.salary||0,daily=+mem.dailyWage||(salary?salary/30:0),leave=(mem.leavePolicy||'unpaid')==='paid'?'ÜCRETLİ':'ÜCRETSİZ';
 const info=[['ROL',admin?'HANE YÖNETİCİSİ':'HANE ÜYESİ'],['DURUM',active?'AKTİF PROFİL':'HANE ÜYESİ'],['İŞ / ÜNVAN',job],['BAŞLANGIÇ',joined],salary>0?['AYLIK MAAŞ',money(salary)]:null,daily>0?['GÜNLÜK ÜCRET',money(daily)]:null,(salary>0||daily>0)?['İZİN KURALI',leave]:null,admin&&p.username?['KULLANICI ADI',p.username]:null,admin&&p.city?['ŞEHİR',p.city]:null,admin&&p.birthDate?['DOĞUM TARİHİ',p.birthDate]:null,['PROFİL RENGİ',String(mem.color||'#47bfff').toUpperCase()]].filter(Boolean);
 return `<section class="haneIdentityCard haneIdentityCardFull" style="--mc:${esc(mem.color||'#47bfff')}"><div class="haneIdentityTop"><span><small>HANE</small><b>KİMLİK KARTI</b></span><em>${admin?'YÖNETİCİ':'ÜYE'}</em></div><div class="haneIdentityBody"><div class="haneIdentityPhoto">${photo?`<img src="${photo}" alt="${esc(name)}">`:`<span>${esc(mem.icon||'👤')}</span>`}</div><div class="haneIdentityData"><small>AD / PROFİL</small><h3>${esc(name)}</h3><p>${esc(job)}</p><div><span><small>ÜYE NO</small><b>${esc(code)}</b></span><span><small>BAŞLANGIÇ</small><b>${esc(joined)}</b></span></div></div></div><div class="haneIdentityInfoGrid">${info.map(([k,v])=>`<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div><div class="haneIdentityEditBar"><button type="button" data-action="editMember" data-id="${esc(mem.id)}">✎ KİMLİK BİLGİLERİNİ DÜZENLE</button></div><div class="haneIdentityFoot"><span><i></i>${active?'AKTİF PROFİL':'HANE ÜYESİ'}</span><b>HAYATINA DENGE KAT</b></div></section>`}
function adminProfile(){const m=(state.members||[]).find(x=>x.id==='me'||x.role==='admin')||{id:'me',name:state.profile?.name||'ADMIN',photo:state.profile?.photo||'',icon:'👤',color:'#ff3344',role:'admin'};const memberSince=state.profile?.memberSince||m.startDate||'';return `<div class="memberProfilePage adminMemberProfile" style="--mc:${esc(m.color||'#ff3344')}"><div class="memberProfileHero"><div class="memberProfileAvatar">${m.photo?`<img src="${m.photo}" alt="${esc(m.name||'Admin')}">`:`<span>${esc(m.icon||((m.name||'A')[0]))}</span>`}</div><div class="memberProfileIdentity"><small>HANE ANA PROFİLİ</small><h2>${esc(m.name||'ADMIN')}</h2><div class="memberProfileBadges"><span class="adminBadge">YÖNETİCİ</span><span class="activeBadge">● AKTİF</span></div><p>${esc(m.job||'Hane yöneticisi')}</p></div></div>${memberIdentityCard(m)}<div class="memberProfileQuick"><button data-action="editMember" data-id="${esc(m.id||'me')}"><b>✎</b><span>PROFİLİ<br>DÜZENLE</span></button><button data-tab="members"><b>♟</b><span>HANE<br>ÜYELERİ</span></button></div><div class="memberProfileSection"><div class="memberProfileSectionHead"><div><small>PROFİL</small><b>HANE BİLGİLERİ</b></div><span>ANA HESAP</span></div><div class="memberInfoRows"><div><span>ROL</span><b>Hane Yöneticisi</b></div><div><span>DURUM</span><b class="okText">Aktif</b></div>${m.job?`<div><span>İŞ / ÜNVAN</span><b>${esc(m.job)}</b></div>`:''}${memberSince?`<div><span>BAŞLANGIÇ</span><b>${esc(memberSince)}</b></div>`:''}<div><span>PROFİL RENGİ</span><b class="memberColorValue"><i style="background:${esc(m.color||'#ff3344')}"></i>${esc(m.color||'#ff3344')}</b></div></div></div><div class="memberProfileSection"><div class="memberProfileSectionHead"><div><small>YÖNETİM</small><b>HANE ÜYELERİ</b></div><button class="memberInlineAdd" data-action="addMember">+ ÜYE</button></div><div class="memberMiniList">${[...(state.members||[])].sort((a,b)=>(a.id==='me'?-1:b.id==='me'?1:0)).map(x=>`<button data-action="memberOverview" data-id="${esc(x.id)}" style="--member-color:${esc(x.color||'#47bfff')}"><span class="memberMiniAvatar">${x.photo?`<img src="${x.photo}">`:esc(x.icon||'👤')}</span><span><b>${esc(x.name||'ÜYE')}</b><small>${x.id==='me'||x.role==='admin'?'Yönetici':esc(x.job||'Hane üyesi')}</small></span><i>›</i></button>`).join('')}</div></div></div>`}
function backup(){const zs=window.HANE_IMPORT?.summary?.()||{},zr=window.HANE_CORE?.read?.()?.migration?.lastReconciliation;return`<div class="card" style="padding:15px"><div class="section"><b>HANE · VERİ MERKEZİ</b><span>ŞEMA ${zs.schema||3}</span></div><div class="notice">HANE ve RUTİN kaynakları değiştirilmeden HANE merkezine aktarılır. Eşleştirme kayıt silmez; aynı finans hareketleri bağlantı ile işaretlenir.</div><button class="btn gold" style="width:100%;margin-top:12px" data-action="rutinImport">RUTİN YEDEĞİ İÇE AKTAR</button><button class="btn" style="width:100%;margin-top:8px" data-action="zReconcile">HANE ↔ RUTİN EŞLEŞTİR</button><div class="notice" style="margin-top:10px">Merkez: ${zs.work||0} çalışma · ${zs.roadPayments||0} yol · ${zs.rutinImports||0} RUTİN aktarımı${zr?`<br><b>Son eşleştirme:</b> ${zr.exact} kesin · ${zr.possible} olası · ${zr.unmatchedHane} HANE açık · ${zr.unmatchedRutin} RUTİN açık`:''}</div></div><div class="card" style="padding:15px;margin-top:12px"><div class="section"><b>Yedek Oluştur</b><span></span></div><div class="notice">Mevcut şifreli uygulama yedeğini oluştur.</div><button class="btn gold" style="width:100%;margin-top:12px" data-action="backupNow">Yedek Oluştur</button></div><div class="card" style="padding:15px;margin-top:12px"><div class="section"><b>Yedekten Geri Yükle</b><span></span></div><button class="btn" style="width:100%" data-action="restoreNow">Yedekten Geri Yükle</button></div>`}
function homeEdit(){
  const labels={summary:'AYLIK ÖZET',quick:'HIZLI ERİŞİM',monthly:'AYLIK HESAP',recent:'SON HAREKETLER'};
  state.homeLayout=Array.isArray(state.homeLayout)&&state.homeLayout.length?state.homeLayout:['summary','quick','monthly','recent'];
  state.homeHidden=Array.isArray(state.homeHidden)?state.homeHidden:[];
  return `<div class="section"><b>ANA SAYFAYI DÜZENLE</b><span>${state.homeLayout.length} BÖLÜM</span></div><div class="notice">Bölümlerin sırasını değiştir veya görünürlüğünü kapat. Finans kayıtların etkilenmez.</div><div class="list">${state.homeLayout.map((k,i)=>`<div class="item"><div class="ico premiumIco">⌂</div><div><b>${labels[k]||esc(k)}</b><small>${state.homeHidden.includes(k)?'GİZLİ':'GÖRÜNÜR'}</small></div><div class="homeEditActions"><button data-action="homeMove" data-key="${esc(k)}" data-dir="-1" ${i===0?'disabled':''}>↑</button><button data-action="homeMove" data-key="${esc(k)}" data-dir="1" ${i===state.homeLayout.length-1?'disabled':''}>↓</button><button data-action="homeToggle" data-key="${esc(k)}">${state.homeHidden.includes(k)?'GÖSTER':'GİZLE'}</button></div></div>`).join('')}</div>`;
}
function settings(){return`<div class="card"><div class="setting" data-action="togglePrivacy"><span class="settingIco">👁</span><span>GİZLİLİK MODU</span><b>${state.settings.privacy?'Açık':'Kapalı'}</b></div><div class="setting" data-action="openTheme"><span class="settingIco">${premiumIcon('palette',30)}</span><span>TEMA / GÖRÜNÜM</span><b>›</b></div><div class="setting" data-action="changePin"><span class="settingIco">${premiumIcon('lock',24)}</span><span>PIN / GÜVENLİK</span><b>›</b></div><div class="setting" data-action="toggleDarkMode"><span class="settingIco">${premiumIcon('palette',30)}</span><span>KARANLIK MOD</span><b>${state.settings.darkMode!==false?'Açık':'Kapalı'}</b></div><div class="setting" data-tab="about"><span class="settingIco">${premiumIcon('info',30)}</span><span>HAKKINDA</span><b>›</b></div><div class="setting" data-action="clearAll"><span class="settingIco dangerIco">${premiumIcon('trash',30)}</span><span style="color:var(--red)">TÜM VERİLERİ SIFIRLA</span><b></b></div></div>`}
function notes(){
  const rows=[...(state.notes||[])].sort((a,b)=>String(b.updatedAt||b.date||'').localeCompare(String(a.updatedAt||a.date||'')));
  return `<div class="section"><b>NOTLAR</b><button class="miniAddBtn" data-action="addNote">+ NOT EKLE</button></div><div class="notice">Kısa notlarını burada tutabilirsin. Notlar HANE verileriyle birlikte cihazında saklanır.</div><div class="list notesList">${rows.length?rows.map(n=>`<button class="item noteItem" data-action="editNote" data-id="${n.id}"><div class="ico premiumIco">${premiumIcon('note',22)}</div><div><b>${esc(n.title||'NOT')}</b><small>${esc((n.body||'').slice(0,90))}${(n.body||'').length>90?'…':''}</small></div><div class="right"><small>${esc(n.date||'')}</small><b>›</b></div></button>`).join(''):'<div class="notice">Henüz not yok.</div>'}</div>`
}
function noteForm(n={}){return `<form class="form" id="noteForm">${input('title','Başlık',n.title||'')}<div class="field"><label>Not</label><textarea name="body" rows="7" autocapitalize="sentences" autocorrect="on" spellcheck="true">${esc(n.body||'')}</textarea></div>${input('date','Tarih',n.date||iso(),'date')}<button class="btn gold" type="submit">KAYDET</button>${n.id?`<button type="button" class="btn" data-action="delNote" data-id="${n.id}">SİL</button>`:''}</form>`}
function categoryLearningRows(){const rules=state?.statementCategoryRules&&typeof state.statementCategoryRules==='object'?state.statementCategoryRules:{};return Object.entries(rules).filter(([k,v])=>k&&v).sort((a,b)=>a[0].localeCompare(b[0],'tr'))}
function categories(){const shown=visibleCategoryList(),learned=categoryLearningRows(),byCat={};learned.forEach(([merchant,cat])=>(byCat[cat]||(byCat[cat]=[])).push(merchant));return `<div class="section"><b>KATEGORİLER</b><span><button class="miniAddBtn" data-action="mergeCategory">BİRLEŞTİR</button> <button class="miniAddBtn" data-action="addCategory">+ EKLE</button></span></div><div class="notice categoryVisibilityNote">${shown.length?`${shown.length} kullanılan kategori gösteriliyor.`:'Henüz kullanılan kategori yok.'} Ekstrede bir işyerinin kategorisini değiştirdiğinde HANE bunu öğrenir ve sonraki ekstrelerde aynı işyerine otomatik uygular.</div><div class="categoryManage">${shown.length?shown.map(c=>`<button data-action="editCategory" data-cat="${esc(c)}"><span>${catPremiumIcon(c)}</span><b>${esc(c)}</b><em>${(byCat[c]||[]).length?`${(byCat[c]||[]).length} ÖĞRENİLEN`:'✎'}</em></button>`).join(''):'<div class="notice">İlk gider kaydından sonra kullanılan kategoriler burada görünecek.</div>'}</div><div class="section"><b>KATEGORİ ÖĞRENME</b><span>${learned.length} KURAL</span></div>${learned.length?`<div class="list">${learned.map(([merchant,cat])=>`<div class="item"><div class="ico premiumIco">${catPremiumIcon(cat)}</div><div><b>${esc(merchant)}</b><small>SONRAKİ EKSTRELERDE → ${esc(cat)}</small></div><button class="btn" style="width:auto;padding:8px 10px" data-action="delCategoryRule" data-merchant="${esc(merchant)}">SİL</button></div>`).join('')}</div><button class="btn" style="width:100%;margin-top:10px" data-action="clearCategoryRules">ÖĞRENİLEN KURALLARI TEMİZLE</button>`:'<div class="notice">Henüz öğrenilmiş işyeri-kategori kuralı yok. Ekstre okuturken bir işlemin kategorisini değiştirirsen burada görünür.</div>'}`}

function categoryIconChoices(selected=''){
  const keys=['Kira','Aidat','Market','Manav','Fırın','Kafe','Yemek','Restoran','Giyim','Online Alışveriş','Elektronik','Mobilya','Ev Bakım','Kırtasiye','Kitap','Kozmetik','Kişisel Bakım','Spor','Oyun','Abonelik','Akaryakıt','Otopark','Otoyol/Köprü','Araç Bakım','Ulaşım','Kuyumculuk','Kargo','Sağlık','Eğitim','Çocuk','Evcil Hayvan','Ev','Temizlik','Eğlence','Tatil','Konaklama','Uçak','Hediye','Bağış','Sigorta','Vergi','Banka Masrafı','Faiz','Faturalar','İnternet','Elektrik','Su','Doğalgaz','Cep Telefonu','Harçlık','Diğer'];
  return `<div class="categoryIconPicker">${keys.map(k=>`<button type="button" class="categoryIconChoice ${k===selected?'active':''}" data-icon-key="${esc(k)}" aria-label="${esc(k)}">${categoryIconSvg(k,24)}</button>`).join('')}</div><input type="hidden" name="iconKey" value="${esc(selected||'Diğer')}">`
}
function categoryForm(old=''){
  const selected=state?.categoryMeta?.[old]?.iconKey||old||'Diğer',color=old?catColor(old):'#d8ad4f';
  return `<form class="form" id="categoryForm">${input('name','Kategori Adı',old)}<div class="field"><label>İkon Seç</label>${categoryIconChoices(selected)}</div><div class="field"><label>İkon Rengi</label><input type="color" name="color" value="${color}"></div><button class="btn gold" type="submit">KAYDET</button>${old?`<button class="btn" type="button" data-action="categoryDeleteAsk" data-cat="${esc(old)}">KATEGORİYİ SİL / AKTAR</button>`:''}</form>`
}
function categoryMergeForm(){
  const cats=visibleCategoryList();
  return `<form class="form" id="categoryMergeForm"><div class="notice">Kaynak kategorideki finansal kayıtlar silinmez; hedef kategoriye aktarılır. İşlemden önce etkilenecek kayıt sayısı gösterilir.</div>${select('source','Kaynak Kategori',cats,cats[0]||'')}${select('target','Hedef Kategori',cats,cats[1]||cats[0]||'')}<button class="btn gold" type="submit">KAYITLARI SAY</button></form>`
}
function categoryUsageCount(cat){return (state.expenses||[]).filter(x=>x.category===cat).length+(state.cardTransactions||[]).filter(x=>x.category===cat).length+(state.installments||[]).filter(x=>x.category===cat).length+Object.values(state.statementCategoryRules||{}).filter(x=>x===cat).length}
function categoryTransfer(source,target){
  if(!source||!target||source===target)return 0;let n=0;
  for(const arr of [state.expenses||[],state.cardTransactions||[],state.installments||[]])for(const x of arr)if(x.category===source){x.category=target;n++}
  Object.keys(state.statementCategoryRules||{}).forEach(k=>{if(state.statementCategoryRules[k]===source){state.statementCategoryRules[k]=target;n++}});
  state.customCategories=(state.customCategories||[]).filter(x=>x!==source);state.categoryMeta=state.categoryMeta||{};delete state.categoryMeta[source];C=C.filter(x=>x!==source);NORMAL_C=NORMAL_C.filter(x=>x!==source);FIXED_C=FIXED_C.filter(x=>x!==source);return n
}
function categoryDeleteForm(cat){
  const count=categoryUsageCount(cat),targets=visibleCategoryList().filter(x=>x!==cat);
  return `<div class="notice"><b>${esc(cat)}</b> kategorisine bağlı <b>${count}</b> kayıt/kural var.</div>${count?`<form class="form" id="categoryDeleteTransferForm"><input type="hidden" name="source" value="${esc(cat)}">${select('target','Kayıtları Aktar',targets,targets[0]||'Diğer')}<button class="btn gold" type="submit">AKTAR VE KATEGORİYİ SİL</button></form>`:`<button class="btn gold" data-action="categoryDeleteEmpty" data-cat="${esc(cat)}">KATEGORİYİ SİL</button>`}`
}

function theme(){
  const base={bg:'#05080d',surface:'#0b1118',surface2:'#0f1720',text:'#eef7ff',muted:'#92a3b5',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'};
  if(!themeDraft) themeDraft={...base,...(state.theme||{})};
  const t=themeDraft;
  const presets=[
    ['Z TASARIM','#05080d','#0b1118','#0f1720','#eef7ff','#92a3b5','#47bfff','#2bd48e','#ff616d','#f4c542'],
    ['BLACK GOLD','#050505','#11100c','#19170f','#fff7df','#a99f83','#d7ae54','#39d98a','#ff5c68','#f0c75e'],
    ['GUNMETAL GREEN','#080d0c','#101816','#14211d','#eafff7','#8ba99d','#34e39a','#42d98f','#ff6674','#d8c65b'],
    ['SILVER ICE','#0b0f14','#151b22','#1b242e','#f5f8fc','#a8b3c0','#8bd7ff','#56d7a0','#ff7280','#ffd86a'],
    ['GRAPHITE RED','#09090b','#151316','#20191c','#fff1f3','#ad969c','#ff5368','#36d996','#ff5368','#ffc857'],
    ['MIDNIGHT BLUE','#030914','#071526','#0c2038','#edf7ff','#8da8c2','#4da3ff','#38d69a','#ff6575','#ffd15c'],
    ['CARBON PURPLE','#08070d','#13101b','#1b1627','#f8f1ff','#aa9bb9','#b477ff','#42d69a','#ff657c','#ffd05f'],
    ['BEIGE PREMIUM','#15120d','#201b13','#2b2419','#fff7e8','#b9aa91','#d9b875','#57c98f','#e96b70','#e4c55e'],
    ['EMERALD BLACK','#020a08','#071511','#0c211a','#edfff8','#87aa9d','#19d99a','#38df9b','#ff6677','#e3c75b'],
    ['ARCTIC CYAN','#071015','#0d1a20','#13252d','#effcff','#91adb7','#35d7ff','#43dba0','#ff7181','#f3d25f']
  ];
  const row=(action,label,key,icon)=>`<button type="button" class="setting themeSetting" data-action="${action}"><span>${icon}</span><span><b>${label}</b><small>${String(t[key]||'').toUpperCase()}</small></span><i style="background:${t[key]}"></i></button>`;
  return`<div class="section"><b>TEMA STÜDYOSU</b><span>CANLI ÖNİZLEME</span></div>
  <div class="preview themeLivePreview" style="background:linear-gradient(145deg,${t.surface},${t.bg});border-color:${t.accent};color:${t.text}"><div class="themePreviewHead"><b style="color:${t.accent}">HANE</b><small style="color:${t.muted}">ÖNİZLEME</small></div><div class="summary"><div class="sum" style="background:${t.surface2};border-color:${t.accent}55"><label style="color:${t.muted}">Gelir</label><strong style="color:${t.income}">₺25.000</strong></div><div class="sum" style="background:${t.surface2};border-color:${t.accent}55"><label style="color:${t.muted}">Gider</label><strong style="color:${t.expense}">₺12.550</strong></div><div class="sum" style="background:${t.surface2};border-color:${t.accent}55"><label style="color:${t.muted}">Kalan</label><strong style="color:${t.remain}">₺12.450</strong></div></div><div class="themePreviewBar" style="background:linear-gradient(90deg,${t.income} 0 33%,${t.expense} 33% 66%,${t.remain} 66% 100%)"></div></div>
  <div class="card themeControls">${row('pickBg','ARKA PLAN','bg','◼')}${row('pickSurface','KART / PANEL','surface','▣')}${row('pickSurface2','İKİNCİL YÜZEY','surface2','▤')}${row('pickText','ANA YAZI','text','A')}${row('pickMuted','İKİNCİL YAZI','muted','a')}${row('pickAccent','DETAY / VURGU','accent','✦')}${row('pickIncome','GELİR','income','●')}${row('pickExpense','GİDER','expense','●')}${row('pickRemain','KALAN','remain','●')}</div>
  <div class="section"><b>10 HAZIR TASARIM</b><span>DOKUN · ÖNİZLE</span></div><div class="themeGrid themePresetGrid">${presets.map((a,i)=>`<button type="button" class="themeCard" data-action="presetFull" data-theme='${JSON.stringify({bg:a[1],surface:a[2],surface2:a[3],text:a[4],muted:a[5],accent:a[6],income:a[7],expense:a[8],remain:a[9]})}'><div class="swatch" style="background:linear-gradient(135deg,${a[1]} 0 50%,${a[2]} 50%);border:1px solid ${a[6]}"><i style="background:${a[6]}"></i><i style="background:${a[7]}"></i><i style="background:${a[8]}"></i></div><b>${i+1}. ${a[0]}</b></button>`).join('')}</div>
  <div class="themeActions"><button class="btn" data-action="resetTheme">VARSAYILANA DÖN</button><button class="btn gold" data-action="saveTheme">KAYDET VE UYGULA</button></div><button class="btn" style="width:100%;margin-top:8px" data-action="cancelTheme">İPTAL</button>`
}
function upcomingPayments(){
 const today=new Date(iso()+'T12:00:00'),out=[];const add=(kind,id,title,amount,date,paid=false)=>{if(!date)return;const d=new Date(date+'T12:00:00');if(Number.isNaN(d.getTime()))return;const days=Math.ceil((d-today)/86400000);out.push({kind,id,title,amount:+amount||0,date,days,paid})};
 state.cards.forEach(c=>{const pi=cardPaymentInfo(c,today);add('card',c.id,c.bank+' '+c.name,c.balance,iso(pi.dueDate),(+c.balance||0)<=0)});
 state.flexAccounts.forEach(f=>{let due=rollMonthlyDate(f.dueDate,today);if(due<today)due=rollMonthlyDate(f.dueDate,new Date(today.getFullYear(),today.getMonth()+1,1));add('flex',f.id,f.bank+' '+(f.name||'ESNEK HESAP'),f.balance,iso(due),(+f.balance||0)<=0)});
 return out.sort((a,b)=>a.date.localeCompare(b.date));
}
function paymentBucket(x){if(x.paid)return'ÖDENDİ';if(x.days<0)return'GECİKMİŞ';if(x.days===0)return'BUGÜN';if(x.days===1)return'YARIN';if(x.days<=7)return'BU HAFTA';return'YAKLAŞIYOR'}
function alerts(){const all=upcomingPayments(),groups=['GECİKMİŞ','BUGÜN','YARIN','BU HAFTA','YAKLAŞIYOR','ÖDENDİ'];return `<div class="section"><b>YAKLAŞAN ÖDEMELER</b><span>${all.filter(x=>!x.paid).length} BEKLEYEN</span></div>${groups.map(g=>{const a=all.filter(x=>paymentBucket(x)===g);if(!a.length)return'';return `<div class="paymentGroup"><div class="section"><b>${g}</b><span>${a.length}</span></div>${a.map(x=>`<div class="item paymentDue ${x.paid?'isPaid':''}"><div class="ico premiumIco">${x.kind==='fixed'?'🧾':x.kind==='card'?'💳':'🏦'}</div><div><b>${esc(x.title)}</b><small>${prettyDate(x.date)} · ${x.kind==='fixed'?'GİDER':x.kind==='card'?'KREDİ KARTI':'ESNEK HESAP'}</small></div><div class="reportMoveRight"><b>${money(x.amount)}</b><small>${g}</small></div></div>`).join('')}</div>`}).join('')||'<div class="notice">YAKLAŞAN ÖDEME YOK.</div>'}`}

function about(){return`<div class="profile"><div class="aboutV5Logo">${haneFullLogo("aboutV5")}</div><p>SÜRÜM 0.15.45 · V111 TEMA STÜDYOSU</p><p>PREMİUM EV BÜTÇEN.<br>VERİLERİN CİHAZINDA ŞİFRELİ SAKLANIR.</p></div>`}
function memberExpenseRows(memberId,m=state.selectedMonth){
  return actualExpenseEntriesForMonth(m).filter(x=>(x.memberId||'')===(memberId||''));
}
function memberName(memberId){if(!memberId)return'HANE GENELİ / ATANMAMIŞ';const m=state.members.find(x=>x.id===memberId);return m?m.name:'ATANMAMIŞ'}
function memberDetailBody(memberId,m=state.selectedMonth){
  const rows=memberExpenseRows(memberId,m).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))),total=rows.reduce((a,x)=>a+(+x.amount||0),0);
  return `<div class="memberDetailSummary"><small>${monthLabel(m)} TOPLAM HARCAMA</small><b>${money(total)}</b><span>${rows.length} hareket</span></div>${rows.length?`<div class="list memberMovementList">${rows.map(x=>{const card=x.cardId?state.cards.find(c=>c.id===x.cardId):null;const pay=x.source==='card'?`KREDİ KARTI${card?' · '+esc(card.name):''}`:'NAKİT';const fixed=x.recurring&&x.paymentId,action=fixed?'editStatementFixedPayment':'editExpense',del=fixed?'delFixedPaymentExact':'delExpense',rid=fixed?x.paymentId:x.id;return `<div class="item memberMove"><div class="ico premiumIco">${catPremiumIcon(x.category)}</div><div><b>${esc(x.title||x.category||'GİDER')}</b><small>${x.date||''} · ${esc(x.category||'Diğer')} · ${pay}</small></div><div class="right"><b>${money(x.amount)}</b><div class="memberRowActions"><button data-action="${action}" data-direct-edit="1" data-id="${rid}">DÜZENLE</button><button data-action="${del}" data-id="${rid}">SİL</button></div></div></div>`}).join('')}</div>`:'<div class="notice">Bu ay bu kişiye atanmış gider yok.</div>'}`;
}

function memberFinanceSummary(mem,m=state.selectedMonth){const inc=(state.incomes||[]).filter(x=>x.memberId===mem.id&&String(x.date||'').startsWith(m)).reduce((a,x)=>a+(+x.amount||0),0);const exp=actualExpenseEntriesForMonth(m).filter(x=>x.memberId===mem.id).reduce((a,x)=>a+(+x.amount||0),0);const days=(state.work||[]).filter(x=>x.memberId===mem.id&&x.type==='daily'&&String(x.date||'').startsWith(m)&&x.dayStatus!=='leave').length;const ent=zMemberMonthEntitlement(mem,m),received=zMemberMonthPaid(mem.id,m),remaining=Math.max(0,ent.total-received);return{inc,exp,days,workEnt:ent.total,workReceived:money2(received),workRemain:money2(remaining)}}
function memberOverviewBody(mem){const m=state.selectedMonth,f=memberFinanceSummary(mem,m),workRows=zMemberWorkRows(mem.id,m),admin=mem.id==='me'||mem.role==='admin',active=(state.settings?.activeMemberId||'me')===mem.id;return `<div class="memberDetailSheet" style="--mc:${esc(mem.color||'#47bfff')}"><div class="memberDetailHero"><div class="memberDetailAvatar">${mem.photo?`<img src="${mem.photo}">`:`<span>${esc(mem.icon||'👤')}</span>`}</div><div><small>${admin?'HANE YÖNETİCİSİ':'HANE ÜYESİ'}</small><h2>${esc(mem.name||'ÜYE')}</h2><p>${esc(mem.job||'Profil bilgisi')}</p><div class="memberProfileBadges">${admin?'<span class="adminBadge">ADMIN</span>':''}${active?'<span class="activeBadge">● AKTİF PROFİL</span>':'<span class="passiveBadge">PASİF PROFİL</span>'}</div></div></div>${memberIdentityCard(mem)}<div class="memberDetailStats"><button data-action="memberOverviewDetail" data-id="${esc(mem.id)}" data-kind="work"><small>ÇALIŞMA</small><b>${workRows.length}</b><span>kayıt</span></button><button data-action="memberOverviewDetail" data-id="${esc(mem.id)}" data-kind="entitlement"><small>HAKEDİŞ</small><b>${money(f.workEnt)}</b></button><button data-action="memberOverviewDetail" data-id="${esc(mem.id)}" data-kind="received"><small>ALINAN</small><b>${money(f.workReceived)}</b></button><button data-action="memberOverviewDetail" data-id="${esc(mem.id)}" data-kind="expense"><small>HARCAMA</small><b>${money(f.exp)}</b></button></div><div class="memberDetailInfo"><div><span>İŞ / ÜNVAN</span><b>${esc(mem.job||'Belirtilmedi')}</b></div><div><span>İŞE BAŞLAMA</span><b>${esc(mem.startDate||'Belirtilmedi')}</b></div><div><span>PROFİL RENGİ</span><b class="memberColorValue"><i style="background:${esc(mem.color||'#47bfff')}"></i>${esc(mem.color||'#47bfff')}</b></div></div><div class="memberDetailActions">${active?'':`<button class="primary" data-action="selectMember" data-id="${esc(mem.id)}">AKTİF PROFİL YAP</button>`}<button data-action="editMember" data-id="${esc(mem.id)}">PROFİLİ DÜZENLE</button>${admin?'':`<button class="danger" data-action="delMember" data-id="${esc(mem.id)}">ÜYEYİ SİL</button>`}</div></div>`}
function memberOverviewDetailBody(mem,kind){const m=state.selectedMonth;if(kind==='work'){const rows=zMemberWorkRows(mem.id,m);return `<div class="section"><b>ÇALIŞMA KAYITLARI</b><span>${monthLabel(m)}</span></div>${rows.map(x=>`<div class="item" data-action="zWorkEdit" data-id="${esc(x.id)}"><div><b>${prettyDate(x.date)} · ${zWorkTypeLabel(x.type)}</b><small>${x.dayStatus==='leave'?'İZİN':x.dayStatus==='overtime'?'MESAİ':'ÇALIŞTI'}</small></div><div class="right"><b>${x.dayStatus==='leave'?(mem.leavePolicy==='paid'?'ÜCRETLİ İZİN':'ÜCRETSİZ İZİN'):money(zWorkAmount(x))}</b></div></div>`).join('')||'<div class="notice">Kayıt yok.</div>'}`};if(kind==='entitlement'){const z=zMemberMonthEntitlement(mem,m);return `<div class="section"><b>HAKEDİŞ DETAYI</b><span>${monthLabel(m)} · 30 GÜN ESASI</span></div><div class="notice"><b>TEMEL MAAŞ: ${money(z.base)}</b><br>${z.leave?`İzin: ${z.leave} gün · ${mem.leavePolicy==='paid'?'Ücretli izin, kesinti yok':'Ücretsiz izin kesintisi '+money(z.leaveDeduction)}<br>`:''}${z.overtime?`Mesai: +${money(z.overtime)}<br>`:''}<b>TOPLAM HAKEDİŞ: ${money(z.total)}</b></div>`};if(kind==='received'){const rows=(state.workPayments||[]).filter(x=>x.memberId===mem.id&&zWorkPaymentMonth(x)===m).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));return rows.map(x=>`<div class="item"><div><b>${prettyDate(x.date)}</b><small>ÇALIŞMA ÖDEMESİ · ${monthLabel(m)}</small></div><b>${money(x.amount)}</b></div>`).join('')||'<div class="notice">Bu ay alınan ödeme yok.</div>'};if(kind==='income'){const rows=(state.incomes||[]).filter(x=>x.memberId===mem.id&&String(x.date||'').startsWith(m));return rows.map(x=>`<div class="item" data-action="editIncome" data-id="${esc(x.id)}"><div><b>${esc(x.title)}</b><small>${prettyDate(x.date)}</small></div><b>${money(x.amount)}</b></div>`).join('')||'<div class="notice">Gelir yok.</div>'};const rows=actualExpenseEntriesForMonth(m).filter(x=>x.memberId===mem.id);return rows.map(x=>`<div class="item"><div><b>${esc(x.title||x.category)}</b><small>${prettyDate(x.date)}</small></div><b>${money(x.amount)}</b></div>`).join('')||'<div class="notice">Harcama yok.</div>'}
function members(){const active=state.settings?.activeMemberId||'me',m=state.selectedMonth;const rows=[...(state.members||[])].sort((a,b)=>(a.id==='me'?-1:b.id==='me'?1:0)),admin=rows.find(x=>x.id==='me'||x.role==='admin');return `<div class="houseMembersPage"><div class="houseMembersHeader"><div><small>HANE YÖNETİMİ</small><h2>HANE ÜYELERİ</h2><p>${rows.length} profil · Yönetici ${esc(admin?.name||'Admin')}</p></div><button class="houseAddMember" data-action="addMember"><b>＋</b><span>YENİ ÜYE</span></button></div>${monthNavigator()}<div class="houseMemberCards">${rows.map(mem=>{const f=memberFinanceSummary(mem,m),isAdmin=mem.id==='me'||mem.role==='admin',isActive=active===mem.id;return `<article class="houseMemberCard ${isActive?'active':''}" style="--mc:${esc(mem.color||'#47bfff')}"><button class="houseMemberOpen" data-action="memberOverview" data-id="${esc(mem.id)}"><span class="houseMemberAvatar">${mem.photo?`<img src="${mem.photo}" alt="${esc(mem.name||'Üye')}">`:`<span>${esc(mem.icon||'👤')}</span>`}</span><span class="houseMemberIdentity"><span class="houseMemberName"><b>${esc(mem.name||'ÜYE')}</b>${isAdmin?'<em>YÖNETİCİ</em>':''}</span><small>${esc(mem.job||'Hane üyesi')}</small><i>${isActive?'● AKTİF PROFİL':'PROFİLİ GÖRÜNTÜLE'}</i></span><strong>›</strong></button><div class="houseMemberStats"><span><small>HAKEDİŞ</small><b>${money(f.workEnt)}</b></span><span><small>ALINAN</small><b>${money(f.workReceived)}</b></span><span><small>HARCAMA</small><b>${money(f.exp)}</b></span><span><small>ÇALIŞMA</small><b>${f.days} gün</b></span></div><div class="houseMemberActions">${isActive?`<span class="currentMemberPill">SEÇİLİ PROFİL</span>`:`<button class="primary" data-action="selectMember" data-id="${esc(mem.id)}">SEÇ</button>`}<button data-action="editMember" data-id="${esc(mem.id)}">DÜZENLE</button>${isAdmin?'':`<button class="danger" data-action="delMember" data-id="${esc(mem.id)}">SİL</button>`}</div></article>`}).join('')}</div><button class="houseAddMemberBottom" data-action="addMember"><b>＋</b><span><strong>YENİ HANE ÜYESİ EKLE</strong><small>Yeni profil oluştur</small></span><i>›</i></button></div>`}
function memberForm(m={}){const colors=['#ff3344','#2497ff','#18c98b','#a855f7','#f4b942','#e7e9ee','#00d7ff','#ff7a18','#ff4fa3','#7cff5b'];const salary=+m.salary||0,daily=salary?salary/30:(+m.dailyWage||0),mc=m.color||colors[0];return `<form class="form" id="memberForm"><input type="hidden" name="id" value="${esc(m.id||'')}">${input('name','Üye Adı',m.name||'')}${input('icon','İkon',m.icon||'👤')}${input('job','İşi / Ünvanı',m.job||'')}${input('startDate','İşe Başlama Tarihi',m.startDate||iso(),'date')}${input('salary','Aylık Maaş',salary,'number','step="0.01" min="0" id="memberSalary"')}${input('salaryEffectiveDate','Maaş Geçerlilik Tarihi',m.salaryEffectiveDate||m.startDate||iso(),'date')}<div class="field"><label>İzin Ücret Kuralı</label><select name="leavePolicy"><option value="unpaid" ${(m.leavePolicy||'unpaid')==='unpaid'?'selected':''}>ÜCRETSİZ İZİN · GÜNLÜKTEN DÜŞ</option><option value="paid" ${m.leavePolicy==='paid'?'selected':''}>ÜCRETLİ İZİN · MAAŞTAN DÜŞME</option></select></div><div class="field"><label>Günlük Ücret <small>(otomatik · maaş ÷ 30)</small></label><input name="dailyWage" id="memberDailyWage" type="number" step="0.01" value="${money2(daily).toFixed(2)}" readonly></div><div class="memberThemeStudio" style="--member-theme:${esc(mc)}"><div class="memberThemeHead"><div><small>PROFİL</small><b>TEMA STÜDYOSU</b><span>Kişinin çalışma/takvim rengini belirle</span></div><i class="memberThemePreview"></i></div><div class="memberThemePalette">${colors.map(c=>`<button type="button" class="memberThemePreset ${mc===c?'active':''}" data-action="memberThemePreset" data-color="${c}" style="--c:${c}" aria-label="${c}"></button>`).join('')}</div><label class="memberCustomColor"><span><b>ÖZEL RENK</b><small>İstediğin rengi seç</small></span><input type="color" name="color" id="memberThemeColor" value="${esc(mc)}"></label></div><div class="notice">Seçilen profil rengi çalışma takviminde bu kişiyi temsil eder. Aylık maaş 30 güne bölünür; izin ve mesai takvimden değiştirilebilir.</div><button class="btn gold">KAYDET</button>${m.id&&m.id!=='me'?`<button type="button" class="btn" data-action="delMember" data-id="${m.id}">SİL</button>`:''}</form>`}
function zWorkTypeLabel(t){return t==='hourly'?'SAATLİK':t==='overtime'?'MESAİ':'GÜNLÜK'}
function zWorkAmount(w={}){if(w.dayStatus==='leave')return 0;const base=w.type==='daily'?(+w.amount||+((state.members||[]).find(m=>m.id===w.memberId)?.dailyWage)||0):money2((+w.hours||0)*(+w.rate||0));const mem=(state.members||[]).find(m=>m.id===w.memberId);const overtime=(w.dayStatus==='overtime'&&+w.overtimeHours>0)?money2(((+mem?.dailyWage||+w.amount||0)/8)*(+w.overtimeHours||0)):0;return money2(base+overtime)}
function zWorkRoadRows(x={}){
 const linked=x.id?(state.workRoads||[]).filter(e=>e.workId===x.id):[];
 if(linked.length)return linked.map(e=>({id:e.id,amount:+(e.actualAmount??e.amount)||0,source:e.source==='card'?'card':'cash',cardId:e.cardId||''}));
 if((+x.roadAmount||0)>0)return [{id:'',amount:+x.roadAmount||0,source:x.roadSource==='card'?'card':'cash',cardId:x.roadCardId||''}];
 return [];
}
function zWorkRoadRow(r={},i=0){const source=r.source==='card'?'card':'cash';return `<div class="zWorkRoadRow" data-road-row><div class="zWorkRoadTop"><b>YOL GİDERİ ${i+1}</b><button type="button" data-action="zWorkRoadRemove">SİL</button></div>${input('roadAmount','Tutar',r.amount||0,'number','step="0.01" min="0"')}<div class="field"><label>Ödeme Kaynağı</label><select name="roadSource" class="zRoadSource"><option value="cash" ${source==='cash'?'selected':''}>NAKİT</option><option value="card" ${source==='card'?'selected':''}>KREDİ KARTI</option></select></div><div class="field zRoadCardWrap" style="${source==='card'?'':'display:none'}"><label>Kullanılan Kart</label><select name="roadCardId">${zWorkCardOptions(r.cardId||'')}</select></div></div>`}
function zWorkDetailBody(x){
 const roads=(state.workRoads||[]).filter(e=>e.workId===x.id),roadTotal=money2(roads.reduce((n,r)=>n+(+(r.actualAmount??r.amount)||0),0));
 const mem=(state.members||[]).find(m=>m.id===x.memberId),roadHtml=roads.length?roads.map(r=>`<div class="item"><div><b>${esc(r.title||'YOL ÜCRETİ')}</b><small>${prettyDate(r.date||x.date)} · ${r.source==='card'?'KART':'NAKİT'}</small></div><b>${money(r.actualAmount??r.amount)}</b></div>`).join(''):'<div class="notice">Yol gideri yok.</div>';
 return `<div class="zWorkDetailHero"><small>${prettyDate(x.date||'')} · ${zWorkTypeLabel(x.type)}</small><h2>${esc(x.title||'ÇALIŞMA')}</h2><span>${x.dayStatus==='leave'?'İZİN':x.dayStatus==='overtime'?'MESAİ':'ÇALIŞTI'}</span></div><div class="card zWorkDetailMeta"><div><span>Hane üyesi</span><b>${esc(mem?.name||'—')}</b></div><div><span>Gün durumu</span><b>${x.dayStatus==='leave'?(mem?.leavePolicy==='paid'?'ÜCRETLİ İZİN':'ÜCRETSİZ İZİN'):x.dayStatus==='overtime'?'MESAİ':'ÇALIŞTI'}</b></div>${x.overtimeHours?`<div><span>Mesai</span><b>${x.overtimeHours} saat</b></div>`:''}<div><span>Yol gideri</span><b>${money(roadTotal)}</b></div></div><div class="notice">Hakediş, Alınan ve Kalan finans hesapları günlük kayda değil, Çalışma sayfasındaki aylık 30 gün sistemine göre yönetilir.</div><div class="section zWorkSection"><b>YOL GİDERLERİ</b><span>${roads.length} KAYIT · ${money(roadTotal)}</span></div><div class="list zWorkDetailRoads">${roadHtml}</div><button class="btn" style="width:100%;margin-top:14px" data-action="zWorkEditForm" data-id="${esc(x.id)}">ÇALIŞMAYI DÜZENLE</button>`
}
function zWorkMemberSelect(v=''){return `<div class="field"><label>Çalışan Hane Üyesi</label><select name="memberId" id="zWorkMemberId"><option value="">KİŞİ SEÇ</option>${(state.members||[]).map(m=>`<option value="${esc(m.id)}" ${v===m.id?'selected':''}>${esc(m.icon||'👤')} ${esc(m.name||'ÜYE')}</option>`).join('')}</select></div>`}
function zWorkForm(x={}){
 const t=x.type||'daily',roads=zWorkRoadRows(x),isDaily=t==='daily',isLeave=x.dayStatus==='leave';
 const mem=(state.members||[]).find(m=>m.id===(x.memberId||state.settings?.activeMemberId)),daily=+mem?.dailyWage||0;
 return `<form class="form" id="zWorkForm"><input type="hidden" name="id" value="${esc(x.id||'')}">${zWorkMemberSelect(x.memberId||state.settings?.activeMemberId||'')}<input type="hidden" name="type" value="${esc(t)}"><div class="workSimpleHero"><b>${isLeave?'İZİN YAPTIM':t==='overtime'?'MESAİ EKLE':t==='hourly'?'SAATLİK İŞ':'ÇALIŞTIM'}</b><small>${isDaily&&!isLeave?'Ana iş ücreti aylık 30 gün hesabında yönetilir.':isLeave?'İzin, Çalışma sayfasındaki aylık hakediş hesabına kendi kuralıyla uygulanır.':'Ek çalışma bilgilerini gir.'}</small></div>${input('date','Tarih',x.date||iso(),'date')}${isDaily?`<div class="field"><label>Gün Durumu</label><select name="dayStatus"><option value="worked" ${(x.dayStatus||'worked')==='worked'?'selected':''}>TAM GÜN ÇALIŞTIM</option><option value="leavePaid" ${x.dayStatus==='leave'&&(x.leaveType||mem?.leavePolicy)==='paid'?'selected':''}>ÜCRETLİ İZİN</option><option value="leaveUnpaid" ${x.dayStatus==='leave'&&(x.leaveType||mem?.leavePolicy||'unpaid')==='unpaid'?'selected':''}>ÜCRETSİZ İZİN</option></select></div>`:''}${isDaily?'':input('hours',t==='overtime'?'Mesai Saati':'Kaç Saat',x.hours||x.overtimeHours||0,'number','step="0.25" min="0"')}${isDaily?'':input('rate',t==='overtime'?'Mesai Saat Ücreti':'Saatlik Ücret',x.rate||0,'number','step="0.01" min="0"')}${isDaily&&!isLeave?`<div class="notice"><b>30 GÜN ESASI</b><br>Günlük referans: ${money(daily)} · aylık hakediş Çalışma özetinde hesaplanır.</div>`:''}${isLeave?'':`<div class="zWorkRoadHead"><div><b>YOL GİDERLERİ</b><small>Gerekirse birden fazla yol ödemesi ekle.</small></div><button type="button" data-action="zWorkRoadAdd">＋ YOL GİDERİ</button></div><div id="zWorkRoadList">${roads.map((r,i)=>zWorkRoadRow(r,i)).join('')}</div>`}<button class="btn gold" type="submit">KAYDET</button>${x.id?`<button class="btn" type="button" data-action="zWorkDelete" data-id="${esc(x.id)}">KAYDI SİL</button>`:''}</form>`
}

function zWorkIncomeRows(workId){return (state.workPayments||[]).filter(x=>x.workId===workId).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')))}
function zReceivablePaidAmount(r){if(!r)return 0;return money2(zWorkIncomeRows(r.workId).reduce((n,x)=>n+(+x.amount||0),0))}
function zReceivableRemaining(r){return money2(Math.max(0,(+r?.amount||0)-zReceivablePaidAmount(r)))}
function zWorkPaidAmount(w){return w?money2(zWorkIncomeRows(w.id).reduce((n,x)=>n+(+x.amount||0),0)):0}
function zWorkPaymentLabel(w){const total=zWorkAmount(w),paid=zWorkPaidAmount(w);if(total<=.009)return 'ÖDEME YOK';if(paid>=total-.009)return 'ÖDENDİ';if(paid>.009)return 'KISMİ ÖDENDİ';return 'ALACAK'}
function zReceivableRows(){return (state.receivables||[]).filter(x=>zReceivableRemaining(x)>.009).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))}

function zMemberColor(m,i=0){return m?.color||['#2497ff','#ff8a32','#18c98b','#a855f7','#ff5d78','#f4c542'][i%6]}
function zMemberWorkRows(mid,m=state.selectedMonth){return (state.work||[]).filter(x=>x.memberId===mid&&String(x.date||'').startsWith(m))}
function zCalendarBody(memberId){
 const m=state.selectedMonth||ym(new Date()),[yy,mm]=m.split('-').map(Number),days=new Date(yy,mm,0).getDate(),first=(new Date(yy,mm-1,1).getDay()+6)%7;
 const mem=(state.members||[]).find(x=>x.id===memberId),today=iso();
 const dailyRows=mem?(state.work||[]).filter(x=>x.memberId===mem.id&&String(x.date||'').startsWith(m)):[];
 const pays=mem?(state.workPayments||[]).filter(x=>x.memberId===mem.id&&String(x.date||'').startsWith(m)):[];
 let cells='<div class="zCalWeek">'+['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'].map(x=>`<b>${x}</b>`).join('')+'</div><div class="zCalGrid">'+('<span class="zCalBlank"></span>'.repeat(first));
 for(let d=1;d<=days;d++){
   const ds=`${m}-${String(d).padStart(2,'0')}`,rows=dailyRows.filter(x=>x.date===ds),base=rows.find(x=>x.type==='daily'),ot=rows.some(x=>x.type==='overtime'||x.dayStatus==='overtime'),hourly=rows.some(x=>x.type==='hourly'),pay=pays.some(x=>x.date===ds),road=(state.workRoads||[]).some(x=>x.memberId===memberId&&x.date===ds);
   let status='',label='',icon='',dayKind='';
   if(base?.dayStatus==='leave'){const lt=base.leaveType||mem?.leavePolicy||'unpaid';status=lt==='paid'?'leavePaid':'leaveUnpaid';label=lt==='paid'?'Ücretli izin':'Ücretsiz izin';icon='☂';dayKind=lt==='paid'?'ÜCRETLİ':'ÜCRETSİZ'}
   else if(base){status='worked';label='Tam gün çalışma';icon='';dayKind='TAM GÜN'}
   else if(hourly){status='hourly';label='Saatlik iş';icon='▥';dayKind='SAATLİK'}
   if(ot){status=status?status+' hasOvertime':'overtime';label+=(label?' + ':'')+'Mesai';icon=icon||'◷';if(!dayKind)dayKind='MESAİ'}
   if(hourly&&base){status=status+' hasHourly';label+=' + Saatlik iş'}
   if(pay){status=status?status+' hasPayment':'payment';label+=(label?' + ':'')+'Ödeme';icon=icon||'▤';if(!dayKind)dayKind='ÖDEME'}
   const future=ds>today?' future':'',todayCls=ds===today?' today':'';
   const badges=[
     base?.dayStatus==='leave'?`<i class="eventBadge ${(base.leaveType||mem?.leavePolicy||'unpaid')==='paid'?'leavePaid':'leaveUnpaid'}">${(base.leaveType||mem?.leavePolicy||'unpaid')==='paid'?'ÜCRETLİ':'ÜCRETSİZ'}</i>`:'',
     base&&base.dayStatus!=='leave'?'<i class="eventBadge worked">TAM GÜN</i>':'',
     ot?'<i class="eventBadge overtime">MESAİ</i>':'',
     hourly?'<i class="eventBadge hourly">SAATLİK</i>':'',
     pay?'<i class="eventBadge payment">ÖDEME</i>':'',
     road?'<i class="eventBadge road">YOL</i>':''
   ].join('');
   cells+=`<button class="zCalDay ${status}${road?' hasRoad':''}${future}${todayCls}" data-action="zWorkDay" data-date="${ds}" title="${esc(label+(road?(label?' + ':'')+'Yol ücreti':'')||'Kayıt yok')}"><b>${d}</b><span class="eventDots">${badges}</span></button>`
 }
 cells+='</div>';
 if(!mem)return `<div class="zWorkCalendar"><div class="notice">Çalışma bilgilerini görmek için üstten bir kişi seç.</div>${cells}</div>`;
 const rows=zMemberWorkRows(mem.id,m),daily=rows.filter(x=>x.type==='daily'),worked=daily.filter(x=>(x.dayStatus||'worked')!=='leave').length,leave=daily.filter(x=>x.dayStatus==='leave').length,otHours=rows.reduce((n,x)=>n+(x.type==='overtime'?(+x.hours||0):(x.dayStatus==='overtime'?(+x.overtimeHours||0):0)),0),otAmount=rows.reduce((n,x)=>n+(x.type==='overtime'?zWorkAmount(x):(x.dayStatus==='overtime'&&+x.overtimeHours>0?money2(((+mem.dailyWage||+x.amount||0)/8)*(+x.overtimeHours||0)):0)),0),hourlyHours=rows.filter(x=>x.type==='hourly').reduce((n,x)=>n+(+x.hours||0),0),hourlyAmount=rows.filter(x=>x.type==='hourly').reduce((n,x)=>n+zWorkAmount(x),0),monthRoads=(state.workRoads||[]).filter(x=>x.memberId===mem.id&&String(x.date||'').startsWith(m)),roadTotal=money2(monthRoads.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0)),roadCash=money2(monthRoads.filter(x=>x.source!=='card').reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0)),roadCard=money2(monthRoads.filter(x=>x.source==='card').reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0)),ent=zMemberMonthEntitlement(mem,m),paid=zMemberMonthPaid(mem.id,m),remain=zMemberMonthRemaining(mem,m);
 return `<div class="zWorkCalendar personWorkCalendar" style="--member-color:${esc(zMemberColor(mem,(state.members||[]).findIndex(x=>x.id===mem.id)))}"><div class="zCalTitle"><button data-action="zWorkCalShift" data-dir="-1">‹</button><b>${monthLabel(m)}</b><button data-action="zWorkCalShift" data-dir="1">›</button></div><div class="activeMemberColor"><i></i><span>${esc(mem.name)} · çalışma rengi</span></div>${cells}<div class="zCalKey premiumWorkKey"><span><i class="worked"></i>Tam Gün</span><span><i class="overtime"></i>Mesai</span><span><i class="hourly"></i>Saatlik İş</span><span><i class="leaveUnpaid"></i>Ücretsiz İzin</span><span><i class="leavePaid"></i>Ücretli İzin</span><span><i class="payment"></i>Ödeme</span><span class="roadKey"><i class="road"></i>Yol Ücreti</span></div><div class="section zWorkSection"><b>AYLIK ÖZET</b><span>${monthLabel(m)}</span></div><div class="zPersonMonthSummary"><div><small>ÇALIŞMA</small><b>${worked} gün</b></div><div><small>İZİN</small><b>${leave} gün</b></div><div><small>MESAİ</small><b>${otHours} saat · ${money(otAmount)}</b></div><div><small>SAATLİK İŞ</small><b>${hourlyHours} saat · ${money(hourlyAmount)}</b></div><div class="roadSummary"><small>YOL ÜCRETİ</small><b>${monthRoads.length} kayıt · ${money(roadTotal)}</b><em>Nakit ${money(roadCash)} · Kart ${money(roadCard)}</em></div><div><small>HAKEDİŞ</small><b>${money(ent.total)}</b></div><div><small>ALINAN</small><b>${money(paid)}</b></div><div><small>KALAN</small><b>${money(remain)}</b></div></div></div>`
}
function zWorkDayBody(date){
 const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);
 if(!mem)return '<div class="notice">Seçili HANE üyesi bulunamadı.</div>';
 const rows=(state.work||[]).filter(x=>x.memberId===mem.id&&x.date===date).sort((a,b)=>String(a.type).localeCompare(String(b.type)));
 const pays=(state.workPayments||[]).filter(x=>x.memberId===mem.id&&x.date===date);
 const roads=(state.workRoads||[]).filter(x=>x.memberId===mem.id&&x.date===date);
 const label=x=>x.type==='daily'?(x.dayStatus==='leave'?((x.leaveType||mem.leavePolicy||'unpaid')==='paid'?'ÜCRETLİ İZİN':'ÜCRETSİZ İZİN'):'TAM GÜN'):x.type==='overtime'?'MESAİ':'SAATLİK İŞ';
 const meta=x=>x.type==='daily'?(x.dayStatus==='leave'?'Hakediş kuralı: '+((x.leaveType||mem.leavePolicy||'unpaid')==='paid'?'korunur':'hakediş yok'):'Günlük hakediş'):x.type==='overtime'?`${+x.hours||0} saat · ${money(x.rate||0)}/saat`:x.type==='hourly'?`${+x.hours||0} saat · ${money(x.rate||0)}/saat`:'';
 const list=[...rows.map(x=>`<div class="zDayRecord"><div><b>${label(x)}</b><small>${meta(x)}</small></div><div class="zDayRecordActions"><button type="button" data-action="zWorkEditForm" data-id="${esc(x.id)}">DÜZENLE</button><button type="button" class="danger" data-action="zWorkDelete" data-id="${esc(x.id)}">SİL</button></div></div>`),...pays.map(x=>`<div class="zDayRecord payment"><div><b>ÖDEME</b><small>${money(x.amount)} · ${prettyDate(x.date)}</small></div><div class="zDayRecordActions"><button type="button" data-action="zWorkPaymentEdit" data-id="${esc(x.id)}">DÜZENLE</button><button type="button" class="danger" data-action="zWorkPaymentDelete" data-id="${esc(x.id)}">SİL</button></div></div>`),...roads.map(x=>`<div class="zDayRecord road"><div><b>YOL ÜCRETİ</b><small>${money(x.actualAmount??x.amount)} · ${x.source==='card'?'KREDİ KARTI':'NAKİT'}</small></div><div class="zDayRecordActions"><button type="button" data-action="zWorkRoadDayEdit" data-id="${esc(x.id)}">DÜZENLE</button><button type="button" class="danger" data-action="zWorkRoadDayDelete" data-id="${esc(x.id)}">SİL</button></div></div>`)].join('');
 return `<div class="notice"><b>${prettyDate(date)} · ${esc(mem.name)}</b><br>Boş gün dahil bu güne kayıt ekleyebilirsin.</div><div class="zDayRecordList">${list||'<div class="notice">Bu güne henüz kayıt eklenmemiş.</div>'}</div><div class="section zWorkSection"><b>BU GÜNE KAYIT EKLE</b><span></span></div><div class="zDayAddGrid"><button data-action="zWorkDayAdd" data-type="daily" data-date="${date}">✓<b>TAM GÜN / İZİN</b></button><button data-action="zWorkDayAdd" data-type="overtime" data-date="${date}">★<b>MESAİ</b></button><button data-action="zWorkDayAdd" data-type="hourly" data-date="${date}">◷<b>SAATLİK</b></button><button data-action="zWorkDayPayAdd" data-date="${date}">₺<b>ÖDEME</b></button><button data-action="zWorkRoadDayAdd" data-date="${date}">↗<b>YOL ÜCRETİ</b></button></div>`
}
function zWorkRoadDayForm(date,x={}){const source=x.source==='card'?'card':'cash',mid=x.memberId||state.settings?.activeMemberId||'me';return `<form class="form roadStandaloneForm" id="zWorkRoadStandaloneForm"><input type="hidden" name="memberId" value="${esc(mid)}"><input type="hidden" name="id" value="${esc(x.id||'')}"><input type="hidden" name="date" value="${esc(date||x.date||iso())}">${input('amount','Yol Ücreti',x.actualAmount??x.amount??'','number','step="0.01" min="0.01" inputmode="decimal"')}<div class="field"><label>Ödeme Şekli</label><div class="roadNativeChoices"><label><input type="radio" name="source" value="cash" ${source==='cash'?'checked':''}><span>NAKİT</span></label><label><input type="radio" name="source" value="card" ${source==='card'?'checked':''}><span>KREDİ KARTI</span></label></div></div><div class="field roadDayCardWrap" style="${source==='card'?'':'display:none'}"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${(state.cards||[]).map(c=>`<option value="${esc(c.id)}" ${x.cardId===c.id?'selected':''}>${esc(c.bank||'KART')} · ${esc(c.name||'KREDİ KARTI')} · •••• ${esc(c.last4||'')}</option>`).join('')}</select></div><div class="roadSaveStatus" id="roadSaveStatusV37"></div><button class="btn gold" type="submit">YOL ÜCRETİNİ KAYDET</button></form>`}

function zWorkPaymentEditForm(x){return `<form class="form" id="zWorkPaymentEditForm"><input type="hidden" name="id" value="${esc(x.id)}">${input('amount','Ödeme Tutarı',x.amount||0,'number','step="0.01" min="0.01"')}${input('date','Ödeme Tarihi',x.date||iso(),'date')}<button class="btn gold" type="submit">ÖDEMEYİ GÜNCELLE</button></form>`}
function zMissingMemberDays(mem){if(!mem?.startDate)return[];const out=[];let d=new Date(mem.startDate+'T12:00:00'),end=new Date(iso()+'T12:00:00');for(;d<=end;d.setDate(d.getDate()+1)){const ds=iso(d);if(!(state.work||[]).some(x=>x.memberId===mem.id&&x.date===ds))out.push(ds)}return out}
function zMemberSalaryForDate(mem,date){const hist=Array.isArray(mem?.salaryHistory)?mem.salaryHistory:[];const valid=hist.filter(x=>x.effectiveDate&&x.effectiveDate<=date).sort((a,b)=>String(a.effectiveDate).localeCompare(String(b.effectiveDate)));if(valid.length)return +valid.at(-1).salary||0;return +mem?.salary||money2((+mem?.dailyWage||0)*30)}
function zMemberWageForDate(mem,date){return money2(zMemberSalaryForDate(mem,date)/30)}
function zMemberMonthBaseSalary(mem,m=state.selectedMonth){const [yy,mm]=String(m).split('-').map(Number);if(!yy||!mm)return money2(+mem?.salary||(+mem?.dailyWage||0)*30);let total=0;for(let d=1;d<=30;d++){const realDay=Math.min(d,new Date(yy,mm,0).getDate()),ds=`${yy}-${String(mm).padStart(2,'0')}-${String(realDay).padStart(2,'0')}`;total+=zMemberSalaryForDate(mem,ds)/30}return money2(total)}
async function zEnsureMemberDays(mem){if(!mem?.startDate)return 0;state.work=Array.isArray(state.work)?state.work:[];const missing=zMissingMemberDays(mem);for(const ds of missing){const wid='auto_'+mem.id+'_'+ds,wage=zMemberWageForDate(mem,ds);state.work.push({id:wid,memberId:mem.id,type:'daily',date:ds,title:(mem.job||'ÇALIŞMA').toUpperCase(),amount:wage,dayStatus:'worked',autoCalendar:true})}return missing.length}

function zMemberMonthDeductions(memberId,m=state.selectedMonth){return (state.workDeductions||[]).filter(x=>x.memberId===memberId&&String(x.date||'').startsWith(m))}
function zMemberMonthDeductionTotal(memberId,m=state.selectedMonth){return money2(zMemberMonthDeductions(memberId,m).reduce((n,x)=>n+(+x.amount||0),0))}
function zWorkDeductionForm(mem,x={}){return `<form class="form" id="zWorkDeductionForm"><input type="hidden" name="id" value="${esc(x.id||'')}"><input type="hidden" name="memberId" value="${esc(mem.id)}">${input('date','Kesinti Tarihi',x.date||iso(),'date')}<div class="field"><label>Kesinti Nedeni</label><select name="reason">${['Avans','İcra','Ceza / Kesinti','Diğer'].map(v=>`<option ${x.reason===v?'selected':''}>${v}</option>`).join('')}</select></div>${input('amount','Kesinti Tutarı',x.amount||0,'number','step="0.01" min="0.01"')} ${input('note','Açıklama',x.note||'')}<div class="notice">Ücretsiz izin / eksik gün burada tekrar girilmez; çalışma takvimi onları zaten hakedişten düşürür. Avans normal gider sayılmaz, yalnız net hakedişten düşer.</div><button class="btn gold" type="submit">KESİNTİYİ KAYDET</button>${x.id?`<button class="btn" type="button" data-action="zWorkDeductionDelete" data-id="${esc(x.id)}">SİL</button>`:''}</form>`}
function zMemberMonthEntitlement(mem,m=state.selectedMonth){
 const rows=zMemberWorkRows(mem.id,m),salary=zMemberMonthBaseSalary(mem,m),daily=salary/30;
 const dailyRows=rows.filter(x=>x.type==='daily');
 const workedDays=dailyRows.filter(x=>(x.dayStatus||'worked')!=='leave').length;
 const leaveRows=dailyRows.filter(x=>x.dayStatus==='leave');
 const paidLeave=leaveRows.filter(x=>(x.leaveType||mem.leavePolicy||'unpaid')==='paid').length;
 const unpaidLeave=leaveRows.filter(x=>(x.leaveType||mem.leavePolicy||'unpaid')==='unpaid').length;
 const eligibleDays=Math.min(30,workedDays+paidLeave);
 const base=money2(daily*eligibleDays);
 const overtime=rows.reduce((n,x)=>{if(x.type==='overtime')return n+money2((+x.hours||0)*(+x.rate||0));if(x.dayStatus==='overtime'&&+x.overtimeHours>0)return n+money2((daily/8)*(+x.overtimeHours||0));return n},0);
 const hourly=rows.filter(x=>x.type==='hourly').reduce((n,x)=>n+money2((+x.hours||0)*(+x.rate||0)),0);
 const deduction=zMemberMonthDeductionTotal(mem.id,m);return {base,leave:leaveRows.length,paidLeave,unpaidLeave,leaveDeduction:0,overtime:money2(overtime),hourly:money2(hourly),deduction,eligibleDays,workedDays,gross:money2(base+overtime+hourly),total:money2(Math.max(0,base+overtime+hourly-deduction))};
}

function zWorkPaymentMonth(p){if(p?.workMonth)return p.workMonth;const w=p?.workId?(state.work||[]).find(x=>x.id===p.workId):null;return String(w?.date||p?.date||'').slice(0,7)}
function zMemberMonthPaid(memberId,m=state.selectedMonth){return money2((state.workPayments||[]).filter(x=>x.memberId===memberId&&zWorkPaymentMonth(x)===m).reduce((n,x)=>n+(+x.amount||0),0))}
function zMemberMonthRemaining(mem,m=state.selectedMonth){return money2(Math.max(0,zMemberMonthEntitlement(mem,m).total-zMemberMonthPaid(mem.id,m)))}
function zWorkMonthPaymentForm(mem,m=state.selectedMonth){const ent=zMemberMonthEntitlement(mem,m).total,paid=zMemberMonthPaid(mem.id,m),remain=Math.max(0,ent-paid);return `<form class="form" id="zWorkMonthPayForm"><div class="notice"><b>${esc(mem.name)} · ${monthLabel(m)}</b><br>Hakediş: <b>${money(ent)}</b><br>Alınan: <b>${money(paid)}</b><br>Kalan: <b>${money(remain)}</b></div>${input('amount','Alınan Tutar',remain,'number','step="0.01" min="0.01" max="'+remain+'"')}${input('date','Ödeme Tarihi',iso(),'date')}<div class="notice">Bu ödeme yalnız Çalışma sayfasında tutulur. Gelir/Gider/Raporlar sistemine aktarılmaz.</div><button class="btn gold" type="submit">ÖDEMEYİ KAYDET</button></form>`}

function zWorkSummaryModal(kind,m=state.selectedMonth){
 const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid&&x.startDate);if(!mem)return '<div class="notice">Çalışma profili seçilmedi.</div>';
 if(kind==='earned'){
  const rows=(state.workPayments||[]).filter(x=>x.memberId===mem.id&&zWorkPaymentMonth(x)===m);
  return `<div class="workMoneyDetailHead"><b>${esc(mem.name)}</b><span>ALINAN · ${rows.length} KAYIT</span></div><div class="workMoneyDetailList">${rows.map(x=>`<div class="workMoneyDetailRow"><span><b>${prettyDate(x.date)}</b><small>ÖDEME</small></span><strong>${money(x.amount)}</strong></div>`).join('')||'<div class="notice">Bu ay alınan ödeme yok.</div>'}</div>`
 }
 const z=zMemberMonthEntitlement(mem,m),rows=zMemberWorkRows(mem.id,m),otHours=rows.filter(x=>x.type==='overtime').reduce((n,x)=>n+(+x.hours||0),0),hourlyHours=rows.filter(x=>x.type==='hourly').reduce((n,x)=>n+(+x.hours||0),0);
 return `<div class="workMoneyDetailHead"><b>${esc(mem.name)}</b><span>HAKEDİŞ · 30 GÜN ESASI</span></div><div class="workMoneyDetailList"><div class="workMoneyDetailRow"><span><b>TEMEL</b><small>${z.eligibleDays} GÜN</small></span><strong>${money(z.base)}</strong></div>${z.overtime?`<div class="workMoneyDetailRow"><span><b>MESAİ</b><small>${otHours} SAAT</small></span><strong>${money(z.overtime)}</strong></div>`:''}${z.hourly?`<div class="workMoneyDetailRow"><span><b>SAATLİK İŞ</b><small>${hourlyHours} SAAT</small></span><strong>${money(z.hourly)}</strong></div>`:''}${z.deduction?`<div class="workMoneyDetailRow"><span><b>MAAŞTAN KESİNTİ</b><small>${zMemberMonthDeductions(mem.id,m).length} KAYIT</small></span><strong style="color:var(--red)">-${money(z.deduction)}</strong></div>`:''}${z.paidLeave?`<div class="workMoneyDetailRow"><span><b>ÜCRETLİ İZİN</b><small>${z.paidLeave} GÜN</small></span><strong>HAKEDİŞTE</strong></div>`:''}${z.unpaidLeave?`<div class="workMoneyDetailRow"><span><b>ÜCRETSİZ İZİN</b><small>${z.unpaidLeave} GÜN</small></span><strong>₺0,00</strong></div>`:''}<div class="workMoneyDetailTotal"><span>TOPLAM KAZANILAN</span><strong>${money(z.total)}</strong></div></div>`
}
function workCenter(){
 state.work=Array.isArray(state.work)?state.work:[];state.workPayments=Array.isArray(state.workPayments)?state.workPayments:[];
 const m=state.selectedMonth||ym(new Date()),members=(state.members||[]);let mid=state.settings?.activeMemberId||members[0]?.id||'me';if(!members.some(x=>x.id===mid))mid=members[0]?.id||'me';const mem=members.find(x=>x.id===mid);
 const ent=mem?zMemberMonthEntitlement(mem,m).total:0,paid=mem?zMemberMonthPaid(mem.id,m):0,remain=mem?zMemberMonthRemaining(mem,m):0;
 const workTheme=mem?zMemberColor(mem,members.findIndex(x=>x.id===mem.id)):'#2497ff';
 return `<div class="workThemeShell" style="--work-theme:${esc(workTheme)}"><div class="zWorkHead"><div><small>${monthLabel(m)}</small><h2>ÇALIŞMA</h2></div><span>${mem?esc(mem.name):'KİŞİ SEÇ'}</span></div>
 <div class="v2WorkToolbar personWorkToolbar"><div class="field"><label>Çalışan Kişi</label><select id="v2WorkMember">${members.map(mm=>`<option value="${esc(mm.id)}" ${mid===mm.id?'selected':''}>${esc(mm.icon||'👤')} ${esc(mm.name||'ÜYE')}</option>`).join('')}</select></div></div>
 <div class="zWorkSummary zWorkSummary3 personWorkMoney"><button data-action="zWorkSummaryDetail" data-kind="entitlement"><small>KAZANILAN</small><b>${money(ent)}</b><span>HAKEDİŞ DETAYI ›</span></button><button data-action="zWorkSummaryDetail" data-kind="earned"><small>ALINAN</small><b>${money(paid)}</b><span>ÖDEME GEÇMİŞİ ›</span></button><button data-action="zWorkSummaryDetail" data-kind="owed"><small>KALAN</small><b>${money(remain)}</b><span>KALAN DETAYI ›</span></button></div>
 <div class="v2WorkActions personWorkActions"><button data-action="zQuickWork" data-type="daily">✓<b>ÇALIŞTIM</b></button><button data-action="zQuickWork" data-type="overtime">★<b>MESAİ EKLE</b></button><button data-action="zQuickWork" data-type="hourly">◷<b>SAATLİK İŞ</b></button><button data-action="zWorkMonthPay">₺<b>ÖDEME EKLE</b></button><button data-action="zWorkDeductionAdd">−<b>MAAŞTAN KESİNTİ</b></button></div>
 ${zCalendarBody(mid)}</div>`
}
// V101 CENTRAL CORE: Çalışma ve Nakit Para hariç finans ekranlarının ortak erişim kapısı.
// Mevcut veri biçimini korur; çalışan parser/veri kayıtlarını kopyalamaz.
const FinanceCore={
 data:()=>window.HANE_CORE?.finance?.()||{},
 categories:()=>visibleCategoryList(),
 expenses:()=>window.HANE_CORE?.finance?.().expenses||[],
 incomes:()=>window.HANE_CORE?.finance?.().incomes||[],
 cards:()=>window.HANE_CORE?.finance?.().cards||[],
 statements:()=>window.HANE_CORE?.finance?.().statementImports||[],
 cardPayments:()=>window.HANE_CORE?.finance?.().cardPayments||[],
 installments:()=>window.HANE_CORE?.finance?.().installments||[],
 transactions:()=>actualExpenseEntriesForMonth(state.selectedMonth),
 categoryUsage:cat=>categoryUsageCount(cat),
 transferCategory:(source,target)=>categoryTransfer(source,target),
 cardById:id=>(window.HANE_CORE?.finance?.().cards||[]).find(c=>String(c.id)===String(id))||null
};
window.HANE_FINANCE_CORE=FinanceCore;
function view(){return({home,transactions,fixed,cards,calendar,reports,cashMoney,tara,profile,adminProfile,backup,settings,categories,theme,alerts,about,monthSpent,monthPaid,members,homeEdit,notes,workCenter,identity:identityPage}[current]||home)()}
function input(n,l,v='',type='text',extra=''){const attrs=type==='text'?'autocapitalize="characters" autocorrect="on" autocomplete="on" spellcheck="true"':'';return`<div class="field"><label>${l}</label><input name="${n}" type="${type}" value="${esc(v)}" ${attrs} ${extra}></div>`}
function select(n,l,opts,v=''){return`<div class="field"><label>${l}</label><select name="${n}">${opts.map(o=>`<option ${o===v?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`}
function memberSelect(v=''){return `<div class="field"><label>Hane Üyesi <small style="opacity:.65">(isteğe bağlı)</small></label><select name="memberId"><option value="" ${!v?'selected':''}>HANE GENELİ / ATANMAMIŞ</option>${state.members.map(m=>`<option value="${m.id}" ${v===m.id?'selected':''}>${esc(m.icon)} ${esc(m.name)}</option>`).join('')}</select></div>`}
function incomeForm(x={}){return`<form class="form" id="incomeForm">${input('title','Gelir Adı',x.title||'')}${input('amount','Tutar',x.amount||0,'number')}${input('date','Tarih',x.date||iso(),'date')}<div class="notice">Gelir yalnız seçtiğin tarihe kaydedilir. Sabit/otomatik gelir sistemi kaldırıldı.</div><button class="btn gold" type="submit">Kaydet</button>${x.id?`<button type="button" class="btn" data-action="delIncome" data-id="${x.id}">Sil</button>`:''}</form>`}
function expenseForm(x={}){
  const isRefund=isCardRefund(x),currentCat=x.category||'Market',source=x.source==='card'?'card':'cash',cards=state.cards||[];
  const catTiles=`<div class="premiumCatGrid" data-select-name="normalCategory">${C.map(c=>`<button type="button" class="premiumCatBtn ${c===currentCat?'active':''}" data-cat="${esc(c)}">${catPremiumIcon(c)}<b>${esc(c)}</b></button>`).join('')}</div><select class="hiddenCatSelect" name="normalCategory">${C.map(c=>`<option ${c===currentCat?'selected':''}>${esc(c)}</option>`).join('')}</select>`;
  return`<form class="form" id="expenseForm">${input('title','Açıklama',x.title||'')}${input('amount',isRefund?'İade Tutarı':'Tutar',Math.abs(+(x.actualAmount??x.amount)||0),'number','step="0.01" min="0"')}${isRefund?'<input type="hidden" name="importedRefund" value="true">':''}<div class="field" id="normalCategoryWrap"><label>Kategori</label>${catTiles}<div id="customCategoryWrap" style="${currentCat==='Diğer'?'':'display:none'};margin-top:10px">${input('customCategory','Diğer Kategori Adı','')}</div></div><div class="field"><label>Ödeme Kaynağı</label><div class="paySourceSeg"><button type="button" data-pay-source="cash" class="${source==='cash'?'active':''}">NAKİT</button><button type="button" data-pay-source="card" class="${source==='card'?'active':''}">KART</button></div><input type="hidden" name="source" id="expenseSource" value="${source}"></div><div class="field" id="expenseCardWrap" style="${source==='card'?'':'display:none'}"><label>Hangi Kart?</label><select name="cardId" id="expenseCardId"><option value="">Kart seç</option>${cards.map(c=>`<option value="${c.id}" ${c.id===x.cardId?'selected':''}>${esc(c.bank)} · ${esc(c.name)} · •••• ${esc(c.last4)}</option>`).join('')}</select>${!cards.length?'<small class="fieldHint">Önce KARTLAR bölümünden bir kart eklemelisin.</small>':''}</div>${input('date','Harcama Tarihi',x.date||iso(),'date')}${memberSelect(x.memberId||'')}<div class="notice" id="expenseHelp">GİDERLER İŞLEM TÜRÜNE GÖRE DEĞİL, KATEGORİYE GÖRE AYRILIR.</div><button type="button" class="btn" id="expenseReceiptBtn" data-action="attachReceipt">📷 FİŞ / FOTOĞRAF</button><small id="expenseReceiptStatus" class="fieldHint" style="display:${(modal?.attachment||x.attachment)?'block':'none'}">✓ FİŞ / FOTOĞRAF HAZIR</small><button class="btn gold" type="submit">KAYDET</button>${x.id?`<button type="button" class="btn" data-action="delExpense" data-id="${x.id}">SİL</button>`:''}</form>`
}
function cardForm(c={}){
  const info=c.id?cardPaymentInfo(c,new Date()):null;
  const statementDate=c.statementDate||(info?iso(info.statementDate):iso());
  const dueDate=c.dueDate||(info?iso(info.dueDate):iso(new Date(Date.now()+10*86400000)));
  return`<form class="form" id="cardForm">
    ${input('bank','Banka',c.bank||'')}
    ${input('name','Kart Adı',c.name||'')}
    ${input('last4','Son 4 Hane',c.last4||'','text','maxlength="4" inputmode="numeric"')}
    <div class="row2">${input('limit','Kart Limiti',money2(c.limit||0).toFixed(2),'number','step="0.01"')}${input('balance','Güncel Borç',money2(c.balance||0).toFixed(2),'number','step="0.01"')}</div>
    <div class="row2">${input('sharedLimitGroup','Ortak Limit Grubu',c.sharedLimitGroup||'','text','placeholder="Örn: ZİRAAT AİLE"')}${input('sharedLimit','Ortak Limit Toplamı',c.sharedLimit||0,'number','step="0.01" min="0"')}</div>
    <div class="notice">AYNI LİMİTİ PAYLAŞAN KARTLARA AYNI "ORTAK LİMİT GRUBU" ADINI VE AYNI TOPLAM LİMİTİ YAZ. BOŞ BIRAKIRSAN KART BAĞIMSIZ ÇALIŞIR.</div>
    <div class="row2">${input('statementDate','Hesap Kesim Tarihi',statementDate,'date')}${input('dueDate','Son Ödeme Tarihi',dueDate,'date')}</div>
    <div class="field cardStyleEditField"><label>Kart Stili</label><input type="hidden" name="style" id="cardStyleEditValue" value="${cardStyleKey(c.style)}"><div class="cardStyleEditGrid">${['black','gold','titanium','silver','blue','green','burgundy','purple','bej'].map(st=>`<button type="button" class="cardStyleEditChoice ${st===cardStyleKey(c.style)?'active':''}" data-action="cardFormStyle" data-style="${st}"><i class="style-${st}"></i><span>${st.toUpperCase()}</span></button>`).join('')}</div></div>
    <div class="notice">TARİHLERİ TAKVİMDEN SEÇ. HANE SONRAKİ AYLARDA AYNI GÜNLERİ OTOMATİK İLERİ TAŞIR.</div>
    <button class="btn gold" type="submit">KAYDET</button>
    ${c.id?`<button type="button" class="btn" data-action="delCard" data-id="${c.id}">KARTI SİL</button>`:''}
  </form>`
}
function cardSpendForm(c){return`<form class="form" id="cardSpendForm">${input('amount','Toplam Tutar',0,'number','step="0.01" min="0"')}${input('title','Açıklama','')}${select('category','Kategori',C,'Market')}${input('date','Tarih',iso(),'date')}${memberSelect('')}<div class="field"><label>ÖDEME ŞEKLİ</label><input type="hidden" name="paymentType" id="cardPaymentType" value="Tek Çekim"><div class="cardPayTypeSeg"><button type="button" class="active" data-action="cardPayType" data-value="Tek Çekim">TEK ÇEKİM</button><button type="button" data-action="cardPayType" data-value="Taksitli">TAKSİTLİ</button></div></div><div class="field installmentField" id="installmentField"><label>TAKSİT SAYISI</label><input name="installmentCount" type="number" min="2" max="36" value="2"><small>2–36 taksit seçebilirsin. Taksitli seçildiğinde toplam tutar aylara otomatik dağıtılır.</small></div><button type="button" class="btn" data-action="receipt">📷 Fiş / Kamera</button><button class="btn gold" type="submit">HARCAMAYI KAYDET</button></form>`}
function cardPayForm(c){const st=cardPaymentStatus(c);return`<form class="form" id="cardPayForm">${input('amount','Ödeme Tutarı',Math.max(0,st.remaining||+c.balance||0),'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',iso(),'date')}<div class="notice">Kart ödemesi gider olarak ikinci kez sayılmaz. Sadece “Bu Ay Ödenen” tutarına ve hareketlere eklenir.</div><button class="btn gold" type="submit">Ödemeyi Kaydet</button></form>`}
function accountForm(a={}){return `<form class="form" id="accountForm">${input('bank','Banka Adı',a.bank||'')}${input('name','Hesap Adı',a.name||'VADESİZ HESAP')}${input('last4','IBAN Son 4 Hane',a.last4||'','text','maxlength="4" inputmode="numeric"')}${input('balance','Bakiye',a.balance||0,'number','step="0.01"')}<button class="btn gold" type="submit">KAYDET</button>${a.id?`<button type="button" class="btn" data-action="delAccount" data-id="${a.id}">SİL</button>`:''}</form>`}
function flexForm(a={}){return `<form class="form" id="flexForm">${input('bank','Banka Adı',a.bank||'')}${input('name','Esnek Hesap Adı',a.name||'ESNEK HESAP')}<div class="row2">${input('limit','Limit',a.limit||0,'number')}${input('balance','Kullanılan',a.balance||0,'number')}</div><div class="row2">${input('statementDate','Hesap Kesim Tarihi',a.statementDate||iso(),'date')}${input('dueDate','Son Ödeme Tarihi',a.dueDate||iso(new Date(Date.now()+10*86400000)),'date')}</div>${select('style','Kart Stili',['black','gold','titanium','silver','blue','green','burgundy','purple','bej'],cardStyleKey(a.style))}<button class="btn gold" type="submit">KAYDET</button>${a.id?`<button type="button" class="btn" data-action="delFlex" data-id="${a.id}">SİL</button>`:''}</form>`}
function simpleAmountForm(kind,obj){return `<form class="form" id="simpleAmountForm" data-kind="${kind}" data-id="${obj.id}">${input('amount','Tutar',0,'number','step="0.01" min="0"')}${input('title','Açıklama','')}${input('date','Tarih',iso(),'date')}<button class="btn gold" type="submit">KAYDET</button></form>`}
function cardPaymentEditForm(x){return `<form class="form" id="cardPaymentEditForm">${input('amount','Ödeme Tutarı',x.amount,'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',x.date,'date')}<button class="btn gold" type="submit">KAYDET</button><button type="button" class="btn" data-action="delCardPayment" data-id="${x.id}">SİL</button></form>`}
function identityCard(selectedId=''){const rows=state.members||[],mid=selectedId||identityMemberId||((rows.find(x=>x.id==='me'||x.role==='admin')||{}).id)||'me',mem=rows.find(x=>x.id===mid)||rows.find(x=>x.id==='me')||rows[0];if(!mem)return '<div class="notice">HANE üyesi bulunamadı.</div>';const cardMem=mem.id==='me'?{...mem,name:mem.name||state.profile?.name||'HANE',photo:mem.photo||state.profile?.photo||'',job:mem.job||state.profile?.job||''}:mem;return memberIdentityCard(cardMem)}
function identityPage(){const rows=state.members||[];if(!rows.length)return '<div class="notice">HANE üyesi bulunamadı.</div>';const admin=rows.find(x=>x.id==='me'||x.role==='admin')||rows[0];if(!identityMemberId||!rows.some(x=>x.id===identityMemberId))identityMemberId=admin.id;const mem=rows.find(x=>x.id===identityMemberId)||admin;return `<div class="identityPageSingle">${identityCard(mem.id)}<div class="identityOtherHead"><b>DİĞER HANE ÜYELERİ</b><small>Bir üyeye dokununca yalnız yukarıdaki kimlik kartı değişir.</small></div><div class="identityMemberList identityMemberListPage">${rows.map(x=>`<button type="button" class="${x.id===mem.id?'active':''}" data-action="identitySelectMemberV37" data-id="${esc(x.id)}"><span class="identityMiniAvatar">${(x.id==='me'?(x.photo||state.profile?.photo):x.photo)?`<img src="${x.id==='me'?(x.photo||state.profile?.photo):x.photo}" alt="${esc(x.name||'Üye')}">`:`${esc(x.icon||'👤')}`}</span><span><b>${esc(x.name||'ÜYE')}</b><small>${x.id==='me'||x.role==='admin'?'YÖNETİCİ':'HANE ÜYESİ'}</small></span><i>›</i></button>`).join('')}</div></div>`}
function identityForm(){const p=state.profile||{};return `<form class="form identityEditForm" id="identityForm"><div class="identityEditPhoto"><div class="identityPhoto">${p.photo?`<img src="${p.photo}" alt="Profil">`:`<span>${esc((p.name||'H')[0])}</span>`}</div><button type="button" class="btn compact" data-action="pickProfile">FOTOĞRAFI DEĞİŞTİR</button></div>${input('username','Kullanıcı Adı',p.username||'')}${input('name','Ad Soyad',p.name||'')}<div class="field"><label>Motto / Açıklama</label><textarea name="motto">${esc(p.motto||'')}</textarea></div>${input('city','Şehir',p.city||'')}${input('job','Meslek',p.job||'')}${input('birthDate','Doğum Tarihi',p.birthDate||'','date')}${input('memberSince','Üyelik Tarihi',p.memberSince||'','date')}<button class="btn gold" type="submit">KAYDET</button></form>`}
function profileForm(){return`<form class="form" id="profileForm"><button type="button" class="btn" data-action="pickProfile">PROFİL RESMİNİ DEĞİŞTİR</button>${input('name','İsim',state.profile.name)}<div class="field"><label>Motto</label><textarea name="motto" autocapitalize="characters" autocorrect="on" autocomplete="on" spellcheck="true">${esc(state.profile.motto||'')}</textarea></div>${input('lockMinutes','Otomatik Kilit (dakika)',state.settings.lockMinutes,'number')}<button class="btn gold" type="submit">Kaydet</button></form>`}
function colorForm(k,label){
  if(!themeDraft) themeDraft={...(state.theme||{})};
  return`<div class="field"><label>${label}</label><input id="nativeColor" type="color" value="${themeDraft[k]}" style="height:54px"></div><div class="notice">Bu seçim yalnızca önizlemeyi değiştirir. Tema, Tema Stüdyosu ekranındaki Kaydet düğmesine basınca uygulanır.</div><button class="btn gold" style="width:100%;margin-top:12px" data-action="saveColor" data-kind="${k}">Önizlemeye Uygula</button>`
}
function showToast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}

function rollMonthlyDate(dateStr,ref=new Date()){
  if(!dateStr)return null;
  let d=new Date(dateStr+'T12:00:00');
  if(Number.isNaN(d.getTime()))return null;
  const today=new Date(ref.getFullYear(),ref.getMonth(),ref.getDate());
  while(d<today){
    const day=d.getDate();
    const next=new Date(d.getFullYear(),d.getMonth()+1,1);
    const last=new Date(next.getFullYear(),next.getMonth()+1,0).getDate();
    next.setDate(Math.min(day,last));
    d=next;
  }
  return d;
}
async function saveIncome(d,i){const amount=parseMoneyInput(d.amount);if(!Number.isFinite(amount)||amount<0)throw new Error('Tutar geçersiz');const isNew=!i,x={id:i||id(),title:upper((d.title||'GELİR').trim()||'GELİR'),amount,date:d.date||iso(),recurring:false};if(i){const n=state.incomes.findIndex(z=>z.id===i);state.incomes[n]={...state.incomes[n],...x};delete state.incomes[n].memberId}else state.incomes.push(x);if(isNew){const targetMonth=String(x.date||'').slice(0,7);if(targetMonth){state.selectedMonth=targetMonth;calendarMonth=targetMonth;calendarDay=''}}await save();modal=null;render()}
async function saveExpense(d,i){
  const old=i?state.expenses.find(z=>z.id===i):null,refund=d.importedRefund==='true'||isCardRefund(old),rawAmount=parseMoneyInput(d.amount);if(!Number.isFinite(rawAmount)||rawAmount<0)throw new Error('Tutar geçersiz');
  const amount=refund?-Math.abs(rawAmount):rawAmount,source=d.source==='card'?'card':'cash';
  if(source==='card'&&!d.cardId)throw new Error('Lütfen hangi kartla ödendiğini seçin.');
  const picked=String(d.normalCategory||'').trim()||String(old?.category||'').trim()||'Diğer',category=(picked==='Diğer'&&(d.customCategory||'').trim())?upper(d.customCategory.trim()):picked; if(!visibleCategoryList().includes(category)&&category!=='Diğer'){if(!C.includes(category))C.push(category);state.customCategories=Array.isArray(state.customCategories)?state.customCategories:[];if(!state.customCategories.includes(category))state.customCategories.push(category)};
  const x={id:i||id(),title:upper((d.title||(refund?'KART İADESİ':'GİDER')).trim()||(refund?'KART İADESİ':'GİDER')),amount,actualAmount:amount,billAmount:null,category,categoryId:financeCategoryId(category),date:d.date||old?.date||iso(),dueDate:null,recurring:false,paid:true,sortOrder:old?.sortOrder??state.expenses.length,paidMonths:[],source,memberId:(d.memberId??old?.memberId??''),cardId:source==='card'?d.cardId:null,attachment:modal?.attachment||old?.attachment||'',cardTxId:old?.cardTxId||id(),importedRefund:refund||undefined};
  const isNew=!i;
  if(i){const n=state.expenses.findIndex(z=>z.id===i);state.expenses[n]={...state.expenses[n],...x}}else state.expenses.push(x);
  if(isNew){const targetMonth=String(x.date||'').slice(0,7);if(targetMonth){state.selectedMonth=targetMonth;calendarMonth=targetMonth;calendarDay=''}}
  await save();modal=null;render()
}
async function act(a,el){const legacyFixedActions=new Set(['addFixedExpense','delFixedPaymentExact','editFixedExpense','editFixedPayment','editStatementFixedPayment','toggleFixedPaid']);if(legacyFixedActions.has(a)){showToast('SABİT GİDER SİSTEMİ KALDIRILDI');return;}if(a==='categoryDetailManage'){const cat=el.dataset.cat||'';open('KATEGORİ İŞLEMLERİ',`<div class="notice"><b>${esc(cat)}</b><br>${categoryUsageCount(cat)} bağlı kayıt / kural</div><button class="btn gold" data-action="editCategory" data-cat="${esc(cat)}">DÜZENLE</button><button class="btn" data-action="categoryDeleteAsk" data-cat="${esc(cat)}">SİL / BAŞKA KATEGORİYE AKTAR</button><button class="btn" data-action="mergeCategory" data-source-cat="${esc(cat)}">BİRLEŞTİR</button>`);return}else if(a==='addCategory'){open('KATEGORİ EKLE',categoryForm(''),{oldCategory:''});return}else if(a==='editCategory'){open('KATEGORİYİ DÜZENLE',categoryForm(el.dataset.cat||''),{oldCategory:el.dataset.cat||''});return}else if(a==='mergeCategory'){open('KATEGORİ BİRLEŞTİR',categoryMergeForm(),{sourceCategory:el.dataset.sourceCat||''});setTimeout(()=>{const f=document.getElementById('categoryMergeForm');if(f&&modal?.sourceCategory){const q=f.querySelector('[name="source"]');if(q)q.value=modal.sourceCategory}},0);return}else if(a==='categoryDeleteAsk'){open('KATEGORİYİ SİL / AKTAR',categoryDeleteForm(el.dataset.cat||''));return}else if(a==='categoryDeleteEmpty'){const cat=el.dataset.cat;if(categoryUsageCount(cat))return alert('Bu kategori kullanımda. Önce başka kategoriye aktarın.');state.customCategories=(state.customCategories||[]).filter(x=>x!==cat);delete (state.categoryMeta||{})[cat];C=C.filter(x=>x!==cat);NORMAL_C=NORMAL_C.filter(x=>x!==cat);FIXED_C=FIXED_C.filter(x=>x!==cat);await save();modal=null;render();showToast('KATEGORİ SİLİNDİ');return}else if(a==='zWorkDeductionAdd'){const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);if(mem)open('MAAŞTAN KESİNTİ',zWorkDeductionForm(mem));return}else if(a==='zWorkDeductionEdit'){const x=(state.workDeductions||[]).find(q=>q.id===el.dataset.id),mem=x&&(state.members||[]).find(m=>m.id===x.memberId);if(x&&mem)open('KESİNTİYİ DÜZENLE',zWorkDeductionForm(mem,x));return}else if(a==='zWorkDeductionDelete'){if(!confirm('Bu maaş kesintisi silinsin mi?'))return;state.workDeductions=(state.workDeductions||[]).filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('KESİNTİ SİLİNDİ');return}else if(a==='identitySelectMemberV37'){identityMemberId=el.dataset.id||'me';render();return}else if(a==='identitySelectMember'){identityMemberId=el.dataset.id||'me';current='identity';modal=null;render();return}else if(a==='zWorkRoadDayAdd'){open('YOL ÜCRETİ EKLE',zWorkRoadDayForm(el.dataset.date||iso()));return}else if(a==='zWorkRoadDayEdit'){const x=(state.workRoads||[]).find(q=>q.id===el.dataset.id);if(x)open('YOL ÜCRETİNİ DÜZENLE',zWorkRoadDayForm(x.date,x));return}else if(a==='zWorkRoadDayDelete'){const x=(state.workRoads||[]).find(q=>q.id===el.dataset.id);if(!x)return;if(!confirm('Bu yol ücreti silinsin mi?'))return;state.workRoads=(state.workRoads||[]).filter(q=>q.id!==x.id);await save();open('GÜN KAYITLARI',zWorkDayBody(x.date));showToast('YOL ÜCRETİ SİLİNDİ');return}else if(a==='selectMember'){state.settings.activeMemberId=el.dataset.id||'me';await save();render();showToast('AKTİF PROFİL DEĞİŞTİRİLDİ');return}else if(a==='zQuickWork'){const mid=document.getElementById('v2WorkMember')?.value||state.settings.activeMemberId||'me';state.settings.activeMemberId=mid;const typ=el.dataset.type||'daily';open(typ==='overtime'?'MESAİ EKLE':typ==='hourly'?'SAATLİK İŞ':'ÇALIŞTIM',zWorkForm({type:typ,memberId:mid}));return}else if(a==='zWorkCalShift'){const [y,m]=(state.selectedMonth||ym(new Date())).split('-').map(Number),d=new Date(y,m-1+(+(el.dataset.dir||0)),1);state.selectedMonth=ym(d);await save();render();return}else if(a==='zWorkDay'){open('GÜN KAYITLARI',zWorkDayBody(el.dataset.date));return}else if(a==='zWorkDayAdd'){const mid=state.settings?.activeMemberId||'me';open(el.dataset.type==='overtime'?'MESAİ EKLE':el.dataset.type==='hourly'?'SAATLİK İŞ EKLE':'TAM GÜN / İZİN',zWorkForm({type:el.dataset.type||'daily',memberId:mid,date:el.dataset.date}));return}else if(a==='zWorkDayPayAdd'){const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);if(!mem)return;open('ÖDEME EKLE',`<form class="form" id="zWorkMonthPayForm">${input('amount','Alınan Tutar',0,'number','step="0.01" min="0.01"')}${input('date','Ödeme Tarihi',el.dataset.date||iso(),'date')}<button class="btn gold" type="submit">ÖDEMEYİ KAYDET</button></form>`,{memberId:mem.id,workMonth:String(el.dataset.date||'').slice(0,7)});return}else if(a==='zWorkPaymentEdit'){const x=(state.workPayments||[]).find(q=>q.id===el.dataset.id);if(x)open('ÖDEMEYİ DÜZENLE',zWorkPaymentEditForm(x),{paymentId:x.id});return}else if(a==='zWorkPaymentDelete'){const x=(state.workPayments||[]).find(q=>q.id===el.dataset.id);if(!x)return;if(!confirm('Bu ödeme kaydı silinsin mi?'))return;state.workPayments=(state.workPayments||[]).filter(q=>q.id!==x.id);await save();modal=null;render();showToast('ÖDEME SİLİNDİ');return}else if(a==='zWorkDayDelete'){const id=el.dataset.id,w=(state.work||[]).find(x=>x.id===id);if(!w)return;if(!confirm('Bu günün çalışma kaydı silinsin mi?'))return;state.work=(state.work||[]).filter(x=>x.id!==id);await save();modal=null;render();showToast('ÇALIŞMA GÜNÜ SİLİNDİ');return}else if(a==='zWorkRoadAdd'){const form=el.closest('form'),list=form?.querySelector('#zWorkRoadList')||document.getElementById('zWorkRoadList');if(list){const wrap=document.createElement('div');wrap.innerHTML=zWorkRoadRow({},list.querySelectorAll('[data-road-row]').length);const row=wrap.firstElementChild;if(row){list.appendChild(row);const src=row.querySelector('.zRoadSource'),cardWrap=row.querySelector('.zRoadCardWrap');if(src&&cardWrap){const refresh=()=>cardWrap.style.display=src.value==='card'?'block':'none';src.onchange=refresh;refresh()}const remove=row.querySelector('[data-action="zWorkRoadRemove"]');if(remove)remove.onclick=e=>{e.preventDefault();e.stopPropagation();row.remove();list.querySelectorAll('[data-road-row] .zWorkRoadTop b').forEach((b,i)=>b.textContent='YOL GİDERİ '+(i+1))}}}return}else if(a==='zWorkRoadRemove'){const list=el.closest('#zWorkRoadList');el.closest('[data-road-row]')?.remove();(list||document).querySelectorAll('#zWorkRoadList [data-road-row] .zWorkRoadTop b').forEach((b,i)=>b.textContent='YOL GİDERİ '+(i+1));return}else if(a==='zWorkNew'){open('YENİ ÇALIŞMA',`<div class="zWorkTypePicker"><button data-action="zWorkAdd" data-type="daily"><i>✓</i><b>GÜNLÜK</b><small>Tam gün çalışma</small></button><button data-action="zWorkAdd" data-type="hourly"><i>◷</i><b>SAATLİK</b><small>Saat bazlı çalışma</small></button><button data-action="zWorkAdd" data-type="overtime"><i>★</i><b>MESAİ</b><small>Fazla mesai</small></button></div>`);return}else if(a==='zWorkFilter'){zWorkFilter=el.dataset.value||'all';render();return}else if(a==='zWorkAdd'){open('ÇALIŞMA EKLE',zWorkForm({type:el.dataset.type||'daily'}));return}else if(a==='zWorkMonthPay'){const mid=el.dataset.id||document.getElementById('v2WorkMember')?.value||state.settings.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);if(!mem)return alert('Hane üyesi bulunamadı.');const remain=zMemberMonthRemaining(mem,state.selectedMonth);if(remain<=.009)return alert('Bu ay için kalan hakediş yok.');open('ÇALIŞMA ÖDEMESİ',zWorkMonthPaymentForm(mem,state.selectedMonth),{memberId:mem.id,workMonth:state.selectedMonth});return}else if(a==='zReceivablePay'){alert('Eski günlük alacak sistemi devre dışı. Ödemeyi Çalışma sayfasındaki ÖDEME EKLE butonundan girin.');return}else if(a==='zWorkEdit'){const x=(state.work||[]).find(z=>z.id===el.dataset.id);if(x)open('ÇALIŞMA DETAYI',zWorkDetailBody(x),{id:x.id});return}else if(a==='zWorkEditForm'){const x=(state.work||[]).find(z=>z.id===el.dataset.id);if(x)open('ÇALIŞMAYI DÜZENLE',zWorkForm(x),{id:x.id});return}else if(a==='zWorkDelete'){const wid=el.dataset.id;if(!confirm('Bu çalışma kaydı silinsin mi?'))return;state.work=(state.work||[]).filter(x=>x.id!==wid);state.receivables=(state.receivables||[]).filter(x=>x.workId!==wid);state.workRoads=(state.workRoads||[]).filter(x=>x.workId!==wid);await save();modal=null;render();return}if(a&&a.startsWith('edit')){const c=document.querySelector('.content');if(c)returnScrollTop=c.scrollTop;}if(a==='expenseView'){expenseView='normal';render();return;}if(a==='expenseGroupDetail'){open((el.dataset.date||'')+' · '+(el.dataset.cat||'GİDER'),expenseGroupDetailBody(el.dataset.date||'',el.dataset.cat||'Diğer'));return;}if(a==='toggleExpenseSection'){if(el.dataset.section==='normal')normalExpensesOpen=!normalExpensesOpen;else fixedExpensesOpen=!fixedExpensesOpen;render();return;}if(a==='editStatementFixedPayment'){const p=(state.fixedPayments||[]).find(z=>z.id===el.dataset.id),x=p?state.expenses.find(z=>z.id===p.expenseId):null;if(x&&p){open('ÖDEMEYİ DÜZENLE',`<form class="form" id="fixedPaymentForm"><div class="notice"><b>FATURA TUTARI: ${money(fixedBillAmount(x))}</b><br>GERÇEK ÖDENEN TUTAR gider hesabında esas alınır.</div>${input('amount','Gerçek Ödenen Tutar',p.amount||fixedBillAmount(x),'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',p.date||iso(),'date')}${select('category','Kategori',C,p.category||x.category||'Diğer')}<div class="field"><label>Ödeme Şekli</label><select name="source"><option value="cash" ${(p.source||'cash')==='cash'?'selected':''}>NAKİT</option><option value="card" ${p.source==='card'?'selected':''}>KART</option></select></div><div class="field"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${state.cards.map(c=>`<option value="${c.id}" ${p.cardId===c.id?'selected':''}>${esc(c.bank)} · ${esc(c.name)} · •••• ${esc(c.last4)}</option>`).join('')}</select></div><button class="btn gold" type="submit">KAYDET</button><button class="btn" type="button" data-action="toggleFixedPaid" data-id="${x.id}">ÖDEMEYİ GERİ AL</button></form>`,{id:x.id,paymentId:p.id});return}}else if(a==='hanFilter'){hanFilter=el.dataset.hanGroup||'TÜMÜ';render();return}else if(a==='hanSeverity'){hanSeverity=el.dataset.hanSeverity||'TÜMÜ';render();return}else if(a==='hanMigrationReview'){open('HAN · HANE ↔ RUTİN İNCELEME',hanMigrationReviewBody(el.dataset.recordId));return}else if(a==='hanMigrationDecision'){const id=el.dataset.findingId,decision=el.dataset.decision;if(!['same','different'].includes(decision))return;try{window.HANE_CORE?.resolveMigrationFinding?.(id,decision);modal=null;render();showToast(decision==='same'?'HAN: AYNI KAYIT OLARAK EŞLEŞTİRİLDİ':'HAN: FARKLI KAYIT OLARAK İŞARETLENDİ')}catch(e){alert(e.message||'Karar kaydedilemedi')}return}else if(a==='paymentSourceDetail'){open(el.dataset.source==='card'?'KREDİ KARTI HARCAMALARI':el.dataset.source==='flex'?'ESNEK HESAP HARCAMALARI':'NAKİT HARCAMALAR',paymentSourceDetailBody(el.dataset.source));return}else if(a==='openCardStatement'){cardStatementMonth=state.selectedMonth;open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='cardFormStyle'){const input=document.getElementById('cardStyleEditValue');if(input)input.value=cardStyleKey(el.dataset.style);el.closest('.cardStyleEditGrid')?.querySelectorAll('.cardStyleEditChoice').forEach(b=>b.classList.toggle('active',b===el));return;}else if(a==='cardDetail'){cardStatementMonth=state.selectedMonth;open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='cardMovements'){cardStatementMonth=state.selectedMonth;open('KART HAREKETLERİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});requestAnimationFrame(()=>document.querySelector('.modal .list')?.scrollIntoView({behavior:'smooth',block:'start'}));return}else if(a==='cardStatement'){cardStatementMonth=state.selectedMonth;open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='cardBankStatement'){const m=el.dataset.month||cardStatementMonth||'';open('BANKA EKSTRESİ',cardBankStatementBody(el.dataset.id,m),{cardId:el.dataset.id,statementMonth:m});return}else if(a==='bankStatementStep'){const c=state.cards.find(x=>String(x.id)===String(el.dataset.id));if(!c)return;const snaps=cardStatementSnaps(c);if(!snaps.length)return;let i=Math.max(0,snaps.findIndex(x=>x.month===cardStatementMonth));if(i<0)i=0;i=(i+(+el.dataset.dir||1)+snaps.length)%snaps.length;cardStatementMonth=snaps[i].month||'';render();return}else if(a==='cardStatementShift'){const [y,m]=(cardStatementMonth||state.selectedMonth).split('-').map(Number),d=new Date(y,m-1+(+(el.dataset.dir||0)),1);cardStatementMonth=ym(d);open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='statementImport'){const c=state.cards.find(x=>x.id===el.dataset.id);if(!c)return;statementImportCardId=c.id;statementImportRows=[];statementImportMeta={};const input=document.getElementById('statementImportInput');if(!input)return alert('Ekstre dosya seçici bulunamadı.');input.value='';input.click();return}else if(a==='statementImportConfirm'){await confirmStatementImport();return}if(a&&a.startsWith('edit')&&el?.dataset?.directEdit!=='1'){const d=haneRecordDetailSpec(a,el.dataset.id);if(d){open(d.title,d.body,{recordDetail:true});return}}if(a==='openTxFilters'){open('HAREKET FİLTRELERİ',txAdvancedFilterBody());return}else if(a==='roadFeeGroup'){open((el.dataset.date||'')+' · YOL ÜCRETLERİ',roadFeeGroupBody(el.dataset.date),{roadFeeDate:el.dataset.date})}else if(a==='clearTxSearch'){txSearch='';render()}else if(a==='runTxSearch'){txSearch=$('#txSearch')?.value||'';render()}else if(a==='togglePrivacy'){state.settings.privacy=!state.settings.privacy;await save();render()}else if(a==='clearTxFilters'){txDate=txCategory=txPay=txMin=txMax=txMember='';modal=null;render()}else if(a==='memberDetail'){open(memberName(el.dataset.id)+' · '+monthLabel(state.selectedMonth),memberDetailBody(el.dataset.id),{memberId:el.dataset.id})}else if(a==='addMember'){open('ÜYE EKLE',memberForm())}else if(a==='editMember'){const m=state.members.find(x=>x.id===el.dataset.id);if(m)open('ÜYEYİ DÜZENLE',memberForm(m),{id:m.id})}else if(a==='delMember'){if(el.dataset.id==='me'){alert('Admin profili silinemez.');return}const linked=(state.work||[]).filter(x=>x.memberId===el.dataset.id).length+(state.incomes||[]).filter(x=>x.memberId===el.dataset.id).length+(state.expenses||[]).filter(x=>x.memberId===el.dataset.id).length;if(!confirm(linked?`Bu üyeye bağlı ${linked} geçmiş kayıt var. Üye silinirse kayıtlar korunup Hane geneline aktarılacak. Devam edilsin mi?`:'Bu hane üyesi silinsin mi?'))return;state.members=state.members.filter(x=>x.id!==el.dataset.id);if(state.settings.activeMemberId===el.dataset.id)state.settings.activeMemberId='me';state.incomes.forEach(x=>{if(x.memberId===el.dataset.id)x.memberId=''});state.expenses.forEach(x=>{if(x.memberId===el.dataset.id)x.memberId=''});await save();modal=null;render()}else if(a==='homeMove'){const k=el.dataset.key,d=+el.dataset.dir,i=state.homeLayout.indexOf(k),j=Math.max(0,Math.min(state.homeLayout.length-1,i+d));if(i>=0&&i!==j){[state.homeLayout[i],state.homeLayout[j]]=[state.homeLayout[j],state.homeLayout[i]];await save();render()}}else if(a==='homeToggle'){const k=el.dataset.key;state.homeHidden=state.homeHidden.includes(k)?state.homeHidden.filter(x=>x!==k):[...state.homeHidden,k];await save();render()}else if(a==='receiptView'){const x=state.expenses.find(z=>z.id===el.dataset.id);if(x?.attachment)open('FİŞ / FATURA',`<div class="receiptViewer"><img src="${x.attachment}" alt="Fiş"><button class="btn" data-action="receiptReplace" data-id="${x.id}">DEĞİŞTİR</button><button class="btn" data-action="receiptDelete" data-id="${x.id}">SİL</button></div>`,{id:x.id})}else if(a==='receiptReplace'){modal={...modal,id:el.dataset.id};$('#receiptInput').click()}else if(a==='receiptDelete'){const x=state.expenses.find(z=>z.id===el.dataset.id);if(x){x.attachment='';await save();modal=null;render()}}else if(a==='openMenu')open('MENÜ',menuBody());else if(a==='menuGo'){goTo(el.dataset.go)}else if(a==='homeSummaryNav'){txFilter=el.dataset.kind==='income'?'income':el.dataset.kind==='expense'?'expense':'all';txSearch='';goTo('transactions')}else if(a==='summaryDetail'){open(el.dataset.kind==='income'?'GELİR DETAYI':el.dataset.kind==='expense'?'GİDER DETAYI':'KALAN DETAYI',summaryDetailBody(el.dataset.kind))}else if(a==='financeTab'){financeTab=el.dataset.finance;modal=null;render()}else if(a==='financePicker'){open('FİNANS',`<div class="financePickerList"><button data-action="financeTab" data-finance="cards">KARTLAR</button><button data-action="financeTab" data-finance="accounts">HESAPLAR</button><button data-action="financeTab" data-finance="debts">BORÇLAR</button></div>`);return}else if(a==='scrollCard'){financeCardIndex=Math.max(0,Math.min(state.cards.length-1,+el.dataset.index||0));render();requestAnimationFrame(()=>document.querySelector('.cardsV55Stage .isSelectedCard')?.focus({preventScroll:true}))}else if(a==='cardCarouselStep'){if(!state.cards.length)return;financeCardIndex=(financeCardIndex+(+el.dataset.dir||1)+state.cards.length)%state.cards.length;render();requestAnimationFrame(()=>document.querySelector('.cardsV55Stage .isSelectedCard')?.focus({preventScroll:true}))}else if(a==='fixedCategoryDetail'){const cat=el.dataset.cat||'Diğer',scope=el.dataset.scope||'all',source=el.dataset.source||'';open(cat+' · DETAY',fixedCategoryDetail(cat,scope,source),{category:cat,scope,source})}else if(a==='delCategoryRule'){const k=el.dataset.merchant||'';if(k&&state.statementCategoryRules){delete state.statementCategoryRules[k];await save();render();showToast('ÖĞRENME KURALI SİLİNDİ')}}else if(a==='clearCategoryRules'){if(confirm('Öğrenilen tüm işyeri-kategori kuralları temizlensin mi?')){state.statementCategoryRules={};await save();render();showToast('KATEGORİ ÖĞRENME TEMİZLENDİ')}}else if(a==='addCategory')open('KATEGORİ EKLE',categoryForm(),{oldCat:''});else if(a==='editCategory'){open('KATEGORİYİ DÜZENLE',categoryForm(el.dataset.cat),{oldCat:el.dataset.cat})}else if(a==='mergeCategory'){open('KATEGORİ BİRLEŞTİR',categoryMergeForm())}else if(a==='categoryMergeConfirm'){const src=el.dataset.source,tgt=el.dataset.target;if(confirm(src+' → '+tgt+' birleştirilsin mi?')){const n=categoryTransfer(src,tgt);normalizeV19(state);await save();modal=null;render();showToast(n+' KAYIT/KURAL BİRLEŞTİRİLDİ')}}else if(a==='categoryDeleteAsk'){open('KATEGORİYİ SİL / AKTAR',categoryDeleteForm(el.dataset.cat),{deleteCat:el.dataset.cat})}else if(a==='categoryDeleteEmpty'){const c=el.dataset.cat;if(confirm(c+' kategorisi silinsin mi?')){state.customCategories=state.customCategories.filter(x=>x!==c);delete state.categoryMeta[c];normalizeV19(state);await save();modal=null;render();showToast('KATEGORİ SİLİNDİ')}}else if(a==='addAccount')open('HESAP EKLE',accountForm());else if(a==='editAccount'){const x=state.accounts.find(z=>z.id===el.dataset.id);open('HESABI DÜZENLE',accountForm(x),{id:x.id})}else if(a==='delAccount'){state.accounts=state.accounts.filter(x=>x.id!==el.dataset.id);await save();modal=null;render()}else if(a==='accountSpend'||a==='accountIncome'){const x=state.accounts.find(z=>z.id===el.dataset.id);open(a==='accountSpend'?'HARCAMA EKLE':'GELİR EKLE',simpleAmountForm(a,x))}else if(a==='addFlex')open('ESNEK HESAP EKLE',flexForm());else if(a==='editFlex'){const x=state.flexAccounts.find(z=>z.id===el.dataset.id);open('ESNEK HESABI DÜZENLE',flexForm(x),{id:x.id})}else if(a==='delFlex'){state.flexAccounts=state.flexAccounts.filter(x=>x.id!==el.dataset.id);await save();modal=null;render()}else if(a==='flexSpend'||a==='flexPay'){const x=state.flexAccounts.find(z=>z.id===el.dataset.id);open(a==='flexSpend'?'HARCAMA EKLE':'ÖDEME YAPTIM',simpleAmountForm(a,x))}else if(a==='editFlexPayment'){const x=(state.flexTransactions||[]).find(z=>z.id===el.dataset.id);if(x)open('ESNEK HESAP ÖDEMESİNİ DÜZENLE',`<form class="form" id="flexPaymentEditForm">${input('amount','Tutar',x.amount,'number','step="0.01" min="0"')}${input('date','Tarih',x.date,'date')}${input('title','Açıklama',x.title||'')}<button class="btn gold">KAYDET</button><button type="button" class="btn" data-action="delFlexPayment" data-id="${x.id}">SİL</button></form>`,{id:x.id})}else if(a==='delFlexPayment'){const x=(state.flexTransactions||[]).find(z=>z.id===el.dataset.id);if(x){const f=state.flexAccounts.find(a=>a.id===x.flexId);if(f)f.balance=(+f.balance||0)+(+x.amount||0);state.flexTransactions=state.flexTransactions.filter(z=>z.id!==x.id);await save();modal=null;render();showToast('SİLİNDİ')}}else if(a==='delFixedPaymentExact'){const p=(state.fixedPayments||[]).find(z=>z.id===el.dataset.id);if(p){state.fixedPayments=state.fixedPayments.filter(z=>z.id!==p.id);const ex=state.expenses.find(z=>z.id===p.expenseId);if(ex){ex.paidMonths=(ex.paidMonths||[]).filter(m=>m!==p.month);if(String(ex.date||'').slice(0,7)===p.month)ex.paid=false}await save();modal=null;render();showToast('SİLİNDİ')}}else if(a==='editCardPayment'){const x=state.cardPayments.find(z=>z.id===el.dataset.id);if(x)open('ÖDEMEYİ DÜZENLE',cardPaymentEditForm(x),{id:x.id})}else if(a==='delCardPayment'){state.cardPayments=state.cardPayments.filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('SİLİNDİ')}else if(a==='back'){goBack()}else if(a==='txFilter'){txFilter=el.dataset.filter||'all';render()}else if(a==='txView'){txView=el.dataset.view||'list';render()}else if(a==='goCards'){goTo('cards')}else if(a==='calendarTab'){calendarView=el.dataset.view==='day'?'day':'month';render()}else if(a==='calendarDayPrev'){const d=new Date(calendarDay+'T12:00:00');d.setDate(d.getDate()-1);calendarDay=iso(d);calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';save().then(()=>render())}else if(a==='calendarDayNext'){const d=new Date(calendarDay+'T12:00:00');d.setDate(d.getDate()+1);calendarDay=iso(d);calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';save().then(()=>render())}else if(a==='monthPrev'){state.selectedMonth=monthShiftValue(state.selectedMonth,-1);calendarMonth=state.selectedMonth;calendarDay='';await save();render()}else if(a==='monthNext'){state.selectedMonth=monthShiftValue(state.selectedMonth,1);calendarMonth=state.selectedMonth;calendarDay='';await save();render()}else if(a==='monthToday'){state.selectedMonth=ym(new Date());calendarMonth=state.selectedMonth;calendarDay='';await save();render()}else if(a==='calendarDay'){calendarDay=el.dataset.date;calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';open('GÜN İŞLEMLERİ',calendarDayManageBody(calendarDay),{calendarDate:calendarDay})}else if(a==='calendarDayAddIncome'){const d=el.dataset.date||calendarDay||iso();open('Gelir Ekle',incomeForm({date:d}),{calendarDate:d})}else if(a==='calendarDayAddExpense'){const d=el.dataset.date||calendarDay||iso();open('Gider Ekle',expenseForm({date:d}),{calendarDate:d})}else if(a==='calendarPrev'){let [y,m]=calendarMonth.split('-').map(Number);m--;if(m<1){m=12;y--}calendarMonth=y+'-'+String(m).padStart(2,'0');state.selectedMonth=calendarMonth;calendarDay='';save().then(()=>render())}else if(a==='calendarNext'){let [y,m]=calendarMonth.split('-').map(Number);m++;if(m>12){m=1;y++}calendarMonth=y+'-'+String(m).padStart(2,'0');state.selectedMonth=calendarMonth;calendarDay='';save().then(()=>render())}else if(a==='hanOpenStatementInspect'){const cid=el.dataset.recordId,m=el.dataset.month||state.selectedMonth;if((state.cards||[]).some(x=>String(x.id)===String(cid))){cardStatementMonth=m;open('KART EKSTRESİ',cardStatementBody(cid,m),{cardId:cid})}return}else if(a==='hanInspect'){open('HAN · İNCELEME',hanInspectBody(el.dataset.issueTitle||'HAN İncelemesi',el.dataset.issueDetail||'',el.dataset.recordAction||'',el.dataset.recordId||'',el.dataset.recordId2||''),{hanInspect:true})}else if(a==='hanEditFromInspect'){let ra=el.dataset.recordAction;const rid=el.dataset.recordId;if(ra==='zWorkEdit')ra='zWorkEditForm';if(ra&&rid){const fake=document.createElement('button');fake.dataset.id=rid;fake.dataset.directEdit='1';await act(ra,fake)}}else if(a==='hanDeleteGeneric'){const da=el.dataset.deleteAction||'',rid=el.dataset.recordId||'';if(da&&rid){await act(da,{dataset:{id:rid,directEdit:'1'}});return}}else if(a==='hanDeleteFromInspect'){const rid=el.dataset.recordId,x=(state.expenses||[]).find(z=>String(z.id)===String(rid));if(x&&confirm('Bu finansal kayıt kalıcı olarak silinecek. Silmek istediğine emin misin?')){if(x.cardTxId)state.cardTransactions=state.cardTransactions.filter(t=>t.id!==x.cardTxId);state.fixedPayments=(state.fixedPayments||[]).filter(p=>p.expenseId!==rid);state.flexTransactions=(state.flexTransactions||[]).filter(t=>t.expenseId!==rid);state.expenses=state.expenses.filter(z=>String(z.id)!==String(rid));await save();modal=null;render();showToast('KAYIT SİLİNDİ')}}else if(a==='hanIssueOk'){state.settings=state.settings||{};state.settings.hanIgnored=Array.isArray(state.settings.hanIgnored)?state.settings.hanIgnored:[];const k=el.dataset.issueKey||'';if(k&&!state.settings.hanIgnored.includes(k))state.settings.hanIgnored.push(k);await save();modal=null;render();showToast('HAN: SIKINTI YOK OLARAK İŞARETLENDİ')}else if(a==='hanRun'){state.settings=state.settings||{};const audit=hanAudit(),curr=audit.issues.map(x=>({base:[String(x.title||''),String(x.recordAction||''),String(x.recordId||''),String(x.recordId2||'')].join('|'),full:hanIssueKey(x.title,x.recordId,x.recordId2||'',x.recordAction)})),prevRows=Array.isArray(state.settings.hanLastIssues)?state.settings.hanLastIssues:[],pm=new Map(prevRows.map(x=>[x.base,x.full])),cm=new Map(curr.map(x=>[x.base,x.full])),newCount=curr.filter(x=>!pm.has(x.base)).length,solvedCount=prevRows.filter(x=>!cm.has(x.base)).length,changedCount=curr.filter(x=>pm.has(x.base)&&pm.get(x.base)!==x.full).length;state.settings.hanLastScan=new Date().toISOString();state.settings.hanLastIssues=curr;state.settings.hanLastIssueKeys=curr.map(x=>x.full);state.settings.hanLastDelta={newCount,solvedCount,changedCount};state.settings.hanHistory=Array.isArray(state.settings.hanHistory)?state.settings.hanHistory:[];state.settings.hanHistory.push({at:state.settings.hanLastScan,bad:audit.issues.filter(x=>x.level==='bad').length,warn:audit.issues.filter(x=>x.level==='warn').length,info:audit.issues.filter(x=>x.level==='info').length,newCount,solvedCount});state.settings.hanHistory=state.settings.hanHistory.slice(-10);await save();render();showToast(`HAN: ${newCount} YENİ · ${solvedCount} ÇÖZÜLDÜ`)}else if(a==='taraRun'){render();showToast('HAN KONTROLÜ TAMAMLANDI')}else if(a==='reportPeriod'){reportPeriod=el.dataset.period||'month';const rn={day:1,week:1,month:1,month3:3,month6:6,month12:12}[reportPeriod]||1;reportMonths=rn;reportFlowMonths=rn;reportCategoryMonths=rn;render()}else if(a==='reportView'){reportView=el.dataset.view||'summary';render()}else if(a==='reportMonths'){reportMonths=+(el.dataset.months||6);render()}else if(a==='reportFlowMonths'){reportFlowMonths=+(el.dataset.months||6);render()}else if(a==='reportCategoryMonths'){reportCategoryMonths=+(el.dataset.months||1);render()}else if(a==='reportCardMetricDetail'){open(el.dataset.kind==='paid'?'KART ÖDEMELERİ':el.dataset.kind==='interest'?'FAİZ / VERGİ':'KART HARCAMALARI',reportCardMetricDetailBody(el.dataset.kind||'spend'));return}else if(a==='reportCompareDetail'){open('GEÇEN AY KARŞILAŞTIRMASI',reportCompareDetailBody());return}else if(a==='cardPayType'){const v=el.dataset.value||'Tek Çekim',inp=document.getElementById('cardPaymentType'),field=document.getElementById('installmentField');if(inp)inp.value=v;document.querySelectorAll('.cardPayTypeSeg button').forEach(b=>b.classList.toggle('active',b.dataset.value===v));if(field)field.classList.toggle('show',v==='Taksitli')}else if(a==='openTheme'){themeDraft={...(state.theme||{bg:'#05080d',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'})};current='theme';modal=null;render()}else if(a==='quickCards'){financeTab='cards';goTo('cards')}else if(a==='addNote'){open('Not Ekle',noteForm())}else if(a==='editNote'){const n=(state.notes||[]).find(x=>x.id===el.dataset.id);if(n)open('Notu Düzenle',noteForm(n),{id:n.id})}else if(a==='delNote'){state.notes=(state.notes||[]).filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('NOT SİLİNDİ')}else if(a==='calendarAddMenu'){const d=calendarDay||iso();open('Kayıt Ekle',`<div class="calendarAddChoices"><button class="btn" data-action="calendarDayAddIncome" data-date="${esc(d)}">+ GELİR</button><button class="btn" data-action="calendarDayAddExpense" data-date="${esc(d)}">+ GİDER</button></div>`,{calendarDate:d})}else if(a==='addIncome')open('Gelir Ekle',incomeForm());else if(a==='editIncome'){const x=state.incomes.find(z=>z.id===el.dataset.id);open('Geliri Düzenle',incomeForm(x),{id:x.id})}else if(a==='delIncome'){state.incomes=state.incomes.filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('SİLİNDİ')}else if(a==='addExpense')open('Gider Ekle',expenseForm());else if(a==='addFixedExpense')open('Gider Ekle',expenseForm({recurring:true,category:'Kira',dueDate:iso()}));else if(a==='editFixedExpense'){const x=state.expenses.find(z=>z.id===el.dataset.id);open('Gideri Düzenle',expenseForm(x),{id:x.id})}else if(a==='editExpense'){const x=state.expenses.find(z=>z.id===el.dataset.id);open('Gideri Düzenle',expenseForm(x),{id:x.id})}else if(a==='delExpense'){const ex=state.expenses.find(x=>x.id===el.dataset.id);if(ex?.cardTxId)state.cardTransactions=state.cardTransactions.filter(t=>t.id!==ex.cardTxId);state.fixedPayments=(state.fixedPayments||[]).filter(p=>p.expenseId!==el.dataset.id);state.flexTransactions=(state.flexTransactions||[]).filter(t=>t.expenseId!==el.dataset.id);state.expenses=state.expenses.filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('SİLİNDİ')}else if(a==='toggleFixedPaid'){const x=state.expenses.find(z=>z.id===el.dataset.id);if(x){x.paidMonths=Array.isArray(x.paidMonths)?x.paidMonths:[];state.fixedPayments=Array.isArray(state.fixedPayments)?state.fixedPayments:[];const m=state.selectedMonth,was=fixedPaidForMonth(x,m);if(was){x.paidMonths=x.paidMonths.filter(v=>v!==m);state.fixedPayments=state.fixedPayments.filter(p=>!(p.expenseId===x.id&&p.month===m));await save();render();showToast('ÖDEME GERİ ALINDI')}else{const expected=fixedBillAmount(x),payDate=dateForSelectedMonth(x.dueDate||x.date,m);open('GİDER ÖDEMESİ',`<form class="form" id="fixedPaymentConfirmForm"><div class="notice fixedPayCompare"><small>BEKLENEN / NORMAL TUTAR</small><b>${money(expected)}</b><div id="fixedPayDiff">Tutar aynıysa doğrudan onaylayabilirsin.</div></div>${input('amount','Gerçek Ödenen Tutar',expected,'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',payDate,'date')}<div class="field"><label>Ödeme Şekli</label><select name="source" id="fixedPaySourceNew"><option value="cash" ${x.source!=='card'?'selected':''}>NAKİT</option><option value="card" ${x.source==='card'?'selected':''}>KART</option></select></div><div class="field" id="fixedPayCardWrapNew"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${state.cards.map(c=>`<option value="${c.id}" ${x.cardId===c.id?'selected':''}>${esc(c.bank)} · ${esc(c.name)}</option>`).join('')}</select></div><button class="btn gold" type="submit">ÖDEMEYİ ONAYLA</button></form>`,{id:x.id,fixedMonth:m,expectedAmount:expected});return}}}else if(a==='editFixedPayment'){const x=state.expenses.find(z=>z.id===el.dataset.id),p=fixedPaymentFor(x);if(x&&p)open('ÖDEMEYİ DÜZENLE',`<form class="form" id="fixedPaymentForm"><div class="notice"><b>FATURA TUTARI: ${money(fixedBillAmount(x))}</b><br>GERÇEK ÖDENEN TUTAR gider hesabında esas alınır.</div>${input('amount','Gerçek Ödenen Tutar',p.amount||fixedBillAmount(x),'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',p.date||iso(),'date')}${select('category','Kategori',C,p.category||x.category||'Diğer')}<div class="field"><label>Ödeme Şekli</label><select name="source" id="fixedPaySource"><option value="cash" ${(p.source||'cash')==='cash'?'selected':''}>NAKİT</option><option value="card" ${p.source==='card'?'selected':''}>KART</option></select></div><div class="field"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${state.cards.map(c=>`<option value="${c.id}" ${p.cardId===c.id?'selected':''}>${esc(c.bank)} · ${esc(c.name)} · •••• ${esc(c.last4)}</option>`).join('')}</select></div><button class="btn gold" type="submit">KAYDET</button><button class="btn" type="button" data-action="toggleFixedPaid" data-id="${x.id}">ÖDEMEYİ GERİ AL</button></form>`,{id:x.id,paymentId:p.id})}else if(a==='addCard')open('Kart Ekle',cardForm());else if(a==='editCard'){const c=state.cards.find(z=>z.id===el.dataset.id);open('Kartı Düzenle',cardForm(c),{id:c.id})}else if(a==='delCard'){const cid=el.dataset.id,linkedExpense=(state.expenses||[]).some(x=>x.cardId===cid),linkedPay=(state.cardPayments||[]).some(x=>x.cardId===cid);if(linkedExpense||linkedPay||(state.workRoads||[]).some(x=>x.cardId===cid)){alert('Bu karta bağlı geçmiş harcama veya ödeme kayıtları var. Ekstre ve finans geçmişinin bozulmaması için kart silinemez.');return}state.cards=state.cards.filter(x=>x.id!==cid);await save();modal=null;render();showToast('KART SİLİNDİ')}else if(a==='cardSpend'){const c=state.cards.find(x=>x.id===el.dataset.id);open('Kart Harcaması Ekle',cardSpendForm(c),{cardId:c.id})}else if(a==='cardPay'){const c=state.cards.find(x=>x.id===el.dataset.id);open('Ödeme Yaptım',cardPayForm(c),{cardId:c.id})}else if(a==='memberThemePreset'){const picker=$('#memberThemeColor'),studio=el.closest('.memberThemeStudio');if(picker){picker.value=el.dataset.color||'#2497ff';picker.dispatchEvent(new Event('input',{bubbles:true}))}if(studio){studio.style.setProperty('--member-theme',el.dataset.color||'#2497ff');studio.querySelectorAll('.memberThemePreset').forEach(b=>b.classList.toggle('active',b===el))}}else if(a==='cashGivenAdd'){open('VERİLEN PARA EKLE',cashEntryForm('given'))}else if(a==='cashManualAdd'){open('NAKİT PARA · KAYIT EKLE',cashEntryForm('manual'))}else if(a==='cashGivenDel'){state.cashGiven=(state.cashGiven||[]).filter(x=>x.id!==el.dataset.id);await save();render();showToast('VERİLEN PARA KAYDI SİLİNDİ')}else if(a==='cashManualDel'){state.cashManual=(state.cashManual||[]).filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('KAYIT SİLİNDİ')}else if(a==='cashToggleInclude'){const key=el.dataset.key,m=el.dataset.month||state.selectedMonth;state.cashExcluded=Array.isArray(state.cashExcluded)?state.cashExcluded:[];const i=state.cashExcluded.findIndex(x=>x.key===key&&x.month===m);if(i>=0)state.cashExcluded.splice(i,1);else state.cashExcluded.push({key,month:m});await save();modal=null;render();showToast(i>=0?'HARCAMA YENİDEN DAHİL EDİLDİ':'HARCAMA NAKİT PARA TOPLAMINDAN ÇIKARILDI')}else if(a==='cashDetail'){const t=cashMoneyTotals(state.selectedMonth),g=el.dataset.group,rows=g==='manual'?t.manual:t.auto.filter(x=>x.group===g),title=g==='rent'?'KİRA':g==='dues'?'AİDAT':g==='manual'?'EKLENEN KAYITLAR':'DİĞER NAKİT HARCAMALAR';open(title,cashMoneyDetailRows(rows,g==='manual'))}else if(a==='cashDetails'){const F=cashFlow();open('Bu Ay · Harcanan / Ödenen',`<div class="cashDetail"><div class="notice"><b>Bu Ay Harcanan: ${money(F.spent)}</b><br>Bu ay yaptığın gerçek ev harcamalarıdır.</div><div class="notice" style="margin-top:8px"><b>Bu Ay Ödenen: ${money(F.paid)}</b><br>Kart ödemeleri ${money(F.cardPaid)} + nakit/ödenmiş giderler ${money(F.directPaid)}.</div><div class="notice" style="margin-top:8px">Kart ödemeleri yeniden gider sayılmaz. Önceki aylardan gelen kart borcu ödesen bile sadece “Bu Ay Ödenen” bölümünde görünür.</div></div>`)}else if(a==='zWorkSummaryDetail'){const k=el.dataset.kind,mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);open(k==='earned'?'ALINAN ÖDEMELER':k==='owed'?'KALAN ALACAK':'HAKEDİŞ DETAYI',k==='owed'?(mem?`<div class="workMoneyDetailHead"><b>${esc(mem.name)}</b><span>${monthLabel(state.selectedMonth)} · KALAN</span></div><div class="workMoneyBalance"><div><small>HAKEDİŞ</small><b>${money(zMemberMonthEntitlement(mem,state.selectedMonth).total)}</b></div><div><small>ALINAN</small><b>${money(zMemberMonthPaid(mem.id,state.selectedMonth))}</b></div><div class="remain"><small>KALAN</small><b>${money(zMemberMonthRemaining(mem,state.selectedMonth))}</b></div></div><button class="btn gold workMoneyPayBtn" data-action="zWorkMonthPay" data-id="${esc(mem.id)}">ÖDEME EKLE</button>`:'<div class="notice">Çalışma profili yok.</div>'):zWorkSummaryModal(k))}else if(a==='memberOverview'){const mem=(state.members||[]).find(x=>x.id===el.dataset.id);if(mem)open('PROFİL ÖZETİ',memberOverviewBody(mem))}else if(a==='memberOverviewDetail'){const mem=(state.members||[]).find(x=>x.id===el.dataset.id);if(mem)open('PROFİL DETAYI',memberOverviewDetailBody(mem,el.dataset.kind))}else if(a==='openAdminProfile'){const admin=(state.members||[]).find(x=>x.id==='me'||x.role==='admin')||(state.members||[])[0];identityMemberId=admin?.id||'me';modal=null;goTo('identity');return}else if(a==='showIdentity'){const admin=(state.members||[]).find(x=>x.id==='me'||x.role==='admin')||(state.members||[])[0];identityMemberId=admin?.id||'me';modal=null;goTo('identity');return;}else if(a==='editIdentity')open('HANE · KİMLİK DÜZENLE',identityForm());else if(a==='editProfile')open('Profili Düzenle',profileForm());else if(a==='pickProfile')$('#profileInput').click();else if(a==='attachReceipt'){rememberModalForm();$('#receiptInput').click()}else if(a==='receipt'){rememberModalForm();$('#receiptInput').click()}else if(a==='close'){modal=null;render()}else if(a==='pickBg')open('Arka Plan Rengi',colorForm('bg','Arka Plan Rengi'));else if(a==='pickSurface')open('Kart / Panel Rengi',colorForm('surface','Kart / Panel Rengi'));else if(a==='pickSurface2')open('İkincil Yüzey',colorForm('surface2','İkincil Yüzey'));else if(a==='pickText')open('Ana Yazı Rengi',colorForm('text','Ana Yazı Rengi'));else if(a==='pickMuted')open('İkincil Yazı Rengi',colorForm('muted','İkincil Yazı Rengi'));else if(a==='pickAccent')open('Detay Rengi',colorForm('accent','Detay Rengi'));else if(a==='pickIncome')open('Grafik Gelir',colorForm('income','Gelir Rengi'));else if(a==='pickExpense')open('Grafik Gider',colorForm('expense','Gider Rengi'));else if(a==='pickRemain')open('Grafik Kalan',colorForm('remain','Kalan Rengi'));else if(a==='saveColor'){if(!themeDraft)themeDraft={...(state.theme||{})};themeDraft[el.dataset.kind]=$('#nativeColor').value;applyTheme(themeDraft);modal=null;render()}else if(a==='preset'){if(!themeDraft)themeDraft={...(state.theme||{})};themeDraft.bg=el.dataset.bg;themeDraft.accent=el.dataset.accent;applyTheme(themeDraft);render()}else if(a==='presetFull'){try{themeDraft={...themeDraft,...JSON.parse(el.dataset.theme||'{}')};applyTheme(themeDraft);render()}catch(e){showToast('TEMA ÖNİZLEMESİ AÇILAMADI')}}else if(a==='resetTheme'){themeDraft={bg:'#05080d',surface:'#0b1118',surface2:'#0f1720',text:'#eef7ff',muted:'#92a3b5',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'};applyTheme(themeDraft);render()}else if(a==='saveTheme'){state.theme={...themeDraft};await save();themeDraft=null;applyTheme();current='profile';render();alert('Tema kaydedildi.')}else if(a==='cancelTheme'){themeDraft=null;applyTheme();current='profile';render()}else if(a==='rutinImport'){const i=$('#rutinImportInput');if(i){i.value='';i.click()}return}else if(a==='zReconcile'){const r=window.HANE_CORE?.reconcileFinance?.();if(!r)return alert('Eşleştirme motoru hazır değil.');render();alert(`HANE ↔ RUTİN eşleştirmesi tamamlandı.\nKesin eşleşen: ${r.exact.length}\nOlası eşleşme: ${r.possible.length}\nHANE açık: ${r.unmatchedHane.length}\nRUTİN açık: ${r.unmatchedRutin.length}\n\nHiçbir finans kaydı silinmedi veya değiştirilmedi.`)}else if(a==='backupNow')backupNow();else if(a==='restoreNow')$('#restoreInput').click();else if(a==='changePin')changePin();else if(a==='toggleDarkMode'){state.settings.darkMode=!(state.settings.darkMode!==false);await save();applyTheme();render();showToast(state.settings.darkMode?'KARANLIK MOD AÇILDI':'KARANLIK MOD KAPATILDI')}else if(a==='clearAll'){if(confirm('Tüm HANE verileri silinsin mi?')){localStorage.removeItem(META);localStorage.removeItem(DATA);location.reload()}}}

function bind(){
  // Sabit giderlerde manuel sürükle-bırak kapatıldı; durum sıralaması otomatik.
  // Takvimde yatay kaydırma: sola sonraki ay, sağa önceki ay.
  const calPage=document.querySelector('.calendarPage');
  if(calPage){
    let sx=0,sy=0,tracking=false;
    calPage.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;sx=t.clientX;sy=t.clientY;tracking=true},{passive:true});
    calPage.addEventListener('touchend',e=>{
      if(!tracking)return;tracking=false;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;
      const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<55||Math.abs(dx)<=Math.abs(dy)*1.25)return;
      let [y,m]=calendarMonth.split('-').map(Number);
      if(dx<0){m++;if(m>12){m=1;y++}}else{m--;if(m<1){m=12;y--}}
      calendarMonth=y+'-'+String(m).padStart(2,'0');state.selectedMonth=calendarMonth;calendarDay='';save().then(()=>render());
    },{passive:true});
  }
  const calDayPanel=document.querySelector('.calendarDayPanel');
  if(calDayPanel){
    let dsx=0,dsy=0,dtracking=false;
    calDayPanel.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;dsx=t.clientX;dsy=t.clientY;dtracking=true},{passive:true});
    calDayPanel.addEventListener('touchend',e=>{
      if(!dtracking)return;dtracking=false;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;
      const dx=t.clientX-dsx,dy=t.clientY-dsy;if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy)*1.1)return;
      const d=new Date(calendarDay+'T12:00:00');
      d.setDate(d.getDate()+(dx<0?1:-1));
      calendarDay=iso(d);calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';save().then(()=>render());
    },{passive:true});
  }
  // Ana sekmeler yatay swipe ile DEGISTIRILMEZ. Yatay hareket sadece izinli yerel bilesenlerde kullanilir.
  const contentRoot=document.querySelector('.content');
  if(contentRoot){let gsx=0,gsy=0,gtrack=false;contentRoot.addEventListener('touchstart',e=>{const t=e.touches?.[0];if(!t)return;gsx=t.clientX;gsy=t.clientY;gtrack=true},{passive:true});contentRoot.addEventListener('touchmove',e=>{if(!gtrack)return;const t=e.touches?.[0];if(!t)return;const dx=t.clientX-gsx,dy=t.clientY-gsy;if(Math.abs(dx)<=Math.abs(dy)||Math.abs(dx)<12)return;const allowed=e.target.closest?.('[data-home-month-swipe="1"],.calendarPremium,.calendarDayPanel,.financeCarousel,.cardsV55Stage,.fixedList,.cropStage');if(!allowed)e.preventDefault()},{passive:false});contentRoot.addEventListener('touchend',()=>{gtrack=false},{passive:true});}
  const cardSwipe=document.querySelector('.cardsV55Stage, .financeCarousel');
  if(cardSwipe&&state.cards.length>1){
    let csx=0,csy=0,ctrack=false,pid=null,dragged=false;
    const cardStep=dx=>{financeCardIndex=(financeCardIndex+(dx<0?1:-1)+state.cards.length)%state.cards.length;render()};
    cardSwipe.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;pid=e.pointerId;csx=e.clientX;csy=e.clientY;ctrack=true;dragged=false;try{cardSwipe.setPointerCapture(pid)}catch(_){}});
    cardSwipe.addEventListener('pointermove',e=>{if(!ctrack||pid!==e.pointerId)return;const dx=e.clientX-csx,dy=e.clientY-csy;if(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy))dragged=true;});
    cardSwipe.addEventListener('pointerup',e=>{if(!ctrack||pid!==e.pointerId)return;ctrack=false;const dx=e.clientX-csx,dy=e.clientY-csy;try{cardSwipe.releasePointerCapture(pid)}catch(_){}pid=null;if(dragged&&Math.abs(dx)>=45&&Math.abs(dx)>Math.abs(dy)*1.15){e.preventDefault();cardStep(dx)}});
    cardSwipe.addEventListener('pointercancel',()=>{ctrack=false;pid=null;dragged=false});
  }
  const statementSwipe=document.querySelector('[data-statement-swipe="1"]');
  if(statementSwipe){let ssx=0,ssy=0,strack=false;statementSwipe.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;ssx=t.clientX;ssy=t.clientY;strack=true},{passive:true});statementSwipe.addEventListener('touchend',e=>{if(!strack)return;strack=false;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const dx=t.clientX-ssx,dy=t.clientY-ssy;if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy)*1.15)return;const c=state.cards.find(x=>String(x.id)===String(statementSwipe.dataset.cardId));if(!c)return;const snaps=cardStatementSnaps(c);if(snaps.length<2)return;let i=snaps.findIndex(x=>x.month===cardStatementMonth);if(i<0)i=0;i=(i+(dx<0?1:-1)+snaps.length)%snaps.length;cardStatementMonth=snaps[i].month||'';render()},{passive:true});}
  const homeMonthSwipe=document.querySelector('[data-home-month-swipe="1"]');
  if(homeMonthSwipe){let hsx=0,hsy=0,htrack=false;homeMonthSwipe.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;hsx=t.clientX;hsy=t.clientY;htrack=true},{passive:true});homeMonthSwipe.addEventListener('touchend',e=>{if(!htrack)return;htrack=false;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const dx=t.clientX-hsx,dy=t.clientY-hsy;if(Math.abs(dx)<48||Math.abs(dx)<=Math.abs(dy)*1.15)return;state.selectedMonth=monthShiftValue(state.selectedMonth,dx<0?1:-1);calendarMonth=state.selectedMonth;calendarDay='';save().then(()=>render())},{passive:true});}
  $$('[data-tab]').forEach(x=>x.onclick=()=>{const next=x.dataset.tab;if(next==='theme')themeDraft={...(state.theme||{})};else if(current==='theme'){themeDraft=null;applyTheme();}goTo(next)});
  $$('[data-action]').forEach(x=>x.onclick=e=>{if(x.closest('form')&&x.type==='submit')return;e.stopPropagation();act(x.dataset.action,x)});
  const liveTxSearch=$('#txSearch');
  if(liveTxSearch) liveTxSearch.oninput=e=>{txSearch=e.currentTarget.value;render();const n=$('#txSearch');if(n){n.focus();const L=n.value.length;try{n.setSelectionRange(L,L)}catch(_){}}};

  const txAdvancedFilterForm=$('#txAdvancedFilterForm');
  if(txAdvancedFilterForm) txAdvancedFilterForm.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());txDate=d.date||'';txCategory=d.category||'';txPay=d.pay||'';txMin=d.min||'';txMax=d.max||'';txMember=d.member||'';modal=null;render()};

  const incomeFormEl=$('#incomeForm');
  if(incomeFormEl) incomeFormEl.onsubmit=async e=>{e.preventDefault();try{await saveIncome(Object.fromEntries(new FormData(e.currentTarget).entries()),modal?.id);showToast(modal?.id?'GELİR GÜNCELLENDİ':'GELİR EKLENDİ')}catch(err){console.error(err);alert('Gelir kaydedilemedi: '+(err?.message||err))}};

  const categoryFormEl=$('#categoryForm');if(categoryFormEl){categoryFormEl.querySelectorAll('[data-icon-key]').forEach(b=>b.onclick=()=>{categoryFormEl.querySelectorAll('[data-icon-key]').forEach(x=>x.classList.toggle('active',x===b));categoryFormEl.querySelector('[name="iconKey"]').value=b.dataset.iconKey||'Diğer'});categoryFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),old=modal?.oldCategory||'',name=String(d.name||'').trim();if(!name)return alert('Kategori adı boş olamaz.');if(old&&old!==name)categoryTransfer(old,name);if(!C.includes(name))C.push(name);if(!NORMAL_C.includes(name))NORMAL_C.push(name);state.customCategories=Array.isArray(state.customCategories)?state.customCategories:[];if(!BASE_C.includes(name)&&!state.customCategories.includes(name))state.customCategories.push(name);state.categoryMeta=state.categoryMeta||{};state.categoryMeta[name]={...(state.categoryMeta[name]||{}),iconKey:d.iconKey||name,color:d.color||catColor(name)};await save();modal=null;render();showToast('KATEGORİ KAYDEDİLDİ')}}
  const categoryDeleteTransferFormEl=$('#categoryDeleteTransferForm');if(categoryDeleteTransferFormEl)categoryDeleteTransferFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries());if(!d.source||!d.target||d.source===d.target)return alert('Geçerli hedef kategori seçin.');const moved=categoryTransfer(d.source,d.target);await save();modal=null;render();showToast(moved+' KAYIT AKTARILDI')};
  const zWorkDeductionFormEl=$('#zWorkDeductionForm');if(zWorkDeductionFormEl)zWorkDeductionFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),amount=parseMoneyInput(d.amount);if(!Number.isFinite(amount)||amount<=0)return alert('Kesinti tutarı 0’dan büyük olmalı.');state.workDeductions=Array.isArray(state.workDeductions)?state.workDeductions:[];const row={id:d.id||('ded_'+id()),memberId:d.memberId,date:d.date||iso(),reason:d.reason||'Diğer',amount:money2(amount),note:String(d.note||'').trim()};const i=state.workDeductions.findIndex(x=>x.id===row.id);if(i>=0)state.workDeductions[i]=row;else state.workDeductions.push(row);await save();modal=null;render();showToast('MAAŞ KESİNTİSİ KAYDEDİLDİ')};
  const categoryMergeFormEl=$('#categoryMergeForm');
  if(categoryMergeFormEl) categoryMergeFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),source=d.source,target=d.target;if(!source||!target)return alert('Kaynak ve hedef kategori seçin.');if(source===target)return alert('Kaynak ve hedef kategori aynı olamaz.');const count=categoryUsageCount(source);if(!count)return alert('Bu kategoriye bağlı kayıt bulunamadı.');if(!confirm(source+' kategorisindeki '+count+' kayıt/kural '+target+' kategorisine aktarılsın mı?'))return;const moved=categoryTransfer(source,target);await save();modal=null;render();showToast(moved+' KAYIT/KURAL '+target+' KATEGORİSİNE AKTARILDI')};
  // V98: Gider formundaki görsel kategori ve ödeme kaynağı butonlarını gerçek form alanlarına bağla.
  // Önceki sürümde buton görsel olarak seçiliyor sanılırken hidden/select değeri Market'te kalabiliyordu.
  const expenseFormEl=$('#expenseForm');
  if(expenseFormEl){
    expenseFormEl.querySelectorAll('.premiumCatBtn[data-cat]').forEach(b=>b.onclick=()=>{const sel=expenseFormEl.elements.normalCategory;if(sel)sel.value=b.dataset.cat||'Diğer';syncExpenseFormUI()});
    expenseFormEl.querySelectorAll('[data-pay-source]').forEach(b=>b.onclick=()=>{const h=expenseFormEl.elements.source;if(h)h.value=b.dataset.paySource==='card'?'card':'cash';syncExpenseFormUI()});
  }
  if(expenseFormEl) expenseFormEl.onsubmit=async e=>{e.preventDefault();try{const payload=Object.fromEntries(new FormData(e.currentTarget).entries());await saveExpense(payload,modal?.id);if(payload.date&&/^\d{4}-\d{2}-\d{2}$/.test(payload.date))state.selectedMonth=payload.date.slice(0,7);await save();showToast(modal?.id?'GİDER GÜNCELLENDİ':'GİDER EKLENDİ')}catch(err){console.error(err);alert('Gider kaydedilemedi: '+(err?.message||err))}};

  const roadStandaloneForm=$('#zWorkRoadStandaloneForm');
  if(roadStandaloneForm){
    const syncRoadSource=()=>{const source=roadStandaloneForm.querySelector('input[name="source"]:checked')?.value||'cash',wrap=roadStandaloneForm.querySelector('.roadDayCardWrap');if(wrap)wrap.style.display=source==='card'?'block':'none'};
    roadStandaloneForm.querySelectorAll('input[name="source"]').forEach(r=>r.onchange=syncRoadSource);syncRoadSource();
    roadStandaloneForm.onsubmit=async e=>{e.preventDefault();const status=roadStandaloneForm.querySelector('#roadSaveStatusV37');try{const d=Object.fromEntries(new FormData(roadStandaloneForm).entries()),mid=d.memberId||state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid),amount=parseMoneyInput(d.amount),source=d.source==='card'?'card':'cash',cardId=source==='card'?(d.cardId||''):null,date=d.date||iso(),rid=d.id||('road_'+id());if(!mem)throw new Error('Seçili HANE üyesi bulunamadı.');if(!Number.isFinite(amount)||amount<=0)throw new Error('Yol ücreti 0’dan büyük olmalı.');if(source==='card'&&!cardId)throw new Error('Kredi kartı seçin.');state.workRoads=Array.isArray(state.workRoads)?state.workRoads:[];const old=state.workRoads.find(x=>x.id===rid),row={...(old||{}),id:rid,workId:old?.workId||null,memberId:mid,date,title:'YOL ÜCRETİ',category:'Ulaşım',amount:money2(amount),actualAmount:money2(amount),source,cardId};const i=state.workRoads.findIndex(x=>x.id===rid);if(i>=0)state.workRoads[i]=row;else state.workRoads.push(row);if(status){status.textContent='KAYDEDİLİYOR…';status.className='roadSaveStatus saving'}await save();const check=(state.workRoads||[]).find(x=>x.id===rid);if(!check)throw new Error('Kayıt belleğe yazılamadı.');open('GÜN KAYITLARI',zWorkDayBody(date));showToast('YOL ÜCRETİ KAYDEDİLDİ')}catch(err){console.error('V37 yol ücreti',err);if(status){status.textContent='HATA: '+(err?.message||err);status.className='roadSaveStatus error'}alert('Yol ücreti kaydedilemedi: '+(err?.message||err))}};
  }
  const noteFormEl=$('#noteForm');
  if(noteFormEl) noteFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),nid=modal?.id||id(),old=(state.notes||[]).find(x=>x.id===nid);const n={id:nid,title:upper((d.title||'NOT').trim()||'NOT'),body:String(d.body||'').trim(),date:d.date||iso(),createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};state.notes=Array.isArray(state.notes)?state.notes:[];const i=state.notes.findIndex(x=>x.id===nid);if(i>=0)state.notes[i]=n;else state.notes.push(n);await save();modal=null;render();showToast('NOT KAYDEDİLDİ')};

  const rutinImportInput=$('#rutinImportInput');if(rutinImportInput&&!rutinImportInput.dataset.bound){rutinImportInput.dataset.bound='1';rutinImportInput.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;try{const result=await window.HANE_IMPORT.importRutinFile(f);const applied=window.HANE_IMPORT.applyRutinWorkToApp(state);await save();render();alert(`RUTİN aktarımı tamamlandı.\nÇalışma: ${applied.workAdded} yeni / ${applied.workSkipped} mevcut\nYol: ${applied.roadAdded} yeni / ${applied.roadSkipped} mevcut\nKaynak yedek değiştirilmedi.`)}catch(err){alert('RUTİN aktarımı yapılamadı: '+(err?.message||err))}finally{e.target.value=''}})};
  const stmtSwipe=document.querySelector('.statementV60');if(stmtSwipe&&!stmtSwipe.dataset.swipeBound){stmtSwipe.dataset.swipeBound='1';let sx=0,sy=0;stmtSwipe.addEventListener('touchstart',e=>{const t=e.touches?.[0];if(t){sx=t.clientX;sy=t.clientY}},{passive:true});stmtSwipe.addEventListener('touchend',e=>{const t=e.changedTouches?.[0];if(!t)return;const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.2)return;const cid=modal?.cardId;if(!cid)return;cardStatementMonth=monthShiftValue(cardStatementMonth||state.selectedMonth,dx<0?1:-1);open('KART EKSTRESİ',cardStatementBody(cid,cardStatementMonth),{cardId:cid})},{passive:true})}
  const reportMemberSelect=$('#reportMemberSelect');if(reportMemberSelect)reportMemberSelect.onchange=()=>{reportMemberId=reportMemberSelect.value||'all';render()};
  const v2WorkMember=$('#v2WorkMember');if(v2WorkMember)v2WorkMember.onchange=async()=>{const next=v2WorkMember.value||'me',mem=(state.members||[]).find(x=>x.id===next);state.settings.activeMemberId=next;await save();render();showToast((mem?.name||'PROFİL')+' ÇALIŞMA PROFİLİ SEÇİLDİ')};
  const memberSalary=$('#memberSalary'),memberDaily=$('#memberDailyWage');if(memberSalary&&memberDaily)memberSalary.oninput=()=>{memberDaily.value=money2((parseMoneyInput(memberSalary.value)||0)/30).toFixed(2)};const memberThemeColor=$('#memberThemeColor');if(memberThemeColor)memberThemeColor.oninput=()=>{const studio=memberThemeColor.closest('.memberThemeStudio');if(studio)studio.style.setProperty('--member-theme',memberThemeColor.value);studio?.querySelectorAll('.memberThemePreset').forEach(b=>b.classList.toggle('active',(b.dataset.color||'').toLowerCase()===memberThemeColor.value.toLowerCase()))};const memberFormEl=$('#memberForm');if(memberFormEl)memberFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),mid=d.id||modal?.id||id(),old=(state.members||[]).find(x=>x.id===mid),salary=parseMoneyInput(d.salary)||0,effectiveDate=d.salaryEffectiveDate||d.startDate||iso(),hist=Array.isArray(old?.salaryHistory)?[...old.salaryHistory]:[];if(!old||money2(+old.salary||0)!==money2(salary)){const same=hist.findIndex(x=>x.effectiveDate===effectiveDate),row={effectiveDate,salary};if(same>=0)hist[same]=row;else hist.push(row)}const mem={...(old||{}),id:mid,name:(d.name||'ÜYE').trim(),icon:d.icon||'👤',job:(d.job||'').trim(),startDate:d.startDate||iso(),salary,salaryEffectiveDate:effectiveDate,salaryHistory:hist.sort((a,b)=>String(a.effectiveDate).localeCompare(String(b.effectiveDate))),dailyWage:money2(salary/30),color:d.color||'#2497ff',leavePolicy:d.leavePolicy==='paid'?'paid':'unpaid'};state.members=Array.isArray(state.members)?state.members:[];const mi=state.members.findIndex(x=>x.id===mid),prior=mi>=0?state.members[mi]:null;if(mi>=0)state.members[mi]=mem;else state.members.push(mem);const autoAdded=await zEnsureMemberDays(mem);await save();modal=null;render();showToast(autoAdded?'HANE ÜYESİ KAYDEDİLDİ · '+autoAdded+' GÜN ÇALIŞMA TAKVİMİNE EKLENDİ':'HANE ÜYESİ KAYDEDİLDİ')};
  const zWorkDayForm=$('#zWorkDayForm');if(zWorkDayForm)zWorkDayForm.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),mem=(state.members||[]).find(x=>x.id===d.memberId);if(!mem)return alert('Hane üyesi bulunamadı.');let matches=(state.work||[]).filter(x=>x.memberId===mem.id&&x.date===d.date&&x.type==='daily'),w=matches[0];if(matches.length>1)return alert('Bu kişi ve tarihte birden fazla çalışma kaydı var. Önce HAN üzerinden mükerrer kayıtları düzeltin.');if(w&&!confirm('Bu tarihte mevcut çalışma kaydı var. Gün durumu güncellenecek; geçmiş ödeme kayıtları değiştirilmeyecek. Devam edilsin mi?'))return;if(!w){const wid='auto_'+mem.id+'_'+d.date;w={id:wid,memberId:mem.id,type:'daily',date:d.date,title:(mem.job||'ÇALIŞMA').toUpperCase(),amount:zMemberWageForDate(mem,d.date),autoCalendar:true};(state.work||(state.work=[])).push(w)}w.dayStatus=d.status||'worked';w.overtimeHours=w.dayStatus==='overtime'?(parseMoneyInput(d.overtimeHours)||0):0;w.amount=w.dayStatus==='leave'?0:zMemberWageForDate(mem,d.date);w.memberId=mem.id;delete w.paymentStatus;delete w.paidDate;await save();modal=null;render();showToast(w.dayStatus==='leave'?'GÜN İZİN OLARAK GÜNCELLENDİ':w.dayStatus==='overtime'?'GÜN MESAİ OLARAK GÜNCELLENDİ':'GÜN ÇALIŞMA OLARAK GÜNCELLENDİ')};
  document.querySelectorAll('#zWorkRoadList [data-road-row]').forEach(row=>{const src=row.querySelector('.zRoadSource'),wrap=row.querySelector('.zRoadCardWrap');if(src&&wrap){const refresh=()=>wrap.style.display=src.value==='card'?'block':'none';src.addEventListener('change',refresh);refresh()}})
  const zWorkFormEl=$('#zWorkForm');if(zWorkFormEl)zWorkFormEl.onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget),d=Object.fromEntries(fd.entries()),wid=d.id||id(),old=(state.work||[]).find(x=>x.id===wid),type=d.type||'daily',mem=(state.members||[]).find(m=>m.id===d.memberId),rawDayStatus=d.dayStatus||'worked',dayStatus=(rawDayStatus==='leavePaid'||rawDayStatus==='leaveUnpaid')?'leave':rawDayStatus,leaveType=rawDayStatus==='leavePaid'?'paid':rawDayStatus==='leaveUnpaid'?'unpaid':undefined,amount=dayStatus==='leave'?0:(type==='daily'?(+mem?.dailyWage||0):money2(parseMoneyInput(d.hours)*parseMoneyInput(d.rate)));if(dayStatus!=='leave'&&(!Number.isFinite(amount)||amount<=0))return alert(type==='daily'?'Hane üyesi profilinde aylık maaş bulunmalı.':'Ücret 0’dan büyük olmalı.');if(dayStatus!=='leave'&&type!=='daily'&&(parseMoneyInput(d.hours)<=0||parseMoneyInput(d.rate)<=0))return alert('Saat ve saatlik ücret 0’dan büyük olmalı.');const duplicate=(state.work||[]).find(q=>q.id!==wid&&q.memberId===d.memberId&&q.date===(d.date||iso())&&q.type===type);if(duplicate)return alert('Bu kişi için aynı tarihte aynı türde kayıt zaten var. Mevcut kaydı düzenleyin.');const roads=[...e.currentTarget.querySelectorAll('[data-road-row]')].map(row=>{const a=parseMoneyInput(row.querySelector('[name="roadAmount"]')?.value)||0,source=row.querySelector('[name="roadSource"]')?.value==='card'?'card':'cash',cardId=row.querySelector('[name="roadCardId"]')?.value||null;return {amount:Math.max(0,a),source,cardId}}).filter(r=>r.amount>0);if(roads.some(r=>r.source==='card'&&!r.cardId))return alert('Kartla ödenen her yol gideri için kart seçin.');const roadAmount=money2(roads.reduce((n,r)=>n+r.amount,0)),x={...(old||{}),id:wid,memberId:d.memberId||old?.memberId||'',type,date:d.date||iso(),title:upper(((d.title&&d.title!=='ANA İŞ'?d.title:(mem?.job||d.title))||'ÇALIŞMA').trim()),amount:type==='daily'?amount:undefined,hours:type==='daily'?undefined:parseMoneyInput(d.hours),rate:type==='daily'?undefined:parseMoneyInput(d.rate),dayStatus,leaveType:type==='daily'&&dayStatus==='leave'?leaveType:undefined,roadAmount,roadSource:roads.length===1?roads[0].source:'multiple',roadCardId:roads.length===1&&roads[0].source==='card'?roads[0].cardId:null};state.work=Array.isArray(state.work)?state.work:[];const wi=state.work.findIndex(z=>z.id===wid);if(wi>=0)state.work[wi]=x;else state.work.push(x);delete x.paymentStatus;delete x.paidDate;state.workRoads=Array.isArray(state.workRoads)?state.workRoads:[];state.workRoads=state.workRoads.filter(z=>z.workId!==wid);roads.forEach((r,i)=>state.workRoads.push({id:'workroad_'+wid+'_'+(i+1),workId:wid,title:'YOL ÜCRETİ'+(roads.length>1?' '+(i+1):''),amount:r.amount,actualAmount:r.amount,category:'Ulaşım',date:x.date,source:r.source,memberId:x.memberId||'',cardId:r.source==='card'?r.cardId:null}));await save();modal=null;render();showToast('ÇALIŞMA KAYDEDİLDİ')};
  const zWorkPaymentEditFormEl=$('#zWorkPaymentEditForm');if(zWorkPaymentEditFormEl)zWorkPaymentEditFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),x=(state.workPayments||[]).find(q=>q.id===d.id);if(!x)return alert('Ödeme kaydı bulunamadı.');const amount=money2(parseMoneyInput(d.amount));if(!Number.isFinite(amount)||amount<=0)return alert('Ödeme tutarı 0’dan büyük olmalı.');x.amount=amount;x.date=d.date||x.date;x.workMonth=String(x.date||'').slice(0,7)||x.workMonth;await save();modal=null;render();showToast('ÖDEME GÜNCELLENDİ')};
  const zWorkMonthPayFormEl=$('#zWorkMonthPayForm');if(zWorkMonthPayFormEl)zWorkMonthPayFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),mid=modal?.memberId,m=modal?.workMonth||state.selectedMonth,mem=(state.members||[]).find(x=>x.id===mid);if(!mem)return alert('Hane üyesi bulunamadı.');const amount=money2(parseMoneyInput(d.amount)),remaining=zMemberMonthRemaining(mem,m);if(!Number.isFinite(amount)||amount<=0)return alert('Ödeme tutarı 0’dan büyük olmalı.');if(amount>remaining+.009)return alert('Ödeme kalan hakedişten büyük olamaz. Kalan: '+money(remaining));state.workPayments=Array.isArray(state.workPayments)?state.workPayments:[];state.workPayments.push({id:'workpay_month_'+id(),memberId:mem.id,workMonth:m,title:mem.name+' · ÇALIŞMA ÖDEMESİ',amount,date:d.date||iso(),source:'work'});await save();modal=null;render();showToast(amount>=remaining-.009?'AYLIK HAKEDİŞ TAMAMLANDI':'KISMİ ÖDEME KAYDEDİLDİ · KALAN '+money(remaining-amount))};
  const zReceivablePayForm=$('#zReceivablePayForm');if(zReceivablePayForm)zReceivablePayForm.onsubmit=e=>{e.preventDefault();alert('Eski günlük alacak sistemi devre dışı. Çalışma sayfasından ÖDEME EKLE kullanın.')};
  const cashGivenForm=$('#cashGivenForm');if(cashGivenForm)cashGivenForm.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),amount=parseMoneyInput(d.amount),date=d.date||iso(),description=String(d.description||'').trim();if(!description||!date||!Number.isFinite(amount)||amount<=0)return alert('Açıklama, tarih ve tutar zorunlu.');const target=date.slice(0,7);if(target!==state.selectedMonth&&!confirm(`Seçtiğiniz tarih ${monthLabel(target)} dönemine ait. Kayıt o aya eklenecek. Devam edilsin mi?`))return;state.cashGiven=Array.isArray(state.cashGiven)?state.cashGiven:[];state.cashGiven.push({id:id(),description:upper(description),date,amount:money2(amount)});state.selectedMonth=target;await save();modal=null;render();showToast('VERİLEN PARA EKLENDİ')};
  const cashManualForm=$('#cashManualForm');if(cashManualForm)cashManualForm.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),amount=parseMoneyInput(d.amount),date=d.date||iso(),description=String(d.description||'').trim();if(!description||!date||!Number.isFinite(amount)||amount<=0)return alert('Açıklama, tarih ve tutar zorunlu.');const target=date.slice(0,7);if(target!==state.selectedMonth&&!confirm(`Seçtiğiniz tarih ${monthLabel(target)} dönemine ait. Kayıt o aya eklenecek. Devam edilsin mi?`))return;state.cashManual=Array.isArray(state.cashManual)?state.cashManual:[];state.cashManual.push({id:id(),description:upper(description),date,amount:money2(amount)});state.selectedMonth=target;await save();modal=null;render();showToast('NAKİT PARA KAYDI EKLENDİ')};
  const cardPaymentEditFormEl=$('#cardPaymentEditForm');if(cardPaymentEditFormEl)cardPaymentEditFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),x=state.cardPayments.find(x=>x.id===modal?.id);if(!x)return;x.amount=+d.amount||0;x.date=d.date;await save();modal=null;render()};
  const cardFormEl=$('#cardForm');
  if(cardFormEl) cardFormEl.onsubmit=async e=>{
    e.preventDefault();
    try{await saveCard(Object.fromEntries(new FormData(e.currentTarget).entries()),modal?.id);showToast(modal?.id?'KART GÜNCELLENDİ':'KART EKLENDİ')}
    catch(err){console.error(err);alert('Kart kaydedilemedi: '+(err?.message||err))}
  };
  const cardSpendFormEl=$('#cardSpendForm');
  if(cardSpendFormEl) cardSpendFormEl.onsubmit=async e=>{
    e.preventDefault();const form=e.currentTarget;
    try{await saveCardSpend(Object.fromEntries(new FormData(form).entries()),modal?.cardId);showToast('KAYDEDİLDİ')}
    catch(err){console.error(err);alert('Harcama kaydedilemedi: '+(err?.message||err))}
  };
  const cardPayFormEl=$('#cardPayForm');
  if(cardPayFormEl) cardPayFormEl.onsubmit=async e=>{
    e.preventDefault();const form=e.currentTarget;
    try{await saveCardPayment(Object.fromEntries(new FormData(form).entries()),modal?.cardId);showToast('Kart ödemesi kaydedildi')}
    catch(err){console.error(err);alert('Ödeme kaydedilemedi: '+(err?.message||err))}
  };
}

function haneRecordDetailSpec(action,rid){
  const find=(arr,id)=>Array.isArray(arr)?arr.find(x=>String(x.id)===String(id)):null;
  let x=null,type='',edit=action,del='',editId=rid;
  if(action==='editIncome'){x=find(state.incomes,rid);type='GELİR';del='delIncome'}
  else if(action==='editExpense'){x=find(state.expenses,rid);type='GİDER';del='delExpense'}
  else if(action==='editFixedPayment'){
    const ex=find(state.expenses,rid),pay=null;
    if(ex&&pay){x={...pay,title:ex.title,category:pay.category||ex.category,amount:pay.amount||ex.amount,source:pay.source||'cash',cardId:pay.cardId,expenseId:ex.id};type='GİDER';del='toggleFixedPaid';editId=ex.id}
  }
  else if(action==='editCardPayment'){x=find(state.cardPayments,rid);type='KART ÖDEMESİ';del='delCardPayment'}
  else if(action==='editFlexPayment'){x=find(state.flexTransactions,rid);type='ESNEK HESAP ÖDEMESİ';del='delFlexPayment'}
  else if(action==='editCard'){x=find(state.cards,rid);type='KREDİ KARTI';del='delCard'}
  else if(action==='editFlex'){x=find(state.flexAccounts,rid);type='ESNEK HESAP';del='delFlex'}
  else if(action==='editAccount'){x=find(state.accounts,rid);type='HESAP';del='delAccount'}
  else if(action==='editMember'){x=find(state.members,rid);type='HANE ÜYESİ';del='delMember'}
  else if(action==='zWorkEdit'){x=find(state.work,rid);type='ÇALIŞMA';del='zWorkDelete'}
  else if(action==='zWorkPaymentEdit'){x=find(state.workPayments,rid);type='ÇALIŞMA ÖDEMESİ';del='zWorkPaymentDelete'}
  else if(action==='zWorkRoadDayEdit'){x=find(state.workRoads,rid);type='YOL GİDERİ';del='zWorkRoadDayDelete'}
  if(!x)return null;
  const card=x.cardId?find(state.cards,x.cardId):null;
  const fields=[];
  const add=(k,v)=>{if(v!==undefined&&v!==null&&String(v)!=='')fields.push([k,String(v)])};
  add('TARİH',x.date||x.dueDate); add('KATEGORİ',x.category); 
  if(x.source)add('ÖDEME',x.source==='card'?'KART':'NAKİT');
  if(card)add('KULLANILAN KART',(card.bank||'')+(card.name?' · '+card.name:'')+(card.last4?' · •••• '+card.last4:''));
  add('AÇIKLAMA / NOT',x.note||x.description||x.title); add('KAYIT TÜRÜ',type);
  if(type==='KREDİ KARTI'){add('BANKA',x.bank);add('KART',x.name);add('SON 4 HANE',x.last4);add('BORÇ',money(x.balance||0))}
  if(type==='ESNEK HESAP'||type==='HESAP'){add('BANKA',x.bank||x.name);add('BAKİYE',money(x.balance||0))}
  const title=esc(x.title||x.name||x.bank||type), refund=isCardRefund(x),amt=(x.amount!==undefined?money(Math.abs(+x.amount||0)):'');
  const body=`<div class="haneRecordDetail"><div class="haneRecordHero"><div><small>${esc(refund?'İADE':type)}</small><h2>${title}</h2></div>${amt?`<strong>${type==='GELİR'||refund?'+':'-'}${amt}</strong>`:''}</div><div class="haneRecordGrid">${fields.map(([k,v])=>`<div class="haneRecordField"><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div><div class="haneRecordActions"><button class="btn gold" data-action="${edit}" data-id="${editId}" data-direct-edit="1">✎ DÜZENLE</button>${del?`<button class="btn danger" data-action="${del}" data-id="${editId}">× SİL</button>`:''}</div></div>`;
  return {title:'KAYIT AYRINTISI',body};
}

function captureModalFormDraft(){
  if(!modal)return;
  const f=document.querySelector('.modal form');
  if(!f)return;
  const draft={};
  f.querySelectorAll('input[name],select[name],textarea[name]').forEach(el=>{
    if((el.type==='checkbox'||el.type==='radio')&&!el.checked)return;
    draft[el.name]=el.value;
  });
  modal.formDraft=draft;
}
function syncExpenseFormUI(){
  const f=document.getElementById('expenseForm');if(!f)return;
  const src=f.elements.source?.value==='card'?'card':'cash',cw=$('#expenseCardWrap');if(cw)cw.style.display=src==='card'?'block':'none';
  $$('[data-pay-source]').forEach(b=>b.classList.toggle('active',b.dataset.paySource===src));
  const cat=f.elements.normalCategory?.value;if(cat){const grid=document.querySelector('.premiumCatGrid[data-select-name="normalCategory"]');grid?.querySelectorAll('.premiumCatBtn').forEach(b=>b.classList.toggle('active',b.dataset.cat===cat));const cc=$('#customCategoryWrap');if(cc)cc.style.display=cat==='Diğer'?'block':'none'}
  const st=$('#expenseReceiptStatus');if(st)st.style.display=(modal?.attachment||modal?.id&&state.expenses.find(x=>x.id===modal.id)?.attachment)?'block':'none';
}
function restoreModalFormDraft(){
  if(!modal?.formDraft)return;
  const f=document.querySelector('.modal form');if(!f)return;
  Object.entries(modal.formDraft).forEach(([name,val])=>{const els=f.querySelectorAll(`[name="${CSS.escape(name)}"]`);els.forEach(el=>{if(el.type==='checkbox'||el.type==='radio')el.checked=el.value===val;else el.value=val})});
  syncExpenseFormUI();
}
function rememberModalForm(){if(modal)captureModalFormDraft()}
function open(t,b,d={}){modal={title:t,body:b,...d};render()}

function stmtCleanTitle(v){return String(v||'').replace(/\s+/g,' ').replace(/[|]/g,' ').trim().slice(0,100)}
function stmtMoney(v){
  let x=String(v||'').trim().replace(/TL|TRY|₺|USD|EUR|GBP/gi,'').replace(/\s/g,'');
  // TR banka yazımı: 300,- / 1.423,- sıfır kuruş demektir; eksi işlem değildir.
  x=x.replace(/([.,])-$/,'$100');
  let neg=false;if(/^\(.*\)$/.test(x)){neg=true;x=x.slice(1,-1)}if(/-$/.test(x)){neg=true;x=x.slice(0,-1)}if(/^-/.test(x)){neg=true;x=x.slice(1)}x=x.replace(/^\+/,'').replace(/\+$/,'');
  x=x.replace(/[^0-9,.]/g,'');if(!x)return NaN;
  const lc=x.lastIndexOf(','),ld=x.lastIndexOf('.');
  if(lc>=0&&ld>=0){
    if(lc>ld)x=x.replace(/\./g,'').replace(',','.');
    else x=x.replace(/,/g,'');
  }else if(lc>=0){
    const parts=x.split(',');
    if(parts.length>2){const last=parts.pop();x=last.length===2?parts.join('')+'.'+last:parts.join('')+last}
    else if(parts[1]?.length===2)x=parts[0]+'.'+parts[1];
    else if(parts[1]?.length===3)x=parts.join('');
    else x=parts.join('.');
  }else if(ld>=0){
    const parts=x.split('.');
    if(parts.length>2){const last=parts.pop();x=last.length===2?parts.join('')+'.'+last:parts.join('')+last}
    else if(parts[1]?.length===2)x=parts[0]+'.'+parts[1];
    else if(parts[1]?.length===3)x=parts.join('');
  }
  const n=Number(x);return Number.isFinite(n)?(neg?-Math.abs(n):n):NaN
}
const STMT_MONTHS={OCAK:1,OCA:1,ŞUBAT:2,ŞUB:2,MART:3,MAR:3,NİSAN:4,NİS:4,MAYIS:5,MAY:5,HAZİRAN:6,HAZ:6,TEMMUZ:7,TEM:7,AĞUSTOS:8,AĞU:8,EYLÜL:9,EYL:9,EKİM:10,EKİ:10,KASIM:11,KAS:11,ARALIK:12,ARA:12};
const STMT_DATE_NUM_RE=/(?:\b\d{4}[.\/-]\d{1,2}[.\/-]\d{1,2}\b|\b\d{1,2}[.\/-]\d{1,2}(?:[.\/-](?:20\d{2}|\d{2}))?\b)/gi;
const STMT_DATE_TXT_RE=/\b\d{1,2}\s+(?:OCAK|OCA|ŞUBAT|ŞUB|MART|MAR|NİSAN|NİS|MAYIS|MAY|HAZİRAN|HAZ|TEMMUZ|TEM|AĞUSTOS|AĞU|EYLÜL|EYL|EKİM|EKİ|KASIM|KAS|ARALIK|ARA)(?:\s+(?:20\d{2}|\d{2}))?\b/gi;
function stmtValidDate(y,m,d){const x=new Date(y,m-1,d,12,0,0);return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d}
function stmtValidIsoDate(v){const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return !!m&&stmtValidDate(+m[1],+m[2],+m[3])}
function stmtAnchorInfo(text){
  const found=[],raw=String(text||''),up=raw.toLocaleUpperCase('tr-TR');
  for(const m of raw.matchAll(/\b(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})\b/g)){const y=+m[1],mo=+m[2],d=+m[3];if(stmtValidDate(y,mo,d))found.push({y,mo,d})}
  for(const m of raw.matchAll(/\b(\d{1,2})[.\/-](\d{1,2})[.\/-](20\d{2}|\d{2})\b/g)){let y=+m[3];if(y<100)y+=2000;const mo=+m[2],d=+m[1];if(stmtValidDate(y,mo,d))found.push({y,mo,d})}
  for(const m of up.matchAll(/\b(\d{1,2})\s+(OCAK|OCA|ŞUBAT|ŞUB|MART|MAR|NİSAN|NİS|MAYIS|MAY|HAZİRAN|HAZ|TEMMUZ|TEM|AĞUSTOS|AĞU|EYLÜL|EYL|EKİM|EKİ|KASIM|KAS|ARALIK|ARA)\s+(20\d{2}|\d{2})\b/g)){let y=+m[3];if(y<100)y+=2000;const mo=STMT_MONTHS[m[2]],d=+m[1];if(stmtValidDate(y,mo,d))found.push({y,mo,d})}
  if(found.length){found.sort((a,b)=>new Date(b.y,b.mo-1,b.d)-new Date(a.y,a.mo-1,a.d));return found[0]}
  const fallback=cardStatementMonth||state?.selectedMonth||ym(new Date()),[y,mo]=fallback.split('-').map(Number);return{y:y||new Date().getFullYear(),mo:mo||new Date().getMonth()+1,d:1}
}
function stmtDateInfo(v,anchor){
  const raw=String(v||''),up=raw.toLocaleUpperCase('tr-TR'),a=anchor&&typeof anchor==='object'?anchor:{y:Number(anchor)||new Date().getFullYear(),mo:new Date().getMonth()+1};
  let m=raw.match(/\b(20\d{2})[.\/-](\d{1,2})[.\/-](\d{1,2})\b/);
  if(m){const y=+m[1],mo=+m[2],d=+m[3];if(stmtValidDate(y,mo,d))return{date:`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`,raw:m[0],month:mo,yearExplicit:true}}
  m=raw.match(/\b(\d{1,2})[.\/-](\d{1,2})(?:[.\/-](\d{2,4}))?\b/);
  if(m){let explicit=!!m[3],y=explicit?+m[3]:a.y;if(y<100)y+=2000;const d=+m[1],mo=+m[2];if(!explicit){if(a.mo<=2&&mo>=11)y--;else if(a.mo>=11&&mo<=2)y++}if(stmtValidDate(y,mo,d))return{date:`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`,raw:m[0],month:mo,yearExplicit:explicit}}
  m=up.match(/\b(\d{1,2})\s+(OCAK|OCA|ŞUBAT|ŞUB|MART|MAR|NİSAN|NİS|MAYIS|MAY|HAZİRAN|HAZ|TEMMUZ|TEM|AĞUSTOS|AĞU|EYLÜL|EYL|EKİM|EKİ|KASIM|KAS|ARALIK|ARA)(?:\s+(\d{2,4}))?\b/);
  if(m){let explicit=!!m[3],y=explicit?+m[3]:a.y;if(y<100)y+=2000;const d=+m[1],mo=STMT_MONTHS[m[2]];if(!explicit){if(a.mo<=2&&mo>=11)y--;else if(a.mo>=11&&mo<=2)y++}if(stmtValidDate(y,mo,d))return{date:`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`,raw:m[0],month:mo,yearExplicit:explicit}}
  return null
}
function stmtDateTokens(v,anchor){
  const src=String(v||''),hits=[];
  const add=(re)=>{for(const m of src.matchAll(re)){const pre=src.slice(Math.max(0,m.index-18),m.index).toLocaleUpperCase('tr-TR'),post=src.slice(m.index+m[0].length,m.index+m[0].length+22).toLocaleUpperCase('tr-TR');if(/İŞLEMİN|ISLEMIN/.test(pre)||/TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT/.test(post))continue;const di=stmtDateInfo(m[0],anchor);if(di)hits.push({index:m.index,raw:m[0],date:di.date})}};
  add(/\b20\d{2}[.\/-]\d{1,2}[.\/-]\d{1,2}\b/g);
  add(/\b\d{1,2}[.\/-]\d{1,2}(?:[.\/-](?:20\d{2}|\d{2}))?\b/g);
  add(/\b\d{1,2}\s+(?:OCAK|OCA|ŞUBAT|ŞUB|MART|MAR|NİSAN|NİS|MAYIS|MAY|HAZİRAN|HAZ|TEMMUZ|TEM|AĞUSTOS|AĞU|EYLÜL|EYL|EKİM|EKİ|KASIM|KAS|ARALIK|ARA)(?:\s+(?:20\d{2}|\d{2}))?\b/gi);
  hits.sort((a,b)=>a.index-b.index);const out=[];for(const h of hits){if(!out.some(x=>x.index===h.index&&x.raw===h.raw))out.push(h)}return out
}
function stmtDatePreference(text){
  const u=String(text||'').toLocaleUpperCase('tr-TR'),tx=u.search(/İŞLEM\s*TARİH|ISLEM\s*TARIH|HARCAMA\s*TARİH|HARCAMA\s*TARIH/),post=u.search(/PROVİZYON\s*TARİH|PROVIZYON\s*TARIH|VALÖR\s*TARİH|VALOR\s*TARIH|MUHASEBE\s*TARİH|MUHASEBE\s*TARIH/);
  if(tx>=0&&post>=0)return tx<=post?'first':'last';return'first'
}
function stmtPickTransactionDate(blockText,anchor,pref='first'){
  const src=String(blockText||''),direct=src.match(/(?:İŞLEM|ISLEM|HARCAMA)\s*TARİH[İI]?\s*[:\-]?\s*((?:20\d{2}[.\/-]\d{1,2}[.\/-]\d{1,2})|(?:\d{1,2}[.\/-]\d{1,2}(?:[.\/-](?:20\d{2}|\d{2}))?))/i);
  if(direct){const d=stmtDateInfo(direct[1],anchor);if(d)return d}
  const dates=stmtDateTokens(src,anchor);if(!dates.length)return null;return stmtDateInfo((pref==='last'?dates.at(-1):dates[0]).raw,anchor)
}
function stmtStripDates(v){return String(v||'').replace(STMT_DATE_NUM_RE,' ').replace(STMT_DATE_TXT_RE,' ').replace(/\s+/g,' ').trim()}
function stmtAmountCandidates(v){
  const s=String(v||''),out=[];
  // Ortak para tokenizer'ı: TR 1.234,56 / TL.300,- ve EN 1,234.56 biçimlerini tek token olarak yakalar.
  const re=/([+-]?\s*(?:(?:TL|TRY|₺|USD|EUR|GBP)\.?\s*)?[+-]?\s*(?:(?:\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2}|,-)?|\d+(?:[.,]\d{2}|,-)?)\s*[+-]?\s*(?:TL|TRY|₺|USD|EUR|GBP)?)/gi;
  for(const m of s.matchAll(re)){
    const raw=String(m[0]||''),currencyHit=raw.match(/(?:TL|TRY|₺|USD|EUR|GBP)/i),currency=(currencyHit?.[0]||'').toUpperCase(),value=stmtMoney(raw);
    if(!Number.isFinite(value)||value===0)continue;
    const digits=raw.replace(/\D/g,'');if(digits.length>12&&!currency)continue;
    const compact=raw.replace(/\s+/g,''),hasCents=/[.,]\d{2}(?:[+-])?(?:TL|TRY|₺|USD|EUR|GBP)?$/i.test(compact),zeroCents=/,-(?:TL|TRY|₺|USD|EUR|GBP)?$/i.test(compact),hasGrouping=/\d[.,]\d{3}(?:[.,]\d{2}|,-)?/.test(compact);
    if(!currency&&!hasCents&&!zeroCents&&!hasGrouping)continue;
    if(Math.abs(value)>999999999)continue;
    let score=(['TL','TRY','₺'].includes(currency)?20:currency?9:0)+(hasCents||zeroCents?7:0)+(hasGrouping?2:0)+(m.index>s.length*.65?2:0);
    out.push({raw,value,index:m.index,currency,score})
  }
  return out
}
function stmtPickAmountForProfile(profile,source,amounts){
  const a=[...(amounts||[])].sort((x,y)=>x.index-y.index);if(!a.length)return null;
  const pid=profile?.id||'generic',u=String(source||'').toLocaleUpperCase('tr-TR');
  if(pid==='denizbank'){
    // DenizBank'ta Bonus(TL) işlem tutarından önce gelir; gerçek tutar en sağdaki TL değeridir.
    const tl=a.filter(x=>['TL','TRY','₺'].includes(x.currency));return (tl.length?tl:a).at(-1)
  }
  if(pid==='teb')return a.at(-1);
  if(pid==='isbank'){
    // İş Bankası'nda tutar ilk parasal kolondur; devamındaki değer taksit toplamı/MaxiPuan olabilir.
    if(/MAX[Iİ]PUAN\s*[Iİ]LAVE/.test(u)&&a.length<=2)return null;
    return a[0]
  }
  const explicit=a.filter(x=>['TL','TRY','₺'].includes(x.currency));return (explicit.length?explicit:a)[0]
}

function stmtMerchantKey(t){return String(t||'').toLocaleUpperCase('tr-TR').replace(/\b(?:POS|PROVİZYON|PROVIZYON|İŞLEM|ISLEM|ŞUBE|SUBE|NO|REF)\b/g,' ').replace(/\d{2,}/g,' ').replace(/[^A-ZÇĞİÖŞÜ\s]/g,' ').replace(/\s+/g,' ').trim().slice(0,72)}
function stmtCategoryBase(t){
  t=String(t||'').toLocaleUpperCase('tr-TR');
  if(/GETİR\s*YEMEK|GETIR\s*YEMEK|YEMEKSEPET[İI]|TRENDYOL\s*YEMEK|RESTAUR|RESTORAN|BURGER|MCDONALD|KFC|DOMINOS|PIZZA|PİZZA/.test(t))return'Yemek';
  if(/MİGROS|MIGROS|BİM|BIM|A101|ŞOK|SOK|CARREFOUR|METRO\s*MARKET|MACROCENTER|F[İI]LE\s*MARKET|GROSS|ONUR\s*(?:MARKET|MRKT)|HAPPY\s*CENTER|HAKMAR|MOPAŞ|MOPAS|BİZİM\s*TOPTAN|BIZIM\s*TOPTAN|TARIM\s*KRED[İI]|SEÇ\s*MARKET|SEC\s*MARKET|KİM\s*MARKET|KIM\s*MARKET|ÇAĞRI\s*MARKET|CAGRI\s*MARKET|ÖZDİLEK\s*(?:MARKET)?|OZDILEK\s*(?:MARKET)?|\bMARKET\b|SÜPERMARKET|SUPERMARKET|HİPERMARKET|HIPERMARKET|GIDA\s*MARKET/.test(t))return'Market';
  if(/GETİR|GETIR/.test(t))return'Market';
  if(/KUYUMCU|KUYUMCULUK|MÜCEVHER|MUCEVHER|PIRLANTA|PIRLANTA|ALTINBAŞ|ALTINBAS|ATASAY|ZEN\s*PIRLANTA|ARİŞ|ARIS\s*PIRLANTA|SİNA\s*KUYUM|SINA\s*KUYUM/.test(t))return'Kuyumculuk';
  if(/İSTANBULKART|ISTANBULKART|BELBİM|BELBIM|İETT|IETT|MARMARAY|METRO\s*İSTANBUL|METRO\s*ISTANBUL|BURULAŞ|BURULAS|BURSARAY|BUDO|ANKARAKART|\bEGO\b|İZMİRİM|IZMIRIM|ESHOT|KENTKART|TCDD\s*TAŞIMACILIK|TCDD\s*TASIMACILIK|TRAMVAY|OTOBÜS|OTOBUS|DOLMUŞ|DOLMUS|VAPUR|FERRY/.test(t))return'Ulaşım';
  if(/MANAV|SEBZE|MEYVE/.test(t))return'Manav';
  if(/FIRIN|PASTANE|EKMEK/.test(t))return'Fırın';
  if(/CAFE|KAFE|STARBUCKS|KAHVE\s*DÜNYASI|KAHVE\s*DUNYASI|ESPRESSOLAB/.test(t))return'Kafe';
  if(/TRENDYOL|HEPSİBURADA|HEPSIBURADA|AMAZON|N11|PAZARAMA|TEMU|ALIEXPRESS/.test(t))return'Online Alışveriş';
  if(/TEKNOSA|MEDIAMARKT|MEDIA\s*MARKT|VATAN\s*BİLGİSAYAR|VATAN\s*BILGISAYAR|APPLE\s*STORE|SAMSUNG/.test(t))return'Elektronik';
  if(/IKEA|İKEA|KOÇTAŞ|KOCTAS|BAUHAUS|ENGLISH\s*HOME|MADAME\s*COCO|MOBİLYA|MOBILYA/.test(t))return'Mobilya';
  if(/NALBUR|TADİLAT|TADILAT|YAPI\s*MARKET|BOYA\s*BADANA/.test(t))return'Ev Bakım';
  if(/LCW|LC\s*WAIKIKI|DEFACTO|KOTON|ZARA|H&M|MAVİ|MAVI|BOYNER|\bFLO\b|GİYİM|GIYIM/.test(t))return'Giyim';
  if(/GRATİS|GRATIS|WATSONS|ROSSMANN|SEPHORA|KOZMETİK|KOZMETIK/.test(t))return'Kozmetik';
  if(/BERBER|KUAFÖR|KUAFOR|GÜZELLİK|GUZELLIK|KİŞİSEL\s*BAKIM|KISISEL\s*BAKIM/.test(t))return'Kişisel Bakım';
  if(/D&R|KİTAPYURDU|KITAPYURDU|BKM\s*KİTAP|BKM\s*KITAP|KİTAP|KITAP/.test(t))return'Kitap';
  if(/KIRTASİYE|KIRTASIYE|OFİS\s*MALZEME|OFIS\s*MALZEME/.test(t))return'Kırtasiye';
  if(/DECATHLON|MACFİT|MACFIT|FITNESS|SPOR\s*SALONU/.test(t))return'Spor';
  if(/STEAM|PLAYSTATION|PSN|XBOX|EPIC\s*GAMES|NINTENDO/.test(t))return'Oyun';
  if(/NETFLIX|SPOTIFY|DISNEY|EXXEN|BLUTV|GAIN|YOUTUBE\s*PREMIUM|APPLE\.COM\/BILL|GOOGLE\s*ONE/.test(t))return'Abonelik';
  if(/BENZİN|BENZIN|PETROL|OPET|SHELL|\bBP\b|TOTAL|AYTEMİZ|AYTEMIZ/.test(t))return'Akaryakıt';
  if(/İSPARK|ISPARK|OTOPARK|PARK\s*ÜCRET|PARK\s*UCRET/.test(t))return'Otopark';
  if(/HGS|OGS|OTOYOL|KÖPRÜ|KOPRU|AVRASYA|KGM/.test(t))return'Otoyol/Köprü';
  if(/OTO\s*SERVİS|OTO\s*SERVIS|LASTİK|LASTIK|ARAÇ\s*BAKIM|ARAC\s*BAKIM|OTO\s*YIKAMA/.test(t))return'Araç Bakım';
  if(/YOL\s*ÜCRET|YOL\s*UCRET|ULAŞIM|ULASIM|TAKSİ|TAKSI|TOPLU\s*TAŞIMA|TOPLU\s*TASIMA|BİLET|BILET/.test(t))return'Ulaşım';
  if(/YURTİÇİ\s*KARGO|YURTICI\s*KARGO|ARAS\s*KARGO|MNG\s*KARGO|SÜRAT\s*KARGO|SURAT\s*KARGO|PTT\s*KARGO|KARGO/.test(t))return'Kargo';
  if(/ECZANE|HASTANE|MEDİKAL|MEDIKAL|SAĞLIK|SAGLIK|DOKTOR|DİŞ|DİS|DIS\s*KLİNİK|DIS\s*KLINIK/.test(t))return'Sağlık';
  if(/OKUL|KURS|ÜNİVERSİTE|UNIVERSITE|EĞİTİM|EGITIM|DERSHANE/.test(t))return'Eğitim';
  if(/E-BEBEK|EBEBEK|TOYZZ|OYUNCAK|ÇOCUK|COCUK/.test(t))return'Çocuk';
  if(/PETSHOP|PET\s*SHOP|VETERİNER|VETERINER|EVCİL\s*HAYVAN|EVCIL\s*HAYVAN/.test(t))return'Evcil Hayvan';
  if(/TEMİZLİK|TEMIZLIK|DETERJAN/.test(t))return'Temizlik';
  if(/BOOKING|AIRBNB|OTEL|HOTEL|PANSİYON|PANSIYON/.test(t))return'Konaklama';
  if(/TÜRK\s*HAVA\s*YOLLARI|TURKISH\s*AIRLINES|PEGASUS|AJET|ANADOLUJET|UÇAK|UCAK/.test(t))return'Uçak';
  if(/TATİL|TATIL|TUR\s*ŞİRKET|TUR\s*SIRKET/.test(t))return'Tatil';
  if(/HEDİYE|HEDIYE|ÇİÇEKSEPETİ|CICEKSEPETI/.test(t))return'Hediye';
  if(/BAĞIŞ|BAGIS|KIZILAY|LÖSEV|LOSEV/.test(t))return'Bağış';
  if(/SİGORTA|SIGORTA|ALLIANZ|AKSİGORTA|AKSIGORTA|ANADOLU\s*SİGORTA|ANADOLU\s*SIGORTA/.test(t))return'Sigorta';
  if(/\bKKDF\b|\bBSMV\b|\bBSMW\b|BANKA\s+VE\s+SİGORTA\s+MUAMELE|BANKA\s+VE\s+SIGORTA\s+MUAMELE|KREDİ\s+KARTI\s+FAİZ|KREDI\s+KARTI\s+FAIZ|KREDİ\s+FAİZ|KREDI\s+FAIZ|ALIŞVERİŞ\s+FAİZ|ALISVERIS\s+FAIZ|NAKİT\s+AVANS\s+FAİZ|NAKIT\s+AVANS\s+FAIZ|GECİKME\s+FAİZ|GECIKME\s+FAIZ|AKDİ\s+FAİZ|AKDI\s+FAIZ|TEMERRÜT\s+FAİZ|TEMERRUT\s+FAIZ|FAİZ\s+TUTARI|FAIZ\s+TUTARI|TAKSİT(?:LENDİRME)?\s+FAİZ|TAKSIT(?:LENDIRME)?\s+FAIZ|PEŞİNE\s+TAKSİT\s+FAİZ|PESINE\s+TAKSIT\s+FAIZ/.test(t))return'Vergi & Faiz';
  if(/VERGİ|VERGI|GİB|GELİR\s*İDARESİ|GELIR\s*IDARESI/.test(t))return'Vergi';
  if(/KOMİSYON|KOMISYON|KART\s*AİDAT|KART\s*AIDAT|BANKA\s*MASRAF|İŞLEM\s*ÜCRET|ISLEM\s*UCRET/.test(t))return'Banka Masrafı';
  if(/FAİZ|FAIZ|GECİKME\s*FAİZ|GECIKME\s*FAIZ/.test(t))return'Faiz';
  if(/ELEKTRİK|ELEKTRIK/.test(t))return'Elektrik';
  if(/DOĞALGAZ|DOGALGAZ/.test(t))return'Doğalgaz';
  if(/SU\s*FATURA|SU\s*FATURASI/.test(t))return'Su';
  if(/TURKCELL|VODAFONE|TÜRK\s*TELEKOM|TURK\s*TELEKOM/.test(t))return'Cep Telefonu';
  if(/İNTERNET|INTERNET|SUPERONLINE|TÜRKSAT|TURKSAT/.test(t))return'İnternet';
  if(/FATURA/.test(t))return'Faturalar';
  return'Diğer'
}
function stmtCategory(t){const key=stmtMerchantKey(t),learned=state?.statementCategoryRules?.[key];return learned&&C.includes(learned)?learned:stmtCategoryBase(t)}
function stmtFingerprint(cardId,date,title,amount){return [cardId,date,stmtCleanTitle(title).toLocaleUpperCase('tr-TR'),Number(amount).toFixed(2)].join('|')}
function stmtExistingCount(cardId,date,title,amount){const base=stmtFingerprint(cardId,date,title,amount);return (state.expenses||[]).filter(x=>x.importedFromStatement&&x.cardId===cardId&&((x.importBaseFingerprint||String(x.importFingerprint||'').replace(/\|#\d+$/,''))===base||stmtFingerprint(cardId,x.date,x.title,+(x.actualAmount??x.amount)||0)===base)).length}
function stmtTransactionTailOnly(v){
  const s=String(v||'');
  const stops=[
    /\bFA[İI]Z\s+VE\s+[ÜU]CRETLER\b/i,
    /\bAYLIK\s+FA[İI]Z\s+ORANLARI\b/i,
    /\bYILLIK\s+FA[İI]Z\s+ORANLARI\b/i,
    /\bDEVREDEN\s+BAK[İI]YE\b/i,
    /\bHARCAMALAR(?:INIZ)?\b/i,
    /\bFA[İI]Z\s*[ÜU]CRETLER\s*VE\s*KES[İI]NT[İI]LER\b/i,
    /\b[ÖO]DEMELER[İI]N[İI]Z\b/i,
    /\bD[ÖO]NEM\s+BORCU\b/i,
    /\bDOĞUM\s+G[ÜU]N[ÜU]N[ÜU]Z[ÜU]\b/i
  ];
  let end=s.length;
  for(const rx of stops){const m=s.match(rx);if(m&&m.index!=null)end=Math.min(end,m.index)}
  return s.slice(0,end).trim()
}
function stmtLogicalBlocks(text,anchor){
  const src=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').replace(/[\u200B-\u200D\uFEFF]/g,' ');
  const hits=[];
  const headerBefore=/(?:HESAP\s*KES[İI]M(?:\s*TAR[İI]H[İI]?)?|SON\s*ÖDEME(?:\s*TAR[İI]H[İI]?)?|EKSTRE\s*TAR[İI]H[İI]?|DÖNEM\s*TAR[İI]H[İI]?|ASGAR[İI].{0,12})\s*[:\-]?\s*$/i;
  const addHits=re=>{for(const m of src.matchAll(re)){const preShort=src.slice(Math.max(0,m.index-18),m.index).toLocaleUpperCase('tr-TR'),postShort=src.slice(m.index+m[0].length,m.index+m[0].length+22).toLocaleUpperCase('tr-TR');if(/İŞLEMİN|ISLEMIN/.test(preShort)||/TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT/.test(postShort))continue;const di=stmtDateInfo(m[0],anchor);if(!di)continue;const pre=src.slice(Math.max(0,m.index-70),m.index).replace(/\s+/g,' ');if(headerBefore.test(pre))continue;hits.push({index:m.index,end:m.index+m[0].length,raw:m[0],date:di.date})}};
  addHits(/\b20\d{2}[.\/-]\d{1,2}[.\/-]\d{1,2}\b/g);
  addHits(/\b\d{1,2}[.\/-]\d{1,2}(?:[.\/-](?:20\d{2}|\d{2}))?\b/gi);
  addHits(/\b\d{1,2}\s+(?:OCAK|OCA|ŞUBAT|ŞUB|MART|MAR|NİSAN|NİS|MAYIS|MAY|HAZİRAN|HAZ|TEMMUZ|TEM|AĞUSTOS|AĞU|EYLÜL|EYL|EKİM|EKİ|KASIM|KAS|ARALIK|ARA)(?:\s+(?:20\d{2}|\d{2}))?\b/gi);
  hits.sort((a,b)=>a.index-b.index||b.end-a.end);
  const uniq=[];for(const h of hits){const last=uniq.at(-1);if(last&&h.index<last.end)continue;uniq.push(h)}
  const blocks=[];let cur=null;
  const flush=()=>{if(cur){const body=cur.parts.join(' ').replace(/\s+/g,' ').trim();if(body){const rawKey=body.toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim();blocks.push({date:cur.date,lines:[body],dateCount:cur.dateCount,rawKey,sourceStart:cur.sourceStart,sourceEnd:cur.sourceEnd})}cur=null}};
  for(let i=0;i<uniq.length;i++){
    const h=uniq[i],next=uniq[i+1],sliceEnd=next?next.index:src.length,tail=stmtTransactionTailOnly(src.slice(h.end,sliceEnd).replace(/\s+/g,' ').trim());
    if(!cur)cur={date:h.date,parts:[h.raw],dateCount:1,sourceStart:h.index,sourceEnd:sliceEnd};else{cur.parts.push(h.raw);cur.dateCount++;cur.sourceEnd=sliceEnd}
    if(tail)cur.parts.push(tail);
    // Her fiziksel satırın kaynak konumunu koru. Aynı gün/işyeri/tutar tekrarı gerçek bir işlem olabilir.
    if(stmtAmountCandidates(stmtStripDates(tail)).length)flush();
    else if(cur.dateCount>=3)flush();
  }
  flush();return blocks
}
function stmtInstallmentInfo(blockText,selectedAmount){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR');
  let no=null,count=null,total=null;
  const frac=u.match(/(?:İŞLEMİN|ISLEMIN)\s*(\d{1,2})\s*\/\s*(\d{1,2})\s*(?:TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT)?/i)||u.match(/(\d{1,2})\s*\/\s*(\d{1,2})\s*(?:TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT)/i);
  if(frac){no=+frac[1];count=+frac[2];if(!(no>=1&&count>=2&&no<=count)){no=null;count=null}}
  const totalMatch=String(blockText||'').match(/([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})|[0-9]+(?:,[0-9]{2}))\s*(?:TL|TRY|₺)?[^0-9]{0,20}(?:İŞLEMİN|ISLEMIN)/i);
  if(totalMatch){const n=stmtParseLooseMoney(totalMatch[1]);if(Number.isFinite(n)&&n>Math.abs(selectedAmount||0))total=n}
  return{installmentNo:no,installmentCount:count,installmentTotal:total}
}
const STMT_BANK_PROFILES=[
  {id:'ziraat',label:'ZİRAAT / BANKKART',detect:/ZIRAAT|BANKKART/,preferLine:false},
  {id:'halkbank',label:'HALKBANK / PARAF',detect:/HALKBANK|PARAF/,preferLine:true,summary:{
    previousBalance:/Bir\s+Önceki\s+Dönem(?:\s+Ekstre\s+Borcu)?\s*[:\-]?\s*({M})(?:\s*TL)?(?:\s+Ekstre\s+Borcu)?/i,
    spendingTotal:/Dönem\s+İçi\s+Borç\s+Tutarı\s*[:\-]?\s*({M})/i,
    feesTotal:/Toplam\s+Faiz,?\s*Ücret,?(?:\s+Vergiler)?\s*[:\-]?\s*({M})(?:\s*TL)?(?:\s+Vergiler)?/i,
    paymentsTotal:/Dönemsel\s+Alacak(?:\s+Kayıtları)?\s*[:\-]?\s*({M})(?:\s*TL)?(?:\s+Kayıtları)?/i,
    periodDebt:/Hesap\s+Bakiyesi\s*[:\-]?\s*({M})/i
  }},
  {id:'vakifbank',label:'VAKIFBANK',detect:/VAKIFBANK|VAKIFKART|WORLD.*VAKIF/,preferLine:false},
  {id:'garanti',label:'GARANTİ BBVA',detect:/GARANTI|BBVA/,preferLine:false},
  {id:'akbank',label:'AKBANK',detect:/AKBANK|AXESS/,preferLine:false},
  {id:'yapikredi',label:'YAPI KREDİ',detect:/YAPI\s*KREDI|WORLD/,preferLine:false},
  {id:'isbank',label:'İŞ BANKASI',detect:/IS\s*BANKASI|MAXIMUM/,preferLine:false,summary:{
    previousBalance:/B[İI]R\s+[ÖO]NCEK[İI]\s+HESAP\s+[ÖO]ZET[İI]\s+BAK[İI]YEN[İI]Z[^0-9+-]*({M})/i,
    spendingTotal:/\bTOPLAM\s+({M})\s*TL/i,
    feesTotal:/FA[İI]Z\s+VE\s+[ÜU]CRETLER[^0-9+-]*({M})/i,
    paymentsTotal:/HESAPTAN\s+AKTARIM[^0-9+-]*(-?{M})/i,
    periodDebt:/HESAP\s+[ÖO]ZET[İI]\s+BORCU[^0-9+-]*({M})/i
  }},
  {id:'qnb',label:'QNB',detect:/QNB|FINANSBANK|CARDFINANS/,preferLine:false},
  {id:'denizbank',label:'DENİZBANK',detect:/DENIZBANK/,preferLine:false,summary:{
    previousBalance:/[ÖO]NCEK[İI]\s+HESAP\s+BAK[İI]YEN[İI]Z[^0-9+-]*({M})/i,
    spendingTotal:/D[ÖO]NEM\s+[İI][ÇC][İI]\s+HARCAMANIZ[^0-9+-]*({M})/i,
    feesTotal:/TOPLAM\s+FA[İI]Z\s+VE\s+[ÜU]CRETLER[^0-9+-]*({M})/i,
    paymentsTotal:/[ÖO]DEMELER[^0-9+-]*({M})/i,
    periodDebt:/D[ÖO]NEM\s+BORCU[^0-9+-]*({M})/i
  }},
  {id:'teb',label:'TEB',detect:/TURK\s*EKONOMI\s*BANKASI|\bTEB\b|BONUS\s*CARD/,preferLine:false,summary:{
    previousBalance:/[ÖO]NCEK[İI]\s+D[ÖO]NEMDEN\s+DEV[İI]R\s+ED[İI]LEN\s+TUTAR[^0-9+-]*(?:TL\.?)?({M})/i,
    spendingTotal:/BU\s+KARTINIZLA\s+YAPILAN\s+[İI][ŞS]LEM\s+TOPLAMLARI[^0-9+-]*(?:TL\.?)?({M})/i,
    feesTotal:/TOPLAM\s+FA[İI]Z\s+VE\s+[ÜU]CRETLER[^0-9+-]*({M})/i,
    paymentsTotal:/CEPTETEB\s+[ÖO]DEME[^0-9+-]*(-?{M})/i,
    periodDebt:/D[ÖO]NEM\s+BORCU[^0-9+-]*(?:TL\.?)?({M})/i
  }},
  {id:'ing',label:'ING',detect:/\bING\b/,preferLine:false},
  {id:'generic',label:'GENEL BANKA',detect:null,preferLine:false}
];
function stmtDetectBank(text,cardId=''){
  // Önce yalnızca ekstre metnini kullan. Seçili kart bankası PDF tanımını asla ezmemeli.
  const norm=v=>String(v||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I');
  const textOnly=norm(text);
  if(textOnly){for(const p of STMT_BANK_PROFILES){if(p.detect&&p.detect.test(textOnly))return{id:p.id,label:p.label,source:'statement'}}}
  // Ekstre üzerinde banka imzası bulunamazsa seçili kart bankasını yalnızca yedek olarak kullan.
  const card=state?.cards?.find?.(x=>x.id===cardId),cardOnly=norm(card?.bank||'');
  if(cardOnly){for(const p of STMT_BANK_PROFILES){if(p.detect&&p.detect.test(cardOnly))return{id:p.id,label:p.label,source:'card'}}}
  return{id:'generic',label:card?.bank?String(card.bank).toLocaleUpperCase('tr-TR'):'GENEL BANKA',source:'generic'}
}
function stmtBankProfile(text,cardId=''){
  const d=stmtDetectBank(text,cardId);return STMT_BANK_PROFILES.find(p=>p.id===d.id)||STMT_BANK_PROFILES.at(-1)
}
function stmtFeeLike(blockText){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR');
  return /\bKKDF\b|\bBSMV\b|\bBSMW\b|BANKA\s+VE\s+SİGORTA\s+MUAMELE|BANKA\s+VE\s+SIGORTA\s+MUAMELE|KREDİ\s+KARTI\s+FAİZ|KREDI\s+KARTI\s+FAIZ|KREDİ\s+FAİZ|KREDI\s+FAIZ|ALIŞVERİŞ\s+FAİZ|ALISVERIS\s+FAIZ|NAKİT\s+AVANS\s+FAİZ|NAKIT\s+AVANS\s+FAIZ|GECİKME\s+FAİZ|GECIKME\s+FAIZ|AKDİ\s+FAİZ|AKDI\s+FAIZ|TEMERRÜT\s+FAİZ|TEMERRUT\s+FAIZ|FAİZ\s+TUTARI|FAIZ\s+TUTARI|TAKSİT(?:LENDİRME)?\s+FAİZ|TAKSIT(?:LENDIRME)?\s+FAIZ|PEŞİNE\s+TAKSİT\s+FAİZ|PESINE\s+TAKSIT\s+FAIZ|KART\s+AİDAT|KART\s+AIDAT|BANKA\s+MASRAF|KOMİSYON|KOMISYON|İŞLEM\s+ÜCRET|ISLEM\s+UCRET|FAİZ\s+VE\s+(?:ÜCRET|ÜCRETLER)|FAIZ\s+VE\s+(?:UCRET|UCRETLER)/.test(u)
}
// S17 FIX3 — DenizBank'a özel banka masrafı sınıflandırması.
// Yalnızca işlem satırının kendi açıklamasına bakar; banka toplam farkından tür üretmez.
function stmtDenizFeeLike(blockText){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C').replace(/\s+/g,' ').trim();
  if(!u)return false;
  return /(?:^|\b)(?:BSMV|BSMW|KKDF)(?:\b|$)|BANKA\s+VE\s+SIGORTA\s+MUAMELE(?:LERI)?\s+VERGISI|KAYNAK\s+KULLANIMI\s+DESTEKLEME\s+FONU|(?:ALISVERIS|NAKIT\s+AVANS|GECIKME|AKDI|TEMERRUT|KREDI\s+KARTI|KREDI|TAKSIT(?:LENDIRME)?)\s+FAIZ(?:I|LERI)?|FAIZ\s+(?:TUTARI|TAHAKKUKU)|(?:KART|YILLIK\s+KART)\s+AIDAT(?:I)?|(?:BANKA|KART|ISLEM)\s+(?:MASRAF|UCRET)(?:I|LERI)?|KOMISYON(?:U|LARI)?|VERGI\s+(?:TUTARI|TAHAKKUKU)/.test(u);
}
function stmtPaymentLike(blockText){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR');
  return /(?:ŞUBE|SUBE)?\s*-?\s*OTOMATİK\s*ÖDEME|OTOMATIK\s*ODEME|İNTERAKTİF\s*ÖDEME|INTERAKTIF\s*ODEME|İNTERNET\s*ŞUBE(?:Sİ)?\s*ÖDEME|INTERNET\s*SUBE(?:SI)?\s*ODEME|MOBİL\s*ÖDEME|MOBIL\s*ODEME|ÖDEME\s*-?\s*TEŞEKK|ODEME\s*-?\s*TESEKK|HESAPTAN\s+ÖDEME|HESAPTAN\s+ODEME|KART\s*ÖDEMESİ|KART\s*ODEMESI|KREDİ\s*KARTI\s*ÖDEME|KREDI\s*KARTI\s*ODEME|BORÇ\s*ÖDEME|BORC\s*ODEME|HESAPTAN\s+AKTARIM.{0,40}İNTERAKTİF|HESAPTAN\s+AKTARIM.{0,40}INTERAKTIF|CEPTETEB\s+ÖDEME|CEPTETEB\s+ODEME/.test(u)
}
function stmtCarryForwardLike(blockText){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/\s+/g,' ').trim();
  if(!u)return false;
  // Ekstre tablosunda bilgi amaçlı gösterilen önceki dönem/devir satırları gerçek işlem değildir.
  // Ödeme satırlarını etkilememek için yalnızca devir + ekstre borcu/bakiye bağlamı filtrelenir.
  return /BIR\s+ONCEKI\s+DONEM(?:.{0,90})?(?:EKSTRE\s+BORCU|DONEM\s+BORCU|DEVIR|DEVREDEN|BAKIYE)/.test(u)
    || /ONCEKI\s+DONEM(?:.{0,90})?(?:EKSTRE\s+BORCU|DONEM\s+BORCU|DEVIR|DEVREDEN|BAKIYE)/.test(u)
    || /(?:DEVREDEN\s+BAKIYE|DEVIR\s+EDILEN\s+TUTAR|ONCEKI\s+AYDAN\s+DEVIR|ONCEKI\s+DONEM(?:DEN)?\s+(?:DEVIR|DEVREDEN)(?:\s+EDILEN)?\s+(?:TUTAR|BAKIYE|BORC)?|ONCEKI\s+DONEM\s+(?:BORCU|BAKIYESI)|BIR\s+ONCEKI\s+HESAP\s+OZETI\s+BAKIYENIZ)/.test(u)
    || /EKSTRE\s+BORCU(?:.{0,80})?KART\s+NO/.test(u);
}
// V68 — TEB ozet/devir korumasi. TEB PDF metni bazen ozet kutusundaki devreden bakiyeyi
// faiz/ucret basligi ile ayni fiziksel blokta birlestirebiliyor. Bu satirlar hareket degildir.
function stmtTebSummaryLike(blockText){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C').replace(/\s+/g,' ').trim();
  if(!u)return false;
  return /(?:ONCEKI\s+DONEM(?:DEN)?\s+(?:DEVIR|DEVREDEN)(?:\s+EDILEN)?\s*(?:TUTAR|BAKIYE|BORC)?|DEVREDEN\s+BAKIYE|DEVIR\s+EDILEN\s+TUTAR|ONCEKI\s+DONEM\s+(?:BORCU|BAKIYESI))/.test(u)
    || /(?:DONEM\s+BORCU|ASGARI\s+ODEME(?:\s+TUTARI)?|TOPLAM\s+FAIZ\s+VE\s+UCRETLER|BU\s+KARTINIZLA\s+YAPILAN\s+ISLEM\s+TOPLAMLARI)/.test(u);
}
function stmtTebPostProcess(rows){
  return (rows||[]).filter(r=>{
    const raw=`${r?.rawKey||''} ${r?.title||''}`;
    // Ozet/devir satiri ne kadar faiz kelimesi tasirsa tasisin gercek faiz islemi olamaz.
    if(stmtCarryForwardLike(raw)||stmtTebSummaryLike(raw))return false;
    return true;
  });
}
function stmtDropChronologyBreakingDuplicates(rows){
  const a=[...(rows||[])],groups={};
  a.forEach((r,i)=>{if(r?.semanticKey)(groups[r.semanticKey]||(groups[r.semanticKey]=[])).push(i)});
  const drop=new Set(),penalty=i=>{const cur=a[i]?.date||'',prev=i>0?(a[i-1]?.date||''):'',next=i<a.length-1?(a[i+1]?.date||''):'';let p=0;if(prev&&cur&&prev>cur)p+=2;if(cur&&next&&cur>next)p+=2;if(prev&&next&&cur&&prev===next&&cur!==prev)p+=1;return p};
  for(const idxs of Object.values(groups)){if(idxs.length!==2||Math.abs(idxs[1]-idxs[0])===1)continue;const ps=idxs.map(i=>({i,p:penalty(i)})),min=Math.min(...ps.map(x=>x.p)),max=Math.max(...ps.map(x=>x.p));if(max>min)for(const x of ps)if(x.p>min)drop.add(x.i)}
  return a.filter((_,i)=>!drop.has(i))
}
function stmtCommonIgnoreLine(v){
  const u=String(v||'').toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim();if(!u)return true;if(stmtCarryForwardLike(u))return true;
  return /^(?:İŞLEM|ISLEM|TARİHİ|TARIHI|AÇIKLAMA|ACIKLAMA|TUTAR|KALAN|BORÇ|BORC|TAKSİT|TAKSIT|PARAFPARA)$/.test(u)
    || /(?:İŞLEM|ISLEM).*TARİH|(?:AÇIKLAMA|ACIKLAMA).*TUTAR|TUTAR\s*\(TL\)|KALAN.*BORÇ|KALAN.*BORC|BORÇ.*TAKSİT|BORC.*TAKSIT/.test(u)
    || /TÜRKİYE\s+HALK\s+BANKASI|TURKIYE\s+HALK\s+BANKASI|MERSİS|MERSIS|MÜKELLEFLER\s+VERGİ|MUKELLEFLER\s+VERGI|TİCARET\s+SİCİL|TICARET\s+SICIL|DIALOG|PARAF\.COM\.TR|FAİZ\s+ORANLARI|FAIZ\s+ORANLARI|AYLIK\s+YILLIK/.test(u)
    || /BİR\s+SONRAKİ\s+(?:HESAP|SON\s+ÖDEME)|BIR\s+SONRAKI\s+(?:HESAP|SON\s+ODEME)|EKSTRE\s+İLE\s+İLGİLİ|EKSTRE\s+ILE\s+ILGILI/.test(u)
}
function stmtRewardAdjustmentLike(blockText,profileId=''){
  const u=String(blockText||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C').replace(/\s+/g,' ').trim();
  if(!u)return false;
  // Bonus/ParafPara/puan iptalleri kart harcaması değildir. Özellikle Halkbank/Paraf ekstrelerinde
  // bu satırlar parasal kolon taşıdığı için eski motor bunları normal harcama sanabiliyordu.
  return /(?:BONUS|PARAF\s*PARA|PARAFPARA|PUAN|REWARD).{0,45}(?:IPTAL|GERI\s*AL|IADE|SILIN|DUZELTME)|(?:IPTAL|GERI\s*AL|IADE).{0,45}(?:BONUS|PARAF\s*PARA|PARAFPARA|PUAN|REWARD)/.test(u);
}
function stmtMakeRow(cardId,di,sourceText,amountPick,sourceStart,profileId,occSeen,installments=true){
  if(!di||!amountPick||stmtCarryForwardLike(sourceText)||(profileId==='teb'&&stmtTebSummaryLike(sourceText)))return null;const rawAmount=amountPick.value;if(!Number.isFinite(rawAmount)||rawAmount===0)return null;
  const payment=stmtPaymentLike(sourceText),adjustment=!payment&&stmtRewardAdjustmentLike(sourceText,profileId),fee=!payment&&!adjustment&&stmtFeeLike(sourceText),refund=!payment&&!adjustment&&!fee&&(/\bİADE\b|\bIADE\b|\bİPTAL\b|\bIPTAL\b|\bREFUND\b|\bALACAK\b/i.test(sourceText)||rawAmount<0);
  const amount=payment?Math.abs(rawAmount):(refund?-Math.abs(rawAmount):Math.abs(rawAmount));
  let title=stmtStripDates(sourceText),amounts=stmtAmountCandidates(title);[...amounts].sort((a,b)=>b.index-a.index).forEach(a=>{title=title.replace(a.raw,' ')});
  title=title.replace(/\b(?:İŞLEM|ISLEM|PROVİZYON|PROVIZYON|VALÖR|VALOR)\s*TARİHİ\b/gi,' ').replace(/\b(?:AÇIKLAMA|ACIKLAMA|İŞYERİ|ISYERI|TUTAR|BORÇ|BORC|ALACAK|PARA\s*BİRİMİ|PARA\s*BIRIMI|PARAFPARA)\b/gi,' ').replace(/\b(?:TL|TRY|USD|EUR|GBP|₺)\b/gi,' ').replace(/^[\s+\-–—|:;,]+|[\s+\-–—|:;,]+$/g,' ').replace(/\s+/g,' ');
  title=title.replace(/\b(?:İŞLEMİN|ISLEMIN)?\s*\d{1,2}\s*\/\s*\d{1,2}\s*(?:TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT)?\b/gi,' ').replace(/\b(?:İŞLEMİN|ISLEMIN|TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT)\b/gi,' ').replace(/\s+/g,' ');title=stmtCleanTitle(title);
  if(!title)title=payment?'KART ÖDEMESİ':adjustment?'BONUS / PUAN DÜZELTME':refund?'KART İADESİ':fee?'VERGİ / FAİZ':'KART HARCAMASI';
  const inst=installments&&!payment&&!adjustment&&!refund&&!fee?stmtInstallmentInfo(sourceText,amount):{installmentNo:null,installmentCount:null,installmentTotal:null},kind=payment?'payment':adjustment?'adjustment':refund?'refund':fee?'fee':'spend';
  const baseFp=stmtFingerprint(cardId,di.date,title,payment?-amount:amount),instKey=`${inst.installmentNo||0}/${inst.installmentCount||0}/${Number(inst.installmentTotal||0).toFixed(2)}`,semanticKey=`${baseFp}|${kind}|${instKey}`,occ=(occSeen[semanticKey]=(occSeen[semanticKey]||0)+1);
  return{date:di.date,title,amount,category:payment?'Kart Ödemesi':fee?'Vergi & Faiz':stmtCategory(title),classificationReason:payment?'Ödeme açıklaması':adjustment?'Bonus/ParafPara/puan iptali – kart harcamasına dahil edilmez':fee?'Faiz/ücret açıklaması':refund?'İade/alacak işareti':'Normal harcama adayı',baseFp,semanticKey,rawKey:String(sourceText).toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim(),physicalKey:sourceStart!=null?`LN|${sourceStart}|${semanticKey}`:null,sourceStart,sourceEnd:sourceStart,occurrence:occ,fp:`${semanticKey}|#${occ}`,checked:!adjustment,refund,payment,adjustment,kind,...inst,bankProfile:profileId}
}
// Ortak satır motoru: banka bağımsızdır. Banka profili yalnızca tercih/etiket sağlar.
function stmtParseLineEngine(text,cardId,profile){
  const anchor=stmtAnchorInfo(text),lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean),rows=[],seen={};let pending=[],last=null,started=false;
  const appendPendingToLast=()=>{if(last&&pending.length){last.title=stmtCleanTitle(`${last.title} ${pending.join(' ')}`);if(last.kind==='spend')last.category=stmtCategory(last.title);pending=[]}};
  for(let i=0;i<lines.length;i++){
    const line=lines[i],u=line.toLocaleUpperCase('tr-TR'),m=line.match(/^\s*(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\b\s*(.*)$/);
    if(started&&/^(?:BİR\s+SONRAKİ|BIR\s+SONRAKI)$/.test(u)){pending=[];break}
    if(!started&&/^(?:İŞLEM|ISLEM)$/.test(u)){started=true;continue}
    if(!m){if(stmtCarryForwardLike(line)){pending=[];continue}if(!started||stmtCommonIgnoreLine(line))continue;const hasLetters=/[A-ZÇĞİÖŞÜa-zçğıöşü]/.test(line),hasMoney=stmtAmountCandidates(line).length>0;if(hasLetters&&!hasMoney)pending.push(line);continue}
    started=true;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;const rest=m[2]||'',amounts=stmtAmountCandidates(rest).sort((a,b)=>a.index-b.index);
    if(!amounts.length){if(!stmtCommonIgnoreLine(rest)&&/[A-ZÇĞİÖŞÜa-zçğıöşü]/.test(rest))pending.push(rest);continue}
    let titleProbe=rest;[...amounts].sort((a,b)=>b.index-a.index).forEach(a=>titleProbe=titleProbe.replace(a.raw,' '));titleProbe=stmtCleanTitle(titleProbe.replace(/\b(?:TL|TRY|₺)\b/gi,' '));
    let source=rest;if(pending.length){if(titleProbe&&/[A-ZÇĞİÖŞÜa-zçğıöşü]{2}/.test(titleProbe)){if(last)appendPendingToLast();else pending=[]}else{source=`${pending.join(' ')} ${rest}`;pending=[]}}
    const sourceAmounts=stmtAmountCandidates(source).sort((a,b)=>a.index-b.index),pick=stmtPickAmountForProfile(profile,source,sourceAmounts);const row=stmtMakeRow(cardId,di,source,pick,i,profile.id,seen,true);if(row){rows.push(row);last=row}
  }
  appendPendingToLast();return stmtDropChronologyBreakingDuplicates(rows)
}
function stmtParseBlockEngine(text,cardId,profile){
  const anchor=stmtAnchorInfo(text),datePref=stmtDatePreference(text),bad=/(?:D[ÖO]NEM\s+BORCU|TOPLAM\s+BOR[ÇC]|TOPLAM\s+HARCAMA|ASGAR[İI]\s*(?:[ÖO]DEME|TUTAR)|KULLANILAB[İI]L[İI]R\s+L[İI]M[İI]T|KART\s+L[İI]M[İI]T[İI]|SON\s+[ÖO]DEME\s+TAR[İI]H|HESAP\s+KES[İI]M\s+TAR[İI]H|[ÖO]NCEK[İI]\s+AYDAN\s+DEV[İI]R|[ÖO]NCEK[İI]\s+D[ÖO]NEM(?:DEN)?\s+(?:DEV[İI]R|DEVREDEN)|DEV[İI]R\s+ED[İI]LEN\s+TUTAR|DEVREDEN\s+BAK[İI]YE)/i,out=[],seen={};
  for(const block of stmtLogicalBlocks(text,anchor)){
    const blockText=block.lines.join(' ').replace(/\s+/g,' ').trim();if(!blockText||bad.test(blockText)||stmtCarryForwardLike(blockText))continue;const di=stmtPickTransactionDate(blockText,anchor,datePref);if(!di)continue;const noDates=stmtStripDates(blockText),amounts=stmtAmountCandidates(noDates);if(!amounts.length)continue;
    const upperNoDates=noDates.toLocaleUpperCase('tr-TR'),taksitPos=Math.max(upperNoDates.indexOf('TAKSİDİ'),upperNoDates.indexOf('TAKSIDI'),upperNoDates.indexOf('TAKSİT'),upperNoDates.indexOf('TAKSIT'));let pick=null;
    if(taksitPos>=0){const islemPos=Math.max(upperNoDates.indexOf('İŞLEMİN'),upperNoDates.indexOf('ISLEMIN')),before=islemPos>=0?amounts.filter(a=>a.index<islemPos).sort((a,b)=>a.index-b.index):[],totalCandidate=before.length?before.at(-1):null,cands=amounts.filter(a=>!totalCandidate||a.index!==totalCandidate.index).sort((a,b)=>a.index-b.index);if(cands.length)pick=cands[0]}
    if(!pick)pick=stmtPickAmountForProfile(profile,blockText,amounts)
    if(!pick)continue;const row=stmtMakeRow(cardId,di,blockText,pick,Number.isFinite(block.sourceStart)?block.sourceStart:null,profile.id,seen,true);if(row){row.sourceEnd=Number.isFinite(block.sourceEnd)?block.sourceEnd:row.sourceStart;row.physicalKey=row.sourceStart!=null?`${row.sourceStart}:${row.sourceEnd||row.sourceStart}|${row.semanticKey}`:null;if(!(row.physicalKey&&out.some(x=>x.physicalKey===row.physicalKey)))out.push(row)}
  }
  return stmtDropChronologyBreakingDuplicates(out)
}

// V71 — Ziraat / Bankkart gerçek tablo satırı motoru.
// Bankkart PDF'lerinde aynı gün aynı tutarda birden fazla gerçek işlem olabilir; satırlar asla
// tarih+açıklama+tutar imzasına göre tekilleştirilmez. Taksit satırında ekstreye yansıyan taksit,
// Bankkart Lira kolonunda ise ilk TL tutarı gerçek kart hareketidir.
function stmtParseZiraatFixedEngine(text,cardId,profile){
  if(profile?.id!=='ziraat')return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={},lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  let started=false;
  for(let i=0;i<lines.length;i++){
    const line=lines[i],u=line.toLocaleUpperCase('tr-TR');
    if(/İŞLEM\s+TARİH|ISLEM\s+TARIH/.test(u)){started=true;continue}
    if(started&&/^(?:FAİZ\s+VE\s+ÜCRETLER|FAIZ\s+VE\s+UCRETLER)\s*:?$/i.test(u))break;
    if(!started)continue;
    const m=line.match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;
    const seg=m[2].trim();if(stmtCarryForwardLike(seg)||stmtPhysicalSummaryLike(seg,'ziraat'))continue;
    const amounts=stmtAmountCandidates(seg).sort((a,b)=>a.index-b.index);if(!amounts.length)continue;
    let pick=null;
    const up=seg.toLocaleUpperCase('tr-TR');
    // "3.750,00 TL İşlemin 1/2 Taksidi 1.875,00" -> bu ekstreye 1.875,00 yansır.
    const taksit=/İŞLEMİN|ISLEMIN|TAKSİDİ|TAKSIDI|TAKSİT|TAKSIT/.test(up);
    if(taksit){
      const marker=Math.max(up.lastIndexOf('TAKSİDİ'),up.lastIndexOf('TAKSIDI'),up.lastIndexOf('TAKSİT'),up.lastIndexOf('TAKSIT'));
      const after=amounts.filter(a=>a.index>marker);pick=after.length?after[0]:amounts.at(-1);
    }else{
      // Ziraat'ta Bankkart Lira en sağ kolondur (örn. 6.670,00 + 6,67 puan). İlk parasal değer kart tutarıdır.
      pick=amounts[0];
    }
    if(!pick||!Number.isFinite(+pick.value)||Math.abs(+pick.value)<=.004)continue;
    const row=stmtMakeRow(cardId,di,seg,pick,i,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=i;row.physicalKey=`ZIRAAT|${i}|${row.semanticKey}`;row.parserStrategy='ziraat-fixed-table-row';rows.push(row)
  }
  return rows
}

function stmtParseDenizBankFixedEngine(text,cardId,profile){
  if(profile?.id!=='denizbank')return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={},lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
    const line=lines[i],m=line.match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;
    const rest=m[2].trim();if(stmtCarryForwardLike(rest)||stmtTebSummaryLike(rest))continue;
    // DenizBank tablo yapısında gerçek İşlem Tutarı en sağ sütundur.
    // Bonus(TL) / Kalan Borç / Taksit sütunlarındaki sayıları ASLA işlem fiyatı olarak seçme.
    const end=rest.match(/([+-]?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})\s*\+?)\s*TL\s*$/i);
    if(!end)continue;
    const raw=end[0],value=stmtMoney(raw);if(!Number.isFinite(value)||value===0)continue;
    const pick={raw,value,index:Math.max(0,rest.length-raw.length),currency:'TL',score:1000};
    const row=stmtMakeRow(cardId,di,rest,pick,i,profile.id,seen,true);if(!row)continue;
    // DenizBank'ta komisyon/vergi/faiz satırları normal POS harcaması değildir.
    // Açıklama açıkça banka masrafıysa türü burada kesinleştir; tutar farkına göre ASLA sınıflandırma yapma.
    if(!row.payment&&!row.refund&&stmtDenizFeeLike(rest)){
      row.kind='fee';row.category='Vergi & Faiz';row.refund=false;row.payment=false;
      row.classificationReason='DenizBank faiz/vergi/komisyon açıklaması';
      row.semanticKey=(row.semanticKey||'')+'|deniz-fee';
    }
    row.sourceEnd=i;row.physicalKey=`DENIZ|${i}|${row.semanticKey}`;row.parserStrategy='deniz-fixed-right-column';rows.push(row)
  }
  return rows
}

// V73: Halkbank / Paraf fixed row engine.
// Halkbank işlem tablosunda tarihli satırın sonunda çoğunlukla iki parasal kolon vardır:
// gerçek TUTAR(TL) + ParafPara. Abone/referans numaraları tutar değildir.
// Bu motor devir satırından bağımsız olarak her tarihli fiziksel satırı yeniden kurar.
function stmtParseHalkbankFixedEngine(text,cardId,profile){
  if(profile?.id!=='halkbank')return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={},lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;
    let seg=m[2].trim();
    if(stmtCarryForwardLike(seg))continue;
    // V74: Halkbank footer/özet tarihleri işlem değildir. PDF metni bazen
    // "Bir Sonraki Hesap Kesim Tarihi" başlığını önceki satırlara, tarihi ise
    // tek başına yeni satıra koyar; bu durumda bakiye/toplam tutarı harcama sanılmamalı.
    const prevCtx=lines.slice(Math.max(0,i-4),i).join(' ').toLocaleUpperCase('tr-TR');
    if(/BİR\s+SONRAKİ\s+(?:HESAP\s+KESİM|SON\s+ÖDEME)\s+TARİHİ|BIR\s+SONRAKI\s+(?:HESAP\s+KESIM|SON\s+ODEME)\s+TARIHI/.test(prevCtx))continue;
    if(/^(?:TOPLAM|GENEL\s+TOPLAM|ARA\s+TOPLAM|HESAP\s+BAKİYESİ|HESAP\s+BAKIYESI|DÖNEM\s+BORCU|DONEM\s+BORCU)\b/i.test(seg))continue;
    // Açıklama alt satıra taşmışsa, sonraki tarihli satıra kadar en fazla 2 metin satırını ekle.
    for(let j=i+1;j<Math.min(lines.length,i+3);j++){
      if(/^\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2})\b/.test(lines[j]))break;
      if(stmtCommonIgnoreLine(lines[j])||/TÜRKİYE\s+HALK\s+BANKASI|TURKIYE\s+HALK\s+BANKASI|MERSİS|MERSIS|PARAF\.COM\.TR/i.test(lines[j]))break;
      if(/BİR\s+SONRAKİ\s+(?:HESAP\s+KESİM|SON\s+ÖDEME)\s+TARİHİ|BIR\s+SONRAKI\s+(?:HESAP\s+KESIM|SON\s+ODEME)\s+TARIHI|^(?:TOPLAM|GENEL\s+TOPLAM|ARA\s+TOPLAM|HESAP\s+BAKİYESİ|HESAP\s+BAKIYESI|DÖNEM\s+BORCU|DONEM\s+BORCU)\b/i.test(lines[j]))break;
      // Sadece açıklama devamı veya parasal kolon satırı olabilecek kısa satırları ekle.
      if(lines[j].length<180)seg+=' '+lines[j];
    }
    const amounts=stmtAmountCandidates(seg).sort((a,b)=>a.index-b.index);if(!amounts.length)continue;
    // TUTAR(TL), ParafPara kolonundan önce gelir. Son aday küçük bir ParafPara ise bir önceki tutarı seç.
    let pick=null;
    const explicit=amounts.filter(a=>['TL','TRY','₺'].includes(a.currency));
    if(explicit.length)pick=explicit[0];
    else if(amounts.length>=2){
      const last=amounts.at(-1),prev=amounts.at(-2);
      const rewardLike=Math.abs(+last.value||0)<=5 && Math.abs(+prev.value||0)>=5;
      pick=rewardLike?prev:amounts[0];
    }else pick=amounts[0];
    if(!pick||!Number.isFinite(+pick.value)||Math.abs(+pick.value)<=.004)continue;
    const row=stmtMakeRow(cardId,di,seg,pick,i,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=i;row.physicalKey=`HALK|${i}|${row.semanticKey}`;row.parserStrategy='halkbank-fixed-row';rows.push(row)
  }
  return stmtDropChronologyBreakingDuplicates(rows)
}


// V84: Halkbank coordinate-table final parser.
// V79 koordinat motorunun ürettiği satırlar zaten fiziksel tablo satırlarıdır.
// Bunları eski multiline parser'a tekrar sokmak açıklamaların komşu işlemlerle birleşmesine neden oluyordu.
// Marker varsa her tarihli satır bağımsız ve nihai işlem kabul edilir.
function stmtParseHalkbankCoordinateEngine(text,cardId,profile){
  if(profile?.id!=='halkbank'||!String(text||'').includes('__HANE_HALKBANK_TABLE_ENGINE__'))return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={};
  const lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;
    const seg=m[2].trim();if(stmtCarryForwardLike(seg))continue;
    const amounts=stmtAmountCandidates(seg).sort((a,b)=>a.index-b.index);if(!amounts.length)continue;
    let pick=null;
    const explicit=amounts.filter(a=>['TL','TRY','₺'].includes(a.currency));
    if(explicit.length)pick=explicit[0];
    else if(amounts.length>=2){
      const last=amounts.at(-1),prev=amounts.at(-2);
      const rewardLike=Math.abs(+last.value||0)<=5&&Math.abs(+prev.value||0)>=5;
      pick=rewardLike?prev:amounts[0];
    }else pick=amounts[0];
    if(!pick||!Number.isFinite(+pick.value)||Math.abs(+pick.value)<=.004)continue;
    const row=stmtMakeRow(cardId,di,seg,pick,500000+i,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=500000+i;row.physicalKey=`HALKCOORD|${i}|${row.semanticKey}`;row.parserStrategy='halkbank-coordinate-final';rows.push(row)
  }
  // V90 — Halkbank koordinat motorunda kronoloji-temelli tekilleştirme YOK.
  // Bu satırlar PDF tablosundaki tarih+tutar koordinatlarıyla zaten fiziksel olarak doğrulanmıştır.
  // Aynı semanticKey'in daha sonra tekrar görünmesi gerçek ayrı işlem olabilir; eski
  // stmtDropChronologyBreakingDuplicates() 12→9, 41→39 ve 34→31 gibi eksik parser sonucu
  // üretiyordu. Koordinat tablosunda her fiziksel satır birebir korunur.
  return rows
}

// V82 — TEB sayfa-sınırı eksik satır düzeltmesi: fiziksel motor audit ile aynı 4 satırlık pencereyi kullanır.
// Sayfa bazlı fiziksel sayı, birleşik metindeki sütun kaybına karşı bağımsız doğrulama olarak korunur.
// V76 — TEB fiziksel tablo motoru.
// V75'te bazı TEB PDF'lerinde PDF.js sütun sırasını "tarih -> tutar -> açıklama" olarak düzleştiriyordu.
// Bu motor TEB'i yalnız kendi profilinde ele alır; Ziraat/DenizBank/Halkbank/İş Bankası akışına dokunmaz.
// Her tam tarihli fiziksel aday ayrı tutulur; özet/devir satırları hareket değildir.
function stmtParseTebPhysicalEngine(text,cardId,profile){
  if(profile?.id!=='teb')return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={};
  const lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  const dateRx=/\b\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2})\b/;
  const stopRx=/(?:BU\s+KARTINIZLA\s+YAPILAN\s+[İI][ŞS]LEM\s+TOPLAMLARI|GENEL\s+TOPLAM|D[ÖO]NEM\s+BORCU|ASGAR[İI]\s+[ÖO]DEME)/i;
  for(let i=0;i<lines.length;i++){
    const line=lines[i],dm=line.match(dateRx);if(!dm)continue;
    const di=stmtDateInfo(dm[0],anchor);if(!di)continue;
    // Yalnız bu fiziksel hareketi kur. Sonraki tarih başlamadan en fazla iki devam satırı eklenir;
    // özet başladığı anda kesilir ki son hareket banka toplamını kendi tutarı sanmasın.
    let parts=[line];
    for(let j=i+1;j<Math.min(lines.length,i+4);j++){
      if(dateRx.test(lines[j])||stopRx.test(lines[j]))break;
      parts.push(lines[j]);
    }
    let src=parts.join(' ').replace(/\s+/g,' ').trim();
    const stop=src.search(stopRx);if(stop>0)src=src.slice(0,stop).trim();
    // Devir/özet satırı gerçek hareket değildir. Ancak ödeme açıklaması "TEŞEKKÜR EDERİZ" korunur.
    if(stmtCarryForwardLike(src)||stmtTebSummaryLike(src))continue;
    const vals=stmtAmountCandidates(src).filter(a=>Number.isFinite(a.value)&&Math.abs(a.value)>0);
    if(!vals.length)continue;
    const explicit=vals.filter(a=>['TL','TRY','₺'].includes(a.currency));
    let pick=null;
    if(stmtPaymentLike(src)){
      // Ödemede negatif TL yazımı (-TL.14.826,69) en güçlü işarettir.
      pick=explicit.find(a=>a.value<0)||explicit[0]||vals.find(a=>a.value<0)||vals[0];
    }else{
      // TEB SADE'de Bonus kolonu sağda olsa bile gerçek işlem tutarı TL ile yazılan ilk parasal hücredir.
      // Bu seçim hem "açıklama -> TL tutar" hem "tutar -> açıklama" PDF düzleşmesini kapsar.
      pick=explicit[0]||vals[0];
    }
    if(!pick)continue;
    const row=stmtMakeRow(cardId,di,src,pick,600000+i,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=600000+i;row.physicalKey=`TEBPHYS|${i}|${row.semanticKey}`;row.parserStrategy='teb-physical-row-v76';rows.push(row);
  }
  return rows;
}

function stmtParseTebFixedEngine(text,cardId,profile){
  if(profile?.id!=='teb')return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={},lines=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
    const line=lines[i],m=line.match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;
    const rest=m[2].trim();if(stmtCarryForwardLike(rest)||stmtTebSummaryLike(rest))continue;
    // TEB SADE ekstrelerinde gerçek hareket tutarı satırın sonundaki TL. tutarıdır.
    // Örn: TL.300,- / TL.2.297,40 / -TL.14.826,69. Başka sayıları tutar sayma.
    const end=rest.match(/([+-]?\s*(?:TL|TRY|₺)\.?\s*[+-]?\s*(?:(?:\d{1,3}(?:[.]\d{3})+|\d+)(?:,\d{2}|,-)?))\s*$/i);
    if(!end)continue;
    const raw=end[1],value=stmtMoney(raw);if(!Number.isFinite(value)||value===0)continue;
    const pick={raw,value,index:Math.max(0,rest.length-end[0].length),currency:'TL',score:1000};
    const row=stmtMakeRow(cardId,di,rest,pick,i,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=i;row.physicalKey=`TEB|${i}|${row.semanticKey}`;row.parserStrategy='teb-fixed-final-tl';rows.push(row)
  }
  return rows
}

// TEB SADE için tarih segmenti motoru: toplam satırları hiçbir zaman işlem tutarı olamaz.
function stmtParseTebSegmentEngine(text,cardId,profile){
  if(profile?.id!=='teb')return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={};
  let flat=String(text||'').replace(/\r/g,' ').replace(/\n/g,' ').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
  // V78 — TEB sayfa-sonu güvenli segment motoru.
  // Önceki sürümde son gerçek işlemden sonra aynı tarih segmentine yapışan
  // "BU KARTINIZLA... / GENEL TOPLAM" metni yüzünden gerçek son işlem komple atılabiliyordu.
  const tablePos=flat.search(/İŞLEM\s+TARİHİ\s+İŞLEM\s+AÇIKLAMASI\s+TUTAR/i);
  if(tablePos>=0)flat=flat.slice(tablePos);
  const dateRx=/(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))/g;
  const hits=[...flat.matchAll(dateRx)];
  const stopRx=/(?:BU\s+KARTINIZLA\s+YAPILAN\s+[İI][ŞS]LEM\s+TOPLAMLARI|GENEL\s+TOPLAM|D[ÖO]NEM\s+BORCU|ASGAR[İI]\s+[ÖO]DEME|KART\s+NUMARASI\s*:)/i;
  for(let j=0;j<hits.length;j++){
    const start=hits[j].index,end=j+1<hits.length?hits[j+1].index:flat.length;
    const dateRaw=hits[j][1],di=stmtDateInfo(dateRaw,anchor);if(!di)continue;
    let seg=flat.slice(start,end).trim();
    const body=seg.slice(dateRaw.length).trim();
    // Devir satırı gerçekten segmentin kendi açıklamasıysa işlem değildir.
    // Fakat özet metni segmentin SONUNA yapıştıysa önce kesilir; gerçek hareket korunur.
    if(stmtCarryForwardLike(body.slice(0,180)))continue;
    const stop=seg.search(stopRx);if(stop>dateRaw.length)seg=seg.slice(0,stop).trim();
    if(!seg||stmtCarryForwardLike(seg))continue;
    const vals=[...seg.matchAll(/-?\s*(?:TL|TRY|₺)\.?\s*[+-]?\s*(?:(?:\d{1,3}(?:[.]\d{3})+|\d+)(?:,\d{2}|,-)?)/gi)];
    if(!vals.length)continue;
    // Ödeme satırında negatif TL önceliklidir; normal harcamada ilk açık TL hücresi kullanılır.
    let m=vals[0];
    if(stmtPaymentLike(seg)){const neg=vals.find(x=>stmtMoney(x[0])<0);if(neg)m=neg}
    const raw=m[0],value=stmtMoney(raw);if(!Number.isFinite(value)||value===0)continue;
    const pick={raw,value,index:m.index||0,currency:'TL',score:1200};
    const row=stmtMakeRow(cardId,di,seg,pick,start,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=end;row.physicalKey=`TEBSEG|${start}|${row.semanticKey}`;row.parserStrategy='teb-date-segment-v78';rows.push(row)
  }
  return rows
}

// V78 — TEB strateji seçimi artık tek bir parserı körlemesine seçmez.
// Bankanın etiketli GENEL TOPLAM / işlem toplamı ile en iyi uyuşan aday tablo seçilir.
// Bu yalnız TEB'e uygulanır; diğer banka motorları değişmez.
function stmtChooseTebRows(text,candidates){
  const sum=stmtParseTebLabeledSummary(text)||{},target=Number(sum.spendingTotal),physical=stmtPhysicalRowAudit(text,'teb').count||0;
  const clean=a=>stmtTebPostProcess(a||[]),spend=a=>clean(a).filter(r=>r?.kind==='spend').reduce((n,r)=>n+Math.abs(+r.amount||0),0);
  let best=null,bestScore=-Infinity;
  for(const c of (candidates||[])){
    const rows=clean(c.rows);if(rows.length<1)continue;
    const s=spend(rows);let score=rows.length*2;
    if(Number.isFinite(target)){
      const d=Math.abs(s-target);
      if(d<.02)score+=100000;else score-=Math.min(50000,d*20);
    }
    if(physical){const d=Math.abs(rows.length-physical);score-=d*25;if(d===0)score+=100}
    // Devir/özet artığı kalan strateji seçilemez.
    if(rows.some(r=>stmtCarryForwardLike(`${r?.rawKey||''} ${r?.title||''}`)||stmtTebSummaryLike(`${r?.rawKey||''} ${r?.title||''}`)))score-=100000;
    if(score>bestScore){bestScore=score;best={rows,strategy:c.strategy}}
  }
  return best;
}

// V79 — TEB eksik satır tamamlama katmanı.
// Ana parser değiştirilmez. Fiziksel TEB motoru yalnız YEDEK aday havuzudur.
// Bir aday ancak banka harcama/ödeme/faiz toplamındaki pozitif açığı veya bağımsız
// dönem borcu denklemi açığını kuruşu kuruşuna ve BENZERSİZ biçimde kapatıyorsa eklenir.
// Böylece V76'daki "her fiziksel adayı ekle" regresyonu geri gelemez.
function stmtTebCompleteMissingRows(text,selectedRows,physicalRows){
  let rows=stmtTebPostProcess(selectedRows||[]),phys=stmtTebPostProcess(physicalRows||[]);
  if(!rows.length||!phys.length)return rows;
  const localPhysicalCount=stmtPhysicalRowAudit(text,'teb').count||0;
  const readPhysicalCount=(statementReadDiagnostics?.bankId==='teb'?+statementReadDiagnostics?.physicalRowCount:0)||0;
  const physicalCount=Math.max(localPhysicalCount,readPhysicalCount);
  if(physicalCount<=rows.length)return rows;
  const key=r=>`${r?.date||''}|${r?.kind||''}|${Math.round(Math.abs(+r?.amount||0)*100)}`;
  const used={};for(const r of rows){const k=key(r);used[k]=(used[k]||0)+1}
  const pool=[];for(const r of phys){const k=key(r);if(used[k]>0){used[k]--;continue}pool.push(r)}
  if(!pool.length)return rows;
  const round2=n=>Math.round((+n||0)*100)/100,sum=(a,k)=>round2((a||[]).filter(r=>r?.kind===k).reduce((n,r)=>n+Math.abs(+r.amount||0),0));
  const summary=stmtParseTebLabeledSummary(text)||{};
  const chosen=new Set();
  // Kuruş bazında benzersiz alt-küme. Birden fazla olası çözüm varsa otomatik ekleme YOK.
  const uniqueSubset=(candidates,targetCents,maxItems=4)=>{
    if(targetCents<=0)return null;const a=candidates.map((r,i)=>({r,i,c:Math.round(Math.abs(+r.amount||0)*100)})).filter(x=>x.c>0&&x.c<=targetCents),found=[];
    const dfs=(start,left,pick)=>{if(found.length>1)return;if(left===0){found.push([...pick]);return}if(left<0||pick.length>=maxItems)return;for(let j=start;j<a.length;j++){const x=a[j];if(x.c>left)continue;pick.push(x.i);dfs(j+1,left-x.c,pick);pick.pop();if(found.length>1)return}};
    dfs(0,targetCents,[]);return found.length===1?found[0]:null;
  };
  const tryKind=(kind,target)=>{
    if(!Number.isFinite(+target))return;const cur=sum(rows,kind),need=Math.round(((+target)-cur)*100);if(need<=1)return;
    const cand=pool.filter((r,i)=>!chosen.has(i)&&r?.kind===kind),idxs=uniqueSubset(cand,need,4);if(!idxs?.length)return;
    // pool indeksini nesne kimliği üzerinden bul; yalnız benzersiz çözüm eklenir.
    for(const j of idxs){const obj=cand[j],pi=pool.indexOf(obj);if(pi>=0)chosen.add(pi)}
  };
  tryKind('spend',summary.spendingTotal);
  tryKind('payment',summary.paymentsTotal);
  tryKind('fee',summary.feesTotal);
  // Etiketli toplam eksik/yanlışsa ikinci bağımsız kanıt dönem borcu denklemidir.
  // Yalnız ilk aşamada hiçbir aday seçilmediyse ve denklem açığını benzersiz bir aday kümesi kapatıyorsa kullan.
  if(!chosen.size&&Number.isFinite(+summary.previousBalance)&&Number.isFinite(+summary.periodDebt)){
    const spend=sum(rows,'spend'),fee=sum(rows,'fee'),pay=sum(rows,'payment'),refund=sum(rows,'refund');
    const current=round2((+summary.previousBalance)+spend+fee-pay-refund),need=Math.round(((+summary.periodDebt)-current)*100);
    if(Math.abs(need)>1){
      const signed=pool.map((r,i)=>({r,i,c:Math.round(Math.abs(+r.amount||0)*100)*(r?.kind==='payment'||r?.kind==='refund'?-1:1)})).filter(x=>x.c!==0),found=[];
      const dfs=(start,left,pick)=>{if(found.length>1)return;if(left===0){found.push([...pick]);return}if(pick.length>=4)return;for(let j=start;j<signed.length;j++){pick.push(signed[j].i);dfs(j+1,left-signed[j].c,pick);pick.pop();if(found.length>1)return}};
      dfs(0,need,[]);if(found.length===1&&found[0].length)for(const i of found[0])chosen.add(i);
    }
  }
  if(!chosen.size)return rows;
  const maxAdd=Math.max(0,physicalCount-rows.length);const add=[...chosen].sort((a,b)=>(pool[a]?.sourceStart??a)-(pool[b]?.sourceStart??b)).slice(0,maxAdd).map(i=>({...pool[i],parserStrategy:'teb-verified-missing-row-v79',physicalKey:`TEBV79|${pool[i]?.physicalKey||i}`}));
  if(!add.length)return rows;
  rows=[...rows,...add].sort((a,b)=>(a.sourceStart??Number.MAX_SAFE_INTEGER)-(b.sourceStart??Number.MAX_SAFE_INTEGER));
  return rows;
}

function stmtParseProfileLayoutEngine(text,cardId,profile){
  if(!['denizbank','teb','isbank'].includes(profile?.id))return[];
  const anchor=stmtAnchorInfo(text),rows=[],seen={},lines=String(text||'').replace(/\r/g,'\n').split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  for(let i=0;i<lines.length;i++){
    const line=lines[i],m=line.match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;const rest=m[2].trim(),u=rest.toLocaleUpperCase('tr-TR');
    if(profile.id==='isbank'&&/MAX[Iİ]PUAN\s*[Iİ]LAVE/.test(u))continue;
    if(stmtCarryForwardLike(rest)||(profile.id==='teb'&&stmtTebSummaryLike(rest)))continue;
    const amounts=stmtAmountCandidates(rest).sort((a,b)=>a.index-b.index),pick=stmtPickAmountForProfile(profile,rest,amounts);if(!pick)continue;
    const row=stmtMakeRow(cardId,di,rest,pick,i,profile.id,seen,true);if(!row)continue;
    row.sourceEnd=i;row.physicalKey=`PL|${i}|${row.semanticKey}`;row.parserStrategy='profile-layout';rows.push(row)
  }
  return rows
}
function stmtStrategyQuality(rows,text,profile,kind){
  const r=rows||[],raw=parseStatementSummary(text),sum=(k)=>r.filter(x=>x.kind===k).reduce((a,x)=>a+Math.abs(+x.amount||0),0);let score=r.length*3;
  const checks=[['spendingTotal','spend',60],['paymentsTotal','payment',35],['feesTotal','fee',30]];for(const [mk,rk,w] of checks){if(Number.isFinite(+raw?.[mk])){const diff=Math.abs((+raw[mk])-sum(rk));score+=Math.max(0,w-Math.min(w,diff*2))}}
  for(let i=1;i<r.length;i++)if(r[i-1].date>r[i].date)score-=8;score-=r.filter(x=>!stmtValidIsoDate(x.date)||!Number.isFinite(+x.amount)||Math.abs(+x.amount)<=0).length*25;if(profile.preferLine&&kind==='line')score+=10;return score
}


function stmtHalkbankPostProcess(text,cardId,rows,profile){
  let out=[...(rows||[])];if(profile?.id!=='halkbank')return out;
  const anchor=stmtAnchorInfo(text),rawText=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' '),lines=rawText.split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean),seen={};
  const addPayment=(di,src,sourceStart,strategy)=>{
    if(!di||!stmtPaymentLike(src))return;
    const amounts=stmtAmountCandidates(src).sort((a,b)=>a.index-b.index);if(!amounts.length)return;
    // Halkbank ödeme satırında önceki dönem borcu / ParafPara gibi başka sayılar aynı blokta bulunabilir.
    // Bu nedenle tutarı genel ilk-sayı kuralından değil, ödeme ifadesinden SONRAKİ ilk sıfır-olmayan parasal değerden seç.
    const up=String(src||'').toLocaleUpperCase('tr-TR');
    const km=up.match(/ÖDEME\s*-?\s*TEŞEKK|ODEME\s*-?\s*TESEKK|HESAPTAN\s+ÖDEME|HESAPTAN\s+ODEME|KART\s*ÖDEMESİ|KART\s*ODEMESI|BORÇ\s*ÖDEME|BORC\s*ODEME/);
    let pick=null;
    if(km){
      const kpos=km.index+km[0].length;
      const after=amounts.filter(a=>a.index>=kpos&&Number.isFinite(+a.value)&&Math.abs(+a.value)>.004);
      if(after.length)pick=after[0];
    }
    if(!pick){
      // Artı işaretli değer Halkbank'ta kart ödemesinin güçlü göstergesidir.
      const signed=amounts.find(a=>/\+/.test(String(a.raw||''))&&Number.isFinite(+a.value)&&Math.abs(+a.value)>.004);
      pick=signed||stmtPickAmountForProfile(profile,src,amounts);
    }
    if(!pick)return;
    const amount=Math.abs(+pick.value||0);if(!Number.isFinite(amount)||amount<=0)return;
    const exists=out.some(r=>r?.kind==='payment'&&r.date===di.date&&Math.abs(Math.abs(+r.amount||0)-amount)<.005);if(exists)return;
    // Devir/önceki dönem borcu aynı mantıksal blokta ödeme ile birleşmiş olabilir.
    // stmtMakeRow tüm bloğu devir bilgisi sanıp null döndürmesin diye yalnız ödeme kısmını kullan.
    let paymentSrc=String(src||'');
    const payStart=paymentSrc.toLocaleUpperCase('tr-TR').search(/HESAPTAN\s+[ÖO]DEME|[ÖO]DEME\s*-?\s*TE[ŞS]EKK|KART\s*[ÖO]DEMES[Iİ]|BOR[ÇC]\s*[ÖO]DEME/);
    if(payStart>=0)paymentSrc=paymentSrc.slice(payStart).trim();
    let row=stmtMakeRow(cardId,di,paymentSrc,pick,sourceStart,profile.id,seen,false);
    if(!row){
      // Son emniyet: Halkbank ödeme olduğu kesinleştiyse devir filtresini bypass ederek ödeme satırını doğrudan oluştur.
      const title='HESAPTAN ÖDEME';
      const baseFp=stmtFingerprint(cardId,di.date,title,-amount),semanticKey=`${baseFp}|payment|0/0/0.00`,occ=(seen[semanticKey]=(seen[semanticKey]||0)+1);
      row={date:di.date,title,amount,category:'Kart Ödemesi',baseFp,semanticKey,rawKey:String(paymentSrc).toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim(),physicalKey:sourceStart!=null?`LN|${sourceStart}|${semanticKey}`:null,sourceStart,sourceEnd:sourceStart,occurrence:occ,fp:`${semanticKey}|#${occ}`,checked:true,refund:false,payment:true,kind:'payment',installmentNo:null,installmentCount:null,installmentTotal:null,bankProfile:profile.id};
    }
    row.kind='payment';row.payment=true;row.refund=false;row.category='Kart Ödemesi';row.amount=amount;row.parserStrategy=strategy;out.push(row)
  };
  // Tarih aynı satırda ya da tek başına olabilir; sonraki fiziksel satırlar ödeme açıklamasının devamı sayılır.
  for(let i=0;i<lines.length;i++){
    const m=lines[i].match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))(?:\s+(.+))?$/);if(!m)continue;
    const di=stmtDateInfo(m[1],anchor);if(!di)continue;
    let parts=[];if(m[2])parts.push(m[2]);
    for(let j=i+1;j<Math.min(lines.length,i+6);j++){
      if(/^\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2})\b/.test(lines[j]))break;
      if(/TÜRKİYE\s+HALK\s+BANKASI|TURKIYE\s+HALK\s+BANKASI|MERSİS|MERSIS|PARAF\.COM\.TR/i.test(lines[j]))break;
      parts.push(lines[j]);
    }
    addPayment(di,parts.join(' ').replace(/\s+/g,' ').trim(),i,'halkbank-payment-line-rescue')
  }
  // PDF.js bazı Halkbank ekstrelerinde tarihi ve ödeme metnini ayrı bloklara koyar.
  // Her tarih işaretinden bir sonraki tarihe kadar olan bölümü ayrıca tara.
  const dateRx=/(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))/g,matches=[];let dm;
  while((dm=dateRx.exec(rawText))!==null)matches.push({raw:dm[1],index:dm.index,end:dateRx.lastIndex});
  for(let i=0;i<matches.length;i++){
    const cur=matches[i],next=matches[i+1],di=stmtDateInfo(cur.raw,anchor);if(!di)continue;
    const seg=rawText.slice(cur.end,next?next.index:Math.min(rawText.length,cur.end+600)).replace(/\s+/g,' ').trim();
    if(!seg)continue;
    addPayment(di,seg,100000+i,'halkbank-payment-segment-rescue')
  }
  // Son koruma: Halkbank'ın tablo satırı tek parça geldiyse, ödeme ifadesi ve tutarı doğrudan satırdan yakala.
  const flatPayRx=/(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+([^\n]{0,180}?(?:HESAPTAN\s+[ÖO]DEME|[ÖO]DEME\s*-?\s*TE[ŞS]EKK[^\n]{0,80}))\s+([+\-]?\s*(?:\d{1,3}(?:[.,]\d{3})*|\d+)(?:[.,]\d{2})\s*\+?)/giu;
  let pm;
  while((pm=flatPayRx.exec(rawText))!==null){
    const di=stmtDateInfo(pm[1],anchor);if(!di)continue;
    const val=stmtMoney(pm[3]);if(!Number.isFinite(val)||Math.abs(val)<=.004)continue;
    const pick={raw:pm[3],value:val,index:Math.max(0,pm[0].lastIndexOf(pm[3])),currency:'TL',score:2000};
    const exists=out.some(r=>r?.kind==='payment'&&r.date===di.date&&Math.abs(Math.abs(+r.amount||0)-Math.abs(val))<.005);
    if(exists)continue;
    let flatSrc=String(pm[0]||'');
    const flatStart=flatSrc.toLocaleUpperCase('tr-TR').search(/HESAPTAN\s+[ÖO]DEME|[ÖO]DEME\s*-?\s*TE[ŞS]EKK/);
    if(flatStart>=0)flatSrc=flatSrc.slice(flatStart).trim();
    let row=stmtMakeRow(cardId,di,flatSrc,pick,200000+pm.index,profile.id,seen,false);
    if(!row){
      const amount=Math.abs(val),title='HESAPTAN ÖDEME',baseFp=stmtFingerprint(cardId,di.date,title,-amount),semanticKey=`${baseFp}|payment|0/0/0.00`,occ=(seen[semanticKey]=(seen[semanticKey]||0)+1);
      row={date:di.date,title,amount,category:'Kart Ödemesi',baseFp,semanticKey,rawKey:String(flatSrc).toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim(),physicalKey:`LN|${200000+pm.index}|${semanticKey}`,sourceStart:200000+pm.index,sourceEnd:200000+pm.index,occurrence:occ,fp:`${semanticKey}|#${occ}`,checked:true,refund:false,payment:true,kind:'payment',installmentNo:null,installmentCount:null,installmentTotal:null,bankProfile:profile.id};
    }
    row.kind='payment';row.payment=true;row.refund=false;row.category='Kart Ödemesi';row.amount=Math.abs(val);row.parserStrategy='halkbank-payment-flat-rescue';out.push(row)
  }
  // V72: Halkbank carry-forward first-transaction rescue.
  // Some Paraf statements place the first real purchase in the same logical PDF block
  // immediately after "Bir Önceki Dönem Ekstre Borcu". Generic carry-forward filtering
  // can drop that first dated row. Recover only the first dated non-payment transaction
  // after the carry-forward marker and keep the carry-forward line itself excluded.
  try{
    const srcCarry=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ');
    const upCarry=srcCarry.toLocaleUpperCase('tr-TR');
    const carryMatch=upCarry.match(/B[İI]R\s+[ÖO]NCEK[İI]\s+D[ÖO]NEM(?:\s+\([^)]*\))?\s+EKSTRE\s+BORCU|[ÖO]NCEK[İI]\s+D[ÖO]NEM\s+EKSTRE\s+BORCU/);
    if(carryMatch){
      const start=(carryMatch.index||0)+carryMatch[0].length;
      const tail=srcCarry.slice(start,start+2600);
      const firstDate=tail.match(/(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))/);
      if(firstDate){
        const di=stmtDateInfo(firstDate[1],anchor);
        if(di){
          const segStart=(firstDate.index||0)+firstDate[0].length;
          const rest=tail.slice(segStart);
          const nextDate=rest.match(/\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2})/);
          let seg=rest.slice(0,nextDate?nextDate.index:Math.min(rest.length,700)).replace(/\s+/g,' ').trim();
          if(seg && !stmtPaymentLike(seg) && !stmtCarryForwardLike(seg)){
            const amounts=stmtAmountCandidates(seg).sort((a,b)=>a.index-b.index);
            // Halkbank row usually ends with transaction amount + ParafPara.
            // Prefer the largest non-zero monetary value to avoid picking 0.05 / 0.00 reward values.
            const valid=amounts.filter(a=>Number.isFinite(+a.value)&&Math.abs(+a.value)>.004);
            let pick=null;
            if(valid.length){
              pick=valid.reduce((best,a)=>!best||Math.abs(+a.value)>Math.abs(+best.value)?a:best,null);
            }
            if(pick){
              const amount=Math.abs(+pick.value||0);
              const exists=out.some(r=>r?.date===di.date&&r?.kind!=='payment'&&Math.abs(Math.abs(+r.amount||0)-amount)<.005);
              if(!exists){
                const rescueSeen={};
                let row=stmtMakeRow(cardId,di,seg,pick,400000+start+(firstDate.index||0),profile.id,rescueSeen,false);
                if(row){
                  row.parserStrategy='halkbank-carry-first-transaction-rescue';
                  row.sourceStart=400000+start+(firstDate.index||0);
                  row.sourceEnd=row.sourceStart;
                  out.push(row);
                }
              }
            }
          }
        }
      }
    }
  }catch(_e){}

  // V71: Halkbank summary-backed payment rescue.
  // Açıklama biçimi değişse bile banka özetindeki Dönemsel Alacak Kayıtları / ödeme toplamı
  // işlem tablosunda aynı tutarlı, tarihli ve ödeme yönlü (+ / ödeme / tahsilat / aktarım) hareketi doğrular.
  try{
    const sm=parseStatementSummary(text);
    const target=Number(sm?.paymentsTotal);
    const current=out.filter(r=>r?.kind==='payment').reduce((a,r)=>a+Math.abs(+r.amount||0),0);
    if(Number.isFinite(target)&&target>0&&Math.abs(current-target)>.02){
      const anchor2=stmtAnchorInfo(text),src2=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' ');
      const dr=/\b(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\b/g,ds=[];let z;
      while((z=dr.exec(src2))!==null)ds.push({raw:z[1],index:z.index,end:dr.lastIndex});
      for(let i=0;i<ds.length;i++){
        const d=ds[i],n=ds[i+1],di=stmtDateInfo(d.raw,anchor2);if(!di)continue;
        const seg=src2.slice(d.end,n?n.index:Math.min(src2.length,d.end+700)).replace(/\s+/g,' ').trim();
        if(!seg)continue;
        const am=stmtAmountCandidates(seg).filter(a=>Math.abs(Math.abs(+a.value||0)-target)<.02);if(!am.length)continue;
        const u=seg.toLocaleUpperCase('tr-TR');
        const payCue=stmtPaymentLike(seg)||/TAHS[İI]LAT|ALACAK|AKTARIM|BOR[ÇC].{0,20}[ÖO]DEME/.test(u)||am.some(a=>/\+/.test(String(a.raw||'')));
        if(!payCue)continue;
        const exists=out.some(r=>r?.kind==='payment'&&r.date===di.date&&Math.abs(Math.abs(+r.amount||0)-target)<.02);if(exists)break;
        const title='HESAPTAN ÖDEME',baseFp=stmtFingerprint(cardId,di.date,title,-target),semanticKey=`${baseFp}|payment|0/0/0.00`,occ=1;
        out.push({date:di.date,title,amount:target,category:'Kart Ödemesi',baseFp,semanticKey,rawKey:String(seg).toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim(),physicalKey:`SUM|${d.index}|${semanticKey}`,sourceStart:300000+d.index,sourceEnd:300000+d.index,occurrence:occ,fp:`${semanticKey}|#${occ}`,checked:true,refund:false,payment:true,kind:'payment',installmentNo:null,installmentCount:null,installmentTotal:null,bankProfile:profile.id,parserStrategy:'halkbank-summary-payment-rescue'});
        break;
      }
    }
  }catch(_e){}
  // V76: Halkbank footer guard daraltıldı.
  // Gerçek vergi/faiz satırlarının rawKey sonuna "Bir Sonraki..." metni yapışabilir.
  // Bu nedenle yalnızca görünen işlem başlığı gerçekten footer ile BAŞLIYORSA silinir.
  out=out.filter(r=>{
    if(!r||r.kind==='payment')return true;
    const title=String(r.title||'').toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim();
    const own=`${r.title||''} ${r.rawKey||''}`.toLocaleUpperCase('tr-TR').replace(/\s+/g,' ');
    const feeCue=/\b(KKDF|BSMV|BSMW)\b|FA[İI]Z|VERG[İI]|[ÜU]CRET|KOM[İI]SYON/.test(title);
    // V77: Banka özetindeki "Toplam Faiz, Ücret, Vergiler" gerçek hareket değildir.
    // Bu satır yalnız uzlaştırma toplamıdır; işlem listesine giremez.
    const feeSummary=/^TOPLAM\s+FA[İI]Z(?:\s*,?\s*[ÜU]CRET)?(?:\s*,?\s*VERG[İI]LER?)?\b/.test(title)
      ||/TOPLAM\s+FA[İI]Z.{0,40}(?:[ÜU]CRET|VERG[İI])/.test(own);
    if(feeSummary)return false;
    // Vergi/faiz/ücret işlemi ise footer metni rawKey'e yapışmış olsa da koru.
    if((r.kind==='fee'||r.category==='Vergi & Faiz'||feeCue)&&!/^\s*(B[İI]R\s+SONRAK[İI]|HESAP\s+KES[İI]M|SON\s+[ÖO]DEME)/.test(title))return true;
    const footerStart=/^(?:B[İI]R\s+SONRAK[İI](?:\s+HESAP\s+KES[İI]M|\s+SON\s+[ÖO]DEME)?|HESAP\s+KES[İI]M(?:\s+TAR[İI]H[İI])?|SON\s+[ÖO]DEME(?:\s+TAR[İI]H[İI])?|HESAP\s+BAK[İI]YES[İI]|D[ÖO]NEM\s+BORCU|GENEL\s+TOPLAM|ARA\s+TOPLAM|TOPLAM\b)/.test(title);
    const weekday=/\b(PAZARTES[İI]|SALI|[ÇC]AR[ŞS]AMBA|PER[ŞS]EMBE|CUMA|CUMARTES[İI]|PAZAR)\b/.test(own);
    // V78: Halkbank bazen footer tarihini işlem başlığına yalnızca "Hesap : Perşembe"
    // şeklinde taşır. Bu, sonraki hesap kesim özetidir ve gerçek hareket değildir.
    const compactAccountDay=/^HESAP\s*:\s*(?:PAZARTES[İI]|SALI|[ÇC]AR[ŞS]AMBA|PER[ŞS]EMBE|CUMA|CUMARTES[İI]|PAZAR)\b/.test(title);
    if(compactAccountDay)return false;
    if(footerStart&&(weekday||/^(?:B[İI]R\s+SONRAK[İI]|HESAP\s+KES[İI]M|SON\s+[ÖO]DEME|GENEL\s+TOPLAM|ARA\s+TOPLAM|TOPLAM\b)/.test(title)))return false;
    return true;
  });
  out.sort((a,b)=>(a.sourceStart??Number.MAX_SAFE_INTEGER)-(b.sourceStart??Number.MAX_SAFE_INTEGER));
  return out
}

function stmtZiraatPostProcess(text,cardId,rows,profile){
  let out=[...(rows||[])];
  const upper=v=>String(v||'').toLocaleUpperCase('tr-TR');
  const zFeeRx=/\bKKDF\b|\bBSMV\b|\bBSMW\b|TAKSİT(?:LENDİRME)?\s+FAİZ|TAKSIT(?:LENDIRME)?\s+FAIZ|PEŞİNE\s+TAKSİT\s+FAİZ|PESINE\s+TAKSIT\s+FAIZ|KREDİ\s+(?:KARTI\s+)?FAİZ|KREDI\s+(?:KARTI\s+)?FAIZ|GECİKME\s+FAİZ|GECIKME\s+FAIZ|ALIŞVERİŞ\s+FAİZ|ALISVERIS\s+FAIZ/;
  const zFeeLabel=(v)=>{
    const u=upper(v).replace(/\s+/g,' ');
    if(/TAKSİT(?:LENDİRME)?\s+FAİZ|TAKSIT(?:LENDIRME)?\s+FAIZ|PEŞİNE\s+TAKSİT\s+FAİZ|PESINE\s+TAKSIT\s+FAIZ/.test(u))return 'TAKSİT FAİZİ';
    if(/KREDİ\s+(?:KARTI\s+)?FAİZ|KREDI\s+(?:KARTI\s+)?FAIZ/.test(u))return 'KREDİ FAİZİ';
    if(/GECİKME\s+FAİZ|GECIKME\s+FAIZ/.test(u))return 'GECİKME FAİZİ';
    if(/ALIŞVERİŞ\s+FAİZ|ALISVERIS\s+FAIZ/.test(u))return 'ALIŞVERİŞ FAİZİ';
    if(/\bKKDF\b/.test(u))return 'KKDF';
    if(/\bBSMV\b|\bBSMW\b/.test(u))return 'BSMV';
    return '';
  };
  // Sınıflandırma ve görünen ad yalnızca ilgili hareketin kendi ham metninden belirlenir.
  for(const r of out){
    const own=upper(`${r?.title||''} ${r?.rawKey||''}`);
    if(r?.kind!=='payment'&&zFeeRx.test(own)){
      r.kind='fee';r.category='Vergi & Faiz';r.refund=false;r.payment=false;
      const label=zFeeLabel(own);if(label)r.title=label;
    }
  }
  // Aynı Ziraat faiz satırı parser katmanlarından iki kez geldiyse tekilleştir.
  // Böylece "Kredi faizi" + "Kredi faizi faizi" gibi yankılar oluşmaz.
  const feeSeen=new Set(),feeClean=[];
  for(const r of out){
    if(r?.kind==='fee'){
      const label=zFeeLabel(`${r.title||''} ${r.rawKey||''}`)||upper(r.title||'').replace(/\bFAİZİ?\s+FAİZİ?\b/g,'FAİZİ').trim();
      if(label)r.title=label;
      const key=`${r.date}|${Math.abs(+r.amount||0).toFixed(2)}|${label}`;
      if(label&&feeSeen.has(key))continue;
      if(label)feeSeen.add(key);
    }
    feeClean.push(r)
  }
  out=feeClean;
  // PDF.js/OCR aynı vergi satırını aynen iki kez üretirse yalnızca parser yankısını temizle.
  // Aynı tarih+tutar fakat farklı ham satırlar gerçek iki hareket olabilir; onlara dokunma.
  const seen=new Map(),dedup=[];
  for(const r of out){
    const own=upper(`${r?.title||''} ${r?.rawKey||''}`),isTax=/\b(?:BSMV|BSMW|KKDF)\b/.test(own);
    if(r?.kind==='fee'&&isTax){
      const rawNorm=upper(r.rawKey||'').replace(/\s+/g,' ').trim();
      if(rawNorm){
        const key=`${r.date}|${Math.abs(+r.amount||0).toFixed(2)}|${rawNorm}`;
        if(seen.has(key))continue;
        seen.set(key,true);
      }
    }
    dedup.push(r)
  }
  out=dedup;
  // Seçilen parser taksit faizi satırını kaçırdıysa, yalnızca açıkça tarih+taksit faizi+tutar içeren
  // Ziraat bloğundan eksik kaydı tamamla. Başlık/özet metninden kayıt üretme.
  // Ana parser gerçek bir Taksit Faizi kaydı bulduysa kurtarma katmanı hiç çalışmaz.
  // Bu, aynı günkü Kredi Faizi tutarının yanlışlıkla ikinci bir Taksit Faizi olarak eklenmesini engeller.
  const hasInstallmentInterest=out.some(x=>x?.kind==='fee'&&/(?:TAKSİT|TAKSIT).*(?:FAİZ|FAIZ)/.test(upper(`${x.title||''} ${x.rawKey||''}`)));
  if(!hasInstallmentInterest){
    const anchor=stmtAnchorInfo(text),blocks=stmtLogicalBlocks(text,anchor),occSeen={};
    for(const b of blocks){
      const src=String((b.lines||[]).join(' ')),u=upper(src);
      if(!/(?:TAKSİT(?:LENDİRME)?\s+FAİZ|TAKSIT(?:LENDIRME)?\s+FAIZ|PEŞİNE\s+TAKSİT\s+FAİZ|PESINE\s+TAKSIT\s+FAIZ)/.test(u))continue;
      const amounts=stmtAmountCandidates(src),pick=stmtPickAmountForProfile(profile,src,amounts);if(!pick)continue;
      const di={date:b.date};if(!stmtValidIsoDate(di.date))continue;
      const row=stmtMakeRow(cardId,di,src,pick,b.sourceStart,profile.id,occSeen,false);if(!row)continue;
      row.kind='fee';row.category='Vergi & Faiz';row.refund=false;row.payment=false;row.title='TAKSİT FAİZİ';row.parserStrategy='ziraat-fee-supplement';
      // Kurtarma kaydı, başka bir faiz türünün aynı tarih+tutarını kopyalayamaz.
      const conflictsOtherFee=out.some(x=>x?.kind==='fee'&&x.date===row.date&&Math.abs(Math.abs(+x.amount||0)-Math.abs(+row.amount||0))<.005&&!/(?:TAKSİT|TAKSIT).*(?:FAİZ|FAIZ)/.test(upper(`${x.title||''} ${x.rawKey||''}`)));
      if(!conflictsOtherFee)out.push(row)
      break;
    }
  }
  out.sort((a,b)=>(a.sourceStart??Number.MAX_SAFE_INTEGER)-(b.sourceStart??Number.MAX_SAFE_INTEGER));
  return out
}
function parseStatementText(text,cardId){
  const profile=stmtBankProfile(text,cardId),line=stmtParseLineEngine(text,cardId,profile),block=stmtParseBlockEngine(text,cardId,profile),profileRows=stmtParseProfileLayoutEngine(text,cardId,profile),ziraatRows=stmtParseZiraatFixedEngine(text,cardId,profile),denizRows=stmtParseDenizBankFixedEngine(text,cardId,profile),halkCoordRows=stmtParseHalkbankCoordinateEngine(text,cardId,profile),halkRows=stmtParseHalkbankFixedEngine(text,cardId,profile),tebPhysicalRows=stmtParseTebPhysicalEngine(text,cardId,profile),tebRows=stmtParseTebFixedEngine(text,cardId,profile),tebSegRows=stmtParseTebSegmentEngine(text,cardId,profile),ls=stmtStrategyQuality(line,text,profile,'line'),bs=stmtStrategyQuality(block,text,profile,'block'),ps=stmtStrategyQuality(profileRows,text,profile,'profile'),hs=stmtStrategyQuality(halkRows,text,profile,'halk-fixed');
  let rows=line,strategy='common-line',best=ls;if(bs>best){rows=block;strategy='common-block';best=bs}if(ps>best){rows=profileRows;strategy='profile-layout';best=ps}
  // Ziraat'ta gerçek tablo satırları nihai kaynaktır: tekrar eden aynı tutarlı işlemler korunur, taksit/Bankkart Lira kolonları ayrılır.
  if(profile.id==='ziraat'&&ziraatRows.length>=1){rows=ziraatRows;strategy='ziraat-fixed-table-row'}
  // DenizBank'ta fiyat yalnızca en sağdaki İşlem Tutarı sütunundan alınır; Bonus/Kalan Borç sütunları yok sayılır.
  else if(profile.id==='denizbank'&&denizRows.length>=3){rows=denizRows;strategy='deniz-fixed-right-column'}
  else if(profile.id==='halkbank'&&halkCoordRows.length>=1){rows=halkCoordRows;strategy='halkbank-coordinate-final'}
  else if(profile.id==='halkbank'&&halkRows.length>=3&&(halkRows.length>rows.length||hs>=best-2)){rows=halkRows;strategy='halkbank-fixed-row';best=hs}
  else if(profile.id==='teb'){
    const pick=stmtChooseTebRows(text,[
      {rows:tebRows,strategy:'teb-fixed-final-tl'},
      {rows:tebSegRows,strategy:'teb-date-segment-v78'},
      {rows:tebPhysicalRows,strategy:'teb-physical-row-fallback'},
      {rows:profileRows,strategy:'profile-layout'},
      {rows:line,strategy:'common-line'},
      {rows:block,strategy:'common-block'}
    ]);
    if(pick&&pick.rows.length){rows=pick.rows;strategy=pick.strategy}
    rows=stmtTebCompleteMissingRows(text,rows,tebPhysicalRows);
    if(rows.some(r=>r?.parserStrategy==='teb-verified-missing-row-v79'))strategy+=' + teb-verified-missing-row-v79';
    // V80 — TEB fiziksel mutabakat kurtarması.
    // Bazı SADE PDF'lerinde iki gerçek satır metin kolon sırası yüzünden normal/segment parserdan düşüyor.
    // Fiziksel motoru körlemesine seçmek V76'da +1 sahte satır üretmişti. Bu nedenle yalnız:
    // 1) fiziksel motorun temiz satır sayısı bağımsız fiziksel audit ile BİREBİR aynıysa,
    // 2) seçili parser gerçekten eksik satır bırakmışsa
    // fiziksel tablo nihai satır kaynağı olur. Böylece 46/44 -> 46/46 tamamlanır;
    // 41/42 gibi V76 regresyonu bu kapıdan geçemez. Diğer banka profilleri etkilenmez.
    const tebLocalAuditCount=stmtPhysicalRowAudit(text,'teb').count||0;
    const tebReadAuditCount=(statementReadDiagnostics?.bankId==='teb'?+statementReadDiagnostics?.physicalRowCount:0)||0;
    const tebAuditCount=Math.max(tebLocalAuditCount,tebReadAuditCount);
    const tebPhysicalClean=stmtTebPostProcess(tebPhysicalRows||[]);
    if(tebAuditCount>0&&rows.length<tebAuditCount&&tebPhysicalClean.length===tebAuditCount){
      rows=tebPhysicalClean.map(r=>({...r,parserStrategy:'teb-physical-consensus-v80'}));
      strategy='teb-physical-consensus-v80';
    }
  }
  else if(profile.id==='isbank'&&profileRows.length>=3){rows=profileRows;strategy='profile-layout'}
  if(profile.id==='teb')rows=stmtTebPostProcess(rows);
  if(profile.id==='halkbank'){
    const coordFinal=String(text||'').includes('__HANE_HALKBANK_TABLE_ENGINE__')&&strategy==='halkbank-coordinate-final';
    // Koordinat motoru fiziksel tablonun kendisidir. Eski rescue/footer yamalarını yeniden çalıştırmak
    // temiz satırları bozabiliyordu. Legacy post-process yalnız koordinat motoru yoksa fallback olarak kalır.
    if(!coordFinal)rows=stmtHalkbankPostProcess(text,cardId,rows,profile);
  }
  if(profile.id==='ziraat')rows=stmtZiraatPostProcess(text,cardId,rows,profile);
  rows.forEach(r=>{r.bankProfile=profile.id;if(!r.parserStrategy)r.parserStrategy=strategy});return rows
}

function stmtParseLooseMoney(v){return stmtMoney(v)}
function parseStatementSummary(text){
  const src=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' '),flat=src.replace(/\s+/g,' '),lines=src.split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  const profile=stmtBankProfile(text);
  if(profile.summary){
    const mv='[+-]?(?:(?:\\d{1,3}(?:[.,]\\d{3})+)(?:[.,]\\d{2})?|\\d+(?:[.,]\\d{2}))';
    const grab=rx=>{const src=rx.source.replace('{M}',mv),m=flat.match(new RegExp(src,rx.flags||'i'));return m?stmtMoney(m[1]):null};
    const previousBalance=grab(profile.summary.previousBalance),spendingTotal=grab(profile.summary.spendingTotal),feesTotal=grab(profile.summary.feesTotal),paymentsTotal=grab(profile.summary.paymentsTotal),periodDebt=grab(profile.summary.periodDebt);
    if([previousBalance,spendingTotal,feesTotal,paymentsTotal,periodDebt].some(Number.isFinite))return{previousBalance,spendingTotal,feesTotal,paymentsTotal,periodDebt}
  }
  const moneyRe=/(-?\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})|-?\d+(?:[.,]\d{2}))\s*(?:TL|TRY|₺)?/gi;
  const values=line=>[...String(line||'').matchAll(moneyRe)].map(m=>stmtParseLooseMoney(m[1])).filter(v=>Number.isFinite(v));
  const find=(rx)=>{for(const line of lines){rx.lastIndex=0;if(!rx.test(line))continue;rx.lastIndex=0;const vals=values(line);if(vals.length)return vals.at(-1)}return null};
  // Bazı banka PDF'leri özet kutularını metin katmanında farklı sırada düzleştirir.
  // Bu ilk okuma sadece aday üretir; aşağıdaki normalizeStatementSummary fonksiyonu
  // işlem satırları + muhasebe eşitliği ile adayları yeniden doğrular.
  const near=(labelRx)=>{const m=flat.match(labelRx);if(!m)return null;const tail=flat.slice((m.index||0)+m[0].length,(m.index||0)+m[0].length+90),vals=values(tail);return vals.length?vals[0]:null};
  const previousBalance=near(/(?:DEVREDEN\s+BAK[İI]YE|[ÖO]NCEK[İI]\s+AYDAN\s+DEV[İI]R)/i)??find(/(?:DEVREDEN\s+BAK[İI]YE|[ÖO]NCEK[İI]\s+AYDAN\s+DEV[İI]R)/i);
  const spendingTotal=near(/(?:HARCAMALAR(?:INIZ)?|TOPLAM\s+HARCAMA|HARCAMALAR\s+TOPLAMI|D[ÖO]NEM\s+[İI]Ç[İI]\s+HARCAMA|D[ÖO]NEM\s+HARCAMALARI)/i)??find(/(?:HARCAMALAR(?:INIZ)?|TOPLAM\s+HARCAMA|HARCAMALAR\s+TOPLAMI|D[ÖO]NEM\s+[İI]Ç[İI]\s+HARCAMA|D[ÖO]NEM\s+HARCAMALARI)/i);
  const feesTotal=near(/(?:FA[İI]Z\s*[ÜU]CRETLER\s*VE\s*KES[İI]NT[İI]LER|FA[İI]Z\s*VE\s*[ÜU]CRETLER|[ÜU]CRET\s*VE\s*KES[İI]NT[İI]LER)/i)??find(/(?:FA[İI]Z\s*[ÜU]CRETLER\s*VE\s*KES[İI]NT[İI]LER|FA[İI]Z\s*VE\s*[ÜU]CRETLER|[ÜU]CRET\s*VE\s*KES[İI]NT[İI]LER)/i);
  const paymentsTotal=near(/(?:[ÖO]DEMELER[İI]N[İI]Z|[ÖO]DEMELER\s+TOPLAMI)/i)??find(/(?:[ÖO]DEMELER[İI]N[İI]Z|[ÖO]DEMELER\s+TOPLAMI)/i);
  const periodDebt=near(/(?:D[ÖO]NEM\s+BORCU|HESAP\s+[ÖO]ZET[İI]\s+BORCU|EKSTRE\s+BORCU|TOPLAM\s+BOR[ÇC])/i)??find(/(?:D[ÖO]NEM\s+BORCU|HESAP\s+[ÖO]ZET[İI]\s+BORCU|EKSTRE\s+BORCU|TOPLAM\s+BOR[ÇC])/i);
  return{previousBalance,spendingTotal,feesTotal,paymentsTotal,periodDebt}
}
// V73 — Ziraat / Bankkart özet tablosu etiketli sütun okuyucu.
// Ziraat'ın alt özet tablosunda PDF metin sırası sütun başlıklarını önce, TL/USD değerlerini sonra verir.
// Genel "etiketten sonraki ilk sayı" yöntemi bu nedenle Devreden Bakiye'yi Harcama,
// %3,25 faiz oranını da 3,25 TL faiz/ücret sanabiliyordu. Yalnız gerçek özet başlık bloğundan
// sonra gelen TL değerlerini sırayla okur; yüzde oranları ve USD değerleri bu motora giremez.
function stmtParseZiraatLabeledSummary(text){
  const src=String(text||'').replace(/\r/g,'\n').replace(/\u00a0/g,' '),flat=src.replace(/\s+/g,' ');
  // Türkçe büyük/küçük I/İ farkını tamamen kaldır; karakter sayısı korunur, bu yüzden bulunan indeks flat üzerinde de geçerlidir.
  const norm=flat.toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C');
  const head=/DEVREDEN\s+BAKIYE\s+HARCAMALAR(?:INIZ)?\s+(?:FAIZ\s+UCRETLER\s+VE\s+KESINTILER|FAIZ\s+VE\s+UCRETLER)\s+ODEMELER(?:INIZ)?\s+DONEM\s+BORCU/;
  const m=head.exec(norm);if(!m)return null;
  let tail=flat.slice(m.index+m[0].length,m.index+m[0].length+650),tailNorm=norm.slice(m.index+m[0].length,m.index+m[0].length+650);
  const stop=tailNorm.search(/(?:DOGUM\s+GUNUNUZ|BUYUK\s+MUKELLEFLER|EKSTRE\s+ILE\s+ILGILI)/);if(stop>=0)tail=tail.slice(0,stop);
  const vals=[...tail.matchAll(/([+-]?(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2})\s*TL\b/gi)].map(x=>stmtParseLooseMoney(x[1])).filter(Number.isFinite);
  if(vals.length<5)return null;
  const out={previousBalance:vals[0],spendingTotal:vals[1],feesTotal:vals[2],paymentsTotal:Math.abs(vals[3]),periodDebt:vals[4]};
  if(Object.values(out).some(v=>!Number.isFinite(v)||Math.abs(v)>=1e9))return null;
  return out
}

function stmtAllMoneyValues(text){
  const re=/(-?\d{1,3}(?:[.\s]\d{3})*(?:,\d{2})|-?\d+(?:[.,]\d{2}))\s*(?:TL|TRY|₺)?/gi;
  return [...String(text||'').matchAll(re)].map(m=>stmtParseLooseMoney(m[1])).filter(v=>Number.isFinite(v)&&Math.abs(v)<1e9)
}
// V75 — TEB / SADE etiketli özet okuyucu.
// TEB'de işlem tablosundaki "Önceki Dönemden Devir Edilen Tutar" bir hareket değildir;
// "BU KARTINIZLA YAPILAN İŞLEM TOPLAMLARI" ise gerçek harcama toplamıdır.
// Faiz oranı yüzdeleri asla faiz/ücret tutarı olarak kullanılmaz.
function stmtParseTebLabeledSummary(text){
  const flat=String(text||'').replace(/\r/g,' ').replace(/\n/g,' ').replace(/\u00a0/g,' ').replace(/\s+/g,' ');
  const money='([+-]?(?:(?:\\d{1,3}(?:[.]\\d{3})+|\\d+)(?:,\\d{2}|,-)))';
  const grab=(rx)=>{const m=flat.match(rx);return m?stmtMoney(m[1]):null};
  const previousBalance=grab(new RegExp('[ÖO]NCEK[İI]\\s+D[ÖO]NEMDEN\\s+DEV[İI]R\\s+ED[İI]LEN\\s+TUTAR[^0-9+-]*(?:TL\\.?)?\\s*'+money,'i'));
  // V76: TEB işlem tablosunun en güvenilir toplamı "GENEL TOPLAM" satırıdır.
  // PDF.js bazı dosyalarda son hareketin TL tutarını "BU KARTINIZLA..." etiketinin hemen arkasına
  // taşıdığı için eski regex son hareketi (örn. 115 TL) banka toplamı sanabiliyordu.
  const generalTotal=grab(new RegExp('GENEL\\s+TOPLAM[^0-9+-]{0,80}(?:TL\\.?)?\\s*'+money,'i'));
  const cardTotal=grab(new RegExp('BU\\s+KARTINIZLA\\s+YAPILAN\\s+[İI][ŞS]LEM\\s+TOPLAMLARI[^0-9+-]{0,120}(?:TL\\.?)?\\s*'+money,'i'));
  const spendingTotal=Number.isFinite(generalTotal)?generalTotal:cardTotal;
  const periodDebt=grab(new RegExp('D[ÖO]NEM\\s+BORCU[^0-9+-]*(?:TL\\.?)?\\s*'+money,'i'));
  // Yalnız açıkça tutar etiketi olan faiz/ücret alanı kabul edilir. "faiz oranı %4,25" vb. reddedilir.
  const feesTotal=grab(new RegExp('(?:TOPLAM\\s+FA[İI]Z\\s+VE\\s+[ÜU]CRETLER|FA[İI]Z\\s*/?\\s*[ÜU]CRET\\s+TOPLAMI)[^%0-9+-]*(?:TL\\.?)?\\s*'+money,'i'));
  const out={previousBalance,spendingTotal,feesTotal,periodDebt};
  return Object.values(out).some(Number.isFinite)?out:null;
}

function normalizeStatementSummary(text,rows,raw){
  const meta={...(raw||{})},round2=n=>Math.round((+n||0)*100)/100,finite=n=>Number.isFinite(+n);
  const detectedBank=stmtDetectBank(text,statementImportCardId||'');
  meta.bankProfileId=detectedBank?.id||'generic';
  const pays=(rows||[]).filter(r=>r?.kind==='payment').reduce((a,r)=>a+Math.abs(+r.amount||0),0);
  const paymentCount=(rows||[]).filter(r=>r?.kind==='payment').length;
  const parsedFees=round2((rows||[]).filter(r=>r?.kind==='fee').reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const parsedSpend=round2((rows||[]).filter(r=>r?.kind==='spend').reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const parsedRefunds=round2((rows||[]).filter(r=>r?.kind==='refund').reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const feeCount=(rows||[]).filter(r=>r?.kind==='fee').length;
  let repaired=false;
  // S17 FIX2 — İş Bankası: matematik farkından faiz/ücret ÜRETME.
  // İş Bankası Maximum ekstrelerinde ayrı bir faiz/ücret işlem satırı yoksa,
  // gerçek POS harcamalarının bir kombinasyonu banka özeti farkını açıklıyor diye
  // bu tutar faiz sayılmaz. İşlem tablosu sınıflandırması esas alınır.
  if(detectedBank?.id==='isbank'){
    const explicitFeeRows=(rows||[]).filter(r=>r?.kind==='fee');
    if(explicitFeeRows.length===0){
      if(!finite(meta.feesTotal)||Math.abs(+meta.feesTotal)>.01)repaired=true;
      meta.feesTotal=0;
      meta.isbankNoExplicitFeeRows=true;
      if(parsedSpend>0&&(!finite(meta.spendingTotal)||Math.abs(+meta.spendingTotal-parsedSpend)>.01))repaired=true;
      if(parsedSpend>0)meta.spendingTotal=parsedSpend;
      if(pays>0){if(!finite(meta.paymentsTotal)||Math.abs(+meta.paymentsTotal-pays)>.01)repaired=true;meta.paymentsTotal=round2(pays)}
      if(finite(meta.previousBalance)&&finite(meta.periodDebt)&&finite(meta.paymentsTotal)){
        const expectedSpend=round2((+meta.periodDebt)-(+meta.previousBalance)+(+meta.paymentsTotal)+parsedRefunds);
        meta.isbankRowEquationOk=Math.abs(expectedSpend-parsedSpend)<.02;
      }
      meta.summaryRepaired=repaired;
      meta.summaryEquationOk=finite(meta.previousBalance)&&finite(meta.spendingTotal)&&finite(meta.paymentsTotal)&&finite(meta.periodDebt)
        ?Math.abs((+meta.previousBalance)+(+meta.spendingTotal)-(+meta.paymentsTotal)-parsedRefunds-(+meta.periodDebt))<.02:false;
      // Burada dön: aşağıdaki genel "spendPlusFees" aday araması İş Bankası için
      // yeniden sahte faiz/ücret türetemez.
      return meta;
    }
  }
  // V75 — TEB tamamen banka-bazlı ve izole doğrulanır. Ziraat/Halkbank/DenizBank kurallarına dokunmaz.
  if(detectedBank?.id==='teb'){
    const tsum=stmtParseTebLabeledSummary(text);
    if(tsum){
      for(const k of ['previousBalance','spendingTotal','feesTotal','periodDebt']){
        if(Number.isFinite(tsum[k])){if(!finite(meta[k])||Math.abs(+meta[k]-tsum[k])>.01)repaired=true;meta[k]=round2(tsum[k])}
      }
      meta.tebLabeledSummary=true;
    }
    // Ödeme yalnız gerçek "CEPTETEB ÖDEME TEŞEKKÜR EDERİZ" vb. işlem satırlarından gelir.
    if(paymentCount&&pays>0){if(!finite(meta.paymentsTotal)||Math.abs(+meta.paymentsTotal-pays)>.01)repaired=true;meta.paymentsTotal=round2(pays)}
    else if(!finite(meta.paymentsTotal))meta.paymentsTotal=0;
    // Açık faiz/ücret hareketi yoksa oran metinlerinden ücret üretme.
    if(parsedFees>0){if(!finite(meta.feesTotal)||Math.abs(+meta.feesTotal-parsedFees)>.01)repaired=true;meta.feesTotal=parsedFees}
    else if(!finite(meta.feesTotal))meta.feesTotal=0;
    meta.summaryRepaired=repaired;
    meta.tebSpendRowsMatch=finite(meta.spendingTotal)&&Math.abs((+meta.spendingTotal)-parsedSpend)<.02;
    meta.tebPaymentRowsMatch=Math.abs((+meta.paymentsTotal||0)-pays)<.02;
    meta.tebFeeRowsMatch=Math.abs((+meta.feesTotal||0)-parsedFees)<.02;
    meta.summaryEquationOk=finite(meta.previousBalance)&&finite(meta.spendingTotal)&&finite(meta.feesTotal)&&finite(meta.paymentsTotal)&&finite(meta.periodDebt)
      ?Math.abs((+meta.previousBalance)+(+meta.spendingTotal)+(+meta.feesTotal)-(+meta.paymentsTotal)-parsedRefunds-(+meta.periodDebt))<.02:false;
    meta.tebExplicitSummary=true;
    if(meta.tebSpendRowsMatch&&meta.tebPaymentRowsMatch&&meta.tebFeeRowsMatch&&(meta.summaryEquationOk||!finite(meta.periodDebt)))meta.summaryTrusted=true;
    return meta;
  }
  // V70 — Ziraat/Bankkart: PDF özetindeki "harcama" hücresi bazı şablonlarda
  // faiz/ücret dahil toplam veya yanlış komşu hücre olarak düzleşebiliyor. Etiketli toplamı
  // körlemesine parser harcamasıyla karşılaştırma. Önce gerçek işlem satırları + dönem borcu
  // muhasebe eşitliğiyle doğrula; yalnız bağımsız denklem tutuyorsa özet harcamayı onar.
  if(detectedBank?.id==='ziraat'){
    // V73: Önce Ziraat'ın gerçek 5 sütunlu alt özet tablosunu oku. Bulunursa genel
    // yakın-sayı tahminlerini tamamen geçersiz kılar: Devreden/Harcama/Faiz-Ücret/Ödeme/Dönem Borcu.
    const zsum=stmtParseZiraatLabeledSummary(text);
    if(zsum){
      for(const k of ['previousBalance','spendingTotal','feesTotal','paymentsTotal','periodDebt']){
        if(!finite(meta[k])||Math.abs(+meta[k]-zsum[k])>.01)repaired=true;meta[k]=zsum[k]
      }
      meta.ziraatLabeledSummary=true;
    }
    if(paymentCount&&pays>0){if(!finite(meta.paymentsTotal)||Math.abs(+meta.paymentsTotal-pays)>.01)repaired=true;meta.paymentsTotal=round2(pays)}
    if(parsedFees>0&&(!finite(meta.feesTotal)||Math.abs(+meta.feesTotal-parsedFees)>.01)){meta.feesTotal=parsedFees;repaired=true}
    if(!finite(meta.feesTotal))meta.feesTotal=parsedFees||0;
    const prev=finite(meta.previousBalance)?+meta.previousBalance:null,debt=finite(meta.periodDebt)?+meta.periodDebt:null,pay=finite(meta.paymentsTotal)?+meta.paymentsTotal:round2(pays),fees=finite(meta.feesTotal)?+meta.feesTotal:parsedFees;
    const rowDebt=(prev!==null&&debt!==null)?round2(prev+parsedSpend+fees-pay-parsedRefunds):null;
    const rowEqOk=rowDebt!==null&&Math.abs(rowDebt-debt)<.02;
    const labeled=finite(meta.spendingTotal)?round2(+meta.spendingTotal):null;
    // Bazı Bankkart özetlerinde "harcama" toplamı faiz/ücreti de kapsar.
    const labelIsSpendPlusFee=labeled!==null&&Math.abs(labeled-round2(parsedSpend+fees))<.02&&fees>0;
    if(labelIsSpendPlusFee){meta.ziraatSummaryIncludesFees=true;meta.spendingTotal=parsedSpend;repaired=true}
    // Etiketli hücre yanlış olsa bile işlem satırları bağımsız dönem borcu denklemine tam oturuyorsa
    // gerçek harcama toplamı satırların toplamıdır. Bu kural eksik satırı gizlemez: denklem tutmuyorsa onarım yapılmaz.
    else if(rowEqOk&&parsedSpend>=0&&(labeled===null||Math.abs(labeled-parsedSpend)>.01)){
      meta.ziraatOriginalSpendingTotal=labeled;meta.spendingTotal=parsedSpend;meta.ziraatSpendFromVerifiedRows=true;repaired=true;
    }
    meta.summaryRepaired=repaired;
    meta.ziraatRowEquationTotal=rowDebt;
    meta.ziraatRowEquationOk=rowEqOk;
    meta.summaryEquationOk=finite(meta.previousBalance)&&finite(meta.spendingTotal)&&finite(meta.feesTotal)&&finite(meta.paymentsTotal)&&finite(meta.periodDebt)
      ?Math.abs((+meta.previousBalance)+(+meta.spendingTotal)+(+meta.feesTotal)-(+meta.paymentsTotal)-parsedRefunds-(+meta.periodDebt))<.02:false;
    // Ziraat'ta özet onarımı ancak satır denklemi de doğrulanmışsa güvenilir kabul edilir.
    if(rowEqOk)meta.summaryTrusted=true;
    return meta;
  }
  // V87: Halkbank/Paraf özetini banka etiketlerinden doğrudan oku.
  // Regex literal kullanılır; JS string içindeki \\s kaçışlarının bozulmasına izin verilmez.
  if(detectedBank?.id==='halkbank'){
    const flat=String(text||'').replace(/\s+/g,' ');
    const money='([+-]?(?:(?:\\d{1,3}(?:[.,]\\d{3})+)(?:[.,]\\d{2})?|\\d+(?:[.,]\\d{2})))';
    const grab=(re)=>{const m=flat.match(re);return m?stmtMoney(m[1]):null};
    const hbPrev=grab(/Bir\s+Önceki\s+Dönem(?:\s+Ekstre)?\s+Borcu\s*[:\-]?\s*([+-]?(?:(?:\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?|\d+(?:[.,]\d{2})))/i);
    const hbSpend=grab(/Dönem\s+İçi\s+Borç\s+Tutarı\s*[:\-]?\s*([+-]?(?:(?:\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?|\d+(?:[.,]\d{2})))/i);
    const hbFees=grab(/Toplam\s+Faiz\s*,?\s*Ücret\s*,?\s*Vergiler\s*[:\-]?\s*([+-]?(?:(?:\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?|\d+(?:[.,]\d{2})))/i);
    const hbPay=grab(/Dönemsel\s+Alacak\s+Kayıtları\s*[:\-]?\s*([+-]?(?:(?:\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?|\d+(?:[.,]\d{2})))/i);
    const hbDebt=grab(/Hesap\s+Bakiyesi\s*[:\-]?\s*([+-]?(?:(?:\d{1,3}(?:[.,]\d{3})+)(?:[.,]\d{2})?|\d+(?:[.,]\d{2})))/i);
    if(finite(hbPrev))meta.previousBalance=round2(hbPrev);
    if(finite(hbSpend))meta.spendingTotal=round2(hbSpend);
    if(finite(hbFees))meta.feesTotal=round2(hbFees);
    if(finite(hbPay))meta.paymentsTotal=round2(Math.abs(hbPay));
    if(finite(hbDebt))meta.periodDebt=round2(hbDebt);

    // V92: Halkbank PDF'lerinde bazı özet hücreleri PDF.js tarafından 0,00 gibi yanlış eşleşebiliyor.
    // Gerçek işlem satırları pozitif toplam veriyorsa, bu sahte sıfırlar banka özeti kabul edilmez.
    // İşlem tablosu + dönem borcu birlikte kullanılarak eksik özet alanları güvenli biçimde tamamlanır.
    if(parsedSpend>0&&(!finite(meta.spendingTotal)||+meta.spendingTotal===0)){meta.spendingTotal=parsedSpend;repaired=true;meta.halkbankSpendFromRows=true}
    if(parsedFees>0&&(!finite(meta.feesTotal)||+meta.feesTotal===0)){meta.feesTotal=parsedFees;repaired=true;meta.halkbankFeesFromRows=true}
    if(pays>0&&(!finite(meta.paymentsTotal)||+meta.paymentsTotal===0)){meta.paymentsTotal=round2(pays);repaired=true;meta.halkbankPaymentsFromRows=true}
    if(finite(meta.periodDebt)&&finite(meta.spendingTotal)&&finite(meta.feesTotal)&&finite(meta.paymentsTotal)){
      const impliedPrev=round2((+meta.periodDebt)-(+meta.spendingTotal)-(+meta.feesTotal)+(+meta.paymentsTotal)+parsedRefunds);
      if(impliedPrev>=0&&(!finite(meta.previousBalance)||(+meta.previousBalance===0&&impliedPrev>0))){
        meta.previousBalance=impliedPrev;repaired=true;meta.halkbankPreviousFromEquation=true;
      }
    }
    if([meta.previousBalance,meta.spendingTotal,meta.feesTotal,meta.paymentsTotal,meta.periodDebt].every(finite)){
      meta.summaryRepaired=repaired;
      meta.summaryEquationOk=Math.abs((+meta.previousBalance)+(+meta.spendingTotal)+(+meta.feesTotal)-(+meta.paymentsTotal)-parsedRefunds-(+meta.periodDebt))<.02;
      meta.halkbankExplicitSummary=true;
      return meta;
    }
  }
  if(feeCount&&parsedFees>0&&(!finite(meta.feesTotal)||Math.abs(+meta.feesTotal-parsedFees)>.01)){meta.feesTotal=parsedFees;repaired=true}
  // İşlem tablosundaki ödeme satırları, özet kutusunun PDF metin sırasından daha güvenilir.
  if(paymentCount&&pays>0){if(!finite(meta.paymentsTotal)||Math.abs(+meta.paymentsTotal-pays)>.01)repaired=true;meta.paymentsTotal=round2(pays)}
  const prev=finite(meta.previousBalance)?+meta.previousBalance:null,debt=finite(meta.periodDebt)?+meta.periodDebt:null,payment=finite(meta.paymentsTotal)?+meta.paymentsTotal:null;
  if(prev!=null&&debt!=null&&payment!=null){
    const spendPlusFees=round2(debt-prev+payment);
    if(spendPlusFees>=0){
      // Muhasebe eşitliği: Devreden + Harcamalar + Faiz/Ücret - Ödemeler = Dönem Borcu.
      // PDF'deki tüm parasal adaylar arasından Harcamalar+Ücret toplamına en yakın büyük değeri seç.
      const all=stmtAllMoneyValues(text).filter(v=>v>=0);
      const excluded=[prev,debt,payment];
      const candidates=all.filter(v=>v>=Math.max(1,spendPlusFees*.45)&&v<=spendPlusFees+.01&&!excluded.some(x=>Math.abs(v-x)<.01));
      candidates.sort((a,b)=>Math.abs(spendPlusFees-a)-Math.abs(spendPlusFees-b)||b-a);
      const cand=candidates[0];
      if(finite(cand)){
        const fee=round2(spendPlusFees-cand);
        // Ücret farkı negatif olamaz; ekstre toplamının %15'ini aşan farkı da otomatik kabul etme.
        if(fee>=-.01&&fee<=Math.max(50,spendPlusFees*.15)){
          if(!finite(meta.spendingTotal)||Math.abs(+meta.spendingTotal-cand)>.01)repaired=true;
          if(!finite(meta.feesTotal)||Math.abs(+meta.feesTotal-Math.max(0,fee))>.01)repaired=true;
          meta.spendingTotal=round2(cand);meta.feesTotal=round2(Math.max(0,fee));
        }
      }
      // Hâlâ eşitlik bozuksa, güvenilir dört bileşenden Harcamaları türet.
      const fee=finite(meta.feesTotal)&&+meta.feesTotal>=0?+meta.feesTotal:0;
      const expectedSpend=round2(spendPlusFees-fee);
      const eqOk=finite(meta.spendingTotal)&&Math.abs((prev+(+meta.spendingTotal)+fee-payment)-debt)<.02;
      if(!eqOk&&expectedSpend>=0){meta.spendingTotal=expectedSpend;repaired=true}
    }
  }
  meta.summaryRepaired=repaired;
  meta.summaryEquationOk=finite(meta.previousBalance)&&finite(meta.spendingTotal)&&finite(meta.feesTotal)&&finite(meta.paymentsTotal)&&finite(meta.periodDebt)
    ?Math.abs((+meta.previousBalance)+(+meta.spendingTotal)+(+meta.feesTotal)-(+meta.paymentsTotal)-(+meta.periodDebt))<.02:false;
  return meta
}


// V66 — EKSTRE MOTORU 3.1: parser sonucundan bağımsız fiziksel satır aday denetimi.
// Bu katman kayıt ÜRETMEZ; yalnız PDF metin/tablo düzeninde tarih+tutar taşıyan işlem adaylarını sayar.
function stmtPhysicalSummaryLike(v,bankId='generic'){
  const u=String(v||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').replace(/Ş/g,'S').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ö/g,'O').replace(/Ç/g,'C').replace(/\s+/g,' ').trim();
  if(!u)return false;
  // V67: Banka özet/limit/puan kutularındaki tarih ve tutarlar GERÇEK hareket değildir.
  // Fiziksel aday sayacı bunları işlem sanırsa parser doğru olsa bile sahte "çözümlenemeyen" üretir.
  const common=/(?:ASGARI\s+ODEME(?:\s+TUTARI)?|TOPLAM\s+KREDI\s+LIMITI|KREDI\s+KARTI\s+LIMITI|KART\s+LIMITI|KULLANILABILIR\s+(?:KART\s+)?LIMIT|NAKIT\s+AVANS\s+LIMITI|HESAP\s+BAKIYESI|DONEM\s+BORCU|HESAP\s+OZETI\s+BORCU|DEVREDEN\s+BAKIYE|DEVIR\s+EDILEN\s+TUTAR|ONCEKI\s+DONEM|SON\s+ODEME(?:\s+TARIHI)?|HESAP\s+KESIM(?:\s+TARIHI)?|TOPLAM\s+HARCAMA|DONEM\s+ICI\s+HARCAMA|FAIZ\s+VE\s+UCRETLER|TOPLAM\s+ODEME|TOPLAM\s+IADE)/.test(u);
  if(common)return true;
  if(bankId==='halkbank')return /(?:TOPLAM\s+PARAFPARA|PARAFPARA\s+(?:BAKIYESI|TOPLAMI)|DONEMSEL\s+ALACAK\s+HARCAMA|KAZANILAN\s+PARAFPARA|KULLANILAN\s+PARAFPARA|PARAFPARA\s+SON\s+KULLANIM)/.test(u);
  if(bankId==='ziraat')return /(?:BANKKART\s+LIRA|BANKKART\s+PUAN|TOPLAM\s+BANKKART)/.test(u);
  if(bankId==='teb')return /(?:TOPLAM\s+BONUS|BONUS\s+(?:BAKIYE|TOPLAMI)|KAZANILAN\s+BONUS|KULLANILAN\s+BONUS)/.test(u);
  if(bankId==='denizbank')return /(?:BONUS\s+(?:BAKIYE|TOPLAMI)|TOPLAM\s+BONUS)/.test(u);
  return false;
}
function stmtPhysicalRowAudit(text,bankId='generic'){
  const src=String(text||'').replace(/\r/g,'\n'),lines=src.split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  // V86 — Halkbank koordinat tablosu varsa fiziksel aday sayısının TEK kaynağı da aynı tablodur.
  // Özet/limit/son ödeme tarihleri artık fiziksel hareket sayacına karışamaz.
  if(bankId==='halkbank'&&src.includes('__HANE_HALKBANK_TABLE_ENGINE__')){
    const marker=lines.findIndex(x=>x.includes('__HANE_HALKBANK_TABLE_ENGINE__'));
    const signatures=[];
    for(let i=Math.max(0,marker+1);i<lines.length;i++){
      const m=lines[i].match(/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/);if(!m)continue;
      if(stmtPhysicalSummaryLike(m[2],'halkbank')||stmtCarryForwardLike(m[2]))continue;
      const amounts=stmtAmountCandidates(m[2]).filter(a=>Number.isFinite(+a.value)&&Math.abs(+a.value)>.004);if(!amounts.length)continue;
      signatures.push((m[1]+'|'+amounts.map(a=>Math.abs(+a.value).toFixed(2)).join(',')+'|'+stmtCleanTitle(m[2]).slice(0,80)).toLocaleUpperCase('tr-TR'));
    }
    return{count:signatures.length,signatures,bankId};
  }
  // V87 — TEB SADE fiziksel tablo denetimi.
  // TEB PDF metin katmanında işlem tutarı bazı ekstrelerde "TL 1.177,-", bazılarında
  // yalnız "1.177,-" olarak gelir. V86 yalnız açık TL/TRY para birimi kabul ettiği için
  // gerçek işlem satırlarının tamamını 0 fiziksel aday sayabiliyordu. Burada fiziksel kanıt:
  // SATIR BAŞINDA tam tarih + aynı işlem bloğunda gerçek parasal tutardır. Özet/limit/faiz
  // satırları tarih ile başlamadığı için dışarıda kalır; toplam satırları da ayrıca kesilir.
  if(bankId==='teb'){
    const fullDate=/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/;
    const stopRx=/(?:BU\s+KARTINIZLA\s+YAPILAN\s+[İI][ŞS]LEM\s+TOPLAMLARI|GENEL\s+TOPLAM|D[ÖO]NEM\s+BORCU|ASGAR[İI]\s+[ÖO]DEME|FA[İI]Z\s+ORAN)/i;
    const signatures=[];
    for(let i=0;i<lines.length;i++){
      const m=lines[i].match(fullDate);if(!m)continue;
      let block=lines[i];
      for(let j=i+1;j<Math.min(lines.length,i+3);j++){
        if(fullDate.test(lines[j])||stopRx.test(lines[j]))break;
        block+=' '+lines[j];
      }
      if(stopRx.test(m[2])||stmtPhysicalSummaryLike(block,'teb')||stmtCarryForwardLike(block)||stmtTebSummaryLike(block))continue;
      // Tarihi bloktan çıkar; böylece tarih rakamları hiçbir zaman tutar adayı olamaz.
      const body=block.replace(fullDate,'$2');
      const vals=stmtAmountCandidates(body).filter(a=>Number.isFinite(+a.value)&&Math.abs(+a.value)>.004);
      if(!vals.length)continue;
      // TEB'de bonus/taksit yardımcı sayıları bulunabilir; fiziksel audit için amaç tutarı
      // yeniden hesaplamak değil, gerçek işlem satırının varlığını bağımsız olarak saymaktır.
      const explicit=vals.filter(a=>['TL','TRY','₺'].includes(a.currency));
      const pick=explicit[0]||vals[0];
      signatures.push((m[1]+'|'+Math.abs(+pick.value).toFixed(2)+'|'+stmtCleanTitle(body).slice(0,80)).toLocaleUpperCase('tr-TR'));
    }
    return{count:signatures.length,signatures,bankId};
  }
  // V83 — DenizBank fiziksel denetimi parser ile aynı TABLO SATIRI tanımını kullanır.
  // V81'de tam tarih şartı 10-12 sahte adayı kaldırdı; kalan 2-3 aday ise ekstre üst/alt
  // bilgilerindeki gerçek tam tarih + parasal değerlerin genel audit tarafından hareket sanılmasıydı.
  // DenizBank fixed parser yalnız satır başında tam tarih ve satır sonunda TL işlem tutarı olan
  // gerçek tablo satırlarını okur. Audit de aynı yapısal kapıyı kullanır. Böylece özet/son ödeme/
  // hesap kesim tarihleri fiziksel işlem sayılmaz. Gerçek bir işlem parserdan düşerse banka toplamı
  // ve muhasebe denklemi ayrıca uyuşmayacağı için hata gizlenmez.
  if(bankId==='denizbank'){
    const fullDate=/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/;
    const signatures=[];
    for(let i=0;i<lines.length;i++){
      const m=lines[i].match(fullDate);if(!m)continue;
      const rest=m[2].trim();
      if(stmtPhysicalSummaryLike(rest,'denizbank')||stmtCarryForwardLike(rest))continue;
      const end=rest.match(/([+-]?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})\s*\+?)\s*TL\s*$/i);
      if(!end)continue;
      const value=stmtMoney(end[0]);if(!Number.isFinite(value)||Math.abs(value)<=.004)continue;
      const sig=(m[1]+'|'+Math.abs(value).toFixed(2)+'|'+stmtCleanTitle(rest).slice(0,80)).toLocaleUpperCase('tr-TR');
      signatures.push(sig);
    }
    return{count:signatures.length,signatures,bankId};
  }
  // V81 — DenizBank fiziksel denetiminde yalnız TAM tarih kabul edilir.
  // DenizBank PDF'lerinde taksit 4/4, blok 4/4 ve benzeri kesirler DD/MM sanılıp her ekstrede 10-12 sahte fiziksel aday üretiyordu.
  // Parser zaten DenizBank hareketlerini tam tarihli satırlardan okur; audit de aynı fiziksel tanıma bağlanır.
  const dateRx=['ziraat','teb','denizbank'].includes(bankId)?/\b\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2})\b/:/\b\d{1,2}[.\/-]\d{1,2}(?:[.\/-](?:20\d{2}|\d{2}))?\b/;
  const signatures=[];let zStarted=bankId!=='ziraat';
  for(let i=0;i<lines.length;i++){
    const line=lines[i],u=line.toLocaleUpperCase('tr-TR');
    if(bankId==='ziraat'){
      if(/İŞLEM\s+TARİH|ISLEM\s+TARIH/.test(u)){zStarted=true;continue}
      // Devam sayfasında tablo başlığı tekrarlanmayabilir; tarihli gerçek satırlar faiz özetinden önceyse kabul edilir.
      if(!zStarted&&dateRx.test(line)&&!stmtPhysicalSummaryLike(line,bankId))zStarted=true;
      if(zStarted&&/^(?:FAİZ\s+VE\s+ÜCRETLER|FAIZ\s+VE\s+UCRETLER)\s*:?$/i.test(u))break;
      if(!zStarted)continue;
    }
    if(!dateRx.test(line)||stmtPhysicalSummaryLike(line,bankId))continue;
    let block=line;
    for(let j=i+1;j<Math.min(lines.length,i+4);j++){if(dateRx.test(lines[j]))break;if(stmtPhysicalSummaryLike(lines[j],bankId))break;block+=' '+lines[j]}
    if(stmtPhysicalSummaryLike(block,bankId)||stmtCarryForwardLike(block))continue;
    const amounts=stmtAmountCandidates(block).filter(a=>Number.isFinite(a.value)&&Math.abs(a.value)>0);
    if(!amounts.length)continue;
    const dm=line.match(dateRx)?.[0]||'';
    // Aynı gün + aynı açıklama + aynı tutar birden fazla kez gerçekten yapılmış olabilir.
    // Her fiziksel satır ayrı adaydır; imza yalnız teşhis örneği olarak saklanır, tekilleştirme yapılmaz.
    const sig=(dm+'|'+amounts.map(a=>Math.abs(a.value).toFixed(2)).join(',')+'|'+stmtCleanTitle(block).slice(0,80)).toLocaleUpperCase('tr-TR');
    signatures.push(sig)
  }
  return{count:signatures.length,signatures,bankId}
}
function stmtApplyAuditDiagnostics(meta,rows,text,bankId,readDiag={}){
  const m={...(meta||{})},list=(rows||[]),round2=n=>Math.round((+n||0)*100)/100,finite=n=>Number.isFinite(+n);
  const physical=stmtPhysicalRowAudit(text,bankId),sum=k=>round2(list.filter(r=>r?.kind===k).reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const readPhysical=+(readDiag?.physicalRowCount||0);
  // V84: TEB'de sayfa-sınırı örtüşmesi temizlenmiş read audit, birleşik metindeki ham sayaçtan daha güvenilirdir.
  m.physicalRowCount=((bankId==='teb'||bankId==='halkbank')&&readPhysical>0)?readPhysical:Math.max(physical.count||0,readPhysical);m.parsedRowCount=list.length;
  // V89 — TEB fiziksel sayaç YOKSA parser satırlarını "fazla aday" diye suçlama.
  // Bazı SADE TEB PDF'lerinde metin katmanı işlem tablosunu koordinat/satır biçiminde vermiyor;
  // bu durumda bağımsız fiziksel audit 0 dönerken TEB parserı gerçek 8/44 vb. hareketleri çıkarabiliyor.
  // 0 fiziksel kanıt "0 işlem vardı" anlamına gelmez, "fiziksel sayaç kullanılamadı" anlamına gelir.
  // Bu nedenle yalnız TEB + fiziksel sayaç 0 durumunda parserExtra üretilmez. Muhasebe/özet farkı,
  // tip toplamları ve içe aktarma kilidi aynen çalışmaya devam eder; gerçek parasal uyuşmazlık gizlenmez.
  const tebPhysicalUnavailable=bankId==='teb'&&m.physicalRowCount===0&&m.parsedRowCount>0;
  m.tebPhysicalUnavailable=tebPhysicalUnavailable;
  m.unresolvedRowCount=tebPhysicalUnavailable?0:Math.max(0,m.physicalRowCount-m.parsedRowCount);
  m.parserExtraRowCount=tebPhysicalUnavailable?0:Math.max(0,m.parsedRowCount-m.physicalRowCount);
  m.spendRowCount=list.filter(r=>r?.kind==='spend').length;m.paymentRowCount=list.filter(r=>r?.kind==='payment').length;m.refundRowCount=list.filter(r=>r?.kind==='refund').length;m.feeRowCount=list.filter(r=>r?.kind==='fee').length;m.adjustmentRowCount=list.filter(r=>r?.kind==='adjustment').length;m.physicalCandidateSamples=(physical.signatures||[]).slice(0,8);
  m.parsedSpendingTotal=sum('spend');m.parsedPaymentsTotal=sum('payment');m.parsedRefundsTotal=sum('refund');m.parsedFeesTotal=sum('fee');
  if(finite(m.previousBalance)&&finite(m.periodDebt)){
    m.rowEquationTotal=round2((+m.previousBalance)+m.parsedSpendingTotal+m.parsedFeesTotal-m.parsedPaymentsTotal-m.parsedRefundsTotal);
    m.rowEquationOk=Math.abs(m.rowEquationTotal-(+m.periodDebt))<.02;
  }else m.rowEquationOk=false;
  let directSpend=!finite(m.spendingTotal)||Math.abs((+m.spendingTotal)-m.parsedSpendingTotal)<.02;
  let directPay=!finite(m.paymentsTotal)||Math.abs((+m.paymentsTotal)-m.parsedPaymentsTotal)<.02;
  let directFee=!finite(m.feesTotal)||Math.abs((+m.feesTotal)-m.parsedFeesTotal)<.02;
  m.pageAudit=Array.isArray(readDiag?.pageAudit)?readDiag.pageAudit:[];m.pageOverlapRemoved=+readDiag?.overlapRemoved||0;
  // V74 — Ziraat son doğrulama katmanı. PDF.js özet kutusunu yanlış sırada düzleştirse bile
  // temizlenmiş fiziksel işlem sayısı parser ile birebir aynıysa ve gerçek işlem toplamları
  // Devreden Bakiye -> Dönem Borcu muhasebe denklemine kuruşu kuruşuna oturuyorsa,
  // Harcama / Ödeme / Faiz-Ücret özetleri işlem satırlarından kesinleştirilir.
  // Bu kural eksik/fazla satırı ASLA gizlemez; yalnız countOk + bağımsız borç denklemi birlikteyken çalışır.
  if(bankId==='ziraat'){
    const zCountOk=m.physicalRowCount>0&&m.physicalRowCount===m.parsedRowCount&&m.unresolvedRowCount===0&&m.parserExtraRowCount===0;
    const zDebtOk=finite(m.previousBalance)&&finite(m.periodDebt)&&Math.abs(((+m.previousBalance)+m.parsedSpendingTotal+m.parsedFeesTotal-m.parsedPaymentsTotal-m.parsedRefundsTotal)-(+m.periodDebt))<.02;
    if(zCountOk&&zDebtOk){
      if(!finite(m.spendingTotal)||Math.abs((+m.spendingTotal)-m.parsedSpendingTotal)>.01)m.ziraatOriginalSpendingTotal=finite(m.spendingTotal)?+m.spendingTotal:null;
      if(!finite(m.feesTotal)||Math.abs((+m.feesTotal)-m.parsedFeesTotal)>.01)m.ziraatOriginalFeesTotal=finite(m.feesTotal)?+m.feesTotal:null;
      m.spendingTotal=m.parsedSpendingTotal;m.paymentsTotal=m.parsedPaymentsTotal;m.feesTotal=m.parsedFeesTotal;
      m.ziraatSpendFromVerifiedRows=true;m.ziraatFinalAuditRepair=true;m.ziraatRowEquationOk=true;m.summaryEquationOk=true;m.summaryTrusted=true;
      directSpend=directPay=directFee=true;
    }
  }
  // V75 — TEB fiziksel tablo doğrulaması: tam tarihli fiziksel satır sayısı + parser sayısı +
  // etiketli "BU KARTINIZLA YAPILAN İŞLEM TOPLAMLARI" toplamı birlikte doğrulanır.
  // Dönem borcu varsa muhasebe denklemi de zorunludur; yoksa tablo mutabakatı tek başına güvenilir sayılır.
  if(bankId==='teb'){
    let tSpendOk=finite(m.spendingTotal)&&Math.abs((+m.spendingTotal)-m.parsedSpendingTotal)<.02;
    const tPayOk=!finite(m.paymentsTotal)||Math.abs((+m.paymentsTotal)-m.parsedPaymentsTotal)<.02;
    const tFeeOk=!finite(m.feesTotal)||Math.abs((+m.feesTotal)-m.parsedFeesTotal)<.02;
    const tDebtRequired=finite(m.periodDebt)&&finite(m.previousBalance);
    let tDebtOk=!tDebtRequired||m.rowEquationOk;
    // V79 — TEB'de fiziksel satır sayısı parser ile birebir eşitse ve gerçek işlem satırları
    // Devreden -> Dönem Borcu denklemini kuruşu kuruşuna sağlıyorsa, PDF metin katmanında yanlış
    // komşu değere bağlanan GENEL TOPLAM harcama alanını işlem satırlarından düzelt. Bu kural
    // eksik/fazla satır varken ASLA çalışmaz.
    const tExactCount=m.physicalRowCount>0&&m.physicalRowCount===m.parsedRowCount&&m.unresolvedRowCount===0&&m.parserExtraRowCount===0;
    const tIndependentDebtOk=finite(m.previousBalance)&&finite(m.periodDebt)&&Math.abs(((+m.previousBalance)+m.parsedSpendingTotal+m.parsedFeesTotal-m.parsedPaymentsTotal-m.parsedRefundsTotal)-(+m.periodDebt))<.02;
    if(tExactCount&&tIndependentDebtOk&&tPayOk&&tFeeOk&&!tSpendOk){
      m.tebOriginalSpendingTotal=finite(m.spendingTotal)?+m.spendingTotal:null;
      m.spendingTotal=m.parsedSpendingTotal;m.tebSpendFromVerifiedRows=true;m.summaryEquationOk=true;m.summaryTrusted=true;
      directSpend=true;tSpendOk=true;tDebtOk=true;
    }
    // V77 — TEB sayaç regresyon koruması. V76'nın yeni fiziksel parserı gerçek hareketlere ek
    // bir satır üretebildiği için kaldırıldı; kayıt üretiminde V75'in kanıtlanmış TEB parserı kullanılır.
    // PDF fiziksel sayacı parserdan büyükse bunu ancak banka GENEL TOPLAM + ödeme + faiz/ücret
    // toplamları parser satırlarıyla birebir uyuştuğunda (ve dönem borcu varsa denklem de tuttuğunda)
    // yanlış fiziksel aday olarak sınıflandır. Böylece gerçek eksik hareket gizlenmez.
    const tIndependentTotalsOk=tSpendOk&&tPayOk&&tFeeOk&&tDebtOk&&!!m.tebExplicitSummary;
    if(m.physicalRowCount>m.parsedRowCount&&m.parserExtraRowCount===0&&tIndependentTotalsOk){
      m.tebPhysicalFalsePositiveCount=m.physicalRowCount-m.parsedRowCount;
      m.physicalRowCount=m.parsedRowCount;m.unresolvedRowCount=0;
    }
    const tCountOk=m.physicalRowCount>0&&m.physicalRowCount===m.parsedRowCount&&m.unresolvedRowCount===0&&m.parserExtraRowCount===0;
    if(tCountOk&&tSpendOk&&tPayOk&&tFeeOk&&tDebtOk){
      m.tebTableVerified=true;m.summaryTrusted=true;directSpend=directPay=directFee=true;
    }
  }
  // V91 — TEB fiziksel sayaç kullanılamıyor son-koruması.
  // PDF sayfa denetimi açıkça 0 aday döndürdüyse bu, TEB SADE metin katmanında
  // bağımsız fiziksel tablonun ölçülemediği anlamına gelir; parserın bulduğu gerçek
  // hareketler 'fazla aday' değildir. Bu karar yalnız TEB'e ve yalnız tüm sayfa
  // denetimleri 0 iken uygulanır. Banka toplamları / muhasebe denklemi kontrolleri korunur.
  if(bankId==='teb'&&m.parsedRowCount>0&&Array.isArray(readDiag?.pageAudit)&&readDiag.pageAudit.length>0&&readDiag.pageAudit.every(x=>(+x?.candidates||0)===0)){
    m.tebPhysicalUnavailable=true;
    m.physicalRowCount=0;
    m.unresolvedRowCount=0;
    m.parserExtraRowCount=0;
  }

  // V85 — İş Bankası fiziksel aday yanlış-pozitif temizliği.
  // Maximum PDF'lerinde işlem satırının sonundaki MaxiPuan / taksit toplamı gibi yardımcı kolonlar
  // genel fiziksel audit tarafından ayrı/şüpheli aday izlenimi oluşturabiliyor. Parser satırları ise
  // Devreden Bakiye + gerçek harcama/ödeme/iade -> Dönem Borcu denklemini kuruşu kuruşuna
  // sağlıyorsa eksik parasal hareket yoktur. Yalnız bu bağımsız denklem kanıtı varken fiziksel
  // sayaç fazlasını yanlış-pozitif say; parser/işlem üretimine dokunma. Böylece diğer İş Bankası
  // ekstreleri ve Ziraat/TEB/DenizBank kuralları değişmez.
  if(bankId==='isbank'){
    const iDebtOk=!!m.isbankRowEquationOk&&!!m.rowEquationOk;
    const iIndependentOk=iDebtOk&&!!m.summaryTrusted&&directPay&&directFee&&m.parsedRowCount>0;
    if(m.physicalRowCount>m.parsedRowCount&&m.parserExtraRowCount===0&&iIndependentOk){
      m.isbankPhysicalFalsePositiveCount=m.physicalRowCount-m.parsedRowCount;
      m.physicalRowCount=m.parsedRowCount;m.unresolvedRowCount=0;m.isbankTableVerified=true;
    }
  }
  m.typeTotalsMatch=directSpend&&directPay&&directFee;
  // V70 — Fiziksel sayaç yalnız tarih+tutar biçimindeki adayları görür. Banka parserı ise
  // tarih satırı PDF'de kopmuş bir gerçek hareketi (özellikle vergi/faiz satırını) kurtarabilir.
  // Parser fiziksel sayaçtan fazla satır buldu diye tek başına hata üretme: çözümlenemeyen yoksa,
  // işlem toplamları ve dönem borcu denklemi birlikte tam uyuyorsa bu satır 'kurtarılan hareket'tir.
  const parserRecovered=(m.parserExtraRowCount>0&&m.unresolvedRowCount===0&&m.typeTotalsMatch&&m.rowEquationOk&&m.summaryTrusted);
  m.parserRecoveredRowCount=parserRecovered?m.parserExtraRowCount:0;
  m.unverifiedParserExtraRowCount=parserRecovered?0:m.parserExtraRowCount;
  const countOk=m.physicalRowCount===0||m.physicalRowCount===m.parsedRowCount||parserRecovered;
  m.fullVerified=!!(countOk&&m.typeTotalsMatch&&(m.rowEquationOk||m.summaryTrusted));
  m.verificationStatus=m.fullVerified?'verified':((m.unresolvedRowCount||m.unverifiedParserExtraRowCount||!m.typeTotalsMatch)?'review':'partial');
  return m
}
function stmtFinalizeSummaryConfidence(meta,rows){
  const m={...(meta||{})},round2=n=>Math.round((+n||0)*100)/100,finite=n=>Number.isFinite(+n);
  const spendRows=(rows||[]).filter(r=>r?.kind==='spend'),refundRows=(rows||[]).filter(r=>r?.kind==='refund');
  const paymentRows=(rows||[]).filter(r=>r?.kind==='payment'),feeRows=(rows||[]).filter(r=>r?.kind==='fee');
  const parsedSpend=round2(spendRows.reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const parsedPayments=round2(paymentRows.reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const parsedFees=round2(feeRows.reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  const parsedRefunds=round2(refundRows.reduce((a,r)=>a+Math.abs(+r.amount||0),0));
  m.parsedSpendingTotal=parsedSpend;m.parsedPaymentsTotal=parsedPayments;m.parsedFeesTotal=parsedFees;m.parsedRefundsTotal=parsedRefunds;
  m.spendingRowsMatch=finite(m.spendingTotal)&&Math.abs((+m.spendingTotal)-parsedSpend)<.02;
  m.paymentRowsMatch=!paymentRows.length||!finite(m.paymentsTotal)||Math.abs((+m.paymentsTotal)-parsedPayments)<.02;
  m.feeRowsMatch=!feeRows.length||!finite(m.feesTotal)||Math.abs((+m.feesTotal)-parsedFees)<.02;
  // V65: iade muhasebe denkleminden mutlaka düşülür.
  m.summaryEquationOk=finite(m.previousBalance)&&finite(m.spendingTotal)&&finite(m.feesTotal)&&finite(m.paymentsTotal)&&finite(m.periodDebt)
    ?Math.abs((+m.previousBalance)+(+m.spendingTotal)+(+m.feesTotal)-(+m.paymentsTotal)-parsedRefunds-(+m.periodDebt))<.02:false;
  if(finite(m.previousBalance)&&finite(m.periodDebt)){
    const rowDebt=round2((+m.previousBalance)+parsedSpend+parsedFees-parsedPayments-parsedRefunds);
    m.rowEquationTotal=rowDebt;m.rowEquationOk=Math.abs(rowDebt-(+m.periodDebt))<.02;
  }
  const detected=stmtDetectBank('',statementImportCardId||'');
  if(detected?.id==='halkbank'&&m.rowEquationOk){m.halkbankRowEquationTotal=m.rowEquationTotal;m.halkbankRowEquationOk=true;m.summaryTrusted=true}
  m.summaryTrusted=!!(m.summaryTrusted||((m.summaryEquationOk||m.rowEquationOk)&&m.spendingRowsMatch&&m.paymentRowsMatch&&m.feeRowsMatch));
  return m
}
function stmtChronologyPenalty(rows,i){
  const cur=rows[i]?.date||'',prev=i>0?(rows[i-1]?.date||''):'',next=i<rows.length-1?(rows[i+1]?.date||''):'';
  let p=0;if(prev&&cur&&prev>cur)p+=2;if(cur&&next&&cur>next)p+=2;if(prev&&next&&cur&&prev===next&&cur!==prev)p+=1;return p
}
function stmtDuplicateRemovalCandidates(list,idxs){
  const sorted=[...idxs].sort((a,b)=>(Number.isFinite(list[a]?.sourceStart)?list[a].sourceStart:a)-(Number.isFinite(list[b]?.sourceStart)?list[b].sourceStart:b));
  const scored=sorted.map(i=>({i,penalty:stmtChronologyPenalty(list,i),raw:String(list[i]?.rawKey||'')}));
  const rawCounts={};for(const x of scored)if(x.raw)rawCounts[x.raw]=(rawCounts[x.raw]||0)+1;
  return scored.filter(x=>{
    if(x.penalty>0)return true;
    if(x.raw&&rawCounts[x.raw]>1){const first=scored.find(y=>y.raw===x.raw);return first&&first.i!==x.i}
    return false
  }).map(x=>x.i)
}
function stmtUniqueSubsetIndexes(rows,kind,target,maxItems=4){
  const cents=Math.round((+target||0)*100);if(cents<=0)return null;
  const cand=[];(rows||[]).forEach((r,i)=>{if(r?.kind!==kind)return;const c=Math.round(Math.abs(+r.amount||0)*100);if(c>0&&c<=cents)cand.push({i,c})});
  const found=[];const dfs=(start,left,pick)=>{if(found.length>1)return;if(left===0){found.push([...pick]);return}if(left<0||pick.length>=maxItems)return;for(let j=start;j<cand.length;j++){const x=cand[j];if(x.c>left)continue;pick.push(x.i);dfs(j+1,left-x.c,pick);pick.pop();if(found.length>1)return}};dfs(0,cents,[]);return found.length===1?found[0]:null
}
function stmtImportGuardStatus(meta,rows,bankId,cardId=''){
  const reasons=[],known=v=>v!==null&&v!==''&&v!==undefined&&Number.isFinite(Number(v)),sum=k=>(rows||[]).filter(r=>r?.kind===k).reduce((a,r)=>a+Math.abs(+r.amount||0),0),diff=(a,b)=>Math.abs(Number(a)-Number(b));
  const cents=v=>Math.round((Number(v)||0)*100),spendSum=sum('spend'),paymentSum=sum('payment'),feeSum=sum('fee'),refundSum=sum('refund');
  // V89: Halkbank uzlaştırması kuruş bazında ve doğrudan işlem toplamları üzerinden yapılır.
  // PDF'deki Devreden alanı bazı sürümlerde konumsal olarak zor okunabildiği için, banka özetindeki
  // Harcamalar + Ödemeler + Faiz/Ücret satır toplamları birebir uyuşuyorsa gereksiz blok koyma.
  let halkbankEquationOk=false;
  if(bankId==='halkbank'){
    // V92: Özet hücresindeki sahte 0,00 değerleri gerçek pozitif işlem toplamlarının önüne geçemez.
    if(spendSum>0&&(!known(meta?.spendingTotal)||cents(meta.spendingTotal)===0)){meta.spendingTotal=Math.round(spendSum*100)/100;meta.halkbankSpendFromRows=true}
    if(paymentSum>0&&(!known(meta?.paymentsTotal)||cents(meta.paymentsTotal)===0)){meta.paymentsTotal=Math.round(paymentSum*100)/100;meta.halkbankPaymentsFromRows=true}
    if(feeSum>0&&(!known(meta?.feesTotal)||cents(meta.feesTotal)===0)){meta.feesTotal=Math.round(feeSum*100)/100;meta.halkbankFeesFromRows=true}
    const spendMatch=known(meta?.spendingTotal)&&cents(meta.spendingTotal)===cents(spendSum);
    const payMatch=known(meta?.paymentsTotal)&&cents(meta.paymentsTotal)===cents(paymentSum);
    const feeMatch=known(meta?.feesTotal)&&cents(meta.feesTotal)===cents(feeSum);
    const directTotalsOk=spendMatch&&payMatch&&feeMatch;
    let prev=known(meta?.previousBalance)?Number(meta.previousBalance):null;
    const debt=known(meta?.periodDebt)?Number(meta.periodDebt):null;
    // Üç doğrudan banka toplamı doğruysa eksik/bozuk devreden değerini muhasebe denkleminden türet.
    if(directTotalsOk&&debt!==null&&(prev===null||!Number.isFinite(prev))){
      prev=Math.round((debt-spendSum-feeSum+paymentSum+refundSum)*100)/100;
      meta.previousBalance=prev;
      meta.halkbankDerivedPreviousBalance=true;
    }
    let equationOk=false;
    if(prev!==null&&debt!==null){
      const calcCents=cents(prev)+cents(spendSum)+cents(feeSum)-cents(paymentSum)-cents(refundSum);
      equationOk=calcCents===cents(debt);
      meta.halkbankRowEquationTotal=calcCents/100;
    }
    // Doğrudan üç işlem toplamı bankayla birebir eşleşiyorsa güvenlidir; hesap denklemi de varsa ayrıca doğrulanır.
    halkbankEquationOk=directTotalsOk&&(debt===null||equationOk||!known(meta?.previousBalance));
    if(directTotalsOk&&debt!==null&&!equationOk){
      const derived=Math.round((debt-spendSum-feeSum+paymentSum+refundSum)*100)/100;
      // Devreden özet hücresi yanlış okunmuşsa güvenilir üç toplam + dönem borcundan yeniden kur.
      meta.previousBalance=derived;
      meta.halkbankDerivedPreviousBalance=true;
      const recalc=cents(derived)+cents(spendSum)+cents(feeSum)-cents(paymentSum)-cents(refundSum);
      equationOk=recalc===cents(debt);
      meta.halkbankRowEquationTotal=recalc/100;
      halkbankEquationOk=equationOk;
    }
    meta.halkbankRowEquationOk=halkbankEquationOk;
    meta.halkbankDirectTotalsOk=directTotalsOk;
  }
  const ziraatRowsVerified=bankId==='ziraat'&&!!meta?.ziraatRowEquationOk&&(+meta?.unresolvedRowCount||0)===0&&(+meta?.parserExtraRowCount||0)===0;
  const tebRowsVerified=bankId==='teb'&&!!meta?.tebTableVerified&&(+meta?.unresolvedRowCount||0)===0&&(+meta?.parserExtraRowCount||0)===0;
  if(!halkbankEquationOk&&!ziraatRowsVerified&&!tebRowsVerified&&known(meta?.spendingTotal)&&diff(meta.spendingTotal,spendSum)>.02)reasons.push(`Harcama toplamı banka ile uyuşmuyor (${Number(spendSum).toFixed(2)} / ${Number(meta.spendingTotal).toFixed(2)})`);
  if(!halkbankEquationOk&&!tebRowsVerified&&known(meta?.paymentsTotal)&&Number(meta.paymentsTotal)>0&&diff(meta.paymentsTotal,paymentSum)>.02)reasons.push(`Ödeme toplamı banka ile uyuşmuyor (${Number(paymentSum).toFixed(2)} / ${Number(meta.paymentsTotal).toFixed(2)})`);
  if(!halkbankEquationOk&&!tebRowsVerified&&known(meta?.feesTotal)&&Number(meta.feesTotal)>0&&diff(meta.feesTotal,feeSum)>.02)reasons.push(`Faiz/ücret toplamı banka ile uyuşmuyor (${Number(feeSum).toFixed(2)} / ${Number(meta.feesTotal).toFixed(2)})`);
  if(bankId==='halkbank'&&!halkbankEquationOk&&known(meta?.periodDebt)&&!reasons.length)reasons.push(`Halkbank hesap bakiyesi işlem toplamlarıyla uyuşmuyor`);
  // V65: Fiziksel tablo adayı ile parser satırı farklıysa ve banka toplamları da tam doğrulanmıyorsa içe aktarma durur.
  if(['denizbank','isbank','teb','ziraat'].includes(bankId)&&(+meta?.unresolvedRowCount||0)>0&&!meta?.summaryTrusted)reasons.push(`${meta.unresolvedRowCount} fiziksel işlem adayı parser tarafından çözümlenemedi`);
  if(['denizbank','isbank','teb','ziraat'].includes(bankId)&&(+meta?.parserExtraRowCount||0)>0&&!meta?.summaryTrusted)reasons.push(`Parser fiziksel tablo adayından ${meta.parserExtraRowCount} fazla hareket üretti`);
  const card=state?.cards?.find?.(x=>x.id===cardId),cardDetected=stmtDetectBank('',cardId);
  if(bankId&&bankId!=='generic'&&cardDetected.id&&cardDetected.id!=='generic'&&bankId!==cardDetected.id){
    const stmtLabel=STMT_BANK_PROFILES.find(p=>p.id===bankId)?.label||bankId.toLocaleUpperCase('tr-TR');
    reasons.push(`Ekstre ${stmtLabel}, seçili kart ${card?.bank||cardDetected.label}. Yanlış karta içe aktarma engellendi`)
  }
  return{blocked:reasons.length>0,reasons,bankId}
}
function stmtReconcileRowsToBankSpending(rows,meta){
  const list=[...(rows||[])];
  const target=Number(meta?.spendingTotal);
  if(!Number.isFinite(target)||target<0)return{rows:list,removed:0,amount:0};
  const spendIdx=[];let parsed=0,hasRefund=false;
  list.forEach((r,i)=>{if(r?.kind==='refund'){hasRefund=true;return}if(r?.kind==='spend'){const a=Math.abs(+r.amount||0);if(a>0){parsed+=a;spendIdx.push(i)}}});
  // Bazı bankalar faiz/ücreti işlem tablosunda normal satır gibi gösterir. Banka özetindeki harcama+ücret ayrımı
  // benzersiz bir küçük satır kombinasyonuyla birebir açıklanıyorsa bu satırları güvenle Vergi & Faiz'e taşı.
  const feeTarget=Number(meta?.feesTotal),spendTarget=Number(meta?.spendingTotal),feeParsed=list.filter(r=>r?.kind==='fee').reduce((a,r)=>a+Math.abs(+r.amount||0),0);
  const needFee=Math.round((feeTarget-feeParsed)*100)/100,excessSpend=Math.round((parsed-spendTarget)*100)/100;
  if(Number.isFinite(feeTarget)&&feeTarget>0&&Number.isFinite(spendTarget)&&needFee>.001&&Math.abs(needFee-excessSpend)<.011){
    const feeCandidates=list.map((r,i)=>({r,i})).filter(x=>x.r?.kind==='spend'&&stmtFeeLike(`${x.r.rawKey||''} ${x.r.title||''}`));const feeCandidateRows=feeCandidates.map(x=>x.r);const local=stmtUniqueSubsetIndexes(feeCandidateRows,'spend',needFee,4);const idxs=local?.map(j=>feeCandidates[j].i);if(idxs?.length){for(const i of idxs){const r=list[i];r.kind='fee';r.category='Vergi & Faiz';r.refund=false;r.payment=false;r.classificationReason='Banka özeti + faiz/ücret açıklaması';r.semanticKey=(r.semanticKey||'')+'|fee-reconciled'};return{rows:list,removed:0,amount:0,reclassified:idxs.length,reclassifiedAmount:needFee}}

    // S17 FIX5 — DenizBank: PDF metin katmanı bazı vergi/faiz açıklamalarını parçalayabiliyor.
    // Bankanın ETİKETLİ faiz/ücret toplamı ile harcama fazlası birebir aynıysa ve bu tutarı
    // yalnızca TEK bir küçük işlem kombinasyonu açıklıyorsa, sadece DenizBank profilinde bu
    // satırları ücret olarak ayır. Bu kural İş Bankası/TEB'e uygulanmaz.
    if(meta?.bankProfileId==='denizbank'){
      const pool=list.map((r,i)=>({r,i})).filter(x=>x.r?.kind==='spend'&&Math.abs(+x.r.amount||0)>0&&Math.abs(+x.r.amount||0)<=needFee+.001);
      const local2=stmtUniqueSubsetIndexes(pool.map(x=>x.r),'spend',needFee,6);
      const idxs2=local2?.map(j=>pool[j].i);
      if(idxs2?.length){
        for(const i of idxs2){const r=list[i];r.kind='fee';r.category='Vergi & Faiz';r.refund=false;r.payment=false;r.classificationReason='DenizBank etiketli faiz/ücret toplamı ile birebir uzlaştırma';r.semanticKey=(r.semanticKey||'')+'|deniz-fee-summary'}
        return{rows:list,removed:0,amount:0,reclassified:idxs2.length,reclassifiedAmount:needFee};
      }
    }
  }
  // İadeli ekstrelerde banka özetinin iadeyi nasıl mahsuplaştırdığı bankadan bankaya değişebilir.
  // Bu yüzden otomatik satır azaltma yalnızca iadesiz ekstrelerde yapılır.
  if(hasRefund)return{rows:list,removed:0,amount:0};
  const diff=Math.round((parsed-target)*100);
  if(diff<=1)return{rows:list,removed:0,amount:0};
  const groups=new Map();
  for(const i of spendIdx){const r=list[i],cents=Math.round(Math.abs(+r.amount||0)*100);if(cents<=0)continue;const k=r.semanticKey||`${r.date}|${stmtCleanTitle(r.title).toLocaleUpperCase('tr-TR')}|${cents}`;if(!groups.has(k))groups.set(k,{k,cents,idx:[]});groups.get(k).idx.push(i)}
  // Aynı tarih + aynı açıklama + aynı tutar tek başına silme nedeni değildir.
  // Yalnızca kronolojiyi bozan veya aynı ham kaynak bloğunun parser yankısı olan kopyalar adaydır.
  const cand=[...groups.values()].filter(g=>g.idx.length>=2&&g.cents<=diff).map(g=>{
    const removable=stmtDuplicateRemovalCandidates(list,g.idx);
    return {...g,removable,max:Math.min(g.idx.length-1,removable.length)}
  }).filter(g=>g.max>0);
  if(!cand.length)return{rows:list,removed:0,amount:0};
  // Güvenli otomatik uzlaştırma: farkı TEK BAŞINA açıklayabilen yalnız bir tekrar kümesi varsa uygula.
  // Birden fazla olası kombinasyon varsa gerçek işlemi yanlışlıkla silmemek için otomatik karar verme.
  const exact=[];
  for(let gi=0;gi<cand.length;gi++){
    const g=cand[gi];
    if(diff%g.cents!==0)continue;
    const n=diff/g.cents;
    if(Number.isInteger(n)&&n>=1&&n<=g.max)exact.push([gi,n])
  }
  if(exact.length!==1)return{rows:list,removed:0,amount:0,ambiguous:exact.length>1};
  const drop=new Set();
  const [gi,n]=exact[0],g=cand[gi];
  const ranked=[...g.removable].sort((a,b)=>stmtChronologyPenalty(list,b)-stmtChronologyPenalty(list,a)||((Number.isFinite(list[b]?.sourceStart)?list[b].sourceStart:b)-(Number.isFinite(list[a]?.sourceStart)?list[a].sourceStart:a)));
  for(const i of ranked.slice(0,n))drop.add(i)
  if(!drop.size)return{rows:list,removed:0,amount:0};
  const out=list.filter((_,i)=>!drop.has(i));
  const after=out.filter(r=>r.kind==='spend').reduce((a,r)=>a+Math.abs(+r.amount||0),0);
  if(Math.abs(after-target)>.011)return{rows:list,removed:0,amount:0};
  return{rows:out,removed:drop.size,amount:diff/100}
}

function statementImportMonthForRows(card,rows){
  const ds=rows.map(r=>r.date).filter(stmtValidIsoDate).sort();if(!ds.length)return state.selectedMonth;
  return statementMonthFor(card,ds.at(-1))
}
function statementSnapshot(cardId,m){return (state.statementImports||[]).find(x=>x.cardId===cardId&&x.month===m)||null}
function statementRowsMonthBreakdown(rows){
  const counts={};for(const r of rows||[]){if(!stmtValidIsoDate(r.date))continue;const m=r.date.slice(0,7);counts[m]=(counts[m]||0)+1}
  return Object.entries(counts).sort().map(([m,n])=>{const [y,mo]=m.split('-').map(Number),label=new Date(y,mo-1,1,12).toLocaleDateString('tr-TR',{month:'long',year:'numeric'}).toLocaleUpperCase('tr-TR');return`${label}: ${n}`}).join(' • ')
}
function stmtDateDistance(a,b){
  const da=new Date(String(a||'')+'T12:00:00'),db=new Date(String(b||'')+'T12:00:00');
  if(Number.isNaN(da.getTime())||Number.isNaN(db.getTime()))return 999;
  return Math.abs(Math.round((da-db)/86400000))
}
function stmtManualMatchCandidates(cardId,row){
  if(!row||!['spend','refund'].includes(row.kind))return[];
  const signed=row.kind==='refund'?-Math.abs(+row.amount||0):Math.abs(+row.amount||0),rk=stmtMerchantKey(row.title||'');
  return (state.expenses||[]).filter(x=>!x.importedFromStatement&&x.source==='card'&&x.cardId===cardId&&!x.statementMatched&&Math.abs((+(x.actualAmount??x.amount)||0)-signed)<.005&&stmtDateDistance(x.date,row.date)<=2).map(x=>{
    const days=stmtDateDistance(x.date,row.date),sameTitle=stmtCleanTitle(x.title).toLocaleUpperCase('tr-TR')===stmtCleanTitle(row.title).toLocaleUpperCase('tr-TR'),sameMerchant=rk&&stmtMerchantKey(x.title||'')===rk;
    const score=(days===0?20:days===1?12:6)+(sameTitle?10:sameMerchant?5:0)+(String(x.category||'')===String(row.category||'')?2:0);
    return{x,days,score,sameTitle,sameMerchant}
  }).sort((a,b)=>b.score-a.score)
}
function stmtPrepareReconciliation(cardId,rows){
  const used=new Set(),stats={bank:rows.length,matched:0,possible:0,newSpend:0,fees:0,payments:0,refunds:0,adjustments:0};
  for(const r of rows){
    r.matchId='';r.matchStatus='new';r.matchReason='';
    if(r.kind==='fee'){stats.fees++;r.matchStatus='fee';continue}
    if(r.kind==='payment'){stats.payments++;r.matchStatus='payment';continue}
    if(r.kind==='adjustment'){stats.adjustments++;r.matchStatus='adjustment';continue}
    if(r.kind==='refund')stats.refunds++;
    if(!['spend','refund'].includes(r.kind))continue;
    const cs=stmtManualMatchCandidates(cardId,r).filter(z=>!used.has(z.x.id));
    const exact=cs.filter(z=>z.days===0);
    if(exact.length===1){r.matchId=exact[0].x.id;r.matchStatus='matched';r.matchReason=exact[0].sameTitle?'Aynı kart + tarih + tutar + ad':'Aynı kart + tarih + tutar';used.add(r.matchId);stats.matched++;continue}
    if(cs.length){r.matchId=cs[0].x.id;r.matchStatus='possible';r.matchReason=`${cs[0].days} gün fark · aynı tutar${cs[0].sameTitle?' · aynı ad':cs[0].sameMerchant?' · benzer işyeri':' · isim farklı'}`;stats.possible++;continue}
    if(r.kind==='spend')stats.newSpend++
  }
  return stats
}
function stmtMatchSelect(row,i){
  if(!['spend','refund'].includes(row.kind))return'';
  const cs=stmtManualMatchCandidates(statementImportCardId,row).slice(0,4);
  const status=row.matchStatus==='matched'?'matched':row.matchStatus==='possible'?'possible':'new';
  const label=status==='matched'?'✓ EŞLEŞTİ':status==='possible'?'⚠ OLASI EŞLEŞME':'＋ YENİ BANKA HAREKETİ';
  const detail=(status==='matched'?'Mevcut HANE kaydı bulundu':status==='possible'?'Kullanıcı onayı gerekli':'HANE’da eşleşen kayıt bulunamadı')+(row.matchReason?' · '+row.matchReason:'');
  const opts=cs.map(z=>`<option value="${esc(z.x.id)}" ${row.matchId===z.x.id?'selected':''}>${esc(z.x.title)} · ${z.x.date} · ${money(Math.abs(+(z.x.actualAmount??z.x.amount)||0))}</option>`).join('');
  const chooser=cs.length?`<label class="stmtMatchChooser"><span>EŞLEŞTİRME</span><select data-stmt-match="${i}"><option value="">YENİ İŞLEM OLARAK EKLE</option>${opts}</select></label>`:`<input type="hidden" data-stmt-match="${i}" value="">`;
  return `<div class="stmtMatchState ${status}"><b>${label}</b><small>${esc(detail)}</small></div>${chooser}`
}
function statementPreview(cardId,rows){
  const orderedRows=[...(rows||[])].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||((Number.isFinite(a.sourceStart)?a.sourceStart:Number.MAX_SAFE_INTEGER)-(Number.isFinite(b.sourceStart)?b.sourceStart:Number.MAX_SAFE_INTEGER))||((a.occurrence||0)-(b.occurrence||0)));
  // Önizleme, sayaç ve içe aktarma aynı son doğrulanmış hareket kümesini kullanır.
  // Parser'ın özet/footer/tanımsız artıkları artık ne sayıya ne de içe aktarma listesine girebilir.
  const finalRows=orderedRows.filter(r=>['spend','payment','refund','fee','adjustment'].includes(r?.kind)&&stmtValidIsoDate(r?.date)&&Number.isFinite(+r?.amount)&&Math.abs(+r.amount)>0);
  const c=state.cards.find(x=>x.id===cardId),month=statementImportMonthForRows(c,finalRows),monthBreakdown=statementRowsMonthBreakdown(finalRows),existingImported=(state.expenses||[]).filter(x=>x.importedFromStatement&&x.cardId===cardId&&((x.statementImportMonth&&x.statementImportMonth===month)||statementMonthFor(c,x.date)===month)).length;
  const usable=existingImported?finalRows:finalRows.filter(r=>r.kind==='adjustment'||r.payment||r.occurrence>stmtExistingCount(cardId,r.date,r.title,r.amount));const reconcileStats=stmtPrepareReconciliation(cardId,usable);statementImportRows=usable;
  const skipped=existingImported?0:finalRows.length-usable.length;
  // Sayaçlar ekranda gerçekten gösterilen / içe aktarılabilir satırlarla birebir aynı kaynaktan hesaplanır.
  const spendRows=usable.filter(r=>r.kind==='spend'),refundRows=usable.filter(r=>r.kind==='refund'),paymentRows=usable.filter(r=>r.kind==='payment'),feeRows=usable.filter(r=>r.kind==='fee'),adjustmentRows=usable.filter(r=>r.kind==='adjustment'),bankProfile=STMT_BANK_PROFILES.find(p=>p.id===statementImportMeta.bankProfileId)||stmtDetectBank('',cardId);
  const movementCount=usable.length;
  const autoSpend=Number.isFinite(statementImportMeta.spendingTotal)?statementImportMeta.spendingTotal:spendRows.reduce((a,r)=>a+r.amount,0);
  const debt=Number.isFinite(statementImportMeta.periodDebt)?statementImportMeta.periodDebt:'';
  const prev=Number.isFinite(statementImportMeta.previousBalance)?statementImportMeta.previousBalance:'';
  const fees=Number.isFinite(statementImportMeta.feesTotal)?statementImportMeta.feesTotal:feeRows.reduce((a,r)=>a+Math.abs(+r.amount||0),0);
  const pays=Number.isFinite(statementImportMeta.paymentsTotal)?statementImportMeta.paymentsTotal:paymentRows.reduce((a,r)=>a+r.amount,0),refunds=refundRows.reduce((a,r)=>a+Math.abs(+r.amount||0),0);
  let physical=+statementImportMeta.physicalRowCount||0,parsed=+statementImportMeta.parsedRowCount||finalRows.length,unresolved=+statementImportMeta.unresolvedRowCount||0,extra=+statementImportMeta.parserExtraRowCount||0,recovered=+statementImportMeta.parserRecoveredRowCount||0;/* V97: TEB bağımsız fiziksel sayaç kullanılamıyorsa UI hiçbir eski/meta değeriyle parserı fazla aday gösteremez. */if(bankProfile?.id==='teb'&&physical===0&&parsed>0){unresolved=0;extra=0;recovered=0;statementImportMeta.tebPhysicalUnavailable=true;statementImportMeta.unresolvedRowCount=0;statementImportMeta.parserExtraRowCount=0;statementImportMeta.unverifiedParserExtraRowCount=0;}const verifyLabel=statementImportMeta.fullVerified?'EKSTRE TAM DOĞRULANDI':statementImportMeta.verificationStatus==='review'?'İNCELEME GEREKİYOR':'KISMİ DOĞRULAMA';const pageAudit=statementImportMeta.halkbankCoordinateAuditVerified?`Koordinat: ${physical}${statementImportMeta.halkbankPhysicalEchoRemoved?` (-${statementImportMeta.halkbankPhysicalEchoRemoved} PDF yankısı)`:''}`:(statementImportMeta.pageAudit||[]).map(x=>`S${x.page}: ${x.candidates}${x.overlapRemoved?` (-${x.overlapRemoved} sayfa tekrarı)`:''}`).join(' · ');
  return `<div class="statementReconcileBox statementV65Audit ${statementImportMeta.fullVerified?'ok':'review'}"><b>${verifyLabel}</b><div class="stmtCountGrid"><span><small>FİZİKSEL ADAY</small><b>${physical||'—'}</b></span><span><small>PARSER</small><b>${parsed}</b></span><span><small>ÇÖZÜMLENEMEYEN</small><b>${unresolved}</b></span><span><small>${recovered?'KURTARILAN':'FAZLA ADAY'}</small><b>${recovered||extra}</b></span></div><small>${pageAudit?`Sayfa kontrolü: ${esc(pageAudit)}. `:''}Harcama ${money(statementImportMeta.parsedSpendingTotal||0)} · Ödeme ${money(statementImportMeta.parsedPaymentsTotal||0)} · İade ${money(statementImportMeta.parsedRefundsTotal||0)} · Faiz/Masraf ${money(statementImportMeta.parsedFeesTotal||0)}${adjustmentRows.length?` · Bonus/Puan ${adjustmentRows.length} satır (harcamaya dahil değil)`:''}.</small>${unresolved&&Array.isArray(statementImportMeta.physicalCandidateSamples)&&statementImportMeta.physicalCandidateSamples.length?`<br><small><b>Şüpheli fiziksel aday örnekleri:</b> ${esc(statementImportMeta.physicalCandidateSamples.slice(0,3).join(' · '))}</small>`:''}${Number.isFinite(+statementImportMeta.rowEquationTotal)?`<br><small>Muhasebe denklemi: ${statementImportMeta.rowEquationOk?'✓ UYUMLU':'⚠ FARK VAR'} · Hesaplanan ${money(+statementImportMeta.rowEquationTotal||0)}</small>`:''}</div><div class="notice"><b>${esc(c?.bank||'KART')} · •••• ${esc(c?.last4||'')}</b><br><small>Ekstre bankası: <b>${esc(bankProfile.label)}</b></small><br><b>${movementCount} satır bulundu</b> · ${spendRows.length} harcama · ${paymentRows.length} ödeme · ${refundRows.length} iade · ${feeRows.length} vergi/faiz${adjustmentRows.length?` · ${adjustmentRows.length} bonus/puan düzeltme`:''}${skipped?` · ${skipped} mükerrer atlandı`:''}.<br>${statementImportMeta.autoDuplicateRemoved?`<small><b>${statementImportMeta.autoDuplicateRemoved} yinelenen satır</b> banka harcama toplamıyla karşılaştırılarak çıkarıldı (${money(statementImportMeta.autoDuplicateAmount||0)}).</small><br>`:''}${statementImportMeta.autoFeeReclassified?`<small><b>${statementImportMeta.autoFeeReclassified} satır</b> banka özetiyle uzlaştırılarak Vergi & Faiz'e ayrıldı (${money(statementImportMeta.autoFeeReclassifiedAmount||0)}).</small><br>`:''}${statementImportMeta.importBlocked?`<small><b>⛔ İÇE AKTARMA KİLİTLİ:</b> ${esc((statementImportMeta.importGuardReasons||[]).join(' · '))}</small><br>`:''}${statementImportMeta.ziraatSpendFromVerifiedRows?`<small><b>✓ Ziraat harcama özeti işlem satırları + dönem borcu denklemiyle doğrulandı.</b>${Number.isFinite(+statementImportMeta.ziraatOriginalSpendingTotal)?` PDF düz metin sırasında harcama alanına yanlış taşınan ${money(+statementImportMeta.ziraatOriginalSpendingTotal)} değeri kullanılmadı; doğrulanmış gerçek harcama toplamı ${money(+statementImportMeta.spendingTotal)} kullanıldı.`:''}</small><br>`:statementImportMeta.ziraatSummaryIncludesFees?`<small><b>✓ Ziraat özetindeki harcama toplamının faiz/ücreti içerdiği doğrulandı; net harcama ayrıştırıldı.</b></small><br>`:statementImportMeta.summaryRepaired?`<small><b>Ekstre özeti doğrulandı ve PDF metin sırası otomatik düzeltildi.</b></small><br>`:''}${statementImportMeta.summaryTrusted?`<small>✓ Banka özeti ve işlem satırları birlikte doğrulandı.</small><br>`:statementImportMeta.summaryEquationOk?`<small>⚠ Banka özeti matematiksel olarak tutuyor; işlem satırlarıyla tam doğrulama bekleniyor.</small><br>`:''}<small>Motor: EKSTRE MOTORU 4.10 · V109 · Profil: ${esc(bankProfile.label)} · Satır ve blok stratejileri otomatik karşılaştırılır; gerekirse OCR yedeği kullanılır.</small><br><small>Taksitli alışverişlerde yalnızca bu ekstreye yansıyan taksit tutarı gider olarak eklenir.</small></div>
  <div class="statementReconcileBox s18MatchSummary"><b>EKSTRE MUTABAKATI</b><div class="stmtCountGrid"><span><small>BANKA</small><b>${reconcileStats.bank}</b></span><span><small>EŞLEŞEN</small><b>${reconcileStats.matched}</b></span><span><small>OLASI</small><b>${reconcileStats.possible}</b></span><span><small>YENİ HARCAMA</small><b>${reconcileStats.newSpend}</b></span><span><small>FAİZ / MASRAF</small><b>${reconcileStats.fees}</b></span><span><small>ÖDEME</small><b>${reconcileStats.payments}</b></span>${reconcileStats.adjustments?`<span><small>BONUS / PUAN</small><b>${reconcileStats.adjustments}</b></span>`:''}</div><small>Olası eşleşmeler otomatik birleştirilmez. Banka açıklaması ile HANE kayıt adı ayrı korunur.</small></div>
  <div class="statementReconcileBox statementBankEquation">
    <b>BANKA EKSTRE ÖZETİ</b>
    <div class="stmtEquationGrid"><label>Devreden Bakiye<input id="stmtSummaryPrevious" type="number" step="0.01" value="${prev!==''?Number(prev).toFixed(2):''}" placeholder="0,00"></label><label>Harcamalar<input id="stmtSummarySpend" type="number" step="0.01" value="${Number(autoSpend||0).toFixed(2)}"></label><label>Faiz / Ücret<input id="stmtSummaryFees" type="number" step="0.01" value="${Number(fees||0).toFixed(2)}"></label><label>Ödemeler<input id="stmtSummaryPayments" type="number" step="0.01" value="${pays!==''?Number(pays).toFixed(2):''}" placeholder="0,00"></label><label>İadeler<input id="stmtSummaryRefunds" type="number" step="0.01" value="${Number(refunds||0).toFixed(2)}" readonly></label><label>Dönem Borcu<input id="stmtSummaryDebt" type="number" step="0.01" value="${debt!==''?Number(debt).toFixed(2):''}" placeholder="0,00"></label></div>
    <label class="form-check"><input id="stmtSyncDebt" type="checkbox" ${debt!==''?'checked':''}> <span>Dönem borcunu kart borcu için esas al</span></label>
    ${existingImported?`<label class="form-check"><input id="stmtReplacePeriod" type="checkbox" checked> <span>Bu ekstre dönemindeki önceki içe aktarmayı yenileriyle değiştir</span></label>`:''}
  </div>
  ${monthBreakdown?`<div class="notice statementMonthCheck"><b>İŞLEM TARİHLERİ</b><br>${esc(monthBreakdown)}</div>`:''}
  <div class="statementImportList">${usable.length?usable.map((r,i)=>`<div class="statementImportRow ${r.kind==='adjustment'?'stmtAdjustmentRow':''}"><input type="checkbox" data-stmt-check="${i}" ${r.kind==='adjustment'?'disabled':'checked'}><div class="stmtEditGrid"><input type="date" data-stmt-date="${i}" value="${esc(r.date)}" ${r.kind==='adjustment'?'disabled':''}><input type="text" data-stmt-title="${i}" value="${esc(r.title)}" maxlength="100" ${r.kind==='adjustment'?'disabled':''}><input type="number" step="0.01" data-stmt-amount="${i}" value="${Number(r.amount).toFixed(2)}" ${r.payment||r.kind==='adjustment'?'readonly':''}><select data-stmt-category="${i}" ${r.payment||r.kind==='adjustment'?'disabled':''}>${r.kind==='adjustment'?`<option selected>HARCAMAYA DAHİL DEĞİL</option>`:r.payment?`<option value="Kart Ödemesi" selected>Kart Ödemesi</option>`:C.map(cat=>`<option value="${esc(cat)}" ${cat===r.category?'selected':''}>${esc(cat)}</option>`).join('')}</select></div><div class="stmtTypeEdit">${r.kind==='adjustment'?`<select disabled><option selected>BONUS / PUAN DÜZELTME</option></select>`:`<select data-stmt-kind="${i}"><option value="spend" ${r.kind==='spend'?'selected':''}>HARCAMA</option><option value="fee" ${r.kind==='fee'?'selected':''}>FAİZ / VERGİ / MASRAF</option><option value="payment" ${r.kind==='payment'?'selected':''}>KART ÖDEMESİ</option><option value="refund" ${r.kind==='refund'?'selected':''}>İADE</option></select>`}<small>${esc(r.classificationReason||'Sınıflandırma adayı')}</small>${stmtMatchSelect(r,i)}</div></div>`).join(''):'<div class="notice">EKLENECEK YENİ HAREKET BULUNMADI.</div>'}</div>${usable.length&&!statementImportMeta.importBlocked?'<button class="btn gold" style="width:100%;margin-top:12px" data-action="statementImportConfirm">SEÇİLENLERİ EKLE</button>':usable.length?'<button class="btn" style="width:100%;margin-top:12px;opacity:.55" disabled>BANKA TOPLAMLARI UYUŞMUYOR</button>':''}`
}

const HANE_OCR_SCRIPT='./__hane_engine__/tesseract/tesseract.min.js';
const HANE_OCR_WORKER='./__hane_engine__/tesseract/worker.min.js';
const HANE_OCR_CORE='./__hane_engine__/tesseract/core';
const HANE_PDF_MODULE='./__hane_engine__/pdf/pdf.min.mjs';
const HANE_PDF_WORKER='./__hane_engine__/pdf/pdf.worker.min.mjs';
let statementOcrWorker=null,statementOcrLabel='OCR',statementPdfjs=null,statementPdfWorker=null,statementPrivacyPrepared=false,statementPrivacyPreparePromise=null,statementEngineMode='local';
const HANE_SW_BUILD='20260928-HANE-WORK-V109-CLEAN';
const HANE_SW_URL='./sw.js?v='+encodeURIComponent(HANE_SW_BUILD);
const HANE_ENGINE_CACHE='hane-engine-v0.15.44-v110-work-independent';
const HANE_ENGINE_PACKAGES=[
  {url:'https://registry.npmjs.org/tesseract.js/-/tesseract.js-5.1.1.tgz',integrity:'sha512-lzVl/Ar3P3zhpUT31NjqeCo1f+D5+YfpZ5J62eo2S14QNVOmHBTtbchHm/YAbOOOzCegFnKf4B3Qih9LuldcYQ==',files:{'package/dist/tesseract.min.js':'__hane_engine__/tesseract/tesseract.min.js','package/dist/worker.min.js':'__hane_engine__/tesseract/worker.min.js'}},
  {url:'https://registry.npmjs.org/tesseract.js-core/-/tesseract.js-core-5.1.1.tgz',integrity:'sha512-KX3bYSU5iGcO1XJa+QGPbi+Zjo2qq6eBhNjSGR5E5q0JtzkoipJKOUQD7ph8kFyteCEfEQ0maWLu8MCXtvX5uQ==',files:{'package/tesseract-core.wasm.js':'__hane_engine__/tesseract/core/tesseract-core.wasm.js','package/tesseract-core-simd.wasm.js':'__hane_engine__/tesseract/core/tesseract-core-simd.wasm.js','package/tesseract-core-lstm.wasm.js':'__hane_engine__/tesseract/core/tesseract-core-lstm.wasm.js','package/tesseract-core-simd-lstm.wasm.js':'__hane_engine__/tesseract/core/tesseract-core-simd-lstm.wasm.js','package/tesseract-core.wasm':'__hane_engine__/tesseract/core/tesseract-core.wasm','package/tesseract-core-simd.wasm':'__hane_engine__/tesseract/core/tesseract-core-simd.wasm','package/tesseract-core-lstm.wasm':'__hane_engine__/tesseract/core/tesseract-core-lstm.wasm','package/tesseract-core-simd-lstm.wasm':'__hane_engine__/tesseract/core/tesseract-core-simd-lstm.wasm'}},
  {url:'https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-4.10.38.tgz',integrity:'sha512-/Y3fcFrXEAsMjJXeL9J8+ZG9U01LbuWaYypvDW2ycW1jL269L3js3DVBjDJ0Up9Np1uqDXsDrRihHANhZOlwdQ==',files:{'package/build/pdf.min.mjs':'__hane_engine__/pdf/pdf.min.mjs','package/build/pdf.worker.min.mjs':'__hane_engine__/pdf/pdf.worker.min.mjs'}}
];
function haneB64(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode(...bytes.subarray(i,i+0x8000));return btoa(s)}
async function haneVerifySha512(buffer,integrity){const [alg,want]=String(integrity).split('-',2);if(alg!=='sha512'||!want)throw new Error('Motor bütünlük bilgisi geçersiz.');const got=haneB64(new Uint8Array(await crypto.subtle.digest('SHA-512',buffer)));if(got!==want)throw new Error('Motor paketi SHA-512 doğrulamasını geçemedi.');}
function haneTarStr(u8,start,len){const p=u8.subarray(start,start+len);let e=p.indexOf(0);if(e<0)e=p.length;return new TextDecoder().decode(p.subarray(0,e)).trim()}
function haneOct(s){const x=String(s||'').replace(/\0/g,'').trim();return x?parseInt(x,8)||0:0}
async function haneGunzip(buffer){if(typeof DecompressionStream!=='function')throw new Error('Bu tarayıcı güvenli motor paketini açmayı desteklemiyor.');const st=new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));return new Uint8Array(await new Response(st).arrayBuffer())}
function haneExtractTar(tar,needed){const found=new Map();for(let off=0;off+512<=tar.length;){const name=haneTarStr(tar,off,100),prefix=haneTarStr(tar,off+345,155);if(!name)break;const full=prefix?`${prefix}/${name}`:name,size=haneOct(haneTarStr(tar,off+124,12)),type=String.fromCharCode(tar[off+156]||48),ds=off+512,de=ds+size;if((type==='0'||type==='\0')&&needed.has(full))found.set(full,tar.slice(ds,de));off=ds+Math.ceil(size/512)*512}return found}
function haneEngineMime(path){if(path.endsWith('.wasm'))return'application/wasm';if(path.endsWith('.mjs')||path.endsWith('.js'))return'text/javascript; charset=utf-8';return'application/octet-stream'}
async function installVerifiedEnginesInPage(packages=HANE_ENGINE_PACKAGES){
  const cache=await caches.open(HANE_ENGINE_CACHE);
  for(const pkg of packages){
    let ready=true;for(const dst of Object.values(pkg.files)){if(!(await cache.match(new URL(dst,location.href).href))){ready=false;break}}
    if(ready)continue;
    const res=await fetch(pkg.url,{method:'GET',mode:'cors',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});if(!res.ok)throw new Error('Doğrulanmış motor paketi indirilemedi.');
    const archive=await res.arrayBuffer();await haneVerifySha512(archive,pkg.integrity);const tar=await haneGunzip(archive),need=new Set(Object.keys(pkg.files)),found=haneExtractTar(tar,need);if(found.size!==need.size)throw new Error('Doğrulanmış motor paketinde gerekli dosya eksik.');
    for(const [src,dst] of Object.entries(pkg.files)){const url=new URL(dst,location.href).href;await cache.put(url,new Response(found.get(src),{status:200,headers:{'Content-Type':haneEngineMime(dst),'Cache-Control':'public, max-age=31536000, immutable','X-HANE-Verified':'sha512-package-page'}}))}
  }
  return true
}
async function haneEnginePackageReady(pkg){const cache=await caches.open(HANE_ENGINE_CACHE);for(const dst of Object.values(pkg.files)){if(!(await cache.match(new URL(dst,location.href).href)))return false}return true}
async function ensurePdfEngineReady(){
  // PDF okuma Service Worker controller'a bagli degildir.
  // Paket sabit npm surumunden indirilir, SHA-512 dogrulanir ve CacheStorage'a yazilir.
  // Sayfa daha sonra dogrulanmis byte'lari dogrudan cache'den Blob olarak calistirir.
  const pkg=HANE_ENGINE_PACKAGES[2];
  if(!(await haneEnginePackageReady(pkg)))await installVerifiedEnginesInPage([pkg]);
  statementPdfjs=null;statementPdfWorker=null;
  return true
}
async function ensureOcrEngineReady(){
  // OCR da PDF gibi Service Worker controller'a bagli degildir.
  // Sabit surum paketleri sayfa tarafinda SHA-512 dogrulanip CacheStorage'a yazilir.
  const pkgs=[HANE_ENGINE_PACKAGES[0],HANE_ENGINE_PACKAGES[1]];
  for(const pkg of pkgs)if(!(await haneEnginePackageReady(pkg))){await installVerifiedEnginesInPage(pkgs);break}
  return true
}
async function loadTesseract(){
  if(window.Tesseract)return window.Tesseract;
  await new Promise((res,rej)=>{const old=document.querySelector('script[data-hane-ocr="1"]');if(old)old.remove();const sc=document.createElement('script');sc.dataset.haneOcr='1';sc.src=HANE_OCR_SCRIPT;sc.onload=res;sc.onerror=()=>rej(new Error('OCR motoru yüklenemedi.'));document.head.appendChild(sc)});
  return window.Tesseract
}
async function getStatementOcrWorker(label='OCR'){
  statementOcrLabel=label;if(statementOcrWorker)return statementOcrWorker;
  await ensureOcrEngineReady();
  const T=await loadTesseract(),langPath=new URL('./vendor/tesseract/lang',location.href).href.replace(/\/$/,'');
  statementOcrWorker=await T.createWorker(['tur','eng'],1,{workerPath:HANE_OCR_WORKER,langPath,corePath:HANE_OCR_CORE,logger:m=>{const e=document.getElementById('statementImportProgress');if(e&&m.progress)e.textContent=`${statementOcrLabel} · %${Math.round(m.progress*100)}`}});return statementOcrWorker
}
async function releaseStatementOcrWorker(){if(statementOcrWorker){try{await statementOcrWorker.terminate()}catch{}statementOcrWorker=null}}
let statementPdfBlobUrls=[];
async function haneCachedEngineBlobUrl(rel,mime='application/octet-stream'){
  const cache=await caches.open(HANE_ENGINE_CACHE),href=new URL(rel,location.href).href,res=await cache.match(href);
  if(!res)throw new Error('Dogrulanmis PDF motoru cache icinde bulunamadi.');
  const buf=await res.arrayBuffer(),url=URL.createObjectURL(new Blob([buf],{type:mime}));statementPdfBlobUrls.push(url);return url
}
async function getStatementPdfRuntime(){
  if(statementPdfjs)return statementPdfjs;
  await ensurePdfEngineReady();
  try{
    const moduleUrl=await haneCachedEngineBlobUrl('__hane_engine__/pdf/pdf.min.mjs','text/javascript'),workerUrl=await haneCachedEngineBlobUrl('__hane_engine__/pdf/pdf.worker.min.mjs','text/javascript');
    const pdfjs=await import(moduleUrl);pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;
    try{statementPdfWorker=new pdfjs.PDFWorker({name:'hane-private-pdf'});await statementPdfWorker.promise}catch{}
    statementPdfjs=pdfjs;return pdfjs
  }catch(e){console.error('HANE PDF runtime:',e);throw new Error('PDF motoru yüklenemedi.')}
}
async function pingStatementWorker(worker){if(!worker)return false;return await new Promise(resolve=>{const channel=new MessageChannel();let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);resolve(v)},timer=setTimeout(()=>finish(false),1500);channel.port1.onmessage=e=>{const d=e.data||{};finish(d.ok===true&&d.build===HANE_SW_BUILD)};try{worker.postMessage({type:'PING'},[channel.port2])}catch{finish(false)}})}
async function ensureStatementServiceWorkerController(){
  if(!('serviceWorker'in navigator))throw new Error('Güvenli yerel okuma bu tarayıcıda desteklenmiyor.');
  // Fast path: do not hit the network or call update when the correct worker already controls this page.
  const current=navigator.serviceWorker.controller;
  if(current&&await pingStatementWorker(current))return current;

  let reg=await navigator.serviceWorker.getRegistration('./');
  if(!reg)reg=await navigator.serviceWorker.register(HANE_SW_URL,{scope:'./',updateViaCache:'none'});
  else {
    const activeUrl=reg.active?.scriptURL||reg.waiting?.scriptURL||reg.installing?.scriptURL||'';
    if(!activeUrl.includes(encodeURIComponent(HANE_SW_BUILD))&&!activeUrl.includes(HANE_SW_BUILD)){
      reg=await navigator.serviceWorker.register(HANE_SW_URL,{scope:'./',updateViaCache:'none'});
    }
  }
  // Ask for an update only when the current controller is absent/wrong; this keeps normal statement opens fast.
  try{await reg.update()}catch{}
  const deadline=Date.now()+5000;
  while(Date.now()<deadline){
    const ctl=navigator.serviceWorker.controller;
    if(ctl&&await pingStatementWorker(ctl))return ctl;
    const target=reg.waiting||reg.installing||reg.active;
    if(target&&await pingStatementWorker(target)){
      if(target.state==='installed')try{target.postMessage({type:'SKIP_WAITING'})}catch{}
      // Activated workers call clients.claim(); controllerchange can happen without reloading the page.
      await new Promise(r=>setTimeout(r,180));
      const claimed=navigator.serviceWorker.controller;
      if(claimed&&await pingStatementWorker(claimed))return claimed;
    }
    await new Promise(r=>setTimeout(r,220));
    reg=await navigator.serviceWorker.getRegistration('./')||reg;
  }
  throw new Error('HANE güvenli okuma servisi bu sayfayı kontrol edemedi. Sayfayı bir kez yenileyip tekrar deneyin.')
}
async function requestVerifiedEnginePreparation(controller){return await new Promise((resolve,reject)=>{const channel=new MessageChannel();let done=false;const finish=(ok,v)=>{if(done)return;done=true;clearTimeout(timer);ok?resolve(v):reject(v)},timer=setTimeout(()=>finish(false,new Error('Güvenli PDF/OCR motorları hazırlanırken zaman aşımı oluştu.')),120000);channel.port1.onmessage=e=>{const d=e.data||{};if(d.build!==HANE_SW_BUILD)return finish(false,new Error('Ekstre motoru farklı HANE sürümünden yanıt verdi.'));d.ok?finish(true,true):finish(false,new Error(d.error||'Güvenli motor hazırlanamadı.'))};try{controller.postMessage({type:'PREPARE_ENGINES'},[channel.port2])}catch(e){finish(false,e)}})}
async function prepareStatementPrivacyRuntime(){
  if(statementPrivacyPrepared)return true;if(statementPrivacyPreparePromise)return statementPrivacyPreparePromise;
  // Lazy-engine mode: only make sure the exact HANE worker controls the page here.
  // PDF/OCR packages are prepared later, only for the selected file type.
  statementPrivacyPreparePromise=(async()=>{statementEngineMode='lazy-verified';statementPrivacyPrepared=true;return true})().finally(()=>{if(!statementPrivacyPrepared)statementPrivacyPreparePromise=null});
  return statementPrivacyPreparePromise
}

async function statementImageForOcr(file,maxSide=2400){
  if(typeof createImageBitmap!=='function')return file;
  const bmp=await createImageBitmap(file);try{const scale=Math.min(1,maxSide/Math.max(bmp.width,bmp.height));if(scale===1)return file;const c=document.createElement('canvas');c.width=Math.max(1,Math.round(bmp.width*scale));c.height=Math.max(1,Math.round(bmp.height*scale));c.getContext('2d',{alpha:false}).drawImage(bmp,0,0,c.width,c.height);return c}finally{bmp.close?.()}
}
function stmtInterpretationScore(text,cardId){
  const rows=parseStatementText(text,cardId),raw=parseStatementSummary(text),meta0=normalizeStatementSummary(text,rows,raw),rec=stmtReconcileRowsToBankSpending(rows,meta0),meta=stmtFinalizeSummaryConfidence(meta0,rec.rows);
  const spend=rec.rows.filter(r=>r.kind==='spend').reduce((a,r)=>a+Math.abs(+r.amount||0),0),payments=rec.rows.filter(r=>r.kind==='payment').reduce((a,r)=>a+Math.abs(+r.amount||0),0),fees=rec.rows.filter(r=>r.kind==='fee').reduce((a,r)=>a+Math.abs(+r.amount||0),0);
  let score=Math.min(rec.rows.length,120)*2;
  if(meta.summaryEquationOk)score+=80;
  if(meta.summaryTrusted)score+=120;
  if(Number.isFinite(+meta.spendingTotal))score+=Math.max(0,50-Math.min(50,Math.abs(spend-(+meta.spendingTotal))*2));
  if(Number.isFinite(+meta.paymentsTotal)&&payments>0)score+=Math.max(0,30-Math.min(30,Math.abs(payments-(+meta.paymentsTotal))*2));
  if(Number.isFinite(+meta.feesTotal)&&fees>0)score+=Math.max(0,24-Math.min(24,Math.abs(fees-(+meta.feesTotal))*2));
  score-=rec.rows.filter(r=>!stmtValidIsoDate(r.date)||!Number.isFinite(+r.amount)||Math.abs(+r.amount)<=0).length*25;
  return{score,rows:rec.rows,meta}
}
async function stmtPdfPageTexts(pg){
  const ct=await pg.getTextContent(),items=(ct.items||[]).filter(i=>String(i.str||'').trim());
  const raw=items.map(i=>i.str+(i.hasEOL?'\n':' ')).join('');
  const lines=[];
  for(const it of items){const x=Number(it.transform?.[4]||0),y=Number(it.transform?.[5]||0),h=Math.max(1,Math.abs(Number(it.height||it.transform?.[3]||8)));let line=lines.find(l=>Math.abs(l.y-y)<=Math.max(2.2,Math.min(5,h*.42)));if(!line){line={y,items:[]};lines.push(line)}line.items.push({x,s:String(it.str||'')})}
  lines.sort((a,b)=>b.y-a.y);for(const l of lines)l.items.sort((a,b)=>a.x-b.x);
  const layout=lines.map(l=>l.items.map(i=>i.s).join(' ').replace(/\s+/g,' ').trim()).filter(Boolean).join('\n');

  // V87: HALKBANK DETERMINISTIC TABLE ENGINE
  // Halkbank/Paraf işlem tablosu artık satır metni yamalarıyla değil, kolon koordinatlarıyla kurulur.
  // Tarih, Tutar ve ParafPara kolonları bağımsız toplanır; tarih-tutar eşleşmesi Y konumuna göre yapılır.
  // Açıklama parçaları iki işlem arasındaki gerçek dikey banda atanır. Böylece bir işlemin açıklaması
  // komşu işleme yapışamaz ve tutar aynı PDF satır objesinde olmasa bile işlem kaybolmaz.
  const pageU=layout.toLocaleUpperCase('tr-TR');
  let halkLayout=layout,halkPhysicalCount=0;
  const amountHeadLine=lines.findIndex(l=>l.items.some(i=>/TUTAR\s*\(?TL\)?/i.test(i.s)));
  const parafHeadLine=lines.findIndex(l=>l.items.some(i=>/PARAFPARA/i.test(i.s)));
  const amountHead=amountHeadLine>=0?lines[amountHeadLine].items.find(i=>/TUTAR\s*\(?TL\)?/i.test(i.s)):null;
  const parafHead=parafHeadLine>=0?lines[parafHeadLine].items.find(i=>/PARAFPARA/i.test(i.s)):null;
  const hasHalkTable=!!amountHead&&!!parafHead&&(pageU.includes('AÇIKLAMA')||pageU.includes('ACIKLAMA'));

  // V88: HALKBANK COORDINATE SUMMARY ENGINE
  // Halkbank özet kutusunda çok satırlı etiketlerin rakamları PDF.js metin sırasına göre
  // etiketin arasına/yanına düşebiliyor. Bu yüzden özet değerlerini metin regex'inden değil,
  // sol özet kolonundaki etiketlerin Y merkezine en yakın parasal hücreden okuyoruz.
  const hbLeft=lines.map((l,k)=>({k,y:Number(l.y),text:l.items.filter(i=>Number(i.x)<370).map(i=>String(i.s||'')).join(' ').replace(/\s+/g,' ').trim()}));
  const hbMoney=[];
  for(const l of lines)for(const it of l.items){
    const raw=String(it.s||'').trim(),x=Number(it.x),y=Number(l.y);
    if(x<210||x>365)continue;
    if(!/^[+\-]?\s*(?:\d{1,3}(?:[.,]\d{3})+|\d+)(?:[.,]\d{2})$/.test(raw))continue;
    const value=stmtMoney(raw);if(Number.isFinite(value))hbMoney.push({x,y,raw,value});
  }
  const hbFindLine=(rx,afterY=null)=>{for(const l of hbLeft){if(afterY!=null&&l.y<=afterY)continue;if(rx.test(l.text.toLocaleUpperCase('tr-TR')))return l}return null};
  const hbNearestMoney=(targetY,maxDist=18)=>{let best=null,bd=Infinity;for(const m of hbMoney){const d=Math.abs(m.y-targetY);if(d<bd&&d<=maxDist){best=m;bd=d}}return best};
  const hbBetween=(rx1,rx2)=>{const a=hbFindLine(rx1),b=hbFindLine(rx2);if(!a||!b)return null;return hbNearestMoney((a.y+b.y)/2)};
  const hbAt=(rx)=>{const a=hbFindLine(rx);return a?hbNearestMoney(a.y):null};
  const hbPrev=hbBetween(/B[İI]R\s+[ÖO]NCEK[İI]\s+D[ÖO]NEM/,/EKSTRE\s+BORCU/);
  const hbSpend=hbAt(/D[ÖO]NEM\s+[İI][ÇC][İI]\s+BOR[ÇC]\s+TUTARI/);
  const hbFees=hbBetween(/TOPLAM\s+FA[İI]Z/,/VERG[İI]LER/);
  const hbPay=hbBetween(/D[ÖO]NEMSEL\s+ALACAK/,/KAYITLARI/);
  const hbDebtCandidates=hbLeft.filter(l=>/HESAP\s+BAK[İI]YES[İI]/.test(l.text.toLocaleUpperCase('tr-TR'))).map(l=>hbNearestMoney(l.y)).filter(Boolean);
  const hbDebt=hbDebtCandidates.find(m=>Math.abs(m.value)>0)||hbDebtCandidates[0]||null;
  const hbSummary={previousBalance:hbPrev?.value,spendingTotal:hbSpend?.value,feesTotal:hbFees?.value,paymentsTotal:hbPay?Math.abs(hbPay.value):null,periodDebt:hbDebt?.value};
  const hbSummaryKnown=Object.values(hbSummary).filter(v=>Number.isFinite(v)).length;
  const hasHalkSummary=hbSummaryKnown>=4;
  const hbSummaryLines=hasHalkSummary?[
    '__HANE_HALKBANK_SUMMARY_COORD__',
    Number.isFinite(hbSummary.previousBalance)?`Bir Önceki Dönem Ekstre Borcu: ${hbSummary.previousBalance.toFixed(2)}`:'',
    Number.isFinite(hbSummary.spendingTotal)?`Dönem İçi Borç Tutarı: ${hbSummary.spendingTotal.toFixed(2)}`:'',
    Number.isFinite(hbSummary.feesTotal)?`Toplam Faiz, Ücret, Vergiler: ${hbSummary.feesTotal.toFixed(2)}`:'',
    Number.isFinite(hbSummary.paymentsTotal)?`Dönemsel Alacak Kayıtları: ${hbSummary.paymentsTotal.toFixed(2)}`:'',
    Number.isFinite(hbSummary.periodDebt)?`Hesap Bakiyesi: ${hbSummary.periodDebt.toFixed(2)}`:''
  ].filter(Boolean):[];
  if(hasHalkSummary&&!hasHalkTable)halkLayout=[layout,...hbSummaryLines].join('\n');

  if(hasHalkTable){
    const amountX=Number(amountHead.x),parafX=Number(parafHead.x);
    const start=Math.max(amountHeadLine,parafHeadLine,0);
    let end=lines.length;
    for(let k=start+1;k<lines.length;k++){
      const t=lines[k].items.map(i=>i.s).join(' ').replace(/\s+/g,' ').trim().toLocaleUpperCase('tr-TR');
      if(/BİR\s+SONRAKİ|BIR\s+SONRAKI|TÜRKİYE\s+HALK\s+BANKASI|TURKIYE\s+HALK\s+BANKASI/.test(t)){end=k;break}
    }
    const dateRe=/^\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2})$/;
    const moneyRe=/^[+\-]?\s*(?:\d{1,3}(?:[.,]\d{3})*|\d+)[.,]\d{2}\s*\+?$/;
    const dateAnchors=[],amountCells=[],rewardCells=[];
    for(let k=start+1;k<end;k++){
      const li=lines[k];
      for(const it of li.items){
        const raw=String(it.s||'').trim(),x=Number(it.x),y=Number(li.y);
        if(dateRe.test(raw)&&x<amountX-80)dateAnchors.push({k,y,x,raw});
        if(moneyRe.test(raw)&&x>=amountX-32&&x<parafX-34)amountCells.push({k,y,x,raw});
        if(moneyRe.test(raw)&&x>=parafX-30)rewardCells.push({k,y,x,raw});
      }
    }
    // Sayfadaki görsel sırayı koru. lines dizisi zaten yukarıdan aşağı sıralı.
    dateAnchors.sort((a,b)=>a.k-b.k||b.y-a.y);
    const usedAmount=new Set();
    const txAnchors=[];
    for(const d of dateAnchors){
      let best=null,bestIdx=-1,bestDist=Infinity;
      for(let ai=0;ai<amountCells.length;ai++){
        if(usedAmount.has(ai))continue;
        const a=amountCells[ai],dist=Math.abs(a.y-d.y);
        // Tutar hücresi aynı işlem satırına çok yakın olmalı. PDF.js bazı fontlarda birkaç px kaydırabilir.
        if(dist<=13&&dist<bestDist){best=a;bestIdx=ai;bestDist=dist}
      }
      if(!best)continue;
      usedAmount.add(bestIdx);
      txAnchors.push({date:d,amount:best,y:(d.y+best.y)/2,k:d.k});
    }
    // Her açıklama fiziksel satırını yalnız en yakın GERÇEK tarih+tutar çiftine bağla.
    // Dış başlık/footer satırları için maksimum uzaklık da uygulanır.
    const descByIndex=txAnchors.map(()=>[]);
    for(let k=start+1;k<end;k++){
      const li=lines[k];
      const part=li.items.filter(i=>Number(i.x)>135&&Number(i.x)<amountX-12).map(i=>String(i.s||'')).join(' ').replace(/\s+/g,' ').trim();
      if(!part)continue;
      const pu=part.toLocaleUpperCase('tr-TR');
      if(/^(?:İŞLEM|ISLEM|TARİHİ|TARIHI|AÇIKLAMA|ACIKLAMA|TUTAR|KALAN|BORÇ|BORC|TAKSİT|TAKSIT|PARAFPARA)$/.test(pu))continue;
      if(/KART\s+NO|####-?\d+\/|ZEKİYE\s+EDA|^KIZAN$|BİR\s+ÖNCEKİ|BIR\s+ONCEKI|EKSTRE\s+BORCU/.test(pu))continue;
      let bi=-1,bd=Infinity;
      for(let i=0;i<txAnchors.length;i++){
        const dist=Math.abs(Number(li.y)-Number(txAnchors[i].y));
        if(dist<bd){bd=dist;bi=i}
      }
      // Halkbank satır aralığı tipik olarak 15-24 px. 14 px üstü başka blok/başlık kabul edilir.
      if(bi>=0&&bd<=14.5)descByIndex[bi].push({k,y:Number(li.y),text:part});
    }
    const tx=[];
    for(let i=0;i<txAnchors.length;i++){
      const a=txAnchors[i],parts=descByIndex[i].sort((x,y)=>x.k-y.k).map(x=>x.text);
      // Aynı fiziksel açıklama parçası PDF.js tarafından iki kez dönerse tekilleştir.
      const cleanParts=[];for(const q of parts){if(!cleanParts.length||cleanParts.at(-1)!==q)cleanParts.push(q)}
      const desc=cleanParts.join(' ').replace(/\s+/g,' ').trim();
      if(!desc)continue;
      let reward='';let rd=Infinity;
      for(const r of rewardCells){const d=Math.abs(r.y-a.y);if(d<=13&&d<rd){reward=r.raw;rd=d}}
      tx.push(`${a.date.raw} ${desc} ${a.amount.raw}${reward?' '+reward:''}`);
    }
    // Marker yalnız koordinatla doğrulanmış işlem satırlarının kullanılmasını sağlar.
    halkPhysicalCount=tx.length;
    halkLayout=[...hbSummaryLines,'__HANE_HALKBANK_TABLE_ENGINE__','İşlem Tarihi Açıklama TUTAR(TL) ParafPara',...tx].join('\n');
  }
  return{raw,layout,halkLayout,hasHalkTable,hasHalkSummary,halkPhysicalCount}
}

// V72 — Ziraat / Bankkart sayfa sınırı tekrar temizliği.
// Bankkart PDF'lerinin metin katmanı sayfa sonunda görünen son birkaç işlemi sonraki sayfada
// yeniden taşıyabiliyor. Aynı gün/tutarla gerçekten yapılmış işlemler korunur; yalnız önceki
// sayfanın SON işlem dizisi ile sonraki sayfanın İLK işlem dizisi birebir aynıysa bu fiziksel
// sayfa örtüşmesi kaldırılır.
function stmtZiraatPageOverlapClean(pageLayouts){
  const pages=(pageLayouts||[]).map(x=>String(x||''));
  const dateStart=/^(\d{1,2}[.\/-]\d{1,2}[.\/-](?:20\d{2}|\d{2}))\s+(.+)$/;
  const rowInfo=(line)=>{
    const clean=String(line||'').replace(/\s+/g,' ').trim(),m=clean.match(dateStart);if(!m)return null;
    if(stmtPhysicalSummaryLike(clean,'ziraat')||stmtCarryForwardLike(clean))return null;
    const amounts=stmtAmountCandidates(m[2]).filter(a=>Number.isFinite(+a.value)&&Math.abs(+a.value)>.004);if(!amounts.length)return null;
    // İmza tüm fiziksel satırı içerir. Böylece aynı tarih+tutar ama farklı gerçek işlemler birleşmez.
    const sig=clean.toLocaleUpperCase('tr-TR').replace(/\s+/g,' ').trim();
    return{sig,line:clean};
  };
  const outPages=[],audit=[];let prevTx=[];
  for(let pi=0;pi<pages.length;pi++){
    const lines=pages[pi].split(/\n+/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
    const cur=lines.map((line,idx)=>{const r=rowInfo(line);return r?{...r,idx}:null}).filter(Boolean);
    let overlap=0;
    if(prevTx.length&&cur.length){
      const max=Math.min(30,prevTx.length,cur.length);
      for(let k=max;k>=1;k--){
        let ok=true;for(let j=0;j<k;j++)if(prevTx[prevTx.length-k+j].sig!==cur[j].sig){ok=false;break}
        if(ok){overlap=k;break}
      }
    }
    const dropIdx=new Set(cur.slice(0,overlap).map(x=>x.idx));
    const keptLines=lines.filter((_,idx)=>!dropIdx.has(idx));
    const keptTx=cur.slice(overlap);
    outPages.push(keptLines.join('\n'));
    audit.push({page:pi+1,candidates:keptTx.length,overlapRemoved:overlap});
    prevTx=prevTx.concat(keptTx);
  }
  return{text:outPages.join('\n'),pageAudit:audit,physicalRowCount:audit.reduce((n,x)=>n+x.candidates,0),overlapRemoved:audit.reduce((n,x)=>n+(x.overlapRemoved||0),0)}
}


// V84 — TEB sayfa sınırı fiziksel aday örtüşme denetimi.
// TEB PDF'lerinde bazı işlem satırları sayfa sonu/başı metin katmanında tekrar edebiliyor.
// Parser birleşik metinde bu yankıları zaten tek satıra indirirken, eski sayfa bazlı audit her iki
// kopyayı da fiziksel aday saydığı için 46/44 gibi sahte "çözümlenemeyen" farkı oluşuyordu.
// Yalnız önceki sayfanın SON aday dizisi ile sonraki sayfanın İLK aday dizisi birebir aynıysa
// örtüşme kabul edilir. Aynı gün/tutarla gerçekten yapılan ayrı işlemler sayfa sınırı dışında korunur.
function stmtTebPageOverlapAudit(pageLayouts){
  const pages=(pageLayouts||[]).map(x=>String(x||'')),audit=[];let prev=[];
  for(let pi=0;pi<pages.length;pi++){
    const a=stmtPhysicalRowAudit(pages[pi],'teb'),cur=[...(a.signatures||[])];let overlap=0;
    if(prev.length&&cur.length){
      const max=Math.min(12,prev.length,cur.length);
      for(let k=max;k>=1;k--){
        let ok=true;
        for(let j=0;j<k;j++)if(prev[prev.length-k+j]!==cur[j]){ok=false;break}
        if(ok){overlap=k;break}
      }
    }
    const kept=cur.slice(overlap);
    audit.push({page:pi+1,candidates:kept.length,overlapRemoved:overlap});
    prev=prev.concat(kept);
  }
  return{pageAudit:audit,physicalRowCount:audit.reduce((n,x)=>n+x.candidates,0),overlapRemoved:audit.reduce((n,x)=>n+(x.overlapRemoved||0),0)};
}

// V88 — Halkbank / Paraf sayfa sınırı fiziksel aday örtüşme denetimi.
// Koordinat motoru her sayfadaki gerçek tablo satırlarını doğru bulsa da bazı Halkbank PDF'leri
// sayfa sonunda görünen son işlemleri sonraki sayfanın başında yeniden taşır. Birleşik parser
// kronolojiyi bozan bu yankıları zaten tek satıra indirir; sayfa bazlı audit ise eskiden iki kez
// saydığı için 12/9, 41/39 ve 34/31 gibi sahte çözümlenemeyen farklar oluşuyordu.
// Yalnız önceki sayfanın SON aday dizisi ile sonraki sayfanın İLK aday dizisi birebir aynıysa
// örtüşme kabul edilir. Aynı gün/tutarla gerçekten yapılan ayrı işlemler sayfa içinde korunur.
function stmtHalkbankPageOverlapAudit(pageHalkLayouts){
  const pages=(pageHalkLayouts||[]).map(x=>String(x||'')),audit=[];let prev=[];
  for(let pi=0;pi<pages.length;pi++){
    const a=stmtPhysicalRowAudit(pages[pi],'halkbank'),cur=[...(a.signatures||[])];let overlap=0;
    if(prev.length&&cur.length){
      const max=Math.min(12,prev.length,cur.length);
      for(let k=max;k>=1;k--){
        let ok=true;
        for(let j=0;j<k;j++)if(prev[prev.length-k+j]!==cur[j]){ok=false;break}
        if(ok){overlap=k;break}
      }
    }
    const kept=cur.slice(overlap);
    audit.push({page:pi+1,candidates:kept.length,overlapRemoved:overlap});
    prev=prev.concat(kept);
  }
  return{pageAudit:audit,physicalRowCount:audit.reduce((n,x)=>n+x.candidates,0),overlapRemoved:audit.reduce((n,x)=>n+(x.overlapRemoved||0),0)};
}

const MAX_STATEMENT_FILE_BYTES=20*1024*1024;
async function readStatementFile(file){
  if(!file)throw new Error('Ekstre dosyası seçilmedi.');
  if(file.size>MAX_STATEMENT_FILE_BYTES)throw new Error('Ekstre dosyası 20 MB sınırını aşıyor.');
  const isPdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name||'');
  if(!isPdf&&!String(file.type||'').startsWith('image/'))throw new Error('Yalnızca PDF veya fotoğraf ekstre desteklenir.');
  if(isPdf){
    const pe=document.getElementById('statementImportProgress');if(pe)pe.textContent='PDF MOTORU HAZIRLANIYOR...';
    await ensurePdfEngineReady();
    const pdfjs=await getStatementPdfRuntime();
    const pdf=await pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;let rawText='',layoutText='',halkText='',pages=[],pageLayouts=[],pageHalkLayouts=[];
    for(let n=1;n<=Math.min(pdf.numPages,12);n++){
      const pg=await pdf.getPage(n),pt=await stmtPdfPageTexts(pg);pages.push(pg);pageLayouts.push(pt.layout);pageHalkLayouts.push(pt.halkLayout||pt.layout);rawText+='\n'+pt.raw;layoutText+='\n'+pt.layout;
      // Özet sayfalarını aynen, işlem tablosu olan sayfaları yalnız koordinat-doğrulanmış satırlarla taşı.
      halkText+='\n'+((pt.hasHalkTable||pt.hasHalkSummary)?pt.halkLayout:pt.layout)
    }
    const layoutBank=stmtDetectBank(layoutText,statementImportCardId);
    const ziraatClean=layoutBank.id==='ziraat'?stmtZiraatPageOverlapClean(pageLayouts):null;
    const ziraatText=ziraatClean?.text||layoutText;
    const rawEval=rawText.replace(/\s/g,'').length>40?stmtInterpretationScore(rawText,statementImportCardId):{score:-1,rows:[],meta:{}},layoutEval=layoutText.replace(/\s/g,'').length>40?stmtInterpretationScore(layoutText,statementImportCardId):{score:-1,rows:[],meta:{}},ziraatEval=layoutBank.id==='ziraat'&&ziraatText.replace(/\s/g,'').length>40?stmtInterpretationScore(ziraatText,statementImportCardId):null;
    let text=layoutEval.score>=rawEval.score?layoutText:rawText,textEval=layoutEval.score>=rawEval.score?layoutEval:rawEval;
    if(layoutBank.id==='ziraat'&&ziraatEval){text=ziraatText;textEval=ziraatEval}
    if(layoutBank.id==='halkbank'&&halkText.replace(/\s/g,'').length>40){
      const halkEval=stmtInterpretationScore(halkText,statementImportCardId);
      // Halkbank'ta koordinat tablosu tek gerçek kaynak: regex yamalarının ürettiği footer/özet hareketlerini kökten önler.
      text=halkText;textEval=halkEval;
    }else if(['denizbank','teb','isbank'].includes(layoutBank.id)&&layoutEval.rows.length>=3){text=layoutText;textEval=layoutEval}
    const finalBank=stmtDetectBank(text,statementImportCardId);let pageAudit,physicalRowCount,overlapRemoved=0;
    if(finalBank.id==='ziraat'&&ziraatClean){pageAudit=ziraatClean.pageAudit;physicalRowCount=ziraatClean.physicalRowCount;overlapRemoved=ziraatClean.overlapRemoved||0}
    else if(finalBank.id==='teb'){
      const tebPageAudit=stmtTebPageOverlapAudit(pageLayouts);pageAudit=tebPageAudit.pageAudit;physicalRowCount=tebPageAudit.physicalRowCount;overlapRemoved=tebPageAudit.overlapRemoved||0;
    }
    else if(finalBank.id==='halkbank'){
      // V88: Koordinat-doğrulanmış Halkbank satırlarını kullan; yalnız gerçek sayfa-sonu/başı
      // tekrarlarını düş. Aynı sayfa içindeki aynı gün/tutar işlemleri kesinlikle birleştirilmez.
      const halkPageAudit=stmtHalkbankPageOverlapAudit(pageHalkLayouts);pageAudit=halkPageAudit.pageAudit;physicalRowCount=halkPageAudit.physicalRowCount;overlapRemoved=halkPageAudit.overlapRemoved||0;
    }
    else{pageAudit=pageLayouts.map((pt,i)=>{const a=stmtPhysicalRowAudit(pt,finalBank.id);return{page:i+1,candidates:a.count}});physicalRowCount=pageAudit.reduce((n,x)=>n+x.candidates,0)}
    statementReadDiagnostics={bankId:finalBank.id,pageCount:pageLayouts.length,pageAudit,physicalRowCount,overlapRemoved};
    const textChars=text.replace(/\s/g,'').length,dateTokens=(text.match(/\b\d{1,2}[.\/-]\d{1,2}(?:[.\/-](?:20\d{2}|\d{2}))?\b/g)||[]).length;
    // V90: Metin katmanında yeterli gerçek işlem varsa OCR zorunlu değildir.
    // summaryTrusted yalnız uzlaştırma kalitesidir; tek başına OCR'a düşürme sebebi olamaz.
    const minExpected=dateTokens>=6?Math.max(3,Math.floor(dateTokens*.25)):1;
    const hasUsableText=textChars>80&&textEval.rows.length>=minExpected;
    const suspicious=!hasUsableText;
    if(!suspicious)return text;
    // OCR yalnız metin katmanı gerçekten yetersizse denenir. OCR yüklenemezse mevcut metin
    // en az bir işlem içeriyorsa HANE dosyayı tamamen reddetmez; metin sonucuyla devam eder.
    try{
      let ocr='';const w=await getStatementOcrWorker('PDF OCR');for(let n=1;n<=pages.length;n++){statementOcrLabel=`PDF SAYFA ${n}/${pages.length}`;const pg=pages[n-1],vp=pg.getViewport({scale:1.8}),canvas=document.createElement('canvas');canvas.width=Math.ceil(vp.width);canvas.height=Math.ceil(vp.height);await pg.render({canvasContext:canvas.getContext('2d'),viewport:vp}).promise;const r=await w.recognize(canvas);ocr+='\n'+(r.data.text||'')}
      const ocrEval=ocr.replace(/\s/g,'').length>40?stmtInterpretationScore(ocr,statementImportCardId):{score:-1,rows:[],meta:{}};
      if(textEval.score<0&&ocrEval.score<0)throw new Error('PDF içindeki işlem satırları okunamadı.');
      return ocrEval.score>textEval.score?ocr:text;
    }catch(ocrErr){
      console.warn('OCR yedeği kullanılamadı; PDF metin katmanıyla devam ediliyor.',ocrErr);
      if(textChars>80&&textEval.rows.length>0)return text;
      throw ocrErr;
    }
  }
  const pe=document.getElementById('statementImportProgress');if(pe)pe.textContent='OCR MOTORU HAZIRLANIYOR...';
  const w=await getStatementOcrWorker('FOTOĞRAF OKUNUYOR'),source=await statementImageForOcr(file);const r=await w.recognize(source),txt=r.data.text||'';const ba=stmtDetectBank(txt,statementImportCardId),pa=stmtPhysicalRowAudit(txt,ba.id);statementReadDiagnostics={bankId:ba.id,pageCount:1,pageAudit:[{page:1,candidates:pa.count}],physicalRowCount:pa.count};return txt
}
function reconcileImportedStatementMultiplicity(card,period,rows){
  if(!card||!period)return 0;
  const expected={};
  for(const r of (rows||[]).filter(x=>!x.payment)){
    const signed=r.refund?-Math.abs(r.amount):Math.abs(r.amount);
    const k=stmtFingerprint(card.id,r.date,r.title,signed)+'|'+(r.installmentNo||0)+'/'+(r.installmentCount||0);
    expected[k]=(expected[k]||0)+1;
  }
  const groups={};
  for(const x of (state.expenses||[])){
    if(x.source!=='card'||x.cardId!==card.id)continue;
    if(String(x.date||'')<period.start||String(x.date||'')>period.end)continue;
    if(!x.importedFromStatement&&!x.statementImportMonth&&!x.importFingerprint&&!x.importBaseFingerprint)continue;
    const amt=+(x.actualAmount??x.amount)||0;
    const k=stmtFingerprint(card.id,x.date,x.title,amt)+'|'+(x.installmentNo||0)+'/'+(x.installmentCount||0);
    (groups[k]||(groups[k]=[])).push(x);
  }
  const drop=new Set();
  for(const [k,arr] of Object.entries(groups)){
    const keep=Math.max(0,expected[k]||0);
    if(arr.length<=keep)continue;
    arr.sort((a,b)=>String(a.id||'').localeCompare(String(b.id||'')));
    for(const x of arr.slice(keep))drop.add(x.id);
  }
  if(drop.size)state.expenses=(state.expenses||[]).filter(x=>!drop.has(x.id));
  return drop.size
}
async function confirmStatementImport(){
  if(statementImportMeta?.importBlocked){alert('Banka ekstre toplamları işlem satırlarıyla uyuşmuyor. Güvenlik nedeniyle içe aktarma kapalı.');return}
  if(statementImportBusy){showToast('EKSTRE KAYDI DEVAM EDİYOR');return}
  statementImportBusy=true;
  try{
  const c=state.cards.find(x=>x.id===statementImportCardId);if(!c)throw new Error('Seçilen kart artık bulunamadı.');
  const checks=[...document.querySelectorAll('[data-stmt-check]')],selected=[];let skipped=0;
  for(const el of checks){if(!el.checked)continue;const i=+el.dataset.stmtCheck,r=statementImportRows[i];if(!r)continue;const date=document.querySelector(`[data-stmt-date="${i}"]`)?.value||r.date,title=stmtCleanTitle(document.querySelector(`[data-stmt-title="${i}"]`)?.value||r.title),amount=Number(document.querySelector(`[data-stmt-amount="${i}"]`)?.value),categoryRaw=document.querySelector(`[data-stmt-category="${i}"]`)?.value||r.category,category=r.payment?'Kart Ödemesi':C.includes(categoryRaw)?categoryRaw:'Diğer';if(!stmtValidIsoDate(date)||!title||!Number.isFinite(amount)||amount===0){skipped++;continue}const kindSel=document.querySelector(`[data-stmt-kind="${i}"]`)?.value||r.kind||'spend',kind=['spend','fee','payment','refund'].includes(kindSel)?kindSel:'spend',finalCategory=kind==='payment'?'Kart Ödemesi':kind==='fee'?'Vergi & Faiz':category;const chosenMatchId=document.querySelector(`[data-stmt-match="${i}"]`)?.value||'';selected.push({...r,date,title,amount:Math.abs(amount),category:finalCategory,kind,payment:kind==='payment',refund:kind==='refund',chosenMatchId})}
  if(!selected.length)throw new Error('Eklenecek geçerli hareket seçilmedi.');
  // Kayıt öncesi yalnızca aynı fiziksel parser bloğunun tekrarını kaldır.
  // Semantik olarak aynı olan gerçek tekrarları (örn. aynı gün 3 x 45,50 TL toplu taşıma) koru.
  const uniqueSelected=[];const selectedSeen=new Set();
  for(const r of selected){const k=r.physicalKey||null;if(k&&selectedSeen.has(k)){skipped++;continue}if(k)selectedSeen.add(k);uniqueSelected.push(r)}
  selected.length=0;selected.push(...uniqueSelected);
  state.statementCategoryRules=state.statementCategoryRules&&typeof state.statementCategoryRules==='object'?state.statementCategoryRules:{};for(const r of selected.filter(x=>!x.payment&&x.kind!=='fee')){const k=stmtMerchantKey(r.title),auto=stmtCategoryBase(r.title);if(k&&r.category&&r.category!==auto)state.statementCategoryRules[k]=r.category}
  const month=statementImportMonthForRows(c,selected),period=statementPeriodRange(c,month),preserveBalance=+c.balance||0;
  const replace=document.getElementById('stmtReplacePeriod')?.checked!==false;
  if(replace){const inPeriod=x=>String(x?.date||'')>=period.start&&String(x?.date||'')<=period.end;state.expenses=(state.expenses||[]).filter(x=>!(x.importedFromStatement&&x.cardId===c.id&&(inPeriod(x)||(x.statementImportMonth&&x.statementImportMonth===month)||statementMonthFor(c,x.date)===month)));state.cardPayments=(state.cardPayments||[]).filter(x=>!(x.importedFromStatement&&x.cardId===c.id&&(inPeriod(x)||(x.statementImportMonth&&x.statementImportMonth===month)||statementMonthFor(c,x.date)===month)))}
  const seen={},paySeen={},payExisting={},manualMatchedIds=new Set();let added=0,payAdded=0,feeAdded=0;
  for(const p of (state.cardPayments||[])){const k=[p.cardId,p.date,stmtCleanTitle(p.title||'KART ÖDEMESİ').toLocaleUpperCase('tr-TR'),Number(+p.amount||0).toFixed(2)].join('|');payExisting[k]=(payExisting[k]||0)+1}
  for(const r of selected){
    if(r.payment){const pk=[c.id,r.date,stmtCleanTitle(r.title||'KART ÖDEMESİ').toLocaleUpperCase('tr-TR'),Number(r.amount).toFixed(2)].join('|'),ord=(paySeen[pk]=(paySeen[pk]||0)+1);if(ord<=(payExisting[pk]||0)){skipped++;continue}state.cardPayments.push({id:id(),financeLinkId:'fin_'+id(),cardId:c.id,amount:r.amount,date:r.date,title:upper(r.title||'KART ÖDEMESİ'),importedFromStatement:true,statementMatched:true,statementImportMonth:month});payAdded++;continue}
    const signed=r.refund?-Math.abs(r.amount):Math.abs(r.amount),base=stmtFingerprint(c.id,r.date,r.title,signed);
    // S2 FIX: Manuel kayıt eşleştirmesinde banka açıklamasının birebir aynı olması zorunlu değildir.
    // Ana anahtar: aynı kart + aynı tarih + aynı tutar. Kategori ve başlık yalnızca en iyi adayı seçmek için kullanılır.
    const manualDup=r.chosenMatchId?(state.expenses||[]).find(x=>x.id===r.chosenMatchId&&!x.importedFromStatement&&x.source==='card'&&x.cardId===c.id&&!manualMatchedIds.has(x.id)):null;
    if(manualDup){manualMatchedIds.add(manualDup.id);manualDup.financeLinkId=manualDup.financeLinkId||'fin_'+id();manualDup.statementMatched=true;manualDup.statementImportMonth=month;manualDup.statementMatchFingerprint=base;manualDup.statementTitle=upper(r.title);manualDup.bankStatementTitle=upper(r.title);manualDup.statementMatchDate=r.date;skipped++;continue}
    const ord=(seen[base]=(seen[base]||0)+1),ex={id:id(),financeLinkId:'fin_'+id(),statementMatched:true,title:upper(r.title),amount:signed,actualAmount:signed,date:r.date,category:r.category,source:'card',cardId:c.id,recurring:false,memberId:'',attachment:'',importBaseFingerprint:base,importFingerprint:`${base}|#${ord}`,importedFromStatement:true,importedRefund:r.refund,statementImportMonth:month,installmentNo:r.installmentNo||null,installmentCount:r.installmentCount||null,totalAmount:r.installmentTotal||null,baseTitle:r.title};state.expenses.push(ex);added++;if(r.kind==='fee')feeAdded++
  }
  const num=id=>{const v=String(document.getElementById(id)?.value||'').trim();if(v==='')return null;const n=Number(v);return Number.isFinite(n)?n:null};
  const previousBalance=num('stmtSummaryPrevious'),spendingInput=num('stmtSummarySpend'),feesTotal=num('stmtSummaryFees'),paymentsInput=num('stmtSummaryPayments'),debtInput=num('stmtSummaryDebt');
  const spendingTotal=spendingInput!=null&&spendingInput>=0?spendingInput:selected.filter(x=>x.kind==='spend').reduce((a,x)=>a+x.amount,0),paymentsTotal=paymentsInput!=null&&paymentsInput>=0?paymentsInput:selected.filter(x=>x.payment).reduce((a,x)=>a+x.amount,0),periodDebt=debtInput!=null&&debtInput>=0?debtInput:null;
  state.statementImports=Array.isArray(state.statementImports)?state.statementImports:[];state.statementImports=state.statementImports.filter(x=>!(x.cardId===c.id&&x.month===month));state.statementImports.push({id:id(),cardId:c.id,month,start:period.start,end:period.end,previousBalance,spendingTotal,feesTotal:feesTotal||0,paymentsTotal,periodDebt,rowCount:added,bankRowCount:(+statementImportMeta.physicalRowCount||selected.length),parsedRowCount:(+statementImportMeta.parsedRowCount||selected.length),unresolvedRowCount:(+statementImportMeta.unresolvedRowCount||0),parserExtraRowCount:(+statementImportMeta.parserExtraRowCount||0),verificationStatus:statementImportMeta.verificationStatus||'partial',fullVerified:!!statementImportMeta.fullVerified,rowEquationOk:!!statementImportMeta.rowEquationOk,rowEquationTotal:Number.isFinite(+statementImportMeta.rowEquationTotal)?+statementImportMeta.rowEquationTotal:null,pageAudit:Array.isArray(statementImportMeta.pageAudit)?statementImportMeta.pageAudit:[],bankProfileId:statementImportMeta.bankProfileId||'',matchedExistingCount:(state.expenses||[]).filter(x=>x.cardId===c.id&&x.statementMatched&&x.statementImportMonth===month&&!x.importedFromStatement).length,newSpendCount:selected.filter(x=>x.kind==='spend'&&!x.chosenMatchId).length,paymentRowCount:payAdded,refundRowCount:selected.filter(x=>x.kind==='refund').length,refundsTotal:selected.filter(x=>x.kind==='refund').reduce((a,x)=>a+Math.abs(+x.amount||0),0),feeRowCount:feeAdded,adjustmentRowCount:(+statementImportMeta.adjustmentRowCount||0),physicalCandidateSamples:Array.isArray(statementImportMeta.physicalCandidateSamples)?statementImportMeta.physicalCandidateSamples.slice(0,8):[],importedAt:iso()});
  const reconciledRemoved=reconcileImportedStatementMultiplicity(c,period,selected);if(reconciledRemoved)skipped+=reconciledRemoved
  recalculateFinanceCore();const syncDebt=document.getElementById('stmtSyncDebt')?.checked&&periodDebt!=null;
  if(syncDebt){c.balanceAnchorDate=period.end;c.balanceAnchorAmount=periodDebt;c.balance=periodDebt+cardDerivedNet(c.id)}else{const derivedNow=cardDerivedNet(c.id);if(c.balanceAnchorDate&&Number.isFinite(+c.balanceAnchorAmount))c.balanceAnchorAmount=preserveBalance-derivedNow;else c.openingBalance=preserveBalance-derivedNow;c.balance=preserveBalance;}
  await save();modal=null;render();showToast(`${Math.max(0,added-feeAdded)} HARCAMA · ${feeAdded} VERGİ/FAİZ · ${payAdded} ÖDEME EKLENDİ${skipped?` · ${skipped} ATLANDI`:''}`)

  } finally { statementImportBusy=false }
}

async function saveCard(d,i){
  const sd=d.statementDate||iso(),dd=d.dueDate||iso();
  const sdate=new Date(sd+'T12:00:00'),ddate=new Date(dd+'T12:00:00');
  if(Number.isNaN(sdate.getTime())||Number.isNaN(ddate.getTime()))throw new Error('KART TARİHLERİ GEÇERSİZ');
  if(ddate<=sdate)throw new Error('SON ÖDEME TARİHİ HESAP KESİM TARİHİNDEN SONRA OLMALI');
  const existing=i?state.cards.find(z=>z.id===i):null,requestedBalance=money2(Number(String(d.balance||'0').replace(',','.'))||0),derived=existing?cardDerivedNet(existing.id):0;
  const sharedLimitGroup=upper(String(d.sharedLimitGroup||'').trim()),sharedLimit=Math.max(0,Number(String(d.sharedLimit||'0').replace(',','.'))||0);
  const x={id:i||id(),bank:upper(d.bank||'BANKA'),name:upper(d.name||'KART'),last4:(d.last4||'0000').replace(/\D/g,'').slice(-4).padStart(4,'0'),limit:money2(+d.limit||0),sharedLimitGroup,sharedLimit:sharedLimitGroup?sharedLimit:0,balance:requestedBalance,openingBalance:requestedBalance-derived,statementDate:sd,dueDate:dd,statementDay:sdate.getDate(),dueDay:ddate.getDate(),style:cardStyleKey(d.style),network:'VISA'};
  if(existing?.balanceAnchorDate&&Number.isFinite(+existing.balanceAnchorAmount)){x.balanceAnchorDate=existing.balanceAnchorDate;x.balanceAnchorAmount=requestedBalance-derived;x.openingBalance=existing.openingBalance}
  if(i){const n=state.cards.findIndex(z=>z.id===i);state.cards[n]={...state.cards[n],...x}}else state.cards.push(x);
  await save();modal=null;render()
}
async function saveCardSpend(d,cardId){
  const c=state.cards.find(x=>x.id===cardId);if(!c)throw new Error('Kart bulunamadı');
  const amount=parseMoneyInput(d.amount);if(!Number.isFinite(amount)||amount<=0)throw new Error('Tutar geçersiz');
  const date=d.date||iso(),title=upper((d.title||d.category||'KART HARCAMASI').trim()),category=d.category||'Diğer',count=d.paymentType==='Taksitli'?Math.max(2,Math.min(36,+d.installmentCount||2)):1,groupId=id();
  state.cardTransactions=state.cardTransactions||[];state.installments=state.installments||[];
  const per=Math.round(amount/count*100)/100;let allocated=0;
  for(let n=1;n<=count;n++){
    const base=new Date(date+'T12:00:00');base.setMonth(base.getMonth()+n-1);const partDate=iso(base),part=n===count?Math.round((amount-allocated)*100)/100:per;allocated+=part;
    const txId=id(),stmt=statementMonthFor(c,partDate),label=count>1?`${title} · ${n}/${count}`:title;
    state.cardTransactions.push({id:txId,cardId,amount:part,totalAmount:amount,title:label,baseTitle:title,category,date:partDate,purchaseDate:date,statementMonth:stmt,attachment:modal?.attachment||'',installmentGroup:groupId,installmentNo:n,installmentCount:count});
    state.expenses.push({id:id(),cardTxId:txId,source:'card',cardId,title:label,baseTitle:title,amount:part,actualAmount:part,totalAmount:amount,category,date:partDate,dueDate:partDate,recurring:false,paid:true,memberId:d.memberId||'',installmentGroup:groupId,installmentNo:n,installmentCount:count});
  }
  state.installments.push({id:groupId,cardId,title,category,totalAmount:amount,count,startDate:date,createdAt:iso()});
  await save();modal=null;render();
}
async function saveCardPayment(d,cardId){
  const c=state.cards.find(x=>x.id===cardId);if(!c)throw new Error('Kart bulunamadı');
  const amount=parseMoneyInput(d.amount);if(!Number.isFinite(amount)||amount<=0)throw new Error('Tutar geçersiz');
  const statementMonth=cardStatementMonth||state.selectedMonth;
  const st=cardPaymentStatus(c,statementMonth);
  if(st.hasStatement&&st.remaining>0&&amount>st.remaining+.01&&!confirm(`Girilen ödeme ${money(amount)}. Bu ekstre için kalan borç ${money(st.remaining)}. Fazla tutarı yine de kaydetmek istiyor musun?`))return;
  state.cardPayments=state.cardPayments||[];
  state.cardPayments.push({id:id(),cardId,amount,date:d.date||iso(),statementMonth,title:c.bank+' '+c.name+' ödeme'});
  await save();modal=null;render();
}
function reportChartSeries(months){
 const [yy,mm]=state.selectedMonth.split('-').map(Number),rows=[];
 for(let n=months-1;n>=0;n--){const d=new Date(yy,mm-1-n,1),m=ym(d),t=totals(m);rows.push({label:d.toLocaleDateString('tr-TR',{month:'short'}).replace('.','').toLocaleUpperCase('tr-TR'),income:t.i,expense:t.e,net:t.r})}
 return rows
}
function setupReportCanvas(c,height=220){const box=c.getBoundingClientRect(),dpr=devicePixelRatio||1,w=Math.max(280,box.width);c.width=w*dpr;c.height=height*dpr;const ctx=c.getContext('2d');ctx.scale(dpr,dpr);return{ctx,w,h:height}}
function drawReportNetChart(){return}
function drawReportFlowChart(){
 const c=$('#reportFlowChart');if(!c)return;const {ctx,w,h}=setupReportCanvas(c,205),rows=reportChartSeries(reportFlowMonths),pad={l:38,r:12,t:14,b:28},max=Math.max(1,...rows.flatMap(x=>[x.income,x.expense])),plotH=h-pad.t-pad.b,plotW=w-pad.l-pad.r;
 ctx.clearRect(0,0,w,h);ctx.font='8px sans-serif';ctx.textAlign='right';ctx.strokeStyle='rgba(105,164,199,.11)';ctx.fillStyle='#71879a';for(let j=0;j<=4;j++){const y=pad.t+plotH*j/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();ctx.fillText(Math.round(max*(1-j/4)/1000)+'K',pad.l-5,y+3)}
 const cs=getComputedStyle(document.documentElement),series=[['income',cs.getPropertyValue('--gi').trim()||'#2bd48e'],['expense',cs.getPropertyValue('--ge').trim()||'#ff616d']];
 series.forEach(([key,color])=>{const pts=rows.map((r,i)=>[pad.l+(rows.length===1?plotW/2:i*plotW/(rows.length-1)),pad.t+plotH-(r[key]/max)*plotH]);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();pts.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],3,0,Math.PI*2);ctx.fillStyle='#071019';ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1.7;ctx.stroke()})});
 ctx.textAlign='center';ctx.fillStyle='#91a7b8';ctx.font='8px sans-serif';rows.forEach((r,i)=>ctx.fillText(r.label,pad.l+(rows.length===1?plotW/2:i*plotW/(rows.length-1)),h-8));
}
function drawChart(){drawReportNetChart();drawReportFlowChart()}
let cropState=null;
function openProfileCrop(file,forSetup=false){const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{cropState={img,zoom:1,x:0,y:0,setup:forSetup,drag:false,sx:0,sy:0,bx:0,by:0};const el=document.createElement('div');el.id='cropOverlay';el.className='cropOverlay';el.innerHTML=`<div class="cropSheet"><div class="cropHead"><b>PROFİL FOTOĞRAFINI AYARLA</b><button id="cropClose">×</button></div><div class="cropStage"><canvas id="cropCanvas" width="320" height="320"></canvas><div class="cropGuide"></div></div><label class="cropZoomLabel">YAKINLAŞTIR / UZAKLAŞTIR</label><input id="cropZoom" type="range" min="1" max="4" step="0.01" value="1"><div class="cropActions"><button class="btn" id="cropCancel">İPTAL</button><button class="btn gold" id="cropUse">KADRAJI KULLAN</button></div></div>`;document.body.appendChild(el);bindCrop()};img.src=r.result};r.readAsDataURL(file)}
function cropGeom(){const c=320,img=cropState?.img;if(!img)return null;const base=Math.max(c/img.width,c/img.height),scale=base*cropState.zoom,w=img.width*scale,h=img.height*scale;return{c,w,h}}
function clampCrop(){const g=cropGeom();if(!g)return;const mx=Math.max(0,(g.w-g.c)/2),my=Math.max(0,(g.h-g.c)/2);cropState.x=Math.max(-mx,Math.min(mx,cropState.x));cropState.y=Math.max(-my,Math.min(my,cropState.y))}
function drawCrop(){const cv=$('#cropCanvas'),g=cropGeom();if(!cv||!g)return;const ctx=cv.getContext('2d');ctx.clearRect(0,0,320,320);ctx.fillStyle='#000';ctx.fillRect(0,0,320,320);ctx.drawImage(cropState.img,(320-g.w)/2+cropState.x,(320-g.h)/2+cropState.y,g.w,g.h);ctx.save();ctx.fillStyle='rgba(0,0,0,.48)';ctx.beginPath();ctx.rect(0,0,320,320);ctx.arc(160,160,128,0,Math.PI*2,true);ctx.fill('evenodd');ctx.restore();ctx.beginPath();ctx.arc(160,160,128,0,Math.PI*2);ctx.strokeStyle='#f1cf7a';ctx.lineWidth=3;ctx.stroke()}
function closeCrop(){document.getElementById('cropOverlay')?.remove();cropState=null;const p=$('#profileInput');if(p)p.value=''}
function bindCrop(){const cv=$('#cropCanvas'),z=$('#cropZoom');drawCrop();z.oninput=e=>{cropState.zoom=+e.target.value;clampCrop();drawCrop()};const pos=e=>{const r=cv.getBoundingClientRect(),p=e.touches?.[0]||e;return{x:(p.clientX-r.left)*320/r.width,y:(p.clientY-r.top)*320/r.height}};const down=e=>{e.preventDefault();const p=pos(e);cropState.drag=true;cropState.sx=p.x;cropState.sy=p.y;cropState.bx=cropState.x;cropState.by=cropState.y};const move=e=>{if(!cropState.drag)return;e.preventDefault();const p=pos(e);cropState.x=cropState.bx+p.x-cropState.sx;cropState.y=cropState.by+p.y-cropState.sy;clampCrop();drawCrop()};const up=()=>cropState.drag=false;cv.addEventListener('pointerdown',down);cv.addEventListener('pointermove',move);cv.addEventListener('pointerup',up);cv.addEventListener('touchstart',down,{passive:false});cv.addEventListener('touchmove',move,{passive:false});cv.addEventListener('touchend',up,{passive:true});$('#cropClose').onclick=closeCrop;$('#cropCancel').onclick=closeCrop;$('#cropUse').onclick=async()=>{const g=cropGeom(),tmp=document.createElement('canvas');tmp.width=320;tmp.height=320;tmp.getContext('2d').drawImage(cropState.img,(320-g.w)/2+cropState.x,(320-g.h)/2+cropState.y,g.w,g.h);const out=document.createElement('canvas');out.width=512;out.height=512;out.getContext('2d').drawImage(tmp,32,32,256,256,0,0,512,512);const data=out.toDataURL('image/jpeg',.88),setup=cropState.setup;closeCrop();if(setup){setupPhoto=data;return}state.profile.photo=data;await save();render();showToast('PROFİL FOTOĞRAFI KAYDEDİLDİ')}}
function readImg(f,cb,max=420){const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{let w=img.width,h=img.height,s=Math.min(1,max/Math.max(w,h));w=Math.round(w*s);h=Math.round(h*s);const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);cb(c.toDataURL('image/jpeg',.78))};img.src=r.result};r.readAsDataURL(f)}

async function backupNow(){
  let completed=false;
  await beginStorageExclusive('backup');
  try{
    const m=meta()||{},stored=localStorage.getItem(DATA);
    if(!m.salt||!stored)throw new Error('Yedeklenecek şifreli veri bulunamadı.');
    const p={format:'HANE-LOCKED-BACKUP',meta:{salt:m.salt},data:JSON.parse(stored),date:new Date().toISOString()},b=new Blob([JSON.stringify(p)],{type:'application/octet-stream'}),u=URL.createObjectURL(b),a=document.createElement('a');
    a.href=u;a.download='HANE-'+iso()+'.hane';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);completed=true;
  }catch(err){
    console.error('HANE backup error',err);
    alert('YEDEK OLUŞTURULAMADI: '+(err.message||err));
  }finally{
    endStorageExclusive();
  }
  if(completed){state.settings=state.settings||{};state.settings.hanLastBackupAt=new Date().toISOString();await save();showToast('YEDEK OLUŞTURULDU')}
}

async function changePin(){
  const o=prompt('Mevcut PIN');
  if(!o)return;
  const n=prompt('Yeni 4 haneli PIN');
  if(!/^\d{4}$/.test(n||'')){alert('PIN 4 haneli olmalı');return}
  await beginStorageExclusive('pin-change');
  try{
    // Önce bekleyen kayıtlar diske tamamlanır, sonra mevcut PIN en güncel veri üzerinde doğrulanır.
    if(!(await unlock(o))){alert('PIN yanlış');return}
    recalculateFinanceCore();
    const salt=crypto.getRandomValues(new Uint8Array(16)),k=await derive(n,salt),snapshot=cloneStateSnapshot(state),box=await encrypt(snapshot,k),nextData=JSON.stringify(box),nextMeta=JSON.stringify({salt:b64(salt)});
    commitEncryptedPair(nextMeta,nextData);
    key=k;
    alert('PIN değiştirildi');
  }catch(err){
    console.error('HANE PIN change error',err);
    alert('PIN DEĞİŞTİRİLEMEDİ: '+(err.message||err));
  }finally{
    endStorageExclusive();
  }
}
function schedule(){clearTimeout(timer);if(state)timer=setTimeout(lock,Math.max(1,+state.settings.lockMinutes||15)*60000)}function lock(){state=null;key=null;pin='';renderLock()}
function renderSetup(){$('#app').innerHTML=`<div class="setup premiumSetup"><div class="setupOfficialLogo">${haneFullLogo("setupBrandLogo")}</div><p class="setupBrandLine">HAYATINA DENGE KAT</p><form class="form" id="setupForm" style="width:100%"><button type="button" class="btn" id="photoBtn">PROFİL RESMİNİ DEĞİŞTİR</button>${input('name','İsim','')}${input('pin','4 Haneli PIN','','password','inputmode="numeric" maxlength="4"')}${input('pin2','PIN Tekrar','','password','inputmode="numeric" maxlength="4"')}<button class="btn gold">HANE’Yİ KUR</button></form><div class="notice" style="margin-top:12px;width:100%">İlk kurulumda tüm tutarlar ₺0 başlar.</div></div>`;$('#photoBtn').onclick=()=>$('#profileInput').click();$('#setupForm').onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target).entries());if(!/^\d{4}$/.test(d.pin)||d.pin!==d.pin2){alert('PIN 4 haneli ve aynı olmalı');return}const st=def();st.profile.name=upper(d.name||'HANE');st.profile.photo=setupPhoto;await setup(d.pin,st);render();schedule()}}
function dailyLockQuote(){
  const quotes=[
    'Küçük adımlar, büyük değişimler başlatır.',
    'Bugünün disiplini, yarının özgürlüğüdür.',
    'İstikrar, motivasyonun yetişemediği yerde devam eder.',
    'Planını sade tut, ilerlemeni görünür kıl.',
    'Her gün biraz daha iyi, uzun vadede çok daha güçlü.',
    'Kontrol edebildiğine odaklan, gerisini bırak.',
    'Bir hedefi büyüten şey, her gün atılan küçük adımdır.',
    'Başlamak cesaret, sürdürmek disiplindir.',
    'Bugün yaptığın seçimler yarının düzenini kurar.',
    'Az ama sürekli ilerlemek, hızlı başlayıp durmaktan iyidir.',
    'Net hedef, sakin zihin, düzenli adım.',
    'Kendinle yarış; dünkü halinden bir adım öne geç.',
    'Düzen kurulduğunda karar vermek kolaylaşır.',
    'Büyük sonuçlar, tekrar edilen küçük doğrulardan doğar.',
    'Zamanını yöneten, yönünü de yönetir.',
    'Bugünün emeği yarının rahatlığıdır.',
    'Kararlılık, zor günlerde de plana sadık kalmaktır.',
    'İlerlemenin sırrı kusursuzluk değil, devamlılıktır.',
    'Hedefini hatırla, adımını bugün at.',
    'Bir gün değil, her gün.',
    'Sabırla kurulan düzen kalıcı olur.',
    'Küçük kazanımları biriktir, büyük farkı zaman oluştursun.',
    'Enerjini dağıtma; önemli olana yönelt.',
    'Planla, takip et, geliştir.',
    'Daha iyi bir yarın, düzenli bir bugünle başlar.',
    'İyi alışkanlıklar sessizce büyük sonuçlar üretir.',
    'Bugün tamamladığın iş, yarının yükünü azaltır.',
    'Hızdan önce yönünü doğru seç.',
    'Her tekrar seni hedefe biraz daha yaklaştırır.',
    'Kendine verdiğin sözü tut.',
    'İlerlemeni ölç; emeğini küçümseme.'
  ];
  const d=new Date(),stamp=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()),day=Math.floor(stamp/86400000);
  return quotes[((day%quotes.length)+quotes.length)%quotes.length];
}
function renderLock(){
  if(!meta()){renderSetup();return}
  pin='';
  const preview=state?.profile||getLockPreview()||{},photo=(preview.photo||''),initial=esc(((preview.name||'H')+'').trim()[0]||'H');
  const dailyQuote=esc(dailyLockQuote());
  $('#app').innerHTML=`<div class="lock hanePremiumLock haneLockV21"><div class="hplAura hplAuraLeft"></div><div class="hplAura hplAuraRight"></div><main class="hplPanel"><div class="hplBrand hplBrandUnified"><img class="hplUnifiedBrandLogo" src="icons/hane-brand-lock-horizontal.jpg?v=lock-v21" alt="HANE · HAYATINA DENGE KAT"></div><div class="hplDailyQuote"><span class="hplQuoteMark">“</span><p>${dailyQuote}</p></div><div class="hplPortraitShell"><div class="hplPortrait">${photo?`<img src="${photo}" alt="Profil" data-lock-profile-image>`:`<div class="portraitFallback">${initial}</div>`}</div></div><div class="hplGreeting"><small>HOŞ GELDİN</small><b>${esc(preview.name||'PROFİL ADI')}</b></div><div class="pinDots hplDots">${[0,1,2,3].map(i=>`<i data-dot="${i}"></i>`).join('')}</div><div class="keypad hplKeypad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button type="button" data-key="${n}">${n}</button>`).join('')}<button type="button" class="backKey" data-key="del">←</button><button type="button" data-key="0">0</button><button type="button" class="del" data-key="del">⌫</button></div><div class="hplFooter"><span>PLANLA</span><span>TAKİP ET</span><span>GELİŞ</span></div></main></div>`;
  const lockImg=$('[data-lock-profile-image]');
  if(lockImg)lockImg.addEventListener('error',()=>{lockImg.remove();const p=document.querySelector('.hplPortrait');if(p)p.innerHTML=`<div class="portraitFallback">${initial}</div>`});
  $$('[data-key]').forEach(b=>b.onclick=()=>{pinKey(b.dataset.key)});
  installPinKeyboard()
}
async function pinKey(k){if(k==='del')pin=pin.slice(0,-1);else if(/^\d$/.test(String(k))&&pin.length<4)pin+=String(k);$$('[data-dot]').forEach((d,i)=>d.classList.toggle('on',i<pin.length));if(pin.length===4)setTimeout(()=>confirmPin(),140)}
function installPinKeyboard(){if(window.__hanePinKeyboardInstalled)return;window.__hanePinKeyboardInstalled=true;document.addEventListener('keydown',e=>{if(state||!document.querySelector('.haneSignatureLock, .haneUltraLock, .hanePremiumLock'))return;const k=e.key;if(/^\d$/.test(k)){e.preventDefault();pinKey(k);return}if(k==='Backspace'||k==='Delete'){e.preventDefault();pinKey('del');return}if(k==='Enter'||k==='NumpadEnter'){e.preventDefault();if(pin.length===4)confirmPin()}})}
async function confirmPin(){
  if(pin.length!==4){alert('4 HANELİ PIN GİR');return}
  const entered=pin;
  try{
    const ok=await unlock(entered);
    if(!ok){pin='';$$('[data-dot]').forEach(d=>d.classList.remove('on'));alert('PIN YANLIŞ');return}
    pin='';
    // Kilit açıldıktan sonra eski veriden kalan eksik alanları bir kez daha güvenli biçimde tamamla.
    state=normalizeV19(state||def());
    bindFinanceCoreState();
    recalculateFinanceCore();
    current='home';modal=null;navHistory=[];
    render();
    schedule();
  }catch(err){
    console.error('HANE unlock/render error',err);
    pin='';
    // PIN doğrulandıysa kullanıcıyı kilit ekranında bırakma. Hata ayrıntısını veri silmeden görünür kıl.
    const app=document.getElementById('app');
    if(app)app.innerHTML=`<main class="phone"><div class="content"><div class="notice" style="margin:24px"><b>HANE AÇILIŞ HATASI</b><br><br>${esc(String(err?.message||err))}<br><br><button class="btn gold" id="haneRetryAfterUnlock">TEKRAR DENE</button></div></div></main>`;
    document.getElementById('haneRetryAfterUnlock')?.addEventListener('click',()=>{try{current='home';modal=null;render();schedule()}catch(e){console.error(e)}});
  }
}
function modalWrap(){return modal?`<div class="modal"><div class="sheet"><div class="sheetHead"><b>${esc(modal.title)}</b><button class="close" data-action="close">×</button></div>${modal.body}</div></div>`:''}
function render(){captureModalFormDraft();if(state)initBrowserNav();applyTheme();$('#app').innerHTML=`<main class="phone">${buildTopBar()}<div class="content">${view()}</div>${nav()}</main>${modalWrap()}`;bind();restoreModalFormDraft();if(returnScrollTop!=null){const y=returnScrollTop;returnScrollTop=null;requestAnimationFrame(()=>{const c=document.querySelector('.content');if(c)c.scrollTop=y})}if(current==='reports')requestAnimationFrame(drawChart)}



function bootHane(){
  try{
    recoverStorageTransaction();
    const profileInput=document.getElementById('profileInput');
    const receiptInput=document.getElementById('receiptInput');
    const restoreInput=document.getElementById('restoreInput');
    const statementImportInput=document.getElementById('statementImportInput');
    const appRoot=document.getElementById('app');
    if(!appRoot) throw new Error('Uygulama kök alanı bulunamadı');

    if(profileInput){
      profileInput.addEventListener('change',e=>{
        const f=e.target.files&&e.target.files[0];if(!f)return;
        if(!String(f.type||'').startsWith('image/')){alert('LÜTFEN BİR RESİM SEÇ');return}
        openProfileCrop(f,!state);
      });
    }
    if(receiptInput){
      receiptInput.addEventListener('change',e=>{
        const f=e.target.files&&e.target.files[0];if(!f||!modal)return;
        readImg(f,x=>{if(!modal)return;rememberModalForm();modal.attachment=x;const st=document.getElementById('expenseReceiptStatus');if(st)st.style.display='block';const btn=document.getElementById('expenseReceiptBtn');if(btn)btn.textContent='✓ FİŞ / FOTOĞRAF HAZIR';e.currentTarget.value=''},1280);
      });
    }

    if(statementImportInput){
      statementImportInput.addEventListener('change',async e=>{
        const input=e.currentTarget,f=input.files&&input.files[0];if(!f||!statementImportCardId)return;
        open('EKSTRE OKUNUYOR',`<div class="notice"><b id="statementImportProgress">DOSYA HAZIRLANIYOR...</b><br>Ekstre dosyası cihazdan dışarı gönderilmez. HANE yalnızca seçilen dosya türü için gereken okuma motorunu hazırlar; okuma cihazında yapılır. Yalnızca tarih, açıklama, tutar ve kategori HANE’a kaydedilir.</div>`,{cardId:statementImportCardId});
        try{const text=await readStatementFile(f);const parsedRows=parseStatementText(text,statementImportCardId);let meta=normalizeStatementSummary(text,parsedRows,parseStatementSummary(text));const reconciled=stmtReconcileRowsToBankSpending(parsedRows,meta);meta=stmtFinalizeSummaryConfidence(meta,reconciled.rows);const detected=stmtDetectBank(text,statementImportCardId);meta=stmtApplyAuditDiagnostics(meta,reconciled.rows,text,detected.id,statementReadDiagnostics);
        // V92 — Halkbank/Paraf koordinat audit son-mutabakatı.
        // Halkbank PDF.js katmanı bazı gerçek tablo satırlarını aynı fiziksel hareketin yankısı olarak
        // iki kez verebiliyor. Reconcile katmanı bu yankıyı yalnız banka etiketli harcama toplamına
        // BİREBİR ulaşan, tek ve güvenli tekrar kümesi olduğunda kaldırır. Bu durumda ham fiziksel
        // sayaçta kalan aynı yankıları "çözümlenemeyen" diye göstermek yanlıştı (12/9, 41/39, 34/31).
        // Yalnız Halkbank + gerçekten kaldırılmış yankı + farkın tam olarak kaldırılan satır sayısı
        // kadar olması halinde audit sayacı nihai parser satır kümesine eşitlenir. Bu işlem yalnız fiziksel
        // audit sayacını uzlaştırır; muhasebe/toplam doğrulaması ayrıca aynen devam eder. Parser satırlarına, diğer bankalara ve gerçek eksik satırlara dokunulmaz.
        if(detected.id==='halkbank'&&(+reconciled.removed||0)>0&&(+meta.physicalRowCount||0)>(+meta.parsedRowCount||0)&&((+meta.physicalRowCount||0)-(+meta.parsedRowCount||0))===(+reconciled.removed||0)){
          meta.halkbankPhysicalEchoRemoved=+reconciled.removed||0;
          meta.physicalRowCount=meta.parsedRowCount;
          meta.unresolvedRowCount=0;
          meta.parserExtraRowCount=0;
          meta.halkbankCoordinateAuditVerified=true;
          // Audit sayacı düzeltildikten sonra doğrulama durumunu da nihai sayaçlarla yeniden hesapla.
          const hbTypeOk=!!meta.typeTotalsMatch;
          const hbCountOk=meta.physicalRowCount===meta.parsedRowCount;
          if(hbCountOk&&hbTypeOk&&(meta.rowEquationOk||meta.summaryTrusted)){
            meta.fullVerified=true;meta.verificationStatus='verified';meta.unverifiedParserExtraRowCount=0;
          }
        }
        // V93 — TEB son savunma: bağımsız fiziksel sayaç gerçekten kullanılamıyorsa (0),
        // parserın bulduğu hareketleri fazla aday olarak göstermek mantıksal olarak imkansızdır.
        // Bu UI/guard öncesi ikinci koruma, eski meta alanından sızan 8/44 gibi sahte 'fazla aday'ı kapatır.
        if(detected.id==='teb'&&(+meta.physicalRowCount||0)===0&&(+meta.parsedRowCount||reconciled.rows.length)>0){
          meta.tebPhysicalUnavailable=true;
          meta.physicalRowCount=0;meta.unresolvedRowCount=0;meta.parserExtraRowCount=0;meta.unverifiedParserExtraRowCount=0;
          const tebCountIndependent=true;
          if(tebCountIndependent&&meta.typeTotalsMatch&&(meta.rowEquationOk||meta.summaryTrusted)){meta.fullVerified=true;meta.verificationStatus='verified'}
          else if(!(meta.unresolvedRowCount||meta.unverifiedParserExtraRowCount)){meta.verificationStatus=meta.typeTotalsMatch?'partial':'review'}
        }
        meta.autoDuplicateRemoved=reconciled.removed||0;meta.autoDuplicateAmount=reconciled.amount||0;meta.autoFeeReclassified=reconciled.reclassified||0;meta.autoFeeReclassifiedAmount=reconciled.reclassifiedAmount||0;const guard=stmtImportGuardStatus(meta,reconciled.rows,detected.id,statementImportCardId);meta.importBlocked=guard.blocked;meta.importGuardReasons=guard.reasons;meta.bankProfileId=detected.id;statementImportMeta=meta;open('EKSTRE ÖNİZLEME',statementPreview(statementImportCardId,reconciled.rows),{cardId:statementImportCardId})}catch(err){console.error(err);open('EKSTRE OKUNAMADI',`<div class="notice">${esc(err.message||'Dosya okunamadı.')}</div>`,{cardId:statementImportCardId})}finally{input.value=''}
      });
    }

    if(restoreInput){
      restoreInput.addEventListener('change',async e=>{
        const input=e.currentTarget;
        const f=input.files&&input.files[0];
        if(!f)return;
        try{
          const raw=await f.text();
          let p;
          try{p=JSON.parse(raw)}catch{throw new Error('DOSYA OKUNAMADI')}
          if(!p||typeof p!=='object')throw new Error('YEDEK İÇERİĞİ GEÇERSİZ');
          if(p.format!=='HANE-LOCKED-BACKUP')throw new Error('BU DOSYA HANE YEDEĞİ DEĞİL');
          if(!p.meta||!p.data||!p.meta.salt||!p.data.iv||!p.data.data)throw new Error('ŞİFRELİ YEDEK EKSİK VEYA BOZUK');
          const backupPin=prompt('Bu yedeğin PIN kodunu gir');
          if(!backupPin)throw new Error('GERİ YÜKLEME İPTAL EDİLDİ');
          let testState,backupKey;
          try{
            backupKey=await derive(backupPin,ub64(p.meta.salt));
            testState=await decrypt(p.data,backupKey);
            if(!testState||typeof testState!=='object'||!Array.isArray(testState.expenses)||!Array.isArray(testState.incomes))throw new Error('YEDEK VERİ YAPISI GEÇERSİZ');
            normalizeV19(testState);
          }catch{throw new Error('YEDEK PIN YANLIŞ VEYA DOSYA BOZUK')}
          // Yedek doğrulanmadan mevcut veri değişmez. Önce bekleyen tüm kayıtlar bitirilir,
          // sonra geri yükleme özel kilit altında tek işlem olarak yazılır.
          await beginStorageExclusive('restore');
          try{
            commitEncryptedPair(JSON.stringify({salt:p.meta.salt}),JSON.stringify(p.data));
            input.value='';
            alert('YEDEK DOĞRULANDI VE GERİ YÜKLENDİ. HANE YENİDEN AÇILACAK.');
            // Başarılı restore sonrasında eski oturumun hiçbir save() işlemi yeni yedeğin üstüne yazamaz.
            abortStorageExclusiveWaiters('Yedek geri yüklendi; uygulama yeniden açılıyor.');
            location.reload();
            return;
          }catch(restoreWriteErr){
            endStorageExclusive();
            throw restoreWriteErr;
          }
        }catch(err){
          console.error('HANE restore error',err);
          input.value='';
          alert('YEDEK AÇILAMADI: '+(err.message||err));
        }
      });
    }
    ['click','touchstart','keydown'].forEach(ev=>document.addEventListener(ev,()=>{if(state)schedule()},{passive:true}));
    renderLock();
  }catch(err){
    console.error('HANE boot error',err);
    const app=document.getElementById('app');
    if(app){app.innerHTML='<div style="min-height:100vh;background:#000;color:#fff;padding:32px;font-family:sans-serif"><h2 style="color:#d8ad4f">HANE başlatılamadı</h2><p>'+esc(String(err.message||err))+'</p><button id="haneRetryBoot" style="padding:12px 16px">Tekrar Dene</button></div>';document.getElementById('haneRetryBoot')?.addEventListener('click',()=>location.reload())}
  }
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootHane,{once:true});
else bootHane();
