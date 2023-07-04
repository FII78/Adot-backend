"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Otp';
exports.COLLECTION_NAME = 'otps';
const schema = new mongoose_1.Schema({
    phone: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 14,
        required: true,
        unique: true
    },
    otpCode: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        maxlength: 6
    },
}, {
    versionKey: false,
});
schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });
exports.OtpModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=OTP.js.map