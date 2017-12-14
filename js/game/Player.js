import TweenMax from 'gsap'
import Q from './../main.js'

class Player {
	constructor() {
		this.canChange = true
		this.image = Q.spriteImage
		
		this.width = 96
		this.height = 108
		
		this.baseX = this.x = 30
		this.baseY = Q.height - this.height - 108
		this.y = this.baseY
		this.offsetY = 0
		this.sourceWidth = 96
		this.sourceHeight = 108
		this.baseFrame = this.frame = 1
		this.numFrames = 1
		this.counter = 0
		this.state = null

		this.run()
	}

	reset() {
		if (this.delay) {
			this.delay.kill()
		}
		TweenMax.killTweensOf(this)
		// TweenMax.killChildTweensOf(this)
		this.canChange = true
		this.x = this.baseX
		this.y = this.baseY
	}

	dead() {
		if (this.state !== 'dead') {
			this.canChange = false
			this.speed = 15
			this.baseFrame = this.frame = 9
			this.numFrames = 4
			this.state = 'dead'
			this.delay = TweenMax.to(this, 0.3, {
				x: this.baseX - 10,
			})

			let that = this
			this.delay = TweenMax.to(this, 0.15, {
				y: this.baseY - 10,
				onComplete: () => {
					TweenMax.to(that, 0.15, {
						y: that.baseY,
					})
					that.y = that.baseY
				}
			})
		}
	}

	run() {
		if (this.delay) {
			this.delay.kill()
		}
		this.offsetX = 20
		this.offsetY = 0
		this.speed = 5
		this.baseFrame = this.frame = 2
		this.numFrames = 1
		this.state = 'running'
	}

	jump() {
		if (this.canChange) {
			if (this.delay) {
				this.delay.kill()
			}

			this.canChange = false
			this.baseFrame = this.frame = 7
			this.numFrames = 1
			this.speed = 4
			this.state = 'jumping'
			let that = this
			this.delay = TweenMax.to(that, 1, {
				y: that.baseY - 240,
				repeat: 1,
				yoyo: true,
				onComplete: () => {
					that.run()
					that.canChange = true
				}
			})
		}
	}

	duck() {
		if (this.canChange) {
			if (this.delay) {
				this.delay.kill()
			}
			if (this.state != 'ducking') {
				this.baseFrame = this.frame = 5
			}
			this.offsetY = 34
			this.numFrames = 1
			this.speed = 4
			this.state = 'ducking'
			this.delay = TweenMax.delayedCall(1.5, () => {
				this.run()
			})
		}
	}

	render(context) {
		if (Q.debug) {
			context.fillStyle = 'rgba(0,255,0,0.1)'
			context.fillRect(this.x + this.offsetX, this.y + this.offsetY, this.width - this.offsetX, this.height - this.offsetY)
		}
		if (this.counter < this.speed) {
			this.counter += 1
		}else {
			this.counter = 0
			if (this.frame < this.baseFrame + this.numFrames) {
				this.frame += 1
			}else {
				this.frame = this.baseFrame
			}
		}

		context.drawImage(this.image, 0, this.sourceHeight * (this.frame - 1), this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
	}

	pause() {
		if (this.delay) {
			this.delay.pause()
		}
	}

	resume() {
		if (this.delay) {
			this.delay.resume()
		}

	}
}

export default Player