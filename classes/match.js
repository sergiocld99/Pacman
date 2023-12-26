export default class Match {

    constructor(maxLives, initialLevel, levelCompletedDelay) {
        this.maxLives = maxLives
        this.levelCompletedAnimationDuration = levelCompletedDelay
        this.initialLevel = initialLevel
 
        // enum
        this.statusList = {
            STARTING: 0,
            PLAYING: 1,
            LEVEL_COMPLETED: 2,
            EATING_GHOST: 3,
            LOSING: 4
        }

        this.reset()
    }

    reset(){
        this.level = this.initialLevel
        this.lives = this.maxLives 
        this.status = this.statusList.STARTING
        this.score = 2440 * (this.level - 1)
    }

    start(){
        this.status = this.statusList.STARTING
        new Audio("sounds/start.mp3").play()

        setTimeout(() => {
            this.status = this.statusList.PLAYING
            this.startGhostSiren()
        }, 4000);
    }

    loseLive(pacman){
        this.status = this.statusList.LOSING
        this.stopGhostSiren()

        let sound = new Audio("sounds/lose.mp3")
        sound.volume = 0.5
        sound.play()

        // lose animation
        let rotateIntervalId = setInterval(() => pacman.rotateClockwise(), 200);
        setTimeout(() => clearInterval(rotateIntervalId), 1700)
        
        if (this.lives > 0){
            // after lose animation
            setTimeout(() => {
                pacman.reset()
                this.lives--
                this.status = this.statusList.PLAYING
                this.startGhostSiren()
            }, 2000)
        }
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
        this.areGhostsVulnerable = false

        setTimeout(() => {
            board.reset()
            pacman.reset()
            ghostEntities.forEach(g => g.reset())

            this.level++
            this.start()
        }, this.levelCompletedAnimationDuration);
    }

    // ---- QUERIES -----------------------------------------

    isPlaying(){
        return this.status === this.statusList.PLAYING
    }

    isLevelCompleted(){
        return this.status === this.statusList.LEVEL_COMPLETED
    }

    shouldShow(liveNumber){
        return (this.lives >= liveNumber)
    }

    getEntityLevel(){
        let speed_level = Math.floor((this.level-1) / 3)
        return Math.min(speed_level, 3)
    }

    getScareDuration(){
        let factor = Math.max(1, 12 - this.level + 1)
        return 9300 * (factor / 12)
    }

    getPointsByGhostEaten(){
        return Math.pow(2, this.ghostsEaten) * 100
    }

    addPointsByGhostEat(){
        this.ghostsEaten++
        this.addScore(this.getPointsByGhostEaten())

        this.status = this.statusList.EATING_GHOST
        setTimeout(() => this.status = this.statusList.PLAYING, 500)
    }

    // ---- SOUND EFFECTS -----------------------------------

    startGhostSiren(){
        // start siren
        this.playGhostSiren()
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.sirenIntervalId = setInterval(() => this.playGhostSiren(), 2760)
    }

    playGhostSiren(){
        if (!this.isPlaying()) return
        
        this.siren = new Audio("sounds/ghosts.mp3")
        this.siren.play()
    }

    stopGhostSiren(){
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.siren?.pause()
    }

    startScareSiren(duration){
        this.ghostsEaten = 0

        if (!this.areGhostsVulnerable){
            this.stopGhostSiren()
            this.areGhostsVulnerable = true

            // start siren
            this.playScareSiren()
            this.sirenIntervalId = setInterval(() => this.playScareSiren(), 3190);
        }
        
        // set duration
        if (this.vulnerableIntervalId) clearInterval(this.vulnerableIntervalId)

        this.vulnerableIntervalId = setTimeout(() => {
            this.stopGhostSiren()
            this.areGhostsVulnerable = false
            this.startGhostSiren()
        }, duration)
    }

    playScareSiren(){
        this.siren = new Audio("sounds/scared_x6.mp3")
        this.siren.play()
    }
}