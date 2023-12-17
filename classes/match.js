export default class Match {

    constructor(maxLives) {
        this.maxLives = maxLives
        this.reset()
    }

    reset(){
        this.lives = this.maxLives 
    }

    loseLive(){
        this.lives--
    }

    shouldResetGame(){
        return this.lives < 0
    }

    shouldShow(liveNumber){
        return (this.lives >= liveNumber)
    }
}