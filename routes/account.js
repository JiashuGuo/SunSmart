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

// ### account/:email/device/new
// POST:
// Webhook POST {deviceID} to this endpoint, 
// user can press the setup button to add a new device
// Generate APIkey
// Save {email, deviceID, APIkey, activated} in Device
// If user.email has only one device, set activated=True


router.post('/:email/device/new', function(req, res, next) {
    // The following error messages might have too much information ONLY for debugging.
    var email = req.params.email;
    var deviceID = req.body["deviceId"];
    var APIkey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    Device.findOne({ email: email },
        function(err, dev) {
            if (err) {
                res.status(401).json({ error: "Device findOne error" });
            } else if (!dev) {
                var newDevice = new Device({
                    email: email,
                    deviceID: deviceID,
                    APIkey: APIkey,
                    activated: true
                });
                newDevice.save(function(err, ndev) {
                    res.status(201).json({ success: true, msg: "His first device was saved" });
                    // body...
                })
            } else {
                var newDevice = new Device({
                    email: email,
                    deviceID: deviceID,
                    APIkey: APIkey,
                    activated: false
                });
                newDevice.save(function(err, ndev) {
                    res.status(201).json({ success: true, msg: "This user has a new device" });
                    // body...
                })
            }

        });
});

module.exports = router;