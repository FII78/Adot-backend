import Insight, { InsightModel } from '../model/Insight';
import { Types } from 'mongoose';
import User from '../model/User';

const REVIEWER_DETAIL = 'firstName lastName profilePic';

async function create(insight: Insight): Promise<Insight> {
  const now = new Date();
  insight.createdAt = now;
  insight.updatedAt = now;
  const createdInsight = await InsightModel.create(insight);
  return createdInsight.toObject();
}

async function update(insight: Insight): Promise<Insight | null> {
  insight.updatedAt = new Date();
  return InsightModel.findByIdAndUpdate(insight._id, insight, { new: true })
    .lean()
    .exec();
}
async function Delete(insightId: string){
  const insight = InsightModel.findOne({ _id: insightId, status: true })
  await InsightModel.deleteOne(insight)
    .lean()
    .exec();
}
async function findInfoById(id: Types.ObjectId): Promise<Insight | null> {
  return InsightModel.findOne({ _id: id, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .lean()
    .exec();
}

async function findInfoForReviewedById(
  id: Types.ObjectId,
): Promise<Insight | null> {
  return InsightModel.findOne({ _id: id, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .lean()
    .exec();
}

async function findInsightAllDataById(id: Types.ObjectId): Promise<Insight | null> {
  return InsightModel.findOne({ _id: id, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .lean()
    .exec();
}

async function findByStage(
  stage: string,
): Promise<Insight[]> {
  return InsightModel.find({ stage: stage, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findByTopic(
  topic: string,
): Promise<Insight[]> {
  return InsightModel.find({ topic: topic, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .populate('topic')
    .populate('category')
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findAllReviewedForReviewer(user: User): Promise<Insight[]> {
  return InsightModel.find({ reviewer: user, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findLatestInsights(
): Promise<Insight[]> {
  return InsightModel.find({ status: true, isPublished: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}

async function searchSimilarInsights(insight: Insight, limit: number): Promise<Insight[]> {
  return InsightModel.find(
    {
      $text: { $search: insight.title, $caseSensitive: false },
      status: true,
      _id: { $ne: insight._id },
    },
    {
      similarity: { $meta: 'textScore' },
    },
  )
    .populate('reviewer', REVIEWER_DETAIL)
    .sort({ updatedAt: -1 })
    .limit(limit)
    .sort({ similarity: { $meta: 'textScore' } })
    .lean()
    .exec();
}

async function search(query: string, limit: number): Promise<Insight[]> {
  return InsightModel.find(
    {
      $text: { $search: query, $caseSensitive: false },
      status: true,
    },
    {
      similarity: { $meta: 'textScore' },
    },
  )
    .select('-status -content')
    .limit(limit)
    .sort({ similarity: { $meta: 'textScore' } })
    .lean()
    .exec();
}

async function searchLike(query: string, limit: number): Promise<Insight[]> {
  return InsightModel.find({
    title: { $regex: `.*${query}.*`, $options: 'i' },
    status: true,
  })
    .select('-status -content')
    .limit(limit)
    .sort({ score: -1 })
    .lean()
    .exec();
}
async function findAll(): Promise<Insight[]> {
    return findDetailedInsights({ status: true });
  }
  async function findDetailedInsights(
    query: Record<string, unknown>,
  ): Promise<Insight[]> {
    return InsightModel.find(query)
      .populate('reviewer', REVIEWER_DETAIL)
      .populate('topic')
      .populate('category')
      .sort({ updatedAt: -1 })
      .lean()
      .exec();
  }
export default {
  create,
  update,
  findAll,
  findInfoById,
  Delete,
  findInfoForReviewedById,
  findLatestInsights,
  findInsightAllDataById,
  searchSimilarInsights,
  search,
  searchLike,
  findAllReviewedForReviewer,
  findByStage,
  findByTopic
};
