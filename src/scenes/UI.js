export class UI extends Phaser.Scene {
    constructor(){
        super({ key: 'UI', active: false});//cena começa inativa
    }

    preload(){
       
        this.load.image('linhaR6', 'assets/legenda/linhaR6.png');
        this.load.image('linhaR5', 'assets/legenda/linhaR5.png');
        this.load.image('linhaR4', 'assets/legenda/linhaR4.png');
        this.load.image('linhaR3', 'assets/legenda/linhaR3.png');
        this.load.image('linhaR2', 'assets/legenda/linhaR2.png');
        this.load.image('linhaR1', 'assets/legenda/linhaR1.png');
        this.load.image('legenda', 'assets/legenda/legenda.png');
        this.load.image('terra', 'assets/legenda/terra.png');
        this.load.image('naveET', 'assets/legenda/naveET.png');
        this.load.image('pontos', 'assets/legenda/pontos.png');
        this.load.image('maisUm', 'assets/legenda/maisUm.png');
        this.load.image('maisDois', 'assets/legenda/maisDois.png');
        this.load.image('maisTres', 'assets/legenda/maisTres.png');
        this.load.image('maisQuatro', 'assets/legenda/maisQuatro.png');
        this.load.image('cartaVerso1', 'assets/cartas/cartaVerso.png');
        this.load.image('btnReiniciar', 'assets/outros/reiniciar.png');
        this.load.image('btnHome', 'assets/outros/voltarMenu.png');
    }

    create() {
        //pega a cena do start para 'ouvir' os eventos
        const gameScene = this.scene.get('Start');

        this.scene.launch('FundoScene');
        this.scene.sendToBack('FundoScene');
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
         
        this.cameras.main.setBackgroundColor('rgba(0,0,0,0)'); // Mantém a transparência geral.

        // Lança e envia para trás a FundoScene
        if (!this.scene.isActive('FundoScene')) {
            this.scene.launch('FundoScene');
        }
        this.scene.sendToBack('FundoScene');

        const corPainel = 0x101151;

        //painel lateral
        const larguraPainel = 200;
        const padding = 25;
        let atualY = 25;//para empilhar os elementos

        const painelLateralFundo = this.add.graphics();
        painelLateralFundo.fillStyle(corPainel, 1); // Opacidade total (1).
        
        painelLateralFundo.fillRect(0, 0, larguraPainel, this.scale.height);

        painelLateralFundo.setDepth(-1);

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
        atualY += 100; 

        const DADO_SIZE = 110;
        this.graficoDado = this.add.graphics()
            .setPosition(larguraPainel / 2, atualY)
            .setDepth(1);

        this.desenharFaceDado = (valor) => {
            const g = this.graficoDado;
            g.clear();
            const half = DADO_SIZE / 2;
            const dotR = 7;
            const margin = DADO_SIZE * 0.28;
            const pontos = {
                1: [[0, 0]],
                2: [[-1, -1], [1, 1]],
                3: [[-1, -1], [0, 0], [1, 1]],
                4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
                5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
                6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
            };
            g.fillStyle(0xffffff, 1);
            g.fillRoundedRect(-half, -half, DADO_SIZE, DADO_SIZE, 16);
            g.lineStyle(3, 0x444444, 1);
            g.strokeRoundedRect(-half, -half, DADO_SIZE, DADO_SIZE, 16);
            g.fillStyle(0x222222, 1);
            pontos[valor].forEach(([dx, dy]) => {
                g.fillCircle(dx * margin, dy * margin, dotR);
            });
        };

        this.desenharFaceDado(1);
        atualY += 100;

        //criando botão na tela
        this.botaoDado = this.add.text(larguraPainel / 2, atualY, 'Rolar Dado',{
            fontSize: '18px',
            fill:'#ffffff',
            backgroundColor: 'transparent',
            padding: {x: 10, y: 5}
        }).setOrigin(0.5).setInteractive();
        atualY += 60;

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

        this.add.image(60, 855, 'cartaVerso1').setScale(0.6).angle += 80;
        this.add.image(70, 857, 'cartaVerso1').setScale(0.6).angle += 85;
        this.add.image(80, 859, 'cartaVerso1').setScale(0.6).angle += 90;
        this.add.image(90, 861, 'cartaVerso1').setScale(0.6).angle += 95; 
        this.add.image(100, 863, 'cartaVerso1').setScale(0.6).angle += 100;
        this.add.image(110, 865, 'cartaVerso1').setScale(0.6).angle += 105;
        this.add.image(120, 867, 'cartaVerso1').setScale(0.6).angle += 110;

        this.add.image(larguraPainel + 90, this.cameras.main.height, 'legenda')
            .setScale(1)
            .setOrigin(0.5, 1);
    

        //lê o clique do mouse e avisa o start para a fc rolar dado
        this.botaoDado.on('pointerdown', () => {
            this.events.emit('rolarDado');
        });

        gameScene.events.on('animarDado', (valorFinal) => {
            this.botaoDado.disableInteractive().setAlpha(0.5);

            let frameAtual = 1;
            const timer = this.time.addEvent({
                delay: 66,
                repeat: 11,
                callback: () => {
                    frameAtual = (frameAtual % 6) + 1;
                    this.desenharFaceDado(frameAtual);
                }
            });

            this.time.delayedCall(800, () => {
                timer.remove();
                this.desenharFaceDado(valorFinal);
                this.tweens.add({
                    targets: this.graficoDado,
                    scaleX: 1.15,
                    scaleY: 1.15,
                    duration: 100,
                    yoyo: true
                });
                this.botaoDado.setInteractive().setAlpha(1);
            });
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

        const centX = 700;
        const centY = 500;
        const radius = 150;

        if (this.textures.exists('glow')) {
            this.textures.remove('glow');
        }

        const canvasTexture = this.textures.createCanvas(
            'glow',
            radius * 2,
            radius * 2
        );

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


if (this.textures.exists('bubbleTexture')) {
    this.textures.remove('bubbleTexture');
}

const canvasTexture2 = this.textures.createCanvas('bubbleTexture', 512, 512);

const ctx2 = canvasTexture2.context;

ctx2.fillStyle = '#ffffff';

for (let i = 0; i < 800; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const radius = Math.random() * 3 + 1;

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

const barraLateralX = 100; 

// 1. ÍCONE REINICIAR O JOGO
const iconeReiniciar = this.add.image(1140, 30, 'btnReiniciar')
    .setScale(0.1) // Ajuste a escala para caber na sua barra lateral
    .setInteractive({ cursor: 'pointer' });

iconeReiniciar.on('pointerdown', () => {
   
    const gameScene = this.scene.get('Start');

    gameScene.events.emit('reiniciarPartida');
});


// 2. ÍCONE VOLTAR PARA O MENU PRINCIPAL (HOME)
const iconeMenu = this.add.image(1060, 30, 'btnHome')
    .setScale(0.1) // Ajuste a escala para o mesmo tamanho do outro ícone
    .setInteractive({ cursor: 'pointer' });

iconeMenu.on('pointerdown', () => {
    this.scene.stop('UI');
    this.scene.stop('Start');
    this.scene.stop('FundoScene');
    
    // Pequena segurança: remove da fila ativa qualquer resquício visual
    this.scene.get('Start').scene.setVisible(false);
    this.scene.get('UI').scene.setVisible(false);
    this.scene.get('FundoScene').scene.setVisible(false);
    
    const menu = this.scene.get('MenuScene');
    menu.scene.restart();
});


iconeReiniciar.on('pointerover', () => iconeReiniciar.setTint(0xffaaaa)); // Deixa levemente avermelhado
iconeReiniciar.on('pointerout', () => iconeReiniciar.clearTint());

iconeMenu.on('pointerover', () => iconeMenu.setTint(0xccddee)); // Deixa levemente azulado
iconeMenu.on('pointerout', () => iconeMenu.clearTint());
}

    //animação carta
    ativarEfeitoCarta(nomeDaCarta, gameScene) {
        if (this.cartaEmExibicao) return;

        const centroX = this.cameras.main.width / 2;
        const centroY = this.cameras.main.height / 2;

        this.overlay.setVisible(true);
        
        // Desativa interações para evitar bugs durante a animação
        this.botaoDado.disableInteractive().setAlpha(0.5);

        const carta = this.add.sprite(50, this.cameras.main.height + 100, nomeDaCarta)
            .setScale(0.5)
            .setAlpha(0)
            .setDepth(100);

        const botaoOk = this.add.text(50, this.cameras.main.height + 500, 'ENTENDIDO', {
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
            
            // Alinha horizontalmente: a carta vai para o centro exato, o botão também
            x: centroX,
            
            // Condicional para o eixo Y: coloca a carta no meio e o botão logo abaixo dela
            y: (target) => target === carta ? centroY - 80 : centroY + 360, 
            
            alpha: 1, // Ambos ficam visíveis
            
            scale: (target) => target === carta ? 1 : 1,
            
            duration: 700,
            ease: 'Back.easeOut',
            onComplete: () => {
                botaoOk.setInteractive().on('pointerdown', () => {
                    this.fecharCarta(gameScene);
                });
    }
});
    }

    fecharCarta(gameScene) {
    this.tweens.add({
        targets: [this.cartaEmExibicao, this.botaoOkEmExibicao],
        
        x: (target) => target === this.cartaEmExibicao ? 70 : 70,
        
        y: (target) => target === this.cartaEmExibicao ? this.cameras.main.height - 100 : this.cameras.main.height + 100,
        
        alpha: 0,
        
        // Reduz a escala da carta para voltar a ser pequenininha (0.1) no bolo
        scale: (target) => target === this.cartaEmExibicao ? 0.1 : target.scale,
        
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
            this.overlay.setVisible(false);
            this.botaoDado.setInteractive().setAlpha(1);
            
            if (this.cartaEmExibicao) { this.cartaEmExibicao.destroy(); }
            if (this.botaoOkEmExibicao) { this.botaoOkEmExibicao.destroy(); }
            
            this.cartaEmExibicao = null;
            this.botaoOkEmExibicao = null;
            
            gameScene.events.emit('cartaFechada');
        }
    });
}
    
}