"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./core/logger"));
const app_1 = __importDefault(require("./app"));
const node_cron_1 = __importDefault(require("node-cron"));
const scheduler_1 = __importDefault(require("./helpers/scheduler"));
const port = process.env.PORT || 3000;
node_cron_1.default.schedule('0 0 * * 0', scheduler_1.default);
app_1.default.listen(port, () => {
    logger_1.default.info(`server running on port : ${port}`);
})
    .on('error', (e) => logger_1.default.error(e));
//# sourceMappingURL=server.js.map