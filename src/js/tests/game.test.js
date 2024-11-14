import { Game } from "../modules/game";

describe('Game factory function', () => {
    let game;

    beforeEach(() => {
        game = Game();
    });

    test('should to init game with two players', () => {
        expect(game.initGame('User', 'Acer')).toBe(true);
    });
});
