// HW 03
// By Irving Fenochio
// CS375
// 14 January 2022




// Create functions that check a cells surrounding neighbors
// Reuse of functions from Exercise 1b
function dimensions(data){
    let rows = 0;
    let cols = 0;

    if (data.length == 0){
        return [rows,cols]
    }
    else{
        rows = data.length;
        r0 = data[0];
        cols = r0.length;
        return [rows,cols]
    }
};

function isUpperLeftValid(data, r, c){
    if(data.length == 0){
        return false;
    }
    else{
        let dims = dimensions(data);
         if((r-1) < 0 || (c-1) < 0){
             return false;
         }
         else return true;
    }
};

function isBottomRightValid(data, r, c){
    if(data.length == 0){
        return false;
    }
    else{
        let dims = dimensions(data);
         if((r+1) > (dims[0]-1) || (c+1) > (dims[1]-1)){
             return false;
         }
         else return true;
    }
};

function isUpperRightValid(data, r, c){
    if(data.length == 0){
        return false;
    }
    else{
        let dims = dimensions(data);
         if((r-1) < 0 || (c+1) > (dims[1]-1)){
             return false;
         }
         else return true;
    }
};

function isBottomLeftValid(data, r, c){
    if(data.length == 0){
        return false;
    }
    else{
        let dims = dimensions(data);
         if((r+1) > (dims[0]-1) || (c-1) < 0){
             return false;
         }
         else return true;
    }
};

function isUpValid(data, r){
    if(data.length == 0)
        {return false}
    else{
        if ((r-1) < 0){
            return false
        } 
        else return true
    }
}

function isLeftValid(data, c){
    if(data.length == 0)
        {return false}
    else{
        if ((c-1) < 0){
            return false
        } 
        else return true
    }
}

function isDownValid(data, r){
    if(data.length == 0)
        {return false}
    else{
        let dims = dimensions(data);
        if ((r+1) > dims[0]-1){
            return false
        } 
        else return true
    }
}

function isRightValid(data, c){
    if(data.length == 0)
        {return false}
    else{
        let dims = dimensions(data);
        if ((c+1) > dims[1]-1){
            return false
        } 
        else return true
    }
}

// Main stepboard function
function stepBoard (arr2d){
    // Give error for empty board
    if (arr2d.length == 0){return[];}

    // Get board dimensions
    let dims = dimensions(arr2d);

    // begin loop through all board cells
    let i, j , liveNeighbors;
    let updatedBoard = [];
    for (i = 0; i < dims[0]; i++){
        updatedBoard.push([])

        for (j = 0; j < dims[1]; j++){
            // For each possible neighbor check if valid
            // If valid log if alive or dead
                // Push new cell to new board in each row for col cell
            liveNeighbors = 0;

            // Test Up
            if (isUpValid(arr2d,i)){
                if(arr2d[i-1][j] == true){
                    liveNeighbors += 1;
                }
            }

            // Test Down
            if (isDownValid(arr2d,i)){
                if(arr2d[i+1][j] == true){
                    liveNeighbors += 1;
                }
            }

            // Test Left
            if (isLeftValid(arr2d,j)){
                if(arr2d[i][j-1] == true){
                    liveNeighbors += 1;
                }
            }

            // Test Right
            if (isRightValid(arr2d,j)){
                if(arr2d[i][j+1] == true){
                    liveNeighbors += 1;
                }
            }

            // START TESTING DIAGONALS
            // Test Up Right
            if (isUpperRightValid(arr2d,i,j)){
                if(arr2d[i-1][j+1] == true){
                    liveNeighbors += 1;
                }
            }
            
            // Test Up Left
            if (isUpperLeftValid(arr2d,i,j)){
                if(arr2d[i-1][j-1] == true){
                    liveNeighbors += 1;
                }
            }

            // Test Down Left
            if (isBottomLeftValid(arr2d,i,j)){
                if(arr2d[i+1][j-1] == true){
                    liveNeighbors += 1;
                }  
            }

            // Test Down Right
            if (isBottomRightValid(arr2d,i,j)){
                if(arr2d[i+1][j+1] == true){
                    liveNeighbors += 1;
                }
            }


            // Apply game rules
            if(arr2d[i][j] == false){
                if(liveNeighbors == 3){
                    // Push live cell
                    updatedBoard[i].push(true);
                } else {
                    // Push dead cell
                    updatedBoard[i].push(false);
                }
            }else{
                if(liveNeighbors == 2 || liveNeighbors == 3){
                    // Push live cell
                    updatedBoard[i].push(true);
                }else {
                    // push dead cell
                    updatedBoard[i].push(false);
                }
            }
        }
    }
    return updatedBoard
}

// Creates a default board
function defaultBoard(){
    let board = [];
    let state = true;
    let i, j;
    for (i = 0; i < 25; i++){
        let row = [];
        for (j = 0; j < 25; j++){
            if(state){
                row.push(true);
                state = false;
            }else{
                row.push(false);
                state= true;
            }
        }
        board.push(row);
    }
    return board;
}

// Creates a randomly filled board
function randomBoard(){
    let board = [];
    let i, j, c;
    for (i = 0; i < 25; i++){
        let row = [];
        for (j = 0; j < 25; j++){
            c = Math.random();

            if(c >= 0.51){
                row.push(true);
            }else{
                row.push(false);
            }
        }
        board.push(row);
    }
    return board;
}

// Creates an empty board
function emptyBoard(){
    let board = [];
    let i, j;
    for (i = 0; i < 25; i++){
        let row = [];
        for (j = 0; j < 25; j++){
            row.push(false);
        }
        board.push(row);
    }
    return board;
}

// Draw a board from 2d array of bools based of Exercise 2b	

function drawBoard(arr2d) {
    if (arr2d.length === 0) return 1;

    let numGrid = document.getElementById("gameBoard");
    let tNode = document.createElement("table");

    numGrid.appendChild(tNode);

    for (let i = 0; i < arr2d.length; i++) {
        let trNode = document.createElement("tr");
        for (let j = 0; j < arr2d[i].length; j++) {
            let tdNode = document.createElement("td");
            tdNode.className = arr2d[i][j] ? "alive" : "unalive";

            // Add click event to each cell for toggling
            (function (x, y) {
                tdNode.addEventListener('click', function () {
                    // Toggle the cell status in the array
                    arr2d[x][y] = !arr2d[x][y];
                    // Redraw the board based on the updated array
                    clearBoard();
                    drawBoard(arr2d);
                });
            })(i, j);

            trNode.appendChild(tdNode);
        }
        tNode.appendChild(trNode);
    }
}


// Removes the previous table graphic
function clearBoard(){
    let oldBoardTable = document.getElementById("gameBoard");
    oldBoardTable.removeChild(oldBoardTable.childNodes[0]);
}


//Button Event Functions
function stepClick(){
    gameBoard = stepBoard(gameBoard);
    clearBoard();
    drawBoard(gameBoard);
}

function goClick(){
    if (!goInterval){
    goInterval = setInterval(stepClick, 100);
    }

}

function updateTableBoarder(){
    
}

function resetClick(){
    pauseClick();
    gameBoard = defaultBoard();
    clearBoard();
    drawBoard(gameBoard);
}

function pauseClick(){
    clearInterval(goInterval);
    goInterval = null;
}

function randomClick(){
    pauseClick();
    gameBoard = randomBoard();
    clearBoard();
    drawBoard(gameBoard);
}

function clearBoardClick(){
    pauseClick();
    gameBoard = emptyBoard()
    clearBoard();
    drawBoard(gameBoard);
}

