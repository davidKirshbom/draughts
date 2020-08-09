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
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            {
                board[row][column].isPossibleEndMovment = legalMove(board, startMovmentPoint, { row, column });
            }
    
        }
    }
}
function updatePicesCanMove(board) {
    UpdatePicesInDanger(board)
    updateAllPicesCanNotMove(board)
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
function UpdatePicesInDanger(board,currentTurnNewKings)
{
    if(currentTurnNewKings)
    currentTurnNewKings.forEach((king) => king.isKing = false)
    gameState.picesInDanger=[]
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
                gameState.picesInDanger.push(board[possibleTakeRow][possibleTakeColumnLeft].pieceOn)
            }
            else if(board[possibleTakeRow]&&board[possibleTakeRow][possibleTakeColumnRight]&&board[possibleTakeRow][possibleTakeColumnRight].pieceOn
                && legalMove(board, { row: originRow, column: originColumn }
                                  , { row: possibleTakeRow + 1 * pieceTryTake.getMovmentFactor, column: possibleTakeColumnRight + 1 }))//right)
            {
                gameState.picesInDanger.push(board[possibleTakeRow][possibleTakeColumnRight].pieceOn)
              
                }
     
         
        } 
    }
    if(currentTurnNewKings)
    currentTurnNewKings.forEach((king) => king.isKing = true)
}
function updateAllPicesCanNotMove(board) {
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            {
            if(board[row][column].pieceOn)
                board[row][column].pieceOn.canStartMovment = false;
                
            }
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
    if (!gameState.startMovmentPoint)
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
function isInAreaPieceIndanger(board,currentLocation)
{
    
    UpdatePicesInDanger(board,currentTurnNewKings)
    let startRow = currentLocation.row - 1 < 0 ? 0 : currentLocation.row - 1;
    let endRow = (currentLocation.row + 1 >= board.length )? board.length - 1 : currentLocation.row + 1;
    let startColumn = currentLocation.column - 1 < 0 ? 0 : currentLocation.column - 1;
    let endColumn = (currentLocation.column + 1 >= board.length )? board.length-1 : currentLocation.column + 1;
    for (let row = startRow;row <= endRow; row++)
        for (let column = startColumn; column <= endColumn; column++)
        {
            if (gameState.picesInDanger.some((piece) => piece.equals(board[row][column].pieceOn)))
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
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            {
            
                board[row][column].isPossibleEndMovment = false;
                
            }
    
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
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            if (isLegalKingPath(board,kingLocation,{row,column}).eatPieceOnLoction)
                return true;
        }
    }
    return false;
}
function isWin(board)
{
    
    gameState.CurrentColorTurn = gameState.CurrentColorTurn == RED ? GRAY : RED;
    updatePicesCanMove(board);
    let result = true;
   
    for (let row = 0; row < board.length; row++) {
        for (let column = 0; column < board[row].length; column++) {
            let pieceOnSquare = board[row][column].pieceOn
           
               //console.log(pieceOnSquare)
            if (pieceOnSquare && pieceOnSquare.color === gameState.CurrentColorTurn && pieceOnSquare.canStartMovment)
                result= false;
        }
    }
    gameState.CurrentColorTurn = gameState.CurrentColorTurn == RED ? GRAY : RED;
    
    updatePicesCanMove(board);
    return result;
} 




