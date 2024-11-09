from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import requests
import os

app = Flask(__name__)
# Fetch API key and Proxy endpoint from environment variables
TEAM_API_KEY = "sk-spzttNpsIn5Jfib0Is8N2A"
PROXY_ENDPOINT = "https://nova-litellm-proxy.onrender.com"

current_folder = os.getcwd()
app.config["UPLOAD_FOLDER"] = current_folder  # Current directory
app.config["OUTPUT_FOLDER"] = current_folder  # Current directory
app.config["CARTESIA_API_KEY"] = "5309cc41-17f5-45fa-ab8c-fe5f2cd3b3df"
app.config["CARTESIA_API_URL"] = "https://api.cartesia.ai/v1/convert_to_audio"

# Initialize OpenAI client
client = OpenAI(api_key=TEAM_API_KEY, base_url=PROXY_ENDPOINT)

CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:3000", "https://localhost:3000"]}},
)  # Enable CORS for specific origins

# Define the reference text for tone and structure guidance
reference_text = (
    "Find a relaxed, comfortable position seated on a chair or on the floor. "
    "Keep your back upright, but not too tight, and hands resting wherever they're comfortable. "
    "Notice your body from the inside, feeling its weight and touch, letting yourself relax. "
    "Begin tuning into your breath, letting it flow naturally without control. "
    "If your mind wanders, gently guide it back to your breath, noticing each sensation as you breathe in and out.\n\n"
    "Good evening and welcome to this meditation. "
    "Allow yourself to unwind and be at peace, just for a few brief moments, letting go of all distractions. "
    "Feel the warmth and ease spread from your feet up through your body, releasing any tension. "
    "Reflect on your day with gratitude, acknowledging small achievements and letting go of any lingering concerns. "
    "Know that tomorrow is a new day, a fresh start, and allow yourself to drift into relaxation or even restful sleep."
)


# Flask route to handle POST request and generate meditation script
@app.route("/generate_meditation", methods=["POST"])
def generate_meditation_script():
    print("Bilbo ")
    print(request.json)
    # Step 1: Get the user's reflection from the POST request body
    user_reflection = request.json.get("reflection", "")

    print("Got the things.")

    if not user_reflection:
        return jsonify({"error": "No reflection text provided"}), 400

    # Step 2: Call the OpenAI API to generate a personalized meditation script based on the user's reflection
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # Adjust model as needed
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a calming meditation guide. Use the reference text as a tone and structure guide, "
                        "but your output should be original and it should incorporate specific details from the user's reflections about their day into the meditation. "
                        "Guide the user to find peace, relaxation, and gratitude as they reflect on the day and prepare to rest. "
                        "Ensure that the script is well-punctuated with natural pauses (insert '-' or '...' where needed), and use a soothing, gentle tone. "
                        "Avoid quotation marks unless referring to a quote. "
                    ),
                },
                {
                    "role": "assistant",
                    "content": f"Reference Text:\n\n{reference_text}\n\n",
                },
                {"role": "user", "content": user_reflection},
                {
                    "role": "assistant",
                    "content": "Here is a personalized guided meditation for you:",
                },
            ],
        )

        meditation_script = response.choices[0].message.content

        # Step 3: Post-process the meditation script to insert pauses, punctuation, and correct formatting
        meditation_script = meditation_script.replace(
            "\n", " -\n"
        )  # Insert pauses after every line break
        meditation_script = meditation_script.replace(
            "..", " -"
        )  # Add pauses for ellipses
        meditation_script = meditation_script.replace(
            "?", "??"
        )  # Ensure questions have double question marks for emphasis

        med_json = jsonify({"meditation_script": meditation_script})

        # Return the generated meditation script as a response]
        print(med_json["meditation_script"])

        # path: str = generate_audio(med_json["meditation_script"])

        return med_json

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# def generate_audio(text: str):
#     response = requests.post(
#         app.config["CARTESIA_API_URL"],
#         headers={"Authorization": f'Bearer {app.config["CARTESIA_API_KEY"]}'},
#         json={"model": "sonic", "text": text},
#     )

#     if response.status_code != 200:
#         return (
#             jsonify({"error": "Failed to connect to Cartesia API"}),
#             response.status_code,
#         )

#     # Write audio content to a file
#     audio_data = response.content
#     audio_filename = "meditation_script.mp3"
#     audio_path = os.path.join(app.config["OUTPUT_FOLDER"], audio_filename)

#     # Write the binary audio content to the file
#     with open(audio_path, "wb") as audio_file:
#         audio_file.write(audio_data)

#     # Send the file back to the user
#     return audio_path


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
