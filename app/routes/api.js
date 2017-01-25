'use strict';

module.exports = function (app) {
    app.route('/api/:query')
        .get(function (req, res) {
            var query = req.params.query
            res.send(query);
            //res.sendFile(process.cwd() + '/public/index.html');
        });
    app.route('/api/history')
        .get(function (req, res) {
            var query = req.params.query
            res.send(query);
        });
};