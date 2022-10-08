const bscypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { TokenModel } = require('../model/token');
const { AuthModel } = require('../model/authModel.js');

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
                expiresIn: '30d',
            },
        );
        return refreshToken;
    },
    register: async (req, res) => {
        try {
            const salt = await bscypt.genSalt(10);
            const hashPass = await bscypt.hash(req.body.password, salt);

            // create new auth
            // userName = phoneNumber

            const newAuth = await AuthModel({
                userName: req.body.email,
                password: hashPass,
            });
            console.log(newAuth);

            // create new user

            // save
            const user = await newAuth.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
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
};

module.exports = authREST;
