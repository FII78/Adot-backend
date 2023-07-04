"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'User';
exports.COLLECTION_NAME = 'users';
const schema = new mongoose_1.Schema({
    firstName: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 200,
        required: true,
    },
    lastName: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 200,
        required: true,
    },
    phone: {
        type: mongoose_1.Schema.Types.String,
        maxlength: 14,
        required: true,
        unique: true,
    },
    profilePic: {
        type: mongoose_1.Schema.Types.String,
        required: false,
        default: '',
    },
    email: {
        type: mongoose_1.Schema.Types.String,
        unique: true,
        trim: true,
        required: false,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        required: false,
        default: 'User',
    },
    stage: {
        type: mongoose_1.Schema.Types.Number,
        enum: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
            36, 37, 38, 39, 40
        ],
        required: false,
        default: 1,
    },
    title: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    bio: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    savedInsights: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: false,
    },
    salt: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
        default: Date.now(),
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
        default: Date.now(),
    },
}, {
    versionKey: false,
});
schema.index({ _id: 1, status: 1 });
schema.index({ phone: 1 });
schema.index({ status: 1 });
exports.UserModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=User.js.map