// Check for SpeechRecognition support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
  alert("Your browser does not support Speech Recognition. Please try Chrome or Edge.");
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  const startBtn = document.getElementById('start-btn');
  const stopBtn = document.getElementById('stop-btn');
  const outputDiv = document.getElementById('output');

  startBtn.addEventListener('click', () => {
    recognition.start();
    outputDiv.innerHTML = '<p>Listening...</p>';
  });

  stopBtn.addEventListener('click', () => {
    recognition.stop();
    outputDiv.innerHTML += '<p>Stopped listening.</p>';
  });

  recognition.addEventListener('result', (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
    
    outputDiv.innerHTML += `<p>You said: ${transcript}</p>`;
    
    fetch("/process", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: userInput })
  })
  .then(response => response.json())
  .then(data => {
      const responseText = data.text;
      const audioUrl = data.audio_url;
  
      // Display the response text
      audioUrl += '?t=' + new Date().getTime();
      document.getElementById("response").innerText = responseText;
  
      // Play the audio response
      const audio = new Audio(audioUrl);
      audio.playbackRate = 5.0;
      audio.play();
  })
  .catch(error => console.error("Error:", error));
  
  });
}


