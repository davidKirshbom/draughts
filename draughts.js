class Square {
    constructor(piece, row, column) {
        this.position={row,column}
        this.pieceOn = piece;
        this.isPossibleEndMovment = false;
   
    }
    
    isEnableEndMovment = function (originPosition, board) {
        
    };
    getClassNameByState = function () {
        let className = "square ";
            className += this.isPossibleEndMovment ? "endEnable" : "";
        return className
    }
}
class Piece {
    constructor(row, column, color,id) {
        this.position = { row, column }
        this.color = color;
        this.canStartMovment = false;
        this.getMovmentFactor = color == "gray" ? -1 : 1;
        this.id = id;
    }
    getClassName(board,legalMoveFunc) {
        return `piece ${this.color} ${this.canStartMovment ? "startEnable" : ""}`;
    }
    
    
}
function generateStartBoard() {
    let board = [];
    let picesCount = 0;
    for (let row = 0; row < 8; row++) {
        let rowArray = [];
        let column;
        for (column = 0; column < 8; column++) {
            
            let pieceToAdd;
            if ((row + column) % 2 != 0) {
                if (row < 3)
                    pieceToAdd = new Piece(row, column, "red",picesCount++)
                else if (row >= 5)
                    pieceToAdd = new Piece(row, column, "gray", picesCount++)
                
            }
            
            rowArray.push(new Square(pieceToAdd))
        }
        board.push(rowArray);
    }
    updatePicesCanMove(board)
    return board;
}
let board = generateStartBoard();
board.getConsolePrint = function () {
    let resultBoard = [];
    for (let row = 0; row < this.length; row++) {
        let resultRow = [];
        for (let col = 0; col < this[row].length; col++) {
            if (this[row][col].pieceOn)
                resultRow.push(this[row][col].pieceOn.color)
            else
                resultRow.push("EE")
        }
        resultBoard.push(resultRow);
        
    }
}
updateBoardUi(board);
function startMovment(event)
{
    let startMovmentPoint = getPieceLocationOnBoardById(board, event.target.getAttribute("id"))
    updatepossibleSquaresToMove(board, startMovmentPoint);
    updateBoardUi(board);
    
}
function getPieceLocationOnBoardById(board,id)
{
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            if (board[row][column].pieceOn && board[row][column].pieceOn.id == id)
                return { row, column }
        }
    }
    return null;
}
function updatepossibleSquaresToMove(board, startMovmentPoint) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            {
                if (legalMove(board, startMovmentPoint, { row, column }))
                    board[row][column].isPossibleEndMovment = true;
                else {
                
                    board[row][column].isPossibleEndMovment = false;
                }
            }
    
        }
    }
}
function updatePicesCanMove(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            if (!board[row][column].pieceOn)
                continue;
           
            let targetRow = row + 1 * board[row][column].pieceOn.getMovmentFactor
            let targetColRight = column + 1 >= board[targetRow].length ? null : column + 1;
            let targetColLeft = column - 1 < 0 ? null : column - 1;
            if (legalMove(board, { row, column }, { row: targetRow, column: targetColRight })
                || legalMove(board, { row, column }, { row: targetRow, column: targetColLeft }))
                board[row][column].pieceOn.canStartMovment = true;
            else
                board[row][column].pieceOn.canStartMovment = false;
        }
    }
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
                console.log(piece.id)
                pieceUi.setAttribute("id", `${piece.id}`)//to connect between frontUI to back
                pieceUi.addEventListener("click",startMovment)
                pieceUi.setAttribute("class", board[row][column].pieceOn.getClassName(board,legalMove))
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
            squareUi.setAttribute("class", board[row][column].getClassNameByState(board,legalMove, "startMovment") + " " + squareUi.color);
     
            if (pieceUi) {
                squareUi.appendChild(pieceUi)
            }
            squareUi.style.gridRow = `${row + 1}/${row + 2}`
            squareUi.style.gridColumn = `${column + 1}/${column + 2}`
            boardUi.appendChild(squareUi);
        }
    }
}
function legalMove(board, originLocation, targetLocation)
{
    let pieceMoving = board[originLocation.row][originLocation.column].pieceOn;
    if (!pieceMoving)
        return false;   
    if (Math.abs(originLocation.row - targetLocation.row) == 1
        && Math.abs(originLocation.column - targetLocation.column) == 1
        && !board[targetLocation.row][targetLocation.column].pieceOn)//regular move
        return true;
   
    if(Math.abs(originLocation.row - targetLocation.row) == 2)//eat move
    {
        let rightLeftFactor = originLocation.column - targetLocation.column
        if ((rightLeftFactor != -1 && rightLeftFactor != 1)||(originLocation.column+rightLeftFactor<0||originLocation.column+rightLeftFactor>=board.length))
            return false;
        let eatSquare=board[originLocation.row+pieceMoving.getMovmentFactor][originLocation.column+rightLeftFactor]
        if (eatSquare.pieceOn && eatSquare.pieceOn.color != pieceMoving.color)
            return true;
        else
            return false;
        }
}  
