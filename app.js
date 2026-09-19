function localGet(name,fallback=''){try{const v=localStorage.getItem(name);return v==null?fallback:v}catch{return fallback}}
function localSet(name,value){try{localStorage.setItem(name,value);return true}catch{return false}}
function uid(){try{return crypto.randomUUID?.()||`z${Date.now()}_${Math.random().toString(36).slice(2)}`}catch{return `z${Date.now()}_${Math.random().toString(36).slice(2)}`} }
function safeJSON(name,fallback,kind){
  try{
    const raw=localStorage.getItem(name);if(!raw)return fallback;
    const v=JSON.parse(raw);
    if(kind==='array'&&!Array.isArray(v))throw Error('invalid');
    if(kind==='object'&&(v===null||Array.isArray(v)||typeof v!=='object'))throw Error('invalid');
    return v;
  }catch{try{localStorage.removeItem(name)}catch{};return fallback;}
}
function normalizeItems(v){return (Array.isArray(v)?v:[]).filter(x=>x&&typeof x==='object');}
function normalizePlaylists(v){return normalizeItems(v).map(x=>({id:String(x.id||uid()),name:String(x.name||'Liste'),items:normalizeItems(x.items)}));}
function normalizePositions(v){const out={};if(v&&typeof v==='object'&&!Array.isArray(v))for(const [k,n] of Object.entries(v)){const x=Number(n);if(Number.isFinite(x)&&x>=0)out[k]=x;}return out;}
const state={
  tab:'music',
  lowPower:localGet('zazo.lowPower')==='1',
  favorites:normalizeItems(safeJSON('zazo.favorites',[],'array')),
  history:normalizeItems(safeJSON('zazo.history',[],'array')),
  playlists:normalizePlaylists(safeJSON('zazo.playlists',[],'array')),
  positions:normalizePositions(safeJSON('zazo.positions',{},'object')),
  results:{music:[],video:[]},
  discovery:{music:[],video:[]},
  musicQuery:'', musicSearching:false, videoQuery:'', videoSearching:false, searchSeq:{music:0,video:0}, searchControllers:{music:null,video:null}, searchError:{music:'',video:''},
  recentSearches:normalizeItems(safeJSON('zazo.recentSearches',[],'array')).map(x=>String(x.q||x)).filter(Boolean).slice(0,8),
  localMedia:[],downloads:[],now:null,queue:[],queueIndex:-1,
  audio:new Audio(),video:null,youtubeActive:false,youtubePlayer:null,youtubeApiPromise:null,fallbackBusy:false,installPrompt:null,downloadBusy:false,downloadController:null,downloadTask:null,pendingItem:null,openController:null,uiItems:new Map(),uiSeq:0,
  youtubeKey:window.ZAZO_CONFIG?.youtubeApiKey||localGet('zazo.youtubeKey')||'',
  jamendoClientId:window.ZAZO_CONFIG?.jamendoClientId||localGet('zazo.jamendoClientId')||'',
  storagePersistent:null,audioToken:0,browseView:null,libraryCategory:'songs',queueAutoExtend:false
};
const $=s=>document.querySelector(s), view=$('#view'), tabs=[...document.querySelectorAll('.nav-btn')];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':'&quot;'}[c]));
const decodeText=s=>{const t=document.createElement('textarea');t.innerHTML=String(s??'');return t.value};
const encArg=s=>encodeURIComponent(String(s??'')).replace(/'/g,'%27');
const providerLabel=i=>i?.provider==='youtube'?'YouTube':i?.provider==='jamendo'?'Jamendo':i?.source||'Internet Archive';
const providerClass=i=>i?.provider==='youtube'?'youtube':i?.provider==='jamendo'?'jamendo':'archive';
const sourcePill=i=>`<span class="source-pill ${providerClass(i)}">${esc(providerLabel(i))}</span>`;
const key=i=>i?.originalKey||i?.canonicalKey||i?.id||i?.identifier||i?.url||`${i?.type||''}:${i?.title||''}:${i?.creator||''}`;
function slimBase(i){const x={...i};delete x.blob;delete x.thumbBlob;delete x.fallbacks;delete x.alternatives;if(x.local||x.downloaded)delete x.url;if(x.downloaded&&String(x.thumb||'').startsWith('blob:'))delete x.thumb;return x}
const slim=i=>{const x=slimBase(i);if(Array.isArray(i?.alternatives)&&i.alternatives.length)x.alternatives=i.alternatives.slice(0,5).map(slimBase);return x};
function prunePositions(){
  const keep=new Set();
  const add=i=>{if(!i)return;keep.add(key(i));if(i.id)keep.add(i.id);if(i.originalKey)keep.add(i.originalKey);if(i.canonicalKey)keep.add(i.canonicalKey)};
  state.history.slice(0,80).forEach(add);state.favorites.forEach(add);state.playlists.forEach(p=>p.items.forEach(add));state.localMedia.forEach(add);state.downloads.forEach(add);state.queue.forEach(add);add(state.now);
  const entries=Object.keys(state.positions);if(entries.length>320)for(const k of entries)if(!keep.has(k))delete state.positions[k];
}
const save=()=>{try{
  prunePositions();
  localStorage.setItem('zazo.favorites',JSON.stringify(state.favorites.map(slim)));
  localStorage.setItem('zazo.history',JSON.stringify(state.history.slice(0,80).map(slim)));
  localStorage.setItem('zazo.playlists',JSON.stringify(state.playlists.map(p=>({...p,items:p.items.map(slim)}))));
  localStorage.setItem('zazo.positions',JSON.stringify(state.positions));
  localStorage.setItem('zazo.recentSearches',JSON.stringify(state.recentSearches.map(q=>({q}))));
}catch{}};
if(state.lowPower)document.body.classList.add('low-power');

const DB='zazo-player-db';
const OPFS_DIR='zazo-media';
let dbPromise=null;
function dbOpen(){if(dbPromise)return dbPromise;dbPromise=new Promise((res,rej)=>{const r=indexedDB.open(DB,2);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('media'))db.createObjectStore('media',{keyPath:'id'});if(!db.objectStoreNames.contains('downloads'))db.createObjectStore('downloads',{keyPath:'id'});};r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>{db.close();dbPromise=null};res(db)};r.onerror=()=>{dbPromise=null;rej(r.error)};r.onblocked=()=>{dbPromise=null;rej(new Error('indexeddb-blocked'))}});return dbPromise;}
async function dbAll(store){const db=await dbOpen();return new Promise((res,rej)=>{const tx=db.transaction(store),r=tx.objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error);});}
async function dbPut(store,x){const db=await dbOpen();return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(x);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error||new Error('indexeddb-abort'));});}
async function dbDel(store,id){const db=await dbOpen();return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(id);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error||new Error('indexeddb-abort'));});}
function fileUrl(i){return i?.blob?URL.createObjectURL(i.blob):(i?.url||null)}
async function opfsDir(create=false){if(!navigator.storage?.getDirectory)return null;const root=await navigator.storage.getDirectory();return root.getDirectoryHandle(OPFS_DIR,{create});}
async function opfsFileUrl(name){try{const dir=await opfsDir(false);if(!dir)return null;const h=await dir.getFileHandle(name);const f=await h.getFile();return URL.createObjectURL(f);}catch{return null;}}
async function opfsDelete(name){if(!name)return;try{const dir=await opfsDir(false);if(dir)await dir.removeEntry(name)}catch{}}
async function syncStoredUrls(records,previous=[],store=''){
  const prev=new Map(previous.map(x=>[x.id,x])),next=[];
  for(const x of records){
    const old=prev.get(x.id);prev.delete(x.id);
    let url=old?.url?.startsWith('blob:')?old.url:null;
    if(!url){if(x.blob)url=URL.createObjectURL(x.blob);else if(x.opfsName)url=await opfsFileUrl(x.opfsName);else url=x.url||null;}
    if(store==='downloads'&&x.opfsName&&!x.blob&&!url){try{await dbDel('downloads',x.id)}catch{};continue;}
    let thumb=x.thumb||'';
    if(x.thumbBlob){thumb=old?.thumb?.startsWith('blob:')?old.thumb:URL.createObjectURL(x.thumbBlob);}
    next.push({...x,url,thumb});
  }
  for(const old of prev.values()){
    if(old?.url?.startsWith('blob:')&&old.url!==state.now?.url)try{URL.revokeObjectURL(old.url)}catch{}
    if(old?.thumb?.startsWith('blob:'))try{URL.revokeObjectURL(old.thumb)}catch{}
  }
  return next;
}
async function refreshStored(){
  try{state.localMedia=await syncStoredUrls(await dbAll('media'),state.localMedia,'media');}catch{state.localMedia=[]}
  try{state.downloads=await syncStoredUrls(await dbAll('downloads'),state.downloads,'downloads');}catch{state.downloads=[]}
}
function hydrate(i){
  if(!i)return i;
  if(i.local){const x=state.localMedia.find(x=>x.id===i.id);if(x)return {...x};}
  if(i.downloaded){const x=state.downloads.find(x=>x.id===i.id);if(x)return {...x};}
  const offline=state.downloads.find(x=>x.originalKey===key(i));
  if(offline)return {...offline};
  return {...i};
}

function syncNav(){tabs.forEach(b=>{const sameTab=b.dataset.tab===state.tab;const mode=b.dataset.mode||'';const modeOk=!mode||mode===(state.libraryMode||'files');b.classList.toggle('active',sameTab&&modeOk)});}
function setTab(tab,mode=null){
  if(tab!=='music'&&state.searchControllers.music){state.searchControllers.music.abort();state.searchControllers.music=null;state.musicSearching=false;}
  if(tab!=='video'&&state.searchControllers.video){state.searchControllers.video.abort();state.searchControllers.video=null;state.videoSearching=false;}
  state.tab=tab;if(tab==='library'&&mode)state.libraryMode=mode;syncNav();render();scrollTo({top:0,behavior:state.lowPower?'auto':'smooth'});if(tab==='video')ensureDiscovery('video');
}
window.setTab=setTab;
tabs.forEach(b=>b.onclick=()=>setTab(b.dataset.tab,b.dataset.mode||null));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{$('#drawer').classList.add('hidden');setTab(b.dataset.go)});
const settingsBtn=$('#settingsBtn');if(settingsBtn)settingsBtn.onclick=()=>setTab('settings');
const searchHomeBtn=$('#searchHomeBtn');if(searchHomeBtn)searchHomeBtn.onclick=()=>setTab('music');
const miniOpen=$('#miniOpen');if(miniOpen)miniOpen.onclick=e=>{e.stopPropagation();if(state.now)showPlayer(state.now)};
$('#menuBtn').onclick=()=>$('#drawer').classList.remove('hidden');
$('#closeDrawer').onclick=()=>$('#drawer').classList.add('hidden');
$('#drawer').onclick=e=>{if(e.target.id==='drawer')$('#drawer').classList.add('hidden')};
$('#powerBtn').onclick=()=>{state.lowPower=!state.lowPower;document.body.classList.toggle('low-power',state.lowPower);localSet('zazo.lowPower',state.lowPower?'1':'0');render();};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e});
$('#installBtn').onclick=async()=>{if(state.installPrompt){state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null}else{const ios=/iPad|iPhone|iPod/.test(navigator.userAgent);alert(ios?'Safari → Paylaş → Ana Ekrana Ekle':'Tarayıcı menüsünden “Uygulamayı yükle” veya “Ana ekrana ekle” seçeneğini kullanabilirsin.')}};

function hero(){return `<section class="hero home-search-hero"><span class="hero-badge">● ZAZO Akıllı Arama</span><h1>İstediğin şarkıyı yaz, ZAZO bulsun.</h1><p>Şarkı adı veya sanatçı yaz. ZAZO yalnızca tam oynatılabilen sonuçları bulur ve tek dokunuşla çalar.</p><div class="hero-search"><span>⌕</span><input id="homeMusicSearch" placeholder="Şarkı veya sanatçı ara…" enterkeyhint="search" autocomplete="off"><button id="homeMusicSearchBtn">Ara</button></div><div class="hero-actions"><button onclick="setTab('music')">♫ Müzik</button><button onclick="setTab('video')">▶ Video</button></div></section>`}
function quick(label,sub,icon,tab,onclick=''){return `<button class="quick" ${onclick?`onclick="${onclick}"`:`onclick="setTab('${tab}')"`}><span class="big">${icon}</span><strong>${label}</strong><small>${sub}</small></button>`}
function art(i,t,loading='lazy'){return `<div class="thumb ${t==='video'?'video':''}">${i.thumb?`<img loading="lazy" decoding="async" src="${esc(i.thumb)}" alt="">`:(t==='video'?'▶':'♫')}</div>`}
function registerUi(i,t,queue=null){const id=`u${++state.uiSeq}`;state.uiItems.set(id,{item:slim(i),type:t||i.type,queue:Array.isArray(queue)?queue:null});return id}
function openUi(id){const x=state.uiItems.get(id);if(x)openItem(x.item,x.type,false,x.queue)}window.openUi=openUi;
function resetUiRegistry(){state.uiItems.clear();state.uiSeq=0}
function mediaCard(i,t,queue=null){const id=registerUi(i,t,queue);return `<article class="media-card" onclick="openUi('${id}')">${art(i,t)}<strong>${esc(i.title)}</strong><small>${esc(i.creator||i.source||'ZAZO')}</small>${sourcePill(i)}</article>`}
function continueItems(){return state.history.filter(x=>(state.positions[key(x)]||0)>8).slice(0,6)}
function renderHome(){
  resetUiRegistry();
  const cont=continueItems().map(hydrate),rec=state.history.slice(0,6).map(hydrate);
  view.innerHTML=`${hero()}<div class="quick-grid">${quick('Müzik','Ara ve dinle','♫','music')}${quick('Video','Akışta izle','▶','video')}${quick('İndirilenler',`${state.downloads.length} çevrimdışı içerik`,'⇩','library',"openLibrary('downloads')")}${quick('Dosyalarım',`${state.localMedia.length} yerel içerik`,'＋','library',"openLibrary('files')")}</div>${cont.length?`<section class="section"><div class="section-head"><h2>Kaldığın yerden</h2></div><div class="h-scroll">${cont.map(x=>mediaCard(x,x.type,cont)).join('')}</div></section>`:''}<section class="section"><div class="section-head"><h2>Son oynatılanlar</h2></div>${rec.length?`<div class="h-scroll">${rec.map(x=>mediaCard(x,x.type,rec)).join('')}</div>`:'<div class="empty">Henüz oynatılan içerik yok.</div>'}</section>`;
  const input=$('#homeMusicSearch'),btn=$('#homeMusicSearchBtn');
  const go=()=>{const q=input?.value.trim();if(!q)return;state.tab='music';tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab==='music'));renderMusic();const mi=$('#searchInput');if(mi)mi.value=q;searchInternet('music',q);};
  if(btn)btn.onclick=go;if(input)input.onkeydown=e=>{if(e.key==='Enter')go()};
}

const DISCOVERY={music:['live music','jazz','classical music'],video:['documentary','travel film','concert']};
async function fetchWithTimeout(url,{signal,timeout=8500,...opts}={}){
  const own=new AbortController(),timer=setTimeout(()=>own.abort('zazo-timeout'),timeout);
  const relay=()=>own.abort();if(signal){if(signal.aborted)relay();else signal.addEventListener('abort',relay,{once:true});}
  try{return await fetch(url,{...opts,signal:own.signal})}
  catch(e){if(!signal?.aborted&&own.signal.aborted&&own.signal.reason==='zazo-timeout'){const err=new Error('timeout');err.code='TIMEOUT';throw err}throw e}
  finally{clearTimeout(timer);if(signal)signal.removeEventListener('abort',relay)}
}
async function iaSearch(type,q,rows=14,signal=null){
  const mediatype=type==='music'?'audio':'movies';
  const params=new URLSearchParams();
  const safeQ=String(q||'').replace(/[(){}:\[\]\"']/g,' ').replace(/\s+/g,' ').trim();if(!safeQ)return[];
  params.set('q',`(${safeQ}) AND mediatype:${mediatype}`);
  for(const f of ['identifier','title','creator','date'])params.append('fl[]',f);
  params.append('sort[]','downloads desc');params.set('rows',String(rows));params.set('page','1');params.set('output','json');
  const r=await fetchWithTimeout(`https://archive.org/advancedsearch.php?${params}`,{signal,timeout:8000});if(!r.ok)throw Error('archive');const d=await r.json();
  return (d.response?.docs||[]).map(x=>({id:`ia:${x.identifier}`,title:x.title||x.identifier,creator:Array.isArray(x.creator)?x.creator.join(', '):(x.creator||'Internet Archive'),identifier:x.identifier,source:'Internet Archive',provider:'archive',archiveUnverified:true,thumb:`https://archive.org/services/img/${encodeURIComponent(x.identifier)}`,type,date:x.date||''}));
}
async function ensureDiscovery(type){
  if(state.discovery[type].length)return;
  if(navigator.onLine===false){const marker=type==='music'?'#musicDiscovery':'#videoFeed';if($(marker))$(marker).innerHTML='<div class="empty">Çevrimdışısın. İndirilenler ve Dosyalarım kullanılabilir.</div>';return;}
  const marker=type==='music'?'#musicDiscovery':'#videoFeed';if($(marker))$(marker).innerHTML='<div class="empty">İçerikler hazırlanıyor…</div>';
  try{
    const qs=state.lowPower?DISCOVERY[type].slice(0,1):DISCOVERY[type],rows=state.lowPower?(type==='music'?5:4):(type==='music'?8:7);
    const settled=await Promise.allSettled(qs.map(q=>iaSearch(type,q,rows)));
    const parts=settled.filter(x=>x.status==='fulfilled').map(x=>x.value);
    if(!parts.length)throw Error('discovery');
    const seen=new Set(); state.discovery[type]=parts.flat().filter(x=>!seen.has(x.id)&&seen.add(x.id)).slice(0,state.lowPower?8:24);
    if(state.tab===type)render();
  }catch{if($(marker))$(marker).innerHTML='<div class="empty">Keşif akışı şu anda alınamadı. Aramayı kullanabilirsin.</div>'}
}
function sourceSummary(type){const parts=[];if(state.jamendoClientId&&type==='music')parts.push('Tam müzik');if(state.youtubeKey)parts.push('Video');return parts.join(' · ')}
function searchHeader(type){
  if(type==='music')return `<section class="music-search-hero"><span class="eyebrow">ZAZO PLAYER</span><h2>Ne dinlemek istiyorsun?</h2><p>Şarkı, sanatçı veya albüm adını yaz. Tam oynatılabilen sonucu tek dokunuşla aç.</p><div class="searchbar music-main-search"><span class="search-icon">⌕</span><input id="searchInput" value="${esc(state.musicQuery)}" placeholder="Şarkı, sanatçı veya albüm ara…" enterkeyhint="search" autocomplete="off" autofocus><button id="searchBtn">Ara</button></div></section>`;
  return `<div class="section-head"><h2>Video</h2><span class="muted">${esc(sourceSummary(type))}</span></div><div class="searchbar"><input id="searchInput" value="${esc(state.videoQuery)}" placeholder="Video ara…" enterkeyhint="search" autocomplete="off"><button id="searchBtn">Ara</button></div>`;
}
function wireSearch(type){$('#searchBtn').onclick=()=>searchInternet(type,$('#searchInput').value);$('#searchInput').onkeydown=e=>{if(e.key==='Enter')searchInternet(type,e.target.value)};document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>searchInternet(type,c.dataset.q));}
function searchAvailabilityBadge(i){if(i.identifier&&!i.verifiedPlayable)return '<span class="availability checking">◌ Oynatma kontrol edilir</span>';if(i.provider==='youtube')return '<span class="availability youtube">▶ Tam şarkı · YouTube</span>';return '<span class="availability full">● Tam şarkı</span>'}
function musicSearchRow(i,queue=null){const id=registerUi(i,'music',queue);const creator=i.creator||'Bilinmeyen sanatçı',artistArg=encArg(creator),albumArg=encArg(i.album||'');return `<div class="song-result"><div class="song-main" role="button" tabindex="0" onclick="openUi('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openUi('${id}')}"><span class="song-art">${i.thumb?`<img loading="lazy" decoding="async" src="${esc(i.thumb)}" alt="">`:'♫'}</span><span class="song-info"><strong>${esc(i.title)}</strong><span class="song-links"><button type="button" onclick="event.stopPropagation();browseArtist(decodeURIComponent('${artistArg}'))">${esc(creator)}</button>${i.album?`<button type="button" onclick="event.stopPropagation();browseAlbum(decodeURIComponent('${albumArg}'),decodeURIComponent('${artistArg}'))">${esc(i.album)}</button>`:''}</span></span></div><button class="song-play" onclick="openUi('${id}')" aria-label="Çal">▶</button><button class="more-btn" type="button" aria-label="Daha fazla" onclick="event.stopPropagation();quickMenuUi('${id}')">⋮</button></div>`}
function musicCatalogItems(includeResults=false){
  const transient=includeResults?state.results.music:[];
  const all=[...transient,...state.favorites,...state.history,...state.localMedia,...state.downloads,...state.playlists.flatMap(p=>p.items||[])].filter(x=>x&&x.type!=='video');
  const seen=new Set();return all.map(hydrate).filter(x=>{const k=key(x);if(seen.has(k))return false;seen.add(k);return true});
}
function browseArtist(name){if(!name)return;state.browseView={kind:'artist',name:String(name)};if(state.tab!=='music')state.tab='music';syncNav();renderMusic();scrollTo({top:0,behavior:'auto'})}window.browseArtist=browseArtist;
function browseAlbum(name,artist=''){if(!name)return;state.browseView={kind:'album',name:String(name),artist:String(artist||'')};if(state.tab!=='music')state.tab='music';syncNav();renderMusic();scrollTo({top:0,behavior:'auto'})}window.browseAlbum=browseAlbum;
function closeBrowse(){state.browseView=null;renderMusic()}window.closeBrowse=closeBrowse;
function browseViewHtml(){const b=state.browseView;if(!b)return'';const all=musicCatalogItems(true);let items=[];if(b.kind==='artist')items=all.filter(x=>normalizeWords(x.creator)===normalizeWords(b.name));else items=all.filter(x=>normalizeWords(x.album)===normalizeWords(b.name)&&(b.artist?normalizeWords(x.creator)===normalizeWords(b.artist):true));const queue=items;return `<section class="browse-page"><button class="back-link" onclick="closeBrowse()">‹ Aramaya dön</button><div class="browse-hero"><div class="browse-avatar">${b.kind==='artist'?'♪':'▣'}</div><div><span>${b.kind==='artist'?'SANATÇI':'ALBÜM'}</span><h2>${esc(b.name)}</h2>${b.artist?`<button class="text-link" onclick="browseArtist(decodeURIComponent('${encArg(b.artist)}'))">${esc(b.artist)}</button>`:''}<p>${items.length} parça</p></div></div>${items.length?`<div class="song-results">${items.map(x=>musicSearchRow(x,queue)).join('')}</div>`:'<div class="empty">Bu sayfa için henüz yeterli parça yok. Aramadan yeni parçalar açtıkça burada toplanır.</div>'}</section>`}
function libraryGroups(){const items=musicCatalogItems(),artists=new Map(),albums=new Map();for(const x of items){const a=(x.creator||'Bilinmeyen sanatçı').trim();if(!artists.has(a))artists.set(a,[]);artists.get(a).push(x);if(x.album){const k=`${x.album}|||${a}`;if(!albums.has(k))albums.set(k,{name:x.album,artist:a,items:[]});albums.get(k).items.push(x)}}return {items,artists:[...artists.entries()].sort((a,b)=>b[1].length-a[1].length),albums:[...albums.values()].sort((a,b)=>b.items.length-a.items.length)}}
function renderMusic(){
  resetUiRegistry();
  if(state.browseView){view.innerHTML=browseViewHtml();return;}
  const chips=['Türkçe Pop','Pop','Rock','Rap','Arabesk'],results=state.results.music;
  const resultsHtml=state.musicSearching?`<section class="section"><div class="searching-card"><span class="search-spinner">◌</span><strong>Şarkı aranıyor…</strong><small>${state.lowPower?'Düşük güçte önce doğrudan ses kaynakları taranıyor.':'Tam oynatılabilen kaynaklar aranıyor.'}</small></div></section>`:results.length?`<section class="section search-results-section"><div class="section-head"><div><h2>Bulunan şarkılar</h2><div class="muted">${results.length} sonuç</div></div><button onclick="clearResults('music')">Temizle</button></div><div class="song-results">${results.map(x=>musicSearchRow(x,results)).join('')}</div></section>`:state.musicQuery?`<section class="section"><div class="empty">${state.searchError.music?esc(state.searchError.music):`“${esc(state.musicQuery)}” için oynatılabilir sonuç bulunamadı.<br><small>Sanatçı adıyla veya daha kısa bir aramayla tekrar deneyebilirsin. ZAZO önizleme sonucu göstermez.</small>`}</div></section>`:`<div class="chips music-chips">${chips.map(c=>`<button class="chip" data-q="${c}">${c}</button>`).join('')}</div>${state.recentSearches.length?`<section class="recent-searches"><div class="section-head compact"><h3>Son aramalar</h3><button onclick="clearRecentSearches()">Temizle</button></div><div class="recent-chips">${state.recentSearches.map(q=>`<button class="recent-search-btn" data-recent="${esc(q)}">⌕ ${esc(q)}</button>`).join('')}</div></section>`:''}<section class="music-feature"><div><span>TEK ARAMA</span><h2>Şarkıyı yaz, ▶ bas ve dinle.</h2><p>ZAZO yalnızca tam oynatılabilen sonuçları gösterir. Önizleme yok.</p></div><button onclick="document.getElementById('searchInput')?.focus()">⌕</button></section>`;
  view.innerHTML=`${searchHeader('music')}${resultsHtml}`;
  wireSearch('music');document.querySelectorAll('.recent-search-btn').forEach(b=>b.onclick=()=>searchInternet('music',b.dataset.recent));
  requestAnimationFrame(()=>{const input=$('#searchInput');if(input&&state.musicQuery&&!state.musicSearching)input.setSelectionRange(input.value.length,input.value.length)});
}
function videoCard(i,queue=null){const id=registerUi(i,'video',queue);return `<article class="video-card" onclick="openUi('${id}')">${art(i,'video')}<div class="video-meta"><div class="avatar">${i.provider==='youtube'?'▶':'Z'}</div><div><strong>${esc(i.title)}</strong><small>${esc(i.creator||providerLabel(i))}</small>${sourcePill(i)}</div><button class="more-btn" type="button" aria-label="Daha fazla" onclick="event.stopPropagation();quickMenuUi('${id}')">⋮</button></div></article>`}
function renderVideo(){
  resetUiRegistry();
  const chips=['Tümü','Belgesel','Konser','Eğitim','Seyahat','Arşiv'], results=state.results.video, feed=state.discovery.video;
  const body=state.videoSearching?`<section class="section"><div class="searching-card"><span class="search-spinner">◌</span><strong>Video aranıyor…</strong><small>${state.lowPower?'Düşük güçte daha az kaynak taranıyor.':'Uygun kaynaklar taranıyor.'}</small></div></section>`:results.length?`<section class="section"><div class="section-head"><h2>Arama sonuçları</h2><button onclick="clearResults('video')">Temizle</button></div><div class="video-feed">${results.map(x=>videoCard(x,results)).join('')}</div></section>`:state.videoQuery?`<section class="section"><div class="empty">${state.searchError.video?esc(state.searchError.video):`“${esc(state.videoQuery)}” için video bulunamadı.`}</div></section>`:`<section class="section flush"><div class="section-head"><h2>Video akışı</h2><span class="muted">${state.youtubeKey?'Archive + YouTube':'Internet Archive'}</span></div><div id="videoFeed" class="video-feed">${feed.length?feed.map(x=>videoCard(x,feed)).join(''):'<div class="empty">Video akışı hazırlanıyor…</div>'}</div></section>`;
  view.innerHTML=`${searchHeader('video')}<div class="chips">${chips.map(c=>`<button class="chip" data-q="${c==='Tümü'?'documentary':c}">${c}</button>`).join('')}</div>${body}`;
  wireSearch('video');
}
function rowItem(i,t,queue=null){const id=registerUi(i,t,queue);return `<div class="row" onclick="openUi('${id}')">${art(i,t)}<div class="meta"><strong>${esc(i.title)}</strong><small>${esc(i.creator||i.source||'Internet Archive')}</small>${sourcePill(i)}</div><button type="button" aria-label="Aç">›</button></div>`}
function jsonp(url,{signal,timeout=8000}={}){return new Promise((resolve,reject)=>{const cb=`zazoJsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`,script=document.createElement('script'),timer=setTimeout(()=>done(null,new Error('timeout')),timeout);let ended=false;function done(data,err){if(ended)return;ended=true;clearTimeout(timer);if(signal)signal.removeEventListener('abort',onAbort);try{delete window[cb]}catch{};script.remove();err?reject(err):resolve(data)}function onAbort(){const e=new DOMException('Arama iptal edildi','AbortError');done(null,e)}if(signal){if(signal.aborted)return onAbort();signal.addEventListener('abort',onAbort,{once:true})}window[cb]=data=>done(data);script.onerror=()=>done(null,new Error('network'));script.src=`${url}${url.includes('?')?'&':'?'}callback=${cb}`;document.head.appendChild(script)})}
async function jamendoSearch(q,limit=10,signal=null){if(!state.jamendoClientId)return[];const u=`https://api.jamendo.com/v3.0/tracks/?client_id=${encodeURIComponent(state.jamendoClientId)}&format=json&limit=${limit}&search=${encodeURIComponent(q)}&audioformat=mp32&imagesize=300`;const r=await fetchWithTimeout(u,{signal,timeout:8000});const d=await r.json();if(!r.ok||d.headers?.status==='failed')throw Error('jamendo');return (d.results||[]).filter(x=>x.audio).map(x=>({id:`jamendo:${x.id}`,title:x.name||'Parça',creator:x.artist_name||'Jamendo',source:'Jamendo',provider:'jamendo',type:'music',url:x.audio,thumb:x.image||x.album_image||'',shareUrl:x.shareurl||'',duration:Number(x.duration)||0,album:x.album_name||'',license:x.license_ccurl||'',verifiedPlayable:true}))}
async function youtubeSearch(type,q,limit=12,signal=null){if(!state.youtubeKey)return[];const p=new URLSearchParams({part:'snippet',type:'video',maxResults:String(limit),q,videoEmbeddable:'true',videoSyndicated:'true',key:state.youtubeKey,relevanceLanguage:'tr',regionCode:'TR'});if(type==='music')p.set('videoCategoryId','10');const r=await fetchWithTimeout(`https://www.googleapis.com/youtube/v3/search?${p}`,{signal,timeout:8500}),d=await r.json();if(!r.ok)throw Error(d.error?.message||'youtube');return (d.items||[]).filter(x=>x.id?.videoId).map(x=>({id:`youtube:${x.id.videoId}`,youtubeId:x.id.videoId,title:decodeText(x.snippet?.title||'YouTube'),creator:decodeText(x.snippet?.channelTitle||'YouTube'),source:'YouTube',provider:'youtube',type,url:`https://www.youtube.com/watch?v=${x.id.videoId}`,shareUrl:`https://www.youtube.com/watch?v=${x.id.videoId}`,thumb:x.snippet?.thumbnails?.high?.url||x.snippet?.thumbnails?.medium?.url||x.snippet?.thumbnails?.default?.url||'',verifiedPlayable:true}))}
function normalizeWords(v){return String(v||'').toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/vevo\b/g,' ').replace(/\b(official|video|audio|lyrics?|lyric|clip|music|remaster(?:ed)?|hd|4k|visualizer|topic|records?|channel)\b/g,' ').replace(/[^a-z0-9çğıöşü]+/gi,' ').replace(/\s+/g,' ').trim()}
function musicProviderRank(i){if(i.provider==='jamendo')return 74;if(i.provider==='youtube')return 68;if(i.provider==='archive'||i.identifier)return i.verifiedPlayable?62:36;return 25}
function relevanceScore(i,q){const query=normalizeWords(q),title=normalizeWords(i.title),creator=normalizeWords(i.creator);if(!query)return 0;const toks=query.split(' ').filter(Boolean);let score=0;if(title===query)score+=90;if(`${creator} ${title}`===query||`${title} ${creator}`===query)score+=120;if(title.includes(query))score+=45;if(creator.includes(query))score+=24;for(const t of toks){if(title.includes(t))score+=10;if(creator.includes(t))score+=7;}const raw=String(i.title||'').toLocaleLowerCase('tr-TR'),qraw=String(q||'').toLocaleLowerCase('tr-TR');for(const tag of ['remix','live','canlı','akustik','karaoke','cover'])if(raw.includes(tag)&&!qraw.includes(tag))score-=18;return score}
function musicGroupKey(i){let title=normalizeWords(i.title).replace(/\b(feat|ft)\b.*$/,'').trim();let creator=normalizeWords(i.creator).replace(/ - topic$/,'').trim();return `${title}|${creator}`}
function tokenSet(v){return new Set(normalizeWords(v).split(' ').filter(x=>x.length>1))}
function setContainsAll(big,small){for(const x of small)if(!big.has(x))return false;return small.size>0}
function sameMusicCandidate(a,b){
  const at=tokenSet(a.title),bt=tokenSet(b.title),ac=tokenSet(a.creator),bc=tokenSet(b.creator),aAll=tokenSet(`${a.title} ${a.creator}`),bAll=tokenSet(`${b.title} ${b.creator}`);
  const titleMatch=setContainsAll(aAll,bt)||setContainsAll(bAll,at);if(!titleMatch)return false;
  const creatorStrong=setContainsAll(aAll,bc)||setContainsAll(bAll,ac);let overlap=false;for(const x of ac)if(bc.has(x)){overlap=true;break}
  return creatorStrong||overlap;
}
function rankMusicResults(items,q){
  const sorted=[...items].sort((a,b)=>(musicProviderRank(b)+relevanceScore(b,q))-(musicProviderRank(a)+relevanceScore(a,q))),groups=[];
  for(const i of sorted){let g=groups.find(x=>sameMusicCandidate(x[0],i));if(!g){g=[];groups.push(g)}g.push(i)}
  const out=[];for(const group of groups){const base=group[0],canonical=`music:${musicGroupKey(base)||key(base)}`,primary={...base,canonicalKey:canonical};const alternatives=group.slice(1,6).map(x=>({...x,canonicalKey:canonical}));if(alternatives.length)primary.alternatives=alternatives;out.push(primary);if(out.length>=36)break}return out;
}
async function runSearchJobs(type,query,signal){
  const small=state.lowPower,results=[];let failures=0;
  const settle=async jobs=>{const a=await Promise.allSettled(jobs);for(const x of a){if(x.status==='fulfilled')results.push(...x.value);else if(x.reason?.name!=='AbortError')failures++;}return a};
  if(type==='music'){
    const base=[iaSearch(type,query,small?6:12,signal)];if(state.jamendoClientId)base.push(jamendoSearch(query,small?6:12,signal));
    if(state.youtubeKey)base.push(youtubeSearch(type,query,small?8:18,signal));
    await settle(base);
  }else{
    await settle([iaSearch(type,query,small?8:14,signal)]);
    if(state.youtubeKey&&(!small||results.length<4))await settle([youtubeSearch(type,query,small?6:12,signal)]);
  }
  return {results,failures};
}
async function searchInternet(type,q){
  if(!q?.trim())return;const query=q.trim(),seq=++state.searchSeq[type];
  state.searchControllers[type]?.abort();state.searchControllers[type]=null;state.searchError[type]='';
  if(navigator.onLine===false){state.searchError[type]='İnternet bağlantısı yok. Kütüphanendeki indirilen veya yerel içerikleri kullanabilirsin.';if(type==='music'){state.musicQuery=query;state.musicSearching=false;state.results.music=[];renderMusic()}else{state.videoQuery=query;state.videoSearching=false;state.results.video=[];renderVideo()}return;}
  const controller=new AbortController();state.searchControllers[type]=controller;
  if(type==='music'){state.musicQuery=query;state.musicSearching=true;state.results.music=[];state.recentSearches=[query,...state.recentSearches.filter(x=>normalizeWords(x)!==normalizeWords(query))].slice(0,8);save();renderMusic();}
  else{state.videoQuery=query;state.videoSearching=true;state.results.video=[];renderVideo();}
  try{
    const {results:all,failures}=await runSearchJobs(type,query,controller.signal);if(seq!==state.searchSeq[type]||controller.signal.aborted)return;
    const seen=new Set();state.results[type]=type==='music'?rankMusicResults(all,query):all.filter(x=>!seen.has(key(x))&&seen.add(key(x)));
    if(!state.results[type].length&&failures)state.searchError[type]='Bağlantı veya içerik servislerinden biri yanıt vermedi. Tekrar deneyebilirsin.';
  }catch(e){if(e?.name!=='AbortError'&&seq===state.searchSeq[type])state.searchError[type]='Arama tamamlanamadı. İnternet bağlantını kontrol edip tekrar dene.';}
  finally{if(seq===state.searchSeq[type]){state.searchControllers[type]=null;if(type==='music'){state.musicSearching=false;if(state.tab==='music')renderMusic();}else{state.videoSearching=false;if(state.tab==='video')renderVideo();}}}
}
function clearRecentSearches(){state.recentSearches=[];save();if(state.tab==='music')renderMusic()}window.clearRecentSearches=clearRecentSearches;
function clearResults(type){state.searchControllers[type]?.abort();state.searchControllers[type]=null;state.searchError[type]='';state.results[type]=[];if(type==='music'){state.musicQuery='';state.musicSearching=false;}else{state.videoQuery='';state.videoSearching=false;}render()}window.clearResults=clearResults;
function randomDiscovery(type){const a=state.discovery[type];if(!a.length)return;openItem(a[Math.floor(Math.random()*a.length)],type,false,a)}window.randomDiscovery=randomDiscovery;

function candidateScore(f,t){
  const n=(f.name||'').toLowerCase(),size=Number(f.size)||0;
  let score=0;
  if(t==='music'){
    if(n.endsWith('.m4a'))score+=40;else if(n.endsWith('.mp3'))score+=35;else if(n.endsWith('.aac'))score+=25;
  }else{
    if(n.endsWith('.mp4'))score+=50;else if(n.endsWith('.m4v'))score+=40;
    const fmt=String(f.format||'').toLowerCase();if(/h\.264|avc|mpeg4|mpeg-4/.test(fmt))score+=20;
  }
  if(size>0)score+=Math.min(25,Math.log10(size+1)*3);
  return score;
}
async function resolveArchive(i,t,signal=null){
  const r=await fetchWithTimeout(`https://archive.org/metadata/${encodeURIComponent(i.identifier)}`,{signal,timeout:8500});if(!r.ok)throw Error('archive-metadata');const m=await r.json(),fs=m.files||[];
  const exts=t==='music'?['.m4a','.mp3','.aac']:['.mp4','.m4v'];
  const limit=t==='music'?60*1024*1024:450*1024*1024;
  const playable=fs.filter(f=>exts.some(e=>(f.name||'').toLowerCase().endsWith(e))&&!/sample|thumb|preview|trailer/i.test(f.name||''));
  if(!playable.length)throw Error('no-file');
  const preferred=playable.filter(f=>!(Number(f.size)||0)||(Number(f.size)||0)<=limit);
  const pool=(preferred.length?preferred:playable).sort((a,b)=>candidateScore(b,t)-candidateScore(a,t)).slice(0,6);
  const toCandidate=f=>({url:`https://archive.org/download/${encodeURIComponent(i.identifier)}/${encodeURIComponent(f.name).replace(/%2F/g,'/')}`,filename:f.name,size:Number(f.size)||0,mime:String(f.format||''),ext:(f.name||'').toLowerCase().split('.').pop()||'',verifiedPlayable:true,archiveUnverified:false});
  const candidates=pool.map(toCandidate);const first=candidates[0];
  return {...first,fallbacks:candidates.slice(1)};
}
async function openProviderAlternative(i,t){
  const alts=Array.isArray(i?.alternatives)?i.alternatives:[];if(!alts.length)return false;
  const [alt,...rest]=alts;const nextItem={...hydrate(alt),type:t,alternatives:rest,canonicalKey:i.canonicalKey||key(i)};
  await openItem(nextItem,t,true);return true;
}
async function openItem(i,t,preserveQueue=false,sourceQueue=null){
  state.openController?.abort();state.openController=null;
  i=hydrate({...i,type:t});const requestKey=key(i);state.pendingItem={key:requestKey,item:slim(i),type:t};
  if(i.blob&&!i.url)i.url=fileUrl(i);
  if(i.identifier&&!i.url){
    const controller=new AbortController();state.openController=controller;
    state.audioToken++;stopOther(t,i.provider);hideMini();
    showPlayer({...i,loading:true,pending:true});
    try{const r=await resolveArchive(i,t,controller.signal);if(!state.pendingItem||state.pendingItem.key!==requestKey)return;i={...i,...r};}
    catch(e){
      if(!state.pendingItem||state.pendingItem.key!==requestKey)return;
      state.pendingItem=null;
      if(controller.signal.aborted||e?.name==='AbortError')return;
      if(await openProviderAlternative(i,t))return;
      alert('Bu içerikte iPhone ile uyumlu oynatılabilir dosya bulunamadı.');closePlayer();return;
    }finally{if(state.openController===controller)state.openController=null}
  }
  if(!state.pendingItem||state.pendingItem.key!==requestKey)return;state.pendingItem=null;
  if(!preserveQueue){state.queueAutoExtend=sourceQueue===state.results.music;const src=(Array.isArray(sourceQueue)&&sourceQueue.length?sourceQueue:[i]).map(hydrate);const idx=src.findIndex(x=>key(x)===key(i));state.queue=src;state.queueIndex=idx>=0?idx:0;}
  play(i,t);
}
window.openItem=openItem;
function remember(i){const k=key(i);state.history=[slim(i),...state.history.filter(x=>key(x)!==k)].slice(0,80);save()}
function ensureYouTubeApi(){
  if(window.YT?.Player)return Promise.resolve(window.YT);if(state.youtubeApiPromise)return state.youtubeApiPromise;
  state.youtubeApiPromise=new Promise((resolve,reject)=>{const old=window.onYouTubeIframeAPIReady,timer=setTimeout(()=>reject(new Error('youtube-api-timeout')),9000);window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);try{old?.()}catch{};resolve(window.YT)};let sc=document.querySelector('script[data-zazo-youtube-api]');if(!sc){sc=document.createElement('script');sc.dataset.zazoYoutubeApi='1';sc.src='https://www.youtube.com/iframe_api';sc.onerror=()=>{clearTimeout(timer);reject(new Error('youtube-api-network'))};document.head.appendChild(sc)}}).catch(e=>{state.youtubeApiPromise=null;throw e});return state.youtubeApiPromise;
}
function stopYoutube(){try{state.youtubePlayer?.destroy?.()}catch{}state.youtubePlayer=null;const f=$('#youtubeFrame');if(f)f.replaceChildren();state.youtubeActive=false}
async function mountYouTube(i){
  const host=$('#youtubeFrame');if(!host||!i?.youtubeId)return;state.youtubeActive=true;
  try{
    const YT=await ensureYouTubeApi();if(!$('#youtubeFrame')||state.now?.youtubeId!==i.youtubeId)return;
    try{state.youtubePlayer?.destroy?.()}catch{};
    const origin=location.origin&&location.origin!=='null'?location.origin:undefined;
    state.youtubePlayer=new YT.Player('youtubeFrame',{videoId:i.youtubeId,playerVars:{autoplay:1,playsinline:1,controls:1,rel:0,...(origin?{origin}:{})},events:{onReady:e=>{try{e.target.playVideo()}catch{}bindMini();updateMediaSession()},onStateChange:e=>{if(!state.youtubeActive||state.now?.youtubeId!==i.youtubeId)return;if(e.data===YT.PlayerState.ENDED){next(1);return}bindMini()},onError:()=>{if(state.youtubeActive&&state.now?.youtubeId===i.youtubeId)mediaPlaybackFailed(i.type||'music')}}});
  }catch{
    const h=$('#youtubeFrame');if(h){const origin=location.origin&&location.origin!=='null'?`&origin=${encodeURIComponent(location.origin)}`:'';h.innerHTML=`<iframe class="youtube-frame" src="https://www.youtube.com/embed/${encodeURIComponent(i.youtubeId)}?autoplay=1&playsinline=1&controls=1${origin}" title="${esc(i.title)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`}
  }
}
function stopOther(type,provider=''){if(state.youtubeActive||state.youtubePlayer)stopYoutube();if(state.video){state.video.onerror=null;state.video.pause();state.video.removeAttribute('src');try{state.video.load()}catch{}state.video=null}try{state.audio.pause()}catch{}}
function tryMediaFallback(type){
  if(!state.now||state.now.type!==type||!Array.isArray(state.now.fallbacks)||!state.now.fallbacks.length)return false;
  const nextFile=state.now.fallbacks[0],rest=state.now.fallbacks.slice(1),pos=state.positions[key(state.now)]||0;state.now={...state.now,...nextFile,fallbacks:rest,verifiedPlayable:true,archiveUnverified:false};
  if(type==='music'){state.audio.src=state.now.url;state.positions[key(state.now)]=pos;applyResume(state.audio,state.now);showPlayer(state.now);state.audio.play().catch(()=>syncMainPlayButton())}else{if(state.video){state.video.onerror=null;state.video.pause();state.video.removeAttribute('src');try{state.video.load()}catch{}state.video=null}showPlayer(state.now)};bindMini();updateMediaSession();return true;
}
async function mediaPlaybackFailed(type){
  if(state.fallbackBusy)return;state.fallbackBusy=true;
  try{if(tryMediaFallback(type))return;const current=state.now?{...state.now}:null;if(current&&await openProviderAlternative(current,type))return;alert('Bu kaynak oynatılamadı ve aynı içerik için uygun alternatif bulunamadı.');}
  finally{state.fallbackBusy=false}
}
function applyResume(el,item){
  const pos=Number(state.positions[key(item)]||0);if(!(pos>0))return;
  const set=()=>{try{if(Number.isFinite(el.duration)&&el.duration>0&&pos<el.duration-1)el.currentTime=pos}catch{}};
  if(el.readyState>=1)set();else el.addEventListener('loadedmetadata',set,{once:true});
}
function syncMainPlayButton(){const b=$('#mainPlay');if(!b||!state.now||state.now.type!=='music'||state.now.provider==='youtube')return;b.textContent=state.audio.paused?'▶':'❚❚'}
function openQueueIndex(index){if(!Number.isInteger(index)||index<0||index>=state.queue.length)return;state.queueIndex=index;const target=hydrate(state.queue[index]);openItem(target,target.type||state.now?.type||'music',true)}window.openQueueIndex=openQueueIndex;
function play(i,t){
  const audioToken=++state.audioToken;stopOther(t,i.provider);state.now={...i,type:t};remember(state.now);
  if(i.provider==='youtube'){showPlayer(state.now)}
  else if(t==='music'){state.audio.preload=state.lowPower?'metadata':'auto';state.audio.onerror=()=>{if(audioToken!==state.audioToken||state.now?.type!=='music'||state.now.provider==='youtube')return;mediaPlaybackFailed('music')};state.audio.onended=()=>{if(audioToken!==state.audioToken)return;if(state.now){state.positions[key(state.now)]=0;save()}next(1)};state.audio.src=i.url;applyResume(state.audio,state.now);showPlayer(state.now);state.audio.play().catch(()=>{syncMainPlayButton();bindMini()})}
  else showPlayer(state.now);bindMini();updateMediaSession();
}
async function extendMusicQueue(){if(!state.queueAutoExtend||!state.now||state.now.type!=='music'||navigator.onLine===false)return false;const creator=String(state.now.creator||'').trim(),title=String(state.now.title||'').trim();const q=(creator&&!/^(internet archive|jamendo|youtube|dosyalarım|telefon)$/i.test(creator)?creator:title).trim();if(!q)return false;try{const c=new AbortController(),timer=setTimeout(()=>c.abort(),6500);const {results}=await runSearchJobs('music',q,c.signal);clearTimeout(timer);const currentTitle=normalizeWords(state.now.title),ranked=rankMusicResults(results,q).filter(x=>normalizeWords(x.title)!==currentTitle&&key(x)!==key(state.now)&&!state.queue.some(y=>key(y)===key(x)));if(ranked.length){state.queue.push(...ranked.slice(0,8));return true}}catch{}return false}
async function next(delta=1){if(!state.queue.length)return;if(delta>0&&state.queueIndex>=state.queue.length-1&&state.now?.type==='music'&&state.queueAutoExtend){const added=await extendMusicQueue();if(added){state.queueIndex++;const target=hydrate(state.queue[state.queueIndex]);openItem(target,target.type||'music',true);return}}state.queueIndex=(state.queueIndex+delta+state.queue.length)%state.queue.length;const target=hydrate(state.queue[state.queueIndex]);openItem(target,target.type||state.now?.type||'music',true)}window.next=next;
function downloadExists(i){return state.downloads.some(x=>x.originalKey===key(i)||x.id===i.id)}
function showPlayer(i){
  const s=$('#playerSheet');s.classList.remove('hidden');const v=i.type==='video',yt=i.provider==='youtube',visualVideo=v||yt,fav=state.favorites.some(x=>key(x)===key(i)),canDl=!i.loading&&!i.local&&!i.downloaded&&!!i.identifier&&!yt,actionsDisabled=i.loading?'disabled aria-disabled="true"':'';
  const visual=i.loading?'Yükleniyor…':yt?'<div id="youtubeFrame" class="youtube-frame-host"></div>':v?`<video id="videoEl" src="${esc(i.url)}" poster="${esc(i.thumb||'')}" controls playsinline preload="${state.lowPower?'metadata':'auto'}"></video>`:i.thumb?`<img src="${esc(i.thumb)}" alt="">`:'♫';
  const actions=[`<button class="action" ${actionsDisabled} onclick="toggleFav()">${fav?'♥':'♡'} Favori</button>`,`<button class="action" ${actionsDisabled} onclick="addToPlaylistPrompt()">＋ Liste</button>`,canDl?`<button class="action" id="downloadAction" onclick="downloadNow()">${downloadExists(i)?'✓ İndirildi':'⇩ İndir'}</button>`:'',!i.loading?'<button class="action" onclick="shareNow()">↗ Paylaş</button>':'',i.local||i.downloaded?`<button class="action danger" onclick="deleteStored('${esc(i.id)}','${i.downloaded?'downloads':'media'}')">⌫ Sil</button>`:''].filter(Boolean).join('');
  const upNext=state.queue.map((x,index)=>({x:hydrate(x),index})).filter(({x})=>(v?x.type==='video':true)&&key(x)!==key(i)).slice(0,4);
  const queueBox=(v||yt)?`<div class="up-next"><h3>Sıradaki ${v?'videolar':'içerikler'}</h3>${upNext.map(({x,index})=>`<div class="row" onclick="openQueueIndex(${index})">${art(x,x.type||i.type)}<div class="meta"><strong>${esc(x.title)}</strong><small>${esc(x.creator||x.source||'ZAZO')}</small></div><button type="button" aria-label="Aç">›</button></div>`).join('')||'<div class="muted">Sırada içerik yok.</div>'}</div>`:'';
  s.innerHTML=`<div class="player"><div class="player-top"><button class="icon-btn ghost" onclick="closePlayer()">⌄</button><strong>${yt?'YouTube':v?'Video':'Müzik'} Oynatıcı</strong><button class="icon-btn ghost" ${actionsDisabled} onclick="addToPlaylistPrompt()">＋</button></div><div class="player-art ${visualVideo?'video':''}">${visual}</div><div class="player-source">${sourcePill(i)}</div><h2>${esc(i.title)}</h2><p>${esc(i.creator||i.source||'')}</p>${!v&&!yt&&!i.loading?`<input id="seek" class="progress" type="range" min="0" max="100" value="0"><div class="time-row"><span id="elapsed">0:00</span><span id="duration">0:00</span></div><div class="controls"><button onclick="next(-1)">⏮</button><button id="mainPlay" class="main">❚❚</button><button onclick="next(1)">⏭</button></div>`:''}${yt?'<div class="preview-note">YouTube oynatma resmi gömülü oynatıcıyla yapılır. Ön planda parça bittiğinde ZAZO sıradaki içeriğe geçer; iPhone ekran kilidi davranışı YouTube/iOS tarafından sınırlandırılabilir.</div>':''}<div class="actions">${actions}</div>${queueBox}</div>`;
  state.youtubeActive=yt;if(yt&&!i.loading)setTimeout(()=>mountYouTube(i),0);
  if(state.downloadTask?.key===key(i))setTimeout(()=>updateDownloadUi(state.downloadTask.text,state.downloadTask.percent,state.downloadTask.key),0);
  s.onclick=e=>{if(e.target===s)closePlayer()};
  if(v&&!yt&&!i.loading){const el=$('#videoEl');state.video=el;applyResume(el,i);el.play().catch(()=>bindMini());el.ontimeupdate=()=>{state.positions[key(i)]=el.currentTime||0};el.onpause=()=>{save();bindMini()};el.onplay=bindMini;el.onerror=()=>{if(state.video===el&&state.now?.type==='video')mediaPlaybackFailed('video')};el.onended=()=>{state.positions[key(i)]=0;save();next(1)}}
  else if(!yt&&!i.loading){const p=$('#mainPlay'),seek=$('#seek');p.onclick=()=>state.audio.paused?state.audio.play().catch(()=>syncMainPlayButton()):state.audio.pause();state.audio.ontimeupdate=()=>{if(state.audio.duration&&seek){seek.value=state.audio.currentTime/state.audio.duration*100;const e=$('#elapsed'),d=$('#duration');if(e)e.textContent=fmt(state.audio.currentTime);if(d)d.textContent=fmt(state.audio.duration);state.positions[key(i)]=state.audio.currentTime}};seek.oninput=e=>{if(state.audio.duration)state.audio.currentTime=state.audio.duration*(e.target.value/100)};syncMainPlayButton()}
}
function closePlayer(){state.pendingItem=null;state.openController?.abort();state.openController=null;if(state.now?.provider==='youtube'){stopYoutube();bindMini()}if(state.now?.type==='video'&&state.video){state.positions[key(state.now)]=state.video.currentTime||state.positions[key(state.now)]||0;state.video.onerror=null;state.video.pause();state.video.removeAttribute('src');try{state.video.load()}catch{}state.video=null;bindMini()}$('#playerSheet').classList.add('hidden');save()}window.closePlayer=closePlayer;
function fmt(s){if(!isFinite(s))return'0:00';return`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`}
function youtubePlaying(){try{return !!(window.YT&&state.youtubePlayer&&state.youtubePlayer.getPlayerState?.()===window.YT.PlayerState.PLAYING)}catch{return false}}
function bindMini(){const m=$('#miniPlayer');if(!state.now){hideMini();return;}m.classList.remove('hidden');$('#miniTitle').textContent=state.now.title;$('#miniType').textContent=state.now.provider==='youtube'?'YouTube':state.now.type==='music'?'Müzik':'Video';if(state.now.provider==='youtube'){const playing=youtubePlaying();$('#miniPlay').textContent=playing?'❚❚':'▶';$('#miniPlay').onclick=e=>{e.stopPropagation();if(state.youtubePlayer){try{playing?state.youtubePlayer.pauseVideo():state.youtubePlayer.playVideo()}catch{showPlayer(state.now)}}else showPlayer(state.now);setTimeout(bindMini,80)};m.onclick=()=>showPlayer(state.now);return}const paused=state.now.type==='music'?state.audio.paused:(state.video?.paused??true);$('#miniPlay').textContent=paused?'▶':'❚❚';$('#miniPlay').onclick=e=>{e.stopPropagation();if(state.now.type==='music'){state.audio.paused?state.audio.play():state.audio.pause()}else if(state.video){state.video.paused?state.video.play():state.video.pause()}else{showPlayer(state.now)}bindMini()};m.onclick=()=>showPlayer(state.now)}
state.audio.onplay=()=>{bindMini();syncMainPlayButton()};state.audio.onpause=()=>{save();bindMini();syncMainPlayButton()};
function updateMediaSession(){if(!('mediaSession'in navigator))return;try{if(!state.now){navigator.mediaSession.metadata=null;return}navigator.mediaSession.metadata=new MediaMetadata({title:state.now.title,artist:state.now.creator||state.now.source||'ZAZO PLAYER',artwork:state.now.thumb?[{src:state.now.thumb,sizes:'512x512'}]:[]});navigator.mediaSession.setActionHandler('play',()=>{if(state.now.provider==='youtube'){if(state.youtubePlayer){try{state.youtubePlayer.playVideo?.()}catch{}}else showPlayer(hydrate(state.now));return}if(state.now.type==='music')return state.audio.play();if(state.video)return state.video.play();showPlayer(hydrate(state.now))});navigator.mediaSession.setActionHandler('pause',()=>{if(state.now.provider==='youtube'){try{state.youtubePlayer?.pauseVideo?.()}catch{};return}return state.now.type==='music'?state.audio.pause():state.video?.pause()});navigator.mediaSession.setActionHandler('previoustrack',()=>next(-1));navigator.mediaSession.setActionHandler('nexttrack',()=>next(1));try{navigator.mediaSession.setActionHandler('seekto',e=>{const m=state.now?.type==='music'?state.audio:state.video;if(m&&Number.isFinite(e.seekTime)){m.currentTime=Math.max(0,Math.min(e.seekTime,m.duration||e.seekTime));}})}catch{};}catch{}}

function toggleFavoriteItem(item){if(!item)return;const k=key(item),idx=state.favorites.findIndex(x=>key(x)===k);if(idx>=0)state.favorites.splice(idx,1);else state.favorites.unshift(slim(item));save();if(state.tab==='library')drawLibrary(state.libraryMode||'fav');}
function addItemToPlaylistPrompt(item){if(!item)return;let name=prompt('Çalma listesi adı','Favori Liste');if(!name?.trim())return;name=name.trim();let p=state.playlists.find(x=>x.name.toLowerCase()===name.toLowerCase());if(!p){p={id:uid(),name,items:[]};state.playlists.unshift(p)}if(!p.items.some(x=>key(x)===key(item)))p.items.push(slim(item));save();if(state.tab==='library')drawLibrary(state.libraryMode||'lists');}
function closeQuickMenu(){document.getElementById('quickMenu')?.remove()}window.closeQuickMenu=closeQuickMenu;
function quickMenuUi(id){const x=state.uiItems.get(id);if(!x)return;closeQuickMenu();const item=hydrate(x.item),fav=state.favorites.some(f=>key(f)===key(item));const wrap=document.createElement('div');wrap.id='quickMenu';wrap.className='quick-menu-backdrop';wrap.innerHTML=`<div class="quick-menu"><div class="quick-menu-head"><div><strong>${esc(item.title)}</strong><small>${esc(item.creator||providerLabel(item))}</small></div><button onclick="closeQuickMenu()">✕</button></div><button id="qmPlay">▶ Oynat</button><button id="qmFav">${fav?'♥ Favoriden çıkar':'♡ Favoriye ekle'}</button><button id="qmList">＋ Çalma listesine ekle</button><button id="qmShare">↗ Paylaş</button></div>`;document.body.appendChild(wrap);wrap.onclick=e=>{if(e.target===wrap)closeQuickMenu()};wrap.querySelector('#qmPlay').onclick=()=>{closeQuickMenu();openItem(item,item.type,false,x.queue)};wrap.querySelector('#qmFav').onclick=()=>{toggleFavoriteItem(item);closeQuickMenu()};wrap.querySelector('#qmList').onclick=()=>{addItemToPlaylistPrompt(item);closeQuickMenu()};wrap.querySelector('#qmShare').onclick=()=>{const u=item.shareUrl||item.url||location.href;if(navigator.share)navigator.share({title:item.title,url:u}).catch(()=>{});else navigator.clipboard?.writeText(u);closeQuickMenu()};}
window.quickMenuUi=quickMenuUi;
function toggleFav(){if(!state.now)return;const k=key(state.now),idx=state.favorites.findIndex(x=>key(x)===k);if(idx>=0)state.favorites.splice(idx,1);else state.favorites.unshift(slim(state.now));save();const b=document.querySelector('#playerSheet .actions .action');if(b)b.textContent=`${state.favorites.some(x=>key(x)===k)?'♥':'♡'} Favori`;if(state.now.provider!=='youtube'&&!state.video&&state.now.type==='video')showPlayer(state.now)}window.toggleFav=toggleFav;
function shareNow(){if(!state.now)return;const shareUrl=state.now.local||state.now.downloaded?location.href:(state.now.shareUrl||state.now.url||location.href);if(navigator.share)navigator.share({title:state.now.title,url:shareUrl}).catch(()=>{});else navigator.clipboard?.writeText(shareUrl)}window.shareNow=shareNow;
function addToPlaylistPrompt(){if(!state.now)return;let name=prompt('Çalma listesi adı','Favori Liste');if(!name?.trim())return;name=name.trim();let p=state.playlists.find(x=>x.name.toLowerCase()===name.toLowerCase());if(!p){p={id:uid(),name,items:[]};state.playlists.unshift(p)}if(!p.items.some(x=>key(x)===key(state.now)))p.items.push(slim(state.now));save();alert('Çalma listesine eklendi.')}window.addToPlaylistPrompt=addToPlaylistPrompt;

async function storageRoom(required){
  if(!navigator.storage?.estimate)return {ok:true,free:null};
  try{const e=await navigator.storage.estimate(),free=Math.max(0,(e.quota||0)-(e.usage||0));return {ok:!required||free>required*1.15,free}}catch{return {ok:true,free:null}}
}
function isDownloadUiTarget(targetKey){return !!(targetKey&&state.now&&key(state.now)===targetKey)}
function updateDownloadUi(text,percent=null,targetKey=state.downloadTask?.key){
  if(state.downloadTask&&targetKey===state.downloadTask.key){state.downloadTask.text=text;state.downloadTask.percent=percent;}
  if(!isDownloadUiTarget(targetKey))return;
  const btn=$('#downloadAction');if(btn){btn.disabled=true;btn.textContent=percent==null?text:`${text} %${percent}`}
  let box=$('#downloadProgress');
  if(!box&&$('#playerSheet .actions')){$('#playerSheet .actions').insertAdjacentHTML('afterend','<div id="downloadProgress" class="download-progress"><div class="download-track"><span id="downloadBar"></span></div><div class="download-meta"><span id="downloadText">Hazırlanıyor…</span><button type="button" onclick="cancelDownload()">İptal</button></div></div>');box=$('#downloadProgress')}
  if(box){const bar=$('#downloadBar'),txt=$('#downloadText');if(bar&&percent!=null)bar.style.width=`${percent}%`;if(txt)txt.textContent=percent==null?text:`${text} %${percent}`}
}
function clearDownloadUi(targetKey){if(!isDownloadUiTarget(targetKey))return;const box=$('#downloadProgress');if(box)box.remove();const btn=$('#downloadAction');if(btn){btn.disabled=false;btn.textContent=state.now&&downloadExists(state.now)?'✓ İndirildi':'⇩ İndir'}}
function cancelDownload(){state.downloadController?.abort()}window.cancelDownload=cancelDownload;
async function fetchThumbBlob(url,signal){if(!url)return null;try{const r=await fetchWithTimeout(url,{signal,timeout:6000});if(!r.ok)return null;const b=await r.blob();return b.size<=4*1024*1024?b:null}catch{return null}}
async function writeDownloadToOpfs(response,name,total,hardLimit,targetKey){
  const dir=await opfsDir(true);if(!dir)throw Error('opfs-unavailable');
  const h=await dir.getFileHandle(name,{create:true}),w=await h.createWritable();let received=0,lastPct=-1;
  try{
    if(response.body?.getReader){
      const reader=response.body.getReader();
      while(true){const {done,value}=await reader.read();if(done)break;received+=value.byteLength;if(received>hardLimit)throw Error('too-large');await w.write(value);if(total){const pct=Math.min(99,Math.floor(received/total*100));if(pct!==lastPct){lastPct=pct;updateDownloadUi('İndiriliyor',pct,targetKey)}}}
    }else{
      const memorySafe=48*1024*1024;if(!total||total>memorySafe)throw Error('stream-unavailable');
      const b=await response.blob();received=b.size;if(received>hardLimit||received>memorySafe)throw Error('too-large');await w.write(b);
    }
    await w.close();return received;
  }catch(e){try{await w.abort()}catch{};try{await dir.removeEntry(name)}catch{};throw e;}
}
async function downloadNow(){
  if(!state.now?.identifier)return;if(state.downloadBusy){alert('Başka bir içerik indiriliyor. Önce onu tamamla veya iptal et.');return;}
  const target={...state.now},targetKey=key(target);
  if(downloadExists(target)){alert('Bu içerik zaten İndirilenler bölümünde.');return;}
  const useOPFS=!!navigator.storage?.getDirectory;
  state.downloadBusy=true;state.downloadController=new AbortController();state.downloadTask={key:targetKey,text:'Hazırlanıyor…',percent:null};updateDownloadUi('Hazırlanıyor…',null,targetKey);
  let opfsName=null;
  try{
    let info={url:target.url,filename:target.filename,size:target.size};if(!info.url)info=await resolveArchive(target,target.type,state.downloadController.signal);
    const hardLimit=useOPFS?(target.type==='video'?500*1024*1024:120*1024*1024):(target.type==='video'?64*1024*1024:32*1024*1024);
    if(info.size&&info.size>hardLimit)throw new Error('too-large');
    const room=await storageRoom(info.size||0);if(!room.ok)throw new Error('no-space');
    const r=await fetch(info.url,{signal:state.downloadController.signal});if(!r.ok)throw new Error('network');
    const total=Number(r.headers.get('content-length'))||info.size||0;if(total&&total>hardLimit)throw new Error('too-large');
    const room2=await storageRoom(total);if(!room2.ok)throw new Error('no-space');
    const id=`download:${uid()}`;let blob=null,size=0;
    if(useOPFS){
      const ext=(String(info.filename||'').match(/\.[a-z0-9]{2,5}$/i)||[target.type==='video'?'.mp4':'.m4a'])[0];opfsName=`${id.replace(/[^a-z0-9_-]/gi,'_')}${ext}`;size=await writeDownloadToOpfs(r,opfsName,total,hardLimit,targetKey);
    }else{
      updateDownloadUi('İndiriliyor',0,targetKey);blob=await r.blob();size=blob.size;if(size>hardLimit)throw new Error('too-large');updateDownloadUi('İndiriliyor',99,targetKey);
    }
    updateDownloadUi('Kaydediliyor',100,targetKey);
    const thumbBlob=await fetchThumbBlob(target.thumb,state.downloadController.signal);
    const obj={...slim(target),id,originalKey:targetKey,downloaded:true,local:false,source:'İndirilenler',blob,opfsName,size:size||total||0,mime:r.headers.get('content-type')||target.mime||'',thumb:target.thumb||'',remoteThumb:target.thumb||'',thumbBlob,savedAt:Date.now()};
    await dbPut('downloads',obj);await refreshStored();if($('#playerSheet').classList.contains('hidden'))render();else if(state.now&&key(state.now)===targetKey)showPlayer(hydrate(state.now));alert('İndirme tamamlandı. Çevrimdışı oynatabilirsin.');
  }catch(e){
    if(opfsName)await opfsDelete(opfsName);
    if(e?.name==='AbortError')alert('İndirme iptal edildi.');
    else if(e?.message==='too-large')alert(useOPFS?'Bu dosya güvenli indirme sınırının üzerinde.':'Bu cihazda büyük dosyalar belleğe yüklenmeden saklanamıyor; daha küçük bir dosya seç.');
    else if(e?.message==='no-space')alert('Cihazda/PWA depolama alanında bu indirme için yeterli boş alan yok.');
    else if(e?.message==='stream-unavailable')alert('Bu cihaz büyük dosyayı güvenli biçimde parça parça kaydedemiyor. İçeriği internetten oynatabilirsin.');
    else alert('İndirme tamamlanamadı. Bağlantıyı veya içerik kaynağını kontrol et.');
  }finally{
    state.downloadBusy=false;state.downloadController=null;clearDownloadUi(targetKey);state.downloadTask=null;
  }
}
window.downloadNow=downloadNow;

function listRows(items,hydrateFirst=false){const arr=hydrateFirst?items.map(hydrate):items;const music=arr.filter(x=>x.type!=='video'),video=arr.filter(x=>x.type==='video');return arr.map(x=>rowItem(x,x.type,x.type==='video'?video:music)).join('')}
function renderLibrary(mode='files'){
  resetUiRegistry();state.libraryMode=mode;
  const pageTitle=mode==='downloads'?'İndirilenler':mode==='lists'?'Listelerim':'Kütüphanem';
  view.innerHTML=`<div class="section-head"><h2>${pageTitle}</h2><button id="addFileBtn" class="${mode==='files'?'':'hidden'}">＋ Dosya Ekle</button></div><div class="library-tabs four"><button class="libtab ${mode==='files'?'active':''}" data-lib="files">Kütüphane</button><button class="libtab ${mode==='downloads'?'active':''}" data-lib="downloads">İndirilenler</button><button class="libtab ${mode==='fav'?'active':''}" data-lib="fav">Favoriler</button><button class="libtab ${mode==='lists'?'active':''}" data-lib="lists">Listeler</button></div><div id="libBody"></div>`;
  drawLibrary(mode);syncNav();document.querySelectorAll('.libtab').forEach(b=>b.onclick=()=>{state.libraryMode=b.dataset.lib;syncNav();drawLibrary(b.dataset.lib)});$('#addFileBtn').onclick=()=>$('#fileInput').click();
}
function drawLibrary(mode){
  resetUiRegistry();
  const addBtn=$('#addFileBtn');if(addBtn)addBtn.classList.toggle('hidden',mode!=='files');
  document.querySelectorAll('.libtab').forEach(b=>b.classList.toggle('active',b.dataset.lib===mode));const b=$('#libBody');
  if(mode==='files'){
    const g=libraryGroups(),cat=state.libraryCategory||'songs';
    const catTabs=`<div class="library-category-tabs"><button class="${cat==='songs'?'active':''}" onclick="setLibraryCategory('songs')">Şarkılar</button><button class="${cat==='artists'?'active':''}" onclick="setLibraryCategory('artists')">Sanatçılar</button><button class="${cat==='albums'?'active':''}" onclick="setLibraryCategory('albums')">Albümler</button><button class="${cat==='files'?'active':''}" onclick="setLibraryCategory('files')">Dosyalar</button></div>`;
    if(cat==='artists')b.innerHTML=catTabs+(g.artists.length?`<div class="group-grid">${g.artists.map(([name,items])=>`<button class="group-card" onclick="browseArtist(decodeURIComponent('${encArg(name)}'))"><span>♪</span><strong>${esc(name)}</strong><small>${items.length} parça</small></button>`).join('')}</div>`:'<div class="empty">Henüz sanatçı yok. Şarkı dinledikçe, favoriye aldıkça veya listelere ekledikçe burada oluşur.</div>');
    else if(cat==='albums')b.innerHTML=catTabs+(g.albums.length?`<div class="group-grid">${g.albums.map(a=>`<button class="group-card" onclick="browseAlbum(decodeURIComponent('${encArg(a.name)}'),decodeURIComponent('${encArg(a.artist)}'))"><span>▣</span><strong>${esc(a.name)}</strong><small>${esc(a.artist)} · ${a.items.length} parça</small></button>`).join('')}</div>`:'<div class="empty">Albüm bilgisi bulunan içerik henüz yok.</div>');
    else if(cat==='files')b.innerHTML=catTabs+(state.localMedia.length?`<div class="list">${listRows(state.localMedia)}</div>`:'<div class="empty">Henüz kendi dosyan yok. “Dosya Ekle” ile MP3 veya video ekleyebilirsin.</div>');
    else b.innerHTML=catTabs+(g.items.length?`<div class="list">${listRows(g.items,true)}</div>`:'<div class="empty">Kütüphanen boş. Dinlediğin, favoriye aldığın veya listene eklediğin şarkılar burada görünür.</div>');
  }
  if(mode==='downloads')b.innerHTML=state.downloads.length?`<div class="list">${listRows(state.downloads)}</div>`:'<div class="empty">Çevrimdışı içerik yok. İnternette bir içerik açıp “İndir”e bas.</div>';
  if(mode==='fav')b.innerHTML=state.favorites.length?`<div class="list">${listRows(state.favorites,true)}</div>`:'<div class="empty">Favori içerik yok.</div>';
  if(mode==='lists')b.innerHTML=state.playlists.length?state.playlists.map(p=>`<section class="playlist-card"><button class="playlist-open" onclick="openPlaylist('${p.id}')"><strong>${esc(p.name)}</strong><small>${p.items.length} içerik</small></button><div class="playlist-actions"><button onclick="playPlaylist('${p.id}')" aria-label="Oynat">▶</button><button onclick="renamePlaylist('${p.id}')" aria-label="Ad değiştir">✎</button><button class="danger-round" onclick="deletePlaylist('${p.id}')" aria-label="Sil">⌫</button></div></section>`).join(''):'<div class="empty">Henüz çalma listen yok.</div>';
}
function setLibraryCategory(cat){state.libraryCategory=cat;drawLibrary('files')}window.setLibraryCategory=setLibraryCategory;
function openLibrary(mode){state.tab='library';state.libraryMode=mode||'files';syncNav();renderLibrary(state.libraryMode);scrollTo({top:0,behavior:'auto'})}window.openLibrary=openLibrary;
function playPlaylist(id){const p=state.playlists.find(x=>x.id===id);if(!p?.items.length)return;state.queueAutoExtend=false;state.queue=p.items.map(hydrate);state.queueIndex=0;openItem(state.queue[0],state.queue[0].type,true)}window.playPlaylist=playPlaylist;
function openPlaylist(id){
  resetUiRegistry();
  const p=state.playlists.find(x=>x.id===id),b=$('#libBody');if(!p||!b)return;const queue=p.items.map(hydrate);
  b.innerHTML=`<div class="playlist-detail-head"><button onclick="drawLibrary('lists')">‹ Listeler</button><div><h3>${esc(p.name)}</h3><small>${p.items.length} içerik</small></div><button onclick="playPlaylist('${p.id}')">▶ Tümünü çal</button></div>${p.items.length?`<div class="list">${queue.map((item,n)=>{const uiid=registerUi(item,item.type,queue);return `<div class="row" onclick="openUi('${uiid}')">${art(item,item.type)}<div class="meta"><strong>${esc(item.title)}</strong><small>${esc(item.creator||item.source||'ZAZO')}</small></div><div class="row-actions"><button class="move-row" ${n===0?'disabled':''} onclick="event.stopPropagation();movePlaylistItem('${p.id}',${n},-1)" aria-label="Yukarı taşı">↑</button><button class="move-row" ${n===p.items.length-1?'disabled':''} onclick="event.stopPropagation();movePlaylistItem('${p.id}',${n},1)" aria-label="Aşağı taşı">↓</button><button class="remove-row" onclick="event.stopPropagation();removeFromPlaylist('${p.id}',${n})" aria-label="Listeden çıkar">⌫</button></div></div>`}).join('')}</div>`:'<div class="empty">Bu liste boş.</div>'}`;
}window.openPlaylist=openPlaylist;
function renamePlaylist(id){const p=state.playlists.find(x=>x.id===id);if(!p)return;const name=prompt('Yeni liste adı',p.name);if(!name?.trim())return;p.name=name.trim();save();drawLibrary('lists')}window.renamePlaylist=renamePlaylist;
function deletePlaylist(id){const p=state.playlists.find(x=>x.id===id);if(!p||!confirm(`“${p.name}” listesi silinsin mi?`))return;state.playlists=state.playlists.filter(x=>x.id!==id);save();drawLibrary('lists')}window.deletePlaylist=deletePlaylist;
function removeFromPlaylist(id,index){const p=state.playlists.find(x=>x.id===id);if(!p||!p.items[index])return;p.items.splice(index,1);save();openPlaylist(id)}window.removeFromPlaylist=removeFromPlaylist;
function movePlaylistItem(id,index,delta){const p=state.playlists.find(x=>x.id===id),to=index+delta;if(!p||index<0||to<0||index>=p.items.length||to>=p.items.length)return;[p.items[index],p.items[to]]=[p.items[to],p.items[index]];save();openPlaylist(id)}window.movePlaylistItem=movePlaylistItem;
function detectMediaType(f){
  const mime=String(f.type||'').toLowerCase(),name=String(f.name||'').toLowerCase();
  if(mime.startsWith('video/'))return 'video';if(mime.startsWith('audio/'))return 'music';
  if(/\.(mp4|m4v|mov|webm)$/i.test(name))return 'video';if(/\.(mp3|m4a|aac|wav|flac|ogg)$/i.test(name))return 'music';return null;
}
function guessedMime(f,type){const n=String(f.name||'').toLowerCase();if(f.type)return f.type;if(type==='video'){if(n.endsWith('.mp4')||n.endsWith('.m4v'))return'video/mp4';if(n.endsWith('.mov'))return'video/quicktime';if(n.endsWith('.webm'))return'video/webm'}else{if(n.endsWith('.mp3'))return'audio/mpeg';if(n.endsWith('.m4a'))return'audio/mp4';if(n.endsWith('.aac'))return'audio/aac';if(n.endsWith('.wav'))return'audio/wav';if(n.endsWith('.ogg'))return'audio/ogg';if(n.endsWith('.flac'))return'audio/flac'}return''}
async function probeLocalFile(f,type){
  const tag=type==='video'?'video':'audio',el=document.createElement(tag),mime=guessedMime(f,type);if(mime&&el.canPlayType&&el.canPlayType(mime)==='')return false;
  const url=URL.createObjectURL(f);el.preload='metadata';if(type==='video'){el.muted=true;el.playsInline=true}
  return await new Promise(resolve=>{let done=false;const finish=v=>{if(done)return;done=true;clearTimeout(timer);el.removeAttribute('src');try{el.load()}catch{};URL.revokeObjectURL(url);resolve(v)};const timer=setTimeout(()=>finish(false),6500);el.onloadedmetadata=()=>finish(true);el.onerror=()=>finish(false);el.src=url});
}
$('#fileInput').onchange=async e=>{
  const rejected=[],noSpace=[],codec=[];
  for(const f of [...e.target.files]){
    const type=detectMediaType(f);if(!type){rejected.push(f.name);continue;}
    const room=await storageRoom(f.size||0);if(!room.ok){noSpace.push(f.name);continue;}
    if(!(await probeLocalFile(f,type))){codec.push(f.name);continue;}
    const id=`local:${uid()}`,obj={id,title:f.name.replace(/\.[^.]+$/,''),creator:'Dosyalarım',source:'Telefon',type,local:true,mime:guessedMime(f,type),size:f.size,blob:f};
    try{await dbPut('media',obj)}catch{noSpace.push(f.name)}
  }
  await refreshStored();e.target.value='';openLibrary('files');
  const msgs=[];if(rejected.length)msgs.push(`Desteklenmeyen tür: ${rejected.slice(0,3).join(', ')}${rejected.length>3?'…':''}`);if(codec.length)msgs.push(`iPhone oynatamadı: ${codec.slice(0,3).join(', ')}${codec.length>3?'…':''}`);if(noSpace.length)msgs.push(`Yeterli depolama yok: ${noSpace.slice(0,3).join(', ')}${noSpace.length>3?'…':''}`);if(msgs.length)alert(msgs.join('\n'));
};
function hideMini(){const m=$('#miniPlayer');if(m)m.classList.add('hidden');$('#miniTitle').textContent='—';$('#miniType').textContent='—'}
function stopStoredIfCurrent(old){
  if(!old||!state.now)return false;
  const sameId=state.now.id===old.id;
  if(!sameId)return false;
  state.pendingItem=null;state.openController?.abort();state.openController=null;state.audioToken++;
  if(state.now.type==='music'){state.audio.pause();state.audio.removeAttribute('src');try{state.audio.load()}catch{}}
  if(state.video){state.video.onerror=null;state.video.pause();state.video.removeAttribute('src');try{state.video.load()}catch{}state.video=null}
  state.now=null;hideMini();$('#playerSheet').classList.add('hidden');
  return true;
}
async function deleteStored(id,store){
  if(!confirm('Bu içerik ZAZO PLAYER’dan silinsin mi?'))return;
  const arr=store==='downloads'?state.downloads:state.localMedia,old=arr.find(x=>x.id===id);if(!old)return;
  const oldUrl=old.url,canonical=key(old),wasCurrent=stopStoredIfCurrent(old);
  await dbDel(store,id);if(store==='downloads'&&old.opfsName)await opfsDelete(old.opfsName);
  if(store==='media'){state.favorites=state.favorites.filter(x=>x.id!==id);state.history=state.history.filter(x=>x.id!==id);state.playlists.forEach(p=>p.items=p.items.filter(x=>x.id!==id));}
  else{state.history=state.history.filter(x=>x.id!==id);}
  state.queue=state.queue.filter(x=>x.id!==id);if(state.queueIndex>=state.queue.length)state.queueIndex=Math.max(0,state.queue.length-1);
  delete state.positions[canonical];delete state.positions[id];
  if(oldUrl?.startsWith('blob:')){try{URL.revokeObjectURL(oldUrl)}catch{}}if(old.thumb?.startsWith('blob:')){try{URL.revokeObjectURL(old.thumb)}catch{}}
  save();await refreshStored();render();if(wasCurrent)updateMediaSession();
}window.deleteStored=deleteStored;

function renderSettings(){
  const total=[...state.localMedia,...state.downloads].reduce((a,x)=>a+(x.size||0),0),online=navigator.onLine!==false;
  view.innerHTML=`<div class="section-head"><h2>Ayarlar</h2></div>
  <div class="setting"><div><strong>Düşük Güç Modu</strong><div class="muted">Animasyonları ve arka plan ağ kullanımını azaltır</div></div><button id="lpSwitch" class="switch ${state.lowPower?'on':''}" aria-label="Düşük güç modu"></button></div>
  <div class="setting"><div><strong>Bağlantı</strong><div class="muted">Arama için internet bağlantısı gerekir</div></div><span>${online?'✓ Çevrimiçi':'Çevrimdışı'}</span></div>
  <div class="setting"><div><strong>Kendi müzik ve videoların</strong><div class="muted">Telefonundaki uyumlu dosyaları Kütüphane’ye ekleyebilirsin</div></div><button id="settingsAddFile" class="text-btn">Dosya Ekle</button></div>
  <div class="setting"><div><strong>Çevrimdışı depolama</strong><div class="muted">${state.downloads.length} indirme · ${formatBytes(total)}</div></div><button id="clearDownloadsBtn" class="text-btn danger-text" ${state.downloads.length?'':'disabled'}>Temizle</button></div>
  <div class="setting"><div><strong>Depolama koruması</strong><div class="muted">Çevrimdışı dosyaların sistem tarafından temizlenme riskini azaltır</div></div><span>${state.storagePersistent===true?'✓ Kalıcı':state.storagePersistent===false?'Sistem yönetiyor':'Kontrol ediliyor'}</span></div>
  <div class="setting"><div><strong>Kaldığın yerden devam</strong><div class="muted">Müzik ve video konumu otomatik kaydedilir</div></div><span>✓</span></div>
  <div class="setting"><div><strong>Kilit ekranı kontrolleri</strong><div class="muted">Desteklenen ses akışlarında iPhone medya kontrolleri</div></div><span>✓</span></div>
  <div class="setting"><div><strong>Sürüm</strong><div class="muted">ZAZO PLAYER V1.3.4 STABILITY</div></div><span>1.3.4</span></div>`;
  $('#lpSwitch').onclick=()=>$('#powerBtn').click();
  const clear=$('#clearDownloadsBtn');if(clear)clear.onclick=clearAllDownloads;
  const add=$('#settingsAddFile');if(add)add.onclick=()=>$('#fileInput').click();
}
async function clearAllDownloads(){if(!state.downloads.length||!confirm('Tüm indirilen içerikler silinsin mi?'))return;const ids=new Set(state.downloads.map(x=>x.id));for(const x of [...state.downloads]){stopStoredIfCurrent(x);try{await dbDel('downloads',x.id)}catch{}if(x.opfsName)await opfsDelete(x.opfsName);if(x.url?.startsWith('blob:'))try{URL.revokeObjectURL(x.url)}catch{};if(x.thumb?.startsWith('blob:'))try{URL.revokeObjectURL(x.thumb)}catch{};delete state.positions[x.id];if(x.originalKey)delete state.positions[x.originalKey];}state.queue=state.queue.filter(x=>!ids.has(x.id));state.queueIndex=Math.min(state.queueIndex,state.queue.length-1);state.downloads=[];save();await refreshStored();renderSettings()}window.clearAllDownloads=clearAllDownloads;
function formatBytes(n){if(!n)return'0 MB';if(n<1024*1024)return`${Math.round(n/1024)} KB`;return`${(n/1024/1024).toFixed(n>100*1024*1024?0:1)} MB`}
function render(){resetUiRegistry();if(state.tab==='home')renderHome();else if(state.tab==='music')renderMusic();else if(state.tab==='video')renderVideo();else if(state.tab==='library')renderLibrary(state.libraryMode||'files');else renderSettings()}

(async()=>{await refreshStored();syncNav();render();setTimeout(()=>$('#splash')?.classList.add('hide'),650);if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});let refreshed=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshed)return;refreshed=true;location.reload();});}try{if(navigator.storage?.persisted)state.storagePersistent=await navigator.storage.persisted();if(state.storagePersistent!==true&&navigator.storage?.persist)state.storagePersistent=await navigator.storage.persist();}catch{state.storagePersistent=false}if(state.tab==='settings')renderSettings();})();
window.addEventListener('pagehide',save);window.addEventListener('beforeunload',()=>{for(const x of [...state.localMedia,...state.downloads]){if(x?.url?.startsWith('blob:'))try{URL.revokeObjectURL(x.url)}catch{};if(x?.thumb?.startsWith('blob:'))try{URL.revokeObjectURL(x.thumb)}catch{}}});document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});

window.addEventListener('online',()=>{if(state.searchError.music?.startsWith('İnternet bağlantısı yok'))state.searchError.music='';if(state.searchError.video?.startsWith('İnternet bağlantısı yok'))state.searchError.video='';if(state.tab==='music')renderMusic();else if(state.tab==='video')renderVideo()});
