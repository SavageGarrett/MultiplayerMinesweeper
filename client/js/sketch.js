class GameBoard{
    // Generates a board of height: size by width: size 
    // If copy_board is specified new board will be created as a copy
    // Uncleared space is a 1, Bomb is saved as 2
    constructor(size, copy_board) {
        if (copy_board !== void 0) {
            this.board = copy_board.get_board();
        } else {
            this.board = [];
            this.line = [];
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    let random = Math.floor((Math.random() * 10) + 1);
                    
                    // 1 in 10 chance of getting a mine
                    if (random == 3) {
                        this.line[j] = 2;
                    }  else {
                        this.line[j] = 1;
                    }
                }
                this.board[i] = this.line;
                this.line = [];
            }
        }
    }

    get_board() {
        return this.board;
    }

    // Get square at x,y index of the array
    get_square(x, y) {
        return this.board[x][y];
    }

    // Set square to different tile
    set_square(x, y, tile) {
        this.board[x][y] = tile;
    }

    get_space_cleared(x, y) {
        //TODO: Pathfinding Like thing
    }
}

function setup() {
    createCanvas(400, 400);
    background(225);
}

let size = 20;

var board = new GameBoard(size, void 0);
var working_board = new GameBoard(size, board);

//x is wide y is tall
function draw() {
    
    fill(128);
    for (let k = 0; k < size; k++) {
        for (let l = 0; l < size; l++) {
            // Get Each tile of the Board to draw
            if (working_board.get_square(k, l) == 1 || working_board.get_square(k, l) == 2) {
                fill(128);
                rect(k * 20, l * 20, 20, 20);
            } else if (working_board.get_square(k, l) == 5) { // Bomb Clicked TODO: End Game
                fill('orange');
                rect(k * 20, l * 20, 20, 20);
            } else if (working_board.get_square(k, l) == 4) { // Cleared
                fill('white');
                rect(k * 20, l * 20, 20, 20);
            } else if (working_board.get_square(k, l) == 3) { // Flag
                fill('red');
                rect(k * 20, l * 20, 20, 20);
            }
        }
    }
    
}

function mouseClicked() {
    // Get Array Indices of square selected
    let xSquare = Math.floor(mouseX / 20);
    let ySquare = Math.floor(mouseY / 20);

    if (mouseButton === RIGHT && board.get_square(xSquare, ySquare) == 1) {
        fill('red');
        rect(xSquare * 20, ySquare * 20, 20, 20);
        working_board.set_square(xSquare, ySquare, 3)
    } else {
        if (board.get_square(xSquare, ySquare) == 1) {
            working_board.set_square(xSquare, ySquare, 4);
        } else if (board.get_square(xSquare, ySquare) == 2) {
            working_board.set_square(xSquare, ySquare, 5);
        }
    }

}