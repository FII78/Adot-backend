import Topic, { TopicModel } from '../model/Topics';
import { Types } from 'mongoose';

const REVIEWER_DETAIL = 'firstName profilePic';

async function create(topic: Topic): Promise<Topic> {
  const now = new Date();
  topic.createdAt = now;
  topic.updatedAt = now;
  const createdTopic = await TopicModel.create(topic);
  return createdTopic.toObject();
}

async function update(topic: Topic): Promise<Topic | null> {
  topic.updatedAt = new Date();
  return TopicModel.findByIdAndUpdate(topic._id, topic, { new: true })
    .lean()
    .exec();
}

async function findInfoById(id: Types.ObjectId): Promise<Topic | null> {
  return TopicModel.findOne({ _id: id, status: true })
    .populate('reviewer', REVIEWER_DETAIL)
    .lean()
    .exec();
}

async function findTopicAllDataById(id: Types.ObjectId): Promise<Topic | null> {
  return TopicModel.findOne({ _id: id, status: true })
    .select(
      '+reviewer',
    )
    .populate('reviewer', REVIEWER_DETAIL)
    .lean()
    .exec();
}


async function findUrlIfExists(topicUrl: string): Promise<Topic | null> {
  return TopicModel.findOne({ topicUrl: topicUrl }).lean().exec();
}

async function findLatestTopics(
  pageNumber: number,
  limit: number,
): Promise<Topic[]> {
  return TopicModel.find({ status: true})
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .populate('reviewer', REVIEWER_DETAIL)
    .sort({ createdAt: -1 })
    .lean()
    .exec();
}
async function search(query: string, limit: number): Promise<Topic[]> {
  return TopicModel.find(
    {
      $text: { $search: query, $caseSensitive: false },
      status: true,
    },
    {
      similarity: { $meta: 'textScore' },
    },
  )
    .select('-status -description')
    .limit(limit)
    .sort({ similarity: { $meta: 'textScore' } })
    .lean()
    .exec();
}

async function searchLike(query: string, limit: number): Promise<Topic[]> {
  return TopicModel.find({
    title: { $regex: `.*${query}.*`, $options: 'i' },
    status: true,
  })
    .select('-status -description')
    .limit(limit)
    .sort({ score: -1 })
    .lean()
    .exec();
}

async function findInfoForReviewedById(
  id: Types.ObjectId,
): Promise<Topic | null> {
  return TopicModel.findOne({ _id: id, status: true })
    .select('+text')
    .populate('reviewer', REVIEWER_DETAIL)
    .lean()
    .exec();
}
async function findAll(): Promise<Topic[]> {
  return findDetailedTopics({ status: true });
}

async function findDetailedTopics(
  query: Record<string, unknown>,
): Promise<Topic[]> {
  return TopicModel.find(query)
    .select('+reviewer')
    .populate('reviewer', REVIEWER_DETAIL)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

export default {
  create,
  update,
  findInfoById,
  findTopicAllDataById,
  findAll,
  findInfoForReviewedById,
  findUrlIfExists,
  findLatestTopics,
  search,
  searchLike,
};
