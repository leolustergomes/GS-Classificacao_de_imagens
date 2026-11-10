
const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const selectButton = document.getElementById("selectButton");
const analyzeButton = document.getElementById("analyzeButton");

const previewContainer = document.getElementById("previewContainer");
const imagePreview = document.getElementById("imagePreview");
const fileName = document.getElementById("fileName");
const removeButton = document.getElementById("removeButton");

const emptyResults = document.getElementById("emptyResults");
const loading = document.getElementById("loading");
const resultContent = document.getElementById("resultContent");

const predictedClass = document.getElementById("predictedClass");
const confidenceValue = document.getElementById("confidenceValue");
const probabilityList = document.getElementById("probabilityList");

const errorMessage = document.getElementById("errorMessage");

let selectedFile = null;
let previewURL = null;

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


// SELECIONAR IMAGEM

selectButton.addEventListener("click", () => {
    imageInput.click();
});

uploadArea.addEventListener("click", (event) => {

    if (event.target.closest("button")) {
        return;
    }

    imageInput.click();
});

imageInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (file) {
        processImage(file);
    }
});


// ARRASTAR E SOLTAR IMAGEM

uploadArea.addEventListener("dragover", (event) => {

    event.preventDefault();

    uploadArea.classList.add("dragover");
});

uploadArea.addEventListener("dragleave", () => {

    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (event) => {

    event.preventDefault();

    uploadArea.classList.remove("dragover");

    const file = event.dataTransfer.files[0];

    if (file) {
        processImage(file);
    }
});


// VALIDAR E MOSTRAR IMAGEM

function processImage(file) {

    errorMessage.textContent = "";

    if (!allowedTypes.includes(file.type)) {

        showError("Formato inválido. Utilize JPG, PNG ou WEBP.");

        return;
    }

    if (file.size > 10 * 1024 * 1024) {

        showError("A imagem deve ter no máximo 10 MB.");

        return;
    }

    selectedFile = file;

    if (previewURL) {
        URL.revokeObjectURL(previewURL);
    }

    previewURL = URL.createObjectURL(file);

    imagePreview.src = previewURL;

    fileName.textContent = file.name;

    previewContainer.classList.add("visible");

    analyzeButton.disabled = false;

    resetResults();
}


// REMOVER IMAGEM

removeButton.addEventListener("click", () => {

    selectedFile = null;

    imageInput.value = "";

    if (previewURL) {
        URL.revokeObjectURL(previewURL);
        previewURL = null;
    }

    imagePreview.src = "";

    previewContainer.classList.remove("visible");

    analyzeButton.disabled = true;

    errorMessage.textContent = "";

    resetResults();
});


// REALIZAR CLASSIFICAÇÃO

analyzeButton.addEventListener("click", async () => {

    if (!selectedFile) {
        showError("Selecione uma imagem primeiro.");
        return;
    }

    const formData = new FormData();

    formData.append("image", selectedFile);

    showLoading(true);

    analyzeButton.disabled = true;

    errorMessage.textContent = "";

    try {

        const response = await fetch("/api/predict", {

            method: "POST",

            body: formData

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.error || "Não foi possível classificar a imagem."
            );
        }

        displayResults(data);

    } catch (error) {

        showError(error.message);

        emptyResults.style.display = "flex";

    } finally {

        showLoading(false);

        analyzeButton.disabled = !selectedFile;

    }

});


// APRESENTAR RESULTADOS

function displayResults(data) {

    emptyResults.style.display = "none";

    resultContent.classList.add("visible");

    predictedClass.textContent = data.predicted_class;

    confidenceValue.textContent =
        data.confidence.toFixed(2) + "%";

    probabilityList.innerHTML = "";

    Object.entries(data.probabilities).forEach(
        ([category, probability]) => {

            const item = document.createElement("div");

            item.className = "probability-item";

            const info = document.createElement("div");

            info.className = "probability-info";

            const name = document.createElement("span");

            name.textContent = category;

            const value = document.createElement("span");

            value.textContent = probability.toFixed(2) + "%";

            info.append(name, value);

            const track = document.createElement("div");

            track.className = "progress-track";

            const fill = document.createElement("div");

            fill.className = "progress-fill";

            fill.style.width = Math.max(
                0,
                Math.min(100, probability)
            ) + "%";

            track.appendChild(fill);

            item.append(info, track);

            probabilityList.appendChild(item);

        }
    );
}


// ESTADOS DA INTERFACE

function showLoading(active) {

    loading.style.display = active ? "flex" : "none";

    if (active) {

        emptyResults.style.display = "none";

        resultContent.classList.remove("visible");

    }
}


function resetResults() {

    loading.style.display = "none";

    emptyResults.style.display = "flex";

    resultContent.classList.remove("visible");

    probabilityList.innerHTML = "";

}


function showError(message) {

    errorMessage.textContent = message;

}


resetResults();
