import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { AuthFailureError, NotFoundError } from '../../core/ApiError';
import InstghtRepo from '../../database/repository/InsightRepo';
import { Types } from 'mongoose';
import InsightCache from '../../cache/repository/InsightCache';
import { BadRequestError } from '../../core/ApiError';
import InsightRepo from '../../database/repository/InsightRepo';
import { ProtectedRequest } from 'app-request';
import Insight from '../../database/model/Insight';
import { filterImage } from '../../middlewares/multer';
import cloudinary from '../../config/Cloudinary';
import { getAccessToken, validateTokenData } from '../../auth/authUtils';
import JWT from '../../core/JWT';
import UserRepo from '../../database/repository/UserRepo';
import { SavedInsightModel } from '../../database/model/SavedInsight';
import SavedInsightRepo from '../../database/repository/SavedInsightRepo';

const router = express.Router();


router.get(
  '/id/:id',
  validator(schema.insightId, ValidationSource.PARAM),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); 
    const payload = await JWT.validate(req.accessToken);
    validateTokenData(payload);
  
    const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
    if (!user) throw new AuthFailureError('User not registered');
    const insightId = new Types.ObjectId(req.params.id);
    let insight = await InsightCache.fetchById(insightId);

    if (!insight) {
      insight = await InstghtRepo.findInfoForReviewedById(
        new Types.ObjectId(req.params.id),
      );
      if (insight) await InsightCache.save(insight);
      else throw new NotFoundError('Insight not found');
    }
    const isSaved = await SavedInsightRepo.findInfoBySavedIdAndUserId((user._id).toString(), (req.params.id).toString())
    let insightWithFlag = null
    if (isSaved)    
       insightWithFlag =  { ...insight, saved: true }
    else insightWithFlag = { ...insight, saved:false}

    return res.json(insightWithFlag);
  }),
);

router.get(
    '/stage/:stage',
    asyncHandler(async (req, res) => {
      const insights = await InstghtRepo.findByStage(
        req.params.stage,
      );
      return new SuccessResponse('success', insights).send(res);
    }),
  );
  
  router.get(
    '/latest',
    asyncHandler(async (req, res) => {
      const insights = await InstghtRepo.findLatestInsights(
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

  router.get('/search/', asyncHandler(async (req, res) => {
    try {
      const query: string = req.query.query as string;
      const limit = 6;
  
      if (!query) {
        throw new BadRequestError('Search query is required');
      }
  
      const insights = await InsightRepo.search(query, limit);
  
      if (!insights || insights.length === 0) {
        throw new BadRequestError('Insights are not available');
      }
  
      return res.json({
        success: true,
        message: 'Success',
        data: insights,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An error occurred during the search.' });
      }
    }
  }));
  

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
      req.accessToken = getAccessToken(req.headers.authorization); 
        const payload = await JWT.validate(req.accessToken);
        validateTokenData(payload);
  
        const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
        if (!user) throw new AuthFailureError('User not registered');
        if (user.role != 'Admin') throw new BadRequestError('You do not have access to create insight')
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
        stage: req.body.stage,
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
      if (req.body.stage) insight.stage = req.body.stage;
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
  router.get(
    '/topic/:topic',
    asyncHandler(async (req, res) => {
      const insights = await InstghtRepo.findByTopic(req.params.topic);
      return new SuccessResponse('success', insights).send(res);
    }),
  );
export default router;
