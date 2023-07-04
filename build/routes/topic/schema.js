"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = require("../../helpers/validator");
exports.default = {
    topicUrl: joi_1.default.object().keys({
        endpoint: (0, validator_1.JoiUrlEndpoint)().required().max(200),
    }),
    topicId: joi_1.default.object().keys({
        id: (0, validator_1.JoiObjectId)().required(),
    }),
    topicCreate: joi_1.default.object().keys({
        title: joi_1.default.string().required().min(3).max(500),
        description: joi_1.default.string().required().min(3).max(2000),
        reviewer: joi_1.default.string().required(),
        category: joi_1.default.string().required()
    }),
    topicUpdate: joi_1.default.object().keys({
        title: joi_1.default.string().optional().min(3).max(500),
        description: joi_1.default.string().optional().min(3).max(2000),
    }),
};
//# sourceMappingURL=schema.js.map