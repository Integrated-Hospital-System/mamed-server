const getDBName = () => {
  switch (env) {
    case 'development':
      return process.env.DB_DEVELOPMENT
    case 'test':
      return process.env.DB_TEST
    default:
      return process.env.DB_PRODUCTION
  }
}

const connection = {
  getDBName,
}

module.exports = connection
