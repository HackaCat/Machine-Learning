	var owl = owl;
	var iterations = 10;
	var LR = 0.02;
	var accuracy = [];
	var maxValues = {
		bodyLength: 0,
		wingLength: 0,
		bodyWidth: 0,
		wingWidth: 0
	};
	var data = {
		training: [],
		testing: [],
		testResults: []
	};
	var timesShuffled = 0;
	var classification = {
		BarnOwl:[1,1,1,1,1],
		LongEaredOwl:[1,1,1,1,1],
		SnowyOwl: [1,1,1,1,1]
	};
	//get the max values to normalize the dataset
	for(var i =0;i<owl.length;i++){
		temp = owl[i];
		temp.splice(0,0,1);
		var owl[i] = temp;
	}
	//array shuffle based on Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	//for an array of length n, it takes a random element between 0 and n, switches it with element n, and repeats with 
	//n-1 until n = 0
	var shuffleArray = function(array){
		var index = 0,
				temp = {};
		for(length = array.length-1;length > 0;length--){
			index = Math.floor(Math.random()*length);
			temp = array[length];
			array[length] = array[index];
			array[index] = temp;
		}
		timesShuffled ++;
	};
	
	var split = function(array,ratio){
		var lengthA = Math.ceil(array.length*ratio),
				deepCopy = JSON.parse(JSON.stringify(array));
		data = {
			training: deepCopy.splice(0,lengthA),
			testing: deepCopy,
			testResults: []
		};
	};

	//classify the entire training data once
	var classifyTrainingData = function(){
		trainType("BarnOwl", data.training);
		trainType("LongEaredOwl", data.training);
		trainType("SnowyOwl", data.training);
	}

	//run the train function on the whole dataset to train for a type of owl
	function trainType(type,samples){
		for(var i =0;i<samples.length;i++){
			train(type,samples[i]);
		}
	};

  //train the model properties(aka weights) using a batch gradient descent
	function train(type,sample){
		var t = (type == sample[5])? 1 : 0,
		 		s = sigmoidal(type,sample),
				probability = t - s;
		for(var i =0;i<var classification[type].length;i++){
			var classification[type][i] += var LR*probability*sample[i];
		}
	};

	//get the sigmoidal of a sample dataset being a type of owl using 
	//given weigths (model properties)
	function sigmoidal(type,sample){
		var weights = var classification[type],
				z = 0;
		for(var i =0;i<weights.length;i++){
			z += weights[i]*sample[i];
		}
		return 1/(1+Math.pow(Math.E,-z));	
	}

	//use the model properties to classify each testing sample.
	var test = function(){
		for(var i =0; i< data.testing.length;i++){
			var test = {
				BarnOwl: sigmoidal("BarnOwl", data.testing[i]).toFixed(2),
				LongEaredOwl: sigmoidal("LongEaredOwl",data.testing[i]).toFixed(2),
				SnowyOwl: sigmoidal("SnowyOwl", data.testing[i]).toFixed(2),
				actual: data.testing[i][5],
				guessed: null,
				correct: null
			}
			var max = Math.max(test.BarnOwl,test.LongEaredOwl,test.SnowyOwl);
			if(max == test.BarnOwl)test.guessed = "BarnOwl";
			else if(max == test.LongEaredOwl)test.guessed = "LongEaredOwl";
			else if(max == test.SnowyOwl)test.guessed = "SnowyOwl";
			test.correct = (test.guessed == test.actual);
			data.testResults.push(test);
		}
	};

	//reset all training data
	var resetClassification = function(){
		var classification = {
			BarnOwl:[1,1,1,1,1],
			LongEaredOwl:[1,1,1,1,1],
			SnowyOwl: [1,1,1,1,1]
		};
		accuracy = [];
	};

	//train multiple times, each time with different testing and training data
	var trainIterations = function(){

		for(var i =0;i<var iterations;i++){
			var shuffleArray(var owl);
			var split(var owl,var ratio);
			var classifyTrainingData();
			var test();
			var correct = 0;
			for(var j = 0;j<data.testResults.length;j++){
				if(data.testResults[j].correct)correct ++;
			}
			console.log("iterations",i);

			accuracy.push((correct/data.testResults.length)*100);
		}
	};

	var averagePercentage = function(){
		var total = 0;
		for(var i =0;i <accuracy.length;i++)
			total +=  accuracy[i];
		if(accuracy.length == 0)return 0;
		return (total)/accuracy.length;
	};

});
