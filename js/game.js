
var answer = [];
var correct = [];
var currentElo;
var relistenCount;
var winMult = [0,0];
function initGame() {
  resetKeyboard();
  if (document.cookie.elo == null) {
    setElo(500);
  } else {
    setElo(document.cookie.elo);
  }
  askQuestion();
}

function askQuestion () {
  generateQuestion(parseInt(document.getElementById('elonum').innerText), function (returnArray) {
    answer = [];
    correct = [];
    relistenCount = 2;
    winMult = [0,0];
    resetKeyboard();
    correct = returnArray;
    //init question things
    document.getElementById('relisten').disabled = '';
    document.getElementById('currentNote').innerText = 1;
    changeNote(0);
    document.getElementById('maxNote').innerText = correct.length-1;
    playSound(correct, 1);
  });
}
function relisten () {
  if ( relistenCount > 0) {
    relistenCount --;
    if (relistenCount == 0) {document.getElementById('relisten').disabled='disabled'}
    playSound(correct);
  }
}
function changeNote (change) {
  var currentNote = parseInt(document.getElementById('currentNote').innerText);
  answer[currentNote] = saveKeyboard();
  resetKeyboard();

  try {
    loadKeyboard(answer[currentNote+change]);
  } catch (e) {}


  //disable going further than max and lower than 1
  document.getElementById('previousNote').disabled = '';
  document.getElementById('nextNote').disabled = '';
  document.getElementById('currentNote').innerText = currentNote + change;
  if (currentNote+change == 1) {
    document.getElementById('previousNote').disabled = 'disabled';
  }
  if (currentNote+change == correct.length-1) {
    document.getElementById('nextNote').disabled = 'disabled';
  }
}

function elochange(winCalc) {
  console.log(winCalc)
  // my elo
  var myElo = parseInt(document.getElementById('elonum').innerText);
  // opponent elo
  var qElo = correct[0][2]
//note the elo is the 3rd element of the first index array so should it be [0][3]?
  var R1 = 10^(myElo/400);
  var R2 = 10^(qElo/400);
  var E1 = R1/(R1+R2);

  myElo = myElo+10*(winCalc-E1);
  setElo(myElo);
}
function setElo(elo) {
  if (elo<=500) {
    elo = 500;
  }
  document.cookie.elo = elo;
  document.getElementById('elonum').innerText = Math.round(elo);
  getNotesList(elo);
  if (elo>=500) {
    unlockOctave(4, false);
  }
  if (elo>=1000) {
    unlockOctave(3, false);
  }
  if (elo>=1500) {
    unlockOctave(5, false);
  }
  if (elo>=2000) {
    unlockOctave(2, false);
  }

}
function submitAnswer(){
  changeNote(0);
  checkAnswers(function () {
    elochange(Math.pow(winMult[0]/winMult[1],2));
    askQuestion();
  });
}
function checkAnswers (callback) {
  winMult[0] = 0;
  winMult[1] = 0;
  var displayContainer = document.createElement("div");
  displayContainer.setAttribute('class', 'resultContainer');
  for (var i = 1; i < correct.length; i++) {
    var checkedAnswers = {};
    try {
      for (var j = 0; j < answer[i].length; j++) {
        console.log('lol boi')
        if (correct[i].indexOf(answer[i][j]) == -1) {
          checkedAnswers[answer[i][j]] = "incorrect";
          winMult[1]++;
        } else {
          checkedAnswers[answer[i][j]] = "correct";
          winMult[0]++;
          winMult[1]++;
        }
      }
    } catch (e) {
      console.log("no answers")
    }

    for (var j = 0; j < correct[i].length; j++) {
      if (objectCheckIndex(checkedAnswers, correct[i][j])==-1){
        checkedAnswers[correct[i][j]] = "wrong";
        winMult[1]++;
      }
    }
    var displayResult = document.createElement("p");
    displayResult.innerText = i + ". "
    for (note in checkedAnswers) {
      var displayNoteResult = document.createElement("span");
      displayNoteResult.innerText = note;
      displayNoteResult.setAttribute('class', checkedAnswers[note]);
      console.log(displayNoteResult);
      displayResult.appendChild(displayNoteResult);
    }
    if (Math.pow(winMult[0]/winMult[1],2)>.50) {
      displayContainer.setAttribute('right', true);
    } else {
      displayContainer.setAttribute('wrong', true);
    }
    displayContainer.appendChild(displayResult);
  }
  document.getElementById('results').appendChild(displayContainer);
  updateScroll();
  callback();
}

function objectCheckIndex (jsObject, needle) {
  for (item in jsObject) {
    if (needle == item) {
      return item;
    }
  }
  return -1;
}

function updateScroll() {
  var element = document.getElementById("results");
  element.scrollTop = element.scrollHeight;
}
