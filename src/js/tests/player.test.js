import { Player } from "../modules/player";

describe('Player factory function', () => {
    let player1, player2;

    beforeEach(() => {
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

    test('should place all ships on the player\'s board and test it', () => {
        expect(player1.placeAllShips()).toBe(true);
        expect(player2.placeAllShips()).toBe(true);

        expect(player1.allIsPlace()).toBe(true);
        expect(player2.allIsPlace()).toBe(true);
    });

    test('should place ship on the gameboard', () => {
        const place = { row: 0, col: 0 };

        const carrier = player1.getShips()[0];
        const destroyer = player1.getShips()[4];

        expect(player1.placeShip(carrier, place)).toBe(true);
        expect(player1.placeShip(destroyer, place)).toBe('This place is already occupied');
    });

    test('should place all ships on the board and test it', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        const place4 = { row: 3, col: 0 };
        const place5 = { row: 4, col: 0 };

        const carrier = player1.getShips()[0];
        const battleship = player1.getShips()[1];
        const submarine = player1.getShips()[3];
        const destroyer = player1.getShips()[4];

        expect(player1.placeShip(carrier, place1)).toBe(true);
        expect(player1.placeShip(battleship, place2)).toBe(true);
        expect(player1.placeShip(submarine, place4)).toBe(true);
        expect(player1.placeShip(destroyer, place5)).toBe(true);

        expect(player1.allIsPlace()).toBe(false);
    });

    test('should place all ships on the board for only a player', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        const place3 = { row: 2, col: 0 };
        const place4 = { row: 3, col: 0 };
        const place5 = { row: 4, col: 0 };

        const carrier = player1.getShips()[0];
        const battleship = player1.getShips()[1];
        const cruiser = player1.getShips()[2];
        const submarine = player1.getShips()[3];
        const destroyer = player1.getShips()[4];

        expect(player1.placeShip(carrier, place1)).toBe(true);
        expect(player1.placeShip(battleship, place2)).toBe(true);
        expect(player1.placeShip(cruiser, place3)).toBe(true);
        expect(player1.placeShip(submarine, place4)).toBe(true);
        expect(player1.placeShip(destroyer, place5)).toBe(true);

        expect(player1.allIsPlace()).toBe(true);
        expect(player2.allIsPlace()).toBe(false);
    });

    test('should place all ships on the board for two players', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        const place3 = { row: 2, col: 0 };
        const place4 = { row: 3, col: 0 };
        const place5 = { row: 4, col: 0 };

        const carrier1 = player1.getShips()[0];
        const battleship1 = player1.getShips()[1];
        const cruiser1 = player1.getShips()[2];
        const submarine1 = player1.getShips()[3];
        const destroyer1 = player1.getShips()[4];

        const carrier2 = player1.getShips()[0];
        const battleship2 = player1.getShips()[1];
        const cruiser2 = player1.getShips()[2];
        const submarine2 = player1.getShips()[3];
        const destroyer2 = player1.getShips()[4];

        expect(player1.placeShip(carrier1, place1)).toBe(true);
        expect(player1.placeShip(battleship1, place2)).toBe(true);
        expect(player1.placeShip(cruiser1, place3)).toBe(true);
        expect(player1.placeShip(submarine1, place4)).toBe(true);
        expect(player1.placeShip(destroyer1, place5)).toBe(true);

        expect(player2.placeShip(carrier2, place1)).toBe(true);
        expect(player2.placeShip(battleship2, place2)).toBe(true);
        expect(player2.placeShip(cruiser2, place3)).toBe(true);
        expect(player2.placeShip(submarine2, place4)).toBe(true);
        expect(player2.placeShip(destroyer2, place5)).toBe(true);

        expect(player1.allIsPlace()).toBe(true);
        expect(player2.allIsPlace()).toBe(true);
    });

    test('should not place ship on the gameboard, because the board is full', () => {
        const place = { row: 0, col: 0 };
        const carrier = player1.getShips()[0];

        player1.placeAllShips();
        expect(player1.placeShip(carrier, place)).toBe('The board is full');
    });

    test('should place ship on the gameboard for player 2, place all ships for player 1', () => {
        const place = { row: 0, col: 0 };
        const carrier = player2.getShips()[0];

        player1.placeAllShips();
        expect(player2.placeShip(carrier, place)).toBe(true);

        expect(player1.allIsPlace()).toBe(true);
        expect(player2.allIsPlace()).toBe(false);
    });

    test('should place all ships on the player\'s board only once', () => {
        expect(player1.placeAllShips()).toBe(true);
        expect(player1.placeAllShips()).toBe(false);

        expect(player2.placeAllShips()).toBe(true);
        expect(player2.placeAllShips()).toBe(false);

        expect(player1.allIsPlace()).toBe(true);
        expect(player2.allIsPlace()).toBe(true);
    });

    test('should allow the computer to make a random attack', () => {
        const computerAttackResult = player2.attack(player1.getBoard());
        expect(computerAttackResult === true || computerAttackResult === false).toBe(true);
    });

    test('should register an attack on the gameboard', () => {
        const attackPosition = { row: 1, col: 1 };
        expect(player1.attack(player2.getBoard(), attackPosition)).toBe(false);
        const result = player1.attack(player2.getBoard(), attackPosition);
        expect(result === true || result === false).toBe(false);
    });

    test('should attack ships on the board', () => {
        const place1 = { row: 0, col: 0 };
        const place2 = { row: 1, col: 0 };
        const place3 = { row: 2, col: 0 };
        const place4 = { row: 3, col: 0 };
        const place5 = { row: 4, col: 0 };

        const carrier1 = player1.getShips()[0];
        const battleship1 = player1.getShips()[1];
        const cruiser1 = player1.getShips()[2];
        const submarine1 = player1.getShips()[3];
        const destroyer1 = player1.getShips()[4];

        const carrier2 = player2.getShips()[0];
        const battleship2 = player2.getShips()[1];
        const cruiser2 = player2.getShips()[2];
        const submarine2 = player2.getShips()[3];
        const destroyer2 = player2.getShips()[4];

        player1.placeShip(carrier1, place1);
        player1.placeShip(battleship1, place2);
        player1.placeShip(cruiser1, place3);
        player1.placeShip(submarine1, place4);
        player1.placeShip(destroyer1, place5);

        player2.placeShip(carrier2, place1);
        player2.placeShip(battleship2, place2);
        player2.placeShip(cruiser2, place3);
        player2.placeShip(submarine2, place4);
        player2.placeShip(destroyer2, place5);

        expect(player1.allIsPlace()).toBe(true);
        expect(player2.allIsPlace()).toBe(true);

        expect(player1.attack(player2.getBoard(), place1)).toBe(true);
        expect(player1.attack(player2.getBoard(), { row: 4, col: 4 })).toBe(false);

        let computerAttack = player2.attack(player1.getBoard());
        expect(computerAttack === true || computerAttack === false).toBe(true);
        computerAttack = player2.attack(player1.getBoard());
        expect(computerAttack === true || computerAttack === false).toBe(true);
    });

    test('should return false, because the game has not started', () => {
        expect(player1.allIsSunk()).toBe(false);
        expect(player2.allIsSunk()).toBe(false);
    });

    test('should sink a ship after all its parts are hit', () => {
        const place = { row: 0, col: 0 };
        const destroyer = player2.getShips()[4];

        player2.placeShip(destroyer, place);

        expect(player1.attack(player2.getBoard(), place)).toBe(true);
        expect(player1.attack(player2.getBoard(), { row: 0, col: 1 })).toBe(true);

        expect(player2.allIsSunk()).toBe(true);
    });

    test('should return false when attacking an empty location', () => {
        const invalidPlace = { row: 10, col: 10 };
        expect(player1.attack(player2.getBoard(), invalidPlace)).toBe('Place is out of bounds');
    });

    test('should not allow to attack a sunken ship again', () => {
        const place = { row: 0, col: 0 };
        const destroyer1 = player1.getShips()[4];
        const destroyer2 = player2.getShips()[4];

        player1.placeShip(destroyer1, place);
        player2.placeShip(destroyer2, place);

        expect(player1.attack(player2.getBoard(), place)).toBe(true);
        expect(player1.attack(player2.getBoard(), { row: 0, col: 1 })).toBe(true);

        expect(player1.allIsSunk()).toBe(false);
        expect(player2.allIsSunk()).toBe(true);

        expect(player1.attack(player2.getBoard(), place)).toBe(undefined);
    });

    test('should allow the computer to make a random attack', () => {
        const computerAttackResult = player2.attack(player1.getBoard());
        expect(computerAttackResult === true || computerAttackResult === false).toBe(true);
    });
});
