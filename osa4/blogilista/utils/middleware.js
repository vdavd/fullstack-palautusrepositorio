const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'username must be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  request.token = (authorization && authorization.startsWith('Bearer ')) ?
  authorization.replace('Bearer ', '') :
  null
  
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = await User.findById(decodedToken.id)

  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor }