import TweenMax from 'gsap'
import Q from './../main.js'

class Mountain {
	constructor(index) {
		this.image = Q.spriteImage
		
		if (index === 0) {
			this.x = 0
			this.y = 60
			this.width = 1400
			this.height = 453
			this.sourceX = 428
			this.sourceY = 768
			this.sourceWidth = 1400
			this.sourceHeight = 453
		}else if (index === 1) {
			this.x = 0
			this.y = 200
			this.width = 1400
			this.height = 342
			this.sourceX = 428
			this.sourceY = 1220
			this.sourceWidth = 1400
			this.sourceHeight = 342
		}else if (index === 2) {
			this.x = 0
			this.y = 368
			this.width = 1400
			this.height = 100
			this.sourceX = 428
			this.sourceY = 1560
			this.sourceWidth = 1400
			this.sourceHeight = 100
		}

	}

	render(context) {
		context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
	}
}

export default Mountain