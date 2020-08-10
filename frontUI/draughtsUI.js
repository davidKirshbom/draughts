function beginMovment(event)
{ 
    startMovment(getPieceLocationOnBoardById(gameState.board, event.target.getAttribute("id")))
    event.preventDefault();
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
function finishMovment(event) {
    let locationArr = event.target.id.split("")
    if (locationArr.length < 2)
        return;
    let targetlocation = { row: parseInt(locationArr[0]), column:parseInt(locationArr[1]) }
    endMovment(targetlocation)
}
function showRestartPrompt(message)
{
    let promptUi = document.getElementById("popPrompt")
    promptUi.getElementById("promptText").innerText = message +",\n To restart press the button";
    promptUi.className = "popPrompt"
    let restartButton = promptUi.getElementById("restartButton")
    restartButton.addEventListener("click", () => {
        gameState.restart();
        updateBoardUi(gameState.board)
        promptUi.className="unVisibale"
    })
}   
function updateBoardUi(board) {
    let boardUi = document.getElementsByClassName("board")[0]
    boardUi.innerHTML = "";
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            let squareUi = document.createElement("div");
            let pieceUi;
            if (board[row][column].pieceOn) {
                let piece = board[row][column].pieceOn;
                pieceUi = document.createElement("span");
                if (piece.isKing)
                {
                    let crownImg = document.createElement("img")
                    crownImg.src = "./img/crown.png"
                   
                    
                  pieceUi.append(crownImg);
                   
                    
                }
                pieceUi.setAttribute("id", `${piece.id}`)//to connect between frontUI to back
               
                pieceUi.addEventListener("click", beginMovment)
                pieceUi.setAttribute("class", board[row][column].pieceOn.getClassName(board, legalMove))
            }
            if (row % 2 == 0) {
                if (column % 2 == 0)
                    squareUi.color = "white"
                else
                    squareUi.color = "black"
            }
            else {
                if (column % 2 == 0)
                    squareUi.color = "black"
                else
                    squareUi.color = "white"
            }
           
            squareUi.setAttribute("class", board[row][column].getClassNameByState(board, legalMove, "startMovment") + " " + squareUi.color);
            squareUi.id = `${row}${column}`
            squareUi.addEventListener("click", finishMovment)
            if (pieceUi) {
                squareUi.appendChild(pieceUi)
            }
            squareUi.style.gridRow = `${row + 1}/${row + 2}`
            squareUi.style.gridColumn = `${column + 1}/${column + 2}`
            boardUi.appendChild(squareUi);
        }
    }
}