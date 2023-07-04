"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("../../core/ApiResponse");
const crypto_1 = __importDefault(require("crypto"));
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const ApiError_1 = require("../../core/ApiError");
const authUtils_1 = require("../../auth/authUtils");
const validator_1 = __importDefault(require("../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const utils_1 = require("./utils");
const crypto_2 = require("crypto");
const util_1 = require("util");
const Cloudinary_1 = __importDefault(require("../../config/Cloudinary"));
const multer_1 = require("../../middlewares/multer");
const otp_1 = require("../../helpers/otp");
const otp_2 = require("../../helpers/otp");
const OtpRepo_1 = __importDefault(require("../../database/repository/OtpRepo"));
const scryptAsync = (0, util_1.promisify)(crypto_2.scrypt);
const router = express_1.default.Router();
router.post('/basic', multer_1.filterImage.single('file'), (0, validator_1.default)(schema_1.default.signup), (0, asyncHandler_1.default)(async (req, res) => {
    const user = await UserRepo_1.default.findByEmail(req.body.email);
    if (user)
        throw new ApiError_1.BadRequestError('User already registered');
    const accessTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const salt = (0, crypto_2.randomBytes)(16).toString('hex');
    const passwordBuffer = Buffer.from(req.body.password, 'utf8');
    const derivedKey = await scryptAsync(passwordBuffer, Buffer.from(salt, 'hex'), 64);
    const passwordHash = derivedKey.toString('hex');
    let cloudinaryImage = null;
    if (req.file) {
        cloudinaryImage = await Cloudinary_1.default.uploader.upload(req.file.path, {
            folder: 'Images',
            use_filename: true,
        });
    }
    const { user: createdUser, keystore } = await UserRepo_1.default.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        role: req.body.role,
        bio: req.body.bio,
        title: req.body.title,
        stage: req.body.stage,
        profilePic: cloudinaryImage === null || cloudinaryImage === void 0 ? void 0 : cloudinaryImage.secure_url,
        password: passwordHash,
        salt: salt,
    }, accessTokenKey, refreshTokenKey);
    const OTPGenerated = (0, otp_2.generateOTP)(6);
    await (0, otp_1.sendOtp)(req.body.phone, OTPGenerated);
    const otp = await OtpRepo_1.default.create({
        phone: req.body.phone,
        otpCode: OTPGenerated
    });
    const tokens = await (0, authUtils_1.createTokens)(createdUser, keystore.primaryKey, keystore.secondaryKey);
    const userData = await (0, utils_1.getUserData)(createdUser);
    new ApiResponse_1.SuccessResponse('Signup Successful', {
        user: userData,
        tokens: tokens,
    }).send(res);
}));
router.post('/verify', (0, asyncHandler_1.default)(async (req, res) => {
    const { phone, otpCode } = req.body;
    const checkUser = await UserRepo_1.default.findByPhone(phone);
    if (!checkUser) {
        throw new ApiError_1.BadRequestError('Wrong verification code');
    }
    if (checkUser.isVerified) {
        throw new ApiError_1.BadRequestError('User already verified');
    }
    const user = await validateUser(phone, otpCode);
    if (!user) {
        throw new ApiError_1.BadRequestError('Wrong verification code');
    }
    new ApiResponse_1.SuccessResponse('Account successfully verified', {}).send(res);
}));
router.post('/resendCode', (0, asyncHandler_1.default)(async (req, res) => {
    const { phone } = req.body;
    const OTP = await OtpRepo_1.default.findByPhone(phone);
    if (!OTP) {
        throw new ApiError_1.BadRequestError('User not registored');
    }
    const newOtp = (0, otp_2.generateOTP)(6);
    OTP.otpCode = newOtp;
    const otp = await OtpRepo_1.default.create({
        phone: phone,
        otpCode: newOtp
    });
    try {
        await (0, otp_1.sendOtp)(phone, newOtp);
    }
    catch (error) {
        throw new ApiError_1.InternalError('Could not  resend the code');
    }
    new ApiResponse_1.SuccessResponse('Code resent successfully', {}).send(res);
}));
const validateUser = async (phone, otpCode) => {
    try {
        const user = await UserRepo_1.default.findByPhone(phone);
        if (!user) {
            return false;
        }
        const userOtp = await OtpRepo_1.default.findByPhone(phone);
        if (userOtp && (userOtp.otpCode !== otpCode)) {
            return false;
        }
        user.isVerified = true;
        const updatedUser = await UserRepo_1.default.updateInfo(user);
        return updatedUser;
    }
    catch (error) {
        return false;
    }
};
exports.default = router;
//# sourceMappingURL=signup.js.map