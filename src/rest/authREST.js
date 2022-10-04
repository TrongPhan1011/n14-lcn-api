const bscypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { GroupChat } = require('../model/groupChat');
const { User } = require('../model/user');
const { AuthModel } = require('../model/authModel.js');

const authREST = {
    login: async (req, res) => {
        try {
            return res.status(200).json(saveChat);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    register: async (req, res) => {
        try {
            const salt = await bscypt.genSalt(10);
            const hashPass = await bscypt.hash(req.body.password, salt);

            // create new auth
            // userName = phoneNumber

            const newAuth = await AuthModel({
                usserName: req.body.phoneNumber,
                password: hashPass,
            });

            // create new user

            // save
            await newAuth.save();
            res.status(200).json('successfully');
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = authREST;
