const { GroupChat } = require('../model/groupChat');
const { Message } = require('../model/message');
const generateOneUrlFile = require('./getUrlFile');

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
            console.log(error);
            res.status(500).json(error);
        }
    },

    deleteMessWithEveryone: async (req, res) => {
        try {
            // status: -1: xoá tất cả với mọi người

            var idGroup = req.params.id;
            var idMess = req.params.idMess;
            await Message.findOneAndUpdate({ _id: idMess }, { $set: { status: -1 } }, { safe: true, multi: false });
            await GroupChat.findOneAndUpdate(
                { _id: idGroup },
                { $pull: { message: idMess } },
                { safe: true, multi: false },
            );

            // return 1 : xoa thanh cong
            return res.status(200).json(1);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteMessWithUser: async (req, res) => {
        try {
            // status: 0: xoá chỉ mình user

            var idMess = req.params.idMess;
            await Message.findOneAndUpdate({ _id: idMess }, { $set: { status: 0 } }, { safe: true, multi: false });

            return res.status(200).json(1);
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
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('authorID');

            res.status(200).json(listMess.reverse());
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getMessageFileByIdChat: async (req, res) => {
        try {
            var limit = req.query.limit;
            var skip = req.query.skip;

            var listMess = await Message.find({ idChat: req.query.idchat, title: '' })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(limit * skip)
                .populate('authorID');

            res.status(200).json(listMess.reverse());
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = messageREST;
