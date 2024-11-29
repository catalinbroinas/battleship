import { Player } from "./player";

function Game() {
    let player1;
    let player2;
    let currentPlayer;
    let gameIsStarted = false;
    let gameIsOver = false;

    const createPlayer = (name, type) => Player(name, type);

    const getPlayerName = () => player1.name;
    const getComputerName = () => player2.name;
    const getCurrentPlayerName = () => currentPlayer.name;

    const getPlayerBoard = () => player1.getBoard();
    const getComputerBoard = () => player2.getBoard();

    const initGame = (playerName, computerName) => {
        player1 = createPlayer(playerName || 'Player', 'human');
        player2 = createPlayer(computerName || 'Computer', 'computer');

        currentPlayer = player1;

        gameIsStarted = player1.placeAllShips() && player2.placeAllShips();
        return gameIsStarted;
    };

    const startGame = () => gameIsStarted ? true : false;

    const playerTurn = (place) => {
        if (!gameIsStarted || gameIsOver) return;

        const opponent = currentPlayer === player1 ? player2 : player1;
        const result = currentPlayer.processAttack(opponent.getBoard(), place);

        if (result === undefined) return;

        const winner = checkWinner();
        if (winner) return `${winner} win!`;

        currentPlayer = opponent;
        return result;
    };

    const checkWinner = () => {
        if (player1.allIsSunk()) {
            gameIsOver = true;
            return getComputerName();
        }

        if (player2.allIsSunk()) {
            gameIsOver = true;
            return getPlayerName();
        }

        return null;
    };

    const endGame = () => gameIsOver ? true : false;

    const resetGame = (playerName = 'Player', computerName = 'Computer') => {
        const result = initGame(playerName, computerName);
        if (result) {
            gameIsOver = false;
            return true;
        }

        return false;
    };

    return {
        createPlayer,
        getPlayerName,
        getComputerName,
        getCurrentPlayerName,
        initGame,
        startGame,
        playerTurn,
        checkWinner,
        endGame,
        resetGame,
        getPlayerBoard,
        getComputerBoard
    };
}

export { Game };
