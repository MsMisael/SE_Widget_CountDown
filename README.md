# Repositório SE_Widget_CountDown
O repositório **SE_Widget_CountDown** é um projeto de código aberto hospedado no GitHub. Ele oferece um widget de contagem regressiva personalizável para uso em aplicativos web.

* O widget de contagem regressiva cria uma expectativa visual para os usuários, informando quanto tempo resta até um evento importante.
* O widget pode ser utilizado para exibir a contagem regressiva de lançamentos, feriados, prazos e outras ocasiões relevantes.


## Personalização do Widget
O código-fonte disponível no repositório permite que você personalize o widget de contagem regressiva de acordo com suas necessidades:

* Modifique a aparência e o estilo do widget.
* Altere o formato da contagem regressiva para atender aos seus requisitos.
* Defina eventos específicos e suas respectivas datas para a contagem regressiva. 

# Ta, e ae como coloco no StreamElements?
Para adicionar o widget personalizado no overlay do StreamElements, siga estes passos:

Crie um widget customizado no StreamElements:

Abra o StreamElements e acesse o editor.
Clique em "Add Widget" (Adicionar Widget) para criar um novo widget.
Escolha o tipo de widget adequado para o seu caso.
Abra o editor do widget:

Selecione o widget que você acabou de criar.
Clique em "Edit" (Editar) para abrir o editor do widget.
Configure os conteúdos nas guias a seguir:

### Guia 1 - FIELDS:

* No campo "FIELDS" (Campos), cole o conteúdo do arquivo `CountDown.JSON` do repositório. Certifique-se de que o arquivo esteja formatado corretamente.

### Guia 2 - CSS:

* No campo "CSS" (Estilo), cole o conteúdo do arquivo `CountDown.CSS` fornecido no repositório.

### Guia 3 - HTML:

* No campo "HTML", cole o conteúdo do arquivo `CountDown.HTML` fornecido no repositório.

### Guia 4 - JS:

* No campo "JS" (JavaScript), cole o conteúdo do arquivo JavaScript `CountDown.JS` fornecido no repositório.

### Observação importante: Certifique-se de que a guia "DATA" esteja vazia, contendo apenas o valor `{}`.

## Personalize o widget:

Faça ajustes adicionais no estilo, layout e configurações do widget, conforme necessário.
Salve as alterações:

Clique em "Save" (Salvar) para aplicar as alterações feitas no widget.
Agora seu widget personalizado de contagem regressiva estará configurado no StreamElements e poderá ser exibido no overlay do seu stream. Lembre-se de verificar a prévia para garantir que tudo esteja funcionando conforme o esperado.

Aproveite o widget de contagem regressiva customizado para envolver sua audiência e criar uma experiência mais interativa durante suas transmissões!

### Marks
é a forma que o widget tem pra equiparar o tempo adicional pelas contribuiçoes.**Exemplo, se voce configurar para que o contador considere subs e que cada sub equivale a uma "Mark" Entao se alguem contribuir com 10 subs o contador considerará 10x Marks e o tempo que será adicionado ao contador**

## Lista de campos pra configurar

### CountDown controls:

* Start/Reset CountDown:
    Inicia o reinicia a contagem.
    > Quando clicado captura a data/hora atual e comça a contar apartir dela, **CUIDADO: Ao reiniciar nao é possivel restituir a data/hora anteriormente capturadas**
* Start/Reset Contribuitons:
    Inicia ou reinicia a contagem de eventos contados desde o inicio do timer
    > Quando clicado descarta a contagem  de eventos disparados durante a contagem,  voce pode emular eventos para corrigir caso reinicie acidentalmente

### Event time settings:
> Configuração inicial de "Marks" e o tempo incial do contador
 **VOCÊ LIMITA O TEMPO REGULANDO ESSES CAMPOS AQUI**

* Max Marks:
    Convercão indireta de eventos para manipular a adicao de tempo de uma forma mais previsivel
* Time per Marks (seconds):
    Quantidade de tempo adicionada quando a quantidade de contribuições atinge uma "Mark"
* Initial additional (seconds):
    Tempo inicial em segundos, para evitar do contador iniciar zerado

### Headers settings:
> Cabeçalhos que ficam acima do contador informando a somatória de tempo da quantidade de tempos informados , ao informar o valor "0" o texto do cabeçalho será ocultado.

* Header label 1:
    Quantidade de tempo que o numero preenchido nesse campo vai adicionar.
    **Exemplo 1: valor 1 será exibido o tempo adicional de 1 Mark**
* Header label 2:
    Quantidade de tempo que o numero preenchido nesse campo vai adicionar.
    **Exemplo 2: valor 5 será exibido o tempo adicional de 5 Marks**
* Header label 3:
    Quantidade de tempo que o numero preenchido nesse campo vai adicionar.
    **Exemplo 3: valor 10 será exibido o tempo adicional de 10 Marks**

### Events settings:
> Por padrão o widget nao vai acrescentar tempo pelos eventos disparados **VOCÊ PRECISA VIR AQUI E DEFINIR CADA CAMPO COMO "YES" PARA QUE O TEMPO ADICIONAL COMECE A SER CONSIDERADO PARA DONATES BITS E SUBS**

* Include Tips:
    Campo que habilita a contagem de donates capturados pelo StreamElements
    **Necessário para que seja contabilizado tempo por donates capturados pelo StreamElements**
* 1X = tips:
    Informa a quantia necessária monetária que representa uma "Mark"
    **Conversão da quantidade monetária que equivale a umas Mark**
* Include Subs:
    Campo que habilita a contagem de Subs capturados pelo StreamElements
    **Necessário para que seja contabilizado tempo por Subs capturados pelo StreamElements**
* 1X = Subs:
    Informa a quantia necessária de Subs que representa uma "Mark"
    **Conversão da quantidade Subs que equivale a umas Mark**
* Include Bits:
    Campo que habilita a contagem de Bits capturados pelo StreamElements
    **Necessário para que seja contabilizado tempo por Bits capturados pelo StreamElements**
* 1X = Bits:
    Informa a quantia necessária de Bits que representa uma "Mark"
    **Conversão da quantidade Bits que equivale a umas Mark**

### Card:

* Background Color:
    Cor de fundo inicial, na maior parte das vezes será sobreposta pelo gradiente de cores que pode ser preenchido pelas cores abaixo
* Background Color 1:
    Cor inicial do gradiente de cores do fundo do widget
* Background Color:
    Cor que é exibida em 35% do gradiente de cores do fundo do widget
* Background Color:
    Cor que é exibida em 100% do gradiente de cores do fundo do widget
* Degrees:
    Inclinação do gradiente em graus de 0 a 360
* Background Border radius:
    Raio da borda do fundo em pixels


### Typography:

* text shadow Vertical Position:
    Deslocamento vertical da sombra dos textos
* text shadow Horizontal Position:
    Deslocamento horizontal da sombra dos textos
* text shadow blur:
    Desfoque da sombra dos textos
* Shadow Color:
    cor da sombra dos textos

### Ghost mode:
#### Ghost mode é um modo do widget que evita que ele fique aparente 100% do tempo, ficando com transparencia e removendo o fundo quando nao são capturados novos eventos

* enabled:
    Informa se o modo fantasma está ativado
* Hide headers:
    Informa se os cabeçalhos com as quantidades de tempos serão ocultados durante esse modo
* Color:
    Cor exibida
* Inactivity Time to enable (seconds):
    Tempo de inatividade em que não é capturado nenhum evento que seja contabilizado para iniciar o modo fantasma
* Inactivity Time Refresh:
    Tempo em que o modo fantasma é desativado para exibir a informação de tempos atual
* Scale in ghost mode:
    Escala do widget por completo, para que fique menor durante o modo fantasma se necessário


### Multiply mark time function:
#### **Alerta para nao nerds, ignore essa parte caso nao seja um nerd.**
#### Apos definir o campo CountDown controls > Max Marks, o widget contabiliza a progressão até o limite máximo para evitar que seja adicionado tempo infinitamente. o campo abaixo serve para voce definir o quanto os valores podem ser alterados com base na progressão até chegar no seu limite, usualmente está definido como constante ou 1x.

* Curve type for multiply:
    Comportamento da curva de calculo do tempo adicional definido em **CountDown controls > Time per Marks (seconds)**

    - "Extreme": O tempo adicional começa em 1x aumenta até 3x e no fim 0x
        **Exemplo: tempo adicional de 120 segundos, 1x = 120 > 3x = 360 > 0x = 0**
    - "Moderate": O tempo adicional começa em 1x  aumenta até  2x e no fim 0x
        **Exemplo: tempo adicional de 120 segundos, 1x = 120 > 2x = 240 > 0x = 0**
    - "Light":  O tempo adicional começa em 1x aumenta até 1.5x e no fim 0x
        **Exemplo: tempo adicional de 120 segundos, 1x = 120 > 1.5x = 180 > 0x = 0**
    - "LinearUp": O tempo adicional começa em 1x até 2x
        **Exemplo: tempo adicional de 120 segundos, 1x = 120 > 2x = 240**
    - "LinearDown": O tempo adicional começa em 1x até 0x
        **Exemplo: tempo adicional de 120 segundos, 1x = 120 > 0x = 0**
    - "Constant": O tempo adicional começa em 1x e não se altera
        **Exemplo: tempo adicional de 120 segundos, 1x = 120 > 0x = 0**
> **NOTA: em todos os casos o contador para de adicionar tempo quando atinge o limite de marks definido em CountDown controls > Time per Marks (seconds)**

### Header Typography:

* Font:
    Estilo da fonte dos cabeçalhos
* Size:
    Tamanho da fonte dos cabeçalhos
* Header Color:
    Cor da fonte dos cabeçalhos
* Header Stroke Color:
    Cor do traçado dos cabeçalhos
* Header Stroke width:
    largura do traçado dos cabeçalhos
* Header Vertical Alignment:
    posicionamento vertical dos cabeçalhos
* Header Horizontal Alignment:
    posicionamento horizontal dos cabeçalhos

### CountDown Typography:

* Font:
    Estilo da fonte do Contador
* Size:
    Tamanho da fonte do Contador
* CountDown Color:
    Cor da fonte do Contador
* CountDown Stroke Color:
    Cor do traçado do Contador
* CountDown Stroke width:
    largura do traçado do Contador
* countDown Vertical Alignment:
    posicionamento vertical do Contador
* countDown Horizontal Alignment:
    posicionamento horizontal do Contador


### Marks Typography:

* Show Marks:
    Informa a contagem de "Marks" contabilizadas durante a contagem
* Font:
    Estilo da fonte do Contador de Marks 
* Size:
    Tamanho da fonte do Contador de Marks
* steps Color:
    Cor da fonte do Contador de Marks
* steps Stroke Color:
    Cor do traçado do Contador de Marks
* steps Stroke width:
    largura do traçado do Contador de Marks
* steps Vertical Alignment:
    posicionamento vertical do Contador de Marks
* Marks Horizontal Alignment:
    posicionamento horizontal do Contador de Marks