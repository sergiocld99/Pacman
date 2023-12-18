export default class Entity {

    constructor(board, start_x, start_y, start_direction){
        this.board = board
        this.start_x = start_x
        this.start_y = start_y
        this.start_direction = start_direction
    }

    reset(){
        this.x = this.start_x
        this.y = this.start_y
        this.direction = this.start_direction
    }

    fixedX(){
        return this.fixX(this.x)
    }

    fixedY(){
        return this.fixY(this.y)
    }

    fixX(x){
        return this.direction == 2 ? Math.ceil(x) : Math.floor(x)
    }

    fixY(y){
        return this.direction == 3 ? Math.ceil(y) : Math.floor(y)
    }

    moveUp(){
        if (this.direction == 0){
            this.y -= 0.5
        } else {
            this.x = this.fixedX()
            this.direction = 0
        }
    }

    moveLeft(){
        if (this.direction == 1){
            this.x -= 0.5
        } else {
            this.y = this.fixedY()
            this.direction = 1
        }
    }

    moveRight(){
        if (this.direction == 2){
            this.x += 0.5
        } else {
            this.y = this.fixedY()
            this.direction = 2
        }
    }

    moveDown(){
        if (this.direction == 3){
            this.y += 0.5
        } else {
            this.x = this.fixedX()
            this.direction = 3
        }
    }

    checkTunnel(){
        if (this.x >= this.board.width-1) this.x = 0
        else if (this.x <= 0) this.x = this.board.width-1
    }
}