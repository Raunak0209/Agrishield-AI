
from flask import Flask, render_template, request, jsonify
import os

from model.predict import predict_disease

app = Flask(__name__, template_folder="../frontend/templates", static_folder="../frontend/static")

UPLOAD_FOLDER = "../frontend/static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():

    file = request.files['leaf']
    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    disease, confidence = predict_disease(path)

    return jsonify({
        "disease": disease,
        "confidence": round(confidence,2)
    })

if __name__ == "__main__":
    app.run(debug=True)
