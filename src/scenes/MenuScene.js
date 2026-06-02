// src/scenes/MenuScene.js
export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.audio('spaceConquerors', 'assets/musica/spaceConquerors.mp3');
        this.load.image('menuCompleto', 'assets/outros/telaMenu2.png');
        this.load.image('audioAberto', 'assets/musica/audioAberto.png');
        this.load.image('audioFechado', 'assets/musica/audioFechado.png');
    }

    create() {
        // 1. Adicionar o fundo (opaco, sem transparência entre cenas)
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'menuCompleto');

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

        // Dentro do create() de MenuScene.js

// 1. Tenta pegar a música se ela já tiver sido criada globalmente
this.musica = this.sound.get('spaceConquerors');

// 2. Se ela não existir ainda (primeira vez que abre o menu), nós a criamos
if (!this.musica) {
    this.musica = this.sound.add('spaceConquerors', { volume: 0.5 });
    
    // Configura para repetir quando terminar (substituindo o evento 'complete')
    this.musica.setLoop(true); 
    this.musica.play();
}

// 3. Configuração do seu ícone de áudio (Mute/Unmute) no Menu
this.iconAudio = this.add.image(240, 30, 'audioAberto').setScale(0.1).setInteractive();
this.iconAudio.setInteractive({ cursor: 'pointer' });

// Ajusta o ícone visual inicial caso o jogador volte para o menu com o som pausado
if (this.musica.isPlaying) {
    this.iconAudio.setTexture('audioAberto');
} else {
    this.iconAudio.setTexture('audioClosed'); // certifique-se de que a textura correta é usada
}

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