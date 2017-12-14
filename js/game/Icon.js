import TweenMax from 'gsap'
import Q from './../main'

class Icon {
	constructor(type) {
		this.counter = 0
		this.image = Q.spriteImage
		this.type = type

		this.canChange = true

		if (type === 'clap') {
			this.width = 144
			this.height = 204
			this.x = 250
			this.y = 200
			this.sourceX = 1396
			this.sourceY = 1754
			this.sourceWidth = 144
			this.sourceHeight = 204

			this.frame = 0
			this.numFrames = 2
			this.speed = 10
			
		}

		if (type === 'say') {
			this.width = 155
			this.height = 148
			this.x = 250
			this.y = 250
			this.sourceX = 931
			this.sourceY = 1812
			this.sourceWidth = 155
			this.sourceHeight = 148

			this.frame = 0
			this.numFrames = 2
			this.speed = 10
		}
	}

	render(context) {
		if (Q.debug) {
			context.fillStyle = 'rgba(255,0,0,0.1)'
			context.fillRect(this.x, this.y, this.width, this.height)
		}

		
		context.drawImage(this.image, this.sourceX + (this.sourceWidth * this.frame), this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)

		if (this.canChange) {
			if (this.counter < this.speed) {
				this.counter += 1
			}else {
				this.counter = 0

				if (this.frame < this.numFrames) {
					this.frame += 1
				}else {
					this.frame = 0
					if (this.triggered && this.type === 'clap') {
						this.canChange = false
						this.timer = setTimeout(() => {
							this.canChange = true
							this.triggered = false
						}, 1800)
					}

					if (this.triggered && this.type === 'say') {
						this.canChange = false
						this.timer = setTimeout(() => {
							this.canChange = true
							this.triggered = false
						}, 2200)
					}
				}

				if (this.type === 'clap' && this.frame === 2) {
					Q.player.duck()
					if (Q.clapSound) {
						Q.clapSound.play()
					}
					this.triggered = true
				}

				if (this.type === 'say' && this.frame === 2) {
					Q.player.jump()
					if (Q.ohSound) {
						Q.ohSound.play()
					}
					this.triggered = true
				}

			}
		}
	}
}

export default Icon