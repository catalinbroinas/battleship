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

    // Place all ships on the gameboard at random locations
    const placeAllShips = () => {
        ships.forEach((ship) => {
            let placed = false;

            // Keep trying until the ship is placed correctly
            while (placed !== true) {
                const randomRow = Math.floor(Math.random() * 10);
                const randomCol = Math.floor(Math.random() * 10);

                const place = { row: randomRow, col: randomCol };

                // Attempt to place the ship at the generated position
                placed = gameboard.placeShip(ship, place);
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

        return gameboard.placeShip(ship, place);
    };

    const attack = (place) => {
        let attackPlace = place;

        // If it's the computer's turn, generate a random place
        if (type === 'computer') {
            const randomRow = Math.floor(Math.random() * 10);
            const randomCol = Math.floor(Math.random() * 10);
            attackPlace = { row: randomRow, col: randomCol };
        }

        const status = gameboard.receiveAttack(attackPlace);

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
