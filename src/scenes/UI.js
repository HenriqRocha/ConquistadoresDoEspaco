export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){}

    create() {
        //pega a cena do start para 'ouvir' os eventos
        const gameScene = this.scene.get('Start');

        //painel lateral
        const larguraPainel = 200;
        const padding = 25;
        let atualY = 25;//para empilhar os elementos

        //separação
        this.add.graphics()
            .lineStyle(2, 0xffffff, 0.5)
            .lineBetween(larguraPainel, 0, larguraPainel, this.cameras.main.height);

        //botões e textos para o usuário
        this.textoJogadorAtual = this.add.text(padding, atualY, 'Aguardando...', {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        atualY += 120;

        this.textoMovimento = this.add.text(padding, atualY, 'Movimentos: 0',
        {fontSize: '18px',
        fill: '#ffffff',
        fontStyle: 'bold'});
        atualY += 80;

        //criando botão na tela
        this.botaoDado = this.add.text(larguraPainel / 2, atualY, 'Rolar Dado',{
            fontSize: '18px',
            fill:'#ffffff',
            backgroundColor: '#222222',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setInteractive();
        atualY += 100;

        //título pontuação
        this.add.text(padding, atualY, 'Pontuações', {fontSize: '20px', fill: '#ffffff', fontStyle: 'bold'});
        atualY += 70;

        this.textosPontuacao = [];
        for (let i = 0; i < gameScene.numeroDeJogadores; i++){
            this.add.image(padding, atualY, `nave00${i + 1}`).setScale(0.25);
            const texto = this.add.text(padding + 20, atualY, ': 0',{
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold'
            });
            this.textosPontuacao.push(texto);
            atualY += 80;
        }


        //lê o clique do mouse e avisa o start para a fc rolar dado
        this.botaoDado.on('pointerdown', () => {
            this.events.emit('rolarDado');
        });

        //lê o clique no espaço e avisa o start para a fc rolar dado
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', ()=>{
            this.events.emit('rolarDado')
        });

        this.overlay = this.add.rectangle(
        this.cameras.main.centerX, 
        this.cameras.main.centerY, 
        this.cameras.main.width, 
        this.cameras.main.height, 
        0x000000, 0.7).setVisible(false).setDepth(90);   

        //comunicação cenas
        gameScene.events.on('updateTurno', (jogadorIndex, pontuacoes, movimentos) =>{

            this.textoJogadorAtual.setText(`Jogador atual`);
            this.imagemJogadorAtual = this.add.image(100, 85, `nave00${jogadorIndex + 1}`).setScale(0.25);
            this.textoMovimento.setText('Movimentos: ' + movimentos);

            for (let i = 0; i < pontuacoes.length; i++) {
                if (this.textosPontuacao[i]){
                    this.textosPontuacao[i].setText(`: ${pontuacoes[i]}`);
                }
            }
        });
        this.events.emit('uiPronta');

        gameScene.events.on('exibirCarta', (dadosCarta)=>{
            this.ativarEfeitoCarta(dadosCarta.imagem, gameScene);
        })
    }

    //animação carta
    ativarEfeitoCarta(nomeDaCarta, gameScene) {
        if (this.cartaEmExibicao) return;

        const centroX = this.cameras.main.width / 2;
        const centroY = this.cameras.main.height / 2;

        this.overlay.setVisible(true);
        
        // Desativa interações para evitar bugs durante a animação
        this.botaoDado.disableInteractive().setAlpha(0.5);

        const carta = this.add.sprite(centroX, this.cameras.main.height + 300, nomeDaCarta)
            .setScale(0.5)
            .setAlpha(0)
            .setDepth(100);

        const botaoOk = this.add.text(centroX, this.cameras.main.height + 500, 'ENTENDIDO', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#00d1b2',
            padding: { x: 20, y: 10 },
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);

        this.cartaEmExibicao = carta;
        this.botaoOkEmExibicao = botaoOk;

        this.tweens.add({
            targets: [carta, botaoOk],
            y: (target) => target === carta ? centroY - 40 : centroY + 420,
            alpha: 1,
            scale: (target) => target === carta ? 1 : 1,
            duration: 700,
            ease: 'Back.easeOut',
            onComplete: () => {
                botaoOk.setInteractive().on('pointerdown',()=>{
                    this.fecharCarta(gameScene);
                });
            }
        });
    }

    fecharCarta(gameScene){
        this.tweens.add({
            targets: [this.cartaEmExibicao, this.botaoOkEmExibicao],
            y: this.cameras.main.height + 500,
            alpha: 0,
            duration: 700,
            ease: 'Power2',
            onComplete: ()=>{
                this.overlay.setVisible(false);
                this.botaoDado.setInteractive().setAlpha(1);
                
                if (this.cartaEmExibicao){this.cartaEmExibicao.destroy();}
                if (this.botaoOkExibicao){this.botaoOkExibicao.destroy();}
                
                this.cartaEmExibicao = null;
                this.botaoOkExibicao = null;

                gameScene.events.emit('cartaFechada');
            }
        });
    }
}