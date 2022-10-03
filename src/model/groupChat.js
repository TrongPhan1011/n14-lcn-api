const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path: String,
    title: String,
    createAt: String,
    status: Number,
    fileType: {
        name: String,
        status: Number,
        _id: false,
    },
});

const messageSchema = new mongoose.Schema({
    authorID: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    title: String,
    createAt: String,
    replyMessage: mongoose.Schema.Types.ObjectId,
    seen: [
        {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
            seenAt: String,
            _id: false,
        },
    ],
    tagName: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
    ],
    emotion: [
        {
            idUser: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
            type: String,
            _id: false,
        },
    ],
    type: String,
    status: Number,
    file: fileSchema,
});

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
    message: [messageSchema],
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
