const RED = "red";
const GRAY = "gray";
let currentTurnNewKings=[]
let gameState = {
    CurrentColorTurn: RED,
    board : [],
    picesInDanger:[],
    roundsOnlyKingsMoveAndNoneTakenPiece:0,
    boardHistory: [],
    startMovmentPoint: {},
    restart: function () {
        this.CurrentColorTurn = RED
        this.board = generateStartBoard()
        this.picesInDanger = []
        this.roundsOnlyKingsMoveAndNoneTakenPiece = 0
        this.boardHistory = []
        this.startMovmentPoint = {}
       
    }
}
function BoardPointer(board,beginRow=0,endRow=board.length-1,beginColumn=0,endColumn=board.length-1)
{
    let startRow = beginRow;
    let startColumn = beginColumn;
    this.row = startRow;
    this.endRow = endRow;
    this.column = startColumn;
    this.endColumn = endColumn;
    this.isFinish = false;
    this.getLocation = () => {return { row: this.row, column: this.column } }
    this.getSquare = function ()
    {
        return board[this.row][this.column];
    }
    this.moveSquare = function ()
    {
        if (this.column + 1 > this.endColumn)
        {
            this.column = startColumn;
            if (this.row + 1 > this.endRow)
            {
                
                this.row = startRow;
            }
            else this.row++;
        }
        else this.column++
        this.isFinish=this.row==startRow&&this.column==startColumn
    }
    
}
gameState.restart();
updateBoardUi(gameState.board);
function generateStartBoard(){
    let board = [];
    let picesCount = 0;
    for (let row = 0; row < 8; row++) {
        let rowArray = [];
        let column;
        for (column = 0; column < 8; column++) {
            
            let pieceToAdd;
            if ((row + column) % 2 != 0) {
                if (row < 3)
                    pieceToAdd = new Piece(row, column, RED,picesCount++)
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
function getBoardString(board) {
    let resultBoard="" ;
    for (let row = 0; row < board.length; row++) {
        let resultRow="" ;
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col].pieceOn)
                resultRow += board[row][col].pieceOn.id+""+board[row][col].pieceOn.isKing
            else
                resultRow += ("EE");
        }
        resultBoard+=(resultRow+"\n");
        
    }
    return resultBoard
}
function updatepossibleSquaresToMove(board, startMovmentPoint) {
    for (let pointer = new BoardPointer(gameState.board); !pointer.isFinish;pointer.moveSquare()) {
        {
                pointer.getSquare().isPossibleEndMovment = legalMove(board, startMovmentPoint, pointer.getLocation());
            }
    }
}
function updatePicesCanMove(board) {
    UpdatePicesInDanger(board)
    updateAllPicesCanNotMove(board)
    for (let originPointer = new BoardPointer(board); !originPointer.isFinish; originPointer.moveSquare()) {
        if (!originPointer.getSquare().pieceOn)
            continue;
        for (let targetPointer = new BoardPointer(board); !targetPointer.isFinish; targetPointer.moveSquare()) {
            if (legalMove(board, originPointer.getLocation(), targetPointer.getLocation())) {

                board[originPointer.row][originPointer.column].pieceOn.canStartMovment = true;
            }
        }
    }    
}

function UpdatePicesInDanger(board, currentTurnNewKings) {
    if (currentTurnNewKings)
        currentTurnNewKings.forEach((king) => king.isKing = false)
    gameState.picesInDanger = []
    for (let originPointer = new BoardPointer(board); !originPointer.isFinish; originPointer.moveSquare()) {
        let pieceTryTake = originPointer.getSquare().pieceOn;
        if (!pieceTryTake)
            continue;
        let possibleTakeColumnLeft = originPointer.column - 1;
        let possibleTakeColumnRight = originPointer.column + 1;
        let possibleTakeRow = originPointer.row + 1 * pieceTryTake.getMovmentFactor
        if (legalMove(board, originPointer.getLocation(),{ row: possibleTakeRow + 1 * pieceTryTake.getMovmentFactor, column: possibleTakeColumnLeft - 1 })&&board[possibleTakeRow][possibleTakeColumnLeft].pieceOn
           )//left)
        {
            gameState.picesInDanger.push(board[possibleTakeRow][possibleTakeColumnLeft].pieceOn)
        }
        else if (legalMove(board, originPointer.getLocation()
        ,{ row: possibleTakeRow + 1 * pieceTryTake.getMovmentFactor, column: possibleTakeColumnRight + 1 })&&board[possibleTakeRow][possibleTakeColumnRight].pieceOn)//right)
        {
            gameState.picesInDanger.push(board[possibleTakeRow][possibleTakeColumnRight].pieceOn)   
        } 
    }
    if (currentTurnNewKings)
        currentTurnNewKings.forEach((king) => king.isKing = true)
}
function updateAllPicesCanNotMove(board) {
    for (let pointer = new BoardPointer(board);!pointer.isFinish;pointer.moveSquare()) {
        {
            let pieceToUpdate=pointer.getSquare().pieceOn
            if(pieceToUpdate)
            pieceToUpdate.canStartMovment = false;
                
            }
        }
    }

function startMovment(startMovmentPoint)
{
    gameState.startMovmentPoint = startMovmentPoint
    updatepossibleSquaresToMove(gameState.board, gameState.startMovmentPoint);
    updateBoardUi(gameState.board);
}
function endMovment(targetlocation) {
    if (gameState.startMovmentPoint === {})
        return
    let isCapturePiece = false;
    let targetSquare = gameState.board[targetlocation.row][targetlocation.column]
    let originSquare = gameState.board[gameState.startMovmentPoint.row][gameState.startMovmentPoint.column];
    if (targetSquare && targetSquare.isPossibleEndMovment) {
        if (Math.abs(targetlocation.row - gameState.startMovmentPoint.row) >= 2) {
            isCapturePiece= handleCapture(targetlocation)
        }
        if (originSquare.pieceOn&&((originSquare.pieceOn.color == GRAY && targetlocation.row == 0)
            || originSquare.pieceOn.color == RED && targetlocation.row == 7)) {
            CrownPiece(originSquare.pieceOn)
        }
        gameState.boardHistory.push(getBoardString(gameState.board))
        targetSquare.pieceOn = originSquare.pieceOn;
        originSquare.pieceOn = null;
        afterMovmentChecks(targetlocation,isCapturePiece)
      
    }
}
function PassTurn() {
    gameState.CurrentColorTurn = (gameState.CurrentColorTurn == RED ? GRAY : RED)
            updatePicesCanMove(gameState.board)
            updateAllSquaresNotPossibleMove(gameState.board)
    updateBoardUi(gameState.board)
    currentTurnNewKings = []
    gameState.startMovmentPoint = {}
}
function afterMovmentChecks(loactionMoveTo,isCapturePiece)
{
    if (isWin(gameState.board))
    {
        showRestartPrompt(gameState.CurrentColorTurn +"won")
        return;
    }
   
    updatepossibleSquaresToMove(gameState.board)
    UpdatePicesInDanger(gameState.board,currentTurnNewKings);
    if (!isInAreaPieceIndanger(gameState.board,loactionMoveTo)||!isCapturePiece) {
        handleDraw(gameState.board[loactionMoveTo.row][loactionMoveTo.column])
        
        PassTurn();
    }
    else
        updateBoardUi(gameState.board);
}
function isInAreaPieceIndanger(board, currentLocation) {
    UpdatePicesInDanger(board, currentTurnNewKings)
    let startRow = currentLocation.row - 1 < 0 ? 0 : currentLocation.row - 1;
    let endRow = (currentLocation.row + 1 >= board.length) ? board.length - 1 : currentLocation.row + 1;
    let startColumn = currentLocation.column - 1 < 0 ? 0 : currentLocation.column - 1;
    let endColumn = (currentLocation.column + 1 >= board.length) ? board.length - 1 : currentLocation.column + 1;
    for (let pointer = new BoardPointer(board, startRow, endRow, startColumn, endColumn); !pointer.isFinish; pointer.moveSquare()) {
        if (gameState.picesInDanger.some((piece) => piece.equals(pointer.getSquare().pieceOn)))
            return true;
    }
    return false;

}
function handleCapture(targetlocation)
{
    let takeColumn = targetlocation.column - (targetlocation.column > gameState.startMovmentPoint.column?1:-1);
    let takeRow = targetlocation.row -(gameState.startMovmentPoint.row < targetlocation.row ? 1 : -1)
     if (gameState.board[takeRow][takeColumn].pieceOn) {
        gameState.board[takeRow][takeColumn].pieceOn = null
         gameState.roundsOnlyKingsMoveAndNoneTakenPiece = 0;
         gameState.boardHistory=[]//after take a piece will the state until no will not repeat
         return true;
    }
    return false;
}
function handleDraw(targetSquare) {
    if (targetSquare.pieceOn && targetSquare.pieceOn.isKing )
        gameState.roundsOnlyKingsMoveAndNoneTakenPiece++
    else
        gameState.roundsOnlyKingsMoveAndNoneTakenPiece = 0;
    let lastBordHistory=gameState.boardHistory[gameState.boardHistory.length-1]
    if (gameState.boardHistory.filter((board) => board === lastBordHistory ).length === 3
        || gameState.roundsOnlyKingsMoveAndNoneTakenPiece === 20) {
        showRestartPrompt("it's a draw")
        return true;
    }
    return false;
}
function CrownPiece(piece) {
    piece.isKing = true;
    currentTurnNewKings.push(piece)
}
function updateAllSquaresNotPossibleMove(board) {
    for (let pointer = new BoardPointer(board);!pointer.isFinish;pointer.moveSquare()) {
            {
                pointer.getSquare().isPossibleEndMovment = false;
            }
        }
    }

function legalMove(board, originLocation, targetLocation) {
    if (!originLocation || !targetLocation)
        return false;
    let pieceMoving = board[originLocation.row][originLocation.column].pieceOn;
 
    if (!pieceMoving || targetLocation.row < 0 || targetLocation.row >= board.length || targetLocation.column < 0 || targetLocation.column >= board[targetLocation.row].length
    ||pieceMoving.color!==gameState.CurrentColorTurn|| board[targetLocation.row][targetLocation.column].pieceOn)
        return false;
       
    if (pieceMoving.isKing)
        return isLegalKingMove(board, originLocation, targetLocation)
        
    if ((pieceMoving.color == GRAY && originLocation.row < targetLocation.row)
        ||(pieceMoving.color==RED&&originLocation.row > targetLocation.row))
        return false;
    let isRegularMove=!gameState.picesInDanger.some((piece) => { return piece.color !== pieceMoving.color })
                        && originLocation.row + 1 * pieceMoving.getMovmentFactor == targetLocation.row
                        && Math.abs(originLocation.column - targetLocation.column) == 1
    return (isRegularMove||isLegalCaptureMove(board,originLocation,targetLocation))
}
function isLegalCaptureMove(board, originLocation, targetLocation)
{
    if (!board[originLocation.row][originLocation.column].pieceOn)
        return false
    let pieceMoving = board[originLocation.row][originLocation.column].pieceOn;
    if (Math.abs(originLocation.row - targetLocation.row) === 2)//eat move
    {
        let rightLeftFactor = (targetLocation.column - originLocation.column) / 2
        if ((rightLeftFactor != -1 && rightLeftFactor != 1) || (originLocation.column + rightLeftFactor < 0 || originLocation.column + rightLeftFactor >= board.length))
            return false;
        let eatSquare = board[originLocation.row + pieceMoving.getMovmentFactor][originLocation.column + rightLeftFactor]
        
        return (eatSquare.pieceOn && eatSquare.pieceOn.color != pieceMoving.color)
       
    }
    return false;
}
function isLegalKingMove(board, originLocation, targetLocation) {
    if (!board[originLocation.row][originLocation.column].pieceOn
        || !board[originLocation.row][originLocation.column].pieceOn.isKing)
        return false;
    if (originLocation.row - originLocation.column != targetLocation.row - targetLocation.column
        && originLocation.row + originLocation.column != targetLocation.row + targetLocation.column)
        return false;
    let isPathLegal=isLegalKingPath(board,originLocation,targetLocation)
    if (!isPathLegal.value)
        return false;
    if (isPathLegal.eatPieceOnLoction)
        return true
   
    if (isInAreaPieceIndanger(board,targetLocation)||gameState.picesInDanger.length>0)//no capture move
        return false   
    else
        return true
}
function isLegalKingPath(board,originLocation,targetLocation)
{
    if (board[targetLocation.row][targetLocation.column].pieceOn)
        return { value: false }
    if (targetLocation.row - targetLocation.column !== originLocation.row - originLocation.column &&
        targetLocation.row + targetLocation.column !== originLocation.row + originLocation.column)
        return { value: false }

    let columnFactor = originLocation.column > targetLocation.column ? -1 : 1;
    let rowFactor = originLocation.row < targetLocation.row ? 1 : -1;
    let numberOfRowsCheck = Math.abs(originLocation.row - targetLocation.row)
    let numberOfColumnCheck = Math.abs(originLocation.column - targetLocation.column)
    for (let rowOffset = 1, columnOffset = 1;columnOffset <= numberOfColumnCheck&& rowOffset <= numberOfRowsCheck;columnOffset++, rowOffset++) {
            let rowToCheck = originLocation.row + rowOffset * rowFactor;
        let colToCheck = originLocation.column + columnOffset * columnFactor;
        if (board[rowToCheck][colToCheck].pieceOn &&board[rowToCheck][colToCheck].pieceOn.color === gameState.CurrentColorTurn)
            return {value:false}
            if (board[rowToCheck][colToCheck].pieceOn) {
                 if(rowToCheck+rowFactor==targetLocation.row&&colToCheck+columnFactor==targetLocation.column&&board[rowToCheck][colToCheck].pieceOn.color!=gameState.CurrentColorTurn)
                     return { value: true, eatPieceOnLoction: { row: rowToCheck, column: colToCheck } };
                  else return {value:false} 
            }
    }
    return {value:true}
}
function isKingThreates(board, kingLocation)
{
    for (let pointer = new BoardPointer(board); !pointer.isFinish;pointer.moveSquare()) {
            if (isLegalKingPath(board,kingLocation,pointer.getLocation()).eatPieceOnLoction)
                return true;
    }
    return false;
    }//not using function
function isWin(board)
{
    gameState.CurrentColorTurn = gameState.CurrentColorTurn == RED ? GRAY : RED;
    updatePicesCanMove(board);
    let result = true;
    for (let pointer = new BoardPointer(board); !pointer.isFinish;pointer.moveSquare()){
            let pieceOnSquare = pointer.getSquare().pieceOn
            if (pieceOnSquare && pieceOnSquare.color === gameState.CurrentColorTurn && pieceOnSquare.canStartMovment)
                result= false;
    }
    gameState.CurrentColorTurn = gameState.CurrentColorTurn == RED ? GRAY : RED;
    updatePicesCanMove(board);
    return result;
    }




