// global variables
// stimulus parameters
var def = new Defaults(); // default settings


// handles the parts of an illustration on the webpage.
function Illustration(model, modelParam, plot) {
    // assign the passed objects to local variables
    this.model = model; // the model computational function, handles the math
    this.modelParam = modelParam; // the parameters for how this model will be operated in this illustration
    this.plot = plot; // the plotting object for the model

    var self = this; // bind the object to itself.

    this.init = function() {
        // this is the initialization function
        this.model.init(this.modelParam); // pass the model parameters on to the function
        if (this.modelParam.useSecond) {
            this.model.useSecondParam = true;
        }


        // now initialize the plot element
        this.plot.numLines = this.modelParam.numFunctions; // tell the graph how many lines to expect.
        this.plot.dataLabels = this.modelParam.dataLabels; // how to label the different functions.
        this.plot.xLabel = this.modelParam.xAxisLabel; // set the axis labels.
        this.plot.yLabel = this.modelParam.yAxisLabel;
        this.plot.showDataButton = false; // data and result are not to be displayed.
        this.plot.showResButton = false;
        this.plot.drawDots = false; // since generated data, do not need dots.
        this.plot.showLegend = true; // display the legend.
        //		if (this.fixedY) {
        this.plot.setYRange(this.modelParam.yMin, this.modelParam.yMax);
        //		}
        this.plot.roomControls = true; // make room for controls.
        this.plot.setSetupParam(this.modelParam.getSetupParameters());
        this.plot.explanation = this.modelParam.explanation; // pass on the explanation
        if (this.modelParam.secondSpecial === true) {
            this.plot.secondSpecial = true;
        }

        this.plot.setupResults(""); //
        // initial test of getting the data
        var data = this.model.getFunctions();


        // initialize the stimulus window with the first set of data
        this.plot.setData(data);

        //window resizing
        window.onresize = function() {
            // resize everything
            self.plot.drawResults();
            self.modelParam.reformat();
        };

        // set up the update function
        this.update = setInterval(function() {
            self.doUpdate();
        }, 150);
    }; // end init function

    // setup of the button listeners
    this.setupListener = function(idReset) {
        var resetButton = document.getElementById(idReset);
        // setup the reset Listener
        resetButton.onclick = function() {
            self.modelParam.setDefault();
        };
        resetButton.addEventListener('touchstart', function(event) {
            event.preventDefault();
            self.modelParam.setDefault();
        }, false);
    };

    this.doUpdate = function() {
        var curParam = this.modelParam.getParameters(); // find the current settings
        this.plot.dataLabels = this.modelParam.dataLabels; // how to label the different functions.
        this.model.setParameters(curParam); // pass them to the model
        var curSpParam = this.modelParam.getSpecialParameters(); // current special plotting parameters

        // check for special parameters to send to model
        if (curSpParam != null) {
            for (this.i = 0; this.i < curSpParam.length; this.i++) {
                if (curSpParam[this.i].typeExtra == X_MAX_VAL) {
                    this.model.xMax = curSpParam[this.i].extraParam;
                }
            }

            this.plot.setSpecialParameters(curSpParam); // anything special about the plotting?
            if (this.modelParam.secondSpecial) {
                this.plot.setSecondSpecialParam(this.modelParam.getSecondSpecialParam());
            }
        }

        var data = this.model.getFunctions(); // get the current model values back to display
        this.plot.setData(data); // send the data to the plotting object

        if (this.modelParam.useSecond) { // are these other values to collect different way of interacting with the model.
            var secondData = this.model.getSecond(this.modelParam.typeSecond, this.modelParam.getSecondParam());
            // check collecting data
            // get any secondary parameters
            this.plot.setSecondData(secondData);
        }
    };
} // end illustration object

// setup the tab handler.
window.onload = function() {
    // see if using tabs
    var useTabs = document.getElementById("useTabs");
    if (useTabs != null && useTabs.value == "true") {
        pageSetup();
    }
};

var CHANGE_UPDATE = 1000;

// handles the parts of an illustration on the webpage for a figure that is not model based
function Figure(param, illus) {
    // assign the passed objects to local variables
    this.param = param; // the parameters for how this illustration will be operated in this figure
    this.illus = illus; // the drawing object

    this.updateRate = 150; // current update rate

    var self = this; // bind the object to itself.

    this.init = function() {
        // this is the initialization function
        this.illus.init(this.param); // pass the model parameters on to the function

        this.illus.roomControls = true; // make room for controls.
        this.illus.explanation = this.param.explanation; // pass on the explanation
        this.illus.showExpl();

        //window resizing
        window.onresize = function() {
            // resize everything
            //			self.plot.draw();
            self.param.reformat();
        };

        // set up the update function
        this.update = setInterval(function() {
            self.doUpdate();
        }, this.updateRate);
    }; // end init function

    // setup of the button listeners
    this.setupListener = function(idReset) {
        var resetButton = document.getElementById(idReset);
        // setup the reset Listener
        resetButton.onclick = function() {
            self.param.setDefault();
        };
        resetButton.addEventListener('touchstart', function(event) {
            event.preventDefault();
            self.param.setDefault();
        }, false);
    };

    this.doUpdate = function() {
        var curParam = this.param.getParameters(); // find the current settings
        // check if update rate needs to be changed
        for (this.i = 0; this.i < curParam.length; this.i++) {
            if (curParam[this.i] instanceof IllusParam) {
                if (curParam[this.i].typeParam == CHANGE_UPDATE) {
                    if (this.updateRate != curParam[this.i].value) {
                        clearInterval(this.update);
                        self.resetUpdate(curParam[this.i].value); // change the update rate
                    }
                }
            }
        }

        this.illus.setParameters(curParam); // pass them to the model
        this.illus.draw();
    };

    this.resetUpdate = function(resetVal) {
        if (!isNaN(parseFloat(resetVal))) {
            this.updateRate = resetVal;
            this.update = setInterval(function() {
                self.doUpdate();
            }, this.updateRate);
        }
    };
} // end illustration object