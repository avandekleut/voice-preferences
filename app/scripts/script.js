const N = 6;
let playImg;
let pauseImg;
let sortGraph;
let sortQueue;
let sounds;
let currentPrompt;
let promptIndex;
let firstSound;
let secondSound;
let firstSelect;
let secondSelect;
let submit;
let progress1;
let progress2;
let prompts;
let results;

class Button {
  constructor(x, y, width, height, colour, altcolour) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.colour = colour;
    this.altcolour = altcolour;
  }

  hitTest() {
    return (this.x - this.width / 2 < mouseX) &&
      (mouseX < this.x + this.width / 2) &&
      (this.y - this.height / 2 < mouseY) &&
      (mouseY < this.y + this.height / 2);
  }
}

class SoundButton extends Button {
  constructor(x, y, width, height, colour, altcolour) {
    super(x, y, width, height, colour, altcolour);
    this.sound = undefined;
    this.img = playImg;
  }

  toggleSound(on = true) {
    if (this.hitTest() && !this.sound.isPlaying() && on) {
      this.sound.loop();
    } else {
      this.sound.pause();
    }
  }

  draw() {
    if (this.hitTest() || this.sound.isPlaying()) {
      fill(this.altcolour);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, this.width, this.height);
    if (this.sound.isPlaying()) {
      image(pauseImg, this.x, this.y, this.width * 0.75, this.height * 0.75);
    } else {
      image(playImg, this.x, this.y, this.width * 0.75, this.height * 0.75);
    }

  }
}

class SelectButton extends Button {
  constructor(x, y, width, height, colour, altcolour, name) {
    super(x, y, width, height, colour, altcolour);
    this.selected = false;
    this.name = name;
  }

  toggleSelect() {
    if (this.hitTest() || (this.selected && (firstSound.hitTest() || secondSound.hitTest()))) {
      this.selected = true;
      this.colour = 'dimgray';
    } else {
      this.selected = false;
      this.colour = 'white';
    }
  }

  draw() {
    if (this.hitTest()) {
      fill(this.altcolour);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, this.width, this.height);
    fill('black');;
    textStyle(NORMAL);
    textSize(min(this.width, this.height) / 2);
    text("Select", this.x, this.y);
  }
}

class SubmitButton extends Button {
  constructor(x, y, width, height, colour, altcolour) {
    super(x, y, width, height, colour, altcolour);
  }

  submit() {
    if (this.hitTest()) {
      if (firstSelect.selected || secondSelect.selected) {
        if (firstSelect.selected) {
          saveGreaterThan(firstSelect.name, secondSelect.name);
        } else {
          saveGreaterThan(secondSelect.name, firstSelect.name);
        }
        let r = Math.random();
        if (r <= 0.25){
          sounds.click1.play();
        } else if (0.25 < r && r <= 0.5){
          sounds.click2.play();
        } else if (0.5 < r && r <= 0.75){
          sounds.click3.play();
        } else {
          sounds.click4.play();

        }
        nextVoices();
      }
    }
  }

  draw() {
    if (this.hitTest()) {
      fill(this.altcolour);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, this.width, this.height);
    fill('black');;
    textStyle(BOLD);
    textSize(min(this.width, this.height) / 2);
    text("Submit", this.x, this.y);
  }
}

function setup() {
  // global alignment modes
  frameRate(15);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  // create a centered canvas
  const canvasWidth = 600;
  const canvasHeight = 600;
  const x = (windowWidth - canvasWidth) / 2;
  const y = (windowHeight - canvasHeight) / 2;
  const cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position(x, y);
  background(220);

  sortGraph = createSortGraph(N);
  sortQueue = createSortQueue(N);

  prompts = [
    "Which is more masculine?",
    "Which is less mature?",
    "Which is more attractive?",
    "Which is less confident?",
    "Which do you prefer?",

    "Which do you want to guide you through a workout?",
    "Which do you want to help you follow a recipe",
    "Which do you want to give you directions?",

    "Which do you want to deliver the weather forecast?",
    "Which do you want to get your meetings and appointments?",
    "Which do you want to make suggestions for a restaurant?",
  ];

  scramble(prompts, to=5);
  scramble(prompts, from=5);

  sounds = {};
  for (let v = 0; v < N; v++) {
    sounds[v] = {}
    for (let p of prompts) {
      sounds[v][p] = loadSound(encodeURIComponent(soundFileName(v, p)));
    }
  }

  results = {};
  for (let p of prompts){
    results[p] = [0, 1, 2, 3, 4, 5];
  }

  playImg = loadImage('assets/play.png');
  pauseImg = loadImage('assets/pause.svg');
  sounds.click1 = loadSound('assets/click1.mp3');
  sounds.click2 = loadSound('assets/click2.mp3');
  sounds.click3 = loadSound('assets/click3.mp3');
  sounds.click4 = loadSound('assets/click4.mp3');
  sounds.magic1 = loadSound('assets/magic1.mp3');
  sounds.magic2 = loadSound('assets/magic2.mp3');
  sounds.magic3 = loadSound('assets/magic3.mp3');

  const width = min(canvas.width, canvas.height) / 4;
  const margin = width / 8;

  firstSound = new SoundButton(
    canvas.width / 4,
    canvas.height / 2,
    width - margin,
    width - margin,
    'white',
    'darkgray');

  secondSound = new SoundButton(
    canvas.width * 3 / 4,
    canvas.height / 2,
    width - margin,
    width - margin,
    'white',
    'darkgray');

  firstSelect = new SelectButton(
    canvas.width / 4,
    canvas.height * 3 / 4,
    width - margin,
    width / 2 - margin,
    'white',
    'darkgray')

  secondSelect = new SelectButton(
    canvas.width * 3 / 4,
    canvas.height * 3 / 4,
    width - margin,
    width / 2 - margin,
    'white',
    'darkgray')

  submit = new SubmitButton(
    canvas.width / 2,
    canvas.height * 7 / 8,
    width - margin,
    width / 2 - margin,
    'lightgreen',
    'green'
  )

  promptIndex = -1;
  nextPrompt();
  nextVoices();
}

function draw() {
  background(220);
  drawPrompt();
  firstSound.draw();
  secondSound.draw();
  firstSelect.draw();
  secondSelect.draw();
  submit.draw();
  drawProgress();
}

function mouseClicked() {
  firstSound.toggleSound();
  secondSound.toggleSound();
  submit.submit();
  firstSelect.toggleSelect();
  secondSelect.toggleSelect();
}

function nextVoices() {
  let pair = nextPair();
  if (!pair) {
    results[currentPrompt].sort(mySort);
    sortGraph = createSortGraph(N);
    sortQueue = createSortQueue(N);
    nextPrompt();
  }
  [firstSelect.name, secondSelect.name] = nextPair();
  firstSound.sound = sounds[firstSelect.name][currentPrompt];
  secondSound.sound = sounds[secondSelect.name][currentPrompt];
}

function nextPrompt() {
  currentPrompt = prompts[++promptIndex];
  if (promptIndex === prompts.length) {
    studyOver();
  } else if (promptIndex > 0) {
    if (promptIndex === 4) {
      sounds.magic3.play();
    } else if (Math.random() > 0.5) {
      sounds.magic1.play();
    } else {
      sounds.magic2.play();
    }
  }
}

function studyOver() {
  noLoop();
  background(220);
  sounds.magic1.play();
  sounds.magic2.play();
  sounds.magic3.play();
  submitResults();
  sounds.magic1.play();
  sounds.magic2.play();
}

function submitResults(){
  let gender;
  let age;
  do {
    gender = prompt("Please enter your gender.");
  } while (!gender)
  do {
    age = prompt("Please enter your age.");
  } while (!age)
  let id = Math.floor(Math.random()*100);
  let params = {
    'results':JSON.stringify(results),
    'gender':gender,
    'age':age,
    'id':id
  }
  emailjs.send('gmail', 'result_submission', params)
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });
}

function soundFileName(name, text) {
  const map = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F'
  }

  return 'scripts/audio/' + map[name] + '/' + text + '.wav';
}

function drawProgress() {

  function remainingPairs() {
    let n = sortGraph.length;
    let total = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        total += sortQueue[i][j];
      }
    }
    return total;
  }

  function remainingprompts() {
    return prompts.length - promptIndex;
  }

  fill('black');
  textSize(canvas.height / 32);
  textStyle(NORMAL);
  text(`${N*(N-1)/2 - remainingPairs()}/${N*(N-1)/2} voices complete \t ${prompts.length - remainingprompts()}/${prompts.length} prompts complete`, canvas.width / 2, canvas.height / 32)
}

function drawPrompt(size=30){
  textSize(size);
  textStyle(NORMAL);
  fill('black');
  text(currentPrompt, canvas.width/2, canvas.height/4, canvas.width*3/4, canvas.height);
}

function createSortGraph(n) {
  let sortGraph = []
  for (let i = 0; i < n; i++) {
    sortGraph[i] = [];
    for (let j = 0; j < n; j++) {
      sortGraph[i][j] = 0;
    }
  }
  return sortGraph;
}

function createSortQueue(n) {
  let sortQueue = []
  for (let i = 0; i < n; i++) {
    sortQueue[i] = []
    for (let j = 0; j < n; j++) {
      if (j < i) {
        sortQueue[i][j] = 1;
      } else {
        sortQueue[i][j] = 0;
      }
    }
  }
  return sortQueue
}

function mySort(a, b) {
  if (sortGraph[a][b] == 1) {
    return 1;
  } else {
    return -1;
  }
}

function scramble(arr, from=undefined, to=undefined) {
  if (from === undefined){
    from = 0;
  }
  if (to === undefined){
    to = arr.length;
  }
  for (let i = from; i < to; i++) {
    let j = from + Math.floor(Math.random() * (to-from));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function transitiveClosure() {
  let n = sortGraph.length;
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (sortGraph[i][k] && sortGraph[k][j]) {
          // i > k and k > j so i > j
          sortGraph[i][j] = 1;
          sortQueue[i][j] = 0; // which one?
          sortQueue[j][i] = 0;
        }
      }
    }
  }
}

function saveGreaterThan(a, b) {
  // call if a > b
  sortGraph[a][b] = 1; // a > b
  sortQueue[a][b] = 0; // remove from queue
  sortQueue[b][a] = 0; // remove from queue
  transitiveClosure();
}

function nextPair() {
  let n = sortGraph.length;
  let indices = [];
  for (let i = 0; i < n; i++) {
    indices.push(i);
  }
  scramble(indices);

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (sortQueue[indices[i]][indices[j]] === 1) {
        return [indices[i], indices[j]];
      }
    }
  }
  return;
}
