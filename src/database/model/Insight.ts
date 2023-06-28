import { Schema, model, Types } from 'mongoose';
import User from './User';
import Topic from './Topics';
import Category from './Category';


export const DOCUMENT_NAME = 'Insights';
export const COLLECTION_NAME = 'insights';

export default interface Insight {
  _id: Types.ObjectId;
  title: string;
  content: string;
  topic: Topic;
  category: Category;
  stages: string;
  thumbnailImage: string;
  referance: string;
  reviewer: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Insight>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    content: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    topic: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Topic'
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category'
    },
    stages: 
      {
        type: Schema.Types.String,
        enum:['1 week','2 week'],
        required: false
    },
    thumbnailImage: {
      type: Schema.Types.String,
      required: true,
    },
    referance: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);
schema.index({ _id: 1, status: 1 });

export const InsightModel = model<Insight>(DOCUMENT_NAME, schema, COLLECTION_NAME);
