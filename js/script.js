// Déclaration des variables
var items = document.getElementById("item"); // Récupération de l'élément item
var positionY = 0;
var positionX = 0;
var speed = 5;
var speedmovement = 50;
var interval = setInterval(moveDown, 75); // Déclaration de l'intervalle pour la fonction moveDown
var game = document.querySelector("#game");
var item = document.querySelector(".item");
var gameWidth = game.offsetWidth; // Récupération de la largeur du jeu
var itemWidth = item.offsetWidth; // Récupération de la largeur de l'objet
var maxLeft = -gameWidth + itemWidth; // Position maximale à gauche
var maxRight = gameWidth - itemWidth; // Position maximale à droite

// Observer pour adapter les dimensions au redimensionnement de la fenêtre
const resizeObserver = new ResizeObserver(() => {
  gameWidth = game.offsetWidth;
  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;
});
resizeObserver.observe(game);

/* --- Tableau associatif pour les détritus --- */
let assoDetritus = {
  plastique: [
    { nom: "Bouteille plastique", interaction: 1, weight: 10 }, // 2 : plié
    { nom: "Paille", interaction: 0, weight: 15 },
    { nom: "Sac plastique", interaction: 1, weight: 30 }, // 1: splité
    { nom: "Paille plastique", interaction: 0, weight: 5 },
    { nom: "Gobelet plastique", interaction: 0, weight: 8 },
  ],
  verre: [
    { nom: "Bouteille de vin", interaction: 0, weight: 20 },
    { nom: "Bouteille de champagne", interaction: 0, weight: 25 },
    { nom: "Pot en verre", interaction: 1, weight: 12 }, // 1: splité
    { nom: "Verre cassé", interaction: 0, weight: 7 },
  ],
  papier: [
    { nom: "Journal", interaction: 2, weight: 5 }, // 2 : plié
    { nom: "Carton d'emballage", interaction: 2, weight: 15 }, // 2 : plié
    { nom: "Feuille imprimée", interaction: 2, weight: 3 }, // 2 : plié
    { nom: "Magazine", interaction: 2, weight: 7 }, // 2 : plié
  ],
  organique: [
    { nom: "Épluchures de légumes", interaction: 0, weight: 10 },
    { nom: "Pomme pourrie", interaction: 0, weight: 12 },
    { nom: "Reste de repas", interaction: 0, weight: 15 },
    { nom: "Feuilles mortes", interaction: 0, weight: 5 },
  ],
  métal: [
    { nom: "Canette aluminium", interaction: 2, weight: 10 }, // 2 : plié
    { nom: "Boîte de conserve", interaction: 2, weight: 15 }, // 2 : plié
    { nom: "Capsule métallique", interaction: 2, weight: 3 }, // 2 : plié
    { nom: "Ferraille rouillée", interaction: 2, weight: 25 }, // 2 : plié
  ],
  inerte: [
    { nom: "Caillou", interaction: 0, weight: 20 },
    { nom: "Brique cassée", interaction: 0, weight: 30 },
    { nom: "Morceau de béton", interaction: 0, weight: 35 },
    { nom: "Céramique cassée", interaction: 0, weight: 12 },
  ],
};

// Types de poubelles
var poubelles = [
  "plastique",
  "inerte",
  "papier",
  "verre",
  "organique",
  "métal",
];

// Score du joueur
var score = 0;
var scoreDisplay = document.createElement("div");
scoreDisplay.className = "score-display";
scoreDisplay.innerText = `Score: ${score}`;
document.querySelector(".score").appendChild(scoreDisplay);

// Augmente le score chaque seconde
setInterval(() => {
  score += 1;
  scoreDisplay.innerText = `Score: ${score}`;
}, 1000);

// Classe représentant une poubelle
class Poubelle {
  constructor(type, id) {
    this.type = type;
    this.bin = document.createElement("div");
    this.bin.className = "trash-bin";
    this.bin.innerText = type;
    this.bin.id = id;
    document.querySelector(".bins").appendChild(this.bin);
  }
  getBoundingClientRect() {
    return this.bin.getBoundingClientRect();
  }
}

// Création des poubelles initiales
const bin1 = new Poubelle("plastique", "bin1");
const bin2 = new Poubelle("inerte", "bin2");

// Fonction pour générer un détritus aléatoire selon des probabilités
function genererDetritusSelonProbabilite() {
  const tirage = Math.floor(Math.random() * 99);
  let typeChoisi;
  if (tirage <= 20) typeChoisi = "plastique";
  else if (tirage <= 40) typeChoisi = "verre";
  else if (tirage <= 60) typeChoisi = "papier";
  else if (tirage <= 80) typeChoisi = "organique";
  else if (tirage <= 100) typeChoisi = "métal";
  else typeChoisi = "inerte";

  console.log(tirage);

  const listeDetritus = assoDetritus[typeChoisi];
  const choix = listeDetritus[Math.floor(Math.random() * listeDetritus.length)];
  // On ajoute la propriété "type" pour conserver l'information du type
  return { ...choix, type: typeChoisi };
}

// Initialiser l'objet avec un détritus aléatoire
var randomObject = genererDetritusSelonProbabilite();
items.innerText = `${randomObject.nom} - ${randomObject.type} - ${randomObject.weight}kg`;

// Gestion du mouvement de l'objet avec les touches du clavier
function movement(event) {
  if (event.key === "ArrowLeft") {
    positionX = Math.max(maxLeft, positionX - speedmovement);
  } else if (event.key === "ArrowRight") {
    positionX = Math.min(maxRight, positionX + speedmovement);
  } else if (event.key === "ArrowDown") {
    positionY += 50;
  }
  items.style.left = positionX + "px";
  items.style.top = positionY + "px";
}

let tbin = [];
document.addEventListener("keydown", movement);

// Mouvement automatique vers le bas et vérification de collision avec la poubelle ou le bas de la fenêtre
var detritusCount = 0; // Déplacer la déclaration ici pour éviter la réinitialisation
function moveDown() {
  positionY += speed;
  items.style.top = positionY + "px";

  if (items.getBoundingClientRect().bottom >= window.innerHeight) {
    positionX = 0;
    positionY = 0;
    randomObject = genererDetritusSelonProbabilite();
    items.innerText = `${randomObject.nom} - ${randomObject.type} - ${randomObject.weight}kg`;
    items.style.left = positionX + "px"; // Ajouté pour réinitialiser la position X
    items.style.top = positionY + "px"; // Ajouté pour réinitialiser la position Y
  }

  updateTbin(); // Mettre à jour immédiatement `tbin`

  const itemRect = items.getBoundingClientRect();

  for (let p = 0; p < poubelles.length; p++) {
    if (!tbin[p]) continue; // Évite l'erreur si `tbin[p]` n'existe pas encore
    const rect = tbin[p];

    // Vérification de la collision avec les poubelles
    if (
      itemRect.bottom >= rect.top &&
      itemRect.top <= rect.bottom &&
      itemRect.right >= rect.left &&
      itemRect.left <= rect.right &&
      randomObject.type === poubelles[p]
    ) {
      detritusCount++;
      console.log(`Détritus triés: ${detritusCount}`);
      score += 10;
      scoreDisplay.innerText = `Score: ${score}`;

      // Réinitialisation de la position et génération d'un nouveau détritus
      positionX = 0;
      positionY = 0;
      randomObject = genererDetritusSelonProbabilite();
      items.innerText = `${randomObject.nom} - ${randomObject.type} - ${randomObject.weight}kg`;
      items.style.left = positionX + "px";
      items.style.top = positionY + "px";

      // Ajouter de nouvelles poubelles en fonction du nombre de détritus triés
      if (detritusCount === 10) {
        addNewBin("papier", "bin3");
        updateTbin(); // Mettre à jour immédiatement `tbin`
        speed = 10;
      }
      if (detritusCount === 20) {
        addNewBin("verre", "bin4");
        updateTbin();
        speed = 15;
      }
      if (detritusCount === 30) {
        addNewBin("organique", "bin5");
        updateTbin();
        speed = 20;
      }
      if (detritusCount === 40) {
        addNewBin("métal", "bin6");
        updateTbin();
        speed = 25;
      }
    }
  }

  function addNewBin(type, id) {
    const newBin = new Poubelle(type, id);
    poubelles.push(type); // Ajout du type de poubelle dans la liste
    updateTbin(); // Mise à jour des positions des poubelles
  }
  function updateTbin() {
    tbin = []; // On vide `tbin` pour recalculer
    document.querySelectorAll(".trash-bin").forEach((bin) => {
      tbin.push(bin.getBoundingClientRect()); // On récupère les nouvelles positions
    });
  }
}
