import { Ship } from "./ship";
import { Gameboard } from "./gameboard";

function Player(name, type) {
    const gameboard = Gameboard();

    // Gameboard of the player
    const board = gameboard.getBoard();
    const getBoard = () => board;

    // List of ships
    const ships = [
        Ship(5, 'carrier'),
        Ship(4, 'battleship'),
        Ship(3, 'cruiser'),
        Ship(3, 'submarine'),
        Ship(2, 'destroyer')
    ];
    const getShips = () => ships;

    const ERROR_MESSAGES = {
        invalidShip: 'Invalid ship',
        boardIsFull: 'The board is full'
    };

    // Save available place and adjacent place for enhance computer attack
    const unattackedPlace = [];
    const priorityPlace = [];
    let previousSuccessAttack = null;

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

        // Initializes unattacked places
        const initValidPlace = () => {
            opponentBoard.forEach((rowData, rowIndex) => {
                rowData.forEach((colData, colIndex) => {
                    unattackedPlace.push({ row: rowIndex, col: colIndex });
                });
            });
        };

        // Returns all valid adjacent positions for a given place
        const getValidAdjacentPositions = (target) => {
            const positions = [
                { row: target.row, col: target.col + 1 },
                { row: target.row, col: target.col - 1 },
                { row: target.row + 1, col: target.col },
                { row: target.row - 1, col: target.col }
            ].filter(
                pos => pos.row >= 0 && pos.row < 10 && pos.col >= 0 && pos.col < 10
            );

            return positions;
        };

        // Adds valid adjacent positions to the priority list
        const addToPriorityList = (target) => {
            const adjacentPositions = getValidAdjacentPositions(target);

            adjacentPositions.forEach(pos => {
                const index = unattackedPlace.findIndex(
                    cell => cell.row === pos.row && cell.col === pos.col
                );

                if (index !== -1) {
                    priorityPlace.push(pos);
                    unattackedPlace.splice(index, 1);
                }
            });
        };

        // Calculates and adds the next position in the attack direction to the priority list
        const continueInDirection = (current, previous) => {
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
                const index = unattackedPlace.findIndex(
                    cell => cell.row === nextPosition.row && cell.col === nextPosition.col
                );

                if (index !== -1) {
                    priorityPlace.unshift(nextPosition);
                    unattackedPlace.splice(index, 1);
                }
            }
        };

        // Determines the next attack position for the computer
        const determineNextAttack = () => {
            if (unattackedPlace.length === 0) initValidPlace();

            if (priorityPlace.length > 0) return priorityPlace.shift();

            const randomIndex = Math.floor(Math.random() * unattackedPlace.length);
            return unattackedPlace.splice(randomIndex, 1)[0];
        };

        // Main logic for computer attack
        if (type === 'computer') {
            attackPlace = determineNextAttack();
        }

        // Execute the attack and get the status
        const status = gameboard.receiveAttack(opponentBoard, attackPlace);

        // Handle successful attacks
        if (status === 1 && type === 'computer') {
            if (priorityPlace.length > 0) {
                continueInDirection(attackPlace, previousSuccessAttack);
            } else {
                addToPriorityList(attackPlace);
            }

            previousSuccessAttack = attackPlace;
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
