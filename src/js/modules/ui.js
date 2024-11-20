import { Game } from './game';

function UI() {
    // Instance of game module
    const game = Game();

    // Select elements
    const form = document.querySelector('#game-form');
    const playerNameInput = document.querySelector('#player-name');
    const computerNameInput = document.querySelector('#computer-name');
    const startGameButton = document.querySelector('#submit-btn');

    const getPlayerNames = () => {
        if (!playerNameInput) {
            throw new Error('Player name field not found');
        }
        if (!computerNameInput) {
            throw new Error('Computer name field not found');
        }

        return {
            playerName: playerNameInput.value.trim() || 'Player',
            computerName: computerNameInput.value.trim() || 'Computer'
        };
    };

    const resetForm = () => {
        playerNameInput.value = '';
        computerNameInput.value = '';
    };

    const initGame = () => {
        const { playerName, computerName } = getPlayerNames();
        const result = game.initGame(playerName, computerName);

        if (!result) {
            throw new Error('Failed to initialize the game. Please check player names or game setup.');
        }
    };

    const renderGameBoard = () => {

    };

    const handleCellClick = (event) => {

    };

    const updateCell = (cell, result) => {

    };

    const displayMessage = (message) => {

    };

    const startGame = () => {
        if (!form) {
            throw new Error('Form element not found!');
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            initGame();
            resetForm();
        });
    };

    const endGame = () => {

    };

    const resetGame = () => {

    };

    return {
        startGame,
        endGame,
        resetGame
    };
}

export { UI };
