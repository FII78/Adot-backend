import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { InternalError, NotFoundError } from '../../core/ApiError';
import CategoryRepo from '../../database/repository/CategoryRepo';
import { Types } from 'mongoose';
import TopicCache from '../../cache/repository/TopicCache';
import { ProtectedRequest } from 'app-request';
import Category from '../../database/model/Category';

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
      return new SuccessResponse('success', categories).send(res);
      }catch{
        throw new InternalError('server error')
      }
    }),
  );

export default router;
