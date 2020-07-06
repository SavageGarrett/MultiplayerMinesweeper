// Declare Constants
const size = 20;
const fontsize = 20;
const tile_size = 30;
const num_tiles_x = 20;
const num_tiles_y = 20;

/**
 * GameBoard Object: Handles Game Board Colors
 */
class GameBoard{
    
    /**
     * Generates a board of height: size by width: size 
     * If copy_board is specified new board will be created as a copy
     * Uncleared space is a 1, Bomb is saved as 2
     * @param {Integer} size 
     * @param {GameBoard} copy_board 
     */
    constructor(size, copy_board) {
        if (copy_board !== void 0) {
            this.board = copy_board.get_board();
        } else {
            this.generate_board(size);
        }
    }

    generate_board(size) {
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

    // Helper Function returns true if bomb or set off bomb
    get_bomb(x, y) {
        return (this.board.get_square(x, y) == 2 || this.get_square(x, y) == 5);
    }

    // Get amount of mines for each square
    get_amountmines_surrounding(x, y) {
        // Count of mines and display boolean
        let mine_count = 0, display = true;
        // Loop through surrounding tiles
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                // Check if board index exists
                if (x + i !== -1 && x + i < num_tiles_x && y + j !== -1 && y + j < num_tiles_y) {
                    // Check that not center tile and check if other tiles are bomb
                    if (!(i === 0 && j === 0) && (this.get_square(x + i, y + j) === 2 || this.get_square(x + i, y + j) === 2)) {
                        mine_count++;
                    } else if (i === 0 && j === 0 && (this.board[x][y] == 2 || this.board[x][y] == 5)) {
                        display = false;
                    }
                }
            }
        }
        return {mine_count, display};
    }

    // Check if duplicate entry in between current location and all_locations
    check_dupe(all_locations, current_location) {
        // Holder variable for if duplicate found
        let duplicate = false;

        // Loop through locations
        for (let entry of all_locations) {
            // Compare X and Y Coordinates
            if (entry.x == current_location.x && entry.y == current_location.y) {
                duplicate = true;
                break;
            }
        }

        // Return if duplicate was found
        return duplicate;
    }

    // Reveal a Single Number Tile
    reveal_single_tile(x, y) {
        this.set_square(x, y, 6);
    }

    // Clear Whitespace in Array
    // Assumes x, y is a valid clear space
    reveal_tiles(x, y) {
        // Array of white spaces found - Initially stores the first x, y value which we know is a white space
        var locations_found = [{ x: x, y: y }];
        var all_locations = [{ x: x, y: y }]; // Array to store found locations so they don't get checked twice

        while (locations_found.length > 0) { // Loop until there are no more white space locations
            let current_location = locations_found.shift();
            for (let i = -1; i <= 1; i++) { // Loop through surrounding indices on board
                for (let j = -1; j <= 1; j++) {
                    // Make Sure Index Exists
                    if (current_location.x + i !== -1 && current_location.x + i < num_tiles_x && current_location.y + j !== -1 && current_location.y + j < num_tiles_y) {
                        // Clear and Add to Array if Exists
                        if (!(i == 0 && j == 0) && number_board.get_square(current_location.x + i, current_location.y + j) == 0 && !this.check_dupe(all_locations, { x:  current_location.x + i, y: current_location.y + j})) { // Add to found locations
                            locations_found.push({ x: current_location.x + i, y: current_location.y + j }); // Push to continue finding locations
                            all_locations.push({ x: current_location.x + i, y: current_location.y + j });
                            this.set_square(current_location.x + i, current_location.y + j, 4);
                        } else if (current_location.x + i == x && current_location.y + j == y) { // Just Clear if Initial Tile
                            this.set_square(x, y, 4);
                        } else if (number_board.get_square(current_location.x + i, current_location.y + j) >= 1 && number_board.get_square(current_location.x + i, current_location.y + j) <= 8) { // Check if number tile has been revealed around whitespace tile
                            this.set_square(current_location.x + i, current_location.y + j, 6);
                        }
                    }
                    
                }
            }
        }
    }
}

/**
 * NumberBoard Object: Stores Numbers on Board
 * Board
 */
class NumberBoard extends GameBoard {
    /**
     * Creates A Board of Numbers from 
     * @param {GameBoard} board Original Board of Mines
     */
    constructor(board) {
        // Create new GameBoard from an existing GameBoard (tile_size gets ignored when board property is set)
        super(num_tiles_x);

        // Create New Numbered Board from Mine Board
        for (let i = 0; i < num_tiles_x; i++) {
            for (let j = 0; j < num_tiles_y; j++) {
                let { mine_count, display } = board.get_amountmines_surrounding(i, j);

                if (!display) {
                    this.set_square(i, j, -1);
                } else {
                    this.set_square(i, j, mine_count);
                }

            }
        }
    }

    get_number_board() {
        return
    }
}

// Declare Original Board (Just Bombs), Working Board (Board with User Interaction), and Number Board (Board That Stores Numbers on Page)
var board = new GameBoard(size, void 0); // Board array uses indices (1 = clear, 2 = bomb)
var working_board = new GameBoard(size, board); // Board array uses indices (1 = uncleared, 2 = bomb, 3 = flag, 4 = clear, 5 = game over, 6 = Revealed number)
var number_board = new NumberBoard(board); // Board array uses indices (0 - 8 = Amount of Bombs Surrounding, -1 = Bomb)

// Function to Draw Tile Colors and Text
function draw_tile() {

}


// Setup
function setup() {
    createCanvas(tile_size * num_tiles_x, tile_size * num_tiles_y);
    background(225);

    // Set Text Style
    textSize(fontsize);
    textAlign(CENTER, CENTER);
}

//x is wide y is tall
function draw() {
    
    fill(128);
    for (let i = 0; i < num_tiles_x; i++) {
        for (let j = 0; j < num_tiles_y; j++) {
            // Get Each tile of the Board to draw
            if (working_board.get_square(i, j) == 5) { // Bomb Clicked TODO: End Game
                fill('orange');
                rect(i * tile_size, j * tile_size, tile_size, tile_size);
            } else if (working_board.get_square(i, j) == 4) { // Cleared
                fill('white');
                rect(i * tile_size, j * tile_size, tile_size, tile_size);
            } else if (working_board.get_square(i, j) == 3) { // Flag
                fill('red');
                rect(i * tile_size, j * tile_size, tile_size, tile_size);
            } else if (working_board.get_square(i, j) == 6) { // Revealed Number
                fill('white');
                rect(i * tile_size, j * tile_size, tile_size, tile_size);
                fill (0);
                text(number_board.get_square(i, j).toString(), (tile_size / 2) + i * tile_size, (tile_size / 2) + j * tile_size);
            } else {
                fill(128);
                rect(i * tile_size, j * tile_size, tile_size, tile_size);
            }
            
        }
    }
}

function mouseClicked(event) {
    // Get Array Indices of square selected
    let xSquare = Math.floor(mouseX / tile_size);
    let ySquare = Math.floor(mouseY / tile_size);

    console.log(mouseButton)
    console.log(event.button)

    if (mouseButton === CENTER) { // Handle Flag on Right Click TODO: add remove flag if already exists
        working_board.set_square(xSquare, ySquare, 3)
    } else { // Handle any other tile
        if (number_board.get_square(xSquare, ySquare) >= 1 && number_board.get_square(xSquare, ySquare) <= 8) { // Handle Number Square
            working_board.reveal_single_tile(xSquare, ySquare);
        } else if (number_board.get_square(xSquare, ySquare) == 0) { // Handle Clear Square
            working_board.reveal_tiles(xSquare, ySquare);
        } else if (working_board.get_square(xSquare, ySquare) == 2) { // Handle Bomb Tile
            working_board.set_square(xSquare, ySquare, 3);
        } // TODO: Add Functionality for Clicking a number tile already cleared
    }
}