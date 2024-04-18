// please run the blog_api and user_api tests separately from each other to make sure that they work 

const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

describe("blog api GET tests", () => {
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
})

describe('A blog can be added with POST request', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()

    await helper.addRootUser()
  })

  test('a valid blog can be added', async () => {
    const token = await helper.getRootToken()

    const newBlog = {
      title: "Cats",
      author: "Axel",
      url: "https://cats.com/",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: token })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert(titles.includes('Cats'))
    assert.strictEqual(response.body.length, 3)
  })

  test('trying to add a blog without a token fails and returns status code 401', async () => {
    const newBlog = {
      title: "Cats",
      author: "Axel",
      url: "https://cats.com/",
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert(!titles.includes('Cats'))
    assert.strictEqual(response.body.length, 2)
  })
})

describe('blog api tests for POST, DELETE and PUT requests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()

    await helper.addRootUser()
  })
  test('if a new blog isnt given a likes field, it is set to 0', async () => {
    const token = await helper.getRootToken()

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
    .set({ Authorization: token })
    .send(normalBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    await api
    .post('/api/blogs')
    .set({ Authorization: token })
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
    const token = await helper.getRootToken()

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
    .set({ Authorization: token })
    .send(noTitleBlog)
    .expect(400)

    await api
    .post('/api/blogs')
    .set({ Authorization: token })
    .send(noUrlBlog)
    .expect(400)

    await api
    .post('/api/blogs')
    .set({ Authorization: token })
    .send(noTitleUrlBlog)
    .expect(400)
  })

  test('the right blog is deleted upon delete request', async () => {
    const token = await helper.getRootToken()


    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    }

    const blogToDelete = await api
      .post('/api/blogs')
      .set({ Authorization: token })
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const firstResponse = await api.get('/api/blogs')

    await api
    .delete(`/api/blogs/${blogToDelete.body.id}`)
    .set({ Authorization: token })
    .expect(204)

    const secondResponse = await api.get('/api/blogs')

    const responseIds = secondResponse.body.map(r => r.id)

    assert(!responseIds.includes(blogToDelete.body.id))
    assert.strictEqual(secondResponse.body.length, firstResponse.body.length -1)
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
})

after(async () => {
  await mongoose.connection.close()
})