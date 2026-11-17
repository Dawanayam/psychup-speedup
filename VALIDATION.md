# Validation — 17 novembre 2026

- `npm test` : manifeste minimal, syntaxe, empreintes des six fichiers partagés, recherche élémentaire de secrets : réussite.
- `npm run test:browser` : extension autonome réellement chargée sous Windows dans Chrome for Testing 157.0.8103.78, Puppeteer 25.18.1. Vidéo/audio, soleil retour 1×, interface autonome liée à la source, refus après navigation source, largeur 320 px, survol et centrage des planètes vérifiés. Réponses HTTP et médias synthétiques, aucun compte ou streaming réel.
- Régression dans Psychup : `node tests/speedup-browser.cjs` réussie avec Chrome 142 isolé après correction commune du centrage.
- `npm run package` : ZIP construit et inventaire relu avec System.IO.Compression ; neuf fichiers, aucun autre module ni donnée utilisateur. SHA-256 livré.
- `npm audit` après mise à niveau : 0 vulnérabilité signalée. Cela ne constitue pas un audit de sécurité exhaustif.
- CI Windows/Linux incluse ; son état réel est visible dans Actions. Pas de test manuel Linux ou du profil personnel, de flux DRM, de refus natif de permission ou de publication Web Store. Pas de mesure mémoire/CPU.

La version précédente de Puppeteer avait dix alertes de dépendances de développement ; elle a été remplacée avant publication. Le navigateur correspondant a été téléchargé et le test relancé avec succès.
