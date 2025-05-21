from flask import Flask, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  
JSON_DIR = os.getcwd()  

@app.route("/respuestas.json")
def serve_json():
    return send_from_directory(JSON_DIR, "respuestas.json")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3020)
