# 🎮 Tic-Tac-Toe AI

An unbeatable Tic-Tac-Toe game powered by the **Minimax algorithm with Alpha-Beta Pruning**. Built with vanilla HTML, CSS, and JavaScript — no external libraries or frameworks required.

---

## 📸 Preview

A clean dark-themed game interface featuring:
- 3×3 interactive game board
- Live scoreboard
- Difficulty selector
- Animated win highlights and move effects

---

## 🚀 Features

- **Unbeatable AI** — Minimax with Alpha-Beta Pruning at full depth (depth 9)
- **3 Difficulty Levels** — Easy (random), Medium (depth-3 Minimax), Unbeatable (full Minimax)
- **Play as X or O** — Choose your symbol before each game
- **Score Tracker** — Wins, draws, and losses tracked across games
- **Animated UI** — Pop-in moves, glowing win highlights, result overlay
- **Algorithm Explainer** — Built-in section describing how the AI works

---

## 🧠 How the AI Works

### Minimax Algorithm

The AI explores every possible future game state as a **game tree**:

- At each level, the AI assumes the **maximising player** (AI) picks the move with the best score, and the **minimising player** (human) picks the worst score for the AI.
- Terminal states are scored: **+10** for AI win, **-10** for human win, **0** for draw.
- Depth is factored in so the AI prefers faster wins and slower losses.

```
Score = +10 - depth  (AI wins faster = better)
Score = depth - 10   (human wins faster = worse for AI)
```

### Alpha-Beta Pruning

Alpha-Beta Pruning **cuts off branches** that cannot possibly affect the final decision:

- **Alpha** — best score the maximiser (AI) can guarantee so far
- **Beta** — best score the minimiser (human) can guarantee so far
- If `beta <= alpha`, the branch is pruned — no need to explore it

This makes the search significantly faster without changing the result.

### Difficulty Levels

| Difficulty  | Strategy                              |
|-------------|---------------------------------------|
| Easy        | Random move from available cells      |
| Medium      | Minimax limited to depth 3            |
| Unbeatable  | Full Minimax + Alpha-Beta (depth 9)   |

---

## 📂 Project Structure

```
tictactoe-ai/
├── index.html    # Game layout and structure
├── style.css     # Dark theme, board, animations
├── game.js       # Minimax AI, game logic, DOM interactions
└── server.js     # Simple Node.js static file server
```

---

## 🛠️ Getting Started

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tictactoe-ai.git
   cd tictactoe-ai
   ```

2. **Start the server** (requires Node.js)
   ```bash
   node server.js
   ```

3. **Open your browser** and go to:
   ```
   http://localhost:5000
   ```

### Or open directly

You can also open `index.html` directly in your browser — no server needed.

---

## 🔍 Core Algorithm Code

```javascript
function minimax(board, depth, isMaximising, alpha, beta, maxDepth) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === aiSymbol)     return 10 - depth;
    if (result.winner === playerSymbol) return depth - 10;
    return 0;
  }
  if (depth >= maxDepth) return 0;

  const emptyCells = getEmptyCells(board);

  if (isMaximising) {
    let best = -Infinity;
    for (const idx of emptyCells) {
      board[idx] = aiSymbol;
      const score = minimax(board, depth + 1, false, alpha, beta, maxDepth);
      board[idx] = null;
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // Alpha-Beta Pruning
    }
    return best;
  } else {
    let best = Infinity;
    for (const idx of emptyCells) {
      board[idx] = playerSymbol;
      const score = minimax(board, depth + 1, true, alpha, beta, maxDepth);
      board[idx] = null;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // Alpha-Beta Pruning
    }
    return best;
  }
}
```

---

## 📚 Learning Outcomes

This project demonstrates:

- **Game Theory** — understanding zero-sum games and optimal strategies
- **Minimax Algorithm** — recursive game tree search
- **Alpha-Beta Pruning** — search optimization technique
- **DOM Manipulation** — interactive game UI with vanilla JavaScript
- **CSS Animations** — smooth transitions and win effects

---

## 🏗️ Built With

- **HTML5** — Semantic game structure
- **CSS3** — Dark theme, grid layout, keyframe animations
- **Vanilla JavaScript** — Zero dependencies
- **Node.js** — Lightweight static file server

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> Built as a hands-on introduction to game theory and AI search algorithms.
