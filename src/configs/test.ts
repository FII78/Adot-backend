export const config = {
    secrets: {
      jwt: 'digitallibrarytest'
    },
    dbUrl:
      process.env.MONGODB_URL_TEST ||
      'mongodb://localhost:27017/adot-test'
  }