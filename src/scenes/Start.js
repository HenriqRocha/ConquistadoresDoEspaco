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
        //array para guardar os elementos 'pontuáveis'
        this.tabuleiroPontos = Array.from({ length: this.tamanhoLinhas }, () => Array(this.tamanhoColunas).fill(0));
        //array para colocar os elementos visuais
        this.marcadoresVisuais = Array.from({ length: this.tamanhoLinhas }, () => Array(this.tamanhoColunas).fill(null));
        this.playerPosition = null; //posição inicial
        this.player = null; //jogador visual
        this.movimentosRestantes = 0;
        this.pontuacao = 0;

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
    }
    
    update(){
        if (this.playerPosition && this.movimentosRestantes > 0){
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
        const novoX = (this.playerPosition.x + x + this.tamanhoColunas) % this.tamanhoColunas;
        const novoY = this.playerPosition.y + y;
        if(novoX >= 0 && novoX < this.tamanhoColunas && novoY >= 0 && novoY < this.tamanhoLinhas){
            //custo de movimento
            let custo = 1;

            if (y === 0){
                const linhaAtual = this.playerPosition.y;
                if (linhaAtual >= 3 && linhaAtual <= 5){
                    custo = 2;
                }else if (linhaAtual >= 6){
                    custo = 3;
                }
            }

            if (this.movimentosRestantes >= custo) {
                // só move se tiver movimentos suficientes
                this.playerPosition.x = novoX;
                this.playerPosition.y = novoY;

                this.player.x = this.playerPosition.x * this.tamanhoCelula + this.tamanhoCelula / 2;
                this.player.y = this.playerPosition.y * this.tamanhoCelula + this.tamanhoCelula / 2;
                this.movimentosRestantes -= custo;
                //pontuação
                const tipo = this.tabuleiroPontos[this.playerPosition.y][this.playerPosition.x];

                if (tipo === 'buraco'){//se o jogador cair na casa do buraco, ele morre
                    this.gameOver();
                    return;
                }

                let pontos = 0;
                if (tipo === 'terra' || tipo === 'nave'){
                    pontos = 4;
                }else if (tipo === 'planeta'){
                    if (this.playerPosition.y <= 2){
                        pontos = 1;
                    }else if (this.playerPosition.y <= 5){
                        pontos = 2;
                    }else{
                        pontos = 3;
                    }
                }

                if (pontos > 0){
                    this.movimentosRestantes = 0;
                    this.pontuacao += pontos;
                    const marcador = this.marcadoresVisuais[this.playerPosition.y][this.playerPosition.x];
                    if (marcador) {
                        marcador.destroy();//removendo elemento capturado
                        this.marcadoresVisuais[this.playerPosition.y][this.playerPosition.x] = null;
                    }
                    this.tabuleiroPontos[this.playerPosition.y][this.playerPosition.x] = 0;
                }
                this.events.emit('updateUI', this.movimentosRestantes, this.pontuacao);
            } 
        }
    }

    //movimentação mouse
    moveMouse(pointer){
        //virando posição na grade/matriz
        const gridX = Math.floor(pointer.x / this.tamanhoCelula);//coordenada do clique / tamanho das celulas =
        const gridY = Math.floor(pointer.y / this.tamanhoCelula);// coordenada em # das celulas
        
        //verificando se ta dentro do tabuleiro
        if(gridX >= 0 && gridX < this.tamanhoColunas && gridY >= 0 && gridY < this.tamanhoLinhas){
            //primeiro movimento
            if(!this.playerPosition){
                if(this.movimentosRestantes > 0 && gridY === 0){
                    this.playerPosition = {x: gridX, y: gridY};
                    this.player = this.add.circle(
                        gridX * this.tamanhoCelula + this.tamanhoCelula / 2,
                        gridY * this.tamanhoCelula + this.tamanhoCelula / 2,
                        this.tamanhoCelula / 4,
                        0x00d1b2
                    );
                    this.movimentosRestantes--;
                    this.events.emit('updateUI', this.movimentosRestantes, this.pontuacao);
                }
                return;
            }

            if(this.movimentosRestantes === 0) return;
            //movimento normal, pós primeiro
            const difX = gridX - this.playerPosition.x;
            const difY = gridY - this.playerPosition.y;

            const distanciaX = Math.abs(difX);
            const distanciaY = Math.abs(difY);

            //checando se a distância é de 1 casa apenas e não pode andar na diagonal
            const isAdjacente = (distanciaX === 1 && distanciaY === 0) ||
                                (distanciaX === 0 && distanciaY === 1) ||
                                (distanciaX === this.tamanhoColunas - 1 && distanciaY === 0);

            if(isAdjacente){
                this.move(difX, difY);
            }
        }
    }

    rolarDado(){
        if (this.movimentosRestantes === 0){
            this.movimentosRestantes = Phaser.Math.Between(1,6);
            this.events.emit('updateUI', this.movimentosRestantes, this.pontuacao);
        }
        
    }

    gameOver(){
        this.tweens.add({
            targets: this.player,
            alpha: 0,
            scale: 2,
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                this.scene.stop('UI');
                this.scene.start('GameOver');//para a cena com os botões etc 
                                            // e inicia a cena de fim de jogo
            }
        });
    }
}
