"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const ApiError_1 = require("../core/ApiError");
const JWT_1 = __importDefault(require("../core/JWT"));
const KeystoreRepo_1 = __importDefault(require("../database/repository/KeystoreRepo"));
const mongoose_1 = require("mongoose");
const authUtils_1 = require("./authUtils");
const validator_1 = __importStar(require("../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const router = express_1.default.Router();
exports.default = router.use((0, validator_1.default)(schema_1.default.auth, validator_1.ValidationSource.HEADER), (0, asyncHandler_1.default)(async (req, res, next) => {
    req.accessToken = (0, authUtils_1.getAccessToken)(req.headers.authorization);
    try {
        const payload = await JWT_1.default.validate(req.accessToken);
        (0, authUtils_1.validateTokenData)(payload);
        const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
        if (!user)
            throw new ApiError_1.AuthFailureError('User not registered');
        req.user = user;
        const keystore = await KeystoreRepo_1.default.findforKey(req.user, payload.prm);
        if (!keystore)
            throw new ApiError_1.AuthFailureError('Invalid access token');
        req.keystore = keystore;
        return next();
    }
    catch (e) {
        if (e instanceof ApiError_1.TokenExpiredError)
            throw new ApiError_1.AccessTokenError(e.message);
        throw e;
    }
}));
//# sourceMappingURL=authentication.js.map