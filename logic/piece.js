function Piece(color,id) {
        
        //this.position = { row, column }
        this.color = color;
        this.canStartMovment = false;
        this.getMovmentFactor = color == DraughtsGameLogic.piecesColor.GRAY ? -1 : 1;
        this.id = id;
        this.isKing = false;
        this.selected = false;
}

Piece.prototype.getClassName = function () {
    return `${this.isKing ? "King " : ""} piece ${this.color} ${this.canStartMovment ? "startEnable" : ""} ${this.selected ? "selected" : ""}`;
}
Piece.prototype.equals = function (other) {
    if (!other)
        return false;
    return this.id === other.id
}
