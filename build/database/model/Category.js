"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Category';
exports.COLLECTION_NAME = 'categorys';
const schema = new mongoose_1.Schema({
    title: {
        type: mongoose_1.Schema.Types.String,
        required: true
    }
});
schema.index({ _id: 1, status: 1 });
schema.index({ status: 1 });
exports.CategoryModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Category.js.map