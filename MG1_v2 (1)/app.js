
/**** Start Global Variabls ****/
const masterData = {};

// Questions
const questions = [
	{
		template: "How many sales orders were not %S in %M?",
		calculateAnswer: function(s, m){
			// Find the columns in the master data for the status and month
			const statusCol = getNumForColumn("Status");
			const monthCol = getNumForColumn("Month");

			// Convert the month into a number
			const monthToNum = {
				january: 1,
				february: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12
			};

			// From the master data's orders
			return [masterData.orders
			// Keep sales orders from the month that aren't the same satatus
			.filter(order => order[monthCol] == monthToNum[m.toLowerCase()] && order[statusCol] !== s)
			// Count them
			.length];
		}
	},
	{
		template: "Which month had the highest percentage of sales orders paid by %PT?",
		calculateAnswer: function(pt){
			const pmtMethodCol = getNumForColumn("Method of payment" );
			const monthCol = getNumForColumn("Month");

			// Convert the month into a number
			const monthToNum = {
				january: 1,
				february: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12
			};

			// Track each months total orders
			const monthlyTotalOrders = [0,0,0,0,0,0,0,0,0,0,0,0];

			// Track each months orders
			const monthlyOrdersOfPT = [0,0,0,0,0,0,0,0,0,0,0,0];

			// For each order
			masterData.orders.forEach(order => {
				// Get this order's month
				const month = order[monthCol];
				
				// Add one to that month's total count
				monthlyTotalOrders[month]++;
				
				// If the payment method is correct
				if (order[pmtMethodCol] == pt){
					
					// Add one to that month's PT count
					monthlyOrdersOfPT[month]++;
				}
			});

			// Find the highest month
			let highestVal = -1;
			let highestMonth = "";
			// Go through each month
			for (month in monthlyOrdersOfPT){
				// If this month's percentage is the highest one so far
				if (monthlyOrdersOfPT[month] / monthlyTotalOrders[month] > highestVal){
					// Update the counts and month
					highestVal = monthlyOrdersOfPT[month] / monthlyTotalOrders[month];
					highestMonth = month;
				}
			}

			// Return the name of the month
			// For each
			for (month in monthToNum){
				// If the month number is the same
				if (monthToNum[month] == highestMonth){
					// Return the name of the month
					return [month];
				}
			}

			// Otherwise, return nothing
			return [""];
		}
	},
	{
		template: "What was %CN's total sales orders during the first quarter? How many of those sales orders were %S?",
		calculateAnswer: function(cn, s){
			// Get the column numbers
			const cnCol = getNumForColumn("Customer Name");
			const qtrCol = getNumForColumn("Quarter");
			const statusCol = getNumForColumn("Status");

			// From orders
			const orders = masterData.orders
			// Only keep if same customer and in first quarter
			.filter(order => order[cnCol] == cn && order[qtrCol] == "Quarter 1");

			// Add first answer
			let result = [orders.length];

			// add the number of orders that are the correct status
			result.push(
				// From the orders
				orders
				// Keep the ones with the correct status
				.filter(order => order[statusCol] == s)
				// Count them
				.length
			);

			return result;

		}
	},
	{
		template: "Which customer had the lowest total percent of sales that were paid with a form of credit card compared to other payment types?",
		calculateAnswer: function(){
			const cnCol = getNumForColumn("Customer Name");
			const ccCol = getNumForColumn("Credit Card"); // "Other" or "Credit Card"

			const CCByCustomer = {};
			const totalByCustomer = {};

			masterData.orders.forEach(order => {
				// Get customer name
				const name = order[cnCol];
				const cc = order[ccCol];

				// If customer not in the objects yet
				if (!CCByCustomer.hasOwnProperty(name)){
					// Add them
					CCByCustomer[name] = 0;
					totalByCustomer[name] = 0;
				}

				// Add one to this customer's total count
				totalByCustomer[name]++;

				// add one to this customer's cc count if cc
				CCByCustomer[name] += cc == "Credit Card";
			});

			// Find the lowest customer
			let lowestVal = -1;
			let lowestCustomer = "none";
			// Go through each name
			for (name in totalByCustomer){
				// If this name's percentage is the highest one so far
				if (totalByCustomer[name] / CCByCustomer[name] > lowestVal){
					// Update the counts and name
					lowestVal = totalByCustomer[name] / CCByCustomer[name];
					lowestCustomer = name;
				}
			}

			// Return the customer
			return [lowestCustomer];

		}
	},
	{
		template: "For orders with sales amounts between $%SA and $%SA that were placed by corporations, what was the average sales amount and which month had the lowest average sales amount?",
		calculateAnswer: function(sa1, sa2){
			// Get all the columns we'll need to use
			const cnCol = getNumForColumn("Customer Name");
			const monthCol = getNumForColumn("Month");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Keep track of total sales amount
			let totalSalesAmount = 0;
			// Keep track of total sales order count
			let totalSalesCount = 0;
			// Keep track of total sales amount by month
			const salesAmountsByMonth = {};

			// In the orders
			masterData.orders
			// Find the orders for customers with the word "corporation" in their name and the sales amounts in the range
			.filter(order => order[cnCol].toLowerCase().indexOf(" corporation") != -1 && order[salesAmountCol] > sa1 && order[salesAmountCol] < sa2)
			// For each of those orders
			.forEach(order => {
				// Add the total sales amount to the total
				totalSalesAmount += +order[salesAmountCol];
				// Increment the total sales count
				totalSalesCount++;
				// Find the month for this order
				const m = order[monthCol];
				// if the month isn't registered
				if (!salesAmountsByMonth.hasOwnProperty(m)){
					// add the month
					salesAmountsByMonth[m] = [];
				}
				// Add the sales amount to it's month's list
				salesAmountsByMonth[m].push(order[salesAmountCol]);
			});

			const totalAvg = totalSalesCount == 0 ? 0 : totalSalesAmount / totalSalesCount;

			// Find the month with the lowest average sales amount
			// Keep track of the lowest month
			let lowestMonth = "none";
			// Keep track of the lowest Avg
			let lowestAvg = 999999999;
			// For each month
			for (month in salesAmountsByMonth){
				// Sum the month
				const sum = salesAmountsByMonth[month].reduce((acc, amt) => +amt + acc, 0);
				// Get this month's average
				const avg = sum / salesAmountsByMonth[month].length;
				// If the average is the lowest so far
				if (avg < lowestAvg){
					// Update the lowest
					lowestAvg = avg;
					lowestMonth = month;
				}
			}

			// Convert the month number to a string
			const monthNumToStr = {
				1: "january",
				2: "february",
				3: "march",
				4: "april",
				5: "may",
				6: "june",
				7: "july",
				8: "august",
				9: "september",
				10: "october",
				11: "november",
				12: "december"
			}

			return [totalAvg, monthNumToStr[lowestMonth]];
		}
	},
	{
		template: "Which customer in %IS, paying by %PT, had the highest cumulative sales amount from orders that occurred during the last 5 days of %M?",
		calculateAnswer: function(is, pt, m){
			// Get the columns we'll need to use
			const isCol = getNumForColumn("Industry Sector");
			const daysInMonthCol = getNumForColumn("Days of Month"); // Days in month
			const dayOfMonthCol = getNumForColumn("Day");
			const ptCol = getNumForColumn("Method of payment");
			const mCol = getNumForColumn("Month");
			const customerCol = getNumForColumn("Customer Name");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Convert month m into a number
			const monthToNum = {
				january: 1,
				february: 2,
				march: 3,
				april: 4,
				may: 5,
				june: 6,
				july: 7,
				august: 8,
				september: 9,
				october: 10,
				november: 11,
				december: 12
			};
			m = monthToNum[m.toLowerCase()];
			
			// Map to store each customer's sales
			cumulativeSalesAmountByCustomer = {};

			// For each order
			masterData.orders
			// Only keep orders with the correct industry sector, Payment type, month, and day is last five
			.filter(order => {
				const cuttoffDay = +order[daysInMonthCol] - 5;
				return order[isCol] == is &&
					   order[ptCol] == pt &&
					   order[mCol] == m &&
					   order[dayOfMonthCol] >= cuttoffDay;
			})
			// For each of the remaining orders
			.forEach(order => {
				// Find the customer
				const customer = order[customerCol];

				// If the customer hasn't been registered yet
				if (!cumulativeSalesAmountByCustomer.hasOwnProperty(customer)){
					// add it
					cumulativeSalesAmountByCustomer[customer] = 0;
				}

				// Add the sales amount to this customer's sum (cast as number)
				cumulativeSalesAmountByCustomer[customer] += +order[salesAmountCol];
			});

			// Find the greatest sales amount
			let highestSalesAmount = -1;
			let highestCustomer = "none";
			// For each customer
			for (customer in cumulativeSalesAmountByCustomer){
				// If they have a higher sum
				if (cumulativeSalesAmountByCustomer[customer] > highestSalesAmount){
					// Update the highest ones
					highestSalesAmount = cumulativeSalesAmountByCustomer[customer];
					highestCustomer = customer;
				}
			}

			return [highestCustomer];
		}
	},
	{
		template: "Which customer in %IS, paying by %PT, had the highest cumulative sales amount from orders that occurred during the last 10 days of %Q?",
		calculateAnswer: function(is, pt, q){
			// Get the columns we'll need to use
			const isCol = getNumForColumn("Industry Sector");
			const daysInMonthCol = getNumForColumn("Days of Month"); // Days in month
			const dayOfMonthCol = getNumForColumn("Day");
			const ptCol = getNumForColumn("Method of payment");
			const mCol = getNumForColumn("Month");
			const customerCol = getNumForColumn("Customer Name");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Convert quarter number to last month of that quarter
			const lastMonthOfQtr = {
				"Quarter 1": 3, // March
				"Quarter 2": 6, // June
				"Quarter 3": 9, // September
				"Quarter 4": 12,// December
			}
			const m = lastMonthOfQtr[q];
			
			// Map to store each customer's sales
			cumulativeSalesAmountByCustomer = {};

			// For each order
			masterData.orders
			// Only keep orders with the correct industry sector, Payment type, month (last of quarter), and day is last ten
			.filter(order => {
				const cuttoffDay = +order[daysInMonthCol] - 10;
				return order[isCol] == is &&
					   order[ptCol] == pt &&
					   order[mCol] == m &&
					   order[dayOfMonthCol] >= cuttoffDay;
			})
			// For each of the remaining orders
			.forEach(order => {
				// Find the customer
				const customer = order[customerCol];

				// If the customer hasn't been registered yet
				if (!cumulativeSalesAmountByCustomer.hasOwnProperty(customer)){
					// add it
					cumulativeSalesAmountByCustomer[customer] = 0;
				}

				// Add the sales amount to this customer's sum (cast as number)
				cumulativeSalesAmountByCustomer[customer] += +order[salesAmountCol];
			});

			// Find the greatest sales amount
			let highestSalesAmount = -1;
			let highestCustomer = "none";
			// For each customer
			for (customer in cumulativeSalesAmountByCustomer){
				// If they have a higher sum
				if (cumulativeSalesAmountByCustomer[customer] > highestSalesAmount){
					// Update the highest ones
					highestSalesAmount = cumulativeSalesAmountByCustomer[customer];
					highestCustomer = customer;
				}
			}

			return [highestCustomer];
		}
	},
	{
		template: "How many customers make up the top %X percent of %IS customers by number of sales orders?",
		calculateAnswer: function(x, is){
			// Get the columns we'll need to use
			const isCol = getNumForColumn("Industry Sector");
			const customerCol = getNumForColumn("Customer Name");
			
			// Map of each customer's sales counts
			const salesOrdersCountByCustomer = {};
			let totalSalesOrders = 0;

			// For each order
			masterData.orders
			// Only keep orders with the correct industry sector
			.filter(order => order[isCol] == is)
			// For each of the remaining orders
			.forEach(order => {
				// Find the customer
				const customer = order[customerCol];

				// If the customer hasn't been registered yet
				if (!salesOrdersCountByCustomer.hasOwnProperty(customer)){
					// add it
					salesOrdersCountByCustomer[customer] = 0;
				}

				// Increment the sales order count for this customer
				salesOrdersCountByCustomer[customer]++;
				// Increment total sales order count
				totalSalesOrders++;
			});

			// Convert sales count map to ordered list
			let orderedListOfSales = [];
			// For each customer
			for (customer in salesOrdersCountByCustomer){
				// And add it to the list
				orderedListOfSales.push(salesOrdersCountByCustomer[customer])
			}

			// Sort list greatest to least
			orderedListOfSales = orderedListOfSales.sort((a, b) => {
				return b - a;
			})

			// Calculate top % sum needed
			// Use ceiling because you need another sale to gain a fraction
			const threshold = Math.ceil(totalSalesOrders * (x / 100.0));

			let rollingSum = 0;
			let customerCount = 0;
			// While we haven't hit that threshold and we still have customers on the list
			while (rollingSum < threshold && customerCount < orderedListOfSales.length - 1){
				// Add more customers to that sum
				rollingSum += orderedListOfSales[customerCount];
				customerCount++;
			}

			return [customerCount];
		}
	},
	{
		template: "For company %C, which primary industry had the highest deviation from their average sales amount (Postive or negative)?",
		calculateAnswer: function(c){
			// Get the columns for the data we need
			const piCol = getNumForColumn("Primary Industry");
			const cCol = getNumForColumn("Company");
			const salesAmountCol = getNumForColumn("Sales Amount");

			// Variables to store our data
			const allSalesAmounts = [];
			const salesAmountsByPI = {};

			// Keep the orders for this company
			masterData.orders.filter(order => order[cCol] == c)
			// For each order
			.forEach(order => {
				// add the sales amount to the all array
				allSalesAmounts.push(order[salesAmountCol]);

				const pi = order[piCol];
				// If Primary industry isn't registered yet, add it
				if (!salesAmountsByPI.hasOwnProperty(pi)){
					salesAmountsByPI[pi] = [];
				}

				// add the sales amount to an array for this primary industry
				salesAmountsByPI[pi].push(order[salesAmountCol]);

			});

			// Find the average for all
			// Find the sum
			const allAvg = allSalesAmounts.reduce((acc, el) => acc + el, 0) / allSalesAmounts.length;

			let largestDev = -1;
			let targetPI = "";
			// For each primary industry
			for (pi in salesAmountsByPI){
				// Find the average
				const avg = salesAmountsByPI[pi].reduce((acc, el) => acc + el, 0) / salesAmountsByPI[pi].length;
				// Find the deviation
				const dev = Math.abs(allAvg - avg);
				// If furthest away so far
				if (dev > largestDev){
					// Record this one
					largestDev = dev;
					targetPI = pi;
				}
			}

			return [targetPI];
		}
	},
	{
		template: "How many customers had at least one sales order with each of the following companies: %C, %C, and %C?",
		calculateAnswer: function(c1, c2, c3){
			// Get the column numbers that we'll need
			const cCol = getNumForColumn("Company");
			const customerCol = getNumForColumn("Customer Name");

			// Keep track of companies by customer
			companiesByCustomer = {};

			// for each order
			masterData.orders.forEach(order => {
				const company = order[cCol];
				const customer = order[customerCol];

				// If customer isn't registered
				if (!companiesByCustomer.hasOwnProperty(customer)){
					// Add it
					companiesByCustomer[customer] = {};
				}

				// If this company isn't registered for this company
				if (!companiesByCustomer[customer].hasOwnProperty(company)){
					// add it
					companiesByCustomer[customer][company] = true;
				}
				// If it has been registered, we're done
			});

			// Keep track of how many customers had sales with all three
			let customerCount = 0;

			// For each customer
			for (customer in companiesByCustomer){
				// Increment if it has all three companies
				// Cast everything as boolean (1 or 0)
				customerCount += !!companiesByCustomer[customer][c1] &&
								 !!companiesByCustomer[customer][c2] &&
								 !!companiesByCustomer[customer][c3];
			}

			return [customerCount];
		}
	}
];

// Parameter options
const parameters = {};

/**** End Global Variabls ****/



/**** Start Helper Functions ****/

// Helpful query functions
$ = (q, el) => (el || document).querySelector(q);
$a = (q, el) => Array.from((el || document).querySelectorAll(q));

// Returns a number as a string and adds a leading zero if needed
function leadingZero(num){
	return (num < 10 ? "0" : "") + num;
}

// Convert a number of seconds to a time string
function secToTime(num){
	// Make sure num is rounded

	// How many seconds in the minute
	const s = leadingZero(num % 60);

	// Subtract the seconds
	num -= s;
	// Convert to minutes
	num /= 60;
	// How many minutes in this hour
	const m = leadingZero(num % 60);

	// subtract the minutes
	num -= m;
	// Convert to hours
	num /= 60;
	// How many hours
	const h = leadingZero(num);

	return `${h}:${m}:${s}`;
}

// Rounds a number to the number of decimal places
function round(num, places){
	const mod = Math.pow(10, places);
	return (~~(num*mod))/(mod);
}

// Turns a number into a money format without any cents
function toMoney(num){
	// Turn into string with no decimals
	let str = num.toFixed(0);

	// If it has a thousands place
	if (str.length > 3){
		// add the comma
		str = str.substring(0, str.length - 3) + "," + str.slice(str.length - 3);
	}

	// If it has a millions place
	if (str.length > 7){
		// add the comma
		str = str.substring(0, str.length - 7) + "," + str.slice(str.length - 7);
	}

	return str;
}
/**** End Helper Functions ****/



/**** Start Importing Data ****/
// Get the parameters data
fetch("parameters.csv")
// turn into text
.then(resp => resp.text())
// Split into rows
.then(csv => csv.split("\n"))
// Split the rows into columns
.then(rows => {
	return rows
	// Split each row at the commas that are followed by letters, new lines, or ends of string
	.map(row => row.split(/,(?=\S|\n|$)/));
})
// Turn the rows into the paremeters data
.then(rows => {
	// Get the first row (tags)
	let tags = rows.shift()
	// Make sure each one is clean
	.map(tag => tag.trim());

	// Get the second row (tag type)
	let types = rows.shift()
	// Make sure each one is clean
	.map(type => type.trim());

	// Add each tag to the parameters
	tags.forEach((tag, i) => {
		// create the object with a type and array for data
		parameters[tag] = {
			type: types[i],
			options: []
		};
	})

	// Transfer data to parameters object
	// For each row
	rows.forEach(row => {
		// for each column
		row.forEach((column, i) => {
			// find the tag for this column
			let tag = tags[i];
			// Clean up the column if it has quotes
			column = (column[0]=="\"") ? column.slice(1, column.length-2) : column;
			// Add the data if it exists
			if (column !== ""){
				parameters[tag].options.push(column);
			}
		});
	});
})
.then( () => {
	// Done importing the parameter data
});


// Get the master data
fetch("data.csv")
// turn into text
.then(resp => resp.text())
// Split into rows
.then(csv => csv.split("\n"))
// Split the rows into columns
.then(rows => {
	return rows
	// Split each row at the commas
	.map(row => row.split(/,(?=\S|\n|$)/));
})
// Turn the rows into the master data
.then(rows => {
	// Use the first line as the column names
	masterData.columnNames = rows.shift()
	
	// Clean up each data point
	// For each row
	rows.forEach((row, rowIndex) => {
		// for each column
		row.forEach((column, colIndex) => {
			// If it has quotes
			if (column[0]=="\"") {
				// Clean it up
				rows[rowIndex][colIndex] = column.slice(1, column.length-1);
			}
		});
	});

	// Use the rest of the rows as the data
	masterData.orders = rows
	// remove any rows that are "empty"
	.filter(row => row.length != 1)
})
.then(() => {
	// Show that data is done loading
	btn_start.disabled = false;
})
/**** End Importing Data ****/



/**** Start Business Logic ****/
function getNumForColumn(name){
	return masterData.columnNames.reduce((res, e, i) => e == name ? i : res)
}


// Make it so I can use regex while finding the index of a match
String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

// returns whether or not the first parameter is greater that the second
function paramGT(p1, p2){
	// If params are numbers (not not-a-number)
	if (!isNaN(+p1)){
		return +p1 > +p2;
	}

	// if params are dates (month is not not-a-number)
	if (!isNaN((new Date(p1)).getMonth())) {
		return new Date(p1) > new Date(p2);
	}

	// if params are months
	const months = ",january,february,march,april,may,june,july,august,september,october,november,december,";
	if (months.indexOf(`,${p1.toLowerCase()},`) != -1){
		return months.indexOf(p1.toLowerCase()) > months.indexOf(p2.toLowerCase());
	}

	// If params aren't ordinal, just return false
	return false;
}

function getNewQuestion(){
	// select question
	const q = questions[~~(questions.length * Math.random())];
	//const q = questions[5];

	let filled = "" + q.template;
	let tags = [];
	let parameters = [];
	let start = -1;

	// Find all of the tags
	while ((start = filled.indexOf("%", start + 1)) !== -1){
		// find the end of the parameter (after the start)
		const end = filled.regexIndexOf(/\W/, start + 1);
		// Get the tag from the filled string
		const tag = filled.slice(start + 1, end);
		tags.push(tag);
		// Get a value for that parameter
		const parameter = getRandomParameterValue(tag);
		parameters.push(parameter);
	}

	// make sure that any duplicate tags are in ascending order and no duplicates
	// For each tag
	tags.forEach((tag1, i) => {
		// Keep track of values for this tag
		tagValues = {};
		tagValues[parameters[i]] = true;

		// Compare against every other tag
		tags.forEach((tag2, j) => {
			// If this tag is in front of this one and the same type
			if (j > i && tag1 == tag2){
				// If the first param is Greater Than the second
				if (paramGT(parameters[i], parameters[j])){
					// Swap the values
					const temp = parameters[i];
					parameters[i] = parameters[j];
					parameters[j] = temp;
				}

				// While the second param already exists
				while (tagValues.hasOwnProperty(parameters[j])){
					// Get a new second param value
					parameters[j] = getRandomParameterValue(tag2);
				}

				// register second tag value
				tagValues[parameters[j]] = true;
			}
		})
	});

	// Add the params to the string
	// For each tag
	tags.forEach((tag, i) => {
		// Alter/clean the text if needed
		let text = parameters[i];

		// Make sure sales amounts (SA) are in money format
		if (tag == "SA"){
			text = toMoney(text);
		}
		// Find it in the string and replace it with the parameter
		filled = filled.replace(`%${tag}`, `<b>${text}</b>`);
	})

	return {
		question: filled,
		answer: q.calculateAnswer(...parameters)
	};
}


// Returns a value from the parameters set of options or within its range
function getRandomParameterValue(tag){
	// Make sure tag exists
	if (!parameters.hasOwnProperty(tag)){
		throw new Error(`Parameter tag does not exist: ${tag}`);
	}

	// Decide what to do based on the tag type
	switch (parameters[tag].type){
		// If the tag is a discrete set of options
		case "discrete":
			// return a random option (make sure it doesn't have any extra white space before or after)
			return parameters[tag].options[~~(parameters[tag].options.length*Math.random())].trim();

		// If the tag is a range
		case "range":
			// Find upper and lower bounds ('+' operator converts to number)
			const lower = +parameters[tag].options[0];
			const upper = +parameters[tag].options[1];
			// Pick a number in the range and round down to the nearest integer
			return ~~(lower + (upper - lower)*Math.random());
		
		// Some other type
		default:
			throw new Error(`Tag type not known: ${parameters[tag].type}`);
			break;
	}
}
/**** End Business Logic ****/



/**** Start Game Variables ****/
// Keep track of scores in one place
const scores = {
	gameStartTime: 0,
	roundStartTime: 0,
	roundTime: 0,
	gameTime: 0,
	roundsCompleted: 0
}

let currentQuestion = null;

// Set some options for our current game state
const stateOptions = {
	beforeGame: 0,
	inGame: 1,
	gameOver: 2
}
let gameState = stateOptions.beforeGame;

// Have 3 different game modes
let gamemodes = {
	casual: "casual",
	rounds: "rounds",
	countdown: "countdown"
}
gamemode = "casual";

let gamemodeDescriptions = {};
gamemodeDescriptions[gamemodes.casual] = "Keep answering questions forever and see your average time per round.";
gamemodeDescriptions[gamemodes.rounds] = "See how fast you can correctly answer 10 questions.";
gamemodeDescriptions[gamemodes.countdown] = "See how many questions you can correctly answer in 3 minutes.";
countdownTimeLimit = 5; // s
roundLimit = 10; // rounds

// Functions to check if the game is over based on the gamemode
let gameOverChecks = {};

// Functions to display the score based on gamemode
let displayScores = {};

// Keep track of game tick interval
let gameTickInterval = 0;
const gameTickDur = 100; // ms

/**** End Game Variables ****/



/**** Start DOM Variabls ****/
// Gamemode Selector
const select_gamemode = document.getElementById("gamemode");
const div_gamemodeDescription = document.getElementById("gamemodeDescription");

// Start/Next buttons
const btn_start = document.getElementById("start");
const div_buttonHolder = document.getElementById("buttonHolder");

// QnA display
const div_QnAHolder = document.getElementById("QnAHolder");
const div_question = document.getElementById("question");
const div_answers = document.getElementById("answers");
const div_a1Holder = document.getElementById("a1Holder")
const inp_a1 = document.getElementById("a1");
const div_a2Holder = document.getElementById("a2Holder")
const inp_a2 = document.getElementById("a2");
const btn_submit = document.getElementById("submit");
const div_result = document.getElementById("result");
const div_correct = document.getElementById("correct");
const div_incorrect = document.getElementById("incorrect");

// Score display
const div_roundTime = document.getElementById("roundTime");
const div_gameTime = document.getElementById("gameTime");
const div_roundsCompleted = document.getElementById("roundsCompleted");
const div_avgTimePerRound = document.getElementById("avgTimePerRound");
/**** End DOM Variabls ****/



/**** Start DOM Events ****/
select_gamemode.onchange = function(){
	// Quick make sure gamemode exists
	if (!gamemodes.hasOwnProperty(select_gamemode.value)){
		throw new Error(`Gamemode does not exist: ${select_gamemode.value}`);
	}

	// Update gamemode and description
	gamemode = gamemodes[select_gamemode.value];
	div_gamemodeDescription.innerText = gamemodeDescriptions[gamemode]

	// Show or hide average time depending on if casual or not
	if (gamemode == gamemodes.casual){
		$a(".avgTimePerRound").forEach(el => el.classList.remove("hidden"))
	} else {
		$a(".avgTimePerRound").forEach(el => el.classList.add("hidden"))
	}

};
// Update the gamemode display
select_gamemode.onchange();

// Start the game
btn_start.onclick = function(){

	// Hide the start button
	div_buttonHolder.classList.add("hidden");

	// unhide the next button (it's disabled by default, don't worry)
	div_QnAHolder.classList.remove("hidden");

	startGame();
}

// Handle pressing enter on an input
$a("#answers input")
.forEach(inp => {
	inp.onkeypress = e => {
		// If user pressed enter
		if (e.keyCode == 13){
			checkAnswer();
		}
	};
});
/**** End DOM Events ****/



/**** Start Game Logic ****/

// Set the game over checks
// Casual games don't end
gameOverChecks[gamemodes.casual] = function(){
	return false;
}
// Rounds end after 10 rounds
gameOverChecks[gamemodes.rounds] = function(){
	return scores.roundsCompleted >= roundLimit;
}
// Countdown end after 3 minutes (180 seconds)
gameOverChecks[gamemodes.countdown] = function(){
	return scores.gameTime >= countdownTimeLimit; // seconds
}


// Set the score displays
// Casual shows everything
displayScores[gamemodes.casual] = function(){
	div_roundTime.innerText = secToTime(scores.roundTime);
	div_gameTime.innerText = secToTime(scores.gameTime);
	div_roundsCompleted.innerText = scores.roundsCompleted;

	// Get average time per round
	const avgTime = round(scores.gameTime / scores.roundsCompleted, 2);
	div_avgTimePerRound.innerText = secToTime(avgTime);
}
// Rounds end after 10 rounds
displayScores[gamemodes.rounds] = function(){
	div_roundTime.innerText = secToTime(scores.roundTime);
	div_gameTime.innerText = secToTime(scores.gameTime);
	div_roundsCompleted.innerText = scores.roundsCompleted;
}
// Countdown end after 3 minutes (180 seconds)
displayScores[gamemodes.countdown] = function(){
	div_roundTime.innerText = secToTime(scores.roundTime);
	div_gameTime.innerText = secToTime(countdownTimeLimit - scores.gameTime);
	div_roundsCompleted.innerText = scores.roundsCompleted;
}



function startGame(){
	// If we are already playing
	if (gameState == stateOptions.inGame){
		// Don't do anything
		return;
	}

	// reset the scores
	scores.roundTime = 0;
	scores.roundsCompleted = 0;
	scores.gameTime = 0;

	// Disable the ability to change the gamemode
	select_gamemode.disabled = true;

	// Get the current time
	const now = ~~(Date.now()/1000);
	scores.gameStartTime = now;
	scores.roundStartTime = now;

	// Update the display
	displayScores[gamemode]();

	// Get the next question
	showNextQuestion();	

	// Start checking game score and updating everything a bunch
	startGameTick();
}

function showNextQuestion(){
	// Get a question
	currentQuestion = getNewQuestion();

	// Display the question
	div_question.innerHTML = currentQuestion.question;

	// Display the number of answer inputs we need
	if (currentQuestion.answer.length == 1){
		div_a2Holder.classList.add("hidden");
	} else {
		div_a2Holder.classList.remove("hidden");
	}

	// Clear out the input values;
	inp_a1.value = "";
	inp_a2.value = "";

	// Focus the first input
	inp_a1.focus();

	// Reset round time
	const now = ~~(Date.now()/1000);
	scoresroundStartTime = now;
}

function updateScores(){
	// Get the current time
	const now = ~~(Date.now()/1000)

	// update the times
	scores.roundTime = now - scores.roundStartTime;
	scores.gameTime = now - scores.gameStartTime;

	// Update the display
	displayScores[gamemode]();
}

function checkAnswer(){
	// Get values, clean them
	const vals = [];
	vals.push(inp_a1.value.trim());
	vals.push(inp_a2.value.trim());

	// Compare against the answer for the question
	let allCorrect = true;
	currentQuestion.answer
	.forEach((a, i) => {
		// If the value might be a dollar amount (we know the question is the only one with a "$")
		// And this answer is a number
		if (currentQuestion.question.indexOf("$") != -1 && !isNaN(a)){
			// If they aren't within a dollar (because rounding)
			if (Math.abs(a - +vals[i]) > 1){
				// Answer is wrong
				allCorrect = false;
			}
		}
		// If the answer is different or empty
		else if (("" + a).toLowerCase() != vals[i].toLowerCase() || vals[i] === ""){
			// Answer is wrong
			allCorrect = false;
		}
	})

	// If nothing is wrong
	// User got the question correct
	if (allCorrect){
		// Tell the user they got the answer correct
		showCorrect();
		// Increment how many rounds have been completed
		scores.roundsCompleted++;
		// Move on to the next question
		showNextQuestion();
	} else {
		// User got the question wrong
		// Tell the user they got the answer wrong
		showIncorrect();
	}
}
btn_submit.onclick = checkAnswer;

function startGameTick(){
	gameTickInterval = setInterval(gameTick, gameTickDur);
}

function gameTick(){
	// Update the scoreboard
	updateScores();

	// If the game is over
	if (gameOverChecks[gamemode]()){
		endGame();
	}
}

function stopGameTick(){
	clearInterval(gameTickInterval);
}

function showCorrect(){
	div_correct.classList.remove("hidden");
	div_incorrect.classList.add("hidden");
}

function showIncorrect(){
	div_correct.classList.add("hidden");
	div_incorrect.classList.remove("hidden");
}

function showGameOver(){
	// Hide the QnA section
	div_QnAHolder.classList.add("hidden");

	// Unhide the start button
	div_buttonHolder.classList.remove("hidden");

	// Undisable the gamemode selector
	select_gamemode.disabled = false;

}

function endGame(){
	// Stop ticking
	stopGameTick();
	// Show that the game is over
	showGameOver();
}
/**** End Game Logic ****/