// A graphing object draw a bar graph .
// Y axes are of at least an interval scale.  X axis is nominal scale
// this is the basic plotting object
function Bar_Plot(idPlot) {
    this.graphArea = document.getElementById(idPlot); // results graph canvas
    this.context = null; // the drawing context
    // default settings
    this.def = new Defaults();

    // drawing objects and parameters
    this.draw = null; // drawing object
    this.dataReady = false; // flag if the data has been presented
    this.useData = true; // this is a graphic object so needs data from outside.
    this.plotRel = false; //  plot the data relative to maximum value
    this.resultsLevel = 0.5; // the x value for the results parameter to shown on graph
    this.dvType = "Threshold"; // what the results parameter is.
    this.dvUnit = "";
    this.yMin0 = false; // in autoscale hold y min at 0
    this.adjustSize = true; // flag to allow results canvas to adjust to size of screen.
    this.roomControls = false; // flag if need to make room for controls
    this.background = this.def.defBackground;
    this.foreground = colorString(20, 20, 20);
    this.showLegend = false;
    this.barColors = this.def.defLinesColors;
    this.useGradient = false;
    this.barColorsStop = this.def.defLineColors; // if use a gradient these are the stop colors
    this.doMulti = false;
    this.multiColors = [];

    // axis objects and parameters
    this.axisStroke = 2;
    this.xLabel = "The x-axis label";
    this.yLabel = "The y-axis label";
    this.xMin = 0; // min an max vales of x Axis
    this.xMax = 100;
    this.yMin = 10000; // min and max values of y axis
    this.yMax = -10000;
    this.autoXScale = true; // allow the program to fit the x spread of the data to the x axis
    this.autoYScale = true; // allow the program to fit the y spread of the data to the y axis
    this.method = MOL; //  Method indicator if needed to set the threshold on the graph

    // data array and parameters
    this.data = [];
    this.numLines = 1; // the number of lines that are in the data.  Allow for extra data.  can be set by experiment
    this.dataLabels = [];
    this.useExtraLabels = false;
    this.extraLabels = []; // if the labels are passed via another object and not data directly.
    this.hideValueLabels = false;
    this.explanation = "";

    // buttons
    this.dataButton = null; // button to show the data in a CSV format
    this.showDataButton = true;
    this.resultButton = null; // shows the calculated results
    this.showResButton = true; // flag to cause the show result button to be shown.
    this.showResVal = false;

    // special ways to add indications on the graph.
    this.showXVals = false; // put the x values on the bars
    //    this.xValShow = 0; // what x value to highlight.
    this.xValColor = colorString(100, 255, 100);

    this.showYLine = false; // flag to draw a particular y value as a horizontal line all the way across
    this.yValShow = 0.5; // the y value to show
    this.yLineColor = colorString(255, 128, 0); // color of y value line
    this.h_pro = this.def.defGraphHeightPro;; // proportion of the vertical area available to use for the graph.
    this.w_pro = 1.0; // adjust the width used if controls are available

    this.specialParam = []; // an array of special parameters that can be passed to add special
    // features to the xy scatter plot

    // bind for listeners
    var self = this;

    // do listeners here
    this.doListen = true;

    this.initDOM = function() { // call the initDOM objects to initial them
        if (this.graphArea !== null) {
            this.draw = new Draw(this.graphArea);
        }
    };

    // initialize the results plot
    this.setupResults = function(dvType) {
        this.dvType = dvType; // what type of dv does this experiment have.
        if (this.dvType = 'Reaction Time') {
            this.yMin0 = true; // in reaction time experiments make minimum value a 0;
        }

        // initialize DOM objects if not called
        this.initDOM();

        if (this.doListen) {
            // setup button listeners
            // relevant listeners
            this.graphArea.onmousedown = function(event) {
                // determine location of the mouse
                this.event = event || window.event;
                // clear the background
                var x, y;

                // get location of click on canvas
                if (event.pageX || event.pageY) {
                    x = this.event.pageX;
                    y = this.event.pageY;
                } else {
                    x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                x -= self.graphArea.offsetLeft; // correct for page offsets
                y -= self.graphArea.offsetTop;

                if (self.showDataButton) { // check if the data button has been clicked, if visible
                    if (self.dataButton.isClickOverButton(x, y) & self.dataButton.buttonDrawn) {
                        self.dataButton.setButtonColors(self.dataButton.buttonPressed1, self.dataButton.buttonPressed2);
                        self.dataButton.drawButton();
                    }
                }
                if (self.showResButton) { // check if the show result button has been clicked, if visible
                    if (self.resultButton.isClickOverButton(x, y) & self.resultButton.buttonDrawn) {
                        self.resultButton.setButtonColors(self.resultButton.buttonPressed1, self.resultButton.buttonPressed2);
                        self.resultButton.drawButton();
                    }
                }
            }; // end mousedown on draw canvas

            this.graphArea.onmouseup = function(event) {
                if (self.showDataButton) {
                    if (self.dataButton.buttonDrawn) { // only worry if the button has been drawn
                        // redraw the button
                        self.dataButton.setButtonColors(self.dataButton.buttonNorm1, self.dataButton.buttonNorm2);
                        self.dataButton.drawButton();
                    }
                }
                if (self.showResButton) {
                    if (self.resultButton.buttonDrawn) { // only worry if the button has been drawn
                        // redraw the button
                        self.resultButton.setButtonColors(self.resultButton.buttonNorm1, self.resultButton.buttonNorm2);
                        self.resultButton.drawButton();
                    }
                }
            }; // end onmouseup

            this.graphArea.onclick = function(event) {
                // only worry about the click if the data has been displayed
                if (self.dataReady) {
                    this.event = event || window.event;

                    var x, y; // x and y position of the click, ultimately

                    // get location of click on canvas
                    if (event.pageX || event.pageY) {
                        x = this.event.pageX;
                        y = this.event.pageY;
                    } else {
                        x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                        y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                    }
                    x -= self.graphArea.offsetLeft; // correct for page offsets
                    y -= self.graphArea.offsetTop;

                    // now see if there is a click over a button
                    if (self.showDataButton) {
                        var showDataResp = self.dataButton.isClickOverButton(x, y);
                        if (showDataResp) {
                            self.showDataTable();
                        }
                    }
                    self.showResultsVal = false;
                    if (self.showResButton) {
                        self.showResultsVal = self.resultButton.isClickOverButton(x, y);
                        if (self.showResultsVal) {
                            self.showResultVal();
                            if (self.method == MOCS) { // if the methods is MOCS redraw graph to show threshold.
                                self.drawResults();
                            }
                        }
                        // if the show results button is clicked redraw the results.
                    }
                }
            }; // end click handler
        }

        this.drawResults(); // call the results drawing method for the first time.
    };

    // the main results drawing method
    this.drawResults = function() {
        // get the drawing context
        this.context = this.graphArea.getContext("2d");
        this.initDOM();

        if (this.adjustSize) { // check for screen size changes
            if (this.roomControls === false) { // if no controls fill browser
                resizeCanvas(this.graphArea, this.context, def.defProWidthFull, this.h_pro * def.defProHeightFull);
            } else if (this.roomControls === true) { // if controls, reduce overall canvas
                if (window.innerWidth > window.innerHeight) { // for wide browsers reduce width
                    resizeCanvas(this.graphArea, this.context, this.w_pro * this.def.defProWidthConW, this.h_pro * this.def.defProHeightFull);
                } else { // if browser window is tall
                    resizeCanvas(this.graphArea, this.context, this.w_pro * this.def.defProWidthFull, this.h_pro * this.def.defProWidthConH);
                }
            }
        }

        // grab the canvas size into variables
        var width = this.graphArea.width; // width of canvas
        var height = this.graphArea.height; // height of column in pixels

        // clear canvas
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, width, height);

        if (this.dataReady) { // if data has been collected plot the data
            // if plotting relative values, go convert
            if (this.plotRel) {
                this.makeRelative();
            }

            // figure out the dimensions of the graph
            var gW = width * 3 / 5; // initial dimensions for the graph
            if (!this.showDataButton & !this.showResButton) {
                gW = width * 85 / 100; // if there is not a show data button, use all the area for the graph.
            }
            var gH = height * 4 / 5;
            // where does the graph start
            var originX = width / 20;
            var originY = height * 9 / 10;
            // axes drawing parameters
            this.draw.setStrokeWidth(2);
            this.draw.foreground = this.foreground;

            // draw the axes labels
            this.context.setFont = this.def.defFont12;
            this.context.fillStyle = this.foreground;
            // make sure there is enough room for the x-axis label.
            var xAxisTxX = (height - 2 * this.def.defFontSizePx - 2);
            originX = 3 * this.def.defFontSizePx + 2;
            originY = xAxisTxX; // index the origin by the height of the text
            // Draw the axis
            this.draw.drawAxes(originX, originY, gW, gH);

            // now determine the xMin and xMax and yMin and yMax if needed
            if (this.autoYScale) {
                var newYmin = 1000; // use these variables so don't reset variables from other lines
                var newYmax = -2000;
                for (var i = 1; i <= this.numLines; i++) { // check all the lines to plot
                    if (this.data[0][i] !== null) { // check to make sure there is data in this line
                        var newMaxMin = this.scaleAxis(this.data, i);
                        newYmin = newMaxMin[0];
                        newYmax = newMaxMin[1];
                        if (newYmin < this.yMin) {
                            this.yMin = newYmin;
                        }
                        if (newYmax > this.yMax) {
                            this.yMax = newYmax;
                        }
                    }
                }
                // reset ymin to 0 if needed to
                if (this.yMin0) {
                    this.yMin = 0;
                }
            }
            //alert("xmin = "+this.xMin+" "+"xmax = "+this.xMax+" "+"ymin = "+this.yMin+" "+"ymax = "+this.yMax)

            // draw the x axis label here
            this.context.font = this.def.defFont12;
            var textLength = this.context.measureText(this.xLabel).width;
            this.context.textAlign = "center";
            this.context.fillText(this.xLabel, originX + gW / 2, height - 1);

            // now draw the y-label
            this.draw.font = this.def.defFont12;
            this.draw.foreground = this.foreground;
            this.draw.fillRotatedText(this.yLabel, 90, 10, originY - gH / 2);
            // draw the y-axis anchors
            this.draw.fillRotatedText(this.yMin.toFixed(0), 90, originX - this.def.defFontSizePx * 3 / 2, originY);

            var yMaxLabel = this.yMax.toFixed(0); // label for y max value
            if (this.yMax < 10) {
                yMaxLabel = this.yMax.toFixed(1); // if y max is small enough add a decimal place
            }

            textLength = this.context.measureText(this.yMax.toFixed(0)).width;
            this.draw.fillRotatedText(yMaxLabel, 90,
                originX - this.def.defFontSizePx * 3 / 2, originY - gH + textLength / 2 - 2);

            // call the data drawing routine
            // update the data labels.
            if (this.useExtraLabels && this.extraLabels.length == this.data.length) {
                for (this.m = 0; this.m < this.extraLabels.length; this.m++) {
                    this.data[this.m][0] = this.extraLabels[this.m];
                }
            }
            for (var k = 1; k <= this.numLines; k++) { // draw only those lines desired.
                //                alert("numLInes "+this.numLines+" line "+k+" "+data.length);
                if (this.data[0][k] !== null) {
                    this.drawData(this.data, k, this.barColors[k - 1], originX, originY, gW, gH);
                }
            }

            // if needed draw the y line value
            if (this.showYLine) {
                this.drawYLine(this.yValShow, this.yLineColor, originX, originY, gW, gH);
            }

            // clear around graph.
            this.context.fillStyle = this.background;
            this.context.fillRect(originX, 0, width, originY - gH); // above the graph

            // place the buttons on the screen.
            if (this.showDataButton) {
                this.dataButton = new Button(this.graphArea, "Show Data", width * 9 / 10, height / 50, width / 10, width / 25);
                this.dataButton.drawButton();
            }
            if (this.showResButton) {
                this.resultButton = new Button(this.graphArea, "Show " + this.dvType,
                    width * 9 / 10, height / 50 + width / 10, width / 10, width / 25);
                this.resultButton.buttonFont = def.defFont14;
                this.resultButton.drawButton();
            }

            // if the show results value has been pressed:
            if (this.showResultsVal) {
                if (this.method == MOCS) {
                    this.showResultOnGraph(this.resultsLevel, this.resultsVal, this.def.defResultColor, originX, originY, gW, gH);
                }
            }

            // if show the legend draw it now
            if (this.showLegend) {
                this.drawLegend(this.barColors, originX, originY, gW, gH);
            }

            // debug
            //            this.context.fillStyle = "black";
            //            this.context.fillText(this.numLines, 10, 20);
        } else {
            var s = "The experiment has not been completed.";
            var s1 = "There are no results to display.";
            this.context.font = this.def.defFont18;
            this.context.fillStyle = this.def.defForeground;
            this.context.textAlign = "center";
            this.context.fillText(s, width / 2, height / 2);
            this.context.fillText(s1, width / 2, height / 2 + 20);
        }

    }; // end draw results.

    this.makeRelative = function() {
        this.max = -1000;
        // find the maximum value
        for (this.i = 0; this.i < this.data.length; this.i++) {
            for (this.j = 1; this.j < this.data[0].length; this.j++) {
                if (this.max < this.data[this.i][this.j]) {
                    this.max = this.data[this.i][this.j];
                }
            }
        }
        //      alert("this.max = "+this.max);
        // now convert to relative values
        if (this.max > 0) {
            for (this.i = 0; this.i < this.data.length; this.i++) {
                for (this.j = 1; this.j < this.data[0].length; this.j++) {
                    this.data[this.i][this.j] = this.data[this.i][this.j] / this.max;
                }
            }
        }
    };

    this.drawData = function(data, line, color, originX, originY, gW, gH) {
        //        alert("draw data " + line + " " + data.length + " " + data[line - 1].length + " " + color);
        if (data[0][line] !== null) { // only plot if there is data null is a flax to not plot this function
            this.xAxisLength = gW; // not sure I need this.
            var xStep = gW / (this.data.length);
            var yStep = (this.yMax - this.yMin) / gH; // converting distance of axes to axis step per pixels.
            this.halfBarWidth = xStep / (4 * this.numLines);

            this.context.fillStyle = color;
            if (this.useGradient) {
                // draw the bars with a linear gradient
                this.gradient = this.context.createLinearGradient(originX, originY - gH, originX, originY);
                this.gradient.addColorStop(0, this.barColorsStop[line - 1]);
                this.gradient.addColorStop(1, this.barColors[line - 1]);
            }

            // determine point locations in pixels
            var xy = []; // array of points
            for (var i = 0; i < data.length; i++) {
                xy[i] = [];
                xy[i][0] = (data[i][0]); // these are bar labels not values.
                //                xy[i][1] = originY - (data[i][line] - this.yMin) / yStep;
                xy[i][1] = (data[i][line] - this.yMin) / yStep; // height of bar

            }

            // draw bars
            for (i = 0; i < data.length; i++) {
                if (data[i][line] >= this.yMin) {

                    this.xStart = i * xStep + this.halfBarWidth * 2 * (line - 1) + originX + this.halfBarWidth;
                    //                    this.xStart = i * xStep + this.halfBarWidth * 2 * (line) + originX + this.halfBarWidth;
                    this.yStart = originY - xy[i][1];
                    //this.yStart = 0;
                    this.barW = 2 * this.halfBarWidth;
                    this.barH = xy[i][1];

                    this.context.fillStyle = color;

                    if (this.doMulti) {
                        this.context.fillStyle = this.multiColors[i];
                    }

                    if (this.useGradient) {
                        this.context.fillStyle = this.gradient;
                    }
                    this.context.fillRect(this.xStart, this.yStart, this.barW, this.barH);
                }

                //do the x axis labels but only on the first line
                if (line === 1 & this.hideValueLabels === false) {
                    // only write the labels if they exist
                    if (data[i][0] != null) {
                        this.xCtr = i * xStep + this.halfBarWidth * 2 * (line - 1) + originX + this.halfBarWidth + this.halfBarWidth * this.numLines;
                        this.context.fillStyle = this.def.defForeground;
                        this.context.textAlign = "center";
                        this.context.fillText(data[i][0], this.xCtr, originY + 12);
                    }
                }

                // if add data values add them now
                if (this.showXVals) {
                    this.xCtr = i * xStep + this.halfBarWidth * 2 * (line - 1) + originX + this.halfBarWidth + this.halfBarWidth * this.numLines;
                    this.context.fillStyle = this.xValColor;
                    this.context.textAlign = "center";
                    this.s = data[i][line].toFixed(1);
                    this.context.fillText(this.s, this.xCtr, originY - 15);
                }
            }
        }
    }; // end draw data

    this.drawLegend = function(colors, originX, originY, gW, gH) {
        // go through the lines that are being displayed
        this.context.textAlign = "left";
        this.context.font = this.def.defFont;
        // determine the longest entry in the labels
        var maxText = 0;
        for (var i = 1; i < this.dataLabels.length; i++) {
            if (this.context.measureText(this.dataLabels[i].width > maxText)) {
                maxText = this.context.measureText(this.dataLabels[i]).width;
            }
        }
        // now put the legend on the graph
        for (i = 1; i < this.dataLabels.length; i++) {
            this.context.fillStyle = colors[i - 1];
            this.context.fillText(this.dataLabels[i],
                originX + gW - 0.1 * window.innerWidth - maxText, (i) * 13); // write out the label.
            this.draw.foreground = colors[i - 1];
            this.draw.line(originX + gW - 0.1 * window.innerWidth - maxText - 0.05 * window.innerWidth, i * 13 - 5,
                originX + gW - 0.1 * window.innerWidth - maxText - 2, i * 13 - 5); // draw lines of the proper color
        }
    };

    // display a indicated y value line
    this.drawYLine = function(yValShow, color, originX, originY, gW, gH) {
        var yStep = (this.yMax - this.yMin) / gH; // these two values are the conversions of
        // the size of x and y values to pixels.
        var yPos = originY - (yValShow - this.yMin) / yStep; //  first the two x values
        //        alert("draw Y LIne " + yValShow + "  color " + color);
        // draw the line (need to figure out how to set the line stroke style)
        this.draw.foreground = color;
        this.draw.strokeWidth = 2;
        this.draw.line(originX, yPos, originX + gW, yPos);
    };


    /**
     *Method to plot the result (threshold or pse) on graph
     */
    this.showResultOnGraph = function(value, result, color, originX, originY, gW, gH) {
        var xStep = (this.xMax - this.xMin) / gW; // converting distance of axes to axis step per pixels.
        var yStep = (this.yMax - this.yMin) / gH;

        this.context.strokeStyle = color;

        // determine points
        var resX = (result - this.xMin) / xStep + originX;
        var resY = originY - (value - this.yMin) / yStep;

        // draw the lines
        this.context.beginPath();
        this.context.moveTo(originX, resY);
        this.context.lineTo(resX, resY);
        this.context.lineTo(resX, originY);
        this.context.stroke();

        // highlight the result
        this.context.strokeRect(resX - 3, resY - 3, 6, 6);
    };

    this.scaleAxis = function(data, index) {
        var maxMin = []; // 0 = minimum 1 = maximum
        maxMin[0] = data[0][index]; // initialize values
        maxMin[1] = data[0][index]; //
        for (var i = 1; i < data.length; i++) {
            if (maxMin[0] > data[i][index]) {
                maxMin[0] = data[i][index];
            }
            if (maxMin[1] < data[i][index]) {
                maxMin[1] = data[i][index];
            }
        }
        return maxMin;
    };

    // method to display the data table
    this.showDataTable = function() {
        // add the labels
        var dataString = "";
        var labelString = "";
        for (var i = 0; i < this.dataLabels.length; i++) {
            labelString += this.dataLabels[i];
            if (i < this.dataLabels.length - 1) {
                labelString += ", ";
            }
        }
        dataString += labelString + "<br>";

        // determine the window dimensions
        var width = this.context.measureText(labelString).width + 50;
        var height = screen.height;
        var windowDescr = 'width=' + width + ',height=' + height + ', left=0, toolbar=yes, location=no,';
        windowDescr += 'directories=no, status=no, menubar=no, scrollbars=yes, resizable=no,';
        windowDescr += 'copyhistory=no, titlebar=no';
        var dataWindow = window.open('', '_blank', windowDescr);
        //      var dataWindow=window.open('');

        // now add the data
        for (var l = 0; l < this.data.length; l++) {
            // this counts trials
            for (var j = 0; j < this.dataLabels.length; j++) {
                // this loop adds all the elements of a trial
                if (this.data[l][j] !== null) {
                    if (isNaN(this.data[l][j])) {
                        dataString += this.data[l][j]; // since some elements of bargraphs axes might not be string check for this.
                    } else {
                        dataString += this.data[l][j].toFixed(2);
                    }
                }
                if (j < this.dataLabels.length - 1) {
                    dataString += ", ";
                }
            }
            dataString += "<br>"; // next trial on new line
        }

        //      dataWindow.document.write("<p>This is 'myWindow'</p>");
        dataWindow.document.write(dataString);
        dataWindow.focus();
    };

    // getters and setters
    // setters
    // set the DOM objects
    this.setDOMObjects = function(idResults) {
        this.graphArea = document.getElementById(idResults); // results graph canvas
    };
    // set the size of the canvas
    this.setSize = function(canvasWidth, canvasHeight) {
        this.adjustSize = false;
        this.graphArea.width = canvasWidth;
        this.graphArea.height = canvasHeight;
    };
    /**
     *This method sets the data into the results object and also redraws the data graph now allowing
     * the graph to be drawn.
     */
    this.setData = function(data) {
        this.data = data;
        this.dataReady = true;
        //        if (this.dataReady){
        //          alert("data present "+this.data.length+" "+this.data[0][0]+" "+this.data[0][1]+" X ");
        //        }
    };

    this.setSecondData = function(data2) {
        // not implemented or probably needed but a place holder
    };

    /**
     * Method to set the range of the y-axis
     */
    this.setYRange = function(ymin, ymax) {
        this.autoYScale = false;
        this.yMin = ymin;
        this.yMax = ymax;
    };

    // sets special parameters for the bar graph to add novel display elements
    this.setSpecialParameters = function(specialParameters) {
        if (specialParameters instanceof xySpecialParam) {
            //            if (specialParameters.typeExtra == CONNECT_VAL) {
            //                this.showConnect = specialParameters.showExtra;
            //                this.typeConnect = specialParameters.extraParam;
            //            }
            if (specialParameters.typeExtra == HIDE_X_LABELS) {
                this.hideValueLabels = specialParameters.showExtra;
            }
            if (specialParameters.typeExtra == GRADIENT) {
                this.useGradient = specialParameters.showExtra;
                this.barColors = specialParameters.extraParam[0];
                this.barColorsStop = specialParameters.extraParam[1];
            }
            if (specialParameters.typeExtra == X_VAL) {
                this.showXVal = specialParameters.showExtra;
                this.xValShow = specialParameters.extraParam;
            }
            if (specialParameters.typeExtra == X_COLOR) {
                if (specialParameters.showExtra) {
                    this.xValColor = specialParameters.extraParam;
                }
            }
            if (specialParameters.typeExtra == SHOW_POINT) {
                this.showPoint = specialParameters.showExtra;
                this.pointToShow = specialParameters.extraParam;
            }
            if (specialParameters.typeExtra == LINE_COLOR) {
                if (specialParameters.showExtra === true) {
                    // set true to effect change
                    this.barColors = specialParameters.extraParam;
                }
            }
        } // if just one special parameter is passed
        else if (specialParameters === null) {
            // capture null data.
        } else if (specialParameters.length >= 1) { // is an array of special parameters passed
            for (var i = 0; i < specialParameters.length; i++) {
                // now check each special parameter
                if (specialParameters[i] instanceof xySpecialParam) {
                    if (specialParameters[i].typeExtra == HIDE_X_LABELS) {
                        this.hideValueLabels = specialParameters[i].showExtra;
                    }
                    if (specialParameters[i].typeExtra == GRADIENT) {
                        this.useGradient = specialParameters[i].showExtra;
                        this.barColors = specialParameters[i].extraParam[0];
                        this.barColorsStop = specialParameters[i].extraParam[1];
                    }
                    if (specialParameters[i].typeExtra == SHOW_X_VAL_ON_GRAPH) {
                        this.showXVals = specialParameters[i].showExtra;
                        this.xValColor = specialParameters[i].extraParam[0];
                    }
                    if (specialParameters[i].typeExtra == SHOW_Y_LINE) {
                        this.showYLine = specialParameters[i].showExtra;
                        this.yValShow = specialParameters[i].extraParam[0];
                    }
                    if (specialParameters[i].typeExtra == Y_LINE_COLOR) {
                        this.yLineColor = specialParameters[i].extraParam[0];
                    }
                    if (specialParameters[i].typeExtra == X_VAL) {
                        this.showXVal = specialParameters[i].showExtra;
                        this.xValShow = specialParameters[i].extraParam;
                        // see if need to add data to histogram data
                        if (this.showHistogram & this.showXVal) {
                            this.addHistValue(this.xValShow);
                        }
                    }
                    if (specialParameters[i].typeExtra == X_COLOR) {
                        if (specialParameters[i].showExtra) {
                            this.xValColor = specialParameters[i].extraParam;
                        }
                    }
                    if (specialParameters[i].typeExtra == SHOW_POINT) {
                        this.showPoint = specialParameters[i].showExtra;
                        this.pointToShow = specialParameters[i].extraParam;
                    }
                    if (specialParameters[i].typeExtra == LINE_COLOR) {
                        if (specialParameters[i].showExtra === true) {
                            // set true to effect change
                            this.barColors = specialParameters[i].extraParam;
                        }
                    }
                    if (specialParameters[i].typeExtra == MULTI_COLOR) {
                        this.doMulti = specialParameters[i].showExtra;
                        this.multiColors = specialParameters[i].extraParam;
                    }
                    if (specialParameters[i].typeExtra == DO_RELATIVE) {
                        this.plotRel = specialParameters[i].showExtra;
                    }
                }
            } // end going through array
        } // end checking for array of special parameters
    }; // end setSpecialParameters

    // function for setup parameters
    this.setSetupParam = function(setupParam) {
        // do not need any setup parameters here.
    };
}

// the version of the object that will display results explanations and results values.
function Bar_Graph(idResults, idResExpl, idResultVal) {
    this.graph = new Bar_Plot(idResults); // the actual graphing object
    this.graph.doListen = false; // if graph called from this object, listen from here
    this.explainP = document.getElementById(idResExpl); // results explanation paragraph
    this.resultTag = document.getElementById(idResultVal);
    this.threshSpan = document.createElement("span");
    if (this.resultTag != null){
        this.resultTag.appendChild(this.threshSpan);
    }

    // default settings
    this.def = new Defaults();

    // drawing objects and parameters
    this.dataReady = false; // flag if the data has been presented
    this.useData = true; // this is a graphic object so needs data from outside.
    this.showResultsVal = false; // flag if the results (threshold or PSE) is to be put on the screen
    this.resultsVal = null; // the results value
    this.resultsLevel = 0.5;
    this.dvType = "Threshold"; // what the results parameter is.
    this.yMin0 = false; // if the minimum should be 0 while allowing axes to
    this.dvUnit = "";
    this.adjustSize = true; // flag to allow results canvas to adjust to size of screen.
    this.roomControls = false; // flag if need to make room for controls
    this.background = this.def.defBackground;
    this.foreground = colorString(20, 20, 20);
    this.showLegend = false;
    this.barColors = this.def.defLinesColors;

    // axis objects and parameters
    this.axisStroke = 2;
    this.xLabel = "The x-axis label";
    this.yLabel = "The y-axis label";
    this.xMin = 0; // min an max vales of x Axis
    this.xMax = 100;
    this.yMin = 10000; // min and max values of y axis
    this.yMax = -10000;
    this.autoXScale = true; // allow the program to fit the x spread of the data to the x axis
    this.autoYScale = true; // allow the program to fit the y spread of the data to the y axis
    this.method = MOL; //  Method indicator if needed to set the threshold on the graph

    // data array and parameters
    this.data = [];
    this.numLines = 1; // the number of lines that are in the data.  Allow for extra data.  can be set by experiment
    this.dataLabels = [];
    this.explanation = "";

    // buttons
    this.showDataButton = true;
    this.showResButton = true; // flag to cause the show result button to be shown.
    this.showResVal = false;

    // special ways to add indications on the graph.
    //  this.xValShow = 0;   // what x value to highlight.
    //  this.xValColor = colorString(100,255,100);
    this.specialParam = []; // an array of special parameters that can be passed to add special
    // features to the xy scatter plot

    // file downloading objects
    this.MIME_TYPE = 'text/plain';
    this.a = []; // array of download a href objects of the download 

    // bind for listeners
    var self = this;

    this.initDOM = function() { // call the initDOM objects to initial them
        if (this.explainP !== null) {
            this.explainP.setAttribute("class", "paragraphs");
        }
        this.graph.initDOM(); // if init DOM for this plot with explanation, also do for plot
    };

    // initialize the results plot
    this.setupResults = function(dvType) {
        this.dvType = dvType; // what type of dv does this experiment have.
        if (this.dvType = 'Reaction Time') {
            this.yMin0 = true; // in reaction time experiments make minimum value a 0;
        }
        this.graph.setupResults(dvType);
        this.graph.barColors = this.barColors;

        // initialize DOM objects if not called
        this.initDOM();

        // clear the results value
        this.clearResultVal();
        this.clearExpl();

        // setup button listeners
        // relevant listeners
        this.graph.graphArea.onmousedown = function(event) {
            // determine location of the mouse
            this.event = event || window.event;
            // clear the background
            var x, y;

            // get location of click on canvas
            if (event.pageX || event.pageY) {
                x = this.event.pageX;
                y = this.event.pageY;
            } else {
                x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            x -= self.graph.graphArea.offsetLeft; // correct for page offsets
            y -= self.graph.graphArea.offsetTop;

            if (self.graph.showDataButton) { // check if the data button has been clicked, if visible
                if (self.graph.dataButton.isClickOverButton(x, y) & self.graph.dataButton.buttonDrawn) {
                    self.graph.dataButton.setButtonColors(self.graph.dataButton.buttonPressed1,
                        self.graph.dataButton.buttonPressed2);
                    self.graph.dataButton.drawButton();
                }
            }
            if (self.graph.showResButton) { // check if the show result button has been clicked, if visible
                if (self.graph.resultButton.isClickOverButton(x, y) & self.graph.resultButton.buttonDrawn) {
                    self.graph.resultButton.setButtonColors(self.graph.resultButton.buttonPressed1,
                        self.graph.resultButton.buttonPressed2);
                    self.graph.resultButton.drawButton();
                }
            }
        }; // end mousedown on draw canvas

        this.graph.graphArea.onmouseup = function(event) {
            if (self.graph.showDataButton) {
                if (self.graph.dataButton.buttonDrawn) { // only worry if the button has been drawn
                    // redraw the button
                    self.graph.dataButton.setButtonColors(self.graph.dataButton.buttonNorm1,
                        self.graph.dataButton.buttonNorm2);
                    self.graph.dataButton.drawButton();
                }
            }
            if (self.graph.showResButton) {
                if (self.graph.resultButton.buttonDrawn) { // only worry if the button has been drawn
                    // redraw the button
                    self.graph.resultButton.setButtonColors(self.graph.resultButton.buttonNorm1,
                        self.graph.resultButton.buttonNorm2);
                    self.graph.resultButton.drawButton();
                }
            }
        }; // end onmouseup

        this.graph.graphArea.onclick = function(event) {
            // only worry about the click if the data has been displayed
            if (self.dataReady) {
                this.event = event || window.event;

                var x, y; // x and y position of the click, ultimately

                // get location of click on canvas
                if (event.pageX || event.pageY) {
                    x = this.event.pageX;
                    y = this.event.pageY;
                } else {
                    x = this.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                    y = this.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                }
                x -= self.graph.graphArea.offsetLeft; // correct for page offsets
                y -= self.graph.graphArea.offsetTop;

                // now see if there is a click over a button
                if (self.graph.showDataButton) {
                    var showDataResp = self.graph.dataButton.isClickOverButton(x, y);
                    if (showDataResp) {
                        self.graph.showDataTable();
                    }
                }
                self.showResultsVal = false;
                if (self.graph.showResButton) {
                    self.graph.showResultsVal = self.graph.resultButton.isClickOverButton(x, y);
                    if (self.graph.showResultsVal) {
                        self.showResultVal();
                        if (self.method == MOCS) { // if the methods is MOCS redraw graph to show threshold.
                            self.drawResults();
                        }
                    }
                    // if the show results button is clicked redraw the results.
                }
            }
        }; // end click handler

        // Rockstars use event delegation! 
        // drag listeners for Chrome and Opera (hopefully firefox soon)
        document.body.addEventListener('dragstart', function(e) {
            var a = e.target;
            if (a.classList.contains('dragout')) {
                e.dataTransfer.setData('DownloadURL', a.dataset.downloadurl);
            }
        }, false);

        document.body.addEventListener('dragend', function(e) {
            var a = e.target;
            if (a.classList.contains('dragout')) {
                cleanUp(a);
            }
        }, false);

        this.drawResults(); // call the results drawing method for the first time.
    };

    // the main results drawing method
    this.drawResults = function() {
        // pass needed parameters on to the plot object
        // figure out which ones I can remove before I am done here.
        this.graph.adjustSize = this.adjustSize; // does the graph adjust size
        this.graph.dataReady = this.dataReady; // has data been collected
        //        this.graph.showDataButton = this.showDataButton; // is the show data button visible
        this.graph.showDataButton = false; // hide this button now that I have the download link.
        this.graph.showResButton = this.showResButton; // is the show results button visible
        this.graph.autoYScale = this.autoYScale;
        this.graph.autoXScale = this.autoXScale;
        this.graph.showResultsVal = this.showResultsVal; // flag if the results (threshold or PSE) is to be put on the screen
        this.graph.showLegend = this.showLegend;
        this.graph.useData = this.useData; // this is a graphic object so needs data from outside.
        this.graph.resultsVal = this.resultsVal; // the results value
        this.graph.resultsLevel = this.resultsLevel;
        this.graph.roomControls = this.roomControls; // flag if need to make room for controls
        this.graph.background = this.background;
        this.graph.foreground = this.foreground;
        //      this.graph.lineColors = this.lineColors;

        // axis objects and parametersgraph.
        this.graph.axisStroke = this.axisStroke;
        this.graph.xLabel = this.xLabel;
        this.graph.yLabel = this.yLabel;
        this.graph.xMin = this.xMin; // min an max vales of x Axis
        this.graph.xMax = this.xMax;
        this.graph.yMin = this.yMin; // min and max values of y axis
        this.graph.yMax = this.yMax;
        this.graph.autoXScale = this.autoXScale; // allow the program to fit the x spread of the data to the x axis
        this.graph.autoYScale = this.autoYScale; // allow the program to fit the y spread of the data to the y axis
        this.graph.method = this.method; //  Method indicator if needed to set the threshold on the graph

        // data array and parameters
        //      this.graph.data = this.data;
        this.graph.numLines = this.numLines; // the number of lines that are in the data.  Allow for extra data.  can be set by experiment
        this.graph.dataLabels = this.dataLabels;

        this.graph.drawResults();
    };

    this.clearResultVal = function() {
        // clear the results value
        if (this.threshSpan !== null) {
            this.threshSpan.innerHTML = "";
        }
        if (this.showDataButton) {
            if (this.a.length > 0) {
                this.resultTag.removeChild(this.resultTag.lastChild); // remove the last node
                this.cleanUp(this.a[0], ""); // clean up aftermyself.
            }
        }
    };

    this.showResultVal = function() {
        this.showResultsVal = true;
        var s = "Your " + this.dvType + " = " + this.resultsVal.toFixed(2) + " " + this.dvUnit;
        // clear the results value
        self.threshSpan.innerHTML = s + "<br>";
    };

    this.clearExpl = function() {
        var innerHTML = "";
        //
        if (this.explainP !== null) {
            this.explainP.innerHTML = innerHTML;
        }
    };

    this.showExpl = function() {
        // show the explanation for the text
        //      var innerHTML = "Here is where I will explain the results,";
        //      innerHTML += " yep, right here.";
        //
        this.explainP.innerHTML = this.explanation;

    };

    // these are functions to help download data
    this.cleanUp = function(a, removalText) {
        a.textContent = removalText;

        // Need a small delay for the revokeObjectURL to work properly.
        setTimeout(function() {
            window.URL.revokeObjectURL(a.href);
        }, 1500);
    };

    this.downloadFile = function(dataset, parentObject, fileName, buttonText, removalText) {
        this.dataset = dataset; // the data set to download in a text.csv file
        this.parentObject = parentObject; // the parent object to put the link when the data set is ready to go.
        this.buttonText = buttonText;
        this.removeText = removalText;
        this.fileName = fileName;

        window.URL = window.webkitURL || window.URL; // need a url object

        var bb = new Blob([dataset], { type: this.MIME_TYPE }); // blobify the text

        var curA = this.a.length;

        this.a[curA] = document.createElement('a'); // create the download link.
        this.a[curA].setAttribute("class", "downloadLink");
        this.a[curA].download = this.fileName;
        this.a[curA].href = window.URL.createObjectURL(bb);
        this.a[curA].textContent = this.buttonText;

        this.a[curA].dataset.downloadurl = [this.MIME_TYPE, this.a[curA].download, this.a[curA].href].join(':');
        this.a[curA].draggable = true; // Don't really need, but good practice.
        this.a[curA].classList.add('dragout');

        this.parentObject.appendChild(this.a[curA]);

        this.a[curA].onclick = function(e) {
            self.cleanUp(this, removalText);
        };
    };

    this.setupDownloadData = function() {
        // add the labels
        var ouptupString = "";
        var labelString = "";
        for (var i = 0; i < this.dataLabels.length; i++) {
            labelString += this.dataLabels[i];
            if (i < this.dataLabels.length - 1) {
                labelString += ", ";
            }
        }
        outputString = labelString + "\n";

        // now add the data
        for (var l = 0; l < this.data.length; l++) {
            // this counts trials
            for (var j = 0; j < this.data[l].length; j++) {
                // this loop adds all the elements of a trial
                if (this.data[l][j] !== null) {
                    outputString += this.data[l][j];
                }
                if (j < this.dataLabels.length - 1) {
                    outputString += ", ";
                }
            }
            outputString += "\n";
            //            alert(l + " " + this.data.length + "\n" + outputString);
        }

        var outputSpan = document.createElement('span');
        this.resultTag.appendChild(outputSpan);
        this.downloadFile(outputString, outputSpan, "myData.csv", "Download Data", "Data Downloaded");
    }

    // method to display the data table
    this.showDataTable = function() {
        // add the labels
        var dataString = "";
        var labelString = "";
        for (var i = 0; i < this.dataLabels.length; i++) {
            labelString += this.dataLabels[i];
            if (i < this.dataLabels.length - 1) {
                labelString += ", ";
            }
        }
        dataString += labelString + "<br>";

        // determine the window dimensions
        var width = this.context.measureText(labelString).width + 50;
        var height = screen.height;
        var windowDescr = 'width=' + width + ',height=' + height + ', left=0, toolbar=yes, location=no,';
        windowDescr += 'directories=no, status=no, menubar=no, scrollbars=yes, resizable=no,';
        windowDescr += 'copyhistory=no, titlebar=no';
        var dataWindow = window.open('', '_blank', windowDescr);
        //      var dataWindow=window.open('');

        // now add the data
        for (var l = 0; l < this.data.length; l++) {
            // this counts trials
            for (var j = 0; j < this.dataLabels.length; j++) {
                // this loop adds all the elements of a trial
                if (this.data[l][j] !== null) {
                    dataString += this.data[l][j].toFixed(2);
                }
                if (j < this.dataLabels.length - 1) {
                    dataString += ", ";
                }
            }
            dataString += "<br>"; // next trial on new line
        }

        //      dataWindow.document.write("<p>This is 'myWindow'</p>");
        dataWindow.document.write(dataString);
        dataWindow.focus();
    };

    // histogram methods
    // add a value to the histogram array
    this.addHistValue = function(val) {
        this.graph.addHistValue(val);
    };


    // getters and setters
    // setters
    // set the DOM objects
    this.setDOMObjects = function(idResults, idResExpl, idResultVal) {
        this.graph.setDOMObjects(idResults);
        this.explainP = document.getElementById(idResExpl); // results explanation paragraph
        this.resultTag = document.getElementById(idResultVal);
        this.threshSpan = document.createElement("span");
        this.resultTag.appendChild(this.threshSpan);
    };
    // set the size of the canvas
    this.setSize = function(canvasWidth, canvasHeight) {
        this.graph.setSize(canvasWidth, canvasHeight);
        this.adjustSize = false;
    };
    /**
     *This method sets the data into the results object and also redraws the data graph now allowing
     * the graph to be drawn.
     */
    this.setData = function(data) {
        this.graph.setData(data);
        this.data = data;
        this.dataReady = true;
        this.showExpl();
        this.drawResults();

        // setup download data
        if (this.showDataButton) {
            this.setupDownloadData(); // call routine to set up the download link for the data.
        }

    };

    this.setSecondData = function(data2) {
        this.graph.setSecondData(data2);
        // not implemented or probably needed but a place holder
    };

    /**
     *Sets the results value.  As this is not the data array, it does not reset the dataReady flag and
     * does not call the drawResults method.
     */
    this.setResultsVal = function(resultsVal) {
        this.graph.resultsVal = resultsVal;
        this.resultsVal = resultsVal; // the threshold or PSE
    };

    /**
     * Method to set the range of the y-axis
     */
    this.setYRange = function(ymin, ymax) {
        this.autoYScale = false;
        this.yMin = ymin;
        this.yMax = ymax;
        this.autoYScale = false;
        this.graph.setYRange(ymin, ymax);
    };

    // sets special parameters for the bar graph to add novel display elements
    this.setSpecialParameters = function(specialParameters) {
        this.graph.setSpecialParameters(specialParameters);
        //alert('in set special param length = '+specialParameters.length);
    }; // end setSpecialParameters

    // function for setup parameters
    this.setSetupParam = function(setupParam) {
        // do not need any setup parameters here.
        this.graph.setSetupParam(setupParam);
    };

    // if used in an illustration, need these routines
    // initialize the graph
    this.init = function() {
        this.initDOM();
        this.setupResults();
    }

    // need draw when illustration so just call the draw results graph
    this.draw = function() {
        this.drawResults();
    }

    // set the current parameters of the illustration
    this.setParameters = function(param) {
        if (param === null) {
            // capture null data.
        } else if (param.length >= 1) { // is an array of special parameters passed
            for (var i = 0; i < param.length; i++) {
                // now check each special parameter
                if (param[i] instanceof IllusParam) { // is it the right type of object
                    if (param[i].typeParam == SET_DATA) {
                        var oldData = transferArrayElements2d(this.data);
                        this.data = transferArrayElements2d(param[i].value[1]);
                        this.dataReady = param[i].value[0];
                        this.graph.setData(this.data);
                        if (this.showDataButton == true) {
                            if (this.a.length == 0 && this.data.length > 0) {
                                this.setupDownloadData();
                            } else if (!arrayIsEqual(this.data, oldData) && this.data.length > 0) {
                                this.clearResultVal(); // if new data is added and the data has been downloaded, ie the url has been cleared, reset it
                                this.setupDownloadData();
                            }
                        }
                        //                        this.data = param[i].value[1];
                    } else if (param[i].typeParam == SET_AXIS_LABELS) {
                        this.xLabel = param[i].value[0];
                        this.yLabel = param[i].value[1];
                    } else if (param[i].typeParam == SET_Y_RANGE) {
                        this.yMin = param[i].value[MIN];
                        this.yMax = param[i].value[MAX];
                        this.autoYScale = false;
                    } else if (param[i].typeParam == SHOW_RES_BTN) {
                        this.showResButton = param[i].value;
                    } else if (param[i].typeParam == SHOW_DATA_BTN) {
                        this.showDataButton = param[i].value;
                    } else if (param[i].typeParam == SET_DATA_LABELS) {
                        this.dataLabels = param[i].value;
                    }
                }
            } // end going through array
        } // end checking for array of special parameters
        this.draw();
    };
}