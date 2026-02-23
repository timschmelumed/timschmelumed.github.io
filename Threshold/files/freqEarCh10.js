// Parameters to control the model illustration
// This is for Steven's Power Law
function FreqEarCh10(controlId) {
    this.numFunctions = 1; // how many different version of the function will be drawn.
    // function line names
    this.dataLabels = ["Frequency (Hz)", "Threshold (dB)"];
    this.xAxisLabel = this.dataLabels[0];
    this.yAxisLabel = "Intensity (dB relative to max)";

    // what are the default parameters for each of the functions.  Parameters depend upon model calculator
    this.defaultData = Array();
    this.defaultData[0] = [125, 0]; // parameter for line 1: downward exponential function
    this.defaultData[1] = [250, 0];
    this.defaultData[2] = [500, 0];
    this.defaultData[3] = [1000, 0];
    this.defaultData[4] = [2000, 0];
    this.defaultData[5] = [4000, 0];
    this.defaultData[6] = [8000, 0];
    this.defaultData[7] = [10000, 0];

    this.data = [];
    // assign by primitive so assign by value not reference and can change this values without losing default values
    for (this.i = 0; this.i < this.defaultData.length; this.i++) {
        this.data[this.i] = [];
        this.data[this.i][0] = this.defaultData[this.i][0];
        this.data[this.i][1] = this.defaultData[this.i][1];
    }

    // which functions are displayed initially
    this.defaultDisplay = [true, true];

    // limits for the function and graph
//    this.xMin = 0;
//    this.xMax = -50;
//    this.xStep = 5;

    // information on the y axis
    this.fixedY = true; // does the y axis have fixed values.  if so what are they
    this.yMin = -50;
    this.yMax = 0;

    // illustration parameters to send to the graph
    this.dataShow = new IllusParam(SET_DATA, [true, this.data]);
    this.axisLabels = new IllusParam(SET_AXIS_LABELS, ["Frequency of Tone (Hz)", "Threshold Intensity (dB)"]);
    this.yRange = new IllusParam(SET_Y_RANGE, [this.yMin, this.yMax]);
    this.hideResBtn = new IllusParam(SHOW_RES_BTN, false);
    this.dataLabelsVal = new IllusParam(SET_DATA_LABELS, this.dataLabels);

    // bind the object to itself
    var self = this;

    // set up the objects to control the model - receive a span object to deal with
    this.span = document.getElementById(controlId); // get the span element
    // test
    this.span.innerHTML = "<strong name='text'>Alter Parameters of the Sound Wave Here</strong><br>";

    // the parameters object to be passed to the model loader to update the output
    this.parameters = { // populate the parameters value with the default values
        // assign parameters as fundamental object so pass by value not reference.
        whichDisp: [this.defaultDisplay[0], true],
        paramVal: []
    };

    // special display parameters
    //    this.xMaxVal = new xySpecialParam(X_MAX_VAL,true,this.xMax);


    // objects to run the db steps animation
    this.dbStep = 5; // the number of decibel steps to decline
    this.gainVal = 1.0;
    this.runSeries; // timer to handle the db animation
    this.pauseStep; // timer to do pauses between steps
    this.db = new dbConverter();
    this.isRunning = false; // flag if the series is already started
    this.lastAmp = 1.0;
    this.numStep = 10;
    this.curStep = 0;
    this.lastFreq = 0;


    // layout parameters
    this.pctLandscape = 32; // if the device is wide, landscape sliders to right, width is 33 pct screen
    this.pctPortrait = 90; // if device is protrait or narrow, sliders below, width is 90 pct screen
    this.pct = this.pctLandscape; // current pct of screen.
    if (window.innnerWidth <= window.innerHeight) { // check current dimension of browser
        // bias to below as take advantage of scrolling
        this.pct = this.pctPortrait;
    }

    // add a play pause button
    this.playSpan = document.createElement("span");
    this.play = new PlayButton(this.playSpan, false);
    this.span.appendChild(this.playSpan);
    this.span.appendChild(document.createTextNode("  "));

    this.calibBtn = document.createElement("input"); // check box for showing the intensity
    this.calibBtn.setAttribute("type", "button");
    this.calibBtn.setAttribute("value", "Adjust");
    this.span.appendChild(this.calibBtn);
    this.span.appendChild(document.createElement("br"));

    this.slider1AmpCanvas = document.createElement("canvas");
    this.ampSpan = document.createElement("span");
    this.span.appendChild(this.ampSpan);
    this.slider1Amp = new Slider("Adjust intensity until you can just hear this tone: ", this.slider1AmpCanvas, this.pct);
    this.slider1Amp.setRange(0.0, 1.0);
    this.slider1Amp.setSliderStep(0.001);
    this.slider1Amp.setShowValue(false);
    this.slider1Amp.setValue(0.3);
    this.slider1Amp.drawSlider();
    this.span.appendChild(document.createElement("br"));


    // What frequency to play
    this.freqSpan = document.createElement("span");
    this.freqBtns = new RadioList("Frequency (Hz):", this.freqSpan, [125, 250, 500, 1000, 2000, 4000, 8000, 10000],
        "whatfreq", [125, 250, 500, 1000, 2000, 4000, 8000, 10000],
        0, HORIZONTAL);
    this.span.appendChild(this.freqSpan);
    this.span.appendChild(document.createElement("br"));

    // collect responses
    this.dataSpan = document.createElement("span"); // overall span where the response objects will be
    this.holdSpan = document.createElement("span"); // the actual span with the objects
    this.respLabel = document.createTextNode("How many steps did you hear?");
    this.holdSpan.appendChild(this.respLabel);
    this.holdSpan.appendChild(document.createElement("br"));
    // response buttons
    this.respSpan = document.createElement("span");
    this.respBtns = new RadioList("Steps:", this.respSpan, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "numsteps", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        0, VERTICAL);
    this.holdSpan.appendChild(this.respSpan);

    this.span.appendChild(this.dataSpan);
    this.span.appendChild(document.createElement("br"));

    this.span.appendChild(document.createElement("br"));
    this.internalExplanation = document.createElement("p");
    this.internalExplanation.setAttribute("class", "paragraphs");
    this.span.appendChild(this.internalExplanation); // the internal explanation is an explanatory piece
    // that is modified depending upon the controls here.

    // update if sliders are active
    this.setEnable = function() {

        // control internal explanations here
    };

    this.setEnable();

    // set up the check box listeners

    // run the series
    this.update = function() {
        clearInterval(self.runSeries); // stop the series
        self.freqBtns.setChecked(self.lastFreq);
        self.lastAmp = self.gainVal;
        self.gainVal = self.db.dBToGain(self.gainVal, -self.dbStep); // get the new gain value
        self.play.setGain(self.gainVal); // set the parameters
        //        self.play.createBuffer();

        self.play.play(); // start the sound
        self.curStep++; // increase step counter

        self.pauseStep = setInterval(self.pause, 1000);
    }

    this.pause = function() {
        clearInterval(self.pauseStep); // stop the timer
        self.play.pause(); // stop the sound
        self.freqBtns.setChecked(self.lastFreq);

        // give a brief break
        if (self.curStep < self.numStep) {
            // pause before next step
            self.runSeries = setInterval(self.update, 500);
        } else {
            self.isRunning = false;
            self.dataSpan.appendChild(self.holdSpan);
        }
    }

    // set up the check box listeners
    // click listeners
    this.playSpan.onclick = function() {
        if (self.isRunning == false && self.calibBtn.getAttribute("value") == 'Adjust') {
            self.lastFreq = self.freqBtns.getChecked();
            if (self.dataSpan.childElementCount == 1) {
                self.respBtns.setChecked(0);
                self.dataSpan.removeChild(self.holdSpan);
            }
            self.play.setFreq(Number(self.freqBtns.getValue()));
            self.gainVal = self.slider1Amp.getValue();
            self.curStep = 0;
            self.lastAmp = self.gainVal;
            self.dbStep = 5.0;

            self.isRunning = true;

            self.play.setGain(self.gainVal);
            //            self.play.createBuffer();
            self.play.play();

            self.pauseStep = setInterval(self.pause, 1000); // run the series
        }
    };
    this.calibBtn.onclick = function() {
        if (self.isRunning === false) {
            if (self.calibBtn.getAttribute("value") === "Done") { // if the light is on, turn it off and change button so turn light on.
                self.calibBtn.setAttribute("value", "Adjust");
                self.play.pause();
                self.ampSpan.removeChild(self.slider1AmpCanvas);
            } else {
                self.calibBtn.setAttribute("value", "Done");

                self.ampSpan.appendChild(self.slider1AmpCanvas);
                // calibration done
                self.play.setFreq(500);
                self.play.setGain(0.3);
                self.play.play();
            }
            self.setEnable();
        }
    }

    // touch listeners
    this.playSpan.addEventListener('touchend', function(event) {
        event.preventDefault();
        // check if experiment is not running and calibration is not running
        if (self.isRunning == false && self.calibBtn.getAttribute("value") == 'Adjust') {
            self.lastFreq = self.freqBtns.getChecked();
            if (self.dataSpan.childElementCount == 1) {
                self.respBtns.setChecked(0);
                self.dataSpan.removeChild(self.holdSpan);
            }
            self.play.setFreq(Number(self.freqBtns.getValue()));
            self.gainVal = self.slider1Amp.getValue();
            self.curStep = 0;
            self.lastAmp = self.gainVal;
            self.dbStep = 5.0;

            self.isRunning = true;

            self.play.setGain(self.gainVal);
            //            self.play.createBuffer();
            self.play.play();

            self.pauseStep = setInterval(self.pause, 1000); // run the series
        }
    }, false);

    // change the format for wide to narrow and the reverse
    this.reformat = function() {
        if (window.innerWidth <= window.innerHeight) { // determine if narrow or wide
            this.pct = this.pctPortrait;
        } else {
            this.pct = this.pctLandscape;
        }
        // reset the slider widths
    };

    // getters and setters
    // the basic function to get the current parameters of the object
    this.getParameters = function() {

        if (this.calibBtn.getAttribute("value") == 'Done') {
            this.play.setGain(this.slider1Amp.getValue());
        }

        // update the sound frequency
        if (this.dataSpan.childElementCount == 1) {
            if (this.respBtns.getValue() == 0) {
                this.data[this.lastFreq][1] = 0;

            } else {
                this.data[this.lastFreq][1] = (this.respBtns.getValue() - 1) * -this.dbStep;
            }
        }


        // collect the parameters
        parameters = [this.dataLabelsVal, this.dataShow, this.axisLabels, this.yRange, this.hideResBtn];

        return parameters;
    };
    this.getSpecialParameters = function() { // return any parameters to add additional elements to the plot.
        var specialParameters = [];
        return specialParameters;
    };

    // get any setup parameters
    this.getSetupParameters = function() {
        var setupParam = null;

        return setupParam;
    };

    // setters
    this.setDefault = function() {
        // set the conditions back to the default values
        // first set the parameter object  // do it by primitive so pass by value not by reference
        // now the sliders
        // line 1

        // reset which sliders track
        this.setEnable();
    };

    this.explanation = "Use the <em>Adjust</em> button and the slider that appears to adjust the sound following the directions. ";
    this.explanation += "The select a frequency and press play.  Count how many of the steps you can hear. ";
    this.explanation += "When done, enter the number of steps you heard and the data will be entered into the bar graph. ";
    this.explanation += "When you have done all of the frequencies, you will have map of how your sensitivity changes ";
    this.explanation += "depending upon frequency.  Press the <em>Show Data</em> button to see the data values. ";
}