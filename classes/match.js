export default class Match {

    constructor(maxLives) {
        this.maxLives = maxLives

        // enum
        this.statusList = {
            STARTING: 0,
            PLAYING: 1
        }

        this.reset()

        // ghosts siren
        setInterval(() => {
            if (this.isStarted()) {
                this.siren = new Audio("sounds/ghosts.mp3")
                this.siren.play()
            }
        }, 2760);
    }

    reset(){
        this.level = 1
        this.lives = this.maxLives 
        this.status = this.statusList.STARTING
    }

    start(){
        this.status = this.statusList.STARTING
        new Audio("sounds/start.mp3").play()
        this.siren?.stop()

        setTimeout(() => {
            this.status = this.statusList.PLAYING
            console.log("Status changed to Playing")
        }, 4000);
    }

    loseLive(){
        this.lives--
    }

    nextLevel(){
        this.level++
        this.start()
    }

    // ---- QUERIES -----------------------------------------

    isStarted(){
        return this.status === this.statusList.PLAYING
    }

    shouldResetGame(){
        return this.lives < 0
    }

    shouldShow(liveNumber){
        return (this.lives >= liveNumber)
    }

    getEntityLevel(){
        let speed_level = Math.floor((this.level-1) / 3)
        return Math.min(speed_level, 3)
    }
}