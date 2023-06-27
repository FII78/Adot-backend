import { date } from 'joi';
import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';
// import { scrypt, randomBytes, timingSafeEqual } from 'crypto';

// const salt = randomBytes(16).toString('hex');

export default interface User {
  _id: Types.ObjectId;
  firstName: string;
  lastName:string;
  phone:string;
  profilePic: string;
  email: string;
  password: string;
  role: string;
  title:string,
  bio:string
  salt:string;
  isVerified: Boolean
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>(
  {
    firstName: {
      type: Schema.Types.String,
      maxlength: 200,
      required: true
    },
    lastName:{
      type: Schema.Types.String,
      maxlength:200,
      required:true
    },
    phone:{
      type:Schema.Types.String,
      maxlength:14,
      required:true,
      unique:true
    },
    profilePic: {
      type: Schema.Types.String,
      required:false,
      default: ''
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      required: false
    },
    password: {
      type: Schema.Types.String,
      required:true
    },
    role: {
      type:String,
      enum:['Admin', 'User'],
      required: false,
      default:'User'
    },
    title:{
      type:Schema.Types.String,
      required: false
    },
    bio:{
      type:Schema.Types.String,
      required:false
    },
    salt:{
      type:Schema.Types.String,
      required:false,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
      default:Date.now()
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
      default:Date.now()
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
