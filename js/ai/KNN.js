class KNN {
	constructor(topK) {
		this.topK = topK;
		this.data = [];
	}

	distance(arrayA, arrayB) {
		let sum = 0;
		arrayA.forEach((value, index) => {
			sum += Math.pow(value - arrayB[index], 2);
		});

		return Math.sqrt(sum);
	}

	updateMax(value, array) {
		let max = 0;

		array.forEach((object) => {
			max = Math.max(max, object.distance);
		});

		return max;
	}

	mode(array) {
		let frequency = {};
		let max = 0;
		let result = null;

		for (let index = 0; index < array.length; index += 1) {
			let id = array[index];
			frequency[id] = (frequency[id] || 0) + 1;
			if (frequency[id] > max) {
				max = frequency[id];
				result = id;
			}
		}

		return result;
	}

	predict(value) {
		let maxDistance = 0;
		let closest = [];
		let votes = [];


		this.data.forEach((object) => {
			let entry = {
				distance: this.distance(value, object.value),
				id: object.id
			};

			if (closest.length < this.topK) {
				closest.push(entry);
				maxDistance = this.updateMax(maxDistance, closest);
			}else if (entry.distance < maxDistance) {
				let bool = true;
				let count = 0;
				while (bool) {
					if (Number(closest[count].distance) === maxDistance) {
						closest.splice(count, 1, entry);
						maxDistance = this.updateMax(maxDistance, closest);
						bool = false;
					}else if (count < closest.length - 1) {
						count += 1;
					}else {
						bool = false;
					}
				}
			}
		});

		closest.forEach((entry) => {
			votes.push(entry.id);
		});

		let prediction = this.mode(votes);

		return {
			prediction: prediction,
			votes: votes
		};
	}

	learn(value, id) {
		this.data.push({
			value: value,
			id: id
		});
	}

	deleteClassData(id) {
		for (let index = this.data.length - 1; index >= 0; index -= 1) {
			let entry = this.data[index];
			if (entry.id === id) {
				this.data.splice(index, 1);
			}
		}
	}
}

export default KNN