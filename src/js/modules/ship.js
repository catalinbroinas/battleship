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
            if (this.hits === this.length && !this.sunk) {
                this.sunk = true;
            }
            return this.sunk;
        }
    };

    return ship;
}

export { Ship };
