export class GameOver extends Phaser.Scene {

    constructor() {
        super('GameOver');
    }

    init(data){
        this.vencedorIndex = data.vencedor;
        this.pontuacaoFinal = data.pontuacao;
    }

    create() {
        const { width, height } = this.scale;

        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        let tituloTxt = 'FIM DE JOGO';
        let pontuacaoTxt = '';

        if(this.vencedorIndex > -1){
            tituloTxt = `JOGADOR ${this.vencedorIndex + 1} VENCEU`;
            pontuacaoTxt = `Pontuação final: ${this.pontuacaoFinal}`;
        }else { tituloTxt = 'EMPATE';}

        this.add.text(width / 2, height / 2 - 100, tituloTxt, {
            fontSize:'64px', fill: '#00ff00', fontStyle: 'bold'
        }).setOrigin(0.5);

        if (pontuacaoTxt){
            this.add.text(width / 2, height / 2, pontuacaoTxt, {
                fontSize: '32px', fill: '#ffffff'
            }).setOrigin(0.5);
        }

        //botao reiniciar
        const botaoRecomecar = this.add.text(width / 2, height / 2 + 100, 'Jogar Novamente', {
            fontSize: '40px',
            fill: '#ffffff',
            backgroundColor: '#222222',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        //lógica do botão de reincio
        botaoRecomecar.on('pointerdown', () => {
            this.scene.stop('UI');
            this.scene.start('Start');
        });

        //efeito botão
        botaoRecomecar.on('pointerover', () => {
            botaoRecomecar.setBackgroundColor('#444444');
        });
        botaoRecomecar.on('pointerout', () => {
            botaoRecomecar.setBackgroundColor('#222222');
        });
    }
}
