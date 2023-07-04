"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./core/logger"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
require("./database"); // initialize database
require("./cache"); // initialize cache
const ApiError_1 = require("./core/ApiError");
const routes_1 = __importDefault(require("./routes"));
process.on('uncaughtException', (e) => {
    logger_1.default.error(e);
});
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)({ origin: config_1.corsUrl, optionsSuccessStatus: 200 }));
// Routes
app.use('/', routes_1.default);
// catch 404 and forward to error handler
app.use((req, res, next) => next(new ApiError_1.NotFoundError()));
// Middleware Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    if (err instanceof ApiError_1.ApiError) {
        ApiError_1.ApiError.handle(err, res);
        if (err.type === ApiError_1.ErrorType.INTERNAL)
            logger_1.default.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
    else {
        logger_1.default.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        logger_1.default.error(err);
        if (config_1.environment === 'development') {
            return res.status(500).send(err);
        }
        ApiError_1.ApiError.handle(new ApiError_1.InternalError(), res);
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map