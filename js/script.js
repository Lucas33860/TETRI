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
      0.02,
      "assets/plastique/bouteille soda plastique.svg",
      "Les bouteilles en plastique mettent des centaines d'années à se décomposer.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Sac plastique",
      1,
      0.01,
      "assets/plastique/sac plastique.svg",
      "Les sacs en plastique sont une menace pour la faune marine.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Dentifrice",
      1,
      0.05,
      "assets/plastique/DENTIFRICE.svg",
      "Les tubes de dentifrice sont souvent faits de plastique non recyclable.",
      0
    ),
    new Detritus(
      "Sac plastique 2",
      1,
      0.01,
      "assets/plastique/Sac plastique 2.svg",
      "Les sacs en plastique sont une menace pour la faune marine.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Gel Douche",
      1,
      0.25,
      "assets/plastique/gel douche.svg",
      "Les bouteilles de gel douche sont souvent faites de plastique non recyclable.",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  verre: [
    new Detritus(
      "Bouteille de bière",
      0,
      0.5,
      "assets/Verre/Biere.svg",
      "Les bouteilles en verre sont 100% recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Bouteille de vin",
      0,
      0.75,
      "assets/Verre/Vin.svg",
      "Les bouteilles en verre sont 100% recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  papier: [
    new Detritus(
      "Journal",
      2,
      0.2,
      "assets/papier/Journal.svg",
      "Le papier peut être recyclé plusieurs fois.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Affiche",
      2,
      0.1,
      "assets/papier/affiche.svg",
      "Le papier peut être recyclé plusieurs fois.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Carton d'emballage",
      2,
      0.5,
      null,
      "Le carton est recyclable.",
      0,
      [
        "assets/papier/carton/Carton 1.svg",
        "assets/papier/carton/Carton 2.svg",
        "assets/papier/carton/Carton 3.svg",
      ]
    ),
  ],
  organique: [
    new Detritus(
      "Noix",
      0,
      0.02,
      "assets/organique/Noix.svg",
      "Les déchets organiques peuvent être compostés.",
      0
    ),
    new Detritus(
      "Pain",
      0,
      0.1,
      "assets/organique/Pain.svg",
      "Les déchets organiques peuvent être compostés.",
      0
    ),
    new Detritus(
      "Pomme",
      0,
      0.15,
      "assets/organique/Pomme.svg",
      "Les déchets organiques peuvent être compostés.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Sachet de thé",
      0,
      0.01,
      "assets/organique/sachet de thé.svg",
      "Les sachets de thé peuvent être compostés.",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  métal: [
    new Detritus(
      "Boite de conserve",
      2,
      0.2,
      "assets/Métal/boite de conserve.svg",
      "Les boîtes de conserve sont recyclables.",
      0
    ),
    new Detritus(
      "Canette aluminium",
      2,
      0.03,
      null,
      "Les canettes en aluminium sont recyclables.",
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
      0.05,
      "assets/inerte/Chips.svg",
      "Les emballages de chips ne sont pas recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Mouchoir",
      0,
      0.01,
      "assets/inerte/Mouchoir.svg",
      "Les mouchoirs en papier ne sont pas recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "orange",
      0,
      20,
      "assets/inerte/orange.svg",
      "Les déchets organiques peuvent être compostés.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "OS",
      0,
      0.1,
      "assets/inerte/os.svg",
      "Les os ne sont pas recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Pizza",
      0,
      0.3,
      "assets/inerte/Pizza.svg",
      "Les restes de pizza ne sont pas recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Steak",
      0,
      0.25,
      "assets/inerte/Steak.svg",
      "Les restes de viande ne sont pas recyclables.",
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
scoreDisplay.innerText = "Score : " + score;
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
  resetWasteWeights();
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
var poubelles = ["plastique", "inerte"];

/* 5) Génération d'un détritus aléatoire correspondant UNIQUEMENT aux poubelles visibles */
function genererDetritusSelonProbabilite() {
  // Sélection aléatoire d'un type de poubelle parmi celles disponibles actuellement
  var typeChoisi = poubelles[Math.floor(Math.random() * poubelles.length)];

  // Choisir un détritus aléatoire dans le type sélectionné
  var listeDetritus = assoDetritus[typeChoisi];
  var choix = listeDetritus[Math.floor(Math.random() * listeDetritus.length)];

  return { ...choix, type: typeChoisi };
}

// Fonction pour ajouter progressivement de nouvelles poubelles
function addNewBin(type, id) {
  new Poubelle(type, id);
  poubelles.push(type);
  updateTbin();
}

// Exemple de condition pour l'ajout progressif (à intégrer dans ta fonction existante)
function gestionProgressiveDesPoubelles(detritusCount) {
  if (detritusCount === 5) addNewBin("papier", "bin3");
  if (detritusCount === 10) addNewBin("verre", "bin4");
  if (detritusCount === 15) addNewBin("organique", "bin5");
  if (detritusCount === 20) addNewBin("métal", "bin6");
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
        addWaste(randomObject.type, randomObject.weight);
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
      if (detritusCount === 3) {
        addNewBin("papier", "bin3");
        updateTbin();
        speed = 10;
      }
      if (detritusCount === 8) {
        addNewBin("verre", "bin4");
        updateTbin();
        speed = 12;
      }
      if (detritusCount === 13) {
        addNewBin("organique", "bin5");
        updateTbin();
        speed = 15;
      }
      if (detritusCount === 16) {
        addNewBin("métal", "bin6");
        updateTbin();
        speed = 15;
      }
      if (detritusCount === 30) {
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

var wasteWeights = {
  plastique: 0,
  papier: 0,
  métal: 0,
  verre: 0,
  organique: 0,
  inerte: 0,
};

var ctx = document.getElementById("wasteChart").getContext("2d");

var wasteChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Plastique", "Papier", "Métal", "Verre", "Organique", "Inerte"],
    datasets: [
      {
        label: "Poids (kg) par poubelle",
        data: Object.values(wasteWeights),
        backgroundColor: [
          "#D0B711",
          "#2513B0",
          "#BE1C1C",
          "#216623",
          "#BF6B24",
          "#494848",
        ],
        borderRadius: 8, // Ajoute des bords arrondis pour un meilleur rendu
      },
    ],
  },
  options: {
    indexAxis: "y", // Affichage horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }, // Affiche la légende "Poids (kg) par poubelle"
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.raw + " kg"; // Affiche le poids clairement
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: "rgba(200, 200, 200, 0.3)" },
        ticks: { color: "#FFF", font: { size: 14 } }, // Texte lisible
      },
      y: {
        ticks: { color: "#FFF", font: { size: 14 } }, // Texte lisible
      },
    },
  },
});

// Mise à jour dynamique pendant le jeu
function updateWasteChart() {
  wasteChart.data.datasets[0].data = Object.values(wasteWeights);
  wasteChart.update();
}

function addWaste(type, weight) {
  if (wasteWeights.hasOwnProperty(type)) {
    wasteWeights[type] += weight;
    updateWasteChart(); // Met à jour le graphique instantanément
  }
}

function resetWasteWeights() {
  for (let type in wasteWeights) {
    if (wasteWeights.hasOwnProperty(type)) {
      wasteWeights[type] = 0;
    }
  }
  updateWasteChart();
}
