import 'phaser';
import { GameScene } from './scenes/game.scene';

let configObject: Phaser.Types.Core.GameConfig = {
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: 480,
        height: 640,
    },
    antialias:false,
    scene: GameScene
};
 
new Phaser.Game(configObject);