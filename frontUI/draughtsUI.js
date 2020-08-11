const BLACK = "black"
const WHITE = "white"
let logic = new draughtsGameLogic(updateBoardUi);
logic.restartGame();
function beginMovment(event)
{ 
    logic.startMovment(getPieceLocationOnBoardById(logic.gameState.board,parseInt(event.target.getAttribute("id"))))
    event.preventDefault();
}
function finishMovment(event) {
    let locationArr = event.target.id.split("")
    if (locationArr.length < 2)
        return;
    let targetlocation = { row: parseInt(locationArr[0]), column:parseInt(locationArr[1]) }
    logic.endMovment(targetlocation)
}
function showRestartPrompt(message)
{
    let board=document.getElementsByClassName("board")[0]
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
        logic.restartGame()
        updateBoardUi(logic.gameState.board)
        board.removeChild(promptUi)
        promptUi.className="unVisibale"
    })
}  

function updateBoardUi(board) {
    let boardUi = document.getElementsByClassName("board")[0]
    boardUi.innerHTML = "";
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            
            let pieceUi;
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
            if (pieceUi) {
                squareUi.appendChild(pieceUi)
            }
            let squareUi=createSquareUi(board[row][column],squareColor,`${row}${column}`)
            squareUi.style.gridRow = `${row + 1}/${row + 2}`
            squareUi.style.gridColumn = `${column + 1}/${column + 2}`
            if (board[row][column].pieceOn) {
                squareUi.appendChild(createPieceUi(board[row][column].pieceOn))
            }
           boardUi.appendChild(squareUi);
        }
    }
  
}
function createSquareUi(square,color,id)
{
    let squareUi = document.createElement("div");
    squareUi.color = color
    squareUi.className= square.getClassNameByState() + " " + squareUi.color;
    squareUi.id =id 
    squareUi.addEventListener("click", finishMovment)
    return squareUi
}
function createPieceUi(piece)
{
    
    pieceUi = document.createElement("span");
    if (piece.isKing) {
        let crownImage = document.createElement("img")
        crownImage.src = "./img/crown.png"
        crownImage.id = piece.id
        pieceUi.append(crownImage);
    }
    pieceUi.id = piece.id//to connect between frontUI to back
    pieceUi.addEventListener("click", beginMovment)
    pieceUi.className = piece.getClassName()
    return pieceUi;
}
function getPieceLocationOnBoardById(board, id) {
    
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            if (board[row][column].pieceOn && board[row][column].pieceOn.id == id)
                return { row, column }
        }
    }
    return null;
}
