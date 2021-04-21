const env = process.env.NODE_ENV
const getDBName = () => {
  const host = process.env.ATLAS
  switch (env) {
    case 'development':
      return host + process.env.DB_DEVELOPMENT
    case 'test':
      return host + process.env.DB_TEST
    default:
      return host + process.env.DB_PRODUCTION
  }
}

const connection = {
  getDBName,
}

module.exports = connection
