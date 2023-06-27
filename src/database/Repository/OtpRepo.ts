import Otp, { OtpModel } from '../model/OTP';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';

async function findByPhone(phone: string): Promise<Otp | null> {
    return OtpModel.findOne({ phone: phone })
      .select(
        '+phone +otp',
      )
      .lean()
      .exec();
  }
  async function create(
    otp: Otp,
  ): Promise<{ otp: Otp; }> {
    const now = new Date();
  
  const createdOtp = await OtpModel.create(otp);

    return {
      otp: { ...createdOtp.toObject()}
    };
  }
  export default {
    findByPhone,
    create
  };
