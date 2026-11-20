# Territorial AI

Sistema de classificação de imagens de satélite desenvolvido com uma Rede Neural Convolucional (CNN). A aplicação recebe uma imagem, processa os pixels com o modelo treinado e apresenta a classe territorial prevista e as probabilidades estimadas para cada categoria.

> **Execução local:** esta versão foi preparada para rodar no computador do usuário. Não é necessário contratar hospedagem ou manter o computador do desenvolvedor ligado. Cada pessoa que for utilizar o projeto deverá baixar os arquivos, instalar as dependências e iniciar o servidor localmente.

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Objetivo](#objetivo)
- [Categorias classificadas](#categorias-classificadas)
- [Base de dados](#base-de-dados)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Como o sistema funciona](#como-o-sistema-funciona)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Modelo de inteligência artificial](#modelo-de-inteligência-artificial)
- [Resultados dos experimentos](#resultados-dos-experimentos)
- [Requisitos](#requisitos)
- [Como executar localmente no Windows](#como-executar-localmente-no-windows)
- [Como utilizar a aplicação](#como-utilizar-a-aplicação)
- [Solução de problemas](#solução-de-problemas)
- [Limitações e trabalhos futuros](#limitações-e-trabalhos-futuros)
- [Uso de inteligência artificial generativa](#uso-de-inteligência-artificial-generativa)
- [Créditos e referências](#créditos-e-referências)

---

## Sobre o projeto

O **Territorial AI** é uma aplicação web que utiliza inteligência artificial para classificar imagens de satélite em quatro categorias de uso e cobertura do solo: áreas residenciais, áreas industriais, florestas e rios.

O projeto integra um modelo de aprendizado profundo treinado em Python com uma interface web. O usuário seleciona uma imagem no navegador e recebe a classificação prevista, acompanhada das probabilidades estimadas para as quatro categorias.

## Objetivo

Desenvolver, treinar e avaliar uma Rede Neural Convolucional capaz de identificar padrões visuais em imagens de satélite. O projeto também busca demonstrar como um modelo treinado pode ser integrado a uma aplicação web simples, permitindo que pessoas sem conhecimento de programação utilizem a classificação.

## Categorias classificadas

| Classe | Descrição |
|---|---|
| `Residential` | Áreas residenciais e regiões com ocupação urbana predominantemente habitacional. |
| `Industrial` | Áreas industriais e instalações destinadas a atividades produtivas. |
| `Forest` | Áreas de cobertura florestal. |
| `River` | Rios e cursos d'água. |

A ordem das classes utilizada pela aplicação deve permanecer igual à ordem configurada no treinamento do modelo. Essa correspondência é mantida pelo arquivo `modelo/configuracao.json`.

## Base de dados

Foi utilizado o conjunto de dados **EuroSAT RGB**, uma base pública de imagens de satélite voltada à classificação de uso e cobertura do solo.

Para este projeto, foram consideradas quatro categorias: `Residential`, `Industrial`, `Forest` e `River`. As imagens utilizadas pelo modelo possuem entrada RGB com dimensão de **64 × 64 pixels**.

- Base original: [EuroSAT — Satellite Image Classification](https://github.com/phelber/EuroSAT)
- Tipo de imagem utilizado: RGB.
- Dimensão de entrada do modelo: 64 × 64 pixels.
- Número de categorias do projeto: 4.
- Quantidade de imagens utilizada: **800 imagens (200 por categoria)**.
- Divisão dos dados: **70% treinamento (560 imagens), 15% validação (120 imagens) e 15% teste (120 imagens)**.

O pré-processamento utilizado na aplicação converte a imagem para RGB, redimensiona para 64 × 64 pixels e normaliza os valores dos pixels para o intervalo de 0 a 1, dividindo-os por 255.

## Tecnologias utilizadas

| Tecnologia | Aplicação no projeto |
|---|---|
| Python | Linguagem utilizada no treinamento e no backend. |
| TensorFlow / Keras | Construção, treinamento e execução da CNN. |
| NumPy | Manipulação dos dados numéricos e das probabilidades. |
| Pillow (PIL) | Leitura, conversão e redimensionamento das imagens. |
| Flask | Backend e disponibilização da aplicação web local. |
| HTML | Estrutura da interface. |
| CSS | Estilização da interface. |
| JavaScript | Interação com a página e envio da imagem para a API. |
| Google Colab | Ambiente utilizado para desenvolvimento e treinamento do modelo. |

## Como o sistema funciona

1. O usuário abre a aplicação no navegador.
2. Seleciona uma imagem de satélite no computador.
3. O frontend envia a imagem ao backend por meio da rota `/api/predict`.
4. O Flask recebe a imagem e o backend realiza o pré-processamento.
5. O modelo CNN carregado pelo TensorFlow gera as probabilidades para as quatro classes.
6. A aplicação apresenta a classe prevista e as probabilidades estimadas.

### Arquitetura simplificada

```text
Usuário
  |
  v
Frontend (HTML, CSS e JavaScript)
  |
  | Envio da imagem
  v
Backend (Python + Flask)
  |
  | Pré-processamento RGB / 64x64 / normalização
  v
Modelo CNN (TensorFlow / Keras)
  |
  | Probabilidades das quatro classes
  v
Backend (resposta JSON)
  |
  v
Frontend (classe prevista e probabilidades)
```

## Estrutura do projeto

```text
PROJETO_GS/
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── backend/
│   ├── app.py
│   └── requirements.txt
├── modelo/
│   ├── melhor_modelo.keras
│   └── configuracao.json
├── .gitignore
└── README.md
```

**Importante:** a pasta `venv/` é criada localmente durante a instalação e não deve ser enviada ao GitHub. O arquivo `melhor_modelo.keras` e o arquivo `configuracao.json` precisam estar disponíveis no diretório `modelo/` para que a aplicação consiga carregar o modelo.

## Modelo de inteligência artificial

O projeto utiliza uma Rede Neural Convolucional (CNN) desenvolvida para classificação multiclasse. A arquitetura utiliza camadas convolucionais para extrair características das imagens, camadas de pooling para reduzir as dimensões das representações, funções de ativação e camadas densas para realizar a classificação final.

A camada de saída foi configurada para representar as quatro categorias do projeto.

### Experimentos com as arquiteturas CNN

Foram desenvolvidas e avaliadas quatro configurações de Rede Neural Convolucional, mantendo os mesmos conjuntos de treinamento, validação e teste.

- **CNN 1 — Arquitetura inicial:** utiliza duas camadas `Conv2D`, com 32 e 64 filtros, cada uma seguida por `MaxPooling2D`. Depois, aplica `Flatten`, uma camada `Dense` com 128 neurônios e a saída `Softmax` com quatro classes. Foi utilizada como modelo de referência para o primeiro experimento.
- **CNN 2 — Arquitetura intermediária:** amplia a extração de características para cinco camadas `Conv2D`, com 32, 32, 64, 64 e 128 filtros, distribuídas em três etapas de `MaxPooling2D`. Mantém `Flatten`, `Dense` com 128 neurônios e saída com quatro classes. Superou a CNN 1 na validação.
- **CNN 3 — Arquitetura com regularização:** utiliza três camadas `Conv2D` com 32, 64 e 128 filtros, cada uma seguida por `BatchNormalization`, ativação ReLU e `MaxPooling2D`. Substitui `Flatten` por `GlobalAveragePooling2D` e inclui `Dropout` de 40% antes da camada de saída. Neste experimento, apresentou baixa acurácia de validação e grande divergência em relação ao treinamento.
- **CNN 3b — Ajuste do BatchNormalization:** mantém a arquitetura da CNN 3 e altera somente o parâmetro `momentum` das camadas `BatchNormalization` para `0.9`. Esse teste controlado investigou se o ajuste das médias móveis do BatchNormalization melhoraria a validação. A CNN 3b obteve o melhor resultado entre as quatro configurações.

As quatro arquiteturas utilizaram filtros convolucionais de 3 × 3, ativação ReLU nas camadas intermediárias e uma camada de saída `Softmax` com quatro neurônios. O treinamento foi configurado com otimizador Adam, taxa de aprendizado inicial de 0,001, função de perda `sparse_categorical_crossentropy`, lote de 32 imagens e até 30 épocas. Também foram utilizados `EarlyStopping`, `ReduceLROnPlateau` e `ModelCheckpoint`.

| Experimento | Parâmetros totais | Melhor acurácia na validação |
|---|---:|---:|
| CNN 1 — Inicial | 2.117.188 | 84,17% |
| CNN 2 — Intermediária | 1.188.644 | 89,17% |
| CNN 3 — Regularização | 111.172 | 35,83% |
| CNN 3b — BatchNormalization (`momentum=0.9`) | 111.172 | **92,50%** |

A **CNN 3b** foi selecionada por apresentar a maior acurácia no conjunto de validação (92,50%), acima da CNN 2 (89,17%). A alteração entre CNN 3 e CNN 3b foi isolada no `momentum` do BatchNormalization; portanto, o resultado indica uma melhora neste experimento, mas não prova sozinho que esse parâmetro foi a única causa da diferença. A seleção foi feita com os dados de validação, antes da avaliação final no conjunto de teste.

## Resultados do modelo selecionado

A avaliação final da CNN 3b no conjunto de teste, composto por 120 imagens, apresentou os seguintes resultados:

| Métrica | Resultado |
|---|---:|
| Acurácia | **94,17%** |
| Precisão macro | 94,56% |
| Recall macro | 94,17% |
| F1-score macro | 94,14% |
| Loss | 0,1593 |

### Desempenho por categoria

| Categoria | Precisão | Recall | F1-score |
|---|---:|---:|---:|
| Residential | 96,77% | 100,00% | 98,36% |
| Industrial | 100,00% | 96,67% | 98,31% |
| Forest | 96,15% | 83,33% | 89,29% |
| River | 85,29% | 96,67% | 90,62% |

A CNN 3b apresentou resultados equilibrados, com F1-score acima de 98% em `Residential` e `Industrial`. A principal dificuldade ficou na separação entre `Forest` e `River`: cinco imagens de `Forest` foram classificadas como `River`, e uma imagem de `River` foi classificada como `Forest`. Esses erros indicam uma oportunidade de melhoria na distinção de padrões visuais dessas duas classes.

## Requisitos

Antes de executar o projeto, instale:

- Python em versão compatível com a versão do TensorFlow utilizada no projeto.
- Git, para clonar o repositório.
- Um navegador atualizado.

O Visual Studio Code é recomendado, mas não é obrigatório. A versão exata do Python e das bibliotecas deve ser conferida no ambiente em que o projeto foi validado.

## Como executar localmente no Windows

### 1. Baixar o projeto

Abra o PowerShell ou o terminal do Visual Studio Code e execute:

```powershell
git clone https://github.com/leolustergomes/GS-Classificacao_de_imagens.git
cd GS-Classificacao_de_imagens
```

Também é possível baixar o projeto pelo botão **Code → Download ZIP** do GitHub. Nesse caso, extraia o arquivo ZIP e abra a pasta extraída no terminal.

### 2. Criar o ambiente virtual

Na pasta principal do projeto, execute:

```powershell
python -m venv venv
```

### 3. Ativar o ambiente virtual

No PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Se estiver utilizando o Prompt de Comando (CMD), use:

```bat
venv\Scripts\activate.bat
```

Quando o ambiente estiver ativo, o terminal normalmente exibirá `(venv)` no início da linha.

### 4. Instalar as dependências

Com o ambiente virtual ativo, execute:

```powershell
python -m pip install --upgrade pip
python -m pip install -r backend/requirements.txt
```

A instalação do TensorFlow pode levar alguns minutos, dependendo do computador e da conexão com a internet.

### 5. Verificar os arquivos do modelo

Antes de iniciar, confirme que estes dois arquivos existem:

```text
modelo/melhor_modelo.keras
modelo/configuracao.json
```

Sem eles, o backend não conseguirá carregar o modelo treinado e suas configurações.

### 6. Iniciar a aplicação

Ainda na pasta principal do projeto e com o ambiente virtual ativo, execute:

```powershell
python backend/app.py
```

Aguarde a mensagem de confirmação de carregamento do modelo e a indicação de que o servidor Flask está em execução.

### 7. Abrir no navegador

Acesse o endereço local:

```text
http://127.0.0.1:5000
```

Para encerrar a aplicação, volte ao terminal e pressione `Ctrl + C`.

> **Observação:** o servidor local precisa permanecer em execução enquanto a aplicação estiver sendo utilizada. O endereço `127.0.0.1` é local ao computador em que o servidor foi iniciado; ele não disponibiliza o site publicamente na internet.

## Alternativa: executar pelo notebook (Gradio)

A aplicação também pode ser executada direto no Google Colab. Basta abrir o notebook `Global_Solution_Classificacao_Imagens_ATUALIZADO.ipynb`, fazer o upload do `EuroSAT_RGB.zip` em `/content` e executar todas as células. A última célula de código inicia uma interface Gradio com `share=True`, que gera um endereço público temporário. Para obter um novo endereço, basta executar o notebook novamente.

## Como utilizar a aplicação

1. Abra o endereço `http://127.0.0.1:5000` no navegador.
2. Utilize a área de upload para selecionar uma imagem de satélite.
3. Confira a pré-visualização da imagem selecionada.
4. Inicie a classificação pelo botão disponível na interface.
5. Aguarde o processamento do modelo.
6. Consulte a classe prevista e as probabilidades apresentadas para `Residential`, `Industrial`, `Forest` e `River`.

Formatos de imagem aceitos pela aplicação: JPG, JPEG, PNG e WEBP. O limite de upload configurado no backend é de 10 MB por imagem.

## Solução de problemas

| Problema | Possível solução |
|---|---|
| `ModuleNotFoundError` ao iniciar o Flask ou TensorFlow | Confirme que o ambiente `venv` está ativo e execute novamente `python -m pip install -r backend/requirements.txt`. |
| Erro ao carregar `melhor_modelo.keras` | Confirme se o arquivo está dentro da pasta `modelo/` e se o nome está correto. |
| Erro ao localizar `configuracao.json` | Confirme se o arquivo está dentro da pasta `modelo/`. |
| O endereço local não abre | Verifique se o terminal ainda está executando `python backend/app.py` e tente novamente `http://127.0.0.1:5000`. |
| A porta 5000 já está em uso | Encerre outra aplicação que esteja usando a porta ou ajuste a porta configurada no backend. |
| O PowerShell bloqueia a ativação do ambiente virtual | Tente ativar pelo CMD usando `venv\Scripts\activate.bat`. |
| Erro durante a instalação do TensorFlow | Confira a versão do Python e a compatibilidade com a versão do TensorFlow declarada nas dependências. |

## Limitações e trabalhos futuros

- O modelo foi desenvolvido para as quatro categorias definidas no escopo do projeto, e não para todas as classes existentes no EuroSAT.
- A qualidade das previsões depende dos dados utilizados no treinamento e da semelhança entre as imagens enviadas e esses dados.
- A aplicação foi preparada para execução local e não inclui, nesta versão, uma infraestrutura de hospedagem pública.
- Como evoluções futuras, podem ser estudadas a ampliação do número de categorias, a inclusão de novas imagens de treinamento, a melhoria da arquitetura e a disponibilização em uma infraestrutura de produção.

## Uso de inteligência artificial generativa

Ferramentas de IA generativa foram usadas como apoio em todas as etapas. As principais contribuições e a forma como a equipe as avaliou:

- **Diagnóstico da CNN 3:** a IA levantou a hipótese de que a validação travada em 25% estava ligada às médias móveis do `BatchNormalization`, já que há apenas 18 passos por época. A equipe não aceitou a hipótese diretamente: criou a CNN 3b, alterando somente o `momentum`, para testá-la em um experimento controlado. O resultado (35,83% → 92,50% na validação) foi registrado com a ressalva de que não prova causalidade isolada.
- **Callbacks de treinamento:** a IA sugeriu `EarlyStopping`, `ReduceLROnPlateau` e `ModelCheckpoint`. A equipe manteve os três e conferiu nos logs que o melhor modelo de cada arquitetura foi restaurado pela acurácia de validação.
- **Código e revisão:** apoio na implementação do pré-processamento, das arquiteturas, das métricas e da aplicação web (Flask e Gradio). A equipe executou todo o notebook e testou a aplicação com novas imagens.
- **Documentação:** apoio na organização deste README e dos slides. Os números apresentados foram conferidos com as saídas do notebook.

A seleção do modelo, a interpretação dos resultados e as decisões técnicas finais foram feitas pela equipe.

## Créditos e referências

- **EuroSAT:** [repositório oficial do conjunto de dados](https://github.com/phelber/EuroSAT).
- **TensorFlow:** [documentação oficial](https://www.tensorflow.org/).
- **Flask:** [documentação oficial](https://flask.palletsprojects.com/).

---

## Informações da equipe

- **Instituição:** FIAP
- **Curso:** Ciência da Computação
- **Disciplina:** Aprendizado Profundo com Redes Neurais Convolucionais
- **Integrantes:** Leonardo Luster, Ana Luiza e Sofia Bill
