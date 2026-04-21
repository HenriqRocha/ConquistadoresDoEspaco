import { Player } from './Player.js';
import { Tabuleiro } from './Tabuleiro.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {

        this.load.image('terra', 'assets/legenda/terra.png');
        this.load.image('naveET', 'assets/legenda/naveET.png');

        this.load.image('planeta-verde', 'assets/planetas/verde.png')
        this.load.image('planeta-amarelo', 'assets/planetas/amarelo.png')
        this.load.image('planeta-vermelho', 'assets/planetas/vermelho.png')
        this.load.image('cubo', 'assets/outros/cubo.png');

        this.load.path = '';

        for (let i = 1; i <= 5; i++) {
            this.load.image(`nave00${i}`, `assets/naves/nave00${i}.png`);
        }

        this.load.image('buracoNegro', `assets/buracoNegro/buracoNegro.png`);

        this.load.spritesheet('dado_spritesheet', 'assets/dado/dadoSemFundo.png', { 
        frameWidth: 296,
        frameHeight: 304,
        spacing: 1 
        });

        this.load.path = 'assets/cartas/';

        const nomesCartas = [
            'campoAtrator', 'giroAnti-horario120', 'giroAnti-horario150', 'giroAnti-horario180',
            'giroAnti-horario30', 'giroAnti-horario60', 'giroAnti-horario90', 'giroHorario120',
            'giroHorario150', 'giroHorario180', 'giroHorario30', 'giroHorario60', 'giroHorario90',
            'leveTurbulencia', 'reflexaoNaRetaR1', 'reflexaoNaRetaR4'
        ]

        nomesCartas.forEach(nome => {
            this.load.image(nome, `${nome}.png`);
        });

        this.load.path = '';

    }

    create() {
        this.tabuleiro = new Tabuleiro(this);
        this.tabuleiro.iniciaTabuleiro();
        const cx = this.tabuleiro.centroX;
        const cy = this.tabuleiro.centroY;


        // Camada 1: Brilho externo de "calor" (mais largo e muito suave)
    const brilhoExterno = this.add.circle(cx, cy, 110, 0xff3300, 0.1)
        .setDepth(0.4);

    // Camada 2: O anel avermelhado principal
    const anelPrincipal = this.add.circle(cx, cy, 85, 0xff0000, 0.2)
        .setDepth(0.5);

    // Camada 3: Efeito de "textura" pontilhada (simulando os detalhes da foto)
    // Criamos um gráfico para desenhar um círculo tracejado
    const detalhesTextura = this.add.graphics();
    // CORREÇÃO: Definimos a posição do objeto no centro do tabuleiro.
    // No Phaser, a rotação de um objeto Graphics ocorre em torno do seu (x, y).
    detalhesTextura.setPosition(cx, cy); 
    detalhesTextura.lineStyle(4, 0xffcc00, 0.3);
    
    // Desenha pequenos traços ao redor do ponto (0,0) relativo do objeto
    for (let i = 0; i < 360; i += 15) {
        const angulo = Phaser.Math.DegToRad(i);
        // As coordenadas agora são relativas ao centro do objeto (0,0)
        const x1 = Math.cos(angulo) * 75;
        const y1 = Math.sin(angulo) * 75;
        const x2 = Math.cos(angulo) * 82;
        const y2 = Math.sin(angulo) * 82;
        detalhesTextura.lineBetween(x1, y1, x2, y2);
    }
    detalhesTextura.setDepth(0.6);

    // Camada 4: Núcleo interno (brilho amarelado mais forte antes do cubo)
    const nucleoAura = this.add.circle(cx, cy, 65, 0xffaa00, 0.25)
        .setDepth(0.7);

    // --- ANIMAÇÃO DE PULSAÇÃO ---
    // Faz o conjunto "respirar"
    this.tweens.add({
        targets: [brilhoExterno, anelPrincipal, nucleoAura],
        scale: 1.05,
        alpha: (target) => target.alpha + 0.1,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    // Faz a textura girar bem devagar para dar vida
    // Agora que detalhesTextura.x/y é cx/cy, ele girará no centro do tabuleiro
    this.tweens.add({
        targets: detalhesTextura,
        rotation: Math.PI * 2,
        duration: 60000, // 1 minuto para uma volta completa
        repeat: -1
    });


        this.cuboCentro = this.add.image(cx, cy, 'cubo')
            .setScale(0.2)
            .setDepth(1);

        //contando objetos de pontuação
        this.objetosDePontuacaoRestantes = 0;
        this.tabuleiro.tabuleiroPontos.forEach(linha => {
            linha.forEach(item => {
                if (item === 'planeta' || item === 'terra' || item === 'nave') {
                    this.objetosDePontuacaoRestantes++;
                }
            });
        });
        console.log(`objetos de pontos no tabuleiro: ${this.objetosDePontuacaoRestantes}`);

        this.numeroDeJogadores = 3;//número de jogadores
        this.jogadorAtualIndex = 0;//começa com o primeiro jogador
        this.movimentosRestantes = 0;
        this.estadoTurno = 'AGUARDANDO_JOGADA';

        //baralho de eventos
        this.baralhoDeEventos = [
            // Giros (30 graus = 1 coluna, 60 = 2, etc.)
            { titulo: 'Giro Horário 30°', imagem: 'giroHorario30', efeito: 'GIRO', valor: 1 },
            { titulo: 'Giro Anti-Horário 30°', imagem: 'giroAnti-horario30', efeito: 'GIRO', valor: -1 },
            { titulo: 'Giro Horário 60°', imagem: 'giroHorario60', efeito: 'GIRO', valor: 2 },
            { titulo: 'Giro Anti-Horário 60°', imagem: 'giroAnti-horario60', efeito: 'GIRO', valor: -2 },
            { titulo: 'Giro Horário 90°', imagem: 'giroHorario90', efeito: 'GIRO', valor: 3 },
            { titulo: 'Giro Anti-Horário 90°', imagem: 'giroAnti-horario90', efeito: 'GIRO', valor: -3 },
            { titulo: 'Giro Horário 120°', imagem: 'giroHorario120', efeito: 'GIRO', valor: 4 },
            { titulo: 'Giro Anti-Horário 120°', imagem: 'giroAnti-horario120', efeito: 'GIRO', valor: -4 },
            { titulo: 'Giro Horário 150°', imagem: 'giroHorario150', efeito: 'GIRO', valor: 5 },
            { titulo: 'Giro Anti-Horário 150°', imagem: 'giroAnti-horario150', efeito: 'GIRO', valor: -5 },
            { titulo: 'Giro Horário 180°', imagem: 'giroHorario180', efeito: 'GIRO', valor: 6 },
            { titulo: 'Giro Anti-Horário 180°', imagem: 'giroAnti-horario180', efeito: 'GIRO', valor: -6 },

            // Reflexões (R1 = Eixo Vertical, R4 = Eixo Horizontal, pode ser ajustado)
            { titulo: 'Reflexão na Reta R1', imagem: 'reflexaoNaRetaR1', efeito: 'REFLEXAO', valor: 'R1' },
            { titulo: 'Reflexão na Reta R4', imagem: 'reflexaoNaRetaR4', efeito: 'REFLEXAO', valor: 'R4' },

            // Efeitos de Jogo
            { titulo: 'Campo Atrator', imagem: 'campoAtrator', efeito: 'PERDE_MOVIMENTO_RESTANTE' },
            { titulo: 'Leve Turbulência', imagem: 'leveTurbulencia', efeito: 'NENHUM_EFEITO' }
        ];

        this.players = [];
        const playersColors = [0x00d1b2, 0xff8800, 0xde3163, 0x8e44ad];



        //inicializando os dados dos jogadores
        for (let i = 0; i < this.numeroDeJogadores; i++) {
            const jogador = new Player(this, i, playersColors[i], 60);
            jogador.posicionarNoCentroInicial();
            this.players.push(jogador);

        }


        //inputs de movimento
        this.cursors = this.input.keyboard.createCursorKeys();//setinhas teclado
        this.input.on('pointerdown', this.moveMouse, this);//clique do mouse

        //comunicação cenas
        this.scene.launch('UI');
        const uiScene = this.scene.get('UI');
        uiScene.events.on('rolarDado', this.rolarDado, this);
        uiScene.events.on('uiPronta', () => {
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        })
        this.events.on('cartaFechada', () => {
            console.log('animação da carta terminou')

            const jogadorAtual = this.players[this.jogadorAtualIndex];

            this.estadoTurno = 'MOVENDO';

            if (this.movimentoPendenteCarta) {
                const { linha, coluna } = this.movimentoPendenteCarta;

                //esperando para a animação da carta acabar
                this.time.delayedCall(400, () => {
                    //realiza o movimento animado
                    jogadorAtual.playerMove(linha, coluna);
                    this.verificarCasaEContinuar(linha, coluna);
                });

                this.movimentoPendenteCarta = null;
            } else {
                this.verificarCasaEContinuar(jogadorAtual.position.linha, jogadorAtual.position.coluna);
            }
        });

    }

    update() {
        if (this.players[this.jogadorAtualIndex].position && this.movimentosRestantes > 0 && (this.estadoTurno === 'MOVENDO' || this.estadoTurno === 'DESEMPATE')) {
            if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
                console.log('anti-horario');
                this.move('anti-horario');
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
                console.log('horario');
                this.move('horario');
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                console.log('dentro');
                this.move('dentro');
            } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
                console.log('fora');
                this.move('fora');
            }
        }
    }

    isOcupado(linha, coluna) {
        return this.players.some(p => p.position && p.position.linha === linha && p.position.coluna === coluna);
    }

    getZona(linha) {
        if (linha <= 2) return 1; // Zona 1 (0, 1, 2)
        if (linha <= 6) return 2; // Zona 2 (4, 5, 6)
        return 3;                 // Zona 3 (8, 9)
    }

    isMovimentoParaLinhaVermelha(linhaNova) {
        if (linhaNova == 2 || linhaNova == 6 || linhaNova == 10) return true;
        return false;
    }


    //movimentação teclado
    move(direcao) {
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        const linhaAtual = jogadorAtual.position.linha;
        console.log(jogadorAtual.position);
        if (!jogadorAtual.position) return;// Jogador ainda não entrou no jogo.

        let { linha, coluna } = jogadorAtual.position;

        if (this.estadoTurno === 'DESEMPATE' && direcao === 'dentro' && linha === 0) {
            console.log(`${this.movimentosRestantes}`);
            if (this.movimentosRestantes >= 1) {
                console.log(`${jogadorAtual.id + 1} voltou ao centro e venceu`);
                jogadorAtual.retornaAoCentro();
                this.gameOver(jogadorAtual.id);
            } else {
                console.log('movimentos insuficientes para voltar ao centro');
            }
            return;
        }

        let novaLinha = linha;
        let novaColuna = coluna;

        //posição na lógica
        switch (direcao) {
            case 'dentro': novaLinha--; break;
            case 'fora': novaLinha++; break;
            case 'anti-horario': novaColuna = (coluna - 1 + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas; break;
            case 'horario': novaColuna = (coluna + 1) % this.tabuleiro.numeroDeColunas; break;
        }

        //checa movimento possivel
        if (novaLinha < 0 || novaLinha >= this.tabuleiro.numeroDeLinhas) return;
        if (this.isOcupado(novaLinha, novaColuna)) return;
        if ((linhaAtual == 2 || linhaAtual == 6) && (direcao == 'horario' || direcao == 'anti-horario')) {
            console.log('não é possível mover-se lateralmente nas divisões de zonas');
            return;
        }

        //custo de acordo com zonas
        let custo = 1;
        if (direcao === 'horario' || direcao === 'anti-horario') {
            if (this.getZona(linhaAtual) == 3) {
                custo = 3;
            }
            else if (this.getZona(linhaAtual) == 2) {
                custo = 2;
            }
        }

        if (this.movimentosRestantes >= custo) {

            jogadorAtual.playerMove(novaLinha, novaColuna);
            this.movimentosRestantes -= custo;

            if (this.isMovimentoParaLinhaVermelha(novaLinha)) {
                this.acionarEventoCarta();
            } else {
                this.verificarCasaEContinuar(novaLinha, novaColuna);
            }
        }
    }

    acionarEventoCarta() {
        this.estadoTurno = 'EVENTO_CARTA';
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        let { linha } = jogadorAtual.position;

        const cartaSorteada = Phaser.Utils.Array.GetRandom(this.baralhoDeEventos);

        console.log(`%c--- EVENTO DE ZONA ---`, 'color: yellow; font-weight: bold;');
        console.log(`Jogador ${this.jogadorAtualIndex + 1} sorteou: ${cartaSorteada.titulo}`);

        this.movimentoPendenteCarta = null;

        this.events.emit('exibirCarta', cartaSorteada);

        switch (cartaSorteada.efeito) {
            case 'GIRO': {
                let { coluna } = jogadorAtual.position;
                let novaCol = (coluna + cartaSorteada.valor + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas;

                //procura casa livre
                let tentativas = 0;
                while (this.isOcupado(linha, novaCol) && tentativas < this.tabuleiro.numeroDeColunas) {
                    novaCol = (novaCol + Math.sign(cartaSorteada.valor) + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas;
                    tentativas++;
                }

                if (!this.isOcupado(linha, novaCol)) {
                    this.movimentoPendenteCarta = { linha: linha, coluna: novaCol };//guarda o movimento pendente para ser emitido no listener
                }
                break;
            }
            case 'REFLEXAO': {
                let { coluna } = jogadorAtual.position;
                let novaCol = coluna;
                if (cartaSorteada.valor === 'R1') {
                    novaCol = (12 - coluna) % 12;
                } else if (cartaSorteada.valor === 'R4') {
                    novaCol = (6 - coluna + 12) % 12;
                }

                if (!this.isOcupado(linha, novaCol)) {
                    this.movimentoPendenteCarta = { linha: linha, coluna: novaCol };
                }
                break;
            }
            case 'PERDE_MOVIMENTO_RESTANTE':
                this.movimentosRestantes = 0;
                break;

            case 'NENHUM_EFEITO':
                break;
        }
    }

    verificarCasaEContinuar(linha, coluna) {
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        const tipo = this.tabuleiro.getItem(linha, coluna);

        if (tipo === 'buraco') {
            this.eliminaJogador(this.jogadorAtualIndex);
            return;
        }

        let pontos = 0;
        if (tipo === 'terra' || tipo === 'nave') { pontos = 4; }
        else if (tipo === 'planeta') {
            pontos = this.getZona(linha);
        }

        if (pontos > 0) {
            jogadorAtual.somaPontos(pontos);
            this.tabuleiro.removeItem(linha, coluna);

            this.objetosDePontuacaoRestantes--;
            console.log(`restam ${this.objetosDePontuacaoRestantes} objetos de pontuação restantes`);
            if (this.objetosDePontuacaoRestantes <= 0) {
                this.testaFimDeJogo();
                return;
            }
        }

        if (pontos > 0 || this.movimentosRestantes <= 0) {
            this.proximoJogador();
        } else {
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        }
    }

    //movimentação mouse
    moveMouse(pointer) {
        const jogadorAtual = this.players[this.jogadorAtualIndex];

        //primeira jogada
        if (!jogadorAtual.position) {
            if (this.movimentosRestantes <= 0 || this.estadoTurno !== 'MOVENDO') {
                return;
            }

            // 1. Definir os 12 pontos de entrada possíveis (toda a linha 0)
            const pontosDeEntrada = [];
            for (let i = 0; i < this.tabuleiro.numeroDeColunas; i++) {
                pontosDeEntrada.push({ linha: 0, coluna: i });
            }

            // 2. Calcular a posição (x,y) de cada ponto e a sua distância ao clique
            const pontosComDistancia = pontosDeEntrada.map(ponto => {
                const pos = this.tabuleiro.getXY(ponto.linha, ponto.coluna);
                const distancia = Phaser.Math.Distance.Between(pointer.x, pointer.y, pos.x, pos.y);
                return { ...ponto, distancia };
            });

            // 3. Encontrar o ponto de entrada com a menor distância
            const pontoMaisProximo = pontosComDistancia.reduce(
                (maisProximo, atual) => (atual.distancia < maisProximo.distancia ? atual : maisProximo)
            );

            // 4. Se o clique foi perto o suficiente e a casa não está ocupada, entra no jogo
            if (pontoMaisProximo.distancia < this.tabuleiro.distanciaEntreAneis * 0.75) {
                if (this.isOcupado(pontoMaisProximo.linha, pontoMaisProximo.coluna)) return;

                jogadorAtual.entraNoJogo(pontoMaisProximo.linha, pontoMaisProximo.coluna);
                this.movimentosRestantes--;
                this.verificarCasaEContinuar(pontoMaisProximo.linha, pontoMaisProximo.coluna);
            }
            return;
        }

        // CASO 2: O JOGADOR JÁ ESTÁ NO TABULEIRO (JOGADAS NORMAIS)
        if (this.movimentosRestantes <= 0 || (this.estadoTurno !== 'MOVENDO' && this.estadoTurno !== 'DESEMPATE')) {
            return;
        }

        // Se estiver no desempate na linha 0, verifica se o clique foi para o centro
        if (this.estadoTurno === 'DESEMPATE' && jogadorAtual.position.linha === 0) {
            const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.tabuleiro.centroX, this.tabuleiro.centroY);
            if (dist < this.tabuleiro.distanciaEntreAneis / 2) {
                this.move('dentro');
                return;
            }
        }

        // Lógica dos vizinhos
        const { linha, coluna } = jogadorAtual.position;
        const vizinhos = [
            { direcao: 'fora', linha: linha + 1, coluna: coluna },
            { direcao: 'dentro', linha: linha - 1, coluna: coluna },
            { direcao: 'horario', linha: linha, coluna: (coluna + 1) % this.tabuleiro.numeroDeColunas },
            { direcao: 'anti-horario', linha: linha, coluna: (coluna - 1 + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas }
        ];

        const vizinhosComDistancia = vizinhos.map(vizinho => {
            const pos = this.tabuleiro.getXY(vizinho.linha, vizinho.coluna);
            const distancia = Phaser.Math.Distance.Between(pointer.x, pointer.y, pos.x, pos.y);
            return { ...vizinho, distancia };
        });

        const vizinhoMaisProximo = vizinhosComDistancia.reduce(
            (maisProximo, atual) => (atual.distancia < maisProximo.distancia ? atual : maisProximo)
        );

        if (vizinhoMaisProximo.distancia < this.tabuleiro.distanciaEntreAneis * 0.75) {
            this.move(vizinhoMaisProximo.direcao);
        }
    }


    rolarDado() {
        if (this.movimentosRestantes === 0 && (this.estadoTurno === 'AGUARDANDO_JOGADA' || this.estadoTurno === 'DESEMPATE')) {
        
        const valorSorteado = Phaser.Math.Between(1, 6);
        const estadoAnterior = this.estadoTurno;
        
        this.estadoTurno = 'DADO_ROLANDO';

        this.events.emit('animarDado', valorSorteado);

        this.time.delayedCall(1000, () => {
            this.movimentosRestantes = valorSorteado;

            if (estadoAnterior === 'AGUARDANDO_JOGADA') {
                this.estadoTurno = 'MOVENDO';
            } else {
                this.estadoTurno = 'DESEMPATE';
            }

            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        });
    }

    }

    proximoJogador() {
        this.movimentosRestantes = 0;
        if (this.estadoTurno !== 'DESEMPATE') {
            this.estadoTurno = 'AGUARDANDO_JOGADA';
        }
        let proximoIndex = (this.jogadorAtualIndex + 1) % this.numeroDeJogadores;

        let tentativas = 0;
        while (tentativas < this.numeroDeJogadores) {
            const proximoJogador = this.players[proximoIndex];
            //encontrando jogador valido no desempate
            if (this.estadoTurno === 'DESEMPATE') {
                if (proximoJogador.isAtivo && this.jogadoresNoDesempate.includes(proximoJogador.id)) {
                    break;
                }
            } else { //lógica normal
                if (proximoJogador.isAtivo) {
                    break;
                }
            }
            proximoIndex = (proximoIndex + 1) % this.numeroDeJogadores;
            tentativas++;
        }
        this.jogadorAtualIndex = proximoIndex;
        this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
    }

    eliminaJogador(index) {
        this.players[index].elimina();

        //checa se sobrou só 1
        const jogadoresRestantes = this.players.filter(p => p.isAtivo).length;
        if (jogadoresRestantes <= 1) {
            const vencedorIndex = this.players.findIndex(p => p.isAtivo === true);
            this.gameOver(vencedorIndex);
        } else {
            this.proximoJogador();
        }
    }

    testaFimDeJogo() {
        const jogadoresAtivos = this.players.filter(p => p.isAtivo);
        const pontuacaoMaxima = Math.max(...jogadoresAtivos.map(p => p.pontos));
        const jogadoresEmpatados = jogadoresAtivos.filter(p => p.pontos === pontuacaoMaxima);

        if (jogadoresEmpatados.length === 1) {
            //vencedor claro
            this.gameOver(jogadoresEmpatados[0].id);
        } else {//empate
            console.log(`empate com ${pontuacaoMaxima} pontos`);
            this.estadoTurno = 'DESEMPATE';
            this.jogadoresNoDesempate = jogadoresEmpatados.map(p => p.id)//guarda quem concorre o desempate
            //eliminando jogadores que não estão empatados
            this.players.forEach(jogador => {
                if (jogador.isAtivo && !this.jogadoresNoDesempate.includes(jogador.id)) {
                    jogador.elimina();
                }
            })

            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), 0, 'EMPATE! O PRIMEIRO A VOLTAR PARA O CENTRO VENCE!');
            this.proximoJogador();
        }
    }

    gameOver(vencedorIndex) {
        this.scene.stop('UI');
        const pontuacaoVencedor = vencedorIndex > -1 ? this.players[vencedorIndex].pontos : 0
        this.scene.start('GameOver', {
            vencedor: vencedorIndex,
            pontuacao: pontuacaoVencedor
        });
    }

    getPontuacoesArray() {
        return this.players.map(p => p.pontos);
    }
}
