import { Types } from 'mongoose';
import Category, { CategoryModel } from '../model/Category';

async function findAll(): Promise<Category[]> {
    return findDetailedCatrgories({ status: true });
  }
  
  async function findDetailedCatrgories(
    query: Record<string, unknown>,
  ): Promise<Category[]> {
    return CategoryModel.find(query)
      .select('+title')
      .lean()
      .exec();
  }
  async function create(
    category: Category,
  ): Promise<{ category: Category; }> {
    const now = new Date();
  
  const createdCategory = await CategoryModel.create(category);

    return {
      category: { ...createdCategory.toObject()}
    };
  }
  async function findCategoryAllDataById(id: Types.ObjectId): Promise<Category | null> {
    return CategoryModel.findOne({ _id: id, status: true })
      .lean()
      .exec();
  }
  async function update(category: Category): Promise<Category | null> {
    return CategoryModel.findByIdAndUpdate(category._id, category, { new: true })
      .lean()
      .exec();
  }
  async function Delete(categoryId: string){
    const category = CategoryModel.findOne({ _id: categoryId, status: true })
    await CategoryModel.deleteOne(category)
      .lean()
      .exec();
  }
  async function findInfoById(id: string): Promise<Category | null> {
    return CategoryModel.findOne({ _id: id, status: true })
      .lean()
      .exec();
  }
  export default {
    findAll,
    create,
    findCategoryAllDataById,
    update,
    Delete,
    findInfoById
  };
