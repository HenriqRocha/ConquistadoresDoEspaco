import { Player } from './Player.js';
import { Tabuleiro } from './Tabuleiro.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {}

    create() {
        this.tabuleiro = new Tabuleiro(this);
        this.tabuleiro.iniciaTabuleiro();

        this.numeroDeJogadores = 3;//número de jogadores
        this.jogadorAtualIndex = 0;//começa com o primeiro jogador
        this.movimentosRestantes = 0;
        this.estadoTurno = 'AGUARDANDO_JOGADA';

        //baralho de eventos
        this.baralhoDeEventos = [
            // Giros (30 graus = 1 coluna, 60 = 2, etc.)
            { titulo: 'Giro Horário 30°', descricao: 'Você entrou em um campo magnético fortíssimo. Gire a nave em 30° no sentido horário para recuperar o controle.', efeito: 'GIRO', valor: 1 },
            { titulo: 'Giro Anti-Horário 30°', descricao: 'Você entrou em um campo magnético fortíssimo. Gire a nave em 30° no sentido anti-horário para recuperar o controle.', efeito: 'GIRO', valor: -1 },
            { titulo: 'Giro Horário 60°', descricao: 'Utilizando um estilingue gravitacional, sua nave se moveu 60° no sentido horário.', efeito: 'GIRO', valor: 2 },
            { titulo: 'Giro Anti-Horário 60°', descricao: 'Utilizando um estilingue gravitacional, sua nave se moveu 60° no sentido anti-horário.', efeito: 'GIRO', valor: -2 },
            { titulo: 'Giro Anti-Horário 90°', descricao: 'Uma chuva de meteoros obriga sua nave a manobrar! Mova 90° no sentido anti-horário para escapar.', efeito: 'GIRO', valor: -3 },
            { titulo: 'Giro Horário 120°', descricao: 'Uma estrela super gigante azul surge em seu trajeto. Gire em 120° no sentido horário para evitar seu calor intenso!', efeito: 'GIRO', valor: 4 },
            { titulo: 'Giro Anti-Horário 120°', descricao: 'Uma estrela super gigante azul surge em seu trajeto. Gire em 120° no sentido anti-horário para evitar seu calor intenso!', efeito: 'GIRO', valor: -4 },
            { titulo: 'Giro Horário 150°', descricao: 'A radiação de um pulsar está fritando os instrumentos. Mova sua nave 150° no sentido horário!', efeito: 'GIRO', valor: 5 },
            { titulo: 'Giro Anti-Horário 150°', descricao: 'A radiação de um pulsar está fritando os instrumentos. Mova sua nave 150° no sentido anti-horário!', efeito: 'GIRO', valor: -5 },
            { titulo: 'Giro Horário 180°', descricao: 'Uma pane na nave impediu a detecção de um buraco negro. Para sobreviver mova sua nave em 180° no sentido horário.', efeito: 'GIRO', valor: 6 },
            { titulo: 'Giro Anti-Horário 180°', descricao: 'Uma pane na nave impediu a detecção de um buraco negro. Para sobreviver mova sua nave em 180° no sentido anti-horário.', efeito: 'GIRO', valor: -6 },
            
            // Reflexões (R1 = Eixo Vertical, R4 = Eixo Horizontal, pode ser ajustado)
            { titulo: 'Reflexão na Reta R1', descricao: 'Aproveitando a gravidade de um planeta próximo sua nave ganhou um forte impulso! Vá para a posição refletida em relação a reta R1.', efeito: 'REFLEXAO', valor: 'R1' },
            { titulo: 'Reflexão na Reta R4', descricao: 'Um buraco de minhoca surgiu, mandando sua nave para a posição refletida em relação a reta R4.', efeito: 'REFLEXAO', valor: 'R4' },
            
            // Efeitos de Jogo
            { titulo: 'Campo Atrator', descricao: 'Uma força desconhecida prendeu sua nave nesta posição... Perca o restante da sua movimentação.', efeito: 'PERDE_MOVIMENTO_RESTANTE' },
            { titulo: 'Leve Turbulência', descricao: 'Sua nave ficou cercada por um campo magnético potente, mas parece não afetar sua nave. Prossiga o caminho como planejado.', efeito: 'NENHUM_EFEITO' }
        ];

        this.players = [];
        const playersColors = [0x00d1b2, 0xff8800, 0xde3163, 0x8e44ad];



        //inicializando os dados dos jogadores
        for (let i = 0; i < this.numeroDeJogadores; i++){
            const jogador = new Player(this, i, playersColors[i], 60);
            jogador.sprite.setPosition(this.tabuleiro.centroX, this.tabuleiro.centroY).setVisible(true);   
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
        
    }
    
    update(){
        if (this.players[this.jogadorAtualIndex].position && this.movimentosRestantes > 0 && this.estadoTurno === 'MOVENDO'){
            if(Phaser.Input.Keyboard.JustDown(this.cursors.left)){
                console.log('anti-horario');
                this.move('anti-horario');
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
                console.log('horario');
                this.move('horario');
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
                console.log('dentro');
                this.move('dentro');
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
                console.log('fora');
                this.move('fora');
            }
        }
    }

    isOcupado(linha, coluna){
        return this.players.some(p => p.position && p.position.linha === linha && p.position.coluna === coluna);
    }

    getZona(linha) {
        if (linha <= 2) return 1; // Zona 1 (0, 1, 2)
        if (linha <= 5) return 2; // Zona 2 (3, 4, 5)
        return 3;                 // Zona 3 (6, 7, 8)
    }

    //movimentação teclado
    move(direcao) {
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        console.log(jogadorAtual.position);
        if (!jogadorAtual.position) return;// Jogador ainda não entrou no jogo.

        let { linha, coluna } = jogadorAtual.position;
        let novaLinha = linha;
        let novaColuna = coluna;

        //posição na lógica
        switch(direcao) {
            case 'dentro': novaLinha--; break;
            case 'fora': novaLinha++; break;
            case 'anti-horario': novaColuna = (coluna - 1 + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas; break;
            case 'horario': novaColuna = (coluna + 1) % this.tabuleiro.numeroDeColunas; break;
        }

        //checa movimento possivel
        if (novaLinha < 0 || novaLinha >= this.tabuleiro.numeroDeLinhas) return;
        if (this.isOcupado(novaLinha, novaColuna)) return;

        //custo de acordo com zonas
        let custo = 1;
        if (direcao === 'horario' || direcao === 'anti-horario'){
            const linhaAtual = jogadorAtual.position.linha;
            if (linhaAtual >= 6){
                custo = 3;
            }
            else if (linhaAtual >= 3){
                custo = 2;
            }
        }
        
        if (this.movimentosRestantes >= custo) {
            const zonaAntiga = this.getZona(linha);

            jogadorAtual.playerMove(novaLinha, novaColuna);
            this.movimentosRestantes -= custo;

            const zonaNova = this.getZona(novaLinha);

            if(zonaAntiga !== zonaNova){
                this.acionarEventoCarta();
            }else{
                this.verificarCasaEContinuar(novaLinha, novaColuna);
            }
        }
    }

    acionarEventoCarta(){
        this.estadoTurno = 'EVENTO_CARTA';
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        let {linha} = jogadorAtual.position;

        const cartaSorteada = Phaser.Utils.Array.GetRandom(this.baralhoDeEventos);

        console.log(`%c--- EVENTO DE ZONA ---`, 'color: yellow; font-weight: bold;');
        console.log(`Jogador ${this.jogadorAtualIndex + 1} sorteou: ${cartaSorteada.titulo}`);
        console.log(`"${cartaSorteada.descricao}"`);

        switch(cartaSorteada.efeito){
            case 'GIRO':{
                let {coluna} = jogadorAtual.position;
                let novaColunaGiro = (coluna + cartaSorteada.valor + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas;

                //procura casa livre
                let tentativas = 0;
                while (this.isOcupado(linha, novaColunaGiro) && tentativas < this.tabuleiro.numeroDeColunas){
                    novaColunaGiro = (novaColunaGiro + Math.sign(cartaSorteada.valor) + this.tabuleiro.numeroDeColunas) % this.tabuleiro.numeroDeColunas;
                    tentativas++;
                }

                if (!this.isOcupado(linha, novaColunaGiro)){
                    jogadorAtual.playerMove(linha, novaColunaGiro);
                }
                break;
            }
            case 'REFLEXAO':{
                let {coluna} = jogadorAtual.position;
                let novaColunaReflexao = coluna;
                if (cartaSorteada.valor === 'R1'){
                    novaColunaReflexao = (12 - coluna) % 12;
                } else if(cartaSorteada.valor === 'R4'){
                    novaColunaReflexao = (6 - coluna + 12) % 12;
                }

                if (!this.isOcupado(linha, novaColunaReflexao)){
                    jogadorAtual.playerMove(linha,novaColunaReflexao);
                }
                break;
            }
            case 'PERDE_MOVIMENTO_RESTANTE':
                this.movimentosRestantes = 0;
                this.proximoJogador();
                return;

            case 'NENHUM_EFEITO':
                break;
        }

        console.log('------------------');
        this.estadoTurno = 'MOVENDO';
        this.verificarCasaEContinuar(jogadorAtual.position.linha, jogadorAtual.position.coluna);        
    }

    verificarCasaEContinuar(linha, coluna){
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        const tipo = this.tabuleiro.getItem(linha, coluna);

        if(tipo === 'buraco'){
            this.eliminaJogador(this.jogadorAtualIndex);
            return;
        }

        let pontos = 0;
        if(tipo === 'terra' || tipo === 'nave'){pontos = 4;}
        else if(tipo === 'planeta'){
            pontos = this.getZona(linha);
        }

        if(pontos > 0){
            jogadorAtual.somaPontos(pontos);
            this.tabuleiro.removeItem(linha, coluna);
        }

        if(pontos > 0 || this.movimentosRestantes <= 0){
            this.proximoJogador();
        } else{
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        }
    }

    //movimentação mouse
    moveMouse(pointer){
        if (this.movimentosRestantes <= 0 || (this.estadoTurno !== 'MOVENDO' && this.estadoTurno !== 'AGUARDANDO_JOGADA' && this.players[this.jogadorAtualIndex].position)) return;
        const jogadorAtual = this.players[this.jogadorAtualIndex];

        //primeiro movimento
        if (!jogadorAtual.position) {
            //distância do centro para o clique para saber a linha correspondente
            const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.tabuleiro.centroX, this.tabuleiro.centroY);
            const linha = Math.round(dist / this.tabuleiro.distanciaEntreAneis) - 1;
            
            //se o clique foi no primeiro anel (linha 0) é possível
            if (linha === 0) {
                //agora calcula o ângulo
                const angulo = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.tabuleiro.centroX, this.tabuleiro.centroY, pointer.x, pointer.y));
                const anguloPositivo = angulo < 0 ? angulo + 360 : angulo;//se o angulo for negativo a conta da coluna n vai funcionar
                const coluna = Math.round(anguloPositivo / (360 / this.tabuleiro.numeroDeColunas)) % this.tabuleiro.numeroDeColunas;

                //checagem de jogador
                if (this.isOcupado(linha, coluna)) return;

                this.estadoTurno = 'MOVENDO';

                //realizando o movimento
                jogadorAtual.entraNoJogo(linha, coluna);
                this.movimentosRestantes--;
                
                this.verificarCasaEContinuar(linha, coluna);
            }
        }
        else {
            const posAtual = jogadorAtual.position;

            //pegando distancia do clique e convertendo em linha alvo
            const dist = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.tabuleiro.centroX, this.tabuleiro.centroY);
            const targetLinha = Math.round(dist / this.tabuleiro.distanciaEntreAneis) - 1;
            //mesma coisa com a coluna
            const angulo = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.tabuleiro.centroX, this.tabuleiro.centroY, pointer.x, pointer.y));
            const anguloPositivo = angulo < 0 ? angulo + 360 : angulo;
            const targetColuna = Math.round(anguloPositivo / (360 / this.tabuleiro.numeroDeColunas)) % this.tabuleiro.numeroDeColunas;

            //verificando se é adjacente
            const deltaLinha = targetLinha - posAtual.linha;
            const deltaColuna = targetColuna - posAtual.coluna;

            //circularidade entre colunas
            const isAdjacentColuna = Math.abs(deltaColuna) === 1 || Math.abs(deltaColuna) === this.tabuleiro.numeroDeColunas - 1;
            const isAdjacent = (Math.abs(deltaLinha) === 1 && deltaColuna === 0) || (deltaLinha === 0 && isAdjacentColuna);

            if (isAdjacent) {
                // 3. Se for adjacente, determina a direção e chama a função move.
                if (deltaLinha === 1) this.move('fora');
                else if (deltaLinha === -1) this.move('dentro');
                else if (deltaColuna === 1 || deltaColuna === -(this.tabuleiro.numeroDeColunas - 1)) this.move('horario');
                else if (deltaColuna === -1 || deltaColuna === this.tabuleiro.numeroDeColunas - 1) this.move('anti-horario');
            }
        }
    }

    rolarDado(){
        if (this.movimentosRestantes === 0 && this.estadoTurno === 'AGUARDANDO_JOGADA'){
            this.movimentosRestantes = Phaser.Math.Between(1,6);
            this.estadoTurno = 'MOVENDO';
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        }
        
    }

    proximoJogador(){
        this.movimentosRestantes = 0;
        this.estadoTurno = 'AGUARDANDO_JOGADA';
        let proximoIndex = (this.jogadorAtualIndex + 1) % this.numeroDeJogadores;

        //procurando o prox jogador ativo
        while (!this.players[proximoIndex].isAtivo && proximoIndex !== this.jogadorAtualIndex){
            proximoIndex = (proximoIndex + 1) % this.numeroDeJogadores; 
        }
        this.jogadorAtualIndex = proximoIndex;
        this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
    }

    eliminaJogador(index){
        this.players[index].elimina();

        //checa se sobrou só 1
        const jogadoresRestantes = this.players.filter(p => p.isAtivo).length;
        if (jogadoresRestantes <= 1){
            const vencedorIndex = this.players.findIndex(p => p.isAtivo === true);
            this.gameOver(vencedorIndex);
        } else {
            this.proximoJogador();
        }
    }

    gameOver(vencedorIndex){
        this.scene.stop('UI');
        const pontuacaoVencedor = vencedorIndex > -1 ? this.players[vencedorIndex].pontos : 0
        this.scene.start('GameOver', {
            vencedor: vencedorIndex,
            pontuacao: pontuacaoVencedor
        });
    }

    getPontuacoesArray(){
        return this.players.map(p => p.pontos);
    }
}
