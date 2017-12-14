import TweenMax from 'gsap'
import Q from './../main'

class Obstacle {
	constructor(index, x) {
		this.counter = 0
		this.image = Q.spriteImage
		this.type = index
		this.mask = Q.masks[index]

		if (index === 0) {
			// Slime monster
			this.width = 156
			this.height = 72
			this.x = x
			this.y = Q.height - 110 - this.height
			this.sourceX = 116
			this.sourceY = 394
			this.sourceWidth = 156
			this.sourceHeight = 72

			this.frame = 0
			this.numFrames = 3
			this.speed = 10
		}


		if (index === 1) {
			// Flying saucer
			this.width = 168
			this.height = 116
			this.x = x
			this.y = Q.height - 190 - this.height
			this.sourceX = 116
			this.sourceY = 724
			this.sourceWidth = 168
			this.sourceHeight = 116

			this.frame = 0
			this.numFrames = 2
			this.speed = 50

		}


		if (index === 2) {
			// Pink snake
			this.width = 104
			this.height = 80
			this.x = x
			this.y = Q.height - 100 - this.height
			this.sourceX = 116
			this.sourceY = 1082
			this.sourceWidth = 104
			this.sourceHeight = 80

			this.frame = 0
			this.numFrames = 1
			this.speed = 20
		}


		if (index === 3) {
			// Yellow snake
			this.width = 104
			this.height = 80
			this.x = x
			this.y = Q.height - 100 - this.height
			this.sourceX = 116
			this.sourceY = 1252
			this.sourceWidth = 104
			this.sourceHeight = 80

			this.frame = 1
			this.numFrames = 1
			this.speed = 20
		}



		if (index === 4) {
			// Dragon
			this.width = 188
			this.height = 192
			this.x = x
			this.y = Q.height - 190 - this.height
			this.sourceX = 116
			this.sourceY = 0
			this.sourceWidth = 188
			this.sourceHeight = 192

			this.frame = 0
			this.numFrames = 1
			this.speed = 20
		}

		// this.width *= 0.8
		// this.height *= 0.8

		// this.y += (this.height * 0.25)
	}

	// getMask(x, y, width, height) {
	// 	let canvas = document.createElement('canvas')
	// 	let context = canvas.getContext('2d')
	// 	canvas.width = width
	// 	canvas.height = height
	// 	document.body.appendChild(canvas);
	// 	context.drawImage(this.image, x, y, width, height, 0, 0, width, height)


	// 	let array = []

	// 	for (let x = 0; x < width; x += 1) {
	// 		array[x] = []
	// 		for (let y = 0; y < height; y += 1) {
	// 			let data = context.getImageData(x, y, 1, 1).data
	// 			let value = ' '
	// 			if (data[0] === 255) {
	// 				value = 'x'
	// 			}
	// 			array[x][y] = value
	// 		}
	// 	}

	// 	return array
	// }

	intersectRect(r1, r2) {
		return !(r2.left > r1.right || 
			r2.right < r1.left || 
			r2.top > r1.bottom ||
			r2.bottom < r1.top);
	}

	hittest() {
		let a = {
			x: Q.player.x + Q.player.offsetX,
			y: Q.player.y + Q.player.offsetY,
			height: Q.player.height,
			width: Q.player.width

		}

		let b = this

		let xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x))
		let yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y))

		let minX = Math.min(a.x, b.x)
		let maxX = Math.max(a.x + a.width, b.x + b.width)
		let minY = Math.min(a.y, b.y)
		let maxY = Math.max(a.y + a.height, b.y + b.height)

		let baseX = 0
		let baseY = 0

		if (minX === a.x) {
			baseX = 0
		}else {
			baseX = a.x - b.x
		}

		if (minY === a.y) {
			baseY = 0
		}else {
			baseY = a.y - b.y
		}

		let found = false

		baseX = Math.floor(baseX)
		baseY = Math.floor(baseY)

		for (let x = 0; x < xOverlap; x += 1) {
			for (let y = 0; y < yOverlap; y += 1) {
				if (!found) {
					let char = this.mask[x + baseX][y + baseY]
					if (char === 'x') {
						found = true
					}
				}
			}
		}

		return found

	}

	render(context) {
		if (Q.debug) {
			context.fillStyle = 'rgba(255,0,0,0.1)'
			context.fillRect(this.x, this.y, this.width, this.height)
		}

		
		context.drawImage(this.image, this.sourceX, this.sourceY + (this.sourceHeight * this.frame), this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)

		let test = this.intersectRect({
			left: this.x,
			top: this.y,
			bottom: this.y + this.height,
			right: this.x + this.width
		}, {
			left: Q.player.x + Q.player.offsetX,
			top: Q.player.y + Q.player.offsetY,
			bottom: Q.player.y + Q.player.offsetY + Q.player.height,
			right: Q.player.x + Q.player.width - Q.player.offsetX
		})

		if (test) {
			// Intersecting boundingboxes, check pixels
			let pixelHit = this.hittest()
			if (pixelHit) {
				let event = new CustomEvent('hit', {
					detail: {
						obstacle: this.type
					}
				});
				window.dispatchEvent(event);
			}

		}

		if (this.counter < this.speed) {
			this.counter += 1
		}else {
			this.counter = 0

			if (this.frame < this.numFrames) {
				this.frame += 1
			}else {
				this.frame = 0
			}
		}
	}
}

export default Obstacle