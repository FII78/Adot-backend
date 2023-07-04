"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = require("../../helpers/validator");
exports.default = {
    categoryId: joi_1.default.object().keys({
        id: (0, validator_1.JoiObjectId)().required(),
    }),
    pagination: joi_1.default.object().keys({
        pageNumber: joi_1.default.number().required().integer().min(1),
        pageItemCount: joi_1.default.number().required().integer().min(1),
    }),
    createCategory: joi_1.default.object().keys({
        title: joi_1.default.string().required().min(3),
    }),
    updateCategory: joi_1.default.object().keys({
        title: joi_1.default.string().optional().min(3),
    }),
};
//# sourceMappingURL=schema.js.map