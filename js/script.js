/*
script.js
Code complet pour :
 - Tri des détritus
 - Déplacement (flèches), rotation (touche r)
 - Score
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
let assoDetritus = {
  plastique: [
    {
      nom: "Bouteille plastique",
      interaction: 1,
      weight: 10,
<<<<<<< HEAD
      img: "assets/plastique/bouteille soda plastique.svg",
      loose:
        "Jeter ces bouteilles en plastique contribue à la dégradation de la biodiversité",
=======
      img: "assets/plastique/bouteille soda plastique.svg"
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
    },
    {
      nom: "Sac plastique",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/sac plastique.svg"
    },
    {
      nom: "Dentifrice",
      interaction: 1,
      weight: 10,
      img: "assets/plastique/DENTIFRICE.svg"
    },
    {
      nom: "Sac plastique 2",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/Sac plastique 2.svg"
    },
    {
      nom: "Gel Douche",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/gel douche.svg"
    }
  ],
  verre: [
    {
      nom: "Bouteille de bière",
      interaction: 0,
      weight: 15,
      img: "assets/Verre/Biere.svg"
    },
    {
      nom: "Bouteille de vin",
      interaction: 0,
      weight: 20,
<<<<<<< HEAD
      img: "assets/Verre/Vin.svg",
      loose: "Les bouteilles en verre sont recyclables",
    },
=======
      img: "assets/Verre/Vin.svg"
    }
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
  ],
  papier: [
    {
      nom: "Journal",
      interaction: 2,
      weight: 5,
      img: "assets/papier/Journal.svg"
    },
    {
      nom: "Affiche",
      interaction: 2,
      weight: 5,
      img: "assets/papier/affiche.svg"
    }
  ],
  organique: [
    {
      nom: "Noix",
      interaction: 0,
      weight: 10,
      img: "assets/organique/Noix.svg"
    },
    {
      nom: "Pain",
      interaction: 0,
      weight: 10,
      img: "assets/organique/Pain.svg"
    },
    {
      nom: "Pomme",
      interaction: 0,
      weight: 10,
      img: "assets/organique/Pomme.svg"
    },
    {
      nom: "Sachet de thé",
      interaction: 0,
      weight: 10,
      img: "assets/organique/sachet de thé.svg"
    }
  ],
  métal: [
    {
      nom: "Boite de conserve",
      interaction: 2,
<<<<<<< HEAD
      weight: 15,
      img: "assets/Métal/boite de conserve.svg",
      loose: "Les boîtes de conserve sont recyclables",
    },
=======
      weight: 10,
      img: "assets/Métal/boite de conserve.svg"
    }
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
  ],
  inerte: [
    {
      nom: "Chips",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Chips.svg"
    },
    {
      nom: "Mouchoir",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Mouchoir.svg"
    },
    {
      nom: "orange",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/orange.svg"
    },
    {
      nom: "OS",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/os.svg"
    },
    {
      nom: "Pizza",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Pizza.svg"
    },
    {
      nom: "Steak",
      interaction: 0,
      weight: 20,
      img: "assets/inerte/Steak.svg"
    }
  ]
};

/* 3) Les types de poubelles possibles */
var poubelles = [
  "plastique",
  "inerte",
  "papier",
  "verre",
  "organique",
  "métal"
];

/* 4) Variables globales et récupération d'éléments DOM */
var items = document.getElementById("item");
var game = document.getElementById("game");
var score = 0;
var scoreDisplay = document.createElement("div");
scoreDisplay.className = "score-display";
scoreDisplay.innerText = "Score: " + score;
document.querySelector(".score").appendChild(scoreDisplay);

var positionY = 0;
var positionX = 0;
<<<<<<< HEAD
var speed = 5; // vitesse de chute
var speedmovement = 50; // déplacement horizontal
var interval; // pour moveDown
var scoreInterval; // pour +1 point par seconde
var detritusCount = 0; // nombre de détritus triés
=======
var speed = 5;
var speedmovement = 50;
var detritusCount = 0;
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
var rotationAngle = 0;

/* Pour limiter le déplacement latéral */
var gameWidth = game.offsetWidth;
var itemWidth = items.offsetWidth;
var maxLeft = -gameWidth + itemWidth;
var maxRight = gameWidth - itemWidth;

/* 5) Observer le redimensionnement de #game */
const resizeObserver = new ResizeObserver(function() {
  gameWidth = game.offsetWidth;
  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;
});
resizeObserver.observe(game);

<<<<<<< HEAD
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

  score = 0;
  scoreDisplay.innerText = `Score: ${score}`;
  positionX = 0;
  positionY = 0;
  rotationAngle = 0;
  items.style.transform = "none";

  // Génère le premier détritus
  randomObject = genererDetritusSelonProbabilite();
  // foldIndex = 0 si c'est un objet pliable (images)
  randomObject.foldIndex = 0;
  afficherDetritus(randomObject);

  // Score +1 par seconde
  scoreInterval = setInterval(() => {
    score += 1;
    scoreDisplay.innerText = `Score: ${score}`;
  }, 1000);

  // Événements clavier
  document.addEventListener("keydown", movement);
}

function stopGame() {
  clearInterval(interval);
  clearInterval(scoreInterval);
  restartButton.style.display = "block";
  document.removeEventListener("keydown", movement);

  // Masquer l'élément items
  items.style.display = "none";

  // Supprimer les poubelles dynamiques
  document.querySelectorAll(".trash-bin.dynamic").forEach((bin) => {
    bin.remove();
  });
  // Réinitialiser tbin
  tbin = [];
  updateTbin();
}

/* Boutons */
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

/* 5) Génération d'un détritus aléatoire selon probabilités */
=======
/* 6) Générer un détritus aléatoirement selon des probabilités */
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
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

/* 7) Initialiser le premier détritus (uniquement via l'image) */
var randomObject = genererDetritusSelonProbabilite();
items.innerHTML =
    '<img src="' + randomObject.img + '" alt="' +
    randomObject.nom + '" style="width:100%; height:100%; object-fit:contain;" />';

<<<<<<< HEAD
=======
/* 8) Incrémenter le score chaque seconde */
setInterval(function() {
  score += 1;
  scoreDisplay.innerText = "Score: " + score;
}, 1000);

>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
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
<<<<<<< HEAD
    positionY = Math.min(
      game.offsetHeight - items.offsetHeight,
      positionY + 50
    );
=======
    positionY += 50;
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
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
  allBins.forEach(function(bin) {
    tbin.push(bin.getBoundingClientRect());
  });
}

/* 13) Fonction moveDown : fait descendre l'item, vérifie collisions */
function moveDown() {
  positionY += speed;
  items.style.top = positionY + "px";

<<<<<<< HEAD
  // Si on touche le bas du #game => "dans la mer"
  if (items.getBoundingClientRect().bottom >= game.offsetHeight) {
    clearInterval(interval); // Stoppe le mouvement immédiatement
    alert("Il ne faut en aucun cas jeter ses détritus dans la mer !");
    stopGame();
    return;
=======
  /* Quand l'objet sort de l'écran, on le remet en haut */
  if (items.getBoundingClientRect().bottom >= window.innerHeight) {
    rotationAngle = 0;
    items.style.transform = "none";
    positionX = 0;
    positionY = 0;
    randomObject = genererDetritusSelonProbabilite();
    items.innerHTML =
        '<img src="' + randomObject.img + '" alt="' +
        randomObject.nom + '" style="width:100%; height:100%; object-fit:contain;" />';
    items.style.left = positionX + "px";
    items.style.top = positionY + "px";
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)
  }
  updateTbin(); // Mise à jour immédiate des positions des poubelles

  updateTbin();
  var itemRect = items.getBoundingClientRect();

  /* Vérification de collision avec chaque poubelle */
  for (var p = 0; p < poubelles.length; p++) {
    if (!tbin[p]) continue;
    var rect = tbin[p];
    /* On touche la poubelle ET c'est la bonne ? -> Score + nouveau détritus */
    if (
<<<<<<< HEAD
      itemRect.bottom >= rect.top &&
      itemRect.top <= rect.bottom &&
      itemRect.right >= rect.left &&
      itemRect.left <= rect.right
    ) {
      // Bonne poubelle ?
      if (randomObject.type === poubelles[p]) {
        detritusCount++;
        score += 10;
        console.log(`Détritus triés: ${detritusCount} (bonne poubelle)`);
        scoreDisplay.innerText = `Score: ${score}`;
      } else if (poubelles[p] === "inerte") {
        // La poubelle "inerte" agit comme un fourre-tout
        // On ne donne pas de points si c'est faux
        if (randomObject.type !== "inerte") {
          detritusCount++;
          console.log("Mauvaise poubelle -> inerte par défaut");
          console.log(`Détritus triés: ${detritusCount}`);
        }
      } else {
        // Mauvaise poubelle => on arrête
        alert(`Mauvaise Poubelle : ${randomObject.loose}`);
        stopGame();
        return;
      }
=======
        itemRect.bottom >= rect.top &&
        itemRect.top <= rect.bottom &&
        itemRect.right >= rect.left &&
        itemRect.left <= rect.right &&
        randomObject.type === poubelles[p]
    ) {
      detritusCount++;
      score += 10;
      scoreDisplay.innerText = "Score: " + score;
>>>>>>> parent of e243c7d (refactor: enhance game mechanics with folding feature and dynamic bin addition)

      rotationAngle = 0;
      items.style.transform = "none";
      positionX = 0;
      positionY = 0;
      randomObject = genererDetritusSelonProbabilite();
      items.innerHTML =
          '<img src="' + randomObject.img + '" alt="' +
          randomObject.nom + '" style="width:100%; height:100%; object-fit:contain;" />';
      items.style.left = positionX + "px";
      items.style.top = positionY + "px";

      /* Ajout progressif de poubelles */
      if (detritusCount === 10) {
        addNewBin("papier", "bin3");
        updateTbin();
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
}

/* 14) Fonction pour ajouter une nouvelle poubelle */
function addNewBin(type, id) {
  var newBin = new Poubelle(type, id);
  poubelles.push(type);
  updateTbin();
}
