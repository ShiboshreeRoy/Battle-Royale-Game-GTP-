// Selectors
const player = document.getElementById("player");
const enemies = document.querySelectorAll(".enemy");
const shootBtn = document.getElementById("shootBtn");
const healthDisplay = document.getElementById("health");
const enemiesDisplay = document.getElementById("enemies");
const gameArea = document.querySelector(".game-area");

// Variables
let playerHealth = 100;
let enemyCount = enemies.length;
let bullets = [];

// Update stats on the UI
healthDisplay.textContent = playerHealth;
enemiesDisplay.textContent = enemyCount;

// Randomize enemy position
function randomizeEnemyPosition(enemy) {
  const gameAreaWidth = gameArea.offsetWidth;
  const gameAreaHeight = gameArea.offsetHeight;

  const randomX = Math.random() * (gameAreaWidth - 50); // 50 to avoid clipping
  const randomY = Math.random() * (gameAreaHeight - 100); // Keep within game area

  enemy.style.left = `${randomX}px`;
  enemy.style.top = `${randomY}px`;
}

// Initialize random positions for enemies
enemies.forEach((enemy) => randomizeEnemyPosition(enemy));

// Move enemies periodically
function moveEnemies() {
  enemies.forEach((enemy) => {
    randomizeEnemyPosition(enemy);
  });
}

// Move enemies every 2 seconds
setInterval(moveEnemies, 2000);

// Move the player with arrow keys
document.addEventListener("keydown", (e) => {
  const playerPos = player.getBoundingClientRect();
  const gameAreaPos = gameArea.getBoundingClientRect();

  if (e.key === "ArrowLeft" && playerPos.left > gameAreaPos.left) {
    player.style.left = `${player.offsetLeft - 20}px`;
  } else if (e.key === "ArrowRight" && playerPos.right < gameAreaPos.right) {
    player.style.left = `${player.offsetLeft + 20}px`;
  }
});

// Shoot bullets
shootBtn.addEventListener("click", () => {
  const bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.left = `${player.offsetLeft + 20}px`;
  bullet.style.bottom = "70px";
  gameArea.appendChild(bullet);
  bullets.push(bullet);

  // Move the bullet upwards
  const bulletInterval = setInterval(() => {
    const bulletPos = bullet.getBoundingClientRect();

    // Move bullet upwards
    bullet.style.bottom = `${bullet.offsetTop + 10}px`;

    // Check collision with enemies
    enemies.forEach((enemy) => {
      const enemyPos = enemy.getBoundingClientRect();

      if (
        bulletPos.top <= enemyPos.bottom &&
        bulletPos.bottom >= enemyPos.top &&
        bulletPos.left <= enemyPos.right &&
        bulletPos.right >= enemyPos.left
      ) {
        // Remove enemy and bullet on collision
        enemy.remove();
        bullet.remove();
        bullets = bullets.filter((b) => b !== bullet);
        enemyCount -= 1;
        enemiesDisplay.textContent = enemyCount;

        // Stop bullet movement
        clearInterval(bulletInterval);

        // Check for victory
        if (enemyCount === 0) {
          alert("You win!");
          location.reload();
        }
      }
    });

    // Remove bullet if it goes out of bounds
    if (bullet.offsetTop <= 0) {
      bullet.remove();
      bullets = bullets.filter((b) => b !== bullet);
      clearInterval(bulletInterval);
    }
  }, 30);
});

// Enemy collision logic
const enemyDamageInterval = setInterval(() => {
  enemies.forEach((enemy) => {
    const enemyPos = enemy.getBoundingClientRect();
    const playerPos = player.getBoundingClientRect();

    // Check if an enemy hits the player
    if (
      playerPos.top <= enemyPos.bottom &&
      playerPos.bottom >= enemyPos.top &&
      playerPos.left <= enemyPos.right &&
      playerPos.right >= enemyPos.left
    ) {
      playerHealth -= 10;
      healthDisplay.textContent = playerHealth;

      // Game over logic
      if (playerHealth <= 0) {
        alert("Game Over!");
        location.reload();
      }
    }
  });
}, 1000);
