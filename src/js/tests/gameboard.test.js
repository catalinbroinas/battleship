import { Ship } from "../modules/ship";
import { Gameboard } from "../modules/gameboard";

describe('Gameboard factory function', () => {
    let gameboard;
    let carrier;
    let destroyer;

    beforeEach(() => {
        gameboard = Gameboard();
        carrier = Ship(3, 'carrier');
        destroyer = Ship(2, 'destroyer');
    });

    test('should place a ship on the gameboard', () => {
        const place = { row: 0, col: 0 };
        expect(gameboard.placeShip(carrier, place)).toBe(true);
        expect(gameboard.getBoard()[0][0]).toBe(carrier);
        expect(gameboard.getBoard()[0][1]).toBe(carrier);
        expect(gameboard.getBoard()[0][2]).toBe(carrier);
    });

    test('should place two ships on the gameboard without overlap', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        expect(gameboard.placeShip(carrier, place1)).toBe(true);
        expect(gameboard.placeShip(destroyer, place2)).toBe(true);

        expect(gameboard.getBoard()[0][0]).toBe(carrier);
        expect(gameboard.getBoard()[0][1]).toBe(carrier);
        expect(gameboard.getBoard()[0][2]).toBe(carrier);

        expect(gameboard.getBoard()[1][0]).toBe(destroyer);
        expect(gameboard.getBoard()[1][1]).toBe(destroyer);
    });

    test('should not place a ship out of bounds', () => {
        const place = { row: 10, col: 10 };
        expect(gameboard.placeShip(carrier, place)).toBe('Place is out of bounds');
    });

    test('should not place a ship if it does not fit in the space', () => {
        const place = { row: 0, col: 9 };
        expect(gameboard.placeShip(carrier, place)).toBe('Ship does not fit in the selected space');
    });

    test('should not place a ship if the space is already occupied', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 0, col: 1 };
        gameboard.placeShip(carrier, place1);
        expect(gameboard.placeShip(destroyer, place2)).toBe('This place is already occupied');
    });

    test('should place a ship on the edge of the gameboard', () => {
        const place = { row: 0, col: 7 };
        expect(gameboard.placeShip(carrier, place)).toBe(true);
    });

    test('should return missed attack status for empty cells', () => {
        const place = { row: 5, col: 5 };
        expect(gameboard.receiveAttack(place)).toBe(0);
    });

    test('should return an error for an out-of-bounds attack', () => {
        expect(gameboard.receiveAttack({ row: 10, col: 10 })).toBe('Place is out of bounds');
    });

    test('should attack a ship on the edge of the gameboard', () => {
        const place = { row: 0, col: 7 };
        gameboard.placeShip(carrier, place);
        expect(gameboard.receiveAttack(place)).toBe(1);
        expect(gameboard.receiveAttack({ row: 0, col: 8 })).toBe(1);
        expect(gameboard.receiveAttack({ row: 0, col: 9 })).toBe(1);
    });

    test('should return hit attack status and update ship hit count', () => {
        const place = { row: 0, col: 0 };
        gameboard.placeShip(carrier, place);
        expect(gameboard.receiveAttack(place)).toBe(1);
        expect(carrier.hits).toBe(1);
    });

    test('should mark all ships as sunk correctly', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        gameboard.placeShip(carrier, place1);
        gameboard.placeShip(destroyer, place2);

        // Attack all cells of carrier
        gameboard.receiveAttack({ row: 0, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 1 });
        gameboard.receiveAttack({ row: 0, col: 2 });

        // Attack all cells of destroyer
        gameboard.receiveAttack({ row: 1, col: 0 });
        gameboard.receiveAttack({ row: 1, col: 1 });

        expect(gameboard.allIsSunk()).toBe(true);
    });

    test('should notice that the game has not started', () => {
        expect(gameboard.allIsSunk()).toBe(false);
    });

    test('should return false when some ships are afloat', () => {
        const place = { row: 0, col: 0 };
        gameboard.placeShip(carrier, place);
        gameboard.receiveAttack(place);

        expect(gameboard.allIsSunk()).toBe(false);
    });

    test('should not report all ships as sunk if any ship remains afloat', () => {
        gameboard.placeShip(carrier, { row: 0, col: 0 });
        gameboard.placeShip(destroyer, { row: 1, col: 0 });

        // Attack only part of carrier
        gameboard.receiveAttack({ row: 0, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 1 });

        expect(gameboard.allIsSunk()).toBe(false);
    });

    test('should return false if only one ship is sunk but others remain afloat', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };

        gameboard.placeShip(carrier, place1);
        gameboard.placeShip(destroyer, place2);

        gameboard.receiveAttack({ row: 0, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 1 });
        gameboard.receiveAttack({ row: 0, col: 2 });

        expect(gameboard.allIsSunk()).toBe(false);
    });

    test('should not allow multiple attacks on the same cell', () => {
        const place = { row: 0, col: 0 };
        gameboard.placeShip(carrier, place);
        gameboard.receiveAttack(place);

        // Attempting a second attack on the same cell should not change the result
        expect(gameboard.receiveAttack(place)).toBe(undefined);
        expect(gameboard.getBoard()[0][0]).toBe(1);
    });
});
