import { Player } from "./player";

function Game() {
    let player1;
    let player2;
    let currentPlayer;

    const createPlayer = (name, type) => Player(name, type);

    const initGame = (playerName, computerName) => {
        player1 = createPlayer(playerName || 'Player', 'human');
        player2 = createPlayer(computerName || 'Computer', 'computer');

        currentPlayer = player1;

        return player1.placeAllShips() && player2.placeAllShips();
    };

    const startGame = () => {

    };

    const playerTurn = (place) => {

    };

    const checkWinner = () => {

    };

    return {
        createPlayer,
        initGame,
        startGame,
        playerTurn,
        checkWinner
    };
}

export { Game };
