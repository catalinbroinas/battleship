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
        }

        // If it's the computer's turn, generate a random place
        if (type === 'computer') {
            if (unattackedPlace.length === 0) {
                initValidPlace();
            }

            // Select a random cell from `unattackedPlace`
            const randomIndex = Math.floor(Math.random() * unattackedPlace.length);
            attackPlace = unattackedPlace.splice(randomIndex, 1)[0];
        }

        const status = gameboard.receiveAttack(opponentBoard, attackPlace);

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
