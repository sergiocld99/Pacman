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

    fixX(x){
        return this.direction == 2 ? Math.ceil(x) : Math.floor(x)
    }

    fixY(y){
        return this.direction == 3 ? Math.ceil(y) : Math.floor(y)
    }
}