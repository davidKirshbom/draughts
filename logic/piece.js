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
    equals(other)
    {
        if (!other)
            return false;
        return this.id===other.id
    }
}