var white_keys = document.getElementsByClassName("white\-key");
var black_keys = document.getElementsByClassName("black\-key");

function toggleWhiteKey(white_key) {
  if (white_key.getAttribute('pressed')!= "true") {
    white_key.setAttribute('pressed', true);
  } else {
    white_key.removeAttribute('pressed');
  }
}

function toggleBlackKey(black_key) {
  if (black_key.getAttribute('pressed') == null) {
    black_key.setAttribute('pressed', true);
  } else {
    black_key.removeAttribute('pressed');
  }
}

for (var i = 0; i < white_keys.length; i++) {
  white_keys[i].addEventListener('click', function (e) {toggleWhiteKey(e.currentTarget)});
}

for (var i = 0; i < black_keys.length; i++) {
  black_keys[i].addEventListener('click', function (e) {toggleBlackKey(e.currentTarget)});
}

function unlockOctave (octave, hide) {
  for (var i = 0; i < white_keys.length; i++) {
    console.log("hey");
    if (white_keys[i].id[white_keys[i].id.length-1] == octave) {
      if (hide) {
        white_keys[i].removeAttribute('show');
      } else {
        white_keys[i].setAttribute('show', true);
      }
    }
  }
  for (var i = 0; i < black_keys.length; i++) {
    if (black_keys[i].id[black_keys[i].id.length-1] == octave) {
      if (hide) {
        document.getElementById('empty'+octave+"_1").removeAttribute('show');
        document.getElementById('empty'+octave+"_2").removeAttribute('show');
        black_keys[i].removeAttribute('show');
      } else {
        document.getElementById('empty'+octave+"_1").setAttribute('show', true);
        document.getElementById('empty'+octave+"_2").setAttribute('show', true);
        black_keys[i].setAttribute('show', true);
      }
    }
  }
}

function saveKeyboard () {
  var activeArray = [];
  for (var i = 0; i < white_keys.length; i++) {
    if (white_keys[i].getAttribute('pressed') != null) {
      activeArray.push(white_keys[i].id);
    }
  }
  for (var i = 0; i < black_keys.length; i++) {
    if (black_keys[i].getAttribute('pressed') != null) {
      activeArray.push(black_keys[i].id);
    }
  }
  return activeArray;
}

function loadKeyboard (array) {
  for (var i = 0; i < array.length; i++) {
    var element = document.getElementById(array[i]);

    if (element.className == "white-key") {
      toggleWhiteKey(element);
    }
    if (element.className == "black-key") {
      toggleBlackKey(element);
    }
  }
}

function resetKeyboard () {
  for (var i = 0; i < white_keys.length; i++) {
    white_keys[i].removeAttribute('pressed');
  }
  for (var i = 0; i < black_keys.length; i++) {
    black_keys[i].removeAttribute('pressed');
  }
}
