var db = require("../db");

// Userverifytoken
// email, randomstring

var userverifytokenSchema = new db.Schema({
    email: { type: String, required: true, unique: true },
    randomstring: { type: String, required: true }

});

var UserVerifyToken = db.model("UserVerifyToken", userverifytokenSchema);

module.exports = UserVerifyToken;