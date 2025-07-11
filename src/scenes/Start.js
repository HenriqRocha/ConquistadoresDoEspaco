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

        this.numeroDeJogadores = 2;//número de jogadores
        this.jogadorAtualIndex = 0;//começa com o primeiro jogador
        this.movimentosRestantes = 0;

        //dados de jogadores
        this.playerPositions = [];
        this.players = [];
        this.pontuacoes = [];
        this.jogadoresAtivos = [];
        const playersColors = [0x00d1b2, 0xff8800, 0xde3163, 0x8e44ad];

        //inicializando os dados dos jogadores
        for (let i = 0; i < this.numeroDeJogadores; i++){
            this.pontuacoes.push(0);
            this.jogadoresAtivos.push(true)//todos começam vivos
            this.playerPositions.push(null);

            //criando jogadores porem invisiveis
            const playerSprite = this.add.circle(0, 0, this.tamanhoCelula / 4, playersColors[i % playersColors.length])
                .setVisible(false)
                .setDepth(2);
            this.players.push(playerSprite);
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
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.pontuacoes, this.movimentosRestantes);
        })
        
    }
    
    update(){
        if (this.playerPositions[this.jogadorAtualIndex] && this.movimentosRestantes > 0){
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

    //movimentação teclado
    move(x, y){
        const posAtual = this.playerPositions[this.jogadorAtualIndex];//pega as posições do jogador do turno
        const novoX = (posAtual.x + x + this.tamanhoColunas) % this.tamanhoColunas;
        const novoY = posAtual.y + y;
        if(novoX >= 0 && novoX < this.tamanhoColunas && novoY >= 0 && novoY < this.tamanhoLinhas){
            //custo de movimento
            let custo = 1;

            if (y === 0){
                if (posAtual.y >= 3 && posAtual.y <= 5){
                    custo = 2;
                }else if (posAtual.y >= 6){
                    custo = 3;
                }
            }

            if (this.movimentosRestantes >= custo) {
                // só move se tiver movimentos suficientes
                posAtual.x = novoX;
                posAtual.y = novoY;

                const playerSprite = this.players[this.jogadorAtualIndex];
                playerSprite.x = posAtual.x * this.tamanhoCelula + this.tamanhoCelula / 2;
                playerSprite.y = posAtual.y * this.tamanhoCelula + this.tamanhoCelula / 2;
                this.movimentosRestantes -= custo;
                //pontuação
                const tipo = this.tabuleiroPontos[posAtual.y][posAtual.x];

                if (tipo === 'buraco'){//se o jogador cair na casa do buraco, ele morre
                    this.eliminaJogador(this.jogadorAtualIndex);
                    return;
                }

                let pontos = 0;
                if (tipo === 'terra' || tipo === 'nave'){
                    pontos = 4;
                }else if (tipo === 'planeta'){
                    if (posAtual.y <= 2){
                        pontos = 1;
                    }else if (posAtual.y <= 5){
                        pontos = 2;
                    }else{
                        pontos = 3;
                    }
                }

                if (pontos > 0){
                    this.pontuacoes[this.jogadorAtualIndex] += pontos;
                    const marcador = this.marcadoresVisuais[posAtual.y][posAtual.x];
                    if (marcador) {
                        marcador.destroy();//removendo elemento capturado
                        this.marcadoresVisuais[posAtual.y][posAtual.x] = null;
                    }
                    this.tabuleiroPontos[posAtual.y][posAtual.x] = 0;
                }
                if (pontos > 0 || this.movimentosRestantes === 0){
                    this.proximoJogador();
                }else {
                    this.events.emit('updateTurno', this.jogadorAtualIndex, this.pontuacoes, this.movimentosRestantes);
                }
                
            } 
        }
    }

    //movimentação mouse
    moveMouse(pointer){
        //virando posição na grade/matriz
        const gridX = Math.floor(pointer.x / this.tamanhoCelula);//coordenada do clique / tamanho das celulas =
        const gridY = Math.floor(pointer.y / this.tamanhoCelula);// coordenada em # das celulas
        const posAtual = this.playerPositions[this.jogadorAtualIndex];
        //verificando se ta dentro do tabuleiro
        if(gridX >= 0 && gridX < this.tamanhoColunas && gridY >= 0 && gridY < this.tamanhoLinhas){
            //primeiro movimento
            if(posAtual){
                if(this.movimentosRestantes > 0){
                    const difX = gridX - posAtual.x;
                    const difY = gridY - posAtual.y;
                    const isAdjacente = (Math.abs(difX) === 1 && difY === 0) || (difX === 0 && Math.abs(difY) === 1) || (Math.abs(difX) === this.tamanhoColunas - 1 && difY === 0);
                    if (isAdjacente) {
                        this.move(difX, difY);
                    }
                }
            } else {
                if (this.movimentosRestantes > 0 && gridY === 0) {
                    this.playerPositions[this.jogadorAtualIndex] = {x: gridX, y: gridY};
                    const playerSprite = this.players[this.jogadorAtualIndex];
                    playerSprite.setPosition(
                        gridX * this.tamanhoCelula + this.tamanhoCelula / 2,
                        gridY * this.tamanhoCelula + this.tamanhoCelula / 2
                    );
                    playerSprite.setVisible(true);
                    console.log('estado jogador na entrada', playerSprite);
                    this.movimentosRestantes--;

                    if (this.movimentosRestantes === 0){
                        this.proximoJogador();
                    }else{
                        this.events.emit('updateTurno', this.jogadorAtualIndex, this.pontuacoes, this.movimentosRestantes);
                    }
                }
            }
        }
    }

    rolarDado(){
        if (this.movimentosRestantes === 0){
            this.movimentosRestantes = Phaser.Math.Between(1,6);
            this.events.emit('updateTurno', this.jogadorAtualIndex, this.pontuacoes, this.movimentosRestantes);
        }
        
    }

    proximoJogador(){
        this.movimentosRestantes = 0;
        let proximoIndex = (this.jogadorAtualIndex + 1) % this.numeroDeJogadores;

        //procurando o prox jogador ativo
        while (!this.jogadoresAtivos[proximoIndex] && proximoIndex !== this.jogadorAtualIndex){
            proximoIndex = (proximoIndex + 1) % this.numeroDeJogadores; 
        }
        this.jogadorAtualIndex = proximoIndex;
        this.events.emit('updateTurno', this.jogadorAtualIndex, this.pontuacoes, this.movimentosRestantes);
    }

    eliminaJogador(index){
        this.jogadoresAtivos[index] = false;
        const playerSprite = this.players[index];

        this.tweens.add({
            targets: playerSprite,
            alpha: 0,
            scale: 0,
            duration: 500,
            ease: 'Power2'
        });

        //checa se sobrou só 1
        const jogadoresRestantes = this.jogadoresAtivos.filter(ativo => ativo).length;
        if (jogadoresRestantes <= 1){
            const vencedorIndex = this.jogadoresAtivos.findIndex(ativo => ativo === true);
            this.gameOver(this.jogadoresAtivos.findIndex(ativo => ativo === true));
        } else {
            this.proximoJogador();
        }
        

    }

    gameOver(vencedorIndex){
        this.scene.stop('UI');
        this.scene.start('GameOver', {
            vencedor: vencedorIndex,
            pontuacao: vencedorIndex > -1 ? this.pontuacoes[vencedorIndex] : 0
        });
    }
}
