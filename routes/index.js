var express = require('express');
var router = express.Router();
var fs = require('fs');
var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");
// var Device =  require("../models/device");
var User = require("../models/user");


/* GET home page. */
router.get('/', function(req, res, next) {
    return res.render('index');
});


/* GET status */


module.exports = router;