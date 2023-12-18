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

const levelTxt = document.getElementById("level_txt")

// Constants
const BOARD_WIDTH = 28
const BOARD_HEIGHT = 31
const CELL_SIZE = 20
const FOOD_RADIUS = CELL_SIZE / 6
const WALL_OFFSET = 0.25
const PACMAN_TICK_PERIOD = [4, 4, 3, 2]
const GHOST_TICK_PERIOD = [4, 3, 2, 1]
const LIVES_MAX = 3

// Global variables
const board = new Board(BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, FOOD_RADIUS, WALL_OFFSET)
const pacman = new Pacman(board, pacmanImgs)
const match = new Match(LIVES_MAX)

const ghostEntities = Array(4)
for (let i=0; i<4; i++) ghostEntities[i] = new Ghost(ghostsImg, i, board, pacman)

let ticks = 0
let ticks_ghost = 0

// Setup
const setup = () => {
    board.reset()
    
    // Keyboard listener
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowUp" && pacman.direction != 0) pacman.moveUp()
        else if (e.key === "ArrowDown" && pacman.direction != 3) pacman.moveDown()
        else if (e.key === "ArrowLeft" && pacman.direction != 1) pacman.moveLeft()
        else if (e.key === "ArrowRight" && pacman.direction != 2) pacman.moveRight()
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

    let entity_level = board.getEntityLevel()

    if (++ticks_ghost >= GHOST_TICK_PERIOD[entity_level]){
        ghostEntities.forEach(g => g.moveAuto())
        ticks_ghost = 0
    }

    if (++ticks >= PACMAN_TICK_PERIOD[entity_level]){
        pacman.moveAuto()
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
        board.nextLevel()
        pacman.reset()
        ghostEntities.forEach(g => g.reset())
    }

    pacman.draw(canvasContext, CELL_SIZE)

    ghostEntities.forEach(g => {
        g.draw(canvasContext, CELL_SIZE)
    })

    liveImgs.forEach((img, i) => img.style.visibility = match.shouldShow(i+1) ? 'visible' : 'hidden')
    levelTxt.innerText = "Level " + board.level
}

// Main program
setup()
setInterval(gameLoop, 20);


// ---------------- AUXILIAR FUNCTIONS ---------------------------