var express = require('express');
var router = express.Router();
var fs = require('fs');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
var nodemailer = require('nodemailer');
var User = require("../models/user");
var UserVerifyToken = require("../models/userverifytoken");
var Device = require("../models/device");
var SampleData = require("../models/sampledata");

var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();


// var sampleDataSchema = new db.Schema({
//     email: { type: String, require: true },
//     deviceID: { type: String, required: true },
//     Date: Date,
//     UVraw: Number,
//     latitude: Number, //400 means error
//     longitude: Number, //400 means error
//     zip: String,
//     UVreal: Number
// });

// var deviceSchema = new db.Schema({
//     email: { type: String, required: true },
//     deviceID: { type: String, required: true },
//     apikey: { type: String, required: true },
//     activated: { type: Boolean, required: true, default: false }
// });

// ### uv/:email/sample
// POST:
// find document by email & devicedID
// Check its APIkey is correct and activated=True
var dicTimestamp = {};
var dicSPF = {};
router.post('/:email/sample', function(req, res) {
    // The following error messages might have too much information ONLY for debugging.
    var devicedID = req.body["deviceId"];
    var apikey = req.body["apikey"];
    Device.findOne({ deviceID: deviceID }, function(err, dev) {
        if (!dev) {
            return
        } else if (dev.apikey == apikey && dev.activated == true) {
            //commit this sample data
        } else {
            return
        }
        // body...
    });
});

// ### uv/:email/sunscreen
// POST:
// I recommend writing this endpoint and previous one in the same file
// For the past time:
//     Update documents in SampleData
// For the future:
//     Maintain two lists: timestamp=[ ], SPF=[ ], update documents when new sampledata arrives
router.post('/:email/sunscreen', function(req, res) {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    // X-Auth should contain the token value
    var SPF = req.body.SPF;
    // req.body.time should be in format new Date().getTime()
    var startTime = new Date(req.body.time);
    var endTime = new Date(req.body.time + (SPF * 10 * 60 * 1000));
    var percentage = 1.0;
    var token = req.headers["x-auth"];
    var deviceID = req.params.deviceID;
    if (SPF == 15) {
        percentage = 0.06;
    } else if (SPF == 30) {
        percentage = 0.03;
    } else if (SPF == 45) {
        percentage = 0.02;
    }
    // try decoding
    try {
        var decoded = jwt.decode(token, secret);
        var email=decoded.email;
        // var userStatus = {};
        var currentTime = new Date();
        // Find a user based on decoded token
        if (endTime < currentTime) {
            // SampleData.update({ Date: { $gte: startTime, $lte: endTime } }, { $mul: { UVreal: percentage } }, { multi: true },
            //     function(err, status) {
            //         if (err) {
            //             res.status(401).json({ error: "endTime < currentTime, update error" });
            //         }

            //     });
            SampleData.find({ Date: { $gte: startTime, $lte: endTime } }, function(err, sampledatas) {
                // console.log(sampledatas);
                sampledatas.forEach(function(sam) {
                    if (sam.UVraw * percentage < sam.UVreal) {
                        sam.UVreal = sam.UVraw * percentage;
                        sam.save();
                    }
                });
            });
        } else if (endTime > currentTime && startTime < currentTime) {
            SampleData.find({ Date: { $gte: startTime, $lte: currentTime } }, function(err, sampledatas) {
                // console.log(sampledatas);
                sampledatas.forEach(function(sam) {
                    if (sam.UVraw * percentage < sam.UVreal) {
                        sam.UVreal = sam.UVraw * percentage;
                        sam.save();
                    }
                });
            });
            var listSPF=dicSPF[email];
            var listTimestamp=dicTimestamp[email];
            if (listSPF.length==0) {
                
            }


        } else if (startTime > currentTime) {

        }



    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});
module.exports = router;