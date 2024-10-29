import { Field } from "./field.interface";
import { boardConfig, gameConfig } from "./configurations"

export class BoardObject {

    fieldsArray: Field[][] = [];
    currentPlayer: string;
    winnerFields: Field[] = [];

    gameOver = false;
    winner = '';

    constructor() {
        this.currentPlayer = gameConfig.player_1;
    }


    initFieldsArray(): void {
        this.winner = '';
        this.winnerFields = [];
        this.gameOver = false;

        for (let row = 0; row < boardConfig.size; row++) {
            this.fieldsArray[row] = []
            for (let column = 0; column < boardConfig.size; column++) {
                this.fieldsArray[row][column] = {

                    playerId: null,
                    row: row,
                    column: column,

                } as Field;
            }
        }
    }

    noEmptyField(): boolean {
        return this.fieldsArray.filter(f => f.filter(l => l.playerId == null).length > 0).length == 0;
    }

    play(x: number, y: number) {
        this.winnerFields = []
        let field = this.fieldsArray[x][y];
        if (field.playerId != null)
            return;

        this.setField(x, y, this.currentPlayer);

        this.currentPlayer = (this.currentPlayer == gameConfig.player_1) ? gameConfig.player_2 : gameConfig.player_1;
        this.validateWin();

    }

    setField(x: number, y: number, player: string) {
        let field = this.fieldsArray[x][y];
        field.playerId = player;
    }

    pushRowSprites(column: number) {
        for (let row = 0; row < boardConfig.size; row++) {
            this.winnerFields.push(this.fieldsArray[row][column]);
        }
    }

    pushColSprites(column: number) {
        for (let row = 0; row < boardConfig.size; row++) {
            this.winnerFields.push(this.fieldsArray[column][row]);
        }
    }

    private VerifyHorizontals(): boolean {
        for (let row = 0; row < boardConfig.size; row++) {
            let result = true;
            this.winnerFields = []
            let fieldId = this.fieldsArray[0][row].playerId;

            for (let column = 1; column < boardConfig.size; column++) {
                const field = this.fieldsArray[column][row];
                if ((field.playerId != fieldId || fieldId == null) && result) {
                    result = false;
                }
            }

            if (result) {
                this.pushRowSprites(row);
                return true;
            }
        }

        return false;
    }

    private VerifyVerticals(): boolean {
        //validate verticals
        for (let row = 0; row < boardConfig.size; row++) {
            let result = true;
            this.winnerFields = []
            let fieldId = this.fieldsArray[row][0].playerId;

            for (let column = 1; column < boardConfig.size; column++) {
                const field = this.fieldsArray[row][column];
                if ((field.playerId != fieldId || fieldId == null) && result) {
                    result = false;
                }
            }

            if (result) {
                this.pushColSprites(row);
                return true;
            }
        }

        return false;
    }

    private VerifyDiagonal_1(): boolean {
        this.winnerFields = []
        let column = 1;
        let win = true;
        let winner = this.fieldsArray[0][boardConfig.size - 1]?.playerId;

        if (winner == null) {
            return false;
        }
        this.winnerFields.push(this.fieldsArray[0][boardConfig.size - 1])

        for (let row = 1; row < boardConfig.size; row++) {
            if (this.fieldsArray[row][column]?.playerId != winner) {
                win = false;
            } else {
                this.winnerFields.push(this.fieldsArray[row][column])
            }
            column--
        }

        return win;
    }

    private VerifyDiagonal_2(): boolean {
        this.winnerFields = []
        let winner = this.fieldsArray[0][0]?.playerId;
        
        if (winner == null) {
            return false;
        }

        this.winnerFields.push(this.fieldsArray[0][0])
        let win = true;

        for (let pos = 1; pos < boardConfig.size; pos++) {
            if (this.fieldsArray[pos][pos]?.playerId != winner) {
                win = false;
            }
            else {
                this.winnerFields.push(this.fieldsArray[pos][pos])
            }
        }

        return win;
32    }

    validateWin() {
        let validators: Function[] = [];
        validators.push(this.VerifyHorizontals.bind(this));
        validators.push(this.VerifyVerticals.bind(this));
        validators.push(this.VerifyDiagonal_1.bind(this));
        validators.push(this.VerifyDiagonal_2.bind(this));

        let win = false;
        validators.forEach(fn => {
            if (win) return;

            win = fn();
            if (win) {
                this.winner = this.winnerFields.find(x => x)?.playerId ?? '';
                this.gameOver = true;
            }
        })

    }
}