import Game from './game/Game.js'
let Q = {}

function getMask(x, y, width, height) {
	let canvas = document.createElement('canvas')
	let context = canvas.getContext('2d')
	canvas.width = width
	canvas.height = height
	document.body.appendChild(canvas);
	context.drawImage(Q.spriteImage, x, y, width, height, 0, 0, width, height)
	let array = []

	for (let x = 0; x < width; x += 1) {
		array[x] = []
		for (let y = 0; y < height; y += 1) {
			let data = context.getImageData(x, y, 1, 1).data
			let value = ' '
			if (data[0] === 255) {
				value = 'x'
			}
			array[x][y] = value
		}
	}

	document.body.removeChild(canvas)
	
	return array
}

function spriteImageLoaded() {
	// Get masks
	Q.masks = []
	Q.masks[0] = getMask(464, 1878, 156, 72) // Slime monster
	Q.masks[1] = getMask(286, 1834, 168, 116) // Flying saucer
	Q.masks[2] = getMask(630, 1870, 104, 80) // Pink Snake
	Q.masks[3] = Q.masks[2] // Yellow Snake
	Q.masks[4] = getMask(88, 1758, 188, 192) // Dragon
	Q.GAME = new Game()
}

function doubleClick(event) {
	if (document.webkitIsFullScreen) {
		document.webkitExitFullscreen()
	}else {
		document.body.webkitRequestFullscreen()
	}
}

function init() {
	Q.width = 720
	Q.height = 576
	Q.spriteImage = new Image() 
	Q.spriteImage.addEventListener('load', spriteImageLoaded);
	Q.spriteImage.src = './assets/sprite.png'
	window.addEventListener('dblclick', doubleClick);
}

window.addEventListener('load', init)

export default Q