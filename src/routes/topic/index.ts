import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { NotFoundError } from '../../core/ApiError';
import TopicRepo from '../../database/repository/TopicRepo';
import { Types } from 'mongoose';
import TopicCache from '../../cache/repository/TopicCache';

const router = express.Router();

router.get(
    '/All',
    asyncHandler(async (req, res) => {
      const blogs = await TopicRepo.findAll();
      return new SuccessResponse('success', blogs).send(res);
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
