    // Global playback rate variable
    let playbackRate = 2.0;

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
      const pauseBtn = document.getElementById('pause-btn');
      const resumeBtn = document.getElementById('resume-btn');
      const incSpeedBtn = document.getElementById('inc-speed-btn');
      const speedDisplay = document.getElementById('speed-display');
      const outputDiv = document.getElementById('output');

      // Start listening button
      startBtn.addEventListener('click', () => {
        recognition.start();
        outputDiv.innerHTML += '<p><em>Listening...</em></p>';
      });

      // Stop listening button
      stopBtn.addEventListener('click', () => {
        recognition.stop();
        outputDiv.innerHTML += '<p><em>Stopped listening.</em></p>';
      });

      // Pause Speech Synthesis
      pauseBtn.addEventListener('click', () => {
        window.speechSynthesis.pause();
        outputDiv.innerHTML += '<p><em>Speech paused.</em></p>';
      });

      // Resume Speech Synthesis
      resumeBtn.addEventListener('click', () => {
        window.speechSynthesis.resume();
        outputDiv.innerHTML += '<p><em>Speech resumed.</em></p>';
      });

      // Increase playback speed
      incSpeedBtn.addEventListener('click', () => {
        playbackRate += 0.5;
        speedDisplay.innerText = `Speed: ${playbackRate.toFixed(1)}x`;
        outputDiv.innerHTML += `<p><em>Playback speed increased to ${playbackRate.toFixed(1)}x.</em></p>`;
      });

      recognition.addEventListener('result', (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        outputDiv.innerHTML += `<p>You said: ${transcript}</p>`;
        
        // Send transcript to back-end
        fetch('/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcript })
        })
        .then(response => response.json())
        .then(data => {
          outputDiv.innerHTML += `<p>Assistant: ${data.text}</p>`;
          
          // Speak the assistant's response using Speech Synthesis
          const utterance = new SpeechSynthesisUtterance(data.text);
          utterance.lang = 'en-US';
          utterance.playbackRate = playbackRate;
          window.speechSynthesis.speak(utterance);
        })
        .catch(error => console.error('Error:', error));
      });
    }