import { Game } from "../modules/game";

describe('Game factory function', () => {
    let game;

    beforeEach(() => {
        game = Game();
    });

    test('should initialize game with default two players and place ships successfully', () => {
        const initStatus = game.initGame();

        expect(initStatus).toBe(true);

        expect(game.getPlayerName()).toBe('Player');
        expect(game.getComputerName()).toBe('Computer');

        expect(game.getCurrentPlayerName()).toBe(game.getPlayerName());
    });

    test('should initialize game with two players and place ships successfully', () => {
        const initStatus = game.initGame('Cata', 'Acer');

        expect(initStatus).toBe(true);

        expect(game.getPlayerName()).toBe('Cata');
        expect(game.getComputerName()).toBe('Acer');

        expect(game.getCurrentPlayerName()).toBe(game.getPlayerName());
    });
});
