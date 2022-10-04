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
    idChat: {
        type: mongoose.Schema.ObjectId,
        index: true,

        ref: 'GroupChat',
    },
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
                unique: true,
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
            type_emotion: String,
            _id: false,
        },
    ],
    type: String,
    status: Number,
    file: fileSchema,
});

messageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

var Message = mongoose.model('Message', messageSchema);

module.exports = { Message };
