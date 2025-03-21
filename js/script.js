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
      0.0055,
      "assets/plastique/bouteille soda plastique.svg",
      "Ce n'est pas la bonne poubelle. Les bouteilles en plastique se recyclent (souvent dans le poubelle jaune). Il est important de les trier correctement car, en 2025, plus d'un million d'oiseaux de mer sont morts à cause d'une overdose de plastique.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Sac plastique",
      1,
      0.0055,
      "assets/plastique/sac plastique.svg",
      "Attention, il faut recycler les sacs plastiques ! En 2025, on estime qu'il y a 75 à 199 millions de tonnes de déchets plastiques dans nos océans. Retiens bien, le sac plastique se jette dans la poubelle de recyclage (souvent la poubelle jaune).",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Dentifrice",
      0,
      0.015,
      "assets/plastique/DENTIFRICE.svg",
      "Oups, mauvaise poubelle. Tu peux recycler (souvent dans la poubelle jaune) ce tube de dentifrice vide. Les déchets plastiques mettent des centaines d'années à se décomposer, mais ça ne te prends que quelques secondes de bien trier. N'oublie pas de recycler tes déchets plastiques !",
      0
    ),
    new Detritus(
      "Sac plastique 2",
      1,
      0.0055,
      "assets/plastique/Sac plastique 2.svg",
      "Attention, il faut recycler les sacs plastiques ! En 2025, on estime qu'il y a 75 à 199 millions de tonnes de déchets plastiques dans nos océans. Retiens bien, le sac plastique se jette dans la poubelle de recyclage (souvent la poubelle jaune).",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Gel Douche",
      1,
      0.0,
      "assets/plastique/gel douche.svg",
      "Ne te trompe pas, le plastique se recycle (souvent dans la poubelle jaune). C'est une très grande source de pollution des écosystèmes, notamment marins.",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  verre: [
    new Detritus(
      "Bouteille de bière",
      1,
      0.25,
      "assets/Verre/Biere.svg",
      "Attention, une bouteille en verre doit aller dans le bac de recyclage du verre. D'ailleurs, le verre est recyclable à 100% et peut être refondu à l'infini sans perdre en qualité.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Bouteille de vin",
      1,
      0.5,
      "assets/Verre/Vin.svg",
      "Attention, une bouteille en verre doit aller dans le bac de recyclage du verre. D'ailleurs, le verre est recyclable à 100% et peut être refondu à l'infini sans perdre en qualité.",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  papier: [
    new Detritus(
      "Journal",
      1,
      0.2,
      "assets/papier/Journal.svg",
      "Raté ! Le journal se jette dans la poubelle de recyclage du papier et du carton. Le papier recyclé permet de réduire la déforestation et d'économiser de l'énergie.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Affiche",
      1,
      0.05,
      "assets/papier/affiche.svg",
      "Le recyclage du papier permet de réduire la consommation d'eau et d'énergie.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Carton d'emballage",
      2,
      0.5,
      "assets/papier/carton/Carton 1.svg",
      "Non, ce carton ne va pas ici. Il doit se jeter dans la poubelle de recyclage du papier et du carton : cela permet d'économiser des ressources naturelles et de l'énergie ! Un geste important pour la planète.",
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
      0.008,
      "assets/organique/Noix.svg",
      "Mauvaise poubelle ! En petite quantité, la coquille de noix se met au compost. En compostant, on réduit la quantité de déchets organiques envoyés aux ordures ménagères : donc moins de pollution !",
      0
    ),
    new Detritus(
      "Pain",
      0,
      0.05,
      "assets/organique/Pain.svg",
      "Pas dans cette poubelle ! En petites quantités, les restes de pain se mettent au compost. C'est rapide, et ça ne mange pas de pain !",
      0
    ),
    new Detritus(
      "Pomme",
      1,
      0.02,
      "assets/organique/Pomme.svg",
      "Non, erreur de tri ! Le trognon de pomme est un déchet organique : il peut aller au compost au lieu de finir à la poubelle.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Sachet de thé",
      1,
      0.003,
      "assets/organique/sachet de thé.svg",
      "Tu t'es trompé.e. Le sachet de thé, lorsqu'il est conçu en papier biodégradable, peut aller au compost. Grâce au compost, tu peux avoir un engrais naturel pour ton jardin !",
      Math.random() < 0.5 ? 0 : 1
    ),
  ],
  métal: [
    new Detritus(
      "Boite de conserve",
      1,
      0.2,
      "assets/Métal/boite de conserve.svg",
      "Mauvaise poubelle. La boîte de conserve se place dans le bac de recyclage des métaux. L'aluminium est recyclable à 100% et à l'infini, fais donc ce geste pour la planète !",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Canette",
      2,
      0.015,
      "assets/métal/canette/Canette 1.svg",
      "Mauvaise poubelle. La canette se place dans le bac de recyclage des métaux. L'aluminium est recyclable à 100% et à l'infini, fais donc ce geste pour la planète !",
      0,
      [
        "assets/métal/canette/Canette 1.svg",
        "assets/métal/canette/Canette 2.svg",
        "assets/métal/canette/Canette 3.svg",
      ]
    ),
  ],
  inerte: [
    new Detritus(
      "Chips",
      1,
      0.08,
      "assets/inerte/Chips.svg",
      "Ah non ! Même s’il brille comme de l’alu, ton paquet de chips contient aussi du plastique. Résultat ? Il n’est pas recyclable et doit finir dans la poubelle des déchets non recyclables.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "Mouchoir",
      1,
      0.004,
      "assets/inerte/Mouchoir.svg",
      "Oups, ce mouchoir ne va pas là ! Il doit être jeté dans la poubelle des déchets ménagers (souvent la poubelle noire). Les mouchoirs prennent plusieurs années à se décomposer lorsqu'ils sont jetés dans la nature, il faut donc les jeter dans la bonne poubelle.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "orange",
      1,
      0.2,
      "assets/inerte/orange.svg",
      "Les oranges doivent être jetées dans les déchets inertes.",
      Math.random() < 0.5 ? 0 : 1
    ),
    new Detritus(
      "OS",
      1,
      0.1,
      "assets/inerte/os.svg",
      "Les os doivent être jeté dans les déchets inertes.",
      0
    ),
    new Detritus(
      "Pizza",
      1,
      0.15,
      "assets/inerte/Pizza.svg",
      "Non, la part de pizza se jette dans la poubelle des déchets ménagers (souvent la poubelle noire).",
      0
    ),
    new Detritus(
      "Steak",
      0,
      0.18,
      "assets/inerte/Steak.svg",
      "Mauvaise poubelle ! Les déchets de viande doivent être jetés avec les ordures ménagères (souvent la poubelle noire). D’ailleurs, savais-tu que la viande en décomposition produit du méthane, un gaz 25 fois plus puissant que le CO₂ pour le réchauffement climatique ? Pense à réduire le gaspillage !",
      0
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
var items = document.querySelector(".item");
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
var gameWidth = game.clientWidth;
var itemWidth = items ? items.offsetWidth : 80; // Prend le premier item s'il existe, sinon 80px par défaut

var maxLeft = -gameWidth + itemWidth;
var maxRight = gameWidth - itemWidth;

/* 5) Observer le redimensionnement de #game */
const resizeObserver = new ResizeObserver(function () {
  gameWidth = game.clientWidth; // Met à jour la largeur du jeu
  itemWidth = items ? items.offsetWidth : 80; // Met à jour la largeur d'un item

  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;

  // Vérifie que l'item reste bien dans les limites après redimensionnement
  let itemLeft = parseInt(items.style.left || 0, 10);

  if (itemLeft < maxLeft) {
    items.style.left = maxLeft + "px";
  } else if (itemLeft > maxRight) {
    items.style.left = maxRight + "px";
  }
});
resizeObserver.observe(game);

/* Empêcher le débordement en bas */
function preventOverflow(item) {
  let positionY = parseInt(item.style.top || 0, 10);

  if (positionY + item.offsetHeight > game.clientHeight) {
    positionY = game.clientHeight - item.offsetHeight;
    item.style.top = positionY + "px";
  }
}

function moveDown() {
  positionY += speed;
  items.style.top = positionY + "px";

  if (items.getBoundingClientRect().bottom >= game.offsetHeight) {
    clearInterval(interval);
    alert("Il ne faut en aucun cas jeter ses détritus dans la mer !");
    stopGame(true);
    return;
  }

  updateTbin();
  const itemRect = items.getBoundingClientRect();

  for (let p = 0; p < poubelles.length; p++) {
    if (!tbin[p]) continue;
    const rect = tbin[p];
    if (
      itemRect.bottom >= rect.top &&
      itemRect.top <= rect.bottom &&
      itemRect.right >= rect.left &&
      itemRect.left <= rect.right
    ) {
      items.style.display = "none";

      const objetCourant = randomObject;

      if (objetCourant.type === poubelles[p]) {
        detritusCount++;
        score += 10;

        if (
          objetCourant.orientation === 1 &&
          (rotationAngle === 90 || rotationAngle === 270)
        ) {
          score += 10;
          console.log("Bonne orientation -> +20 points");
        }

        if (
          objetCourant.images &&
          objetCourant.foldIndex === objetCourant.images.length - 1
        ) {
          score += 20;
          console.log("Objet plié -> +20 points");
        }

        addWaste(objetCourant.type, objetCourant.weight);
        scoreDisplay.innerText = `Score: ${score}`;
      } else {
        alert(`Mauvaise Poubelle : ${objetCourant.loose}`);
        stopGame(true);
        return;
      }

      positionX = 0;
      positionY = 0;
      rotationAngle = 0;
      items.style.transform = "none";
      items.style.left = positionX + "px";
      items.style.top = positionY + "px";

      randomObject = genererDetritusSelonProbabilite();
      randomObject.foldIndex = 0;

      afficherDetritus(randomObject);
      items.style.display = "block";

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
        speed = 10;
      }
      if (detritusCount === 16) {
        addNewBin("métal", "bin6");
        updateTbin();
        speed = 10;
      }
      if (detritusCount === 30) {
        speed = 15;
      }
      if (detritusCount === 50) {
        speed = 20;
      }

      break;
    }
  }
}

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
  var typeChoisi = poubelles[Math.floor(Math.random() * poubelles.length)];
  var listeDetritus = assoDetritus[typeChoisi];
  var choix = listeDetritus[Math.floor(Math.random() * listeDetritus.length)];

  return { ...choix, type: typeChoisi, foldIndex: 0 }; // Initialisation de foldIndex à 0
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
