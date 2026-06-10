# Prompt — iteration autonome Still Coffee landing page

---

## 🚫 NE PAS TOUCHER — zones verrouillées

Ces éléments ont été conçus manuellement et ne doivent **jamais** être modifiés, refactorisés ou remplacés :

### 1. `src/components/Hero.jsx` — intégralité du fichier
- Le système de parallaxe scroll (`LAYERS`, `LOGO_SPEED`, `useRef` + `useEffect` + mutation DOM directe)
- Les vitesses de chaque layer (`speed: 0.60 / 0.40 / 0.15`) et la vitesse du logo (`LOGO_SPEED = -0.4`)
- Les 4 barres de progression scroll (`BAR_COUNT`, `barRefs`)
- Les noms de fichiers images : `Coffee-beans-1.webp`, `Coffee-beans-2.webp`, `Coffee-beans-3.webp`
- La position et la taille du logo (`height: 200px`, `top: 60%`)
- **Tu peux** ajouter des éléments graphiques PAR-DESSUS (particules Three.js, overlays, etc.) à condition de ne pas modifier le code existant

### 2. `src/components/ScrollLine.jsx` — fil conducteur scroll
- Ne pas modifier le `PATH`, les opacités, ni la logique `strokeDashoffset`
- Ne pas supprimer ni déplacer ce composant (`z-index: 3`, `position: fixed`)

### 3. Logo — `src/components/Navbar.jsx` et `src/components/Footer.jsx`
- Le logo utilise `<img src="/logo-still-coffee.svg">` — ne pas remplacer par du texte HTML
- Ne pas modifier la taille ni la position du logo dans la Navbar (`h-8`)

### 3. Couleurs, typo et classes CSS dans `src/index.css` — fichier verrouillé
`src/index.css` est la **source de vérité** pour toute la palette et la typographie. Ne jamais modifier ce fichier.
Les tokens existants :
```css
--font-serif:   "Instrument Serif", Georgia, serif
--font-avant:   "itc-avant-garde-gothic-pro", ...

--color-forest:   #25432B
--color-charcoal: #292929
--color-orange:   #E5501A
--color-sky:      #C3DCF4
--color-cream:    #F8F5E6
--color-maroon:   #7A1E1E
--color-sand:     #D4CAB8
```
Classes CSS globales à conserver telles quelles : `.still-ghost`, `.coffee-card`, `@layer base { h3 }`.
Si tu as besoin d'ajouter un token (ex. pour une animation), **ajoute-le sans supprimer ni renommer l'existant**.

---

## ✅ TOUT LE RESTE est libre

Tu peux librement ajouter, modifier, remplacer :
- Couleurs et tokens dans `@theme {}` (sauf font-serif et font-avant)
- Contenu textuel de toutes les sections
- Images, textures, backgrounds, overlays
- Nouveaux composants React (carousels, modals, cartes, etc.)
- Animations GSAP, CSS, Three.js sur toutes les sections SAUF Hero
- Layout et structure de Experience, Coffees, Quote, Origins, About, Footer, Navbar
- Nouveaux fichiers dans `src/components/`
- `public/` pour ajouter des assets

---

## Contexte projet

Tu travailles sur une landing page pour **Still Coffee**, une marque de café specialty luxe-discret.

**Stack technique :**
- React 18 + Vite 5
- Tailwind CSS v4 (via `@tailwindcss/vite` — pas de tailwind.config.js, les tokens sont dans `src/index.css` dans le bloc `@theme {}`)
- Three.js + @react-three/fiber + @react-three/drei (installés)
- GSAP (à installer si absent : `npm install gsap`)

**Fichiers importants :**
- `src/index.css` → **source de vérité** : couleurs, polices, classes globales — ne pas modifier
- `src/App.jsx` → assemblage des sections
- `src/components/` → Navbar, Hero, Experience, Coffees, Quote, Origins, About, Footer
- `public/ressources/design-still.md` → inspiration pour les composants, animations et langage visuel (les tokens couleur/typo sont déjà dans index.css — s'y référer pour l'esprit du projet, pas pour remplacer les tokens)
- `public/ressources/moodboard.png` → direction visuelle
- `public/ressources/palette.png` → palette de référence visuelle

**Lis ces fichiers en priorité avant d'itérer.**

---

## Objectif

Amener la landing page à un niveau de finition professionnel, fidèle au design system de `design-still.md` et au design existant.
À chaque itération : **choisir une section ou une animation, l'implémenter proprement, vérifier que ça build (`npx vite build`), passer à la suivante.**

---

## Priorités d'itération (dans l'ordre)

### 1. GSAP — animations au scroll (ScrollTrigger)
Installer GSAP + ScrollTrigger (`npm install gsap`). Implémenter :

- **Character reveal outline** : dans `Experience` et `About`, les grands titres (Instrument Serif italic) apparaissent d'abord en outline CSS, puis se remplissent au fur et à mesure que l'élément entre dans le viewport. Utiliser `gsap.fromTo` + `ScrollTrigger`.
- **Stamp reveal** : dans `Coffees`, les 3 cartes tombent comme des timbres qu'on pose (rotation + translateY depuis le haut, staggered). Déclenché au scroll.
- **Section fade-in** : chaque section entre avec un léger `opacity: 0 → 1` + `y: 40 → 0`, staggered sur les enfants.

### 2. Cursor personnalisé
Créer un composant `CustomCursor` (cercle 64px, `--color-terracotta`, `mix-blend-mode: multiply`, `opacity: 0.8`).
- Suit la souris avec un ease GSAP (`gsap.to(cursor, { x, y, duration: 0.4, ease: "power2.out" })`)
- Grossit au hover sur les cartes `.coffee-card` et les boutons
- Cacher le curseur natif (`cursor: none` sur `body`)
- Monter le composant dans `App.jsx`

### 3. Section Origins — carte SVG monde
Remplacer le globe cercle actuel par une vraie carte SVG du monde simplifiée (path SVG monde en trait fin `--color-cream-20`).
- 3 points `--color-terracotta` pulsants (CSS animation `@keyframes pulse` : scale 1 → 1.4 → 1, opacity 1 → 0 → 1, durée 2s infini)
- Au hover sur un point : afficher une mini stamp-card ancrée (position absolute, z-index élevé)

### 4. Hero — Three.js WebGL
Le hero a actuellement 3 images WebP en parallaxe CSS. Ajouter une couche Three.js par-dessus :
- Canvas transparent (`gl={{ alpha: true }}`), `position: absolute`, `z-index: 15` (entre images et logo)
- Particules (300–500 points `BufferGeometry`) représentant des grains de café — dérivent lentement
- Le curseur attire les particules dans un rayon de 150px (calcul `mouse.x/y` en coordonnées Three.js)
- Lumière ambiante chaude `#FFD9A0`

### 5. Texture film grain
Overlay global sur toute la page : un `<canvas>` fixe en `position: fixed`, `z-index: 999`, `pointer-events: none`, `opacity: 0.04`.
Générer le grain avec JS pur (noise aléatoire sur les pixels du canvas, rafraîchi à 12fps pour effet argentique).

### 6. Footer
Revoir le footer avec le vrai design system :
- Background `--color-anthracite-mid`
- Section newsletter (input email + bouton `ButtonPrimary`)
- 3 colonnes : Origins / Visit / Legal
- Logo "STILL coffee" centré en bas, très grand, avec l'effet ghost outline

---

## Règles de code

- Ne pas casser le build (`npx vite build` doit passer sans erreur après chaque changement)
- Tailwind v4 : les classes custom se définissent dans `@theme {}` de `src/index.css`, pas dans un fichier config
- Les animations scroll-based → GSAP ScrollTrigger (ne pas utiliser IntersectionObserver manuellement)
- Les mutations DOM directes pour les animations frame-by-frame (parallax, cursor) → `useRef` + event listeners, pas de `useState`
- `will-change: transform` sur les éléments animés
- Composants React dans `src/components/` — un fichier par composant
- Pas de commentaires évidents — seulement si le WHY n'est pas clair
"Ne me demande pas de confirmation à chaque étape. Itère jusqu'à ce que le résultat soit propre et cohérent avec la demande. Signale-moi uniquement quand tu estimes que c'est termine. Terminé veut dire : avec des animations fluides et une identité graphique profesionnelle, ainsi qu'une experience utilisateur pro et un ui polished."

---

## Itération

À chaque loop :
1. Lire l'état actuel du fichier concerné avant de le modifier
2. Implémenter **une** amélioration ou animation
3. Lancer `npx vite build` pour vérifier
4. Si build OK → passer à la priorité suivante dans la liste
5. Si build KO → corriger avant de continuer
