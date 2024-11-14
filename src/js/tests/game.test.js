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

    test('should return result of attack and switch player', () => {
        game.initGame();
        const initialPlayer = game.getCurrentPlayerName();
        const place = { row: 0, col: 0 };
        const result = game.playerTurn(place);

        expect(result === true || result === false).toBe(true);

        const newPlayer = game.getCurrentPlayerName();
        expect(newPlayer).not.toBe(initialPlayer);
    });
});
