const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Axel Lindbro',
        username: 'mincel',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Ville Taavitsainen',
        username: 'ViliT',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mincel', 'salainen')
      await expect(page.getByText('mincel')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrongusername', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('wrongusername logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mincel', 'salainen')
        await page.getByRole('button', { name: 'create new blog' }).click()
        await createBlog(page, 'e2e testing', 'axel', 'www.testing.com')
      })
    
      test('a new blog can be created', async ({ page }) => {
        await expect(page.locator('.notification')).toContainText('new blog e2e testing by axel')
        await expect(page.getByText('e2e testing axel view')).toBeVisible()
      })

      test('a blog can be liked', async ({ page}) => {
        await page.locator('div').filter({ hasText: /^e2e testing axel view$/ }).getByRole('button').click()
        await expect(page.getByText('likes: 0 like')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1 like')).toBeVisible()
      })

      test('a blog can be removed by its creator', async ({ page }) => {
        await page.locator('div').filter({ hasText: /^e2e testing axel view$/ }).getByRole('button').click()
        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()
        await expect(page.getByText('www.testing.com')).not.toBeVisible()
        await expect(page.getByText('e2e testing axel view')).not.toBeVisible()
      })

      test('only the creator of the blog can see the remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout'}).click()
        await loginWith(page, 'ViliT', 'salainen')
        await page.locator('div').filter({ hasText: /^e2e testing axel view$/ }).getByRole('button').click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

      })

      test('blogs are are ordered by number of likes (descending)', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await createBlog(page, 'b2b testing', 'ville', 'www.b2b.com')

        await page.locator('div').filter({ hasText: /^e2e testing axel view$/ }).getByRole('button').click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.reload()

        await page.getByRole('button', { name: 'view' }).first().click()
        await expect(page.getByText('www.testing.com')).toBeVisible()
        await page.getByRole('button', { name: 'hide' }).click()

        await page.locator('div').filter({ hasText: /^b2b testing ville view$/ }).getByRole('button').click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.reload()

        await page.getByRole('button', { name: 'view' }).first().click()
        await expect(page.getByText('www.b2b.com')).toBeVisible()


      })
    })
  })

})