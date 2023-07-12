import UserRepo from '../database/repository/UserRepo';
import OtpRepo from '../database/repository/OtpRepo'
import { generateOTP, sendSMS } from '../helpers/otp'
import { sendOtp } from '../helpers/otp';
import { Request, Response, NextFunction } from 'express';
export const verifyPhone = async (
    req: Request,
    res: Response,
    next:NextFunction
  ) => {
    const { phone, otp } = req.body
    const checkUser = await UserRepo.findByPhone(phone)
    if (!checkUser) {
      res.locals.json = {
        statusCode: 400,
        message: 'Wrong verification code'
      }
      return next()
    }
    if (checkUser.isVerified) {
      res.locals.json = {
        statusCode: 400,
        message: 'User is already Verified'
      }
      return next()
    }
    const user = await validateUser(phone, otp)
    if (!user) {
      res.locals.json = {
        statusCode: 400,
        message: 'Wrong verification code'
      }
      return next()
    }
    res.locals.json = {
      statusCode: 200,
      message: 'Account successfully verified'
    }
    return next()
  }
  
  export const resendCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { phone } = req.body
    const OTP = await OtpRepo.findByPhone( phone)
    if (!OTP) {
      res.locals.json = {
        statusCode: 404,
        message: 'User not registered'
      }
      return next()
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
      return next()
    } catch (error) {
      res.locals.json = {
        statusCode: 400,
        message: 'Cannot resend verification code'
      }
      return next()
    }
  }
  const validateUser = async (phone: string, otpCode: string) => {
    
    try {
      const user = await UserRepo.findByPhone(phone)
      if (!user) {
        return false
      }
      const userOtp = await OtpRepo.findByPhone(phone)
      if (userOtp && userOtp.otpCode !== otpCode) {
        return false
      }
      user.isVerified = true
      const updatedUser = await UserRepo.updateInfo(user)
      return updatedUser
    } catch (error) {
      return false
    }
  }