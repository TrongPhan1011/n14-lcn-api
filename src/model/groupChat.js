const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: ' ',
        },
        userCreate: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },

        avatar: {
            type: String,
            default: null,
        },
        typeChat: {
            type: String,
            default: 'inbox',
        },
        adminChat: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: Number,
            default: 1,
        },
        member: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        blockMember: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        memberWaiting: [
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
    },
    { timestamps: true },
);
groupChatSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
groupChatSchema.index({ name: 'text' });

var GroupChat = mongoose.model('GroupChat', groupChatSchema);

module.exports = { GroupChat };
