var db = require("../db");

// User
// _id, email, passwordhash, firstname, lastname, birthday(empty), gender, phone(empty), apikey(default=empty)
var userSchema = new db.Schema({
    email: { type: String, required: true, unique: true },
    passwordhash: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    // new Date(XXXX,XX,XX) month:0-11
    birthday: Date,
    gender: String,
    phone: String,
    verified: { type: Boolean, default: false },
    apikey: String
});

var User = db.model("User", userSchema);

module.exports = User;