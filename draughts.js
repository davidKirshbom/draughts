const RED = "red";
const GRAY="gray"
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
        this.getMovmentFactor = color == GRAY ? -1 : 1;
        this.id = id;
        this.isKing = false;
    }
    getClassName(board,legalMoveFunc) {
        return `${this.isKing?"King ":""} piece ${this.color} ${this.canStartMovment ? "startEnable" : ""}`;
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
                    pieceToAdd = new Piece(row, column, GRAY, picesCount++)
                
            }
            
            rowArray.push(new Square(pieceToAdd))
        }
        board.push(rowArray);
    }
    updatePicesCanMove(board)
    return board;
}
let CurrentColorTurn = "red"
let round=0
let picesInDanger=[]
let board = generateStartBoard();
getConsolePrint = function (board) {
    let resultBoard = [];
    for (let row = 0; row < board.length; row++) {
        let resultRow = [];
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col].pieceOn)
                resultRow.push(board[row][col].pieceOn.color)
            else
                resultRow.push("EE")
        }
        resultBoard.push(resultRow);
        
    }
    console.log(resultBoard)
}
updateBoardUi(board);
let startMovmentPoint;
function startMovment(event)
{
    startMovmentPoint = getPieceLocationOnBoardById(board, event.target.getAttribute("id"))
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
    UpdatePicesInDanger(board)
    updateAllPicesCantMove(board)
    for (let originRow = 0; originRow < board.length; originRow++) {
        for (let originColumn = 0; originColumn < board[originRow].length; originColumn++) {
            if (!board[originRow][originColumn].pieceOn)
                continue;
            for (let targetRow = 0; targetRow < board.length; targetRow++) {
                for (let targetColumn = 0; targetColumn < board[targetRow].length; targetColumn++) {
                    if (legalMove(board, { row: originRow, column: originColumn }, { row: targetRow, column: targetColumn }))
                    {

                        board[originRow][originColumn].pieceOn.canStartMovment = true;
                    }
                }
            }
        }
    }
}

function UpdatePicesInDanger(board)
{
    picesInDanger=[]
    for (let originRow = 0; originRow < board.length; originRow++) {
        for (let originColumn = 0; originColumn < board[originRow].length; originColumn++) {
            if (!board[originRow][originColumn].pieceOn)
                continue;
            let pieceTryTake = board[originRow][originColumn].pieceOn;
            let possibleTakeColumnLeft = originColumn - 1;
            let  possibleTakeColumnRight = originColumn + 1;
            let possibleTakeRow = originRow + 1 * pieceTryTake.getMovmentFactor
            if (board[possibleTakeRow]&&board[possibleTakeRow][possibleTakeColumnLeft]&&board[possibleTakeRow][possibleTakeColumnLeft].pieceOn
                && legalMove(board, { row: originRow, column: originColumn }
                                  , { row: possibleTakeRow + 1 * pieceTryTake.getMovmentFactor, column: possibleTakeColumnLeft - 1 }))//left)
            {
                picesInDanger.push(board[possibleTakeRow][possibleTakeColumnLeft].pieceOn)
            }
            else if(board[possibleTakeRow]&&board[possibleTakeRow][possibleTakeColumnRight]&&board[possibleTakeRow][possibleTakeColumnRight].pieceOn
                && legalMove(board, { row: originRow, column: originColumn }
                                  , { row: possibleTakeRow + 1 * pieceTryTake.getMovmentFactor, column: possibleTakeColumnRight + 1 }))//right)
            {
                picesInDanger.push(board[possibleTakeRow][possibleTakeColumnRight].pieceOn)
              
                }
     
         
        }
    }
}
function updateAllPicesCantMove(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            {
            if(board[row][column].pieceOn)
                board[row][column].pieceOn.canStartMovment = false;
                
            }
        }
    }
}
function endMovment(event) {
    
    let locationArr = event.target.id.split("")
    let targetlocation={row:locationArr[0],column:locationArr[1]}
    let targetSquare = board[targetlocation.row][targetlocation.column]
    let originSquare = board[startMovmentPoint.row][startMovmentPoint.column];
    if (targetSquare && targetSquare.isPossibleEndMovment) {
         if (Math.abs(targetlocation.row - startMovmentPoint.row) >= 2)
            {
            let takeColumn = targetlocation.column - (targetlocation.column > startMovmentPoint.column?1:-1);
            let takeRow = targetlocation.row -(startMovmentPoint.row < targetlocation.row ? 1 : -1)
            if(board[takeRow][takeColumn].pieceOn)
                board[takeRow][takeColumn].pieceOn = null
        }
        if ((originSquare.pieceOn.color == GRAY && targetlocation.row == 0)
            || originSquare.pieceOn.color == RED && targetlocation.row == 7) {
            console.log("new king")
            originSquare.pieceOn.isKing = true;
        }
        targetSquare.pieceOn = originSquare.pieceOn;
        originSquare.pieceOn = null;
        if (isWin(board)&&round>0)
        {
            console.log("win!!!!!!!!")
            return;
        }
        CurrentColorTurn = (CurrentColorTurn == RED ? GRAY : RED)
        updatePicesCanMove(board)
        updateAllSquaresNotPossibleMove(board)
        updateBoardUi(board)
       
        round++;
    }
}
function updateAllSquaresNotPossibleMove(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            {
            
                board[row][column].isPossibleEndMovment = false;
                
            }
    
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
                if (piece.isKing)
                {
                    let crownImg = document.createElement("img")
                    crownImg.src = "./img/crown.png"
                   
                    
                  pieceUi.append(crownImg);
                   
                    
                }
                pieceUi.setAttribute("id", `${piece.id}`)//to connect between frontUI to back
                pieceUi.addEventListener("click", startMovment)
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
            squareUi.addEventListener("click", endMovment)
            if (pieceUi) {
                squareUi.appendChild(pieceUi)
            }
            squareUi.style.gridRow = `${row + 1}/${row + 2}`
            squareUi.style.gridColumn = `${column + 1}/${column + 2}`
            boardUi.appendChild(squareUi);
        }
    }
}
function legalMove(board, originLocation, targetLocation) {
    let pieceMoving = board[originLocation.row][originLocation.column].pieceOn;
    if (originLocation.row==4&&originLocation.column==7&&targetLocation.row==2&&targetLocation.column==5)
    console.log( pieceMoving.color,"!=",CurrentColorTurn,"=",   pieceMoving.color!==CurrentColorTurn   )
    if (!pieceMoving || targetLocation.row < 0 || targetLocation.row >= board.length || targetLocation.column < 0 || targetLocation.column >= board[targetLocation.row].length
    ||pieceMoving.color!==CurrentColorTurn|| board[targetLocation.row][targetLocation.column].pieceOn)
        return false;
       
    if (pieceMoving.isKing)
        return isLegalKingMove(board, originLocation, targetLocation).value
        
    if ((pieceMoving.color == GRAY && originLocation.row < targetLocation.row)
        ||(pieceMoving.color==RED&&originLocation.row > targetLocation.row))
        return false;
        
    if (!picesInDanger.some((piece) => { return piece.color !== pieceMoving.color }) &&originLocation.row + 1 * pieceMoving.getMovmentFactor == targetLocation.row
        && Math.abs(originLocation.column - targetLocation.column) == 1
        && !board[targetLocation.row][targetLocation.column].pieceOn)//regular move
        return true;
      
    if (Math.abs(originLocation.row - targetLocation.row) === 2)//eat move
    {
       
        let rightLeftFactor = (targetLocation.column - originLocation.column) / 2
        
        // if(originLocation.row==4&&originLocation.column==7)
        // console.log(`target \n row:${targetLocation.row}, column:${targetLocation.column}\n rightleftFactor ${rightLeftFactor}`)
        if ((rightLeftFactor != -1 && rightLeftFactor != 1) || (originLocation.column + rightLeftFactor < 0 || originLocation.column + rightLeftFactor >= board.length))
            return false;
        let eatSquare = board[originLocation.row + pieceMoving.getMovmentFactor][originLocation.column + rightLeftFactor]
        
        if (eatSquare.pieceOn && eatSquare.pieceOn.color != pieceMoving.color)
        {
            return true;
        }
        else
            return false;
    }
    
}
board[5][2].pieceOn.isKing = true;
function isLegalKingMove(board, originLocation, targetLocation) {
    if (!board[originLocation.row][originLocation.column].pieceOn
        || !board[originLocation.row][originLocation.column].pieceOn.isKing)
        return false;
    if (originLocation.row - originLocation.column != targetLocation.row - targetLocation.column
        && originLocation.row + originLocation.column != targetLocation.row + targetLocation.column)
        return false;
    let columnFactor = originLocation.column > targetLocation.column ? -1 : 1;
    let rowFactor = originLocation.row < targetLocation.row ? 1 : -1;
    let numberOfRowsCheck = Math.abs(originLocation.row - targetLocation.row)
    let numberOfColumnCheck = Math.abs(originLocation.column - targetLocation.column)
    for (let rowOffset = 1, columnOffset = 1;columnOffset <= numberOfColumnCheck&& rowOffset <= numberOfRowsCheck;columnOffset++, rowOffset++) {
            let rowToCheck = originLocation.row + rowOffset * rowFactor;
            let colToCheck = originLocation.column + columnOffset * columnFactor;
            if (board[rowToCheck][colToCheck].pieceOn) {
               console.log("king can eat row ",rowToCheck," col ",colToCheck)
                 if(rowToCheck+rowFactor==targetLocation.row&&colToCheck+columnFactor==targetLocation.column)
                     return { value: true, eatPieceOnLoction: { row: rowToCheck, column: colToCheck } };
                    else
                     return { value: false };
            }
        }
    return { value: true };    
}
function isWin(board)
{
    
    CurrentColorTurn = CurrentColorTurn == RED ? GRAY : RED;
    updatePicesCanMove(board);
    let result = true;
   
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            let pieceOnSquare = board[row][column].pieceOn
           
               //console.log(pieceOnSquare)
            if (pieceOnSquare && pieceOnSquare.color === CurrentColorTurn && pieceOnSquare.canStartMovment)
                result= false;
        }
    }
    CurrentColorTurn = CurrentColorTurn == RED ? "grey" : RED;
    
    updatePicesCanMove(board);
    return result;
} 
    



