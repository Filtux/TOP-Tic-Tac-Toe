const GameBoard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    const setCell = (index, marker) => {
        if (index >= 0 && index < board.length && board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, setCell };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const DisplayController = (() => {
    const gameBoardElement = document.querySelector('.game-board');
    const resultElement = document.querySelector('.game-result');
    const resetButton = document.querySelector('.button-reset');
    const player1Input = document.querySelector('.player1-name');
    const player2Input = document.querySelector('.player2-name');

    if (!gameBoardElement || !resultElement || !resetButton || !player1Input || !player2Input) {
        console.error("One or more elements could not be found");
        return null;
    }

    resetButton.addEventListener('click', () => {
        GameController.restartGame();
    });

    player1Input.addEventListener('blur', (e) => {
        GameController.updatePlayerName(GameController.player1, e.target.value);
    });

    player2Input.addEventListener('blur', (e) => {
        GameController.updatePlayerName(GameController.player2, e.target.value);
    });

    const renderGameBoard = () => {
        const board = GameBoard.getBoard();
        gameBoardElement.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => {
                GameController.playTurn(index);
            });
            gameBoardElement.appendChild(cellElement);
        });
    };

    const showResult = (message) => {
        resultElement.textContent = message;
    };

    const clearResult = () => {
        resultElement.textContent = '';
    };

    return { renderGameBoard, showResult, clearResult };
})();

const GameController = (() => {
    const player1 = Player('Player 1', 'X');
    const player2 = Player('Player 2', 'O');
    let currentPlayer = player1;
    let gameOver = false;

    const startGame = () => {
        currentPlayer = player1;
        gameOver = false;
        GameBoard.resetBoard();
        DisplayController.renderGameBoard();
        DisplayController.clearResult();
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = GameBoard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows starting at 0
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        return winConditions.some(condition =>
            condition.every(index => board[index] === currentPlayer.marker)
        );
    };

    const checkTie = () => {
        return GameBoard.getBoard().every(cell => cell !== '');
    };

    const playTurn = (index) => {
        if (gameOver || !GameBoard.setCell(index, currentPlayer.marker)) {
            return;
        }

        if (checkWin()) {
            DisplayController.showResult(`${currentPlayer.name} wins!`);
            gameOver = true;
        } else if (checkTie()) {
            DisplayController.showResult("It's a tie!");
            gameOver = true;
        } else {
            switchPlayer();
        }
        DisplayController.renderGameBoard();
    };

    const restartGame = () => {
        GameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        DisplayController.renderGameBoard();
    };

    const updatePlayerName = (player, name) => {
        player.name = name;
    };

    return { playTurn, startGame, restartGame, updatePlayerName, player1, player2 };
})();

if (DisplayController !== null) {
    DisplayController.renderGameBoard();
    GameController.startGame();
}
