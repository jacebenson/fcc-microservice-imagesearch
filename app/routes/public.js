'use strict';

module.exports = function (app) {
    app.route('/')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/index.html');
        });
    app.route('/favicon.ico')
        .get(function (req, res) {
            res.sendFile(process.cwd() + '/public/favicon.ico');
        });
};