const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const words = [
    { tamil: 'நாய்', english: 'dog' },
    { tamil: 'பூனை', english: 'cat' },
    { tamil: 'காகம்', english: 'crow' },
    { tamil: 'மாடு', english: 'cow' },
    { tamil: 'பன்றி', english: 'pig' },
    { tamil: 'சேவல்', english: 'rooster' },
    // Add more words as needed
];

let projectiles = [];
let targets = [];
let score = 0;
let shotsFired = 0;
let gameRunning = true;
let reloadTimeout = false;
let currentEnglishWord = null;

const targetWidth = 100; // Adjust the width of the targets
const targetHeight = 50;
const projectileSize = 10;

function init() {
    // Create target objects
    words.forEach(word => {
        targets.push({
            word: word.tamil,
            english: word.english,
            x: Math.random() * (canvas.width - targetWidth),
            y: Math.random() * (canvas.height - targetHeight)
        });
    });

    // Select a random English word to match
    selectRandomEnglishWord();

    // Start the game loop
    requestAnimationFrame(gameLoop);
}

function selectRandomEnglishWord() {
    if (targets.length > 0) {
        const randomIndex = Math.floor(Math.random() * targets.length);
        currentEnglishWord = targets[randomIndex].english;
        document.getElementById('english-word').innerText = currentEnglishWord;
    }
}

function gameLoop() {
    if (gameRunning) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw targets
        ctx.font = '24px Arial';
        targets.forEach(target => {
            ctx.fillStyle = 'white';
            ctx.fillRect(target.x, target.y, targetWidth, targetHeight);
            ctx.fillStyle = 'black';
            ctx.fillText(target.word, target.x + 10, target.y + 30);
        });

        // Draw projectiles
        projectiles.forEach(projectile => {
            ctx.fillStyle = 'yellow';
            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, projectileSize, 0, Math.PI * 2);
            ctx.fill();
        });

        updateProjectiles();
        checkCollisions();

        requestAnimationFrame(gameLoop);
    }
}

function updateProjectiles() {
    projectiles.forEach(projectile => {
        projectile.y -= 5;
    });

    projectiles = projectiles.filter(projectile => projectile.y > 0);
}

function checkCollisions() {
    projectiles.forEach(projectile => {
        targets.forEach((target, index) => {
            if (projectile.x > target.x && projectile.x < target.x + targetWidth &&
                projectile.y > target.y && projectile.y < target.y + targetHeight) {
                // Correct match
                if (target.english === currentEnglishWord) {
                    targets.splice(index, 1);
                    score += 10;
                    updateScore();

                    // Select a new English word
                    selectRandomEnglishWord();
                }
            }
        });
    });

    if (targets.length === 0) {
        gameRunning = false;
        alert('You win! Your score: ' + score);
    }
}

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

canvas.addEventListener('click', (e) => {
    if (reloadTimeout) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    projectiles.push({ x, y: canvas.height - projectileSize });

    shotsFired += 1;
    if (shotsFired >= 10) {
        reloadTimeout = true;
        setTimeout(() => {
            shotsFired = 0;
            reloadTimeout = false;
        }, 3000);
    }
});

init();
