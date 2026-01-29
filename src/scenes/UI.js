export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){}

    create() {
        //pega a cena do start para 'ouvir' os eventos
        const gameScene = this.scene.get('Start');

        //painel lateral
        const larguraPainel = 300;
        const padding = 20;
        let atualY = 50;//para empilhar os elementos

        //separação
        this.add.graphics()
            .lineStyle(2, 0xffffff, 0.5)
            .lineBetween(larguraPainel, 0, larguraPainel, this.cameras.main.height);

        //botões e textos para o usuário
        this.textoJogadorAtual = this.add.text(padding, atualY, 'Aguardando...', {
            fontSize: '28px', fill: '#ffffff'
        });
        atualY += 40;

        this.textoMovimento = this.add.text(padding,atualY, 'Movimentos: 0',
        {fontSize: '24px',
        fill: '#ffffff'});
        atualY += 80;

        //criando botão na tela
        this.botaoDado = this.add.text(larguraPainel / 2, atualY, 'Rolar Dado',{
            fontSize: '24px',
            fill:'#ffffff',
            backgroundColor: '#222222',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setInteractive();
        atualY += 100;

        //título pontuação
        this.add.text(padding, atualY, 'Pontuações', {fontSize: '26px', fill: '#ffffff'});
        atualY += 40;

        this.textosPontuacao = [];
        for (let i = 0; i < gameScene.numeroDeJogadores; i++){
            const texto = this.add.text(padding, atualY, `Jogador ${i + 1}: 0`,{
                fontSize: '24px', fill: '#ffffff'
            });
            this.textosPontuacao.push(texto);
            atualY += 35;
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
            this.textoJogadorAtual.setText(`Vez do jogador ${jogadorIndex + 1}`);
            this.textoMovimento.setText('Movimentos: ' + movimentos);

            for (let i = 0; i < pontuacoes.length; i++) {
                if (this.textosPontuacao[i]){
                    this.textosPontuacao[i].setText(`Jogador ${i + 1}: ${pontuacoes[i]}`);
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