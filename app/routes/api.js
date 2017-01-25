'use strict';
module.exports = function (app) {
    var client_id = process.env.CLIENT_ID || require('./.env').client_id;
    var mongoURI = process.env.MONGOLAB_URI || require('./.env').uri;
    var http = require('http');
    var mongodb = require('mongodb');
    var MongoClient = mongodb.MongoClient;
    /**
     * @api {get} /api/query?:term&:offset
     * @apiName GetImages
     * @apiVersion 1.0.0
     * @apiGroup Query
     * 
     * @apiExample {curl} Example usage:
     * curl http://image-svc.herokuapp.com/api/query?term=cats&offset=1
     * 
     * @apiParam {String} term Search term
     * @apiParam {Number} offset What page of results to return, default is 0
     *
     * @apiSuccess {Object[]} imageData Image information
     * @apiSuccess {String} imageData.url Image URL
     * @apiSuccess {String} imageData.snippet Alternate Text 
     * 
     * @apiSuccessExample Success-response
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              url: "http:/i.imgur/cahdKic.jpg",
     *              snippet: "As of today no one knows what happened to the Island of Itbayat and its 3000 inhabitants"
     *          },
     *          {
     *              url: "http://i.imgur.com/WDkMVwR.png",
     *              snippet: "No one knows except you."
     *          } 
     *      ]
     */

    /**
     * @api {get} /api/history
     * @apiName GetHistory
     * @apiVersion 1.0.0
     * @apiGroup History
     * 
     * @apiSuccess {Object[]} searchQuery Search information
     * @apiSuccess {String} searchQuery._id mongoDB id
     * @apiSuccess {String} searchQuery.query Term searched
     * @apiSuccess {String} searchQuery.created Date the search was logged
     *  
     * @apiExample {curl} Example usage:
     * curl http://image-svc.herokuapp.com/api/history
     * 
     * @apiSuccessExample Success-response
     *      HTTP/1.1 200 OK
     *      [
     *          {
     *              "_id": "58883552375c8131482b5d49",
     *              "query": "no%20one%20knows",
     *              "created": "Tue Jan 24 2017"
     *          },
     *          {
     *              "_id": "5888394ec2cec800043d1ccc",
     *              "query": "cats",
     *              "created": "Wed Jan 25 2017"
     *          }
     *      ]
     */

    app.route('/api/query')
        .get(function (req, res) {
            var term = encodeURIComponent(req.query.term);
            var offset = parseInt(req.query.offset, 10) || 0;
            if (term) {
                var options = {
                    host: 'api.imgur.com',
                    port: 80,
                    path: '/3/gallery/search/top/0.json?q=' + term + '&page=' + offset + '&q_size_px=med&window=all',
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
                            if (req.query.html == 'true') {
                                var content = '<style>.photos img{float:left;}a{clear: both;float: right;}</style>';
                                content += '<a href="/api/query?term=' + term + '&html=true&offset=' + (offset - 1) + '">PAST PAGE</a><br/>';
                                content += '<a href="/api/query?term=' + term + '&html=true&offset=' + (offset + 1) + '">NEXT PAGE</a><br/>';
                                content += '<div class="photos">';
                                for (var x = 0; x < returnObj.length; x++) {
                                    content += '\n<img src="' + returnObj[x].url + '" alt="' + returnObj[x].snippet + '"><br/>\n';
                                }
                                content += '</div>';
                                content += '<a href="/api/query?term=' + term + '&html=true&offset=' + (offset - 1) + '">PAST PAGE</a><br/>';
                                content += '<a href="/api/query?term=' + term + '&html=true&offset=' + (offset + 1) + '">NEXT PAGE</a>';
                                res.set('Content-Type', 'text/html');
                                res.send(content);
                            } else {
                                res.set('Content-Type', 'application/json');
                                res.send(JSON.stringify(returnObj, '', '  '));
                            }

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