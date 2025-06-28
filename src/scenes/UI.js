export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){}

    create() {
        //pega a cena do start para 'ouvir' os eventos
        const gameScene = this.scene.get('Start');

        //botões e textos para o usuário
        this.textoMovimento = this.add.text(10,950, 'Movimentos: 0',
        {fontSize: '24px',
        fill: '#ffffff'});

        this.textoPontuacao = this.add.text(600, 950, 'Pontuação: 0',
        {fontSize: '24px',
        fill: '#ffffff'});

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
        gameScene.events.on('updateUI', (movimentos, pontuacao) =>{
            this.textoMovimento.setText('Movimentos: ' + movimentos);
            this.textoPontuacao.setText('Pontuação: ' + pontuacao);
        })
    }
}