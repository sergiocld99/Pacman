export default class Pacman {

    constructor(board, pacmanImgs) {
        this.board = board
        this.x = board.width / 2 - 1
        this.y = board.height - 8
        this.direction = 2
        this.pacmanImgs = pacmanImgs
    }

    moveUp(){
        if (this.board.canPacmanMoveTo(this.x, this.y-1)){
            this.direction = 0
            this.y -= 1
        }
    }

    moveLeft(){
        if (this.board.canPacmanMoveTo(this.x-1, this.y)){
            this.direction = 1
            this.x -= 1
        }
    }

    moveRight(){
        if (this.board.canPacmanMoveTo(this.x+1, this.y)){
            this.direction = 2
            this.x += 1
        }
    }

    moveDown(){
        if (this.board.canPacmanMoveTo(this.x, this.y+1)){
            this.direction = 3
            this.y += 1
        }
    }

    draw(context, cellSize){
        context.drawImage(this.pacmanImgs[this.direction], this.x * cellSize, this.y * cellSize, cellSize, cellSize)
    }
}