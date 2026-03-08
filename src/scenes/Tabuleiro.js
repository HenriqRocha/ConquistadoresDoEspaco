export class Tabuleiro {

    constructor(scene){
        this.scene = scene;

        //área do jogdador e cálculo para área de jogo
        const larguraPainelLateral = 200;
        const larguraTabuleiro = scene.scale.width - larguraPainelLateral;
        const alturaTabuleiro = scene.scale.height;

        //definindo centro do tabuleiro
        this.centroX = larguraPainelLateral + (larguraTabuleiro / 2);
        this.centroY = alturaTabuleiro / 2;

        //definindo raio
        const raioMaximo = Math.min(larguraTabuleiro / 2, alturaTabuleiro / 2) * 0.95;

        this.raioInterno = 70;
        const raioUtilizavel = raioMaximo - this.raioInterno;

        //caracteristicas tabuleiro
        this.numeroDeLinhas = 12;
        this.numeroDeColunas = 12;
        this.distanciaEntreAneis = raioUtilizavel / (this.numeroDeLinhas - 1);

        //arrays de ponto
        this.tabuleiroPontos = Array.from({ length: this.numeroDeLinhas }, () => Array(this.numeroDeColunas).fill(0));
        this.marcadoresVisuais = Array.from({ length: this.numeroDeLinhas }, () => Array(this.numeroDeColunas).fill(null));

        //adiciona os elementos no array
        this.preencher();
    }

    preencher(){
        this.tabuleiroPontos[4][0] = 'terra';
        this.tabuleiroPontos[9][6] = 'nave';
        this.tabuleiroPontos[1][6] = 'planeta';
        this.tabuleiroPontos[7][5] = 'planeta';
        this.tabuleiroPontos[5][4] = 'planeta';
        this.tabuleiroPontos[1][2] = 'planeta';
        this.tabuleiroPontos[5][5] = 'buraco';
        this.tabuleiroPontos[3][9] = 'buraco';
        this.tabuleiroPontos[4][2] = 'buraco';
        this.tabuleiroPontos[8][4] = 'buraco';
        this.tabuleiroPontos[1][10] = 'planeta';
        this.tabuleiroPontos[7][11] = 'buraco';
        this.tabuleiroPontos[5][8] = 'planeta';
        this.tabuleiroPontos[5][1] = 'planeta';
        this.tabuleiroPontos[4][6] = 'planeta';
        this.tabuleiroPontos[9][0] = 'planeta';
        this.tabuleiroPontos[4][12] = 'planeta';
        this.tabuleiroPontos[8][10] = 'planeta';
        this.tabuleiroPontos[4][12] = 'planeta';
        this.tabuleiroPontos[9][3] = 'planeta';
        this.tabuleiroPontos[9][9] = 'planeta';
        this.tabuleiroPontos[8][7] = 'planeta';
    }

    iniciaTabuleiro(){
        this.desenhaTabuleiro();
        this.mostraItens();
    }

    //converter linha e coluna em posição na tela x y
    getXY(linha, coluna){
        const raio = this.raioInterno + (linha * this.distanciaEntreAneis);
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
        //desenha os circulos
        for(let i = 0; i < this.numeroDeLinhas; i++){
            if (i == 3 || i == 7 || i == 11){//circulos de zonas
                this.scene.add.circle(this.centroX, this.centroY, (i + 1) * this.distanciaEntreAneis).setStrokeStyle(3, 0xff0000, 0.8). setDepth(1);

                console.log((i + 1) * this.distanciaEntreAneis);

                const raioAtual = (i + 1) * this.distanciaEntreAneis;

                console.log(`Raio: ${raioAtual}`);             
            }
            //circulos brancos
            this.scene.add.circle(this.centroX, this.centroY, (i + 1) * this.distanciaEntreAneis).setStrokeStyle(2, 0xffffff, 0.5). setDepth(0);
        }

        const raioMax = this.raioInterno + ((this.numeroDeLinhas - 1) * this.distanciaEntreAneis);
        for (let i = 0; i < this.numeroDeColunas; i++){
            const angulo = Phaser.Math.DegToRad(i * (360 / this.numeroDeColunas));

            const xInicio = this.centroX + this.raioInterno * Math.cos(angulo);
            const yInicio = this.centroY + this.raioInterno * Math.sin(angulo);
            
            const xFim = this.centroX + raioMax * Math.cos(angulo);
            const yFim = this.centroY + raioMax * Math.sin(angulo);
            
            this.scene.add.line(0, 0, xInicio, yInicio, xFim, yFim, 0xffffff, 0.3)
                .setOrigin(0)
                .setDepth(0);
        }

        console.log(this.centroX);
        console.log(this.centroY);

    }

    // Dentro da classe Tabuleiro
    desenharZonasVermelhas() {
        const centerX = 400;
        const centerY = 300; 
        const g = this.scene.add.graphics();

        // Raios das duas zonas vermelhas do modelo do professor
        const raios = [180, 280]; 

        raios.forEach(raio => {
            // Camada 1: Brilho externo (Grosso e bem transparente)
            g.lineStyle(12, 0xff0000, 0.2);
            g.strokeCircle(centerX, centerY, raio);

            // Camada 2: Centro da linha (Mais fina e nítida)
            g.lineStyle(3, 0xff0000, 0.5);
            g.strokeCircle(centerX, centerY, raio);
        });
    }

    mostraItens(){

        for (let linha = 0; linha < this.numeroDeLinhas; linha++){
            for (let coluna = 0; coluna < this.numeroDeColunas; coluna++){
                const tipo = this.getItem(linha, coluna);
                if(!tipo) continue;

                const pos = this.getXY(linha, coluna);
                let marcador = null;

                if (tipo === 'terra') {
                    marcador = this.scene.add.image(pos.x, pos.y, 'terra'); 
                    if (marcador) {
                        marcador.setDepth(1);
                        this.marcadoresVisuais[linha][coluna] = marcador;

                        // Adiciona o giro se for planeta ou buraco negro
                        if (tipo === 'planeta' || tipo === 'buraco' || tipo == 'terra') {
                            this.scene.tweens.add({
                                targets: marcador,
                                angle: 360,          
                                duration: 10000,      
                                repeat: -1,         
                                ease: 'Linear'       
                            });
                        }
                    }         
                }
                else if(tipo === 'nave'){
                    marcador = this.scene.add.image(pos.x, pos.y, 'naveET');
                    if (marcador) {
                        marcador.setDepth(1);
                        this.marcadoresVisuais[linha][coluna] = marcador;

                        // Adiciona o giro se for planeta ou buraco negro
                        if (tipo === 'planeta' || tipo === 'buraco' || 'naveET') {
                            this.scene.tweens.add({
                                targets: marcador,
                                angle: 360,          
                                duration: 10000,      
                                repeat: -1,         
                                ease: 'Linear'       
                            });
                        }
                    }
                }
                else if(tipo === 'planeta'){
                    console.log(linha)

                    if (linha < 3){
                        marcador = this.scene.add.image(pos.x, pos.y, 'planeta-verde');
                    } else if(linha < 7){
                        marcador = this.scene.add.image(pos.x, pos.y, 'planeta-amarelo')
                    } else if(linha > 6){
                        marcador = this.scene.add.image(pos.x, pos.y, 'planeta-vermelho')
                    }
                    
                    

                    marcador.setScale(0.8); // Ajuste o valor conforme necessário
                    
                    if (marcador) {
                        marcador.setDepth(1);
                        this.marcadoresVisuais[linha][coluna] = marcador;

                        if (tipo === 'planeta' || tipo === 'buraco') {
                            this.scene.tweens.add({
                                targets: marcador,
                                angle: 360,          
                                duration: 10000,      
                                repeat: -1,         
                                ease: 'Linear'       
                            });
                        }
                    }
                }
                else if (tipo === 'buraco'){
                    marcador = this.scene.add.image(pos.x, pos.y, `buracoNegro`);
                    marcador.setScale(0.8); 
                    
                    if (marcador) {
                        marcador.setDepth(1);
                        this.marcadoresVisuais[linha][coluna] = marcador;

                        
                        if (tipo === 'planeta' || tipo === 'buraco') {
                            this.scene.tweens.add({
                                targets: marcador,
                                angle: 360,          
                                duration: 10000,     
                                repeat: -1,
                                ease: 'Linear'      
                            });
                        }
                    }
                }

                if (marcador){
                    marcador.setDepth(1);
                    this.marcadoresVisuais[linha][coluna] = marcador;
                }
            }
        }
    }
}