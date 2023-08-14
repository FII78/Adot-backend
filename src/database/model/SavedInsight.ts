import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'SavedInsight';
export const COLLECTION_NAME = 'Savedinsights';

export default interface SavedInsight {
_id:Types.ObjectId
 userId: string;
 insightId:string;
 createdAt?: Date;
 updatedAt?: Date;
}

const schema = new Schema<SavedInsight>(
  {
    userId: {
      type: Schema.Types.String,
      required: true,
    },
    insightId: {
      type: Schema.Types.String,
      required: true,
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
schema.index({ title: 'text' });

export const SavedInsightModel = model<SavedInsight>(DOCUMENT_NAME, schema, COLLECTION_NAME);
