//single dataset generator function
//feed to nn
//compare results

//multiple datasets generator function
//feed to nn
//check average
//merge results in "clusters"
//compare results

function * generateWeightDataSet(max, dimensionCount = 1) {

   for (let i = 0; i < max; i++) {
		if (dimensionCount <= 1) {
			let random = Math.random();
			if (Number(random.toFixed(1)) === 0) {
				return 0;
			} else if (random) {
				if (Math.round(Math.random())) {
					return Number((random).toFixed(1));
				} else {
					return Number((random * -1).toFixed(1));
				}
			}
		} else {
			return [...generateWeightDataSet(max, dimensionCount-1)];
		}
   }
}

function * generateInputDataSet(max, dimensionCount = 1) {
   for (let i = 0; i < max; i++) {
		yield dimensionCount <= 1 ? Math.round(Math.random()) : [...generateInputDataSet(max, dimensionCount-1)];
   }
}

const dataset = {
	"userdata": [
		{
			"userID": 1208,
			"highConversionRate": {
				"relevant": [],
				"related": [],
				"complementary": [],
				"similar": [],
			},
			"userInteractionInfo": [
				{
					"ItemID": 2455,
					"interactionID": 827,
					"interactionInfo": [
						{
							"purchase": {
								"hasAdd": true,
								"weight": 3,
							},
							"cart": {
								"hasAdd": true,
								"weight": 3,
							},
							"favorite": {
								"hasAdd": true,
								"weight": 3,
							},
							"share": {
								"hasAdd": true,
								"weight": 3,
							},
							"like": {
								"hasAdd": true,
								"weight": 3,
							},
							"viewPortion": {
								"hasAdd": true,
								"weight": 3,
							},
							"comment": {
								"hasAdd": true,
								"weight": 3,
							}
						}
					]
				}
			],
		}
	],
};

console.log(JSON.stringify(dataset))

const generateDataSet = (times, sampleLenght, sampleDepth, inputsFunction, weightsFunction) => {
	let data = {
		inputs: [],
		weights: []
	};
	for (i = 0; i < times; i++) {
		data.inputs[i] = [...inputsFunction(sampleLenght, sampleDepth)];
		data.weights[i] = [...weightsFunction(sampleLenght, sampleDepth)];
	}
	return data;
}

const checkIsArray = (variable) => {
	return (Array.isArray(variable) && variable.length > 0);
}

const isActivate = (sum) => {
	let threshold = 0;
	if (sum > threshold) {
		return true;
	} else if (sum < threshold) {
		return false;
	} else {
		if (Math.round(Math.random())) {
			return true;
		} else {
			return false;
		}
	}
};

const boolToInput = (dataArray) => {
	let data = [];
	if (checkIsArray(dataArray)) {
		for (i = 0; i < dataArray.length; i++) {
			if (checkIsArray(dataArray[i])) {
				boolToInput(dataArray[i]);
			} else {
				if (dataArray[i]) {
					data[i] = true;
				} else {
					data[i] = false; 
				}
			}
		}
	}
	return data;
}

const getAverageThresholds = (weights) => {
	let avarages = [];
	for (let i = 0; i < weights.length; i++) {
		let count = [];
		count = 0;
		let sum = [];
		sum[i] = 0;
		if (checkIsArray(weights[i])) {
			count = weights[i].length;
			for (let j = 0; j < count; j++) {
				sum[i] += weights[i][j];
			}
		} else {
			count = weights.length;
			sum[i] += weights[i];
		}
		avarages[i] = 0;
		avarages[i] = sum[i] / count;
	}
	return avarages;
};

const Neuron = (inputs, weights) => {
	let sum = 0;
	for (let i = 0; i < inputs.length; i++) {
		sum += inputs[i] * weights[i];
	}
	sum = isActivate(sum);
	return sum;
};

const NeuralLayer = (inputs, weights) => {
	let active = [];
	let sum = [];
	for (let i = 0; i < inputs.length; i++) {
		sum[i] = 0;
		if (checkIsArray(inputs[i]) && checkIsArray(weights[i])) {
			for (let j = 0; j < inputs[i].length; j++) {
				sum[i] += inputs[i][j] * weights[i][j];
				active[i] = isActivate(sum[i]);
			}
		} else {
			sum[i] += inputs[i] * weights[i];
			active[i] = isActivate(sum[i]);
		}
	}
	return active;
}

const RecursiveLayers = (inputs, weights) => {
	let guess;
	let finalWeight;
	if (checkIsArray(inputs) && checkIsArray(weights)) {
		inputs.map((item, index) => {
			guess = NeuralLayer(item, weights[index]);
			finalWeight = weights[index];
		});
		guess = Neuron(boolToInput(guess), getAverageThresholds(finalWeight));
	}
	return guess;
}

const runTest = () => {
	let k = 0;
	let totalValidCount = 0;
	let totalInvalidCount = 0;
	let results = [];
	while (k < 100) {
		var x = 0;
		var valid = 0;
		var invalid = 0;

		while (x < 10000) {
			const inputs = generateDataSet(2, 2, 2, generateInputDataSet, generateWeightDataSet).inputs;

			const weights = generateDataSet(2, 2, 2, generateInputDataSet, generateWeightDataSet).weights;

			RecursiveLayers(inputs, weights) ? valid++ : invalid++;
			x++;
		}
	
		console.log("Data Set " + k + ":");
		console.log("valid: " + valid);
		console.log("invalid: " + invalid);
		results.push(valid > invalid);
		console.log("result: " + (valid > invalid));
		totalValidCount += valid;
		totalInvalidCount += invalid;
		k++;
	}
	
	console.log("results: " + results);
	console.log("total valid: " + totalValidCount);
	console.log("total invalid: " + totalInvalidCount);
	console.log("final result: " + (totalValidCount > totalInvalidCount));
	const diff = totalValidCount > totalInvalidCount ? (totalValidCount - totalInvalidCount) : (totalInvalidCount - totalValidCount);
	console.log("difference: " + diff);
}

//runTest();