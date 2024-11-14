import { Player } from "./player";

function Game() {
    let player1;
    let player2;
    let currentPlayer;

    const createPlayer = (name, type) => Player(name, type);

    const getPlayerName = () => player1.name;
    const getComputerName = () => player2.name;
    const getCurrentPlayerName = () => currentPlayer.name;

    const initGame = (playerName, computerName) => {
        player1 = createPlayer(playerName || 'Player', 'human');
        player2 = createPlayer(computerName || 'Computer', 'computer');

        currentPlayer = player1;

        return player1.placeAllShips() && player2.placeAllShips();
    };

    const playerTurn = (place) => {

    };

    const checkWinner = () => {

    };

    return {
        createPlayer,
        getPlayerName,
        getComputerName,
        getCurrentPlayerName,
        initGame,
        playerTurn,
        checkWinner
    };
}

export { Game };
