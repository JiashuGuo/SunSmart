var express = require('express');
var router = express.Router();
var fs = require('fs');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("jwt-simple");
var nodemailer = require('nodemailer');
var User = require("../models/user");
var UserVerifyToken = require("../models/userverifytoken");

// Secret key for JWT
var secret = fs.readFileSync(__dirname + '/../../jwtkey').toString();

/* GET Authenticate user on sign in. */
router.post('/login', function(req, res, next) {
    // The following error messages might have too much information ONLY for debugging.
    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) {
            res.status(401).json({ error: "Database findOne error" });
        } else if (!user) {
            res.status(401).json({ error: "The email address or password provided were invalid." });
        } else {
            bcrypt.compare(req.body.password, user.passwordhash, function(err, valid) {
                if (err) {
                    res.status(401).json({ error: "bcrypt error" });
                }
                if (valid) {
                    if (user.verified) {
                        var token = jwt.encode({ email: req.body.email }, secret);
                        res.status(201).json({ token: token, success: true, redirect: "/dashboard.html" });
                    } else {
                        res.status(401).json({ error: "Your account hasn't been activated.<br>Please check your email for instructions on how to activate your account.<br>Didn't receive email? <br><a href='/users/resendemail/" + encodeURIComponent(user.email) + "'>Resend Email</a>" });
                        // res.render('resend_email', { URLforResendEmail: '/users/resendemail/' + encodeURIComponent(user.email) });
                    }

                } else {
                    res.status(401).json({ error: "The email address or password provided were invalid." });
                }
            });
        }
    });
});

/* Register a new user */
router.post('/register', function(req, res, next) {
    // Create a hash for the submitted password
    if (req.body.password != req.body.confirmPassword) {
        return res.status(401).send("The two passwords do not match.");
    }
    var trimedFirstName = req.body.firstname.trim();
    var trimedLastName = req.body.lastname.trim();
    if (trimedFirstName == null || trimedFirstName == "" || trimedFirstName.length <= 0) {
        return res.status(401).send("First name should not be empty.");
    }
    if (trimedLastName == null || trimedLastName == "" || trimedLastName.length <= 0) {
        return res.status(401).send("Last name should not be empty.");
    }

    bcrypt.hash(req.body.password, null, null, function(err, hash) {
        // Prepare a new user
        var newUser = new User({
            email: req.body.email,
            passwordhash: hash, // hashed password
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            birthday: new Date(req.body.year, req.body.month, req.body.date),
            gender: req.body.gender,
            phone: req.body.phone,
            verified: false,
            apikey: null

        });
        newUser.save(function(err, user) {
            if (err) { // this error could be a duplicate key error when the same email insertion tried
                res.json({ success: false, message: req.body.email + "has already been registered." });
            } else {
                var randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                var newUserVerifyToken = new UserVerifyToken({
                    email: user.email,
                    randomstring: randomString
                });
                newUserVerifyToken.save(function(err, userverifytoken) {
                    if (err) {
                        res.json({ error: "Sorry, some unknown error happened, please use another email and try again!" })
                    } else {
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'sunsmart.register@gmail.com',
                                pass: 'Qwertyuiop'
                            }
                        });

                        var mailOptions = {
                            from: 'sunsmart.register@gmail.com',
                            to: userverifytoken.email,
                            subject: '[SunSmart] Please verify your email address',
                            text: 'Please click the following link or copy paste it in your browser to verify your account!\nhttp://sunsmart.biz/users/' + encodeURIComponent(userverifytoken.email) + '/' + userverifytoken.randomstring + '\n If you have never registered with SunSmart.biz, please ignore this email.'
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                                res.send("<p>Sorry, we cannot send email to your address, please provide a valid email address.</p>");
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.send("<p>Successfully send email to " + mailOptions.to + "<br>Please check your email for instructions on how to activate your account.</p>");
                            }
                        });

                    }
                    // body...
                })
            }
        });
    });
});

router.get('/resendemail/:email', function(req, res, next) {
    var email = decodeURIComponent(req.params.email);

    UserVerifyToken.findOne({ email: email }, function(err, userverifytoken) {
        if (err) {
            res.status(401).json({ error: "Database findOne error" });
        } else if (!userverifytoken) {
            res.status(401).json({ error: "The email address was invalid." });
        } else {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sunsmart.register@gmail.com',
                    pass: 'Qwertyuiop'
                }

            });
            var mailOptions = {
                from: 'sunsmart.register@gmail.com',
                to: email,
                subject: '[SunSmart] Please verify your email address',
                text: 'Please click the following link or copy paste it in your browser to verify your account!\nhttp://sunsmart.biz/users/' + encodeURIComponent(userverifytoken.email) + '/' + userverifytoken.randomstring + '\n If you have never registered with SunSmart.biz, please ignore this email.'
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    res.send("<p>Sorry, we cannot send email to your address, please provide a valid email address.</p>");
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send("<p>Successfully send email to " + mailOptions.to + "<br>Please check your email for instructions on how to activate your account.</p>");
                }
            });
        }
    });

});

router.get('/:email/:randomstring', function(req, res, next) {
    var email = decodeURIComponent(req.params.email);
    var randomstring = req.params.randomstring;

    var findOneFlag = false;
    UserVerifyToken.findOne({ email: email }, function(err, userverifytoken) {
            if (err) {
                res.status(401).json({ error: "Database findOne error" });
            } else if (!userverifytoken) {
                res.status(401).json({ error: "The email address was invalid." });
            } else {
                if (userverifytoken.randomstring != randomstring) {
                    res.send("please make sure you copy the correct URL.");
                } else {
                    User.findOneAndUpdate({ email: userverifytoken.email }, { verified: true },
                        function(err, stu) {
                            if (err) {
                                res.status(401).json({ error: "Database findOneAndUpdate error" });
                            } else {
                                findOneFlag = true;
                            }
                        });
                    // User.findOne({ email: userverifytoken.email }, function(err, user) {
                    //     if (err) {
                    //         res.status(401).json({ error: "Database findOne error" });
                    //     } else if (!user) {
                    //         res.status(401).json({ error: "The email address was invalid." });
                    //     } else {
                    //         user.verified = true;
                    //         user.save(function(argument) {
                    //             // body...
                    //         });
                    //         findOneFlag = true;

                    //     }
                    // });
                }
            }
        })
        .remove();

    res.send("Congratulations, your email has been successfully verified!");


});


module.exports = router;