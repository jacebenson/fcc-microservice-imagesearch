'use strict';
module.exports = function (app) {
    var client_id = process.env.CLIENT_ID || require('./.env').client_id;
    var mongoURI = process.env.MONGOLAB_URI || require('./.env').uri;
    var http = require('http');
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    app.route('/api/query')
        .get(function (req, res) {
            var term = encodeURIComponent(req.query.term);
            var offset = parseInt(req.query.offset, 10) || 0;
            if (term) {
                var options = {
                    host: 'api.imgur.com',
                    port: 80,
                    path: '/3/gallery/search/0.json?q=' + term + '&page=' + offset,
                    headers: {
                        Authorization: 'Client-Id ' + client_id
                    }
                };

                //start imgur get call

                try {
                    http.get(options, function (imgurRes) {
                        console.log("Got response: " + imgurRes.statusCode);
                        var returnObj = [];
                        var body = '';
                        imgurRes.on("data", function (chunk) {
                            body += chunk;
                            //console.log("BODY: " + chunk);
                        });
                        imgurRes.on("end", function () {
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
                            res.set('Content-Type', 'application/json');
                            res.send(JSON.stringify(returnObj, '', '  '));

                        });

                    }).on('error', function (e) {
                        console.log("Got error: " + e.message);
                    });
                } catch (error) {
                    error.source = 'imgurCall';
                    console.error(error);
                    //res.set('Content-Type', 'application/json');
                    //res.send(JSON.stringify(error));
                }
                //end imgur get call
                //start mongodb insert call
                var d = new Date();
                var dateString = d.toDateString();
                console.log(mongoURI);
                MongoClient.connect(mongoURI, function (err, db) {
                    if (err) throw err;
                    var id = db.collection('imagesearches').count({}, function (error, numOfDocs) {
                        if (err) throw err;
                        //console.log('numOfDocs: ' + numOfDocs);
                        if (numOfDocs !== null) {
                            if (numOfDocs > 5) {
                                //console.log('numOfDocs > 5 deleting one where, dateString: ' + dateString);
                                db.collection('imagesearches').remove({ created: { $ne: dateString } });
                            }
                        }
                        var item = {
                            query: term,
                            created: dateString
                        };
                        db.collection('imagesearches').insert(item);
                        db.close();
                    });
                });
                //end mongodb call
            } else {
                //no term sent... return error
                res.send({ error: 'No term given.' })
            }
            //
            //res.send(query);
            //res.sendFile(process.cwd() + '/public/index.html');
        });
    app.route('/api/history')
        .get(function (req, res) {
            try {
                console.log('getting recent queries');
                MongoClient.connect(mongoURI, function (err, db) {
                    if (err) throw err;
                    var cursor = db.collection('imagesearches').find().toArray(function (err, docs) {
                        if (docs.length === 0) {
                            res.set('Content-Type', 'application/json');
                            res.send(JSON.stringify({ message: 'No recent queries.' }, '', '    '));
                        } else {
                            res.set('Content-Type', 'application/json');
                            res.send(JSON.stringify(docs, '', '    '));
                        }
                    });
                });

            } catch (error) {
                error.source = 'historyCall';
                console.error(error);
                //res.set('Content-Type', 'application/json');
                //res.send(JSON.stringify(error));
            }
        });
};