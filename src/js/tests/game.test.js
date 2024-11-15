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

    test('should return false, because the game has not started', () => {
        expect(game.startGame()).toBe(false);
    });

    test('should return true, the game started with default names', () => {
        game.initGame();
        expect(game.startGame()).toBe(true);
    });

    test('should return true, the game started with two players', () => {
        game.initGame('User', 'Acer');
        expect(game.startGame()).toBe(true);
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

    test('should return undefined, because the game has not started', () => {
        const place = { row: 0, col: 0 };
        const result = game.playerTurn(place);

        expect(result).toBe(undefined);
    });

    test('should allow attacks on all board positions', () => {
        game.initGame('Player', 'Computer');

        const positionAttacked = [];

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const result = game.playerTurn({ row, col });
                positionAttacked.push(result);
            }
        }

        expect(positionAttacked.length).toBe(100);
        positionAttacked.forEach(result => {
            expect(result).not.toBe(undefined);
        });
    });
    //     game.initGame('Player', 'Computer');

    //     const opponent = game.getCurrentPlayerName() === 'Player' ? 'Computer' : 'Player';

    //     // Iterează prin toate pozițiile pentru a ataca tabla adversarului
    //     for (let row = 0; row < 10; row++) {
    //         for (let col = 0; col < 10; col++) {
    //             game.playerTurn({ row, col });  // Execută atacul
    //         }
    //     }

    //     console.log(game.getPlayerBoard());
    //     console.log(game.getComputerBoard());

    //     // După ce toate pozițiile au fost atacate, verifică câștigătorul
    //     const winner = game.checkWinner();
    //     expect(winner).toBe(opponent);  // Verifică că câștigătorul este corect (adversarul)

    //     // Dacă ajungi aici, testul va trece dacă a fost detectat un câștigător corect
    // });
});
