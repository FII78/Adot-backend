import Otp, { OtpModel } from '../model/OTP';

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
