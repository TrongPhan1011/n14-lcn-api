const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            require: true,
            index: true,
        },
    },
    { timestamps: true },
);
tokenSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

tokenSchema.index({ token: 'text' });
var TokenModel = mongoose.model('Token', tokenSchema);

module.exports = { TokenModel };
