// various sound constants and objects
// constants
var LEFT_COLOR = colorString(0,255,0);
var RIGHT_COLOR = colorString(0,255,255);

//	public final static String LEFT_COLOR = "Green";
//	public final static String RIGHT_COLOR = "Cyan";

var LEFT_CH = 0;
var RIGHT_CH = 1;

// spectra for different musical instruments these are gains at each harmonic so relatively simple
//var FLUTE = [1.0,0.63,0.79,0.48,0.45,0.35,0.30,0.40,0.35,0.29,0.21,0.19];
var FLUTE = [1.0,0.5,0.0,0,0,0,0,0,0,0,0,0];
//var VIOLIN = [1.0,0.93,0.85,0.50,0.60,0.59,0.74,0.74,0.45,0.69,0.60,0.58];
var VIOLIN = [1.0,0.24,0,0.0,0.60,0.6,0.74,0.74,0.0,0.0,0.0,0.0];
var CLARINET = [1.0,0,0.86,0,0,0,0.02,0.02,0,0,0,0];
var TRUMPET = [0.25,1,0.1,0,0.02,0.01,0.05,0.01,0,0,0,0];
var INTRUMENT_NAME = ["Flute","Violin","Clarinet","Trumpet"];

// db to gain converter
function dbConverter()  {

	this.val = 0;
//	this.refGain = 1.0;
	this.DEF_GAIN = 1.0;


  this.dBToGain = function(baseInt, dbComparison){
    this.temp = 0;

    this.temp = baseInt*Math.pow(Math.E,dbComparison*Math.log(10)/20);
    return this.temp;
  }

  this.gainsToDB = function(int1, intRef){
    this.temp = 0;
    this.temp = 20*(Math.log(int1/intRef)/Math.log(10));
    // the division of Math.log(10) converts from base e to base 10
    return this.temp;
  }

  // set the reference gain
//  this.setReferenceGain = function(double rGain){
//	  refGain = rGain>=0 & rGain <=1.0 ? rGain : refGain;
//  }

}