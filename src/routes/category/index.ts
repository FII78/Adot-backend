import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { BadRequestError, InternalError, NotFoundError } from '../../core/ApiError';
import CategoryRepo from '../../database/repository/CategoryRepo';
import { Types } from 'mongoose';
import { ProtectedRequest } from 'app-request';
import Category from '../../database/model/Category';
import TopicRepo from '../../database/repository/TopicRepo';

const router = express.Router();
router.post('/',
  validator(schema.createCategory),
  asyncHandler(async (req: ProtectedRequest, res) => {
    try{
    const createdTopic = await CategoryRepo.create({
       title:req.body.title
    } as Category);

    new SuccessResponse('Category created successfully', createdTopic).send(res);
  }catch{
    throw new InternalError('Could not create the category')
  }
  }),
);

router.get(
    '/All',
    asyncHandler(async (req, res) => {
      try{
      const categories = await CategoryRepo.findAll();
      const allData = []
      for (const cat of categories) {
        const id = cat._id.toString();
        const topics = await TopicRepo.findByCategory(id);
        const data = { categoryTitle: cat.title, topics };
        allData.push(data)
      }
      return new SuccessResponse('success', allData).send(res);
      }catch{
        throw new InternalError('server error')
      }
    }),
  );
  router.put(
    '/id/:id',
    validator(schema.categoryId, ValidationSource.PARAM),
    validator(schema.updateCategory),
    asyncHandler(async (req: ProtectedRequest, res) => {
      const category = await CategoryRepo.findCategoryAllDataById(
        new Types.ObjectId(req.params.id),
      );
      if (category == null) throw new BadRequestError('Category does not exists');
  
      if (req.body.title) category.title = req.body.title;
      await CategoryRepo.update(category);
      new SuccessResponse('Category updated successfully', category).send(res);
    }),
  );
  router.delete(
    '/id/:id',
    asyncHandler(async (req: ProtectedRequest, res) => {
      const categoryId = req.body.id
      if (!categoryId) throw new BadRequestError('Category id is required');
      const category =  CategoryRepo.findInfoById(categoryId)
      if (!category){
        throw new BadRequestError('Category does not exist')
      }
      await CategoryRepo.Delete(categoryId);
      return new SuccessMsgResponse('Category deleted successfully').send(res);
    }),
  );
  
export default router;

