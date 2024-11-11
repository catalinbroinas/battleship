import { Ship } from "../modules/ship";

describe('Ship factory function', () => {
    test('should create a ship with correct length, name and initial hits', () => {
        const ship = Ship(3, 'carrier');
        expect(ship.length).toBe(3);
        expect(ship.name).toBe('carrier');
        expect(ship.hits).toBe(0);
        expect(ship.sunk).toBe(false);
    });

    test('should increase hits when hit() is called', () => {
        const ship = Ship(3, 'carrier');
        ship.hit();
        expect(ship.hits).toBe(1);
    });

    test('should increase hits when hit() is called by name', () => {
        const carrier = Ship(3, 'carrier');
        const destroyer = Ship(2, 'destroyer');
        carrier.hit();
        expect(carrier.hits).toBe(1);
        expect(destroyer.hits).toBe(0);
    });

    test('should mark ship as sunk if hits match length', () => {
        const ship = Ship(2, 'destroyer');
        ship.hit();
        ship.hit();
        expect(ship.isSunk()).toBe(true);
        expect(ship.sunk).toBe(true);
    });

    test('should not mark ship as sunk if hits are less than length', () => {
        const ship = Ship(3, 'carrier');
        ship.hit();
        expect(ship.isSunk()).toBe(false);
        expect(ship.sunk).toBe(false);
    });
});
