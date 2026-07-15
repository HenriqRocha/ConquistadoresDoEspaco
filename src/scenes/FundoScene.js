// src/scenes/FundoScene.js
export class FundoScene extends Phaser.Scene {
    constructor() {
        super('FundoScene');
    }

    preload() {
        // Carrega o fundo limpo
        this.load.image('fundoSemNada', 'assets/outros/fundoSemNada.png');
    }

    create() {
        // Pegar o tamanho da tela do jogo
        const centralX = 200; 
        const centralY = 0;

        // Adicionar a imagem e forçá-la a preencher a tela inteira
        this.add.image(centralX, centralY, 'fundoSemNada')
            .setOrigin(0)
            .setDisplaySize(1000, 1000); 

    }
}