const bscypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { GroupChat } = require('../model/groupChat');
const { User } = require('../model/user');
const { AuthModel } = require('../model/authModel.js');

const middleAuth = {
    /**
     * xác thực quyền đăng nhập
     * Token sẽ được lấy ra từ header, sau đó dùng jwt để verify, nếu lỗi thì trả về 403,
     * Nếu xác thực thành công thì trả về thông tin user
     * Xác thực khôgn thành công thì trả về lại trang login
     */

    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        console.log(token);
        if (token) {
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
                if (err) {
                    return res.status(403).json('Token không còn khả dụng!');
                }
                req.user = user;
                next();
            });
        } else return res.status(401).json('Bạn không có quyền truy cập!');
    },
};

module.exports = middleAuth;
