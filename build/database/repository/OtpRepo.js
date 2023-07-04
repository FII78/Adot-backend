"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OTP_1 = require("../model/OTP");
async function findByPhone(phone) {
    return OTP_1.OtpModel.findOne({ phone: phone })
        .select('+phone +otp')
        .lean()
        .exec();
}
async function create(otp) {
    const now = new Date();
    const createdOtp = await OTP_1.OtpModel.create(otp);
    return {
        otp: { ...createdOtp.toObject() }
    };
}
exports.default = {
    findByPhone,
    create
};
//# sourceMappingURL=OtpRepo.js.map