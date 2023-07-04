"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("../../core/ApiResponse");
const crypto_1 = __importDefault(require("crypto"));
const crypto_2 = require("crypto");
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const ApiError_1 = require("../../core/ApiError");
const KeystoreRepo_1 = __importDefault(require("../../database/repository/KeystoreRepo"));
const authUtils_1 = require("../../auth/authUtils");
const validator_1 = __importDefault(require("../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const utils_1 = require("./utils");
const util_1 = require("util");
const scryptAsync = (0, util_1.promisify)(crypto_2.scrypt);
const router = express_1.default.Router();
router.post('/basic', (0, validator_1.default)(schema_1.default.credential), (0, asyncHandler_1.default)(async (req, res) => {
    const user = await UserRepo_1.default.findByPhone(req.body.phone);
    if (!user)
        throw new ApiError_1.BadRequestError('User not registered');
    if (!user.password)
        throw new ApiError_1.BadRequestError('Credential not set');
    if (!user.isVerified)
        throw new ApiError_1.BadRequestError('User not verified');
    const match = await comparePasswords(req.body.password, user.password, user.salt || '');
    if (!match)
        throw new ApiError_1.AuthFailureError('Authentication failure');
    const accessTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    await KeystoreRepo_1.default.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await (0, authUtils_1.createTokens)(user, accessTokenKey, refreshTokenKey);
    const userData = await (0, utils_1.getUserData)(user);
    new ApiResponse_1.SuccessResponse('Login Success', {
        user: userData,
        tokens: tokens,
    }).send(res);
}));
async function comparePasswords(inputPassword, storedPassword, salt) {
    const inputPasswordBuffer = Buffer.from(inputPassword, 'utf8');
    const storedPasswordBuffer = Buffer.from(storedPassword, 'hex');
    const derivedKey = await scryptAsync(inputPasswordBuffer, Buffer.from(salt, 'hex'), 64);
    return (0, crypto_2.timingSafeEqual)(derivedKey, storedPasswordBuffer);
}
exports.default = router;
//# sourceMappingURL=login.js.map