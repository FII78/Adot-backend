import mongoose from 'mongoose'

export interface IOTPInterface {
  email: String
  otpCode: String
}

const OTPSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true
  },
  otpCode: {
    type: String
  }
})

export const OTP = mongoose.model<IOTPInterface>('OTP', OTPSchema)