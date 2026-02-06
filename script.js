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

function showMinigamesMenu() {
    showStage('minigames-menu');
}

function startMinigame(game) {
    currentMinigame = game;
    clearAllMinigameIntervals();
    
    switch(game) {
        case 'love-letter':
            initLoveLetterGame();
            showStage('love-letter');
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
        case 'bubble-pop':
            initBubblePopGame();
            showStage('bubble-pop');
            break;
        case 'connect-hearts':
            initConnectHeartsGame();
            showStage('connect-hearts');
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
// MINIGAME 1: LOVE LETTER PUZZLE
// ============================================

const LOVE_MESSAGE = ['I', 'love', 'you', 'more', 'each', 'day'];
let selectedWords = [];

function initLoveLetterGame() {
    const display = document.getElementById('love-letter-display');
    const wordsContainer = document.getElementById('love-letter-words');
    display.innerHTML = '';
    wordsContainer.innerHTML = '';
    selectedWords = [];
    
    // Create empty slots
    LOVE_MESSAGE.forEach((_, i) => {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.dataset.index = i;
        slot.addEventListener('click', () => removeWord(i));
        display.appendChild(slot);
    });
    
    // Create shuffled words
    const shuffled = [...LOVE_MESSAGE].sort(() => Math.random() - 0.5);
    shuffled.forEach(word => {
        const wordEl = document.createElement('button');
        wordEl.className = 'letter-word';
        wordEl.textContent = word;
        wordEl.dataset.word = word;
        wordEl.addEventListener('click', () => selectWord(word, wordEl));
        wordsContainer.appendChild(wordEl);
    });
}

function selectWord(word, element) {
    if (element.classList.contains('used')) return;
    if (selectedWords.length >= LOVE_MESSAGE.length) return;
    
    element.classList.add('used');
    selectedWords.push({ word, element });
    
    const slots = document.querySelectorAll('.letter-slot');
    const currentSlot = slots[selectedWords.length - 1];
    currentSlot.textContent = word;
    currentSlot.classList.add('filled');
    
    checkLoveLetterComplete();
}

function removeWord(index) {
    if (index >= selectedWords.length) return;
    
    const removedWords = selectedWords.splice(index);
    removedWords.forEach(item => {
        item.element.classList.remove('used');
    });
    
    updateLoveLetterDisplay();
}

function updateLoveLetterDisplay() {
    const slots = document.querySelectorAll('.letter-slot');
    slots.forEach((slot, i) => {
        if (i < selectedWords.length) {
            slot.textContent = selectedWords[i].word;
            slot.classList.add('filled');
        } else {
            slot.textContent = '';
            slot.classList.remove('filled');
        }
    });
}

function checkLoveLetterComplete() {
    if (selectedWords.length !== LOVE_MESSAGE.length) return;
    
    const isCorrect = selectedWords.every((item, i) => item.word === LOVE_MESSAGE[i]);
    if (isCorrect) {
        setTimeout(() => {
            showMinigameWin('You spelled out my love! 💕');
        }, 500);
    }
}

// ============================================
// MINIGAME 2: CUPID'S ARROW
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
// MINIGAME 3: HEARTBEAT RHYTHM
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
// MINIGAME 4: HEART COLLECTOR
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

// ============================================
// MINIGAME 5: LOVE BUBBLE POP
// ============================================

const BUBBLE_SEQUENCE = ['💗', '💕', '💖', '💜', '💝'];
let bubbleIndex = 0;

function initBubblePopGame() {
    bubbleIndex = 0;
    document.getElementById('bubble-next').textContent = BUBBLE_SEQUENCE[0];
    
    const arena = document.getElementById('bubble-arena');
    arena.innerHTML = '';
    
    // Create bubbles with all heart types
    const shuffled = [...BUBBLE_SEQUENCE].sort(() => Math.random() - 0.5);
    shuffled.forEach((heart, i) => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = heart;
        bubble.dataset.heart = heart;
        
        // Random position
        const angle = (i / BUBBLE_SEQUENCE.length) * Math.PI * 2;
        const radius = 60 + Math.random() * 40;
        const centerX = arena.clientWidth / 2;
        const centerY = arena.clientHeight / 2;
        
        bubble.style.left = `${centerX + Math.cos(angle) * radius - 30}px`;
        bubble.style.top = `${centerY + Math.sin(angle) * radius - 30}px`;
        
        bubble.addEventListener('click', () => popBubble(bubble, heart));
        bubble.addEventListener('touchstart', (e) => {
            e.preventDefault();
            popBubble(bubble, heart);
        });
        
        arena.appendChild(bubble);
    });
}

function popBubble(bubble, heart) {
    if (bubble.classList.contains('popped')) return;
    
    if (heart === BUBBLE_SEQUENCE[bubbleIndex]) {
        bubble.classList.add('popped');
        bubbleIndex++;
        
        if (bubbleIndex < BUBBLE_SEQUENCE.length) {
            document.getElementById('bubble-next').textContent = BUBBLE_SEQUENCE[bubbleIndex];
        }
        
        if (bubbleIndex >= BUBBLE_SEQUENCE.length) {
            setTimeout(() => {
                showMinigameWin('All bubbles popped perfectly! 🌹');
            }, 500);
        }
    } else {
        bubble.classList.add('wrong');
        setTimeout(() => bubble.classList.remove('wrong'), 300);
    }
}

// ============================================
// MINIGAME 6: CONNECT HEARTS
// ============================================

const HEART_PAIRS = ['❤️', '🧡', '💛', '💚'];
let connectScore = 0;
let selectedHeart = null;

function initConnectHeartsGame() {
    connectScore = 0;
    selectedHeart = null;
    document.getElementById('connect-score').textContent = '0';
    
    const arena = document.getElementById('connect-arena');
    arena.innerHTML = '';
    
    // Create pairs (each heart appears twice)
    const allHearts = [...HEART_PAIRS, ...HEART_PAIRS];
    allHearts.sort(() => Math.random() - 0.5);
    
    allHearts.forEach((heart, i) => {
        const heartEl = document.createElement('div');
        heartEl.className = 'connect-heart';
        heartEl.textContent = heart;
        heartEl.dataset.heart = heart;
        heartEl.dataset.index = i;
        
        heartEl.addEventListener('click', () => selectConnectHeart(heartEl, heart));
        heartEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectConnectHeart(heartEl, heart);
        });
        
        arena.appendChild(heartEl);
    });
}

function selectConnectHeart(element, heart) {
    if (element.classList.contains('matched')) return;
    
    if (!selectedHeart) {
        // First selection
        selectedHeart = { element, heart };
        element.classList.add('selected');
    } else if (selectedHeart.element === element) {
        // Deselect
        element.classList.remove('selected');
        selectedHeart = null;
    } else if (selectedHeart.heart === heart) {
        // Match!
        selectedHeart.element.classList.remove('selected');
        selectedHeart.element.classList.add('matched');
        element.classList.add('matched');
        
        connectScore++;
        document.getElementById('connect-score').textContent = connectScore;
        selectedHeart = null;
        
        if (connectScore >= HEART_PAIRS.length) {
            setTimeout(() => {
                showMinigameWin('All hearts connected! 💫');
            }, 500);
        }
    } else {
        // No match
        selectedHeart.element.classList.add('wrong');
        element.classList.add('wrong');
        
        const prevSelected = selectedHeart.element;
        setTimeout(() => {
            prevSelected.classList.remove('selected', 'wrong');
            element.classList.remove('wrong');
        }, 400);
        
        selectedHeart = null;
    }
}
