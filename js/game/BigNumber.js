import Q from './../main.js'

class BigNumber {
	constructor() {
		this.image = Q.spriteImage
		this.value = null

		this.width = 80
		this.height = 116

		this.x = 0
		this.y = 0

		this.sourceX = 630
		this.sourceY = 1980
		this.sourceWidth = 80
		this.sourceHeight = 116
		this.show = true
	}

	set(value) {
		this.show = true
		this.value = value
	}

	clear() {
		this.value = 0
		this.show = false
	}

	render(context) {
		if (this.show) {
			context.drawImage(this.image, this.sourceX + (this.sourceWidth * (this.value)), this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)
		}
	}
}

export default BigNumber