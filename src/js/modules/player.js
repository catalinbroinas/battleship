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
            // Define adjacent directions and ensure they stay within board bounds
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

        // If the attack hits, add adjacent positions to the priority list
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
