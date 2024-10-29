import { GameScene } from "../scenes/game.scene";
import { BoardObject } from "./board.obj";
import { gameConfig } from "./configurations";
import { translations } from "./translations";

export class GameScore {
    restart() {
        this.round = 1;
        this.p1_score = 0;
        this.p2_score = 0;
        this.setScore();
    }

    private scene: GameScene;
    private board: BoardObject;

    private score_label: Phaser.GameObjects.Text;
    private round_label: Phaser.GameObjects.Text;

    private player_2_score: Phaser.GameObjects.Text;
    private player_1_score: Phaser.GameObjects.Text;
    private current_player: Phaser.GameObjects.Text;
    private round_counter: Phaser.GameObjects.Text;


    private p1_score: number = 0;
    private p2_score: number = 0;
    round: number = 1;

    backgrpundObjects: Phaser.GameObjects.Group;

    constructor(scene: GameScene, gameBoard: BoardObject) {
        this.scene = scene;
        this.board = gameBoard;

        this.backgrpundObjects = new Phaser.GameObjects.Group(this.scene);
    }

    setInitialValues() {
        this.backgrpundObjects.getChildren().forEach(o => o.destroy());

        let bkg_score_1 = this.scene.add.rectangle(this.scene.scale.width - 120, 150, 100, 30, 0xFFFFFF).setOrigin(0)
        this.backgrpundObjects.add(bkg_score_1);

        this.score_label = this.scene.add.text(this.scene.scale.width - 70, 165, translations[this.scene.language].score_label, { fontSize: 20, color: "#000" }).setOrigin(0.5);

        this.player_1_score = this.scene.add.text(this.scene.scale.width - 100, 185, `${gameConfig.player_1} = ${this.p1_score}`, { fontSize: 20 });
        this.player_2_score = this.scene.add.text(this.scene.scale.width - 100, 215, `${gameConfig.player_2} = ${this.p2_score}`, { fontSize: 20 });
        this.current_player = this.scene.add.text(this.scene.scale.width / 2, 120, `${translations[this.scene.language].current_player_label} ${this.board.currentPlayer}`, { fontSize: 25 }).setOrigin(0.5);

        let bkg_round_1 = this.scene.add.rectangle(this.scene.scale.width - 120, 375, 100, 30, 0xFFFFFF).setOrigin(0)
        this.backgrpundObjects.add(bkg_round_1);


        this.round_label = this.scene.add.text(this.scene.scale.width - 100, 380, translations[this.scene.language].round_label, { fontSize: 20, color: "#000" });
        this.round_counter = this.scene.add.text(this.scene.scale.width - 80, 420, `${this.round}`, { fontSize: 22, color: "#FFF" });
    }

    renderScore() {
        this.player_1_score.setText(`${gameConfig.player_1} = ${this.p1_score}`);
        this.player_2_score.setText(`${gameConfig.player_2} = ${this.p2_score}`);
        this.current_player.setText(`${translations[this.scene.language].current_player_label}  ${this.board.currentPlayer}`);
        this.round_counter.setText(`${this.round}`);
    }

    setScore() {
        let tweenTarget;
        let tweenRepeats;
        if (this.board.winner == gameConfig.player_1) {
            this.p1_score++;
            tweenRepeats = this.p1_score;
            tweenTarget = this.player_1_score;
        }

        if (this.board.winner == gameConfig.player_2) {
            this.p2_score++;
            tweenRepeats = this.p2_score;
            tweenTarget = this.player_2_score;
        }

        this.scene.add.tween({
            targets: tweenTarget,
            alpha: 0.1,
            yoyo: true,
            repeat: 2,
            duration: 250,
        })

        this.renderScore();
    }

    updateTexts(): void { 
        this.score_label.setText(translations[this.scene.language].score_label)
        this.round_label.setText(translations[this.scene.language].round_label)
        this.current_player.setText(`${translations[this.scene.language].current_player_label} ${this.board.currentPlayer}`)
        
    }
}


