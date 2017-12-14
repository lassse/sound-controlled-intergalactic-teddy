import TweenMax from 'gsap'
import Q from './../main.js'

class Backdrop {
	constructor(x) {
		this.image = Q.spriteImage
		this.x = x
		this.y = 0
		this.width = 1400
		this.height = 572

		this.sourceX = 428
		this.sourceY = 196
		this.sourceWidth = 1400
		this.sourceHeight = 572
	}

	render(context) {
		context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
	}
}

export default Backdrop