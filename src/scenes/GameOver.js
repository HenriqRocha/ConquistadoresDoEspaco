export class GameOver extends Phaser.Scene {

    constructor() {
        super('GameOver');
    }

    create() {
        const { width, height } = this.scale;

        // Adiciona um fundo escuro para focar a atenção
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        // Mensagem de Fim de Jogo
        this.add.text(width / 2, height / 2 - 100, 'FIM DE JOGO', {
            fontSize: '64px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Botão para jogar novamente
        const botaoRecomecar = this.add.text(width / 2, height / 2 + 100, 'Jogar Novamente', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#222222',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        // Lógica do botão
        botaoRecomecar.on('pointerdown', () => {
            // Reinicia a cena do jogo. O Phaser irá limpar tudo e começar do zero.
            this.scene.start('Start');
        });

        // Efeito visual para o botão
        botaoRecomecar.on('pointerover', () => {
            botaoRecomecar.setBackgroundColor('#444444');
        });
        botaoRecomecar.on('pointerout', () => {
            botaoRecomecar.setBackgroundColor('#222222');
        });
    }
}
