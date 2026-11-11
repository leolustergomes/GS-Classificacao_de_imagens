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

Foram desenvolvidas e avaliadas três configurações de Rede Neural Convolucional, mantendo os mesmos conjuntos de treinamento, validação e teste.

<<<<<<< HEAD
| Experimento | Principais alterações na arquitetura/hiperparâmetros | Resultado observado |
|---|---|---|
| CNN 1 — Inicial | [Duas Conv2D (32 e 64 filtros), duas MaxPooling e Dense de 128 neurônios.] | [84,17%] |
| CNN 2 — Experimento | [Cinco Conv2D (32, 32, 64, 64 e 128 filtros), três MaxPooling e Dense de 128 neurônios.] | [89,17%] |
| CNN 3 — Experimento | [Três Conv2D, Batch Normalization, Global Average Pooling e Dropout de 40%.] | [35,83%] |
| Modelo selecionado | [CNN 2 : Modelo com a melhor acurácia ] | [89,17%] |
=======
- **CNN 1 — Arquitetura inicial:** utiliza duas camadas `Conv2D`, com 32 e 64 filtros, cada uma seguida por `MaxPooling2D`. Depois, aplica `Flatten`, uma camada `Dense` com 128 neurônios e a saída `Softmax` com quatro classes. Foi utilizada como modelo de referência para o primeiro experimento.
- **CNN 2 — Arquitetura intermediária:** amplia a extração de características para cinco camadas `Conv2D`, com 32, 32, 64, 64 e 128 filtros, distribuídas em três etapas de `MaxPooling2D`. Mantém `Flatten`, `Dense` com 128 neurônios e saída com quatro classes. Foi a arquitetura com melhor acurácia de validação e foi selecionada para a aplicação.
- **CNN 3 — Arquitetura com regularização:** utiliza três camadas `Conv2D` com 32, 64 e 128 filtros, cada uma seguida por `BatchNormalization`, ativação ReLU e `MaxPooling2D`. Substitui `Flatten` por `GlobalAveragePooling2D` e inclui `Dropout` de 40% antes da camada de saída. Apesar de reduzir bastante o número de parâmetros, apresentou desempenho inferior na validação.

As três arquiteturas utilizaram filtros convolucionais de 3 × 3, ativação ReLU nas camadas intermediárias e uma camada de saída `Softmax` com quatro neurônios. O treinamento foi configurado com otimizador Adam, taxa de aprendizado inicial de 0,001, função de perda `sparse_categorical_crossentropy`, lote de 32 imagens e até 30 épocas. Também foram utilizados `EarlyStopping`, `ReduceLROnPlateau` e `ModelCheckpoint`.

| Experimento | Parâmetros totais | Melhor acurácia na validação |
|---|---:|---:|
| CNN 1 — Inicial | 2.117.188 | 84,17% |
| CNN 2 — Intermediária | 1.188.644 | **89,17%** |
| CNN 3 — Regularização | 111.172 | 35,83% |

<<<<<<< HEAD
Melhor modelo:

4/4 ━━━━━━━━━━━━━━━━━━━━ 2s 353ms/step
              precision    recall  f1-score   support
=======
A CNN 2 foi selecionada por apresentar a maior acurácia no conjunto de validação. Essa escolha foi feita antes da avaliação final no conjunto de teste.

## Resultados do modelo selecionado

A avaliação final da CNN 2 no conjunto de teste, composto por 120 imagens, apresentou os seguintes resultados:

| Métrica | Resultado |
|---|---:|
| Acurácia | 81,67% |
| Precisão macro | 82,75% |
| Recall macro | 81,67% |
| F1-score macro | 81,22% |
| Loss | 0,5818 |

### Desempenho por categoria

| Categoria | Precisão | Recall | F1-score |
|---|---:|---:|---:|
| Residential | 64,10% | 83,33% | 72,46% |
| Industrial | 80,00% | 53,33% | 64,00% |
| Forest | 93,55% | 96,67% | 95,08% |
| River | 93,33% | 93,33% | 93,33% |

Os resultados mostram melhor desempenho nas classes `Forest` e `River`. A classe `Industrial` apresentou o menor recall, indicando que parte das imagens industriais não foi identificada corretamente. Esse ponto representa uma oportunidade de melhoria para experimentos futuros.

 Residential     0.6410    0.8333    0.7246        30
  Industrial     0.8000    0.5333    0.6400        30
      Forest     0.9355    0.9667    0.9508        30
       River     0.9333    0.9333    0.9333        30

    accuracy                         0.8167       120
   macro avg     0.8275    0.8167    0.8122       120
weighted avg     0.8275    0.8167    0.8122       120


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
git clone https://github.com/leolustergomes/GS-Classificacao_de_imagens/tree/main
cd NOME_DA_PASTA_DO_REPOSITORIO
```

Substitua `NOME_DA_PASTA_DO_REPOSITORIO` pelo nome da pasta criada pelo Git.

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

Ferramentas de IA generativa foram utilizadas como apoio ao desenvolvimento. As contribuições efetivamente utilizadas devem ser descritas e validadas pela equipe, por exemplo:

- Apoio na compreensão de conceitos de CNN e aprendizado profundo.
- Sugestões e revisão de trechos de código.
- Apoio na identificação e correção de erros.
- Auxílio na interpretação de métricas e na organização da documentação.

## Créditos e referências

- **EuroSAT:** [repositório oficial do conjunto de dados](https://github.com/phelber/EuroSAT).
- **TensorFlow:** [documentação oficial](https://www.tensorflow.org/).
- **Flask:** [documentação oficial](https://flask.palletsprojects.com/).

---

## Informações da equipe

- **Instituição:** [FIAP]
- **Curso:** Ciência da Computação
- **Disciplina:** Aprendizado Profundo com Redes Neurais Convolucionais
- **Integrantes:** [Leonardo Luster, Ana Luiza e Sofia Bill]

