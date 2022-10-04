const { GroupChat } = require('../model/groupChat');

const userREST = {
    addChat: async (req, res) => {
        try {
            return res.status(200);
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

module.exports = userREST;
