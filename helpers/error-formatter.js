const errorWithName = (name) => {
  const error = new Error()
  error.name = name
  return error
}

module.exports = {
  NamedError: {
    INVALID_ROLE: errorWithName('InvalidRoleError'),
    USE_REGISTER: errorWithName('UseRegisterError'),
  },
}
