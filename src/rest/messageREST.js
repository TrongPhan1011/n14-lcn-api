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
            var idChat = req.query.idChat;

            var newMess = new Message(req.body);
            var saveMess = await newMess.save();

            var chat = GroupChat.findById(idChat);
            var message = await chat.findOneAndUpdate({ $push: { message: saveMess.id } });

            return res.status(200).json(message);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = messageREST;
