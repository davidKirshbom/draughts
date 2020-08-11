const RED = "red";
const GRAY = "gray";
class draughtsGameLogic {
    constructor(updateUiFunc) {
        this.currentTurnNewKings = []
        this.updateBoardUi=updateUiFunc,
        this.gameState = {
            CurrentColorTurn: RED,
            board: [],
            picesInDanger: [],
            roundsOnlyKingsMoveAndNonecapturedPiece: 0,
            boardHistory: [],
            startMovmentPoint: {},
            restart: function (board) {
                this.CurrentColorTurn = RED
                this.board=board ,
                this.picesInDanger = []
                this.roundsOnlyKingsMoveAndNonecapturedPiece = 0
                this.boardHistory = []
                this.startMovmentPoint = {}
       
            }
        }
    }

}
    
BoardPointer=function(board, beginRow = 0, endRow = board.length - 1, beginColumn = 0, endColumn = board.length - 1) {
    let startRow = beginRow;
    let startColumn = beginColumn;
    this.row = startRow;
    this.endRow = endRow;
    this.column = startColumn;
    this.endColumn = endColumn;
    this.isFinish = false;
    this.getLocation = () => { return { row: this.row, column: this.column } }
    this.getSquare = function () {
        return board[this.row][this.column];
    }
    this.moveSquare = function () {
        if (this.column + 1 > this.endColumn) {
            this.column = startColumn;
            if (this.row + 1 > this.endRow) {
                
                this.row = startRow;
            }
            else this.row++;
        }
        else this.column++
        this.isFinish = this.row == startRow && this.column == startColumn
    }
    
}
draughtsGameLogic.prototype.generateStartBoard=function(){
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
    this.updatePicesCanMove(board)
    return board;
}
draughtsGameLogic.prototype.restartGame=function(){
    this.gameState.restart(this.generateStartBoard());
    this.updateBoardUi(this.gameState.board);
}
draughtsGameLogic.prototype.getBoardString=function(board) {
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
draughtsGameLogic.prototype.updatepossibleSquaresToMove=function(board, startMovmentPoint) {
    for (let pointer = new BoardPointer(this.gameState.board); !pointer.isFinish;pointer.moveSquare()) {
        {
                pointer.getSquare().isPossibleEndMovment = this.legalMove(board, startMovmentPoint, pointer.getLocation());
            }
    }
}
draughtsGameLogic.prototype.updatePicesCanMove=function(board) {
    this.UpdatePicesInDanger(board)
    this.updateAllPicesCanNotMove(board)
    for (let originPointer = new BoardPointer(board); !originPointer.isFinish; originPointer.moveSquare()) {
        if (!originPointer.getSquare().pieceOn)
            continue;
        for (let targetPointer = new BoardPointer(board); !targetPointer.isFinish; targetPointer.moveSquare()) {
            if (this.legalMove(board, originPointer.getLocation(), targetPointer.getLocation())) {

                board[originPointer.row][originPointer.column].pieceOn.canStartMovment = true;
            }
        }
    }    
}

draughtsGameLogic.prototype.UpdatePicesInDanger=function(board, currentTurnNewKings) {
    if (currentTurnNewKings)
        currentTurnNewKings.forEach((king) => king.isKing = false)
    this.gameState.picesInDanger = []
    for (let originPointer = new BoardPointer(board); !originPointer.isFinish; originPointer.moveSquare()) {
        let pieceTryCapture = originPointer.getSquare().pieceOn;
        if (!pieceTryCapture)
            continue;
        let possibleCaptureColumnLeft = originPointer.column - 1;
        let possibleCaptureColumnRight = originPointer.column + 1;
        let possibleCaptureRow = originPointer.row + 1 * pieceTryCapture.getMovmentFactor
        if (pieceTryCapture.isKing) {
            let possibleCaptureKingsRow = originPointer.row + 1 * (- pieceTryCapture.getMovmentFactor)
            if (this.legalMove(board, originPointer.getLocation(), { row: possibleCaptureKingsRow + 1 * (-pieceTryCapture.getMovmentFactor), column: possibleCaptureColumnLeft - 1 }) && board[possibleCaptureKingsRow][possibleCaptureColumnLeft].pieceOn)//left)
            {
                this.gameState.picesInDanger.push(board[possibleCaptureKingsRow][possibleCaptureColumnLeft].pieceOn)
            }
            else if (this.legalMove(board, originPointer.getLocation()
                , { row: possibleCaptureKingsRow + 1 * (-pieceTryCapture.getMovmentFactor), column: possibleCaptureColumnRight + 1 }) && board[possibleCaptureKingsRow][possibleCaptureColumnRight].pieceOn)//right)
            {
                this.gameState.picesInDanger.push(board[possibleCaptureKingsRow][possibleCaptureColumnRight].pieceOn)
            }
           
        }
        let originLocation=originPointer.getLocation()
        if (this.legalMove(board, originPointer.getLocation(), { row: possibleCaptureRow + 1 * pieceTryCapture.getMovmentFactor, column: possibleCaptureColumnLeft - 1 }) && board[possibleCaptureRow][possibleCaptureColumnLeft].pieceOn
        )//left)
        {
            this.gameState.picesInDanger.push(board[possibleCaptureRow][possibleCaptureColumnLeft].pieceOn)
        }
        else if (this.legalMove(board, originLocation
            , { row: possibleCaptureRow + 1 * pieceTryCapture.getMovmentFactor, column: possibleCaptureColumnRight + 1 }) && board[possibleCaptureRow][possibleCaptureColumnRight].pieceOn)//right)
        {
            this.gameState.picesInDanger.push(board[possibleCaptureRow][possibleCaptureColumnRight].pieceOn)
        }
    }
    if (currentTurnNewKings)
        currentTurnNewKings.forEach((king) => king.isKing = true)
}
draughtsGameLogic.prototype.updateAllPicesCanNotMove=function(board,...piecesIdNotUpdate) {
    for (let pointer = new BoardPointer(board);!pointer.isFinish;pointer.moveSquare()) {
        {
            let pieceToUpdate=pointer.getSquare().pieceOn
            if (pieceToUpdate && (piecesIdNotUpdate.length === 0 || !piecesIdNotUpdate.some((pieceId) => pieceId === pieceToUpdate.id)))
                pieceToUpdate.canStartMovment = false;
                
            }
        }
    }

draughtsGameLogic.prototype.startMovment=function(startMovmentPoint)//uses directly game state
{
    
    if (this.gameState.startMovmentPoint.row && this.gameState.startMovmentPoint.row) {
        let lastPieceSelected = this.gameState.board[this.gameState.startMovmentPoint.row][this.gameState.startMovmentPoint.column].pieceOn
        if(lastPieceSelected&&lastPieceSelected.color===this.gameState.CurrentColorTurn)
        lastPieceSelected.selected = false
       
    }
    this.gameState.startMovmentPoint = startMovmentPoint
    this.gameState.board[startMovmentPoint.row][startMovmentPoint.column].pieceOn.selected = true;
    this.updatepossibleSquaresToMove(this.gameState.board, this.gameState.startMovmentPoint);
    this.updateBoardUi(this.gameState.board);
}
draughtsGameLogic.prototype.endMovment=function(targetlocation) {//uses directly game state
    if (!this.gameState.startMovmentPoint.row||this.gameState.startMovmentPoint === {})
        return
    let CapturePieceInfo = {
        madeCapture: false, pieceMadeCapture: {}
    }
    let targetSquare = this.gameState.board[targetlocation.row][targetlocation.column]
    let originSquare = this.gameState.board[this.gameState.startMovmentPoint.row][this.gameState.startMovmentPoint.column];
    if (targetSquare && targetSquare.isPossibleEndMovment) {
        if (Math.abs(targetlocation.row - this.gameState.startMovmentPoint.row) >= 2) {
            let isCapturePiece = this.handleCapture(targetlocation);
            CapturePieceInfo={madeCapture:isCapturePiece, pieceMadeCapture:originSquare.pieceOn}
        }
        if (originSquare.pieceOn&&((originSquare.pieceOn.color == GRAY && targetlocation.row == 0)
            || originSquare.pieceOn.color == RED && targetlocation.row == 7)) {
            this.CrownPiece(originSquare.pieceOn)
        }
        this.gameState.boardHistory.push(this.getBoardString(this.gameState.board))
        targetSquare.pieceOn = originSquare.pieceOn;
        originSquare.pieceOn = null;
        this.afterMovmentChecks(targetlocation,CapturePieceInfo)
      
    }
}
draughtsGameLogic.prototype.PassTurn=function() {//uses directly game state
    this.gameState.CurrentColorTurn = (this.gameState.CurrentColorTurn == RED ? GRAY : RED)
    this.updatePicesCanMove(this.gameState.board)
    this.updateAllSquaresNotPossibleMove(this.gameState.board)
    this.updateBoardUi(this.gameState.board)
    this.currentTurnNewKings = []
    
    this.gameState.startMovmentPoint = {}
}
draughtsGameLogic.prototype.afterMovmentChecks=function(loactionMoveTo,captureInfo)
{//uses directly game state
    if (this.isWin(this.gameState.board))
    {
        showRestartPrompt(this.gameState.CurrentColorTurn[0].toUpperCase()+this.gameState.CurrentColorTurn.slice(1) +" won")
        return;
    }
    this.updatepossibleSquaresToMove(this.gameState.board)
    this.UpdatePicesInDanger(this.gameState.board,this.currentTurnNewKings);
    if (!this.isInAreaPieceIndanger(this.gameState.board, loactionMoveTo) || !captureInfo.madeCapture) {
        this.handleDraw(this.gameState.board[loactionMoveTo.row][loactionMoveTo.column])
        this.PassTurn();
    }
    else {//line capture
        this.gameState.startMovmentPoint=loactionMoveTo
        captureInfo.pieceMadeCapture.selected = true;
        this.startMovment(loactionMoveTo)
    }
}
draughtsGameLogic.prototype.isInAreaPieceIndanger=function(board, currentLocation) {
    
    let startRow = currentLocation.row - 1 < 0 ? 0 : currentLocation.row - 1;
    let endRow = (currentLocation.row + 1 >= board.length) ? board.length - 1 : currentLocation.row + 1;
    let startColumn = currentLocation.column - 1 < 0 ? 0 : currentLocation.column - 1;
    let endColumn = (currentLocation.column + 1 >= board.length) ? board.length - 1 : currentLocation.column + 1;
    for (let pointer = new BoardPointer(board, startRow, endRow, startColumn, endColumn); !pointer.isFinish; pointer.moveSquare()) {
        if (this.gameState.picesInDanger.some((piece) => piece.equals(pointer.getSquare().pieceOn)))
            return true;
    }
    return false;

}
draughtsGameLogic.prototype.handleCapture=function(targetlocation)
{
    let captureColumn = targetlocation.column - (targetlocation.column > this.gameState.startMovmentPoint.column?1:-1);
    let captureRow = targetlocation.row -(this.gameState.startMovmentPoint.row < targetlocation.row ? 1 : -1)
     if (this.gameState.board[captureRow][captureColumn].pieceOn) {
        this.gameState.board[captureRow][captureColumn].pieceOn = null
         this.gameState.roundsOnlyKingsMoveAndNonecapturedPiece = 0;
         this.gameState.boardHistory=[]//after capture a piece  the history will not back
         return true;
    }
    return false;
}
draughtsGameLogic.prototype.handleDraw=function(targetSquare) {
    if (targetSquare.pieceOn && targetSquare.pieceOn.isKing )
        this.gameState.roundsOnlyKingsMoveAndNonecapturedPiece++
    else
        this.gameState.roundsOnlyKingsMoveAndNonecapturedPiece = 0;
    let lastBordHistory=this.gameState.boardHistory[this.gameState.boardHistory.length-1]
    if (this.gameState.boardHistory.filter((board) => board === lastBordHistory ).length === 3
        || this.gameState.roundsOnlyKingsMoveAndNonecapturedPiece === 20) {
            this.showRestartPrompt("It's a draw")
        return true;
    }
    return false;
}
draughtsGameLogic.prototype.CrownPiece=function(piece) {
    piece.isKing = true;
    this.currentTurnNewKings.push(piece)
}
draughtsGameLogic.prototype.updateAllSquaresNotPossibleMove=function(board) {
    for (let pointer = new BoardPointer(board);!pointer.isFinish;pointer.moveSquare()) {
            {
                pointer.getSquare().isPossibleEndMovment = false;
            }
        }
}
draughtsGameLogic.prototype.legalMove=function(board, originLocation, targetLocation) {
    if (!originLocation || !targetLocation)
        return false;
    let pieceMoving = board[originLocation.row][originLocation.column].pieceOn;
 
    if (!pieceMoving || targetLocation.row < 0 || targetLocation.row >= board.length || targetLocation.column < 0 || targetLocation.column >= board[targetLocation.row].length
    ||pieceMoving.color!==this.gameState.CurrentColorTurn|| board[targetLocation.row][targetLocation.column].pieceOn)
        return false;
       
    if (pieceMoving.isKing)
        return this.isLegalKingMove(board, originLocation, targetLocation)
        
    if ((pieceMoving.color == GRAY && originLocation.row < targetLocation.row)
        ||(pieceMoving.color==RED&&originLocation.row > targetLocation.row))
        return false;
    let isRegularMove=!this.gameState.picesInDanger.some((piece) => { return piece.color !== pieceMoving.color })
                        && originLocation.row + 1 * pieceMoving.getMovmentFactor == targetLocation.row
                        && Math.abs(originLocation.column - targetLocation.column) == 1
    return (isRegularMove||this.isLegalCaptureMove(board,originLocation,targetLocation))
}
draughtsGameLogic.prototype.isLegalCaptureMove=function(board, originLocation, targetLocation)
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
draughtsGameLogic.prototype.isLegalKingMove=function(board, originLocation, targetLocation) {
    if (!board[originLocation.row][originLocation.column].pieceOn
        || !board[originLocation.row][originLocation.column].pieceOn.isKing)
        return false;
    if (originLocation.row - originLocation.column != targetLocation.row - targetLocation.column
        && originLocation.row + originLocation.column != targetLocation.row + targetLocation.column)
        return false;
    let isPathLegal=this.isLegalKingPath(board,originLocation,targetLocation)
    if (!isPathLegal.value)
        return false;
    if (isPathLegal.eatPieceOnLoction)
        return true
   
    if (this.isInAreaPieceIndanger(board,targetLocation)||this.gameState.picesInDanger.length>0)//no capture move
        return false   
    else
        return true
}
draughtsGameLogic.prototype.isLegalKingPath=function(board,originLocation,targetLocation)
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
        if (board[rowToCheck][colToCheck].pieceOn &&board[rowToCheck][colToCheck].pieceOn.color === this.gameState.CurrentColorTurn)
            return {value:false}
            if (board[rowToCheck][colToCheck].pieceOn) {
                 if(rowToCheck+rowFactor==targetLocation.row&&colToCheck+columnFactor==targetLocation.column&&board[rowToCheck][colToCheck].pieceOn.color!=this.gameState.CurrentColorTurn)
                     return { value: true, eatPieceOnLoction: { row: rowToCheck, column: colToCheck } };
                  else return {value:false} 
            }
    }
    return {value:true}
}
draughtsGameLogic.prototype.isWin = function (board) {
    this.gameState.CurrentColorTurn = this.gameState.CurrentColorTurn == RED ? GRAY : RED;
    this.updatePicesCanMove(board);
    let result = true;
    for (let pointer = new BoardPointer(board); !pointer.isFinish; pointer.moveSquare()) {
        let pieceOnSquare = pointer.getSquare().pieceOn
        if (pieceOnSquare && pieceOnSquare.color === this.gameState.CurrentColorTurn && pieceOnSquare.canStartMovment)
            result = false;
    }
    this.gameState.CurrentColorTurn = this.gameState.CurrentColorTurn == RED ? GRAY : RED;
    this.updatePicesCanMove(board);
    return result;
}




