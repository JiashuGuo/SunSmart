// Device
// email, deviceID, APIKey, activated
var db = require("../db");

var deviceSchema = new db.Schema({
    email: { type: String, required: true },
    deviceID: { type: String, required: true },
    apikey: { type: String, required: true },
    activated: { type: Boolean, required: true, default: false }
});

var Device = db.model("Device", deviceSchema);

module.exports = Device;