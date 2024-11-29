function Gameboard() {
    const initGameboard = () => {
        const rows = 10;
        const columns = 10;
        return Array.from(Array(rows), () => Array(columns).fill(null));
    };

    const board = initGameboard();

    // Attack value
    const MISS = 0;
    const HIT = 1;

    const getBoard = () => board;

    // Places a ship on the gameboard at the specified location
    const placeShip = (ship, place, orientation = 'horizontal') => {
        const { row, col } = place;
        const { length } = ship;

        if (!length) return 'Select a valid ship';

        if (row < 0 || col < 0 || row >= board.length || col >= board[0].length) {
            return 'Place is out of bounds';
        }

        const validOrientations = ['horizontal', 'vertical'];
        if (!validOrientations.includes(orientation)) {
            return 'Choose between horizontal or vertical orientation.';
        }

        // Set direction based on orientation
        const [dx, dy] = orientation === 'horizontal' ? [0, 1] : [1, 0];

        if (
            row + dx * (length - 1) >= board.length ||
            col + dy * (length - 1) >= board[0].length
        ) {
            return 'Ship does not fit in the selected space';
        }

        const isOccupied = Array.from(
            { length }, (_, i) => board[row + i * dx][col + i * dy]
        ).some(cell => cell !== null);
        if (isOccupied) {
            return 'This place is already occupied';
        }

        // Place the ship on the board
        Array.from({ length }, (_, i) => {
            board[row + i * dx][col + i * dy] = ship;
        });

        return true;
    };

    // Processes an attack on the specified location and updates the opponent's board
    const receiveAttack = (opponentBoard, place) => {
        const { row, col } = place;

        // Check if the attack is within the board boundaries
        if (
            row < 0 || col < 0 ||
            row >= opponentBoard.length || col >= opponentBoard[0].length
        ) {
            return;
        }

        // If the place was already attacked, do nothing
        if ([MISS, HIT].includes(opponentBoard[row][col])) return;

        // Mark as missed if no ship is present
        if (opponentBoard[row][col] === null) {
            opponentBoard[row][col] = MISS;
            return MISS;
        }

        // Mark as hit if a ship is present
        const attackedShip = opponentBoard[row][col];
        if (attackedShip) {
            attackedShip.hit();
            opponentBoard[row][col] = HIT;
            return HIT;
        }
    };

    // Check if all ships on the board are sunk
    const allIsSunk = () => {
        const gameNotStarted = board.every(row => row.every(cell => cell === null));
        if (gameNotStarted) return false;

        // Check if any ships remain: all cells contain 0, 1 or null, all ships are sunk
        const shipsRemaining = board.some(
            row => row.some(cell => typeof cell === 'object' && cell !== null)
        );
        if (!shipsRemaining) return true;

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
