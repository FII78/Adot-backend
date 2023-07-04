"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = require("../../helpers/validator");
exports.default = {
    insightUrl: joi_1.default.object().keys({
        endpoint: (0, validator_1.JoiUrlEndpoint)().required().max(200),
    }),
    insightCreate: joi_1.default.object().keys({
        title: joi_1.default.string().required().min(3).max(500),
        content: joi_1.default.string().required().min(3),
        stage: joi_1.default.string().required().max(50000),
        referance: joi_1.default.string().optional(),
        reviewer: joi_1.default.string().required(),
        topic: joi_1.default.string().required(),
        category: joi_1.default.string().required()
    }),
    insightUpdate: joi_1.default.object().keys({
        title: joi_1.default.string().optional().min(3).max(500),
        content: joi_1.default.string().optional().min(3),
        stage: joi_1.default.string().optional().max(50000),
        referance: joi_1.default.string().optional(),
    }),
    insightId: joi_1.default.object().keys({
        id: (0, validator_1.JoiObjectId)().required(),
    }),
    insightStage: joi_1.default.object().keys({
        stage: joi_1.default.string().required(),
    }),
    pagination: joi_1.default.object().keys({
        pageNumber: joi_1.default.number().required().integer().min(1),
        pageItemCount: joi_1.default.number().required().integer().min(1),
    }),
    requiredId: joi_1.default.object().keys({
        id: (0, validator_1.JoiObjectId)().required(),
    }),
};
//# sourceMappingURL=schema.js.map