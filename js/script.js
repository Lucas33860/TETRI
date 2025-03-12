var items = document.getElementById("item");
let positionY = 0;
var speed = 5;
var speedmovement = 20;

function moveDown() {
  positionY += speed;
  items.style.top = positionY + "px";

  if (positionY >= 1000) {
    clearInterval(interval);
  }
}

var interval = setInterval(moveDown, 75);

function moveleft() {
  if (Keypressed)
    
}
