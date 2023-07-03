import { date } from 'joi';
import { model, Schema, Types } from 'mongoose';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

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
  stage:number;
  savedInsights:Types.ObjectId[];
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
    stage: {
      type:Number,
      enum:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
      required: false,
      default:1
    },
    title:{
      type:Schema.Types.String,
      required: false
    },
    bio:{
      type:Schema.Types.String,
      required:false
    },
    savedInsights:{
      type:[Schema.Types.ObjectId],
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
schema.index({ phone: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
