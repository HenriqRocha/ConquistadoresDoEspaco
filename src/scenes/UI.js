export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){}

    create() {
        //pega a cena do start para 'ouvir' os eventos
        const gameScene = this.scene.get('Start');

        //botões e textos para o usuário
        this.textoJogadorAtual = this.add.text(10, 920, 'Aguardando...', {
            fontSize: '28px', fill: '#ffffff'
        });

        this.textoMovimento = this.add.text(10,950, 'Movimentos: 0',
        {fontSize: '24px',
        fill: '#ffffff'});

        this.textosPontuacao = [];
        for (let i = 0; i < gameScene.numeroDeJogadores; i++){
            const texto = this.add.text(600 + (i * 250), 950, `Jogador ${i + 1}: 0`,{
                fontSize: '24px', fill: 'ffffff'
            });
            this.textosPontuacao.push(texto);
        }

        //criando botão na tela
        this.botaoDado = this.add.text(900, 950, 'Rolar Dado',{
            fontSize: '24px',
            fill:'#ffffff',
            backgroundColor: '#222222',
            padding: {x: 10, y: 5}
        }).setInteractive();

        //lê o clique do mouse e avisa o start para a fc rolar dado
        this.botaoDado.on('pointerdown', () => {
            this.events.emit('rolarDado');
        });

        //lê o clique no espaço e avisa o start para a fc rolar dado
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', ()=>{
            this.events.emit('rolarDado')
        });

        //comunicação cenas
        gameScene.events.on('updateTurno', (jogadorIndex, pontuacoes, movimentos) =>{
            this.textoJogadorAtual.setText(`Vez do jogador ${jogadorIndex + 1}`);
            this.textoMovimento.setText('Movimentos: ' + movimentos);

            for (let i = 0; i < pontuacoes.length; i++) {
                if (this.textosPontuacao[i]){
                    this.textosPontuacao[i].setText(`Jogador ${i + 1}: ${pontuacoes[i]}`);
                }
            }
        });
        this.events.emit('uiPronta');
    }
}