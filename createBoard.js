let board = document.getElementsByClassName("board")[0]
let piecesCount = 0;
for(let row=1;row<=8;row++)
{
 for(let column=1;column<=8;column++)
 {
     let square = document.createElement("div");
     let piece = document.createElement("span");
     if ((row + column) % 2 != 0) {
         if (row <= 3)
             piece.color = "red"
         if (row >= 6)
             piece.color = "grey"
         piece.setAttribute("id", `${piecesCount}`)
         piece.setAttribute("draggable","true")
         piecesCount++;
     }
     if(row%2==0){
     if(column%2==0)
      square.color="white" 
       else
       square.color="black"
     }
     else
     {
       if(column%2==0)
      square.color="black" 
       else
       square.color="white"
     }
     square.setAttribute("class", "square " + square.color);
     if (piece.color) {
         piece.setAttribute("class", "piece " + piece.color)
     
         piece.style.gridRow = `${row}/${row + 1}`
         piece.style.gridColumn = `${column}/${column}`
         board.appendChild(piece)
     }
     square.style.gridRow=`${row}/${row+1}`
     square.style.gridColumn=`${column}/${column}`
     board.appendChild(square);
    
 }
}