import TweenMax from 'gsap'
import Q from './../main.js'

class Moon {
	constructor() {
		this.image = Q.spriteImage
		this.x = 10
		this.y = 10
		this.width = 90
		this.height = 90

		this.sourceX = 100
		this.sourceY = 200
		this.sourceWidth = 90
		this.sourceHeight = 90

	}

	render(context) {

		context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
	}
}

export default Moon