const { GroupChat } = require('../model/groupChat');

const userREST = {
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
    getAllChatByUserId: async (req, res) => {
        try {
            const chat = await GroupChat.find({ member: req.query.id });

            return res.status(200).json(chat);
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

module.exports = userREST;
