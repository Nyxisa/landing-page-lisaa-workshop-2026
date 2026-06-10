# design.md — Still

Ce qui n'est pas mentionné ici doit ressembler à l'existant. pas de nouvelles couleurs ou de nouvelles typographies.

## BRAND

- **Tone**: contemplatif, sensoriel, analogique, luxe discret
- **Univers**: origines du café, voyage postal, mid-century lounge, matières brutes
- **Produits**: café specialty, single origin, expérience lounge
- **Tagline**: "Where time slows down."

---



## TYPOGRAPHY TOKENS

### Font families
```css
--font-display:   "ITC Avant Garde Gothic", sans-serif;  /* bold + outline — headlines, labels forts */
--font-serif:     "Instrument Serif", serif;              /* italic — titres éditoriaux, citations */
--font-body:      "ITC Avant Garde Gothic", sans-serif;  /* regular — body, boutons, inputs */
```

### Règle de combinaison typographique
- **Display** : ITC Avant Garde Bold UPPERCASE + version outline du même mot en superposition (z-index décalé, opacité 40%)
- **Éditorial** : Instrument Serif Italic pour les accroches poétiques, citations, taglines
- **Labels** : ITC Avant Garde Bold, très espacé (letter-spacing 2–3px), uppercase, petit corps


### CustomCursor


### Footer
```yaml
bg: var(--color-anthracite-mid)
border-top: 1px solid var(--color-cream-20)
padding-top: 80px
structure: newsletter + 3 colonnes (Origins / Visit / Legal) + logo à gaucge en gros en bas de page
```

---

## VISUAL LANGUAGE

- **Timbres postaux**: élément UI central — cartes origines stylisées comme des stamps philatéliques, bords dentelés SVG, cachet tampon superposé
- **Textures**: grain film argentique en overlay (opacity 4–8%), surfaces imitant bois walnut, chrome brossé, carrelage zellige
- **Ghost text**: titres en outline ITC Avant Garde, même mot en fill derrière, décalé de 4–8px, opacity 20%
- **Typographie display**: rôle décoratif et informatif — les grands titres débordent volontairement du conteneur
- **Carte du monde**: fil conducteur de la page, points d'origine comme ancres narratives
- **Palette matière**: chaque section peut avoir une texture dominante (bordeaux = cuir, forest = zellige, brass = chrome)

---

## ANIMATIONS (référence Three.js / GSAP)

| Pattern                  | Déclencheur | Description                                                   |
|--------------------------|-------------|---------------------------------------------------------------|
| Particules café          | load        | Three.js — grains/points dérivent lentement, curseur les attire |
| Stamp reveal             | scroll      | Cartes origines tombent comme des timbres qu'on pose           |
| Character reveal outline | scroll      | Chars apparaissent d'abord en outline, se remplissent ensuite  |
| Map pulse                | idle        | Points d'origine pulsent doucement sur la carte SVG            |
| Texture parallax         | scroll      | Layers de texture bougent à vitesses différentes (profondeur)  |
| Cursor                   | mouse       | Suit la souris avec ease, gonfle au hover sur les stamps       |
| Latte art hero           | load        | Animation SVG du motif latte art dans le logo — se trace       |
