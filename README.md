# Psychup Speedup ☀️

Standalone open-source browser extension from **Psychup**, by Dawanayam.
Solar speed control: translucent sun, orbiting presets, compact train slider.
No account, server or paid service required. UI currently in French.

## Installer / Install (Windows & Linux)

1. Download `psychup-speedup-0.1.0.zip` from [Releases](https://github.com/Dawanayam/psychup-speedup/releases) and extract it into a permanent folder.
2. Open `chrome://extensions`, enable **Developer mode / Mode développeur**.
3. Click **Load unpacked / Charger l’extension non empaquetée**, select the extracted folder containing `manifest.json`.
4. Reload your video tab. YouTube and Crunchyroll are enabled automatically. Pin the extension to access its settings.

From source: clone this repository and load **extension/**. No Node.js or build is needed to use the extension.
Updates: replace files in the same folder, click Reload in the extensions page, reload video tabs. Do not uninstall for ordinary updates.

Same JavaScript source targets Chromium browsers on Windows and Linux; there is no native installer. See [VALIDATION.md](VALIDATION.md) for actually tested environments. Firefox/Safari and macOS are not validated.
GitHub distribution requires developer-mode installation; this is not a Chrome Web Store publication.
[Chrome installation documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Utilisation

- Survoler le soleil : vitesses 0,5 / 1,25 / 1,5 / 2 / 2,5 / 3 / 4 / 5× autour du 1×.
- Soleil : revenir à 1×. Train : réglage fin 0,07–5×.
- Glisser le soleil pour déplacer le contrôle ; Alt + flèches au clavier.
- Lune : masquer le widget jusqu’au rechargement de la page.
- Icône de l’extension : ouvrir les réglages pour **l’onglet depuis lequel tu as cliqué**. Le slider du dashboard règle aussi les audios.
- Autres sites : Appliquer demande l’accès au site. L’affichage automatique universel est facultatif et demande un accès plus large.

Vidéos ajoutées après chargement prises en compte. Le widget est masqué en plein écran du document. Lecteurs DRM/propriétaires et cadres non autorisés ne sont pas garantis. Le son peut être coupé aux vitesses extrêmes.

## Lien avec Psychup

Les six fichiers dans `extension/modules/speedup/` sont repris à l’identique du module Psychup. Ce dépôt est autonome : aucun autre module, archive ou donnée privée n’est requis.

Pour le mainteneur : `node scripts/sync.cjs /chemin/vers/psychup-addon/modules/speedup`.
Vérifier sans modifier : même commande avec `--check`.
`UPSTREAM.json` conserve les empreintes ; aucune synchronisation automatique ni réécriture du Workspace.
Les améliorations publiques doivent être reportées/revues dans Psychup avant une nouvelle importation qui remplace ces six fichiers.

Les deux extensions ont des stockages séparés. Ne pas utiliser les deux contrôleurs sur la même page : désactiver l’une des extensions pour ce test ou utiliser un profil de navigateur séparé. Aucun transfert de préférences implicite.

## Développement

Node.js 22+ ; `npm ci`, `npm test`, `npm run test:browser`, `npm run package`.
Les tests navigateur utilisent des pages et médias synthétiques, pas de compte YouTube.
CI Windows/Linux incluse. Les archives ne contiennent que `extension/`.
Licence MIT ; origine et portée dans [NOTICE.md](NOTICE.md).

