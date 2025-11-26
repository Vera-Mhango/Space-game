const player = document.getElementById('player');
const game = document.getElementById('game');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreEl = document.getElementById('finalScore');

let score = 0;
let lives = 3;
let playerX = window.innerWidth / 2;
let canShoot = true;
let gameActive = true;

const aliens = ['3.png', '4.png', '5.png', '6.png', '7.png', '8.png'];
const bullets = [];
const enemies = [];

document.addEventListener('keydown', e => {
  if (!gameActive) return;
  if (e.key === 'ArrowLeft') playerX -= 25;
  if (e.key === 'ArrowRight') playerX += 25;
  if (e.key === ' ') shoot();
  updatePlayer();
});

game.addEventListener('click', shoot);

// MOBILE CONTROLS
document.getElementById("leftBtn").addEventListener("touchstart", () => {
  playerX -= 25;
  updatePlayer();
});

document.getElementById("rightBtn").addEventListener("touchstart", () => {
  playerX += 25;
  updatePlayer();
});

document.getElementById("shootBtn").addEventListener("touchstart", () => {
  shoot();
});


function updatePlayer() {
  player.style.backgroundImage = "url('space ship.jpg')";
  playerX = Math.max(40, Math.min(window.innerWidth - 40, playerX));
  player.style.left = playerX + 'px';
}

/* ------------ SHOOTING (Optimized) ------------ */
function shoot() {
  if (!canShoot || !gameActive) return;

  canShoot = false;
  setTimeout(() => canShoot = true, 200);

  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = (playerX - 3) + 'px';
  bullet.style.bottom = '100px';

  game.appendChild(bullet);
  bullets.push(bullet);

  moveBullet(bullet);
}

function moveBullet(bullet) {
  function loop() {
    if (!bullet.parentNode) return;

    const bottom = parseInt(bullet.style.bottom);
    bullet.style.bottom = (bottom + 20) + 'px';

    // Remove if off screen
    if (bottom > window.innerHeight) {
      bullet.remove();
      return;
    }

    // Collision check
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];

      if (!enemy) continue;
      const eRect = enemy.getBoundingClientRect();
      const bRect = bullet.getBoundingClientRect();

      if (
        bRect.top < eRect.bottom &&
        bRect.bottom > eRect.top &&
        bRect.left < eRect.right &&
        bRect.right > eRect.left
      ) {
        explode(enemy);
        enemy.remove();
        enemies.splice(i, 1);
        bullet.remove();

        score += 20;
        scoreEl.textContent = 'Score: ' + score;
        return;
      }
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

/* ------------ ALIENS (Optimized) ------------ */
function createAlien() {
  if (!gameActive) return;

  const alien = document.createElement('div');
  alien.classList.add('alien');
  alien.style.backgroundImage = `url('${aliens[Math.floor(Math.random() * aliens.length)]}')`;
  alien.style.left = Math.random() * (window.innerWidth - 80) + 'px';
  alien.style.top = '-80px';

  game.appendChild(alien);
  enemies.push(alien);

  const speed = Math.random() * 2 + 1.5;

  function fall() {
    if (!alien.parentNode) return;

    const top = parseInt(alien.style.top);
    alien.style.top = (top + speed) + 'px';

    if (top > window.innerHeight) {
      alien.remove();
      enemies.splice(enemies.indexOf(alien), 1);
      loseLife();
      return;
    }

    requestAnimationFrame(fall);
  }

  requestAnimationFrame(fall);
}

/* ------------ EXPLOSION ------------ */
function explode(element) {
  const boom = document.createElement('div');
  boom.classList.add('explosion');
  boom.textContent = '';
  boom.style.left = (element.offsetLeft - 20) + 'px';
  boom.style.top = (element.offsetTop - 20) + 'px';
  game.appendChild(boom);

  setTimeout(() => boom.remove(), 500);
}

/* ------------ LIVES & GAME OVER ------------ */
function loseLife() {
  lives--;
  livesEl.innerHTML = 'Lives: ' + '❤️ '.repeat(lives);

  if (lives <= 0) endGame();
}

function endGame() {
  gameActive = false;
  finalScoreEl.textContent = 'Final Score: ' + score;
  gameOverScreen.style.display = 'block';
}

/* ------------ RESTART ------------ */
function restart() {
  score = 0;
  lives = 3;
  livesEl.innerHTML = 'Lives: ❤️ ❤️ ❤️';
  scoreEl.textContent = 'Score: 0';

  gameActive = true;
  gameOverScreen.style.display = 'none';

  bullets.forEach(b => b.remove());
  enemies.forEach(e => e.remove());
  bullets.length = 0;
  enemies.length = 0;
}

document.getElementById('restart').addEventListener('click', restart);

/* ------------ ALIEN LOOP ------------ */
setInterval(() => {
  if (gameActive) createAlien();
}, 1200);

updatePlayer();

