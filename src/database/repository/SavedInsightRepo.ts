import Insight, { InsightModel } from '../model/Insight';
import { Types } from 'mongoose';
import SavedInsight, { SavedInsightModel } from '../model/SavedInsight';

const REVIEWER_DETAIL = 'firstName lastName profilePic';

async function create(savedInsight: SavedInsight): Promise<SavedInsight> {
  const now = new Date();
  savedInsight.createdAt = now;
  savedInsight.updatedAt = now;
  const createdSavedInsight = await SavedInsightModel.create(savedInsight);
  return createdSavedInsight.toObject();
}
async function Delete(insightId: string){
  const insight = SavedInsightModel.findOne({ _id: insightId, status: true })
  await SavedInsightModel.deleteOne(insight)
    .lean()
    .exec();
}
async function findInfoBySavedIdAndUserId(userId: string, insightId: string): Promise<SavedInsight | null> {
  return SavedInsightModel.findOne({ userId: userId,insightId:insightId })
    .lean()
    .exec();
}
export default {
  create,
  Delete,
  findInfoBySavedIdAndUserId
};
