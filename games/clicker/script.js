const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Элементы интерфейса
const levelDisplay = document.getElementById('level-display');
const budgetDisplay = document.getElementById('budget-display');
const targetDisplay = document.getElementById('target-display');
const startModal = document.getElementById('start-modal');
const startBtn = document.getElementById('start-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalScore = document.getElementById('modal-score');
const modalBtn = document.getElementById('modal-btn');

// Игровая логика и уровни
let currentLevel = 1;
let budget = 0;
let isPlaying = false;

const levels = {
    1: { target: 50000, speedModifier: 0.8, spawnRate: 0.025 },
    2: { target: 250000, speedModifier: 1.1, spawnRate: 0.035 },
    3: { target: 500000, speedModifier: 1.4, spawnRate: 0.045 }
};

// Параметры игрока (👛 Кошелёк)
const player = {
    x: 0,
    y: 0,
    radius: 30, 
    emoji: '👛'
};

let items = [];

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (player.x === 0) {
        player.x = canvas.width / 2;
        player.y = canvas.height - 100;
    }
}
window.addEventListener('resize', resizeCanvas);

function movePlayer(clientX, clientY) {
    if (!isPlaying) return;
    const rect = canvas.getBoundingClientRect();
    let targetX = clientX - rect.left;
    let targetY = clientY - rect.top;

    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, targetX));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, targetY));
}

// ПК управление
canvas.addEventListener('mousemove', (e) => movePlayer(e.clientX, e.clientY));

// ИСПРАВЛЕНО: Тач-управление для смартфонов с корректным индексом e.touches[0]
canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0) {
        movePlayer(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: false });

class FallingItem {
    constructor() {
        this.x = Math.random() * (canvas.width - 95) + 47;
        this.y = -40;
        
        const rand = Math.random();
        if (rand < 0.35) {
            const rewards = [
                { text: '+500 ₽', val: 500, color: '#4ade80' },
                { text: '+1 000 ₽', val: 1000, color: '#22c55e' },
                { text: '+5 000 ₽', val: 5000, color: '#34d399' }
            ];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            this.text = reward.text;
            this.value = reward.val;
            this.color = reward.color;
        } else {
            const penalties = [
                { text: '-10 000 ₽', val: -10000, color: '#f87171' },
                { text: '-50 000 ₽', val: -50000, color: '#ef4444' },
                { text: '-100 000 ₽', val: -100000, color: '#b91c1c' }
            ];
            const penalty = penalties[Math.floor(Math.random() * penalties.length)];
            this.text = penalty.text;
            this.value = penalty.val;
            this.color = penalty.color;
        }

        const currentLvlCfg = levels[currentLevel] || levels;
        this.speed = (Math.random() * 1.5 + 2.5) * currentLvlCfg.speedModifier;
        this.width = 94;
        this.height = 34;
        this.radius = 30; 
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        ctx.save();
        ctx.fillStyle = 'rgba(28, 28, 30, 0.95)';
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.5;
        
        ctx.beginPath();
        ctx.roundRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

function gameLoop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.font = `${player.radius * 1.6}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.emoji, player.x, player.y);
    ctx.restore();

    const currentLvlCfg = levels[currentLevel] || levels;
    if (Math.random() < currentLvlCfg.spawnRate) {
        items.push(new FallingItem());
    }

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.update();
        item.draw();

        const dist = Math.hypot(item.x - player.x, item.y - player.y);
        if (dist < player.radius + item.radius) {
            budget += item.value;
            
            if (budget < 0) {
                budget = 0;
                updateUI();
                isPlaying = false;
                items.splice(i, 1);
                showModal(false); 
                return;
            }
            
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
            modalDesc.textContent = `Вы собрали 500 000 ₽! Все бонусы ваши: 3 ракурса + 3D-тур + скидка 5% на проект визуализации! Сделайте скриншот и отправьте Кириллу!`;
            modalBtn.textContent = `Забрать выигрыш`;
        }
    } else {
        modalTitle.textContent = `📉 Бюджет исчерпан!`;
        modalDesc.textContent = `Крупные траты сожгли бюджет. Но вы можете попробовать снова и вернуть свои бонусы!`;
        modalBtn.textContent = `Попробовать снова`;
    }
}

startBtn.addEventListener('click', () => {
    startModal.style.display = 'none';
    isPlaying = true;
    gameLoop();
});

modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    const currentTarget = levels[currentLevel]?.target;
    
    if (budget >= currentTarget && currentLevel < 3) {
        currentLevel++;
    } else {
        currentLevel = 1;
        budget = 0;
    }

    items = [];
    isPlaying = true;
    updateUI();
    gameLoop();
});

resizeCanvas();
updateUI();
