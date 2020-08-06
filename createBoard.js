let board = document.getElementsByClassName("board")[0]
let piecesCount = 0;
for(let row=1;row<=8;row++)
{
 for(let column=1;column<=8;column++)
 {
     let square = document.createElement("div");
   
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
     square.style.gridRow=`${row}/${row+1}`
     square.style.gridColumn=`${column}/${column}`
     board.appendChild(square);
   
    
    
 }
}