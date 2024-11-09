from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    client = OpenAI(
        api_key="sk-spzttNpsIn5Jfib0Is8N2A",  # Replace with actual API key
        base_url="https://nova-litellm-proxy.onrender.com",  # Replace with actual proxy endpoint
    )

    # Get the audio file from the request
    audio_file = request.files["audio"]

    # Perform transcription
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
    )

    # Save transcription to a text file
    with open("transcription_output.txt", "w") as f:
        f.write(transcription.text)

    return jsonify(
        {
            "message": "Transcription saved to 'transcription_output.txt'",
            "transcription": transcription.text,
        }
    )


if __name__ == "__main__":
    app.run(port=5000)
