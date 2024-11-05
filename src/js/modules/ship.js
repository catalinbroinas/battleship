function Ship(length) {
    const ship = {
        length,
        hits: 0,
        sunk: false,
        hit: function () {
            this.hits += 1;
            this.isSunk();
        },
        isSunk: function () {
            this.sunk = this.hits === this.length;
            return this.sunk
        }
    };

    return ship;
}

export { Ship };
