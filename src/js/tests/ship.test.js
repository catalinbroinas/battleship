import { Ship } from "../modules/ship";

describe('Ship factory function', () => {
    test('should create a ship with correct length and initial hits', () => {
        const ship = Ship(3);
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
        expect(ship.sunk).toBe(false);
    });

    test('should increase hits when hit() is called', () => {
        const ship = Ship(3);
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test('should mark ship as sunk if hits match length', () => {
        const ship = Ship(2);
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
        expect(ship.sunk).toBe(true);
    });

    test('should not mark ship as sunk if hits are less than length', () => {
        const ship = Ship(3);
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        expect(ship.sunk).toBe(false);
    });
});
