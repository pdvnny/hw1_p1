/************************************************************

Copyright 2022

Team 3
* Parker Dunn (pgdunn@bu.edu)
* Sally Shin

Assignment for EC500A3 @ BU
Created on 14 October 2022

*************************************************************/

const pw = "A571C1DDA73DD";

//let size = 0;
//let fields = new Array(100);

let selections = {};
let keysString;
let keys = [];



/**************** NODE JS SETUP *****************************/

// This section does not apply when using scripts on the web

// const crypto = require('crypto');



/*************** INTERACTING WITH REDIS SERVER **************/

//- Creates a random salt
//  - Logs salt to console (for now)
//  - Places salt on main page
//  - returns salt for use in GET request
const generateSalt = () => {
  let size = (Math.random() * 9) + 6;
  let salt = String.fromCharCode(Math.floor(Math.random() * 26) + 97); // 0 -> 97 -> "a" or 25 -> 122 -> "z"
  for (let ll = 1; ll < size; ll++) {
    let nextChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    salt = salt.concat(nextChar);
  }
  
  //console.log(salt);
  //displaySalt(salt);
  
  return salt;
}

function salt_and_hash(salt) {
  //var pw = document.getElementById('password').value;
  let saltedPassword = salt.concat(pw);
  
  let hashed = CryptoJS.MD5(saltedPassword).toString();            // HTML VERSION
  //let hashed = crypto.createHash('md5').update(saltedPassword).digest('hex');     // Node JS version!
  
  //console.log(hashed);
  //displayHash(hashed);
  
  return hashed;
}


/// NEED TO UPDATE THESE METHODS

const checkRedis = async () => {
  let url = "https://agile.bu.edu/ec500_scripts/redis.php?";
  let newSalt = generateSalt();
  const sendData = {
    salt: newSalt,
    hash: salt_and_hash(newSalt),
    message: "PING"
  };
  const getParameters = new URLSearchParams(sendData)
  try {
    const response = await fetch(url + getParameters, {method: 'GET'});
    console.log(response);

    if (response.ok) {
      const jsonResponse = await response.text();
      let redisResponse = jsonResponse.substring(42);
      console.log(redisResponse);
    } else {
      //responseMsg.innerHTML = "Request failed!";
      throw new Error("Request failed!");
    }

  } catch (error) {

    console.log(error);

  }
}

const sendDataToRedis = async (inVar, payload) => {
  //let responseMsg = document.getElementById('received');
	
  let url = "https://agile.bu.edu/ec500_scripts/redis.php?";
  let newSalt = generateSalt();

  const sendData = {
    salt: newSalt,
    hash: salt_and_hash(newSalt),
    message: ("SET"+" "+inVar+" "+payload)
  };

  //console.log(sendData);

  const getParameters = new URLSearchParams(sendData)

  try {

    const response = await fetch(url + getParameters, {method: 'GET'});

    console.log(response);

    if (response.ok) {
      const jsonResponse = await response.text();
      let redisResponse = jsonResponse.substring(42);
      console.log(redisResponse);
    } else {
      //responseMsg.innerHTML = "Request failed!";
      throw new Error("Request failed!");
    }

  } catch (error) {

    console.log(error);

  }

}

const getFromRedis = async (inVar) => {
  //let responseMsg = document.getElementById('received');
  
  let url = "https://agile.bu.edu/ec500_scripts/redis.php?";
  let newSalt = generateSalt();

  const sendData = {
    salt: newSalt,
    hash: salt_and_hash(newSalt),
    message: ("GET"+" "+inVar)
  };
  console.log(sendData);

  const getParameters = new URLSearchParams(sendData)

  try {

    const response = await fetch(url + getParameters, {method: 'GET'});

    console.log(response);

    if (response.ok) {
      const jsonResponse = await response.text();
      let redisResponse = jsonResponse.substring(42);
      console.log(inVar.concat(" ").concat(redisResponse));  // This may not work with a numberical input at the moment
    } else {
      //responseMsg.innerHTML = "Request failed!";
      throw new Error("Request failed!");
    }

  } catch (error) {

    console.log(error);

  }

}

/* ------- FUNCTIONS FOR 'getAllKeysRedis' --------- */

const networkSuccess = (response) => {
  if (response.ok) {
    return response.text();
  }
  throw new Error('Request failed!');
}

const networkFailure = (networkError) => {
  console.log("Network Error");
  console.log(networkError);
  console.log(networkError.message);
}

const handleTextResponse = (textResponse) => {
  //console.log("In handle method, " + textResponse);
  keysString = textResponse.substring(43);
  //console.log(keysString);
  keys = parseKeysString(keysString);
  console.log(keys);
}

// -----------------------------------------------


const getAllKeysRedis = async () => {
  //let responseMsg = document.getElementById('received');
  
  let url = "https://agile.bu.edu/ec500_scripts/redis.php?";
  let newSalt = generateSalt();

  const sendData = {
    salt: newSalt,
    hash: salt_and_hash(newSalt),
    message: "GET keys"
  };
  //console.log(sendData);

  const getParameters = new URLSearchParams(sendData);

  const response = await fetch(url + getParameters, {method: 'GET'})
      .then(networkSuccess, networkFailure)
      .then(handleTextResponse);
      // You can work with the response, but only in the async method!!

  /*
  try {

    const response = await fetch(url + getParameters, {method: 'GET'});

    //console.log(response);

    if (response.ok) {

      const textResponse = await response.text();
      console.log(textResponse);
      
      const returnText = textResponse;

      return returnText;
      //keysString = textResponse;


    } else {
      //responseMsg.innerHTML = "Request failed!";
      throw new Error("Request failed!");
    }

  } catch (error) {

    console.log(error);

  }
  */

}

const sendKeysToRedis = async (userInputs) => {

  const keys = Object.keys(userInputs).toString();
  console.log(keys);  
  let url = "https://agile.bu.edu/ec500_scripts/redis.php?";
  let newSalt = generateSalt();

  const sendData = {
    salt: newSalt,
    hash: salt_and_hash(newSalt),
    message: ("SET keys "+keys)
  };

  const getParameters = new URLSearchParams(sendData);
  let textResponse;

  try {

    const response = await fetch(url + getParameters, {method: 'GET'});

    if (response.ok) {
      textResponse = await response.text();
      console.log(textResponse);
    } else {
      //responseMsg.innerHTML = "Request failed!";
      throw new Error("Request failed!");
    }

  } catch (error) {

    console.log(error);

  }

  return textResponse;

}

function calculateSum(inputs, n) {
	  let total = Number(0);
    for (let ll = 0; ll < n; ll++) {
    	total += inputs[ll];
    }
    return total;
}

function parseKeysString(keys) {
  return keys.split(",");
}

function checkInput() {  // Method checks if input is valid
  // (1) checks that number is in appropriate range
  // (2) checks that the sum with the new number is not greater than 100



}





/*************** TEMP FUNCTIONS ******************************/
const main = () => {
	
  // SETTING UP THE SITUATION
  let numStudents = 10;
	let submissionRatings = new Array(numStudents);
  for (let i = 0; i < numStudents; i++) {
  	submissionRatings[i] = Number(0);
  }
  
  // TEST 1 -- calculateSum() --> Expect: 0
  //console.log(calculateSum(submissionRatings, numStudents));
  
  // TEST 2 -- calculateSum() with non-zeros --> Expect 20
  /* submissionRatings[4] = Number(10);
  submissionRatings[8] = Number(10);
  console.log(calculateSum(submissionRatings, numStudents)); */
  
  // NEXT UP:
  // * find a way to save and retrieve values from Redis!
  checkRedis();
  //let student = "student";
  // for (let i = 1; i < 11; i++) {  
  //   sendDataToRedis(student.concat(i), 10);
  //   size++;
  // }
  // for (let k = 1; k < 11; k++) {
  //   getFromRedis(student.concat(k));
  // }
  
  selections['git1'] = 10;
  selections['git2'] = 10;
  selections['git3'] = 10;
  selections['git4'] = 10;

  sendKeysToRedis(selections);

  getAllKeysRedis();
  //console.log(keysString);
  //console.log(parseKeysString(keysString));


}

main();

