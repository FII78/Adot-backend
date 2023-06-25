export const config = {
    secrets: {
      jwt: 'digitallibraryprod'
    },
    dbUrl:
      process.env.MONGODB_URL_PROD ||
      'mongodb://localhost:27017/adot-prod'
  }