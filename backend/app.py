
from flask import Flask, request, jsonify, send_from_directory

from pathlib import Path
from PIL import Image, UnidentifiedImageError

import numpy as np
import tensorflow as tf
import json
import io


BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_DIR = BASE_DIR / "frontend"

MODEL_DIR = BASE_DIR / "modelo"

MODEL_PATH = MODEL_DIR / "melhor_modelo.keras"

CONFIG_PATH = MODEL_DIR / "configuracao.json"


app = Flask(
    __name__,
    static_folder=str(FRONTEND_DIR),
    static_url_path=""
)

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

IMG_SIZE = 64

FORMATOS_PERMITIDOS = {
    "jpg",
    "jpeg",
    "png",
    "webp"
}


if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Modelo não encontrado: {MODEL_PATH}"
    )

if not CONFIG_PATH.exists():
    raise FileNotFoundError(
        f"Configuração não encontrada: {CONFIG_PATH}"
    )


with open(CONFIG_PATH, "r", encoding="utf-8") as arquivo:

    configuracao = json.load(arquivo)


CATEGORIAS = configuracao["categorias"]

IMG_SIZE = configuracao["tamanho_imagem"]

modelo = tf.keras.models.load_model(MODEL_PATH)

print("Modelo carregado com sucesso!")

print("Categorias:", CATEGORIAS)


@app.route("/")
def index():

    return send_from_directory(
        FRONTEND_DIR,
        "index.html"
    )



def validar_imagem(arquivo):

    nome = arquivo.filename

    if not nome or "." not in nome:

        raise ValueError("Arquivo sem extensão válida.")

    extensao = nome.rsplit(".", 1)[1].lower()

    if extensao not in FORMATOS_PERMITIDOS:

        raise ValueError("Formato de imagem não permitido.")

    return True


def processar_imagem(arquivo):

    imagem = Image.open(
        io.BytesIO(arquivo.read())
    )

    imagem = imagem.convert("RGB")

    imagem = imagem.resize(
        (IMG_SIZE, IMG_SIZE)
    )

    imagem = np.array(
        imagem,
        dtype=np.float32
    )

    imagem = imagem / 255.0

    imagem = np.expand_dims(
        imagem,
        axis=0
    )

    return imagem

@app.route("/api/predict", methods=["POST"])
def predict():

    if "image" not in request.files:

        return jsonify({
            "error": "Nenhuma imagem foi enviada."
        }), 400

    arquivo = request.files["image"]

    try:

        validar_imagem(arquivo)

        imagem = processar_imagem(arquivo)

        previsao = modelo.predict(
            imagem,
            verbose=0
        )[0]


        indice = int(np.argmax(previsao))

        categoria_prevista = CATEGORIAS[indice]
        

        confianca = float(previsao[indice] * 100)

        probabilidades = {

            categoria: round(
                float(previsao[i] * 100),
                2
            )

            for i, categoria in enumerate(CATEGORIAS)

        }

        return jsonify({

            "success": True,

            "predicted_class": categoria_prevista,

            "confidence": round(confianca, 2),

            "probabilities": probabilidades

        })

    except UnidentifiedImageError:

        return jsonify({
            "error": "O arquivo enviado não é uma imagem válida."
        }), 400

    except (ValueError, OSError) as erro:

        return jsonify({
            "error": str(erro)
        }), 400

    except Exception as erro:

        app.logger.exception("Erro na classificação")

        return jsonify({
            "error": "Erro interno ao processar a imagem."
        }), 500

@app.errorhandler(413)
def arquivo_muito_grande(erro):

    return jsonify({
        "error": "A imagem ultrapassa o limite de 10 MB."
    }), 413

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=False
    )
