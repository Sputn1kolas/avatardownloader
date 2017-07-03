var request = require("request")
var repoOwner = process.argv.slice(2)[0]
var repo = process.argv.slice(3)
var url = `https://api.github.com/${repoOwner}/${repo}/graphs/contributors`

request.get(url).pipe(fs.createWriteStream('./avatars/future.jpeg'))


//