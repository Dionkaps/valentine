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
