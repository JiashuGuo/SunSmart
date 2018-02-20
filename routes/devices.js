var express = require('express');
var router = express.Router();
var fs = require('fs');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
var nodemailer = require('nodemailer');
var User = require("../models/user");
var UserVerifyToken = require("../models/userverifytoken");
var Device = require("../models/device");

var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();


// ### /devices/:deviceID/activate
// POST:
// Activate device(deviceID)

router.post('/:deviceID/activate', function(req, res, next) {
    // The following error messages might have too much information ONLY for debugging.
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    // X-Auth should contain the token value
    var token = req.headers["x-auth"];
    var deviceID = req.params.deviceID;
    // try decoding
    try {
        var decoded = jwt.decode(token, secret);
        // var userStatus = {};

        // Find a user based on decoded token


        Device.findOneAndUpdate({ email: decoded.email, activated: true }, { activated: false },
            function(err, dev) {
                if (err) {
                    res.status(401).json({ error: "findOneAndUpdate previous activated device error." });
                }

            });

        Device.findOneAndUpdate({ email: decoded.email, deviceID: deviceID }, { activated: true },
            function(err, dev) {
                if (err) {
                    res.status(401).json({ error: "findOneAndUpdate activate new device error." });
                } else if (!dev) {
                    res.status(401).json({ error: "cannot find target device to activate" })
                }

            });

        res.status(201).json({ success: true, msg: "target device was activated" });


    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});


// ###/devices/:deviceID/delete
// POST:
// Find one document by email & deviceID and delete it

router.post('/:deviceID/delete', function(req, res, next) {
    // The following error messages might have too much information ONLY for debugging.
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    // X-Auth should contain the token value
    var token = req.headers["x-auth"];
    var deviceID = req.params.deviceID;
    // try decoding
    try {
        var decoded = jwt.decode(token, secret);
        // var userStatus = {};

        // Find a user based on decoded token

        Device.findOneAndRemove({ email: decoded.email, deviceID: deviceID },
            function(err, dev) {
                if (dev === null) {
                    res.status(401).json({ error: "no device was deleted" });

                }
            });

        Device.findOne({ email: decoded.email, activated: true },
            function(err, dev) {
                if (err) {
                    res.status(401).json({ error: "Device findOne error" });
                } else if (!dev) {
                    Device.findOne({ email: decoded.email }, function(err, dev2) {
                        if (!dev2) {
                            res.status(201).json({ success: true, msg: "target device was deleted, this user has no device" });
                        } else {
                            dev2.activated = true;
                            dev2.save(function(err, stu) {
                                res.status(201).json({ success: true, msg: "target device was deleted, a new device was activated" });
                            });
                        }
                    });
                }

            });



    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

module.exports = router;