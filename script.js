// ============================================
// VALENTINE'S ADVENTURE - GAME LOGIC
// For Anastasia 💜 - 8 Stages of Fun!
// ============================================

// Game State
let currentStage = 'welcome';
let currentStageIndex = 0;
const TOTAL_STAGES = 8;

// Configuration
const RIDDLE_ANSWER = '22';
const CORRECT_ITEMS = ['🪩', '⚗️', '🌸']; // disco ball, chemistry, flower
const MEMORY_EMOJIS = ['💕', '🌹', '🦄', '🎀', '✨', '🍫', '🌸', '💎']; // 8 pairs = 16 cards

// Massive pool of random emojis for decoys
const ALL_EMOJIS = ['🍕', '⭐', '🎵', '🌙', '☀️', '🎀', '🦋', '🍰', '🎭', '🌈', '💫', '🎪', '🎨', '🎯', '🎲', '🧸', '🌺', '🍩', '🍭', '🎁', '🌻', '🍀', '🎈', '🎃', '🐶', '🐱', '🦊', '🐼', '🦁', '🐸', '🐵', '🦉', '🦚', '🦜', '🐝', '🦋', '🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🥝', '🍑', '🌽', '🥕', '🌶️', '🥑', '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎬', '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '⚡', '🔥', '💧', '🌊', '🌪️', '🌸', '🌼', '🌻', '🌺', '🌷', '💐', '🍄', '🌴', '🌵', '🎄', '🌲', '🌳', '🍂', '🍁'];

// Stage order (removed scramble)
const STAGES = ['welcome', 'riddle', 'memory', 'maze', 'catch', 'hunt', 'drag', 'meter', 'finale'];

// ============================================
// STAGE NAVIGATION
// ============================================

function showStage(stageId) {
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.remove('active');
    });

    const newStage = document.getElementById(`stage-${stageId}`);
    if (newStage) {
        newStage.classList.add('active');
        currentStage = stageId;
        currentStageIndex = STAGES.indexOf(stageId);
        updateProgress();
    }
}

function updateProgress() {
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    if (currentStageIndex === 0) {
        progressContainer.classList.remove('visible');
    } else {
        progressContainer.classList.add('visible');
        const progress = ((currentStageIndex) / (TOTAL_STAGES)) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${currentStageIndex}/${TOTAL_STAGES}`;
    }
}

function startAdventure() {
    showStage('riddle');
}

// ============================================
// STAGE 1: RIDDLE
// ============================================

function checkRiddle() {
    const input = document.getElementById('riddle-answer');
    const feedback = document.getElementById('riddle-feedback');
    const answer = input.value.trim();

    if (answer === RIDDLE_ANSWER) {
        feedback.textContent = '✨ Correct! Moving on...';
        feedback.className = 'feedback success';

        setTimeout(() => {
            initMemoryGame();
            showStage('memory');
        }, 1000);
    } else {
        feedback.textContent = '❌ Not quite... Try again!';
        feedback.className = 'feedback error';
        input.value = '';
        input.focus();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const riddleInput = document.getElementById('riddle-answer');
    if (riddleInput) {
        riddleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkRiddle();
            }
        });
    }

    initNoButton();
});

// ============================================
// STAGE 2: MEMORY MATCH (8 pairs)
// ============================================

let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let matchedEmojis = [];

function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    const matchedDisplay = document.getElementById('matched-display');
    grid.innerHTML = '';
    matchedDisplay.innerHTML = '';
    memoryCards = [];
    flippedCards = [];
    matchedPairs = 0;
    matchedEmojis = [];
    canFlip = true;
    document.getElementById('match-count').textContent = '0';

    // Create pairs (8 pairs = 16 cards)
    const cardPairs = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS];
    cardPairs.sort(() => Math.random() - 0.5);

    cardPairs.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-front"></div>
            <div class="card-back">${emoji}</div>
        `;
        card.addEventListener('click', () => flipCard(card));
        grid.appendChild(card);
        memoryCards.push(card);
    });
}

function flipCard(card) {
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        matchedEmojis.push(card1.dataset.emoji);
        document.getElementById('match-count').textContent = matchedPairs;

        // Show matched emoji
        const matchedDisplay = document.getElementById('matched-display');
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'matched-emoji';
        emojiSpan.textContent = card1.dataset.emoji;
        matchedDisplay.appendChild(emojiSpan);

        flippedCards = [];
        canFlip = true;

        if (matchedPairs === MEMORY_EMOJIS.length) {
            setTimeout(() => {
                initMaze();
                showStage('maze');
            }, 800);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 800);
    }
}

// ============================================
// STAGE 3: MAZE (Patra -> Filiatra)
// ============================================

let mazeCanvas, mazeCtx;
let mazeWidth, mazeHeight;
let playerPos = { x: 0, y: 0 };
let isDrawing = false;
let maze = [];
let cellSize = 20;
let mazeRows, mazeCols;

function initMaze() {
    mazeCanvas = document.getElementById('maze-canvas');
    mazeCtx = mazeCanvas.getContext('2d');

    const container = document.getElementById('maze-container');
    mazeWidth = Math.min(300, window.innerWidth - 60);
    mazeHeight = 280;
    mazeCanvas.width = mazeWidth;
    mazeCanvas.height = mazeHeight;

    cellSize = 20;
    mazeCols = Math.floor(mazeWidth / cellSize);
    mazeRows = Math.floor(mazeHeight / cellSize);

    generateMaze();
    drawMaze();

    playerPos = { x: 1, y: 1 };
    drawPlayer();

    mazeCanvas.addEventListener('mousedown', startMazeMove);
    mazeCanvas.addEventListener('mousemove', mazeMove);
    mazeCanvas.addEventListener('mouseup', endMazeMove);
    mazeCanvas.addEventListener('touchstart', startMazeMove);
    mazeCanvas.addEventListener('touchmove', mazeMove);
    mazeCanvas.addEventListener('touchend', endMazeMove);
}

function generateMaze() {
    maze = [];
    for (let row = 0; row < mazeRows; row++) {
        maze[row] = [];
        for (let col = 0; col < mazeCols; col++) {
            maze[row][col] = 1;
        }
    }

    function carve(row, col) {
        maze[row][col] = 0;

        const directions = [
            [0, -2], [0, 2], [-2, 0], [2, 0]
        ].sort(() => Math.random() - 0.5);

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (newRow > 0 && newRow < mazeRows - 1 &&
                newCol > 0 && newCol < mazeCols - 1 &&
                maze[newRow][newCol] === 1) {
                maze[row + dr / 2][col + dc / 2] = 0;
                carve(newRow, newCol);
            }
        }
    }

    carve(1, 1);

    maze[1][1] = 0;
    maze[mazeRows - 2][mazeCols - 2] = 0;
    maze[mazeRows - 2][mazeCols - 3] = 0;
    maze[mazeRows - 3][mazeCols - 2] = 0;
}

function drawMaze() {
    mazeCtx.fillStyle = 'rgba(155, 89, 182, 0.3)';
    mazeCtx.fillRect(0, 0, mazeWidth, mazeHeight);

    for (let row = 0; row < mazeRows; row++) {
        for (let col = 0; col < mazeCols; col++) {
            if (maze[row][col] === 1) {
                mazeCtx.fillStyle = 'rgba(108, 52, 131, 0.8)';
                mazeCtx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    }

    mazeCtx.fillStyle = 'rgba(107, 255, 138, 0.5)';
    mazeCtx.fillRect(cellSize, cellSize, cellSize, cellSize);

    mazeCtx.fillStyle = 'rgba(255, 107, 198, 0.5)';
    mazeCtx.fillRect((mazeCols - 2) * cellSize, (mazeRows - 2) * cellSize, cellSize, cellSize);
}

function drawPlayer() {
    drawMaze();
    mazeCtx.font = `${cellSize - 4}px Arial`;
    mazeCtx.textAlign = 'center';
    mazeCtx.textBaseline = 'middle';
    mazeCtx.fillText('💜', playerPos.x * cellSize + cellSize / 2, playerPos.y * cellSize + cellSize / 2);
}

function startMazeMove(e) {
    isDrawing = true;
    mazeMove(e);
}

function mazeMove(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const rect = mazeCanvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    const dx = Math.abs(col - playerPos.x);
    const dy = Math.abs(row - playerPos.y);

    if ((dx + dy === 1) && row >= 0 && row < mazeRows && col >= 0 && col < mazeCols && maze[row][col] === 0) {
        playerPos = { x: col, y: row };
        drawPlayer();

        if (row === mazeRows - 2 && col === mazeCols - 2) {
            isDrawing = false;
            setTimeout(() => {
                initCatchGame();
                showStage('catch');
            }, 500);
        }
    }
}

function endMazeMove() {
    isDrawing = false;
}

// ============================================
// STAGE 4: CATCH HEARTS (Simple - no miss limit)
// ============================================

let catchCount = 0;
let catchInterval = null;
let catchTarget = 15;

function initCatchGame() {
    catchCount = 0;
    document.getElementById('catch-count').textContent = '0';
    const area = document.getElementById('catch-area');
    area.innerHTML = '';

    if (catchInterval) clearInterval(catchInterval);
    catchInterval = setInterval(spawnHeart, 600);
}

function spawnHeart() {
    if (catchCount >= catchTarget) return;

    const area = document.getElementById('catch-area');
    const areaRect = area.getBoundingClientRect();

    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = ['💜', '💕', '💗', '💖'][Math.floor(Math.random() * 4)];
    heart.style.left = `${Math.random() * (areaRect.width - 40)}px`;
    heart.style.animationDuration = `${2 + Math.random() * 1.5}s`;

    const catchHeart = (e) => {
        e.preventDefault();
        if (heart.classList.contains('caught')) return;

        heart.classList.add('caught');
        catchCount++;
        document.getElementById('catch-count').textContent = catchCount;

        setTimeout(() => heart.remove(), 300);

        if (catchCount >= catchTarget) {
            clearInterval(catchInterval);
            setTimeout(() => {
                initHuntGrid();
                showStage('hunt');
            }, 500);
        }
    };

    heart.addEventListener('click', catchHeart);
    heart.addEventListener('touchstart', catchHeart);

    area.appendChild(heart);

    // Just remove after animation, no miss counting
    setTimeout(() => {
        if (!heart.classList.contains('caught') && heart.parentNode) {
            heart.remove();
        }
    }, 4000);
}

// ============================================
// STAGE 5: SCAVENGER HUNT (Fully Random Decoys)
// ============================================

let foundItems = [];

function getRandomDecoys(count) {
    const shuffled = [...ALL_EMOJIS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function initHuntGrid() {
    const grid = document.getElementById('hunt-grid');
    grid.innerHTML = '';
    foundItems = [];
    document.getElementById('found-count').textContent = '0';
    document.getElementById('collected-items').innerHTML = '';

    const randomDecoys = getRandomDecoys(17);
    const allItems = [...CORRECT_ITEMS, ...randomDecoys];

    allItems.sort(() => Math.random() - 0.5);

    allItems.forEach(emoji => {
        const item = document.createElement('div');
        item.className = 'hunt-item';
        item.textContent = emoji;
        item.dataset.emoji = emoji;
        item.addEventListener('click', () => handleItemClick(item, emoji));
        grid.appendChild(item);
    });
}

function handleItemClick(element, emoji) {
    if (element.classList.contains('correct') || element.classList.contains('found')) {
        return;
    }

    if (CORRECT_ITEMS.includes(emoji) && !foundItems.includes(emoji)) {
        element.classList.add('correct');
        foundItems.push(emoji);
        document.getElementById('found-count').textContent = foundItems.length;

        const collected = document.getElementById('collected-items');
        const collectedItem = document.createElement('span');
        collectedItem.className = 'collected-item';
        collectedItem.textContent = emoji;
        collected.appendChild(collectedItem);

        if (foundItems.length === CORRECT_ITEMS.length) {
            setTimeout(() => {
                initDragGame();
                showStage('drag');
            }, 800);
        }
    } else {
        element.classList.add('wrong');
        setTimeout(() => {
            element.classList.remove('wrong');
        }, 400);
    }
}

// ============================================
// STAGE 6: DRAG THE KEY
// ============================================

let isDragging = false;
let dragKey = null;
let dragLock = null;
let keyStartX, keyStartY;

function initDragGame() {
    dragKey = document.getElementById('drag-key');
    dragLock = document.getElementById('drag-lock');

    dragKey.style.left = '20%';
    dragKey.style.top = '50%';
    dragKey.style.transform = 'translateY(-50%)';
    dragKey.style.display = 'block';
    dragLock.classList.remove('unlocked');
    dragLock.textContent = '🔒';

    dragKey.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', endDrag);

    dragKey.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', doDrag);
    document.addEventListener('touchend', endDrag);
}

function startDrag(e) {
    e.preventDefault();
    isDragging = true;

    const touch = e.touches ? e.touches[0] : e;
    const rect = dragKey.getBoundingClientRect();
    keyStartX = touch.clientX - rect.left;
    keyStartY = touch.clientY - rect.top;
}

function doDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const area = document.getElementById('drag-area');
    const areaRect = area.getBoundingClientRect();

    let newX = touch.clientX - areaRect.left - keyStartX;
    let newY = touch.clientY - areaRect.top - keyStartY;

    newX = Math.max(0, Math.min(newX, areaRect.width - 60));
    newY = Math.max(0, Math.min(newY, areaRect.height - 60));

    dragKey.style.left = `${newX}px`;
    dragKey.style.top = `${newY}px`;
    dragKey.style.transform = 'none';
}

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    const keyRect = dragKey.getBoundingClientRect();
    const lockRect = dragLock.getBoundingClientRect();

    const keyCenter = {
        x: keyRect.left + keyRect.width / 2,
        y: keyRect.top + keyRect.height / 2
    };

    const lockCenter = {
        x: lockRect.left + lockRect.width / 2,
        y: lockRect.top + lockRect.height / 2
    };

    const distance = Math.sqrt(
        Math.pow(keyCenter.x - lockCenter.x, 2) +
        Math.pow(keyCenter.y - lockCenter.y, 2)
    );

    if (distance < 70) {
        dragLock.classList.add('unlocked');
        dragLock.textContent = '🔓';
        dragKey.style.display = 'none';

        setTimeout(() => {
            initMeter();
            showStage('meter');
        }, 700);
    }
}

// ============================================
// STAGE 7: LOVE METER
// ============================================

let meterValue = 0;
let meterInterval = null;

function initMeter() {
    meterValue = 0;
    updateMeter();

    if (meterInterval) clearInterval(meterInterval);
    meterInterval = setInterval(() => {
        if (meterValue > 0 && meterValue < 100) {
            meterValue = Math.max(0, meterValue - 0.5);
            updateMeter();
        }
    }, 100);
}

function pumpHeart(event) {
    event.preventDefault();

    const heartBtn = document.getElementById('heart-button');
    heartBtn.classList.add('pumping');

    setTimeout(() => {
        heartBtn.classList.remove('pumping');
    }, 150);

    if (meterValue < 100) {
        meterValue = Math.min(100, meterValue + 3);
        updateMeter();

        createMiniHeart();

        if (meterValue >= 100) {
            clearInterval(meterInterval);
            meterComplete();
        }
    }
}

function updateMeter() {
    const fill = document.getElementById('meter-fill');
    const percent = document.getElementById('meter-percent');

    fill.style.width = `${meterValue}%`;
    percent.textContent = `${Math.floor(meterValue)}%`;
}

function createMiniHeart() {
    const heartBtn = document.getElementById('heart-button');
    const rect = heartBtn.getBoundingClientRect();

    const miniHeart = document.createElement('div');
    miniHeart.textContent = '💜';
    miniHeart.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top}px;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 50;
        animation: mini-heart-float 0.8s ease-out forwards;
    `;
    document.body.appendChild(miniHeart);

    setTimeout(() => miniHeart.remove(), 800);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes mini-heart-float {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(style);

function meterComplete() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => createMiniHeart(), i * 50);
    }

    setTimeout(() => {
        showStage('finale');
    }, 500);
}

// ============================================
// STAGE 8: FINALE - THE "NO" BUTTON
// ============================================

function initNoButton() {
    const noBtn = document.getElementById('btn-no');
    const container = document.querySelector('.button-container');

    if (!noBtn || !container) return;

    let escapeCount = 0;
    const messages = [
        "no",
        "really?",
        "you sure?",
        "think again",
        "nope!",
        "try harder",
        "💜",
        "YES!"
    ];

    const handleEscape = (e) => {
        e.preventDefault();
        escapeCount++;

        if (escapeCount >= messages.length - 1) {
            noBtn.textContent = 'YES! 💜';
            noBtn.style.background = 'linear-gradient(135deg, #9b59b6, #e91e8c)';
            noBtn.style.color = 'white';
            noBtn.style.padding = '16px 40px';
            noBtn.style.fontSize = '1.2rem';
            noBtn.onclick = sayYes;
            return;
        }

        const maxX = window.innerWidth - 80;
        const maxY = window.innerHeight - 50;

        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
        noBtn.style.right = 'auto';
        noBtn.textContent = messages[escapeCount];
    };

    noBtn.addEventListener('mouseenter', handleEscape);
    noBtn.addEventListener('touchstart', handleEscape);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleEscape(e);
    });
}

// ============================================
// CELEBRATION
// ============================================

function sayYes() {
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');

    const container = document.getElementById('floating-hearts');
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFloatingHeart(container);
        }, i * 150);
    }

    setInterval(() => {
        createFloatingHeart(container);
    }, 300);
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = ['💜', '💕', '💗', '💖', '✨'][Math.floor(Math.random() * 5)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${3 + Math.random() * 2}s`;
    container.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);
}


// ============================================
// MINIGAMES SECTION
// ============================================

let currentMinigame = null;
let minigameIntervals = [];
let gameLoopId = null; // For requestAnimationFrame

function showMinigamesMenu() {
    showStage('minigames-menu');
}

function startMinigame(game) {
    currentMinigame = game;
    clearAllMinigameIntervals();
    
    switch(game) {
        case 'flappy':
            initFlappyGame();
            showStage('flappy');
            break;
        case 'snake':
            initSnakeGame();
            showStage('snake');
            break;
        case 'runner':
            initRunnerGame();
            showStage('runner');
            break;
        case 'cupid-arrow':
            initCupidArrowGame();
            showStage('cupid-arrow');
            break;
        case 'heartbeat':
            initHeartbeatGame();
            showStage('heartbeat');
            break;
        case 'heart-collector':
            initHeartCollectorGame();
            showStage('heart-collector');
            break;
    }
}

function backToMinigames() {
    clearAllMinigameIntervals();
    showStage('minigames-menu');
}

function clearAllMinigameIntervals() {
    minigameIntervals.forEach(interval => clearInterval(interval));
    minigameIntervals = [];
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
}

function showMinigameWin(message) {
    const winOverlay = document.getElementById('minigame-win');
    const winMessage = document.getElementById('minigame-win-message');
    winMessage.textContent = message || 'Amazing job, love! 💜';
    winOverlay.classList.remove('hidden');
}

function hideMinigameWin() {
    document.getElementById('minigame-win').classList.add('hidden');
    backToMinigames();
}

// ============================================
// MINIGAME 1: FLAPPY HEART
// ============================================

let flappyState = {
    canvas: null, ctx: null,
    bird: { x: 50, y: 150, velocity: 0, gravity: 0.25, lift: -4.5 },
    pipes: [], frame: 0, score: 0, active: false
};

function initFlappyGame() {
    flappyState.canvas = document.getElementById('flappy-canvas');
    flappyState.ctx = flappyState.canvas.getContext('2d');
    const container = flappyState.canvas.parentElement;
    flappyState.canvas.width = container.clientWidth;
    flappyState.canvas.height = 300;
    
    flappyState.bird.y = 150;
    flappyState.bird.velocity = 0;
    flappyState.pipes = [];
    flappyState.score = 0;
    flappyState.frame = 0;
    flappyState.active = false;
    
    document.getElementById('flappy-score').textContent = '0';
    document.getElementById('flappy-start').style.display = 'flex';
    
    // Draw initial state
    drawFlappyGame();
    
    // Event listeners
    flappyState.canvas.onmousedown = flappyTap;
    flappyState.canvas.ontouchstart = (e) => { e.preventDefault(); flappyTap(); };
}

function flappyTap() {
    if (!flappyState.active) {
        flappyState.active = true;
        document.getElementById('flappy-start').style.display = 'none';
        loopFlappyGame();
    }
    flappyState.bird.velocity = flappyState.bird.lift;
}

function loopFlappyGame() {
    if (!flappyState.active || currentMinigame !== 'flappy') return;
    
    updateFlappyGame();
    drawFlappyGame();
    
    if (flappyState.score >= 10) {
        flappyState.active = false;
        showMinigameWin("Your love gives me wings! 🕊️💜");
    } else {
        gameLoopId = requestAnimationFrame(loopFlappyGame);
    }
}

function updateFlappyGame() {
    flappyState.frame++;
    
    // Physics
    flappyState.bird.velocity += flappyState.bird.gravity;
    flappyState.bird.y += flappyState.bird.velocity;
    
    // Boundaries
    if (flappyState.bird.y >= flappyState.canvas.height - 20 || flappyState.bird.y <= 0) {
        resetFlappyGame();
    }
    
    // Pipe spawning
    if (flappyState.frame % 100 === 0) {
        const gap = 100;
        const minHeight = 50;
        const maxPos = flappyState.canvas.height - gap - minHeight;
        const topHeight = Math.floor(Math.random() * (maxPos - minHeight + 1) + minHeight);
        
        flappyState.pipes.push({ x: flappyState.canvas.width, top: topHeight, gap: gap });
    }
    
    // Pipe movement & collision
    for (let i = 0; i < flappyState.pipes.length; i++) {
        let p = flappyState.pipes[i];
        p.x -= 2;
        
        // Collision
        if (flappyState.bird.x + 20 > p.x && flappyState.bird.x < p.x + 40) {
            if (flappyState.bird.y < p.top || flappyState.bird.y + 20 > p.top + p.gap) {
                resetFlappyGame();
            }
        }
        
        // Score
        if (p.x === 10) {
            flappyState.score++;
            document.getElementById('flappy-score').textContent = flappyState.score;
        }
    }
    
    // Remove off-screen pipes
    if (flappyState.pipes.length && flappyState.pipes[0].x < -40) {
        flappyState.pipes.shift();
    }
}

function drawFlappyGame() {
    const ctx = flappyState.ctx;
    ctx.clearRect(0, 0, flappyState.canvas.width, flappyState.canvas.height);
    
    // Bird
    ctx.font = "30px Arial";
    ctx.fillText("🕊️", flappyState.bird.x, flappyState.bird.y + 20);
    
    // Pipes
    ctx.fillStyle = "#ff80ab";
    flappyState.pipes.forEach(p => {
        ctx.fillRect(p.x, 0, 40, p.top); // Top pipe
        ctx.fillRect(p.x, p.top + p.gap, 40, flappyState.canvas.height - p.top - p.gap); // Bottom pipe
    });
}

function resetFlappyGame() {
    flappyState.active = false;
    document.getElementById('flappy-start').innerHTML = "<p>Game Over<br>Tap to Try Again</p>";
    document.getElementById('flappy-start').style.display = 'flex';
    flappyState.bird.y = 150;
    flappyState.bird.velocity = 0;
    flappyState.pipes = [];
    flappyState.score = 0;
    flappyState.frame = 0;
    document.getElementById('flappy-score').textContent = '0';
}

// ============================================
// MINIGAME 2: LOVE SNAKE
// ============================================

let snakeState = {
    canvas: null, ctx: null,
    snake: [], dir: {x: 1, y: 0}, nextDir: {x: 1, y: 0},
    food: {x: 0, y: 0}, score: 0, active: false, speed: 150, lastTime: 0
};
const GRID = 20;

function initSnakeGame() {
    snakeState.canvas = document.getElementById('snake-canvas');
    snakeState.ctx = snakeState.canvas.getContext('2d');
    const container = snakeState.canvas.parentElement;
    snakeState.canvas.width = Math.floor(container.clientWidth / GRID) * GRID;
    snakeState.canvas.height = 300;
    
    snakeState.snake = [{x: 4, y: 4}, {x: 3, y: 4}, {x: 2, y: 4}];
    snakeState.dir = {x: 1, y: 0};
    snakeState.nextDir = {x: 1, y: 0};
    snakeState.score = 0;
    snakeState.active = true;
    
    document.getElementById('snake-score').textContent = '0';
    spawnSnakeFood();
    
    requestAnimationFrame(loopSnakeGame);
    
    // Keyboard controls
    document.addEventListener('keydown', handleSnakeKey);
}

function snakeDir(x, y) {
    // Prevent 180 turns
    if (x !== 0 && snakeState.dir.x !== 0) return;
    if (y !== 0 && snakeState.dir.y !== 0) return;
    snakeState.nextDir = {x, y};
}

function handleSnakeKey(e) {
    if (currentMinigame !== 'snake') return;
    switch(e.key) {
        case 'ArrowUp': snakeDir(0, -1); break;
        case 'ArrowDown': snakeDir(0, 1); break;
        case 'ArrowLeft': snakeDir(-1, 0); break;
        case 'ArrowRight': snakeDir(1, 0); break;
    }
}

function loopSnakeGame(timestamp) {
    if (!snakeState.active || currentMinigame !== 'snake') return;
    
    if (timestamp - snakeState.lastTime > snakeState.speed) {
        updateSnakeGame();
        drawSnakeGame();
        snakeState.lastTime = timestamp;
    }
    
    requestAnimationFrame(loopSnakeGame);
}

function spawnSnakeFood() {
    const maxX = snakeState.canvas.width / GRID;
    const maxY = snakeState.canvas.height / GRID;
    const icons = ['🍎', '🍓', '🍒', '🎁', '💝'];
    snakeState.food = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
        icon: icons[Math.floor(Math.random() * icons.length)]
    };
}

function updateSnakeGame() {
    snakeState.dir = snakeState.nextDir;
    
    const head = {
        x: snakeState.snake[0].x + snakeState.dir.x,
        y: snakeState.snake[0].y + snakeState.dir.y
    };
    
    // Wall collision logic (wrap around)
    const maxX = snakeState.canvas.width / GRID;
    const maxY = snakeState.canvas.height / GRID;
    
    if (head.x < 0) head.x = maxX - 1;
    if (head.x >= maxX) head.x = 0;
    if (head.y < 0) head.y = maxY - 1;
    if (head.y >= maxY) head.y = 0;
    
    // Self collision
    if (snakeState.snake.some(s => s.x === head.x && s.y === head.y)) {
        // Game Over - Reset
        snakeState.snake = [{x: 4, y: 4}, {x: 3, y: 4}, {x: 2, y: 4}];
        snakeState.dir = {x: 1, y: 0};
        snakeState.nextDir = {x: 1, y: 0};
        snakeState.score = 0;
        document.getElementById('snake-score').textContent = '0';
        return;
    }
    
    snakeState.snake.unshift(head);
    
    // Eat food
    if (head.x === snakeState.food.x && head.y === snakeState.food.y) {
        snakeState.score++;
        document.getElementById('snake-score').textContent = snakeState.score;
        spawnSnakeFood();
        
        if (snakeState.score >= 10) {
            snakeState.active = false;
            showMinigameWin("You've grown my love! 🐍❤️");
        }
    } else {
        snakeState.snake.pop();
    }
}

function drawSnakeGame() {
    const ctx = snakeState.ctx;
    ctx.clearRect(0, 0, snakeState.canvas.width, snakeState.canvas.height);
    
    // Draw Food
    ctx.font = "20px Arial";
    ctx.fillText(snakeState.food.icon, snakeState.food.x * GRID, snakeState.food.y * GRID + 18);
    
    // Draw Snake
    ctx.fillStyle = "#4CAF50";
    snakeState.snake.forEach((s, i) => {
        if (i === 0) { // Head
            ctx.fillStyle = "#66BB6A"; // Lighter green head or face
            ctx.font = "20px Arial";
            ctx.fillText("😊", s.x * GRID, s.y * GRID + 18);
        } else {
            ctx.font = "16px Arial";
            ctx.fillText("💚", s.x * GRID, s.y * GRID + 15);
        }
    });
}

// ============================================
// MINIGAME 3: DINO LOVE RUN
// ============================================

let runnerState = {
    canvas: null, ctx: null,
    dino: { x: 50, y: 220, w: 30, h: 40, vy: 0, grounded: true },
    obstacles: [], frame: 0, score: 0, active: false
};

function initRunnerGame() {
    runnerState.canvas = document.getElementById('runner-canvas');
    runnerState.ctx = runnerState.canvas.getContext('2d');
    const container = runnerState.canvas.parentElement;
    runnerState.canvas.width = container.clientWidth;
    runnerState.canvas.height = 280; // Ground at 260
    
    runnerState.dino.y = 220;
    runnerState.dino.vy = 0;
    runnerState.obstacles = [];
    runnerState.score = 0;
    runnerState.frame = 0;
    runnerState.active = false;
    
    document.getElementById('runner-score').textContent = '0';
    document.getElementById('runner-start').style.display = 'flex';
    
    drawRunnerGame();
    
    runnerState.canvas.onmousedown = runnerJump;
    runnerState.canvas.ontouchstart = (e) => { e.preventDefault(); runnerJump(); };
}

function runnerJump() {
    if (!runnerState.active) {
        runnerState.active = true;
        document.getElementById('runner-start').style.display = 'none';
        loopRunnerGame();
    }
    
    if (runnerState.dino.grounded) {
        runnerState.dino.vy = -12;
        runnerState.dino.grounded = false;
    }
}

function loopRunnerGame() {
    if (!runnerState.active || currentMinigame !== 'runner') return;
    updateRunnerGame();
    drawRunnerGame();
    
    if (runnerState.score >= 500) {
        runnerState.active = false;
        showMinigameWin("You outran all the obstacles! 🏃‍♂️💨❤️");
    } else {
        requestAnimationFrame(loopRunnerGame);
    }
}

function updateRunnerGame() {
    runnerState.frame++;
    runnerState.score++;
    document.getElementById('runner-score').textContent = runnerState.score;
    
    // Physics
    runnerState.dino.vy += 0.8; // Gravity
    runnerState.dino.y += runnerState.dino.vy;
    
    if (runnerState.dino.y >= 220) { // Ground
        runnerState.dino.y = 220;
        runnerState.dino.vy = 0;
        runnerState.dino.grounded = true;
    }
    
    // Spawn Obstacles
    if (runnerState.frame % 120 === 0) {
        runnerState.obstacles.push({ x: runnerState.canvas.width, type: Math.random() > 0.5 ? '💔' : '🪨' });
    }
    
    // Move Obstacles & Collision
    for (let i = 0; i < runnerState.obstacles.length; i++) {
        let obs = runnerState.obstacles[i];
        obs.x -= 4; // Speed
        
        // Simple AABB collision (reduced Hitbox)
        if (runnerState.dino.x + 20 > obs.x && runnerState.dino.x < obs.x + 20 &&
            runnerState.dino.y + 30 > 230) { // Ground obstacle check
            
            // Hit!
            runnerState.active = false;
            document.getElementById('runner-start').innerHTML = "<p>Ouch!<br>Tap to Try Again</p>";
            document.getElementById('runner-start').style.display = 'flex';
            runnerState.obstacles = [];
            runnerState.score = 0;
            runnerState.frame = 0;
            return;
        }
    }
    
    if (runnerState.obstacles.length && runnerState.obstacles[0].x < -30) {
        runnerState.obstacles.shift();
    }
}

function drawRunnerGame() {
    const ctx = runnerState.ctx;
    ctx.clearRect(0, 0, runnerState.canvas.width, runnerState.canvas.height);
    
    // Ground
    ctx.beginPath();
    ctx.moveTo(0, 260);
    ctx.lineTo(runnerState.canvas.width, 260);
    ctx.stroke();
    
    // Dino (Runner)
    ctx.font = "30px Arial";
    ctx.fillText("🏃", runnerState.dino.x, runnerState.dino.y + 30);
    
    // Obstacles
    runnerState.obstacles.forEach(obs => {
        ctx.fillText(obs.type, obs.x, 255);
    });
}

// ============================================
// MINIGAME 4: CUPID'S ARROW (Kept & Updated ID)
// ============================================

let cupidScore = 0;
const CUPID_TARGET = 10;

function initCupidArrowGame() {
    cupidScore = 0;
    document.getElementById('cupid-score').textContent = '0';
    const arena = document.getElementById('cupid-arena');
    arena.innerHTML = '';
    
    const interval = setInterval(() => {
        if (cupidScore >= CUPID_TARGET) {
            clearInterval(interval);
            return;
        }
        spawnCupidHeart();
    }, 800);
    minigameIntervals.push(interval);
}

function spawnCupidHeart() {
    if (cupidScore >= CUPID_TARGET) return;
    
    const arena = document.getElementById('cupid-arena');
    const heart = document.createElement('div');
    heart.className = 'cupid-heart';
    heart.textContent = ['💕', '💗', '💖', '💘'][Math.floor(Math.random() * 4)];
    
    // Random position
    const maxX = arena.clientWidth - 50;
    const maxY = arena.clientHeight - 50;
    heart.style.left = `${Math.random() * maxX}px`;
    heart.style.top = `${Math.random() * maxY}px`;
    
    // Moving animation
    heart.style.animation = `cupid-float ${2 + Math.random()}s ease-in-out infinite alternate`;
    
    const hitHeart = (e) => {
        e.preventDefault();
        if (heart.classList.contains('hit')) return;
        
        heart.classList.add('hit');
        cupidScore++;
        document.getElementById('cupid-score').textContent = cupidScore;
        
        setTimeout(() => heart.remove(), 300);
        
        if (cupidScore >= CUPID_TARGET) {
            clearAllMinigameIntervals();
            setTimeout(() => {
                showMinigameWin('Cupid would be proud! 💘');
            }, 500);
        }
    };
    
    heart.addEventListener('click', hitHeart);
    heart.addEventListener('touchstart', hitHeart);
    
    arena.appendChild(heart);
    
    // Remove after time if not hit
    setTimeout(() => {
        if (!heart.classList.contains('hit') && heart.parentNode) {
            heart.classList.add('escaped');
            setTimeout(() => heart.remove(), 300);
        }
    }, 3000);
}

// ============================================
// MINIGAME 5: HEARTBEAT RHYTHM (Kept)
// ============================================

let rhythmPerfect = 0;
let rhythmGood = 0;
let rhythmHearts = [];
const RHYTHM_TARGET = 8;

function initHeartbeatGame() {
    rhythmPerfect = 0;
    rhythmGood = 0;
    rhythmHearts = [];
    document.getElementById('rhythm-perfect').textContent = '0';
    document.getElementById('rhythm-good').textContent = '0';
    
    const track = document.getElementById('rhythm-track');
    const existingHearts = track.querySelectorAll('.rhythm-heart');
    existingHearts.forEach(h => h.remove());
    
    let heartsSpawned = 0;
    const interval = setInterval(() => {
        if (heartsSpawned >= RHYTHM_TARGET) {
            clearInterval(interval);
            return;
        }
        spawnRhythmHeart();
        heartsSpawned++;
    }, 1200);
    minigameIntervals.push(interval);
    
    const tapArea = document.getElementById('rhythm-tap-area');
    tapArea.onclick = null;
    tapArea.ontouchstart = null;
    tapArea.addEventListener('click', handleRhythmTap);
    tapArea.addEventListener('touchstart', handleRhythmTap);
}

function spawnRhythmHeart() {
    const track = document.getElementById('rhythm-track');
    const heart = document.createElement('div');
    heart.className = 'rhythm-heart';
    heart.textContent = '💜';
    heart.dataset.spawned = Date.now();
    
    track.appendChild(heart);
    rhythmHearts.push(heart);
    
    // Remove after animation
    setTimeout(() => {
        if (heart.parentNode && !heart.classList.contains('hit')) {
            heart.remove();
            rhythmHearts = rhythmHearts.filter(h => h !== heart);
        }
    }, 2500);
}

function handleRhythmTap(e) {
    e.preventDefault();
    
    const tapArea = document.getElementById('rhythm-tap-area');
    tapArea.classList.add('tapped');
    setTimeout(() => tapArea.classList.remove('tapped'), 100);
    
    // Find heart closest to zone
    const zone = document.querySelector('.rhythm-zone');
    const zoneRect = zone.getBoundingClientRect();
    const zoneCenter = zoneRect.top + zoneRect.height / 2;
    
    let closestHeart = null;
    let closestDist = Infinity;
    
    rhythmHearts.forEach(heart => {
        if (heart.classList.contains('hit')) return;
        const heartRect = heart.getBoundingClientRect();
        const heartCenter = heartRect.top + heartRect.height / 2;
        const dist = Math.abs(heartCenter - zoneCenter);
        if (dist < closestDist) {
            closestDist = dist;
            closestHeart = heart;
        }
    });
    
    if (closestHeart && closestDist < 80) {
        closestHeart.classList.add('hit');
        
        if (closestDist < 25) {
            rhythmPerfect++;
            document.getElementById('rhythm-perfect').textContent = rhythmPerfect;
            closestHeart.classList.add('perfect');
        } else {
            rhythmGood++;
            document.getElementById('rhythm-good').textContent = rhythmGood;
            closestHeart.classList.add('good');
        }
        
        setTimeout(() => closestHeart.remove(), 300);
        rhythmHearts = rhythmHearts.filter(h => h !== closestHeart);
        
        if (rhythmPerfect + rhythmGood >= RHYTHM_TARGET) {
            setTimeout(() => {
                showMinigameWin(`Your heart beats for me! 💜 Perfect: ${rhythmPerfect}`);
            }, 500);
        }
    }
}

// ============================================
// MINIGAME 6: HEART COLLECTOR (Kept)
// ============================================

let collectorScore = 0;
const COLLECTOR_TARGET = 20;
let basketX = 50;

function initHeartCollectorGame() {
    collectorScore = 0;
    basketX = 50;
    document.getElementById('collector-score').textContent = '0';
    
    const arena = document.getElementById('collector-arena');
    const existingHearts = arena.querySelectorAll('.collector-heart');
    existingHearts.forEach(h => h.remove());
    
    const basket = document.getElementById('collector-basket');
    basket.style.left = '50%';
    
    // Mouse/touch controls
    arena.onmousemove = (e) => moveBasket(e, arena);
    arena.ontouchmove = (e) => {
        e.preventDefault();
        moveBasket(e.touches[0], arena);
    };
    
    const interval = setInterval(() => {
        if (collectorScore >= COLLECTOR_TARGET) {
            clearInterval(interval);
            return;
        }
        spawnCollectorHeart();
    }, 600);
    minigameIntervals.push(interval);
}

function moveBasket(e, arena) {
    const rect = arena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    basketX = Math.max(30, Math.min(x, rect.width - 30));
    
    const basket = document.getElementById('collector-basket');
    basket.style.left = `${basketX}px`;
}

function spawnCollectorHeart() {
    if (collectorScore >= COLLECTOR_TARGET) return;
    
    const arena = document.getElementById('collector-arena');
    const heart = document.createElement('div');
    heart.className = 'collector-heart';
    
    // Sometimes spawn broken hearts
    if (Math.random() < 0.2) {
        heart.textContent = '💔';
        heart.dataset.bad = 'true';
    } else {
        heart.textContent = ['💕', '💗', '💖', '💜'][Math.floor(Math.random() * 4)];
    }
    
    heart.style.left = `${20 + Math.random() * (arena.clientWidth - 60)}px`;
    arena.appendChild(heart);
    
    // Check collision during fall
    const checkCollision = setInterval(() => {
        if (!heart.parentNode) {
            clearInterval(checkCollision);
            return;
        }
        
        const heartRect = heart.getBoundingClientRect();
        const basket = document.getElementById('collector-basket');
        const basketRect = basket.getBoundingClientRect();
        
        // Check if heart reached basket level
        if (heartRect.bottom >= basketRect.top && heartRect.top <= basketRect.bottom) {
            if (heartRect.left < basketRect.right && heartRect.right > basketRect.left) {
                clearInterval(checkCollision);
                heart.classList.add('caught');
                
                if (heart.dataset.bad === 'true') {
                    collectorScore = Math.max(0, collectorScore - 2);
                    basket.classList.add('shake');
                    setTimeout(() => basket.classList.remove('shake'), 300);
                } else {
                    collectorScore++;
                }
                
                document.getElementById('collector-score').textContent = collectorScore;
                setTimeout(() => heart.remove(), 200);
                
                if (collectorScore >= COLLECTOR_TARGET) {
                    clearAllMinigameIntervals();
                    setTimeout(() => {
                        showMinigameWin('You caught all my love! 💝');
                    }, 500);
                }
            }
        }
        
        // Heart fell off screen
        if (heartRect.top > arena.getBoundingClientRect().bottom) {
            clearInterval(checkCollision);
            heart.remove();
        }
    }, 50);
    
    // Safety cleanup
    setTimeout(() => {
        clearInterval(checkCollision);
        heart.remove();
    }, 4000);
}

