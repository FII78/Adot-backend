"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.caching = exports.redis = exports.logDirectory = exports.corsUrl = exports.tokenInfo = exports.db = exports.environment = void 0;
const dotenv_1 = require("dotenv");
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '..', '..', '.env') });
const env = process.env.NODE_ENV || 'development';
exports.environment = process.env.NODE_ENV;
exports.db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PWD || '',
    minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE || '5'),
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
};
const baseConfig = {
    env,
    dbUrl: process.env.MONGODB_URL_DEV || 'mongodb://localhost:27017/adot',
    isDev: env === 'development',
    isTest: env === 'testing',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: '100d'
    },
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'a2sv31',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '1234',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'ADFJKALSDFAJK'
};
let envConfig = {};
switch (env) {
    case 'dev':
    case 'development':
        envConfig = require('./dev').config;
        break;
    case 'test':
    case 'testing':
        envConfig = require('./test').config;
        break;
    default:
        envConfig = require('./dev').config;
}
exports.tokenInfo = {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
};
exports.corsUrl = process.env.CORS_URL;
exports.logDirectory = process.env.LOG_DIR;
exports.redis = {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '0'),
    password: process.env.REDIS_PASSWORD || '',
};
exports.caching = {
    contentCacheDuration: parseInt(process.env.CONTENT_CACHE_DURATION_MILLIS || '600000'),
};
exports.default = (0, lodash_1.merge)(baseConfig, envConfig);
//# sourceMappingURL=index.js.map