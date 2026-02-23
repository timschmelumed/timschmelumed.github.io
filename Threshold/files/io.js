function CheckBox(span, label, checked) {
    this.span = span; // the DOM span to append the checkbox and its label

    // status of the checked box
    this.checked = false;
    if (checked === true) {
        this.checked = checked;
    }

    this.holdChecked = this.checked; // hold flag to allow this checkbox to be unenabled.
    this.enabled = true;

    // bind object to self
    var self = this;

    this.span.setAttribute("class", "controlLabel"); // set the name for the text
    this.check = document.createElement("input"); // create an input element
    this.check.setAttribute("type", "checkbox"); // the the input element a checkbox
    this.check.setAttribute("class", "controlLabel");
    this.check.checked = this.checked; // set default check state
    //	this.check.setAttribute("class","controlLabel");	// set the name for the text
    this.chkText; // declare the object that will hold either the text or an image
    if (label instanceof Image) {
        //        alert("load an image");
        this.chkText = document.createElement("canvas");
        this.loadedPicture = function() {
            self.chkText.width = label.naturalWidth;
            self.chkText.height = label.naturalHeight;
            self.context = self.chkText.getContext("2d");
            self.context.drawImage(label, 0, 0, self.chkText.width, self.chkText.height);
        }

        do {
            // hold program until image is loaded
        } while (this.imgLoaded == false);

        label.onload = this.loadedPicture;

        this.chkText.width = 10;
        this.chkText.height = 10;
    } else {
        this.chkText = document.createElement("strong"); // add text
        this.chkText.setAttribute("class", "controlLabel"); // set the name for the text
        this.chkText.appendChild(document.createTextNode(" " + label + " ")); // set the label add a space for formatting
    }
    this.span.appendChild(this.check); // append the the checkbox
    this.span.appendChild(this.chkText); // append the text

    // change pointers to single an active element
    this.check.style.cursor = "pointer";
    this.chkText.style.cursor = "pointer";

    // internal listeners
    // click
    this.check.onclick = function() {
        if (self.enabled === false) {
            self.check.checked = self.holdChecked;
        } else {
            //			self.checked = self.check.checked;
        }
        self.checked = self.check.checked;
    };
    // expand click area using text
    this.chkText.onclick = function() {
        if (self.enabled === false) {
            self.check.checked = self.holdChecked;

        } else {
            self.check.checked = !self.check.checked;
        }
        self.checked = self.check.checked;
    };

    // touch
    this.chkText.addEventListener('touchstart', function(event) {
        event.preventDefault();
        if (self.enabled === false) {
            self.check.checked = self.holdChecked;
        } else {
            self.check.checked = !self.check.checked;
        }
        self.checked = self.check.checked;
    }, false);

    // setters and getters
    // function to allow check box to be rendered inactive or not  Need to figure out how to do this
    this.setEnable = function(b) {
        this.enabled = b;
        if (this.enabled === false) {
            this.holdChecked = this.checked;
            this.chkText.setAttribute("class", "controlLabelUnenabled"); // set the name for the text
            this.span.setAttribute("class", "controlLabelUnenabled"); // set the name for the text
        } else {
            this.chkText.setAttribute("class", "controlLabel"); // set the name for the text
            this.span.setAttribute("class", "controlLabel"); // set the name for the text
        }
    };

    // set the check status
    this.setChecked = function(b) {
        if (b === true) {
            this.checked = b;
            this.check.checked = b;
        } else {
            this.checked = false;
            this.check.checked = false;
        }
    };

    this.getChecked = function(){
        return this.check.checked;
    }
}

function CheckBox_s(label, checked) {
    this.span = document.createElement("span"); // the DOM span to append the checkbox and its label

    // status of the checked box
    this.checked = false;
    if (checked === true) {
        this.checked = checked;
    }

    this.holdChecked = this.checked; // hold flag to allow this checkbox to be unenabled.
    this.enabled = true;

    // bind object to self
    var self = this;

    this.span.setAttribute("class", "controlLabel"); // set the name for the text
    this.check = document.createElement("input"); // create an input element
    this.check.setAttribute("type", "checkbox"); // the the input element a checkbox
    this.check.checked = this.checked;
    //  this.check.setAttribute("class","controlLabel");    // set the name for the text
    this.chkText; // declare the object that will hold either the text or an image
    if (label instanceof Image) {
        //        alert("load an image");
        this.chkText = document.createElement("canvas");
        this.loadedPicture = function() {
            self.chkText.width = label.naturalWidth;
            self.chkText.height = label.naturalHeight;
            self.context = self.chkText.getContext("2d");
            self.context.drawImage(label, 0, 0, self.chkText.width, self.chkText.height);
        }

        do {
            // hold program until image is loaded
        } while (this.imgLoaded == false);

        label.onload = this.loadedPicture;

        this.chkText.width = 10;
        this.chkText.height = 10;
    } else {
        this.chkText = document.createElement("strong"); // add text
        this.chkText.setAttribute("class", "controlLabel"); // set the name for the text
        this.chkText.appendChild(document.createTextNode(" " + label + " ")); // set the label add a space for formatting
    }
    this.span.appendChild(this.check); // append the the check box
    this.span.appendChild(this.chkText); // append the text

    // change pointers to single an active element
    this.check.style.cursor = "pointer";
    this.chkText.style.cursor = "pointer";

    // internal listeners
    // click
    this.check.onclick = function() {
        if (self.enabled === false) {
            self.check.checked = self.holdChecked;
        } else {
            //          self.checked = self.check.checked;
        }
        self.checked = self.check.checked;
        // create an event
        this.changeEvent = new CustomEvent(
            "onchange", {
                detail: {
                    message: "Check box has Change",
                    value: self.checked,
                    time: window.performance.now(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        self.check.dispatchEvent(this.changeEvent); // dispatch event the checkbox has changed
    };
    // expand click area using text
    this.chkText.onclick = function() {
        if (self.enabled === false) {
            self.check.checked = self.holdChecked;

        } else {
            self.check.checked = !self.check.checked;
        }
        self.checked = self.check.checked;
        this.changeEvent = new CustomEvent(
            "onchange", {
                detail: {
                    message: "Check box has Change",
                    value: self.checked,
                    time: window.performance.now(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        self.check.dispatchEvent(this.changeEvent); // dispatch event the checkbox has changed
    };

    // touch
    this.chkText.addEventListener('touchstart', function(event) {
        event.preventDefault();
        if (self.enabled === false) {
            self.check.checked = self.holdChecked;
        } else {
            self.check.checked = !self.check.checked;
        }
        self.checked = self.check.checked;
        this.changeEvent = new CustomEvent(
            "onchange", {
                detail: {
                    message: "Check box has Change",
                    value: self.checked,
                    time: window.performance.now(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        self.check.dispatchEvent(this.changeEvent); // dispatch event the checkbox has changed
    }, false);

    // setters and getters
    // function to allow check box to be rendered inactive or not  Need to figure out how to do this
    this.setEnable = function(b) {
        this.enabled = b;
        if (this.enabled === false) {
            this.holdChecked = this.checked;
            this.chkText.setAttribute("class", "controlLabelUnenabled"); // set the name for the text
            this.span.setAttribute("class", "controlLabelUnenabled"); // set the name for the text
        } else {
            this.chkText.setAttribute("class", "controlLabel"); // set the name for the text
            this.span.setAttribute("class", "controlLabel"); // set the name for the text
        }
    };

    // set the check status
    this.setChecked = function(b) {
        if (b === true) {
            this.checked = b;
            this.check.checked = b;
        } else {
            this.checked = false;
            this.check.checked = false;
        }
    };
}

function Radio(span, label, name, value, checked) {
    this.span = span; // the DOM span to append the checkbox and its label
    this.enabled = true; // flag if responds to click

    // status of the checked box
    this.checked = false;
    if (checked === true) {
        this.checked = checked;
    }

    // bind object to self
    var self = this;

    this.radio = document.createElement("input"); // create an input element
    this.radio.setAttribute("type", "radio"); // the the input element a checkbox
    this.radio.setAttribute("name", name); // name of the collection of radio buttons
    this.radio.setAttribute("value", value); // value of this radio button
    this.radioText = document.createElement("strong"); // add text
    this.radioText.setAttribute("name", "controlLabel"); // set the name for the text
    this.radioText.appendChild(document.createTextNode(" " + label + " ")); // set the label add a space for formatting
    this.span.appendChild(this.radio); // append the the checkbox
    this.span.setAttribute("class", "controlLabel");
    this.span.appendChild(this.radioText); // append the text
    this.radio.checked = this.checked;

    // change pointers to single an active element
    this.radio.style.cursor = "pointer";
    this.radioText.style.cursor = "pointer";

    // internal listeners
    // click
    this.radio.onchange = function() {
        //        self.checked = self.radio.checked;
        //        alert("radio button change " + self.checked + " " + self.radio.checked + " " + self.radio.value);
    }
    //    this.radio.onclick = function() {
    //        self.checked = self.radio.checked;
    //    };
    // expand click area using text
    this.radioText.onclick = function() {
        self.radio.checked = true;
        self.checked = self.radio.checked;
    };

    // touch
    this.radioText.addEventListener('touchstart', function(event) {
        event.preventDefault();
        self.radio.checked = true;
        self.checked = self.radio.checked;
    }, false);

    // setters and getters
    // function to allow check box to be rendered inactive or not  Need to figure out how to do this
    this.setEnable = function(b) {
        this.enabled = b;
        if (this.enable) {
            this.span.removeAttribute("class");
            this.span.setAttribute("class", "enabled");
        } else {
            // signal disable
            this.span.removeAttribute("class");
            this.span.setAttribute("class", "unenabled");
        }
    };

    // set the check status
    this.setChecked = function(b) {
        if (b === true) {
            this.checked = b;
            this.radio.checked = b;
        } else {
            this.checked = false;
            this.radio.checked = false;
        }
    };

    this.getChecked = function() {
        return this.radio.checked;
    }
}

var HORIZONTAL = true; // arrange radio buttons horizontaly
var VERTICAL = false; // arrange radio buttons vertically

function RadioList(title, span, labels, name, values, numChecked, horz) {
    this.span = span; // the DOM span to append the checkbox and its label
    this.labels = labels; // the text for each button
    this.values = values; // the value code for each button
    this.enabled = true; // are the radio buttons allowed to be changed

    // bind
    var self = this;

    // add the title
    this.titleSpan = document.createElement("span");
    this.titleSpan.innerHTML = "<strong class='controlLabel'>" + title + "</strong>";
    this.span.appendChild(this.titleSpan);
    if (!horz) {
        this.span.appendChild(document.createElement("br"));
    } else {
        this.titleSpan.innerHTML += " ";
    }

    // create the list
    this.buttons = Array(); // array of radio buttons

    for (this.i = 0; this.i < this.labels.length; this.i++) {
        this.buttons[this.i] = new Radio(this.span, this.labels[this.i], name, this.values[this.i], false);
        if (!horz) {
            this.span.appendChild(document.createElement("br"));
        }
        else {
            this.span.appendChild(document.createTextNode("  "));
        }
    }


    //    this.span.appendChild(this.radioText); // append the text

    // setters and getters
    // function to allow check box to be rendered inactive or not  Need to figure out how to do this
    this.setEnable = function(b) {
        this.enable = b;
        if (this.enable) {
            this.span.removeAttribute("class");
            this.span.setAttribute("class", "enabled");
        } else {
            // signal disable
            this.span.removeAttribute("class");
            this.span.setAttribute("class", "unenabled");
        }

        for (this.i = 0; this.i < this.buttons.length; this.i ++){
            this.buttons[this.i].setEnable(b);
        }
    };

    // set the check status
    this.setChecked = function(num) {
        // clear all buttons
        for (this.i = 0; this.i < this.buttons.length; this.i ++){
            this.buttons[this.i].setChecked(false);
        }
        // check if in range.  If out of range no buttons are set
        if (num < this.buttons.length && num >= 0) {
            this.buttons[num].setChecked(true);
        }
    };


    // set the check status at the initial situation
    this.setChecked(numChecked);

    // get the radio button that is currently checked
    this.getValue = function() {
        this.value = -1;

        this.numBtn = this.buttons.length;

        for (this.i = 0; this.i < this.numBtn; this.i++) {
            if (this.buttons[this.i].getChecked()) { // determine the value assigned to the checked button
                this.value = this.buttons[this.i].radio.value;
            }
        }

        return this.value;
    }

    this.getChecked = function(){
        this.buttonChecked = -1;

        for (this.i = 0; this.i < this.buttons.length; this.i ++){
            if (this.buttons[this.i].getChecked()){
                this.buttonChecked = this.i;
            }
        }

        return this.buttonChecked;


    }

        // setup listeners
    this.span.onclick = function() {
        // create an event
        this.value = self.getValue();
        this.changeEvent = new CustomEvent(
            "onchange", {
                detail: {
                    message: "radio button clicked",
                    value: self.getValue(),
                    time: window.performance.now(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        self.span.dispatchEvent(this.changeEvent); // dispatch event the checkbox has changed
    }

    this.span.addEventListener('touchend', function(event) {
        event.preventDefault();
        // create an event
        this.value = self.getValue();
        this.changeEvent = new CustomEvent(
            "onchange", {
                detail: {
                    message: "radio button clicked",
                    value: self.value,
                    time: window.performance.now(),
                },
                bubbles: true,
                cancelable: true
            }
        );
        self.span.dispatchEvent(this.changeEvent); // dispatch event the checkbox has changed
    }, false);

}