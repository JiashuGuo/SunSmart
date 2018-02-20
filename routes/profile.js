var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
var User = require("../models/user");


var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();

router.get("/", function(req, res) {
    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    // X-Auth should contain the token value
    var token = req.headers["x-auth"];

    // try decoding
    try {
        var decoded = jwt.decode(token, secret);
        var userStatus = {};

        // Find a user based on decoded token
        User.findOne({ email: decoded.email }, function(err, user) {
            if (err)
                return res.json({ error: err });
            else {
                if (!user) {
                    return res.status(401).json({ error: "User not found" });
                } else {
                    userStatus['email'] = user.email;
                    userStatus['firstname'] = user.firstname;
                    userStatus['lastname'] = user.lastname;
                    userStatus['birthday'] = user.birthday.toDateString();
                    userStatus['gender'] = user.gender;
                    userStatus['phone'] = user.phone;

                    res.status(200).json(userStatus)
                    
                }
            }
        });
    } catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

module.exports = router;