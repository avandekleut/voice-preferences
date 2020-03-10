/*
TODO:
- randomize order of voice presentation
-
*/


// colour constants
const WHITE = 255;
const GRAY = 150;
const DARK_GRAY = 100;
const BLACK = 0;
const LIGHT_GREEN = 'lightgreen'
const RED = 'red'

// number of voices
const N = 6;

// for sound buttons
let playImg;
let pauseImg;

// sortGraph: used to determine total order on voices for each task/trait
let sortGraph = createSortGraph(N);

//sortQueue: used to retrieve next pair of voices needed for comparison
let sortQueue = createSortQueue(N);

let sounds;         // sounds for each task for each voice

let prompt;         // text at top of screen
let promptIndex;    // which prompt we're one
let firstSound;     // first sound button
let secondSound;    // second sound button
let firstSelect;    // first select button
let secondSelect;   // second select button
let submit;         // submit button
let ding;           // noise for submit button
let progress1;      // progress bar for whole study
let progress2;      // progress bar for specific task

/* 'Abstract' class to be extended. Essentially a rectangle with a state
 * and a method for detecting if the mouse is within its boundaries. */
class Button {
  constructor(x, y, width, height, colour, altcolour){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.colour = colour;
    this.altcolour = altcolour;
  }

  hitTest(){
    return (this.x - this.width/2 < mouseX)
        && (mouseX < this.x + this.width/2)
        && (this.y - this.height/2 < mouseY)
        && (mouseY < this.y + this.height/2);
  }
}

/* Can be turned on/off by clicking. Plays a sound when clicked. */
class SoundButton extends Button{

  constructor(x, y, width, height, colour, altcolour, filename){
    super(x, y, width, height, colour, altcolour);
    this.sound = loadSound(this.filename);
    this.img = playImg;
  }

  toggleSound(on=true){
    if (this.hitTest() && !this.sound.isPlaying() && on){
      this.sound.play();
      print("PLAYING VOICE "+this.sound.url);
    } else {
      this.sound.pause();
    }
  }

  draw(){
    if (this.hitTest()){
      fill(this.altcolour);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, this.width, this.height);
    if (this.sound.isPlaying()){
      image(pauseImg, this.x, this.y, this.width*0.75, this.height*0.75);
    } else {
      image(playImg, this.x, this.y, this.width*0.75, this.height*0.75);
    }

  }
}

/* Can be turned on/off by clicking. Selects a voice when clicked. */
class SelectButton extends Button{
  constructor(x, y, width, height, colour, altcolour, name){
    super(x, y, width, height, colour, altcolour);
    this.selected = false;
    this.name = name;
  }

  toggleSelect(on=true){
    if (this.hitTest() && !this.selected && on){
      this.selected = true;
      this.colour = DARK_GRAY;
    } else {
      this.selected = false;
      this.colour = WHITE;
    }
  }

  draw(){
    if (this.hitTest()){
      fill(this.altcolour);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, this.width, this.height);
    fill(BLACK);;
    textStyle(NORMAL);
    textSize(min(this.width, this.height)/2);
    text("Select", this.x, this.y);
  }
}

/* Clicking submits the current choice of voice. */
class SubmitButton extends Button{
  constructor(x, y, width, height, colour, altcolour){
    super(x, y, width, height, colour, altcolour);
  }

  submit(){
    if (this.hitTest()){
      if (firstSelect.selected){
        saveGreaterThan(firstSelect.name, secondSelect.name);
        ding.play();
        nextVoices();
      } else if (secondSelect.selected) {
        saveGreaterThan(secondSelect.name, firstSelect.name);
        ding.play();
        nextVoices();
      }
    }
  }

  draw(){

    if (this.hitTest()){
      fill(this.altcolour);
    } else {
      fill(this.colour);
    }
    rect(this.x, this.y, this.width, this.height);
    fill(BLACK);;
    textStyle(BOLD);
    textSize(min(this.width, this.height)/2);
    text("Submit", this.x, this.y);
  }
}

class Prompt{
  constructor(text, kind){
    this.text = text;
    this.kind = kind;
  }
}

const INFORMATIVE = 0;
const INSTRUCTIVE = 1;
const PROMPTS = [
  new Prompt("Guiding you through a workout", INSTRUCTIVE),
  new Prompt("Helping you follow a recipe", INSTRUCTIVE),
  new Prompt("Giving you directions to the museum", INSTRUCTIVE),

  new Prompt("Delivering the weather forecast", INFORMATIVE),
  new Prompt("Getting your meetings and appointments", INFORMATIVE),
  new Prompt("Making suggestions for a restaurant", INFORMATIVE),
]

let results = {
  "Guiding you through a workout":[0,1,2,3,4,5],
  "Helping you follow a recipe":[0,1,2,3,4,5],
  "Giving you directions to the museum":[0,1,2,3,4,5],
  "Delivering the weather forecast":[0,1,2,3,4,5],
  "Getting your meetings and appointments":[0,1,2,3,4,5],
  "Making suggestions for a restaurant":[0,1,2,3,4,5]
}

class PromptDisplay{
  constructor(x, y, prompt, size=30){
    this.x = x;
    this.y = y;
    this.prompt = prompt;
    this.size = size;
  }

  draw(){
    textSize(this.size);
    textStyle(NORMAL);
    fill(BLACK);
    text(this.prompt.text, this.x, this.y);
  }
}

function nextVoices(){
  let pair = nextPair();
  if (!pair){
    results[prompt.prompt.text].sort(mySort);
    sortGraph = createSortGraph(N);
    sortQueue = createSortQueue(N);
    nextPrompt();
  }
  [firstSelect.name, secondSelect.name] = nextPair();
  firstSound.sound = sounds[firstSelect.name][prompt.prompt.text];
  secondSound.sound = sounds[secondSelect.name][prompt.prompt.text];
}

function nextPrompt(){
  promptIndex++;
  prompt.prompt = PROMPTS[promptIndex];
  if (!prompt.prompt){
    studyOver();
  }
}

function studyOver(){
  fill(220);
  rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height);
  noLoop();
}

function soundFileName(name, text){
  const map = {
    0:'A',
    1:'B',
    2:'C',
    3:'D',
    4:'E',
    5:'F'
  }

  return 'scripts/audio/'+map[name]+'/'+text+'.wav';
}

function setup(){
  // global alignment modes
  frameRate(15);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  // create a centered canvas
  const canvasWidth  = 600;
  const canvasHeight = 600;
  const x   = (windowWidth - canvasWidth)/2;
  const y   = (windowHeight - canvasHeight)/2;
  const cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.position(x, y);
  background(220);

  sounds = {};
  for (let v=0; v<N; v++){
    sounds[v] = {}
    for (let p of PROMPTS){
      sounds[v][p.text] = loadSound(soundFileName(v, p.text));
    }
  }

  // assets for play/pause/submit
  playImg  = loadImage('assets/play.png');
  pauseImg = loadImage('assets/pause.svg');
  ding     = loadSound('assets/ding.mp3');

  // button size parameters
  const width  = min(canvas.width, canvas.height)/4;
  const margin = width/8;

  prompt       = new PromptDisplay(
    canvas.width/2,
    canvas.height/4,
    undefined);

  firstSound   = new SoundButton(
    canvas.width/4,
    canvas.height/2,
    width-margin,
    width-margin,
    WHITE,
    GRAY,
    undefined);

  secondSound  = new SoundButton(
    canvas.width*3/4,
    canvas.height/2,
    width-margin,
    width-margin,
    WHITE,
    GRAY,
    undefined);

  firstSelect  = new SelectButton(
    canvas.width/4,
    canvas.height*3/4,
    width-margin,
    width/2-margin,
    WHITE,
    GRAY)

  secondSelect = new SelectButton(
    canvas.width*3/4,
    canvas.height*3/4,
    width-margin,
    width/2-margin,
    WHITE,
    GRAY)

  submit       = new SubmitButton(
    canvas.width/2,
    canvas.height*7/8,
    width-margin,
    width/2-margin,
    LIGHT_GREEN,
    RED
  )

  promptIndex = -1;
  nextPrompt();
  nextVoices();
}

function drawProgress(){
  fill(DARK_GRAY);
  rect(canvas.width/2, canvas.height/32, canvas.width*remainingPrompts(), canvas.height/16);
  rect(canvas.width/2, canvas.height*31/32, canvas.width*remainingPairs(), canvas.height/16);

  fill(BLACK);
  textSize(canvas.height/32);
  textStyle(NORMAL);
  text(`${100*remainingPrompts().toPrecision(2)}`,canvas.width/2, canvas.height/32)
  text(`${100*remainingPairs().toPrecision(2)}`,canvas.width/2, canvas.height*31/32)
}

/*
 * The P5.js draw loop is just used to display the buttons and the prompts.
 */
function draw(){
  background(220);
  prompt.draw();
  firstSound.draw();
  secondSound.draw();
  firstSelect.draw();
  secondSelect.draw();
  submit.draw();
  drawProgress();
}

/*
 * Triggered when the user clicks the mouse. If the mouse is clicked over a
 * button and that button's voice isn't already playing, it will play it.
 * Otherwise, it toggles off both voices.
 */
function mouseClicked(){
  firstSound.toggleSound();
  secondSound.toggleSound();
  submit.submit();
  firstSelect.toggleSelect();
  secondSelect.toggleSelect();
}

////////////////////////////////////////////////////////////////////////////////

function createSortGraph(n){
  let sortGraph = []
  for (let i=0; i<n; i++){
    sortGraph[i] = [];
    for (let j=0; j<n; j++){
      sortGraph[i][j] = 0;
    }
  }
  return sortGraph;
}

function createSortQueue(n){
  let sortQueue = []
  for (let i=0; i<n; i++){
    sortQueue[i] = []
    for (let j=0; j<n; j++){
      if (j < i){
        sortQueue[i][j] = 1;
      } else {
        sortQueue[i][j] = 0;
      }
    }
  }
  return sortQueue
}

function mySort(a, b){
  if (sortGraph[a][b] == 1){
    return 1;
  } else {
    return -1;
  }
}

/* given a boolean matrix representing a relation, compute the transitive
 * closure of the relation.
 */
function transitiveClosure(){
  let n = sortGraph.length;
  for (let k=0; k<n; k++){
    for (let i=0; i<n; i++){
      for (let j=0; j<n; j++){
        if (sortGraph[i][k] && sortGraph[k][j]){
          // i > k and k > j so i > j
          sortGraph[i][j] = 1;
          sortQueue[i][j] = 0; // which one?
          sortQueue[j][i] = 0;
        }
      }
    }
  }
}

function saveGreaterThan(a, b){
  // call if a > b
  sortGraph[a][b] = 1; // a > b
  sortQueue[a][b] = 0; // remove from queue
  sortQueue[b][a] = 0; // remove from queue
  transitiveClosure();
}

function nextPair(){
  let n = sortGraph.length;
  for (let i=0; i<n; i++){
    for (let j=0; j<n; j++){
      if (sortQueue[i][j] === 1){
        return [i, j];
      }
    }
  }
  return;
}

function remainingPairs(){
  let n = sortGraph.length;
  let total = 0;
  for (let i=0; i<n; i++){
    for (let j=0; j<n; j++){
      total += sortQueue[i][j];
    }
  }
  return total/(n*(n-1)/2);
}

function remainingPrompts(){
  return (PROMPTS.length - promptIndex)/PROMPTS.length;
}
