// Déclaration des variables
var items = document.getElementById("item"); // Récupération de l'élément item
var positionY = 0;
var positionX = 0;
var speed = 5;
var speedmovement = 50;
var interval = setInterval(moveDown, 75); // Déclaration de l'intervalle de temps pour la fonction moveDown
var game = document.querySelector("#game");
var item = document.querySelector(".item");
var gameWidth = game.offsetWidth; // Récupération de la largeur du jeu
var itemWidth = item.offsetWidth; // Récupération de la largeur de l'objet
var maxLeft = -gameWidth + itemWidth; // Déclaration de la position maximale à gauche
var maxRight = gameWidth - itemWidth; // Déclaration de la position maximale à droite

// Observer pour adapter les dimensions au redimensionnement de la fenêtre
const resizeObserver = new ResizeObserver(() => {
  gameWidth = game.offsetWidth;
  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;
});

resizeObserver.observe(game);

// Classe représentant un détritus
class Detritus {
  constructor(name, type, weight) {
    this.name = name;
    this.type = type;
    this.weight = weight;
  }
}

// Liste des détritus disponibles, triés par type
var detritus = [
  new Detritus("Bouteille plastique", "plastique", 10),
  new Detritus("Paille", "plastique", 15),
  new Detritus("Sac plastique", "plastique", 30),
  new Detritus("Bouteille de vin", "verre", 20),
  new Detritus("Bouteille de champagne", "verre", 25),
  new Detritus("Paille plastique", "plastique", 5),
  new Detritus("Sac plastique", "plastique", 15),
  new Detritus("Gobelet plastique", "plastique", 8),
  new Detritus("Pot en verre", "verre", 12),
  new Detritus("Verre cassé", "verre", 7),
  new Detritus("Journal", "papier", 5),
  new Detritus("Carton d'emballage", "papier", 15),
  new Detritus("Feuille imprimée", "papier", 3),
  new Detritus("Magazine", "papier", 7),
  new Detritus("Épluchures de légumes", "organique", 10),
  new Detritus("Pomme pourrie", "organique", 12),
  new Detritus("Reste de repas", "organique", 15),
  new Detritus("Feuilles mortes", "organique", 5),
  new Detritus("Canette aluminium", "métal", 10),
  new Detritus("Boîte de conserve", "métal", 15),
  new Detritus("Capsule métallique", "métal", 3),
  new Detritus("Ferraille rouillée", "métal", 25),
  new Detritus("Caillou", "inerte", 20),
  new Detritus("Brique cassée", "inerte", 30),
  new Detritus("Morceau de béton", "inerte", 35),
  new Detritus("Céramique cassée", "inerte", 12),
];

// Types de poubelles
var poubelles = [
  "plastique",
  "verre",
  "papier",
  "organique",
  "métal",
  "inerte",
];

// Score du joueur
var score = 0;

// Affichage du score
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

// Création des poubelles
const bin1 = new Poubelle("plastique", "bin1");
const bin2 = new Poubelle("inerte", "bin2");

// Fonction pour générer un détritus aléatoirement selon des probabilités
function genererDetritusSelonProbabilite() {
  const tirage = Math.floor(Math.random() * 99);

  let typeChoisi;

  if (tirage <= 20) typeChoisi = "plastique";
  else if (tirage <= 40) typeChoisi = "verre";
  else if (tirage <= 55) typeChoisi = "papier";
  else if (tirage <= 70) typeChoisi = "organique";
  else if (tirage <= 85) typeChoisi = "métal";
  else typeChoisi = "inerte";

  console.log(tirage);

  const detritusFiltre = detritus.filter((d) => d.type === typeChoisi);

  return detritusFiltre[Math.floor(Math.random() * detritusFiltre.length)];
}

// Initialiser l'objet avec un détritus aléatoire
var randomObject = genererDetritusSelonProbabilite();
items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;

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

// Mouvement automatique vers le bas et vérification de collision avec poubelle ou bas de fenêtre
function moveDown() {
  positionY += speed;
  items.style.top = positionY + "px";

  if (items.getBoundingClientRect().bottom >= window.innerHeight) {
    positionX = 0;
    positionY = 0;
    randomObject = genererDetritusSelonProbabilite();
    items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;
  }

  [bin1, bin2].forEach((bin, index) => {
    var rect = bin.getBoundingClientRect();
    var itemRect = items.getBoundingClientRect();

    tbin = [];
    tbin.push(bin1.getBoundingClientRect());
    tbin.push(bin2.getBoundingClientRect());

    for (let p = 0; p < tbin.length; p++) {
      // Vérification de la collision avec les poubelles
      if (
        itemRect.bottom >= rect.top &&
        itemRect.top <= rect.bottom &&
        itemRect.right >= rect.left &&
        itemRect.left <= rect.right &&
        randomObject.type === poubelles[index]
      ) {
        detritusCount++;
        console.log(detritusCount);

        score += 10;
        scoreDisplay.innerText = `Score: ${score}`;
        positionX = 0;
        positionY = 0;
        randomObject = genererDetritusSelonProbabilite();
        items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;

        // Ajouter de nouvelles poubelles en fonction du nombre de détritus triés
        if (detritusCount === 10) {
          addNewBin("papier", "bin3");
          speed = 10;
        }
        if (detritusCount === 20) {
          addNewBin("organique", "bin4");
          speed = 15;
        }
        if (detritusCount === 30) {
          addNewBin("métal", "bin5");
          speed = 20;
        }
        if (detritusCount === 40) {
          addNewBin("verre", "bin6");
          speed = 25;
        }
      }
    }
  });
}

let detritusCount = 0;

function addNewBin(type, id) {
  const newBin = new Poubelle(type, id);
  tbin.push(newBin.getBoundingClientRect());
  poubelles.push(type);
}

// chaque detritus a une et une seule interaction possible :
// 0: rien
// 1: splité (bocal, boite a pizza de sa part de pizza)
// 2 : plié (cannette, boite de conserve, journal, carton d'emballage)
// x orienté TOUT PEUT ETRE ORIENTE

let assoTab = {
  inert: [
    { nom: "orange.jpg", interaction: 0 },
    { nom: "mouchoir.jpg", interaction: 0 },
    { nom: "viande.jpg", interaction: 0 },
  ],
  plastic: ["sac.jpg", "barquette.jpg", "pot.jpg"],
  verre: ["bouteille_vin.jpg", "bouteille_biere.jpg", "bocal.jpg"],
};

// Tableau associatif (où les index sont des chaines de caracteres)
console.log("assoTab", assoTab);
// afficher tous les plastics
console.log('assoTab["plastic"]', assoTab["plastic"]);
// afficher toutes les clés (index) : pastic et verre
console.log("Object.keys(assoTab)", Object.keys(assoTab));
// afficher tous les plastics (en utilisant un indexe numérique) équivalent à assoTab["plastic"] # assoTab[0]
console.log(
  "assoTab[Object.keys(assoTab)[0]]",
  assoTab[Object.keys(assoTab)[0]]
);
// afficher le 3ème plastic
console.log('assoTab["plastic"][2]', assoTab["plastic"][2]);

/*
let assoTab = {"inert":["orange.jpg","mouchoir.jpg","viande.jpg"],
"plastic" : ["sac.jpg","barquette.jpg","pot.jpg"],
"verre" : ["bouteille_vin.jpg","bouteille_biere.jpg","bocal.jpg"],
}


// Tableau associatif (où les index sont des chaines de caracteres)
console.log("assoTab",assoTab);
// afficher tous les plastics
console.log("assoTab[\"plastic\"]",assoTab["plastic"]);
// afficher toutes les clés (index) : pastic et verre
console.log("Object.keys(assoTab)",Object.keys(assoTab));
// afficher tous les plastics (en utilisant un indexe numérique) équivalent à assoTab["plastic"] # assoTab[0]
console.log("assoTab[Object.keys(assoTab)[0]]",assoTab[Object.keys(assoTab)[0]]);
// afficher le 3ème plastic
console.log("assoTab[\"plastic\"][2]",assoTab["plastic"][2]);


*/
