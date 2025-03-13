//déclaration des variables

var items = document.getElementById("item"); //récupération de l'élément item
var positionY = 0;
var positionX = 0;
var speed = 5;
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
var objects = [
  { name: "Bouteille plastique", type: "plastique", weight: 10 },
  { name: "Bouteille de vin", type: "verre", weight: 20 },
  { name: "Paille", type: "plastique", weight: 15 },
  { name: "Bouteille de champagne", type: "verre", weight: 25 },
  { name: "Sac plastique ", type: "plastique", weight: 30 },
];

var randomObject = objects[Math.floor(Math.random() * objects.length)]; //déclaration de l'objet aléatoire
items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}`; //affichage de l'objet aléatoire

document.addEventListener("keydown", movement); //déclaration de l'événement keydown

function movement(event) {
  //fonction de déplacement et empêcher le déplacement en dehors de la zone de jeu
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
  if (itemBottom >= window.innerHeight) {
    positionX = 0;
    positionY = 0;
    items.style.left = positionX + "px";
    items.style.top = positionY + "px";
    randomObject = objects[Math.floor(Math.random() * objects.length)];
    items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;
    clearInterval(interval);
    interval = setInterval(moveDown, 75);
  }

  // Vérification de la collision avec la poubelle 1
  var itemsize = items.getBoundingClientRect(); //récupération des dimensions de l'élément item
  var bin1size = bin1.getBoundingClientRect(); //récupération des dimensions de la poubelle 1
  var bin2size = bin2.getBoundingClientRect(); //récupération des dimensions de la poubelle 2

  if (
    itemsize.bottom >= bin1size.top &&
    itemsize.top <= bin1size.bottom &&
    itemsize.right >= bin1size.left &&
    itemsize.left <= bin1size.right &&
    randomObject.type === "plastique"
  ) {
    positionX = 0;
    positionY = 0;
    items.style.left = positionX + "px";
    items.style.top = positionY + "px";
    randomObject = objects[Math.floor(Math.random() * objects.length)];
    items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;
    clearInterval(interval);
    interval = setInterval(moveDown, 75);
  }

  if (
    itemsize.bottom >= bin2size.top &&
    itemsize.top <= bin2size.bottom &&
    itemsize.right >= bin2size.left &&
    itemsize.left <= bin2size.right &&
    randomObject.type === "verre"
  ) {
    positionX = 0;
    positionY = 0;
    items.style.left = positionX + "px";
    items.style.top = positionY + "px";
    randomObject = objects[Math.floor(Math.random() * objects.length)];
    items.innerText = `${randomObject.name} - ${randomObject.type} - ${randomObject.weight}kg`;
    clearInterval(interval);
    interval = setInterval(moveDown, 75);
  }
}
