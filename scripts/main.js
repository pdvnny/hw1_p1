/************************************************************

Copyright 2022

Team 3
* Parker Dunn (pgdunn@bu.edu)
* Sally Shin

Assignment for EC500A3 @ BU
Created on 14 October 2022

*************************************************************/

const pw = "A571C1DDA73DD";


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

function calculateSum(inputs, n) {
	  let total = Number(0);
    for (let ll = 0; ll < n; ll++) {
    	total += inputs[ll];
    }
    return total;
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
	
}

main();

