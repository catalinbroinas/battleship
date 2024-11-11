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
        expect(gameboard.getBoard()[0][0]).toBe('carrier');
        expect(gameboard.getBoard()[0][1]).toBe('carrier');
        expect(gameboard.getBoard()[0][2]).toBe('carrier');
    });

    test('should place two ships on the gameboard', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        expect(gameboard.placeShip(carrier, place1)).toBe(true);
        expect(gameboard.getBoard()[0][0]).toBe('carrier');
        expect(gameboard.getBoard()[0][1]).toBe('carrier');
        expect(gameboard.getBoard()[0][2]).toBe('carrier');
        expect(gameboard.placeShip(destroyer, place2)).toBe(true);
        expect(gameboard.getBoard()[1][0]).toBe('destroyer');
        expect(gameboard.getBoard()[1][1]).toBe('destroyer');
    });

    test('should not place a ship if the place is out of bounds', () => {
        const place = { row: 10, col: 10 };
        expect(gameboard.placeShip(carrier, place)).toBe('Place is out of bounds');
    });

    test('should not place a ship if it does not fit in the space', () => {
        const place = { row: 0, col: 9 };
        expect(gameboard.placeShip(carrier, place)).toBe('Ship does not fit in the selected space');
    });

    test('should not place a ship if space is already occupied', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 0, col: 1 };
        gameboard.placeShip(carrier, place1);
        expect(gameboard.placeShip(destroyer, place2)).toBe('This place is already occupied');
    });

    test('should place a ship on the edge of the gameboard', () => {
        const place = { row: 0, col: 7 };
        expect(gameboard.placeShip(carrier, place)).toBe(true);
        expect(gameboard.getBoard()[0][7]).toBe('carrier');
        expect(gameboard.getBoard()[0][8]).toBe('carrier');
        expect(gameboard.getBoard()[0][9]).toBe('carrier');
    });

    test('should return missed attack status', () => {
        const place = { row: 5, col: 5 };
        expect(gameboard.receiveAttack(place)).toBe(0);
    });

    test('should return hit attack status', () => {
        const place = { row: 0, col: 0 };
        gameboard.placeShip(carrier, place);
        expect(gameboard.receiveAttack(place)).toBe(1);
    });

    test('should correctly place multiple ships on the gameboard', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        const place3 = { row: 2, col: 0 };
        gameboard.placeShip(carrier, place1);
        gameboard.placeShip(destroyer, place2);
        expect(gameboard.getBoard()[0][0]).toBe('carrier');
        expect(gameboard.getBoard()[0][1]).toBe('carrier');
        expect(gameboard.getBoard()[0][2]).toBe('carrier');
        expect(gameboard.getBoard()[1][0]).toBe('destroyer');
        expect(gameboard.getBoard()[1][1]).toBe('destroyer');
    });

    test('should register missed attacks', () => {
        const place = { row: 9, col: 9 };
        gameboard.receiveAttack(place);
        expect(gameboard.getBoard()[9][9]).toBe(0);
    });

    test('should not register multiple attacks on the same place', () => {
        const place = { row: 0, col: 0 };
        gameboard.placeShip(carrier, place);
        gameboard.receiveAttack(place);
        expect(gameboard.receiveAttack(place)).toBe(undefined);
        expect(gameboard.getBoard()[0][0]).toBe(1);
        expect(gameboard.getBoard()[0][1]).toBe('carrier');
        expect(gameboard.getBoard()[0][2]).toBe('carrier');
    });

    test('should not alter the board when attacking the same place twice', () => {
        const place = { row: 3, col: 3 };
        gameboard.placeShip(carrier, place);
        gameboard.receiveAttack(place);
        const firstAttackResult = gameboard.getBoard()[3][3];
        gameboard.receiveAttack(place);
        const secondAttackResult = gameboard.getBoard()[3][3];
        expect(firstAttackResult).toBe(secondAttackResult);
    });

    test('should report all ships as sunk when no ship parts remain', () => {
        const place = { row: 0, col: 0 };
        gameboard.placeShip(carrier, place);
        gameboard.receiveAttack(place);
        gameboard.receiveAttack({ row: 0, col: 1 });
        gameboard.receiveAttack({ row: 0, col: 2 });
        expect(gameboard.allIsSunk()).toBe(true);
    });

    test('should not report all ships as sunk if any ship remains', () => {
        gameboard.placeShip(carrier, { row: 0, col: 0 });
        gameboard.placeShip(destroyer, { row: 1, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 1 });
        expect(gameboard.allIsSunk()).toBe(false);
    });

    test('should return true when all ships are sunk', () => {
        gameboard.placeShip(carrier, { row: 0, col: 0 });
        gameboard.placeShip(destroyer, { row: 1, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 1 });
        gameboard.receiveAttack({ row: 0, col: 2 });
        gameboard.receiveAttack({ row: 1, col: 0 });
        gameboard.receiveAttack({ row: 1, col: 1 });
        expect(gameboard.allIsSunk()).toBe(true);
    });

    test('should return false if some ships are not sunk', () => {
        gameboard.placeShip(carrier, { row: 0, col: 0 });
        gameboard.placeShip(destroyer, { row: 1, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 0 });
        gameboard.receiveAttack({ row: 0, col: 1 });
        expect(gameboard.allIsSunk()).toBe(false);
    });
});
