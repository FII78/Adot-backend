"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const KeystoreRepo_1 = __importDefault(require("../../database/repository/KeystoreRepo"));
const ApiResponse_1 = require("../../core/ApiResponse");
const asyncHandler_1 = __importDefault(require("../../helpers/asyncHandler"));
const authentication_1 = __importDefault(require("../../auth/authentication"));
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
router.use(authentication_1.default);
/*-------------------------------------------------------------------------*/
router.delete('/', (0, asyncHandler_1.default)(async (req, res) => {
    await KeystoreRepo_1.default.remove(req.keystore._id);
    new ApiResponse_1.SuccessMsgResponse('Logout success').send(res);
}));
exports.default = router;
//# sourceMappingURL=logout.js.map