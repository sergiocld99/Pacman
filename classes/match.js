export default class Match {

    constructor(maxLives, initialLevel, levelCompletedDelay) {
        this.maxLives = maxLives
        this.levelCompletedAnimationDuration = levelCompletedDelay
        this.initialLevel = initialLevel
 
        // enum
        this.statusList = {
            STARTING: 0,
            PLAYING: 1,
            LEVEL_COMPLETED: 2
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

    getScareDuration(){
        let factor = Math.max(1, 12 - this.level + 1)
        return 9300 * (factor / 12)
    }

    addPointsByGhostEat(){
        this.ghostsEaten++
        this.score += Math.pow(2, this.ghostsEaten) * 100
    }

    // ---- SOUND EFFECTS -----------------------------------

    startGhostSiren(){
        // start siren
        this.playGhostSiren()
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.sirenIntervalId = setInterval(() => this.playGhostSiren(), 2760)
    }

    playGhostSiren(){
        if (!this.isStarted()) return
        
        this.siren = new Audio("sounds/ghosts.mp3")
        this.siren.play()
    }

    stopGhostSiren(){
        if (this.sirenIntervalId) clearInterval(this.sirenIntervalId)
        this.siren?.pause()
    }

    startScareSiren(duration){
        if (!this.areGhostsVulnerable){
            this.stopGhostSiren()
            this.ghostsEaten = 0
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