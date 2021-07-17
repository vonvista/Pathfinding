var controlsHeight = document.getElementById("controlMain").offsetHeight 
p5.disableFriendlyErrors = true; // disables FES

var animSpeed = 4
const easing = 0.05 * animSpeed

const cellAnimEasing = 0.03 * 4

var clickMode

var rectSize = 30;

//COLORS
const YELLOW = [255, 242, 0]
const WHITE = [255,255,255]
const BASE_DARKBLUE = [28,42,53]

const VISITED_COLOR = [32,98,149]
const TRAVERSAL_OUTLINE = [255,157,0]

//MODES

const CLICK_WALL = "wall"
const CLICK_START = "start"
const CLICK_END = "end"
const CLICK_VISIT = "visit"
const CLICK_DEBUG = "debug"
const CELL_PATH = "path"


function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}


class Cell {
  constructor(x, y) {
    this.x = x
    this.y = y


    this.type = null

    this.prevCell = null

    // Detect if there's a change in cell type, acts like a flip flop
    this.prevType = null

    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 50
    this.fillColor = [27, 170, 27]

    this.cancelAnim = false
  }

  draw() { 
    
    if(this.prevType != this.type){
      switch(this.type) {
        case CLICK_WALL:
          this.wallAnimation()
          break
        case CLICK_START:
          this.startAnimation()
          break
        case CLICK_END:
          this.endAnimation()
          break
        case CLICK_VISIT:
          this.travelledAnimation()
          break
        case CELL_PATH:
          this.colorAnimation(255, 217, 0)
          this.cancelAnim = true
          break
        default:
          this.noneAnimation()
      }
      
    }

    if(mouseX > this.x - rectSize/2 && mouseX < this.x + rectSize/2 && 
      mouseY > this.y - rectSize/2 && mouseY < this.y + rectSize/2){
        
      fill(255, 196, 0)
    }
    else {
      fill(255,255,255)
    }

    rect(this.x, this.y, rectSize, rectSize)
    //console.log(this.x)
    fill(this.fillColor[0],this.fillColor[1],this.fillColor[2])
    rect(this.x,this.y,Math.floor(this.animRect),Math.floor(this.animRect), Math.floor(this.rectroundness))

    this.prevType = this.type
  }

  clicked() {
    if(mouseX > this.x - rectSize/2 && mouseX < this.x + rectSize/2 && mouseY > this.y - rectSize/2 && mouseY < this.y + rectSize/2){
      // this.travelledAnimation()
      return this
    }


  }
  async travelledAnimation() {

    this.fillColor[0] = Math.floor(Math.random() * 255);
    this.fillColor[1] = Math.floor(Math.random() * 255);
    this.fillColor[2] = Math.floor(Math.random() * 255);

    for(let i = 0; i <= (20); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing
      
      this.fillColor[0] = map(i, 0, 80, this.fillColor[0], 170, true)
      this.fillColor[1] = map(i, 0, 80, this.fillColor[1], 27, true)
      this.fillColor[2] = map(i, 0, 80, this.fillColor[2], 134, true)

      if(this.cancelAnim == true){
        this.cancelAnim = false
        break
      }

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,3));
    }

    for(let i = 0; i <= (20); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing
      

      this.fillColor[0] = map(i, 0, 80, this.fillColor[0], 27, true)
      this.fillColor[1] = map(i, 0, 80, this.fillColor[1], 101, true)
      this.fillColor[2] = map(i, 0, 80, this.fillColor[2], 171, true)

      if(this.cancelAnim == true){
        this.cancelAnim = false
        break
      }

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,3));
    }

    // for(let i = 0; i <= (150); i++){
    //   // this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
    //   // this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

    //   this.animRect = map(i, 0, 150, 0, rectSize, true)
    //   this.rectroundness = map(i, 0, 150, 50, 0, true)
      

    //   this.fillColor[0] = map(i, 0, 150, this.fillColor[0], 27, true)
    //   this.fillColor[1] = map(i, 0, 150, this.fillColor[1], 101, true)
    //   this.fillColor[2] = map(i, 0, 150, this.fillColor[2], 171, true)

    //   //console.log(this.fillColor)
    //   await sleep(1)
    // }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0
  }

  async wallAnimation() {
    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [0,0,0]
    

    for(let i = 0; i <= (150); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,1));
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0
    
  }

  async colorAnimation(r,g,b) {
    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [r,g,b]


    for(let i = 0; i <= (150); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

      //console.log(this.fillColor)
      await sleep(2)
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0
    
  }

  async startAnimation() {
    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [110,110,110]


    for(let i = 0; i <= (150); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,1));
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0
  }

  async endAnimation() {
    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [43, 255, 0]


    for(let i = 0; i <= (150); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,1));
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0
  }

  async noneAnimation() {
    for(let i = 0; i <= (25); i++){
      // this.animRect = this.animRect + (0 - this.animRect) * cellAnimEasing
      // this.rectroundness = this.rectroundness + (50 - this.rectroundness) * cellAnimEasing

      this.animRect = Math.floor(map(i, 0, 25, rectSize, 0, true))
      this.rectroundness = Math.floor(map(i, 0, 25, 0, 50, true))


      //console.log(this.fillColor)
      //await new Promise(resolve => setTimeout(resolve,1));
      await sleep(1)
    }

    this.animRect = 0
    this.rectroundness = 50
  }
}



//FUNCTION FOR ANIMATION SLIDER

var buttonControls = document.getElementsByClassName("controlButton");

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  //statusText = "Standby"
}

document.getElementById("animSlider").innerHTML = document.getElementById("myRange").value
animSpeed = document.getElementById("myRange").value

function handleSliderAnimChange() {
  output = document.getElementById("myRange").value
  //document.getElementById("animSlider").innerHTML = output * 50
  document.getElementById("animSlider").innerHTML = output
  animSpeed = output
  //var output = 
  //output.innerHTML = slider.value; // Display the default slider value
}

//ALGORITHMS

dr = [-1, 1, 0, 0]
dc = [0, 0, 1, -1]

async function bfs(startNodeR, startNodeC, endNodeR, endNodeC) {

  disableButtonControls()

  // create a visited object
  var visited = {};

  // Create an object for queue
  var q = []

  var complete = false

  // add the starting node to the queue
  
  q.push([startNodeR, startNodeC])


  // loop until queue is element
  while (q.length != 0) {
    // get the element from the queue
   
    var curr = q.shift();
    var row = curr[0]
    var col = curr[1]

    //CONDITIONS FOR NOT CONTINUING

    if (row < 0 || col < 0 || row >= boardHeight || col >= boardWidth) continue

    if (visited[row + "," + col]) continue

    if (board[row][col].type == CLICK_WALL) continue


    visited[row + "," + col] = true

    // board[row][col].prevCell = prevCell

    await sleep (20)

    if(row != startNodeR || col != startNodeC) board[row][col].type = CLICK_VISIT

    // console.log("HERE")

    for (let i = 0; i < 4; i++) {

      var adjRow = row + dr[i];
      var adjCol = col + dc[i];
      q.push([ adjRow, adjCol ]);

      if (adjRow < 0 || adjCol < 0 || adjRow >= boardHeight || adjCol >= boardWidth) continue

      if (visited[adjRow + "," + adjCol]) continue

      // console.log(adjRow + "," + adjCol)

      if (board[adjRow][adjCol].type == CLICK_WALL) continue

      board[adjRow][adjCol].prevCell = board[row][col]

      //COMPLETE CONDITION

      if(adjRow == endNodeR && adjCol == endNodeC) {
        complete = true
        break
      }

    }

    if(complete) break

    
  }

  if(complete) {

    await sleep (1000)
    
    backtrackCell = board[endNodeR][endNodeC].prevCell

    let path = []

    while(backtrackCell != board[startNodeR][startNodeC]){

      path.push(backtrackCell)
      backtrackCell = backtrackCell.prevCell

      
    }

    console.log(path)

    while(path.length != 0){

      let current = path.pop()
      current.type = CELL_PATH

      await sleep (20)
    }

  }

  enableButtonControls()
}

async function clearRow(row) {
  for (let x = 0; x < board[row].length; x++) {
      
    if(board[row][x].type != null) {
      board[row][x].type = null
      await sleep(1)
    }

    
  }
}

async function clearAll() {
  for (let y = 0; y < board.length; y++) {

    clearRow(y)
    await sleep(30)
  }

  startCellR = null
  startCellC = null
  endCellR = null
  endCellC = null

}

// async function clearAll() {
//   for (let y = 0; y < board.length; y++) {

//     for (let x = 0; x < board[y].length; x++) {
      
//       if(board[y][x].type != null) {
//         board[y][x].type = null
//         await sleep(1)
//       }

      
//     }
//   }

//   startCellR = null
//   startCellC = null
//   endCellR = null
//   endCellC = null

// }

// FUNCTIONS FOR BUTTON CONTROLS

function handleWall() {
  clickMode = CLICK_WALL
}

function handleStart() {
  clickMode = CLICK_START
}

function handleEnd() {
  clickMode = CLICK_END
}

function handleDebug() {
  clickMode = CLICK_DEBUG
}

function handleBFS() {
  bfs(startCellR, startCellC, endCellR, endCellC)
}

let boardWidth = 35, boardHeight = 20
let board = []
let startCellR = null
let startCellC = null
let endCellR = null
let endCellC = null

let statusText = ""


function setup() {
  //createCanvas(400, 400);
  let cnv = createCanvas(windowWidth, windowHeight - controlsHeight);
  cnv.parent("sketchHolder");
  console.log(cnv)

  rectMode(CENTER)
  textAlign(CENTER, CENTER)
  pixelDensity(displayDensity());

  console.log(board)

  for (let y = 0; y < boardHeight; y++) {
    board[y] = []
    for (let x = 0; x < boardWidth; x++) {
      //var cell = new Cell(width/2 - (rectSize * boardWidth) + rectSize * x, height/2 - (rectSize * boardHeight) + rectSize * y)
      var cell = new Cell(width/2 - (rectSize * (boardWidth - 1))/2 + rectSize * x, 
      height/2 - (rectSize * (boardHeight - 1))/2 + rectSize * y)
      
      
      board[y].push(cell)
    }
  }

  board[0][0].type = CLICK_START

  startCellR = 0
  startCellC = 0

  board[13][28].type = CLICK_END

  endCellR = 13
  endCellC = 28

  console.log(board)
}

function draw() {
  //background(28, 42, 53);
  background(200)

  for (let y = 0; y < board.length; y++) {

    for (let x = 0; x < board[y].length; x++) {
      
      board[y][x].draw()

      
    }
  }
}


function mousePressed() {

  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      let selectedCell = board[y][x].clicked()

      if(selectedCell) {

        switch(clickMode){
          case CLICK_WALL:

            selectedCell.type = clickMode

            break
          case CLICK_START:

            if(startCellR != null) board[startCellR][startCellC].type = null

            selectedCell.type = clickMode

            startCellR = y
            startCellC = x

            break
          case CLICK_END:

            if(endCellR != null) board[endCellR][endCellC].type = null
            
            selectedCell.type = clickMode

            endCellR = y
            endCellC = x

            break
          case CLICK_DEBUG:
            
            selectedCell.prevCell.type = null

            break
        }
        
        
      }
    }
  }
}

function mouseDragged() {
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      let selectedCell = board[y][x].clicked()

      if(selectedCell) {
        switch(clickMode){
          case CLICK_WALL:

            selectedCell.type = clickMode

            break

        }
        
        
      }
    }
  }
}

function windowResized() {
  var controlsHeight = document.getElementById("controlMain").offsetHeight 
  resizeCanvas(windowWidth, windowHeight - controlsHeight);
  pixelDensity(displayDensity());
}


