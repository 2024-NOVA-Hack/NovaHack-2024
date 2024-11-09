from flask import Flask, send_file, jsonify
import requests
import os

app = Flask(__name__)

# Set the upload and output folders to the current working directory
current_folder = os.getcwd()
app.config["UPLOAD_FOLDER"] = current_folder  # Current directory
app.config["OUTPUT_FOLDER"] = current_folder  # Current directory
app.config["CARTESIA_API_KEY"] = "5309cc41-17f5-45fa-ab8c-fe5f2cd3b3df"
app.config["CARTESIA_API_URL"] = "https://api.cartesia.ai/v1/convert_to_audio"


@app.route("/generate_audio", methods=["GET"])
def generate_audio():
    # Define the file path for 'meditation_script.txt' in the current folder
    input_file_path = os.path.join(app.config["UPLOAD_FOLDER"], "meditation_script.txt")

    # Check if the file exists
    if not os.path.exists(input_file_path):
        return (
            jsonify(
                {
                    "error": f"File 'meditation_script.txt' not found in {app.config['UPLOAD_FOLDER']}"
                }
            ),
            404,
        )

    # Read the text from the file
    with open(input_file_path, "r") as f:
        text = f.read()

    # Call Cartesia API
    response = requests.post(
        app.config["CARTESIA_API_URL"],
        headers={"Authorization": f'Bearer {app.config["CARTESIA_API_KEY"]}'},
        json={"model": "sonic", "text": text},
    )

    if response.status_code != 200:
        return (
            jsonify({"error": "Failed to connect to Cartesia API"}),
            response.status_code,
        )

    # Write audio content to a file
    audio_data = response.content
    audio_filename = "meditation_script.mp3"
    audio_path = os.path.join(app.config["OUTPUT_FOLDER"], audio_filename)

    # Write the binary audio content to the file
    with open(audio_path, "wb") as audio_file:
        audio_file.write(audio_data)

    # Send the file back to the user
    return send_file(
        audio_path,
        as_attachment=True,
        mimetype="audio/mpeg",
        download_name=audio_filename,
    )


if __name__ == "__main__":
    app.run(debug=True)
