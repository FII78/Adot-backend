"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const moment_1 = __importDefault(require("moment"));
const updateStageEveryWeek = async () => {
    const users = await UserRepo_1.default.findAll();
    for (const user of users) {
        const currentWeek = (0, moment_1.default)().diff((0, moment_1.default)(user.createdAt), 'weeks');
        const newStage = Math.min(40, user.stage + currentWeek);
        if (newStage !== user.stage) {
            user.stage = newStage;
            await UserRepo_1.default.updateInfo(user);
        }
    }
};
setInterval(updateStageEveryWeek, 604800000);
exports.default = updateStageEveryWeek;
//# sourceMappingURL=scheduler.js.map