var synth = new Tone.Synth().toMaster();

/* var psynth = new Tone.PolySynth(6, Tone.MonoSynth, {
			"oscillator": {
				"type": "sine"
			},
			"filter": {
				"Q": 2,
				"type": "lowpass",
				"rolloff": -12
			},
			"envelope": {
				"attack": 0.002,
				"decay": 3,
				"sustain": 0,
				"release": 0.45
			},
			"filterEnvelope": {
				"attack": 0.001,
				"decay": 0.32,
				"sustain": 0.9,
				"release": 3,
				"baseFrequency": 700,
				"octaves": 2.3
			},
			//"volume" : -8,
			//"oscillator" : {
			//  "partials" : [1, 2, 1],
			//},
		}).toMaster(); */
var noteslistMain = ['C2','C#2','D2','D#2','E2','F2','F#2','G2','G#2','A2','A#2','B2','C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5','F5','F#5','G5','G#5','A5','A#5','B5'];
var triads = [[0,4,7],[0,3,7],[0,3,6],[0,4,8]];
var currentSound;
var currentChord;
var chordNotes = [];
var elomult = [1, 1];
var eloBase = [];
var total;
var elo
var noteslist = [];
var gDur;
var gInt;
var psynth
var threshhold = 100;
function setpsynth(callback) {
  psynth = new Tone.Sampler({
    'A0' : 'A0.[mp3|ogg]',
    'C1' : 'C1.[mp3|ogg]',
    'D#1' : 'Ds1.[mp3|ogg]',
    'F#1' : 'Fs1.[mp3|ogg]',
    'A1' : 'A1.[mp3|ogg]',
    'C2' : 'C2.[mp3|ogg]',
    'D#2' : 'Ds2.[mp3|ogg]',
    'F#2' : 'Fs2.[mp3|ogg]',
    'A2' : 'A2.[mp3|ogg]',
    'C3' : 'C3.[mp3|ogg]',
    'D#3' : 'Ds3.[mp3|ogg]',
    'F#3' : 'Fs3.[mp3|ogg]',
    'A3' : 'A3.[mp3|ogg]',
    'C4' : 'C4.[mp3|ogg]',
    'D#4' : 'Ds4.[mp3|ogg]',
    'F#4' : 'Fs4.[mp3|ogg]',
    'A4' : 'A4.[mp3|ogg]',
    'C5' : 'C5.[mp3|ogg]',
    'D#5' : 'Ds5.[mp3|ogg]',
    'F#5' : 'Fs5.[mp3|ogg]',
    'A5' : 'A5.[mp3|ogg]',
    'C6' : 'C6.[mp3|ogg]',
    'D#6' : 'Ds6.[mp3|ogg]',
    'F#6' : 'Fs6.[mp3|ogg]',
    'A6' : 'A6.[mp3|ogg]',
    'C7' : 'C7.[mp3|ogg]',
    'D#7' : 'Ds7.[mp3|ogg]',
    'F#7' : 'Fs7.[mp3|ogg]',
    'A7' : 'A7.[mp3|ogg]',
    'C8' : 'C8.[mp3|ogg]'
  }, {
    'release' : 1,
    'baseUrl' : './audio/salamander/',
    'onload': function () {initGame()}
  }).toMaster();
}


//generate random number w/ function Math.random. Use Math.floor to set numbers to integers for use in array notation.
function rdgen() {
  return Math.floor(Math.random()*(noteslist.length-0.00001));
}

function rdgen4() {
  return Math.floor(Math.random()*2);
}

//accumulator function.

function reducer(acc, num){
  return acc + num;
};

function mreducer(acc, num){
  return acc*num;
};

//set duration, int and elo

//compare function to be used with the while loop for discordant polyphonies.
function compare(num, arr){
  for(var z = 0; z < arr.length+1; z++){
    if(num == arr[z]){
      return true;

}}}

//threshold checker

function checkThreshold(cElo, qElo){
  if(Math.abs(cElo - qElo)<threshhold){
    return false;
  }
  else {
    return true;
  }
};


function getNotesList(elo) {
  var octaveList = [];
  var currentNotes = [];
  var unlockOrder = [2,1,3,0];
  for(var t = 0; t<noteslistMain.length/12; t++){
    octaveList[t] = noteslistMain.slice(12*t, 12*(t+1));
    };

  if(elo<2000){
    for(var p = 0; p < Math.ceil(elo/499) - 1; p++){
      if(p%2==0){
        var zz = octaveList[unlockOrder[p]].concat(currentNotes);
        currentNotes = zz;
      }
      else {
        var pz = currentNotes.concat(octaveList[unlockOrder[p]]);
        currentNotes = pz;
      };
    }
    noteslist = currentNotes;
  } else {
    currentNotes = noteslistMain;
    noteslist = currentNotes;
  };
};

//main function
//generateQuestion (elo)   [[c4][c2,a2][c4,c8,]]
//playSound (array, duration, time)
function generateQuestion (elo, callback){
  elomult.push(1.0000001);
  var musicSequence = [];
    musicSequence[0] = [];
  total = -900;
  musicSequence[0][1] = 0.4;
  musicSequence[0][0] = 2.5/(Math.floor(elo/1000) + 1);
  var Seg;
  var initialLoop = 0;
  while(checkThreshold(elo, total)){
    if(initialLoop == 1){
      threshhold += 30;
    } else {
      initialLoop++;
    }
    musicSequence.length = 1
    var sequenceLength = Math.ceil(elo/350) - 1;
    eloBase = [];
    elomult = [1];
    eloBase.push(400*(sequenceLength));
    for(var q = 0; q<sequenceLength; q++){
      elomult.push(1);
      chordNotes = [];
      num = Math.floor(Math.random()*5);
      Seg = Math.random();
    //if parameter [type] is numeral 0, play a monophonic sound.
      if(elo<701) {
        musicSequence[1]=[noteslist[rdgen()]];
        elomult.push(1.5);
        break;
      }
      else if(Seg<0.39){
        musicSequence.push([noteslist[rdgen()]]);
        elomult.push(0.98);
      }
    //if parameter [type] is numeral 1, play a discordant polyphonic sound.
      else if(Seg>0.96){
        musicSequence.push([noteslist[rdgen()]]);
        elomult.push(0.98);
      }
  //if parameter [type] is numeral 2, play a harmonious chord.+num will always be 3.
      else if(0.79>Seg>0.39&&elo>1000){
        var extraNotes = num-3;
        var noteChange;
        if(extraNotes>0){
          noteChange = 3*extraNotes;
        } else {
          noteChange = 0;
        }
        var rootNote = Math.floor(Math.random()*(noteslist.length-(9+noteChange)));

        var triadtype = Math.floor(Math.random()*3);
        if(elo<1500){
          while(triadtype != 0 || triadtype != 1){
            triadtype =  Math.floor(Math.random()*3.999999);
          }

        };
        var indexof;
        for(var i=0;i<3;i++){
          indexof = triads[triadtype][i] + rootNote;
          chordNotes.push(noteslist[indexof]);
        }
        if(num>3){
          for(var f =0;f<extraNotes;f++){
            chordNotes.push(noteslist[indexof + 3*(f+1)]);
          }
        }
        musicSequence.push(chordNotes);
        if(extraNotes>0){
          elomult.push(Math.pow(1.13, extraNotes));
        }
        else {
        elomult.push(1.14);
        };
      }
      else if(0.96>Seg>0.79){
        var couple = [];
        var baseNote = Math.floor(Math.random()*(noteslist.length-8));
        var translationArray = [[0,3],[0,4],[0,7]];
        var dyadType = translationArray[rdgen4()];
        couple[0] = noteslist[dyadType[0]+baseNote];
        couple[1] = noteslist[dyadType[1]+baseNote];
        musicSequence.push(couple);
        elomult.push(1.04);
      }
    }
    var multSum = elomult.reduce(mreducer);
    var baseSum = eloBase.reduce(reducer);
    var finalmultSum;
    if(multSum==0){
      finalmultSum=1;
    }  else {
      finalmultSum = multSum;
    }
    total = baseSum*finalmultSum;
    //console.log(total + " due to " + baseSum + ", " + finalmultSum + " and length of " + musicSequence.length);
    //console.log(musicSequence);
  }
  musicSequence[0][2] = total;
  threshhold = 100;
  callback(musicSequence);
  return musicSequence;
};

function playSound (array, optional){
  var exInt;
  if(typeof optional == undefined) {
    exInt = 0;
  } else {
    exInt = 1;
  };
  var reps = array.length;
  var now = Tone.now();
  var dur = array[0][0];
  var interval = array[0][1];
  for(var i=1; i<reps; i++){
    for (var j = 0; j < array[i].length; j++) {
      psynth.triggerAttackRelease(array[i][j], dur, now+dur*(i-1)+interval*(i-1)+exInt);
    };
  };


};

setpsynth(function () {initGame()});


































