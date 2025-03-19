/*
script.js
Code complet pour :
 - Tri des détritus (images) + Pliage pour la canette et le carton
 - Déplacement (flèches), rotation (touche r), pliage (touche p)
 - Score (temps + tri + pli)
 - Boutons Start/Restart
 - Ajout progressif de poubelles
*/

/* 1) Images des poubelles */
const binImages = {
  plastique: "assets/Poubelle/bin_plastique.svg",
  inerte: "assets/Poubelle/bin_inerte.svg",
  papier: "assets/Poubelle/bin_papier.svg",
  verre: "assets/Poubelle/bin_verre.svg",
  organique: "assets/Poubelle/bin_organique.svg",
  métal: "assets/Poubelle/bin_metal.svg",
};

/*
2) Tableau associatif des détritus
   Remarque :
   - Les objets pliables ont un champ "images" (tableau)
   - Les autres ont un champ "img" (unique)
   - On garde "loose" pour le message d’erreur en cas de mauvaise poubelle
*/
/* 1) Tableau associatif des détritus fusionné */
let assoDetritus = {
  plastique: [
    {
      nom: "Bouteille plastique",
      interaction: 1,
      weight: 10,
      img: "assets/plastique/bouteille soda plastique.svg",
      loose:
        "Jeter ces bouteilles en plastique contribue à la dégradation de la biodiversité",
    },
    {
      nom: "Sac plastique",
      interaction: 1,
      weight: 30,
      img: "assets/plastique/sac plastique.svg",
      loose: "Les sacs plastiques sont très polluants pour l'environnement",
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
      loose: "Les bouteilles en verre sont recyclables",
    },
  ],
  papier: [
    {
      nom: "Journal",
      interaction: 2,
      weight: 5,
      img: "assets/papier/Journal.svg",
      loose: "Les journaux sont recyclables",
    },
    {
      nom: "Affiche",
      interaction: 2,
      weight: 5,
      img: "assets/papier/affiche.svg",
    },

    {
      nom: "Carton d'emballage",
      interaction: 2,
      weight: 15,
      images: [
        "assets/papier/carton/Carton 1.svg",
        "assets/papier/carton/Carton 2.svg",
        "assets/papier/carton/Carton 3.svg",
      ],
      loose: "Les cartons d'emballage sont recyclables",
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
      weight: 15,
      img: "assets/Métal/boite de conserve.svg",
      loose: "Les boîtes de conserve sont recyclables",
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

/* Ajout des boutons start / restart dans la page */
var startButton = document.createElement("button");
startButton.innerText = "Démarrer le jeu";
startButton.className = "button start-button";
document.body.appendChild(startButton);

var restartButton = document.createElement("button");
restartButton.innerText = "Relancer le jeu";
restartButton.className = "button restart-button";
restartButton.style.display = "none";
document.body.appendChild(restartButton);

/* Paramètres de déplacement & chute */
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
  maxRight = gameWidth - itemWidth;
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

/* Afficher le détritus (si images => foldIndex, sinon img) */
function afficherDetritus(obj) {
  if (obj.images) {
    // multi-états
    items.innerHTML = `
      <img
        src="${obj.images[obj.foldIndex]}"
        alt="${obj.nom}"
        style="width:100%; height:100%; object-fit:contain;"
      />
    `;
  } else if (obj.img) {
    // une seule image
    items.innerHTML = `
      <img
        src="${obj.img}"
        alt="${obj.nom}"
        style="width:100%; height:100%; object-fit:contain;"
      />
    `;
  }
  // Position
  items.style.left = positionX + "px";
  items.style.top = positionY + "px";
}

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
  document.querySelectorAll(".trash-bin").forEach((bin) => {
    tbin.push(bin.getBoundingClientRect());
  });
}

/* 13) Fonction moveDown : fait descendre l'item, vérifie collisions */
function moveDown() {
  positionY += speed;
  items.style.top = positionY + "px";

  // Si on touche le bas du #game => "dans la mer"
  if (items.getBoundingClientRect().bottom >= game.offsetHeight) {
    alert("Il ne faut en aucun cas jeter ses détritus dans la mer !");
    stopGame();
    return;
  }
  updateTbin(); // Mise à jour immédiate des positions des poubelles

  updateTbin();
  const itemRect = items.getBoundingClientRect();

  // Vérif collision poubelles
  for (let p = 0; p < poubelles.length; p++) {
    if (!tbin[p]) continue;
    let rect = tbin[p];
    if (
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

      // Réinitialiser l'objet
      resetObject();
      // Vérifier si on doit ajouter de nouvelles poubelles
      checkForNewBins();
    }
  }
}

/* Réinitialiser l'objet (nouveau détritus) */
function resetObject() {
  positionX = 0;
  positionY = 0;
  rotationAngle = 0;
  items.style.transform = "none";

  randomObject = genererDetritusSelonProbabilite();
  randomObject.foldIndex = 0; // état initial de pliage
  afficherDetritus(randomObject);
}

/* Ajouter éventuellement de nouvelles poubelles en fonction de detritusCount */
function checkForNewBins() {
  if (detritusCount === 5 && !document.getElementById("bin3")) {
    console.log("Ajout de la poubelle papier !");
    addNewBin("papier", "bin3");
    speed = 10;
  }
  if (detritusCount === 10 && !document.getElementById("bin4")) {
    console.log("Ajout de la poubelle verre !");
    addNewBin("verre", "bin4");
    speed = 10;
  }
  if (detritusCount === 15 && !document.getElementById("bin5")) {
    console.log("Ajout de la poubelle organique !");
    addNewBin("organique", "bin5");
    speed = 15;
  }
  if (detritusCount === 20 && !document.getElementById("bin6")) {
    console.log("Ajout de la poubelle métal !");
    addNewBin("métal", "bin6");
    speed = 1;
  }
}

/* Ajouter une nouvelle poubelle dynamique */
function addNewBin(type, id) {
  console.log(`Nouvelle poubelle : ${type}`);
  let newBin = new Poubelle(type, id);
  newBin.bin.classList.add("dynamic");
  poubelles.push(type);
  tbin.push(newBin.getBoundingClientRect());
}
