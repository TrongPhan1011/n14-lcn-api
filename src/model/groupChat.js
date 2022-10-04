const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userCreate: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    avatar: {
        type: String,
        default: null,
    },
    createAt: String,
    updateAt: String,
    status: Number,
    member: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    message: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Message',
        },
    ],
});
groupChatSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

var GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = { GroupChat };
