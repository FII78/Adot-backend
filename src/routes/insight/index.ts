import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { NotFoundError } from '../../core/ApiError';
import InstghtRepo from '../../database/repository/InsightRepo';
import { Types } from 'mongoose';
import InsightCache from '../../cache/repository/InsightCache';
import { BadRequestError } from '../../core/ApiError';
import InsightRepo from '../../database/repository/InsightRepo';

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

export default router;
