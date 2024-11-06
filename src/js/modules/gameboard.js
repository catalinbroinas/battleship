function Gameboard() {
    const initGameboard = () => {
        const rows = 10;
        const columns = 10;
        const board = Array.from(Array(rows), () => Array(columns).fill(null));
        return board;
    };

    return {
        initGameboard
    };
}

export { Gameboard };
