# TETRI

♻️ **TETRIS DU TRI — Apprendre à trier en s’amusant**

TETRI (Tetris du Tri) est un **Serious Game** ludique et éducatif inspiré de **Tetris**. Son but : sensibiliser les joueurs au **tri sélectif** des déchets à travers un challenge dynamique.

Les déchets tombent du ciel et le joueur doit les placer dans les bonnes poubelles (**Plastique**, **Verre**, **Papier**, **Inerte**, etc.) tout en gérant l’espace, la forme des objets, leur orientation… et la progression de la difficulté.

Le projet est jouable directement dans le navigateur via `index.html`.

---

## 🎯 Objectifs pédagogiques

Ce jeu a été conçu pour avoir un impact direct dans la vraie vie :

- **Réalité des statistiques** : les déchets peuvent apparaître selon des probabilités inspirées de la production réelle (ex : 50% plastique, 20% papier, 30% inerte).
- **Sensibilisation à l’erreur** : une explication pédagogique est affichée lorsqu’un déchet est mal trié (impacts environnementaux, enjeux du tri, etc.).
- **Valorisation** : visualisation / suivi des catégories triées (dans cette version, un graphique affiche le **poids trié (kg)** par catégorie).

---

## 🎮 Gameplay & mécaniques

- Un détritus apparaît et **tombe automatiquement**
- Objectif : **trier correctement** dans la bonne poubelle
- Le jeu ajoute **progressivement de nouvelles poubelles** (donc plus de types de déchets)
- Un **score** est calculé
- Un **graphique (Chart.js)** affiche le **poids trié (kg) par catégorie**

Certains objets ont des propriétés spéciales (ex : **pliables** via plusieurs étapes d’images).

---

## ⌨️ Contrôles

Contrôles actuellement implémentés dans le code :

- **← / →** : déplacer le déchet horizontalement
- **↓** : accélérer la descente
- **R** : tourner l’objet de **90°**
- **F** : **plier** certains objets (quand ils ont plusieurs images/étapes, ex : carton, canette)

> Idées/mécaniques mentionnées (pas forcément implémentées dans cette version) :
> - **Espace** : chute instantanée
> - **S (Split)** : séparer un objet composite (ex : bocal + couvercle)
> - **V (Vider)** : vider les poubelles avant saturation

---

## 🏆 Règles & score

Version actuelle (implémentée) :

- +**1 point / seconde**
- +**10 points** par bon tri
- Bonus si l’objet doit être orienté correctement
- Bonus si l’objet est **plié** jusqu’à sa dernière étape (si applicable)

Défaite si :
- tu jettes un détritus dans la **mauvaise poubelle** (message explicatif),
- ou si l’objet touche le bas de la zone de jeu (message de prévention).

> Extensions possibles (concept) : leaderboard Top 5, badges (Expert Plastique, Roi du Verre), scoring plus avancé…

---

## ⚙️ Évolution de la difficulté

- **Accélération** : la vitesse de descente augmente au fil des déchets correctement triés
- **Ajout de poubelles** : le jeu commence avec **2 poubelles** (**Plastique**, **Inerte**) puis ajoute progressivement :
  - Papier
  - Verre
  - Organique
  - Métal

---

## 🏗️ Architecture technique

Le projet est développé en **Vanilla JavaScript**, **HTML5** et **CSS3**, sans framework.

Points clés :

- **Boucle de jeu** : `setInterval` (toutes les ~75ms) gère la gravité (`moveDown()`)
- **Collisions** : `getBoundingClientRect()` pour détecter le contact avec les poubelles
- **Responsive** :
  - Flexbox pour l’interface (`.bins`)
  - Media queries pour adapter la taille des déchets (`.item`)
- **Redimensionnement dynamique** : `ResizeObserver` ajuste les limites de déplacement (`maxLeft`, `maxRight`)

---

## 📦 Structure des données (déchets)

Les déchets sont modélisés sous forme d’objets (nom, poids, image, texte pédagogique…).  
Certains objets possèdent plusieurs images pour représenter les **étapes de pliage**.

Exemple (concept) :

```js
let assoDetritus = {
  "métal": [
    {
      "nom": "Canette aluminium",
      "interaction": 2,
      "weight": 10,
      "images": [
        "assets/métal/canette/Canette_1.svg",
        "assets/métal/canette/Canette_2.svg",
        "assets/métal/canette/Canette_3.svg"
      ]
    }
  ]
};
