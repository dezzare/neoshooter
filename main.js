const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png', 'img/monster-4.png'];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;


// movimento e tiro
function flyShip(event) {
  if (event.key === 'k') {
    event.preventDefault();
    moveUp();
  } else if (event.key === 'j') {
    event.preventDefault();
    moveDown();
  } else if (event.key === " " || event.key === 'x') {
    event.preventDefault();
    fireLaser();
  } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    alert(`Este não é um jogo para crianças!
Utilize as teclas 'j' e 'k' para movimentação correta.`)

  }
}


function moveUp() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
  if (topPosition === "0px") {
    return
  } else {
    let position = parseInt(topPosition);
    position -= 25;
    yourShip.style.top = `${position}px`;
  }
}

function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
  if (topPosition === "510px") {
    return
  } else {
    let position = parseInt(topPosition);
    position += 25;
    yourShip.style.top = `${position}px`;
  }
}


// tiro
function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

function createLaserElement() {
  let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
  let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
  let newLaser = document.createElement('img');
  newLaser.src = 'img/shoot.png';
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition + 15}px`;
  return newLaser;
}

function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll('.alien');

    aliens.forEach((alien) => {
      if (checkLaserCollision(laser, alien)) {
        alien.src = 'img/explosion.png';
        alien.classList.remove('alien');
        alien.classList.add('dead-alien');
      }
    })

    if (xPosition === 540) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 10}px`;
    }
  }, 10);
}

function createAliens() {
  let newAlien = document.createElement('img');
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
  newAlien.src = alienSprite;
  newAlien.classList.add('alien');
  newAlien.classList.add('alien-transitrion');
  newAlien.style.left = '470px';
  newAlien.style.top = `${Math.floor(Math.random() * 300) + 15}px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes('dead-alien')) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}

function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop + 50;
  let alienTop = parseInt(alien.style.top) - 10;
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop + 35;
  if (laserLeft != 540 && laserLeft + 40 >= alienLeft) {
    if (laserTop >= alienTop && laserTop <= alienBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

startButton.addEventListener('click', () => {
  playGame();
})

function playGame() {
  startButton.style.display = 'none';
  instructionsText.style.display = 'none';
  window.addEventListener('keydown', flyShip);
  alienInterval = setInterval(() => {
    createAliens();
  }, 2000);
}

function gameOver() {
  window.removeEventListener('keydown', flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll('.alien');
  aliens.forEach((alien) => alien.remove());
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    alert('game over!');
    yourShip.style.top = "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  });
}
