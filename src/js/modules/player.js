import { Ship } from "./ship";
import { Gameboard } from "./gameboard";

function Player() {
    const gameboard = Gameboard();

    // Gameboard of the player
    const board = gameboard.getBoard();

    // List of ships
    const ships = [
        Ship(5),  // Carrier
        Ship(4),  // Battleship
        Ship(3),  // Cruiser
        Ship(3),  // Submarine
        Ship(2)   // Destroyer
    ];

    // Place all ships on the gameboard at random locations
    const placeAllShips = () => {
        ships.forEach((ship) => {
            let placed = false;

            // Keep trying until the ship is placed correctly
            while (!placed) {
                const randomRow = Math.floor(Math.random() * 10);
                const randomCol = Math.floor(Math.random() * 10);

                const place = { row: randomRow, col: randomCol };

                try {
                    // Attempt to place the ship at the generated position
                    placed = gameboard.placeShip(ship, place);
                } catch (error) {
                    // If placement fails, retry
                    placed = false;
                }
            }
        });

        // Return true after all ships are placed
        return true;
    };

    return {
        placeAllShips
    };
}

export { Player };
