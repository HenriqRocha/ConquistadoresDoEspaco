// src/scenes/RegrasScene.js
export class RegrasScene extends Phaser.Scene {
    constructor() {
        super('RegrasScene');
    }

    preload() {
        this.load.image('telaMenu', 'assets/outros/telaRegras.png');
    }

    create() {
        // 1. Adicionar o fundo
        this.add.image(0, 0, 'telaMenu').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height);

        // 2. Criar o botão "Voltar" 
        const botaoVoltar = this.add.graphics();
        botaoVoltar.fillStyle(0x184085, 1); 
        botaoVoltar.fillRoundedRect(0, 0, 200, 50, 10);
        botaoVoltar.setInteractive(new Phaser.Geom.Rectangle(0, 0, 200, 50), Phaser.Geom.Rectangle.Contains);

        const textoVoltar = this.add.text(150, -15, "VOLTAR", {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        
        const containerVoltar = this.add.container(this.scale.width / 2 - 100, this.scale.height - 100 - 40, [botaoVoltar, textoVoltar]);
        containerVoltar.setDepth(-1); 

        // 3. Lógica do clique (Voltar ao Menu)
        botaoVoltar.on('pointerdown', () => {
            botaoVoltar.fillStyle(0x0E0E45, 1); 
        });

        botaoVoltar.on('pointerup', () => {
            botaoVoltar.fillStyle(0x184085, 1); 
            this.scene.start('MenuScene'); 
        });


        this.musica = this.sound.get('spaceConquerors');

        if (!this.musica) {
            this.musica = this.sound.add('spaceConquerors', { volume: 0.5, loop: true });
            this.musica.play();
        }

        this.iconAudio = this.add.image(240, 30, 'audioAberto').setScale(0.1).setInteractive();
        this.iconAudio.setInteractive({ cursor: 'pointer' });

        // Sincroniza o ícone do jogo com o estado atual da música vinda do menu
        if (this.musica.isPlaying) {
            this.iconAudio.setTexture('audioAberto');
        } else {
            this.iconAudio.setTexture('audioFechado');
        }

        // O mesmo botão agora controla perfeitamente a música global
        this.iconAudio.on('pointerdown', () => {
            if (this.musica.isPlaying) {
                this.musica.pause();
                this.iconAudio.setTexture('audioFechado');
            } else {
                this.musica.resume();
                this.iconAudio.setTexture('audioAberto');
            }
        });

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'fundoRegras');

        // 2. Definição das Páginas de Texto baseadas no seu manual
        this.paginasRegras = [
            // Página 1: Introdução
            "A GALÁXIA PITÁGORUS\n\nO planeta Rubick se encontra no centro da galáxia Pitágorus. Devido à sua avançada tecnologia, ele se tornou a base da corrida pela conquista do espaço.",
            
            // Página 2: Cinturões Magnéticos
            "CINTURÕES MAGNÉTICOS\n\nOs dois cinturões magnéticos presentes destacados pela cor vermelha possuem efeitos imprevisíveis. Ao passar por eles, o jogador sofrerá o efeito de uma carta aleatória.",
            
            // Página 3: Regras de Movimentação e Dados
            "\nMOVIMENTAÇÃO\n\n1ª REGRA: O lançamento do dado definirá quantas órbitas ou setores a nave poderá se deslocar.\n\n2ª REGRA: É permitido mudar de órbita apenas pelas pontes de transição cósmica.",
            
            // Página 4: Conquistas de Planetas
            "\n\nCONQUISTAS E COMBATES\n\n3ª REGRA: Para conquistar um planeta, o jogador deve parar exatamente na casa dele.\n\n4ª REGRA: Se cair na mesma casa de outro jogador, ocorre um combate espacial!",
            
            // Página 5: Fim de Jogo e Pontuação
            "\n\nPONTUAÇÃO E VITÓRIA\n\nPlaneta Terra e Nave Extraterrestre: 4 pontos.\nZona Exterior: 3 pontos | Zona Neutra: 2 pontos | Zona Segura: 1 ponto.\n\nVence quem somar mais pontos ao conquistar todos os planetas!"
        ];

        this.paginaAtual = 0;

        const container = this.add.graphics();

        // Define a cor de preenchimento (Azul bem escuro) e a opacidade (0.85 = 85%)
        container.fillStyle(0x0d122b, 0.85);

        // Desenha um retângulo com cantos arredondados
        // Parâmetros: (X inicial, Y inicial, Largura, Altura, Raio dos cantos)
        // Centralizado na tela de largura 800 (aproximadamente)
        container.fillRoundedRect(180, 200, 840, 600, 16);

        // Opcional: Adicionar uma borda neon fina ao redor do container para combinar com o jogo
        container.lineStyle(2, 0x00ffff, 0.5);
        container.strokeRoundedRect(180, 200, 840, 600, 16);

        // 3. Objeto de Texto Principal (Configurado com Wrap para quebrar linha automaticamente)
        this.textoRegras = this.add.text(this.scale.width / 2, 380, this.paginasRegras[this.paginaAtual], {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'normal',
            align: 'center',
            wordWrap: { width: 600, useAdvancedWrap: true }, // Impede o texto de sair pelas laterais
            lineSpacing: 10
        }).setOrigin(0.5);

        // 4. Indicador do Número da Página (Ex: "Pág. 1 de 5")
        this.textoContador = this.add.text(this.scale.width / 2, 780, `Página ${this.paginaAtual + 1} de ${this.paginasRegras.length}`, {
            fontSize: '20px',
            fill: '#888888'
        }).setOrigin(0.5);

        // 5. Criação das Setas de Navegação Dinâmicas
        // Seta Esquerda (Anterior)
        this.setaEsquerda = this.add.text(this.scale.width / 2 - 120, 780, '◀', { fontSize: '28px', fill: '#00ffff' })
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' });

        // Seta Direita (Próxima)
        this.setaDireita = this.add.text(this.scale.width / 2 + 120, 780, '▶', { fontSize: '28px', fill: '#00ffff' })
            .setOrigin(0.5)
            .setInteractive({ cursor: 'pointer' });

        // Eventos de clique para navegar pelas páginas
        this.setaEsquerda.on('pointerdown', () => this.mudarPagina(-1));
        this.setaDireita.on('pointerdown', () => this.mudarPagina(1));

        // Atualiza o estado inicial das setas (esconder a esquerda na primeira página)
        this.atualizarBotoesNavegacao();

        // 6. Botão invisível sobreposto ao "VOLTAR" da imagem de fundo
        const botaoVoltarInvisivel = this.add.zone(this.scale.width / 2, 725, 300, 60).setInteractive({ cursor: 'pointer' });
        botaoVoltarInvisivel.on('pointerup', () => {
            this.scene.start('MenuScene');
        });
    }

    // Função interna para trocar o texto de forma limpa
    mudarPagina(direcao) {
        this.paginaAtual += direcao;
        
        // Atualiza o texto e o contador na tela
        this.textoRegras.setText(this.paginasRegras[this.paginaAtual]);
        this.textoContador.setText(`Página ${this.paginaAtual + 1} de ${this.paginasRegras.length}`);
        
        // Desabilita as setas se chegou nos limites
        this.atualizarBotoesNavegacao();
    }

    atualizarBotoesNavegacao() {
        // Se for a primeira página, esconde a seta esquerda
        if (this.paginaAtual === 0) {
            this.setaEsquerda.setVisible(false);
        } else {
            this.setaEsquerda.setVisible(true);
        }

        // Se for a última página, esconde a seta direita
        if (this.paginaAtual === this.paginasRegras.length - 1) {
            this.setaDireita.setVisible(false);
        } else {
            this.setaDireita.setVisible(true);
        }
    }
}