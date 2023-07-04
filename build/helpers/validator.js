"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiAuthBearer = exports.JoiUrlEndpoint = exports.JoiObjectId = exports.ValidationSource = void 0;
const joi_1 = __importDefault(require("joi"));
const logger_1 = __importDefault(require("../core/logger"));
const ApiError_1 = require("../core/ApiError");
const mongoose_1 = require("mongoose");
var ValidationSource;
(function (ValidationSource) {
    ValidationSource["BODY"] = "body";
    ValidationSource["HEADER"] = "headers";
    ValidationSource["QUERY"] = "query";
    ValidationSource["PARAM"] = "params";
})(ValidationSource = exports.ValidationSource || (exports.ValidationSource = {}));
const JoiObjectId = () => joi_1.default.string().custom((value, helpers) => {
    if (!mongoose_1.Types.ObjectId.isValid(value))
        return helpers.error('any.invalid');
    return value;
}, 'Object Id Validation');
exports.JoiObjectId = JoiObjectId;
const JoiUrlEndpoint = () => joi_1.default.string().custom((value, helpers) => {
    if (value.includes('://'))
        return helpers.error('any.invalid');
    return value;
}, 'Url Endpoint Validation');
exports.JoiUrlEndpoint = JoiUrlEndpoint;
const JoiAuthBearer = () => joi_1.default.string().custom((value, helpers) => {
    if (!value.startsWith('Bearer '))
        return helpers.error('any.invalid');
    if (!value.split(' ')[1])
        return helpers.error('any.invalid');
    return value;
}, 'Authorization Header Validation');
exports.JoiAuthBearer = JoiAuthBearer;
exports.default = (schema, source = ValidationSource.BODY) => (req, res, next) => {
    try {
        const { error } = schema.validate(req[source]);
        if (!error)
            return next();
        const { details } = error;
        const message = details
            .map((i) => i.message.replace(/['"]+/g, ''))
            .join(',');
        logger_1.default.error(message);
        next(new ApiError_1.BadRequestError(message));
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=validator.js.map