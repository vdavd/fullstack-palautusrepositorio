var _ = require('lodash')

const dummy = (blogs) => {
  return 1
}
  
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (previous, current) => {
    return (previous && previous.likes > current.likes) ? previous : current
  }

  const result = blogs.reduce(reducer, null)
  return result ? {title: result.title, author: result.author, likes: result.likes} : null
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorBlogs = _.chain(blogs)
  .groupBy('author')
  .map((author) => {
    return {author: author[0].author, blogs: author.length}
  })
  .value()

  result = authorBlogs.reduce((previous, current) => {
    return (previous && previous.blogs > current.blogs) ? previous : current
  })

  return result
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorLikes = _.chain(blogs)
  .groupBy('author')
  .map((author) => {
    likes = author.reduce((sum, blog) => sum + blog.likes, 0)
    return {author: author[0].author, likes: likes}
  })
  .value()
  
  result = authorLikes.reduce((previous, current) => {
    return (previous && previous.likes > current.likes) ? previous : current
  })

  return result
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}