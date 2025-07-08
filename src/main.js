import { Start } from './scenes/Start.js';
import { UI } from './scenes/UI.js';
import { GameOver } from './scenes/GameOver.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1200,
    height: 1000,
    backgroundColor: '#000000',
    scene: [
        Start,
        UI,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config);
            