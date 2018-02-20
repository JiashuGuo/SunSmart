var express = require('express');
var router = express.Router();
var SampleData = require("../models/sampledata");

var geoTz = require('geo-tz');
var moment = require('moment-timezone');

/* GET home page. */
router.post('/', function(req, res, next) {
    var response = {
        msg: "Message received"
    };
    // enumerate request’s body and print out key and value
    for (var key in req.body) {
        console.log(key + ":" + req.body[key]);
    }
    var hour_fix = req.body["hour"];
    var minute_fix = req.body["minute"];
    var second_fix = req.body["second"];
    var year_fix = req.body["year"];
    var month_fix = req.body["month"];
    var day_fix = req.body["day"];
    if (req.body["hour"] < 10) {
        hour_fix = "0" + req.body["hour"];
    }
    if (req.body["minute"] < 10) {
        minute_fix = "0" + req.body["minute"];
    }
    if (req.body["second"] < 10) {
        second_fix = "0" + req.body["second"];
    }
    if (req.body["year"] < 10) {
        year_fix = "0" + req.body["year"];
    }
    if (req.body["month"] < 10) {
        month_fix = "0" + req.body["month"];
    }
    if (req.body["day"] < 10) {
        day_fix = "0" + req.body["day"];
    }
    var saTime = hour_fix + ":" + minute_fix + ":" + second_fix;
    var saDate = "20" + year_fix + "-" + month_fix + "-" + day_fix;

    //when not in summer time, uncomment the following line to determine timezone
    //var zone = geoTz.tz(47.650499, -122.350070);
    var ISOTime = saDate + "T" + saTime + "+00:00";
    var disp = moment.tz(ISOTime, 'America/Phoenix').format("YYYY-MM-DD HH:mm:ss");
    var AZTime = disp.split(" ");
    //res.status(200).send(disp);

    var newData = new SampleData({
        sampleTime: AZTime[1],
        sampleDate: AZTime[0],
        UV_raw: req.body["UV_raw"],
        latitude: req.body["latitude"],
        longitude: req.body["longitude"],
        deviceID: req.body["deviceId"]
    });

    newData.save(function(err, ndata) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(201).send("new data was saved.");
        }
    });
    // send JSON response
    //res.status(201).send(JSON.stringify(response));


});

router.get('/', function(req, res, next) {


    SampleData.find({}, function(err, sampledatas) {

        var response = { "alltuples": [] };
        // console.log(sampledatas);
        sampledatas.forEach(function(sapd) {

            var td = {
                "sampleTime": sapd.sampleTime,
                "sampleDate": sapd.sampleDate,
                "UV_raw": sapd.UV_raw,
                "latitude": sapd.latitude,
                "longitude": sapd.longitude,
                "deviceID": sapd.deviceID
            }
            response["alltuples"].push(td);


        });
        res.status(200).send(JSON.stringify(response));

    });


});

module.exports = router;