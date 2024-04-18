// please run the blog_api and user_api tests separately from each other to make sure that they work 

const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

describe("user api tests with one user in the db", () => {
  beforeEach(async () => {
    await helper.addRootUser()
  })

  test('user can be created with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'vdavd',
      name: 'ville',
      password: 'qwertyuiop'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('username or password shorter than 3 characters returns 400 and an appropriate error message', async () => {
    const shortUsername = {
      username: 'ax',
      name: 'axel',
      password: 'asdfghjkl'
    }

    const shortPassword = {
      username: 'axel123',
      name: 'axel',
      password: 'a'
    }

    const firstResponse = await api
    .post('/api/users')
    .send(shortUsername)
    .expect(400)

    const secondResponse = await api
    .post('/api/users')
    .send(shortPassword)
    .expect(400)

    assert(firstResponse.error.text.includes('username and password must be 3 characters or longer'))
    assert(secondResponse.error.text.includes('username and password must be 3 characters or longer'))
  })

  test('non-unique username returns 400 and an appropriate error message', async () => {
    const nonUnique = {
      username: 'root',
      name: 'asdasd',
      password: 'qwertyuiop'
    }

    response = await api
    .post('/api/users')
    .send(nonUnique)
    .expect(400)

    assert(response.error.text.includes('username must be unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})