// DOM Selectors
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const gameBoard = document.getElementById('gameBoard');
const statusDiv = document.getElementById('status');
const scoreboardDiv = document.getElementById('scoreboard');
const setupModal = document.getElementById('setupModal');
const setupForm = document.getElementById('setupForm');
const step1 = document.getElementById('setupStep1');
const creatorOptions = document.getElementById('setupCreatorOptions');
const humanVsHuman = document.getElementById('setupHumanVsHuman');
const nextStep1Btn = document.getElementById('nextStep1');
const doneCreatorOptsBtn = document.getElementById('doneCreatorOpts');
const doneHumanOptsBtn = document.getElementById('doneHumanOpts');
const withCreatorSelect = document.getElementById('withCreatorSelect');
const humanNameLabel = document.getElementById('humanNameLabel');
const cells = Array.from(document.getElementsByClassName('cell'));

//adding gifs code 

const gifList = [
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWp6OWEzNHZwZ3RkbDcyeXc1bzR0Z3lqZ3N3c2hjemxjZjdvMjkzaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vHslzlGM9vKUgFNx0y/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWtmbnJ2dGV4cW1teWxsb2psajNocnBqZzluYW9vMDRxeXFwaDhodSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fQbJLUt3D8Rpe/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDRrbTJzemo4ZTVmYjBpc283ZjJ2eGMxYjljNDd1ajhmbjBuamtlaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2pXtUuy53ncis/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTR2dzN3cG45NHJuNXBhc3psOGI3N3p2dTdkaTM2dmtiaXY4YnZ0ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QEZVvs2iFzDYA/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDRrbTJzemo4ZTVmYjBpc283ZjJ2eGMxYjljNDd1ajhmbjBuamtlaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2pXtUuy53ncis/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXJ2bHJ2YjdmbDgxcXF1NXExMGU2YWttdXUxaDVhbTVpYnZ4NXF0MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SuXuFTQlxSxpK/giphy.gif"
];
let availableGifs = [];
const gifBox = document.getElementById('gifBox');
const gifImage = document.getElementById('gifImage');


function pickUniqueGif() {
  // Refill available pool if empty
  if (availableGifs.length === 0) availableGifs = [...gifList];
  // Pick random index
  const idx = Math.floor(Math.random() * availableGifs.length);
  const gifUrl = availableGifs[idx];
  availableGifs.splice(idx, 1); // Remove from pool to avoid repeats
  return gifUrl;
}


function showGif() {
  gifBox.classList.remove('hidden');
  gifBox.style.opacity = "1";
}
function hideGif() {
  gifBox.classList.add('hidden');
  gifBox.style.opacity = "0";
  gifImage.src = "";
}



//end




//adding result table code functions..

function showResultTable() {
  // Hide board, win lines, status, other controls/buttons
  document.getElementById('winLineContainer').style.display = 'none';
  document.querySelector('.control-buttons').style.display = 'none';
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('scoreboard').style.display = 'none';
  document.getElementById('status').style.display = 'none';
  // Show result table + post game buttons
  document.getElementById('resultTableContainer').style.display = 'block';
  document.getElementById('postGameButtons').style.display = 'flex';
}

function hideResultTable() {
  document.getElementById('winLineContainer').style.display = 'flex';
  document.getElementById('resultTableContainer').style.display = 'none';
}

function populateResultTable() {
  const tbody = document.querySelector('#resultTable tbody');
  tbody.innerHTML = '';

  let players = [];
  if (state.withCreator) {
    players = [
      { name: state.humanName, symbol: state.humanSymbol, wins: state.scores[state.humanName] || 0 },
      { name: state.aiName, symbol: state.aiSymbol, wins: state.scores[state.aiName] || 0 }
    ];
  } else {
    players = [
      { name: state.p1Name, symbol: state.p1Symbol, wins: state.scores[state.p1Name] || 0 },
      { name: state.p2Name, symbol: state.p2Symbol, wins: state.scores[state.p2Name] || 0 }
    ];
  }

  const totalRounds = state.rounds;
  const totalWins = players[0].wins + players[1].wins;
  const draws = totalRounds - totalWins;

  const maxWins = Math.max(players[0].wins, players[1].wins);

  players.forEach(player => {
    const losses = totalRounds - player.wins - draws;
    let tr = document.createElement('tr');

    if (player.wins === maxWins && maxWins !== 0) tr.classList.add('winner-row');

    tr.innerHTML = `
      <td>${player.name}</td>
      <td>${player.symbol}</td>
      <td>${player.wins}</td>
      <td>${losses}</td>
      <td>${draws}</td>
    `;
    tbody.appendChild(tr);
  });
}






//end


let isAnnouncing = false; // flag to block user input during announcements

withCreatorSelect.addEventListener('change', function() {
  if (this.value === 'yes') {
    humanNameLabel.style.display = 'flex';
    setupForm.humanName.required = true;
  } else {
    humanNameLabel.style.display = 'none';
    setupForm.humanName.required = false;
  }
});

let state = {
  started: false,
  rounds: 1,
  currentRound: 1,
  playerType: 'human',
  humanName: '',
  withCreator: false,
  aiLevel: 1,
  aiSymbol: 'O',
  humanSymbol: 'X',
  aiName: 'Creator',
  aiFirst: false,
  p1Name: '',
  p2Name: '',
  p1Symbol: '',
  p2Symbol: '',
  board: Array(9).fill(''),
  currentPlayer: 'X',
  previousPlayer: null,
  scores: {},
  moves: 0
};

function lockGame() {
  gameBoard.classList.remove('active');
  resetBtn.disabled = true;
}
function unlockGame() {
  if (!isAnnouncing) {
    gameBoard.classList.add('active');
    resetBtn.disabled = false;
  }
}
function clearBoardUI() {
  for (const cell of cells) {
    cell.textContent = '';
    cell.classList.remove('disabled', 'x', 'o');
  }
  statusDiv.textContent = '';
  clearWinLine();
}
function updateScoreboard() {
  let txt = '';
  if (state.withCreator) {
    txt = `${state.humanName} (${state.humanSymbol}): ${state.scores[state.humanName] || 0} &nbsp; | ${state.aiName} (${state.aiSymbol}): ${state.scores[state.aiName] || 0}`;
  } else {
    txt = `${state.p1Name} (X): ${state.scores[state.p1Name] || 0} &nbsp; | ${state.p2Name} (O): ${state.scores[state.p2Name] || 0}`;
  }
  scoreboardDiv.innerHTML = txt;
}

function showModalStep(stepDiv) {
  step1.classList.add('hidden');
  creatorOptions.classList.add('hidden');
  humanVsHuman.classList.add('hidden');
  stepDiv.classList.remove('hidden');
  setupModal.classList.remove('hidden');
}
function hideModal() {
  setupModal.classList.add('hidden');
  step1.classList.add('hidden');
  creatorOptions.classList.add('hidden');
  humanVsHuman.classList.add('hidden');
}
startBtn.addEventListener('click', () => {
  showModalStep(step1);
});
nextStep1Btn.addEventListener('click', () => {
  const numRounds = +setupForm.numRounds.value;
  const withCreator = setupForm.withCreator.value === 'yes';
  if (withCreator) {
    const humanNameVal = setupForm.humanName.value.trim();
    if (!humanNameVal) {
      alert("Please enter your name to play with the creator.");
      return;
    }
    state.humanName = humanNameVal;
  } else {
    state.humanName = '';
  }
  state.rounds = numRounds;
  state.withCreator = withCreator;
  if (withCreator) {
    showModalStep(creatorOptions);
  } else {
    showModalStep(humanVsHuman);
  }
});
doneCreatorOptsBtn.addEventListener('click', () => {
  state.playerType = 'ai';
  state.aiName = 'Creator';
  state.humanSymbol = setupForm.symbolChoice.value;
  state.aiSymbol = state.humanSymbol === 'X' ? 'O' : 'X';
  state.aiLevel = +setupForm.creatorLevel.value;
  state.aiFirst = setupForm.whoFirst.value === 'creator';
  state.scores[state.humanName] = 0;
  state.scores[state.aiName] = 0;
  hideModal();
  startGame();
});
doneHumanOptsBtn.addEventListener('click', () => {
  state.playerType = 'human';
  state.withCreator = false;
  state.p1Name = setupForm.player1.value.trim() || 'Player X';
  state.p2Name = setupForm.player2.value.trim() || 'Player O';
  state.p1Symbol = 'X';
  state.p2Symbol = 'O';
  state.scores[state.p1Name] = 0;
  state.scores[state.p2Name] = 0;
  hideModal();
  startGame();
});

function setCellSymbol(i, symbol) {
  cells[i].textContent = symbol;
  cells[i].classList.remove('x', 'o');
  if (symbol === 'X') cells[i].classList.add('x');
  else if (symbol === 'O') cells[i].classList.add('o');
}
function updateStatusAndScore() {
  if (state.withCreator) {
    const name = state.currentPlayer === state.humanSymbol ? state.humanName : state.aiName;
    statusDiv.textContent = `Round ${state.currentRound} / ${state.rounds}: ${name}'s turn (${state.currentPlayer})`;
  } else {
    const name = state.currentPlayer === 'X' ? state.p1Name : state.p2Name;
    statusDiv.textContent = `Round ${state.currentRound} / ${state.rounds}: ${name}'s turn (${state.currentPlayer})`;
  }
  updateScoreboard();
}

// Core Game Functions

async function startGame() {
  state.started = true;
  state.currentRound = 1;
  state.board = Array(9).fill('');
  state.moves = 0;
  clearBoardUI();
  isAnnouncing = true;
  unlockGame();
  resetBtn.disabled = false;
  startBtn.disabled = true;
  try {
    await announceRoundStart(state.currentRound);
  } finally {
    isAnnouncing = false;
    unlockGame();
  }
  state.currentPlayer = state.withCreator ? (state.aiFirst ? state.aiSymbol : state.humanSymbol) : 'X';
  state.previousPlayer = null;
  updateStatusAndScore();
  if (state.withCreator && state.currentPlayer === state.aiSymbol) {
    setTimeout(aiMove, 400);
  }
}

async function resetGameBoardOnly() {
  state.board = Array(9).fill('');
  state.moves = 0;
  clearBoardUI();
  isAnnouncing = true;
  try {
    await announceRoundStart(state.currentRound);
  } finally {
    isAnnouncing = false;
    unlockGame();
  }
  state.currentPlayer = state.withCreator ? (state.aiFirst ? state.aiSymbol : state.humanSymbol) : 'X';
  state.previousPlayer = null;
  updateStatusAndScore();
  if (state.withCreator && state.currentPlayer === state.aiSymbol) {
    setTimeout(aiMove, 400);
  }
}

async function nextRound() {
  state.currentRound++;
  if (state.currentRound > state.rounds) {
    statusDiv.textContent = "All rounds finished!";
    await announceFinalResult(
      state.scores[state.p1Name],
      state.p1Name,
      state.p1Symbol,
      state.scores[state.p2Name],
      state.p2Name,
      state.p2Symbol
    );
    lockGame();
    startBtn.disabled = false;
    return;
  }
  await resetGameBoardOnly();
}

async function handlePlayerMove(i) {
  if (isAnnouncing || !state.started || state.board[i]) return;
  if (!state.withCreator && state.previousPlayer === state.currentPlayer) return;

  if (state.withCreator) {
    if (state.currentPlayer !== state.humanSymbol) return;
    state.board[i] = state.humanSymbol;
    setCellSymbol(i, state.humanSymbol);
    state.moves++;
    state.previousPlayer = state.currentPlayer;
    if (animatedWinCheck(state.humanSymbol)) return;
    if (state.moves === 9) {
      statusDiv.textContent = "It's a draw!";
      isAnnouncing = true;
      await announceRoundResult("It's a draw", state.currentRound, true);
      lockGame();
      setTimeout(nextRound, 1200);
      isAnnouncing = false;
      return;
    }
    state.currentPlayer = state.aiSymbol;
    updateStatusAndScore();
    setTimeout(aiMove, 680);
  } else {
    const symbol = state.currentPlayer;
    state.board[i] = symbol;
    setCellSymbol(i, symbol);
    state.moves++;
    state.previousPlayer = state.currentPlayer;
    if (animatedWinCheck(symbol)) return;
    if (state.moves === 9) {
      statusDiv.textContent = "It's a draw!";
      isAnnouncing = true;
      await announceRoundResult("It's a draw", state.currentRound, true);
      lockGame();
      setTimeout(nextRound, 900);
      isAnnouncing = false;
      return;
    }
    state.currentPlayer = symbol === 'X' ? 'O' : 'X';
    updateStatusAndScore();
  }
}

cells.forEach((cell, i) => {
  cell.addEventListener('click', async () => {
    if (!gameBoard.classList.contains('active')) return;
    await handlePlayerMove(i);
  });
});
resetBtn.addEventListener('click', async () => {
  if (!state.started) return;
  hideResultTable();
  await resetGameBoardOnly();
});


function aiMove() {
  if (isAnnouncing || !state.started) return;

  let move;
  if (state.aiLevel === 1) move = randomMove();
  else if (state.aiLevel === 2) move = intermediateMove();
  else move = unbeatableMove();

  if (typeof move === "number" && state.board[move] === '') {
    state.board[move] = state.aiSymbol;
    setCellSymbol(move, state.aiSymbol);
    state.moves++;
    state.previousPlayer = state.currentPlayer;

    // CRITICAL: If AI's move created a win, handleResult (which calls drawWinLine and playScratchSound)
    // and return immediately—do NOT change turn, do NOT update UI further!
    if (animatedWinCheck(state.aiSymbol)) return;

    if (state.moves === 9) {
      statusDiv.textContent = "It's a draw!";
      isAnnouncing = true;
      announceRoundResult("It's a draw", state.currentRound, true).then(() => {
        lockGame();
        setTimeout(nextRound, 1000);
        isAnnouncing = false;
      });
      return;
    }
    state.currentPlayer = state.humanSymbol;
    updateStatusAndScore();
  }
}





function animatedWinCheck(sym) {
  const b = state.board;
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    if (pattern.every(idx => b[idx] === sym)) {
      drawWinLine(pattern);
      setTimeout(() => showResult(sym, pattern), 650);
      return true;
    }
  }
  return false;
}

async function showResult(sym, pattern) {
  isAnnouncing = true;
  if (state.withCreator) {
    const winnerName = sym === state.humanSymbol ? state.humanName : state.aiName;
    state.scores[winnerName]++;
    updateScoreboard();
    statusDiv.textContent = `${winnerName} wins Round ${state.currentRound}!`;
    await announceRoundResult(winnerName, state.currentRound, false);
  } else {
    const winnerName = sym === 'X' ? state.p1Name : state.p2Name;
    state.scores[winnerName]++;
    updateScoreboard();
    statusDiv.textContent = `${winnerName} wins Round ${state.currentRound}!`;
    await announceRoundResult(winnerName, state.currentRound, false);
  }
  lockGame();
  setTimeout(() => {
    clearWinLine();
    nextRound();
  }, 1500);
  isAnnouncing = false;
}

//*** CRITICAL: SCRATCH SOUND PLAYS RIGHT AS WIN LINE ANIMATION BEGINS ***//
function drawWinLine(pattern) {
  const lines = {
    "0,1,2": [[20, 60], [300, 60]],
    "3,4,5": [[20, 160], [300, 160]],
    "6,7,8": [[20, 260], [300, 260]],
    "0,3,6": [[70, 10], [70, 310]],
    "1,4,7": [[160, 10], [160, 310]],
    "2,5,8": [[250, 10], [250, 310]],
    "0,4,8": [[20, 20], [300, 300]],
    "2,4,6": [[300, 20], [20, 300]]
  };
  const key = pattern.join(',');
  const svg = document.getElementById('winLine');
  svg.innerHTML = '';
  if (lines[key]) {
    const [start, end] = lines[key];
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', start[0]);
    line.setAttribute('y1', start[1]);
    line.setAttribute('x2', start[0]);
    line.setAttribute('y2', start[1]);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '8');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
    // Play sound immediately as animation starts for best sync
    playScratchSound();
    setTimeout(() => {
      line.setAttribute('x2', end[0]);
      line.setAttribute('y2', end[1]);
    }, 80);
  }
}
function clearWinLine() {
  document.getElementById('winLine').innerHTML = '';
}
function playScratchSound() {
  const audio = document.getElementById("scratchSound");
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
    let playPromise = audio.play();
    if (playPromise) playPromise.catch(()=>{});
  } catch (e) {}
}

function randomMove() {
  const available = state.board.map((v, i) => v === '' ? i : null).filter(i => i !== null);
  return available[Math.floor(Math.random() * available.length)];
}
function intermediateMove() {
  for (let i = 0; i < 9; i++) {
    if (!state.board[i]) {
      state.board[i] = state.aiSymbol;
      if (wouldWin(state.aiSymbol)) {
        state.board[i] = '';
        return i;
      }
      state.board[i] = '';
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!state.board[i]) {
      state.board[i] = state.humanSymbol;
      if (wouldWin(state.humanSymbol)) {
        state.board[i] = '';
        return i;
      }
      state.board[i] = '';
    }
  }
  return randomMove();
}
function unbeatableMove() {
  const mySym = state.aiSymbol,
    oppSym = state.humanSymbol;
  const moveNumber = state.board.filter(x => x).length;
  if (moveNumber === 0)
    return [0, 2, 6, 8][Math.floor(Math.random() * 4)];
  if (moveNumber === 1 && mySym === 'O') {
    const corners = [0, 2, 6, 8];
    if (corners.some(idx => state.board[idx] === 'X')) return 4;
    if (state.board[4] === 'X') return corners.find(idx => !state.board[idx]);
    return 4;
  }
  for (let i = 0; i < 9; i++) {
    if (!state.board[i]) {
      state.board[i] = mySym;
      if (wouldWin(mySym)) {
        state.board[i] = '';
        return i;
      }
      state.board[i] = '';
    }
  }
  for (let i = 0; i < 9; i++) {
    if (!state.board[i]) {
      state.board[i] = oppSym;
      if (wouldWin(oppSym)) {
        state.board[i] = '';
        return i;
      }
      state.board[i] = '';
    }
  }
  let forkMove = findFork(mySym);
  if (forkMove != null) return forkMove;
  let blockFork = findFork(oppSym);
  if (blockFork != null) return blockFork;
  if (!state.board[4]) return 4;
  const corners = [0, 2, 6, 8];
  for (const idx of corners) if (!state.board[idx]) return idx;
  const edges = [1, 3, 5, 7];
  for (const idx of edges) if (!state.board[idx]) return idx;
  return randomMove();
}
function findFork(sym) {
  for (let i = 0; i < 9; i++) {
    if (!state.board[i]) {
      state.board[i] = sym;
      let winCount = 0;
      for (let j = 0; j < 9; j++) {
        if (!state.board[j] && i !== j) {
          state.board[j] = sym;
          if (wouldWin(sym)) winCount++;
          state.board[j] = '';
        }
      }
      state.board[i] = '';
      if (winCount >= 2) return i;
    }
  }
  return null;
}
function wouldWin(sym) {
  const b = state.board;
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  return winPatterns.some((pattern) => pattern.every((idx) => b[idx] === sym));
}

function loadVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve(voices);
      };
    }
  });
}
async function speak(text, totalDurationSec) {
  const utter = new SpeechSynthesisUtterance(text);
  const voices = await loadVoices();
  let indianMaleVoice = voices.find(
    (v) => v.lang.startsWith('en-IN') && v.name.toLowerCase().includes('male')
  );
  if (!indianMaleVoice && voices.length > 0) {
    indianMaleVoice = voices[0];
  }
  if (indianMaleVoice) utter.voice = indianMaleVoice;
  utter.rate = Math.min(2, Math.max(0.5, text.length / 15 / totalDurationSec));
  utter.pitch = 0.6;
  utter.volume = 1;
  return new Promise((resolve) => {
    utter.onend = () => resolve();
    speechSynthesis.speak(utter);
  });
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function announceRoundStart(roundNum) {
  isAnnouncing = true;
  try {
    const gifUrl = pickUniqueGif();
    gifImage.src = gifUrl;
    showGif();

    const roundWords = ['One', 'Two', 'Three', 'Four', 'Five'];
    const roundText = 'Round ' + (roundWords[roundNum - 1] || roundNum);

    await speak(roundText, 1.5);
    await sleep(1000);
    await speak('Fight', 1);

    await sleep(550);
    hideGif();
  } finally {
    isAnnouncing = false;
    unlockGame();
  }
}



async function announceRoundResult(winnerName, roundNum, isDraw) {
  isAnnouncing = true;
  try {
    if (isDraw) {
      await speak("It's a draw Hahahaha", 2);
    } else {
      const roundWords = ['first', 'second', 'third', 'fourth', 'fifth'];
      const roundWord = roundWords[roundNum - 1] || roundNum + 'th';
      await speak(`${winnerName} wins ${roundWord} round`, 2.5);
    }
  } finally {
    isAnnouncing = false;
    unlockGame();
  }
}

async function announceFinalResult(p1Score, p1Name, p1Sym, p2Score, p2Name, p2Sym) {
  isAnnouncing = true;
  try {
     populateResultTable();
     showResultTable();
    await speak("Game Over", 1.3);
    await sleep(200);

    // Draw logic (works both modes)
    let isDraw;
    let winnerName, loserName, winnerSym, winnerScore, loserScore;
    if (state.withCreator) {
      const humanScore = state.scores[state.humanName] || 0;
      const creatorScore = state.scores[state.aiName] || 0;
      isDraw = (humanScore === creatorScore);

      if (!isDraw) {
        if (humanScore > creatorScore) {
          winnerName = state.humanName;
          winnerSym = state.humanSymbol;
          winnerScore = humanScore;
          loserName = state.aiName;
          loserScore = creatorScore;
        } else {
          winnerName = state.aiName;
          winnerSym = state.aiSymbol;
          winnerScore = creatorScore;
          loserName = state.humanName;
          loserScore = humanScore;
        }
      }
    } else {
      isDraw = (p1Score === p2Score);
      if (!isDraw) {
        if (p1Score > p2Score) {
          winnerName = p1Name; winnerSym = p1Sym; winnerScore = p1Score;
          loserName = p2Name; loserScore = p2Score;
        } else {
          winnerName = p2Name; winnerSym = p2Sym; winnerScore = p2Score;
          loserName = p1Name; loserScore = p1Score;
        }
      }
    }

    if (isDraw) {
      await speak("It's a draw", 2);
      await sleep(200);
      await speak("Better luck next time.", 2);
    } else {
      // 1st: "Winner beats loser"
      await speak(`${winnerName} beats ${loserName}`, 3);
      await sleep(200);

      // 2nd: "with noughts" or "with cross"
      const symWord = winnerSym === "X" ? "with cross" : "with nought";
      await speak(`${symWord} with a score of`, 2);
      await sleep(200);

      // 3rd: "N-N"
      await speak(`${winnerScore} - ${loserScore}`, 1.5);
    }

  } finally {
    isAnnouncing = false;
    unlockGame();
  

  }
   
}




// end
// PAGE INIT
lockGame();
startBtn.disabled = false;
resetBtn.disabled = true;



document.getElementById('restartBtn').addEventListener('click', () => {
  // Hide table and show everything else (start state)
  document.getElementById('resultTableContainer').style.display = 'none';
  document.getElementById('winLineContainer').style.display = 'flex';
  document.querySelector('.control-buttons').style.display = 'flex';
  document.getElementById('startBtn').style.display = 'block';
  document.getElementById('scoreboard').style.display = 'block';
  document.getElementById('status').style.display = 'block';
  // Reset state, scores, etc.
  state.started = false;
  state.scores = {};
  state.rounds = 1;
  state.currentRound = 1;
  clearBoardUI();
  updateScoreboard();
  showModalStep(step1);
});