const bscypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { TokenModel } = require('../model/token');
const { AuthModel } = require('../model/authModel.js');
const { response } = require('express');
const { User } = require('../model/user');
const { OTP } = require('../model/otp');
const API_KEY = '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';
sgMail.setApiKey(API_KEY);
const message = {
    to: 'lcncnmnhom14@gmail.com',
    from: '5442654@gmail.com',
    subject: 'hello test',
    text: 'mã otp của bạn là 1234',
};

const authREST = {
    createAccessToken: (user) => {
        const accessToken = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_ACCESS_TOKEN,
            {
                expiresIn: '30d',
            },
        );
        return accessToken;
    },
    createRefreshToken: (user) => {
        const refreshToken = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_REFRESH_TOKEN,
            {
                expiresIn: '365d',
            },
        );
        return refreshToken;
    },
    register: async (req, res) => {
        try {
            const salt = await bscypt.genSalt(10);
            const hashPass = await bscypt.hash(req.body.password, salt);
            //veirify OTP
            const otpNhapVao = req.body.otp;

            const otpDaGui = await OTP.find({ email: req.body.email });
            const lastOTP = otpDaGui[otpDaGui.length - 1];

            // create new auth
            console.log(otpNhapVao);
            // userName = email
            console.log(lastOTP.otp);

            if (otpNhapVao !== lastOTP.otp) {
                console.log('fff');
                return res.status(401).json('OTP không đúng!');
            }

            const newAuth = await AuthModel({
                userName: req.body.email,
                password: hashPass,
            });
            const user = await newAuth.save();
            console.log(req.body);
            // create new user
            const user1 = await User.create({
                fullName: req.body.userName,
                email: req.body.email,
                phoneNumber: '',
                gender: req.body.gender,
                birthday: req.body.birthday,
            });

            //delete OTP
            if (user) {
                await OTP.deleteMany({ email: req.body.email });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    },
    login: async (req, res) => {
        try {
            const user = await AuthModel.findOne({ userName: req.body.userName });
            if (!user) {
                return res.status(404).json('Tên đăng nhập không hợp lệ!');
            }
            const validPassword = await bscypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return res.status(404).json('Mật khẩu khôgn hợp lệ');
            }
            if (user && validPassword) {
                const accessToken = authREST.createAccessToken(user);
                const refreshToken = authREST.createRefreshToken(user);

                //save token to db
                const saveRefreshToken = new TokenModel({ token: refreshToken });
                await saveRefreshToken.save();

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                const { password, ...infoOthers } = user._doc;
                res.status(200).json({ ...infoOthers, accessToken });
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },
    requestRefreshToken: async (req, res) => {
        console.log(req.cookies);
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) res.status(401).json('Bạn chưa đăng nhập!');

            const findRefreshToken = await TokenModel.findOne({ token: refreshToken });
            if (!findRefreshToken) res.status(403).json('RefreshToken không khả dụng');

            jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return res.status(403).json('Token không còn khả dụng!');
                }

                await TokenModel.deleteOne(findRefreshToken);
                const newAccessToken = authREST.createAccessToken(user);
                const newRefreshToken = authREST.createRefreshToken(user);

                const saveNewRefeshToken = new TokenModel({ token: newRefreshToken });
                await saveNewRefeshToken.save();

                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: '/',
                    sameSite: 'strict',
                });
                res.status(200).json({ accessToken: newAccessToken });
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
    logOut: async (req, res) => {
        res.clearCookie('refreshToken');
        await TokenModel.deleteOne({ token: req.cookies.refreshToken });

        res.status(200).json('Đăng xuất thành công');
    },
    getAuthByMail: async (req, res) => {
        console.log(req);
        try {
            const user = await AuthModel.findOne({ userName: req.query.email });
            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
        }
    },

    updatePassword: async (req, res) => {
        try {
            const salt = await bscypt.genSalt(10);
            const hashPass = await bscypt.hash(req.body.password, salt);
            const user = await AuthModel.findOne({ userName: req.body.userName });
            const validPassword = await bscypt.compare(req.body.password, user.password);
            if (validPassword) {
                return res.status(404).json('Trùng với mật khẩu cũ');
            }
            const user1 = await AuthModel.findOneAndUpdate({ userName: req.body.userName }, { password: hashPass });

            return res.status(200).json(user1);
        } catch (error) {
            console.log(error);
        }
    },
    checkPassword: async (req, res) => {
        try {
            const user = await AuthModel.findOne({ userName: req.query.userName });
            const validPassword = await bscypt.compare(req.query.password, user.password);
            if (validPassword) {
                return res.status(402).json('Trùng với mật khẩu cũ');
            }
            return res.status(200).json('Không trùng với mật khẩu cũ');
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = authREST;
