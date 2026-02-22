export class Player {
    constructor(scene, id, cor, tamanhoCelula){
        this.scene = scene;
        this.id = id;
        this.pontos = 0;
        this.isAtivo = true;
        this.position = null;

        this.sprite = scene.add.image(0, 0, `nave00${id + 1}`)
        .setScale(0.2)
        .setVisible(false)
        .setDepth(2)
    }

    getPosicaoNoCentro() {
        const raioDispersao = 35; 
        const angulo = (this.id * (360 / 5)) * (Math.PI / 180);

        return {
            x: this.scene.tabuleiro.centroX + raioDispersao * Math.cos(angulo),
            y: this.scene.tabuleiro.centroY + raioDispersao * Math.sin(angulo),
            angulo: angulo
        };
    }

    posicionarNoCentroInicial() {
        const pos = this.getPosicaoNoCentro();
        this.sprite.setPosition(pos.x, pos.y);
        this.sprite.setVisible(true);
        this.sprite.setRotation(pos.angulo + Math.PI / 2);
    }


    entraNoJogo(linha, coluna){
        const xAtual = this.sprite.x;
        const yAtual = this.sprite.y;

        this.position = {linha, coluna};
        const pos = this.scene.tabuleiro.getXY(linha, coluna);
        //this.sprite.setPosition(pos.x, pos.y);
        this.sprite.setVisible(true);

        const anguloMovimento = Phaser.Math.Angle.Between(xAtual, yAtual, pos.x, pos.y);
        this.atualizarRotacao(anguloMovimento);

        this.scene.tweens.add({
            targets: this.sprite,
            x: pos.x,
            y: pos.y,
            duration: 300,
            ease: 'Cubic.easeOut',
        });
    }


    playerMove(linha, coluna){
        if(!this.position) return;

        const xAtual = this.sprite.x;
        const yAtual = this.sprite.y;

        this.position.linha = linha;
        this.position.coluna = coluna;
        const pos = this.scene.tabuleiro.getXY(linha, coluna);

        const anguloMovimento = Phaser.Math.Angle.Between(xAtual, yAtual, pos.x, pos.y);
        this.atualizarRotacao(anguloMovimento);

        this.scene.tweens.add({
            targets: this.sprite,
            x: pos.x,
            y: pos.y,
            duration: 300,
            ease: 'Cubic.easeOut',
        });
    }

    atualizarRotacao(anguloRad) {
        this.sprite.setRotation(anguloRad + Math.PI / 2);
    }

    somaPontos(pts){
        this.pontos += pts;
    }

    retornaAoCentro(){
        this.position = null;
        this.sprite.setPosition(this.scene.tabuleiro.centroX, this.scene.tabuleiro.centroY);
    }

    elimina(){
        this.isAtivo = false;
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0,
            duration: 500,
            ease: 'Power2'
        });
    }
}