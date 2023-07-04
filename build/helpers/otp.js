"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.sendOtp = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const accountSid = process.env.OTP_ACCOUNT_SID;
const authToken = process.env.OTP_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sendOtp = (recipientNumber, generatedOTP) => {
    client.messages
        .create({
        body: `Your OTP: ${generatedOTP}`,
        from: process.env.OTP_PHONE,
        to: recipientNumber
    })
        .then((message) => console.log('OTP sent successfully! Message SID:', message.sid))
        .catch((error) => console.error('Failed to send OTP. Error:', error));
};
exports.sendOtp = sendOtp;
const generateOTP = (length) => {
    const OTP = otp_generator_1.default.generate(length, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });
    return OTP;
};
exports.generateOTP = generateOTP;
//# sourceMappingURL=otp.js.map