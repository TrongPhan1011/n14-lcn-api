const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        time: { type: Date, default: Date.now, index: { expires: 90 } },
    },
    {
        collection: 'otp',
    },
);
var OTP = mongoose.model('otp', otpSchema);
module.exports = { OTP };
