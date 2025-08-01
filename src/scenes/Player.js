export class Player {
    constructor(scene, id, cor, tamanhoCelula){
        this.scene = scene;
        this.id = id;
        this.pontos = 0;
        this.isAtivo = true;
        this.position = null;

        this.sprite = scene.add.circle(0, 0, tamanhoCelula / 4, cor)
        .setStrokeStyle(2, 0xffffff)
        .setVisible(false)
        .setDepth(2);
    }


    entraNoJogo(linha, coluna){
        this.position = {linha, coluna};
        const pos = this.scene.tabuleiro.getXY(linha, coluna);
        this.sprite.setPosition(pos.x, pos.y);
        this.sprite.setVisible(true);
    }


    playerMove(linha, coluna){
        if(!this.position) return;

        this.position.linha = linha;
        this.position.coluna = coluna;
        const pos = this.scene.tabuleiro.getXY(linha, coluna);
        this.sprite.setPosition(pos.x, pos.y);
    }

    somaPontos(pts){
        this.pontos += pts;
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