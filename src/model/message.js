const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
    {
        path: String,
        title: String,
        status: {
            type: Number,
            default: 1,
        },
        fileType: String,
    },
    { timestamps: true },
);

const messageSchema = new mongoose.Schema(
    {
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

        replyMessage: {
            id: {
                type: mongoose.Schema.ObjectId,
                ref: 'Message',
            },
            title: String,
            file: fileSchema,
        },
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
        reactionMess: [
            {
                idUser: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                },
                type_emotion: String,
                _id: false,
            },
        ],
        type_mess: {
            type: String,
            default: 'text',
        },
        status: Number,
        file: [fileSchema],
    },
    { timestamps: true },
);

messageSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});

var Message = mongoose.model('Message', messageSchema);

module.exports = { Message };
