"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = void 0;
const lodash_1 = __importDefault(require("lodash"));
async function getUserData(user) {
    const data = lodash_1.default.pick(user, ['_id', 'name', 'roles', 'profilePicUrl']);
    return data;
}
exports.getUserData = getUserData;
//# sourceMappingURL=utils.js.map