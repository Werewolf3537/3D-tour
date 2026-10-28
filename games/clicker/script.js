const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Элементы интерфейса
const levelDisplay = document.getElementById('level-display');
const budgetDisplay = document.getElementById('budget-display');
const targetDisplay = document.getElementById('target-display');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalScore = document.getElementById('modal-score');
const modalBtn = document.getElementById('modal-btn');

// Игровая логика и уровни
let currentLevel = 1;
let budget = 0;
let isPlaying = true;
let scorePopupTime = 0;

const levels = {
    1: { target: 50000, speedModifier: 1, spawnRate: 0.03 },
    2: { target: 200000, speedModifier: 1.4, spawnRate: 0.04 },
    3: { target: 500000, speedModifier: 1.8, spawnRate: 0.05 },
    4: { target: 1000000, speedModifier: 2.3, spawnRate: 0.06 }
};

// Параметры игрока
const player = {
    x: 0,
    y: 0,
    radius: 25,
    emoji: '👷‍♂️' // Значок игрока (можно заменить)
};

// Массив падающих элементов
let items = [];

// Подгонка Canvas под физические размеры экрана
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Ставим игрока в нижнюю треть экрана изначально
    if (player.x === 0) {
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
    }
}
window.addEventListener('resize', resizeCanvas);

// --- УПРАВЛЕНИЕ (Мышь и Тач без багов скролла) ---
function movePlayer(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    // Считаем координаты относительно холста
    let targetX = clientX - rect.left;
    let targetY = clientY - rect.top;

    // Ограничиваем, чтобы значок не вылетал за границы экрана
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, targetX));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, targetY));
}

// ПК
canvas.addEventListener('mousemove', (e) => movePlayer(e.clientX, e.clientY));
// Смартфоны
canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        movePlayer(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

// Класс падающего элемента
class FallingItem {
    constructor() {
        this.x = Math.random() * (canvas.width - 60) + 30;
        this.y = -30;
        
        // Шансы выпадения типов плашек
        const rand = Math.random();
        if (rand < 0.55) {
            // Положительные (Бюджет)
            const rewards = [
                { text: '+10к', val: 10000, color: '#4ade80' },
                { text: '+50к', val: 50000, color: '#22c55e' },
                { text: '+100к', val: 100000, color: '#34d399' }
            ];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            this.text = reward.text;
            this.value = reward.val;
            this.color = reward.color;
            this.isBad = false;
        } else {
            // Отрицательные (Правки)
            const penalties = [
                { text: '-10к', val: -10000, color: '#f87171' },
                { text: '-50к', val: -50000, color: '#ef4444' },
                { text: '-100к', val: -100000, color: '#b91c1c' }
            ];
            const penalty = penalties[Math.floor(Math.random() * penalties.length)];
            this.text = penalty.text;
            this.value = penalty.value;
            this.color = penalty.color;
            this.isBad = true;
        }

        // Базовая скорость + случайный разброс * модификатор уровня
        const currentLvlCfg = levels[currentLevel] || levels[4];
        this.speed = (Math.random() * 2 + 3) * currentLvlCfg.speedModifier;
        this.radius = 20;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.save();
        // Рисуем стильную подложку для текста
        ctx.fillStyle = 'rgba(28, 28, 30, 0.9)';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        // Скругленный прямоугольник вокруг цифры
        ctx.beginPath();
        const w = 55;
        const h = 26;
        ctx.roundRect(this.x - w/2, this.y - h/2, w, h, 6);
        ctx.fill();
        ctx.stroke();

        // Текст цифры
        ctx.fillStyle = this.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// Игровой цикл рендеринга и апдейтов
function gameLoop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка игрока
    ctx.save();
    ctx.font = `${player.radius * 1.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.emoji, player.x, player.y);
    ctx.restore();

    // Генерация новых элементов на основе конфига уровня
    const currentLvlCfg = levels[currentLevel] || levels[4];
    if (Math.random() < currentLvlCfg.spawnRate) {
        items.push(new FallingItem());
    }

    // Обработка падающих элементов
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.update();
        item.draw();

        // Проверка столкновения (дистанция между центрами)
        const dist = Math.hypot(item.x - player.x, item.y - player.y);
        if (dist < player.radius + item.radius) {
            // Поймали элемент!
            budget += item.value;
            if (budget < 0) budget = 0; // Бюджет не уходит в минус
            
            updateUI();
            items.splice(i, 1);
            checkLevelProgress();
            continue;
        }

        // Удаление элементов, вышедших за экран
        if (item.y > canvas.height + 30) {
            items.splice(i, 1);
        }
    }

    requestAnimationFrame(gameLoop);
}

function updateUI() {
    budgetDisplay.textContent = `${budget.toLocaleString('ru-RU')} ₽`;
    levelDisplay.textContent = currentLevel;
    
    const cfg = levels[currentLevel];
    if (cfg) {
        targetDisplay.textContent = `${cfg.target.toLocaleString('ru-RU')} ₽`;
    } else {
        targetDisplay.textContent = 'Максимум!';
    }
}

function checkLevelProgress() {
    const currentTarget = levels[currentLevel]?.target;
    
    if (currentTarget && budget >= currentTarget) {
        // Уровень успешно пройден!
        isPlaying = false;
        showModal(true);
    }
}

function showModal(isWin) {
    modal.style.display = 'flex';
    modalScore.textContent = `${budget.toLocaleString('ru-RU')} ₽`;

    if (isWin) {
        modalTitle.textContent = `🎉 Уровень ${currentLevel} пройден!`;
        modalDesc.textContent = `Отличная работа! Готовы повысить сложность и скорость правок?`;
        modalBtn.textContent = `Начать уровень ${currentLevel + 1}`;
    } else {
        modalTitle.textContent = `💼 Финал игры`;
        modalDesc.textContent = `Правки одолели бюджет! Вы остановились на уровне ${currentLevel}. Итоговый заработок:`;
        modalBtn.textContent = `Играть снова`;
    }
}

// Логика кнопки в модальном окне
modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    
    const currentTarget = levels[currentLevel]?.target;
    if (currentTarget && budget >= currentTarget) {
        // Переход на следующий левел
        currentLevel++;
    } else {
        // Сброс при полном проигрыше
        currentLevel = 1;
        budget = 0;
    }

    // Рестарт сессии
    items = [];
    isPlaying = true;
    updateUI();
    gameLoop();
});

// Старт игры
resizeCanvas();
updateUI();
gameLoop();
