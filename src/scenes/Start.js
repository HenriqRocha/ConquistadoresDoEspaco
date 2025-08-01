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
            jogador.position = {linha: 0, coluna: 0 };   
            this.players.push(jogador);
               
        }

        
        //inputs de movimento
        this.cursors = this.input.keyboard.createCursorKeys();//setinhas teclado
        //this.input.on('pointerdown', this.moveMouse, this);//clique do mouse

        //comunicação cenas
        this.scene.launch('UI');
        const uiScene = this.scene.get('UI');
        uiScene.events.on('rolarDado', this.rolarDado, this);
        uiScene.events.on('uiPronta', () => {
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
        })
        
    }
    
    update(){//não sei se ta dando certo ainda
        if (/*this.players[this.jogadorAtualIndex].position && */this.movimentosRestantes > 0){
            if(Phaser.Input.Keyboard.JustDown(this.cursors.left)){
                this.move('anti-horario');
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
                console.log('horario');
                this.move('horario');
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
                this.move('dentro');
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
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
        const custo = (novaLinha >= 5) ? 3 : (novaLinha >= 2) ? 2 : 1;
        
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
    /* ainda não sei direito como posso fazer isso da melhor forma
    moveMouse(pointer){
        //virando posição na grade/matriz
        const gridX = Math.floor(pointer.x / this.tamanhoCelula);//coordenada do clique / tamanho das celulas =
        const gridY = Math.floor(pointer.y / this.tamanhoCelula);// coordenada em # das celulas
        const jogadorAtual = this.players[this.jogadorAtualIndex];
        //verificando se ta dentro do tabuleiro
        if(gridX >= 0 && gridX < this.tamanhoColunas && gridY >= 0 && gridY < this.tamanhoLinhas){
            //primeiro movimento
            if(jogadorAtual.position){
                if(this.movimentosRestantes > 0){
                    const difX = gridX - jogadorAtual.position.x;
                    const difY = gridY - jogadorAtual.position.y;
                    const isAdjacente = (Math.abs(difX) === 1 && difY === 0) || (difX === 0 && Math.abs(difY) === 1) || (Math.abs(difX) === this.tamanhoColunas - 1 && difY === 0);
                    if (isAdjacente) {
                        this.move(difX, difY);
                    }
                }
            } else {
                if (this.movimentosRestantes > 0 && gridY === 0) {
                    if (this.isOcupado(gridX, gridY)) return

                    jogadorAtual.entraNoJogo(gridX, gridY)
                    this.movimentosRestantes--;

                    if (this.movimentosRestantes === 0){
                        this.proximoJogador();
                    }else{
                        this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
                    }
                }
            }
        }
    }
    */

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
