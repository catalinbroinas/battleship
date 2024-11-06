function Gameboard() {
    const initGameboard = () => {
        const rows = 10;
        const columns = 10;
        return Array.from(Array(rows), () => Array(columns).fill(null));
    };

    const board = initGameboard();

    const getBoard = () => board;

    return {
        getBoard
    };
}

export { Gameboard };
