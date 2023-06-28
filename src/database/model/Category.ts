import mongoose, {model, Schema} from 'mongoose'

export const DOCUMENT_NAME = 'Category';
export const COLLECTION_NAME = 'categorys';

export default interface Category{
    _id: Schema.Types.ObjectId;
    topic:string
}
const schema = new  Schema<Category>({
    topic:{
        type: Schema.Types.String,
        required:true
    }
})
schema.index({ _id: 1, status: 1 });
schema.index({ status: 1 });
export const CategoryModel = model<Category>(DOCUMENT_NAME, schema, COLLECTION_NAME);
