class Piece {
    constructor(row, column, color,id) {
        this.position = { row, column }
        this.color = color;
        this.canStartMovment = false;
        this.getMovmentFactor = color == GRAY ? -1 : 1;
        this.id = id;
        this.isKing = false;
        this.selected = false;
    }
    getClassName() {
        return `${this.isKing?"King ":""} piece ${this.color} ${this.canStartMovment ? "startEnable" : ""} ${this.selected?"selected":""}`;
    }
    equals(other)
    {
        if (!other)
            return false;
        return this.id===other.id
    }
}