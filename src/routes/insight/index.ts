import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { NotFoundError } from '../../core/ApiError';
import InstghtRepo from '../../database/repository/InsightRepo';
import { Types } from 'mongoose';
import InsightCache from '../../cache/repository/InsightCache';
import { BadRequestError } from '../../core/ApiError';
import InsightRepo from '../../database/repository/InsightRepo';
import { ProtectedRequest } from 'app-request';
import Insight from '../../database/model/Insight';
import { filterImage } from '../../middlewares/multer';
import cloudinary from '../../config/cloudinary';

const router = express.Router();


router.get(
  '/id/:id',
  validator(schema.insightId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const insightId = new Types.ObjectId(req.params.id);
    let insight = await InsightCache.fetchById(insightId);

    if (!insight) {
      insight = await InstghtRepo.findInfoForReviewedById(
        new Types.ObjectId(req.params.id),
      );
      if (insight) await InsightCache.save(insight);
    }

    if (!insight) throw new NotFoundError('Insight not found');
    return new SuccessResponse('success', insight).send(res);
  }),
);


router.get(
    '/stage/:stage',
    validator(schema.insightStage, ValidationSource.PARAM),
    validator(schema.pagination, ValidationSource.QUERY),
    asyncHandler(async (req, res) => {
      const insights = await InstghtRepo.findByStageAndPaginated(
        req.params.tag,
        parseInt(req.query.pageNumber as string),
        parseInt(req.query.pageItemCount as string),
      );
      return new SuccessResponse('success', insights).send(res);
    }),
  );
  
  router.get(
    '/latest',
    validator(schema.pagination, ValidationSource.QUERY),
    asyncHandler(async (req, res) => {
      const insights = await InstghtRepo.findLatestInsights(
        parseInt(req.query.pageNumber as string),
        parseInt(req.query.pageItemCount as string),
      );
      return new SuccessResponse('success', insights).send(res);
    }),
  );
  
  router.get(
    '/similar/id/:id',
    validator(schema.insightId, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
      const insightId = new Types.ObjectId(req.params.id);
      let insights = await InsightCache.fetchSimilarInsights(insightId);
  
      if (!insights) {
        const insight = await InstghtRepo.findInfoForReviewedById(
          new Types.ObjectId(req.params.id),
        );
        if (!insight) throw new BadRequestError('Insight is not available');
        insights = await InstghtRepo.searchSimilarInsights(insight, 6);
  
        if (insights && insights.length > 0)
          await InsightCache.saveSimilarInsights(insightId, insights);
      }
  
      return new SuccessResponse('success', insights ? insights : []).send(res);
    }),
  );
  router.get(
    '/All',
    asyncHandler(async (req, res) => {
      const insights = await InsightRepo.findAll();
      return new SuccessResponse('success', insights).send(res);
    }),
  );


  router.post(
    '/',filterImage.single('file'),
    validator(schema.insightCreate),
    asyncHandler(async (req: ProtectedRequest, res) => {
      let cloudinaryImage = null;
      if (req.file){
       cloudinaryImage = await cloudinary.uploader.upload(req.file.path, {
        folder: 'Images',
        use_filename: true,
      });}
      const createdInsight = await InsightRepo.create({
        title: req.body.title,
        content: req.body.content,
        thumbnailImage: cloudinaryImage?.secure_url,
        topic: req.body.topic,
        reviewer: req.body.reviewer,
        stages: req.body.stages,
        category: req.body.category,
        referance: req.body.referance,
      } as Insight);
  
      new SuccessResponse('Insight created successfully', createdInsight).send(res);
    }),
  );
  
  router.put(
    '/id/:id',
    validator(schema.insightId, ValidationSource.PARAM),
    validator(schema.insightUpdate),
    asyncHandler(async (req: ProtectedRequest, res) => {
      const insight = await InsightRepo.findInsightAllDataById(
        new Types.ObjectId(req.params.id),
      );
      if (insight == null) throw new BadRequestError('Insight does not exists');
  
      if (req.body.title) insight.title = req.body.title;
      if (req.body.content) insight.content = req.body.description;
      if (req.body.reviewer) insight.reviewer = req.body.reviewer;
      if (req.body.stage) insight.stages = req.body.stage;
      if (req.body.thumbnaiIimage) insight.thumbnailImage = req.body.thumbnaiIimage;
      if (req.body.referance) insight.referance = req.body.referance;
      if (req.body.topic) insight.topic = req.body.topic;
      if (req.body.category) insight.category = req.body.category;

  
      await InsightRepo.update(insight);
      new SuccessResponse('Insight updated successfully', insight).send(res);
    }),
  );
  router.delete(
    '/id/:id',
    asyncHandler(async (req: ProtectedRequest, res) => {
      const insightId = req.body.id
      if (!insightId) throw new BadRequestError('Insight id is required');
      const insight =  InsightRepo.findInfoById(insightId)
      if (!insight){
        throw new BadRequestError('Insight does not exist')
      }
      await InsightRepo.Delete(insightId);
      return new SuccessMsgResponse('Insight deleted successfully').send(res);
    }),
  );
  
export default router;
