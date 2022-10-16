const { GroupChat } = require('../model/groupChat');
const { Message } = require('../model/message');
const { User } = require('../model/user');

const messageREST = {
    addUserSeenToMess: async (req, res) => {
        try {
            var idMess = req.params.id;

            var mess = await Message.findById(idMess);

            await mess.updateOne({ $push: { seen: req.body } });

            return res.status(200).json(mess);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addMess: async (req, res) => {
        try {
            var newMess = new Message(req.body);
            var saveMess = await newMess.save();

            var idChat = newMess.idChat;
            var chat = GroupChat.findById(idChat);
            await chat.findOneAndUpdate({ $push: { message: saveMess._id } });

            return res.status(200).json(saveMess);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteMess: async (req, res) => {
        try {
            await GroupChat.findOneAndUpdate(
                { _id: req.params.id },
                { $pull: { message: req.params.idMess } },
                { safe: true, multi: false },
            );

            return res.status(200).json('chat');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getMessageById: async (req, res) => {
        try {
            var message = await Message.findById(req.params.id).populate('authorID');
            res.status(200).json(message);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getMessageByIdChat: async (req, res) => {
        try {
            var limit = req.query.limit;

            var listMess = await Message.find({ idChat: req.query.idchat })
                .sort({ created_at: -1 })
                .limit(limit)
                .populate('authorID');

            res.status(200).json(listMess);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = messageREST;
