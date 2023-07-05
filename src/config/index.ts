import { config } from 'dotenv'
import { merge } from 'lodash'
import path from 'path'

config({ path: path.resolve(__dirname, '..', '..', '.env') })
const env = process.env.NODE_ENV_ADOT || 'development'
export const environment = process.env.NODE_ENV_ADOT;
export const db = {
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
  dbUrl:
    process.env.MONGODB_URL_DEV || 'mongodb://localhost:27017/adot',
  isDev: env === 'development',
  isTest: env === 'testing',
  port: process.env.PORT_ADOT || 3000,
  host: process.env.HOST || 'localhost',
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: '100d'
  },
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || 'a2sv31',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '1234',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || 'ADFJKALSDFAJK'
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev').config
    break
  case 'test':
  case 'testing':
    envConfig = require('./test').config
    break
  default:
    envConfig = require('./dev').config
}
export const tokenInfo = {
    accessTokenValidity: parseInt(process.env.ACCESS_TOKEN_VALIDITY_SEC || '0'),
    refreshTokenValidity: parseInt(process.env.REFRESH_TOKEN_VALIDITY_SEC || '0'),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
  };
  export const corsUrl = process.env.CORS_URL;

  export const logDirectory = process.env.LOG_DIR;
  
  export const redis = {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '0'),
    password: process.env.REDIS_PASSWORD || '',
  };
  
  export const caching = {
    contentCacheDuration: parseInt(
      process.env.CONTENT_CACHE_DURATION_MILLIS || '600000',
    ),
  };

export default merge(baseConfig, envConfig)