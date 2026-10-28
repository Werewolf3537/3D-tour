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

// Игровая логика и уровни (Новые цели и баланс скорости)
let currentLevel = 1;
let budget = 0;
let isPlaying = true;

const levels = {
    1: { target: 100000, speedModifier: 0.8, spawnRate: 0.025 },  // Замедлено на 20% от базы
    2: { target: 250000, speedModifier: 1.1, spawnRate: 0.035 },
    3: { target: 500000, speedModifier: 1.4, spawnRate: 0.045 }
};

// Параметры игрока (Увеличен на 20%: радиус был 25, стал 30)
const player = {
    x: 0,
    y: 0,
    radius: 30, 
    emoji: '👷‍♂️'
};

// Массив падающих элементов
let items = [];

// Подгонка Canvas под физические размеры экрана
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (player.x === 0) {
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
    }
}
window.addEventListener('resize', resizeCanvas);

// --- УПРАВЛЕНИЕ ---
function movePlayer(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    let targetX = clientX - rect.left;
    let targetY = clientY - rect.top;

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
        // Учитываем увеличенный размер плашек при спавне у краев экрана
        this.x = Math.random() * (canvas.width - 80) + 40;
        this.y = -40;
        
        const rand = Math.random();
        if (rand < 0.55) {
            // Положительные (Бюджет: 500, 1000, 5000)
            const rewards = [
                { text: '+500 ₽', val: 500, color: '#4ade80' },
                { text: '+1 000 ₽', val: 1000, color: '#22c55e' },
                { text: '+5 000 ₽', val: 5000, color: '#34d399' }
            ];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            this.text = reward.text;
            this.value = reward.val;
            this.color = reward.color;
            this.isBad = false;
        } else {
            // Отрицательные (Правки: -500, -1000, -5000)
            const penalties = [
                { text: '-500 ₽', val: -500, color: '#f87171' },
                { text: '-1 000 ₽', val: -1000, color: '#ef4444' },
                { text: '-5 000 ₽', val: -5000, color: '#b91c1c' }
            ];
            const penalty = penalties[Math.floor(Math.random() * penalties.length)];
            this.text = penalty.text;
            this.value = penalty.val;
            this.color = penalty.color;
            this.isBad = true;
        }

        // Скорость замедлена на 20%
        const currentLvlCfg = levels[currentLevel] || levels[3];
        this.speed = (Math.random() * 1.5 + 2.5) * currentLvlCfg.speedModifier;
        
        // Размеры плашек увеличены на 30% (ширина была 55->72, высота 26->34)
        this.width = 72;
        this.height = 34;
        this.radius = 26; // Радиус для обработки столкновений тоже пропорционально увеличен
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.save();
        ctx.fillStyle = 'rgba(28, 28, 30, 0.95)';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5; // Чуть жирнее рамка для читаемости
        
        // Скругленный прямоугольник вокруг цифры
        ctx.beginPath();
        ctx.roundRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height, 8);
        ctx.fill();
        ctx.stroke();

        // Текст цифры (Размер шрифта увеличен для читаемости)
        ctx.fillStyle = this.color;
        ctx.font = 'bold 15px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// Игровой цикл
function gameLoop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Отрисовка игрока (Размер увеличен на 20%)
    ctx.save();
    ctx.font = `${player.radius * 1.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.emoji, player.x, player.y);
    ctx.restore();

    // Генерация элементов
    const currentLvlCfg = levels[currentLevel] || levels[3];
    if (Math.random() < currentLvlCfg.spawnRate) {
        items.push(new FallingItem());
    }

    // Обработка элементов
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.update();
        item.draw();

        // Проверка столкновения
        const dist = Math.hypot(item.x - player.x, item.y - player.y);
        if (dist < player.radius + item.radius) {
            budget += item.value;
            if (budget < 0) budget = 0; 
            
            updateUI();
            items.splice(i, 1);
            checkLevelProgress();
            continue;
        }

        if (item.y > canvas.height + 40) {
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
        isPlaying = false;
        showModal(true);
    }
}

function showModal(isWin) {
    modal.style.display = 'flex';
    modalScore.textContent = `${budget.toLocaleString('ru-RU')} ₽`;

    if (isWin) {
        if (currentLevel < 3) {
            modalTitle.textContent = `🎉 Уровень ${currentLevel} пройден!`;
            modalDesc.textContent = `Отличный темп! Переходим к следующему этапу?`;
            modalBtn.textContent = `Начать уровень ${currentLevel + 1}`;
        } else {
            modalTitle.textContent = `👑 Полная победа!`;
            modalDesc.textContent = `Вы успешно собрали весь бюджет и защитили проект от безумных правок!`;
            modalBtn.textContent = `Сыграть еще раз`;
        }
    }
}

modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    
    const currentTarget = levels[currentLevel]?.target;
    if (currentTarget && budget >= currentTarget) {
        if (currentLevel < 3) {
            currentLevel++;
        } else {
            // Если прошли 3 уровень — сброс на начало (победный круг)
            currentLevel = 1;
            budget = 0;
        }
    } else {
        currentLevel = 1;
        budget = 0;
    }

    items = [];
    isPlaying = true;
    updateUI();
    gameLoop();
});

// Старт игры
resizeCanvas();
updateUI();
gameLoop();
