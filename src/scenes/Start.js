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
        if (this.players[this.jogadorAtualIndex].position && this.movimentosRestantes > 0){
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
            if (linhaAtual >= 5){
                custo = 3;
            }
            else if (linhaAtual >= 2){
                custo = 2;
            }
        }
        
        if (this.movimentosRestantes >= custo) {
            jogadorAtual.playerMove(novaLinha, novaColuna);
            this.movimentosRestantes -= custo;
            
            //checando objeto na casa
            const tipo = this.tabuleiro.getItem(novaLinha, novaColuna);
            if (tipo === 'buraco') { 
                this.eliminaJogador(this.jogadorAtualIndex); 
                return; 
            }

            let pontos = 0;
            if (tipo === 'terra' || tipo === 'nave') { pontos = 4; }
            else if (tipo === 'planeta') {
                //pontuaçao dos planetas de acordo com zona também
                pontos = (novaLinha >= 5) ? 3 : (novaLinha >= 2) ? 2 : 1;
            }

            if (pontos > 0) {
                jogadorAtual.somaPontos(pontos);
                this.tabuleiro.removeItem(novaLinha, novaColuna);
            }
            
            if (pontos > 0 || this.movimentosRestantes === 0) { this.proximoJogador(); }
            else { this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes); }
        }
    }

    //movimentação mouse
    moveMouse(pointer){
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        if (this.movimentosRestantes <= 0) return;

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

                //realizando o movimento
                jogadorAtual.entraNoJogo(linha, coluna);
                this.movimentosRestantes--;
                
                if (this.movimentosRestantes === 0) {
                    this.proximoJogador();
                } else {
                    this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
                }
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
        if (this.movimentosRestantes === 0){
            this.movimentosRestantes = 6;//Phaser.Math.Between(1,6);
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        }
        
    }

    proximoJogador(){
        this.movimentosRestantes = 0;
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
