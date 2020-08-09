class Square {
    constructor(piece, row, column) {
        this.position = { row, column };
        this.pieceOn = piece;
        this.isPossibleEndMovment = false;
   
    }
    getClassNameByState  () {
        let className = "square ";
            className += this.isPossibleEndMovment ? "endEnable" : "";
        return className
    } 
}