import { Game } from './game';
import { DomUtilityManager, StringUtilityManager } from './utility';

function UI() {
    // Instance of game module and DOM manager
    const game = Game();
    const domManager = DomUtilityManager();
    const stringManager = StringUtilityManager();

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

    const renderSetup = () => {
        if (!pageContainer) {
            throw new Error('Page container element not found.');
        }

        const setupContainer = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['setup-wrapper']
        });
        const rowElement = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['row-button']
        });

        const playerBoard = renderGameBoard(game.getPlayerBoard(), 'player');
        if (!playerBoard) {
            throw new Error('Failed to render the player`s gameboard.');
        }

        const resetBoard = domManager.createButton({
            name: 'Reset Board',
            buttonClass: ['btn', 'btn-reset'],
            iconClass: ['fa-solid', 'fa-rotate-right', 'me-2'],
            clickHandler: (event) => {
                try {
                    domManager.rippleEffect(event.target);
                    setTimeout(() => {
                        if (resetSetup()) renderSetup();
                    }, 500);
                } catch (error) {
                    throw new Error(`Failed to reset setup: ${error.message}`);
                }
            }
        });
        rowElement.appendChild(resetBoard);

        const confirmButton = domManager.createButton({
            name: 'Confirm',
            buttonClass: ['btn', 'btn-submit'],
            iconClass: ['fa-solid', 'fa-play', 'me-2'],
            clickHandler: (event) => {
                try {
                    domManager.rippleEffect(event.target);
                    setTimeout(renderGame, 500);
                } catch (error) {
                    throw new Error(`Failed to loading game: ${error.message}`);
                }
            }
        });
        rowElement.appendChild(confirmButton);

        setupContainer.appendChild(playerBoard);
        setupContainer.appendChild(rowElement);

        domManager.clearPageContent(pageContainer);
        pageContainer.appendChild(setupContainer);
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
            elementClass: ['gameboard', `gameboard-${type}`],
            elementAttributes: { id: `gameboard-${type}` }
        });

        const name = type === 'player'
            ? getPlayerNames().playerName : getPlayerNames().computerName;

        const title = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['sub-title', `${type}`],
            elementText: `${name} waters`
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

        const handleEndGame = (result) => {
            if (typeof result === 'string' && endGame(result)) {
                return false;
            }

            return true;
        };

        const playerAttack = () => {
            const result = game.playerTurn(place);

            if (result === true || result === false) {
                cell.classList.add('attacked');
                cell.removeEventListener('click', clickHandler);
                return true;
            }

            cell.classList.add('attacked');
            cell.removeEventListener('click', clickHandler);
            return handleEndGame(result);
        };

        const computerAttack = () => {
            const result = game.playerTurn();

            if (result === true || result === false) {
                const playerBoard = game.getPlayerBoard();
                updateCell(playerBoard, 'player');
                return true;
            }

            const playerBoard = game.getPlayerBoard();
            updateCell(playerBoard, 'player');
            return handleEndGame(result);
        };

        try {
            if (playerAttack()) computerAttack();
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

        startGameButton.addEventListener('click', (event) => {
            domManager.rippleEffect(event.target);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            setTimeout(() => {
                if (initGame()) renderSetup();
            }, 500);
        });
    };

    const endGame = (message = 'Game Over!') => {
        if (!game.endGame()) return false;

        const container = domManager.createDOMElement({
            elementTag: 'div',
            elementClass: ['endGame-wrapper']
        });

        const messageElement = domManager.createDOMElement({
            elementTag: 'p',
            elementClass: ['sub-title']
        });
        const messageIcon = domManager.createDOMElement({
            elementTag: 'i',
            elementClass: ['fa-solid', 'fa-trophy', 'me-2'],
            elementAttributes: { 'aria-hidden': 'true' }
        });
        const messageText = domManager.createDOMElement({
            elementTag: 'span',
            elementText: stringManager.capitalizeFirstLetter(message)
        });
        messageElement.appendChild(messageIcon);
        messageElement.appendChild(messageText);
        container.appendChild(messageElement);

        const playAgainButton = domManager.createButton({
            name: 'Play Again',
            buttonClass: ['btn', 'btn-playAgain'],
            iconClass: ['fa-solid', 'fa-play', 'me-2'],
            elementAttributes: { 'aria-hidden': 'true' },
            clickHandler: (event) => {
                domManager.rippleEffect(event.target);
                setTimeout(() => {
                    resetGame();
                }, 500);
            }
        });
        container.appendChild(playAgainButton);

        const resetGameButton = domManager.createButton({
            name: 'Reset Game',
            buttonClass: ['btn', 'btn-reset'],
            iconClass: ['fa-solid', 'fa-rotate-right', 'me-2'],
            elementAttributes: { 'aria-hidden': 'true' },
            clickHandler: (event) => {
                domManager.rippleEffect(event.target);
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        });
        container.appendChild(resetGameButton);

        domManager.clearPageContent(pageContainer);
        pageContainer.appendChild(container);

        return true;
    };

    const resetSetup = () => {
        // Get player names
        const { playerName, computerName } = getPlayerNames();
        if (!playerName || !computerName) {
            throw new Error('Failed to retrieve player names for game reset.');
        }

        // Reset the game
        const isGameReset = game.resetGame(playerName, computerName);
        if (!isGameReset) {
            throw new Error('Game reset failed. Could not initialize a new game instance.');
        }

        return true;
    };

    // Restart the game with initial set up
    const resetGame = () => {
        if (!game.endGame()) {
            throw new Error('Cannot restart the game. The game is still ongoing.');
        }

        resetSetup();

        try {
            renderGame();
        } catch (error) {
            throw error;
        }
    };

    return {
        startGame,
        endGame,
        resetGame
    };
}

export { UI };
