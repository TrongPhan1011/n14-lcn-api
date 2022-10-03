const { User } = require('../model/user');

const userREST = {
    addChat: async (req, res) => {
        try {
            return res.status(200);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = userREST;
