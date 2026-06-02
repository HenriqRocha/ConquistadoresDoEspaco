// src/scenes/RegrasScene.js
export class RegrasScene extends Phaser.Scene {
    constructor() {
        super('RegrasScene');
    }

    preload() {
        this.load.image('telaMenu', 'assets/outros/telaRegras.png');
    }

    create() {
        // 1. Adicionar o fundo
        this.add.image(0, 0, 'telaMenu').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

        // 2. Criar o botão "Voltar" (seguindo o estilo do botão "Rolar Dado")
        const botaoVoltar = this.add.graphics();
        botaoVoltar.fillStyle(0x184085, 1); 
        botaoVoltar.fillRoundedRect(0, 0, 200, 50, 10);
        botaoVoltar.setInteractive(new Phaser.Geom.Rectangle(0, 0, 200, 50), Phaser.Geom.Rectangle.Contains);

        const textoVoltar = this.add.text(150, -15, "VOLTAR", {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        
        const containerVoltar = this.add.container(this.scale.width / 2 - 100, this.scale.height - 100 - 40, [botaoVoltar, textoVoltar]);
        containerVoltar.setDepth(-1); 

        // 3. Lógica do clique (Voltar ao Menu)
        botaoVoltar.on('pointerdown', () => {
            botaoVoltar.fillStyle(0x0E0E45, 1); 
        });

        botaoVoltar.on('pointerup', () => {
            botaoVoltar.fillStyle(0x184085, 1); 
            this.scene.start('MenuScene'); 
        });


        this.musica = this.sound.get('spaceConquerors');

        if (!this.musica) {
            this.musica = this.sound.add('spaceConquerors', { volume: 0.5, loop: true });
            this.musica.play();
        }

        this.iconAudio = this.add.image(240, 30, 'audioAberto').setScale(0.1).setInteractive();
        this.iconAudio.setInteractive({ cursor: 'pointer' });

        // Sincroniza o ícone do jogo com o estado atual da música vinda do menu
        if (this.musica.isPlaying) {
            this.iconAudio.setTexture('audioAberto');
        } else {
            this.iconAudio.setTexture('audioFechado');
        }

        // O mesmo botão agora controla perfeitamente a música global
        this.iconAudio.on('pointerdown', () => {
            if (this.musica.isPlaying) {
                this.musica.pause();
                this.iconAudio.setTexture('audioFechado');
            } else {
                this.musica.resume();
                this.iconAudio.setTexture('audioAberto');
            }
        });
    }
}