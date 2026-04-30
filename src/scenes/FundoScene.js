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
        const width = this.scale.width;
        const height = this.scale.height;

        // Adicionar a imagem e forçá-la a preencher a tela inteira
        this.add.image(0, 0, 'fundoSemNada')
            .setOrigin(0)
            .setDisplaySize(width, height); 

    }
}