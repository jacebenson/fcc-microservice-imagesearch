'use strict';

module.exports = function (app) {
    app.route('/api/:query')
        .get(function (req, res) {
            res.send(JSON.stringify(req.params.query,'','  '));
            //res.sendFile(process.cwd() + '/public/index.html');
        });
    app.route('/api/history')
        .get(function (req, res) {
            res.send(JSON.stringify(req.params.query,'','  '));
        });
};