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
        if (!length) {
            throw new Error('Select a valid ship');
        }

        // Check if the place is within the board bounds
        if (row < 0 || col < 0 || row >= board.length || col >= board[0].length) {
            throw new Error('Place is out of bounds');
        }

        // Check if the ship fits in the space on the board
        if (col + length >= board[0].length) {
            throw new Error('Ship does not fit in the selected space');
        }

        // Check if the space is already occupied by another ship
        const emptyPlace = Array.from({ length }, (_, i) => board[row][col + i]
        ).some((cell) => cell !== null);
        if (emptyPlace) {
            throw new Error('This place is already occupied');
        }

        // Place the ship on the board
        Array.from({ length }, (_, i) => board[row][col + i] = 1);

        return true;
    };

    return {
        getBoard,
        placeShip
    };
}

export { Gameboard };
