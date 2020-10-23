/**
 * This script generates a random CSV of a Verizon Phone Bill.
 * 
 * This script also validates that the user input matches the backend calculations.
 * 
 * HTML will display 'Correct!' if entire journal entry is correct.
 * HTML will display an error message hinting at the column with the mistake if incorrect.
 * 
 * Created for PwC 
 * FE Digital Camp
 * Mini Game 2: Verizon Bill Journal Entry Creation
 * 
 * @author Ray DiPretoro <raymond.a.dipretoro@pwc.com>
 * @version 1.0 10/22/20
 */

var timerVar;
var charges = generateCharges();
var elements = []; //creating array to store each element in an object
var answer = []; //creating array to store the correct answer
var lines = [{
   'cost_center': 'Cost Center',
   'employee': 'Number / User Name',
   'monthly': 'Monthly Access Charges',
   'usage': 'Usage Charges',
   'equipment': 'Equipment Charges',
   'surcharge': 'VZW Surcharges and Other Charges and Credits',
   'taxes': 'Taxes Governmental Surcharges and Fees',
   'thirdParty': 'Third Party Charges (Includes Tax)',
   'total': 'Total Charges'
}];
var totalItems = generateTotalCharges(charges);
var gameHasStarted = false; //set to false before the game begins 
var dataGenerated = false;
var total = 0;
var roundNum = 1;
var correctAnswer = false;
//generate unique date in 2020
var start = new Date(2020, 0, 1);
var end = new Date();
var randDate = randomDate(start, end);

var data = [
   ['', '', '', '', '', '', '', ''],
   ['', '', '', '', '', '', '', ''],
   ['', '', '', '', '', '', '', ''],
   ['', '', '', '', '', '', '', ''],
   ['', '', '', '', '', '', '', ''],
   ['', '', '', '', '', '', '', ''],
   ['', '', '', '', '', '', '', ''],
];

var accounts = ['511040-760-6700', '511040-761-6700', '511040-761-4200', '511040-761-3500', '511040-763-3500', '511040-763-4200', '511040-763-6700'];

var employeeMapping = [{
      'number': '229-999-6781',
      'name': 'Suzy Q',
      'account': '511040-760-6700'
   },
   {
      'number': '229-999-9091',
      'name': 'Tracy Smith',
      'account': '511040-760-6700'
   },
   {
      'number': '229-999-3129',
      'name': 'Kristen Bay',
      'account': '511040-760-6700'
   },
   {
      'number': '229-999-0010',
      'name': 'EAP Phone',
      'account': '511040-760-6700'
   },
   {
      'number': '904-999-6211',
      'name': 'Admin Phone',
      'account': '511040-760-6700'
   },
   {
      'number': '229-999-4612',
      'name': 'Warby Parker',
      'account': '511040-761-6700'
   },
   {
      'number': '904-999-3356',
      'name': 'Jack Black',
      'account': '511040-761-6700'
   },
   {
      'number': '904-999-5500',
      'name': 'Jack Black - Ipad',
      'account': '511040-761-4200'
   },
   {
      'number': '229-999-4183',
      'name': 'Sandy Wilson',
      'account': '511040-761-4200'
   },
   {
      'number': '229-999-1656',
      'name': 'Rodney Chen',
      'account': '511040-761-4200'
   },
   {
      'number': '229-999-1873',
      'name': 'Doug Finn',
      'account': '511040-761-4200'
   },
   {
      'number': '229-999-0177',
      'name': 'Sheldon Howey',
      'account': '511040-761-3500'
   },
   {
      'number': '908-999-9052',
      'name': 'Troy Whalen - Ipad',
      'account': '511040-761-3500'
   },
   {
      'number': '229-999-1868',
      'name': 'Suzy Q - Ipad',
      'account': '511040-763-3500'
   },
   {
      'number': '229-999-7336',
      'name': 'Mike Hollow',
      'account': '511040-763-3500'
   },
   {
      'number': '706-999-2618',
      'name': 'Clint Easton',
      'account': '511040-763-3500'
   },
   {
      'number': '404-999-9601',
      'name': 'Britt Spears',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-0454',
      'name': 'Casper Ghost',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-4703',
      'name': 'Patrick Star',
      'account': '511040-763-4200'
   },
   {
      'number': '731-999-2755',
      'name': 'Dave Gerber',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-9122',
      'name': 'Nina Marina',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-7001',
      'name': 'Mike White',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-7002',
      'name': 'Marketing Tradeshow',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-7003',
      'name': 'Shannon Pollack',
      'account': '511040-763-4200'
   },
   {
      'number': '229-999-7004',
      'name': 'Ben O\'connor',
      'account': '511040-763-6700'
   },
   {
      'number': '229-999-7005',
      'name': 'Alexa Baran',
      'account': '511040-763-6700'
   },
   {
      'number': '229-999-7006',
      'name': 'Della Gambill',
      'account': '511040-763-6700'
   },
   {
      'number': '229-999-7007',
      'name': 'Harry Potter',
      'account': '511040-763-6700'
   },
   {
      'number': '229-999-7008',
      'name': 'Chris Clein',
      'account': '511040-763-6700'
   },
   {
      'number': '229-999-7009',
      'name': 'Austin Rogers',
      'account': '511040-763-6700'
   }
];



var spreadsheet = jexcel(document.getElementById('spreadsheet'), {
   data: data,
   columns: [{
         type: 'text',
         title: 'Date',
         width: 120
      },
      {
         type: 'text',
         title: 'Company',
         width: 120
      },
      {
         type: 'text',
         title: 'Account Type',
         width: 120
      },
      {
         type: 'text',
         title: 'Account',
         width: 180
      },
      {
         type: 'text',
         title: 'Invoice',
         width: 120
      },
      {
         type: 'text',
         title: 'Description',
         width: 180
      },
      {
         type: 'text',
         title: 'Debit',
         width: 120
         //decimal: '.'
      },
      {
         type: 'text',
         title: 'Credit',
         width: 120
         //decimal: '.'
      },
   ]
});

var i = 0;

function shuffle(array) {
   var m = array.length,
      t, i;

   // While there remain elements to shuffle…
   while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
   }

   return array;
}

function randomDate(start, end) {
   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().slice(0, 10);
}


function generateTotalCharges(charges) {
   var totalCharges = 0;
   var total = 0;
   var monthly = 0;
   var usage = 0;
   var equipment = 0;
   var surcharge = 0;
   var taxes = 0;
   var thirdParty = 0;
   var cost_centers = ['A', 'A', 'Subtotal', 'B', 'B', 'Subtotal', 'C', 'C', 'Subtotal', 'D', 'D', 'D', 'Subtotal', 'E', 'E', 'E', 'Subtotal', 'F', 'F', 'Subtotal', 'G', 'G', 'Subtotal', 'Total Charges'];
   for (var r = 0; r < charges.length; r++) {
      if (cost_centers[r].localeCompare('Subtotal') == 0) {
         monthly += charges[r].monthly;
         usage += charges[r].usage;
         equipment += charges[r].equipment;
         surcharge += charges[r].surcharge;
         taxes += charges[r].taxes;
         thirdParty += charges[r].thirdParty;
         total += charges[r].total;
      }
   }

   monthly = Math.round((monthly + Number.EPSILON) * 100) / 100;
   usage = Math.round((usage + Number.EPSILON) * 100) / 100;
   equipment = Math.round((equipment + Number.EPSILON) * 100) / 100;
   surcharge = Math.round((surcharge + Number.EPSILON) * 100) / 100;
   taxes = Math.round((taxes + Number.EPSILON) * 100) / 100;
   thirdParty = Math.round((thirdParty + Number.EPSILON) * 100) / 100;
   total = Math.round((total + Number.EPSILON) * 100) / 100;
   //console.log(total.toString().length)
   if (total.toString().length == 6) {
      total = total + '0';
   } else if (total.toString().length == 4) {
      total = total + '.00';
   }
   var totalCharges = ('$' + monthly + "," + '$' + usage + "," + '$' + equipment + "," + '$' + surcharge + "," + '$' + taxes + "," + '$' + thirdParty + "," + '$' + total + ",");

   return totalCharges;
}

function generateCSV(items, totalItems) {
   //generate unique account num from Array
   var account = accounts[Math.floor(Math.random() * accounts.length)];
   var csv = '';
   csv += 'Account No: ,' + account + '\r\n';
   csv += 'Statement Date: ,' + randDate + '\r\n';
   csv += ',' + '\r\n';
   csv += ',' + '\r\n';
   csv += 'Voice and Data,' + '\r\n';

   // Loop the array of objects
   for (var row = 0; row < items.length; row++) {
      var keysAmount = Object.keys(items[row]).length;
      var keysCounter = 0;

      // If this is the first row, generate the headings
      if (row === 0) {
         for (var key in items[row]) {
            csv += items[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
            keysCounter++;
         }
      } else {
         for (var key in items[row]) {
            csv += items[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\r\n');
            keysCounter++;
         }
      }

      keysCounter = 0;
   }
   csv += 'Total Charges,' + ' ,' + totalItems + '\r\n';
   //console.log(csv);
   // Once we are done looping, download the .csv by creating a link
   var link = document.createElement('a');
   link.id = 'download-csv';
   link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
   link.setAttribute('download', 'Verizon Statement.csv');
   document.body.appendChild(link);
   document.querySelector('#download-csv').click();
}

function generateCharges() {
   var charges = [];
   //generates 22 lines (1 line = 1 object) of random dollar values and total, line by line
   for (var h = 0; h < 23; h++) {
      if (h == 2) {
         var charge = {};
         charge.monthly = Math.round(((charges[0].monthly + charges[1].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[0].usage + charges[1].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[0].equipment + charges[1].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[0].surcharge + charges[1].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[0].taxes + charges[1].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[0].thirdParty + charges[1].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else if (h == 5) {
         var charge = {};
         charge.monthly = Math.round(((charges[3].monthly + charges[4].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[3].usage + charges[4].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[3].equipment + charges[4].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[3].surcharge + charges[4].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[3].taxes + charges[4].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[3].thirdParty + charges[4].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else if (h == 8) {
         var charge = {};
         charge.monthly = Math.round(((charges[6].monthly + charges[7].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[6].usage + charges[7].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[6].equipment + charges[7].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[6].surcharge + charges[7].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[6].taxes + charges[7].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[6].thirdParty + charges[7].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else if (h == 12) {
         var charge = {};
         charge.monthly = Math.round(((charges[9].monthly + charges[10].monthly + charges[11].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[9].usage + charges[10].usage + charges[11].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[9].equipment + charges[10].equipment + charges[11].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[9].surcharge + charges[10].surcharge + charges[11].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[9].taxes + charges[10].taxes + charges[11].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[9].thirdParty + charges[10].thirdParty + charges[11].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else if (h == 16) {
         var charge = {};
         charge.monthly = Math.round(((charges[13].monthly + charges[14].monthly + charges[15].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[13].usage + charges[14].usage + charges[15].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[13].equipment + charges[14].equipment + charges[15].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[13].surcharge + charges[14].surcharge + charges[15].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[13].taxes + charges[14].taxes + charges[15].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[13].thirdParty + charges[14].thirdParty + charges[15].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else if (h == 19) {
         var charge = {};
         charge.monthly = Math.round(((charges[17].monthly + charges[18].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[17].usage + charges[18].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[17].equipment + charges[18].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[17].surcharge + charges[18].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[17].taxes + charges[18].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[17].thirdParty + charges[18].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else if (h == 22) {
         var charge = {};
         charge.monthly = Math.round(((charges[20].monthly + charges[21].monthly) + Number.EPSILON) * 100) / 100;
         charge.usage = Math.round(((charges[20].usage + charges[21].usage) + Number.EPSILON) * 100) / 100;
         charge.equipment = Math.round(((charges[20].equipment + charges[21].equipment) + Number.EPSILON) * 100) / 100;
         charge.surcharge = Math.round(((charges[20].surcharge + charges[21].surcharge) + Number.EPSILON) * 100) / 100;
         charge.taxes = Math.round(((charges[20].taxes + charges[21].taxes) + Number.EPSILON) * 100) / 100;
         charge.thirdParty = Math.round(((charges[20].thirdParty + charges[21].thirdParty) + Number.EPSILON) * 100) / 100;
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      } else {
         var charge = {};
         charge.monthly = Math.floor(Math.random() * (13000 - 3000) + 3000) / 100; //generates a random decimal value between 0-130
         charge.usage = Math.floor(Math.random() * (2000 - 200) + 200) / 100; //generates a random decimal value between 0-20
         charge.equipment = Math.floor(Math.random() * (700 - 70) + 70) / 100; //generates a random decimal value between 0-7
         charge.surcharge = Math.floor(Math.random() * (600 - 60) + 60) / 100; //generates a random decimal value between 0-6
         charge.taxes = Math.floor(Math.random() * (1500 - 150) + 150) / 100; //generates a random decimal value between 0-15
         charge.thirdParty = Math.floor(Math.random() * (500 - 50) + 50) / 100; //generates a random decimal value between 0-5
         charge.total = Math.round(((charge.monthly + charge.usage + charge.equipment + charge.surcharge + charge.taxes + charge.thirdParty) + Number.EPSILON) * 100) / 100;
         charges.push(charge);
      }
   }

   return charges;

}


function createTable() {
   if (!dataGenerated) { //checks if Begin Timer has been clicked & data hasnt been generated
      dataGenerated = true;
      var numArray = [];
      var employees = [];
      timerVar = setInterval(countTimer, 1000);

      //generates an array of 16 employee name / number combos
      for (var i = 0; i < employeeMapping.length; i++) {
         numArray.push(i);
      }
      numArray = shuffle(numArray);
      for (var j = 0; j < 23; j++) {
         var employeeName = employeeMapping[numArray[j]].name;
         var employeeNum = employeeMapping[numArray[j]].number;
         employees.push(employeeNum + ' / ' + employeeName);
      }



      var cost_centers = ['A', 'A', 'Subtotal', 'B', 'B', 'Subtotal', 'C', 'C', 'Subtotal', 'D', 'D', 'D', 'Subtotal', 'E', 'E', 'E', 'Subtotal', 'F', 'F', 'Subtotal', 'G', 'G', 'Subtotal', 'Total Charges'];
      for (var r = 0; r < charges.length; r++) {
         if (cost_centers[r] != 'Subtotal') {
            var line = {};
            line.cost_center = cost_centers[r];
            line.employee = employees[r];
            line.monthly = '$' + charges[r].monthly;
            line.usage = '$' + charges[r].usage;
            line.equipment = '$' + charges[r].equipment;
            line.surcharge = '$' + charges[r].surcharge;
            line.taxes = '$' + charges[r].taxes;
            line.thirdParty = '$' + charges[r].thirdParty;
            line.total = '$' + charges[r].total;
            lines.push(line);
         } else {
            var line = {};
            line.cost_center = cost_centers[r];
            line.employee = '';
            line.monthly = '$' + charges[r].monthly;
            line.usage = '$' + charges[r].usage;
            line.equipment = '$' + charges[r].equipment;
            line.surcharge = '$' + charges[r].surcharge;
            line.taxes = '$' + charges[r].taxes;
            line.thirdParty = '$' + charges[r].thirdParty;
            line.total = '$' + charges[r].total;
            lines.push(line);
         }
      }

   }

   generateCSV(lines, totalItems);

   return lines;

}


var totalSeconds = 0;

function countTimer() {
   ++totalSeconds;
   var hour = Math.floor(totalSeconds / 3600);
   var minute = Math.floor((totalSeconds - hour * 3600) / 60);
   var seconds = totalSeconds - (hour * 3600 + minute * 60);
   if (hour < 10)
      hour = "0" + hour;
   if (minute < 10)
      minute = "0" + minute;
   if (seconds < 10)
      seconds = "0" + seconds;
   document.getElementById("timer").innerHTML = "Time: " + hour + ":" + minute + ":" + seconds;
}

function correct() {
   clearInterval(timerVar);
   document.getElementById('result').style.color = "green";
   document.getElementById('result').innerHTML = 'Correct!';
}


function checkAccount(accountArr) {
   var result = [];
   var counter = 0;
   var entered = false;
   //removes blank array elements


   //account validation
   for (var j = 0; j < accountArr.length; j++) {
      if (accountArr[j] != '') {
         counter++;
      }
      for (var i = 0; i < accounts.length; i++) {
         if (accountArr[j] != '') {

            if (accounts[i].localeCompare(accountArr[j]) === 0) {
               entered = true;
               result.push(true);
            }
         }
      }
   }
   if (accountArr[0] != '') {
      counter = counter - 1;
   }
   if ((result.length != counter) || (!entered)) {
      return false;
   } else {
      return true;
   }

}

function aggregateDebit() {
   var accArray = [];
   for (i = 0; i < lines.length; i++) {
      var empName = lines[i].employee.substring(lines[i].employee.indexOf('/') + 2);
      console.log(empName);
      for (var j = 0; j < employeeMapping.length; j++) {
         if (empName.localeCompare(employeeMapping[j].name) == 0) {
            acc = {}
            acc.account = employeeMapping[j].account;
            acc.total = lines[i].total.substring(1);
            accArray.push(acc);
         }
      }
   }

   return accArray;
}


function checkDebit(debitArr, accountArr) {

   var resArray = [];
   var debitAccount = [];

   var result = debitTotals();
   //console.log(result);

   for (var i = 0; i < debitArr.length; i++) {
      if (debitArr[i] != '') {
         var obj = {};
         obj.account = accountArr[i];
         obj.debit = debitArr[i];
         debitAccount.push(obj);
      }
   }

   //console.log(debitAccount);


   if (result.length == debitAccount.length) {
      for (var j = 0; j < debitAccount.length; j++) {
         for (var k = 0; k < result.length; k++) {
            if (((debitAccount[j].account.localeCompare((result[k].account) == 0) && (debitAccount[j].debit.localeCompare(result[k].total) == 0)))) {
               resArray.push(true);
            }

         }
      }

      if (result.length == resArray.length) {
         return true;
      }
   }
   return false;
}

function debitTotals() {
   var holder = {};
   var obj = aggregateDebit();
   //console.log(obj);
   obj.forEach(function (d) {
      //console.log(parseFloat(d.total));
      if (holder.hasOwnProperty(d.account)) {
         holder[d.account] = parseFloat(holder[d.account]) + Math.round((parseFloat(d.total) + Number.EPSILON) * 100) / 100;
      } else {
         holder[d.account] = Math.round((parseFloat(d.total) + Number.EPSILON) * 100) / 100;
      }
   });

   var obj2 = [];

   for (var prop in holder) {
      obj2.push({
         account: prop,
         total: holder[prop].toFixed(2)
      });
   }

   return obj2;
}




function checkDate(dateArr) {
   var mon = randDate.slice(5, 7);
   var day = randDate.slice(8, 10);
   var year = randDate.slice(0, 4);
   var compareDate = mon + '/' + day + '/' + year;
   var entered = false;

   if (compareDate.slice(0, 1) == '0') {
      compareDate = compareDate.slice(1);
   }

   //  console.log(compareDate);


   for (var i = 0; i < dateArr.length; i++) {
      if (dateArr[i] != '') {
         entered = true;
         if (dateArr[i].localeCompare(compareDate) !== 0) {
            return false;
         }
      }
   }
   if (entered) {
      return true;
   } else {
      return false;
   }
}

function checkAccType(accType) {
   var entered = false;
   //checks if row 1 = vendor 
   if (accType[0] != 'Vendor') {
      return false;
   } else {

      for (var i = 1; i < accType.length; i++) {
         if (accType[i] != '') {
            entered = true;
            if (accType[i] != 'Ledger') {
               return false;
            }
         }
      }
      if (entered) {
         return true;
      } else {
         return false;
      }
   }
}


function checkCredit(creditArr) {
   total = totalItems.substring(totalItems.length - 8, totalItems.length - 1);
   //console.log(total);
   for (var i = 0; i < creditArr.length; i++) {
      if (creditArr[i].includes('$')){
         if (creditArr[i].toString().substring(1).localeCompare(total) === 0) {
            return true;
         }
      }
      else {
         if (creditArr[i].toString().localeCompare(total) === 0) {
            return true;
         }
      }

      
   }
   return false;
}


function checkAnswer() {

   var resultArr = [];

   var dateArr = spreadsheet.getColumnData(0);
   var accType = spreadsheet.getColumnData(2);
   var accountArr = spreadsheet.getColumnData(3);
   var debitArr = spreadsheet.getColumnData(6);
   var creditArr = spreadsheet.getColumnData(7);
   var dateBool = checkDate(dateArr);
   var accTypeBool = checkAccType(accType);
   var accountBool = checkAccount(accountArr);
   var debitBool = checkDebit(debitArr, accountArr);
   var creditBool = checkCredit(creditArr);

   //console.log(' datebool: ' + dateBool + ' accTypeBool: ' + accTypeBool + ' accountBool: ' + accountBool + ' creditBool: ' + creditBool + ' debitBool: ' + debitBool);

   if ((dateBool && accTypeBool && accountBool && creditBool && debitBool)) {
      correct();
   } else if (!dateBool) {
      document.getElementById('result').style.color = "red";
      document.getElementById('result').innerHTML = 'Incorrect Date. Try Again.';
   } else if (!accTypeBool) {
      document.getElementById('result').style.color = "red";
      document.getElementById('result').innerHTML = 'Incorrect Account Type. Try Again.';
   } else if (!accountBool) {
      document.getElementById('result').style.color = "red";
      document.getElementById('result').innerHTML = 'Incorrect Account. Try Again.';
   }  else if (!debitBool) {
      document.getElementById('result').style.color = "red";
      document.getElementById('result').innerHTML = 'Incorrect Debit/Account Combos. Try Again.';
   } else if (!creditBool) {
      document.getElementById('result').style.color = "red";
      document.getElementById('result').innerHTML = 'Incorrect Credit. Try Again.';
   }
}