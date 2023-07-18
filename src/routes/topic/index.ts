import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { AuthFailureError, BadRequestError, InternalError, NotFoundError } from '../../core/ApiError';
import TopicRepo from '../../database/repository/TopicRepo';
import { Types } from 'mongoose';
import TopicCache from '../../cache/repository/TopicCache';
import Topic from '../../database/model/Topics';
import cloudinary from '../../config/Cloudinary';
import { filterImage } from '../../middlewares/multer';
import { ProtectedRequest } from 'app-request';
import { getAccessToken } from '../../auth/authUtils';
import { validateTokenData } from '../../auth/authUtils';
import JWT from '../../core/JWT';
import UserRepo from '../../database/repository/UserRepo';
import CategoryRepo from '../../database/repository/CategoryRepo';

const router = express.Router();
router.post(
  '/',filterImage.single('file'),
  validator(schema.topicCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); 
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
      if (!user) throw new AuthFailureError('User not registered');
      if (user.role != 'Admin') throw new BadRequestError('You do not have access to create topic')
    let cloudinaryImage = null;
    if (req.file){
     cloudinaryImage = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Images',
      use_filename: true,
    });}
    try{
    const createdTopic = await TopicRepo.create({
      title: req.body.title,
      thumbnaiIimage:cloudinaryImage?.secure_url,
      reviewer:req.body.reviewer,
      category: req.body.category,
      description:req.body.description
    } as Topic);

    new SuccessResponse('Topic created successfully', createdTopic).send(res);
  }catch{
    throw new InternalError('Could not create the topic')
  }
  }),
);

router.get(
    '/All',
    asyncHandler(async (req, res) => {
      const topics = await TopicRepo.findAll();
      return new SuccessResponse('success', topics).send(res);
    }),
  );
router.get(
  '/id/:id',
  validator(schema.topicId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const topicId = new Types.ObjectId(req.params.id);
    let topic = await TopicCache.fetchById(topicId);

    if (!topic) {
      topic = await TopicRepo.findInfoForReviewedById(
        new Types.ObjectId(req.params.id),
      );
      if (topic) await TopicCache.save(topic);
    }

    if (!topic) throw new NotFoundError('Topic not found');
    return new SuccessResponse('success', topic).send(res);
  }),
);

router.put(
  '/id/:id',
  validator(schema.topicId, ValidationSource.PARAM),
  validator(schema.topicUpdate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); 
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
      if (!user) throw new AuthFailureError('User not registered');
      if (user.role != 'Admin') throw new BadRequestError('You do not have access to update topic')
    const topic = await TopicRepo.findTopicAllDataById(
      new Types.ObjectId(req.params.id),
    );
    if (topic == null) throw new BadRequestError('Topic does not exists');

    if (req.body.title) topic.title = req.body.title;
    if (req.body.description) topic.description = req.body.description;
    if (req.body.reviewer) topic.reviewer = req.body.reviewer;
    if (req.body.category) topic.category = req.body.category;
    if (req.body.thumbnaiIimage) topic.thumbnaiIimage = req.body.thumbnaiIimage;

    await TopicRepo.update(topic);
    new SuccessResponse('Topic updated successfully', topic).send(res);
  }),
);
router.delete(
  '/id/:id',
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); 
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
      if (!user) throw new AuthFailureError('User not registered');
      if (user.role != 'Admin') throw new BadRequestError('You do not have access to delete topic')
    const topicId = req.body.id
    if (!topicId) throw new BadRequestError('Topic id is required');
    const topic =  TopicRepo.findInfoById(topicId)
    if (!topic){
      throw new BadRequestError('Topic does not exist')
    }
    await TopicRepo.Delete(topicId);
    return new SuccessMsgResponse('Topic deleted successfully').send(res);
  }),
);

router.get(
  '/category/:category',
  asyncHandler(async (req, res) => {
    const category = await CategoryRepo.findInfoById(req.params.category)
    const topics = await TopicRepo.findByCategory(req.params.category);
    if (!category){
      throw new BadRequestError('category not exist')
    }
    const data = { categoryTitle: category.title, topics };
    return new SuccessResponse('success',data).send(res);
  }),
);

export default router;
