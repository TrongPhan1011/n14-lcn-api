const { GroupChat } = require('../model/groupChat');
const { Message } = require('../model/message');
const generateOneUrlFile = require('./getUrlFile');
const { S3Client, PutObjectCommand, S3 } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

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

            // var idGroup = req.params.id;
            // var idMess = req.params.idMess;
            // await Message.findOneAndUpdate({ _id: idMess }, { $set: { status: -1 } }, { safe: true, multi: false });
            // await GroupChat.findOneAndUpdate(
            //     { _id: idGroup },
            //     { $pull: { message: idMess } },
            //     { safe: true, multi: false },
            // );

            var idGroup = req.body.id;
            var idMess = req.body.idMess;
            const message = await Message.findById(idMess);
            const chat = await GroupChat.findById(idGroup);

            if (!!chat) {
                var file = message.file;
                if (!!file) {
                    var length = file.length;
                    for (let i = 0; i < length; i++) {
                        //console.log(file[i].key);
                        var keyFile = file[i].path.split('https://n14-lcn-bucket.s3.ap-southeast-1.amazonaws.com/')[1];
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
                await chat.updateOne({ $pull: { message: idMess } });
                await message.remove();
                return res.status(200).json(1);
            }

            //return 1 : xoa thanh cong
            //return res.status(200).json(1);
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
