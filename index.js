var http = require('http');
const PORT = process.env.PORT;
function handleRequest(request, response) {
  var returnObj = {
    unixTimeStamp: null,
    naturalLanguageDate: null
  };
  var input = request.url.toString().split('/')[1];
    if (input.length > 0) {
    if (isNaN(input)) {//not a number
      var d = new Date(decodeURIComponent(input));
      returnObj.unixTimeStamp = d.valueOf();
      returnObj.naturalLanguageDate = d.toDateString();
    } else {
      var d = new Date(parseInt(input, 10));
      returnObj.unixTimeStamp = d.valueOf();
      returnObj.naturalLanguageDate = d.toDateString();
    }
  }
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(returnObj, '', '    '));
}

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  //console.log("Server listening on: http://localhost:%s", PORT);
});