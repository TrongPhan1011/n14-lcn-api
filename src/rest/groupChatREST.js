const { GroupChat } = require('../model/groupChat');
const { User } = require('../model/user');

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
            return res.status(500).json(error);
        }
    },
    getAllChatByUserId: async (req, res) => {
        try {
            const user = await User.findById(req.query.id).populate('listGroup');

            const listGroupChat = user.listGroup;

            return res.status(200).json(listGroupChat);
        } catch (error) {
            return res.status(500).json(error);
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
    getMemberOfChat: async (req, res) => {
        try {
            const idChat = req.query.idChat;
            const arrMember = await User.find(
                { status: 1, listGroup: { $in: [idChat] } },
                { _id: 1, fullName: 1, status: 1, profile: 1 },
            );
            return res.status(200).json(arrMember);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getMemberWaiting: async (req, res) => {
        try {
            const idChat = req.query.idChat;
            const chat = await GroupChat.findById(idChat).populate('memberWaiting');
            const arrMember = chat.memberWaiting;
            if (!!chat && !!arrMember) return res.status(200).json(arrMember);
            else return res.status(200).json([]);
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    addMember: async (req, res) => {
        try {
            const idChat = req.params.id;
            const arrMember = req.body;

            const GROUP_PUBLIC = 1;

            const chat = await GroupChat.findById(idChat);

            if (!!chat) {
                var arrNewMember = arrMember.filter((newMember) => !chat.member.includes(newMember));
                if (chat.status === GROUP_PUBLIC) {
                    await chat.updateOne({ $push: { member: arrNewMember } });
                    for (var idUser of arrMember) {
                        var member = User.findById(idUser);

                        await member.updateOne({ $push: { listGroup: chat._id } });
                    }
                } else {
                    await chat.updateOne({ $push: { memberWaiting: req.body } });
                }
                var newChat = await GroupChat.findById(idChat);
                return res.status(200).json(newChat);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    requestMemberChat: async (req, res) => {
        try {
            const idChat = req.params.id;
            const arrMember = req.body;
            const statusRequest = req.query.action;

            const chat = await GroupChat.findById(idChat);

            if (!!chat) {
                var arrNewMember = arrMember.filter((newMember) => !chat.member.includes(newMember));
                if (statusRequest === 'accept') {
                    await chat.updateOne({ $push: { member: arrNewMember }, $pullAll: { memberWaiting: req.body } });
                    for (var idUser of arrMember) {
                        var member = User.findById(idUser);

                        await member.updateOne({ $push: { listGroup: chat._id } });
                    }
                } else {
                    await chat.updateOne({ $pullAll: { memberWaiting: req.body } });
                }
                const newChat = await GroupChat.findById(idChat);

                return res.status(200).json(newChat);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    removeMemberChat: async (req, res) => {
        try {
            const idChat = req.params.id;
            const arrMember = req.body;

            const chat = await GroupChat.findById(idChat);

            if (!!chat) {
                await chat.updateOne({ $pullAll: { adminChat: req.body } });
                for (var idUser of arrMember) {
                    var member = User.findById(idUser);

                    await member.updateOne({ $pull: { listGroup: chat._id } });
                }

                const newChat = await GroupChat.findById(idChat);

                return res.status(200).json(newChat);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            res.status(500).json(error);
        }
    },

    addAdminChat: async (req, res) => {
        try {
            const idChat = req.params.id;
            const arrAdmin = req.body;

            const chat = await GroupChat.findById(idChat);

            if (!!chat) {
                await chat.updateOne({ $push: { adminChat: req.body } });

                chat.adminChat = [...chat.adminChat, ...arrAdmin];

                return res.status(200).json(chat);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    changeStatusChat: async (req, res) => {
        try {
            const idChat = req.params.id;

            const status = req.query.status;

            const chat = await GroupChat.findById(idChat);

            if (!!chat) {
                var memberWaiting = chat.memberWaiting;
                await chat.updateOne({ $set: { status: status, memberWaiting: [] }, $push: { member: memberWaiting } });

                for (var idUser of memberWaiting) {
                    var member = User.findById(idUser);

                    await member.updateOne({ $push: { listGroup: chat._id } });
                }

                const newChat = await GroupChat.findById(idChat);

                return res.status(200).json(newChat);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

module.exports = userREST;
