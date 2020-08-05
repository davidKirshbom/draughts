class Square {
    constructor(piece) {
        this.pieceOn = piece;
    }
    
    isEnableEndMovment = function (originPosition, board) {
        
    };
    getClassNameByState = function (board, state) {
        let className = "square ";
     
        return className
    }
}
class Piece {
    constructor(row, column, color) {
        this.position = { row, column }
        this.color = color;
        this.getMovmentFactor = () => this.color == "gray" ? -1 : 1;
    }
    getClassName(board,legalMoveFunc) {
        return `piece ${this.color} ${this.isEnableStartMovment(legalMoveFunc,board) ? "startEnable" : ""}`;
    }
    isEnableStartMovment(legalMoveFunc, board) {
        let targetRow = this.position.row + 1 * this.getMovmentFactor()
        let targetColRight = this.position.column + 1 >= board[targetRow].length ? null : this.position.column + 1;
        let targetColLeft = this.position.column - 1 < 0 ? null : this.position.column - 1;
        if (legalMoveFunc(board, { row: this.position.row, column: this.position.column }, { row: targetRow, column: targetColRight })
        ||legalMoveFunc(board, { row: this.position.row, column: this.position.column }, { row: targetRow, column: targetColLeft }))
            return true;
        else
            return false;
    }
        
   
}

        //function legalMove(originPosition,target)
        function generateStartBoard() {
            let board = [];
            for (let row = 0; row < 8; row++) {
                let rowArray = [];
                let column;
                for (column = 0; column < 8; column++) {
            
                    let pieceToAdd;
                    if ((row + column) % 2 != 0) {
                        if (row < 3)
                            pieceToAdd = new Piece(row,column,"red")
                        if (row >= 5)
                            pieceToAdd = new Piece(row,column,"gray")
                    }
            
                    rowArray.push(new Square(pieceToAdd))
                }
                board.push(rowArray);
            }
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
        board.getConsolePrint();
function updateBoardUi(board) {
    let boardUi = document.getElementsByClassName("board")[0]
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            let squareUi = document.createElement("div");
            let pieceUi;
          
            if (board[row][column].pieceOn) {
               
                pieceUi = document.createElement("span");
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
            squareUi.setAttribute("class", board[row][column].getClassNameByState(board, "startMovment") + " " + squareUi.color);
     
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
        if (rightLeftFactor != -1 && rightLeftFactor != 1)
            return false;
        let eatSquare=board[originLocation.row+pieceMoving.getMovmentFactor()][originLocation.column+rightLeftFactor]
        if (eatSquare.pieceOn && eatSquare.pieceOn.color != pieceMoving.color)
            return true;
        else
            return false;
        }
}  
