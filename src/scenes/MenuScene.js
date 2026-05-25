// src/scenes/MenuScene.js
export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuCompleto', 'assets/outros/telaMenu.png');
    }

    create() {
        // 1. Adicionar o fundo (opaco, sem transparência entre cenas)
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'menuCompleto');

        // Opcional: Adicionar o dado central como decoração
        // this.add.image(this.scale.width / 2, 350, 'cubo').setScale(0.2);

        // 3. Criar os botões (Inicar Jogo e Regras)

        // Botão "Iniciar Jogo"
        const botaoIniciar = this.add.graphics();
        botaoIniciar.fillStyle(0x184085, 1);
        botaoIniciar.fillRoundedRect(0, 0, 300, 60, 15);
        botaoIniciar.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 60), Phaser.Geom.Rectangle.Contains);

        // Apagar depois. Não vamos precisar mais dele.
        const textoIniciar = this.add.text(150, 30, "INICIAR JOGO", {
            fontSize: '28px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const containerIniciar = this.add.container(this.scale.width / 2 - 150, 700, [botaoIniciar, textoIniciar]);
        containerIniciar.setDepth(-1);

        // Botão "Regras"
        const botaoRegras = this.add.graphics();
        botaoRegras.fillStyle(0x184085, 1);
        botaoRegras.fillRoundedRect(0, 0, 300, 60, 15);
        botaoRegras.setInteractive(new Phaser.Geom.Rectangle(0, 0, 300, 60), Phaser.Geom.Rectangle.Contains);

        const textoRegrasText = this.add.text(150, 30, "REGRAS", {
            fontSize: '28px',
            fill: '#ffffff',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const containerRegras = this.add.container(this.scale.width / 2 - 150, 820, [botaoRegras, textoRegrasText]);
        containerRegras.setDepth(-1);

        // 4. Lógica do clique (Iniciar Jogo)
        botaoIniciar.on('pointerdown', () => { botaoIniciar.fillStyle(0x0E0E45, 1); });
        botaoIniciar.on('pointerup', () => {
            botaoIniciar.fillStyle(0x184085, 1);
            this.scene.start('Start'); 
        });

        // 5. Lógica do clique (Regras)
        botaoRegras.on('pointerdown', () => { botaoRegras.fillStyle(0x0E0E45, 1); });
        botaoRegras.on('pointerup', () => {
            botaoRegras.fillStyle(0x184085, 1);
            this.scene.start('RegrasScene'); 
        });
    }
}