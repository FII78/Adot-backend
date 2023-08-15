import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { BadRequestError,InternalError} from '../../core/ApiError';
import User from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { getUserData } from './utils';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import cloudinary from '../../config/Cloudinary';
import { filterImage } from '../../middlewares/multer';
import { sendSMS } from '../../helpers/otp';
import { generateOTP } from '../../helpers/otp';
import OtpRepo from '../../database/repository/OtpRepo'

const scryptAsync = promisify(scrypt);

const router = express.Router();

router.post(
  '/basic',filterImage.single('file'),
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    let user = await UserRepo.findByEmail(req.body.email);

    if (user) throw new BadRequestError('User already registered');

    user = await UserRepo.findByPhone(req.body.phone)
    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const salt = randomBytes(16).toString('hex');
    const passwordBuffer = Buffer.from(req.body.password, 'utf8');
    const derivedKey = await scryptAsync(passwordBuffer, Buffer.from(salt, 'hex'), 64) as Buffer;

    const passwordHash = derivedKey.toString('hex');
    let cloudinaryImage = null;
    if (req.file){
     cloudinaryImage = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Images',
      use_filename: true,
    });}
    
    const { user: createdUser, keystore } = await UserRepo.create(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        role: req.body.role,
        bio:req.body.bio,
        title:req.body.title,
        stage:req.body.stage,
        profilePic: cloudinaryImage?.secure_url,
        password: passwordHash,
        salt: salt,
      } as User,
      accessTokenKey,
      refreshTokenKey,
    )
    const OTPGenerated = generateOTP(6)
    await sendSMS(req.body.phone,OTPGenerated)
    const otp = await OtpRepo.create({
      phone: req.body.phone,
      otpCode: OTPGenerated
    })
    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );
    const userData = await getUserData(createdUser);

    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);
router.post(
  '/verify',
  asyncHandler(async (req: RoleRequest, res) => {
    const { phone, otpCode } = req.body
    const checkUser = await UserRepo.findByPhone(phone)
    if (!checkUser) {
      throw new BadRequestError('Wrong verification code')
    }
    if (checkUser.isVerified) {
       throw new BadRequestError('User already verified')
    }
    const user = await validateUser(phone, otpCode)
    if (!user) {
      throw new BadRequestError('Wrong verification code')
    }

    new SuccessResponse('Account successfully verified', {
    }).send(res);
  }),
);
router.post(
  '/resendCode',
  asyncHandler(async (req: RoleRequest, res) => {
    const { phone } = req.body
    const OTP = await OtpRepo.findByPhone( phone)
    if (!OTP) {
      throw new BadRequestError('User not registored')
    }
    const newOtp = generateOTP(6)
    OTP.otpCode = newOtp
    const otp  = await OtpRepo.create(
      {
        phone: phone,
        otpCode:newOtp
      })
      try {
        await sendSMS(phone,  newOtp)
      } catch (error) {
        throw new InternalError('Could not  resend the code')
      }

    new SuccessResponse('Code resent successfully', {
    }).send(res);
  }),
);
const validateUser = async (phone: string, otpCode: string) => {
    try {
      const user = await UserRepo.findByPhone(phone)
      if (!user) {
        return false
      }
      const userOtp = await OtpRepo.findByPhone(phone)
      if (userOtp && (userOtp.otpCode !== otpCode)) {
        return false
      }
      user.isVerified = true
      const updatedUser = await UserRepo.updateInfo(user)
      return updatedUser
    } catch (error) {
      return false
    }
  }
export default router;
