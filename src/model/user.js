const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,

        unique: true,
    },
    birthday: String,
    gender: String,
    statusOnline: Boolean,
    createAt: String,
    updateAt: String,
    status: Number,
    profile: {
        urlAvartar: String,
        urlCoverPhoto: String,
        education: String,
        qrUrl: String,
        updateAt: String,
        status: Number,
        _id: false,
    },
    friend: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            status: {
                type: Number,
                default: 1,
            },
            _id: false,
        },
    ],
    listGroup: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GroupChat',
            _id: false,
        },
    ],
});

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

userSchema.index({ fullName: 'text', phoneNumber: 'text' });

var User = mongoose.model('User', userSchema);

module.exports = { User };
