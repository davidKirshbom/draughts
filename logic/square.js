class Square {
    constructor(piece, row, column) {
        this.position = { row, column };
        this.pieceOn = piece;
        this.isPossibleEndMovment = false;
   
    }
   
}
Square.prototype.getClassNameByState=function () {
    let className = "square ";
        className += this.isPossibleEndMovment ? "endEnable" : "";
    return className
} 