const { OTP } = require('../model/otp');
const { User } = require('../model/user');
const OtpGenerator = require('otp-generator');
const sgMail = require('@sendgrid/mail');
const API_KEY = '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';
sgMail.setApiKey(API_KEY);
const otpREST = {
    createOTP: async (req, res) => {
        // check mail tồn tại hay chưa
        const checkMail = await User.findOne({ email: req.body.email });
        if (checkMail) {
            return res.status(400).json('mail da ton tai');
        }
        //create OTP
        const OTPran = OtpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        const otp = await OTP.create({ email: req.body.email, otp: OTPran });

        // tạo mess OTP
        const message = {
            to: req.body.email,
            from: '5442654@gmail.com',
            subject: 'Gửi mã verify',
            text: `Mã otp của bạn là ${OTPran}`,
        };
        // send OTP
        try {
            // await sgMail.send(message);
            return res.status(200).json('đã gửi thành công');
        } catch (error) {
            return console.log(error);
        }
    },
};

module.exports = otpREST;
