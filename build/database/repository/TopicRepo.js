"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Topics_1 = require("../model/Topics");
const REVIEWER_DETAIL = 'firstName profilePic';
async function create(topic) {
    const now = new Date();
    topic.createdAt = now;
    topic.updatedAt = now;
    const createdTopic = await Topics_1.TopicModel.create(topic);
    return createdTopic.toObject();
}
async function update(topic) {
    topic.updatedAt = new Date();
    return Topics_1.TopicModel.findByIdAndUpdate(topic._id, topic, { new: true })
        .lean()
        .exec();
}
async function findInfoById(id) {
    return Topics_1.TopicModel.findOne({ _id: id, status: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .lean()
        .exec();
}
async function findTopicAllDataById(id) {
    return Topics_1.TopicModel.findOne({ _id: id, status: true })
        .select('+reviewer')
        .populate('reviewer', REVIEWER_DETAIL)
        .lean()
        .exec();
}
async function findUrlIfExists(topicUrl) {
    return Topics_1.TopicModel.findOne({ topicUrl: topicUrl }).lean().exec();
}
async function findLatestTopics(pageNumber, limit) {
    return Topics_1.TopicModel.find({ status: true })
        .skip(limit * (pageNumber - 1))
        .limit(limit)
        .populate('reviewer', REVIEWER_DETAIL)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
}
async function search(query, limit) {
    return Topics_1.TopicModel.find({
        $text: { $search: query, $caseSensitive: false },
        status: true,
    }, {
        similarity: { $meta: 'textScore' },
    })
        .select('-status -description')
        .limit(limit)
        .sort({ similarity: { $meta: 'textScore' } })
        .lean()
        .exec();
}
async function searchLike(query, limit) {
    return Topics_1.TopicModel.find({
        title: { $regex: `.*${query}.*`, $options: 'i' },
        status: true,
    })
        .select('-status -description')
        .limit(limit)
        .sort({ score: -1 })
        .lean()
        .exec();
}
async function findInfoForReviewedById(id) {
    return Topics_1.TopicModel.findOne({ _id: id, status: true })
        .select('+text')
        .populate('reviewer', REVIEWER_DETAIL)
        .lean()
        .exec();
}
async function findAll() {
    return findDetailedTopics({ status: true });
}
async function findDetailedTopics(query) {
    return Topics_1.TopicModel.find(query)
        .select('+reviewer')
        .populate('reviewer', REVIEWER_DETAIL)
        .sort({ updatedAt: -1 })
        .lean()
        .exec();
}
async function Delete(topicId) {
    const topic = Topics_1.TopicModel.findOne({ _id: topicId, status: true });
    await Topics_1.TopicModel.deleteOne(topic)
        .lean()
        .exec();
}
exports.default = {
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
    Delete
};
//# sourceMappingURL=TopicRepo.js.map