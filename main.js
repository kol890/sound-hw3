// Worked with Matthew in class
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// LPF.ar(BrownNoise.ar(), 400
const biquadFilter = audioCtx.createBiquadFilter();
biquadFilter.type = 'lowpass';
biquadFilter.frequency.setValueAtTime(400, audioCtx.currentTime); //400 hz cutoff

// LPF.ar(BrownNoise.ar(), 14)
const biquadFilter2 = audioCtx.createBiquadFilter();
biquadFilter2.type = 'lowpass';
biquadFilter2.frequency.setValueAtTime(14, audioCtx.currentTime); //14 hz cutoff

// * 400
const modgainNode = audioCtx.createGain();
modgainNode.gain.value = 400;

// RHPF.ar(..., 0.03, 0.1)
const RHPF = audioCtx.createBiquadFilter();
RHPF.type = 'highpass';
RHPF.Q.value = 1 / 0.025;
RHPF.frequency.value = 500; // + 500

//output amp 0.1
const outputGainNode = audioCtx.createGain();
outputGainNode.gain.value = 0.1;

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
var noiseBuffer2 = createBrownNoise();

// play button
var playButton = document.getElementById('playButton');
var brownNoise2 = null;

playButton.addEventListener('click', function() {
    if (!isPlaying) {
        //brownNoise → LPF(400) → RHPF → output
        brownNoise = audioCtx.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;
        brownNoise.connect(biquadFilter);
        biquadFilter.connect(RHPF);
        RHPF.connect(outputGainNode);
        outputGainNode.connect(audioCtx.destination);
        
        //brownNoise2 → LPF(14) → RHPF → output
        brownNoise2 = audioCtx.createBufferSource();
        brownNoise2.buffer = noiseBuffer2;
        brownNoise2.loop = true;
        brownNoise2.connect(biquadFilter2);
        biquadFilter2.connect(modgainNode)
        modgainNode.connect(RHPF.frequency);
   
        brownNoise.start(0);
        brownNoise2.start(0);
        isPlaying = true;
        playButton.textContent = 'Stop';
        playButton.style.backgroundColor = '#e74c3c';
    } else {
        brownNoise.stop(0);
        brownNoise2.stop(0);
        isPlaying = false;
        playButton.textContent = 'Play';
        playButton.style.backgroundColor = '#3498db';
    }
});

// Part 2 Button Redirect
document.getElementById('part2Button').addEventListener('click', function() {
    window.location.href = 'https://kol890.github.io/HW3-DTMF/src';
});