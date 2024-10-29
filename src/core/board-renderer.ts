import { GameScene } from "../scenes/game.scene";
import { BoardObject } from "./board.obj";
import { boardConfig } from "./configurations";
import { GameScore } from "./game-score";

export class BoardRenderer {
    private scene: Phaser.Scene;
    private board: BoardObject;
    private grp: Phaser.GameObjects.Group;
    score: GameScore;
    constructor(scene: Phaser.Scene, board: BoardObject, score: GameScore) {
        this.scene = scene;
        this.board = board;
        this.grp = new Phaser.GameObjects.Group(this.scene)
        this.score = score;
    }

    field_width = 100;
    fields_spacing = 5;
    margin_top = 150;
    margin_left = 30;

    renderBoard() {
        let fws = this.field_width + this.fields_spacing
        this.grp.clear(true)
        for (let row = 0; row < boardConfig.size; row++) {
            for (let column = 0; column < boardConfig.size; column++) {
                let x = this.margin_left + (fws * row);
                let y = this.margin_top + (fws * column);
                let rect = this.scene.add.rectangle(x, y, 100, 100, 0xFFFFFF, 0.8).setOrigin(0)
                this.setInteractive(rect, row, column);
                this.setFieldPayload(row, column, {
                    x: x,
                    y: y,
                    sprite: rect
                })
                this.grp.add(rect)
            }
        }
    }

    setInteractive(obj: Phaser.GameObjects.GameObject, row: number, column: number) {
        obj.setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                let field = this.board.fieldsArray[row][column];
                if (!this.board.gameOver && field.playerId == null && !(this.scene as GameScene).modalOppend) {

                    let spr = field.payload?.sprite as Phaser.GameObjects.Rectangle;
                    if (spr) {
                        this.board.play(row, column)
                        //SHOWS THE PLAYER REPRESENTATION
                        let txt = this.scene.add.text(
                            (field.payload?.x ?? 0) + 50,
                            (field.payload?.y ?? 0) + 50,
                            field.playerId ?? '',
                            {
                                color: '#FFFFFF',
                                fontSize: 120,
                                fontStyle: 'bold'
                            }
                        ).setOrigin(0.5)
                        this.grp.add(txt)
                        spr.setAlpha(0.8)
                        if (this.board.gameOver) {
                            this.score.round++;
                        }

                        this.score.setScore();
                    }
                }
            })
    }

    setFieldPayload(row: number, column: number, payload: any) {
        let field = this.board.fieldsArray[row][column];
        field.payload = payload
    }
}