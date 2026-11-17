import { controlMedia } from './controller.js';
const $ = id => document.getElementById(id), key = 'psychup.speedup.v1';
const tabId = Number(new URLSearchParams(location.search).get('sourceTab'));
let source, live = false, timer, queue = Promise.resolve(), generation = 0;
const status = text => { $('status').textContent = text; };
const autoId = 'psychup-speedup-videos';
$('auto').onclick = async () => {
  try {
    if (!await chrome.permissions.request({origins:['https://*/*','http://*/*']})) return status('Autorisation refusée : affichage universel désactivé.');
    const script = {id:autoId,matches:['https://*/*','http://*/*'],excludeMatches:['https://www.youtube.com/*','https://*.crunchyroll.com/*'],js:['modules/speedup/engine.js','modules/speedup/widget.js'],allFrames:true,runAt:'document_idle',persistAcrossSessions:true};
    const registered = await chrome.scripting.getRegisteredContentScripts({ids:[autoId]});
    if(registered.length) await chrome.scripting.updateContentScripts([script]);
    else await chrome.scripting.registerContentScripts([script]);
    status('Potard automatique activé. Actualise les pages vidéo déjà ouvertes. Aucune vitesse imposée avant ton réglage.');
  } catch(e) {status('Activation impossible : '+e.message);}
};
$('auto-off').onclick = async () => {
  try { await chrome.scripting.unregisterContentScripts({ids:[autoId]}); status('Affichage universel désactivé. Actualise les pages ouvertes. YouTube et Crunchyroll restent intégrés.'); }
  catch(e) {status('Désactivation impossible : '+e.message);}
};
function display(rate) {
  $('speed').value = rate; $('value').textContent = rate.toFixed(2) + '×';
  for (const b of $('presets').children) b.setAttribute('aria-pressed', Number(b.dataset.rate) === rate);
}
async function execute(command, rate) {
  if (!source) throw Error('Ouvre Psychup depuis la page à régler.');
  const current = await chrome.tabs.get(tabId);
  if (current.url !== source.url) { live = false; throw Error('La source a changé. Rouvre Psychup depuis cette page.'); }
  const [result] = await chrome.scripting.executeScript({target: {tabId}, func: controlMedia, args: [command, rate, source.url]});
  if (!result?.result) throw Error('Aucun résultat du lecteur.');
  const value = result.result; live = value.active;
  if(value.conflicts) throw Error('Un autre contrôleur réimpose sa vitesse. Désactive les autres extensions de vitesse.');
  if(value.errors) throw Error('Le lecteur refuse cette vitesse. Essaie une valeur plus proche de 1×.');
  status(value.count ? `${value.count} média(s) · vitesse(s) observée(s) : ${[...new Set(value.rates)].map(n => n.toFixed(2) + '×').join(', ')} · maintien ${live ? 'actif' : 'arrêté'}.` : 'Aucun média détecté dans la page principale.' + (live ? ' Le réglage attend un média sur cette page.' : ''));
}
function enqueue(command, rate) {
  const ticket = command === 'inspect' ? generation : ++generation;
  queue = queue.catch(() => {}).then(async () => {
    if (command === 'apply' && ticket !== generation) return;
    await execute(command, rate);
    if (command !== 'inspect') await chrome.storage.local.set({[key]: {rate: command === 'stop' ? 1 : rate}});
  }).catch(e => { live = false; status(e.message + ' Si l’accès manque, clique sur Appliquer pour autoriser ce site.'); });
  return queue;
}
function choose(rate) {
  display(rate);
  enqueue('apply', rate);
}
for (const rate of [.75,.9,1,1.1,1.25,1.5,1.75,2,2.25,2.5,2.75,3]) {
  const b = document.createElement('button'); b.textContent = rate.toFixed(2) + '×'; b.dataset.rate = rate; b.onclick = () => choose(rate); $('presets').append(b);
}
$('speed').oninput = () => choose(Number($('speed').value));
$('apply').onclick = async () => {
  if (!source) return status('Ouvre Psychup depuis une page web.');
  clearTimeout(timer); $('apply').disabled = true;
  try {
    if (!await chrome.permissions.request({origins: [new URL(source.url).origin + '/*']})) throw Error('Autorisation refusée : aucun changement.');
    await enqueue('apply', Number($('speed').value));
  } catch(e) { status(e.message); } finally { $('apply').disabled = false; }
};
$('stop').onclick = () => { clearTimeout(timer); display(1); enqueue('stop', 1); };
$('inspect').onclick = () => enqueue('inspect', null);
(async () => {
  const saved = (await chrome.storage.local.get(key))[key]?.rate;
  display(Number.isFinite(saved) && saved >= .07 && saved <= 5 ? saved : 1);
  if (!Number.isInteger(tabId) || tabId <= 0) throw Error('Ouvre Psychup depuis la page vidéo ou audio à régler.');
  source = await chrome.tabs.get(tabId);
  if (!/^https?:\/\//.test(source.url || '')) { source = null; throw Error('Page non accessible. Ouvre Psychup avec son bouton Chrome depuis la page web.'); }
  $('source').textContent = `${source.title || 'Page source'} · onglet ${tabId} · fenêtre ${source.windowId} · ${source.url}`;
  await enqueue('inspect', null);
})().catch(e => { $('source').textContent = 'Source indisponible'; status(e.message); });
