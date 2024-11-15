import { Player } from "./player";

function Game() {
    let player1;
    let player2;
    let currentPlayer;
    let gameIsStarted = false;

    const createPlayer = (name, type) => Player(name, type);

    const getPlayerName = () => player1.name;
    const getComputerName = () => player2.name;
    const getCurrentPlayerName = () => currentPlayer.name;

    // Getters  for tests
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
        // Check if the game has started
        if (!gameIsStarted) return;

        const opponent = currentPlayer === player1 ? player2 : player1;
        const result = currentPlayer.attack(opponent.getBoard(), place);

        if (result === undefined) return;

        const winner = checkWinner();
        if (winner) return `${winner} win!`;

        currentPlayer = opponent;
        return result;
    };

    const checkWinner = () => {
        if (player1.allIsSunk()) return getComputerName();
        if (player2.allIsSunk()) return getPlayerName();
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
        getPlayerBoard,
        getComputerBoard
    };
}

export { Game };
