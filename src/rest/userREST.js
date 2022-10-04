const { User } = require('../model/user');

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
    getUserByTextSearch: async (req, res) => {
        try {
            var params = req.query;

            var valueSearch = params.q;
            var limitResult = params._limit;

            const listUser = await User.find({ $text: { $search: valueSearch } }).limit(limitResult);

            // const user = await User.findOne({ phoneNumber: req.params.phoneNumber });

            return res.status(200).json(listUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllFriendByStatus: async (req, res) => {
        try {
            var params = req.query;
            var status = params.status;
            const user = await User.findById({ _id: req.params.id })
                .populate('friend.id')
                .where('friend.status')
                .equals(status);

            return res.status(200).json(user);
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
};

module.exports = userREST;
