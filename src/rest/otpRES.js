const { OTP } = require('../model/otp');
const { User } = require('../model/user');
const { Ban } = require('../model/ban');
const OtpGenerator = require('otp-generator');
const sgMail = require('@sendgrid/mail');
const API_KEY = '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';
sgMail.setApiKey(API_KEY);
const otpREST = {
    createOTP: async (req, res) => {
        //create OTP
        const OTPran = OtpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        const otp = await OTP.create({ email: req.body.userName, otp: OTPran });

        // tạo mess OTP
        const message = {
            to: req.body.userName,
            from: { name: 'LCN', email: '5442654@gmail.com' },
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
    banAccount: async (req, res) => {
        try {
            const ban = await Ban.create({ email: req.body.userName });
            return res.status(200).json(ban);
        } catch (error) {
            return console.log(error);
        }
    },
    findBanAccount: async (req, res) => {
        try {
            const ban = await Ban.findOne({ email: req.params.email });
            return res.status(200).json(ban);
        } catch (error) {
            console.log(error);
        }
    },
    verifyOtp: async (req, res) => {
        try {
            //veirify OTP

            const otpNhapVao = req.query.otp;

            const otpDaGui = await OTP.find({ email: req.query.email });
            const lastOTP = otpDaGui[otpDaGui.length - 1];

            // console.log(lastOTP);
            // create new auth
            // console.log(otpDaGui);
            // userName = email
            // console.log(lastOTP.otp);

            if (otpNhapVao !== lastOTP.otp) {
                return res.status(401).json('OTP không đúng!');
            } else {
                await OTP.deleteMany({ email: req.query.email });
                return res.status(200).json(3);
            }
        } catch (error) {
            return console.log(error);
        }
    },
};

module.exports = otpREST;
