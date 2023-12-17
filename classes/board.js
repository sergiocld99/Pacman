export default class Board {
    
    constructor(width, height, cellSize, foodRadius, wallOffset) {
        this.width = width
        this.height = height
        this.cellSize = cellSize
        this.foodRadius = foodRadius
        this.delta = wallOffset

        this.cellTypes = {
            Wall: 0,
            Space: 1,
            Food: 2,
            BigFood: 3,
            GhostHouse: 4
        }
    }

    reset(){
        this.matrix = Array.from({length: this.height}, () => Array(this.width).fill(this.cellTypes.Wall))
        this.placePaths()

        let count = 0

        this.matrix.forEach(row => row.forEach(val => {
            if (val == this.cellTypes.Food) count++
        }))

        this.foodCount = count
        console.log("Food count: ", this.foodCount)
    }

    placePaths() {
        this.placeRow(11,9,5)
        this.placeRow(14,0,9)
        this.placeRow(17,9,5)
        this.placeRow(23,13,1)

        this.placeColumn(9,11,9)
        this.placeColumn(12,8,4)

        this.placeGhostHouse(12,13,2,1)
        this.placeGhostHouse(13,11,6,3)

        this.placeFoodPaths()
    }

    placeFoodPaths() {
        this.placeFoodRow(1,1,12)
        this.placeFoodRow(5,1,13)
        this.placeFoodRow(8,1,6)
        this.placeFoodRow(8,9,4)
        this.placeFoodRow(20,1,12)
        this.placeFoodRow(23,1,3)
        this.placeFoodRow(23,6,7)
        this.placeFoodRow(26,1,6)
        this.placeFoodRow(26,9,4)
        this.placeFoodRow(29,1,13)

        this.placeFoodColumn(1,1,8)
        this.placeFoodColumn(6,1,26)
        this.placeFoodColumn(9,5,4)
        this.placeFoodColumn(12,1,5)
        this.placeFoodColumn(1,26,4)
        this.placeFoodColumn(3,23,4)
        this.placeFoodColumn(1,20,4)
        this.placeFoodColumn(12,20,4)
        this.placeFoodColumn(9,23,4)
        this.placeFoodColumn(12,26,4)
    }

    placeRow(row, start, count){
        for (let i=0; i<count; i++){
            this.matrix[row][start+i] = this.cellTypes.Space
            this.matrix[row][this.width-start-i-1] = this.cellTypes.Space
        }
    }

    placeColumn(col, start, count){
        for (let i=0; i<count; i++){
            this.matrix[start+i][col] = this.cellTypes.Space
            this.matrix[start+i][this.width-col-1] = this.cellTypes.Space
        }
    }

    placeFoodRow(row, start, count){
        for (let i=0; i<count; i++){
            this.matrix[row][start+i] = this.cellTypes.Food
            this.matrix[row][this.width-start-i-1] = this.cellTypes.Food
        }
    }

    placeFoodColumn(col, start, count){
        for (let i=0; i<count; i++){
            this.matrix[start+i][col] = this.cellTypes.Food
            this.matrix[start+i][this.width-col-1] = this.cellTypes.Food
        }
    }

    placeGhostHouse(row_start, col_start, width, height){
        for (let i=0; i<height; i++){
            for (let j=0; j<width; j++){
                this.matrix[row_start+i][col_start+j] = this.cellTypes.GhostHouse
            }
        }
    }

    draw(context) {
        this.matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    context.fillStyle = cell == this.cellTypes.GhostHouse ? "#110" : "black"
                    context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)

                    if (cell == this.cellTypes.Food) this.drawFood(context, x, y)
                } else {
                    this.drawLightWall(context, x, y)
                }
            })
        })
    }

    drawLightWall(context, x, y){
        context.strokeStyle = "blue"
        const wallType = this.cellTypes.Wall
        const wall_above = y == 0 || this.matrix[y-1][x] == wallType
        const wall_below = y == this.height-1 || this.matrix[y+1][x] == wallType
        const wall_left = x == 0 || this.matrix[y][x-1] == wallType
        const wall_right = x == this.width-1 || this.matrix[y][x+1] == wallType

        const xa = x - this.delta
        const xb = x + this.delta
        const ya = y - this.delta
        const yb = y + this.delta

        if (!wall_left){
            const yu = wall_above ? y : yb
            const yd = wall_below ? y : ya
            context.beginPath()
            context.moveTo(xb*this.cellSize, yu*this.cellSize)
            context.lineTo(xb*this.cellSize, (yd+1)*this.cellSize)
            context.stroke()
        }

        if (!wall_right){
            const yu = wall_above ? y : yb
            const yd = wall_below ? y : ya
            context.beginPath()
            context.moveTo((xa+1)*this.cellSize, yu*this.cellSize)
            context.lineTo((xa+1)*this.cellSize, (yd+1)*this.cellSize)
            context.stroke()
        }

        if (!wall_above){
            const xl = wall_left ? x : xb
            const xd = wall_right ? x : xa
            context.beginPath()
            context.moveTo(xl*this.cellSize, yb*this.cellSize)
            context.lineTo((xd+1)*this.cellSize, yb*this.cellSize)
            context.stroke()
        }

        if (!wall_below){
            const xl = wall_left ? x : xb
            const xd = wall_right ? x : xa
            context.beginPath()
            context.moveTo(xl*this.cellSize, (ya+1)*this.cellSize)
            context.lineTo((xd+1)*this.cellSize, (ya+1)*this.cellSize)
            context.stroke()
        }
    }

    drawFood(context, x, y){
        context.fillStyle = "white"
        context.beginPath()
        context.arc((x+0.5) * this.cellSize, (y+0.5) * this.cellSize, this.foodRadius, 0, 2 * Math.PI)
        context.fill()
    }

    // ---- GAME QUERIES ---------------------------

    canPacmanMoveTo(x,y){
        const value = this.matrix[y][x]
        const ok = value != this.cellTypes.Wall && value != this.cellTypes.GhostHouse
    
        if (value == this.cellTypes.Food){
            // eat food
            this.matrix[y][x] = this.cellTypes.Space
            this.foodCount -= 1
        }

        return ok
    }

    checkExistFood(){
        return this.foodCount > 0
    }

}