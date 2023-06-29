import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { InternalError, NotFoundError } from '../../core/ApiError';
import TopicRepo from '../../database/repository/TopicRepo';
import { Types } from 'mongoose';
import TopicCache from '../../cache/repository/TopicCache';
import Topic from '../../database/model/Topics';
import cloudinary from '../../config/cloudinary';
import { filterImage } from '../../middlewares/multer';
import { ProtectedRequest } from 'app-request';

const router = express.Router();
router.post(
  '/',filterImage.single('file'),
  validator(schema.topicCreate),
  asyncHandler(async (req: ProtectedRequest, res) => {
    let cloudinaryImage = null;
    if (req.file){
     cloudinaryImage = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Images',
      use_filename: true,
    });}
    // try{
    const createdTopic = await TopicRepo.create({
      title: req.body.title,
      thumbnaiIimage:cloudinaryImage?.secure_url,
      reviewer:req.body.reviewer,
      category: req.body.category,
      description:req.body.description
    } as Topic);

    new SuccessResponse('Topic created successfully', createdTopic).send(res);
  // }catch{
    // throw new InternalError('Could not create the topic')
  // }
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

export default router;
