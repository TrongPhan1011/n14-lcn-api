const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
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
                default: 'https://n14-lcn-bucket.s3.ap-southeast-1.amazonaws.com/9b9148e85719155036ebd6aa1b2c8ba8d41bf70b6f5131ad2679b2bb6e664719',
            },
            urlCoverPhoto: {
                type: String,
                default: '',
            },
            education: {
                type: String,
                default: '',
            },
            qrUrl: {
                type: String,
                default: '',
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
