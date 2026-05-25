import { Start } from './scenes/Start.js';
import { UI } from './scenes/UI.js';
import { GameOver } from './scenes/GameOver.js';
import { FundoScene } from './scenes/FundoScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { RegrasScene } from './scenes/RegrasScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1200,
    height: 1000,
    backgroundColor: '#0E0E45',
    scene: [
        MenuScene,
        Start,
        RegrasScene,
        UI,
        GameOver,
        FundoScene
    ],
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

const game = new Phaser.Game(config);
            