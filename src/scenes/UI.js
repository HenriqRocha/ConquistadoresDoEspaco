//import Phaser from "phaser";

//import Phaser from "phaser";

export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){
        this.load.image('verde', 'assets/legenda/verde.png');
        this.load.image('amarelo', 'assets/legenda/amarelo.png');
        this.load.image('vermelho', 'assets/legenda/vermelho.png');
        this.load.image('terra', 'assets/legenda/terra.png');
        this.load.image('naveET', 'assets/legenda/naveET.png');
        this.load.image('pontos', 'assets/legenda/pontos.png');
        this.load.image('maisUm', 'assets/legenda/maisUm.png');
        this.load.image('maisDois', 'assets/legenda/maisDois.png');
        this.load.image('maisTres', 'assets/legenda/maisTres.png');
        this.load.image('maisQuatro', 'assets/legenda/maisQuatro.png');
        this.load.image('cartaVerso1', 'assets/cartas/cartaVerso.png');
        this.load.spritesheet('dado', 'assets/dado/dadoSemFundo.png', { 
            frameWidth: 200, 
            frameHeight: 200 
        });
    }

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
            backgroundColor: 'transparent',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setInteractive();
        atualY += 100;

        const paddingX = 20;
        const paddingY = 10;

        const bounds = this.botaoDado.getBounds();

        const fundo = this.add.graphics();

        fundo.fillStyle(0x1e2a78, 1);
        fundo.fillRoundedRect(
            bounds.x - paddingX,
            bounds.y - paddingY,
            bounds.width + paddingX * 2,
            bounds.height + paddingY * 2,
            12
        );

        fundo.lineStyle(2, 0x00ffff, 1);
        fundo.strokeRoundedRect(
            bounds.x - paddingX, 
            bounds.y - paddingY, 
            bounds.width + paddingX * 2,
            bounds.height + paddingY * 2,
            12
        )

        this.botaoDado.setDepth(1);
        fundo.setDepth(0);

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

    
        this.add.image(60, 525, 'cartaVerso1').setScale(0.6).angle += 80;
        this.add.image(70, 527, 'cartaVerso1').setScale(0.6).angle += 85;
        this.add.image(80, 529, 'cartaVerso1').setScale(0.6).angle += 90;
        this.add.image(90, 531, 'cartaVerso1').setScale(0.6).angle += 95; 
        this.add.image(100, 533, 'cartaVerso1').setScale(0.6).angle += 100;
        this.add.image(110, 535, 'cartaVerso1').setScale(0.6).angle += 105;
        this.add.image(120, 537, 'cartaVerso1').setScale(0.6).angle += 110;
        this.add.image(130, 539, 'cartaVerso1').setScale(0.6).angle += 115;
        this.add.image(140, 541, 'cartaVerso1').setScale(0.6).angle += 120;
        this.add.image(150, 543, 'cartaVerso1').setScale(0.6).angle += 125;
        this.add.image(160, 545, 'cartaVerso1').setScale(0.6).angle += 130;
        this.add.image(170, 547, 'cartaVerso1').setScale(0.6).angle += 135;
        this.add.image(180, 549, 'cartaVerso1').setScale(0.6).angle += 320;
    

        //lê o clique do mouse e avisa o start para a fc rolar dado
        this.botaoDado.on('pointerdown', () => {
            this.events.emit('rolarDado');
        });

        this.anims.create({
            key: 'girar_dado',
            // O Phaser vai do frame 0 ao 5 (os 6 dados da imagem)
            frames: this.anims.generateFrameNumbers('dado', { start: 0, end: 5 }),
            frameRate: 15, // Velocidade da animação
            repeat: -1     // Repete até mandarmos parar
        });

        //const dadoSprite = this.add.sprite(400, 300, 'dado', 0).setScale(2);

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

        
       // Legenda sprites
        this.add.image(145, 650, 'pontos');
        this.add.image(60, 730, 'verde');
        this.add.image(120, 730, 'maisUm');
        this.add.image(60, 810, 'amarelo');
        this.add.image(120, 810, 'maisDois');
        this.add.image(60, 890, 'vermelho');
        this.add.image(120, 890, 'maisTres');
        this.add.image(200, 730, 'terra');
        this.add.image(260, 730, 'maisQuatro');
        this.add.image(200, 810, 'naveET');
        this.add.image(260, 810, 'maisQuatro');
        

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

        /* Teste dado - apagar depois - this.anims.create({
            key: 'girar_dado',
            frames: this.anims.generateFrameNumbers('dado', {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.spriteDado = this.add.sprite(100, 150, 'dado').setInteractive();*/
    }

    //animação carta
    ativarEfeitoCarta(nomeDaCarta, gameScene) {
        debugger; // Para fins de depuração. Apagar depois. 
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