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
var bin1 = document.getElementById("bin1");
var bin2 = document.getElementById("bin2");

//Déclaration des objets
var detritus = [
  { name: "Bouteille plastique", type: "plastique", weight: 10 },
  { name: "Bouteille de vin", type: "verre", weight: 20 },
  { name: "Paille", type: "plastique", weight: 15 },
  { name: "Bouteille de champagne", type: "verre", weight: 25 },
  { name: "Sac plastique ", type: "plastique", weight: 30 },
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

  for (let p = 0; p < 2; p = p + 1) {
    // Vérification de la collision avec la poubelle
    if (
      itemsize.bottom >= tbin[p].top &&
      itemsize.top <= tbin[p].bottom &&
      itemsize.right >= tbin[p].left &&
      itemsize.left <= tbin[p].right &&
      randomObject.type == poubelles[p]
    ) {
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
