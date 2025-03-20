/*
script.js
Code complet pour :
 - Tri des détritus
 - Déplacement (flèches), rotation (touche r)
 - Pliage (touche f) si l'objet a plusieurs images (carton, canette...)
 - Score (+1/sec, +10 par bon tri, +20 si rotation 90 ou 270, +20 si plié)
 - Ajout progressif de poubelles
 - Affichage via images (poubelles + détritus)
*/

/* 1) Mapping des images de poubelles */
const binImages = {
  plastique: "assets/Poubelle/bin_plastique.svg",
  inerte: "assets/Poubelle/bin_inerte.svg",
  papier: "assets/Poubelle/bin_papier.svg",
  verre: "assets/Poubelle/bin_verre.svg",
  organique: "assets/Poubelle/bin_organique.svg",
  métal: "assets/Poubelle/bin_metal.svg",
};

/* 2) Tableau associatif des détritus (avec images) */
class Detritus {
  constructor(nom, interaction, weight, img, loose, orientation, images) {
    this.nom = nom;
    this.interaction = interaction;
    this.weight = weight;
    this.img = img;
    this.loose = loose;
    this.orientation = orientation;
    this.images = images;
  }
}

let assoDetritus = {
  plastique: [
    new Detritus(
      "Bouteille plastique",
      1,
      10,
      "assets/plastique/bouteille soda plastique.svg",
      "Jeter ces bouteilles en plastique contribue à la dégradation de la biodiversité",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Sac plastique",
      1,
      30,
      "assets/plastique/sac plastique.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Dentifrice",
      1,
      10,
      "assets/plastique/DENTIFRICE.svg",
      null,
      0
    ),
    new Detritus(
      "Sac plastique 2",
      1,
      30,
      "assets/plastique/Sac plastique 2.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Gel Douche",
      1,
      30,
      "assets/plastique/gel douche.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  verre: [
    new Detritus(
      "Bouteille de bière",
      0,
      15,
      "assets/Verre/Biere.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Bouteille de vin",
      0,
      20,
      "assets/Verre/Vin.svg",
      "Les bouteilles en verre sont recyclables",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  papier: [
    new Detritus(
      "Journal",
      2,
      5,
      "assets/papier/Journal.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Affiche",
      2,
      5,
      "assets/papier/affiche.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus("Carton d'emballage", 2, 15, null, null, 0, [
      "assets/papier/carton/Carton 1.svg",
      "assets/papier/carton/Carton 2.svg",
      "assets/papier/carton/Carton 3.svg",
    ]),
  ],
  organique: [
    new Detritus("Noix", 0, 10, "assets/organique/Noix.svg", null, 0),
    new Detritus("Pain", 0, 10, "assets/organique/Pain.svg", null, 0),
    new Detritus(
      "Pomme",
      0,
      10,
      "assets/organique/Pomme.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Sachet de thé",
      0,
      10,
      "assets/organique/sachet de thé.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  métal: [
    new Detritus(
      "Boite de conserve",
      2,
      10,
      "assets/Métal/boite de conserve.svg",
      null,
      0
    ),
    new Detritus(
      "Canette aluminium",
      2,
      10,
      null,
      "Les boîtes de conserve sont recyclables",
      Math.random() < 0.5 ? 0 : 1,
      [
        "assets/métal/canette/Canette 3.svg",
        "assets/métal/canette/Canette 2.svg",
        "assets/métal/canette/Canette 1.svg",
      ]
    ),
  ],
  inerte: [
    new Detritus(
      "Chips",
      0,
      20,
      "assets/inerte/Chips.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Mouchoir",
      0,
      20,
      "assets/inerte/Mouchoir.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "orange",
      0,
      20,
      "assets/inerte/orange.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "OS",
      0,
      20,
      "assets/inerte/os.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Pizza",
      0,
      20,
      "assets/inerte/Pizza.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Steak",
      0,
      20,
      "assets/inerte/Steak.svg",
      null,
      Math.random() < 0.5 ? 0 : 1
    ),
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
items.style.display = "none"; // Masquer l'élément items par défaut
var game = document.getElementById("game");

var startButton = document.createElement("button");
startButton.className = "button";
startButton.id = "startButton";
startButton.innerText = "Start";
document.body.appendChild(startButton);

var restartButton = document.createElement("button");
restartButton.className = "button";
restartButton.id = "restartButton";
restartButton.innerText = "Restart";
document.body.appendChild(restartButton);
restartButton.style.display = "none"; // Masquer le bouton restart au départ

var score = 0;
var scoreDisplay = document.createElement("div");
scoreDisplay.className = "score-display";
scoreDisplay.innerText = "Score: " + score;
document.querySelector(".score").appendChild(scoreDisplay);

var positionY = 0;
var positionX = 0;
var speed = 5; // vitesse de chute
var speedmovement = 50; // déplacement horizontal
var interval; // pour moveDown
var scoreInterval; // pour +1 point par seconde
var detritusCount = 0; // nombre de détritus triés
var rotationAngle = 0;

/* Pour limiter le déplacement latéral */
var gameWidth = game.offsetWidth;
var itemWidth = items.offsetWidth;
var maxLeft = -gameWidth + itemWidth;
var maxRight = gameWidth - itemWidth;

/* 5) Observer le redimensionnement de #game */
const resizeObserver = new ResizeObserver(function () {
  gameWidth = game.offsetWidth;
  maxLeft = -gameWidth + itemWidth;
  maxRight = game.offsetWidth - itemWidth;
});
resizeObserver.observe(game);

/* Empêcher le débordement en bas */
function preventOverflow() {
  if (positionY + items.offsetHeight > game.offsetHeight) {
    positionY = game.offsetHeight - items.offsetHeight;
    items.style.top = positionY + "px";
    preventOverflow();
  }
}

/* Fonctions Start / Stop */
function startGame() {
  items.style.display = "block";
  interval = setInterval(moveDown, 75);
  startButton.style.display = "none";
  restartButton.style.display = "none";

  detritusCount = 0;
  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;

  positionX = 0;
  positionY = 0;
  rotationAngle = 0;
  items.style.transform = "none";
  items.style.left = positionX + "px";
  items.style.top = positionY + "px";

  // Génère le premier détritus
  randomObject = genererDetritusSelonProbabilite();
  randomObject.foldIndex = 0; // initialisation du pliage
  afficherDetritus(randomObject);

  // Score +1 par seconde
  scoreInterval = setInterval(() => {
    score += 1;
    scoreDisplay.innerText = `Score: ${score}`;
  }, 1000);

  // Événements clavier (ajoutés ici pour éviter les doublons)
  document.addEventListener("keydown", movement);
}

function stopGame(showRestartButton = false) {
  clearInterval(interval);
  clearInterval(scoreInterval);
  document.removeEventListener("keydown", movement);

  // Masquer l'élément items
  items.style.display = "none";

  // Supprimer toutes les poubelles dynamiques
  document.querySelectorAll(".trash-bin").forEach((bin) => {
    bin.remove();
  });

  // Réinitialiser les poubelles à l'état initial
  poubelles = ["plastique", "inerte"];
  new Poubelle("plastique", "bin1");
  new Poubelle("inerte", "bin2");
  updateTbin();

  if (showRestartButton) {
    restartButton.style.display = "block";
  }
}

/* Boutons */
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

/* 5) Génération d'un détritus aléatoire selon probabilités */
function genererDetritusSelonProbabilite() {
  var tirage = Math.floor(Math.random() * 99);
  var typeChoisi;
  if (tirage <= 20) typeChoisi = "plastique";
  else if (tirage <= 40) typeChoisi = "verre";
  else if (tirage <= 60) typeChoisi = "papier";
  else if (tirage <= 80) typeChoisi = "organique";
  else if (tirage <= 100) typeChoisi = "métal";
  else typeChoisi = "inerte";

  var listeDetritus = assoDetritus[typeChoisi];
  var choix = listeDetritus[Math.floor(Math.random() * listeDetritus.length)];
  return { ...choix, type: typeChoisi };
}

/* Afficher le détritus dans l'élément items */
/* Gère plusieurs images si obj.images existe */
function afficherDetritus(obj) {
  if (obj.images && obj.images.length > 0) {
    let idx = obj.foldIndex || 0;
    let safeIndex = Math.min(idx, obj.images.length - 1);
    items.innerHTML = `
      <img src="${obj.images[safeIndex]}"
           alt="${obj.nom}"
           style="width:100%; height:100%; object-fit:contain;" />
    `;
  } else if (obj.img) {
    items.innerHTML = `
      <img src="${obj.img}"
           alt="${obj.nom}"
           style="width:100%; height:100%; object-fit:contain;" />
    `;
  } else {
    // Fallback
    items.innerHTML =
      '<div style="padding:10px;color:white;">' + obj.nom + "</div>";
  }
  let orientationStyle = "width: 80px; height: 80px;";
  items.style.transform =
    obj.orientation === 0 ? "rotate(0deg)" : "rotate(90deg)";
  console.log(
    "Orientation de l'objet:",
    obj.orientation === 0 ? "Verticale" : "Horizontale"
  );
  console.log("Angle de l'objet:", rotationAngle);
  console.log("Poubelle attendue:", obj.type);
}

/* 7) Initialiser le premier détritus (uniquement via l'image) */
var randomObject = genererDetritusSelonProbabilite();
afficherDetritus(randomObject);

/* 9) Classe Poubelle : on ajoute une image + texte */
class Poubelle {
  constructor(type, id) {
    this.type = type;
    this.bin = document.createElement("div");
    this.bin.className = "trash-bin text";
    this.bin.id = id;

    /* Création de l'image de poubelle */
    var binImg = document.createElement("img");
    binImg.src = binImages[type];
    binImg.alt = type;
    this.bin.appendChild(binImg);

    /* Ajout du texte sur la poubelle (facultatif) */
    var binText = document.createElement("p");
    binText.innerText = type;
    this.bin.appendChild(binText);

    document.querySelector(".bins").appendChild(this.bin);
  }
  getBoundingClientRect() {
    return this.bin.getBoundingClientRect();
  }
}

/* 10) Créer deux poubelles initiales (plastique, inerte) */
var bin1 = new Poubelle("plastique", "bin1");
var bin2 = new Poubelle("inerte", "bin2");

/* 11) Gérer le clavier (flèches + touche r + touche f pour plier) */
function movement(event) {
  if (event.key === "ArrowLeft") {
    positionX = Math.max(maxLeft, positionX - speedmovement);
    items.style.left = positionX + "px";
  } else if (event.key === "ArrowRight") {
    positionX = Math.min(maxRight, positionX + speedmovement);
    items.style.left = positionX + "px";
  } else if (event.key === "ArrowDown") {
    positionY = Math.min(
      game.offsetHeight - items.offsetHeight,
      positionY + 50
    );
    items.style.top = positionY + "px";
  } else if (event.key === "r") {
    // Ajuste la rotation de 90°
    rotationAngle += 90;
    items.style.transform = "rotate(" + rotationAngle + "deg)";
  } else if (event.key === "f") {
    if (randomObject.images && randomObject.images.length > 1) {
      randomObject.foldIndex = randomObject.foldIndex || 0;
      if (randomObject.foldIndex < randomObject.images.length - 1) {
        randomObject.foldIndex++;
      }
      afficherDetritus(randomObject);
    }
  }
  rotationAngle = rotationAngle % 360; // Assurer que l'angle reste dans [0, 360]

  // Applique la rotation initiale si l'objet est horizontal
  if (randomObject.orientation === 1) {
    items.style.transform = `rotate(${rotationAngle + 90}deg)`;
  } else {
    items.style.transform = `rotate(${rotationAngle}deg)`;
  }
  console.log("Angle de rotation:", rotationAngle);
}

items.style.left = positionX + "px";
items.style.top = positionY + "px";

// Le listener global est retiré ici pour éviter les doublons (il est ajouté dans startGame)
// document.addEventListener("keydown", movement);

/* 12) Mouvement automatique vers le bas */
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

  // Si on touche le bas du #game => "dans la mer"
  if (items.getBoundingClientRect().bottom >= game.offsetHeight) {
    clearInterval(interval);
    alert("Il ne faut en aucun cas jeter ses détritus dans la mer !");
    stopGame(true);
    return;
  }
  updateTbin();
  var itemRect = items.getBoundingClientRect();

  /* Vérification de collision avec chaque poubelle */
  for (var p = 0; p < poubelles.length; p++) {
    if (!tbin[p]) continue;
    var rect = tbin[p];
    if (
      itemRect.bottom >= rect.top &&
      itemRect.top <= rect.bottom &&
      itemRect.right >= rect.left &&
      itemRect.left <= rect.right
    ) {
      // ----- BONNE POUBELLE -----
      if (randomObject.type === poubelles[p]) {
        detritusCount++;
        score += 10; // 10 points for the correct bin
        console.log(`Détritus triés: ${detritusCount} (bonne poubelle)`);
        scoreDisplay.innerText = `Score: ${score}`;
        if (
          randomObject.orientation === 1 &&
          (rotationAngle === 90 || rotationAngle === 270)
        ) {
          score += 25; // 25 points for correct orientation
          console.log("Bonne orientation -> +25 points");
          rotationAngle = 0; // Reset rotation angle after scoring
        }
      } else if (poubelles[p] === "inerte") {
        detritusCount++;
        console.log("Mauvaise poubelle -> inerte par défaut");
        console.log(`Détritus triés: ${detritusCount}`);
      } else {
        alert(`Mauvaise Poubelle : ${randomObject.loose}`);
        stopGame(true);
        return;
      }

      // Réinitialiser la position + angle
      rotationAngle = 0;
      items.style.transform = "none";
      positionX = 0;
      positionY = 0;

      // Générer un nouvel objet
      randomObject = genererDetritusSelonProbabilite();
      randomObject.foldIndex = 0;
      afficherDetritus(randomObject);

      items.style.left = positionX + "px";
      items.style.top = positionY + "px";

      /* Ajout progressif de poubelles */
      if (detritusCount === 5) {
        addNewBin("papier", "bin3");
        updateTbin();
        speed = 10;
      }
      if (detritusCount === 10) {
        addNewBin("verre", "bin4");
        updateTbin();
        speed = 12;
      }
      if (detritusCount === 15) {
        addNewBin("organique", "bin5");
        updateTbin();
        speed = 15;
      }
      if (detritusCount === 20) {
        addNewBin("métal", "bin6");
        updateTbin();
        speed = 20;
      }
    }
  }
}

/* 14) Fonction pour ajouter une nouvelle poubelle */
function addNewBin(type, id) {
  new Poubelle(type, id);
  poubelles.push(type);
  updateTbin();
}
