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


    entraNoJogo(x, y){
        this.position = {x, y};
        this.sprite.setPosition(
            x * this.scene.tamanhoCelula + this.scene.tamanhoCelula / 2,
            y * this.scene.tamanhoCelula + this.scene.tamanhoCelula / 2
        );
        this.sprite.setVisible(true);
    }


    playerMove(x, y){
        if(!this.position) return;

        this.position.x = x;
        this.position.y = y;
        this.sprite.x = x * this.scene.tamanhoCelula + this.scene.tamanhoCelula / 2;
        this.sprite.y = y * this.scene.tamanhoCelula + this.scene.tamanhoCelula / 2;
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