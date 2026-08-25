export class Player {

    constructor(scene, id, cor, tamanhoCelula) {

        this.scene = scene;
        this.id = id;
        this.pontos = 0;
        this.isAtivo = true;
        this.position = null;

        // Distância entre a nave e o ponto de emissão da fumaça
        this.distanciaFumaca = 15;

        // Emissor de partículas
        this.particulas = scene.add.particles(0, 0, 'naveET', {

            lifespan: {
                min: 350,
                max: 500
            },

            speed: {
                min: 20,
                max: 40
            },

            scale: {
                start: 0.3,
                end: 0
            },

            alpha: {
                start: 1,
                end: 0
            },

            quantity: 2,

            frequency: 50,

            blendMode: Phaser.BlendModes.ADD,

            emitting: false
        });

        this.particulas.setDepth(1001);

        // Cria a nave
        this.sprite = scene.add.image(
            0,
            0,
            `nave00${id + 1}`
        )
        .setScale(0.2)
        .setVisible(false);

        this.sprite.setDepth(1000);

        // Faz as partículas acompanharem a nave
        this.particulas.startFollow(this.sprite);

        this.pontoFumaca = scene.add.image(0, 0, 'naveET')
            .setVisible(false);

        this.particulas.startFollow(this.pontoFumaca);
    }


    getPosicaoNoCentro() {

        const raioDispersao = 35;

        const angulo =
            (this.id * (360 / 5)) *
            (Math.PI / 180);

        return {

            x:
                this.scene.tabuleiro.centroX +
                raioDispersao * Math.cos(angulo),

            y:
                this.scene.tabuleiro.centroY +
                raioDispersao * Math.sin(angulo),

            angulo: angulo
        };
    }


    posicionarNoCentroInicial() {

        const pos = this.getPosicaoNoCentro();

        this.sprite.setPosition(pos.x, pos.y);

        this.sprite.setVisible(true);

        this.sprite.setRotation(
            pos.angulo + Math.PI / 2
        );
    }


    entraNoJogo(linha, coluna) {

        const xAtual = this.sprite.x;
        const yAtual = this.sprite.y;

        this.position = {
            linha,
            coluna
        };

        const pos =
            this.scene.tabuleiro.getXY(linha, coluna);

        this.sprite.setVisible(true);

        const anguloMovimento =
            Phaser.Math.Angle.Between(
                xAtual,
                yAtual,
                pos.x,
                pos.y
            );

        this.atualizarRotacao(anguloMovimento);

        this.scene.tweens.add({

            targets: this.sprite,

            x: pos.x,
            y: pos.y,

            duration: 300,

            ease: 'Cubic.easeOut'
        });
    }

    playerMove(linha, coluna) {

    if (!this.position) return;

    const xAtual = this.sprite.x;
    const yAtual = this.sprite.y;

    this.position.linha = linha;
    this.position.coluna = coluna;

    const pos = this.scene.tabuleiro.getXY(linha, coluna);

    const anguloMovimento = Phaser.Math.Angle.Between(
        xAtual,
        yAtual,
        pos.x,
        pos.y
    );

    // Gira a nave para a direção do movimento
    this.atualizarRotacao(anguloMovimento);

    // As partículas saem na direção contrária ao movimento
    this.particulas.setAngle(
        Phaser.Math.RadToDeg(anguloMovimento) + 180
    );

    const distanciaFumaca = 15;

    this.particulas.setPosition(
        this.sprite.x - Math.cos(anguloMovimento) * distanciaFumaca,
        this.sprite.y - Math.sin(anguloMovimento) * distanciaFumaca
    );

    // Começa a emitir
    this.particulas.start();

    this.scene.tweens.add({
        targets: this.sprite,
        x: pos.x,
        y: pos.y,
        duration: 300,
        ease: 'Cubic.easeOut',

        onComplete: () => {
            console.log(
            `Jogador ${this.id}: PARANDO FUMAÇA`
            );

            this.particulas.stop();
            this.particulas.killAll();
        }
    });
}

    atualizarRotacao(anguloRad) {

        this.sprite.setRotation(
            anguloRad + Math.PI / 2
        );
    }


    somaPontos(pts) {

        this.pontos += pts;
    }


    retornaAoCentro() {

        this.position = null;

        this.sprite.setPosition(
            this.scene.tabuleiro.centroX,
            this.scene.tabuleiro.centroY
        );
    }


    elimina() {

        this.isAtivo = false;

        this.particulas.destroy();

        this.scene.tweens.add({

            targets: this.sprite,

            alpha: 0,
            scale: 0,

            duration: 500,

            ease: 'Power2'
        });
    }
}