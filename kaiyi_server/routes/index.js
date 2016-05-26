var express = require('express');
var router = express.Router();
var cors = require('cors');
var ReporterModel = require('../models/reporter');
var PersonModel = require('../models/person');

router.get('/reporter', function(req, res, next) {
    ReporterModel.find().exec(function (err, reporters) {
        res.render('reporter', {
            data: reporters || []
        });
    });
});

//  curl -H "Content-type:application/json" -X POST -d '{"name": "sam", "phone": "123456", "message": "Im fine"}' localhost:1361/reporter
router.post('/reporter', cors(), function(req, res, next) {
    var data = req.body;

    if (!(data.name || data.phone || data.message)) {
        res.statusCode = 400;
        res.send(new Error('Invalid params'));
        return;
    }

    var reporter = new ReporterModel({
        name: data.name,
        phone: data.phone,
        message: data.message
    });

    reporter.save(function (err, report) {
        if (err) return next(err);
        res.statusCode = 201;
        res.send({result: 'ok'});
    });
});

router.get('/person', function(req, res, next) {
    ReporterModel.find().exec(function (err, reporters) {
        res.render('person', {
            data: reporters || []
        });
    });
});

//  curl -H "Content-type:application/json" -X POST -d '{"name": "sam", "phone": "123456"}' localhost:1361/person
router.post('/person', cors(), function(req, res, next) {
    var data = req.body;

    if (!(data.name || data.phone)) {
        res.statusCode = 400;
        res.send(new Error('Invalid params'));
        return;
    }

    var person = new PersonModel({
        name: data.name,
        phone: data.phone,
        message: data.message
    });

    person.save(function (err, person) {
        if (err) return next(err);
        res.statusCode = 201;
        res.send({result: 'ok'});
    });
});

module.exports = router;
