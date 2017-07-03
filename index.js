
// Libraries
var request = require("request");
var fs = require("fs");


// Define console input as variables
var repoOwner = process.argv.slice(2)[0];
var repo = process.argv.slice(2)[1];

// Set the needed token and user, and compute api string.
var GITHUB_USER = "Sputn1kolas";
var GITHUB_TOKEN = "313a8989312b8c74d35a0a104a30c4f3d0aeea03";
var url = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repo}/contributors`;

var options = {
  url: url,
  headers: {
    'User-Agent':GITHUB_USER
  }
}

function saveAvatars(json) {
  for(var i =0; i < json.length; i++){
    var contributor = json[i]['login']
    var contributorAvatarURL = json[i]['avatar_url']
    downloadImagebyURL(contributorAvatarURL, contributor)
  }
}

function downloadImagebyURL(url, contributor) {
  request.get(url).pipe(fs.createWriteStream(`./avatar/${contributor}.jpeg`))
}


function getAvatars() {
  request.get(options, function(err, response, body){
    if(err) {
      console.log("there is an error:", err);
      return;
    }
    if (response.statusCode === 200) {
      var json = JSON.parse(body);
      saveAvatars(json);
      }
  })
}

getAvatars()

