const { GroupChat } = require('../model/groupChat');
const { User } = require('../model/user');

const chatREST = {
    addChat: async (req, res) => {
        try {
            const newChat = new GroupChat(req.body);
            const saveChat = await newChat.save();
            var idNewChat = saveChat.id;

            for (var idUser of saveChat.member) {
                var member = User.findById(idUser);

                await member.updateOne({ $push: { listGroup: idNewChat } });
            }

            return res.status(200).json(saveChat);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addUserSeenToMess: async (req, res) => {
        try {
            var idChat = req.params.idChat;
            var idMess = req.params.idMess;
            var chat = await GroupChat.findById(idChat);

            // console.log(chat.message);

            // var mess = await chat.findOne({
            //     'message.id': idMess,
            // });

            // console.log(chat.mess);
            // await GroupChat.findOneAndUpdate(
            //     { id: idChat, message: { $elemMatch: idMess } },
            //     { 'message.seen': req.body },
            //     { new: true, safe: true, upsert: true },
            // );

            // var message = await chat.updateOne();

            return res.status(200).json(chat);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    addMessToChat: async (req, res) => {
        try {
            var idChat = req.params.id;

            var chat = GroupChat.findById(idChat);
            var message = await chat.findOneAndUpdate({ $push: { message: req.body } });

            return res.status(200).json(message);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getAllChatByUserId: async (req, res) => {
        try {
            const user = await GroupChat.findById(req.query.id);

            return res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getChatById: async (req, res) => {
        try {
            const chat = await GroupChat.findById(req.params.id);

            return res.status(200).json(chat);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = chatREST;
