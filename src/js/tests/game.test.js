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

    test('should correctly detect winner when all ships are sunk', () => {
        game.initGame('Player', 'Computer');
        let winner = game.checkWinner();

        expect(winner).toBe(false);

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                // Attack of the player
                game.playerTurn({ row, col });

                winner = game.checkWinner();
                if (winner) {
                    expect(winner).toBe(game.getCurrentPlayerName());
                    return;
                }

                // Attack of the computer
                game.playerTurn({ row, col });

                winner = game.checkWinner();
                if (winner) {
                    expect(winner).toBe(game.getCurrentPlayerName());
                    return;
                }
            }
        }

        throw new Error('Expected a winner to be declared');
    });

    test('should correctly detect winner and the game is over when all ships are sunk', () => {
        game.initGame();
        let winner = game.checkWinner();

        expect(game.endGame()).toBe(false);

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                // Attack of the player
                game.playerTurn({ row, col });

                winner = game.checkWinner();
                if (winner) {
                    expect(winner).toBe(game.getCurrentPlayerName());
                    expect(game.endGame()).toBe(true);
                    return;
                }

                // Attack of the computer
                game.playerTurn({ row, col });

                winner = game.checkWinner();
                if (winner) {
                    expect(winner).toBe(game.getCurrentPlayerName());
                    expect(game.endGame()).toBe(true);
                    return;
                }
            }
        }

        throw new Error('Expected a winner to be declared');
    });

    test('should prevent further moves when the game is over', () => {
        game.initGame();

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if (game.endGame()) break;
                game.playerTurn({ row, col });
                game.checkWinner();
            }
        }

        expect(game.playerTurn({ row: 0, col: 0 })).toBeUndefined();
    });

    test('endGame should return false if game has not started', () => {
        expect(game.endGame()).toBe(false);
    });

    test('should reset game state correctly', () => {
        game.initGame();
        let winner = game.checkWinner();

        expect(game.endGame()).toBe(false);

        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                // Attack of the player
                game.playerTurn({ row, col });

                winner = game.checkWinner();
                if (winner) {
                    expect(winner).toBe(game.getCurrentPlayerName());
                    return;
                }

                // Attack of the computer
                game.playerTurn({ row, col });

                winner = game.checkWinner();
                if (winner) {
                    expect(winner).toBe(game.getCurrentPlayerName());
                    return;
                }
            }
        }

        expect(game.endGame()).toBe(true);

        expect(game.playerTurn({ row: 0, col: 0 })).toBeUndefined();

        game.resetGame();

        expect(game.startGame()).toBe(false);
        expect(game.endGame()).toBe(false);
    });

    test('should alternate players after each turn', () => {
        game.initGame();
        const firstPlayer = game.getCurrentPlayerName();

        game.playerTurn({ row: 0, col: 0 });
        expect(game.getCurrentPlayerName()).not.toBe(firstPlayer);

        game.playerTurn({ row: 1, col: 1 });
        expect(game.getCurrentPlayerName()).toBe(firstPlayer);
    });

    test('should reset the game correctly', () => {
        game.initGame('Player', 'Computer');
        game.playerTurn({ row: 0, col: 0 });
        expect(game.getCurrentPlayerName()).toBe('Computer');

        game.resetGame('NewPlayer', 'NewComputer');

        expect(game.getCurrentPlayerName()).toBe('NewPlayer');
        expect(game.endGame()).toBe(false);
    });

    test('should not allow turns if game is not started or is over', () => {
        const result = game.playerTurn({ row: 1, col: 1 });
        expect(result).toBe(undefined);
    });
});
