const mongoose = require('mongoose');
const banSchema = new mongoose.Schema(
    {
        email: String,

        time: { type: Date, default: Date.now, index: { expires: 180 } },
    },
    {
        collection: 'ban',
    },
);
var Ban = mongoose.model('ban', banSchema);
module.exports = { Ban };
