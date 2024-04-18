const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  }
]

const addRootUser = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({ username: 'root', name: 'rootUser', passwordHash })

  await user.save()
}

const getRootToken = async () => {
  const user = await User.findOne({ username: 'root' })
  const userForToken = {
    username: user.username,
    id: user._id
  }

  return "Bearer " + jwt.sign(userForToken, process.env.SECRET)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  usersInDb,
  addRootUser,
  getRootToken
}