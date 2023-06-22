import { config } from 'dotenv'
import { merge } from 'lodash'
import path from 'path'

config({ path: path.resolve(__dirname, '..', '..', '.env') })
const env = process.env.NODE_ENV || 'development'

const baseConfig = {
  env,
  dbUrl:
    process.env.MONGODB_URL_DEV || 'mongodb://localhost:27017/adot',
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

export default merge(baseConfig, envConfig)