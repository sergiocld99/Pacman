import Entity from "./entity.js"

export default class Ghost extends Entity {

    constructor(fullImg, scareImg, scare2Img, number, board, pacman) {
        super(board, 11 + number + (number > 1 ? 2 : 0), 14, number % 3 ? 0 : 3)
        this.fullImg = fullImg
        this.scareImg = scareImg
        this.scare2Img = scare2Img
        this.number = number
        this.pacman = pacman
        this.reset()
    }

    reset(){
        super.reset()
        this.bounces = 0
        this.bounceLimit = 5 * (this.number + 1)
        this.inHouse = true
        this.scared = false

        if (this.vulnerableEndingIntervalId) clearInterval(this.vulnerableEndingIntervalId)
        if (this.vulnerableIntervalId) clearInterval(this.vulnerableIntervalId)
    }

    canMoveTo(x,y){
        const x_try = super.fixX(x)
        const y_try = super.fixY(y)
        let ok = this.board.canGhostMoveTo(x_try, y_try)

        // check tunnel
        super.checkTunnel()

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
        if (this.y == 14 && (this.x == 6 || this.x == 21)){
            if (this.scared){
                if (this.pacman.isAbove(this.y)) this.changeToRandomDirection()
                else super.moveUp()
            } else {
                if (this.pacman.isBelow(this.y)) this.changeToRandomDirection()
                else super.moveUp()
            }
        } else if (this.canMoveTo(this.x, this.y-0.5)){
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
        if (this.y == 14 && (this.x == 6 || this.x == 21)){
            if (this.scared){
                if (this.pacman.isBelow(this.y)) this.changeToRandomDirection()
                else super.moveDown()
            } else {
                if (this.pacman.isAbove(this.y)) this.changeToRandomDirection()
                else super.moveDown()
            }
        } else if (this.canMoveTo(this.x, this.y+0.5)){
            super.moveDown()
        } else {
            if (this.inHouse) this.direction = 0
            else this.changeToRandomDirection()
        }
    }

    teletransport(foodCount){
        if (foodCount < 12) {
            this.x = -4
            this.y = -4
        } else {
            super.nextTick()
            if (super.getTick() % 2 === 0){
                let coords = this.board.getRandomSpace(this.x, this.y, 2)
                this.x = coords[0]
                this.y = coords[1]
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

    goBackwards(){
        switch (this.direction){
            case 0:
                this.direction = 3
                break
            case 1:
                this.direction = 2
                break
            case 2:
                this.direction = 1
                break
            case 3:
                this.direction = 0
                break
        }
    }

    goAwayFromPacman(){
        switch (this.direction){
            case 0:
                if (this.pacman.isAbove(this.y)) this.direction = 3
                break
            case 1:
                if (this.pacman.isToTheLeft(this.x)) this.direction = 2
                break
            case 2:
                if (this.pacman.isToTheRight(this.x)) this.direction = 1
                break
            case 3:
                if (this.pacman.isBelow(this.y)) this.direction = 0
                break
        }
    }

    goTowardsPacman(){
        switch (this.direction){
            case 0:
                if (this.pacman.isBelow(this.y)) this.direction = 3
                break
            case 1:
                if (this.pacman.isToTheRight(this.x)) this.direction = 2
                break
            case 2:
                if (this.pacman.isToTheLeft(this.x)) this.direction = 1
                break
            case 3:
                if (this.pacman.isAbove(this.y)) this.direction = 0
                break
        }
    }

    scare(duration){
        this.scared = true
        this.vulnerableEnding = false
        this.goAwayFromPacman()

        if (this.vulnerableEndingIntervalId) clearInterval(this.vulnerableEndingIntervalId)
        this.vulnerableEndingIntervalId = setTimeout(() => {
            this.vulnerableEnding = true
        }, duration * 0.8)

        if (this.vulnerableIntervalId) clearInterval(this.vulnerableIntervalId)
        this.vulnerableIntervalId = setTimeout(() => {
            this.scared = false
            this.goTowardsPacman()
        }, duration);
    }

    eat(){
        this.reset()
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

    draw(context, cellSize, imageSize){
        const sw = imageSize, sh = imageSize
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

        if (this.scared) {
            super.nextTick()
            let variant = this.vulnerableEnding && (super.getTick() % 10 < 5)
            context.drawImage(variant ? this.scare2Img : this.scareImg, this.x * cellSize, this.y * cellSize, cellSize, cellSize)
        } else {
            context.drawImage(this.fullImg, sx, sy, sw, sh, this.x * cellSize, this.y * cellSize, cellSize * 1.2, cellSize * 1.2)
        }

        
    }

    // ---- QUERIES -----------------------
    
    canBeEaten(){
        return this.scared
    }
}