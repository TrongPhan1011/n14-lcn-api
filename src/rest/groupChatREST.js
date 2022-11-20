const { GroupChat } = require('../model/groupChat');
const { User } = require('../model/user');
const { Message } = require('../model/message');
const { S3 } = require('@aws-sdk/client-s3');

const dotenv = require('dotenv');

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const userREST = {
    addChat: async (req, res) => {
        try {
            const newChat = new GroupChat(req.body);

            var idNewChat = newChat.id;
            var arrNameMember = [];

            if (newChat.typeChat === 'inbox') {
                const chatInboxExist = await GroupChat.findOne({
                    typeChat: 'inbox',
                    $or: [
                        { member: [newChat.member[0], newChat.member[1]] },
                        { member: [newChat.member[1], newChat.member[0]] },
                    ],
                });
                // inbox da ton tai
                if (!!chatInboxExist) {
                    return res.status(200).json(null);
                }
            }

            // them group chat vao user
            for (var idUser of newChat.member) {
                var member = await User.findById(idUser);
                var arrName = member.fullName.split(' ');
                arrNameMember.push(arrName[arrName.length - 1]);

                await member.updateOne({ $push: { listGroup: idNewChat } });
            }

            // tao ten tu dong trong truong hop day la group chat
            if (newChat.typeChat !== 'inbox') {
                var newNameChat = arrNameMember[0] + ', ' + arrNameMember[1] + ', ' + arrNameMember[2];
                if (arrNameMember.length > 4) {
                    newNameChat += ' và ' + (arrNameMember.length - 3) + ' người khác';
                }

                newChat.name = newNameChat;
            }

            var newUserLogin = await User.findById(newChat.userCreate);

            const saveChat = await newChat.save();

            return res.status(200).json({ newChat: saveChat, userLogin: newUserLogin });
        } catch (error) {
            console.log(error);
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
    getAllFileOfChat: async (req, res) => {
        try {
            const chat = await GroupChat.findById(req.params.id).populate('message');

            var arrMessFile = chat.message.filter((mess) => mess.file.length > 0);

            return res.status(200).json(arrMessFile);
        } catch (error) {
            console.log(error);
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
    getInboxByIdFriend: async (req, res) => {
        try {
            var idUser = req.query.idUser;
            var idFriend = req.query.idFriend;

            const chat = await GroupChat.findOne({
                typeChat: 'inbox',
                $or: [{ member: [idUser, idFriend] }, { member: [idFriend, idUser] }],
            });

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
    removeChat: async (req, res) => {
        try {
            const idChat = req.params.id;
            const userId = req.query.idCurUser;

            const chat = await GroupChat.findById(idChat);

            if (!!chat) {
                // status = -1 --> group da bi xoa

                for (let idMess of chat.message) {
                    const message = await Message.findById(idMess);
                    if (!!message) {
                        var file = message.file;
                        if (!!file) {
                            var length = file.length;
                            for (let i = 0; i < length; i++) {
                                //console.log(file[i].key);
                                var keyFile = file[i].path.split(
                                    'https://n14-lcn-bucket.s3.ap-southeast-1.amazonaws.com/',
                                )[1];
                                console.log(keyFile);
                                var params = {
                                    Bucket: bucketName,
                                    //Key: file[i].key,
                                    Key: keyFile,
                                };
                                s3.deleteObject(params, function (err, data) {
                                    if (err) console.log(err, err.stack);
                                    else console.log('delete', data);
                                });
                            }
                        }
                        await message.remove();
                    }
                }
                var arrMember = chat.member;
                for (var idUser of arrMember) {
                    var member = User.findById(idUser);

                    await member.updateOne({ $pull: { listGroup: chat._id } });
                }
                await chat.remove();

                const currUser = await User.findById(userId);

                return res.status(200).json(currUser);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            console.log(error);
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
    memberLeaveChat: async (req, res) => {
        try {
            const idChat = req.params.id;
            const idUser = req.query.idUser;

            const chat = await GroupChat.findById(idChat);
            const user = await User.findById(idUser);

            if (!!chat) {
                await chat.updateOne({
                    $pull: { adminChat: idUser },
                });

                console.log(chat._id);
                await user.updateOne({ $pull: { listGroup: chat._id } });
                // const newChat = await GroupChat.findById(idChat);
                const newUser = await User.findById(idUser);
                return res.status(200).json(newUser);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            console.log(error);
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
    changeNameChat: async (req, res) => {
        try {
            const idChat = req.params.id;

            const newName = req.query.name;
            const idUser = req.query.idUser;

            const chat = await GroupChat.findById(idChat);

            console.log(chat);
            if (!!chat) {
                await chat.updateOne({ $set: { name: newName } });

                const newUser = await User.findById(idUser);

                return res.status(200).json(newUser);
            }
            return res.status(404).json('Không tìm thấy group chat');
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    },
};

module.exports = userREST;
