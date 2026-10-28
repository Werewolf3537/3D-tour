const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI элементы
const timerDisplay = document.getElementById('timer-display');
const statusDisplay = document.getElementById('status-display');
const puzzleBox = document.getElementById('puzzle-box');
const puzzleQuestion = document.getElementById('puzzle-question');
const puzzleAnswers = document.getElementById('puzzle-answers');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalBtn = document.getElementById('modal-btn');

// Настройка сетки лабиринта (0 - пусто, 1 - стена офиса)
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

// Игровые сущности
let player = { x: 1, y: 1, emoji: '👷‍♂️' };
let enemy = { x: 9, y: 9, emoji: '📋' };

let timeRemaining = 60;
let isPlaying = true;
let isFrozen = false;
let gameTimerInterval, enemyMoveInterval;

function resizeCanvas() {
    const size = Math.min(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
    canvas.width = size;
    canvas.height = size;
    cellSize = size / cols;
    drawGrid();
}

// Рендеринг лабиринта
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                ctx.fillStyle = '#1c1c1e'; // Стены лабиринта
                ctx.strokeStyle = '#2c2c2e';
                ctx.lineWidth = 1;
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
                ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
            } else {
                ctx.fillStyle = '#0b0b0c'; // Свободный путь
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }

    // Рисуем игрока
    ctx.font = `${cellSize * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.emoji, player.x * cellSize + cellSize/2, player.y * cellSize + cellSize/2);

    // Рисуем Дизайнера
    ctx.fillText(enemy.emoji, enemy.x * cellSize + cellSize/2, enemy.y * cellSize + cellSize/2);
}

// --- ХОД ИГРОКА ПО ТАПУ / КЛИКУ ---
function handleGridClick(clientX, clientY) {
    if (!isPlaying || isFrozen) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    const targetC = Math.floor(clickX / cellSize);
    const targetR = Math.floor(clickY / cellSize);

    // Проверяем, что кликнули на соседнюю клетку (по горизонтали или вертикали)
    const dist = Math.abs(player.x - targetC) + Math.abs(player.y - targetR);
    
    if (dist === 1 && grid[targetR][targetC] === 0) {
        player.x = targetC;
        player.y = targetR;
        drawGrid();
        checkCollision();

        // Шанс 12% словить зависание ПК при каждом шаге
        if (Math.random() < 0.12) {
            triggerFreeze();
        }
    }
}

canvas.addEventListener('click', (e) => handleGridClick(e.clientX, e.clientY));
canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        handleGridClick(e.touches[0].clientX, e.touches[0].clientY);
    }
});

// --- АЛГОРИТМ ИИ ДЛЯ ДИЗАЙНЕРА (Преследование) ---
function moveEnemy() {
    if (!isPlaying || isFrozen) return;

    // Вектор направления к игроку
    let diffX = player.x - enemy.x;
    let diffY = player.y - enemy.y;

    let nextX = enemy.x;
    let nextY = enemy.y;

    // Дизайнер делает шаг в сторону игрока, отдавая приоритет свободному пути
    if (Math.abs(diffX) > Math.abs(diffY)) {
        nextX += Math.sign(diffX);
        if (grid[nextY][nextX] === 1) { // Если стена, пробуем по Y
            nextX = enemy.x;
            nextY += Math.sign(diffY) !== 0 ? Math.sign(diffY) : 1;
        }
    } else {
        nextY += Math.sign(diffY);
        if (grid[nextY][nextX] === 1) { // Если стена, пробуем по X
            nextY = enemy.y;
            nextX += Math.sign(diffX) !== 0 ? Math.sign(diffX) : 1;
        }
    }

    // Если клетка свободна от стен, дизайнер шагает
    if (grid[nextY][nextX] === 0) {
        enemy.x = nextX;
        enemy.y = nextY;
    }

    drawGrid();
    checkCollision();
}

// --- МЕХАНИКА ЗАВИСАНИЯ И ГОЛОВОЛОМКИ ---
function triggerFreeze() {
    isFrozen = true;
    statusDisplay.textContent = 'КРИТИЧЕСКИЙ СБОЙ!';
    statusDisplay.className = 'highlight';
    statusDisplay.style.color = '#ff453a';
    puzzleBox.style.display = 'flex';

    // Генерируем простое математическое выражение
    const num1 = Math.floor(Math.random() * 8) + 2;
    const num2 = Math.floor(Math.random() * 8) + 2;
    const correctAnswer = num1 + num2;

    puzzleQuestion.textContent = `${num1} + ${num2} = ?`;
    puzzleAnswers.innerHTML = '';

    // Генерируем варианты ответов
    let answers = [correctAnswer];
    while (answers.length < 4) {
        let wrong = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        if (!answers.includes(wrong) && wrong > 0) answers.push(wrong);
    }
    answers.sort(() => Math.random() - 0.5);

    // Отрисовка кнопок ответов
    answers.forEach(ans => {
        const btn = document.createElement('button');
        btn.className = 'puzzle-btn';
        btn.textContent = ans;
        btn.addEventListener('click', () => {
            if (ans === correctAnswer) {
                // Успешно решили головоломку!
                isFrozen = false;
                puzzleBox.style.display = 'none';
                statusDisplay.textContent = 'Рендеринг...';
                statusDisplay.style.color = '#4ade80';
            } else {
                // Неверный ответ штрафует: дизайнер делает мгновенный шаг, пока вы стоите
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
        if (!isFrozen) {
            timeRemaining--;
            timerDisplay.textContent = `${timeRemaining}s`;
            if (timeRemaining <= 0) {
                endGame(true);
            }
        }
    }, 1000);

    // Скорость преследования дизайнера (каждые 550мс шаг)
    enemyMoveInterval = setInterval(moveEnemy, 550);
}

function endGame(isWin) {
    isPlaying = false;
    clearInterval(gameTimerInterval);
    clearInterval(enemyMoveInterval);
    modal.style.display = 'flex';

    if (isWin) {
        modalTitle.textContent = '👑 Проект сдан!';
        modalDesc.textContent = 'Вы успешно увернулись от правок дизайнера, починили ПК вовремя и сдали визуализацию в срок!';
    } else {
        modalTitle.textContent = '📋 Правки настигли вас';
        modalDesc.textContent = 'Дизайнер успел внести 100500 изменений до финального рендера. Компьютер сгорел.';
    }
}

modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    puzzleBox.style.display = 'none';
    player = { x: 1, y: 1, emoji: '👷‍♂️' };
    enemy = { x: 9, y: 9, emoji: '📋' };
    timeRemaining = 60;
    isPlaying = true;
    isFrozen = false;
    statusDisplay.textContent = 'Рендеринг...';
    statusDisplay.style.color = '#4ade80';
    timerDisplay.textContent = '60s';
    
    clearInterval(gameTimerInterval);
    clearInterval(enemyMoveInterval);
    
    resizeCanvas();
    startGameTimers();
});

// Первичный запуск
window.addEventListener('load', () => {
    resizeCanvas();
    startGameTimers();
});
