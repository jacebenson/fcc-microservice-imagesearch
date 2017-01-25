'use strict';
var port = process.env.PORT || 5000;
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var api = require('./app/routes/api.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static('./public'));
api(app);

app.listen(port, function () {
    console.log('Node.js listening on port ' + port);
});