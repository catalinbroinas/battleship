function Ship(length, name) {
    const ship = {
        length,
        name,
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
