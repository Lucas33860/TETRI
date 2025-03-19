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

/* 2) Tableau associatif des détritus (avec images) */
let assoDetritus = {
  plastique: [
    {
      nom: "Bouteille plastique",
      interaction: 1,
      weight: 10,
      img: "assets/plastique/bouteille soda plastique.svg",
    },
    {
      nom: "Sac plastique",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/sac plastique.svg",
    },
    {
      nom: "Dentifrice",
      interaction: 1,
      weight: 10,
      img: "assets/plastique/DENTIFRICE.svg",
    },
    {
      nom: "Sac plastique 2",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/Sac plastique 2.svg",
    },
    {
      nom: "Gel Douche",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/gel douche.svg",
    },
  ],
  verre: [
    {
      nom: "Bouteille de bière",
      interaction: 0,
      weight: 15,
      img: "assets/Verre/Biere.svg",
    },
    {
      nom: "Bouteille de vin",
      interaction: 0,
      weight: 20,
      img: "assets/Verre/Vin.svg",
    },
  ],
  papier: [
    {
      nom: "Journal",
      interaction: 2,
      weight: 5,
      img: "assets/papier/Journal.svg",
    },
    {
      nom: "Affiche",
      interaction: 2,
      weight: 5,
      img: "assets/papier/affiche.svg",
    },
  ],
  organique: [
    {
      nom: "Noix",
      interaction: 0,
      weight: 10,
      img: "assets/organique/Noix.svg",
    },
    {
      nom: "Pain",
      interaction: 0,
      weight: 10,
      img: "assets/organique/Pain.svg",
    },
    {
      nom: "Pomme",
      interaction: 0,
      weight: 10,
      img: "assets/organique/Pomme.svg",
    },
    {
      nom: "Sachet de thé",
      interaction: 0,
      weight: 10,
      img: "assets/organique/sachet de thé.svg",
    },
  ],
  métal: [
    {
      nom: "Boite de conserve",
      interaction: 2,
      weight: 10,
      img: "assets/Métal/boite de conserve.svg",
    },
  ],
  inerte: [
    {
      nom: "Chips",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Chips.svg",
    },
    {
      nom: "Mouchoir",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Mouchoir.svg",
    },
    {
      nom: "orange",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/orange.svg",
    },
    {
      nom: "OS",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/os.svg",
    },
    {
      nom: "Pizza",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Pizza.svg",
    },
    {
      nom: "Steak",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Steak.svg",
    },
  ],
};

/* 3) Les types de poubelles possibles */
var poubelles = [
  "plastique",
  "inerte",
  "papier",
  "verre",
  "organique",
  "métal",
];

/* 4) Variables globales et récupération d'éléments DOM */
var items = document.getElementById("item");
var game = document.getElementById("game");
var score = 0;
var scoreDisplay = document.createElement("div");
scoreDisplay.className = "score-display";
scoreDisplay.innerText = "Score: " + score;
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

/* Pour limiter le déplacement latéral */
var gameWidth = game.offsetWidth;
var itemWidth = items.offsetWidth;
var maxLeft = -gameWidth + itemWidth;
var maxRight = gameWidth - itemWidth;

/* 5) Observer le redimensionnement de #game */
const resizeObserver = new ResizeObserver(function () {
  gameWidth = game.offsetWidth;
  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;
});
resizeObserver.observe(game);

/* 6) Générer un détritus aléatoirement selon des probabilités */
function genererDetritusSelonProbabilite() {
  var tirage = Math.floor(Math.random() * 99);
  var typeChoisi;
  if (tirage <= 20) typeChoisi = "plastique";
  else if (tirage <= 30) typeChoisi = "verre";
  else if (tirage <= 45) typeChoisi = "papier";
  else if (tirage <= 60) typeChoisi = "organique";
  else if (tirage <= 80) typeChoisi = "métal";
  else typeChoisi = "inerte";

  var listeDetritus = assoDetritus[typeChoisi];
  var choix = listeDetritus[Math.floor(Math.random() * listeDetritus.length)];
  return { ...choix, type: typeChoisi };
}

/* 7) Initialiser le premier détritus (uniquement via l'image) */
var randomObject = genererDetritusSelonProbabilite();
items.innerHTML =
  '<img src="' +
  randomObject.img +
  '" alt="' +
  randomObject.nom +
  '" style="width:100%; height:100%; object-fit:contain;" />';

/* 8) Incrémenter le score chaque seconde */
setInterval(function () {
  score += 1;
  scoreDisplay.innerText = "Score: " + score;
}, 1000);

/* 9) Classe Poubelle : on ajoute une image */
class Poubelle {
  constructor(type, id) {
    this.type = type;
    this.bin = document.createElement("div");
    this.bin.className = "trash-bin";
    this.bin.id = id;

    /* Création de l'image de poubelle */
    var binImg = document.createElement("img");
    binImg.src = binImages[type];
    binImg.alt = type;
    this.bin.appendChild(binImg);

    document.querySelector(".bins").appendChild(this.bin);
  }
  getBoundingClientRect() {
    return this.bin.getBoundingClientRect();
  }
}

/* 10) Créer deux poubelles initiales (plastique, inerte) */
var bin1 = new Poubelle("plastique", "bin1");
var bin2 = new Poubelle("inerte", "bin2");

/* 11) Gérer le clavier (flèches + touche r) */
function movement(event) {
  if (event.key === "ArrowLeft") {
    positionX = Math.max(maxLeft, positionX - speedmovement);
  } else if (event.key === "ArrowRight") {
    positionX = Math.min(maxRight, positionX + speedmovement);
  } else if (event.key === "ArrowDown") {
    positionY += 50;
  } else if (event.key === "r") {
    rotationAngle += 15;
    items.style.transform = "rotate(" + rotationAngle + "deg)";
  }

  items.style.left = positionX + "px";
  items.style.top = positionY + "px";
}
document.addEventListener("keydown", movement);

/* 12) Mouvement automatique vers le bas */
var interval = setInterval(moveDown, 75);
var tbin = [];

/* Mise à jour de la liste de positions des poubelles */
function updateTbin() {
  tbin = [];
  var allBins = document.querySelectorAll(".trash-bin");
  allBins.forEach(function (bin) {
    tbin.push(bin.getBoundingClientRect());
  });
}

/* 13) Fonction moveDown : fait descendre l'item, vérifie collisions */
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
