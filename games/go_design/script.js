const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status-display');
const puzzleBox = document.getElementById('puzzle-box');
const puzzleQuestion = document.getElementById('puzzle-question');
const puzzleAnswers = document.getElementById('puzzle-answers');
const startModal = document.getElementById('start-modal');
const startBtn = document.getElementById('start-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalBtn = document.getElementById('modal-btn');

// Полная и корректная карта лабиринта (0 - путь, 1 - стена)
const grid = [,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
 ,
    [1,1,1,1,1,1,1,1,1,1,1]
];

const rows = grid.length;
const cols = grid[0].length;
let cellSize = 0;

// Игрок (кошелек) и враг (дизайнер с правками)
let player = { x: 1, y: 1, radius: 18 }; 
let enemy = { x: 9, y: 9, emoji: '📋' };

let currentLevel = 1;
let timeRemaining = 60;
let isPlaying = false;
let isFrozen = false;
let gameTimerInterval, enemyMoveInterval;

const levelTargets = {
    1: 40, // Выжить 20 сек (осталось 40)
    2: 20, // Выжить еще 20 сек (осталось 20)
    3: 0   // Выжить полностью
};

function resizeCanvas() {
    const size = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    canvas.width = size;
    canvas.height = size;
    cellSize = size / cols;
    drawGrid();
}
window.addEventListener('resize', resizeCanvas);

// Отрисовка уменьшенного золотого кошелька
function drawPlayer(x, y, radius) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#ff9f0a';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-radius * 0.8, radius * 0.6);
    ctx.quadraticCurveTo(-radius, -radius * 0.3, -radius * 0.5, -radius * 0.5);
    ctx.lineTo(radius * 0.5, -radius * 0.5);
    ctx.quadraticCurveTo(radius, -radius * 0.3, radius * 0.8, radius * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffb340';
    ctx.beginPath();
    ctx.arc(0, -radius * 0.55, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                ctx.fillStyle = '#1c1c1e';
                ctx.strokeStyle = '#2c2c2e';
                ctx.lineWidth = 1;
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
            } else {
                let grad = ctx.createLinearGradient(c*cellSize, (r+1)*cellSize, (c+1)*cellSize, r*cellSize);
                grad.addColorStop(0, '#0d0d0e');
                grad.addColorStop(1, '#16161a');
                ctx.fillStyle = grad;
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }

    const pX = player.x * cellSize + cellSize / 2;
    const pY = player.y * cellSize + cellSize / 2;
    drawPlayer(pX, pY, player.radius);

    ctx.save();
    ctx.font = `${cellSize * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(enemy.emoji, enemy.x * cellSize + cellSize/2, enemy.y * cellSize + cellSize/2);
    ctx.restore();
}

function handleGridClick(clientX, clientY) {
    if (!isPlaying || isFrozen) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const targetC = Math.floor(clickX / cellSize);
    const targetR = Math.floor(clickY / cellSize);

    const dist = Math.abs(player.x - targetC) + Math.abs(player.y - targetR);
    
    if (dist === 1 && grid[targetR] && grid[targetR][targetC] === 0) {
        player.x = targetC;
        player.y = targetR;
        drawGrid();
        checkCollision();

        if (Math.random() < 0.12) {
            triggerFreeze();
        }
    }
}

canvas.addEventListener('click', (e) => handleGridClick(e.clientX, e.clientY));
canvas.addEventListener('touchstart', (e) => {
    if (e.targetTouches && e.targetTouches.length > 0) {
        handleGridClick(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
}, { passive: false });

function moveEnemy() {
    if (!isPlaying || isFrozen) return;

    let diffX = player.x - enemy.x;
    let diffY = player.y - enemy.y;

    let nextX = enemy.x;
    let nextY = enemy.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        nextX += Math.sign(diffX);
        if (grid[nextY] && grid[nextY][nextX] === 1) {
            nextX = enemy.x;
            nextY += Math.sign(diffY) !== 0 ? Math.sign(diffY) : 1;
        }
    } else {
        nextY += Math.sign(diffY);
        if (grid[nextY] && grid[nextY][nextX] === 1) {
            nextY = enemy.y;
            nextX += Math.sign(diffX) !== 0 ? Math.sign(diffX) : 1;
        }
    }

    if (grid[nextY] && grid[nextY][nextX] === 0) {
        enemy.x = nextX;
        enemy.y = nextY;
    }

    drawGrid();
    checkCollision();
}

function triggerFreeze() {
    isFrozen = true;
    statusDisplay.textContent = 'КРИТИЧЕСКИЙ СБОЙ!';
    statusDisplay.style.color = '#ff453a';
    puzzleBox.style.display = 'flex';

    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 8) + 2;
    const correctAnswer = num1 + num2;

    puzzleQuestion.textContent = `${num1} + ${num2} = ?`;
    puzzleAnswers.innerHTML = '';

    let answers = [correctAnswer];
    while (answers.length < 4) {
        let wrong = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        if (!answers.includes(wrong) && wrong > 0) answers.push(wrong);
    }
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'puzzle-btn';
        btn.textContent = ans;
        btn.addEventListener('click', () => {
            if (ans === correctAnswer) {
                isFrozen = false;
                puzzleBox.style.display = 'none';
                statusDisplay.textContent = 'Рендеринг...';
                statusDisplay.style.color = '#34d399';
            } else {
                moveEnemy();
            }
        });
        puzzleAnswers.appendChild(btn);
    });
}

function checkCollision() {
    if (player.x === enemy.x && player.y === enemy.y) {
        endGame(false);
    }
}

function startGameTimers() {
    gameTimerInterval = setInterval(() => {
        if (!isFrozen && isPlaying) {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining + 's';
            
            const targetTime = levelTargets[currentLevel];
            if (timeRemaining <= targetTime) {
                endGame(true);
            }
        }
    }, 1000);

    const intervalSpeed = currentLevel === 1 ? 550 : currentLevel === 2 ? 450 : 350;
    enemyMoveInterval = setInterval(moveEnemy, intervalSpeed);
}

function endGame(isWin) {
    isPlaying = false;
    clearInterval(gameTimerInterval);
    clearInterval(enemyMoveInterval);
    modal.style.display = 'flex';

    if (isWin) {
        if (currentLevel === 1) {
            modalTitle.textContent = `🎉 Уровень 1 Пройден!`;
            modalDesc.textContent = `Поздравляем! Вы выиграли 3 дополнительных ракурса к проекту! Хотите больше? Пройди второй уровень и получи 3D-тур к проекту - бесплатно!`;
            modalBtn.textContent = `Начать уровень 2`;
        } else if (currentLevel === 2) {
            modalTitle.textContent = `🔥 Уровень 2 Пройден!`;
            modalDesc.textContent = `Потрясающе! Бесплатный 3D-тур ваш! Идем ва-банк? Пройди третий уровень и забери весь выигрыш + скидка 5% на проект!`;
            modalBtn.textContent = `Начать уровень 3`;
        } else {
            modalTitle.textContent = `👑 ПОЛНАЯ ПОБЕДА!`;
            modalDesc.textContent = `Вы выжили в лабиринте правок! Все бонусы ваши: 3 ракурса + 3D-тур + скидка 5% на проект визуализации! Сделайте скриншот и отправьте Кириллу!`;
            modalBtn.textContent = `Забрать выигрыш`;
        }
    } else {
        modalTitle.textContent = `📋 Правки настигли вас`;
        modalDesc.textContent = `Дизайнер успел внести миллион изменений. Но вы можете попробовать снова и вернуть свои бонусы!`;
        modalBtn.textContent = `Попробовать снова`;
    }
}

startBtn.addEventListener('click', () => {
    startModal.style.display = 'none';
    isPlaying = true;
    resizeCanvas();
    startGameTimers();
});

modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    
    if (timeRemaining <= levelTargets[currentLevel] && currentLevel < 3) {
        currentLevel++;
    } else {
        currentLevel = 1;
        timeRemaining = 60;
    }

    player = { x: 1, y: 1, radius: 18 };
    enemy = { x: 9, y: 9, emoji: '📋' };
    isPlaying = true;
    isFrozen = false;
    statusDisplay.textContent = 'Рендеринг...';
    statusDisplay.style.color = '#34d399';
    timerDisplay.textContent = timeRemaining + 's';
    
    clearInterval(gameTimerInterval);
    clearInterval(enemyMoveInterval);
    
    drawGrid();
    startGameTimers();
});

window.addEventListener('load', () => {
    resizeCanvas();
});
