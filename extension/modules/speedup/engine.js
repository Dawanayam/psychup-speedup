// Independent implementation. Shared by the floating widget and Workspace.
globalThis.psychupControlMedia = function controlMedia(command, rate, expectedUrl) {
  if (location.href !== expectedUrl) throw Error('La page source a changé. Rouvre Psychup depuis cette page.');
  if (!['inspect', 'apply', 'stop'].includes(command)) throw Error('Commande invalide.');
  if (command === 'apply' && (!Number.isFinite(rate) || rate < 0.07 || rate > 5)) throw Error('Vitesse invalide.');
  const key = '__psychupSpeedupV1';
  const media = () => [...document.querySelectorAll('video,audio')];
  let state = globalThis[key];
  if (command !== 'inspect') {
    if (state?.dispose) state.dispose();
    else if (state) clearInterval(state.timer);
    delete globalThis[key];
    if (command === 'stop') {
      for (const element of media()) { element.defaultPlaybackRate = 1; element.playbackRate = 1; }
    } else {
      state = { rate, timer: null, pending: null, errors: 0, conflicts: false, corrections: 0, windowStart: Date.now() };
      const dispose = () => {
        clearInterval(state.timer); clearTimeout(state.pending);
        document.removeEventListener('ratechange', onMediaChange, true);
        document.removeEventListener('loadedmetadata', onMediaChange, true);
      };
      const apply = () => {
        state.pending = null;
        if (globalThis[key] !== state) return;
        if (location.href !== expectedUrl) {
          dispose(); delete globalThis[key];
          for (const element of media()) { try { element.defaultPlaybackRate = 1; element.playbackRate = 1; } catch {} }
          return;
        }
        const now = Date.now();
        if (now - state.windowStart >= 1000) { state.windowStart = now; state.corrections = 0; state.conflicts = false; }
        const elements = media();
        if (!elements.some(e => e.playbackRate !== rate || e.defaultPlaybackRate !== rate)) return;
        // Bound contention with a player or another extension; never spin indefinitely.
        if (state.corrections >= 8) { state.conflicts = true; return; }
        state.corrections++; state.errors = 0;
        for (const element of elements) {
          try {
            if (element.defaultPlaybackRate !== rate) element.defaultPlaybackRate = rate;
            if (element.playbackRate !== rate) element.playbackRate = rate;
          } catch { state.errors++; }
        }
      };
      function onMediaChange(event) {
        if (!['VIDEO','AUDIO'].includes(event.target?.tagName) || state.pending !== null) return;
        state.pending = setTimeout(apply, 0);
      }
      state.dispose = dispose; globalThis[key] = state;
      document.addEventListener('ratechange', onMediaChange, true);
      document.addEventListener('loadedmetadata', onMediaChange, true);
      apply(); state.timer = setInterval(apply, 1000);
    }
  }
  const current = globalThis[key];
  return { count: media().length, rates: media().map(e => e.playbackRate), errors: current?.errors || 0, conflicts: Boolean(current?.conflicts), requestedRate: current?.rate ?? null, active: Boolean(current) };
};
