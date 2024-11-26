import { Game } from './game';
import { DomUtilityManager } from './utility';

function UI() {
    // Instance of game module and DOM manager
    const game = Game();
    const domManager = DomUtilityManager();

    // Select elements
    const pageContainer = document.querySelector('#page-container');
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

    const initGame = () => {
        const { playerName, computerName } = getPlayerNames();
        const result = game.initGame(playerName, computerName);

        if (!result) {
            throw new Error('Failed to initialize the game. Please check player names or game setup.');
        }

        return true;
    };

    const renderGame = () => {
        if (!pageContainer) {
            throw new Error('Page container element not found.');
        }

        const gameboardContainer = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['gameboard-wrapper'],
            elementAttributes: { 'id': 'gameboard-wrapper' }
        });

        const playerBoard = renderGameBoard(game.getPlayerBoard(), 'player');
        if (playerBoard) {
            gameboardContainer.appendChild(playerBoard);
        } else {
            throw new Error('Failed to render the player`s gameboard.');
        }

        const computerBoard = renderGameBoard(game.getComputerBoard(), 'computer');
        if (computerBoard) {
            gameboardContainer.appendChild(computerBoard);
        } else {
            throw new Error('Failed to render the computer`s gameboard.');
        }

        domManager.clearPageContent(pageContainer);
        pageContainer.appendChild(gameboardContainer);
    };

    const renderGameBoard = (board, type) => {
        if (!Array.isArray(board) || !board.every(Array.isArray)) {
            throw new Error('Invalid board structure');
        }

        const container = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['gameboard'],
            elementAttributes: { id: `gameboard-${type}` }
        });

        const name = type === 'player'
            ? getPlayerNames().playerName : getPlayerNames().computerName;

        const title = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['sub-title'],
            elementText: `${name}`
        });

        container.appendChild(title);

        board.forEach((rowData, rowIndex) => {
            const line = domManager.createDOMElement({
                elementTag: 'div',
                elementClass: ['row']
            });

            rowData.forEach((colData, colIndex) => {
                const cell = domManager.createDOMElement({
                    elementTag: 'div',
                    elementClass: ['cell'],
                    elementAttributes: {
                        'data-row': rowIndex,
                        'data-col': colIndex
                    }
                });

                if (typeof colData === 'object' && colData !== null) {
                    cell.classList.add('ship');
                }

                if (type === 'computer') {
                    const clickHandler = (event) => handleCellClick({ row: rowIndex, col: colIndex }, cell, clickHandler);
                    cell.addEventListener('click', clickHandler);
                }

                line.appendChild(cell);
            });

            container.appendChild(line);
        });

        return container;
    };

    const handleCellClick = (place, cell, clickHandler) => {
        if (typeof place !== 'object' || place === null) {
            throw new Error('Invalid place.');
        }

        const playerAttack = () => {
            const result = game.playerTurn(place);

            if (result === true || result === false) {
                cell.classList.add('attacked');
                cell.removeEventListener('click', clickHandler);
                return true;
            } else if (typeof result === 'string') {
                cell.classList.add('attacked');
                cell.removeEventListener('click', clickHandler);
                console.log(result);  // Fo test it
                return false;
            } else {
                throw new Error(`Unexpected result from playerTurn: ${playerAttack}`);
            }
        };

        const computerAttack = () => {
            const result = game.playerTurn();

            if (result === true || result === false) {
                const playerBoard = game.getPlayerBoard();
                updateCell(playerBoard, 'player');
                return true;
            } else if (typeof result === 'string') {
                const playerBoard = game.getPlayerBoard();
                updateCell(playerBoard, 'player');
                console.log(result);    // Fo test it
                return false;
            } else {
                throw new Error(`Unexpected result from playerTurn (computer): ${computerAttack}`);
            }
        };

        try {
            if (playerAttack()) {
                computerAttack();
            }
        } catch (error) {
            throw error;
        }
    };

    const updateCell = (board, type) => {
        if (!Array.isArray(board) || !board.every(Array.isArray)) {
            throw new Error('Invalid board structure.');
        }

        const gameboardElement = document.querySelector(`#gameboard-${type}`);
        if (!gameboardElement) {
            throw new Error(`Gameboard element for type "${type}" not found.`);
        }

        // Traverse each cell in the board and compare to the DOM
        board.forEach((rowData, rowIndex) => {
            rowData.forEach((cellData, colIndex) => {
                const cellElement = gameboardElement.querySelector(
                    `.cell[data-row="${rowIndex}"][data-col="${colIndex}"]`
                );

                if (!cellElement) {
                    throw new Error(`Cell element at [${rowIndex}, ${colIndex}] not found.`);
                }

                // Update the attacked cells
                if (cellData === 0 || cellData === 1) {
                    cellElement.classList.add('attacked');
                }
            });
        });
    };

    const displayMessage = (message) => {

    };

    const startGame = () => {
        if (!form) {
            throw new Error('Form element not found!');
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (initGame()) renderGame();
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
