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
});
