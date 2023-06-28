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
  export default {
    findAll,
    create
  };
