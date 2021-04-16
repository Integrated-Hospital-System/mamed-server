const env = process.env.NODE_ENV
const getDBName = () => {
  const localhost = 'mongodb://localhost:27017/'
  switch (env) {
    case 'development':
      return localhost + process.env.DB_DEVELOPMENT
    case 'test':
      return localhost + process.env.DB_TEST
    default:
      return localhost + process.env.DB_PRODUCTION
  }
}

const connection = {
  getDBName,
}

module.exports = connection
