const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('returns the right amount of blogs as json', async () => {
  const response = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the identifying field of returned blogs is id instead of _id', async () => {
  const response = await api.get('/api/blogs')
  
  const keys = Object.keys(response.body[0])

  assert(keys.includes('id'))
  assert(keys.length === 5)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert(titles.includes('React patterns'))
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('if a new blog isnt given a likes field, it is set to 0', async () => {
  const normalBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  }

  const noLikeBlog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/"
  }

  await api
  .post('/api/blogs')
  .send(normalBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  await api
  .post('/api/blogs')
  .send(noLikeBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedNormalBlog = response.body[2]
  const addedNoLikeBlog = response.body[3]

  assert.strictEqual(addedNormalBlog.likes, 10)
  assert.strictEqual(addedNoLikeBlog.likes, 0)
})

test('if a new blog doesnt contain a title or url, respond with status code 400', async () => {
  const noTitleBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  }

  const noUrlBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    likes: 10
  }

  const noTitleUrlBlog = {
    author: "Robert C. Martin",
    likes: 10
  }

  await api
  .post('/api/blogs')
  .send(noTitleBlog)
  .expect(400)

  await api
  .post('/api/blogs')
  .send(noUrlBlog)
  .expect(400)

  await api
  .post('/api/blogs')
  .send(noTitleUrlBlog)
  .expect(400)
})

test('the right blog is deleted upon delete request', async () => {
  const firstResponse = await api.get('/api/blogs')

  const blogToDelete = firstResponse.body[0]

  await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .expect(204)

  const secondResponse = await api.get('/api/blogs')

  const responseIds = secondResponse.body.map(r => r.id)

  assert(!responseIds.includes(blogToDelete.id))
  assert.strictEqual(secondResponse.body.length, helper.initialBlogs.length -1)


})

test('a blog can be updated with a PUT request', async () => {
  const firstResponse = await api.get('/api/blogs')

  const blogToUpdate = firstResponse.body[0]

  const updatedBlog = {...blogToUpdate, likes: 150}

  const secondResponse = await api
  .put(`/api/blogs/${blogToUpdate.id}`)
  .send(updatedBlog)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(secondResponse.body.likes, 150)
  assert.strictEqual(secondResponse.body.id, blogToUpdate.id)
})

after(async () => {
  await mongoose.connection.close()
})