import { Player } from './Player.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {}

    create() {
        //tamanhos tabuleiro e casas
        this.tamanhoColunas = 12;
        this.tamanhoLinhas = 9;
        this.tamanhoCelula = 100;
        this.numeroDeJogadores = 3;//número de jogadores
        this.jogadorAtualIndex = 0;//começa com o primeiro jogador
        this.movimentosRestantes = 0;

        this.players = [];
        const playersColors = [0x00d1b2, 0xff8800, 0xde3163, 0x8e44ad];

        //inicializando os dados dos jogadores
        for (let i = 0; i < this.numeroDeJogadores; i++){
            const jogador = new Player(this, i, playersColors[i], this.tamanhoCelula);
            this.players.push(jogador);
        }

        
        //array para guardar os elementos 'pontuáveis'
        this.tabuleiroPontos = Array.from({ length: this.tamanhoLinhas }, () => Array(this.tamanhoColunas).fill(0));
        //array para colocar os elementos visuais
        this.marcadoresVisuais = Array.from({ length: this.tamanhoLinhas }, () => Array(this.tamanhoColunas).fill(null));
        

        //elementos e suas posições no tabuleiro para serem resgatados
        this.tabuleiroPontos[3][4] = 'terra'; // Planeta Terra
        this.tabuleiroPontos[8][10] = 'nave'; // Nave alienígena
        this.tabuleiroPontos[0][1] = 'planeta';
        this.tabuleiroPontos[1][3] = 'planeta';
        this.tabuleiroPontos[2][5] = 'planeta';
        this.tabuleiroPontos[0][9] = 'planeta';
        this.tabuleiroPontos[2][2] = 'planeta';
        this.tabuleiroPontos[3][6] = 'planeta';
        this.tabuleiroPontos[4][3] = 'planeta';
        this.tabuleiroPontos[5][7] = 'planeta';
        this.tabuleiroPontos[3][0] = 'planeta';
        this.tabuleiroPontos[5][2] = 'planeta';
        this.tabuleiroPontos[6][8] = 'planeta';
        this.tabuleiroPontos[7][5] = 'planeta';
        this.tabuleiroPontos[8][1] = 'planeta';
        this.tabuleiroPontos[6][0] = 'planeta';
        this.tabuleiroPontos[8][6] = 'planeta';

        //buracos negros
        this.tabuleiroPontos[6][5] = 'buraco';
        this.tabuleiroPontos[8][3] = 'buraco';
        this.tabuleiroPontos[5][1] = 'buraco';

        //criando o tabuleiro
        for (let linha = 0; linha < this.tamanhoLinhas; linha++){
            for (let col = 0; col < this.tamanhoColunas; col++){
                this.add.rectangle(
                    col * this.tamanhoCelula + this.tamanhoCelula /2,
                    linha * this.tamanhoCelula + this.tamanhoCelula /2,
                    this.tamanhoCelula - 2,
                    this.tamanhoCelula - 2,
                    0x555555
                ).setStrokeStyle(2,0xffffff);   
            }
        }

    //criando visualmente os objetivos e obstáculos 
    for (let y = 0; y < this.tamanhoLinhas; y++) {
        this.marcadoresVisuais[y] = [];

        for (let x = 0; x < this.tamanhoColunas; x++) {
            const tipo = this.tabuleiroPontos[y][x];
            let marcador = null;

            if (tipo === 'terra') {
                marcador = this.add.circle(
                    x * this.tamanhoCelula + this.tamanhoCelula / 2,
                    y * this.tamanhoCelula + this.tamanhoCelula / 2,
                    this.tamanhoCelula / 4,
                    0x0000ff
                );
            } else if (tipo === 'nave') {
                marcador = this.add.star(
                    x * this.tamanhoCelula + this.tamanhoCelula / 2,
                    y * this.tamanhoCelula + this.tamanhoCelula / 2,
                    5, 15, 30,
                    0xffff00
                );
            } else if (tipo === 'planeta') {
                marcador = this.add.circle(
                    x * this.tamanhoCelula + this.tamanhoCelula / 2,
                    y * this.tamanhoCelula + this.tamanhoCelula / 2,
                    this.tamanhoCelula / 6,
                    0x00ff00
                );
            } else if (tipo == 'buraco'){
                marcador = this.add.circle(
                    x * this.tamanhoCelula + this.tamanhoCelula / 2,
                    y * this.tamanhoCelula + this.tamanhoCelula / 2,
                    this.tamanhoCelula / 2.5,
                    0x480d6a
                );
            }

            this.marcadoresVisuais[y][x] = marcador;
        }
    }

        //marcação zonas
        const corDivisao = 0xff0000;
        const yLinha4 = 3 * this.tamanhoCelula;
        const yLinha7 = 6 * this.tamanhoCelula;

        this.add.line(
            0, yLinha4, 0, 0, this.tamanhoColunas * this.tamanhoCelula, 0,corDivisao
        ).setOrigin(0, 0).setLineWidth(4)

        this.add.line(
            0, yLinha7, 0, 0, this.tamanhoColunas * this.tamanhoCelula, 0,corDivisao
        ).setOrigin(0, 0).setLineWidth(4)

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
                this.move(-1, 0);
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.right)){
                this.move(1, 0);
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
                this.move(0, -1);
            } else if(Phaser.Input.Keyboard.JustDown(this.cursors.down)){
                this.move(0, 1);
            }
        }
    }

    isOcupado(x, y){
        return this.players.some(p => p.position && p.position.x === x && p.position.y === y);
    }

    //movimentação teclado
    move(x, y){
        const jogadorAtual = this.players[this.jogadorAtualIndex];//pega as posições do jogador do turno
        const novoX = (jogadorAtual.position.x + x + this.tamanhoColunas) % this.tamanhoColunas;
        const novoY = jogadorAtual.position.y + y;
        if (this.isOcupado(novoX, novoY)) return;

        if(novoX >= 0 && novoX < this.tamanhoColunas && novoY >= 0 && novoY < this.tamanhoLinhas){
            //custo de movimento
            let custo = 1;

            if (y === 0){
                if (jogadorAtual.position.y >= 3 && jogadorAtual.position.y <= 5){
                    custo = 2;
                }else if (jogadorAtual.position.y >= 6){
                    custo = 3;
                }
            }

            if (this.movimentosRestantes >= custo) {
                // só move se tiver movimentos suficientes
                jogadorAtual.playerMove(novoX, novoY);
                this.movimentosRestantes -= custo;
                //pontuação
                const tipo = this.tabuleiroPontos[jogadorAtual.position.y][jogadorAtual.position.x];

                if (tipo === 'buraco'){//se o jogador cair na casa do buraco, ele morre
                    this.eliminaJogador(this.jogadorAtualIndex);
                    return;
                }

                let pontos = 0;
                if (tipo === 'terra' || tipo === 'nave'){
                    pontos = 4;
                }else if (tipo === 'planeta'){
                    if (jogadorAtual.position.y <= 2){
                        pontos = 1;
                    }else if (jogadorAtual.position.y <= 5){
                        pontos = 2;
                    }else{
                        pontos = 3;
                    }
                }

                if (pontos > 0){
                    jogadorAtual.somaPontos(pontos);
                    const marcador = this.marcadoresVisuais[novoY][novoX];
                    if (marcador) {
                        marcador.destroy();//removendo elemento capturado
                        this.marcadoresVisuais[jogadorAtual.position.y][jogadorAtual.position.x] = null;
                    }
                    this.tabuleiroPontos[novoY][novoX] = 0;
                }
                if (pontos > 0 || this.movimentosRestantes === 0){
                    this.proximoJogador();
                }else {
                    this.events.emit('updateTurno', this.jogadorAtualIndex, this.getPontuacoesArray(), this.movimentosRestantes);
                }
                
            } 
        }
    }

    //movimentação mouse
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
            pontuacao: vencedorIndex > -1 ? this.players[vencedorIndex].pontos : 0
        });
    }

    getPontuacoesArray(){
        return this.players.map(p => p.pontos);
    }
}
