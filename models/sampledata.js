var db = require("../db");

// Sampledata
// email, deviceID, Date, UVraw, latitude, longitude, zip, UVreal(default=UVraw) 

var sampleDataSchema = new db.Schema({
    email: { type: String, require: true },
    deviceID: { type: String, required: true },
    Date: Date,
    UVraw: Number,
    latitude: Number, //400 means error
    longitude: Number, //400 means error
    zip: String,
    UVreal: Number
});

var SampleData = db.model("SampleData", sampleDataSchema);

module.exports = SampleData;