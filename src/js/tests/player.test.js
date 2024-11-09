import { Ship } from "../modules/ship";
import { Gameboard } from "../modules/gameboard";
import { Player } from "../modules/player";

describe('Player factory function', () => {
    let ship1;
    let player1, player2;

    beforeEach(() => {
        ship1 = Ship(3);
        player1 = Player('User', 'real');
        player2 = Player('Computer', 'computer');
    });

    test('should set the player name and type correctly', () => {
        expect(player1.name).toBe("User");
        expect(player1.type).toBe('real');
        expect(player2.name).toBe("Computer");
        expect(player2.type).toBe('computer');
    });

    test('should place all ships on the player\'s board without errors', () => {
        expect(player1.placeAllShips()).toBe(true);
        expect(player2.placeAllShips()).toBe(true);
    });

    test('should allow the computer to make a random attack', () => {
        const computerAttackResult = player2.attack();
        expect(computerAttackResult === true || computerAttackResult === false).toBe(true);
    });

    test('should register an attack on the gameboard', () => {
        const attackPosition = { row: 1, col: 1 };
        expect(player1.attack(attackPosition)).toBe(false);
        const result = player1.attack(attackPosition);
        expect(result === true || result === false).toBe(false);
    });
});
