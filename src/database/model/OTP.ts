import mongoose ,{ model, Schema, Types } from 'mongoose';
export const DOCUMENT_NAME = 'Otp';
export const COLLECTION_NAME = 'otps';


export default interface Otp {
  
  phone: string;
  otpCode:string;
}

const schema = new Schema<Otp>(
  {
    phone:{
      type:Schema.Types.String,
      maxlength:14,
      required:true,
      unique:true
    },
    otpCode: {
      type: Schema.Types.String,
      required:true,
      maxlength:6
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const OtpModel = model<Otp>(DOCUMENT_NAME, schema, COLLECTION_NAME);
