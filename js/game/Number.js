import Q from './../main.js'

class Number {
	constructor() {
		this.image = Q.spriteImage
		this.value = null

		this.width = 20
		this.height = 28

		this.x = 0
		this.y = 0

		this.sourceX = 116
		this.sourceY = 1500
		this.sourceWidth = 20
		this.sourceHeight = 28
	}

	set(value) {
		this.value = value
	}

	clear() {
		this.value = 0
	}

	render(context) {
		context.drawImage(this.image, this.sourceX + (this.sourceWidth * (this.value)), this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
	}
}

export default Number