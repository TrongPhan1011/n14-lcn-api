const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            index: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        birthday: String,
        gender: String,
        statusOnline: Boolean,
        status: Number,
        profile: {
            urlAvartar: {
                type: String,
                default: undefined,
            },
            urlCoverPhoto: {
                type: String,
                default: undefined,
            },
            education: {
                type: String,
                default: undefined,
            },
            qrUrl: {
                type: String,
                default: undefined,
            },
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
    },
    { timestamps: true },
);

userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

userSchema.index({ fullName: 'text' });

var User = mongoose.model('User', userSchema);

module.exports = { User };
