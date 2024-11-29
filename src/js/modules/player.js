import { Ship } from "./ship";
import { Gameboard } from "./gameboard";

function Player(name, type) {
    const gameboard = Gameboard();

    // Gameboard of the player
    const board = gameboard.getBoard();

    // Save available place and adjacent place for enhance computer attack
    const unattackedPlace = [];
    const priorityPlace = [];
    let previousSuccessAttack = null;

    const getBoard = () => board;

    // List of ships
    const ships = [
        Ship(5, 'carrier'),
        Ship(4, 'battleship'),
        Ship(3, 'cruiser'),
        Ship(3, 'submarine'),
        Ship(2, 'destroyer')
    ];

    const ERROR_MESSAGES = {
        invalidShip: 'Invalid ship',
        boardIsFull: 'The board is full'
    };

    const getShips = () => ships;

    // Place all ships on the gameboard at random locations
    const placeAllShips = () => {
        const clear = board.every(row => row.every(cell => cell === null));
        if (!clear) return false;

        const isAdjacentCellFree = (target) => {
            const directions = [
                { row: target.row, col: target.col + 1 },
                { row: target.row, col: target.col - 1 },
                { row: target.row + 1, col: target.col },
                { row: target.row - 1, col: target.col },
                { row: target.row + 1, col: target.col + 1 },
                { row: target.row + 1, col: target.col - 1 },
                { row: target.row - 1, col: target.col + 1 },
                { row: target.row - 1, col: target.col - 1 }
            ];

            // Check every direction
            const result = directions.every(item => {
                const { row, col } = item;
                return row >= 0 && row < 10 && col >= 0 && col < 10 && board[row][col] === null;
            });

            return result;
        };

        const randomPlace = () => {
            const randomRow = Math.floor(Math.random() * 10);
            const randomCol = Math.floor(Math.random() * 10);

            const place = { row: randomRow, col: randomCol };
            return place;
        };

        ships.forEach((ship) => {
            let placed = false;

            // Keep trying until the ship is placed correctly
            while (placed !== true) {
                let place = randomPlace();

                while (isAdjacentCellFree(place) !== true) {
                    place = randomPlace();
                }

                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

                // Attempt to place the ship at the generated position
                placed = gameboard.placeShip(ship, place, orientation);
            }
        });

        return true;
    };

    // Place ship on the gameboard at a specified location
    const placeShip = (ship, place) => {
        const validShip = ships.find(item => item.name === ship.name);
        if (!validShip) return ERROR_MESSAGES.invalidShip;

        if (allIsPlace()) return ERROR_MESSAGES.boardIsFull;

        return gameboard.placeShip(ship, place);
    };

    // Processes an attack on the specified location and updates the opponent's board
    const attack = (opponentBoard, place) => {
        let attackPlace = place;

        // Initialize the list of unattacked places with all valid board positions
        const initValidPlace = () => {
            opponentBoard.forEach((rowData, rowIndex) => {
                rowData.forEach((colData, colIndex) => {
                    unattackedPlace.push({ row: rowIndex, col: colIndex });
                });
            });
        };

        // Add adjacent valid positions of a successful attack to the priority list
        const insertPriorityPlace = (target) => {
            const directions = [
                { row: target.row, col: target.col + 1 },
                { row: target.row, col: target.col - 1 },
                { row: target.row + 1, col: target.col },
                { row: target.row - 1, col: target.col }
            ].filter(item => item.row >= 0 && item.row < 10 && item.col >= 0 && item.col < 10);;

            directions.forEach(item => {
                // Check if the adjacent position is still unattacked
                const validPlaceIndex = unattackedPlace.findIndex(
                    cell => cell.row === item.row && cell.col === item.col
                );

                // If valid, add to priority list and remove from unattacked list
                if (validPlaceIndex !== -1) {
                    priorityPlace.push(item);
                    unattackedPlace.splice(validPlaceIndex, 1);
                }
            });
        };

        // Continue attacking in a specific direction
        const continueAttackInDirection = (current, previous) => {
            const direction = {
                row: current.row - previous.row,
                col: current.col - previous.col
            };

            const nextPosition = {
                row: current.row + direction.row,
                col: current.col + direction.col
            };

            if (
                nextPosition.row >= 0 && nextPosition.row < 10 &&
                nextPosition.col >= 0 && nextPosition.col < 10
            ) {
                const validPlaceIndex = unattackedPlace.findIndex(
                    cell => cell.row === nextPosition.row && cell.col === nextPosition.col
                );

                if (validPlaceIndex !== -1) {
                    priorityPlace.unshift(nextPosition);
                    unattackedPlace.splice(validPlaceIndex, 1);
                }
            }
        };

        // Generate attack place for computer
        if (type === 'computer') {
            // Initialize the list of unattacked places if it's empty
            if (unattackedPlace.length === 0) {
                initValidPlace();
            }

            // Prioritize attacking places near successful hits
            if (priorityPlace.length > 0) {
                // Get the first priority place
                attackPlace = priorityPlace.shift();
            } else {
                // If no priority place, attack a random position
                const randomIndex = Math.floor(Math.random() * unattackedPlace.length);
                attackPlace = unattackedPlace.splice(randomIndex, 1)[0];
            }
        }

        // Perform the attack on the chosen place
        const status = gameboard.receiveAttack(opponentBoard, attackPlace);

        // Handle successful attacks
        if (status === 1 && type === 'computer') {
            if (priorityPlace.length > 0) {
                // Continue on the same direction
                continueAttackInDirection(attackPlace, previousSuccessAttack);
                previousSuccessAttack = attackPlace;
            } else {
                // The first hit - add direction
                insertPriorityPlace(attackPlace);
                previousSuccessAttack = attackPlace;
            }
        }

        if (status === 0) return false;
        if (status === 1) return true;

        return status;
    };

    const allIsPlace = () => {
        return ships.every(
            ship => board.some(
                row => row.some(item => item && item.name === ship.name)
            )
        );
    };

    const allIsSunk = () => {
        return gameboard.allIsSunk();
    };

    return {
        name,
        type,
        placeAllShips,
        placeShip,
        attack,
        allIsSunk,
        allIsPlace,
        getBoard,
        getShips
    };
}

export { Player };
