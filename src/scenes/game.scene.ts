import { BoardRenderer } from "../core/board-renderer";
import { BoardObject } from "../core/board.obj"
import { gameConfig } from "../core/configurations";
import { GameScore } from "../core/game-score";
import { translations } from "../core/translations";

export class GameScene extends Phaser.Scene {

    board: BoardObject;
    boardRenderer: BoardRenderer;

    resetGame: boolean = false;
    gameOverText: Phaser.GameObjects.Text;
    language: 'es' | 'en' = 'en'

    score: GameScore;
    modalOppend = false;

    lngButonsGrp: Phaser.GameObjects.Group;
    title_text: Phaser.GameObjects.Text;
    restartButtpn: Phaser.GameObjects.Text;
    footerText: Phaser.GameObjects.Text;

    constructor() {
        super("BoardTestScene")

        this.board = new BoardObject();
        this.score = new GameScore(this, this.board)
        this.boardRenderer = new BoardRenderer(this, this.board, this.score);
    }

    create() {
        this.board.initFieldsArray();
        this.boardRenderer.renderBoard();
        this.lngButonsGrp = new Phaser.GameObjects.Group(this);

        this.initHeader();
        this.addRestartButton();
        this.addFooter();
        //this.addLangButtons();

        this.score.setInitialValues();
        this.gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2, "", { color: "#2d8c01", fontSize: 30, fontStyle: "bold" })
            .setDepth(100)
            .setOrigin(0.5);
    }

    initHeader(): void {
        this.add.rectangle(5, 5, this.scale.width - 10, 60, 0x404040).setOrigin(0)
        this.title_text = this.add.text(this.scale.width / 2, 35, translations[this.language].title, { fontSize: 40, fontStyle: 'bold' }).setOrigin(0.5)
    }

    upadteHeader(): void {
        this.title_text.setText(translations[this.language].title)
    }

    addRestartButton(): void {
        this.restartButtpn = this.add.text(this.scale.width / 2, 500, translations[this.language].restart_label, { fontSize: 24, fontStyle: 'bold' }).setOrigin(0.5)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.showConfirmModal()
            })
            .on(Phaser.Input.Events.POINTER_OVER, () => {
                this.restartButtpn.setColor("#7e9488")
            }).on(Phaser.Input.Events.POINTER_OUT, () => {
                this.restartButtpn.setColor("#FFFFFF")
            });;
    }

    updateRestartButtonText(): void { 
        this.restartButtpn.setText(translations[this.language].restart_label)
    }

    showConfirmModal(): void {
        if (!this.modalOppend) {
            this.modalOppend = true;
            let modal_bkg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000, 0.5).setOrigin(0)
            let modal_ctnr = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 350, 100, 0xa1a1a1, 1).setOrigin(0.5)

            let txt_desc = this.add.text(this.scale.width / 2, this.scale.height / 2 - 25, translations[this.language].restart_modal_text, { color: "0x000", fontStyle: 'bold' }).setOrigin(0.5)

            let btn_no = this.add.rectangle(this.scale.width / 2 - 100, this.scale.height / 2 + 25, 90, 30, 0xd9d9d9, 1).setOrigin(0.5)
            let btn_no_label = this.add.text(this.scale.width / 2 - 100, this.scale.height / 2 + 25, translations[this.language].no, { color: "0x000" }).setOrigin(0.5)
            let btn_yes = this.add.rectangle(this.scale.width / 2 + 100, this.scale.height / 2 + 25, 90, 30, 0xd9d9d9, 1).setOrigin(0.5)
            let btn_yes_label = this.add.text(this.scale.width / 2 + 100, this.scale.height / 2 + 25, translations[this.language].yes, { color: "0x000" }).setOrigin(0.5)

            const destroyModal = () => {
                modal_bkg.destroy();
                modal_ctnr.destroy();
                txt_desc.destroy();
                btn_no.destroy();
                btn_yes.destroy();
                btn_no_label.destroy();
                btn_yes_label.destroy();
                this.modalOppend = false
            }

            btn_no.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
                destroyModal();
            });

            btn_yes.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.board.currentPlayer = gameConfig.player_1;
                this.score.restart();
                this.scene.restart();
                destroyModal();
            });
        }
    }

    addFooter(): void {
        this.footerText = this.add.text(30, this.scale.height - 40, translations[this.language].footer_text);
        // this.add.text(10, this.scale.height - 50, "Por Gabriel Moreno");
        this.add.text(30, this.scale.height - 20, "Thundera Games ©2024");
    }

    updateFooterText():void{
        this.footerText.setText(translations[this.language].footer_text) 
    }

    update() {

        if (this.board.gameOver && !this.resetGame) {
            this.resetGame = true
            this.gameOverText.setText(`${translations[this.language].point_text} ${this.board.winner} !!!`);
            this.tweens.add({
                targets: this.board.winnerFields.map(f => f.payload?.sprite),
                alpha: 0.1,
                yoyo: true,
                repeat: 1,
                duration: 350,
                onComplete: () => {
                    this.gameOverText.setText("")
                    this.resetGame = false;
                    this.board.initFieldsArray();
                    this.boardRenderer.renderBoard()
                }
            }).play()
        }

        if (this.board.noEmptyField() && !this.board.winner) {
            this.gameOverText.setText(translations[this.language].round_over_text);

            setTimeout(() => {
                this.gameOverText.setText("")
                this.board.initFieldsArray();
                this.boardRenderer.renderBoard()
            }, 500);
        }

        this.addLangButtons()
    }

    langChanged = true;

    addLangButtons() {
        if (this.langChanged) {
            this.langChanged = false;

            this.lngButonsGrp.getChildren().forEach(x => x.destroy());

            this.lngButonsGrp.add(this.add.rectangle(this.scale.width / 2, this.scale.height - 100, 150, 30, 0xc2c2c2))

            this.lngButonsGrp.add(this.add.rectangle(this.scale.width / 2, this.scale.height - 100, 130, 25, 0x545452))

            let txtEN = this.add.text(this.scale.width / 2 - 30, this.scale.height - 100, "EN", { fontSize: 12 }).setOrigin(0.5).setDepth(1)
            let txtES = this.add.text(this.scale.width / 2 + 30, this.scale.height - 100, "ES", { fontSize: 12 }).setOrigin(0.5).setDepth(1)

            this.lngButonsGrp.add(txtEN);
            this.lngButonsGrp.add(txtES);

            if (this.language == "en") {
                this.lngButonsGrp.add(this.add.rectangle(this.scale.width / 2 - 30, this.scale.height - 100, 40, 30, 0xc2c2c2).setDepth(0))
                txtEN.setColor("#000")
                    .setFontStyle("bold")
            }

            if (this.language == "es") {
                this.lngButonsGrp.add(this.add.rectangle(this.scale.width / 2 + 30, this.scale.height - 100, 40, 30, 0xc2c2c2).setDepth(0))
                txtES.setColor("#000")
                    .setFontStyle("bold")
            }

            txtEN.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (this.language != "en") {
                    this.language = "en"
                    this.langChanged = true;
                }
            });

            txtES.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (this.language != "es") {
                    this.language = "es"
                    this.langChanged = true;
                }
            });
        }

        this.upadteHeader();
        this.updateRestartButtonText();
        this.updateFooterText();
        this.score.updateTexts();
    }

}