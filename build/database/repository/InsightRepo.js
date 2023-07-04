"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Insight_1 = require("../model/Insight");
const REVIEWER_DETAIL = 'firstName lastName profilePic';
async function create(insight) {
    const now = new Date();
    insight.createdAt = now;
    insight.updatedAt = now;
    const createdInsight = await Insight_1.InsightModel.create(insight);
    return createdInsight.toObject();
}
async function update(insight) {
    insight.updatedAt = new Date();
    return Insight_1.InsightModel.findByIdAndUpdate(insight._id, insight, { new: true })
        .lean()
        .exec();
}
async function Delete(insightId) {
    const insight = Insight_1.InsightModel.findOne({ _id: insightId, status: true });
    await Insight_1.InsightModel.deleteOne(insight)
        .lean()
        .exec();
}
async function findInfoById(id) {
    return Insight_1.InsightModel.findOne({ _id: id, status: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .lean()
        .exec();
}
async function findInfoForReviewedById(id) {
    return Insight_1.InsightModel.findOne({ _id: id, status: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .lean()
        .exec();
}
async function findInsightAllDataById(id) {
    return Insight_1.InsightModel.findOne({ _id: id, status: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .lean()
        .exec();
}
async function findByStage(stage) {
    return Insight_1.InsightModel.find({ stage: stage, status: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .sort({ updatedAt: -1 })
        .lean()
        .exec();
}
async function findAllReviewedForReviewer(user) {
    return Insight_1.InsightModel.find({ reviewer: user, status: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .sort({ updatedAt: -1 })
        .lean()
        .exec();
}
async function findLatestInsights() {
    return Insight_1.InsightModel.find({ status: true, isPublished: true })
        .populate('reviewer', REVIEWER_DETAIL)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
}
async function searchSimilarInsights(insight, limit) {
    return Insight_1.InsightModel.find({
        $text: { $search: insight.title, $caseSensitive: false },
        status: true,
        _id: { $ne: insight._id },
    }, {
        similarity: { $meta: 'textScore' },
    })
        .populate('reviewer', REVIEWER_DETAIL)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .sort({ similarity: { $meta: 'textScore' } })
        .lean()
        .exec();
}
async function search(query, limit) {
    return Insight_1.InsightModel.find({
        $text: { $search: query, $caseSensitive: false },
        status: true,
    }, {
        similarity: { $meta: 'textScore' },
    })
        .select('-status -content')
        .limit(limit)
        .sort({ similarity: { $meta: 'textScore' } })
        .lean()
        .exec();
}
async function searchLike(query, limit) {
    return Insight_1.InsightModel.find({
        title: { $regex: `.*${query}.*`, $options: 'i' },
        status: true,
    })
        .select('-status -content')
        .limit(limit)
        .sort({ score: -1 })
        .lean()
        .exec();
}
async function findAll() {
    return findDetailedInsights({ status: true });
}
async function findDetailedInsights(query) {
    return Insight_1.InsightModel.find(query)
        .populate('reviewer', REVIEWER_DETAIL)
        .populate('topic')
        .populate('category')
        .sort({ updatedAt: -1 })
        .lean()
        .exec();
}
exports.default = {
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
    findByStage
};
//# sourceMappingURL=InsightRepo.js.map