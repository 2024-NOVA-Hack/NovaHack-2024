import openai

# Fetch API key and Proxy endpoint from environment variables
TEAM_API_KEY = "sk-spzttNpsIn5Jfib0Is8N2A"
PROXY_ENDPOINT = "https://nova-litellm-proxy.onrender.com"

# Set the API key and base URL for OpenAI's API
client = OpenAI(
    api_key=TEAM_API_KEY, base_url=PROXY_ENDPOINT  # set this!!!  # and this!!!
)


def generate_meditation_script():
    # Step 2: Read the user's reflection from transcription_output.txt
    with open("transcription_output.txt", "r") as file:
        user_reflection = file.read()

    # Reference text for tone and structure guidance
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

    # Step 3: Call the OpenAI API to generate a personalized meditation script based on the user's reflection
    response = client.chat.completions.create(
        model="gpt-4o",  # You can adjust this depending on the model you want to use
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

    meditation_script = response.choices[0].message["content"]

    # Step 4: Post-process the meditation script to insert pauses, punctuation, and correct formatting
    # Add pauses (represented by "-") for natural breaks in speech
    meditation_script = meditation_script.replace(
        "\n", " -\n"
    )  # Insert pauses after every line break
    meditation_script = meditation_script.replace("..", " -")  # Add pauses for ellipses
    meditation_script = meditation_script.replace(
        "?", "??"
    )  # Ensure questions have double question marks for emphasis

    # Step 5: Write the generated meditation script to meditation_script.txt
    with open("meditation_script.txt", "w") as file:
        file.write(meditation_script)


# Run the function
if __name__ == "__main__":
    generate_meditation_script()
