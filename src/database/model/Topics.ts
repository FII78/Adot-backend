import mongoose ,{ model, Schema, Types } from 'mongoose';
import User from './User';
import Category from './Category';

export const DOCUMENT_NAME = 'Topic';
export const COLLECTION_NAME = 'topics';


export default interface Topic {
  _id: Types.ObjectId;
  thumbnaiIimage: string;
  reviewer:User;
  title:string;
  description: string;
  category:Category;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Topic>(
  {
    thumbnaiIimage:{
      type:Schema.Types.String,
      maxlength:14,
      required:true,
      unique:true
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      required:false,
      ref: 'User'
    },
    title:{
        type: Schema.Types.String,
        required:true
    },
    description:{
        type: Schema.Types.String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref: 'Category',
        required: false
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
schema.index({ status: 1 });

export const TopicModel = model<Topic>(DOCUMENT_NAME, schema, COLLECTION_NAME);
