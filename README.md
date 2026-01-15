# Conquistadores do Espaço

Conquistadores do Espaço é um jogo de tabuleiro digital com temática espacial, desenvolvido utilizando o framework Phaser. O diferencial técnico do projeto é o seu tabuleiro circular dinâmico, onde os jogadores navegam em órbitas ao redor de um planeta central utilizando coordenadas polares.

## Como Jogar

### Entrada
No primeiro turno, após rolar o dado, clique em qualquer casa do anel mais externo (Linha 0) para entrar no jogo.

### Movimentação
Você pode se mover em quatro direções:

*   **Horário/Anti-horário:** Navegue pelo anel atual.
*   **Dentro/Fora:** Mude para uma órbita mais próxima ou mais distante do centro.

### Zonas e Custos
O tabuleiro é dividido em 3 zonas. Quanto mais perto do centro, maior o custo de movimento lateral.

### Objetivo
Colete planetas, naves e chegue à Terra para somar pontos.

### Perigo
Evite os Buracos Negros, eles eliminam o jogador instantaneamente!

### Vitória
O jogo termina quando todos os itens são coletados. Em caso de empate, vence quem retornar primeiro ao centro.

## Tecnologias Utilizadas

*   **Phaser 3:** Framework para jogos HTML5.
*   **JavaScript (ES6+):** Lógica de programação e POO.
*   **Matemática Trigonométrica:** Para cálculos de posicionamento radial (Seno e Cosseno).

# Arquivos do Jogo

## 1. Documentação Técnica: Start.js

Este documento detalha as funcionalidades, a lógica de movimentação e o fluxo de jogo implementados na cena principal do jogo Conquistadores do Espaço.

### 1. Visão Geral da Cena

A classe `Start` é o motor principal do jogo. Ela gerencia a integração entre o tabuleiro circular (`Tabuleiro.js`), as entidades dos jogadores (`Player.js`) e a interface de usuário (`UI.js`).

#### Principais Dependências

*   `Player.js`: Gerencia o estado individual e a representação visual do jogador.
*   `Tabuleiro.js`: Define a geometria circular, as posições dos itens e as coordenadas espaciais (X, Y).

### 2. Inicialização e Estado do Jogo

No método `create()`, o jogo define seu estado inicial:

*   **Contagem de Objetivos:** Percorre o tabuleiro para contar quantos itens coletáveis existem (`objetosDePontuacaoRestantes`).

*   **Estados de Turno (`estadoTurno`):**
    *   `AGUARDANDO_JOGADA`: Início do turno, antes do dado ser rolado.
    *   `MOVENDO`: Jogador possui pontos de movimento e está agindo.
    *   `EVENTO_CARTA`: Estado momentâneo enquanto uma carta de zona é processada.
    *   `DESEMPATE`: Estado final onde o objetivo muda para "Corrida ao Centro".

### 3. Sistema de Movimentação Circular

A movimentação utiliza um sistema de coordenadas polares composto por Anéis (Linhas) e Segmentos (Colunas).

#### Direções Logísticas

*   `dentro`: Reduz o índice da linha (move-se para um anel mais interno).
*   `fora`: Aumenta o índice da linha (move-se para um anel mais externo).
*   `horario`: Aumenta a coluna (movimento circular à direita).
*   `anti-horario`: Diminui a coluna (movimento circular à esquerda).

#### Custos de Movimento e Zonas

O método `getZona(linha)` divide o tabuleiro em 3 regiões:

*   **Zona 1 (Interna):** Custo lateral = 1.
*   **Zona 2 (Intermediária):** Custo lateral = 2.
*   **Zona 3 (Externa):** Custo lateral = 3.

*Nota: Movimentos de 'dentro' e 'fora' sempre custam 1.*

#### Restrição de Fronteira

Existe uma trava lógica que impede o movimento lateral exatamente nas linhas de transição de zona (linhas 3 e 7), forçando o jogador a entrar na nova zona antes de orbitar.

### 4. Sistema de Eventos (Baralho de Cartas)

Sempre que um jogador muda de zona (ex: sai da Zona 1 para a Zona 2), o método `acionarEventoCarta()` é disparado.

#### Tipos de Efeitos

*   `GIRO`: Desloca o jogador um número específico de colunas (30°, 60°, até 180°). Inclui uma lógica de segurança que procura a próxima casa livre caso o destino esteja ocupado.
*   `REFLEXAO`: Espelha a posição do jogador em relação a retas imaginárias (R1 ou R4).
*   `PERDE_MOVIMENTO_RESTANTE`: Interrompe o turno do jogador imediatamente.
*   `NENHUM_EFEITO`: Cartas de "turbulência" que não alteram o estado.

### 5. Lógica de Clique e Proximidade (`moveMouse`)

Como o tabuleiro é circular, o clique do mouse não corresponde a uma grade simples.

*   O sistema calcula a distância entre o clique do mouse e as posições (X, Y) dos vizinhos possíveis do jogador.
*   O vizinho com a menor distância é selecionado.
*   Se o clique estiver dentro de um raio de tolerância (75% da distância entre anéis), o movimento é executado.

### 6. Fim de Jogo e Desempate

#### Condição de Vitória Normal

Acontece quando todos os itens do mapa são coletados. O sistema calcula quem tem a maior pontuação.

#### Lógica de Desempate (`DESEMPATE`)

Se dois ou mais jogadores terminarem com a mesma pontuação máxima:

*   O jogo entra no estado `DESEMPATE`.
*   Jogadores que não estão no empate são eliminados visualmente.
*   O objetivo muda: o primeiro jogador empatado que conseguir chegar à Linha 0 e mover para 'dentro' (voltando ao centro do tabuleiro) vence instantaneamente.

### 7. Métodos Auxiliares

*   `isOcupado(linha, coluna)`: Garante a regra de que dois jogadores não ocupam o mesmo espaço.
*   `verificarCasaEContinuar`: Centraliza a detecção de buracos negros, coleta de itens e atualização de pontos.
*   `getPontuacoesArray`: Formata os dados de pontuação dos jogadores para a interface (UI).

## 2. Documentação Técnica: Player.js

Este documento detalha as funcionalidades da classe `Player`, responsável por gerenciar o estado individual, a pontuação e a representação visual dos jogadores no ambiente circular.

### 1. Visão Geral da Classe

A classe `Player` funciona como um "modelo de dados vivo". Ela não apenas armazena informações (como pontos e posição), mas também controla o objeto visual (`Phaser.GameObjects.Arc`) associado ao jogador, garantindo que a representação na tela esteja sempre sincronizada com a lógica do jogo.

### 2. Propriedades do Objeto

Ao ser instanciado, cada jogador possui as seguintes propriedades:

*   `scene`: Referência à cena principal (`Start`), permitindo acesso ao motor de tweens e ao objeto tabuleiro.
*   `id`: Identificador numérico único.
*   `pontos`: Acumulador da pontuação atual.
*   `isAtivo`: Booleano que indica se o jogador ainda está na partida ou se foi eliminado.
*   `position`: Objeto contendo `{linha, coluna}`. É iniciado como `null` enquanto o jogador está fora do tabuleiro.
*   `sprite`: O objeto gráfico (círculo colorido) renderizado pelo Phaser.

### 3. Gerenciamento de Posição e Movimento

Diferente de sistemas de grade simples, a classe `Player` depende da integração com o `Tabuleiro.js` para converter coordenadas polares em cartesianas.

#### `entraNoJogo(linha, coluna)`

Utilizado no primeiro movimento do jogador:

*   Define a `position` lógica.
*   Solicita ao tabuleiro o cálculo de X e Y baseados no anel (`linha`) e segmento (`coluna`).
*   Teleporta o `sprite` para o ponto de entrada e o torna visível.

#### `playerMove(linha, coluna)`

Atualiza a localização do jogador durante o turno:

*   Atualiza os índices internos de linha e coluna.
*   Re-calcula a posição espacial (X, Y) e move o `sprite` instantaneamente.

#### `retornaAoCentro()`

Utilizado especificamente na lógica de Desempate:

*   Limpa a posição lógica (`null`).
*   Move o `sprite` para as coordenadas centrais do tabuleiro (`centroX`, `centroY`), sinalizando a vitória ou o fim da corrida.

### 4. Lógica de Pontuação e Estado

#### `somaPontos(pts)`

Incrementa o atributo `pontos`. Esta mudança é refletida na interface (UI) através do evento disparado pela cena `Start` que consulta este valor.

#### `elimina()`

Gerencia a saída do jogador da partida (seja por derrota ou fim de jogo):

*   Define `isAtivo` como `false`.
*   Executa um **Tween de Desintegração:** o `sprite` diminui de escala (`scale: 0`) e desaparece (`alpha: 0`) suavemente em 500ms, utilizando a transição `Power2` para um efeito visual elegante.

### 5. Notas de Implementação

*   **Profundidade (Depth):** O `sprite` é fixado no `setDepth(2)`, garantindo que ele sempre apareça acima das casas do tabuleiro e dos itens coletáveis.
*   **Acoplamento:** A classe é altamente dependente de um objeto tabuleiro na cena pai que possua o método `getXY(linha, coluna)`.

## 3. Documentação Técnica: Tabuleiro.js

Este documento detalha as funcionalidades da classe `Tabuleiro`, responsável por gerenciar a geometria circular, a renderização dos anéis orbitais e a conversão de coordenadas lógicas em posições espaciais (X, Y).

### 1. Visão Geral da Classe

O `Tabuleiro` não é uma cena do Phaser, mas uma classe auxiliar de suporte à cena `Start`. Sua principal função é abstrair a complexidade da matemática de coordenadas polares, permitindo que o restante do código trate o tabuleiro como uma matriz de "Linhas" (Anéis) e "Colunas" (Segmentos angulares).

### 2. Geometria e Espaçamento

A classe utiliza um sistema de coordenadas polares onde:

*   **Linha (Ring):** Representa a distância do centro (raio).
*   **Coluna (Segment):** Representa o ângulo em relação ao eixo horizontal.

#### Cálculo de Centro e Raio

O tabuleiro é deslocado para a direita para acomodar um painel lateral de 300px:

*   `CentroX`: `larguraPainelLateral + (larguraDisponivel / 2)`
*   `CentroY`: `alturaTotal / 2`
*   `Raio Máximo`: 95% da menor dimensão disponível para garantir que o tabuleiro caiba na tela.

### 3. Métodos Principais

#### `getXY(linha, coluna)`

É a função matemática central da classe. Converte as coordenadas lógicas em pixels:

*   **Cálculo do Raio:** `(linha + 1) * distanciaEntreAneis`.
*   **Cálculo do Ângulo:** Converte o índice da coluna em radianos:

    $$\text{ângulo} = \text{coluna} \times \left(\frac{360}{\text{numeroDeColunas}}\right) \times \frac{\pi}{180}$$

*   **Conversão:**

$$
\begin{aligned}
X &= \text{centroX} + \text{raio} \times \cos(\text{ângulo}) \\
Y &= \text{centroY} + \text{raio} \times \sin(\text{ângulo})
\end{aligned}
$$

#### `desenhaTabuleiro()`

Renderiza a estrutura visual do mapa:

*   **Anéis:** Desenha círculos concêntricos brancos com opacidade reduzida.
*   **Divisões de Zona:** Os anéis de índice 3 e 7 são destacados em vermelho com espessura maior, sinalizando as fronteiras onde o movimento lateral é restrito.
*   **Linhas Radiais:** Desenha linhas que partem do centro até o raio máximo, dividindo o tabuleiro em 12 fatias iguais.

#### `mostraItens()`

Popula o tabuleiro visualmente com base na matriz `tabuleiroPontos`:

*   **Terra/Nave/Buraco:** Utiliza formas geométricas básicas (`circle`, `star`).
*   **Planetas:** Utiliza um sistema de texturas dinâmicas carregadas no Preloader, alternando entre as imagens `sun001` até `sun026` para garantir variedade visual.

### 4. Gestão de Dados

A classe mantém dois arrays bidimensionais sincronizados de 12x12:

*   `tabuleiroPontos`: Armazena strings indicando o tipo de conteúdo da casa (`'planeta'`, `'buraco'`, etc).
*   `marcadoresVisuais`: Armazena as referências aos objetos de imagem/forma do Phaser para permitir a destruição imediata via `removeItem()` quando um jogador coleta um item.

### 5. Notas de Implementação

*   **Zonas de Custo:** Embora o custo de movimento seja validado na `Start.js`, as linhas vermelhas desenhadas aqui nos índices 3 e 7 servem como feedback visual essencial para o jogador.
*   **Profundidade (Depth):**
    *   Fundo/Grade: `setDepth(0)`
    *   Fronteiras de Zona: `setDepth(1)`
    *   Itens/Coletáveis: `setDepth(1)`
*   **Performance:** Os cálculos trigonométricos são realizados apenas no momento do posicionamento, não sobrecarregando o loop de atualização (`update`) do jogo.

## 4. Documentação Técnica: UI.js

Este documento detalha as funcionalidades da classe `UI`, responsável por gerenciar a Interface de Usuário (HUD), exibir informações em tempo real e processar os inputs globais de comando (como o lançamento de dados).

### 1. Visão Geral da Cena

A cena `UI` opera de forma paralela e sobreposta à cena `Start`. Sua principal característica é a imobilidade: enquanto o tabuleiro pode ser explorado ou movido, a interface permanece fixa em um painel lateral, garantindo que o jogador sempre tenha acesso aos seus status.

### 2. Layout e Geometria

A interface utiliza um sistema de Painel Lateral Esquerdo para organizar as informações de forma vertical (empilhada).

*   **Largura do Painel:** 300 pixels fixos.
*   **Divisor Visual:** Uma linha vertical branca com 50% de opacidade (`graphics`) separa a área de controle da área de jogo (tabuleiro).
*   **Stacking (Empilhamento):** Utiliza uma variável local `atualY` que incrementa após a criação de cada elemento, garantindo espaçamento consistente e facilitando a adição de novos itens no futuro.

### 3. Elementos de Interface

#### Informações de Turno

*   `textoJogadorAtual`: Exibe qual astronauta possui o controle no momento (ex: "Vez do jogador 1").
*   `textoMovimento`: Exibe o valor resultante do dado ou quantos passos o jogador ainda pode dar no anel atual.

#### Interação (Botão de Dado)

*   `botaoDado`: Um objeto de texto interativo com fundo colorido (`#222222`).
*   **Comportamento:** Ao ser clicado, ele não executa a lógica do dado diretamente; em vez disso, ele emite um sinal (`events.emit('rolarDado')`) que a cena `Start` captura para processar o valor aleatório.

#### Painel de Pontuações

*   `textosPontuacao`: Um array dinâmico que gera uma linha de texto para cada jogador ativo no jogo, permitindo que todos vejam o progresso dos competidores simultaneamente.

### 4. Comunicação e Eventos

#### O Mecanismo de "Handshake" (Aperto de Mão)

Para evitar erros de sincronização (onde a lógica tenta atualizar um texto que ainda não foi criado), a UI implementa:

*   `uiPronta`: Ao final do método `create()`, a cena emite este evento avisando que todos os textos já existem na memória.
*   `updateTurno`: A UI ouve este evento vindo da cena `Start`. Ele carrega três informações vitais:
    *   O índice do jogador atual.
    *   O array completo de pontuações.
    *   O número de movimentos restantes.

#### Inputs Globais

Além do clique no botão, a classe configura um listener para a tecla `ESPAÇO`, permitindo que o jogador role o dado de forma mais rápida via teclado.

### 5. Notas de Implementação

*   **Escopo:** A cena é iniciada via `this.scene.launch('UI')` a partir da `Start.js`, o que permite que ambas processem lógica simultaneamente sem que uma interrompa a outra.
