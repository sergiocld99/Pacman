export default class Pacman {

    constructor(board, pacmanImgs) {
        this.board = board
        this.pacmanImgs = pacmanImgs
        this.reset()
    }

    reset(){
        this.x = this.board.width / 2 - 1
        this.y = this.board.height - 8
        this.direction = 2
    }

    canMoveTo(x,y){
        const x_try = this.fixX(x)
        const y_try = this.fixY(y)
        return this.board.canPacmanMoveTo(x_try, y_try)
    }

    fixX(x){
        return this.direction == 2 ? Math.ceil(x) : Math.floor(x)
    }

    fixY(y){
        return this.direction == 3 ? Math.ceil(y) : Math.floor(y)
    }

    moveUp(){
        if (this.canMoveTo(this.x, this.y-0.5)){
            if (this.direction == 0){
                this.y -= 0.5
            } else {
                this.x = this.fixX(this.x)
                this.direction = 0
            }
        }
    }

    moveLeft(){
        if (this.canMoveTo(this.x-0.5, this.y)){
            if (this.direction == 1){
                this.x -= 0.5
            } else {
                this.y = this.fixY(this.y)
                this.direction = 1
            }
        }
    }

    moveRight(){
        if (this.canMoveTo(this.x+0.5, this.y)){
            if (this.direction == 2){
                this.x += 0.5
            } else {
                this.y = this.fixY(this.y)
                this.direction = 2
            }
        }
    }

    moveDown(){
        if (this.canMoveTo(this.x, this.y+0.5)){
            if (this.direction == 3){
                this.y += 0.5
            } else {
                this.x = this.fixX(this.x)
                this.direction = 3
            }
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