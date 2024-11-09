import { Ship } from "../modules/ship";
import { Gameboard } from "../modules/gameboard";

describe('Gameboard factory function', () => {
    let gameboard;
    let ship1;

    beforeEach(() => {
        gameboard = Gameboard();
        ship1 = Ship(3);
    });

    test('should place a ship on the gameboard', () => {
        const place = { row: 0, col: 0 };
        expect(gameboard.placeShip(ship1, place)).toBe(true);
        expect(gameboard.getBoard()[0][0]).toBe(1);
        expect(gameboard.getBoard()[0][1]).toBe(1);
        expect(gameboard.getBoard()[0][2]).toBe(1);
    });

    test('should not place a ship if the place is out of bounds', () => {
        const place = { row: 10, col: 10 };
        expect(gameboard.placeShip(ship1, place)).toBe('Place is out of bounds');
    });

    test('should not place a ship if it does not fit in the space', () => {
        const place = { row: 0, col: 9 };
        expect(gameboard.placeShip(ship1, place)).toBe('Ship does not fit in the selected space');
    });
});
