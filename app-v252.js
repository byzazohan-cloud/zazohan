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
const enc=new TextEncoder(),dec=new TextDecoder();let state=null,key=null,current='home',modal=null,pin='',timer=null,setupPhoto='',themeDraft=null,reportPeriod='month',reportCustomStart='',reportCustomEnd='',txFilter='all',txView='list',financeTab='cards',navHistory=[],calendarMonth='',calendarDay='',calendarView='month',txSearch='',txDate='',txCategory='',txPay='',txMin='',txMax='',txMember='',cardStatementMonth='',financeCardIndex=0,reportView='summary',reportMonths=6,reportFlowMonths=6,reportCategoryMonths=1,hanFilter='TÜMÜ',hanSeverity='TÜMÜ',zWorkFilter='all';
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
  build:'20261003-HANE-WORK-V248-WORK-PAYMENT-STATUS',
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
  names.forEach(name=>{const cid=financeCategoryId(name),prev=st.categoryRegistry[cid]||{};st.categoryRegistry[cid]={...prev,id:cid,name,meta:{...(prev.meta||{}),...(st.categoryMeta?.[name]||{})}}});
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
 const screenFns={home,transactions,fixed,cards,calendar,reports,cashMoney,han:hanPage,profile,adminProfile,backup,settings,categories,theme,alerts,about,monthSpent,monthPaid,members,homeEdit,notes,workCenter};Object.entries(screenFns).forEach(([k,v])=>{if(typeof v!=='function')add('bad','EKRANLAR','EKRAN FONKSİYONU EKSİK',`${k} ekranı oluşturulamıyor.`)});
 const requiredNav=['home','transactions','fixed','cards','calendar','reports','workCenter','han','profile','backup','settings'];requiredNav.forEach(k=>{if(typeof screenFns[k]!=='function')add('bad','NAVİGASYON','NAVİGASYON HEDEFİ EKSİK',`${k} hedefi bulunamadı.`)});if(typeof goTo!=='function'||typeof goBack!=='function')add('bad','NAVİGASYON','GEZİNME MOTORU EKSİK','goTo/goBack fonksiyonlarından biri bulunamadı.');
 // CACHE-BUILD: bu paket içindeki çalışma sürümü tek kimlikte olmalı.
 const runtimeBuild=String(HANE_UI?.build||'');if(runtimeBuild!=='20261003-HANE-WORK-V248-WORK-PAYMENT-STATUS')add('warn','CACHE-BUILD','BUILD KİMLİĞİ UYUŞMUYOR',`Çalışan arayüz kimliği: ${runtimeBuild||'yok'}. Beklenen: 20261003-HANE-WORK-V248-WORK-PAYMENT-STATUS.`);
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
   const links=zdb.links||[], lk=new Set();links.forEach(l=>{const k=[l.type,l.haneId||'',l.workId||'',l.financeId||''].join('|');if(lk.has(k))add('warn','BAĞLANTILAR','MÜKERRER MERKEZİ BAĞLANTI',`${l.type||'BAĞLANTI'} · aynı bağlantı birden fazla kayıtlı.`);else lk.add(k)});
   if(!zdb.finance||!Array.isArray(zdb.finance.expenses)||!Array.isArray(zdb.work?.records))add('bad','MERKEZ','MERKEZİ ŞEMA EKSİK','Finans veya çalışma veri alanları beklenen yapıda değil.');
   const hs=zdb.migration?.lastHaneSyncAt;if(!hs)add('warn','MERKEZ','HANE MERKEZ SENKRONU YOK','Merkezi çekirdekte HANE senkron zamanı bulunamadı.');
   const centralHaneWork=(zdb.work?.records||[]).filter(x=>x._source==='HANE').length;if(centralHaneWork!==works.length)add('warn','MERKEZ','ÇALIŞMA MERKEZ SAYISI UYUŞMUYOR',`Uygulama ${works.length} · merkez HANE kaynağı ${centralHaneWork}.`);
   const centralHaneExp=(zdb.finance?.expenses||[]).filter(x=>x._source==='HANE').length;if(centralHaneExp!==(state.expenses||[]).length)add('warn','MERKEZ','GİDER MERKEZ SAYISI UYUŞMUYOR',`Uygulama ${(state.expenses||[]).length} · merkez HANE kaynağı ${centralHaneExp}.`);
  }
 }catch(e){add('bad','MERKEZ','FULL AUDIT ÇALIŞTIRILAMADI',String(e?.message||e));}
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
function hanInspectBody(title,detail,action,id,id2=''){const key=hanIssueKey(title,id,id2,action),why=hanReasonFor(title);const explain=`<div class="hanExplain"><div><small>NE BULDU?</small><b>${esc(detail)}</b></div><div><small>NEDEN BULDU?</small><span>${esc(why)}</span></div></div>`;if(action==='hanStatementReview'){const c=(state.cards||[]).find(x=>String(x.id)===String(id)),rows=(state.expenses||[]).filter(x=>String(x.cardId)===String(id)&&x.statementImportMonth===id2&&x.importedFromStatement);return `${explain}<div class="section"><b>EKSTRE / HANE İNCELEMESİ</b><span>${esc(c?.bank||'Kart')} · ${esc(id2||'')}</span></div><button class="btn" data-action="hanOpenStatementInspect" data-record-id="${esc(id)}" data-month="${esc(id2)}">EKSTREYİ AÇ</button><div class="section"><b>İÇE AKTARILAN HANE KAYITLARI</b><span>${rows.length} kayıt</span></div>${rows.length?rows.map(x=>hanRecordCard(x.id)).join(''):'<div class="notice">Bu dönem için düzenlenebilir içe aktarılmış HANE kaydı bulunamadı.</div>'}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice hanSafety">Banka PDF satırları doğrudan silinmez. Düzenle / Sil yalnız seçtiğin gerçek HANE kaydını etkiler.</div>`}if(action==='roadFeeGroup'){const rows=roadFeeItemsForDate(id),total=rows.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);return `${explain}<div class="section"><b>AYNI GÜN ULAŞIM KAYITLARI</b><span>${rows.length} kayıt · ${money(total)}</span></div>${rows.map(x=>hanRecordCard(x.id)).join('')}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice hanSafety">Bu seçim finansal kayıtları değiştirmez; HAN bu uyarıyı tekrar göstermez.</div>`}if(action==='categoryDayGroup'){const rows=(state.expenses||[]).filter(x=>!x.recurring&&String(x.date||'')===String(id)&&String(x.category||'Diğer')===String(id2)),total=rows.reduce((n,x)=>n+(+(x.actualAmount??x.amount)||0),0);return `${explain}<div class="section"><b>${esc(id2||'KATEGORİ')} · ${esc(id||'')}</b><span>${rows.length} kayıt · ${money(total)}</span></div>${rows.map(x=>hanRecordCard(x.id)).join('')}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice hanSafety">Kayıtlardan biri değişirse HAN bu kararı otomatik geçersiz sayar ve grubu yeniden inceler.</div>`}if(action==='sharedLimitGroup'){const rows=(state.cards||[]).filter(x=>String(x.sharedLimitGroup||'').trim()===String(id)),limit=Math.max(0,...rows.map(x=>+x.sharedLimit||0)),used=rows.reduce((n,x)=>n+Math.max(0,+x.balance||0),0);return `${explain}<div class="section"><b>ORTAK LİMİT · ${esc(id||'')}</b><span>${rows.length} kart · ${money(used)} / ${money(limit)}</span></div>${rows.map(c=>`<div class="notice hanCompare"><b>${esc(c.bank||'')} · ${esc(c.name||'KART')}</b><br><span>Borç ${money(+c.balance||0)} · ortak limit ${money(+c.sharedLimit||0)}</span><div class="hanReviewActions"><button class="btn" data-action="hanEditFromInspect" data-record-action="editCard" data-record-id="${esc(c.id)}">DÜZENLE</button></div></div>`).join('')}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice hanSafety">Kartlardan birinin borcu veya ortak limit tanımı değişirse HAN bu grubu yeniden denetler.</div>`}const one=action==='editExpense'?hanRecordCard(id):hanGenericRecordCard(action,id);const two=id2?(action==='editExpense'?hanRecordCard(id2):hanGenericRecordCard(action,id2)):'';return `${explain}<div class="section"><b>İLGİLİ KAYITLAR</b><span>Kararı sen verirsin</span></div>${one}${two}<button class="btn gold" data-action="hanIssueOk" data-issue-key="${esc(key)}">BUNDA SIKINTI YOK</button><div class="notice hanSafety">Düzenle veya Sil yalnız seçtiğin gerçek HANE kaydını etkiler. “Bunda Sıkıntı Yok” finansal kaydı değiştirmez ve bu HAN uyarısını kapatır.</div>`}
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
function hanAuditCompat(){return hanAudit()}
function hanPage(){return han()}

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
function def(){return{version:19,selectedMonth:ym(new Date()),profile:{name:'',photo:'',username:'',city:'',job:'',birthDate:'',memberSince:'',motto:'Disiplin, özgürlüğün kapısını açar.'},settings:{lockMinutes:15,leadDays:3,notifications:false,darkMode:true},theme:{bg:'#05080d',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'},incomes:[],expenses:[],cards:[],accounts:[],flexAccounts:[],customCategories:[],categoryMeta:{},cardTransactions:[],cardPayments:[],statementImports:[],statementCategoryRules:{},fixedPayments:[],flexTransactions:[],installments:[],statements:[],investments:[],notes:[],reminders:[],work:[],receivables:[],workPayments:[],workRoads:[],workDeductions:[],cashGiven:[],cashManual:[],cashExcluded:[],members:[{id:'me',name:'BEN',icon:'👤'}],homeLayout:['summary','quick','monthly','recent'],homeHidden:[]}}
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
function statementSnapshot(cardId,m){return (state.statementImports||[]).find(x=>x.cardId===cardId&&x.month===m)||null}
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
  return `<div class="statementV60"><div class="statementHead statementV60Head"><button data-action="cardStatementShift" data-dir="-1" data-id="${c.id}">‹</button><div><small>EKSTRE DÖNEMİ</small><b>${period.label}</b></div><button data-action="cardStatementShift" data-dir="1" data-id="${c.id}">›</button></div><div class="statementActionBox"><div class="statementActionBoxTitle">KART İŞLEMLERİ</div><div class="statementActionMenuPanel"><button data-action="statementImport" data-id="${c.id}"><i>⌁</i><span>EKSTRE OKU</span></button><button data-action="cardSpend" data-id="${c.id}"><i>＋</i><span>HARCAMA EKLE</span></button><button data-action="cardPay" data-id="${c.id}"><i>₺</i><span>ÖDEME YAP</span></button></div></div>${bankBox}<div class="statementPrivacyNote statementV60Privacy">🔒 EKSTRE CİHAZDA OKUNUR · BELGE DIŞARI GÖNDERİLMEZ</div><div class="statementV60ListHead"><div><small>DÖNEM HAREKETLERİ</small><b>${items.length} İŞLEM</b></div><span>${money(haneNet)}</span></div><div class="list statementV60List">${items.length?items.map(x=>{const refund=x.kind==='refund',payment=x.kind==='payment',label=payment?'KART ÖDEMESİ':refund?'İADE':x.installmentCount?`TAKSİT ${x.installmentNo||'?'} / ${x.installmentCount}`:x.kind==='fixed'?'GİDER':'HARCAMA',color=payment||refund?'var(--green)':'var(--red)',sign=payment||refund?'−':'+';return `<div class="item statementItem ${refund?'refundItem':''}" data-action="${x.action}" data-id="${x.id}" data-direct-edit="1"><div class="ico premiumIco">${payment?premiumIcon('cards',22):catPremiumIcon(x.category)}</div><div><b>${esc(x.title)}</b><small>${x.date} · ${label}${x.category&&!payment?' · '+esc(x.category):''}</small></div><div class="right"><b style="color:${color}">${sign}${money(Math.abs(x.amount))}</b><small class="tapDetailHint">DÜZENLE / SİL ›</small></div></div>`}).join(''):'<div class="notice">BU EKSTRE DÖNEMİNDE HAREKET YOK.</div>'}</div></div>`
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
  const t={han:'HAN · FİNANSAL DENETİM',transactions:'HAREKETLER',fixed:'GİDERLER',cards:'FİNANS',calendar:'TAKVİM',reports:'RAPORLAR',profile:'PROFİL',adminProfile:'ADMIN PROFİLİ',backup:'YEDEKLEME',settings:'AYARLAR',members:'HANE ÜYELERİ',homeEdit:'ANA SAYFAYI DÜZENLE',categories:'KATEGORİLER',theme:'TEMA STÜDYOSU',alerts:'HATIRLATMALAR',about:'HAKKINDA',monthSpent:'BU AY HARCANAN',monthPaid:'AYLIK HESAP',cashMoney:'NAKİT PARA',notes:'NOTLAR',workCenter:'ÇALIŞMA'};
  return`<div class="top"><button class="back" data-action="back">‹</button><div class="brand">${t[current]||'HANE'}</div><div class="topRight"><button class="ib premiumTopIcon" data-tab="alerts">${premiumIcon('bell',28)}</button><button class="ib premiumTopIcon" data-tab="settings">${premiumIcon('settings',28)}</button></div></div>`
}
function nav(){return`<nav class="nav premiumNav v1947CleanNav">${HANE_UI.nav.map(x=>`<button data-tab="${x.tab}" class="${current===x.tab?'active':''}"><span class="navIcon">${premiumIcon(x.icon,30)}</span><span>${x.label}</span></button>`).join('')}</nav>`}
function menuBody(){const a=[['home','home','ANA SAYFA'],['transactions','transactions','HAREKETLER'],['fixed','expense','GİDERLER'],['cards','cards','KARTLAR / ESNEK HESAP'],['calendar','fixed','TAKVİM'],['workCenter','calendar','ÇALIŞMA'],['members','profile','HANE ÜYELERİ'],['categories','settings','KATEGORİLER'],['theme','settings','TEMA STÜDYOSU'],['reports','report','RAPORLAR'],['han','report','HAN · DENETİM'],['backup','backup','YEDEKLEME'],['settings','settings','AYARLAR']];return `<div class="menuList">${a.map(x=>`<button data-action="menuGo" data-go="${x[0]}"><i>${premiumIcon(x[1],24)}</i><b>${x[2]}</b><span>›</span></button>`).join('')}</div>`}

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
<div class="section cleanHomeTitle"><b>HIZLI ERİŞİM</b><span></span></div><div class="card quick premiumQuick v1947Quick cleanQuick"><button data-tab="cashMoney" class="cashQuickButton"><i class="cashQuickIcon">₺</i>NAKİT PARA</button><button data-tab="han" class="hanQuickButton"><i class="hanQuickLogo"><img src="icons/han-icon.png?v=v65" alt="HAN"></i>HAN</button><button data-action="quickCards" class="homeCardsQuick"><i>${premiumIcon("cards",27)}</i><span>KARTLAR<small>${(()=>{const q=cardPaymentSummary();return q.total?`${q.paid} ödendi · ${q.waiting} bekliyor`:`Kart yok`})()}</small></span>${cardPaymentSummary().waiting?`<em class="homeCardAlert">${cardPaymentSummary().waiting}</em>`:""}</button><button data-tab="transactions"><i>${premiumIcon("transactions",27)}</i>HAREKETLER</button><button data-tab="notes"><i>${premiumIcon("note",27)}</i>NOTLAR</button></div>
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
function debtCardColor(c){
 const k=cardStyleKey(c?.style);return({black:'#202a33',gold:'#d3aa45',titanium:'#8795a3',silver:'#c5d0da',blue:'#268fe5',green:'#16a879',burgundy:'#9d3148',purple:'#8752cf',bej:'#c9a979'})[k]||'#47bfff'
}
function debtsPanel(){
  const cards=(state.cards||[]).map(c=>({kind:'card',id:c.id,title:`${c.bank} · ${c.name||'KREDİ KARTI'}`,last4:c.last4,amount:+c.balance||0,due:cardPaymentInfo(c).dueDate,action:'cardStatement',color:debtCardColor(c)}));
  const flex=(state.flexAccounts||[]).map(a=>({kind:'flex',id:a.id,title:`${a.bank} · ${a.name||'ESNEK HESAP'}`,amount:+a.balance||0,due:a.dueDate?new Date(a.dueDate+'T12:00:00'):null,action:'editFlex',color:'#47bfff'}));
  const rows=[...cards,...flex].filter(x=>x.amount>0),total=rows.reduce((n,x)=>n+x.amount,0);
  let at=0;const stops=rows.map(x=>{const start=total?at/total*100:0;at+=x.amount;const end=total?at/total*100:0;return `${x.color} ${start.toFixed(2)}% ${end.toFixed(2)}%`}).join(',');
  const graph=rows.length?`<div class="debtDonutCard"><div class="debtGraphTitle"><b>BORÇ DAĞILIMI</b><span>KART RENKLERİ</span></div><div class="debtDonutWrap"><div class="debtDonut" style="background:conic-gradient(${stops})"><div class="debtDonutCenter"><small>TOPLAM</small><b>${money(total)}</b></div></div><div class="debtDonutLegend">${rows.map(x=>`<button type="button" data-action="${x.action}" data-id="${x.id}"><i style="background:${x.color}"></i><span><b>${esc(x.title)}</b><small>${total?Math.round(x.amount/total*100):0}% · ${money(x.amount)}</small></span></button>`).join('')}</div></div></div>`:'';
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
function backup(){return`<div class="card" style="padding:15px"><div class="section"><b>Yedek Oluştur</b><span></span></div><div class="notice">Mevcut şifreli HANE uygulama yedeğini oluştur.</div><button class="btn gold" style="width:100%;margin-top:12px" data-action="backupNow">Yedek Oluştur</button></div><div class="card" style="padding:15px;margin-top:12px"><div class="section"><b>Yedekten Geri Yükle</b><span></span></div><button class="btn" style="width:100%" data-action="restoreNow">Yedekten Geri Yükle</button></div>`}
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
    ['HANE OBSIDIAN','#03070b','#091119','#101b25','#f3f9ff','#91a4b5','#24c8ff','#2bd48e','#ff5968','#f4c542'],
    ['ROYAL GOLD','#070604','#151109','#20190d','#fff8e7','#b9aa83','#d9ae4b','#39d98a','#ff626d','#f2c75c'],
    ['TITANIUM','#e9edf1','#f8fafc','#dfe5ea','#16202a','#66727e','#237db7','#1b9b69','#d94452','#b78612'],
    ['EMERALD GLASS','#020a08','#071611','#0d241b','#edfff8','#89ab9e','#13d99a','#38df9b','#ff6677','#e1c45a'],
    ['CRIMSON CARBON','#070708','#141012','#211417','#fff1f3','#ad9298','#ff3e55','#35d58f','#ff5368','#ffc857'],
    ['OCEAN GLASS','#020b13','#061a27','#0a2738','#effbff','#89aeba','#21c6f3','#31d79b','#ff6879','#f1cc55'],
    ['PURPLE NOIR','#08060d','#140d1d','#21132f','#fbf4ff','#ad98bd','#ad62ff','#3bd598','#ff647e','#f2c95b'],
    ['SANDSTONE','#eee3cf','#fff8ea','#e5d4b7','#342a20','#776856','#a9783f','#2f9b68','#c94f58','#a97913'],
    ['FROST','#edf7ff','#ffffff','#dceef9','#102536','#637b8c','#168bd0','#159a67','#d94b5a','#a67d0d'],
    ['CYBER HANE','#02050a','#07111b','#101526','#f0f9ff','#8ba1b8','#00d8ff','#26e39c','#ff3f72','#d9d442'],
    ['CLASSIC BLACK','#000000','#101010','#1b1b1b','#ffffff','#a8a8a8','#e6e6e6','#42d98f','#ff5b66','#f1c84d'],
    ['CLASSIC WHITE','#f5f5f5','#ffffff','#e9e9e9','#111111','#686868','#222222','#168b5d','#d8404d','#9a7410'],
    ['MONOCHROME','#090909','#181818','#292929','#f5f5f5','#a5a5a5','#ffffff','#d6d6d6','#9c9c9c','#ededed'],
    ['NAVY CLASSIC','#07111f','#0d1c30','#142942','#f4f8fc','#9cadbd','#4c91d8','#35c98d','#e85c69','#e3bd54'],
    ['GRAPHITE','#111315','#1b1e21','#262a2e','#f1f3f4','#a0a5aa','#9aa7b1','#42c98b','#e05b66','#d7b84e']
  ];
  const row=(action,label,key,icon)=>`<button type="button" class="setting themeSetting" data-action="${action}"><span>${icon}</span><span><b>${label}</b><small>${String(t[key]||'').toUpperCase()}</small></span><i style="background:${t[key]}"></i></button>`;
  return`<div class="section"><b>TEMA STÜDYOSU</b><span>CANLI ÖNİZLEME</span></div>
  <div class="preview themeLivePreview" style="background:linear-gradient(145deg,${t.surface},${t.bg});border-color:${t.accent};color:${t.text}"><div class="themePreviewHead"><b style="color:${t.accent}">HANE</b><small style="color:${t.muted}">ÖNİZLEME</small></div><div class="summary"><div class="sum" style="background:${t.surface2};border-color:${t.accent}55"><label style="color:${t.muted}">Gelir</label><strong style="color:${t.income}">₺25.000</strong></div><div class="sum" style="background:${t.surface2};border-color:${t.accent}55"><label style="color:${t.muted}">Gider</label><strong style="color:${t.expense}">₺12.550</strong></div><div class="sum" style="background:${t.surface2};border-color:${t.accent}55"><label style="color:${t.muted}">Kalan</label><strong style="color:${t.remain}">₺12.450</strong></div></div><div class="themePreviewBar" style="background:linear-gradient(90deg,${t.income} 0 33%,${t.expense} 33% 66%,${t.remain} 66% 100%)"></div></div>
  <div class="card themeControls">${row('pickBg','ARKA PLAN','bg','◼')}${row('pickSurface','KART / PANEL','surface','▣')}${row('pickSurface2','İKİNCİL YÜZEY','surface2','▤')}${row('pickText','ANA YAZI','text','A')}${row('pickMuted','İKİNCİL YAZI','muted','a')}${row('pickAccent','DETAY / VURGU','accent','✦')}${row('pickIncome','GELİR','income','●')}${row('pickExpense','GİDER','expense','●')}${row('pickRemain','KALAN','remain','●')}</div>
  <div class="section"><b>15 HAZIR TASARIM</b><span>DOKUN · ÖNİZLE</span></div><div class="themeGrid themePresetGrid">${presets.map((a,i)=>`<button type="button" class="themeCard" data-action="presetFull" data-theme='${JSON.stringify({bg:a[1],surface:a[2],surface2:a[3],text:a[4],muted:a[5],accent:a[6],income:a[7],expense:a[8],remain:a[9]})}'><div class="swatch" style="background:linear-gradient(135deg,${a[1]} 0 50%,${a[2]} 50%);border:1px solid ${a[6]}"><i style="background:${a[6]}"></i><i style="background:${a[7]}"></i><i style="background:${a[8]}"></i></div><b>${i+1}. ${a[0]}</b></button>`).join('')}</div>
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

function about(){return`<div class="profile"><div class="aboutV5Logo">${haneFullLogo("aboutV5")}</div><p>SÜRÜM 0.15.75 · V143 CARD ACTION MENU</p><p>PREMİUM EV BÜTÇEN.<br>VERİLERİN CİHAZINDA ŞİFRELİ SAKLANIR.</p></div>`}
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
function zWorkCardOptions(selected=''){
 const cards=Array.isArray(state?.cards)?state.cards:[];
 return `<option value="">KART SEÇ</option>`+cards.map(c=>`<option value="${esc(c.id||'')}" ${String(selected)===String(c.id)?'selected':''}>${esc(c.bank||'BANKA')} · ${esc(c.name||'KART')} · •••• ${esc(c.last4||'')}</option>`).join('');
}
function zWorkRoadRow(r={},i=0){const source=r.source==='card'?'card':'cash';return `<div class="zWorkRoadRow" data-road-row><div class="zWorkRoadTop"><b>YOL GİDERİ ${i+1}</b><button type="button" data-action="zWorkRoadRemove">SİL</button></div>${input('roadAmount','Tutar',r.amount||0,'number','step="0.01" min="0"')}<div class="field"><label>Ödeme Kaynağı</label><select name="roadSource" class="zRoadSource"><option value="cash" ${source==='cash'?'selected':''}>NAKİT</option><option value="card" ${source==='card'?'selected':''}>KREDİ KARTI</option></select></div><div class="field zRoadCardWrap" style="${source==='card'?'':'display:none'}"><label>Kullanılan Kart</label><select name="roadCardId">${zWorkCardOptions(r.cardId||'')}</select></div></div>`}
function zWorkDetailBody(x){
 const mem=(state.members||[]).find(m=>m.id===x.memberId);
 return `<div class="zWorkDetailHero"><small>${prettyDate(x.date||'')} · ${zWorkTypeLabel(x.type)}</small><h2>${esc(x.title||'ÇALIŞMA')}</h2><span>${x.dayStatus==='leave'?'İZİN':x.dayStatus==='overtime'?'MESAİ':'ÇALIŞTI'}</span></div><div class="card zWorkDetailMeta"><div><span>Hane üyesi</span><b>${esc(mem?.name||'—')}</b></div><div><span>Gün durumu</span><b>${x.dayStatus==='leave'?(mem?.leavePolicy==='paid'?'ÜCRETLİ İZİN':'ÜCRETSİZ İZİN'):x.dayStatus==='overtime'?'MESAİ':'ÇALIŞTI'}</b></div>${x.overtimeHours?`<div><span>Mesai</span><b>${x.overtimeHours} saat</b></div>`:''}</div><div class="notice">Hakediş, Alınan ve Kalan finans hesapları günlük kayda değil, Çalışma sayfasındaki aylık 30 gün sistemine göre yönetilir.</div><button class="btn" style="width:100%;margin-top:14px" data-action="zWorkEditForm" data-id="${esc(x.id)}">ÇALIŞMAYI DÜZENLE</button>`
}
function zWorkMemberSelect(v=''){return `<div class="field"><label>Çalışan Hane Üyesi</label><select name="memberId" id="zWorkMemberId"><option value="">KİŞİ SEÇ</option>${(state.members||[]).map(m=>`<option value="${esc(m.id)}" ${v===m.id?'selected':''}>${esc(m.icon||'👤')} ${esc(m.name||'ÜYE')}</option>`).join('')}</select></div>`}
function zWorkForm(x={}){
 const t=x.type||'daily',isDaily=t==='daily',isLeave=x.dayStatus==='leave';
 const mem=(state.members||[]).find(m=>m.id===(x.memberId||state.settings?.activeMemberId)),daily=+mem?.dailyWage||0;
 const workTotal=x.id?zWorkAmount(x):0,workPaid=x.id?zWorkPaidAmount(x):0,paidChoice=workTotal>0&&workPaid>=workTotal-.009?'paid':'unpaid';
 return `<form class="form" id="zWorkForm"><input type="hidden" name="id" value="${esc(x.id||'')}">${zWorkMemberSelect(x.memberId||state.settings?.activeMemberId||'')}<input type="hidden" name="type" value="${esc(t)}"><div class="workSimpleHero"><b>${isLeave?'İZİN YAPTIM':t==='overtime'?'MESAİ EKLE':t==='hourly'?'SAATLİK İŞ':'ÇALIŞTIM'}</b><small>${isDaily&&!isLeave?'Ana iş ücreti aylık 30 gün hesabında yönetilir.':isLeave?'İzin, Çalışma sayfasındaki aylık hakediş hesabına kendi kuralıyla uygulanır.':'Ek çalışma bilgilerini gir.'}</small></div>${input('date','Tarih',x.date||iso(),'date')}${isDaily?`<div class="field"><label>Gün Durumu</label><select name="dayStatus"><option value="worked" ${(x.dayStatus||'worked')==='worked'?'selected':''}>TAM GÜN ÇALIŞTIM</option><option value="leavePaid" ${x.dayStatus==='leave'&&(x.leaveType||mem?.leavePolicy)==='paid'?'selected':''}>ÜCRETLİ İZİN</option><option value="leaveUnpaid" ${x.dayStatus==='leave'&&(x.leaveType||mem?.leavePolicy||'unpaid')==='unpaid'?'selected':''}>ÜCRETSİZ İZİN</option></select></div>`:''}${isDaily?'':input('hours',t==='overtime'?'Mesai Saati':'Kaç Saat',x.hours||x.overtimeHours||0,'number','step="0.25" min="0"')}${isDaily?'':input('rate',t==='overtime'?'Mesai Saat Ücreti':'Saatlik Ücret',x.rate||0,'number','step="0.01" min="0"')}${!isDaily?`<div class="field"><label>Ödeme Durumu</label><select name="paymentStatus"><option value="unpaid" ${paidChoice==='unpaid'?'selected':''}>ÖDEME ALINMADI</option><option value="paid" ${paidChoice==='paid'?'selected':''}>ÖDEME ALINDI</option></select></div>`:''}${isDaily&&!isLeave?`<div class="notice"><b>30 GÜN ESASI</b><br>Günlük referans: ${money(daily)} · aylık hakediş Çalışma özetinde hesaplanır.</div>`:''}<button class="btn gold" type="submit">KAYDET</button>${x.id?`<button class="btn" type="button" data-action="zWorkDelete" data-id="${esc(x.id)}">KAYDI SİL</button>`:''}</form>`
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
   const ds=`${m}-${String(d).padStart(2,'0')}`,rows=dailyRows.filter(x=>x.date===ds),base=rows.find(x=>x.type==='daily'),ot=rows.some(x=>x.type==='overtime'||x.dayStatus==='overtime'),hourly=rows.some(x=>x.type==='hourly'),pay=pays.some(x=>x.date===ds);
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
     pay?'<i class="eventBadge payment">ÖDEME</i>':''
   ].join('');
   cells+=`<button class="zCalDay ${status}${future}${todayCls}" data-action="zWorkDay" data-date="${ds}" title="${esc(label||'Kayıt yok')}"><b>${d}</b><span class="eventDots">${badges}</span></button>`
 }
 cells+='</div>';
 if(!mem)return `<div class="zWorkCalendar"><div class="notice">Çalışma bilgilerini görmek için üstten bir kişi seç.</div>${cells}</div>`;
 const rows=zMemberWorkRows(mem.id,m),daily=rows.filter(x=>x.type==='daily'),worked=daily.filter(x=>(x.dayStatus||'worked')!=='leave').length,leave=daily.filter(x=>x.dayStatus==='leave').length,otHours=rows.reduce((n,x)=>n+(x.type==='overtime'?(+x.hours||0):(x.dayStatus==='overtime'?(+x.overtimeHours||0):0)),0),otAmount=rows.reduce((n,x)=>n+(x.type==='overtime'?zWorkAmount(x):(x.dayStatus==='overtime'&&+x.overtimeHours>0?money2(((+mem.dailyWage||+x.amount||0)/8)*(+x.overtimeHours||0)):0)),0),hourlyHours=rows.filter(x=>x.type==='hourly').reduce((n,x)=>n+(+x.hours||0),0),hourlyAmount=rows.filter(x=>x.type==='hourly').reduce((n,x)=>n+zWorkAmount(x),0),ent=zMemberMonthEntitlement(mem,m),paid=zMemberMonthPaid(mem.id,m),remain=zMemberMonthRemaining(mem,m);
 return `<div class="zWorkCalendar personWorkCalendar" style="--member-color:${esc(zMemberColor(mem,(state.members||[]).findIndex(x=>x.id===mem.id)))}"><div class="zCalTitle"><button data-action="zWorkCalShift" data-dir="-1">‹</button><b>${monthLabel(m)}</b><button data-action="zWorkCalShift" data-dir="1">›</button></div><div class="activeMemberColor"><i></i><span>${esc(mem.name)} · çalışma rengi</span></div>${cells}<div class="zCalKey premiumWorkKey"><span><i class="worked"></i>Tam Gün</span><span><i class="overtime"></i>Mesai</span><span><i class="hourly"></i>Saatlik İş</span><span><i class="leaveUnpaid"></i>Ücretsiz İzin</span><span><i class="leavePaid"></i>Ücretli İzin</span><span><i class="payment"></i>Ödeme</span></div><div class="section zWorkSection"><b>AYLIK ÖZET</b><span>${monthLabel(m)}</span></div><div class="zPersonMonthSummary"><div><small>ÇALIŞMA</small><b>${worked} gün</b></div><div><small>İZİN</small><b>${leave} gün</b></div><div><small>MESAİ</small><b>${otHours} saat · ${money(otAmount)}</b></div><div><small>SAATLİK İŞ</small><b>${hourlyHours} saat · ${money(hourlyAmount)}</b></div><div><small>HAKEDİŞ</small><b>${money(ent.total)}</b></div><div><small>ALINAN</small><b>${money(paid)}</b></div><div><small>KALAN</small><b>${money(remain)}</b></div></div></div>`
}
function zWorkDayBody(date){
 const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);
 if(!mem)return '<div class="notice">Seçili HANE üyesi bulunamadı.</div>';
 const rows=(state.work||[]).filter(x=>x.memberId===mem.id&&x.date===date).sort((a,b)=>String(a.type).localeCompare(String(b.type)));
 const pays=(state.workPayments||[]).filter(x=>x.memberId===mem.id&&x.date===date);
 const label=x=>x.type==='daily'?(x.dayStatus==='leave'?((x.leaveType||mem.leavePolicy||'unpaid')==='paid'?'ÜCRETLİ İZİN':'ÜCRETSİZ İZİN'):'TAM GÜN'):x.type==='overtime'?'MESAİ':'SAATLİK İŞ';
 const meta=x=>x.type==='daily'?(x.dayStatus==='leave'?'Hakediş kuralı: '+((x.leaveType||mem.leavePolicy||'unpaid')==='paid'?'korunur':'hakediş yok'):'Günlük hakediş'):x.type==='overtime'?`${+x.hours||0} saat · ${money(x.rate||0)}/saat`:x.type==='hourly'?`${+x.hours||0} saat · ${money(x.rate||0)}/saat`:'';
 const list=[...rows.map(x=>`<div class="zDayRecord"><div><b>${label(x)}</b><small>${meta(x)}</small></div><div class="zDayRecordActions"><button type="button" data-action="zWorkEditForm" data-id="${esc(x.id)}">DÜZENLE</button><button type="button" class="danger" data-action="zWorkDelete" data-id="${esc(x.id)}">SİL</button></div></div>`),...pays.map(x=>`<div class="zDayRecord payment"><div><b>ÖDEME</b><small>${money(x.amount)} · ${prettyDate(x.date)}</small></div><div class="zDayRecordActions"><button type="button" data-action="zWorkPaymentEdit" data-id="${esc(x.id)}">DÜZENLE</button><button type="button" class="danger" data-action="zWorkPaymentDelete" data-id="${esc(x.id)}">SİL</button></div></div>`)].join('');
 return `<div class="notice"><b>${prettyDate(date)} · ${esc(mem.name)}</b><br>Boş gün dahil bu güne kayıt ekleyebilirsin.</div><div class="zDayRecordList">${list||'<div class="notice">Bu güne henüz kayıt eklenmemiş.</div>'}</div><div class="section zWorkSection"><b>BU GÜNE KAYIT EKLE</b><span></span></div><div class="zDayAddGrid"><button data-action="zWorkDayAdd" data-type="daily" data-date="${date}">✓<b>TAM GÜN / İZİN</b></button><button data-action="zWorkDayAdd" data-type="overtime" data-date="${date}">★<b>MESAİ</b></button><button data-action="zWorkDayAdd" data-type="hourly" data-date="${date}">◷<b>SAATLİK</b></button><button data-action="zWorkDayPayAdd" data-date="${date}">₺<b>ÖDEME</b></button></div>`
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
function view(){if(current==='ta'+'ra')current='han';return({home,transactions,fixed,cards,calendar,reports,cashMoney,han:hanPage,profile,adminProfile,backup,settings,categories,theme,alerts,about,monthSpent,monthPaid,members,homeEdit,notes,workCenter,identity:identityPage}[current]||home)()}
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
function zWorkRoadAddNow(el){
  const form=el?.closest?.('#zWorkForm')||document.getElementById('zWorkForm');
  const list=form?.querySelector?.('#zWorkRoadList')||document.getElementById('zWorkRoadList');
  if(!list){showToast('YOL GİDERİ ALANI BULUNAMADI');return false}
  const wrap=document.createElement('div');
  wrap.innerHTML=zWorkRoadRow({},list.querySelectorAll('[data-road-row]').length);
  const row=wrap.firstElementChild;if(!row)return false;
  list.appendChild(row);
  const src=row.querySelector('.zRoadSource'),cardWrap=row.querySelector('.zRoadCardWrap');
  if(src&&cardWrap){const refresh=()=>cardWrap.style.display=src.value==='card'?'block':'none';src.onchange=refresh;refresh()}
  const remove=row.querySelector('[data-action="zWorkRoadRemove"]');
  if(remove)remove.onclick=e=>{e.preventDefault();e.stopPropagation();row.remove();list.querySelectorAll('[data-road-row] .zWorkRoadTop b').forEach((b,i)=>b.textContent='YOL GİDERİ '+(i+1))};
  row.querySelector('input[name="roadAmount"]')?.focus();
  return true
}
async function act(a,el){const legacyFixedActions=new Set(['addFixedExpense','delFixedPaymentExact','editFixedExpense','editFixedPayment','editStatementFixedPayment','toggleFixedPaid']);if(legacyFixedActions.has(a)){showToast('SABİT GİDER SİSTEMİ KALDIRILDI');return;}if(a==='categoryDetailManage'){const cat=el.dataset.cat||'';open('KATEGORİ İŞLEMLERİ',`<div class="notice"><b>${esc(cat)}</b><br>${categoryUsageCount(cat)} bağlı kayıt / kural</div><button class="btn gold" data-action="editCategory" data-cat="${esc(cat)}">DÜZENLE</button><button class="btn" data-action="categoryDeleteAsk" data-cat="${esc(cat)}">SİL / BAŞKA KATEGORİYE AKTAR</button><button class="btn" data-action="mergeCategory" data-source-cat="${esc(cat)}">BİRLEŞTİR</button>`);return}else if(a==='addCategory'){open('KATEGORİ EKLE',categoryForm(''),{oldCategory:''});return}else if(a==='editCategory'){open('KATEGORİYİ DÜZENLE',categoryForm(el.dataset.cat||''),{oldCategory:el.dataset.cat||''});return}else if(a==='mergeCategory'){open('KATEGORİ BİRLEŞTİR',categoryMergeForm(),{sourceCategory:el.dataset.sourceCat||''});setTimeout(()=>{const f=document.getElementById('categoryMergeForm');if(f&&modal?.sourceCategory){const q=f.querySelector('[name="source"]');if(q)q.value=modal.sourceCategory}},0);return}else if(a==='categoryDeleteAsk'){open('KATEGORİYİ SİL / AKTAR',categoryDeleteForm(el.dataset.cat||''));return}else if(a==='categoryDeleteEmpty'){const cat=el.dataset.cat;if(categoryUsageCount(cat))return alert('Bu kategori kullanımda. Önce başka kategoriye aktarın.');state.customCategories=(state.customCategories||[]).filter(x=>x!==cat);delete (state.categoryMeta||{})[cat];C=C.filter(x=>x!==cat);NORMAL_C=NORMAL_C.filter(x=>x!==cat);FIXED_C=FIXED_C.filter(x=>x!==cat);await save();modal=null;render();showToast('KATEGORİ SİLİNDİ');return}else if(a==='zWorkDeductionAdd'){const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);if(mem)open('MAAŞTAN KESİNTİ',zWorkDeductionForm(mem));return}else if(a==='zWorkDeductionEdit'){const x=(state.workDeductions||[]).find(q=>q.id===el.dataset.id),mem=x&&(state.members||[]).find(m=>m.id===x.memberId);if(x&&mem)open('KESİNTİYİ DÜZENLE',zWorkDeductionForm(mem,x));return}else if(a==='zWorkDeductionDelete'){if(!confirm('Bu maaş kesintisi silinsin mi?'))return;state.workDeductions=(state.workDeductions||[]).filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('KESİNTİ SİLİNDİ');return}else if(a==='identitySelectMemberV37'){identityMemberId=el.dataset.id||'me';render();return}else if(a==='identitySelectMember'){identityMemberId=el.dataset.id||'me';current='identity';modal=null;render();return}else if(a==='zWorkRoadDayAdd'){open('YOL ÜCRETİ EKLE',zWorkRoadDayForm(el.dataset.date||iso()));return}else if(a==='zWorkRoadDayEdit'){const x=(state.workRoads||[]).find(q=>q.id===el.dataset.id);if(x)open('YOL ÜCRETİNİ DÜZENLE',zWorkRoadDayForm(x.date,x));return}else if(a==='zWorkRoadDayDelete'){const x=(state.workRoads||[]).find(q=>q.id===el.dataset.id);if(!x)return;if(!confirm('Bu yol ücreti silinsin mi?'))return;state.workRoads=(state.workRoads||[]).filter(q=>q.id!==x.id);await save();open('GÜN KAYITLARI',zWorkDayBody(x.date));showToast('YOL ÜCRETİ SİLİNDİ');return}else if(a==='selectMember'){state.settings.activeMemberId=el.dataset.id||'me';await save();render();showToast('AKTİF PROFİL DEĞİŞTİRİLDİ');return}else if(a==='zQuickWork'){const mid=document.getElementById('v2WorkMember')?.value||state.settings.activeMemberId||'me';state.settings.activeMemberId=mid;const typ=el.dataset.type||'daily';open(typ==='overtime'?'MESAİ EKLE':typ==='hourly'?'SAATLİK İŞ':'ÇALIŞTIM',zWorkForm({type:typ,memberId:mid}));return}else if(a==='zWorkCalShift'){const [y,m]=(state.selectedMonth||ym(new Date())).split('-').map(Number),d=new Date(y,m-1+(+(el.dataset.dir||0)),1);state.selectedMonth=ym(d);await save();render();return}else if(a==='zWorkDay'){open('GÜN KAYITLARI',zWorkDayBody(el.dataset.date));return}else if(a==='zWorkDayAdd'){const mid=state.settings?.activeMemberId||'me';open(el.dataset.type==='overtime'?'MESAİ EKLE':el.dataset.type==='hourly'?'SAATLİK İŞ EKLE':'TAM GÜN / İZİN',zWorkForm({type:el.dataset.type||'daily',memberId:mid,date:el.dataset.date}));return}else if(a==='zWorkDayPayAdd'){const mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);if(!mem)return;open('ÖDEME EKLE',`<form class="form" id="zWorkMonthPayForm">${input('amount','Alınan Tutar',0,'number','step="0.01" min="0.01"')}${input('date','Ödeme Tarihi',el.dataset.date||iso(),'date')}<button class="btn gold" type="submit">ÖDEMEYİ KAYDET</button></form>`,{memberId:mem.id,workMonth:String(el.dataset.date||'').slice(0,7)});return}else if(a==='zWorkPaymentEdit'){const x=(state.workPayments||[]).find(q=>q.id===el.dataset.id);if(x)open('ÖDEMEYİ DÜZENLE',zWorkPaymentEditForm(x),{paymentId:x.id});return}else if(a==='zWorkPaymentDelete'){const x=(state.workPayments||[]).find(q=>q.id===el.dataset.id);if(!x)return;if(!confirm('Bu ödeme kaydı silinsin mi?'))return;state.workPayments=(state.workPayments||[]).filter(q=>q.id!==x.id);await save();modal=null;render();showToast('ÖDEME SİLİNDİ');return}else if(a==='zWorkDayDelete'){const id=el.dataset.id,w=(state.work||[]).find(x=>x.id===id);if(!w)return;if(!confirm('Bu günün çalışma kaydı silinsin mi?'))return;state.work=(state.work||[]).filter(x=>x.id!==id);await save();modal=null;render();showToast('ÇALIŞMA GÜNÜ SİLİNDİ');return}else if(a==='zWorkRoadAdd'){zWorkRoadAddNow(el);return}else if(a==='zWorkRoadRemove'){const list=el.closest('#zWorkRoadList');el.closest('[data-road-row]')?.remove();(list||document).querySelectorAll('#zWorkRoadList [data-road-row] .zWorkRoadTop b').forEach((b,i)=>b.textContent='YOL GİDERİ '+(i+1));return}else if(a==='zWorkNew'){open('YENİ ÇALIŞMA',`<div class="zWorkTypePicker"><button data-action="zWorkAdd" data-type="daily"><i>✓</i><b>GÜNLÜK</b><small>Tam gün çalışma</small></button><button data-action="zWorkAdd" data-type="hourly"><i>◷</i><b>SAATLİK</b><small>Saat bazlı çalışma</small></button><button data-action="zWorkAdd" data-type="overtime"><i>★</i><b>MESAİ</b><small>Fazla mesai</small></button></div>`);return}else if(a==='zWorkFilter'){zWorkFilter=el.dataset.value||'all';render();return}else if(a==='zWorkAdd'){open('ÇALIŞMA EKLE',zWorkForm({type:el.dataset.type||'daily'}));return}else if(a==='zWorkMonthPay'){const mid=el.dataset.id||document.getElementById('v2WorkMember')?.value||state.settings.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);if(!mem)return alert('Hane üyesi bulunamadı.');const remain=zMemberMonthRemaining(mem,state.selectedMonth);if(remain<=.009)return alert('Bu ay için kalan hakediş yok.');open('ÇALIŞMA ÖDEMESİ',zWorkMonthPaymentForm(mem,state.selectedMonth),{memberId:mem.id,workMonth:state.selectedMonth});return}else if(a==='zReceivablePay'){alert('Eski günlük alacak sistemi devre dışı. Ödemeyi Çalışma sayfasındaki ÖDEME EKLE butonundan girin.');return}else if(a==='zWorkEdit'){const x=(state.work||[]).find(z=>z.id===el.dataset.id);if(x)open('ÇALIŞMA DETAYI',zWorkDetailBody(x),{id:x.id});return}else if(a==='zWorkEditForm'){const x=(state.work||[]).find(z=>z.id===el.dataset.id);if(x)open('ÇALIŞMAYI DÜZENLE',zWorkForm(x),{id:x.id});return}else if(a==='zWorkDelete'){const wid=el.dataset.id;if(!confirm('Bu çalışma kaydı silinsin mi?'))return;state.work=(state.work||[]).filter(x=>x.id!==wid);state.receivables=(state.receivables||[]).filter(x=>x.workId!==wid);state.workRoads=(state.workRoads||[]).filter(x=>x.workId!==wid);state.workPayments=(state.workPayments||[]).filter(x=>!(x.workId===wid&&x.autoWorkStatus===true));await save();modal=null;render();return}if(a&&a.startsWith('edit')){const c=document.querySelector('.content');if(c)returnScrollTop=c.scrollTop;}if(a==='expenseView'){expenseView='normal';render();return;}if(a==='expenseGroupDetail'){open((el.dataset.date||'')+' · '+(el.dataset.cat||'GİDER'),expenseGroupDetailBody(el.dataset.date||'',el.dataset.cat||'Diğer'));return;}if(a==='toggleExpenseSection'){if(el.dataset.section==='normal')normalExpensesOpen=!normalExpensesOpen;else fixedExpensesOpen=!fixedExpensesOpen;render();return;}if(a==='editStatementFixedPayment'){const p=(state.fixedPayments||[]).find(z=>z.id===el.dataset.id),x=p?state.expenses.find(z=>z.id===p.expenseId):null;if(x&&p){open('ÖDEMEYİ DÜZENLE',`<form class="form" id="fixedPaymentForm"><div class="notice"><b>FATURA TUTARI: ${money(fixedBillAmount(x))}</b><br>GERÇEK ÖDENEN TUTAR gider hesabında esas alınır.</div>${input('amount','Gerçek Ödenen Tutar',p.amount||fixedBillAmount(x),'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',p.date||iso(),'date')}${select('category','Kategori',C,p.category||x.category||'Diğer')}<div class="field"><label>Ödeme Şekli</label><select name="source"><option value="cash" ${(p.source||'cash')==='cash'?'selected':''}>NAKİT</option><option value="card" ${p.source==='card'?'selected':''}>KART</option></select></div><div class="field"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${state.cards.map(c=>`<option value="${c.id}" ${p.cardId===c.id?'selected':''}>${esc(c.bank)} · ${esc(c.name)} · •••• ${esc(c.last4)}</option>`).join('')}</select></div><button class="btn gold" type="submit">KAYDET</button><button class="btn" type="button" data-action="toggleFixedPaid" data-id="${x.id}">ÖDEMEYİ GERİ AL</button></form>`,{id:x.id,paymentId:p.id});return}}else if(a==='hanFilter'){hanFilter=el.dataset.hanGroup||'TÜMÜ';render();return}else if(a==='hanSeverity'){hanSeverity=el.dataset.hanSeverity||'TÜMÜ';render();return}else if(a==='hanMigrationReview'){open('HAN · HANE ↔ RUTİN İNCELEME',hanMigrationReviewBody(el.dataset.recordId));return}else if(a==='hanMigrationDecision'){const id=el.dataset.findingId,decision=el.dataset.decision;if(!['same','different'].includes(decision))return;try{window.HANE_CORE?.resolveMigrationFinding?.(id,decision);modal=null;render();showToast(decision==='same'?'HAN: AYNI KAYIT OLARAK EŞLEŞTİRİLDİ':'HAN: FARKLI KAYIT OLARAK İŞARETLENDİ')}catch(e){alert(e.message||'Karar kaydedilemedi')}return}else if(a==='paymentSourceDetail'){open(el.dataset.source==='card'?'KREDİ KARTI HARCAMALARI':el.dataset.source==='flex'?'ESNEK HESAP HARCAMALARI':'NAKİT HARCAMALAR',paymentSourceDetailBody(el.dataset.source));return}else if(a==='openCardStatement'){cardStatementMonth=state.selectedMonth;open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='cardFormStyle'){const input=document.getElementById('cardStyleEditValue');if(input)input.value=cardStyleKey(el.dataset.style);el.closest('.cardStyleEditGrid')?.querySelectorAll('.cardStyleEditChoice').forEach(b=>b.classList.toggle('active',b===el));return;}else if(a==='cardDetail'){const c=state.cards.find(x=>String(x.id)===String(el.dataset.id));const snap=c?selectedCardStatement(c):null;cardStatementMonth=snap?.month||state.selectedMonth;open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id,statementMonth:cardStatementMonth});return}else if(a==='cardMovements'){cardStatementMonth=state.selectedMonth;open('KART HAREKETLERİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});requestAnimationFrame(()=>document.querySelector('.modal .list')?.scrollIntoView({behavior:'smooth',block:'start'}));return}else if(a==='cardStatement'){cardStatementMonth=state.selectedMonth;open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='cardBankStatement'){const m=el.dataset.month||cardStatementMonth||'';open('BANKA EKSTRESİ',cardBankStatementBody(el.dataset.id,m),{cardId:el.dataset.id,statementMonth:m});return}else if(a==='bankStatementStep'){const c=state.cards.find(x=>String(x.id)===String(el.dataset.id));if(!c)return;const snaps=cardStatementSnaps(c);if(!snaps.length)return;let i=Math.max(0,snaps.findIndex(x=>x.month===cardStatementMonth));if(i<0)i=0;i=(i+(+el.dataset.dir||1)+snaps.length)%snaps.length;cardStatementMonth=snaps[i].month||'';render();return}else if(a==='cardStatementShift'){const [y,m]=(cardStatementMonth||state.selectedMonth).split('-').map(Number),d=new Date(y,m-1+(+(el.dataset.dir||0)),1);cardStatementMonth=ym(d);open('KART EKSTRESİ',cardStatementBody(el.dataset.id,cardStatementMonth),{cardId:el.dataset.id});return}else if(a==='statementImport'){const c=state.cards.find(x=>x.id===el.dataset.id);if(!c)return;statementImportCardId=c.id;const i=document.getElementById('statementImportInput');if(!i)return alert('Ekstre dosya seçici bulunamadı.');i.value='';i.click();return}else if(a==='statementV191Recheck'){statementImportRows.forEach((r,i)=>{r.title=document.querySelector(`[data-se-title="${i}"]`)?.value||r.title;r.amount=Math.abs(Number(document.querySelector(`[data-se-amount="${i}"]`)?.value)||r.amount);r.kind=document.querySelector(`[data-se-kind="${i}"]`)?.value||r.kind;const picked=document.querySelector(`[data-se-cat="${i}"]`)?.value;if(r.kind==='spend'&&picked){r.category=picked;seRememberCategory(r,picked)}else if(r.kind==='payment')r.category='Kart Ödemesi';else if(r.kind==='fee')r.category='Vergi & Faiz';else if(r.kind==='refund')r.category='İade'});save();const m={spend:0,fees:0,payments:0,refunds:0};statementImportRows.forEach(r=>m[r.kind==='refund'?'refunds':r.kind==='payment'?'payments':r.kind==='fee'?'fees':'spend']+=r.amount);statementImportMeta.motor=m;open('EKSTRE ÖNİZLEME',sePreview(statementImportCardId,statementImportMeta),{cardId:statementImportCardId});return}else if(a==='statementV191Confirm'){await seConfirm();return}else if(a==='statementImportConfirm'){return}if(a&&a.startsWith('edit')&&el?.dataset?.directEdit!=='1'){const d=haneRecordDetailSpec(a,el.dataset.id);if(d){open(d.title,d.body,{recordDetail:true});return}}if(a==='openTxFilters'){open('HAREKET FİLTRELERİ',txAdvancedFilterBody());return}else if(a==='roadFeeGroup'){open((el.dataset.date||'')+' · YOL ÜCRETLERİ',roadFeeGroupBody(el.dataset.date),{roadFeeDate:el.dataset.date})}else if(a==='clearTxSearch'){txSearch='';render()}else if(a==='runTxSearch'){txSearch=$('#txSearch')?.value||'';render()}else if(a==='togglePrivacy'){state.settings.privacy=!state.settings.privacy;await save();render()}else if(a==='clearTxFilters'){txDate=txCategory=txPay=txMin=txMax=txMember='';modal=null;render()}else if(a==='memberDetail'){open(memberName(el.dataset.id)+' · '+monthLabel(state.selectedMonth),memberDetailBody(el.dataset.id),{memberId:el.dataset.id})}else if(a==='addMember'){open('ÜYE EKLE',memberForm())}else if(a==='editMember'){const m=state.members.find(x=>x.id===el.dataset.id);if(m)open('ÜYEYİ DÜZENLE',memberForm(m),{id:m.id})}else if(a==='delMember'){if(el.dataset.id==='me'){alert('Admin profili silinemez.');return}const linked=(state.work||[]).filter(x=>x.memberId===el.dataset.id).length+(state.incomes||[]).filter(x=>x.memberId===el.dataset.id).length+(state.expenses||[]).filter(x=>x.memberId===el.dataset.id).length;if(!confirm(linked?`Bu üyeye bağlı ${linked} geçmiş kayıt var. Üye silinirse kayıtlar korunup Hane geneline aktarılacak. Devam edilsin mi?`:'Bu hane üyesi silinsin mi?'))return;state.members=state.members.filter(x=>x.id!==el.dataset.id);if(state.settings.activeMemberId===el.dataset.id)state.settings.activeMemberId='me';state.incomes.forEach(x=>{if(x.memberId===el.dataset.id)x.memberId=''});state.expenses.forEach(x=>{if(x.memberId===el.dataset.id)x.memberId=''});await save();modal=null;render()}else if(a==='homeMove'){const k=el.dataset.key,d=+el.dataset.dir,i=state.homeLayout.indexOf(k),j=Math.max(0,Math.min(state.homeLayout.length-1,i+d));if(i>=0&&i!==j){[state.homeLayout[i],state.homeLayout[j]]=[state.homeLayout[j],state.homeLayout[i]];await save();render()}}else if(a==='homeToggle'){const k=el.dataset.key;state.homeHidden=state.homeHidden.includes(k)?state.homeHidden.filter(x=>x!==k):[...state.homeHidden,k];await save();render()}else if(a==='receiptView'){const x=state.expenses.find(z=>z.id===el.dataset.id);if(x?.attachment)open('FİŞ / FATURA',`<div class="receiptViewer"><img src="${x.attachment}" alt="Fiş"><button class="btn" data-action="receiptReplace" data-id="${x.id}">DEĞİŞTİR</button><button class="btn" data-action="receiptDelete" data-id="${x.id}">SİL</button></div>`,{id:x.id})}else if(a==='receiptReplace'){modal={...modal,id:el.dataset.id};$('#receiptInput').click()}else if(a==='receiptDelete'){const x=state.expenses.find(z=>z.id===el.dataset.id);if(x){x.attachment='';await save();modal=null;render()}}else if(a==='openMenu')open('MENÜ',menuBody());else if(a==='menuGo'){goTo(el.dataset.go)}else if(a==='homeSummaryNav'){txFilter=el.dataset.kind==='income'?'income':el.dataset.kind==='expense'?'expense':'all';txSearch='';goTo('transactions')}else if(a==='summaryDetail'){open(el.dataset.kind==='income'?'GELİR DETAYI':el.dataset.kind==='expense'?'GİDER DETAYI':'KALAN DETAYI',summaryDetailBody(el.dataset.kind))}else if(a==='financeTab'){financeTab=el.dataset.finance;modal=null;render()}else if(a==='financePicker'){open('FİNANS',`<div class="financePickerList"><button data-action="financeTab" data-finance="cards">KARTLAR</button><button data-action="financeTab" data-finance="accounts">HESAPLAR</button><button data-action="financeTab" data-finance="debts">BORÇLAR</button></div>`);return}else if(a==='scrollCard'){financeCardIndex=Math.max(0,Math.min(state.cards.length-1,+el.dataset.index||0));render();requestAnimationFrame(()=>document.querySelector('.cardsV55Stage .isSelectedCard')?.focus({preventScroll:true}))}else if(a==='cardCarouselStep'){if(!state.cards.length)return;financeCardIndex=(financeCardIndex+(+el.dataset.dir||1)+state.cards.length)%state.cards.length;render();requestAnimationFrame(()=>document.querySelector('.cardsV55Stage .isSelectedCard')?.focus({preventScroll:true}))}else if(a==='fixedCategoryDetail'){const cat=el.dataset.cat||'Diğer',scope=el.dataset.scope||'all',source=el.dataset.source||'';open(cat+' · DETAY',fixedCategoryDetail(cat,scope,source),{category:cat,scope,source})}else if(a==='delCategoryRule'){const k=el.dataset.merchant||'';if(k&&state.statementCategoryRules){delete state.statementCategoryRules[k];await save();render();showToast('ÖĞRENME KURALI SİLİNDİ')}}else if(a==='clearCategoryRules'){if(confirm('Öğrenilen tüm işyeri-kategori kuralları temizlensin mi?')){state.statementCategoryRules={};await save();render();showToast('KATEGORİ ÖĞRENME TEMİZLENDİ')}}else if(a==='addCategory')open('KATEGORİ EKLE',categoryForm(),{oldCat:''});else if(a==='editCategory'){open('KATEGORİYİ DÜZENLE',categoryForm(el.dataset.cat),{oldCat:el.dataset.cat})}else if(a==='mergeCategory'){open('KATEGORİ BİRLEŞTİR',categoryMergeForm())}else if(a==='categoryMergeConfirm'){const src=el.dataset.source,tgt=el.dataset.target;if(confirm(src+' → '+tgt+' birleştirilsin mi?')){const n=categoryTransfer(src,tgt);normalizeV19(state);await save();modal=null;render();showToast(n+' KAYIT/KURAL BİRLEŞTİRİLDİ')}}else if(a==='categoryDeleteAsk'){open('KATEGORİYİ SİL / AKTAR',categoryDeleteForm(el.dataset.cat),{deleteCat:el.dataset.cat})}else if(a==='categoryDeleteEmpty'){const c=el.dataset.cat;if(confirm(c+' kategorisi silinsin mi?')){state.customCategories=state.customCategories.filter(x=>x!==c);delete state.categoryMeta[c];normalizeV19(state);await save();modal=null;render();showToast('KATEGORİ SİLİNDİ')}}else if(a==='addAccount')open('HESAP EKLE',accountForm());else if(a==='editAccount'){const x=state.accounts.find(z=>z.id===el.dataset.id);open('HESABI DÜZENLE',accountForm(x),{id:x.id})}else if(a==='delAccount'){state.accounts=state.accounts.filter(x=>x.id!==el.dataset.id);await save();modal=null;render()}else if(a==='accountSpend'||a==='accountIncome'){const x=state.accounts.find(z=>z.id===el.dataset.id);open(a==='accountSpend'?'HARCAMA EKLE':'GELİR EKLE',simpleAmountForm(a,x))}else if(a==='addFlex')open('ESNEK HESAP EKLE',flexForm());else if(a==='editFlex'){const x=state.flexAccounts.find(z=>z.id===el.dataset.id);open('ESNEK HESABI DÜZENLE',flexForm(x),{id:x.id})}else if(a==='delFlex'){state.flexAccounts=state.flexAccounts.filter(x=>x.id!==el.dataset.id);await save();modal=null;render()}else if(a==='flexSpend'||a==='flexPay'){const x=state.flexAccounts.find(z=>z.id===el.dataset.id);open(a==='flexSpend'?'HARCAMA EKLE':'ÖDEME YAPTIM',simpleAmountForm(a,x))}else if(a==='editFlexPayment'){const x=(state.flexTransactions||[]).find(z=>z.id===el.dataset.id);if(x)open('ESNEK HESAP ÖDEMESİNİ DÜZENLE',`<form class="form" id="flexPaymentEditForm">${input('amount','Tutar',x.amount,'number','step="0.01" min="0"')}${input('date','Tarih',x.date,'date')}${input('title','Açıklama',x.title||'')}<button class="btn gold">KAYDET</button><button type="button" class="btn" data-action="delFlexPayment" data-id="${x.id}">SİL</button></form>`,{id:x.id})}else if(a==='delFlexPayment'){const x=(state.flexTransactions||[]).find(z=>z.id===el.dataset.id);if(x){const f=state.flexAccounts.find(a=>a.id===x.flexId);if(f)f.balance=(+f.balance||0)+(+x.amount||0);state.flexTransactions=state.flexTransactions.filter(z=>z.id!==x.id);await save();modal=null;render();showToast('SİLİNDİ')}}else if(a==='delFixedPaymentExact'){const p=(state.fixedPayments||[]).find(z=>z.id===el.dataset.id);if(p){state.fixedPayments=state.fixedPayments.filter(z=>z.id!==p.id);const ex=state.expenses.find(z=>z.id===p.expenseId);if(ex){ex.paidMonths=(ex.paidMonths||[]).filter(m=>m!==p.month);if(String(ex.date||'').slice(0,7)===p.month)ex.paid=false}await save();modal=null;render();showToast('SİLİNDİ')}}else if(a==='editCardPayment'){const x=state.cardPayments.find(z=>z.id===el.dataset.id);if(x)open('ÖDEMEYİ DÜZENLE',cardPaymentEditForm(x),{id:x.id})}else if(a==='delCardPayment'){state.cardPayments=state.cardPayments.filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('SİLİNDİ')}else if(a==='back'){goBack()}else if(a==='txFilter'){txFilter=el.dataset.filter||'all';render()}else if(a==='txView'){txView=el.dataset.view||'list';render()}else if(a==='goCards'){goTo('cards')}else if(a==='calendarTab'){calendarView=el.dataset.view==='day'?'day':'month';render()}else if(a==='calendarDayPrev'){const d=new Date(calendarDay+'T12:00:00');d.setDate(d.getDate()-1);calendarDay=iso(d);calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';save().then(()=>render())}else if(a==='calendarDayNext'){const d=new Date(calendarDay+'T12:00:00');d.setDate(d.getDate()+1);calendarDay=iso(d);calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';save().then(()=>render())}else if(a==='monthPrev'){state.selectedMonth=monthShiftValue(state.selectedMonth,-1);calendarMonth=state.selectedMonth;calendarDay='';await save();render()}else if(a==='monthNext'){state.selectedMonth=monthShiftValue(state.selectedMonth,1);calendarMonth=state.selectedMonth;calendarDay='';await save();render()}else if(a==='monthToday'){state.selectedMonth=ym(new Date());calendarMonth=state.selectedMonth;calendarDay='';await save();render()}else if(a==='calendarDay'){calendarDay=el.dataset.date;calendarMonth=calendarDay.slice(0,7);state.selectedMonth=calendarMonth;calendarView='day';open('GÜN İŞLEMLERİ',calendarDayManageBody(calendarDay),{calendarDate:calendarDay})}else if(a==='calendarDayAddIncome'){const d=el.dataset.date||calendarDay||iso();open('Gelir Ekle',incomeForm({date:d}),{calendarDate:d})}else if(a==='calendarDayAddExpense'){const d=el.dataset.date||calendarDay||iso();open('Gider Ekle',expenseForm({date:d}),{calendarDate:d})}else if(a==='calendarPrev'){let [y,m]=calendarMonth.split('-').map(Number);m--;if(m<1){m=12;y--}calendarMonth=y+'-'+String(m).padStart(2,'0');state.selectedMonth=calendarMonth;calendarDay='';save().then(()=>render())}else if(a==='calendarNext'){let [y,m]=calendarMonth.split('-').map(Number);m++;if(m>12){m=1;y++}calendarMonth=y+'-'+String(m).padStart(2,'0');state.selectedMonth=calendarMonth;calendarDay='';save().then(()=>render())}else if(a==='hanOpenStatementInspect'){const cid=el.dataset.recordId,m=el.dataset.month||state.selectedMonth;if((state.cards||[]).some(x=>String(x.id)===String(cid))){cardStatementMonth=m;open('KART EKSTRESİ',cardStatementBody(cid,m),{cardId:cid})}return}else if(a==='hanInspect'){open('HAN · İNCELEME',hanInspectBody(el.dataset.issueTitle||'HAN İncelemesi',el.dataset.issueDetail||'',el.dataset.recordAction||'',el.dataset.recordId||'',el.dataset.recordId2||''),{hanInspect:true})}else if(a==='hanEditFromInspect'){let ra=el.dataset.recordAction;const rid=el.dataset.recordId;if(ra==='zWorkEdit')ra='zWorkEditForm';if(ra&&rid){const fake=document.createElement('button');fake.dataset.id=rid;fake.dataset.directEdit='1';await act(ra,fake)}}else if(a==='hanDeleteGeneric'){const da=el.dataset.deleteAction||'',rid=el.dataset.recordId||'';if(da&&rid){await act(da,{dataset:{id:rid,directEdit:'1'}});return}}else if(a==='hanDeleteFromInspect'){const rid=el.dataset.recordId,x=(state.expenses||[]).find(z=>String(z.id)===String(rid));if(x&&confirm('Bu finansal kayıt kalıcı olarak silinecek. Silmek istediğine emin misin?')){if(x.cardTxId)state.cardTransactions=state.cardTransactions.filter(t=>t.id!==x.cardTxId);state.fixedPayments=(state.fixedPayments||[]).filter(p=>p.expenseId!==rid);state.flexTransactions=(state.flexTransactions||[]).filter(t=>t.expenseId!==rid);state.expenses=state.expenses.filter(z=>String(z.id)!==String(rid));await save();modal=null;render();showToast('KAYIT SİLİNDİ')}}else if(a==='hanIssueOk'){state.settings=state.settings||{};state.settings.hanIgnored=Array.isArray(state.settings.hanIgnored)?state.settings.hanIgnored:[];const k=el.dataset.issueKey||'';if(k&&!state.settings.hanIgnored.includes(k))state.settings.hanIgnored.push(k);await save();modal=null;render();showToast('HAN: SIKINTI YOK OLARAK İŞARETLENDİ')}else if(a==='hanRun'){state.settings=state.settings||{};const audit=hanAudit(),curr=audit.issues.map(x=>({base:[String(x.title||''),String(x.recordAction||''),String(x.recordId||''),String(x.recordId2||'')].join('|'),full:hanIssueKey(x.title,x.recordId,x.recordId2||'',x.recordAction)})),prevRows=Array.isArray(state.settings.hanLastIssues)?state.settings.hanLastIssues:[],pm=new Map(prevRows.map(x=>[x.base,x.full])),cm=new Map(curr.map(x=>[x.base,x.full])),newCount=curr.filter(x=>!pm.has(x.base)).length,solvedCount=prevRows.filter(x=>!cm.has(x.base)).length,changedCount=curr.filter(x=>pm.has(x.base)&&pm.get(x.base)!==x.full).length;state.settings.hanLastScan=new Date().toISOString();state.settings.hanLastIssues=curr;state.settings.hanLastIssueKeys=curr.map(x=>x.full);state.settings.hanLastDelta={newCount,solvedCount,changedCount};state.settings.hanHistory=Array.isArray(state.settings.hanHistory)?state.settings.hanHistory:[];state.settings.hanHistory.push({at:state.settings.hanLastScan,bad:audit.issues.filter(x=>x.level==='bad').length,warn:audit.issues.filter(x=>x.level==='warn').length,info:audit.issues.filter(x=>x.level==='info').length,newCount,solvedCount});state.settings.hanHistory=state.settings.hanHistory.slice(-10);await save();render();showToast(`HAN: ${newCount} YENİ · ${solvedCount} ÇÖZÜLDÜ`)}else if(a==='taraRun'){render();showToast('HAN KONTROLÜ TAMAMLANDI')}else if(a==='reportPeriod'){reportPeriod=el.dataset.period||'month';const rn={day:1,week:1,month:1,month3:3,month6:6,month12:12}[reportPeriod]||1;reportMonths=rn;reportFlowMonths=rn;reportCategoryMonths=rn;render()}else if(a==='reportView'){reportView=el.dataset.view||'summary';render()}else if(a==='reportMonths'){reportMonths=+(el.dataset.months||6);render()}else if(a==='reportFlowMonths'){reportFlowMonths=+(el.dataset.months||6);render()}else if(a==='reportCategoryMonths'){reportCategoryMonths=+(el.dataset.months||1);render()}else if(a==='reportCardMetricDetail'){open(el.dataset.kind==='paid'?'KART ÖDEMELERİ':el.dataset.kind==='interest'?'FAİZ / VERGİ':'KART HARCAMALARI',reportCardMetricDetailBody(el.dataset.kind||'spend'));return}else if(a==='reportCompareDetail'){open('GEÇEN AY KARŞILAŞTIRMASI',reportCompareDetailBody());return}else if(a==='cardPayType'){const v=el.dataset.value||'Tek Çekim',inp=document.getElementById('cardPaymentType'),field=document.getElementById('installmentField');if(inp)inp.value=v;document.querySelectorAll('.cardPayTypeSeg button').forEach(b=>b.classList.toggle('active',b.dataset.value===v));if(field)field.classList.toggle('show',v==='Taksitli')}else if(a==='openTheme'){themeDraft={...(state.theme||{bg:'#05080d',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'})};current='theme';modal=null;render()}else if(a==='quickCards'){financeTab='cards';goTo('cards')}else if(a==='addNote'){open('Not Ekle',noteForm())}else if(a==='editNote'){const n=(state.notes||[]).find(x=>x.id===el.dataset.id);if(n)open('Notu Düzenle',noteForm(n),{id:n.id})}else if(a==='delNote'){state.notes=(state.notes||[]).filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('NOT SİLİNDİ')}else if(a==='calendarAddMenu'){const d=calendarDay||iso();open('Kayıt Ekle',`<div class="calendarAddChoices"><button class="btn" data-action="calendarDayAddIncome" data-date="${esc(d)}">+ GELİR</button><button class="btn" data-action="calendarDayAddExpense" data-date="${esc(d)}">+ GİDER</button></div>`,{calendarDate:d})}else if(a==='addIncome')open('Gelir Ekle',incomeForm());else if(a==='editIncome'){const x=state.incomes.find(z=>z.id===el.dataset.id);open('Geliri Düzenle',incomeForm(x),{id:x.id})}else if(a==='delIncome'){state.incomes=state.incomes.filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('SİLİNDİ')}else if(a==='addExpense')open('Gider Ekle',expenseForm());else if(a==='addFixedExpense')open('Gider Ekle',expenseForm({recurring:true,category:'Kira',dueDate:iso()}));else if(a==='editFixedExpense'){const x=state.expenses.find(z=>z.id===el.dataset.id);open('Gideri Düzenle',expenseForm(x),{id:x.id})}else if(a==='editExpense'){const x=state.expenses.find(z=>z.id===el.dataset.id);open('Gideri Düzenle',expenseForm(x),{id:x.id})}else if(a==='delExpense'){const ex=state.expenses.find(x=>x.id===el.dataset.id);if(ex?.cardTxId)state.cardTransactions=state.cardTransactions.filter(t=>t.id!==ex.cardTxId);state.fixedPayments=(state.fixedPayments||[]).filter(p=>p.expenseId!==el.dataset.id);state.flexTransactions=(state.flexTransactions||[]).filter(t=>t.expenseId!==el.dataset.id);state.expenses=state.expenses.filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('SİLİNDİ')}else if(a==='toggleFixedPaid'){const x=state.expenses.find(z=>z.id===el.dataset.id);if(x){x.paidMonths=Array.isArray(x.paidMonths)?x.paidMonths:[];state.fixedPayments=Array.isArray(state.fixedPayments)?state.fixedPayments:[];const m=state.selectedMonth,was=fixedPaidForMonth(x,m);if(was){x.paidMonths=x.paidMonths.filter(v=>v!==m);state.fixedPayments=state.fixedPayments.filter(p=>!(p.expenseId===x.id&&p.month===m));await save();render();showToast('ÖDEME GERİ ALINDI')}else{const expected=fixedBillAmount(x),payDate=dateForSelectedMonth(x.dueDate||x.date,m);open('GİDER ÖDEMESİ',`<form class="form" id="fixedPaymentConfirmForm"><div class="notice fixedPayCompare"><small>BEKLENEN / NORMAL TUTAR</small><b>${money(expected)}</b><div id="fixedPayDiff">Tutar aynıysa doğrudan onaylayabilirsin.</div></div>${input('amount','Gerçek Ödenen Tutar',expected,'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',payDate,'date')}<div class="field"><label>Ödeme Şekli</label><select name="source" id="fixedPaySourceNew"><option value="cash" ${x.source!=='card'?'selected':''}>NAKİT</option><option value="card" ${x.source==='card'?'selected':''}>KART</option></select></div><div class="field" id="fixedPayCardWrapNew"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${state.cards.map(c=>`<option value="${c.id}" ${x.cardId===c.id?'selected':''}>${esc(c.bank)} · ${esc(c.name)}</option>`).join('')}</select></div><button class="btn gold" type="submit">ÖDEMEYİ ONAYLA</button></form>`,{id:x.id,fixedMonth:m,expectedAmount:expected});return}}}else if(a==='editFixedPayment'){const x=state.expenses.find(z=>z.id===el.dataset.id),p=fixedPaymentFor(x);if(x&&p)open('ÖDEMEYİ DÜZENLE',`<form class="form" id="fixedPaymentForm"><div class="notice"><b>FATURA TUTARI: ${money(fixedBillAmount(x))}</b><br>GERÇEK ÖDENEN TUTAR gider hesabında esas alınır.</div>${input('amount','Gerçek Ödenen Tutar',p.amount||fixedBillAmount(x),'number','step="0.01" min="0"')}${input('date','Ödeme Tarihi',p.date||iso(),'date')}${select('category','Kategori',C,p.category||x.category||'Diğer')}<div class="field"><label>Ödeme Şekli</label><select name="source" id="fixedPaySource"><option value="cash" ${(p.source||'cash')==='cash'?'selected':''}>NAKİT</option><option value="card" ${p.source==='card'?'selected':''}>KART</option></select></div><div class="field"><label>Kullanılan Kart</label><select name="cardId"><option value="">Kart seç</option>${state.cards.map(c=>`<option value="${c.id}" ${p.cardId===c.id?'selected':''}>${esc(c.bank)} · ${esc(c.name)} · •••• ${esc(c.last4)}</option>`).join('')}</select></div><button class="btn gold" type="submit">KAYDET</button><button class="btn" type="button" data-action="toggleFixedPaid" data-id="${x.id}">ÖDEMEYİ GERİ AL</button></form>`,{id:x.id,paymentId:p.id})}else if(a==='addCard')open('Kart Ekle',cardForm());else if(a==='editCard'){const c=state.cards.find(z=>z.id===el.dataset.id);open('Kartı Düzenle',cardForm(c),{id:c.id})}else if(a==='delCard'){const cid=el.dataset.id,linkedExpense=(state.expenses||[]).some(x=>x.cardId===cid),linkedPay=(state.cardPayments||[]).some(x=>x.cardId===cid);if(linkedExpense||linkedPay||(state.workRoads||[]).some(x=>x.cardId===cid)){alert('Bu karta bağlı geçmiş harcama veya ödeme kayıtları var. Ekstre ve finans geçmişinin bozulmaması için kart silinemez.');return}state.cards=state.cards.filter(x=>x.id!==cid);await save();modal=null;render();showToast('KART SİLİNDİ')}else if(a==='cardSpend'){const c=state.cards.find(x=>x.id===el.dataset.id);open('Kart Harcaması Ekle',cardSpendForm(c),{cardId:c.id})}else if(a==='cardPay'){const c=state.cards.find(x=>x.id===el.dataset.id);open('Ödeme Yaptım',cardPayForm(c),{cardId:c.id})}else if(a==='memberThemePreset'){const picker=$('#memberThemeColor'),studio=el.closest('.memberThemeStudio');if(picker){picker.value=el.dataset.color||'#2497ff';picker.dispatchEvent(new Event('input',{bubbles:true}))}if(studio){studio.style.setProperty('--member-theme',el.dataset.color||'#2497ff');studio.querySelectorAll('.memberThemePreset').forEach(b=>b.classList.toggle('active',b===el))}}else if(a==='cashGivenAdd'){open('VERİLEN PARA EKLE',cashEntryForm('given'))}else if(a==='cashManualAdd'){open('NAKİT PARA · KAYIT EKLE',cashEntryForm('manual'))}else if(a==='cashGivenDel'){state.cashGiven=(state.cashGiven||[]).filter(x=>x.id!==el.dataset.id);await save();render();showToast('VERİLEN PARA KAYDI SİLİNDİ')}else if(a==='cashManualDel'){state.cashManual=(state.cashManual||[]).filter(x=>x.id!==el.dataset.id);await save();modal=null;render();showToast('KAYIT SİLİNDİ')}else if(a==='cashToggleInclude'){const key=el.dataset.key,m=el.dataset.month||state.selectedMonth;state.cashExcluded=Array.isArray(state.cashExcluded)?state.cashExcluded:[];const i=state.cashExcluded.findIndex(x=>x.key===key&&x.month===m);if(i>=0)state.cashExcluded.splice(i,1);else state.cashExcluded.push({key,month:m});await save();modal=null;render();showToast(i>=0?'HARCAMA YENİDEN DAHİL EDİLDİ':'HARCAMA NAKİT PARA TOPLAMINDAN ÇIKARILDI')}else if(a==='cashDetail'){const t=cashMoneyTotals(state.selectedMonth),g=el.dataset.group,rows=g==='manual'?t.manual:t.auto.filter(x=>x.group===g),title=g==='rent'?'KİRA':g==='dues'?'AİDAT':g==='manual'?'EKLENEN KAYITLAR':'DİĞER NAKİT HARCAMALAR';open(title,cashMoneyDetailRows(rows,g==='manual'))}else if(a==='cashDetails'){const F=cashFlow();open('Bu Ay · Harcanan / Ödenen',`<div class="cashDetail"><div class="notice"><b>Bu Ay Harcanan: ${money(F.spent)}</b><br>Bu ay yaptığın gerçek ev harcamalarıdır.</div><div class="notice" style="margin-top:8px"><b>Bu Ay Ödenen: ${money(F.paid)}</b><br>Kart ödemeleri ${money(F.cardPaid)} + nakit/ödenmiş giderler ${money(F.directPaid)}.</div><div class="notice" style="margin-top:8px">Kart ödemeleri yeniden gider sayılmaz. Önceki aylardan gelen kart borcu ödesen bile sadece “Bu Ay Ödenen” bölümünde görünür.</div></div>`)}else if(a==='zWorkSummaryDetail'){const k=el.dataset.kind,mid=state.settings?.activeMemberId||'me',mem=(state.members||[]).find(x=>x.id===mid);open(k==='earned'?'ALINAN ÖDEMELER':k==='owed'?'KALAN ALACAK':'HAKEDİŞ DETAYI',k==='owed'?(mem?`<div class="workMoneyDetailHead"><b>${esc(mem.name)}</b><span>${monthLabel(state.selectedMonth)} · KALAN</span></div><div class="workMoneyBalance"><div><small>HAKEDİŞ</small><b>${money(zMemberMonthEntitlement(mem,state.selectedMonth).total)}</b></div><div><small>ALINAN</small><b>${money(zMemberMonthPaid(mem.id,state.selectedMonth))}</b></div><div class="remain"><small>KALAN</small><b>${money(zMemberMonthRemaining(mem,state.selectedMonth))}</b></div></div><button class="btn gold workMoneyPayBtn" data-action="zWorkMonthPay" data-id="${esc(mem.id)}">ÖDEME EKLE</button>`:'<div class="notice">Çalışma profili yok.</div>'):zWorkSummaryModal(k))}else if(a==='memberOverview'){const mem=(state.members||[]).find(x=>x.id===el.dataset.id);if(mem)open('PROFİL ÖZETİ',memberOverviewBody(mem))}else if(a==='memberOverviewDetail'){const mem=(state.members||[]).find(x=>x.id===el.dataset.id);if(mem)open('PROFİL DETAYI',memberOverviewDetailBody(mem,el.dataset.kind))}else if(a==='openAdminProfile'){const admin=(state.members||[]).find(x=>x.id==='me'||x.role==='admin')||(state.members||[])[0];identityMemberId=admin?.id||'me';modal=null;goTo('identity');return}else if(a==='showIdentity'){const admin=(state.members||[]).find(x=>x.id==='me'||x.role==='admin')||(state.members||[])[0];identityMemberId=admin?.id||'me';modal=null;goTo('identity');return;}else if(a==='editIdentity')open('HANE · KİMLİK DÜZENLE',identityForm());else if(a==='editProfile')open('Profili Düzenle',profileForm());else if(a==='pickProfile')$('#profileInput').click();else if(a==='attachReceipt'){rememberModalForm();$('#receiptInput').click()}else if(a==='receipt'){rememberModalForm();$('#receiptInput').click()}else if(a==='close'){modal=null;render()}else if(a==='pickBg')open('Arka Plan Rengi',colorForm('bg','Arka Plan Rengi'));else if(a==='pickSurface')open('Kart / Panel Rengi',colorForm('surface','Kart / Panel Rengi'));else if(a==='pickSurface2')open('İkincil Yüzey',colorForm('surface2','İkincil Yüzey'));else if(a==='pickText')open('Ana Yazı Rengi',colorForm('text','Ana Yazı Rengi'));else if(a==='pickMuted')open('İkincil Yazı Rengi',colorForm('muted','İkincil Yazı Rengi'));else if(a==='pickAccent')open('Detay Rengi',colorForm('accent','Detay Rengi'));else if(a==='pickIncome')open('Grafik Gelir',colorForm('income','Gelir Rengi'));else if(a==='pickExpense')open('Grafik Gider',colorForm('expense','Gider Rengi'));else if(a==='pickRemain')open('Grafik Kalan',colorForm('remain','Kalan Rengi'));else if(a==='saveColor'){if(!themeDraft)themeDraft={...(state.theme||{})};themeDraft[el.dataset.kind]=$('#nativeColor').value;applyTheme(themeDraft);modal=null;render()}else if(a==='preset'){if(!themeDraft)themeDraft={...(state.theme||{})};themeDraft.bg=el.dataset.bg;themeDraft.accent=el.dataset.accent;applyTheme(themeDraft);render()}else if(a==='presetFull'){try{themeDraft={...themeDraft,...JSON.parse(el.dataset.theme||'{}')};applyTheme(themeDraft);render()}catch(e){showToast('TEMA ÖNİZLEMESİ AÇILAMADI')}}else if(a==='resetTheme'){themeDraft={bg:'#05080d',surface:'#0b1118',surface2:'#0f1720',text:'#eef7ff',muted:'#92a3b5',accent:'#47bfff',income:'#2bd48e',expense:'#ff616d',remain:'#f4c542'};applyTheme(themeDraft);render()}else if(a==='saveTheme'){state.theme={...themeDraft};await save();themeDraft=null;applyTheme();current='profile';render();alert('Tema kaydedildi.')}else if(a==='cancelTheme'){themeDraft=null;applyTheme();current='profile';render()}else if(a==='backupNow')backupNow();else if(a==='restoreNow')$('#restoreInput').click();else if(a==='changePin')changePin();else if(a==='toggleDarkMode'){state.settings.darkMode=!(state.settings.darkMode!==false);await save();applyTheme();render();showToast(state.settings.darkMode?'KARANLIK MOD AÇILDI':'KARANLIK MOD KAPATILDI')}else if(a==='clearAll'){if(confirm('Tüm HANE verileri silinsin mi?')){localStorage.removeItem(META);localStorage.removeItem(DATA);location.reload()}}}

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
    cardSwipe.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0)return;pid=e.pointerId;csx=e.clientX;csy=e.clientY;ctrack=true;dragged=false;});
    cardSwipe.addEventListener('pointermove',e=>{if(!ctrack||pid!==e.pointerId)return;const dx=e.clientX-csx,dy=e.clientY-csy;if(!dragged&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){dragged=true;try{cardSwipe.setPointerCapture(pid)}catch(_){}}});
    cardSwipe.addEventListener('pointerup',e=>{if(!ctrack||pid!==e.pointerId)return;ctrack=false;const dx=e.clientX-csx,dy=e.clientY-csy;try{cardSwipe.releasePointerCapture(pid)}catch(_){}pid=null;if(dragged&&Math.abs(dx)>=45&&Math.abs(dx)>Math.abs(dy)*1.15){e.preventDefault();cardStep(dx)}});
    cardSwipe.addEventListener('pointercancel',()=>{ctrack=false;pid=null;dragged=false});
  }
  const statementSwipe=document.querySelector('[data-statement-swipe="1"]');
  if(statementSwipe){let ssx=0,ssy=0,strack=false;statementSwipe.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;ssx=t.clientX;ssy=t.clientY;strack=true},{passive:true});statementSwipe.addEventListener('touchend',e=>{if(!strack)return;strack=false;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const dx=t.clientX-ssx,dy=t.clientY-ssy;if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy)*1.15)return;const c=state.cards.find(x=>String(x.id)===String(statementSwipe.dataset.cardId));if(!c)return;const snaps=cardStatementSnaps(c);if(snaps.length<2)return;let i=snaps.findIndex(x=>x.month===cardStatementMonth);if(i<0)i=0;i=(i+(dx<0?1:-1)+snaps.length)%snaps.length;cardStatementMonth=snaps[i].month||'';render()},{passive:true});}
  const homeMonthSwipe=document.querySelector('[data-home-month-swipe="1"]');
  if(homeMonthSwipe){let hsx=0,hsy=0,htrack=false;homeMonthSwipe.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;hsx=t.clientX;hsy=t.clientY;htrack=true},{passive:true});homeMonthSwipe.addEventListener('touchend',e=>{if(!htrack)return;htrack=false;const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const dx=t.clientX-hsx,dy=t.clientY-hsy;if(Math.abs(dx)<48||Math.abs(dx)<=Math.abs(dy)*1.15)return;state.selectedMonth=monthShiftValue(state.selectedMonth,dx<0?1:-1);calendarMonth=state.selectedMonth;calendarDay='';save().then(()=>render())},{passive:true});}
  $$('[data-tab]').forEach(x=>x.onclick=()=>{const next=x.dataset.tab;if(next==='theme')themeDraft={...(state.theme||{})};else if(current==='theme'){themeDraft=null;applyTheme();}goTo(next)});
  $$('[data-action]').forEach(x=>x.onclick=e=>{if(x.closest('form')&&x.type==='submit')return;e.stopPropagation();act(x.dataset.action,x)});
  document.querySelectorAll('#zWorkForm [data-action="zWorkRoadAdd"]').forEach(btn=>{btn.onclick=e=>{e.preventDefault();e.stopPropagation();zWorkRoadAddNow(btn)}});
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
  const stmtSwipe=document.querySelector('.statementV60');if(stmtSwipe&&!stmtSwipe.dataset.swipeBound){stmtSwipe.dataset.swipeBound='1';let sx=0,sy=0;stmtSwipe.addEventListener('touchstart',e=>{const t=e.touches?.[0];if(t){sx=t.clientX;sy=t.clientY}},{passive:true});stmtSwipe.addEventListener('touchend',e=>{const t=e.changedTouches?.[0];if(!t)return;const dx=t.clientX-sx,dy=t.clientY-sy;if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.2)return;const cid=modal?.cardId;if(!cid)return;cardStatementMonth=monthShiftValue(cardStatementMonth||state.selectedMonth,dx<0?1:-1);open('KART EKSTRESİ',cardStatementBody(cid,cardStatementMonth),{cardId:cid})},{passive:true})}
  const reportMemberSelect=$('#reportMemberSelect');if(reportMemberSelect)reportMemberSelect.onchange=()=>{reportMemberId=reportMemberSelect.value||'all';render()};
  const v2WorkMember=$('#v2WorkMember');if(v2WorkMember)v2WorkMember.onchange=async()=>{const next=v2WorkMember.value||'me',mem=(state.members||[]).find(x=>x.id===next);state.settings.activeMemberId=next;await save();render();showToast((mem?.name||'PROFİL')+' ÇALIŞMA PROFİLİ SEÇİLDİ')};
  const memberSalary=$('#memberSalary'),memberDaily=$('#memberDailyWage');if(memberSalary&&memberDaily)memberSalary.oninput=()=>{memberDaily.value=money2((parseMoneyInput(memberSalary.value)||0)/30).toFixed(2)};const memberThemeColor=$('#memberThemeColor');if(memberThemeColor)memberThemeColor.oninput=()=>{const studio=memberThemeColor.closest('.memberThemeStudio');if(studio)studio.style.setProperty('--member-theme',memberThemeColor.value);studio?.querySelectorAll('.memberThemePreset').forEach(b=>b.classList.toggle('active',(b.dataset.color||'').toLowerCase()===memberThemeColor.value.toLowerCase()))};const memberFormEl=$('#memberForm');if(memberFormEl)memberFormEl.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),mid=d.id||modal?.id||id(),old=(state.members||[]).find(x=>x.id===mid),salary=parseMoneyInput(d.salary)||0,effectiveDate=d.salaryEffectiveDate||d.startDate||iso(),hist=Array.isArray(old?.salaryHistory)?[...old.salaryHistory]:[];if(!old||money2(+old.salary||0)!==money2(salary)){const same=hist.findIndex(x=>x.effectiveDate===effectiveDate),row={effectiveDate,salary};if(same>=0)hist[same]=row;else hist.push(row)}const mem={...(old||{}),id:mid,name:(d.name||'ÜYE').trim(),icon:d.icon||'👤',job:(d.job||'').trim(),startDate:d.startDate||iso(),salary,salaryEffectiveDate:effectiveDate,salaryHistory:hist.sort((a,b)=>String(a.effectiveDate).localeCompare(String(b.effectiveDate))),dailyWage:money2(salary/30),color:d.color||'#2497ff',leavePolicy:d.leavePolicy==='paid'?'paid':'unpaid'};state.members=Array.isArray(state.members)?state.members:[];const mi=state.members.findIndex(x=>x.id===mid),prior=mi>=0?state.members[mi]:null;if(mi>=0)state.members[mi]=mem;else state.members.push(mem);const autoAdded=await zEnsureMemberDays(mem);await save();modal=null;render();showToast(autoAdded?'HANE ÜYESİ KAYDEDİLDİ · '+autoAdded+' GÜN ÇALIŞMA TAKVİMİNE EKLENDİ':'HANE ÜYESİ KAYDEDİLDİ')};
  const zWorkDayForm=$('#zWorkDayForm');if(zWorkDayForm)zWorkDayForm.onsubmit=async e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget).entries()),mem=(state.members||[]).find(x=>x.id===d.memberId);if(!mem)return alert('Hane üyesi bulunamadı.');let matches=(state.work||[]).filter(x=>x.memberId===mem.id&&x.date===d.date&&x.type==='daily'),w=matches[0];if(matches.length>1)return alert('Bu kişi ve tarihte birden fazla çalışma kaydı var. Önce HAN üzerinden mükerrer kayıtları düzeltin.');if(w&&!confirm('Bu tarihte mevcut çalışma kaydı var. Gün durumu güncellenecek; geçmiş ödeme kayıtları değiştirilmeyecek. Devam edilsin mi?'))return;if(!w){const wid='auto_'+mem.id+'_'+d.date;w={id:wid,memberId:mem.id,type:'daily',date:d.date,title:(mem.job||'ÇALIŞMA').toUpperCase(),amount:zMemberWageForDate(mem,d.date),autoCalendar:true};(state.work||(state.work=[])).push(w)}w.dayStatus=d.status||'worked';w.overtimeHours=w.dayStatus==='overtime'?(parseMoneyInput(d.overtimeHours)||0):0;w.amount=w.dayStatus==='leave'?0:zMemberWageForDate(mem,d.date);w.memberId=mem.id;delete w.paymentStatus;delete w.paidDate;await save();modal=null;render();showToast(w.dayStatus==='leave'?'GÜN İZİN OLARAK GÜNCELLENDİ':w.dayStatus==='overtime'?'GÜN MESAİ OLARAK GÜNCELLENDİ':'GÜN ÇALIŞMA OLARAK GÜNCELLENDİ')};
  document.querySelectorAll('#zWorkRoadList [data-road-row]').forEach(row=>{const src=row.querySelector('.zRoadSource'),wrap=row.querySelector('.zRoadCardWrap');if(src&&wrap){const refresh=()=>wrap.style.display=src.value==='card'?'block':'none';src.addEventListener('change',refresh);refresh()}})
  const zWorkFormEl=$('#zWorkForm');if(zWorkFormEl)zWorkFormEl.onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.currentTarget),d=Object.fromEntries(fd.entries()),wid=d.id||id(),old=(state.work||[]).find(x=>x.id===wid),type=d.type||'daily',mem=(state.members||[]).find(m=>m.id===d.memberId),rawDayStatus=d.dayStatus||'worked',dayStatus=(rawDayStatus==='leavePaid'||rawDayStatus==='leaveUnpaid')?'leave':rawDayStatus,leaveType=rawDayStatus==='leavePaid'?'paid':rawDayStatus==='leaveUnpaid'?'unpaid':undefined,amount=dayStatus==='leave'?0:(type==='daily'?(+mem?.dailyWage||0):money2(parseMoneyInput(d.hours)*parseMoneyInput(d.rate)));if(dayStatus!=='leave'&&(!Number.isFinite(amount)||amount<=0))return alert(type==='daily'?'Hane üyesi profilinde aylık maaş bulunmalı.':'Ücret 0’dan büyük olmalı.');if(dayStatus!=='leave'&&type!=='daily'&&(parseMoneyInput(d.hours)<=0||parseMoneyInput(d.rate)<=0))return alert('Saat ve saatlik ücret 0’dan büyük olmalı.');const duplicate=(state.work||[]).find(q=>q.id!==wid&&q.memberId===d.memberId&&q.date===(d.date||iso())&&q.type===type);if(duplicate)return alert('Bu kişi için aynı tarihte aynı türde kayıt zaten var. Mevcut kaydı düzenleyin.');const x={...(old||{}),id:wid,memberId:d.memberId||old?.memberId||'',type,date:d.date||iso(),title:upper(((d.title&&d.title!=='ANA İŞ'?d.title:(mem?.job||d.title))||'ÇALIŞMA').trim()),amount:type==='daily'?amount:undefined,hours:type==='daily'?undefined:parseMoneyInput(d.hours),rate:type==='daily'?undefined:parseMoneyInput(d.rate),dayStatus,leaveType:type==='daily'&&dayStatus==='leave'?leaveType:undefined};state.work=Array.isArray(state.work)?state.work:[];const wi=state.work.findIndex(z=>z.id===wid);if(wi>=0)state.work[wi]=x;else state.work.push(x);delete x.paymentStatus;delete x.paidDate;state.workPayments=Array.isArray(state.workPayments)?state.workPayments:[];if(type==='overtime'||type==='hourly'){const autoIdx=state.workPayments.findIndex(p=>p.workId===wid&&p.autoWorkStatus===true),manualPaid=money2(state.workPayments.filter(p=>p.workId===wid&&p.autoWorkStatus!==true).reduce((n,p)=>n+(+p.amount||0),0));if(d.paymentStatus==='paid'){const autoNeed=money2(Math.max(0,amount-manualPaid));if(autoNeed>.009){const pay={...(autoIdx>=0?state.workPayments[autoIdx]:{}),id:autoIdx>=0?state.workPayments[autoIdx].id:'workpay_auto_'+wid,workId:wid,memberId:x.memberId,workMonth:String(x.date||'').slice(0,7),title:(type==='overtime'?'MESAİ':'SAATLİK İŞ')+' · ÖDEME',amount:autoNeed,date:x.date,source:'work',autoWorkStatus:true};if(autoIdx>=0)state.workPayments[autoIdx]=pay;else state.workPayments.push(pay)}else if(autoIdx>=0)state.workPayments.splice(autoIdx,1)}else if(autoIdx>=0){state.workPayments.splice(autoIdx,1)}}await save();modal=null;render();showToast('ÇALIŞMA KAYDEDİLDİ')};;
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

// === HANE EKSTRE MOTORU / V234 — DENIZBANK NAKIT AVANS ROW FIX ===
let statementImportCardId=null,statementImportRows=[],statementImportMeta={};
const HANE_PDF_MODULE='./__hane_engine__/pdf/pdf.min.mjs',HANE_PDF_WORKER='./__hane_engine__/pdf/pdf.worker.min.mjs',HANE_ENGINE_CACHE='hane-engine-v238-audit-clean';
const HANE_PDF_PACKAGE={url:'https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-4.10.38.tgz',integrity:'sha512-/Y3fcFrXEAsMjJXeL9J8+ZG9U01LbuWaYypvDW2ycW1jL269L3js3DVBjDJ0Up9Np1uqDXsDrRihHANhZOlwdQ==',files:{'package/build/pdf.min.mjs':'__hane_engine__/pdf/pdf.min.mjs','package/build/pdf.worker.min.mjs':'__hane_engine__/pdf/pdf.worker.min.mjs'}};
function seB64(b){let s='';for(let i=0;i<b.length;i+=32768)s+=String.fromCharCode(...b.subarray(i,i+32768));return btoa(s)}
function seTarStr(u,s,l){const p=u.subarray(s,s+l);let e=p.indexOf(0);if(e<0)e=p.length;return new TextDecoder().decode(p.subarray(0,e)).trim()}
function seOct(s){return parseInt(String(s||'').replace(/\0/g,'').trim(),8)||0}
async function seInstallPdf(){const cache=await caches.open(HANE_ENGINE_CACHE),dst=Object.values(HANE_PDF_PACKAGE.files);if((await Promise.all(dst.map(x=>cache.match(new URL(x,location.href).href)))).every(Boolean))return;const r=await fetch(HANE_PDF_PACKAGE.url,{credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('PDF okuma bileşeni indirilemedi.');const ab=await r.arrayBuffer(),got=seB64(new Uint8Array(await crypto.subtle.digest('SHA-512',ab))),want=HANE_PDF_PACKAGE.integrity.split('-')[1];if(got!==want)throw Error('PDF okuma bileşeni doğrulanamadı.');if(typeof DecompressionStream!=='function')throw Error('Tarayıcı PDF paketini açmayı desteklemiyor.');const tar=new Uint8Array(await new Response(new Blob([ab]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()),need=new Set(Object.keys(HANE_PDF_PACKAGE.files)),found=new Map();for(let o=0;o+512<=tar.length;){const n=seTarStr(tar,o,100),pr=seTarStr(tar,o+345,155);if(!n)break;const f=pr?pr+'/'+n:n,z=seOct(seTarStr(tar,o+124,12)),ds=o+512;if(need.has(f))found.set(f,tar.slice(ds,ds+z));o=ds+Math.ceil(z/512)*512}if(found.size!==need.size)throw Error('PDF okuma bileşeni eksik.');for(const [src,out] of Object.entries(HANE_PDF_PACKAGE.files))await cache.put(new URL(out,location.href).href,new Response(found.get(src),{headers:{'Content-Type':'text/javascript'}}))}
let sePdf=null,seBlob=[];async function sePdfRuntime(){if(sePdf)return sePdf;await seInstallPdf();const c=await caches.open(HANE_ENGINE_CACHE),blob=async p=>{const r=await c.match(new URL(p,location.href).href);const u=URL.createObjectURL(new Blob([await r.arrayBuffer()],{type:'text/javascript'}));seBlob.push(u);return u},m=await import(await blob(HANE_PDF_MODULE));m.GlobalWorkerOptions.workerSrc=await blob(HANE_PDF_WORKER);sePdf=m;return m}
async function seReadPdf(file){
 const p=await sePdfRuntime(),doc=await p.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise,pages=[];
 for(let n=1;n<=doc.numPages;n++){
  const pg=await doc.getPage(n),ct=await pg.getTextContent(),vp=pg.getViewport({scale:1}),rot=((pg.rotate||0)%360+360)%360;
  // İki kanal tutulur: (1) PDF'nin kendi metin akışı/hasEOL satırları, (2) görsel koordinatlar.
  // TEB 180° PDF'lerde koordinat sırası değişebildiği için işlem defterinin ana kaynağı artık logicalLines'dır.
  const rawItems=(ct.items||[]).map(it=>({s:String(it.str||'').trim(),x:Number(it.transform?.[4]||0),y:Number(it.transform?.[5]||0),w:Number(it.width||0),hasEOL:!!it.hasEOL}));
  const logicalLines=[];let logical=[];
  for(const it of rawItems){if(it.s)logical.push(it.s);if(it.hasEOL){const text=logical.join(' ').replace(/\s+/g,' ').trim();if(text)logicalLines.push(text);logical=[]}}
  if(logical.length){const text=logical.join(' ').replace(/\s+/g,' ').trim();if(text)logicalLines.push(text)}
  // V207: satırları DÖNDÜRÜLMEMİŞ PDF koordinatlarında da kur. 180° TEB sayfalarında
  // görsel koordinat dönüşümü aynı satırdaki tarih/açıklama/tutar bağını bozabiliyordu.
  const rawRowBuckets=[];
  for(const it of rawItems.filter(x=>x.s)){let r=rawRowBuckets.find(q=>Math.abs(q.y-it.y)<=2.4);if(!r){r={y:it.y,a:[]};rawRowBuckets.push(r)}r.a.push(it)}
  rawRowBuckets.sort((a,b)=>rot===180?a.y-b.y:b.y-a.y);
  // PDF 180° döndürülmüşse HAM koordinatlar görsel soldan-sağa yönün tersidir.
  // Bu nedenle 0° sayfalarda X artan, 180° sayfalarda X azalan sıralanır.
  // Aksi halde satır 'TL.300,- ... 31/07/2026' olur ve işlem regex'i hiçbir satırı kabul etmez.
  const rawLines=rawRowBuckets.map(r=>{r.a.sort((a,b)=>rot===180?b.x-a.x:a.x-b.x);return r.a.map(x=>x.s).join(' ').replace(/\s+/g,' ').trim()}).filter(Boolean);
  const items=rawItems.filter(x=>x.s).map(it=>{let {s,x,y,w}=it;
    if(rot===180){x=vp.width-x-w;y=vp.height-y}
    else if(rot===90){const ox=x;x=y;y=vp.width-ox}
    else if(rot===270){const ox=x;x=vp.height-y;y=ox}
    return{s,x,y,w};});
  const rows=[];
  for(const it of items){let r=rows.find(q=>Math.abs(q.y-it.y)<=3.2);if(!r){r={y:it.y,a:[]};rows.push(r)}r.a.push(it)}
  rows.sort((a,b)=>b.y-a.y);for(const r of rows)r.a.sort((a,b)=>a.x-b.x);
  pages.push({page:n,items,rows,logicalLines,rawLines,rotation:rot});
 }
 return pages
}
function seMoneySigned(s){
 if(s==null)return null;
 const raw=String(s).trim();
 const neg=/^\s*-/.test(raw)||/-\s*$/.test(raw);
 // TEB para biçimi: TL.4.666,75 / TL.730,- / -TL.14.826,69.
 // Eski kod yalnız 'TL'yi siliyor ve öndeki noktayı bırakıyordu (.4.666,75); bu da Number() => NaN yapıp
 // özellikle binlik tutarların işlem toplamından sessizce düşmesine neden oluyordu.
 let x=raw.replace(/₺/g,'').replace(/\bTL\.?/gi,'').replace(/\s+/g,'').replace(/^[+-]/,'').replace(/[+-]$/,'');
 if(/,-$/.test(raw)||/\.-$/.test(raw))x=x.replace(/,$/,',00').replace(/\.$/,'.00');
 // Türkçe ekstre: nokta binlik, virgül kuruş. Noktaları tamamen kaldır, virgülü ondalığa çevir.
 x=x.replace(/\./g,'').replace(',','.').replace(/[^0-9.]/g,'');
 const n=Number(x);
 return Number.isFinite(n)?(neg?-Math.abs(n):Math.abs(n)):null
}
function seMoney(s){const n=seMoneySigned(s);return n==null?null:Math.abs(n)}
function seDateParts(s){const t=String(s||'').replace(/\s+/g,' ').trim();let m=t.match(/(?:^|\D)(\d{1,2})\s*[.\/-]\s*(\d{1,2})\s*[.\/-]\s*(\d{2,4})(?:\D|$)/);if(!m)m=t.match(/(?:^|\D)(\d{1,2})\s+(\d{1,2})\s+(20\d{2})(?:\D|$)/);if(!m)return null;let y=+m[3];if(y<100)y+=2000;const d=+m[1],mo=+m[2];if(d<1||d>31||mo<1||mo>12||y<2000||y>2100)return null;return{raw:m[0].replace(/^\D|\D$/g,'').trim(),d,mo,y,iso:`${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`}}
function seIso(d){return seDateParts(d)?.iso||''}
function seRowDate(r,near=[]){const direct=seDateParts(r?.text);if(direct)return direct;const a=r?.items||[];for(let i=0;i<a.length;i++){for(let n=2;n<=5&&i+n<=a.length;n++){const z=seDateParts(a.slice(i,i+n).map(q=>q.s).join(' '));if(z)return z}}for(const x of near){const z=seDateParts(x?.text);if(z)return z}return null}
function seNorm(s){return String(s||'').toLocaleUpperCase('tr-TR').replace(/İ/g,'I').normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function seCat(title){const n=seNorm(title),rules=state.statementCategoryRules||{};for(const [k,v] of Object.entries(rules))if(k&&n.includes(k)&&C.includes(v))return v;if(/MARKET|BIM|A101|SOK|ONUR|GIDA/.test(n))return C.includes('Market')?'Market':'Diğer';if(/TAKSI|TOPLU TASIMA|ULASIM|BENZIN|PETROL/.test(n))return C.includes('Ulaşım')?'Ulaşım':'Diğer';if(/RESTORAN|KAFE|CAFE|YEMEK|KOMAGENE|TAVUK/.test(n))return C.includes('Yeme İçme')?'Yeme İçme':'Diğer';return 'Diğer'}
function seRuleKey(title){return seNorm(title).replace(/[^A-Z0-9ÇĞÖŞÜ ]/g,' ').replace(/\s+/g,' ').trim().split(' ').filter(Boolean).slice(0,3).join(' ')}
function seRememberCategory(row,cat){if(!row||row.kind!=='spend'||!cat||cat==='Diğer'||!C.includes(cat))return;const key=seRuleKey(row.bankTitle||row.title);if(key.length<4)return;state.statementCategoryRules=state.statementCategoryRules||{};state.statementCategoryRules[key]=cat}
function seKind(title,raw){const n=seNorm(title),r=String(raw||'').replace(/\s+/g,'');if(/IADE|IPTAL/.test(n))return'refund';/* V215: ücret/BSMV/KKDF/faiz kontrolü ödeme kontrolünden ÖNCE yapılır. TEB'deki 'KARTTAN FATURA ODEME UCRETI' bir kart ödemesi değil banka ücretidir. */if(/FAIZ|BSMV|KKDF|KOMISYON|UCRET/.test(n))return'fee';if(/CEPTETEB.*ODEME|ODEME.*TESEKKUR|HESAPTAN.*ODEME|OTOMATIK.*ODEME|KART.*ODEME/.test(n))return'payment';/* TEB'de TL.730,- ifadesindeki sondaki '-' NEGATİF İŞARET DEĞİL, sıfır kuruş gösterimidir. Yalnız tutarın BAŞINDAKİ eksi gerçek ödeme işaretidir. */if(/^-(?:TL\.?)?/i.test(r)||/^\+/.test(r)||/\+$/.test(r))return'payment';return'spend'}

function seTebRawLineRows(pages){
 const out=[],rejected=[];
 // Gerçek TEB hareketi: satırın başında tarih, satırın sonunda TL tutarı. Aradaki HER ŞEY banka açıklamasıdır.
 const rx=/^(\d{1,2}\s*[.\/-]\s*\d{1,2}\s*[.\/-]\s*\d{4})\s+(.+?)\s+(-?\s*TL\.?\s*(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-))\s*$/i;
 const stop=/BU KARTINIZLA YAPILAN ISLEM TOPLAMLARI|GENEL TOPLAM/;
 for(const pg of pages){
  let inTable=false;
  for(const src of (pg.rawLines||[])){
   const line=String(src||'').replace(/\s+/g,' ').trim(),n=seNorm(line);
   if(n.includes('ISLEM TARIHI')&&n.includes('TUTAR')){inTable=true;continue}
   if(!inTable)continue;
   if(stop.test(n)){inTable=false;continue}
   if(/ONCEKI DONEMDEN DEVIR/.test(n))continue;
   const m=line.match(rx);
   if(!m){if(seDateParts(line))rejected.push(`S${pg.page}: ${line}`);continue}
   const d=seDateParts(m[1]),desc=m[2].trim(),raw=m[3],signed=seMoneySigned(raw);
   if(!d||signed==null){rejected.push(`S${pg.page}: ${line}`);continue}
   const kind=seKind(desc,raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(signed),kind,category,reason:`TEB ham PDF satırı · ${raw} · S${pg.page}`});
  }
 }
 return{rows:out,rejected};
}

function seTebLogicalRows(pages){
 const out=[], rejected=[];
 const lineRx=/^(\d{1,2}\s*[.\/-]\s*\d{1,2}\s*[.\/-]\s*\d{4})\s+(.+?)\s+(-?\s*TL\.?\s*(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-))\s*(?:BONUS.*)?$/i;
 const stopRx=/BU KARTINIZLA YAPILAN ISLEM TOPLAMLARI|GENEL TOPLAM|KART.?A AIT MN|TICARET SICIL|MERSIS/i;
 const skipRx=/ONCEKI DONEMDEN DEVIR|DEVREDEN BAKIYE|DONEM BORCU|SON ODEME|MINIMUM ODEME/i;
 for(const pg of pages){
  let inTable=false;
  for(const rawLine of (pg.logicalLines||[])){
   const line=String(rawLine||'').replace(/\s+/g,' ').trim(), n=seNorm(line);
   if(n.includes('ISLEM TARIHI')&&n.includes('TUTAR')){inTable=true;continue}
   if(!inTable)continue;
   if(stopRx.test(n)){inTable=false;continue}
   if(skipRx.test(n))continue;
   const m=line.match(lineRx);
   if(!m){if(seDateParts(line))rejected.push(`S${pg.page}: ${line}`);continue}
   const d=seDateParts(m[1]),desc=m[2].trim(),raw=m[3],signed=seMoneySigned(raw);
   if(!d||signed==null||Math.abs(signed)<0.005){rejected.push(`S${pg.page}: ${line}`);continue}
   const kind=seKind(desc,raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(signed),kind,category,reason:`TEB mantıksal satır · ${raw} · S${pg.page}`});
  }
 }
 // Aynı tarih/açıklama/tutar gerçekten iki kez yapılmış olabilir; bu nedenle dedupe YAPMA.
 return {rows:out,rejected};
}

function seTebStrictRows(pages){
 const out=[];
 const moneyRx=/^(?:-\s*)?(?:TL\.?\s*)?(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-)$/i;
 for(const pg of pages){
  const vr=(pg.rows||[]).map(r=>({page:pg.page,y:r.y,items:r.a||[],text:(r.a||[]).map(q=>q.s).join(' ').replace(/\s+/g,' ').trim()}));
  for(const rr of vr){
   const d=seDateParts(rr.text); if(!d)continue;
   // TEB işlem satırında tarih ve tutar aynı görsel satırda olmalı. Özet/footer satırları bu kapıdan geçemez.
   const a=rr.items||[]; let best=null;
   for(let i=0;i<a.length;i++)for(let n=1;n<=3&&i+n<=a.length;n++){
    const g=a.slice(i,i+n),raw=g.map(x=>x.s).join('').replace(/\s+/g,'');
    if(!moneyRx.test(raw))continue;
    const amount=seMoney(raw); if(amount==null||amount===0)continue;
    const x=g[0].x; if(!best||x>best.x)best={i,n,g,raw,amount,x};
   }
   if(!best)continue;
   const before=a.slice(0,best.i).map(x=>x.s).join(' ').replace(/\s+/g,' ').trim();
   let desc=before.replace(/(?:^|\s)\d{1,2}\s*[.\/-]\s*\d{1,2}\s*[.\/-]\s*\d{4}(?:\s|$)/,' ').replace(/\s+/g,' ').trim();
   if(!desc||/ONCEKI DONEMDEN DEVIR|DEVREDEN BAKIYE|DONEM BORCU|GENEL TOPLAM|ISLEM TOPLAMLARI/i.test(seNorm(desc)))continue;
   const kind=seKind(desc,best.raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(best.amount),kind,category,reason:`TEB kesin görsel satır · ${best.raw} · ${d.raw} · S${pg.page}`});
  }
 }
 const seen=new Set();return out.filter(r=>{const k=[r.date,seNorm(r.title),r.amount,r.kind].join('|');if(seen.has(k))return false;seen.add(k);return true});
}

// V238 — TEB banka harcama toplamını footer'dan geri getir.
// SADE ekstrede gerçek harcama toplamı "BU KARTINIZLA YAPILAN İŞLEM TOPLAMLARI"
// ve "GENEL TOPLAM" footer alanında banka tarafından basılır. Devir/ödeme veya işlem
// satırındaki rakamı toplam sanmamak için yalnız iki footer etiketi çevresindeki ortak/
// tekrarlanan parasal değer kabul edilir.
// V244 — TEB banka özetindeki gerçek HARCAMALAR alanını bağımsız oku.
// Kaynak: "DEVREDEN BAKİYE  HARCAMALAR  FAİZ/ÜCRET  ÖDEMELER  DÖNEM BORCU" başlıklı banka özet tablosu.
// İşlem satırlarından veya muhasebe denkleminden değer TÜRETMEZ; yalnız bankanın basılı özet alanını kabul eder.
function seTebPrintedSpend(pages){
 const src=[];for(const pg of pages){src.push(...(pg.logicalLines||[]),...(pg.rawLines||[]));}
 const flat=src.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean).join(' ');
 const n=seNorm(flat), head=/DEVREDEN\s+BAKIYE\s+HARCAMALAR(?:INIZ)?\s+(?:FAIZ\s+UCRETLER\s+VE\s+KESINTILER|FAIZ\s+VE\s+UCRETLER|FAIZ\s*\/\s*UCRET)\s+ODEMELER(?:INIZ)?\s+DONEM\s+BORCU/;
 const m=head.exec(n);if(!m)return null;
 // seNorm karakter sayısını korur; başlığın hemen sonrasındaki dar özet alanını oku.
 const tail=flat.slice(m.index+m[0].length,m.index+m[0].length+700);
 const stopN=seNorm(tail), stop=stopN.search(/DOGUM\s+GUNUNUZ|BUYUK\s+MUKELLEF|EKSTRE\s+ILE\s+ILGILI|ISLEM\s+TARIHI/);
 const chunk=stop>=0?tail.slice(0,stop):tail;
 const vals=[...chunk.matchAll(/([+-]?(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2})\s*TL\b/gi)].map(x=>seMoney(x[1])).filter(v=>v!=null);
 if(vals.length<5)return null;
 const out={previous:Math.abs(vals[0]),spend:Math.abs(vals[1]),fees:Math.abs(vals[2]),payments:Math.abs(vals[3]),debt:Math.abs(vals[4])};
 // Beş sütun birlikte muhasebe denklemine oturmuyorsa yanlış metin sırası kabul edilmez.
 const calc=Math.round((out.previous+out.spend+out.fees-out.payments)*100)/100;
 if(Math.abs(calc-out.debt)>.03)return null;
 return out;
}

function seTebFooterSpend(pages,previous,payments){
 const lines=[];for(const pg of pages)lines.push(...(pg.logicalLines||[]),...(pg.rawLines||[]));
 const flat=lines.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean).join(' '), n=seNorm(flat);
 const A='BU KARTINIZLA YAPILAN ISLEM TOPLAMLARI',G='GENEL TOPLAM',ai=n.indexOf(A),gi=n.indexOf(G);if(ai<0||gi<0)return null;
 const moneyVals=t=>[...String(t||'').matchAll(/(?:TL\.?\s*)?([+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-))/gi)].map(m=>seMoney(m[1])).filter(v=>v!=null&&v>=0);
 const after=(idx,len,span)=>moneyVals(flat.slice(idx+len,idx+len+span));
 const av=after(ai,A.length,220),gv=after(gi,G.length,140),eq=(a,b)=>Math.abs(a-b)<=.01;
 const forbidden=v=>(previous!=null&&eq(v,Math.abs(previous)))||(payments!=null&&eq(v,Math.abs(payments)));
 const common=[];for(const a of av)for(const g of gv)if(eq(a,g)&&!forbidden(a)&&!common.some(x=>eq(x,a)))common.push(a);
 if(common.length===1)return common[0];
 // PDF metin sırası iki tutarı etiketlerin sonuna taşıdıysa dar footer alanında tekrar eden tek değeri kabul et.
 const lo=Math.min(ai,gi),hi=Math.max(ai+A.length,gi+G.length),vv=moneyVals(flat.slice(lo,Math.min(flat.length,hi+180))).filter(v=>!forbidden(v));
 const counts=[];for(const v of vv){let q=counts.find(x=>eq(x.v,v));q?q.n++:counts.push({v,n:1})}const dup=counts.filter(x=>x.n>=2);
 return dup.length===1?dup[0].v:null;
}

function seTebStreamRows(pages){
 const out=[];
 const amt='(?:\\d{1,3}(?:\\.\\d{3})*|\\d+)(?:,\\d{2}|,-)';
 const rx=new RegExp('(\\d{1,2}\\s*[./-]\\s*\\d{1,2}\\s*[./-]\\s*\\d{4})\\s+(.{2,180}?)\\s+(-?\\s*TL\\.?\\s*'+amt+')(?=\\s|$)','gi');
 for(const pg of pages){
  let stream=(pg.items||[]).map(x=>x.s).join(' ').replace(/\\s+/g,' ').trim();
  const n=seNorm(stream), hs=n.indexOf('ISLEM TARIHI'); if(hs>=0)stream=stream.slice(hs);
  let cut=stream.length; for(const end of ['BU KARTINIZLA YAPILAN ISLEM TOPLAMLARI','GENEL TOPLAM','TURK EKONOMI BANKASI','TICARET SICIL NO','MERSIS NO','KART A AIT MN']){const k=seNorm(stream).indexOf(end);if(k>=0&&k<cut)cut=k} stream=stream.slice(0,cut);
  let m; while((m=rx.exec(stream))){
   const d=seDateParts(m[1]),raw=m[3],amount=seMoney(raw); if(!d||amount==null||amount===0)continue;
   let desc=m[2].replace(/\\s+/g,' ').trim();
   // Bir sonraki tarih/özet alanı açıklamaya sızmışsa reddet.
   if(seDateParts(desc)||/DONEM BORCU|SON ODEME|HESAP KESIM|MINIMUM ODEME/i.test(seNorm(desc)))continue;
   const kind=seKind(desc,raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(amount),kind,category,reason:`TEB akış çekirdeği · ${raw} · ${d.raw} · S${pg.page}`});
  }
 }
 const seen=new Set();return out.filter(r=>{const k=[r.date,seNorm(r.title),r.amount,r.kind].join('|');if(seen.has(k))return false;seen.add(k);return true});
}


// V217 HALKBANK / PARAF: banka profili TEB motorundan tamamen bağımsızdır.
// Paraf ekstreleri 1,234.56 biçimini kullanır; TEB ise 1.234,56 kullanır.
function seHalkMoney(s){
 if(s==null)return null;let x=String(s).trim().replace(/\s+/g,'').replace(/TL/gi,'').replace(/₺/g,'').replace(/^\+/,'').replace(/\+$/,'');
 const neg=/^-/.test(x);x=x.replace(/^-/, '');
 if(x.includes(',')&&x.includes('.')){if(x.lastIndexOf('.')>x.lastIndexOf(','))x=x.replace(/,/g,'');else x=x.replace(/\./g,'').replace(',','.');}
 else if(x.includes(',')){const a=x.split(',');x=(a.length===2&&a[1].length===2)?a[0].replace(/\./g,'')+'.'+a[1]:x.replace(/,/g,'');}
 else if(x.includes('.')){const a=x.split('.');if(!(a.length===2&&a[1].length===2))x=x.replace(/\./g,'');}
 x=x.replace(/[^0-9.]/g,'');const n=Number(x);return Number.isFinite(n)?(neg?-Math.abs(n):Math.abs(n)):null
}
function seHalkRows(pages){
 const out=[],diag={rejected:[]};
 const amtRx=/^[+\-]?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?\+?$/;
 for(const pg of pages){
  const vr=(pg.rows||[]).map(r=>({page:pg.page,y:r.y,items:r.a||[],text:(r.a||[]).map(q=>q.s).join(' ').replace(/\s+/g,' ').trim()}));
  let hi=vr.findIndex(r=>{const n=seNorm(r.text);return n.includes('ISLEM')&&n.includes('TARIHI')&&n.includes('TUTAR')});if(hi<0)continue;
  const head=vr[hi],ti=(head.items||[]).find(x=>seNorm(x.s).includes('TUTAR')),amountX=ti?.x;
  let activeDate=null,pending='';
  for(let i=hi+1;i<vr.length;i++){
   const rr=vr[i],n=seNorm(rr.text);if(/BIR SONRAKI|EKSTRE ILE ILGILI|TURKIYE HALK BANKASI|FAIZ ORANLARI/.test(n))break;
   if(/BIR ONCEKI DONEM/.test(n)||/KART NO/.test(n)){pending='';continue}
   const d=seDateParts(rr.text);if(d)activeDate=d;
   const cells=[];for(const it of (rr.items||[])){const raw=String(it.s||'').replace(/\s/g,'');if(!amtRx.test(raw))continue;const v=seHalkMoney(raw);if(v==null)continue;if(Number.isFinite(amountX)&&Math.abs(it.x-amountX)>90)continue;cells.push({it,raw,v})}
   cells.sort((a,b)=>Math.abs(a.it.x-(amountX??a.it.x))-Math.abs(b.it.x-(amountX??b.it.x)));
   if(cells.length&&activeDate){const c=cells[0];let desc=(rr.items||[]).filter(it=>it.x<c.it.x-3&&!amtRx.test(String(it.s||'').replace(/\s/g,''))).map(it=>it.s).join(' ').replace(/\b\d{1,2}[./-]\d{1,2}[./-]\d{4}\b/g,' ').replace(/\s+/g,' ').trim();
    if(pending)desc=(pending+' '+desc).replace(/\s+/g,' ').trim();pending='';
    if(!desc){diag.rejected.push(`S${pg.page}: ${rr.text}`);continue}
    const amount=Math.abs(c.v);if(amount<0.005)continue;
    const kind=seKind(desc,c.raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
    out.push({date:activeDate.iso,title:desc,bankTitle:desc,amount,kind,category,reason:`Halkbank Paraf fiziksel satır · ${c.raw} · S${pg.page}`});
   }else if(activeDate&&rr.text&&!seDateParts(rr.text)&&!cells.length&&!/KALAN BORC|PARAFPARA|ACIKLAMA/.test(n))pending=(pending+' '+rr.text).trim();
  }
 }
 // Aynı işlem gerçekten tekrar edebilir; yalnız PDF'nin aynı fiziksel satırı iki kez üretmesini engelle.
 const seen=new Set();return{rows:out.filter(r=>{const k=[r.date,seNorm(r.title),Math.round(r.amount*100),r.kind].join('|');if(seen.has(k))return false;seen.add(k);return true}),rejected:diag.rejected}
}

// V219 HALKBANK / PARAF: logical/raw line fallback.
// Halkbank PDF'lerinde tutar hücresi koordinat olarak TUTAR başlığından uzak düşebiliyor.
// Bu okuyucu koordinata güvenmez: tarih + açıklama + ilk para değerini işlem tutarı kabul eder;
// ardından gelen KALAN BORÇ / ParafPara değerlerini işlem tutarına karıştırmaz.
function seHalkLineRows(pages){
 const out=[],rejected=[];
 // V220: Halkbank PDF'lerinde başlık fiziksel olarak 3-5 ayrı satıra bölünebiliyor.
 // Bu nedenle tek satırda "İŞLEM TARİHİ + TUTAR" başlığı aramıyoruz. Tarihle başlayan gerçek
 // işlem satırlarını doğrudan okuyor, özet/sonraki dönem alanlarını kara listeyle dışlıyoruz.
 const dateStart=/^(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})(?:\s+|$)(.*)$/;
 const moneyToken=/[+\-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})\+?/g;
 const hardStop=/BIR SONRAKI|EKSTRE ILE ILGILI|TURKIYE HALK BANKASI|FAIZ ORANLARI|MERSIS|TICARET SICIL/;
 const skip=/HESAP KESIM|SON ODEME|HESAP BAKIYESI|ASGARI ODEME|KART LIMIT|KULLANILABILIR|NAKIT AVANS|MUSTERI NUMARASI|PARAFPARA BILGILER|TOPLAM PARAFPARA|DEVREDEN PARAFPARA|KAZANILAN PARAFPARA/;
 const header=/ISLEM TARIHI|ACIKLAMA|TUTAR\s*\(?TL\)?|KALAN BORC|TAKSIT|PARAFPARA/;
 for(const pg of pages){
  // logicalLines ve rawLines aynı satırı farklı biçimde verebilir. İkisini de dene; sonda fingerprint tekilleştirir.
  const src=[...(pg.logicalLines||[]),...(pg.rawLines||[])].map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  for(let i=0;i<src.length;i++){
   const line=src[i],n=seNorm(line); if(hardStop.test(n)||skip.test(n))continue;
   const m=line.match(dateStart);if(!m)continue;const d=seDateParts(m[1]);if(!d)continue;
   let rest=(m[2]||'').trim();let matches=[...rest.matchAll(moneyToken)];
   if(!matches.length){rejected.push(`S${pg.page}: ${line}`);continue}
   // Halkbank işlem tablosunda tarih sonrası ilk parasal değer TUTAR(TL)'dir.
   // + işaretli "Hesaptan Ödeme" satırları da aynı sütundadır.
   const mm=matches[0],raw=mm[0],amount=seHalkMoney(raw);if(amount==null||Math.abs(amount)<0.005)continue;
   let desc=rest.slice(0,mm.index).trim();
   // Bazı Paraf PDF'lerinde açıklama bir önceki fiziksel satıra taşar. Yalnız açıklama boşsa kullan.
   if(!desc){
    for(let j=i-1;j>=Math.max(0,i-2);j--){const q=src[j],qn=seNorm(q);if(dateStart.test(q)||header.test(qn)||hardStop.test(qn)||skip.test(qn))continue;if(/[A-ZÇĞİÖŞÜa-zçğıöşü]{3}/.test(q)){desc=q;break}}
   }
   if(!desc||header.test(seNorm(desc))||skip.test(seNorm(desc))){rejected.push(`S${pg.page}: ${line}`);continue}
   const kind=seKind(desc,raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(amount),kind,category,reason:`Halkbank Paraf V220 satır okuyucu · ${raw} · S${pg.page}`});
  }
 }
 const seen=new Set();return{rows:out.filter(r=>{const k=[r.date,seNorm(r.title),Math.round(r.amount*100),r.kind].join('|');if(seen.has(k))return false;seen.add(k);return true}),rejected};
}

function seHalkSummary(pages){
 const lines=[];for(const p of pages){lines.push(...(p.logicalLines||[]),...(p.rawLines||[]));}
 const normLines=lines.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean);
 const get=(labels)=>{for(let i=0;i<normLines.length;i++){const n=seNorm(normLines[i]);if(!labels.some(z=>n.includes(seNorm(z))))continue;const joined=normLines.slice(i,Math.min(i+3,normLines.length)).join(' ');const ms=[...joined.matchAll(/[+\-]?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})\s*TL/gi)];if(ms.length){const v=seHalkMoney(ms[0][0]);if(v!=null)return Math.abs(v)}}return null};
 return{previous:get(['BIR ONCEKI DONEM']),spend:get(['DONEM ICI BORC TUTARI']),fees:get(['TOPLAM FAIZ, UCRET','TOPLAM FAIZ UCRET']),payments:get(['DONEMSEL ALACAK']),debt:get(['HESAP BAKIYESI'])}
}




// V228 DENIZBANK: DenizBank ekstreleri 1,234.56 para biçimi kullanır.
// Özet alanları ve işlem satırları banka PDF'sinden doğrudan okunur; Bonus sütunu işlem tutarı sayılmaz.
function seDenizSummary(pages){
 const lines=[];for(const p of pages)lines.push(...(p.logicalLines||[]),...(p.rawLines||[]));
 const src=lines.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean);
 const get=(label)=>{const L=seNorm(label);for(const line of src){const n=seNorm(line);if(!n.includes(L))continue;const ms=[...line.matchAll(/[+\-]?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})\+?\s*TL/gi)];if(ms.length){const v=seHalkMoney(ms[ms.length-1][0]);if(v!=null)return Math.abs(v)}}return null};
 return {previous:get('ONCEKI HESAP BAKIYENIZ'),spend:get('DONEM ICI HARCAMANIZ'),fees:get('TOPLAM FAIZ VE UCRETLER'),payments:get('ODEMELER'),debt:get('DONEM BORCU')};
}
function seDenizRows(pages){
 const out=[],rejected=[];
 const dateStart=/^(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})(?:\s+|$)(.*)$/;
 const moneyTL=/[+\-]?(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})\+?\s*TL/gi;
 // V234: 'NAKIT AVANS' genel kara listeden çıkarıldı. Gerçek işlem satırları (150,00 nakit avans ve 1,50 nakit avans ücreti) artık atlanmaz.
 const skip=/ONCEKI DONEM EKSTRE BORCU|TOPLAM\s|DONEM BORCU|ASGARI ODEME|HESAP KESIM|SON ODEME|KART LIMIT|NAKIT AVANS LIMITI|NAKIT AVANS BILGILERI|HARCANABILIR BONUS|BIR SONRAKI AY/;
 for(const pg of pages){
  const primary=(pg.logicalLines&&pg.logicalLines.length?pg.logicalLines:pg.rawLines||[]);
  const src=primary.map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean);
  for(const line of src){
   const m=line.match(dateStart);if(!m)continue;const d=seDateParts(m[1]);if(!d)continue;const rest=(m[2]||'').trim(),n=seNorm(rest);if(skip.test(n))continue;
   const ms=[...rest.matchAll(moneyTL)];if(!ms.length){rejected.push(`S${pg.page}: ${line}`);continue}
   // İşlem Tutarı DenizBank tablosunun en sağındaki/son TL değeridir. Bonus değeri TL eki taşımadığından karışmaz.
   const mm=ms[ms.length-1],amount=seHalkMoney(mm[0]);if(amount==null||Math.abs(amount)<.005)continue;
   // V231: Aynı DenizBank işlem satırındaki diğer TL hücrelerini de kanıt adayı olarak sakla.
   // Varsayılan yine bankanın işlem tutarı sütunu (son TL); adaylar yalnız banka toplamıyla TAM ve TEKİL eşleşme varsa kullanılabilir.
   const amountCandidates=[...new Set(ms.map(x=>seHalkMoney(x[0])).filter(Number.isFinite).map(Math.abs).filter(x=>x>=.005))];
   let desc=rest.slice(0,mm.index).trim();
   // Açıklamanın sonundaki bonus puanı (örn. 0.60) işlem adı değildir.
   desc=desc.replace(/\s+\d+(?:\.\d{1,2})\s*$/,'').trim();
   if(!desc||skip.test(seNorm(desc)))continue;
   const kind=seKind(desc,mm[0]),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(amount),amountCandidates,kind,category,reason:`DenizBank V234 satır okuyucu · ${mm[0]} · S${pg.page}`});
  }
 }
 // V229 DenizBank: aynı gün/aynı işyeri/aynı tutardaki gerçek mükerrer harcamaları koru.
 // logicalLines tercih edildiği için aynı PDF satırının raw/logical çift kopyası artık oluşmaz.
 return {rows:out,rejected};
}

function seDenizReconcileRows(rows,vals){
 if(!rows?.length)return rows||[];
 const bankFee=+vals.fees||0, bankSpend=+vals.spend||0;
 // V231 DenizBank: bazı PDF varyantlarında işlem satırında birden fazla TL hücresi vardır ve
 // metin çıkarım sırası işlem tutarını son hücreye koymayabilir. Banka özet toplamı ile yalnızca
 // TEK bir satırdaki TEK bir alternatif tutar tam eşleşiyorsa o hücreyi seç. Fark tahmini yapılmaz.
 const exactOneAmountFix=(kind,target,label)=>{
  if(!(target>=0))return;const cur=rows.filter(r=>r.kind===kind).reduce((a,r)=>a+(+r.amount||0),0),delta=Math.round((target-cur)*100);if(!delta)return;
  const hits=[];rows.forEach((r,i)=>{if(r.kind!==kind)return;const base=Math.round((+r.amount||0)*100);for(const a of (r.amountCandidates||[])){const c=Math.round((+a||0)*100);if(c!==base&&c-base===delta)hits.push({i,a})}});
  if(hits.length===1){const h=hits[0],old=rows[h.i];rows=rows.map((r,i)=>i===h.i?{...r,amount:h.a,reason:(r.reason||'')+` · V231 DenizBank ${label} banka toplamıyla tekil hücre doğrulaması`}:r)}
 };
 exactOneAmountFix('spend',bankSpend,'harcama');
 exactOneAmountFix('fee',bankFee,'faiz/ücret');
 // V233: Tek satır doğrulaması yetmezse, aynı türdeki satırların alternatif TL hücreleri
 // arasından banka özetindeki farkı TAM karşılayan BENZERSİZ kombinasyonu ara.
 // Bu bir fark kapatma değildir: yalnız PDF satırında gerçekten bulunan tutarlar kullanılabilir.
 const exactCandidateSetFix=(kind,target,label)=>{
  if(!(target>=0))return;
  const cur=rows.filter(r=>r.kind===kind).reduce((a,r)=>a+(+r.amount||0),0),need=Math.round((target-cur)*100);
  if(!need)return;
  const opts=[];
  rows.forEach((r,i)=>{
   if(r.kind!==kind)return;
   const base=Math.round((+r.amount||0)*100), ds=[];
   for(const a of (r.amountCandidates||[])){const c=Math.round((+a||0)*100),d=c-base;if(d&&Math.abs(d)<=Math.abs(need)&&Math.sign(d)===Math.sign(need))ds.push({a,d})}
   const unique=[...new Map(ds.map(x=>[x.d,x])).values()]; if(unique.length)opts.push({i,choices:unique});
  });
  let sols=[];
  const dfs=(pos,sum,pick)=>{
   if(sols.length>1)return;
   if(sum===need){sols.push(pick.slice());return}
   if(pos>=opts.length||Math.abs(sum)>Math.abs(need))return;
   dfs(pos+1,sum,pick);
   for(const ch of opts[pos].choices){pick.push({i:opts[pos].i,a:ch.a});dfs(pos+1,sum+ch.d,pick);pick.pop();if(sols.length>1)return}
  };
  dfs(0,0,[]);
  if(sols.length===1&&sols[0].length){const fix=new Map(sols[0].map(x=>[x.i,x.a]));rows=rows.map((r,i)=>fix.has(i)?{...r,amount:fix.get(i),reason:(r.reason||'')+` · V233 DenizBank ${label} banka toplamıyla benzersiz çoklu hücre doğrulaması`}:r)}
 };
 exactCandidateSetFix('spend',bankSpend,'harcama');
 exactCandidateSetFix('fee',bankFee,'faiz/ücret');
 let spendRows=rows.filter(r=>r.kind==='spend'), feeRows=rows.filter(r=>r.kind==='fee');
 let spend=spendRows.reduce((a,r)=>a+(+r.amount||0),0), fees=feeRows.reduce((a,r)=>a+(+r.amount||0),0);
 const needFee=Math.round((bankFee-fees)*100);
 const excessSpend=Math.round((spend-bankSpend)*100);
 // DenizBank bazı PDF'lerde faiz/ücret alt satırlarının açıklamasını işlem metnine birleştiriyor.
 // Bankanın AÇIK "Toplam Faiz ve Ücretler" değeri kadar fazla harcama varsa, yalnız tam ve benzersiz
 // bir alt-küme bulunduğunda bu satırları faiz/ücrete çevir. Tahmin veya fark kapatma yapılmaz.
 if(needFee>0 && excessSpend===needFee){
  const cand=rows.map((r,i)=>({r,i,c:Math.round((+r.amount||0)*100)})).filter(x=>x.r.kind==='spend'&&x.c>0&&x.c<=needFee);
  let sols=[];
  const dfs=(pos,sum,pick)=>{if(sols.length>1)return;if(sum===needFee){sols.push(pick.slice());return}if(sum>needFee||pos>=cand.length)return;for(let j=pos;j<cand.length;j++){pick.push(cand[j].i);dfs(j+1,sum+cand[j].c,pick);pick.pop();if(sols.length>1)return}};
  dfs(0,0,[]);
  if(sols.length===1){const chosen=new Set(sols[0]);rows=rows.map((r,i)=>chosen.has(i)?{...r,kind:'fee',category:'Vergi & Faiz',reason:(r.reason||'')+' · V229 DenizBank banka faiz toplamı ile kesin eşleşme'}:r)}
 }
 return rows;
}



// V230 ZİRAAT BANKKART: Bankkart PDF'lerinde işlem tutarı Türk para biçimindedir.
// '+' son eki yalnız gerçek kart ödemesini belirtir. Taksit açıklamasındaki toplam işlem tutarı
// işlem tutarı değildir; satırın EN SON parasal değeri gerçek ekstre hareketidir.
function seZiraatRows(pages){
 const perPage=[],rejected=[];
 const dateRx=/^(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})\s+(.+)$/;
 const moneyRx=/(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}\+?/g;
 const stop=/FAIZ VE UCRETLER|AYLIK FAIZ ORAN|YILLIK FAIZ ORAN|DEVREDEN BAKIYE|HARCAMALARINIZ|ODEMELERINIZ|DONEM BORCU|BUYUK MUKELLEF|BANKKART AVANTAJ/;
 for(const pg of pages){
  const src=(pg.logicalLines&&pg.logicalLines.length?pg.logicalLines:pg.rawLines||[]).map(x=>String(x||'').replace(/\s+/g,' ').trim()).filter(Boolean), rows=[];
  for(const line of src){
   const m=line.match(dateRx);if(!m)continue;const d=seDateParts(m[1]);if(!d)continue;
   const rest=m[2].trim(),n=seNorm(rest);if(stop.test(n))continue;
   const ms=[...rest.matchAll(moneyRx)];if(!ms.length){rejected.push(`S${pg.page}: ${line}`);continue}
   const mm=(ms.length>1&&!/TL\s*ISLEMIN|TL\s*İŞLEMIN|TL\s*İŞLEMİN/i.test(rest))?ms[0]:ms[ms.length-1],raw=mm[0],amount=seMoney(raw.replace(/\+$/,''));if(amount==null||Math.abs(amount)<.005)continue;
   let desc=rest.slice(0,mm.index).trim();
   // Taksit satırında açıklama içinde "3.750,00 TL İşlemin 1/2 Taksidi" bulunabilir; açıklama olarak korunur.
   if(!desc||stop.test(seNorm(desc)))continue;
   const kind=/\+$/.test(raw)?'payment':seKind(desc,raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   rows.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(amount),kind,category,reason:`Ziraat Bankkart V230 satır okuyucu · ${raw} · S${pg.page}`});
  }
  perPage.push(rows);
 }
 // Bazı Ziraat PDF'lerinde yeni sayfa önceki sayfanın son birkaç satırını tekrar eder.
 // Yalnız sayfa sınırındaki en uzun suffix/prefix örtüşmesini kaldır; aynı gün gerçek mükerrerleri koru.
 const fp=r=>[r.date,seNorm(r.title),Math.round(r.amount*100),r.kind].join('|');let out=[];
 for(const rows of perPage){let ov=0,max=Math.min(out.length,rows.length);for(let k=1;k<=max;k++){let ok=true;for(let j=0;j<k;j++)if(fp(out[out.length-k+j])!==fp(rows[j])){ok=false;break}if(ok)ov=k}out.push(...rows.slice(ov))}
 return {rows:out,rejected};
}
function seZiraatSummary(pages){
 let previous=null,spend=null,fees=null,payments=null,debt=null;
 // Devreden ve dönem borcu üst bilgi/işlem başlığından da bağımsız okunur.
 const all=[];for(const p of pages)all.push(...(p.logicalLines||[]),...(p.rawLines||[]));
 for(const line0 of all){const line=String(line0||'').replace(/\s+/g,' ').trim(),n=seNorm(line);
  if(previous==null&&/ONCEKI AYDAN DEVIR/.test(n)){const ms=[...line.matchAll(/(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}/g)];if(ms.length)previous=seMoney(ms[ms.length-1][0])}
  if(debt==null&&/DONEM BORCU TL/.test(n)){const ms=[...line.matchAll(/(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}/g)];if(ms.length)debt=seMoney(ms[0][0])}
 }
 // Muhasebe denkleminin değer satırı: 5 TL değeri sırasıyla devir, harcama, faiz/ücret, ödeme, dönem borcudur.
 for(const pg of pages){const rr=pg.rawLines||[];for(let i=0;i<rr.length;i++){const n=seNorm(rr[i]);if(!(/DEVREDEN BAKIYE/.test(n)&&/HARCAMALARINIZ/.test(n)&&/ODEMELERINIZ/.test(n)&&/DONEM BORCU/.test(n)))continue;
   for(let j=i+1;j<Math.min(i+5,rr.length);j++){const ms=[...String(rr[j]).matchAll(/(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}\s*TL/gi)];if(ms.length>=5){const v=ms.slice(0,5).map(x=>seMoney(x[0].replace(/TL/ig,'')));[previous,spend,fees,payments,debt]=v;return{previous,spend,fees,payments,debt}}}
  }}
 // PDF.js satır gruplaması başlıkları ayırdıysa, görsel satırlarda 5 TL değerli denklemi ara.
 for(const pg of pages){for(const r of (pg.rows||[])){const text=(r.a||[]).map(q=>q.s).join(' '),ms=[...text.matchAll(/(?:\d{1,3}(?:\.\d{3})*|\d+),\d{2}\s*TL/gi)];if(ms.length>=5){const v=ms.slice(0,5).map(x=>seMoney(x[0].replace(/TL/ig,'')));if(v.every(x=>x!=null)){[previous,spend,fees,payments,debt]=v;return{previous,spend,fees,payments,debt}}}}}
 return{previous,spend,fees,payments,debt};
}

// V224 İş Bankası Maximum fallback: bazı Maximum PDF'lerinde koordinat satırları tarih hücresini
// kaybedebiliyor (0 tarih adayı). Metin katmanındaki tam işlem satırını doğrudan okur.
function seIsbankLineRows(pages){
 const out=[],rejected=[];
 const dateRx=/^(\d{1,2}\s*[.\/-]\s*\d{1,2}\s*[.\/-]\s*\d{4})\s+(.+)$/;
 const moneyRx=/[-+]?\s*(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-)/g;
 const stop=/\*{3}ODEMELER|AYLIK\s*TAKSITLI|KALAN\s*TAKSITLI|KREDI\s*KARTI\s*HESAP\s*OZETI|MESAJINIZ\s*VAR|TOPLAM\s+\d/i;
 for(const pg of pages){
  const src=[...(pg.logicalLines||[]),...(pg.rawLines||[])];
  for(const rawLine of src){
   const line=String(rawLine||'').replace(/\s+/g,' ').trim(), n=seNorm(line);
   if(!line||stop.test(n)||/BIRONCEKIHESAPOZETIBAKIYENIZ|BIR ONCEKI HESAP OZETI BAKIYENIZ/.test(n))continue;
   const m=line.match(dateRx); if(!m)continue;
   const d=seDateParts(m[1]); if(!d)continue;
   let rest=m[2].trim(); const ms=[...rest.matchAll(moneyRx)]; if(!ms.length){rejected.push(`S${pg.page}: ${line}`);continue}
   // İş Bankası Maximum satırında ilk parasal değer gerçek TUTAR'dır. Sağdaki MaxiPuan ve
   // taksit parantezi finansal hareket değildir.
   const mm=ms[0], raw=mm[0], amount=seMoneySigned(raw); if(amount==null||Math.abs(amount)<0.005)continue;
   let desc=rest.slice(0,mm.index).trim(); if(!desc)continue;
   if(/MAXIPUAN\s*ILAVE/.test(seNorm(desc)))continue;
   const kind=seKind(desc,raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   out.push({date:d.iso,title:desc,bankTitle:desc,amount:Math.abs(amount),kind,category,reason:`İş Bankası Maximum V225 metin satırı · ${raw} · S${pg.page}`});
  }
 }
 const seen=new Set(); return {rows:out.filter(r=>{const k=[r.date,seNorm(r.title),Math.round(r.amount*100),r.kind].join('|');if(seen.has(k))return false;seen.add(k);return true}),rejected};
}

function seProfile(bank){
 const profiles={
  TEB:{id:'TEB',locked:true,tableStart:['ISLEM TARIHI','ISLEM ACIKLAMASI','TUTAR'],tableEnd:['BU KARTINIZLA YAPILAN ISLEM TOPLAMLARI','GENEL TOPLAM'],devir:['ONCEKI DONEMDEN DEVIR EDILEN TUTAR','DEVREDEN BAKIYE'],debt:['DONEM BORCU'],pay:['ODEMELERINIZ','ODEME TOPLAMI']},
  'İş Bankası':{id:'ISBANK',locked:true,tableStart:['ISLEM TARIHI','ACIKLAMA','TUTAR'],tableEnd:['TOPLAM'],devir:['BIR ONCEKI HESAP OZETI BAKIYENIZ','ONCEKI HESAP OZETI BAKIYENIZ','ONCEKI DONEM BORCU','DEVREDEN'],debt:['HESAP OZETI BORCU','DONEM BORCU'],pay:['HESAPTAN AKTARIM','ODEME']},
  DenizBank:{id:'DENIZ',locked:true,tableStart:['ISLEM TARIHI','ACIKLAMA','TUTAR'],tableEnd:['TOPLAM'],devir:['ONCEKI DONEM','DEVREDEN'],debt:['DONEM BORCU'],pay:['ODEME']},
  Halkbank:{id:'HALK',locked:true,tableStart:['ISLEM TARIHI','ACIKLAMA','TUTAR'],tableEnd:['BIR SONRAKI'],devir:['BIR ONCEKI DONEM EKSTRE BORCU'],debt:['HESAP BAKIYESI'],pay:['DONEMSEL ALACAK KAYITLARI']},
  Ziraat:{id:'ZIRAAT',locked:true,tableStart:['ISLEM TARIHI','ISLEM ACIKLAMASI','TL TUTAR'],tableEnd:['FAIZ VE UCRETLER'],devir:['ONCEKI AYDAN DEVIR'],debt:['DONEM BORCU TL'],pay:['ODEMELERINIZ']}
 };return profiles[bank]||{id:'GENEL',locked:false,tableStart:['ISLEM TARIHI','TUTAR'],tableEnd:['GENEL TOPLAM'],devir:['DEVREDEN','ONCEKI DONEM'],debt:['DONEM BORCU'],pay:['ODEME']}
}
function seCardBankKey(v){
 const n=seNorm(String(v||''));
 if(/DENIZBANK|DENIZ BANK/.test(n))return 'DENIZ';
 if(/HALKBANK|HALK BANK|TURKIYE HALK|PARAF/.test(n))return 'HALK';
 if(/TURK EKONOMI BANKASI|\bTEB\b/.test(n))return 'TEB';
 if(/IS BANKASI|ISBANK|MAXIMUM/.test(n))return 'ISBANK';
 if(/ZIRAAT|BANKKART/.test(n))return 'ZIRAAT';
 return '';
}
function seStatementBankKey(res){return res?.profile?.id||({DenizBank:'DENIZ',Halkbank:'HALK',TEB:'TEB','İş Bankası':'ISBANK',Ziraat:'ZIRAAT'}[res?.bank]||'')}
function seBankLabel(k){return ({DENIZ:'DENİZBANK',HALK:'HALKBANK / PARAF',TEB:'TEB','ISBANK':'İŞ BANKASI / MAXIMUM',ZIRAAT:'ZİRAAT / BANKKART'}[k]||k||'BİLİNMEYEN BANKA')}
function seParse(pages){
 const visualPages=pages.map(pg=>pg.rows.map(r=>({page:pg.page,y:r.y,text:r.a.map(q=>q.s).join(' ').replace(/\s+/g,' ').trim(),items:r.a}))),flat=visualPages.flat().map(r=>r.text),all=flat.join('\n');
 const bank=/TURK EKONOMI BANKASI|TÜRK EKONOMİ BANKASI|\bTEB\b/i.test(all)?'TEB':/DENIZBANK|DENİZBANK/i.test(all)?'DenizBank':/IS BANKASI|İŞ BANKASI|ISBANK\.COM\.TR|MAXIMUM\s+VISA|MAXIPUAN|MAXIMUM\.COM\.TR/i.test(all)?'İş Bankası':/HALK\s*BANK|HALKBANK|TURKIYE\s+HALK\s+BANKASI|TÜRKİYE\s+HALK\s+BANKASI|PARAF/i.test(all)?'Halkbank':/ZIRAAT\s*BANKASI|ZİRAAT\s*BANKASI|BANKKART/i.test(all)?'Ziraat':'Banka',profile=seProfile(bank);
 const diag={pages:pages.length,textItems:pages.reduce((n,p)=>n+p.items.length,0),dateCandidates:0,amountCandidates:0,headerFound:0,tableRows:0,rejected:[],mode:'teb-normalized-row-core-v200'};
 const moneyRx=/^[\s]*(?:TL\.?\s*)?([+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-))([+-])?[\s]*$/i;
 const summary=/TOPLAM|DONEM BORCU|DÖNEM BORCU|ASGARI|ASGARİ|LIMIT|LİMİT|FAIZ ORANI|FAİZ ORANI|AKDI FAIZ|AKDİ FAİZ|GECIKME|YILLIK|AYLIK|EKSTRE OZETI|EKSTRE ÖZETİ/i;
 const devirRx=/(?:ÖNCEKİ|ONCEKI).*(?:DEVIR|DEVİR)|DEVREDEN\s+BAK/i,rows=[];
 function amountCells(rr,amountX){
  const a=rr.items||[],out=[];
  for(let n=1;n<=3;n++)for(let i=Math.max(0,a.length-5);i+n<=a.length;i++){
   const g=a.slice(i,i+n),txt=g.map(x=>x.s).join('').replace(/\s/g,'');if(!moneyRx.test(txt))continue;
   const x=g[0].x;if(Number.isFinite(amountX)&&x<amountX-95)continue;
   const v=seMoney(txt);if(v==null||v===0)continue;out.push({q:g[g.length-1],x,raw:txt,amount:v,parts:g});
  }
  if(bank==='İş Bankası'&&Number.isFinite(amountX)){out.sort((u,v)=>Math.abs(u.x-amountX)-Math.abs(v.x-amountX));}else out.sort((u,v)=>v.x-u.x);const seen=new Set();return out.filter(c=>{if(bank==='İş Bankası'&&Number.isFinite(amountX)&&c.x>amountX+110)return false;const k=c.raw+'|'+Math.round(c.x);if(seen.has(k))return false;seen.add(k);return true});
 }
 for(const vp of visualPages){
  let hi=vp.findIndex(r=>{const n=seNorm(r.text);return n.includes('ISLEM')&&n.includes('TUTAR')});
  if(hi<0)hi=vp.findIndex(r=>{const n=seNorm(r.text);return profile.tableStart.filter(z=>n.includes(seNorm(z))).length>=2});
  if(hi<0){diag.rejected.push(`S${vp[0]?.page||'?'}: işlem tablosu başlığı bulunamadı`);continue}diag.headerFound++;
  const head=vp[hi],tutarItem=[...(head.items||[])].reverse().find(x=>seNorm(x.s).includes('TUTAR')),amountX=tutarItem?.x;
  let fi=vp.findIndex((r,i)=>i>hi&&(profile.tableEnd.some(z=>seNorm(r.text).includes(seNorm(z)))||/TURK EKONOMI BANKASI|TICARET SICIL|MERSIS NO|KART.A AIT MN|BILDIRIMLERINIZI TEB/i.test(seNorm(r.text))));if(fi<0)fi=vp.length;
  const body=vp.slice(hi+1,fi);let activeDate=null;
  for(let i=0;i<body.length;i++){
   const rr=body[i],d=seRowDate(rr,body.slice(Math.max(0,i-1),i));if(d){activeDate=d;diag.dateCandidates++}
   const cells=amountCells(rr,amountX);if(!cells.length)continue;diag.amountCandidates+=cells.length;
   const c=cells[0];if(cells.length>1)diag.rejected.push(`S${rr.page}: ${cells.length} tutar adayı; en sağ sütun seçildi`);
   if(!activeDate){diag.rejected.push(`${c.raw}: önceki işlem tarihi bulunamadı`);continue}
   const firstPart=c.parts[0],descParts=(rr.items||[]).filter(it=>it.x<firstPart.x-3&&!c.parts.includes(it)&&!moneyRx.test(it.s));
   let desc=descParts.map(x=>x.s).join(' ').replace(/\s+/g,' ').trim().replace(/\b\d{1,2}\s*[.\/-]\s*\d{1,2}\s*[.\/-]\s*\d{2,4}\b/g,' ').replace(/\b(?:TL|TRY)\b/gi,' ').replace(/\s+/g,' ').trim();
   // PDF açıklamayı bir üst fiziksel satıra ayırdıysa, yalnız tutar satırı boşken onu kullan.
   if(!desc&&i>0){const pr=body[i-1];desc=(pr.items||[]).filter(it=>!moneyRx.test(it.s)&&!seDateParts(it.s)&&(amountX==null||it.x<amountX-10)).map(x=>x.s).join(' ').replace(/\s+/g,' ').trim()}
   if(!desc||summary.test(desc)||devirRx.test(desc)){diag.rejected.push(`${c.raw}: işlem açıklaması yerine özet/devir satırı`);continue}
   const kind=seKind(desc,c.raw),category=kind==='fee'?'Vergi & Faiz':kind==='payment'?'Kart Ödemesi':seCat(desc);
   rows.push({date:activeDate.iso,title:desc,bankTitle:desc,amount:Math.abs(c.amount),kind,category,reason:`Fiziksel satır · ${c.raw} · ${activeDate.raw} · S${rr.page} · x${Math.round(c.x)}`});
  }
 }
 const halk=bank==='Halkbank'?seHalkRows(pages):null;
 const halkLine=bank==='Halkbank'?seHalkLineRows(pages):null;
 const isbankLine=bank==='İş Bankası'?seIsbankLineRows(pages):null;
 const denizLine=bank==='DenizBank'?seDenizRows(pages):null;
 const ziraatLine=bank==='Ziraat'?seZiraatRows(pages):null;
 const tebRaw=bank==='TEB'?seTebRawLineRows(pages):{rows:[],rejected:[]};
 const tebLogical=bank==='TEB'?seTebLogicalRows(pages):{rows:[],rejected:[]};
 const tebStrictRows=bank==='TEB'?seTebStrictRows(pages):[];
 const tebStreamRows=bank==='TEB'?seTebStreamRows(pages):[];
 const seen=new Set();let uniq=[];for(const r of rows){const k=[r.date,seNorm(r.title),r.amount,r.kind].join('|');if(!seen.has(k)){seen.add(k);uniq.push(r)}}
 if(isbankLine){
  // Koordinat okuyucu tarihleri göremese bile metin satırları güvenilir kaynaktır.
  // Metin okuyucu satır bulduysa onu kullan; böylece MaxiPuan sütunu da işlem tutarına karışmaz.
  if(isbankLine.rows.length){uniq=isbankLine.rows;diag.dateCandidates=uniq.length;diag.amountCandidates=uniq.length;diag.tableRows=uniq.length;diag.rawRejected=(isbankLine.rejected||[]).slice(0,40);diag.mode='isbank-maximum-line-v225';}
 }
 if(halk){
  // V219: koordinat okuyucu boş/eksik kaldığında metin-akışı okuyucusuna geç.
  // Daha çok satır bulmak tek başına yeterli değildir; aynı gerçek satırlar fingerprint ile tekilleştirilir.
  const merged=[...(halk.rows||[]),...((halkLine&&halkLine.rows)||[])], hs=new Set();
  uniq=merged.filter(r=>{const k=[r.date,seNorm(r.title),Math.round(r.amount*100),r.kind].join('|');if(hs.has(k))return false;hs.add(k);return true});
  diag.mode='halkbank-paraf-v222-payment-reconcile';
  diag.dateCandidates=uniq.length;diag.amountCandidates=uniq.length;diag.tableRows=uniq.length;
  diag.rawRejected=[...(halk.rejected||[]),...((halkLine&&halkLine.rejected)||[])].slice(0,40);
 }
 if(denizLine&&denizLine.rows.length){uniq=denizLine.rows;diag.dateCandidates=uniq.length;diag.amountCandidates=uniq.length;diag.tableRows=uniq.length;diag.rawRejected=(denizLine.rejected||[]).slice(0,40);diag.mode='denizbank-line-v228';}
 if(ziraatLine&&ziraatLine.rows.length){uniq=ziraatLine.rows;diag.dateCandidates=uniq.length;diag.amountCandidates=uniq.length;diag.tableRows=uniq.length;diag.rawRejected=(ziraatLine.rejected||[]).slice(0,40);diag.mode='ziraat-bankkart-line-v230';}
 const vals={previous:null,spend:null,fees:null,payments:null,debt:null,spendCount:null};
 function rowValue(labels){labels=Array.isArray(labels)?labels:[labels];for(const line of flat){const n=seNorm(line);if(!labels.some(z=>n.includes(seNorm(z))))continue;const ms=[...line.matchAll(/(?:TL\.?\s*)?([+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-))/gi)];if(ms.length){const v=seMoney(ms[ms.length-1][1]);if(v!=null)return Math.abs(v)}}return null}
 vals.previous=rowValue(profile.devir);vals.debt=rowValue(profile.debt);
 if(bank==='DenizBank'){const dv=seDenizSummary(pages);Object.assign(vals,dv);uniq=seDenizReconcileRows(uniq,vals);vals.spendCount=uniq.filter(r=>r.kind==='spend').length;}
 if(bank==='Ziraat'){const zv=seZiraatSummary(pages);Object.assign(vals,zv);vals.spendCount=uniq.filter(r=>r.kind==='spend').length;}
 if(bank==='Halkbank'){
  const hv=seHalkSummary(pages);Object.assign(vals,hv);
  // V222: Bazı Paraf PDF'lerinde "Hesaptan Ödeme" satırının + işareti PDF metin
  // katmanında kayboluyor. Bu durumda satır açıklaması da eksik/bozuk gelebiliyor ve
  // gerçek ödeme, harcama olarak sınıflanıyordu. Bankanın açık DONEMSEL ALACAK toplamı
  // varken motor hiç ödeme bulamamışsa SADECE aynı tutardaki tek fiziksel satırı ödeme
  // olarak yeniden sınıflandır. Sentetik satır/tutar üretme; doğru okunan ekstreye dokunma.
  const payNow=Math.round(uniq.filter(r=>r.kind==='payment').reduce((a,r)=>a+r.amount,0)*100)/100;
  if((hv.payments||0)>0 && payNow===0){
    const target=Math.round(hv.payments*100)/100;
    const exact=uniq.map((r,i)=>({r,i})).filter(x=>x.r.kind==='spend'&&Math.abs(x.r.amount-target)<=.01);
    if(exact.length===1){
      const i=exact[0].i,r=uniq[i];
      uniq[i]={...r,kind:'payment',category:'Kart Ödemesi',reason:(r.reason||'')+' · V222 Halkbank banka alacak toplamıyla doğrulanan ödeme'};
      diag.halkbankPaymentRepair={amount:target,row:i,mode:'exact-bank-payment-total'};
    }
  }
  vals.spendCount=uniq.filter(r=>r.kind==='spend').length;
}
 // TEB: iki bağımsız satır okuyucudan hangisinin muhasebe denklemi banka dönem borcuna daha yakınsa onu seç.
 // Satır sayısı artık seçim ölçütü değildir. Böylece çok satır bulan ama ödeme/tutar eşleşmesini bozan akış okuyucusu kazanamaz.
 if(bank==='TEB'){
  // V213: TEB için tek okuyucuya körü körüne güvenme. PDF'nin ham satır, mantıksal satır,
  // görsel satır ve akış kanallarını AYRI adaylar olarak kur; banka dönem borcu denklemini
  // en küçük kuruş farkıyla kapatan adayı seç. Özet rakamı işlem olarak EKLEME ve fark üretme.
  const candidates=[
   {id:'raw',rows:tebRaw.rows,rejected:tebRaw.rejected},
   {id:'logical',rows:tebLogical.rows,rejected:tebLogical.rejected},
   {id:'strict',rows:tebStrictRows,rejected:[]},
   {id:'stream',rows:tebStreamRows,rejected:[]}
  ].filter(c=>c.rows&&c.rows.length);
  const summarize=rs=>{const z={spend:0,fees:0,payments:0,refunds:0};for(const r of rs)z[r.kind==='refund'?'refunds':r.kind==='payment'?'payments':r.kind==='fee'?'fees':'spend']+=r.amount;for(const k in z)z[k]=Math.round(z[k]*100)/100;return z};
  const score=c=>{const z=summarize(c.rows);if(vals.previous==null||vals.debt==null)return 1e15-c.rows.length;const calc=Math.round((vals.previous+z.spend+z.fees-z.payments-z.refunds)*100)/100;return Math.round(Math.abs(calc-vals.debt)*100)/100};
  candidates.sort((a,b)=>score(a)-score(b)||b.rows.length-a.rows.length);
  const best=candidates[0];
  if(best){
   uniq=best.rows.slice();
   // V214: Bir kanal bir gerçek hareketi atladıysa farkı tahmin etme. Diğer bağımsız
   // okuyucularda bulunan GERÇEK satırları aday havuzuna al ve yalnız banka dönem
   // borcu denklemini KURUŞU KURUŞUNA kapatan satır(lar) varsa deftere ekle.
   // Böylece mevcut doğru 4 ekstre değişmez; yalnız eksik fiziksel PDF satırı kurtarılır.
   const rowKey=r=>[r.date,seNorm(r.bankTitle||r.title),Math.round(r.amount*100),r.kind].join('|');
   const have=new Set(uniq.map(rowKey)), extras=[];
   for(const c of candidates)for(const r of c.rows){const k=rowKey(r);if(!have.has(k)&&!extras.some(x=>rowKey(x)===k))extras.push(r)}
   const ledgerCalc=rs=>{const z=summarize(rs);return vals.previous==null?null:Math.round((vals.previous+z.spend+z.fees-z.payments-z.refunds)*100)/100};
   let cur=ledgerCalc(uniq), target=vals.debt, recovered=[];
   if(cur!=null&&target!=null&&Math.abs(cur-target)>.01){
    const exact=(rs)=>Math.abs(ledgerCalc(uniq.concat(rs))-target)<=.01;
    // Önce tek eksik satır; sonra en fazla iki satırlık kombinasyon. Hiçbir sentetik
    // tutar oluşturulmaz ve özet rakamı hareket olarak kullanılmaz.
    for(const r of extras){if(exact([r])){recovered=[r];break}}
    if(!recovered.length)outer:for(let i=0;i<extras.length;i++)for(let j=i+1;j<extras.length;j++){if(exact([extras[i],extras[j]])){recovered=[extras[i],extras[j]];break outer}}
    if(recovered.length){uniq=uniq.concat(recovered);diag.recoveredRows=recovered.map(r=>({date:r.date,title:r.title,amount:r.amount,kind:r.kind}));}
   }
   diag.mode='teb-multi-channel-ledger-v214-'+best.id+(recovered.length?'-recovered':'');diag.rawRejected=(best.rejected||[]).slice(0,40);diag.rawRows=uniq.length;diag.candidateScores=candidates.map(c=>({id:c.id,rows:c.rows.length,diff:score(c)}));
  }
 }
 // TEB'deki “BU KARTINIZLA YAPILAN İŞLEM TOPLAMLARI” harcama toplamı değildir; dönem borcunu tekrar eder.
 // Ödeme/faiz değerlerini işlem tablosunun ham banka satırlarından ayrıca çıkar, harcamayı banka denklemiyle türet.
 // V216 TEB final fee gate: selected reader may split 'KARTTAN FATURA ODEME UCRETI' and label it payment.
 if(bank==='TEB'){
  uniq=uniq.map(r=>{
   const n=seNorm(r.bankTitle||r.title);
   if(/KARTTAN.*FATURA.*ODEME/.test(n)||/FATURA.*ODEME.*UCRET/.test(n)) return {...r,kind:'fee',category:'Vergi & Faiz',reason:(r.reason||'')+' · V216 TEB fatura ödeme ücreti'};
   if(/BSMV|KKDF|KREDILENDIRILEN.*FAIZ|KOMISYON|UCRET/.test(n)&&r.kind==='payment') return {...r,kind:'fee',category:'Vergi & Faiz',reason:(r.reason||'')+' · V216 TEB ücret son-kapı'};
   return r;
  });
 }
 if(bank==='TEB'){
  const rawBank={payments:0,fees:0,refunds:0,spendCount:0,seen:uniq.length};
  for(const r of uniq){if(r.kind==='payment')rawBank.payments+=r.amount;else if(r.kind==='refund')rawBank.refunds+=r.amount;else if(r.kind==='fee')rawBank.fees+=r.amount;else rawBank.spendCount++}
  for(const k of ['payments','fees','refunds'])rawBank[k]=Math.round(rawBank[k]*100)/100;
  vals.payments=rawBank.payments;vals.fees=rawBank.fees;vals.spendCount=rawBank.spendCount;/* V244 TEB: V241'de çalışan Harcamalar davranışı geri getirildi. Footer/dönem borcu Harcamalar sanılmaz; ekstre muhasebe alanlarından hesaplanır. */if(vals.previous!=null&&vals.debt!=null){vals.spend=Math.round((vals.debt-vals.previous-vals.fees+vals.payments+rawBank.refunds)*100)/100;diag.tebBankSpendSource='statement-ledger-equation-v244';}else{vals.spend=null;diag.tebBankSpendSource='statement-ledger-incomplete-v244';}
 }
 // V223 İş Bankası Maximum: MaxiPuan sütunu para hareketi değildir.
 // PDF'de puan hücresi TUTAR'ın sağında bulunduğundan yalnız TUTAR sütununa en yakın hücre seçilir.
 // Ayrıca 'MAXIPUAN ILAVE' satırları yalnız puan hareketidir; finansal işlem listesine alınmaz.
 if(bank==='İş Bankası'){
  uniq=uniq.filter(r=>!/MAXIPUAN\s*ILAVE/.test(seNorm(r.bankTitle||r.title)));
  vals.spendCount=uniq.filter(r=>r.kind==='spend').length;
  // V252: İş Bankası banka sütunları artık null/nötr bırakılmaz. PDF'deki gerçek hareketler
  // ödeme/faiz/iade olarak sınıflandırılır; harcama toplamı bağımsız dönem borcu denklemiyle
  // türetilir. Eksik zorunlu alan varsa karşılaştırma kilitlenir, nötr/geçerli sayılmaz.
  const ib={payments:0,fees:0,refunds:0};
  for(const r of uniq){if(r.kind==='payment')ib.payments+=r.amount;else if(r.kind==='fee')ib.fees+=r.amount;else if(r.kind==='refund')ib.refunds+=r.amount}
  for(const k of Object.keys(ib))ib[k]=Math.round(ib[k]*100)/100;
  vals.payments=ib.payments; vals.fees=ib.fees;
  if(vals.previous!=null&&vals.debt!=null){
   vals.spend=Math.round((vals.debt-vals.previous-vals.fees+vals.payments+ib.refunds)*100)/100;
   diag.isbankBankSpendSource='statement-ledger-equation-v252';
  }else{vals.spend=null;diag.isbankBankSpendSource='statement-ledger-incomplete-v252'}
  diag.mode=(diag.mode==='isbank-maximum-line-v225'?'isbank-maximum-line-v225-v252-truth':'isbank-maximum-column-locked-v252-truth');
 }
 const sums={spend:0,fees:0,payments:0,refunds:0};uniq.forEach(r=>sums[r.kind==='refund'?'refunds':r.kind==='payment'?'payments':r.kind==='fee'?'fees':'spend']+=r.amount);for(const k of Object.keys(sums))sums[k]=Math.round(sums[k]*100)/100;
 // V250: Devreden bakiye yalnız karşılaştırma katmanında bankanın doğrulanmış PDF okuyucusundan alınır.
 // İşlem satırı motorlarına / sınıflandırmaya dokunulmaz. TEB V248 doğrudan devir satırını korur;
 // Ziraat, DenizBank ve Halkbank kendi kilitli özet okuyucularını kullanır. İş Bankası'nın çalışan profil satırı korunur.
 let motorPrevious=null, motorPreviousSource='not-found';
 if(bank==='TEB'){
  for(const line of flat){const n=seNorm(line);if(!/ONCEKI DONEMDEN DEVIR EDILEN TUTAR/.test(n))continue;const ms=[...String(line).matchAll(/(?:TL\.?\s*)?([+-]?(?:\d{1,3}(?:\.\d{3})*|\d+)(?:,\d{2}|,-))/gi)];if(ms.length){const v=seMoney(ms[ms.length-1][1]);if(v!=null){motorPrevious=Math.abs(v);motorPreviousSource='teb-pdf-devir-row-v250';break}}}
 }else if(bank==='Ziraat'){const z=seZiraatSummary(pages);motorPrevious=Number.isFinite(+z.previous)?+z.previous:null;motorPreviousSource=motorPrevious==null?'not-found':'ziraat-summary-previous-v250';
 }else if(bank==='DenizBank'){const d=seDenizSummary(pages);motorPrevious=Number.isFinite(+d.previous)?+d.previous:null;motorPreviousSource=motorPrevious==null?'not-found':'deniz-summary-previous-v250';
 }else if(bank==='Halkbank'){const h=seHalkSummary(pages);motorPrevious=Number.isFinite(+h.previous)?+h.previous:null;motorPreviousSource=motorPrevious==null?'not-found':'halk-summary-previous-v250';
 }else{motorPrevious=rowValue(profile.devir);motorPreviousSource=motorPrevious==null?'not-found':'pdf-profile-devir-row-v250';}
 sums.previous=motorPrevious;diag.motorPreviousSource=motorPreviousSource;
 diag.tableRows=uniq.length;diag.tableSpendRows=uniq.filter(r=>r.kind==='spend').length;diag.rejectedCount=diag.rejected.length;
 return{bank,profile,rows:uniq,bankValues:vals,motor:sums,diagnostic:diag}
}
function seDiff(a,b){return a==null?'—':Math.abs(a-b)<=.01?'✓':money(Math.abs(a-b))}
function seStatementImportMonth(cardId,rows){
 const c=state.cards.find(x=>String(x.id)===String(cardId));
 const dates=(rows||[]).map(r=>String(r.date||'')).filter(x=>/^\d{4}-\d{2}-\d{2}$/.test(x)).sort();
 if(c&&dates.length)return statementMonthFor(c,dates[dates.length-1]);
 return state.selectedMonth;
}
function sePreviousStatementDebt(cardId,month){
 const prev=(state.statementImports||[]).filter(x=>String(x.cardId)===String(cardId)&&String(x.month||'')<String(month||'')&&Number.isFinite(+x.periodDebt)).sort((a,b)=>String(b.month||'').localeCompare(String(a.month||'')))[0];
 return prev?+prev.periodDebt:null;
}
function sePreview(cardId,res){statementImportRows=res.rows;statementImportMeta=res;const b=res.bankValues,m=res.motor;
 const importMonth=seStatementImportMonth(cardId,res.rows),motorPrevious=Number.isFinite(+m.previous)?+m.previous:null;statementImportMeta.importMonth=importMonth;
 const calcDebt=(b.previous!=null)?Math.round((b.previous+m.spend+m.fees-m.payments-m.refunds)*100)/100:null;
 const eq=(a,c)=>a!=null&&c!=null&&Math.abs(a-c)<=.01;
 const motorCount=res.rows.filter(r=>r.kind==='spend').length; const isIsbank=res.bank==='İş Bankası'; const previousNeutral=motorPrevious==null&&!isIsbank; const checks=[['HARCAMA SAYISI',b.spendCount,motorCount,b.spendCount!=null&&b.spendCount===motorCount,false],['DEVREDEN BAKİYE',b.previous,motorPrevious,previousNeutral?true:eq(b.previous,motorPrevious),previousNeutral],['HARCAMALAR',b.spend,m.spend,eq(b.spend,m.spend),false],['ÖDEMELER',b.payments,m.payments,eq(b.payments,m.payments),false],['FAİZ / ÜCRET',b.fees,m.fees,eq(b.fees,m.fees),false],['DÖNEM BORCU',b.debt,calcDebt,eq(b.debt,calcDebt),false]];
 // Harcamalar TEB özetinde ayrı alan olarak yazmıyorsa bu satır bilgilendirmedir; kilit kararını bankanın açık dönem borcu verir.
 const locked=checks.some(x=>!x[3]);statementImportMeta.locked=locked;
 const rowHtml=res.rows.map((r,i)=>`<div class="seRow seRowV195"><input class="seTitle" data-se-title="${i}" value="${esc(r.title)}"><small class="seMeta">${r.date} · ${esc(r.bankTitle||r.reason||'Ekstre işlemi')}</small><div class="seRowBottom"><input class="seAmount" data-se-amount="${i}" type="number" step="0.01" value="${r.amount.toFixed(2)}"><select class="seKind" data-se-kind="${i}"><option value="spend" ${r.kind==='spend'?'selected':''}>HARCAMA</option><option value="payment" ${r.kind==='payment'?'selected':''}>ÖDEME</option><option value="fee" ${r.kind==='fee'?'selected':''}>FAİZ/MASRAF</option><option value="refund" ${r.kind==='refund'?'selected':''}>İADE</option></select>${r.kind==='spend'?`<select class="seCat" data-se-cat="${i}">${C.map(c=>`<option ${c===r.category?'selected':''}>${esc(c)}</option>`).join('')}</select>`:`<span class="seCat seCatFinancial">${r.kind==='payment'?'KART ÖDEMESİ':r.kind==='fee'?'VERGİ & FAİZ':'İADE'} · KATEGORİ DIŞI</span>`}</div></div>`).join('');
 return `<div class="seV1"><div class="seProfile"><b>${esc(res.bank)} EKSTRE PROFİLİ</b><span>${res.profile?.locked?'🔒 KİLİTLİ PROFİL':'GENEL PROFİL'}</span></div><div class="seStatus ${locked?'bad':'ok'}"><b>${locked?'DÜZELTME GEREKİYOR':'EKSTRE DOĞRULANDI'}</b><span>${locked?'Hata düzelmeden HANE’ye eklenmez.':(isIsbank?'İş Bankası banka değerleri ve motor sonucu uyuşuyor. Hiçbir kontrol alanı nötr kabul edilmez.':'Banka değerleri ile motor sonucu uyuşuyor.')}</span></div><div class="seCompare"><div class="seHead"><b>KONTROL</b><b>BANKA</b><b>MOTOR</b><b>SONUÇ</b></div>${checks.map(x=>`<div><span>${x[0]}</span><b>${typeof x[1]==='number'?(x[0].includes('SAYISI')?x[1]:money(x[1])):(x[4]?'EKSTREDE AYRI TOPLAM YOK':'—')}</b><b>${typeof x[2]==='number'?(x[0].includes('SAYISI')?x[2]:money(x[2])):'—'}</b><strong class="${x[4]?'':(x[3]?'ok':'bad')}">${x[4]?'•':(x[3]?'✓':(x[1]==null||x[2]==null?'—':seDiff(x[1],x[2])))}</strong></div>`).join('')}</div>${locked?`<div class="seWhy"><b>NEDEN KİLİTLİ?</b><span>${checks.filter(x=>!x[3]).map(x=>x[1]==null?x[0]+' banka değeri okunamadı':x[2]==null?x[0]+' motor değeri üretilemedi':x[0]+' uyuşmuyor · fark '+money(Math.abs(x[1]-x[2]))).join(' · ')}</span><small>Motor özet rakamını işlem diye kullanmaz ve farkı tahmin ederek kapatmaz. Hatalı satırı düzelt; karşılaştırma yeniden hesaplanır.</small></div>`:''}<div class="seRowsHead"><b>İŞLEMLER</b><span>${res.rows.length} satır · listede doğrudan düzenlenebilir</span></div><div class="seRows">${rowHtml}</div><button class="btn gold" data-action="statementV191Recheck">YENİDEN KONTROL ET</button><button class="btn" data-action="statementV191Confirm" ${locked?'disabled style="opacity:.45"':''}>HANE’YE EKLE</button></div>`}
async function seConfirm(){if(statementImportMeta.locked)return alert('Hata düzelmeden ekstre HANE’ye eklenmez.');const c=state.cards.find(x=>x.id===statementImportCardId);if(!c)return;const cardBank=seCardBankKey(c.bank),statementBank=seStatementBankKey(statementImportMeta);if(!statementImportMeta.cardBankVerified||!cardBank||!statementBank||cardBank!==statementBank)return alert('Kart / ekstre banka kilidi doğrulanmadı. Ekstre HANE’ye eklenemez.');let add=0,pay=0;const month=statementImportMeta.importMonth||seStatementImportMonth(c.id,statementImportRows);
 // Aynı kart+dönem ekstresi yeniden okunursa önce yalnız önceki ekstre-import kayıtları değiştirilir; manuel kayıtlar korunur.
 state.expenses=(state.expenses||[]).filter(x=>!(String(x.cardId)===String(c.id)&&x.importedFromStatement&&String(x.statementImportMonth)===String(month)));
 state.cardPayments=(state.cardPayments||[]).filter(x=>!(String(x.cardId)===String(c.id)&&x.importedFromStatement&&String(x.statementImportMonth)===String(month)));
 state.statementImports=(state.statementImports||[]).filter(x=>!(String(x.cardId)===String(c.id)&&String(x.month)===String(month)));
 for(const r of statementImportRows){if(r.kind==='payment'){state.cardPayments.push({id:id(),cardId:c.id,amount:r.amount,date:r.date,title:upper(r.title),importedFromStatement:true,statementImportMonth:month});pay++;continue}state.expenses.push({id:id(),title:upper(r.title),bankDescription:r.bankTitle,amount:r.kind==='refund'?-r.amount:r.amount,actualAmount:r.kind==='refund'?-r.amount:r.amount,date:r.date,category:r.kind==='fee'?'Vergi & Faiz':r.category,source:'card',cardId:c.id,recurring:false,importedFromStatement:true,statementMatched:true,statementImportMonth:month,statementType:r.kind});if(r.kind==='spend'&&r.category&&r.category!=='Diğer'){state.statementCategoryRules=state.statementCategoryRules||{};seRememberCategory(r,r.category)}add++}const b=statementImportMeta.bankValues,m=statementImportMeta.motor;state.statementImports.push({id:id(),cardId:c.id,month,previousBalance:b.previous||0,spendingTotal:b.spend??m.spend,feesTotal:b.fees??m.fees,paymentsTotal:b.payments??m.payments,refundsTotal:m.refunds,periodDebt:b.debt,rowCount:add,bankRowCount:statementImportRows.length,parsedRowCount:statementImportRows.length,verificationStatus:'verified',fullVerified:true,bankProfileId:statementImportMeta.bank});await save();modal=null;render();showToast(`EKSTRE EKLENDİ · ${add} HAREKET · ${pay} ÖDEME`)}

// EKSTRE MOTORU: V189 motoru tamamen kaldırıldı. Yeni motor sıfırdan eklenecek.

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

document.addEventListener('change',async e=>{
 if(e.target?.matches?.('[data-se-cat]')){const i=+e.target.dataset.seCat,r=statementImportRows[i];if(r){r.category=e.target.value;seRememberCategory(r,r.category);await save();showToast('KATEGORİ ÖĞRENİLDİ');}return;}
 if(e.target?.matches?.('[data-se-kind]')){const i=+e.target.dataset.seKind,r=statementImportRows[i];if(r){r.kind=e.target.value;r.category=r.kind==='fee'?'Vergi & Faiz':r.kind==='payment'?'Kart Ödemesi':r.kind==='refund'?'Diğer':(r.category||'Diğer');}return;}
 if(e.target?.matches?.('[data-se-amount]')){const i=+e.target.dataset.seAmount,r=statementImportRows[i],v=Number(e.target.value);if(r&&Number.isFinite(v))r.amount=Math.abs(v);return;}
 if(e.target?.matches?.('[data-se-title]')){const i=+e.target.dataset.seTitle,r=statementImportRows[i];if(r)r.title=e.target.value;return;}
 if(e.target?.id!=='statementImportInput')return;const f=e.target.files?.[0];if(!f||!statementImportCardId)return;open('EKSTRE OKUNUYOR','<div class="notice"><b id="statementImportProgress">PDF okunuyor…</b><br>Belge cihazında işlenir. Önce banka değerleri, sonra işlem satırları bağımsız çıkarılır.</div>');try{const pages=await seReadPdf(f),res=seParse(pages);const selectedCard=state.cards.find(x=>x.id===statementImportCardId),cardBank=seCardBankKey(selectedCard?.bank),statementBank=seStatementBankKey(res);if(!statementBank||statementBank==='GENEL')throw Error('Ekstrenin bankası güvenli biçimde belirlenemedi. Kart eşleştirme kilidi nedeniyle içe aktarma durduruldu.');if(!cardBank)throw Error(`Seçili kartın bankası eşleştirme için tanınmıyor: ${selectedCard?.bank||'—'}. Kart banka adını düzenleyin.`);if(cardBank!==statementBank)throw Error(`KART / EKSTRE BANKASI UYUŞMUYOR. Seçili kart: ${seBankLabel(cardBank)} · Yüklenen ekstre: ${seBankLabel(statementBank)}. Bu ekstre bu karta eklenemez.`);if(!res.rows.length){const d=res.diagnostic||{};throw Error(`İşlem satırı oluşturulamadı. PDF: ${d.pages||0} sayfa · ${d.textItems||0} metin öğesi · ${d.dateCandidates||0} tarih adayı · ${d.amountCandidates||0} tutar adayı · ${d.headerFound||0} tablo başlığı. Motor tahmin yapmadı.`);}res.cardBankVerified=true;res.cardBankKey=cardBank;statementImportMeta=res;open('EKSTRE ÖNİZLEME',sePreview(statementImportCardId,res),{cardId:statementImportCardId})}catch(err){console.error(err);open('EKSTRE OKUNAMADI',`<div class="notice"><b>OKUMA DURDU</b><br>${esc(err.message||'Dosya okunamadı.')}<br><small>Yanlış veri HANE’ye eklenmedi.</small></div>`)}finally{e.target.value=''}});
