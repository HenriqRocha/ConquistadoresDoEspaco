// src/scenes/RegrasScene.js
export class RegrasScene extends Phaser.Scene {
    constructor() {
        super('RegrasScene');
    }

    preload() {
        this.load.image('telaMenu', 'assets/outros/telaMenu.png');
    }

    create() {
        // 1. Adicionar o fundo
        this.add.image(0, 0, 'telaMenu').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

        // 2. Adicionar o título e o texto das regras
        this.add.text(this.scale.width / 2, 100, "REGRAS DO JOGO", {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'space-font' 
        }).setOrigin(0.5);

        const textoRegras = "Conquiste o espaço! \n" +
                            "Rola o dado e mova sua nave pelas órbitas. \n" +
                            "Colete planetas e evite buracos negros. \n" +
                            "O jogador com mais pontos vence!";

        this.add.text(this.scale.width / 2, 300, textoRegras, {
            fontSize: '24px',
            fill: '#cccccc',
            align: 'center',
            wordWrap: { width: this.scale.width - 200 }
        }).setOrigin(0.5);

        // 3. Criar o botão "Voltar" (seguindo o estilo do botão "Rolar Dado")
        const botaoVoltar = this.add.graphics();
        botaoVoltar.fillStyle(0x184085, 1); 
        botaoVoltar.fillRoundedRect(0, 0, 200, 50, 10);
        botaoVoltar.setInteractive(new Phaser.Geom.Rectangle(0, 0, 200, 50), Phaser.Geom.Rectangle.Contains);

        const textoVoltar = this.add.text(100, 25, "VOLTAR", {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        
        const containerVoltar = this.add.container(this.scale.width / 2 - 100, this.scale.height - 100, [botaoVoltar, textoVoltar]);
        containerVoltar.setDepth(10); 

        // 4. Lógica do clique (Voltar ao Menu)
        botaoVoltar.on('pointerdown', () => {
            botaoVoltar.fillStyle(0x0E0E45, 1); 
        });

        botaoVoltar.on('pointerup', () => {
            botaoVoltar.fillStyle(0x184085, 1); 
            this.scene.start('MenuScene'); 
        });
    }
}