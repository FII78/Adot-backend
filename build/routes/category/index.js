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
const CategoryRepo_1 = __importDefault(require("../../database/repository/CategoryRepo"));
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
router.post('/', (0, validator_1.default)(schema_1.default.createCategory), (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const createdTopic = await CategoryRepo_1.default.create({
            title: req.body.title
        });
        new ApiResponse_1.SuccessResponse('Category created successfully', createdTopic).send(res);
    }
    catch {
        throw new ApiError_1.InternalError('Could not create the category');
    }
}));
router.get('/All', (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const categories = await CategoryRepo_1.default.findAll();
        return new ApiResponse_1.SuccessResponse('success', categories).send(res);
    }
    catch {
        throw new ApiError_1.InternalError('server error');
    }
}));
router.put('/id/:id', (0, validator_1.default)(schema_1.default.categoryId, validator_1.ValidationSource.PARAM), (0, validator_1.default)(schema_1.default.updateCategory), (0, asyncHandler_1.default)(async (req, res) => {
    const category = await CategoryRepo_1.default.findCategoryAllDataById(new mongoose_1.Types.ObjectId(req.params.id));
    if (category == null)
        throw new ApiError_1.BadRequestError('Category does not exists');
    if (req.body.title)
        category.title = req.body.title;
    await CategoryRepo_1.default.update(category);
    new ApiResponse_1.SuccessResponse('Category updated successfully', category).send(res);
}));
router.delete('/id/:id', (0, asyncHandler_1.default)(async (req, res) => {
    const categoryId = req.body.id;
    if (!categoryId)
        throw new ApiError_1.BadRequestError('Category id is required');
    const category = CategoryRepo_1.default.findInfoById(categoryId);
    if (!category) {
        throw new ApiError_1.BadRequestError('Category does not exist');
    }
    await CategoryRepo_1.default.Delete(categoryId);
    return new ApiResponse_1.SuccessMsgResponse('Category deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=index.js.map