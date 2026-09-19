const state={
  tab:'home',
  lowPower:localStorage.getItem('zazo.lowPower')==='1',
  favorites:JSON.parse(localStorage.getItem('zazo.favorites')||'[]'),
  history:JSON.parse(localStorage.getItem('zazo.history')||'[]'),
  playlists:JSON.parse(localStorage.getItem('zazo.playlists')||'[]'),
  positions:JSON.parse(localStorage.getItem('zazo.positions')||'{}'),
  results:{music:[],video:[]},
  discovery:{music:[],video:[]},
  localMedia:[],downloads:[],now:null,queue:[],queueIndex:-1,
  audio:new Audio(),video:null,installPrompt:null,downloadBusy:false,downloadController:null,pendingItem:null,uiItems:new Map(),uiSeq:0
};
const $=s=>document.querySelector(s), view=$('#view'), tabs=[...document.querySelectorAll('.nav-btn')];
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':'&quot;'}[c]));
const key=i=>i?.originalKey||i?.id||i?.identifier||i?.url||`${i?.type||''}:${i?.title||''}:${i?.creator||''}`;
const slim=i=>{const x={...i};delete x.blob;if(x.local||x.downloaded)delete x.url;return x};
const save=()=>{
  localStorage.setItem('zazo.favorites',JSON.stringify(state.favorites.map(slim)));
  localStorage.setItem('zazo.history',JSON.stringify(state.history.slice(0,80).map(slim)));
  localStorage.setItem('zazo.playlists',JSON.stringify(state.playlists.map(p=>({...p,items:p.items.map(slim)}))));
  localStorage.setItem('zazo.positions',JSON.stringify(state.positions));
};
if(state.lowPower)document.body.classList.add('low-power');

const DB='zazo-player-db';
function dbOpen(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,2);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('media'))db.createObjectStore('media',{keyPath:'id'});if(!db.objectStoreNames.contains('downloads'))db.createObjectStore('downloads',{keyPath:'id'});};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function dbAll(store){const db=await dbOpen();return new Promise((res,rej)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error);});}
async function dbPut(store,x){const db=await dbOpen();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).put(x);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
async function dbDel(store,id){const db=await dbOpen();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
function fileUrl(i){return i.blob?URL.createObjectURL(i.blob):i.url}
function syncStoredUrls(records,previous=[]){
  const prev=new Map(previous.map(x=>[x.id,x]));
  const next=records.map(x=>{const old=prev.get(x.id);if(old?.url?.startsWith('blob:')){prev.delete(x.id);return {...x,url:old.url}}return {...x,url:fileUrl(x)}});
  for(const old of prev.values())if(old?.url?.startsWith('blob:')&&old.url!==state.now?.url)URL.revokeObjectURL(old.url);
  return next;
}
async function refreshStored(){
  try{state.localMedia=syncStoredUrls(await dbAll('media'),state.localMedia);}catch{state.localMedia=[]}
  try{state.downloads=syncStoredUrls(await dbAll('downloads'),state.downloads);}catch{state.downloads=[]}
}
function hydrate(i){
  if(!i)return i;
  if(i.local){const x=state.localMedia.find(x=>x.id===i.id);if(x)return {...x};}
  if(i.downloaded){const x=state.downloads.find(x=>x.id===i.id);if(x)return {...x};}
  const offline=state.downloads.find(x=>x.originalKey===key(i));
  if(offline)return {...offline};
  return {...i};
}

function setTab(tab){state.tab=tab;tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));render();scrollTo({top:0,behavior:state.lowPower?'auto':'smooth'});if(tab==='music')ensureDiscovery('music');if(tab==='video')ensureDiscovery('video');}
window.setTab=setTab;
tabs.forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{$('#drawer').classList.add('hidden');setTab(b.dataset.go)});
$('#menuBtn').onclick=()=>$('#drawer').classList.remove('hidden');
$('#closeDrawer').onclick=()=>$('#drawer').classList.add('hidden');
$('#drawer').onclick=e=>{if(e.target.id==='drawer')$('#drawer').classList.add('hidden')};
$('#powerBtn').onclick=()=>{state.lowPower=!state.lowPower;document.body.classList.toggle('low-power',state.lowPower);localStorage.setItem('zazo.lowPower',state.lowPower?'1':'0');render();};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e});
$('#installBtn').onclick=async()=>{if(state.installPrompt){state.installPrompt.prompt();await state.installPrompt.userChoice;state.installPrompt=null}else alert('iPhone: Safari → Paylaş → Ana Ekrana Ekle')};

function hero(){return `<section class="hero"><span class="hero-badge">● İnternet ana kaynak · Kendi dosyaların alternatif</span><h1>Müzik ayrı, video ayrı. Tek uygulamada.</h1><p>Keşfet, dinle, izle; izinli içerikleri çevrimdışı kaydet.</p><div class="hero-actions"><button onclick="setTab('music')">♫ Müzik Keşfet</button><button onclick="setTab('video')">▶ Video Akışı</button></div></section>`}
function quick(label,sub,icon,tab,onclick=''){return `<button class="quick" ${onclick?`onclick="${onclick}"`:`onclick="setTab('${tab}')"`}><span class="big">${icon}</span><strong>${label}</strong><small>${sub}</small></button>`}
function art(i,t,loading='lazy'){return `<div class="thumb ${t==='video'?'video':''}">${i.thumb?`<img loading="lazy" decoding="async" src="${esc(i.thumb)}" alt="">`:(t==='video'?'▶':'♫')}</div>`}
function registerUi(i,t){const id=`u${++state.uiSeq}`;state.uiItems.set(id,{item:slim(i),type:t||i.type});return id}
function openUi(id){const x=state.uiItems.get(id);if(x)openItem(x.item,x.type)}window.openUi=openUi;
function mediaCard(i,t){const id=registerUi(i,t);return `<article class="media-card" onclick="openUi('${id}')">${art(i,t)}<strong>${esc(i.title)}</strong><small>${esc(i.creator||i.source||'ZAZO')}</small></article>`}
function continueItems(){return state.history.filter(x=>(state.positions[key(x)]||0)>8).slice(0,6)}
function renderHome(){
  const cont=continueItems(), rec=state.history.slice(0,6);
  view.innerHTML=`${hero()}<div class="quick-grid">${quick('Müzik','Keşfet ve dinle','♫','music')}${quick('Video','Akışta izle','▶','video')}${quick('İndirilenler',`${state.downloads.length} çevrimdışı içerik`,'⇩','library',"openLibrary('downloads')")}${quick('Dosyalarım',`${state.localMedia.length} yerel içerik`,'＋','library',"openLibrary('files')")}</div>${cont.length?`<section class="section"><div class="section-head"><h2>Kaldığın yerden</h2></div><div class="h-scroll">${cont.map(x=>mediaCard(hydrate(x),x.type)).join('')}</div></section>`:''}<section class="section"><div class="section-head"><h2>Son oynatılanlar</h2></div>${rec.length?`<div class="h-scroll">${rec.map(x=>mediaCard(hydrate(x),x.type)).join('')}</div>`:'<div class="empty">Henüz oynatılan içerik yok.</div>'}</section>`;
}

const DISCOVERY={music:['live music','jazz','classical music'],video:['documentary','travel film','concert']};
async function iaSearch(type,q,rows=14){
  const mediatype=type==='music'?'audio':'movies';
  const query=`(${encodeURIComponent(q)}) AND mediatype:${mediatype}`;
  const d=await fetch(`https://archive.org/advancedsearch.php?q=${query}&fl[]=identifier,title,creator,date&sort[]=downloads%20desc&rows=${rows}&page=1&output=json`).then(r=>{if(!r.ok)throw Error();return r.json()});
  return (d.response?.docs||[]).map(x=>({id:`ia:${x.identifier}`,title:x.title||x.identifier,creator:Array.isArray(x.creator)?x.creator.join(', '):(x.creator||'Internet Archive'),identifier:x.identifier,source:'Internet Archive',thumb:`https://archive.org/services/img/${encodeURIComponent(x.identifier)}`,type,date:x.date||''}));
}
async function ensureDiscovery(type){
  if(state.discovery[type].length)return;
  const marker=type==='music'?'#musicDiscovery':'#videoFeed';if($(marker))$(marker).innerHTML='<div class="empty">İçerikler hazırlanıyor…</div>';
  try{
    const parts=await Promise.all(DISCOVERY[type].map(q=>iaSearch(type,q,type==='music'?8:7)));
    const seen=new Set(); state.discovery[type]=parts.flat().filter(x=>!seen.has(x.id)&&seen.add(x.id)).slice(0,24);
    if(state.tab===type)render();
  }catch{if($(marker))$(marker).innerHTML='<div class="empty">Keşif akışı şu anda alınamadı. Aramayı kullanabilirsin.</div>'}
}
function searchHeader(type){const label=type==='music'?'Müzik':'Video';return `<div class="section-head"><h2>${label}</h2><span class="muted">İnternet keşfi</span></div><div class="searchbar"><input id="searchInput" placeholder="${label} ara…" enterkeyhint="search"><button id="searchBtn">Ara</button></div>`}
function wireSearch(type){$('#searchBtn').onclick=()=>searchArchive(type,$('#searchInput').value);$('#searchInput').onkeydown=e=>{if(e.key==='Enter')searchArchive(type,e.target.value)};document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>searchArchive(type,c.dataset.q));}
function renderMusic(){
  const chips=['Pop','Caz','Klasik','Canlı','Podcast'], results=state.results.music, disc=state.discovery.music;
  view.innerHTML=`${searchHeader('music')}<div class="chips">${chips.map(c=>`<button class="chip" data-q="${c}">${c}</button>`).join('')}</div>${results.length?`<section class="section"><div class="section-head"><h2>Arama sonuçları</h2><button onclick="clearResults('music')">Temizle</button></div><div class="list">${results.map(x=>rowItem(x,'music')).join('')}</div></section>`:`<section class="music-feature"><div><span>GÜNÜN KEŞFİ</span><h2>Yeni bir şey dinle</h2><p>Canlı kayıtlar, caz, klasik ve açık ses arşivleri.</p></div><button onclick="randomDiscovery('music')">▶</button></section><section class="section"><div class="section-head"><h2>Senin için keşfet</h2><span class="muted">Açık içerikler</span></div><div id="musicDiscovery">${disc.length?`<div class="h-scroll wide">${disc.slice(0,10).map(x=>mediaCard(x,'music')).join('')}</div>`:'<div class="empty">İçerikler hazırlanıyor…</div>'}</div></section><section class="section"><div class="section-head"><h2>Hızlı dinle</h2></div>${disc.length?`<div class="list">${disc.slice(10,18).map(x=>rowItem(x,'music')).join('')}</div>`:'<div class="empty">Keşif akışı yükleniyor.</div>'}</section>`}`;
  wireSearch('music');
}
function videoCard(i){const id=registerUi(i,'video');return `<article class="video-card" onclick="openUi('${id}')">${art(i,'video')}<div class="video-meta"><div class="avatar">Z</div><div><strong>${esc(i.title)}</strong><small>${esc(i.creator||'Internet Archive')}</small></div><span aria-hidden="true">⋮</span></div></article>`}
function renderVideo(){
  const chips=['Tümü','Belgesel','Konser','Eğitim','Seyahat','Arşiv'], results=state.results.video, feed=state.discovery.video;
  view.innerHTML=`${searchHeader('video')}<div class="chips">${chips.map(c=>`<button class="chip" data-q="${c==='Tümü'?'documentary':c}">${c}</button>`).join('')}</div>${results.length?`<section class="section"><div class="section-head"><h2>Arama sonuçları</h2><button onclick="clearResults('video')">Temizle</button></div><div class="video-feed">${results.map(videoCard).join('')}</div></section>`:`<section class="section flush"><div class="section-head"><h2>Video akışı</h2><span class="muted">Keşfet</span></div><div id="videoFeed" class="video-feed">${feed.length?feed.map(videoCard).join(''):'<div class="empty">Video akışı hazırlanıyor…</div>'}</div></section>`}`;
  wireSearch('video');
}
function rowItem(i,t){const id=registerUi(i,t);return `<div class="row" onclick="openUi('${id}')">${art(i,t)}<div class="meta"><strong>${esc(i.title)}</strong><small>${esc(i.creator||i.source||'Internet Archive')}</small></div><button type="button" aria-label="Aç">›</button></div>`}
async function searchArchive(type,q){
  if(!q?.trim())return;
  const btn=$('#searchBtn');if(btn)btn.disabled=true;
  const old=state.results[type]; state.results[type]=[];
  view.insertAdjacentHTML('beforeend','<div id="searchWait" class="empty">Aranıyor…</div>');
  try{state.results[type]=await iaSearch(type,q.trim(),18);render();}catch{state.results[type]=old;render();alert('İnternet araması alınamadı.');}finally{if(btn)btn.disabled=false}
}
function clearResults(type){state.results[type]=[];render()}window.clearResults=clearResults;
function randomDiscovery(type){const a=state.discovery[type];if(!a.length)return;openItem(a[Math.floor(Math.random()*a.length)],type)}window.randomDiscovery=randomDiscovery;

async function resolveArchive(i,t){
  const m=await fetch(`https://archive.org/metadata/${encodeURIComponent(i.identifier)}`).then(r=>{if(!r.ok)throw Error();return r.json()}), fs=m.files||[];
  const exts=t==='music'?['.m4a','.mp3','.aac']:['.mp4','.m4v'];
  const playable=fs.filter(f=>exts.some(e=>(f.name||'').toLowerCase().endsWith(e))&&!/sample|thumb|preview|trailer/i.test(f.name||''));
  if(!playable.length)throw Error('no-file');
  const limit=t==='music'?35*1024*1024:180*1024*1024;
  const preferred=playable.filter(f=>(Number(f.size)||0)>0&&(Number(f.size)||0)<=limit);
  const pool=preferred.length?preferred:playable;
  pool.sort((a,b)=>(Number(b.size)||0)-(Number(a.size)||0));
  const f=pool[0];
  return {url:`https://archive.org/download/${encodeURIComponent(i.identifier)}/${encodeURIComponent(f.name).replace(/%2F/g,'/')}`,filename:f.name,size:Number(f.size)||0,mime:f.format||''};
}
async function openItem(i,t,preserveQueue=false){
  i=hydrate({...i,type:t});
  const requestKey=key(i);
  state.pendingItem={key:requestKey,item:slim(i),type:t};
  if(i.blob&&!i.url)i.url=fileUrl(i);
  if(i.identifier&&!i.url){
    showPlayer({...i,loading:true,pending:true});
    try{
      const r=await resolveArchive(i,t);
      if(!state.pendingItem||state.pendingItem.key!==requestKey)return;
      i={...i,...r};
    }catch{
      if(state.pendingItem?.key===requestKey){state.pendingItem=null;alert('Bu içerikte iPhone ile uyumlu oynatılabilir dosya bulunamadı.');closePlayer();}
      return;
    }
  }
  if(!state.pendingItem||state.pendingItem.key!==requestKey)return;
  state.pendingItem=null;
  if(!preserveQueue){const src=(state.results[t]?.length?state.results[t]:state.discovery[t]?.length?state.discovery[t]:[i]);const idx=src.findIndex(x=>key(x)===key(i));state.queue=src;state.queueIndex=idx>=0?idx:0;}
  play(i,t);
}
window.openItem=openItem;
function remember(i){const k=key(i);state.history=[slim(i),...state.history.filter(x=>key(x)!==k)].slice(0,80);save()}
function stopOther(type){if(type==='music'&&state.video){state.video.pause();state.video=null}if(type==='video')state.audio.pause()}
function play(i,t){stopOther(t);state.now={...i,type:t};remember(state.now);if(t==='music'){state.audio.preload=state.lowPower?'metadata':'auto';state.audio.src=i.url;state.audio.currentTime=state.positions[key(i)]||0;state.audio.play().catch(()=>{});showPlayer(state.now)}else showPlayer(state.now);bindMini();updateMediaSession()}
function next(delta=1){if(!state.queue.length)return;state.queueIndex=(state.queueIndex+delta+state.queue.length)%state.queue.length;const target=hydrate(state.queue[state.queueIndex]);openItem(target,target.type||state.now?.type||'music',true)}window.next=next;
function downloadExists(i){return state.downloads.some(x=>x.originalKey===key(i)||x.id===i.id)}
function showPlayer(i){
  const s=$('#playerSheet');s.classList.remove('hidden');const v=i.type==='video',fav=state.favorites.some(x=>key(x)===key(i)),canDl=!i.loading&&!i.local&&!i.downloaded&&!!i.identifier,actionsDisabled=i.loading?'disabled aria-disabled="true"':'';
  s.innerHTML=`<div class="player"><div class="player-top"><button class="icon-btn ghost" onclick="closePlayer()">⌄</button><strong>${v?'Video':'Müzik'} Oynatıcı</strong><button class="icon-btn ghost" ${actionsDisabled} onclick="addToPlaylistPrompt()">＋</button></div><div class="player-art ${v?'video':''}">${i.loading?'Yükleniyor…':v?`<video id="videoEl" src="${esc(i.url)}" poster="${esc(i.thumb||'')}" controls playsinline preload="${state.lowPower?'metadata':'auto'}"></video>`:i.thumb?`<img src="${esc(i.thumb)}" alt="">`:'♫'}</div><h2>${esc(i.title)}</h2><p>${esc(i.creator||i.source||'')}</p>${!v&&!i.loading?`<input id="seek" class="progress" type="range" min="0" max="100" value="0"><div class="time-row"><span id="elapsed">0:00</span><span id="duration">0:00</span></div><div class="controls"><button onclick="next(-1)">⏮</button><button id="mainPlay" class="main">❚❚</button><button onclick="next(1)">⏭</button></div>`:''}<div class="actions"><button class="action" ${actionsDisabled} onclick="toggleFav()">${fav?'♥':'♡'} Favori</button><button class="action" ${actionsDisabled} onclick="addToPlaylistPrompt()">＋ Liste</button>${canDl?`<button class="action" id="downloadAction" onclick="downloadNow()">${downloadExists(i)?'✓ İndirildi':'⇩ İndir'}</button>`:`<button class="action" onclick="shareNow()">↗ Paylaş</button>`}${i.local||i.downloaded?`<button class="action danger" onclick="deleteStored('${esc(i.id)}','${i.downloaded?'downloads':'media'}')">⌫ Sil</button>`:`<button class="action" onclick="shareNow()">↗ Paylaş</button>`}</div>${v?`<div class="up-next"><h3>Sıradaki videolar</h3>${state.queue.filter(x=>x.type==='video'&&key(x)!==key(i)).slice(0,4).map(x=>rowItem(x,'video')).join('')||'<div class="muted">Sırada içerik yok.</div>'}</div>`:''}</div>`;
  s.onclick=e=>{if(e.target===s)closePlayer()};
  if(v&&!i.loading){const el=$('#videoEl');state.video=el;el.currentTime=state.positions[key(i)]||0;el.play().catch(()=>{});el.ontimeupdate=()=>{state.positions[key(i)]=el.currentTime||0};el.onpause=()=>{save();bindMini()};el.onplay=bindMini;el.onended=()=>{state.positions[key(i)]=0;save();next(1)}}
  else if(!i.loading){const p=$('#mainPlay'),seek=$('#seek');p.onclick=()=>state.audio.paused?state.audio.play():state.audio.pause();state.audio.ontimeupdate=()=>{if(state.audio.duration){seek.value=state.audio.currentTime/state.audio.duration*100;$('#elapsed').textContent=fmt(state.audio.currentTime);$('#duration').textContent=fmt(state.audio.duration);state.positions[key(i)]=state.audio.currentTime}};seek.oninput=e=>{if(state.audio.duration)state.audio.currentTime=state.audio.duration*(e.target.value/100)}}
}
function closePlayer(){state.pendingItem=null;if(state.now?.type==='video'&&state.video){state.positions[key(state.now)]=state.video.currentTime||state.positions[key(state.now)]||0;state.video.pause();state.video.removeAttribute('src');try{state.video.load()}catch{}state.video=null;bindMini()}$('#playerSheet').classList.add('hidden');save()}window.closePlayer=closePlayer;
function fmt(s){if(!isFinite(s))return'0:00';return`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`}
function bindMini(){const m=$('#miniPlayer');if(!state.now)return;m.classList.remove('hidden');$('#miniTitle').textContent=state.now.title;$('#miniType').textContent=state.now.type==='music'?'Müzik':'Video';const paused=state.now.type==='music'?state.audio.paused:(state.video?.paused??true);$('#miniPlay').textContent=paused?'▶':'❚❚';$('#miniPlay').onclick=e=>{e.stopPropagation();if(state.now.type==='music'){state.audio.paused?state.audio.play():state.audio.pause()}else if(state.video){state.video.paused?state.video.play():state.video.pause()}else{showPlayer(state.now)}bindMini()};m.onclick=()=>showPlayer(state.now)}
state.audio.onplay=bindMini;state.audio.onpause=()=>{save();bindMini()};state.audio.onended=()=>{if(state.now){state.positions[key(state.now)]=0;save()}next(1)};
function updateMediaSession(){if(!('mediaSession'in navigator))return;try{if(!state.now){navigator.mediaSession.metadata=null;for(const a of ['play','pause','previoustrack','nexttrack'])try{navigator.mediaSession.setActionHandler(a,null)}catch{}return;}navigator.mediaSession.metadata=new MediaMetadata({title:state.now.title,artist:state.now.creator||state.now.source||'ZAZO PLAYER',artwork:state.now.thumb?[{src:state.now.thumb,sizes:'512x512'}]:[]});navigator.mediaSession.setActionHandler('play',()=>{if(state.now.type==='music')return state.audio.play();if(state.video)return state.video.play();showPlayer(hydrate(state.now));});navigator.mediaSession.setActionHandler('pause',()=>state.now.type==='music'?state.audio.pause():state.video?.pause());navigator.mediaSession.setActionHandler('previoustrack',()=>next(-1));navigator.mediaSession.setActionHandler('nexttrack',()=>next(1));}catch{}}

function toggleFav(){if(!state.now)return;const k=key(state.now),idx=state.favorites.findIndex(x=>key(x)===k);if(idx>=0)state.favorites.splice(idx,1);else state.favorites.unshift(slim(state.now));save();showPlayer(state.now)}window.toggleFav=toggleFav;
function shareNow(){if(!state.now)return;if(navigator.share)navigator.share({title:state.now.title,url:state.now.local||state.now.downloaded?location.href:(state.now.url||location.href)}).catch(()=>{});else navigator.clipboard?.writeText(state.now.url||location.href)}window.shareNow=shareNow;
function addToPlaylistPrompt(){if(!state.now)return;let name=prompt('Çalma listesi adı','Favori Liste');if(!name?.trim())return;name=name.trim();let p=state.playlists.find(x=>x.name.toLowerCase()===name.toLowerCase());if(!p){p={id:crypto.randomUUID(),name,items:[]};state.playlists.unshift(p)}if(!p.items.some(x=>key(x)===key(state.now)))p.items.push(slim(state.now));save();alert('Çalma listesine eklendi.')}window.addToPlaylistPrompt=addToPlaylistPrompt;

async function storageRoom(required){
  if(!navigator.storage?.estimate)return {ok:true,free:null};
  try{const e=await navigator.storage.estimate(),free=Math.max(0,(e.quota||0)-(e.usage||0));return {ok:!required||free>required*1.15,free}}catch{return {ok:true,free:null}}
}
function updateDownloadUi(text,percent=null){
  const btn=$('#downloadAction');if(btn){btn.disabled=true;btn.textContent=percent==null?text:`${text} %${percent}`}
  let box=$('#downloadProgress');
  if(!box&&$('#playerSheet .actions')){$('#playerSheet .actions').insertAdjacentHTML('afterend','<div id="downloadProgress" class="download-progress"><div class="download-track"><span id="downloadBar"></span></div><div class="download-meta"><span id="downloadText">Hazırlanıyor…</span><button type="button" onclick="cancelDownload()">İptal</button></div></div>');box=$('#downloadProgress')}
  if(box){const bar=$('#downloadBar'),txt=$('#downloadText');if(bar&&percent!=null)bar.style.width=`${percent}%`;if(txt)txt.textContent=percent==null?text:`${text} %${percent}`}
}
function cancelDownload(){state.downloadController?.abort()}window.cancelDownload=cancelDownload;
async function downloadNow(){
  if(state.downloadBusy||!state.now?.identifier)return;
  const target={...state.now};
  if(downloadExists(target)){alert('Bu içerik zaten İndirilenler bölümünde.');return;}
  state.downloadBusy=true;state.downloadController=new AbortController();updateDownloadUi('Hazırlanıyor…');
  try{
    let info={url:target.url,filename:target.filename,size:target.size};if(!info.url)info=await resolveArchive(target,target.type);
    const hardLimit=target.type==='video'?140*1024*1024:60*1024*1024;
    if(info.size&&info.size>hardLimit)throw new Error('too-large');
    const room=await storageRoom(info.size||0);if(!room.ok)throw new Error('no-space');
    const r=await fetch(info.url,{signal:state.downloadController.signal});if(!r.ok)throw new Error('network');
    const total=Number(r.headers.get('content-length'))||info.size||0;
    if(total&&total>hardLimit)throw new Error('too-large');
    const room2=await storageRoom(total);if(!room2.ok)throw new Error('no-space');
    let blob;
    if(r.body&&r.body.getReader){
      const reader=r.body.getReader(),chunks=[];let received=0,lastPct=-1;
      while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);received+=value.byteLength;if(received>hardLimit){state.downloadController.abort();throw new Error('too-large')}if(total){const pct=Math.min(99,Math.floor(received/total*100));if(pct!==lastPct){lastPct=pct;updateDownloadUi('İndiriliyor',pct)}}}
      blob=new Blob(chunks,{type:r.headers.get('content-type')||''});
    }else{blob=await r.blob()}
    updateDownloadUi('Kaydediliyor',100);
    const obj={...slim(target),id:`download:${crypto.randomUUID()}`,originalKey:key(target),downloaded:true,local:false,source:'İndirilenler',blob,size:blob.size,mime:blob.type||'',savedAt:Date.now()};
    await dbPut('downloads',obj);await refreshStored();render();if(state.now&&key(state.now)===key(target))showPlayer(hydrate(state.now));alert('İndirme tamamlandı. Çevrimdışı oynatabilirsin.');
  }catch(e){
    if(e?.name==='AbortError')alert('İndirme iptal edildi.');
    else if(e?.message==='too-large')alert('Bu dosya güvenli çevrimdışı indirme sınırının üzerinde. Büyük videoları çevrimiçi oynatabilirsin.');
    else if(e?.message==='no-space')alert('Cihazda/PWA depolama alanında bu indirme için yeterli boş alan yok.');
    else alert('İndirme tamamlanamadı. Bağlantıyı veya içerik kaynağını kontrol et.');
  }finally{state.downloadBusy=false;state.downloadController=null;const box=$('#downloadProgress');if(box)box.remove();const btn=$('#downloadAction');if(btn){btn.disabled=false;btn.textContent=downloadExists(target)?'✓ İndirildi':'⇩ İndir'}}
}
window.downloadNow=downloadNow;

function renderLibrary(mode='files'){
  state.uiItems.clear();state.uiSeq=0;state.libraryMode=mode;
  view.innerHTML=`<div class="section-head"><h2>Kütüphane</h2><button id="addFileBtn">＋ Dosya Ekle</button></div><div class="library-tabs four"><button class="libtab ${mode==='files'?'active':''}" data-lib="files">Dosyalarım</button><button class="libtab ${mode==='downloads'?'active':''}" data-lib="downloads">İndirilenler</button><button class="libtab ${mode==='fav'?'active':''}" data-lib="fav">Favoriler</button><button class="libtab ${mode==='lists'?'active':''}" data-lib="lists">Listeler</button></div><div id="libBody"></div>`;
  drawLibrary(mode);document.querySelectorAll('.libtab').forEach(b=>b.onclick=()=>{state.libraryMode=b.dataset.lib;drawLibrary(b.dataset.lib)});$('#addFileBtn').onclick=()=>$('#fileInput').click();
}
function drawLibrary(mode){
  document.querySelectorAll('.libtab').forEach(b=>b.classList.toggle('active',b.dataset.lib===mode));const b=$('#libBody');
  if(mode==='files')b.innerHTML=state.localMedia.length?`<div class="list">${state.localMedia.map(x=>rowItem(x,x.type)).join('')}</div>`:'<div class="empty">Kendi MP3 veya videonu ekleyebilirsin.</div>';
  if(mode==='downloads')b.innerHTML=state.downloads.length?`<div class="list">${state.downloads.map(x=>rowItem(x,x.type)).join('')}</div>`:'<div class="empty">Çevrimdışı içerik yok. İnternette bir içerik açıp “İndir”e bas.</div>';
  if(mode==='fav')b.innerHTML=state.favorites.length?`<div class="list">${state.favorites.map(x=>rowItem(hydrate(x),x.type)).join('')}</div>`:'<div class="empty">Favori içerik yok.</div>';
  if(mode==='lists')b.innerHTML=state.playlists.length?state.playlists.map(p=>`<section class="playlist-card"><div><strong>${esc(p.name)}</strong><small>${p.items.length} içerik</small></div><button onclick="playPlaylist('${p.id}')">▶</button></section>`).join(''):'<div class="empty">Henüz çalma listen yok.</div>';
}
function openLibrary(mode){state.tab='library';tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab==='library'));renderLibrary(mode);scrollTo({top:0,behavior:'auto'})}window.openLibrary=openLibrary;
function playPlaylist(id){const p=state.playlists.find(x=>x.id===id);if(!p?.items.length)return;state.queue=p.items.map(hydrate);state.queueIndex=0;openItem(state.queue[0],state.queue[0].type,true)}window.playPlaylist=playPlaylist;
$('#fileInput').onchange=async e=>{for(const f of [...e.target.files]){const type=f.type.startsWith('video')?'video':'music',id=`local:${crypto.randomUUID()}`,obj={id,title:f.name.replace(/\.[^.]+$/,''),creator:'Dosyalarım',source:'Telefon',type,local:true,mime:f.type,size:f.size,blob:f};await dbPut('media',obj)}await refreshStored();e.target.value='';openLibrary('files')};
function hideMini(){const m=$('#miniPlayer');if(m)m.classList.add('hidden');$('#miniTitle').textContent='—';$('#miniType').textContent='—'}
function stopStoredIfCurrent(old){
  if(!old||!state.now)return false;
  const sameId=state.now.id===old.id;
  if(!sameId)return false;
  state.pendingItem=null;
  if(state.now.type==='music'){state.audio.pause();state.audio.removeAttribute('src');try{state.audio.load()}catch{}}
  if(state.video){state.video.pause();state.video.removeAttribute('src');try{state.video.load()}catch{}state.video=null}
  state.now=null;hideMini();$('#playerSheet').classList.add('hidden');
  return true;
}
async function deleteStored(id,store){
  if(!confirm('Bu içerik ZAZO PLAYER’dan silinsin mi?'))return;
  const arr=store==='downloads'?state.downloads:state.localMedia,old=arr.find(x=>x.id===id);if(!old)return;
  const oldUrl=old.url,canonical=key(old),wasCurrent=stopStoredIfCurrent(old);
  await dbDel(store,id);
  if(store==='media'){state.favorites=state.favorites.filter(x=>x.id!==id);state.history=state.history.filter(x=>x.id!==id);state.playlists.forEach(p=>p.items=p.items.filter(x=>x.id!==id));}
  else{state.history=state.history.filter(x=>x.id!==id);}
  state.queue=state.queue.filter(x=>x.id!==id);if(state.queueIndex>=state.queue.length)state.queueIndex=Math.max(0,state.queue.length-1);
  delete state.positions[canonical];delete state.positions[id];
  if(oldUrl?.startsWith('blob:')){try{URL.revokeObjectURL(oldUrl)}catch{}}
  save();await refreshStored();render();if(wasCurrent)updateMediaSession();
}window.deleteStored=deleteStored;

function renderSettings(){
  const total=[...state.localMedia,...state.downloads].reduce((a,x)=>a+(x.size||0),0);
  view.innerHTML=`<div class="section-head"><h2>Ayarlar</h2></div><div class="setting"><div><strong>Düşük Güç Modu</strong><div class="muted">Animasyon ve görsel yük azaltılır</div></div><button id="lpSwitch" class="switch ${state.lowPower?'on':''}"></button></div><div class="setting"><div><strong>Çevrimdışı depolama</strong><div class="muted">${state.downloads.length} indirme · ${formatBytes(total)}</div></div><span>✓</span></div><div class="setting"><div><strong>Kaldığın yerden devam</strong><div class="muted">Müzik ve video konumu otomatik kaydedilir</div></div><span>✓</span></div><div class="setting"><div><strong>Kilit ekranı kontrolleri</strong><div class="muted">Desteklenen tarayıcılarda Media Session</div></div><span>✓</span></div><div class="setting"><div><strong>İnternet kaynağı</strong><div class="muted">Internet Archive · izinli/açık içerikler</div></div><span>›</span></div><div class="setting"><div><strong>Sürüm</strong><div class="muted">ZAZO PLAYER V1.2.3</div></div><span>1.2.3</span></div>`;
  $('#lpSwitch').onclick=()=>$('#powerBtn').click();
}
function formatBytes(n){if(!n)return'0 MB';if(n<1024*1024)return`${Math.round(n/1024)} KB`;return`${(n/1024/1024).toFixed(n>100*1024*1024?0:1)} MB`}
function render(){state.uiItems.clear();state.uiSeq=0;if(state.tab==='home')renderHome();else if(state.tab==='music')renderMusic();else if(state.tab==='video')renderVideo();else if(state.tab==='library')renderLibrary(state.libraryMode||'files');else renderSettings()}

(async()=>{await refreshStored();render();if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});if(navigator.storage?.persist)navigator.storage.persist().catch(()=>{});})();
window.addEventListener('pagehide',save);window.addEventListener('beforeunload',()=>{for(const x of [...state.localMedia,...state.downloads])if(x?.url?.startsWith('blob:'))URL.revokeObjectURL(x.url)});document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
