import Board from "./classes/board.js"
import Ghost from "./classes/ghost.js"
import Match from "./classes/match.js"
import Pacman from "./classes/pacman.js"

// HTML elements
const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext("2d")

const pacmanImgs = Array(4)
for (let i=0; i<4; i++) pacmanImgs[i] = document.getElementById(`pacman${i}`)

const ghostsImg = document.getElementById("ghosts")

const liveImgs = Array(3)
for (let i=0; i<3; i++) liveImgs[i] = document.getElementById(`live${i+1}`)

// Constants
const BOARD_WIDTH = 28
const BOARD_HEIGHT = 31
const CELL_SIZE = 20
const FOOD_RADIUS = CELL_SIZE / 6
const WALL_OFFSET = 0.25
const PACMAN_TICK_PERIOD = 5
const LIVES_MAX = 3

// Global variables
const board = new Board(BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, FOOD_RADIUS, WALL_OFFSET)
const pacman = new Pacman(board, pacmanImgs)
const match = new Match(LIVES_MAX)

const ghostEntities = Array(4)
for (let i=0; i<4; i++) ghostEntities[i] = new Ghost(ghostsImg, i, board, pacman)

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

const resetGame = () => {
    board.reset()
    pacman.reset()
    match.reset()
    ghostEntities.forEach(g => g.reset())
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
            match.loseLive()
            if (match.shouldResetGame()) resetGame()
            else {
                pacman.reset()
                ghostEntities.forEach(g => g.reset())
            }
            return
        }
    })

    if (!board.checkExistFood()){
        resetGame()
    }

    pacman.draw(canvasContext, CELL_SIZE)

    ghostEntities.forEach(g => {
        g.draw(canvasContext, CELL_SIZE)
    })

    liveImgs.forEach((img, i) => img.style.visibility = match.shouldShow(i+1) ? 'visible' : 'hidden')
}

// Main program
setup()
setInterval(gameLoop, 20);


// ---------------- AUXILIAR FUNCTIONS ---------------------------