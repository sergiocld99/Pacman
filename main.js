import Board from "./classes/board.js"

// HTML elements
const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

// Constants
const BOARD_WIDTH = 28
const BOARD_HEIGHT = 41
const CELL_SIZE = 20
const FOOD_RADIUS = CELL_SIZE / 6

// Global variables
let board

// Setup
const setup = () => {

    // Create board
    board = new Board(BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, FOOD_RADIUS)

    board.placePaths()
    board.draw(canvasContext)
    board.foo()
}

// Loop
const gameLoop = () => {
    
}

// Main program
setup()
setInterval(gameLoop, 20);


// ---------------- AUXILIAR FUNCTIONS ---------------------------