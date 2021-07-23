var controlsHeight = document.getElementById("controlMain").offsetHeight 
p5.disableFriendlyErrors = true; // disables FES


var animSpeed = 4
const easing = 0.05 * animSpeed

var disableControls = false

const cellAnimEasing = 0.03 * 4

var clickMode

var rectSize = 30;

var isStartAnimRunning = false;
var isEndAnimRunning = false;

var isPathFind = false

var highAnimQuality = true;

//PROMISES

var promises = []


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
const CLICK_DELETE = "delete"

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve,ms));
}

function randInt(max){
  return Math.floor(Math.random() * max)
}

class Cell {
  constructor(x, y, row, column) {
    this.x = x
    this.y = y
    this.row = row
    this.column = column

    this.type = null

    this.weight = null

    this.prevCell = null

    this.updated = true
    this.updateBuffer = false

    // Detect if there's a change in cell type, acts like a flip flop
    this.prevType = null

    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 50
    this.fillColor = [27, 170, 27]

    // For A*

    this.astarG = 0
    this.astarH = 0
    this.astarF = 0
  }

  draw() { 
    
    if(this.prevType != this.type){

      this.updated = true
      
      switch(this.type) {
        case CLICK_WALL:
          //disableButtonControls()
          promises.push(this.wallAnimation())
          break
        case CLICK_START:
          this.startAnimation()
          break
        case CLICK_END:
          this.endAnimation()
          break
        case CLICK_VISIT:
          promises.push(this.travelledAnimation())
          break
        case CELL_PATH:
          promises.push(this.colorAnimation(255, 217, 0))
          this.cancelAnim = true
          break
        default:
          this.noneAnimation()
      }
      
    }

    fill(255,255,255)
    stroke(28, 42, 53)

    if(this.updated || canvasRefresh){
      
      rect(this.x, this.y, rectSize, rectSize)
      
    }

    if(this.animRect > 0 || canvasRefresh){
      fill(this.fillColor[0],this.fillColor[1],this.fillColor[2])
      rect(this.x,this.y,Math.floor(this.animRect),Math.floor(this.animRect), Math.floor(this.rectroundness))
    }
    

    if(this.weight != null){
      noStroke()
      fill(170,170,170)
      text(this.weight.toString(), this.x, this.y)
    }

    

    if(this.updateBuffer){
      this.updateBuffer = false
      this.updated = false
    }

    this.prevType = this.type
  }

  clicked() {
    if(mouseX > this.x - rectSize/2 && mouseX < this.x + rectSize/2 && mouseY > this.y - rectSize/2 && mouseY < this.y + rectSize/2){
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
      await new Promise(resolve => setTimeout(resolve,1));
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
      await new Promise(resolve => setTimeout(resolve,1));
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
    promises.shift()

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0

    this.updateBuffer = true

  }

  async wallAnimation() {

    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [0,0,0]
    
    if(highAnimQuality){
      for(let i = 0; i <= (40); i++){
        this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
        // this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

        // this.animRect = Math.floor(map(i, 0, 40, 0, rectSize, true))

        //console.log(this.fillColor)
        await new Promise(resolve => setTimeout(resolve,1));
      }

      this.animRect = rectSize
      this.rectheight = rectSize
      this.rectroundness = 0
    }
    else {
      this.animRect = rectSize
      this.rectheight = rectSize
      this.rectroundness = 0

      await new Promise(resolve => setTimeout(resolve,1));
    }

    promises.shift()

    this.updateBuffer = true
    
  }

  async colorAnimation(r,g,b) {
    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [r,g,b]


    for(let i = 0; i <= (40); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

      

      //console.log(this.fillColor)
      await sleep(2)
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0

    promises.shift()

    this.updateBuffer = true
    
  }

  async startAnimation() {
    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [110,110,110]

    isStartAnimRunning = true 

    for(let i = 0; i <= (40); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing
      this.rectroundness = this.rectroundness + (0 - this.rectroundness) * cellAnimEasing

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,1));
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0

    isStartAnimRunning = false 

    this.updateBuffer = true

  }

  async endAnimation() {

    this.animRect = 0
    this.rectheight = 0
    this.rectroundness = 0

    this.fillColor = [43, 255, 0]

    isEndAnimRunning = true 

    for(let i = 0; i <= (40); i++){
      this.animRect = this.animRect + (rectSize - this.animRect) * cellAnimEasing

      //console.log(this.fillColor)
      await new Promise(resolve => setTimeout(resolve,1));
    }

    this.animRect = rectSize
    this.rectheight = rectSize
    this.rectroundness = 0

    console.log("DONE")

    isEndAnimRunning = false

    this.updateBuffer = true

  }

  async noneAnimation() {

    this.updated = true

    if(highAnimQuality){
      for(let i = 0; i <= (20); i++){
        // this.animRect = this.animRect + (0 - this.animRect) * cellAnimEasing
        // this.rectroundness = this.rectroundness + (50 - this.rectroundness) * cellAnimEasing

        this.animRect = Math.floor(map(i, 0, 20, rectSize, 0, true))
        this.rectroundness = Math.floor(map(i, 0, 20, 0, 50, true))


        //console.log(this.fillColor)
        //await new Promise(resolve => setTimeout(resolve,1));
        await sleep(1)
      }

      this.animRect = 0
      this.rectroundness = 50
    }
    else {
      this.animRect = 0
      this.rectroundness = 50

      await sleep(1)
    }

    this.updateBuffer = true
  }
}


//FUNCTION FOR ANIMATION SLIDER

var buttonControls = document.getElementsByClassName("controlButton");

function disableButtonControls() {
  for(button of buttonControls){
    button.disabled = true
  }
  var disableControls = true
}

function enableButtonControls() {
  for(button of buttonControls){
    button.disabled = false
  }
  //statusText = "Standby"
  var disableControls = false
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

  await clearPathfinding()
  await Promise.all(promises)
  canvasRefresh = true

  canvasRefresh = true

  changeStatusText("Pathfinding: Breadth-First Search")

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

    await Promise.all(promises)
    
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

  changeStatusText("Standby")
  clickMode = null
  enableButtonControls()
}

async function dfs(startNodeR, startNodeC, endNodeR, endNodeC) {

  disableButtonControls()
  
  await clearPathfinding()
  await Promise.all(promises)
  canvasRefresh = true

  changeStatusText("Pathfinding: Depth-First Search")


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
   
    var curr = q.pop();
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

    await Promise.all(promises)
    
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

// @TO-DO, tingnan pa natin if kaya ba sya

async function dijkstra(startNodeR, startNodeC, endNodeR, endNodeC) {

  disableButtonControls()

  await clearPathfinding()
  await Promise.all(promises)
  canvasRefresh = true

  changeStatusText("Pathfinding: Dijkstra's Algorithm")

  // create a visited object
  var visited = {};

  // Create an object for queue
  var q = []

  var complete = false

  // add the starting node to the queue
  
  q.push([startNodeR, startNodeC])

  board[startNodeR][startNodeC].weight = 0


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

      if(board[adjRow][adjCol].weight != null || board[row][col].weight + 1 > board[adjRow][adjCol].weight){

        board[adjRow][adjCol].weight = board[row][col].weight + 1

        board[adjRow][adjCol].prevCell = board[row][col]
      }

      if(adjRow == endNodeR && adjCol == endNodeC) {
        complete = true
        break
      }

    }

    if(complete) break

    
  }

  if(complete) {

    await Promise.all(promises)
    
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

async function astar(startNodeR, startNodeC, endNodeR, endNodeC) {

  await clearPathfinding()
  await Promise.all(promises)
  canvasRefresh = true


  openList = []
  closedList = []

  endNode = board[endNodeR][endNodeC]

  openList.push(board[startNodeR][startNodeC])

  let complete

  //for(let i = 0; i < boardHeight * boardWidth; i++){
  //while(openList.length > 0){

  for(let i = 0; i < boardHeight * boardWidth; i++){
    
    let currentNode = openList[0]
    let currentIndex = 0
    
   

    //console.log(openList)

    for(const [index, item] of openList.entries()) {
      if(item.astarF <= currentNode.astarF){
        currentNode = item
        currentIndex = index
      }
    }

    if(currentNode != board[startNodeR][startNodeC]) currentNode.type = CLICK_VISIT

    let row = currentNode.row
    let col = currentNode.column

    openList.splice(currentIndex, 1)
    closedList.push(currentNode)
    //console.log(closedList)

    

    let children = []

    for (let i = 0; i < 4; i++) {

      var adjRow = row + dr[i];
      var adjCol = col + dc[i];

      if (adjRow < 0 || adjCol < 0 || adjRow >= boardHeight || adjCol >= boardWidth) continue

      if (board[adjRow][adjCol].type == CLICK_WALL) continue

      children.push(board[adjRow][adjCol])

    }

    

    for(let child of children){

      //COMPLETE CONDITION
      if(child == endNode){
        complete = true
        endNode.prevCell = currentNode
        break
      }

      
      let skip = false

      for(closedChild of closedList){
        if(child == closedChild) {
          skip = true
          break
        }
      }

      if(skip) continue

      skip = false

      // let openListStrings = ""

      // for(openNode of openList){
      //   openListStrings += openNode.row + "," + openNode.column + " | "

      // }

      // console.log(openListStrings)

      for(openNode of openList){
        if(child == openNode) {

          if(child.astarG < currentNode.astarG + 1){
            console.log("HERE")
            child.astarG = currentNode.astarG + 1
            child.astarH = Math.abs(currentNode.row - endNode.row) + Math.abs(currentNode.column - endNode.column)
            //child.astarH = Math.pow(currentNode.row - endNode.row,2) + Math.pow(currentNode.column - endNode.column,2)
            child.astarF = child.astarG + child.astarH

            child.prevCell = currentNode
          }

          skip = true
          break
        }
      }

      if(skip) continue
      
      child.prevCell = currentNode

      child.astarG = currentNode.astarG + 1
      child.astarH = Math.abs(currentNode.row - endNode.row) + Math.abs(currentNode.column - endNode.column)
      //child.astarH = Math.pow(currentNode.row - endNode.row,2) + Math.pow(currentNode.column - endNode.column,2)
      child.astarF = child.astarG + child.astarH

      child.weight = child.astarF

      //child.type = CLICK_VISIT
      openList.push(child)

      await sleep(20)

    }

    if(complete) break

    

  }

  if(complete){
    await Promise.all(promises)
      
    backtrackCell = board[endNodeR][endNodeC].prevCell

    let path = []

    while(backtrackCell != board[startNodeR][startNodeC]){
      console.log(backtrackCell)
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
}


drMaze = [-2, 2, 0, 0]
dcMaze = [0, 0, 2, -2]

async function primMazeGen() {

  changeStatusText("Generating Maze: Prim's Algorithm")
  disableButtonControls()

  var visited = []

  var pathSet = []

  for (let y = 0; y < boardHeight; y++) {
    visited[y] = []
    for (let x = 0; x < boardWidth; x++) {
      visited[y].push(false)
    }
  }
  
  pathSet.push(board[1][1]) 
  // for(let i = 0; i < boardHeight * boardWidth; i++){
    
  await fullWall()
  await Promise.all(promises)

  while(pathSet.length != 0){
    var randCell = randInt(pathSet.length)

    var cell = pathSet[randCell]
    pathSet.splice(randCell, 1)

    var row = cell.row
    var col = cell.column

    visited[row][col] = true

    //cell.type = CLICK_WALL

    // GETTING VISITED NEIGHBORS

    var visitedNeighbors = []

    for (let i = 0; i < 4; i++) {

      var adjRow = row + drMaze[i];
      var adjCol = col + dcMaze[i];

      if (adjRow < 0 || adjCol < 0 || adjRow >= boardHeight || adjCol >= boardWidth) continue

      if (visited[adjRow][adjCol] == false) continue

      visitedNeighbors.push(board[adjRow][adjCol])

      // board[adjRow][adjCol].type = CLICK_WALL
    }

    if(visitedNeighbors.length != 0){

      var randConnectCell = randInt(visitedNeighbors.length)
      var connectCell = visitedNeighbors[randConnectCell]

      if(cell.type == null && connectCell.type == null) continue


      cell.type = null
      await sleep(5)

      //TOP
      if(connectCell.row < cell.row && connectCell.column == cell.column){
        board[cell.row - 1][cell.column].type = null
      }

      //BOTTOM
      else if(connectCell.row > cell.row && connectCell.column == cell.column){
        board[cell.row + 1][cell.column].type = null
      }

      //LEFT
      else if(connectCell.row == cell.row && connectCell.column < cell.column){
        board[cell.row][cell.column - 1].type = null
      }

      //RIGHT
      else if(connectCell.row == cell.row && connectCell.column > cell.column){
        board[cell.row][cell.column + 1].type = null
      }

      await sleep(5)

      connectCell.type = null

      await sleep(5)
    }

    // PUSH UNVISITED NEIGHBORS TO SET

    for (let i = 0; i < 4; i++) {

      var adjRow = row + drMaze[i];
      var adjCol = col + dcMaze[i];

      if (adjRow < 0 || adjCol < 0 || adjRow >= boardHeight || adjCol >= boardWidth) continue

      if (visited[adjRow][adjCol] == true) continue

      pathSet.push(board[adjRow][adjCol])
      
      board[adjRow][adjCol].type = CLICK_WALL
    }

  }
  console.log(pathSet)

  changeStatusText("Standby")
  clickMode = null
  enableButtonControls()
}

async function kruskalMazeGen() {

  changeStatusText("Generating Maze: Kruskal's Algorithm")
  disableButtonControls()

  var set = new Map()

  var walls = []

  var setCount = 0

  for (let y = 1; y < boardHeight; y += 2) {
    
    for (let x = 1; x < boardWidth; x += 2) {
      
      
      set.set(board[y][x], setCount)
      setCount++
    }
  }

  await fullWall()
  await Promise.all(promises)

  

  var wallOffset = 0

  for (let y = 1; y < boardHeight; y += 1) {

    if(wallOffset == 0) wallOffset = 1
    else wallOffset = 0
    
    for (let x = 1; x < boardWidth; x += 2) {

      if(y == (boardHeight - 1) || x == (boardWidth - 1) || x + wallOffset == (boardWidth - 1)) continue
      
      //board[y][x + wallOffset].type = CELL_PATH
      walls.push(board[y][x + wallOffset])
    }
  }

  // IF ODD VERTICAL YUNG WALLS, IF EVEN HORIZONTAL YUNG WALLS

  let cell1, cell2, setCell1, setCell2

  while(walls.length > 0){
    let random = randInt(walls.length)

    let selectedWall = walls[random]
    walls.splice(random, 1)
    
    let row = selectedWall.row
    let col = selectedWall.column

    if(col % 2 == 1){
      cell1 = board[row - 1][col]
      cell2 = board[row + 1][col]

    }
    else {
      cell1 = board[row][col - 1]
      cell2 = board[row][col + 1]

      
    }


    setCell1 = set.get(cell1)
    setCell2 = set.get(cell2)
    if(setCell1 != setCell2){

      
      set.set(cell2, setCell1)

      for (const [key, value] of set.entries()) {
        if(value == setCell2) set.set(key, setCell1)
      }
      
      selectedWall.type = null
      cell1.type = null
      cell2.type = null

      //console.log(set)
      await sleep(50)
    }

    
    
  }

  changeStatusText("Standby")
  clickMode = null
  enableButtonControls()
}

async function dfsMazeGen() {

  changeStatusText("Generating Maze: Depth-First Search/ Flood Fill")
  disableButtonControls()

  var visited = []

  var pathSet = []

  for (let y = 0; y < boardHeight; y++) {
    visited[y] = []
    for (let x = 0; x < boardWidth; x++) {
      visited[y].push(false)
    }
  }
  //CELL, PARENT si Path Set

  pathSet.push(board[1][1]) 
  // for(let i = 0; i < boardHeight * boardWidth; i++){
    
  await fullWall()
  await Promise.all(promises)

  // while(pathSet.length != 0){

  while(pathSet.length != 0){

    //console.log(pathSet)
    
    cell = pathSet.pop()

    //cell.type = null
    
    var row = cell.row
    var col = cell.column

    visited[row][col] = true

    //cell.type = CLICK_WALL

    // GETTING VISITED NEIGHBORS

    var visitedNeighbors = []

    for (let i = 0; i < 4; i++) {

      var adjRow = row + drMaze[i];
      var adjCol = col + dcMaze[i];

      if (adjRow < 0 || adjCol < 0 || adjRow >= boardHeight || adjCol >= boardWidth) continue

      if (visited[adjRow][adjCol] == true) continue

      visitedNeighbors.push(board[adjRow][adjCol])

      // board[adjRow][adjCol].type = CLICK_WALL
    }

    if(visitedNeighbors.length != 0){

      pathSet.push(cell)

      var randConnectCell = randInt(visitedNeighbors.length)
      var connectCell = visitedNeighbors[randConnectCell]

      //if(cell.type == null && connectCell.type == null) continue

      visited[connectCell.row][connectCell.column] = true

      pathSet.push(connectCell)

      cell.type = null

      //await sleep(200)

      //TOP
      if(connectCell.row < cell.row && connectCell.column == cell.column){
        board[cell.row - 1][cell.column].type = null
      }

      //BOTTOM
      else if(connectCell.row > cell.row && connectCell.column == cell.column){
        board[cell.row + 1][cell.column].type = null
      }

      //LEFT
      else if(connectCell.row == cell.row && connectCell.column < cell.column){
        board[cell.row][cell.column - 1].type = null
      }

      //RIGHT
      else if(connectCell.row == cell.row && connectCell.column > cell.column){
        board[cell.row][cell.column + 1].type = null
      }

      //await sleep(200)

      connectCell.type = null

      await sleep(20)

      cell = connectCell

    }

    
  }

  changeStatusText("Standby")
  clickMode = null
  enableButtonControls()
}

async function fullWall() {

  await Promise.all(promises)

  highAnimQuality = false

  for (let y = 0; y < boardHeight; y++) {
    
    for (let x = 0; x < boardWidth; x++) {
      board[y][x].type = CLICK_WALL
      board[y][x].weight = null

      
    }

    await sleep(10)
  }

  highAnimQuality = true

  startCellR = null
  startCellC = null
  endCellR = null
  endCellC = null
}

async function randomWalls() {
  for (let r = 0; r < boardHeight; r++) {
    for (let c = 0; c < boardWidth; c++) {
      if(Math.floor(Math.random() * 3) == 1 && board[r][c].type == null){
        board[r][c].type = CLICK_WALL
        await sleep(20)
      }
    }
  }
}

async function clearRow(row) {
  for (let x = 0; x < board[row].length; x++) {

    
      
    if(board[row][x].type != null) {

      board[row][x].type = null

      if(board[row][x].weight != null) board[row][x].weight = null
      
      await sleep(1)
    }
    else {
      if(board[row][x].weight != null){
        board[row][x].weight = null
        board[row][x].updated = true
        board[row][x].updateBuffer = true
      }
    }

    // canvasRefresh = true

    



    
  }
  promises.shift()
}

async function clearAll() {

  for (let y = 0; y < board.length; y++) {

    promises.push(clearRow(y))
    await sleep(30)
  }

  promises.shift()

  startCellR = null
  startCellC = null
  endCellR = null
  endCellC = null

  await Promise.all(promises)
  canvasRefresh = true

}

async function clearRowPathfinding(row) {
  for (let x = 0; x < board[row].length; x++) {
      
    if(board[row][x].type == CLICK_VISIT || board[row][x].type == CELL_PATH) {
      board[row][x].type = null
      board[row][x].weight = null
      await sleep(1)
    }
    else{
      if(board[row][x].weight != null){
        board[row][x].weight = null
        board[row][x].updated = true
        board[row][x].updateBuffer = true
      }
    }
    
    
    


    
  }
  promises.shift()
}

async function clearPathfinding() {

  changeStatusText("Clearing Path")

  for (let y = 0; y < board.length; y++) {

    promises.push(clearRowPathfinding(y))
    await sleep(30)
  }

  promises.shift()

}

function changeStatusText(text){
  statusText = text
  canvasRefresh = true
}

// @ARCHIVE -> clearAll function

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
  if(isPathFind){
    clearPathfinding()
    isPathFind = false
  }

  changeStatusText("Create: Wall")

  clickMode = CLICK_WALL
}

function handleStart() {

  if(isPathFind){
    clearPathfinding()
    isPathFind = false
  }

  changeStatusText("Set: Start")

  clickMode = CLICK_START
}

function handleEnd() {

  if(isPathFind){
    clearPathfinding()
    isPathFind = false
  }

  changeStatusText("Set: End")

  clickMode = CLICK_END
}

function handleDebug() {
  clickMode = CLICK_DEBUG
}

function handleRemove() {

  changeStatusText("Delete: Cell")

  if(isPathFind){
    clearPathfinding()
    isPathFind = false
  }

  clickMode = CLICK_DELETE
}

async function handleClearBoard() {
  console.log(promises)
  await Promise.all(promises)

  promises.push(clearAll())
}

function handleBFS() {

  if(startCellR == null || endCellR == null){
    alert("Please set a start and end cell")
    return
  }

  isPathFind = true
  bfs(startCellR, startCellC, endCellR, endCellC)
}

function handleDFS() {
  if(startCellR == null || endCellR == null){
    alert("Please set a start and end cell")
    return
  }

  isPathFind = true
  dfs(startCellR, startCellC, endCellR, endCellC)
}

function handleDijkstra() {
  if(startCellR == null || endCellR == null){
    alert("Please set a start and end cell")
    return
  }

  isPathFind = true
  dijkstra(startCellR, startCellC, endCellR, endCellC)
}

function handleAstar() {
  if(startCellR == null || endCellR == null){
    alert("Please set a start and end cell")
    return
  }

  isPathFind = true
  astar(startCellR, startCellC, endCellR, endCellC)
}

let boardWidth = 30+1, boardHeight = 15+2
//let boardWidth = 60+1, boardHeight = 30+1

//let boardWidth = 15, boardHeight = 10+1


let board = []
let startCellR = null
let startCellC = null
let endCellR = null
let endCellC = null

let promisesResetTrigger = false

let popSound

let statusText = "Standby"

let canvasRefresh = false

function preload() {
  soundFormats('mp3', 'ogg');
  //popSound = loadSound("assets/pop_sound.mp3")

  popSound = loadSound("assets/pop_sound.mp3", function () {
    console.log('loaded', "assets/pop_sound.mp3");
  });
}

function setup() {
  frameRate(30)

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
      height/2 - (rectSize * (boardHeight - 1))/2 + rectSize * y,
      y, 
      x)
      
      
      board[y].push(cell)
    }
  }

  board[7][3].type = CLICK_START

  startCellR = 7
  startCellC = 3

  board[7][25].type = CLICK_END

  endCellR = 7
  endCellC = 25

  board[7][13].type = CLICK_WALL
  board[8][13].type = CLICK_WALL
  board[9][13].type = CLICK_WALL
  board[10][13].type = CLICK_WALL
  board[6][13].type = CLICK_WALL
  board[5][13].type = CLICK_WALL
  board[4][13].type = CLICK_WALL

  //handleAstar()


  //handleDijkstra()

  console.log(board)

  // FIRST DRAW

  background(28, 42, 53)

  for (let y = 0; y < board.length; y++) {

    for (let x = 0; x < board[y].length; x++) {
      board[y][x].draw()
      board[y][x].updated = false
    }
  }
}

async function draw() {
  if(canvasRefresh){
    background(28, 42, 53);
  }
  textAlign(CENTER, CENTER)

  //background(200)

  // if(promisesResetTrigger){
  //   promisesResetTrigger = false
  //   promises = []
  // }

  for (let y = 0; y < board.length; y++) {

    for (let x = 0; x < board[y].length; x++) {

      board[y][x].draw()

    }
  }
  fill(255)
  textAlign(LEFT, TOP)
  text(statusText, 10, 10)

  if(canvasRefresh) canvasRefresh = false

  // console.log(promises.length)
  // OK MEDYO MAGICAL TO FOR ME, pero gist of it is, nagrurun parin yung nasa taas, di lang tumatagos kumbaga
  await Promise.all(promises)
  //promisesResetTrigger = true
}


function mousePressed() {

  if(mouseY > 0){
    
    

    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {

        let selectedCell = board[y][x].clicked()
        
        // if(isPathFind && (board[y][x].type == CELL_PATH || board[y][x].type == CLICK_VISIT)){
        //   board[y][x].type = null
        // }

        if(selectedCell) {
          console.log(selectedCell.updated)

          if(clickMode == CLICK_WALL){

            selectedCell.type = clickMode
          }
          else if(clickMode == CLICK_START && isStartAnimRunning == false){
            
            if(startCellR != null) board[startCellR][startCellC].type = null

            selectedCell.type = clickMode

            startCellR = y
            startCellC = x

          }
          else if(clickMode == CLICK_END && isEndAnimRunning == false){

            if(endCellR != null) board[endCellR][endCellC].type = null
            
            selectedCell.type = clickMode

            endCellR = y
            endCellC = x

          }
          else if(clickMode == CLICK_DEBUG){
              
            selectedCell.prevCell.type = null
            
          }

          else if(clickMode == CLICK_DEBUG){
              
            selectedCell.prevCell.type = null
            
          }
          else if(clickMode == CLICK_DELETE){
            
            if(selectedCell.type == CLICK_START){
              console.log("HERE")
              startCellC = null
              startCellR = null
            }
            else if(selectedCell.type == CLICK_END){
              endCellC = null
              endCellR = null
            }

            selectedCell.type = null
            
            
          }
          selectedCell.draw()
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
        if(clickMode == CLICK_WALL){

          selectedCell.type = clickMode

        }

        else if(clickMode == CLICK_DELETE){
          
          if(selectedCell.type == CLICK_START){
            console.log("HERE")
            startCellC = null
            startCellR = null
          }
          else if(selectedCell.type == CLICK_END){
            endCellC = null
            endCellR = null
          }

          selectedCell.type = null
          
          
        }
        
        
      }
    }
  }
}

function windowResized() {
  var controlsHeight = document.getElementById("controlMain").offsetHeight 
  resizeCanvas(windowWidth, windowHeight - controlsHeight);
  canvasRefresh = true
  pixelDensity(displayDensity());
}


function adjustBoard() {
  let newBoardWidth = parseInt(document.getElementById("boardWidth").value)
  let newBoardHeight = parseInt(document.getElementById("boardHeight").value)
  let newRectSize = parseInt(document.getElementById("rectSize").value)

  
  if(newBoardHeight == boardHeight && newBoardWidth == boardWidth && newRectSize == rectSize) {
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {


        board[y][x].x = width/2 - (rectSize * (boardWidth - 1))/2 + rectSize * x
        board[y][x].y = height/2 - (rectSize * (boardHeight - 1))/2 + rectSize * y
        
      }
    }
  }
  else {

    boardWidth = newBoardWidth
    boardHeight = newBoardHeight
    rectSize = newRectSize

    board = []

    

    for (let y = 0; y < boardHeight; y++) {
      board[y] = []
      for (let x = 0; x < boardWidth; x++) {

        var cell = new Cell(width/2 - (rectSize * (boardWidth - 1))/2 + rectSize * x, 
        height/2 - (rectSize * (boardHeight - 1))/2 + rectSize * y,
        y, 
        x)
        
        board[y].push(cell)
      }
    }
  }
  canvasRefresh = true
}

