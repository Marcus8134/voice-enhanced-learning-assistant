import os
import requests
from gtts import gTTS
import time
import os
import re
import emoji
from flask import Flask, render_template, request, jsonify


app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    user_text = data.get("text", "")
    
    # Use the generate_response function to call the Ollama API
    response_text = generate_response(user_text)
    

    response_text=remove_html_tags(response_text)
    response_text=remove_emojis(response_text)
    # Convert the generated text to speech (placeholder)
    audio_filename = text_to_speech(response_text)
    audio_url = os.path.join("/static", audio_filename)
    
    return jsonify({"text": response_text, "audio_url": audio_url})

def generate_response(input_text):
    url = "http://localhost:11434/api/generate"
    payload = {
        "model": "deepseek-r1:1.5b",  # Change model name as needed
        "prompt": input_text,
        "stream": False  # For a single complete response
    }
    
    try:
        r = requests.post(url, json=payload)
        r.raise_for_status()
        json_data = r.json()
        return json_data.get("response", "No response generated.")
    except requests.RequestException as e:
        print("Error communicating with Ollama API:", e)
        return "Error generating response."


def remove_html_tags(text):
    return re.sub(r'<[^>]+>', '', text)

def remove_emojis(text):
    return emoji.replace_emoji(text,replace=' ')

def text_to_speech(text):
    tts = gTTS(text=text, lang='en')
    # Generate a unique filename using timestamp
    timestamp = int(time.time())
    audio_filename = f"response_{timestamp}.mp3"
    audio_path = os.path.join("static", audio_filename)
    tts.save(audio_path)
    return audio_filename


if __name__ == "__main__":
    app.run(debug=True)