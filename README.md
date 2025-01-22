# Chess Puzzle Frontend

This is a TypeScript React frontend application that presents chess puzzles to users. It uses the @react-chess/chessground library for an interactive chessboard and chess.js for chess logic. The application fetches puzzle data from a backend API and dynamically generates puzzles. Once a puzzle is completed, the next puzzle is automatically loaded.

## Features
Interactive Chessboard: Powered by @react-chess/chessground, users can play out moves visually.
Puzzle Generation: Fetches puzzle data from the backend, including FEN and target moves.
Dynamic Progression: Automatically loads the next puzzle upon completion.
Chess Logic: Validates moves using chess.js.
Responsive Design: Optimized for various screen sizes.

## Tech Stack
Frontend: React with TypeScript


## Libraries:
@react-chess/chessground: Interactive chessboard
chess.js: Chess logic and move validation
axios: For API calls
Backend Integration: Communicates with the FastAPI backend to fetch puzzle data.

### Usage
View a Puzzle:
The app fetches a puzzle from the backend and displays it on the chessboard. The starting position is shown using FEN notation.

### Make Moves:
Play your moves directly on the board. The app will validate moves and check if you’ve completed the puzzle.

### Complete Puzzle:
After solving the puzzle, the app will automatically fetch and display the next puzzle.