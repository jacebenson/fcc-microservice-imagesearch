'use strict';
var port           = process.env.PORT || 5000;
var client_id      = process.env.CLIENT_ID || require('./.env').client_id;
var mongoURI       = process.env.MONGOLAB_URI;
var url            = require('url');
var http           = require('http');
var mongodb        = require('mongodb');
var express        = require('express');        // call express
var app            = express();                 // define our app using express
var bodyParser     = require('body-parser');
var routes         = require('./app/routes/public.js');
var api            = require('./app/routes/api.js');
var MongoClient    = mongodb.MongoClient;
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
    
routes(app);
api(app);

app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
});