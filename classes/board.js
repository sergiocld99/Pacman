export default class Board {
    
    constructor(width, height, cellSize, foodRadius) {
        this.matrix = Array.from({length: height}, () => Array(width).fill(0))
        this.width = width
        this.height = height
        this.cellSize = cellSize
        this.foodRadius = foodRadius
    }

    placePaths() {
        this.placeRow(11,9,5)
        this.placeRow(14,0,9)
        this.placeRow(17,9,5)

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
        this.placeFoodRow(23,6,8)
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
            this.matrix[row][start+i] = 1
            this.matrix[row][this.width-start-i-1] = 1
        }
    }

    placeColumn(col, start, count){
        for (let i=0; i<count; i++){
            this.matrix[start+i][col] = 1
            this.matrix[start+i][this.width-col-1] = 1
        }
    }

    placeFoodRow(row, start, count){
        for (let i=0; i<count; i++){
            this.matrix[row][start+i] = 2
            this.matrix[row][this.width-start-i-1] = 2
        }
    }

    placeFoodColumn(col, start, count){
        for (let i=0; i<count; i++){
            this.matrix[start+i][col] = 2
            this.matrix[start+i][this.width-col-1] = 2
        }
    }

    placeGhostHouse(row_start, col_start, width, height){
        for (let i=0; i<height; i++){
            for (let j=0; j<width; j++){
                this.matrix[row_start+i][col_start+j] = 4
            }
        }
    }

    draw(context) {
        this.matrix.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    context.fillStyle = cell == 4 ? "#110" : "black"
                    context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)

                    if (cell == 2) this.drawFood(context, x, y)
                } else {
                    this.drawWall(context, x, y)
                }

                
            })
        })
    }

    drawWall(context, x, y){
        context.fillStyle = "black"
        context.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)

        context.strokeStyle = "blue"
        context.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize)
    }

    drawFood(context, x, y){
        context.fillStyle = "white"
        context.beginPath()
        context.arc((x+0.5) * this.cellSize, (y+0.5) * this.cellSize, this.foodRadius, 0, 2 * Math.PI)
        context.fill()
    }

    foo() {
        console.log(this.matrix)
    }
}