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
}

export { Player };
