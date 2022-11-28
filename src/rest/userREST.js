const { User } = require('../model/user');

const { AuthModel } = require('../model/authModel');
const mongoose = require('mongoose');
const { GroupChat } = require('../model/groupChat');

const userREST = {
    addUser: async (req, res) => {
        try {
            const newUser = new User(req.body);
            const savedUser = await newUser.save();

            return res.status(200).json(savedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    /* 
         {
            idUser,
            idFriend
         }
    */
    addFriend: async (req, res) => {
        try {
            const user = User.findById(req.body.idUser);
            const friend = User.findById(req.body.idFriend);

            await user.updateOne({ $push: { friend: { id: req.body.idFriend, status: 2 } } });
            await friend.updateOne({ $push: { friend: { id: req.body.idUser, status: 0 } } });

            return res.status(200).json('add friend successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteFriend: async (req, res) => {
        console.log(req.body.idUser);
        try {
            await User.findOneAndUpdate(
                { _id: req.body.idUser },
                { $pull: { friend: { id: req.body.idFriend } } },
                { safe: true, multi: false },
            );
            await User.findOneAndUpdate(
                { _id: req.body.idFriend },
                { $pull: { friend: { id: req.body.idUser } } },
                { safe: true, multi: false },
            );

            return res.status(200).json('delete friend successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    acceptFriend: async (req, res) => {
        try {
            await User.findOneAndUpdate(
                { _id: req.body.idUser, 'friend.id': req.body.idFriend },
                {
                    $set: {
                        'friend.$.status': 1,
                    },
                },
            );
            await User.findOneAndUpdate(
                { _id: req.body.idFriend, 'friend.id': req.body.idUser },
                {
                    $set: {
                        'friend.$.status': 1,
                    },
                },
            );

            return res.status(200).json('Chấp nhận kết bạn thành công');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    blockFriend: async (req, res) => {
        try {
            await User.findOneAndUpdate(
                { _id: req.body.idUser, 'friend.id': req.body.idFriend },
                {
                    $set: {
                        'friend.$.status': -1,
                    },
                },
            );
            await User.findOneAndUpdate(
                { _id: req.body.idFriend, 'friend.id': req.body.idUser },
                {
                    $set: {
                        'friend.$.status': -2,
                    },
                },
            );

            return res.status(200).json('Chặn thành công');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            return res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserByPhoneNumber: async (req, res) => {
        try {
            const user = await User.findOne({ phoneNumber: req.params.phoneNumber });

            return res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserByAccountId: async (req, res) => {
        try {
            const accountId = req.params.accountId;

            const account = await AuthModel.findOne({ _id: accountId });

            if (!!account) {
                // console.log(account);
                const user = await User.findOne({ email: account.userName });

                return res.status(200).json(user);
            } else res.status(404).json('Khong tim thay account');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getUserByTextSearch: async (req, res) => {
        try {
            var params = req.query;

            var valueSearch = params.q;
            var limitResult = params._limit;
            var idUser = params.idUser;

            var listUser = await User.find({ $text: { $search: valueSearch } }).limit(limitResult);
            var listGroup = await GroupChat.find({
                $text: { $search: valueSearch },
                typeChat: 'group',
                status: 1,
            }).limit(limitResult);
            listGroup = listGroup.filter((group) => {
                // chay some de check object trong mang ban be
                return group.member.includes(idUser);
            });

            const searchResult = {
                users: listUser,
                groups: listGroup,
            };
            return res.status(200).json(searchResult);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    getAllFriendByStatus: async (req, res) => {
        try {
            var params = req.query;

            var status = params.status;

            const arrUser = await User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
                {
                    $lookup: {
                        from: User.collection.name,
                        let: { friend: '$friend' },
                        pipeline: [
                            {
                                $match: {
                                    friend: { id: mongoose.Types.ObjectId(req.params.id), status: parseInt(status) },
                                },
                            },
                            {
                                $project: {
                                    fullName: 1,
                                    'profile.urlAvartar': 1,
                                    listGroup: 1,
                                    'friend.status': 1,
                                    'friend.id': 1,
                                },
                            },
                        ],
                        as: 'friend',
                    },
                },
            ]);

            return res.status(200).json(arrUser);
        } catch (error) {
            console.log(error);
        }
    },
    updateUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            await user.updateOne({ $set: req.body });
            res.status(200).json('update thành công');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateAvatar: async (req, res) => {
        try {
            await User.findOneAndUpdate(
                { _id: req.body.idUser },
                {
                    $set: {
                        'profile.urlAvartar': req.body.avatar,
                    },
                },
            );
            res.status(200).json('update thành công');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateBanner: async (req, res) => {
        try {
            console.log(req.body.banner);
            await User.findOneAndUpdate(
                { _id: req.body.idUser },
                {
                    $set: {
                        'profile.urlCoverPhoto': req.body.banner,
                    },
                },
            );
            return res.status(200).json('update thành công');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateUserProfile: async (req, res) => {
        console.log(req.body);
        try {
            await User.findOneAndUpdate(
                { _id: req.body.idUser },
                {
                    $set: {
                        'profile.education': req.body.education,
                        fullName: req.body.fullName,
                        gender: req.body.gender,
                        birthday: req.body.birthday,
                    },
                },
            );
            return res.status(200).json('update thành công');
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = userREST;
