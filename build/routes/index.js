"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signup_1 = __importDefault(require("./access/signup"));
const login_1 = __importDefault(require("./access/login"));
const logout_1 = __importDefault(require("./access/logout"));
const token_1 = __importDefault(require("./access/token"));
const profile_1 = __importDefault(require("./profile"));
const topic_1 = __importDefault(require("./topic"));
const insight_1 = __importDefault(require("./insight"));
const category_1 = __importDefault(require("./category"));
const router = express_1.default.Router();
router.use('/signup', signup_1.default);
router.use('/login', login_1.default);
router.use('/logout', logout_1.default);
router.use('/token', token_1.default);
router.use('/profile', profile_1.default);
router.use('/topic', topic_1.default);
router.use('/category', category_1.default);
router.use('/insight', insight_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map