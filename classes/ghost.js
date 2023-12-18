import Entity from "./entity.js"

export default class Ghost extends Entity {

    constructor(fullImg, number, board, pacman) {
        super(board, 11 + number + (number > 1 ? 2 : 0), 14, number % 3 ? 0 : 3)
        this.fullImg = fullImg
        this.number = number
        this.pacman = pacman
        this.reset()
    }

    reset(){
        super.reset()
        this.bounces = 0
        this.bounceLimit = 5 * (this.number + 1)
        this.inHouse = true
    }

    canMoveTo(x,y){
        const x_try = super.fixX(x)
        const y_try = super.fixY(y)
        let ok = this.board.canGhostMoveTo(x_try, y_try)

        if (!ok) this.bounces++
        return ok
    }

    changeToRandomDirection(){
        switch (this.direction) {
            case 0:
            case 3:
                if (Math.random() < 0.5){
                    this.direction = (this.board.canGhostMoveTo(this.x-1, this.y)) ? 1 : 2
                } else {
                    this.direction = (this.board.canGhostMoveTo(this.x+1, this.y)) ? 2 : 1
                }
                break;
            case 1:
            case 2:
                if (Math.random() < 0.5){
                    this.direction = (this.board.canGhostMoveTo(this.x, this.y-1)) ? 0 : 3
                } else {
                    this.direction = (this.board.canGhostMoveTo(this.x, this.y+1)) ? 3 : 0
                }
                break;
        }
    }

    moveUp(){
        if (this.canMoveTo(this.x, this.y-0.5)){
            super.moveUp()
        } else {
            if (this.bounces < this.bounceLimit) this.direction = 3
            else {
                if (this.inHouse) {
                    this.direction = this.x < 14 ? 2 : 1
                    this.inHouse = false
                } else {
                    this.changeToRandomDirection()
                }
            }
        }
    }

    moveLeft(){
        if (this.x == 14 && this.y == 13){
            this.direction = 0
        } else if (this.canMoveTo(this.x-0.5, this.y)){
            super.moveLeft()
        } else {
            this.changeToRandomDirection()
        }
    }

    moveRight(){
        if (this.x == 13 && this.y == 13){
            this.direction = 0
        } else if (this.canMoveTo(this.x+0.5, this.y)){
            super.moveRight()
        } else this.changeToRandomDirection()
    }

    moveDown(){
        if (this.canMoveTo(this.x, this.y+0.5)){
            super.moveDown()
        } else {
            if (this.inHouse) this.direction = 0
            else this.changeToRandomDirection()
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

    checkPacmanCollision(){
        
        switch (this.direction) {
            case 0:
            case 3:
                if (this.x != this.pacman.x) return false
                return this.y == this.pacman.y || super.fixedY() == this.pacman.y || this.y == this.pacman.fixedY()
            case 1:
            case 2:
                if (this.y != this.pacman.y) return false
                return this.x == this.pacman.x || super.fixedX() == this.pacman.x || this.x == this.pacman.fixedX()
        }

    }

    draw(context, cellSize){
        const sw = 100, sh = 100
        let sx, sy

        switch (this.number) {
            case 0:
                sx = 0
                sy = 0
                break;
            case 1:
                sx = 100
                sy = 0
                break
            case 2:
                sx = 0
                sy = 100
                break
            case 3:
                sx = 100
                sy = 100
                break;
        }

        context.drawImage(this.fullImg, sx, sy, sw, sh, this.x * cellSize, this.y * cellSize, cellSize * 1.2, cellSize * 1.2)
    }
}