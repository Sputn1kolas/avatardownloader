
// Downloading required libraries
var request = require("request");
var fs = require("fs");
var dotenv = require('dotenv').config();

// Setting the github user and token from the .env file, if they are falsy - it ends the program
var GITHUB_USER = function () {
  if(!process.env.GITHUB_USER){
    console.log("there is no username key");
    return;
  }
  return process.env.GITHUB_USER;
}
var GITHUB_TOKEN =  function () {
  if(!process.env.GITHUB_TOKEN){
    console.log("there is no token");
    return;
  }
  return process.env.GITHUB_TOKEN;
}


// This Defines console input as variables, and logs and error, if  the repo, or repoowner arguments are missing or, there are too many arguments

function consoleInputs() {
  if(!process.argv[3] || !process.argv[2] || process.argv.slice(2).length > 2) {
   console.log("ERROR. Please enter in the style \n node index.js repoOwner repo");
   return;
  }


  // This sets the repository and the owner of that repo, from the command line inputs.
  var repoOwner = process.argv[2];
  var repo = process.argv[3];
  var url = `https://${GITHUB_USER()}:${GITHUB_TOKEN()}@api.github.com/repos/${repoOwner}/${repo}/contributors`;


// github api takes an object specifying both the url, and a header with the user agent.
  options = {
    url: url,
    headers: {
      'User-Agent':GITHUB_USER()
    }
  }


  getAvatars(options)


// start a counter to show  download response to user
  var numAvatar = 0
// Calls a get from the specified options, which details url and headers
  function getAvatars(options) {
    request.get(options, function(err, response, body){
      // if the api throws and error, it will log this message
      if(err) {
        console.log("there is an error:", err);
        return;
      }
      // if the api is successful, it will log a statuscode of 200.
      // If it is successful, we parse the response and send it to be saved.
      if (response.statusCode === 200) {
        console.log("API call successful, starting download...")
        var json = JSON.parse(body);
        saveAvatars(json);
        }
    })
  }

  // This loops through the api's response, saves the name of the contributer, and downloads an avatar for each
  function saveAvatars(json) {
    for(var i =0; i < json.length; i++){
      var contributor = json[i]['login'];
      var contributorAvatarURL = json[i]['avatar_url'];
      downloadImagebyURL(contributorAvatarURL, contributor);
      numAvatar += 1;
      console.log("Downloading avatar no:", numAvatar)
    }
    console.log("Finished downloading!")
  }

  // Takes a URL and the name of the contribur, and saves the output as the name.
  function downloadImagebyURL(url, contributor) {
    request.get(url).pipe(fs.createWriteStream(`./avatar/${contributor}.jpeg`));
  }
}

consoleInputs();


