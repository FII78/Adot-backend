"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendCode = exports.verifyPhone = void 0;
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const OtpRepo_1 = __importDefault(require("../database/repository/OtpRepo"));
const otp_1 = require("../helpers/otp");
const otp_2 = require("../helpers/otp");
const verifyPhone = async (req, res, next) => {
    const { phone, otp } = req.body;
    const checkUser = await UserRepo_1.default.findByPhone(phone);
    if (!checkUser) {
        res.locals.json = {
            statusCode: 400,
            message: 'Wrong verification code'
        };
        return next();
    }
    if (checkUser.isVerified) {
        res.locals.json = {
            statusCode: 400,
            message: 'User is already Verified'
        };
        return next();
    }
    const user = await validateUser(phone, otp);
    if (!user) {
        res.locals.json = {
            statusCode: 400,
            message: 'Wrong verification code'
        };
        return next();
    }
    res.locals.json = {
        statusCode: 200,
        message: 'Account successfully verified'
    };
    return next();
};
exports.verifyPhone = verifyPhone;
const resendCode = async (req, res, next) => {
    const { phone } = req.body;
    const OTP = await OtpRepo_1.default.findByPhone(phone);
    if (!OTP) {
        res.locals.json = {
            statusCode: 404,
            message: 'User not registered'
        };
        return next();
    }
    const newOtp = (0, otp_1.generateOTP)(6);
    OTP.otpCode = newOtp;
    const otp = await OtpRepo_1.default.create({
        phone: phone,
        otpCode: newOtp
    });
    try {
        await (0, otp_2.sendOtp)(phone, newOtp);
        return next();
    }
    catch (error) {
        res.locals.json = {
            statusCode: 400,
            message: 'Cannot resend verification code'
        };
        return next();
    }
};
exports.resendCode = resendCode;
const validateUser = async (phone, otpCode) => {
    try {
        const user = await UserRepo_1.default.findByPhone(phone);
        if (!user) {
            return false;
        }
        const userOtp = await OtpRepo_1.default.findByPhone(phone);
        if (userOtp && userOtp.otpCode !== otpCode) {
            return false;
        }
        user.isVerified = true;
        const updatedUser = await UserRepo_1.default.updateInfo(user);
        return updatedUser;
    }
    catch (error) {
        return false;
    }
};
//# sourceMappingURL=verify.js.map