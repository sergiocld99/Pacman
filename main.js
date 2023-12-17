import Board from "./classes/board.js"
import Ghost from "./classes/ghost.js"
import Pacman from "./classes/pacman.js"

// HTML elements
const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

const pacman0 = document.getElementById("pacman0")
const pacman1 = document.getElementById("pacman1")
const pacman2 = document.getElementById("pacman2")
const pacman3 = document.getElementById("pacman3")
const pacmanImgs = [pacman0, pacman1, pacman2, pacman3]

const ghostsImg = document.getElementById("ghosts")

// Constants
const BOARD_WIDTH = 28
const BOARD_HEIGHT = 31
const CELL_SIZE = 20
const FOOD_RADIUS = CELL_SIZE / 6
const WALL_OFFSET = 0.25
const PACMAN_TICK_PERIOD = 5

// Global variables
const board = new Board(BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, FOOD_RADIUS, WALL_OFFSET)
const pacman = new Pacman(board, pacmanImgs)

const ghostEntities = Array(4)
for (let i=0; i<ghostEntities.length; i++) ghostEntities[i] = new Ghost(ghostsImg, i, board, pacman)

let ticks = 0

// Setup
const setup = () => {
    board.reset()
    
    // Keyboard listener
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowUp") pacman.moveUp()
        else if (e.key === "ArrowDown") pacman.moveDown()
        else if (e.key === "ArrowLeft") pacman.moveLeft()
        else if (e.key === "ArrowRight") pacman.moveRight()
    })
}

// Loop
const gameLoop = () => {
    canvasContext.clearRect(0,0,canvas.width, canvas.height)
    board.draw(canvasContext)

    if (++ticks >= PACMAN_TICK_PERIOD){
        pacman.moveAuto()
        ghostEntities.forEach(g => g.moveAuto())
        ticks = 0
    }

    ghostEntities.forEach(g => {
        if (g.checkPacmanCollision()){
            pacman.reset()
            ghostEntities.forEach(g => g.reset())
            return
        }
    })

    if (!board.checkExistFood()){
        board.reset()
        pacman.reset()
        ghostEntities.forEach(g => g.reset())
    }

    pacman.draw(canvasContext, CELL_SIZE)

    ghostEntities.forEach(g => {
        g.draw(canvasContext, CELL_SIZE)
    })
}

// Main program
setup()
setInterval(gameLoop, 20);


// ---------------- AUXILIAR FUNCTIONS ---------------------------