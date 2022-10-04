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
    deleteMess: async (req, res) => {
        try {
            const group = GroupChat.findById(req.params.id);
            const filter = { 'message.id': '633bc5cd271f28dcda24dc89' };
            const update = { 'message.status': 1 };
            await group.findOneAndUpdate(filter, update);
            return res.status(200).json('updated');
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

module.exports = userREST;
