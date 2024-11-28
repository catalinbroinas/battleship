import { Ship } from "./ship";
import { Gameboard } from "./gameboard";

function Player(name, type) {
    const gameboard = Gameboard();

    // Gameboard of the player
    const board = gameboard.getBoard();

    // Save available place and adjacent place for enhance computer attack
    const unattackedPlace = [];
    const priorityPlace = [];

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

    // Place all ships on the gameboard at random locations
    const placeAllShips = () => {
        // Check if the board is clear
        const clear = board.every(row => row.every(cell => cell === null));
        if (!clear) return false;

        ships.forEach((ship) => {
            let placed = false;

            // Keep trying until the ship is placed correctly
            while (placed !== true) {
                const randomRow = Math.floor(Math.random() * 10);
                const randomCol = Math.floor(Math.random() * 10);

                const place = { row: randomRow, col: randomCol };

                // Select orientation
                const randomOrientation = Math.floor(Math.random() * 2);
                const validOrientations = ['horizontal', 'vertical'];
                const orientation = validOrientations[randomOrientation];

                // Attempt to place the ship at the generated position
                placed = gameboard.placeShip(ship, place, orientation);
            }
        });

        // Return true after all ships are placed
        return true;
    };

    // Place ship on the gameboard at a specified location
    const placeShip = (ship, place) => {
        // Check ih the ship exists in the `ships` list
        const validShip = ships.find(item => item.name === ship.name);
        if (!validShip) return 'Invalid ship';

        // Check if the board is full
        if (allIsPlace()) return 'The board is full';

        return gameboard.placeShip(ship, place);
    };

    const attack = (opponentBoard, place) => {
        let attackPlace = place;

        const initValidPlace = () => {
            opponentBoard.forEach((rowData, rowIndex) => {
                rowData.forEach((colData, colIndex) => {
                    unattackedPlace.push({ row: rowIndex, col: colIndex });
                });
            });
        };

        const insertPriorityPlace = (target) => {
            const directions = [
                { row: target.row, col: target.col + 1 },
                { row: target.row, col: target.col - 1 },
                { row: target.row + 1, col: target.col },
                { row: target.row - 1, col: target.col }
            ];

            directions.forEach(item => {
                // Check if the place is valid
                const validPlaceIndex = unattackedPlace.findIndex(
                    cell => cell.row === item.row && cell.col === item.col
                );

                // If the place is valid, add to priority and remove from un attacked list
                if (validPlaceIndex !== -1) {
                    priorityPlace.push(item);
                    unattackedPlace.splice(validPlaceIndex, 1);
                }
            });
        };

        // If it's the computer's turn, generate a random place
        if (type === 'computer') {
            if (unattackedPlace.length === 0) {
                initValidPlace();
            }

            // Attack the places with priority, if it exist
            if (priorityPlace.length > 0) {
                const randomIndex = Math.floor(Math.random() * priorityPlace.length);
                attackPlace = priorityPlace.splice(randomIndex, 1)[0];
            } else {
                const randomIndex = Math.floor(Math.random() * unattackedPlace.length);
                attackPlace = unattackedPlace.splice(randomIndex, 1)[0];
            }
        }

        const status = gameboard.receiveAttack(opponentBoard, attackPlace);

        if (status === 1 && type === 'computer') {
            insertPriorityPlace(attackPlace);
        }

        if (status === 0) return false;
        if (status === 1) return true;

        return status;
    };

    const allIsPlace = () => {
        return ships.every(ship => board.some(row => row.some(item => item && item.name === ship.name)));
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
