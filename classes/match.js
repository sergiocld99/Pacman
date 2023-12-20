export default class Match {

    constructor(maxLives) {
        this.maxLives = maxLives

        // enum
        this.statusList = {
            STARTING: 0,
            PLAYING: 1,
            LEVEL_COMPLETED: 2
        }

        this.reset()
    }

    reset(){
        this.level = 1
        this.lives = this.maxLives 
        this.status = this.statusList.STARTING
        this.score = 0
    }

    start(){
        this.status = this.statusList.STARTING
        new Audio("sounds/start.mp3").play()

        setTimeout(() => {
            this.status = this.statusList.PLAYING
            console.log("Status changed to Playing")

            // start siren
            this.playGhostSiren()
            this.sirenIntervalId = setInterval(() => {
                this.playGhostSiren()
            }, 2760);
        }, 4000);
    }

    loseLive(){
        this.lives--
    }

    addScore(diff){
        let prev = this.score
        let curr = this.score + diff

        if (curr >= 10000 && prev < 10000) this.lives++
        this.score = curr
    }

    nextLevel(pacman, ghostEntities, board){
        this.status = this.statusList.LEVEL_COMPLETED
        this.stopGhostSiren()

        setTimeout(() => {
            board.reset()
            pacman.reset()
            ghostEntities.forEach(g => g.reset())

            this.level++
            this.start()
        }, 2000);
    }

    // ---- QUERIES -----------------------------------------

    isStarted(){
        return this.status === this.statusList.PLAYING
    }

    isLevelCompleted(){
        return this.status === this.statusList.LEVEL_COMPLETED
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

    // ---- SOUND EFFECTS -----------------------------------

    playGhostSiren(){
        if (!this.isStarted()) return
        
        this.siren = new Audio("sounds/ghosts.mp3")
        this.siren.play()
    }

    stopGhostSiren(){
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.siren?.pause()
    }
}