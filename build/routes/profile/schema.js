"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = require("../../helpers/validator");
exports.default = {
    userId: joi_1.default.object().keys({
        id: (0, validator_1.JoiObjectId)().required(),
    }),
    profile: joi_1.default.object().keys({
        firstName: joi_1.default.string().min(1).max(200).optional(),
        lastName: joi_1.default.string().min(1).max(200).optional(),
        bio: joi_1.default.string().min(1).max(200).optional(),
        stage: joi_1.default.string().min(1).max(200).optional(),
        profilePic: joi_1.default.string(),
    }),
};
//# sourceMappingURL=schema.js.map