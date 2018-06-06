let answer = [];
let correct = [];
let currentElo;
let streak = 10;
let relistenCount;
let winMult = [0, 0];

function initGame() {
  resetKeyboard();
  if (document.cookie.elo === null) {
    setElo(500);
  } else {
    setElo(document.cookie.elo);
  }
  askQuestion();
}

function askQuestion() {
  generateQuestion(parseInt(document.getElementById('elonum').innerText, 10), (returnArray) => {
    answer = [];
    correct = [];
    relistenCount = 2;
    winMult = [0, 0];
    resetKeyboard();
    correct = returnArray;
    // init question things
    document.getElementById('relisten').disabled = '';
    document.getElementById('currentNote').innerText = 1;
    changeNote(0);
    document.getElementById('maxNote').innerText = correct.length - 1;
    playSound(correct, 1);
  });
}
function relisten() {
  if (relistenCount > 0) {
    relistenCount--;
    if (relistenCount === 0) { document.getElementById('relisten').disabled = 'disabled'; }
    playSound(correct);
  }
}
function changeNote(change) {
  const currentNote = parseInt(document.getElementById('currentNote').innerText, 10);
  answer[currentNote] = saveKeyboard();
  resetKeyboard();

  try {
    loadKeyboard(answer[currentNote + change]);
  } catch (e) {
    throw e;
  }


  // disable going further than max and lower than 1
  document.getElementById('previousNote').disabled = '';
  document.getElementById('nextNote').disabled = '';
  document.getElementById('currentNote').innerText = currentNote + change;
  if (currentNote + change === 1) {
    document.getElementById('previousNote').disabled = 'disabled';
  }
  if (currentNote + change === correct.length - 1) {
    document.getElementById('nextNote').disabled = 'disabled';
  }
}

function elochange(winCalc) {
  // my elo
  let myElo = parseInt(document.getElementById('elonum').innerText, 10);
  // opponent elo
  const qElo = correct[0][2];
  // note the elo is the 3rd element of the first index array so should it be [0][3]?
  const R1 = 10 ** (myElo / 400);
  const R2 = 10 ** (qElo / 400);
  const E1 = R1 / (R1 + R2);

  myElo += streak * (winCalc - E1);
  setElo(myElo);
}
function setElo(elo) {
  if (elo <= 500) {
    elo = 500;
  }
  document.cookie.elo = elo;
  document.getElementById('elonum').innerText = Math.round(elo);
  getNotesList(elo);
  if (elo >= 500) {
    unlockOctave(4, false);
  }
  if (elo >= 1000) {
    unlockOctave(3, false);
  }
  if (elo >= 1500) {
    unlockOctave(5, false);
  }
  if (elo >= 2000) {
    unlockOctave(2, false);
  }
}
function submitAnswer() {
  changeNote(0);
  checkAnswers(() => {
    elochange((winMult[0] / winMult[1]) ** 2);
    askQuestion();
  });
}
function checkAnswers(callback) {
  winMult[0] = 0;
  winMult[1] = 0;
  const displayContainer = document.createElement('div');
  displayContainer.setAttribute('class', 'resultContainer');
  for (let i = 1; i < correct.length; i += 1) {
    const checkedAnswers = {};
    try {
      for (let j = 0; j < answer[i].length; j += 1) {
        if (correct[i].indexOf(answer[i][j]) === -1) {
          checkedAnswers[answer[i][j]] = 'incorrect';
          winMult[1] += 1;
        } else {
          checkedAnswers[answer[i][j]] = 'correct';
          winMult[0] += 1;
          winMult[1] += 1;
        }
      }
    } catch (e) {
      throw e;
    }

    for (let j = 0; j < correct[i].length; j += 1) {
      if (objectCheckIndex(checkedAnswers, correct[i][j]) === -1) {
        checkedAnswers[correct[i][j]] = 'wrong';
        winMult[1] += 1;
      }
    }
    const displayResult = document.createElement('p');
    displayResult.innerText = `${i}. `;
    for (const note in checkedAnswers) {
      const displayNoteResult = document.createElement('span');
      displayNoteResult.innerText = note;
      displayNoteResult.setAttribute('class', checkedAnswers[note]);
      displayResult.appendChild(displayNoteResult);
    }
    if ((winMult[0] / winMult[1]) ** 2 > 0.50) {
      streak *= 1.2;
      displayContainer.setAttribute('right', true);
    } else {
      streak = 10;
      displayContainer.setAttribute('wrong', true);
    }
    displayContainer.appendChild(displayResult);
  }
  document.getElementById('results').appendChild(displayContainer);
  updateScroll();
  callback();
}

function objectCheckIndex(jsObject, needle) {
  for (const item in jsObject) {
    if (needle === item) {
      return item;
    }
  }
  return -1;
}

function updateScroll() {
  const element = document.getElementById('results');
  element.scrollTop = element.scrollHeight;
}
