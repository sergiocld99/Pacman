import Entity from "./entity.js"

export default class Pacman extends Entity {

    constructor(board, pacmanImgs) {
        super(board, board.width / 2 - 1, board.height - 8, 2)
        this.pacmanImgs = pacmanImgs
        super.reset()
    }

    canMoveTo(x,y){
        const x_try = super.fixX(x)
        const y_try = super.fixY(y)
        return this.board.canPacmanMoveTo(x_try, y_try)
    }

    moveUp(){
        if (this.canMoveTo(this.x, this.y-0.5)){
            super.moveUp()
        }
    }

    moveLeft(){
        if (this.canMoveTo(this.x-0.5, this.y)){
            super.moveLeft()
        }
    }

    moveRight(){
        if (this.canMoveTo(this.x+0.5, this.y)){
            super.moveRight()
        }
    }

    moveDown(){
        if (this.canMoveTo(this.x, this.y+0.5)){
            super.moveDown()
        }
    }

    moveAuto(){
        switch (this.direction) {
            case 0:
                this.moveUp()
                break;
            case 1:
                this.moveLeft()
                break;
            case 2:
                this.moveRight()
                break;
            case 3:
                this.moveDown()
                break;
        }
    }

    draw(context, cellSize){
        context.drawImage(this.pacmanImgs[this.direction], this.x * cellSize, this.y * cellSize, cellSize, cellSize)
    }
}