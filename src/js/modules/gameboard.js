import { Ship } from "./ship";

function Gameboard() {
    const initGameboard = () => {
        const rows = 10;
        const columns = 10;
        return Array.from(Array(rows), () => Array(columns).fill(null));
    };

    const board = initGameboard();

    const getBoard = () => board;

    // Places a ship on the gameboard at the specified location
    const placeShip = (ship, place) => {
        const { row, col } = place;
        const { length } = ship;

        // Validate the ship length
        if (!length) return 'Select a valid ship';

        // Check if the place is within the board bounds
        if (row < 0 || col < 0 || row >= board.length || col >= board[0].length) {
            return 'Place is out of bounds';
        }

        // Check if the ship fits in the space on the board
        if (col + length > board[0].length) {
            return 'Ship does not fit in the selected space';
        }

        // Check if the space is already occupied by another ship
        const occupiedPlace = Array.from({ length }, (_, i) => board[row][col + i]
        ).some((cell) => cell !== null);
        if (occupiedPlace) {
            return 'This place is already occupied';
        }

        // Place the ship on the board
        Array.from({ length }, (_, i) => board[row][col + i] = ship);
        return true;
    };

    // Processes an attack on the gameboard at the specified location
    const receiveAttack = (place) => {
        const { row, col } = place;

        // Check if the attack is within the board boundaries
        if (row < 0 || col < 0 || row >= board.length || col >= board[0].length) {
            return 'Place is out of bounds';
        }

        // If the place was already attacked, do nothing
        if (board[row][col] === 0 || board[row][col] === 1) return;

        // Mark as missed if no ship is present
        if (board[row][col] === null) {
            board[row][col] = 0;
            return 0;
        }

        // Mark as hit if a ship is present
        const attackedShip = board[row][col];
        if (attackedShip) {
            attackedShip.hit();
            board[row][col] = 1;
            return 1;
        }
    };

    // Check if all ships are sunk
    const allIsSunk = () => {
        // Check if the game has started: if all cells are null, the game has not begun
        const start = board.every(row => row.every(cell => cell === null));
        if (start) return false;

        // Check if any ships remain: all cells contain 0, 1 or null, all ships are sunk
        const end = board.some(row => row.some(cell => typeof cell === 'string'));
        if (!end) return true;

        // Return false if there are still ships on the board
        return false;
    };

    return {
        getBoard,
        placeShip,
        receiveAttack,
        allIsSunk
    };
}

export { Gameboard };
