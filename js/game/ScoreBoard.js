import Q from './../main.js'
import Number from './Number'


class ScoreBoard {
	constructor() {
		this.image = Q.spriteImage

		this.width = 100
		this.height = 52

		this.x = 14
		this.y = Q.height - this.height - 40

		this.sourceX = 116
		this.sourceY = 1444
		this.sourceWidth = 100
		this.sourceHeight = 52

		this.value = null
		this.numbers = []
		this.numbers.push(new Number(0))
		this.numbers.push(new Number(0))
		this.numbers.push(new Number(0))
		this.numbers.push(new Number(0))

		// this.numbers[0].set(1)
		this.numbers[0].x = this.x + 12
		this.numbers[0].y = this.y + 12

		// this.numbers[1].set(2)
		this.numbers[1].x = this.x + 12 + (this.numbers[1].width * 1)
		this.numbers[1].y = this.y + 12

		// this.numbers[2].set(3)
		this.numbers[2].x = this.x + 12 + (this.numbers[2].width * 2)
		this.numbers[2].y = this.y + 12

		// this.numbers[3].set(4)
		this.numbers[3].x = this.x + 12 + (this.numbers[3].width * 3)
		this.numbers[3].y = this.y + 12
	}

	set(value) {
		this.value = value
		let array = value.toString().split('')
		while (array.length < 4) {
			array.unshift('x')
		}

		
		for (let index = 0; index < 4; index += 1) {
			if (array[3 - index]) {
				this.numbers[3 - index].set(array[3 - index])
			}
		}
	}

	clear() {
		this.value = null
	} 

	render(context) {
		context.drawImage(this.image, this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight, this.x, this.y, this.width, this.height)

		this.numbers.forEach((number) => {
			number.render(context)
		})
	}
}

export default ScoreBoard