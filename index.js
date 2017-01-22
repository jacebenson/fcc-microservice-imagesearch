var client_id = require('./.env').client_id;
var http = require('http');
var mongodb = require('mongodb');
var mongoURI = process.env.MONGOLAB_URI;
//has exports.uri = 'mongodb://..:..@url'
var MongoClient = mongodb.MongoClient;
var url = require('url');
const PORT = process.env.PORT || 5000;
function handleRequest(request, response) {
  //expects query, if missing error
  //optional offset, if set, get records starting at n where n=offset
  //return 10 images or optional param of qty
  var urlObj = url.parse(request.url.toString());
  var urlQueryArr = urlObj.query.split('&');
  var search = {
    query: null,
    offset: 0
  };
  for (var x = 0; x < urlQueryArr.length; x++) {
    var filter = urlQueryArr[x].split('=');
    if (filter[0] == 'offset') { filter[1] = parseInt(filter[1]); }
    if (filter[0] == 'qty') { filter[1] = parseInt(filter[1]); }
    search[filter[0]] = filter[1];
  }
  //now query imgur
  insert(search.query);
  var options = {
    host: 'api.imgur.com',
    port: 80,
    path: '/3/gallery/search/0.json?q=' + search.query + '&page=' + search.offset,
    headers: {
      Authorization: 'Client-Id ' + client_id
    }
  };
  http.get(options, function (res) {
    var body = '';
    var returnObj = [];
    console.log("Got response: " + res.statusCode);
    res.on("data", function (chunk) {
      body += chunk;
      //console.log("BODY: " + chunk);
    });
    res.on("end", function () {
      var bodyObj = JSON.parse(body);
      //parse items;
      var items = bodyObj.data;
      if (items) {
        for (var n = 0; n < items.length; n++) {
          if (items[n].is_album === false) {
            returnObj.push(
              {
                url: items[n].link,
                snippet: items[n].title,
              }
            );
          }
        }
        if (returnObj.length === 0) {
          returnObj = {
            error: 'No Results found'
          }
        }
      } else {
        returnObj = {
          error: 'No Results found'
        }
      }
      /*      var returnObj = {
              url: null,//
              snippet: null,//title
              context: null,
              related_album: null,
              body: JSON.parse(body)
            };*/
      //console.log(body);
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify(returnObj, '', '    '));
    });
  }).on('error', function (e) {
    console.log("Got error: " + e.message);
  });
}
function insert(query) {
  var d = new Date();
  var dateString = d.toDateString() + ' ' +d.getHours() + '00';
  MongoClient.connect(mongoURI, function (err, db) {
    if (err) throw err;
    var id = db.collection('imagesearches').count({}, function (error, numOfDocs) {
      if (err) throw err;
      //console.log('numOfDocs: ' + numOfDocs);
      if (numOfDocs !== null) {
        if(numOfDocs > 5){
          //console.log('numOfDocs > 5 deleting one where, dateString: ' + dateString);
          db.collection('imagesearches').remove({created: {$ne : dateString}});
        }
      }
      item = { 
        query: query,
        created: dateString 
        };
      db.collection('imagesearches').insert(item);
      db.close();
    });
  });
}

var server = http.createServer(handleRequest);
server.listen(PORT, function () {
  console.log("Server listening on: http://localhost:%s", PORT);
});