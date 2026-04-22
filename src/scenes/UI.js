//import Phaser from "phaser";

//import Phaser from "phaser";

//import Phaser from "phaser";

export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){
        /*this.load.image('verde', 'assets/legenda/verde.png');
        this.load.image('amarelo', 'assets/legenda/amarelo.png');
        this.load.image('vermelho', 'assets/legenda/vermelho.png');*/
        this.load.image('linhaR6', 'assets/legenda/linhaR6.png');
        this.load.image('linhaR5', 'assets/legenda/linhaR5.png');
        this.load.image('linhaR4', 'assets/legenda/linhaR4.png');
        this.load.image('linhaR3', 'assets/legenda/linhaR3.png');
        this.load.image('linhaR2', 'assets/legenda/linhaR2.png');
        this.load.image('linhaR1', 'assets/legenda/linhaR1.png');
        this.load.image('cubo', 'assets/outros/cubo.png');
        this.load.image('legenda', 'assets/legenda/legenda.png');
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

        this.scene.launch('FundoScene');
        this.scene.sendToBack('FundoScene');
        
        this.add.image(700, 500, 'cubo').setScale(0.2);
        this.add.image(1170, 500, 'linhaR1');
        this.add.image(1120, 260, 'linhaR2');
        this.add.image(945, 70, 'linhaR3');
        this.add.image(703, 20, 'linhaR4');
        this.add.image(440, 70, 'linhaR5');
        this.add.image(265, 260, 'linhaR6');
        this.add.image(220, 500, 'linhaR1').setAngle(180);
        this.add.image(280, 750, 'linhaR2').setAngle(180);
        this.add.image(460, 925, 'linhaR3').setAngle(180);
        this.add.image(690, 980, 'linhaR4').setAngle(180);
        this.add.image(950, 920, 'linhaR5').setAngle(180);
        this.add.image(1115, 745, 'linhaR6').setAngle(180);
         
        //this.cubo.setDepth(1);

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

    
        /* Comentado momentaneamente 
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
        this.add.image(180, 549, 'cartaVerso1').setScale(0.6).angle += 320;*/
    

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

        
       /* Legenda sprites
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
        this.add.image(260, 810, 'maisQuatro');*/
        this.add.image(100, 800, 'legenda').setScale(1.2);

        
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

        const centX = 700;
        const centY = 500;
        const radius = 150;

        const canvasTexture = this.textures.createCanvas('glow', radius * 2, radius * 2);
        const ctx = canvasTexture.context;

        const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(150, 0, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, radius * 2, radius * 2);

        canvasTexture.refresh();

        const centroGrow = this.add.image(centX, centY, 'glow');

        centroGrow.setBlendMode(Phaser.BlendModes.ADD);

        this.tweens.add({
            targets: centroGrow,
            alpha: 0.5,
            scale: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });


const canvasTexture2 = this.textures.createCanvas('bubbleTexture', 512, 512);
const ctx2 = canvasTexture.context;

ctx2.fillStyle = '#ffffff';
for (let i = 0; i < 800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 3 + 1; // Bolhas de tamanhos variados
    
    ctx2.beginPath();
    ctx2.arc(x, y, radius, 0, Math.PI * 2);
    ctx2.fill();
}

canvasTexture2.refresh();

const ringRadii = [147.27, 294.54, 441.81];
ringRadii.forEach(radius => {
    const redRing = this.add.graphics({ x: 700, y: 500 });
    redRing.lineStyle(25, 0xff0000, 1);
    redRing.strokeCircle(0, 0, radius);

    
    const maskImage = this.add.tileSprite(700, 500, radius * 2.5, radius * 2.5, 'bubbleTexture')
        .setVisible(false);

    redRing.setMask(new Phaser.Display.Masks.BitmapMask(this, maskImage));
});

    // Criando o efeito das partículas
    this.add.particles(0, 0, 'glow', {
        lifespan: 2000,
        speed: { min: 20, max: 30 },
        scale: { start: 0.2, end: 0 },
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitZone: {
            type: 'edge',
            source: new Phaser.Geom.Circle(700, 500, 147.27), 
            quantity: 200
            //stepRate: 0.5
        }
    });

    this.add.particles(0, 0, 'glow', {
        lifespan: 2000,
        speed: { min: 10, max: 20 },
        scale: { start: 0.2, end: 0 },
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitZone: {
            type: 'edge',
            source: new Phaser.Geom.Circle(700, 500, 294.54), 
            quantity: 200
        },
    });

    this.add.particles(0, 0, 'glow', {
        lifespan: 2000,
        speed: { min: 20, max: 30 },
        scale: { start: 0.2, end: 0 },
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        emitZone: {
            type: 'edge',
            source: new Phaser.Geom.Circle(700, 500, 441.81), 
            quantity: 200
        },
        
    });
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
            padding: { x: 30, y: 20 },
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