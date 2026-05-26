const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const state = {
  board: Array(9).fill(null),
  playerSymbol: 'X',
  aiSymbol: 'O',
  difficulty: 'hard',
  gameOver: false,
  thinking: false,
  scores: { player: 0, ai: 0, draw: 0 }
};

function checkWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every(cell => cell !== null)) return { winner: 'draw', line: [] };
  return null;
}

function getEmptyCells(board) {
  return board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
}

function minimax(board, depth, isMaximising, alpha, beta, maxDepth) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === state.aiSymbol)     return 10 - depth;
    if (result.winner === state.playerSymbol) return depth - 10;
    return 0;
  }
  if (depth >= maxDepth) return 0;

  const emptyCells = getEmptyCells(board);

  if (isMaximising) {
    let best = -Infinity;
    for (const idx of emptyCells) {
      board[idx] = state.aiSymbol;
      const score = minimax(board, depth + 1, false, alpha, beta, maxDepth);
      board[idx] = null;
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const idx of emptyCells) {
      board[idx] = state.playerSymbol;
      const score = minimax(board, depth + 1, true, alpha, beta, maxDepth);
      board[idx] = null;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(board, difficulty) {
  const empty = getEmptyCells(board);

  if (difficulty === 'easy') {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  const maxDepth = difficulty === 'medium' ? 3 : 9;

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const idx of empty) {
    board[idx] = state.aiSymbol;
    const score = minimax(board, 0, false, -Infinity, Infinity, maxDepth);
    board[idx] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = idx;
    }
  }
  return bestMove;
}

function renderBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, i) => {
    const val = state.board[i];
    if (val && !cell.classList.contains('taken')) {
      cell.textContent = val;
      cell.classList.add('taken', val === 'X' ? 'x-cell' : 'o-cell', 'pop');
    }
  });
}

function highlightWin(line) {
  line.forEach(i => {
    document.querySelectorAll('.cell')[i].classList.add('win-cell');
  });
}

function setStatus(text, thinking = false) {
  const bar = document.getElementById('statusBar');
  document.getElementById('statusText').innerHTML = text;
  bar.classList.toggle('thinking', thinking);
}

function showOverlay(winner) {
  const overlay = document.getElementById('overlay');
  const icon    = document.getElementById('resultIcon');
  const title   = document.getElementById('resultTitle');
  const sub     = document.getElementById('resultSub');

  if (winner === 'draw') {
    icon.textContent  = '🤝';
    title.textContent = "It's a Draw!";
    sub.textContent   = "Great minds think alike.";
  } else if (winner === state.playerSymbol) {
    icon.textContent  = '🏆';
    title.textContent = "You Won!";
    sub.textContent   = winner === state.playerSymbol && state.difficulty === 'hard'
      ? "Incredible! You beat the unbeatable AI!"
      : "Congratulations! Well played!";
    title.style.color = '#ff6b9d';
  } else {
    icon.textContent  = '🤖';
    title.textContent = "AI Wins!";
    sub.textContent   = state.difficulty === 'hard'
      ? "The Minimax algorithm is undefeated."
      : "Better luck next time!";
    title.style.color = '#00d4ff';
  }

  overlay.classList.add('show');
}

function endGame(result) {
  state.gameOver = true;

  if (result.winner === state.playerSymbol) {
    state.scores.player++;
    document.getElementById('scorePlayerNum').textContent = state.scores.player;
    setStatus('🏆 You win! Congratulations!');
  } else if (result.winner === state.aiSymbol) {
    state.scores.ai++;
    document.getElementById('scoreAINum').textContent = state.scores.ai;
    setStatus('🤖 AI wins! Better luck next time.');
  } else {
    state.scores.draw++;
    document.getElementById('scoreDrawNum').textContent = state.scores.draw;
    setStatus("🤝 It's a draw!");
  }

  if (result.line.length) highlightWin(result.line);

  setTimeout(() => showOverlay(result.winner), 700);
}

function aiTurn() {
  if (state.gameOver) return;

  setStatus('🤖 AI is thinking...', true);

  const delay = state.difficulty === 'easy' ? 300 : 500;

  setTimeout(() => {
    const move = getBestMove([...state.board], state.difficulty);
    state.board[move] = state.aiSymbol;
    renderBoard();
    state.thinking = false;

    const result = checkWinner(state.board);
    if (result) {
      endGame(result);
    } else {
      setStatus('Your turn!');
    }
  }, delay);
}

function handleCellClick(e) {
  const cell = e.currentTarget;
  const idx  = parseInt(cell.dataset.index);

  if (state.board[idx] || state.gameOver || state.thinking) return;

  state.board[idx] = state.playerSymbol;
  renderBoard();

  const result = checkWinner(state.board);
  if (result) {
    endGame(result);
    return;
  }

  state.thinking = true;
  aiTurn();
}

function resetBoard() {
  state.board    = Array(9).fill(null);
  state.gameOver = false;
  state.thinking = false;

  document.getElementById('overlay').classList.remove('show');

  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className   = 'cell';
  });

  const goesFirst = state.playerSymbol === 'X';
  if (goesFirst) {
    setStatus('Your turn!');
  } else {
    state.thinking = true;
    setStatus('🤖 AI goes first...', true);
    setTimeout(aiTurn, 400);
  }
}

function initControls() {
  document.querySelectorAll('#sideToggle .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sideToggle .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.playerSymbol = btn.dataset.value;
      state.aiSymbol     = state.playerSymbol === 'X' ? 'O' : 'X';
      resetBoard();
    });
  });

  document.querySelectorAll('#diffToggle .toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#diffToggle .toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.value;
      resetBoard();
    });
  });

  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });

  document.getElementById('restartBtn').addEventListener('click', resetBoard);
  document.getElementById('overlayBtn').addEventListener('click', resetBoard);

  document.getElementById('resetScoreBtn').addEventListener('click', () => {
    state.scores = { player: 0, ai: 0, draw: 0 };
    document.getElementById('scorePlayerNum').textContent = '0';
    document.getElementById('scoreAINum').textContent     = '0';
    document.getElementById('scoreDrawNum').textContent   = '0';
    resetBoard();
  });
}

initControls();
setStatus('Your turn!');
