// Déclaration des variables
var items = document.getElementById("item"); // Récupération de l'élément item
items.style.display = "none"; // Rendre l'élément invisible au début
var positionY = 0;
var positionX = 0;
var speed = 5;
var speedmovement = 50;
var interval; // Déclaration de l'intervalle pour la fonction moveDown
var game = document.querySelector("#game");
var item = document.querySelector(".item");
var gameWidth = game.offsetWidth; // Récupération de la largeur du jeu
var itemWidth = item.offsetWidth; // Récupération de la largeur de l'objet
var maxLeft = -gameWidth + itemWidth; // Position maximale à gauche
var maxRight = gameWidth - itemWidth; // Position maximale à droite

// Observer pour adapter les dimensions au redimensionnement de la fenêtre
const resizeObserver = new ResizeObserver(() => {
  gameWidth = game.offsetWidth;
  gameHeight = game.offsetHeight;
  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;
  maxBottom = gameHeight - item.offsetHeight;
});
resizeObserver.observe(game);

/* --- Tableau associatif pour les détritus --- */
let assoDetritus = {
  plastique: [
    {
      nom: "Bouteille plastique",
      interaction: 1,
      weight: 10,
      loose:
        "Jeter ces bouteilles en plastique contribue à la dégradation de la biodiversité",
    },
    {
      nom: "Paille",
      interaction: 0,
      weight: 15,
      loose:
        "Les pailles en plastique sont très polluantes pour l'environnement",
    },
    {
      nom: "Sac plastique",
      interaction: 1,
      weight: 30,
      loose: "Les sacs plastiques sont très polluants pour l'environnement",
    },
    {
      nom: "Paille plastique",
      interaction: 0,
      weight: 5,
      loose:
        "Les pailles en plastique sont très polluantes pour l'environnement",
    },
    {
      nom: "Gobelet plastique",
      interaction: 0,
      weight: 8,
      loose:
        "Les gobelets en plastique sont très polluants pour l'environnement",
    },
  ],
  verre: [
    {
      nom: "Bouteille de vin",
      interaction: 0,
      weight: 20,
      loose: "Les bouteilles en verre sont recyclables",
    },
    {
      nom: "Bouteille de champagne",
      interaction: 0,
      weight: 25,
      loose: "Les bouteilles en verre sont recyclables",
    },
    {
      nom: "Pot en verre",
      interaction: 1,
      weight: 12,
      loose: "Les pots en verre sont recyclables",
    },
    {
      nom: "Verre cassé",
      interaction: 0,
      weight: 7,
      loose: "Les verres cassés sont dangereux pour les animaux",
    },
  ],
  papier: [
    {
      nom: "Journal",
      interaction: 2,
      weight: 5,
      loose: "Les journaux sont recyclables",
    },
    {
      nom: "Carton d'emballage",
      interaction: 2,
      weight: 15,
      loose: "Les cartons d'emballage sont recyclables",
    },
    {
      nom: "Feuille imprimée",
      interaction: 2,
      weight: 3,
      loose: "Les feuilles imprimées sont recyclables",
    },
    {
      nom: "Magazine",
      interaction: 2,
      weight: 7,
      loose: "Les magazines sont recyclables",
    },
  ],
  organique: [
    {
      nom: "Épluchures de légumes",
      interaction: 0,
      weight: 10,
      loose: "Les épluchures de légumes peuvent être compostées",
    },
    {
      nom: "Pomme pourrie",
      interaction: 0,
      weight: 12,
      loose: "Les pommes pourries peuvent être compostées",
    },
    {
      nom: "Reste de repas",
      interaction: 0,
      weight: 15,
      loose: "Les restes de repas peuvent être compostés",
    },
    {
      nom: "Feuilles mortes",
      interaction: 0,
      weight: 5,
      loose: "Les feuilles mortes peuvent être compostées",
    },
  ],
  métal: [
    {
      nom: "Canette aluminium",
      interaction: 2,
      weight: 10,
      loose: "Les canettes en aluminium sont recyclables",
    },
    {
      nom: "Boîte de conserve",
      interaction: 2,
      weight: 15,
      loose: "Les boîtes de conserve sont recyclables",
    },
    {
      nom: "Capsule métallique",
      interaction: 2,
      weight: 3,
      loose: "Les capsules métalliques sont recyclables",
    },
    {
      nom: "Ferraille rouillée",
      interaction: 2,
      weight: 25,
      loose: "La ferraille rouillée est recyclable",
    },
  ],
  inerte: [
    {
      nom: "Caillou",
      interaction: 0,
      weight: 20,
      loose: "Les cailloux ne sont pas recyclables",
    },
    {
      nom: "Brique cassée",
      interaction: 0,
      weight: 30,
      loose: "Les briques cassées ne sont pas recyclables",
    },
    {
      nom: "Morceau de béton",
      interaction: 0,
      weight: 35,
      loose: "Les morceaux de béton ne sont pas recyclables",
    },
    {
      nom: "Céramique cassée",
      interaction: 0,
      weight: 12,
      loose: "Les céramiques cassées ne sont pas recyclables",
    },
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

// Ajouter les boutons dans le HTML
var startButton = document.createElement("button");
startButton.innerText = "Démarrer le jeu";
startButton.className = "button start-button";
document.body.appendChild(startButton);

var restartButton = document.createElement("button");
restartButton.innerText = "Relancer le jeu";
restartButton.className = "button restart-button";
restartButton.style.display = "none"; // Cacher le bouton de relance au début
document.body.appendChild(restartButton);

// Fonction pour démarrer le jeu
function startGame() {
  items.style.display = "block"; // Rendre l'élément invisible au début
  interval = setInterval(moveDown, 75);
  startButton.style.display = "none";
  restartButton.style.display = "none";
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  positionX = 0;
  positionY = 0;
  randomObject = genererDetritusSelonProbabilite();
  items.innerText = `${randomObject.nom} - ${randomObject.type} - ${randomObject.weight}kg`;
  items.style.left = positionX + "px";
  items.style.top = positionY + "px";
  document.addEventListener("keydown", movement);
  scoreInterval = setInterval(() => {
    score += 1;
    scoreDisplay.innerText = `Score: ${score}`;
  }, 1000);
}

// Fonction pour arrêter le jeu
function stopGame() {
  clearInterval(interval);
  clearInterval(scoreInterval);
  restartButton.style.display = "block";
  document.removeEventListener("keydown", movement);

  // Supprimer les poubelles créées dynamiquement
  document.querySelectorAll(".trash-bin.dynamic").forEach((bin) => {
    bin.remove();
  });

  // Réinitialiser les poubelles de base
  tbin = [];
  updateTbin();
}

// Ajouter les événements aux boutons
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

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
  else if (tirage <= 30) typeChoisi = "verre";
  else if (tirage <= 45) typeChoisi = "papier";
  else if (tirage <= 60) typeChoisi = "organique";
  else if (tirage <= 80) typeChoisi = "métal";
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

  if (items.getBoundingClientRect().bottom >= game.offsetHeight) {
    alert("Il ne faut en aucun cas jeter ses détritus dans la mer");
    stopGame();
    return;
  }
  updateTbin(); // Mise à jour immédiate des positions des poubelles

  const itemRect = items.getBoundingClientRect();

  for (let p = 0; p < poubelles.length; p++) {
    if (!tbin[p]) continue; // Évite l'erreur si `tbin[p]` est undefined
    const rect = tbin[p];

    // Vérification de la collision avec les poubelles
    if (
      itemRect.bottom >= rect.top &&
      itemRect.top <= rect.bottom &&
      itemRect.right >= rect.left &&
      itemRect.left <= rect.right
    ) {
      if (randomObject.type === poubelles[p]) {
        // Bonne poubelle -> Ajout au score et détritus trié
        detritusCount++;
        score += 10;
        console.log(`Détritus triés: ${detritusCount}`);
        console.log("Bonne Poubelle !");
      } else if (poubelles[p] === "inerte") {
        // Poubelle inerte -> Détritus trié mais pas de points
        if (randomObject.type !== "inerte") {
          detritusCount++;
          console.log("Mauvaise poubelle (par défaut dans inerte)");
          console.log(`Détritus triés: ${detritusCount}`);
        }
      } else {
        alert(`Mauvaise Poubelle: ${randomObject.loose}`);
        console.log("Mauvaise poubelle, jeu arrêté.");
        stopGame();
        return;
      }

      scoreDisplay.innerText = `Score: ${score}`;
      resetObject();
    }
  }

  // Ajouter de nouvelles poubelles en fonction du nombre de détritus triés
  checkForNewBins();
}

function resetObject() {
  positionX = 0;
  positionY = 0;
  randomObject = genererDetritusSelonProbabilite();
  items.innerText = `${randomObject.nom} - ${randomObject.type} - ${randomObject.weight}kg`;
  items.style.left = positionX + "px";
  items.style.top = positionY + "px";
}

function checkForNewBins() {
  if (detritusCount === 5 && !document.getElementById("bin3")) {
    console.log("Ajout de la poubelle papier !");
    addNewBin("papier", "bin3");
    speed = 10;
  }
  if (detritusCount === 10 && !document.getElementById("bin4")) {
    addNewBin("verre", "bin4");
    speed = 10;
  }
  if (detritusCount === 15 && !document.getElementById("bin5")) {
    addNewBin("organique", "bin5");
    speed = 15;
  }
  if (detritusCount === 20 && !document.getElementById("bin6")) {
    addNewBin("métal", "bin6");
    speed = 1;
  }
}

// Fonction pour ajouter une nouvelle poubelle
function addNewBin(type, id) {
  console.log(`Ajout d'une nouvelle poubelle: ${type}`);
  const newBin = new Poubelle(type, id);
  newBin.bin.classList.add("dynamic"); // Ajouter une classe pour les poubelles dynamiques
  poubelles.push(type); // Ajout du type de poubelle dans la liste
  tbin.push(newBin.getBoundingClientRect()); // Mise à jour des positions des poubelles
}

function updateTbin() {
  tbin = [];
  document.querySelectorAll(".trash-bin").forEach((bin) => {
    tbin.push(bin.getBoundingClientRect()); // Mise à jour des positions des poubelles
  });
}
