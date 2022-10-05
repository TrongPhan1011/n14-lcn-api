const mongoose = require('mongoose');

const authSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
    },
    { timestamps: true },
);
authSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

var AuthModel = mongoose.model('auth', authSchema);

module.exports = { AuthModel };
