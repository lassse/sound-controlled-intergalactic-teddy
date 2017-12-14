import TweenMax from 'gsap'
import Q from './../main'

class Title {
	constructor(type) {
		this.counter = 0
		this.image = Q.spriteImage
		this.type = type

		if (this.type === 'main') { 
			// this.width = 549
			// this.height = 99
			// this.x = 85
			// this.y = 98
			// this.sourceX = 0
			// this.sourceY = 1976
			// this.sourceWidth = 549
			// this.sourceHeight = 99

			this.width = 554
			this.height = 70
			this.x = 85
			this.y = 98
			this.sourceX = 626
			this.sourceY = 2112
			this.sourceWidth = 554
			this.sourceHeight = 70
		}

		if (this.type === 'jump') { 
			this.width = 594
			this.height = 84
			this.x = 85
			this.y = 60
			this.sourceX = 0
			this.sourceY = 2252
			this.sourceWidth = 594
			this.sourceHeight = 84
		}

		if (this.type === 'duck') { 
			this.width = 600
			this.height = 113
			this.x = 85
			this.y = 60
			this.sourceX = 0
			this.sourceY = 2091
			this.sourceWidth = 600
			this.sourceHeight = 113
		}

		if (this.type === 'retry') { 
			this.width = 446
			this.height = 112
			this.x = 85
			this.y = 60
			this.sourceX = 0
			this.sourceY = 2372
			this.sourceWidth = 446
			this.sourceHeight = 112
		}

	}

	render(context) {
		if (Q.debug) {
			context.fillStyle = 'rgba(255,0,0,0.1)'
			context.fillRect(this.x, this.y, this.width, this.height)
		}

		
		context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
	}
}

export default Title