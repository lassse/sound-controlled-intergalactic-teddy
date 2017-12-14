import TweenMax from 'gsap'
import Q from './../main.js'
import Obstacle from './Obstacle'

class Section {
	constructor(x, noMonsters) {
		this.image = Q.spriteImage
		this.x = x
		this.y = Q.height - 108
		this.width = 1400
		this.height = 196

		this.sourceX = 428
		this.sourceY = 0
		this.sourceWidth = 1400
		this.sourceHeight = 196

		this.obstacles = []

		let numObstacles = Math.floor(Math.random() * 2) + 1
		// let numObstacles = 10
		let basePosition = this.x

		if (noMonsters) {
			basePosition = 500
			numObstacles = 0
		}

		for (let index = 0; index < numObstacles; index += 1) {
			let type = Math.floor(Math.random() * 5)
			// let position = basePosition + Math.floor(Math.random() * (300 * index)) + ((Math.random() * 100) + (300 * index))
			// if (position + 150 < this.width) {
			// 	let obstacle = new Obstacle(type, position)
			// 	this.obstacles.push(obstacle)
			// }
			let position = basePosition + (Math.random() * 150)
			// let position = basePosition + 100
			if (position + 200 - this.x < this.width - 100) {
				let obstacle = new Obstacle(type, position)
				this.obstacles.push(obstacle)
				basePosition += position + 200 + obstacle.width
			}
		}
	}

	render(context) {
		context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)

		this.obstacles.forEach((obstacle) => {
			obstacle.x -= Q.speed
			obstacle.render(context)
		})

		if (this.obstacles[0] && this.obstacles[0].x + this.obstacles[0].width < 0) {
			this.obstacles.shift()
		}
	}
}

export default Section