"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("../../core/ApiResponse");
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const validator_1 = __importStar(require("../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const ApiError_1 = require("../../core/ApiError");
const InsightRepo_1 = __importDefault(require("../../database/repository/InsightRepo"));
const mongoose_1 = require("mongoose");
const InsightCache_1 = __importDefault(require("../../cache/repository/InsightCache"));
const ApiError_2 = require("../../core/ApiError");
const InsightRepo_2 = __importDefault(require("../../database/repository/InsightRepo"));
const multer_1 = require("../../middlewares/multer");
const Cloudinary_1 = __importDefault(require("../../config/Cloudinary"));
const authUtils_1 = require("../../auth/authUtils");
const JWT_1 = __importDefault(require("../../core/JWT"));
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const router = express_1.default.Router();
router.get('/id/:id', (0, validator_1.default)(schema_1.default.insightId, validator_1.ValidationSource.PARAM), (0, asyncHandler_1.default)(async (req, res) => {
    const insightId = new mongoose_1.Types.ObjectId(req.params.id);
    let insight = await InsightCache_1.default.fetchById(insightId);
    if (!insight) {
        insight = await InsightRepo_1.default.findInfoForReviewedById(new mongoose_1.Types.ObjectId(req.params.id));
        if (insight)
            await InsightCache_1.default.save(insight);
    }
    if (!insight)
        throw new ApiError_1.NotFoundError('Insight not found');
    return new ApiResponse_1.SuccessResponse('success', insight).send(res);
}));
router.get('/stage/:stage', (0, asyncHandler_1.default)(async (req, res) => {
    const insights = await InsightRepo_1.default.findByStage(req.params.stage);
    return new ApiResponse_1.SuccessResponse('success', insights).send(res);
}));
router.get('/latest', (0, asyncHandler_1.default)(async (req, res) => {
    const insights = await InsightRepo_1.default.findLatestInsights();
    return new ApiResponse_1.SuccessResponse('success', insights).send(res);
}));
router.get('/similar/id/:id', (0, validator_1.default)(schema_1.default.insightId, validator_1.ValidationSource.PARAM), (0, asyncHandler_1.default)(async (req, res) => {
    const insightId = new mongoose_1.Types.ObjectId(req.params.id);
    let insights = await InsightCache_1.default.fetchSimilarInsights(insightId);
    if (!insights) {
        const insight = await InsightRepo_1.default.findInfoForReviewedById(new mongoose_1.Types.ObjectId(req.params.id));
        if (!insight)
            throw new ApiError_2.BadRequestError('Insight is not available');
        insights = await InsightRepo_1.default.searchSimilarInsights(insight, 6);
        if (insights && insights.length > 0)
            await InsightCache_1.default.saveSimilarInsights(insightId, insights);
    }
    return new ApiResponse_1.SuccessResponse('success', insights ? insights : []).send(res);
}));
router.get('/search/', (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const query = req.query.query;
        const limit = 6;
        if (!query) {
            throw new ApiError_2.BadRequestError('Search query is required');
        }
        const insights = await InsightRepo_2.default.search(query, limit);
        if (!insights || insights.length === 0) {
            throw new ApiError_2.BadRequestError('Insights are not available');
        }
        return res.json({
            success: true,
            message: 'Success',
            data: insights,
        });
    }
    catch (error) {
        if (error instanceof ApiError_2.BadRequestError) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An error occurred during the search.' });
        }
    }
}));
router.get('/All', (0, asyncHandler_1.default)(async (req, res) => {
    const insights = await InsightRepo_2.default.findAll();
    return new ApiResponse_1.SuccessResponse('success', insights).send(res);
}));
router.post('/', multer_1.filterImage.single('file'), (0, validator_1.default)(schema_1.default.insightCreate), (0, asyncHandler_1.default)(async (req, res) => {
    req.accessToken = (0, authUtils_1.getAccessToken)(req.headers.authorization);
    const payload = await JWT_1.default.validate(req.accessToken);
    (0, authUtils_1.validateTokenData)(payload);
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_1.AuthFailureError('User not registered');
    if (user.role != 'Admin')
        throw new ApiError_2.BadRequestError('You do not have access to create insight');
    let cloudinaryImage = null;
    if (req.file) {
        cloudinaryImage = await Cloudinary_1.default.uploader.upload(req.file.path, {
            folder: 'Images',
            use_filename: true,
        });
    }
    const createdInsight = await InsightRepo_2.default.create({
        title: req.body.title,
        content: req.body.content,
        thumbnailImage: cloudinaryImage === null || cloudinaryImage === void 0 ? void 0 : cloudinaryImage.secure_url,
        topic: req.body.topic,
        reviewer: req.body.reviewer,
        stage: req.body.stage,
        category: req.body.category,
        referance: req.body.referance,
    });
    new ApiResponse_1.SuccessResponse('Insight created successfully', createdInsight).send(res);
}));
router.put('/id/:id', (0, validator_1.default)(schema_1.default.insightId, validator_1.ValidationSource.PARAM), (0, validator_1.default)(schema_1.default.insightUpdate), (0, asyncHandler_1.default)(async (req, res) => {
    const insight = await InsightRepo_2.default.findInsightAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (insight == null)
        throw new ApiError_2.BadRequestError('Insight does not exists');
    if (req.body.title)
        insight.title = req.body.title;
    if (req.body.content)
        insight.content = req.body.description;
    if (req.body.reviewer)
        insight.reviewer = req.body.reviewer;
    if (req.body.stage)
        insight.stage = req.body.stage;
    if (req.body.thumbnaiIimage)
        insight.thumbnailImage = req.body.thumbnaiIimage;
    if (req.body.referance)
        insight.referance = req.body.referance;
    if (req.body.topic)
        insight.topic = req.body.topic;
    if (req.body.category)
        insight.category = req.body.category;
    await InsightRepo_2.default.update(insight);
    new ApiResponse_1.SuccessResponse('Insight updated successfully', insight).send(res);
}));
router.delete('/id/:id', (0, asyncHandler_1.default)(async (req, res) => {
    const insightId = req.body.id;
    if (!insightId)
        throw new ApiError_2.BadRequestError('Insight id is required');
    const insight = InsightRepo_2.default.findInfoById(insightId);
    if (!insight) {
        throw new ApiError_2.BadRequestError('Insight does not exist');
    }
    await InsightRepo_2.default.Delete(insightId);
    return new ApiResponse_1.SuccessMsgResponse('Insight deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=index.js.map