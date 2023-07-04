"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Insights';
exports.COLLECTION_NAME = 'insights';
const schema = new mongoose_1.Schema({
    title: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        maxlength: 500,
        trim: true,
    },
    content: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        trim: true,
    },
    topic: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Topic'
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    stage: {
        type: mongoose_1.Schema.Types.Number,
        required: false,
        default: 1
    },
    thumbnailImage: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    referance: {
        type: mongoose_1.Schema.Types.String,
        required: false,
        maxlength: 500,
        trim: true,
    },
    reviewer: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
});
schema.index({ _id: 1, status: 1 });
schema.index({ title: 'text' });
exports.InsightModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Insight.js.map