const { GroupChat } = require('../model/groupChat');
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
    addReaction: async (req, res) => {
        try {
            var idMess = req.body.id;
            var dataReaction = req.body.reactionMess;

            var mess = await Message.findById(idMess);
            if (!!mess) {
                // chay vong lap de kiem tra user da chon react chua
                if (!!mess.reactionMess && mess.reactionMess.length > 0) {
                    for (let reaction of mess.reactionMess) {
                        if (
                            reaction.userId === dataReaction.userId &&
                            reaction.type_emotion === dataReaction.type_emotion
                        ) {
                            res.status(200).json(false);
                        }
                    }
                }
                await mess.updateOne({ $push: { reactionMess: dataReaction } });
            } else res.status(200).json(false);

            return res.status(200).json(true);
        } catch (error) {
            console.log(error);
            res.status(500).json(false);
        }
    },
    addMess: async (req, res) => {
        try {
            var newMess = new Message(req.body);

            var saveMess = await newMess.save();

            var idChat = newMess.idChat;
            var chat = await GroupChat.findById(idChat);
            await chat.updateOne({ $push: { message: saveMess._id } });

            return res.status(200).json(saveMess);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    deleteMessWithEveryone: async (req, res) => {
        try {
            // status: -1: xoá tất cả với mọi người

            var idGroup = req.params.id;
            var idMess = req.params.idMess;

            const message = await Message.findById(idMess);
            const chat = await GroupChat.findById(idGroup);

            if (!!chat && !!message) {
                console.log(message);
                var file = message.file;
                if (!!message.file && !!file && file.length > 0) {
                    var length = file.length;
                    for (let i = 0; i < length; i++) {
                        var keyFile = file[i].path.split('https://n14-lcn-bucket.s3.ap-southeast-1.amazonaws.com/')[1];

                        var params = {
                            Bucket: bucketName,

                            Key: keyFile,
                        };
                        s3.deleteObject(params, function (err, data) {
                            if (err) console.log(err, err.stack);
                            else console.log('delete', data);
                        });
                    }
                }
                await chat.updateOne({ $pull: { message: idMess } });
                await message.remove();
                const newChat = await GroupChat.findById(idGroup);
                return res.status(200).json(newChat);
            } else return res.status(200).json(chat);

            //return 1 : xoa thanh cong
            // return res.status(200).json(1);
        } catch (error) {
            console.log(error);
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
                .populate('authorID')
                .populate({ path: 'reactionMess.idUser', select: 'fullName' });

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
