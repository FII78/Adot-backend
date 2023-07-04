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
const TopicRepo_1 = __importDefault(require("../../database/repository/TopicRepo"));
const mongoose_1 = require("mongoose");
const TopicCache_1 = __importDefault(require("../../cache/repository/TopicCache"));
const Cloudinary_1 = __importDefault(require("../../config/Cloudinary"));
const multer_1 = require("../../middlewares/multer");
const authUtils_1 = require("../../auth/authUtils");
const authUtils_2 = require("../../auth/authUtils");
const JWT_1 = __importDefault(require("../../core/JWT"));
const UserRepo_1 = __importDefault(require("../../database/repository/UserRepo"));
const router = express_1.default.Router();
router.post('/', multer_1.filterImage.single('file'), (0, validator_1.default)(schema_1.default.topicCreate), (0, asyncHandler_1.default)(async (req, res) => {
    req.accessToken = (0, authUtils_1.getAccessToken)(req.headers.authorization);
    const payload = await JWT_1.default.validate(req.accessToken);
    (0, authUtils_2.validateTokenData)(payload);
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_1.AuthFailureError('User not registered');
    if (user.role != 'Admin')
        throw new ApiError_1.BadRequestError('You do not have access to create topic');
    let cloudinaryImage = null;
    if (req.file) {
        cloudinaryImage = await Cloudinary_1.default.uploader.upload(req.file.path, {
            folder: 'Images',
            use_filename: true,
        });
    }
    try {
        const createdTopic = await TopicRepo_1.default.create({
            title: req.body.title,
            thumbnaiIimage: cloudinaryImage === null || cloudinaryImage === void 0 ? void 0 : cloudinaryImage.secure_url,
            reviewer: req.body.reviewer,
            category: req.body.category,
            description: req.body.description
        });
        new ApiResponse_1.SuccessResponse('Topic created successfully', createdTopic).send(res);
    }
    catch {
        throw new ApiError_1.InternalError('Could not create the topic');
    }
}));
router.get('/All', (0, asyncHandler_1.default)(async (req, res) => {
    const topics = await TopicRepo_1.default.findAll();
    return new ApiResponse_1.SuccessResponse('success', topics).send(res);
}));
router.get('/id/:id', (0, validator_1.default)(schema_1.default.topicId, validator_1.ValidationSource.PARAM), (0, asyncHandler_1.default)(async (req, res) => {
    const topicId = new mongoose_1.Types.ObjectId(req.params.id);
    let topic = await TopicCache_1.default.fetchById(topicId);
    if (!topic) {
        topic = await TopicRepo_1.default.findInfoForReviewedById(new mongoose_1.Types.ObjectId(req.params.id));
        if (topic)
            await TopicCache_1.default.save(topic);
    }
    if (!topic)
        throw new ApiError_1.NotFoundError('Topic not found');
    return new ApiResponse_1.SuccessResponse('success', topic).send(res);
}));
router.put('/id/:id', (0, validator_1.default)(schema_1.default.topicId, validator_1.ValidationSource.PARAM), (0, validator_1.default)(schema_1.default.topicUpdate), (0, asyncHandler_1.default)(async (req, res) => {
    req.accessToken = (0, authUtils_1.getAccessToken)(req.headers.authorization);
    const payload = await JWT_1.default.validate(req.accessToken);
    (0, authUtils_2.validateTokenData)(payload);
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_1.AuthFailureError('User not registered');
    if (user.role != 'Admin')
        throw new ApiError_1.BadRequestError('You do not have access to update topic');
    const topic = await TopicRepo_1.default.findTopicAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (topic == null)
        throw new ApiError_1.BadRequestError('Topic does not exists');
    if (req.body.title)
        topic.title = req.body.title;
    if (req.body.description)
        topic.description = req.body.description;
    if (req.body.reviewer)
        topic.reviewer = req.body.reviewer;
    if (req.body.category)
        topic.category = req.body.category;
    if (req.body.thumbnaiIimage)
        topic.thumbnaiIimage = req.body.thumbnaiIimage;
    await TopicRepo_1.default.update(topic);
    new ApiResponse_1.SuccessResponse('Topic updated successfully', topic).send(res);
}));
router.delete('/id/:id', (0, asyncHandler_1.default)(async (req, res) => {
    req.accessToken = (0, authUtils_1.getAccessToken)(req.headers.authorization);
    const payload = await JWT_1.default.validate(req.accessToken);
    (0, authUtils_2.validateTokenData)(payload);
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_1.AuthFailureError('User not registered');
    if (user.role != 'Admin')
        throw new ApiError_1.BadRequestError('You do not have access to delete topic');
    const topicId = req.body.id;
    if (!topicId)
        throw new ApiError_1.BadRequestError('Topic id is required');
    const topic = TopicRepo_1.default.findInfoById(topicId);
    if (!topic) {
        throw new ApiError_1.BadRequestError('Topic does not exist');
    }
    await TopicRepo_1.default.Delete(topicId);
    return new ApiResponse_1.SuccessMsgResponse('Topic deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=index.js.map