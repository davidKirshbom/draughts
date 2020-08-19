function DraughtsGame(gameGridContainerID) {
    this.gameGridContainerID = gameGridContainerID;
    
const BLACK = "black"
const WHITE = "white"

    
    
this.beginMovment=(event)=>
{ 
    this.game.startMovment(getPieceLocationOnBoardById(this.game.gameState.board,parseInt(event.target.getAttribute("id"))))
    this.updateBoardUi(this.game.gameState.board)
    event.preventDefault();
}
this.finishMovment=(event)=> {
    if(event.target !== event.currentTarget) return;
    let locationArr = event.target.id.split("")
    if (locationArr.length < 2)
        return;
    let targetlocation = { row: parseInt(locationArr[0]), column:parseInt(locationArr[1]) }
    this.game.endMovment(targetlocation)
    this.updateBoardUi(this.game.gameState.board)
    if (this.game.gameState.isGameOver)
        if(this.game.gameState.isGameOverWin)
            this.showRestartPrompt(this.game.gameState.CurrentColorTurn[0].toUpperCase() + this.game.gameState.CurrentColorTurn.slice(1) + " won")
        else
            this.showRestartPrompt("It's a draw")
            
}
this.showRestartPrompt=(message)=>
{
    let board=document.getElementById(this.gameGridContainerID)
    let promptUi = document.createElement("div")
    promptUi.id = "popPrompt"
    promptUi.className = "popPrompt"
    let messagePargraph = document.createElement("p")
    messagePargraph.innerHTML=message +",<br> To restart press the button";
    promptUi.appendChild(messagePargraph)
    let restartButton = document.createElement("button")
    restartButton.className = "restartbutton"
    restartButton.innerHTML = "Restart"
    promptUi.appendChild(restartButton)
    board.appendChild(promptUi)
    restartButton.addEventListener("click", () => {
        this.game.restartGame()
        this.updateBoardUi(this.game.gameState.board)
      
    })
    }  
    this.createSquareUi=(square, color, id)=> {
        let squareUi = document.createElement("div");
        squareUi.color = color
        squareUi.className = square.getClassNameByState() + " " + squareUi.color;
        squareUi.id = id
        if (!this.game.gameState.isGameOver)
            squareUi.addEventListener("click", this.finishMovment)
        return squareUi
    }
    this.createPieceUi = (piece) => {
        
        let pieceUi = document.createElement("span");
        if (piece.isKing) {
            let crownImage = document.createElement("img")
            crownImage.src = "./img/crown.png"
            crownImage.id = piece.id
            pieceUi.append(crownImage);
        }
        pieceUi.id = piece.id//to connect between frontUI to back
        if (!this.game.gameState.isGameOver)
            pieceUi.addEventListener("click", this.beginMovment)
        pieceUi.className = piece.getClassName()
        return pieceUi;
    }
this.updateBoardUi=(board)=> {
    let boardUi = document.getElementById(this.gameGridContainerID)
    boardUi.innerHTML = "";
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            
                  
            let squareColor
            if (row % 2 == 0) {
                if (column % 2 == 0)
                    squareColor = WHITE
                else
                    squareColor = BLACK
            }
            else {
                if (column % 2 == 0)
                    squareColor = BLACK
                else
                    squareColor = WHITE
            }
            let squareUi = this.createSquareUi(board[row][column], squareColor, `${row}${column}`)
            squareUi.style.gridRow = `${row + 1}/${row + 2}`
            squareUi.style.gridColumn = `${column + 1}/${column + 2}`
            if (board[row][column].pieceOn) {
                squareUi.appendChild(this.createPieceUi(board[row][column].pieceOn))
            }
            boardUi.appendChild(squareUi);
        }
    }
  
}
    //this.updateBoardUi = this.updateBoardUi.bind(this)
   
function getPieceLocationOnBoardById(board, id) {
    
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            if (board[row][column].pieceOn && board[row][column].pieceOn.id == id)
                return { row, column }
        }
    }
    return null;
    }
    this.game = new DraughtsGameLogic(this.showRestartPrompt)
    this.game.restartGame()
    this.updateBoardUi(this.game.gameState.board)
  
}
