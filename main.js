const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = 'lowpass';
biquadFilter.frequency.setValueAtTime(400, audioCtx.currentTime); //400 hz cutoff
biquadFilter.Q.setValueAtTime(1, audioCtx.currentTime);


var brownNoise = null;
var isPlaying = false;

function createBrownNoise() {
    var bufferSize = 10 * audioCtx.sampleRate,
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;
      
        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    return noiseBuffer;
}

var noiseBuffer = createBrownNoise();

// play button
var playButton = document.getElementById('playButton');

playButton.addEventListener('click', function() {
    if (!isPlaying) {
        brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;
        brownNoise.connect(biquadFilter);
        biquadFilter.connect(audioCtx.destination);
        brownNoise.start(0);
        isPlaying = true;
        playButton.textContent = 'Stop';
        playButton.style.backgroundColor = '#e74c3c';
    } else {
        brownNoise.stop(0);
        isPlaying = false;
        playButton.textContent = 'Play';
        playButton.style.backgroundColor = '#3498db';
    }
});