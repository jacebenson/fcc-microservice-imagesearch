var http = require('http');
var url  = require('url');
const PORT = process.env.PORT;
function handleRequest(request, response) {
  var urlObj = url.parse(request.url);
  console.log('urlObj: \n' + JSON.stringify(urlObj,'' ,'  '));
  var returnObj = {
    url: null,//
    snippet: null,//title
    context: null,
    related_album: null
  };
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(returnObj, '', '    '));
}

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  //console.log("Server listening on: http://localhost:%s", PORT);
});