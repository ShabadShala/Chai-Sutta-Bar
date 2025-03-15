     
            
            
            
            function createCalculator() {
                const calculatorHTML = `
                <div class="calculator-modal-overlay" id="calculatorOverlay">
                
                <div class="calculator">
                <input type="text" id="calcDisplay" class="display" disabled>
                <div class="buttons">
                <button onclick="append('7')">7</button>
                <button onclick="append('8')">8</button>
                <button onclick="append('9')">9</button>
                <button onclick="append('/')">/</button>
                <button onclick="append('4')">4</button>
                <button onclick="append('5')">5</button>
                <button onclick="append('6')">6</button>
                <button onclick="append('*')">*</button>
                <button onclick="append('1')">1</button>
                <button onclick="append('2')">2</button>
                <button onclick="append('3')">3</button>
                <button onclick="append('-')">-</button>
                <button onclick="append('0')">0</button>
                <button onclick="append('00')">00</button>
                <button onclick="append('.')">.</button>
                <button onclick="append('+')">+</button>
                <button onclick="clearDisplay()" class="clear">Clear</button>
                <button onclick="backspace()" class="backspace">⌫</button>
                <button onclick="calculate()" class="equal">=</button>
                </div>
                </div>
                </div>`;
                
                document.body.insertAdjacentHTML('beforeend', calculatorHTML);
            } 
            
            
            
            // Moved calculator functions INSIDE DOMContentLoaded to ensure proper initialization
            document.addEventListener('DOMContentLoaded', () => {
                // Create calculator first
                createCalculator();
                
                // Now that calculator exists, get reference to display
                const calcDisplay = document.getElementById('calcDisplay');
                const operators = ['+', '-', '*', '/'];
                let isResultDisplayed = false;
                
                // Calculator functions
                window.append = function(value) {  // Make functions global
                    if (isResultDisplayed && !operators.includes(value)) {
                        calcDisplay.value = '';
                        isResultDisplayed = false;
                    }
                    
                    const lastChar = calcDisplay.value.slice(-1);
                    
                    if (operators.includes(value)) {
                        if (operators.includes(lastChar)) {
                            calcDisplay.value = calcDisplay.value.slice(0, -1) + value;
                            } else if (calcDisplay.value !== '') {
                            calcDisplay.value += value;
                        }
                        } else {
                        calcDisplay.value += value;
                    }
                };
                
                window.calculate = function() {
                    try {
                        calcDisplay.value = eval(calcDisplay.value);
                        isResultDisplayed = true;
                        } catch {
                        calcDisplay.value = 'Error';
                        isResultDisplayed = true;
                    }
                };
                
                window.clearDisplay = function() {
                    calcDisplay.value = '';
                    isResultDisplayed = false;
                };
                
                window.backspace = function() {
                    calcDisplay.value = calcDisplay.value.slice(0, -1);
                };
                
     
                
                document.addEventListener('click', (e) => {
                    const overlay = document.getElementById('calculatorOverlay');
                    if (e.target === overlay) {
                        document.getElementById('calculatorOverlay').style.display = 'none';
                    }
                });
            });
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            // Insert the stopwatch modal HTML using template strings
            document.body.insertAdjacentHTML('beforeend', `
            <div id="stopwatchModal" class="stopwatch-modal-overlay" style="display: none;">
            <div class="stopwatch-modal">
            <span id="muteToggle" class="mute-toggle" style="position: absolute; top: 10px; left: 10px; font-size: 16px; cursor: pointer;">🔊</span>
            <div class="stopwatch-display">
            <canvas id="analogClock" width="150" height="150"></canvas>
            <div id="digitalDisplay" class="digital-display">00:00:00</div>
            </div>
            <div class="stopwatch-controls">
            <button id="startStopBtn">Start</button>
            <button id="resetBtn">Reset</button>
            </div>
            <span id="closeStopwatch" class="stopwatch-close-btn">×</span>
            </div>
            </div>
            <audio id="tickSound" src="https://assets.mixkit.co/active_storage/sfx/3003/3003-preview.mp3"></audio>
            `);
            
            
            
            // Select elements
            const digitalDisplay = document.getElementById('digitalDisplay');
            const startStopBtn = document.getElementById('startStopBtn');
            const resetBtn = document.getElementById('resetBtn');
            const canvas = document.getElementById('analogClock');
            const ctx = canvas.getContext('2d');
            const tickSound = document.getElementById('tickSound');
            const muteToggle = document.getElementById('muteToggle');
            
            let isMuted = false;
            let stopwatchInterval;
            let startTime;
            let elapsedTime = 0;
            let isRunning = false;
            let lastPlayedMinute = 0;
            

            
            document.getElementById('closeStopwatch').addEventListener('click', () => {
                document.getElementById('stopwatchModal').style.display = 'none';
            });
            
            startStopBtn.addEventListener('click', () => {
                isRunning ? stopStopwatch() : startStopwatch();
            });
            
            resetBtn.addEventListener('click', resetStopwatch);
            
            muteToggle.addEventListener('click', () => {
                isMuted = !isMuted;
                muteToggle.textContent = isMuted ? '🔇' : '🔊';
            });
            
            function startStopwatch() {
                if (!isRunning) {
                    isRunning = true;
                    startStopBtn.textContent = 'Stop';
                    startTime = Date.now() - elapsedTime;
                    stopwatchInterval = setInterval(updateDisplay, 10);
                }
            }
            
            function stopStopwatch() {
                if (isRunning) {
                    isRunning = false;
                    startStopBtn.textContent = 'Start';
                    clearInterval(stopwatchInterval);
                }
            }
            
            function resetStopwatch() {
                stopStopwatch();
                elapsedTime = 0;
                lastPlayedMinute = 0;
                digitalDisplay.textContent = '00:00:00';
                drawAnalog(0, 0, 0);
            }
            
            function updateDisplay() {
                elapsedTime = Date.now() - startTime;
                const totalSeconds = elapsedTime / 1000;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = Math.floor(totalSeconds % 60);
                const tenths = Math.floor((elapsedTime % 1000) / 100);
                
                digitalDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(tenths).padStart(2, '0')}`;
                
                // Play tick sound every full minute if not muted
                if (minutes > lastPlayedMinute) {
                    lastPlayedMinute = minutes;
                    if (!isMuted) {
                        playTickSound();
                    }
                }
                
                drawAnalog(minutes, seconds, tenths);
            }
            
            function playTickSound() {
                tickSound.currentTime = 0;
                tickSound.play();
            }
            
            function drawAnalog(minutes, seconds, tenths) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw clock face
                ctx.beginPath();
                ctx.arc(75, 75, 70, 0, Math.PI * 2);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                drawHand(minutes * 6, 50, 3, '#333');
                drawHand(seconds * 6, 60, 2, '#f44336');
                drawHand(tenths * 36, 30, 1, '#4CAF50');
            }
            
            function drawHand(degrees, length, width, color) {
                const angle = (degrees - 90) * Math.PI / 180;
                const centerX = 75;
                const centerY = 75;
                
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length);
                ctx.strokeStyle = color;
                ctx.lineWidth = width;
                ctx.stroke();
            }
            
            // Initialize analog clock
            drawAnalog(0, 0, 0);
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            const puzzleModal = `
            <div id="puzzleModal" class="puzzle-modal-overlay" style="display: none;">
            <div class="puzzle-modal">
            <div class="puzzle-header">
            <h2>Sliding Numbers</h2>
            <select id="gridSize">
            <option value="3">3x3</option>
            <option value="4" selected>4x4</option>
            <option value="5">5x5</option>
            </select>
            </div>
            <div class="puzzle-grid" id="puzzleGrid"></div>
            <div class="puzzle-controls">
            <button id="restartPuzzle">Restart</button>
            <button id="solvePuzzle">Solve</button>
            </div>
            </div>
            </div>`;
            
            
            document.body.insertAdjacentHTML('beforeend', puzzleModal);
            
            
            let puzzleState = [];
            let moveHistory = [];
            let gridSize = 4;
            

            
            document.getElementById('gridSize').addEventListener('change', (e) => {
                gridSize = parseInt(e.target.value);
                initializePuzzle(gridSize);
            });
            
            document.getElementById('restartPuzzle').addEventListener('click', () => initializePuzzle(gridSize));
            document.getElementById('solvePuzzle').addEventListener('click', solvePuzzle);
            
            document.getElementById('solvePuzzle').disabled = false;
            
            function initializePuzzle(size) {
                puzzleState = [];
                const totalTiles = size * size;
                const grid = document.getElementById('puzzleGrid');
                
                grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
                grid.innerHTML = '';
                
                // Enable Solve button on restart
                document.getElementById('solvePuzzle').disabled = false;
                
                // Create tiles
                for(let i = 1; i < totalTiles; i++) {
                    puzzleState.push(i);
                }
                puzzleState.push(null); // Empty space
                
                shufflePuzzle();
                renderPuzzle(grid, size);
            }
            
            function shufflePuzzle() {
                let inversions;
                do {
                    // Fisher-Yates shuffle
                    for(let i = puzzleState.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [puzzleState[i], puzzleState[j]] = [puzzleState[j], puzzleState[i]];
                    }
                    inversions = countInversions();
                } while((gridSize % 2 === 0 && inversions % 2 !== 0) || 
                (gridSize % 2 !== 0 && inversions % 2 === 0));
            }
            
            function countInversions() {
                let count = 0;
                const arr = puzzleState.filter(x => x !== null);
                for(let i = 0; i < arr.length; i++) {
                    for(let j = i + 1; j < arr.length; j++) {
                        if(arr[i] > arr[j]) count++;
                    }
                }
                return count;
            }
            
            function renderPuzzle(grid, size) {
                grid.innerHTML = '';
                puzzleState.forEach((num, index) => {
                    const tile = document.createElement('div');
                    tile.className = `puzzle-tile ${num ? '' : 'empty'}`;
                    tile.textContent = num || '';
                    tile.addEventListener('click', () => moveTile(index));
                    grid.appendChild(tile);
                });
            }
            
            function moveTile(index) {
                const emptyIndex = puzzleState.indexOf(null);
                const row = Math.floor(index / gridSize);
                const col = index % gridSize;
                const emptyRow = Math.floor(emptyIndex / gridSize);
                const emptyCol = emptyIndex % gridSize;
                
                if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
                    moveHistory.push([...puzzleState]);
                    [puzzleState[index], puzzleState[emptyIndex]] = [puzzleState[emptyIndex], puzzleState[index]];
                    renderPuzzle(document.getElementById('puzzleGrid'), gridSize);
                    checkSolved(); // Always check after a move
                }
            }
            
            
            function checkSolved() {
                const solveButton = document.getElementById('solvePuzzle');
                const solved = puzzleState.slice(0, -1).every((num, index) => num === index + 1);
                
                if (solved) {
                    solveButton.disabled = true;
                    setTimeout(() => alert('Congratulations! You solved the puzzle! ☕'), 100);
                    } else {
                    solveButton.disabled = false; // Re-enable if the puzzle is not solved
                }
            }
            
            function solvePuzzle() {
                puzzleState = [];
                const totalTiles = gridSize * gridSize;
                for (let i = 1; i < totalTiles; i++) {
                    puzzleState.push(i);
                }
                puzzleState.push(null); // Empty space at the end
                renderPuzzle(document.getElementById('puzzleGrid'), gridSize);
                moveHistory = [];
                
                // Disable Solve button after solving
                document.getElementById('solvePuzzle').disabled = true;
            }
            
            
            // Close modal when clicking outside
            document.querySelector('.puzzle-modal-overlay').addEventListener('click', (e) => {
                if(e.target === document.querySelector('.puzzle-modal-overlay')) {
                    document.getElementById('puzzleModal').style.display = 'none';
                }
            });
            
            // Initialize default puzzle
            initializePuzzle(4);
            
            
            
            
            
            
            
            
            
            
            
            
            
  // Initialize Tic-Tac-Toe Modal Game
function ticInitGame() {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="tic-modal" class="tic-modal">
      <div class="tic-modal-content">
        <span id="tic-close-btn" class="tic-close-btn">&times;</span>
        <select id="tic-board-size" class="tic-board-size">
          <option value="3">3x3</option>
          <option value="4">4x4</option>
          <option value="5">5x5</option>
        </select>
        <div id="tic-container" class="tic-container">
          <div id="tic-board" class="tic-board"></div>
          <div id="tic-status" class="tic-status">Select board size to start the game</div>
          <button id="tic-reset" class="tic-reset">Reset</button>
        </div>
      </div>
    </div>
  `);

  let boardSize = 3;
  let board = [];
  let currentPlayer = 'X';
  const status = document.getElementById('tic-status');
  const boardElement = document.getElementById('tic-board');

  // Function to create the game board
  function createBoard(size) {
    board = Array(size * size).fill('');
    boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    boardElement.innerHTML = board.map((_, i) =>
      `<div class="tic-cell" data-index="${i}"></div>`).join('');
    document.querySelectorAll('.tic-cell').forEach(cell =>
      cell.addEventListener('click', handleCellClick)
    );
    status.innerHTML = `<span style='color: blue;'>Player X's Turn</span>`;
  }

  // Function to check for winner
  function checkWinner() {
    const winLength = boardSize;
    const getLine = (start, step) => {
      const line = [];
      for (let i = 0; i < winLength; i++) {
        line.push(start + i * step);
      }
      return line;
    };

    const lines = [];
    for (let i = 0; i < boardSize; i++) {
      lines.push(getLine(i * boardSize, 1));
      lines.push(getLine(i, boardSize));
    }
    lines.push(getLine(0, boardSize + 1));
    lines.push(getLine(boardSize - 1, boardSize - 1));

    return lines.some(line => 
      line.every(index => board[index] === currentPlayer)
    );
  }

  // Handle cell clicks
  function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] || checkWinner()) return;
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    if (checkWinner()) {
      status.textContent = `Player ${currentPlayer} Wins!`;
    } else if (board.every(cell => cell)) {
      status.textContent = "It's a Draw!";
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      status.innerHTML = `<span style='color: ${currentPlayer === 'X' ? 'blue' : 'red'};'>Player ${currentPlayer}'s Turn</span>`;
    }
  }

  // Dynamic board creation on size change
  document.getElementById('tic-board-size').addEventListener('change', (e) => {
    boardSize = parseInt(e.target.value);
    currentPlayer = 'X';
    createBoard(boardSize);
  });

  // Reset the game
  document.getElementById('tic-reset').addEventListener('click', () => {
    createBoard(boardSize);
  });

  // Close the modal
  document.getElementById('tic-close-btn').addEventListener('click', () => {
    document.getElementById('tic-modal').remove();
  });

  // Initialize default board
  createBoard(boardSize);
}

document.getElementById('tic-start-btn').addEventListener('click', ticInitGame);
