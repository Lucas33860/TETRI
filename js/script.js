//déclaration des variables

var items = document.getElementById("item"); //récupération de l'élément item
var positionY = 0;
var positionX = 0;
var speed = 20;
var speedmovement = 50;
var interval = setInterval(moveDown, 75); //déclaration de l'intervalle de temps pour la fonction moveDown
var game = document.querySelector(".game");
var item = document.querySelector(".object");
var gameWidth = game.offsetWidth; //récupération de la largeur du jeu
var itemWidth = item.offsetWidth; //récupération de la largeur de l'objet
var maxLeft = -gameWidth + itemWidth; //déclaration de la position maximale à gauche
var maxRight = gameWidth - itemWidth; //déclaration de la position maximale à droite

// Utilisation de ResizeObserver pour redéfinir maxLeft et maxRight
const resizeObserver = new ResizeObserver(() => {
  gameWidth = game.offsetWidth;
  maxLeft = -gameWidth + itemWidth;
  maxRight = gameWidth - itemWidth;
});

resizeObserver.observe(game);

// Déclaration de la classe Detritus pour créer les objets
class Detritus {
  constructor(name, type, weight) {
    this.name = name;
    this.type = type;
    this.weight = weight;
  }
}

// Déclaration des detritus de manière dynamique
var detritus = [
  new Detritus("Bouteille plastique", "plastique", 10),
  new Detritus("Bouteille de vin", "verre", 20),
  new Detritus("Paille", "plastique", 15),
  new Detritus("Bouteille de champagne", "verre", 25),
  new Detritus("Sac plastique", "plastique", 30),
];

//Déclaration des poubelles
var poubelles = [
  "plastique",
  "verre",
  "papier",
  "organique",
  "métal",
  "inerte",
];

// Déclaration du compteur de points
var score = 0;

// Déclaration de l'élément d'affichage du score
var scoreDisplay = document.createElement("div");
scoreDisplay.className = "score-display";
scoreDisplay.innerText = `Score: ${score}`;
document.querySelector(".score").appendChild(scoreDisplay);

// Déclaration de la classe Poubelle pour créer les poubelles
class Poubelle {
  constructor(type) {
    this.type = type;
    this.bin = document.createElement("div");
    this.bin.className = "trash-bin";
    this.bin.innerText = type;
    document.querySelector(".bin").appendChild(this.bin);
  }

  getBoundingClientRect() {
    return this.bin.getBoundingClientRect();
  }
}

const bin1 = new Poubelle("plastique");
const bin2 = new Poubelle("verre");
const bin3 = new Poubelle("papier");

var randomObject = detritus[Math.floor(Math.random() * detritus.length)]; //déclaration de l'objet aléatoire
items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}`; //affichage de l'objet aléatoire

document.addEventListener("keydown", movement); //déclaration de l'événement keydown

//fonction de déplacement du détritus gauche droite
function movement(event) {
  // empêcher le déplacement en dehors de la zone de jeu
  if (event.key === "ArrowLeft") {
    positionX -= speedmovement;
    if (positionX < maxLeft) {
      positionX = maxLeft;
    }
    items.style.left = positionX + "px";
  } else if (event.key === "ArrowRight") {
    positionX += speedmovement;
    if (positionX > maxRight) {
      positionX = maxRight;
    }
    items.style.left = positionX + "px";
  }
}

function moveDown() {
  //fonction de déplacement vers le bas
  positionY += speed;
  items.style.top = positionY + "px";
  var itemBottom = items.getBoundingClientRect().bottom;
  //Le détritut ne peux pas aller sous le sol
  if (itemBottom >= window.innerHeight) {
    positionX = 0;
    positionY = 0;
    items.style.left = positionX + "px";
    items.style.top = positionY + "px";
    randomObject = detritus[Math.floor(Math.random() * detritus.length)];
    items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;
    clearInterval(interval);
    interval = setInterval(moveDown, 75);
  }

  // Vérification de la collision avec la poubelle 1
  // Récupération des dimensions de l'élément item et des poubelles
  var itemsize = items.getBoundingClientRect(); //récupération des dimensions de l'élément item

  let tbin = [];
  tbin.push(bin1.getBoundingClientRect());
  tbin.push(bin2.getBoundingClientRect());

  for (let p = 0; p < 2; p++) {
    // Vérification de la collision avec les poubelles
    if (
      itemsize.bottom >= tbin[p].top &&
      itemsize.top <= tbin[p].bottom &&
      itemsize.right >= tbin[p].left &&
      itemsize.left <= tbin[p].right &&
      randomObject.type === poubelles[p] // Vérifie que l'objet est du même type que la poubelle
    ) {
      // Mise à jour du score
      score += 10;
      scoreDisplay.innerText = `Score: ${score}`;

      // On repositionne l'objet en haut de l'écran, on change l'objet et le texte
      positionX = 0;
      positionY = 0;
      items.style.left = positionX + "px";
      items.style.top = positionY + "px";
      randomObject = detritus[Math.floor(Math.random() * detritus.length)];
      items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;
    }
  }
}
