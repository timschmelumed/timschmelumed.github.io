// sound button controls
function PlayButton(span, ownListen) {
    this.span = span;

    this.sin = [];

    this.numFreq = 1;

    // the fundamental frequency
    this.sin[0] = T("osc", {
        wave: "sin",
        freq: 800,
        mul: 1.0
    });
    this.freq = [880]; // current frequencies
    this.gain = [1.0]; // gains in relative intensity
    this.phase = [0]; // phases in radians.

    this.ownListen = ownListen;

    this.playBtn;

    // bind the object to itself
    var self = this;

    this.init = function() {
        // set up the buttons and their controls
        // start stop motion
        this.playBtn = document.createElement("input"); // check box for showing the intensity
        this.playBtn.setAttribute("type", "button");
        this.playBtn.setAttribute("value", "Play");
        this.span.appendChild(this.playBtn);

        if (this.ownListen != false) {

            this.playBtn.onclick = function() {
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    for (this.i = 0; this.i < self.sin.length; this.i++) {
                        self.sin[this.i].pause();
                    }
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    for (this.i = 0; this.i < self.sin.length; this.i++) {
                        this.gainAdj = (self.gain[this.i] / self.numFreq);
                        self.sin[this.i].set({
                            mul: this.gainAdj
                        }).play();
                    }
                }
            }

            // touch listeners
            this.playBtn.addEventListener('touchstart', function(event) {
                event.preventDefault();
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    for (this.i = 0; this.i < self.sin.length; this.i++) {
                        self.sin[this.i].pause();
                    }
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    for (this.i = 0; this.i < self.sin.length; this.i++) {
                        this.gainAdj = (self.gain[this.i] / self.numFreq);
                        self.sin[this.i].set({
                            mul: this.gainAdj
                        }).play();
                    }
                }
            }, false);
        }
    }

    this.init();

    // set parameters
    // set methods
    this.setFreq = function(freq) {
        this.freq[0] = freq;
        //        alert("f "+this.freq[0]);
        this.sin[0].set({
            freq: this.freq[0]
        });
    }

    this.setGain = function(gain) {
        this.gain[0] = gain;
        //        alert("G "+this.gain[0]);
        this.sin[0].set({
            mul: this.gain[0]
        });
    }
    this.setPhaseDeg = function(phase) {
        this.phase[0] = phase * Math.PI / 180; // convert to radians
        this.sin[0].set({
            phase: this.phase[0]
        });
    }

    this.setFreqs = function(partial, freqs) {
        if (partial < this.numFreq) {
            this.freq[partial] = freqs;
            this.sin[partial].set({
                freq: this.freq[partial]
            });
        }
    }

    this.setGains = function(partial, gains) {
        if (partial < this.numFreq) {
            this.gain[partial] = gains;
            this.sin[partial].set({
                mul: (this.gain[partial] / this.numFreq)
            });
        }
    }
    this.setPhasesDeg = function(partial, phase) {
        if (partial < this.numFreq) {
            this.phase[partial] = phase * Math.PI / 180; // convert to radians
            this.sin[partial].set({
                phase: this.phase[partial]
            });
        }
    }

    this.setNumFreq = function(numFreq) {
        if (numFreq >= 1 && this.numFreq != numFreq) {

            this.tempFreq = [];
            this.tempGain = [];
            this.tempPhase = [];
            // grab all the setting values
            for (this.i = 0; this.i < this.numFreq; this.i++) {
                this.tempFreq[this.i] = this.freq[this.i];
                this.tempGain[this.i] = this.gain[this.i];
                this.tempPhase[this.i] = this.phase[this.i];
            }

            this.numFreq = numFreq;
            // reset values
            this.freq = [];
            this.gain = [];
            this.phase = [];
            this.sin = [];
            this.last = this.tempFreq.length; // how far to go
            if (this.numFreq < this.last) {
                this.last = this.numFreq; // new array is smaller
            }
            // restore the values
            for (this.i = 0; this.i < this.last; this.i++) {
                this.freq[this.i] = this.tempFreq[this.i];
                this.gain[this.i] = this.tempGain[this.i];
                this.phase[this.i] = this.tempFreq[this.i];
                this.sin[this.i] = T("osc", {
                    wave: "sin",
                    freq: this.freq[this.i],
                    phase: this.phase[this.i],
                    mul: this.gain[this.i]
                });
            }
            // the new array has more elments
            if (this.numFreq > this.last) {

                for (this.i = this.last; this.i < this.numFreq; this.i++) {
                    this.freq[this.i] = this.tempFreq[this.last - 1]; // repeat last frequency
                    this.gain[this.i] = 0; // but no gain
                    this.phase[this.i] = 0; // 0 phase
                    this.sin[this.i] = T("osc", {
                        wave: "sin",
                        freq: this.freq[this.i],
                        phase: this.phase[this.i],
                        mul: this.gain[this.i]
                    });
                }
            }
        }
    }

    // control sounds
    this.play = function() {
        this.sin[0].play();
    }
    this.pause = function() {
        this.sin[0].pause();
    }
} //end basic play button


function PlayButtonOsc(span, ownListen) {
    this.span = span;

    this.sin = [];

    this.waves = ["sin", "saw", "tri", "pulse", "fami", "konami"];

    this.curWave = 0;

    // the fundamental frequency
    this.sin[0] = T("osc", {
        wave: this.waves[this.curWave],
        freq: 800,
        mul: 1.0
    });
    this.freq = [880]; // current frequencies
    this.gain = [1.0]; // gains in relative intensity
    this.mulAdj = 1.0; // adjust gain for nonsine this.gai
    this.phase = [0]; // phases in radians.

    this.ownListen = ownListen;

    this.playBtn;

    // bind the object to itself
    var self = this;

    this.init = function() {
        // set up the buttons and their controls
        // start stop motion
        this.playBtn = document.createElement("input"); // check box for showing the intensity
        this.playBtn.setAttribute("type", "button");
        this.playBtn.setAttribute("value", "Play");
        this.span.appendChild(this.playBtn);

        if (this.ownListen != false) {

            this.playBtn.onclick = function() {
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    self.sin[0].pause();
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    this.gainAdj = (self.gain[this.i] / self.numFreq) * this.mulAdj;
                    self.sin[0].set({
                        mul: this.gainAdj
                    }).play();
                }
            }

            // touch listeners
            this.playBtn.addEventListener('touchstart', function(event) {
                event.preventDefault();
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    for (this.i = 0; this.i < self.sin.length; this.i++) {
                        self.sin[this.i].pause();
                    }
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    this.gainAdj = (self.gain[this.i] / self.numFreq);
                    self.sin[this.i].set({
                        mul: this.gainAdj
                    }).play();
                }
            }, false);
        }
    }

    this.init();

    // set parameters
    // set methods
    this.setFreq = function(freq) {
        this.freq[0] = freq;
        //        alert("f "+this.freq[0]);
        this.sin[0].set({
            freq: this.freq[0]
        });
    }

    this.setGain = function(gain) {
        this.gain[0] = gain;
        //        alert("G "+this.gain[0]);
        this.sin[0].set({
            mul: this.gain[0] * this.mulAdj
        });
    }
    this.setPhaseDeg = function(phase) {
        this.phase[0] = phase * Math.PI / 180; // convert to radians
        this.sin[0].set({
            phase: this.phase[0]
        });
    }
    this.setWave = function(waveIdx) {
        if (waveIdx < this.waves.length) {
            this.curWave = waveIdx;
            this.mulAdj = 1;
            if (this.curWave > 0) {
                this.mulAdj = 0.25;
            }
            this.sin[0].set({
                wave: this.waves[this.curWave],
                mul: this.gain[0] * this.mulAdj
            });
        }
    }

    // control sounds
    this.play = function() {
        this.sin[0].play();
    }
    this.pause = function() {
        this.sin[0].pause();
    }
} //end waveform changing play button

// building sounds out of a sound buffer
function PlayButtonBuffer(span, ownListen) {
    this.span = span;

    this.numFreq = 1;

    this.freq = [880]; // current frequencies
    this.gain = [1.0]; // gains in relative intensity
    this.phase = [0]; // phases in radians.

    // how fast the sound reaches full amplitude
    this.attack = 0;
    this.decay = 0;

    this.len = 44100;
    this.sampleRate = this.len; //normal
    //    this.sampleRate = 22050;
    this.buffer = new Float32Array(this.len);

    this.twoPI = 2 * Math.PI; // do a constant here so don't have to keep calculating it

    // create the sound buffer
    this.createBuffer = function() {
        this.totGain = 1.0;

        if (this.numFreq > 1) {
            for (this.i = 0; this.i < this.numFreq; this.i++) {
                this.totGain += this.gain[this.i];
            }
        }

        // clear the buffer
        for (this.i = 0; this.i < this.len; this.i++) {
            this.buffer[this.i] = 0;
        }

        // create new buffer
        for (this.f = 0; this.f < this.numFreq; this.f++) {
            this.oneCycle = this.freq[this.f] / this.len;
            //            alert(this.oneCycle + " f " + this.freq[this.f] + " l " + this.len + " g " + this.gain[this.f]);
            var startRampLength = this.attack * this.sampleRate; // the beginning ramp
            var endRampLength = this.decay * this.sampleRate; // the ending ramp
            var startSlope = 1.0 / startRampLength; // slope from 0 to max intensity
            var endSlope = 1.0 / endRampLength;

            for (this.i = 0; this.i < this.len; this.i++) {
                this.shape = 1.0;
                if (this.i < startRampLength) {
                    this.shape = this.i * startSlope;
                } else if (this.i > this.len - endRampLength) {
                    this.shape = (this.len - this.i) * endSlope;
                }

                this.buffer[this.i] += this.shape * this.gain[this.f] / (this.totGain) *
                    Math.sin(this.oneCycle * this.twoPI * this.i + this.phase[this.f]);
                // add in each component
                //                if (this.i < 100){
                //                    alert(this.i+" f "+this.f+" "+this.freq[this.f].toFixed(2)+" b "+this.buffer[this.i].toFixed(2));
                //                }
            }
        }
    }

    // call the first time to set up the sound buffer
    //    this.createBuffer();

    this.bufferObj = {
        buffer: this.buffer,
        samplerate: this.sampleRate
    };

    this.osc = T("buffer", {
        buffer: this.bufferObj,
        pitch: 1,
        loop: true
    });



    this.ownListen = ownListen;

    this.playBtn;

    // bind the object to itself
    var self = this;

    this.init = function() {
        // set up the buttons and their controls
        // start stop motion
        this.playBtn = document.createElement("input"); // check box for showing the intensity
        this.playBtn.setAttribute("type", "button");
        this.playBtn.setAttribute("value", "Play");
        this.span.appendChild(this.playBtn);

        if (this.ownListen != false) {

            this.playBtn.onclick = function() {
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    self.osc.pause();
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    self.osc.play();
                }
            }

            // touch listeners
            this.playBtn.addEventListener('touchstart', function(event) {
                event.preventDefault();
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    self.osc.pause();
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    self.osc.play();
                }
            }, false);
        }
    }

    this.init();

    // set parameters
    // set methods
    this.setFreq = function(freq) {
        this.freq[0] = freq;
        //        this.osc.set({
        //            freq: this.freq[0]
        //        });
    }

    this.setGain = function(gain) {
        this.gain[0] = gain;
        //        this.osc.set({
        //            mul: this.gain[0]
        //        });
    }
    this.setPhaseDeg = function(phase) {
        this.phase[0] = phase * Math.PI / 180; // convert to radians
        //        this.osc.set({
        //            phase: this.phase[0]
        //        });
    }

    this.setFreqs = function(partial, freqs) {
        if (partial < this.numFreq) {
            this.freq[partial] = freqs;
        }
    }

    this.setGains = function(partial, gains) {
        if (partial < this.numFreq) {
            this.gain[partial] = gains;
        }
    }
    this.setPhasesDeg = function(partial, phase) {
        if (partial < this.numFreq) {
            this.phase[partial] = phase * Math.PI / 180; // convert to radians
        }
    }

    this.setNumFreq = function(numFreq) {
        if (numFreq >= 1 && this.numFreq != numFreq) {
            if (numFreq > this.numFreq) {
                // add to arrays
                for (this.i = this.numFreq; this.i < numFreq; this.i++) {
                    this.freq[this.i] = 0;
                    this.gain[this.i] = 0;
                    this.phase[this.i] = 0;
                }
            }
            this.numFreq = numFreq;
        }
    }

    // control sounds
    this.play = function() {
        this.osc.play();
    }
    this.pause = function() {
        this.osc.pause();
    }

}

function PlayButtonFile(span, soundFile, ownListen) {
    this.span = span;

    this.isRunning = false; // flag if sound file is playing or not

    this.soundFile = soundFile; // the sound file to play
    this.playFile = T("audio").loadthis(this.soundFile).on("ended", function() {
        self.playFile.pause();
        self.isRunning = false;
    });

    this.gain = 1.0; // gains in relative intensity

    this.ownListen = ownListen;

    this.playBtn;

    // bind the object to itself
    var self = this;

    this.init = function() {
        // set up the buttons and their controls
        // start stop motion
        this.playBtn = document.createElement("input"); // check box for showing the intensity
        this.playBtn.setAttribute("type", "button");
        this.playBtn.setAttribute("value", "Play");
        this.span.appendChild(this.playBtn);

        if (this.ownListen != false) {

            this.playBtn.onclick = function() {
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    self.playFile.pause();
                    self.isRunning = false;
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    self.playFile.set({
                        mul: self.gain
                    });
                    self.playFile.bang().play();
                    self.isRunning = true;
                }
            }

            // touch listeners
            this.playBtn.addEventListener('touchstart', function(event) {
                event.preventDefault();
                if (self.playBtn.getAttribute("value") == "Pause") { // if the light is on, turn it off and change button so turn light on.
                    self.playBtn.setAttribute("value", "Play"); // change button word
                    self.playFile.pause();
                    self.isRunning = false;
                } else {
                    self.playBtn.setAttribute("value", "Pause"); // change the word
                    self.playFile.set({
                        mul: self.gain
                    });
                    self.playFile.bang().play();
                    self.isRunning = true;
                }
            }, false);
        }
    }

    this.init();

    // set parameters
    // set methods
    this.setGain = function(gain) {
        this.gain = gain;
        //        alert("G "+this.gain[0]);
        this.playFile.set({
            mul: this.gain
        });
    }

    this.setFile = function(path) {
        this.soundFile = path;
        this.playFile.loadthis(this.soundFile);
    }

    // control sounds
    this.play = function() {
        this.playFile.bang().play();
        this.isRunning = true;
    }
    this.pause = function() {
        this.playFile.pause();
        this.isRunning = false;
    }
} //end waveform changing play button