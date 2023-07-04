"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Topic';
exports.COLLECTION_NAME = 'topics';
const schema = new mongoose_1.Schema({
    thumbnaiIimage: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    reviewer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    title: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    description: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
        default: Date.now()
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
        default: Date.now()
    },
}, {
    versionKey: false,
});
schema.index({ _id: 1, status: 1 });
schema.index({ status: 1 });
exports.TopicModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Topics.js.map