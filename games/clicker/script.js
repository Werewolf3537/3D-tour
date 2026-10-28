// Игровое состояние
let money = 0;
let income = 0;
let totalProgress = 0;

// Данные товаров в магазине
const shopItems = {
    walls: { cost: 100, income: 10, prog: 15, bought: false, btnId: 'upg-walls', costId: 'cost-walls' },
    floor: { cost: 500, income: 50, prog: 25, bought: false, btnId: 'upg-floor', costId: 'cost-floor' },
    light: { cost: 2500, income: 200, prog: 30, bought: false, btnId: 'upg-light', costId: 'cost-light' },
    furniture: { cost: 10000, income: 1000, prog: 30, bought: false, btnId: 'upg-furniture', costId: 'cost-furniture' }
};

// Получение элементов из HTML
const clickTarget = document.getElementById('click-target');
const moneyDisplay = document.getElementById('money-display');
const incomeDisplay = document.getElementById('income-display');
const progressDisplay = document.getElementById('progress-display');
const renderPic = document.getElementById('render-pic');
const winModal = document.getElementById('win-modal');

// Логика клика
clickTarget.addEventListener('click', () => {
    // Базовый 1 рубль + бонус 10% от текущего пассивного дохода
    money += 1 + Math.floor(income * 0.1);
    updateUI();
});

// Логика покупки
function buyItem(key) {
    const item = shopItems[key];
    if (money >= item.cost && !item.bought) {
        money -= item.cost;
        item.bought = true; 
        income += item.income;
        totalProgress += item.prog;
        
        updateRenderView();
        updateUI();
        checkWin();
    }
}

// Привязка кликов к кнопкам в магазине
Object.keys(shopItems).forEach(key => {
    document.getElementById(shopItems[key].btnId).addEventListener('click', () => buyItem(key));
});

// Эффект проявления рендера
function updateRenderView() {
    const blurVal = 20 - (totalProgress * 0.2); 
    const grayVal = 100 - totalProgress;        
    const opacityVal = 0.1 + (totalProgress * 0.009); 

    renderPic.style.filter = `blur(${blurVal}px) grayscale(${grayVal}%)`;
    renderPic.style.opacity = opacityVal;
}

// Обновление интерфейса
function updateUI() {
    moneyDisplay.textContent = Math.floor(money).toLocaleString('ru-RU');
    incomeDisplay.textContent = income;
    progressDisplay.textContent = totalProgress;

    Object.keys(shopItems).forEach(key => {
        const item = shopItems[key];
        const btn = document.getElementById(item.btnId);
        const costSpan = document.getElementById(item.costId);
        
        if (item.bought) {
            btn.disabled = true;
            costSpan.textContent = "Готово ✓";
            btn.style.background = "#1d3527";
        } else {
            if (money >= item.cost) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        }
    });
}

// Проверка на финал игры
function checkWin() {
    if (totalProgress >= 100) {
        setTimeout(() => {
            winModal.style.display = 'flex';
        }, 600);
    }
}

// Главный таймер (начисление каждую секунду)
setInterval(() => {
    money += income;
    updateUI();
}, 1000);

// Первичный запуск для настройки кнопок
updateUI();
