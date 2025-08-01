export class Tabuleiro {

    constructor(scene){
        this.scene = scene;

        //caracteristicas tabuleiro
        this.centroX = scene.scale.width / 2;
        this.centroY = scene.scale.height / 2 - 50;
        this.numeroDeLinhas = 9;
        this.numeroDeColunas = 12;
        this.distanciaEntreAneis = 60;

        //arrays de ponto
        this.tabuleiroPontos = Array.from({ length: this.numeroDeLinhas }, () => Array(this.numeroDeColunas).fill(0));
        this.marcadoresVisuais = Array.from({ length: this.numeroDeLinhas }, () => Array(this.numeroDeColunas).fill(null));

        //adiciona os elementos no array
        this.preencher();
    }

    preencher(){
        this.tabuleiroPontos[6][0] = 'terra';
        this.tabuleiroPontos[0][6] = 'nave';
        this.tabuleiroPontos[1][3] = 'planeta';
        this.tabuleiroPontos[3][1] = 'planeta';
        this.tabuleiroPontos[5][4] = 'planeta';
        this.tabuleiroPontos[0][2] = 'planeta';
        this.tabuleiroPontos[5][5] = 'buraco';
        this.tabuleiroPontos[2][9] = 'buraco';
        this.tabuleiroPontos[4][7] = 'planeta';
        this.tabuleiroPontos[6][11] = 'buraco';
        this.tabuleiroPontos[3][8] = 'planeta';
    }

    iniciaTabuleiro(){
        this.desenhaTabuleiro();
        this.mostraItens();
    }

    //converter linha e coluna em posição na tela x y
    getXY(linha, coluna){
        const raio = (linha + 1) * this.distanciaEntreAneis;
        //achando o angulo por coluna
        const angulo = Phaser.Math.DegToRad(coluna * (360 / this.numeroDeColunas));

        const x = this.centroX + raio * Math.cos(angulo);
        const y = this.centroY + raio * Math.sin(angulo);
        return { x, y };
    }

    //retorna item
    getItem(linha, coluna){
        if (linha < 0 || linha >= this.numeroDeLinhas || coluna < 0 || coluna >= this.numeroDeColunas) {
            return null;
        }
        return this.tabuleiroPontos[linha][coluna];
    }

    removeItem(linha, coluna){
        const marcador = this.marcadoresVisuais[linha][coluna];
        if(marcador){
            marcador.destroy();
            this.marcadoresVisuais[linha][coluna] = null;
        }
        this.tabuleiroPontos[linha][coluna] = 0;
    }

    desenhaTabuleiro(){
        //desenha os circulos brancos
        for(let i = 0; i < this.numeroDeLinhas; i++){
            this.scene.add.circle(this.centroX, this.centroY, (i + 1) * this.distanciaEntreAneis).setStrokeStyle(1, 0xffffff, 0.5). setDepth(0);
        }

        const raioMaximo = this.numeroDeLinhas * this.distanciaEntreAneis;
        for (let i = 0; i < this.numeroDeColunas; i++){
            const angulo = Phaser.Math.DegToRad(i * (360 / this.numeroDeColunas));
            const x = this.centroX + raioMaximo * Math.cos(angulo);
            const y = this.centroY + raioMaximo * Math.sin(angulo);
            this.scene.add.line(0, 0, this.centroX, this.centroY, x, y, 0xffffff, 0.5).setOrigin(0).setDepth(0);
        }

        //divisão de zonas
        this.scene.add.circle(this.centroX, this.centroY, 2.5 * this.distanciaEntreAneis).setStrokeStyle(3, 0xff0000, 0.8).setDepth(1);
        this.scene.add.circle(this.centroX, this.centroY, 5.5 * this.distanciaEntreAneis).setStrokeStyle(3, 0xff0000, 0.8).setDepth(1);
    }

    mostraItens(){
        for (let linha = 0; linha < this.numeroDeLinhas; linha++){
            for (let coluna = 0; coluna < this.numeroDeColunas; coluna++){
                const tipo = this.getItem(linha, coluna);
                if(!tipo) continue;

                const pos = this.getXY(linha, coluna);
                let marcador = null;

                if (tipo === 'terra') {
                    marcador = this.scene.add.circle(pos.x, pos.y, 20, 0x0000ff);
                }
                else if(tipo === 'nave'){
                    marcador = this.scene.add.star(pos.x, pos.y, 5, 10, 20, 0xffff00);
                }
                else if(tipo === 'planeta'){
                    marcador = this.scene.add.circle(pos.x, pos.y, 15, 0x00ff00);
                }
                else if (tipo === 'buraco'){
                    marcador = this.scene.add.circle(pos.x, pos.y, 25, 0x480d6a);
                }

                if (marcador){
                    marcador.setDepth(1);
                    this.marcadoresVisuais[linha][coluna] = marcador;
                }
            }
        }
    }
}