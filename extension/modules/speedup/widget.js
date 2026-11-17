(() => {
  'use strict';
  if (globalThis.__psychupSpeedupWidget) return;
  globalThis.__psychupSpeedupWidget = true;
  const host = document.createElement('div'); host.id = 'psychup-speedup-widget';
  const shadow = host.attachShadow({mode:'open'});
  // Static markup only: no page text is interpreted as HTML or as a command.
  shadow.innerHTML = `<style>
    :host{all:initial;position:fixed;right:20px;bottom:94px;z-index:2147483646;font:14px system-ui;color:#ecfff5;max-width:calc(100vw - 24px)}
    :host([hidden]){display:none!important}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer;color:inherit;border:1px solid #57846a;background:#173d30;border-radius:10px;padding:9px 12px}button:hover{background:#296144}button:focus-visible,input:focus-visible{outline:3px solid #edcf86;outline-offset:3px}
    section{width:270px;max-width:calc(100vw - 24px);padding:14px;background:#0c211eef;border:1px solid #599878;border-radius:16px;box-shadow:0 8px 32px #0008;margin-bottom:8px}section[hidden]{display:none}:host(:hover) section[hidden]{display:block}header{display:flex;align-items:center;justify-content:space-between;font-weight:700}output{font-size:28px;color:#a4f2bf}input{width:100%;accent-color:#91e5b2;margin:16px 0}.row{display:flex;justify-content:space-between;gap:6px}.hint{font-size:11px;color:#b7cdc3;margin:8px 0 0;line-height:1.4}#toggle{display:block;margin-left:auto}#state{min-height:16px}
    :host{right:auto;bottom:auto;opacity:.22;transition:opacity .18s} :host(:hover),:host(:focus-within){opacity:1}
    #dismiss{position:absolute;left:-24px;top:calc(50% - 10px);width:20px;height:20px;padding:0;border:0;border-radius:50%;font-size:15px}
    section{width:270px;background:linear-gradient(145deg,#0d1828f5,#102b2bf5);border-color:#67d9c277;box-shadow:0 12px 40px #0009;backdrop-filter:blur(14px)}
    #dial-wrap{position:relative;width:218px;height:218px;margin:4px auto 0}
    #dial{position:absolute;left:43px;top:43px;width:132px;height:132px;border-radius:50%;cursor:ns-resize;touch-action:none;background:radial-gradient(circle,#152934 49%,transparent 51%),repeating-conic-gradient(from -135deg,#8cf1da 0deg 2deg,transparent 2deg 18deg),#0a1420;border:5px solid #294756;box-shadow:inset 0 0 18px #000,0 0 18px #65dccc22;outline-offset:4px}
    #dial:focus-visible{outline:3px solid #edcf86}#needle{position:absolute;left:calc(50% - 2px);bottom:50%;width:4px;height:46px;background:#ffce80;border-radius:3px;transform-origin:50% 100%;pointer-events:none;box-shadow:0 0 8px #ffc878}
    #dial:after{content:'';position:absolute;left:calc(50% - 9px);top:calc(50% - 9px);width:18px;height:18px;border-radius:50%;background:#b0f8e3;border:4px solid #244c51}
    #presets{position:absolute;inset:0;margin:0;list-style:none;padding:0}
    #presets button{position:absolute;width:43px;height:29px;padding:3px 2px;border-radius:9px;font-size:11px;font-variant-numeric:tabular-nums;background:#102d2cdd;border-color:#5faaa0;transform:translate(-50%,-50%)}
    #presets button:hover,#presets button[aria-pressed=true]{background:#b1f1c8;color:#10261b;border-color:#edcf86;box-shadow:0 0 12px #8cf1da66}
    #toggle{border-radius:24px;background:#10202de8;padding:7px 12px;font-variant-numeric:tabular-nums;border-color:#80dcc58a}output{font-size:24px}.row button{padding:8px}input{margin:10px 0}
    @media(prefers-reduced-motion:reduce){:host{transition:none}}
    :host{width:max-content}#toggle{cursor:grab;touch-action:none;user-select:none} :host([moving]) #toggle{cursor:grabbing}
    section{position:absolute;right:var(--panel-right,0px);top:calc(100% + 8px);margin:0;max-height:calc(100vh - 64px);overflow:auto}
    :host([panel-above]) section{top:auto;bottom:calc(100% + 8px)}
    :host([moving]) section{display:none!important}
    #presets button{width:59px;height:42px;border-radius:70% 35% 70% 35%;background:var(--petal);color:#102132;border:2px solid #ffffff70;font-weight:750;box-shadow:inset 0 2px 8px #ffffff60,0 4px 12px #0005}
    #presets button:hover,#presets button[aria-pressed=true]{background:var(--petal);color:#081722;border-color:#fff;box-shadow:0 0 0 3px #ffffff45,0 0 16px var(--petal)}
    #dial{left:77px;top:77px;width:64px;height:64px;opacity:0;pointer-events:none}
    #presets button[data-rate="1"]{width:65px;height:65px;border-radius:50%;z-index:2;background:radial-gradient(circle at 35% 25%,#fff4b8,#efb642);font-size:21px}
    #reset{display:none}#train{position:relative;padding:5px 0 12px}#slider{appearance:none;background:transparent;height:30px;margin:0;cursor:pointer;position:relative;z-index:1}
    #slider::-webkit-slider-runnable-track{height:9px;border-top:2px solid #abc9d4;border-bottom:2px solid #abc9d4;background:repeating-linear-gradient(90deg,transparent 0 10px,#62818c 10px 14px);border-radius:3px}
    #slider::-webkit-slider-thumb{appearance:none;width:36px;height:29px;margin-top:-13px;background:#8de6cf;border:2px solid #e6fff7;border-radius:10px 13px 5px 5px;box-shadow:inset 0 -7px #203d52,0 3px 7px #0008;background-image:linear-gradient(90deg,transparent 6px,#244b60 6px 13px,transparent 13px 18px,#244b60 18px 25px,transparent 25px);background-size:100% 11px;background-repeat:no-repeat;background-position:0 4px}
    section[hidden],:host(:hover) section[hidden]{display:none!important}
    #panel:not([hidden]){animation:flower-panel .3s ease-out both;transform-origin:top right}
    :host([panel-above]) #panel{transform-origin:bottom right}
    #panel:not([hidden]) #presets button{animation:flower-petal .48s cubic-bezier(.2,.8,.25,1.15) both;animation-delay:var(--bloom-delay,0ms)}
    @keyframes flower-panel{from{opacity:0;transform:scale(.88) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes flower-petal{from{opacity:0;translate:var(--bloom-x,0px) var(--bloom-y,0px);scale:.2;rotate:-25deg}to{opacity:1;translate:0 0;scale:1;rotate:0deg}}
    @media(prefers-reduced-motion:reduce){#panel:not([hidden]),#panel:not([hidden]) #presets button{animation:none}}
    #toggle{width:54px;height:54px;padding:4px;border:3px solid transparent;border-radius:50%;background:linear-gradient(#10202d,#10202d) padding-box,conic-gradient(#ff718d,#ffce70,#b7ec7d,#63e6ce,#7bbcff,#c28aff,#ff718d) border-box;font-size:11px;box-shadow:0 0 14px #bc8aff55}
    #presets button{width:56px;height:56px;border-radius:50%;background:color-mix(in srgb,var(--petal) 28%,#132333);color:#fff;border:2px solid var(--petal)}
    #presets:before{content:'';position:absolute;inset:34px;border-radius:50%;border:1px solid #c1eaff44;box-shadow:0 0 18px #a6dfff22}
    #panel:not([hidden]) #presets{animation:spiral-orbit .85s cubic-bezier(.2,.7,.2,1) both}
    @keyframes spiral-orbit{from{transform:rotate(-180deg) scale(.15);opacity:0}to{transform:rotate(0) scale(1);opacity:1}}
    @media(prefers-reduced-motion:reduce){#panel:not([hidden]) #presets{animation:none}}
    #toggle{position:relative;z-index:3;width:32px;height:32px;font-size:9px;border-width:2px;transition:scale .22s ease;scale:1}
    #toggle[aria-expanded=true]{box-shadow:0 0 0 6px #b990ff66,0 0 22px #93dfff88;font-size:10px}
    #panel,#panel:not([hidden]),:host([panel-above]) #panel{width:218px;height:260px;max-height:none;max-width:none;left:var(--flower-left,-93px);top:var(--flower-top,-93px);right:auto;bottom:auto;padding:0;margin:0;border:0;background:transparent;box-shadow:none;backdrop-filter:none;overflow:visible;animation:none;pointer-events:none}
    #panel header,#panel>label,#panel>.hint,#panel>.row{display:none}
    #dial-wrap{margin:0;pointer-events:none}#presets:before{display:none}
    #presets button{width:43px;height:43px;font-size:11px;background:color-mix(in srgb,var(--petal) 15%,transparent);border-color:var(--petal);backdrop-filter:blur(5px);text-shadow:0 1px 3px #000;pointer-events:auto}
    #presets button[data-rate="1"]{width:42px;height:42px;font-size:13px}
    #train{width:146px;margin:0 auto;padding:0;pointer-events:auto}
    #slider{height:26px}#slider::-webkit-slider-thumb{width:25px;height:22px;margin-top:-9px;background-size:100% 8px;border-width:1px}
    @media(prefers-reduced-motion:reduce){#toggle{transition:none}}
    #toggle,#toggle[aria-expanded=true]{background:radial-gradient(circle at 35% 28%,#ffe9a84d,#edb83c22);border:1px solid #ffe497b0;color:#fff0b9;box-shadow:0 0 12px #ffc94c44;transition:box-shadow .3s;font-size:12px}
    #toggle[aria-expanded=true]{box-shadow:0 0 0 4px #ffcf5133,0 0 20px #ffc94c55}
    #presets button[data-rate="1"]{display:none}
    #panel[hidden],:host(:hover) #panel[hidden]{display:block!important}
    #panel,#panel:not([hidden]),:host([panel-above]) #panel{left:-93px;top:-93px}
    #panel #presets,#panel:not([hidden]) #presets{animation:none;transform:rotate(var(--orbit-turn,0deg)) scale(var(--orbit-scale,.38));transition:transform .85s cubic-bezier(.25,.7,.3,1)}
    #panel #presets button,#panel:not([hidden]) #presets button{animation:none;translate:0 0;scale:1;rotate:calc(-1 * var(--orbit-turn,0deg));transition:rotate .85s cubic-bezier(.25,.7,.3,1)}
    #panel[hidden] #presets button{font-size:0;pointer-events:none}
    #panel[hidden] #train{opacity:0;pointer-events:none}#train{transition:opacity .3s;width:118px;margin-top:-35px}
    #dismiss{left:33px;top:-15px;width:19px;height:19px;opacity:0;pointer-events:none;background:radial-gradient(circle at 70% 30%,transparent 30%,#dbe5ff80 34%,#8492bb55 70%);border:1px solid #d6e4ff80;font-size:11px;transition:opacity .2s}
    :host(:hover) #dismiss,:host(:focus-within) #dismiss{opacity:1;pointer-events:auto}
    #dial-wrap{animation:planet-drift 80s linear infinite;animation-play-state:paused}#panel[hidden] #dial-wrap{animation-play-state:running}
    @keyframes planet-drift{to{transform:rotate(360deg)}}
    :host([hidden]) #dial-wrap{animation-play-state:paused}
    @media(prefers-reduced-motion:reduce){#panel #presets,#panel #presets button,#train,#toggle{transition:none}#panel[hidden] #dial-wrap{animation:none}}
    #presets button{transform:none;margin-left:-21.5px;margin-top:-21.5px}
    </style><section id="panel" hidden><header><span>Speedup</span><output id="rate">1.00×</output></header>
    <div id="dial-wrap" aria-label="Socles de vitesse"><div id="presets"></div><div id="dial" role="slider" tabindex="0" aria-label="Petit potard de vitesse : glisser vers le haut ou le bas" aria-valuemin="0.07" aria-valuemax="5" aria-valuenow="1"><div id="needle"></div></div></div>
    <label for="slider" class="hint">Le train du rythme · glisser pour affiner</label><div id="train"><input id="slider" aria-label="Train de vitesse de la vidéo" type="range" min="0.07" max="5" step="0.01" value="1"></div>
    <div class="row"><button id="reset">1× · arrêter</button></div>
    <p class="hint">0,07–5× · le son peut se couper aux extrêmes.</p><p id="state" class="hint" role="status" aria-live="polite"></p></section>
    <button id="dismiss" aria-label="Masquer Speedup" title="Masquer jusqu’au rechargement de la page">×</button>
    <button id="toggle" aria-expanded="true" aria-controls="panel">⚡ Speedup Psychup</button>`;
  const $ = id => shadow.getElementById(id);
  const presetRates = [.5,1,1.25,1.5,2,2.5,3,4,5];
  const colors = ['#a5dcff','#ffe08b','#c9b4ff','#f4b2db','#ffb49e','#ffd292','#c9e99b','#94e3c8','#9ec5ff'];
  presetRates.forEach((rate,index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.rate = rate; button.textContent = rate + '×';
    const petalIndex = index > 1 ? index - 1 : index;
    const angle = (-90 + petalIndex * 45) * Math.PI / 180;
    const radius = rate === 1 ? 0 : 44;
    button.style.left = (109 + Math.cos(angle) * radius) + 'px';
    button.style.top = (109 + Math.sin(angle) * radius) + 'px';
    button.style.setProperty('--petal', colors[index]);
    button.style.setProperty('--bloom-x', (-Math.cos(angle) * radius) + 'px');
    button.style.setProperty('--bloom-y', (-Math.sin(angle) * radius) + 'px');
    button.style.setProperty('--bloom-delay', (rate === 1 ? 0 : 35 * petalIndex) + 'ms');
    button.setAttribute('aria-label', 'Régler à ' + rate + ' fois');
    button.setAttribute('aria-pressed', 'false');
    $('presets').append(button);
  });
  let dismissed = false;
  $('dismiss').onclick = () => { dismissed = true; host.hidden = true; };
  $('toggle').title = 'Glisser pour déplacer · clic pour régler · Alt + flèches pour déplacer au clavier';
  const positionKey = 'psychup.speedup.widget.position.v1';
  let position = null, move = null, suppressClick = false, positionTouched = false;
  function place(x,y) {
    const rect = $('toggle').getBoundingClientRect();
    x = Math.max(75,Math.min(Math.max(75,innerWidth-95),x));
    y = Math.max(75,Math.min(Math.max(75,innerHeight-145),y));
    host.style.left = x+'px'; host.style.top = y+'px';
    host.style.setProperty('--flower-left', Math.max(8-x,Math.min(-93,innerWidth-x-226))+'px');
    host.style.setProperty('--flower-top', Math.max(8-y,Math.min(-93,innerHeight-y-268))+'px');
    host.style.setProperty('--panel-right', Math.min(0,x+rect.width-Math.min(270,innerWidth-24)-8)+'px');
    host.toggleAttribute('panel-above', y > innerHeight/2);
    return {x,y};
  }
  function rememberPosition() { chrome.storage.local.set({[positionKey]:position}).catch(()=>{}); }
  chrome.storage.local.get(positionKey).then(data=>{
    const p=data[positionKey];
    if(!positionTouched && Number.isFinite(p?.x) && Number.isFinite(p?.y)) {position={x:p.x,y:p.y};refresh();}
  }).catch(()=>{});
  $('toggle').onpointerdown = e => {
    if(e.button!==0) return;
    suppressClick=false;
    const rect=$('toggle').getBoundingClientRect();
    move={id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,moved:false};
    $('toggle').setPointerCapture(e.pointerId);
  };
  $('toggle').onpointermove = e => {
    if(!move || e.pointerId!==move.id) return;
    const dx=e.clientX-move.x,dy=e.clientY-move.y;
    if(!move.moved && Math.hypot(dx,dy)<5) return;
    move.moved=true;positionTouched=true;suppressClick=true;host.setAttribute('moving','');
    position=place(move.left+dx,move.top+dy);
  };
  const finishMove = () => {if(!move)return;const changed=move.moved;move=null;host.removeAttribute('moving');if(changed)rememberPosition();};
  $('toggle').onpointerup = $('toggle').onpointercancel = $('toggle').onlostpointercapture = finishMove;
  $('toggle').onkeydown = e => {
    const delta={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]}[e.key];
    if(!e.altKey || !delta)return;
    e.preventDefault();const rect=$('toggle').getBoundingClientRect();positionTouched=true;
    position=place(rect.left+delta[0],rect.top+delta[1]);rememberPosition();
  };
  let dialStart;
  $('dial').onpointerdown = e => { if(e.button !== 0) return; e.preventDefault(); dragging = true; dialStart = {y:e.clientY,rate:Number($('slider').value)}; $('dial').setPointerCapture(e.pointerId); };
  $('dial').onpointermove = e => { if (!dialStart) return; apply(Math.max(.07, Math.min(5, Math.round((dialStart.rate + (dialStart.y-e.clientY)/60)*100)/100))); };
  $('dial').onpointerup = $('dial').onpointercancel = $('dial').onlostpointercapture = () => {dialStart = null; dragging = false;};
  $('dial').onkeydown = e => {
    const delta = {ArrowUp:.05,ArrowRight:.05,ArrowDown:-.05,ArrowLeft:-.05,PageUp:.25,PageDown:-.25}[e.key];
    if(delta === undefined && !['Home','End'].includes(e.key)) return;
    e.preventDefault(); apply(e.key === 'Home' ? .07 : e.key === 'End' ? 5 : Math.max(.07,Math.min(5,Math.round((Number($('slider').value)+delta)*100)/100)));
  };
  let url = location.href, dragging = false, saving = Promise.resolve();
  function paint(rate) {
    $('slider').value = rate; $('rate').textContent = rate.toFixed(2) + '×';
    $('toggle').textContent = '1×';
    $('toggle').title = 'Soleil : revenir à 1× · vitesse actuelle ' + rate.toFixed(2) + '× · glisser pour déplacer';
    $('toggle').setAttribute('aria-label', 'Speedup : ' + rate.toFixed(2) + ' fois · ouvrir les cercles');
    $('dial').setAttribute('aria-valuenow', String(rate));
    $('dial').setAttribute('aria-valuetext', rate.toFixed(2) + ' fois la vitesse normale');
    $('needle').style.transform = `rotate(${-135 + (rate - .07) / 4.93 * 270}deg)`;
    for (const button of $('presets').children) button.setAttribute('aria-pressed', String(Number(button.dataset.rate) === rate));
  }
  function apply(rate, stop = false) {
    try {
      const result = globalThis.psychupControlMedia(stop ? 'stop' : 'apply', rate, location.href);
      paint(rate);
      $('state').textContent = result.errors ? 'Vitesse refusée par le lecteur.' : result.count ? (stop ? 'Vitesse normale · maintien arrêté.' : 'Vitesse appliquée à la page.') : 'Aucune vidéo détectée.';
      if (result.count && !result.errors) saving = saving.catch(()=>{}).then(()=>chrome.storage.local.set({'psychup.speedup.v1':{rate}})).catch(()=>{ $('state').textContent = 'Vitesse appliquée, préférence non enregistrée.'; });
    } catch(e) { $('state').textContent = 'Réglage impossible : ' + e.message; }
  }
  $('slider').oninput = () => apply(Number($('slider').value));
  $('slider').onpointerdown = () => { dragging = true; };
  window.addEventListener('pointerup', () => { dragging = false; });
  window.addEventListener('pointercancel', () => { dragging = false; });
  for (const b of shadow.querySelectorAll('[data-rate]')) b.onclick = () => apply(Number(b.dataset.rate), Number(b.dataset.rate) === 1);
  $('reset').onclick = () => apply(1, true);
  let orbitTurn = 0;
  function openOrbit(open) {
    if(open === !$('panel').hidden) return;
    orbitTurn += 180;
    $('panel').style.setProperty('--orbit-turn', orbitTurn+'deg');
    $('panel').style.setProperty('--orbit-scale', open ? '1' : '.38');
    $('panel').hidden = !open;
    $('toggle').setAttribute('aria-expanded', String(open));
  }
  $('toggle').onclick = e => { if(suppressClick && e.detail!==0){suppressClick=false;return;} suppressClick=false;apply(1,true);openOrbit($('panel').hidden); };
  // Always start tucked away; only an explicit click opens the flower.
  $('toggle').setAttribute('aria-expanded', 'false');
  let closeTimer;
  host.addEventListener('pointerenter', e => {
    clearTimeout(closeTimer);
    if(e.pointerType === 'touch' || move) return;
    openOrbit(true);
  });
  host.addEventListener('pointerleave', () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if(dragging || move) return;
      openOrbit(false);
    },450);
  });
  function refresh() {
    if (url !== location.href) {
      // Stop the old document-scoped choice on YouTube's same-document navigation.
      if (globalThis.__psychupSpeedupV1) globalThis.psychupControlMedia('stop', 1, location.href);
      url = location.href; $('state').textContent = ''; dragging = false;
    }
    const video = document.querySelector('#movie_player video') || document.querySelector('video');
    host.hidden = dismissed || !video || Boolean(document.fullscreenElement);
    const parent = document.body;
    if (parent && host.parentNode !== parent) parent.append(host);
    if(video && !host.hidden && !move) {
      const rect = video.getBoundingClientRect();
      place(position?.x ?? rect.right - $('toggle').getBoundingClientRect().width - 14,position?.y ?? rect.top + 14);
    }
    const control = globalThis.__psychupSpeedupV1;
    if (video && !dragging) paint(control ? control.rate : video.playbackRate);
    if (video && control) {
      $('state').textContent = control.conflicts ? 'Conflit : le lecteur ou une autre extension réimpose sa vitesse. Désactive les autres contrôleurs.' : control.errors ? 'Vitesse refusée par le lecteur.' : Math.abs(video.playbackRate - control.rate) > 0.001 ? 'Demandée : ' + control.rate.toFixed(2) + '× · observée : ' + video.playbackRate.toFixed(2) + '×' : 'Vitesse maintenue : ' + control.rate.toFixed(2) + '×';
    }
  }
  document.addEventListener('yt-navigate-finish',refresh);
  document.addEventListener('fullscreenchange',refresh);
  window.addEventListener('scroll',refresh,{passive:true});
  window.addEventListener('resize',refresh,{passive:true});
  setInterval(refresh,500); refresh();
})();

