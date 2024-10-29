"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
    }
    create() {
        this.image = this.add.image(400, 300, 'logo');
    }
    update() {
        this.image.rotation += 0.01;
    }
}
let configObject = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 800,
        height: 600
    },
    scene: PlayGame
};
new Phaser.Game(configObject);
