import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  test('renders title and author by default. Doesnt render url or likes by default', () => {

    const testUser = {
      name: 'testuser',
      id: 123
    }

    const blog = {
      user: testUser,
      likes: 123,
      author: 'testauthor',
      title: 'testtitle',
      url: 'testurl',
      id: 123
    }

    const mockLike = vi.fn()
    const mockRemove = vi.fn()

    render(<Blog blogObject={blog} like={mockLike} remove={mockRemove} user={testUser} />)

    const titleElement = screen.getByText('testtitle testauthor')
    expect(titleElement).toBeDefined()

    const urlElement = screen.queryByText('testurl')
    expect(urlElement).toBeNull()

    const likeElement = screen.queryByText('likes: 123')
    expect(likeElement).toBeNull()
  })

  test('renders url and likes after button to show them is pressed',  async () => {

    const testUser = {
      name: 'testuser',
      id: 123
    }

    const blog = {
      user: testUser,
      likes: 123,
      author: 'testauthor',
      title: 'testtitle',
      url: 'testurl',
      id: 123
    }

    const mockLike = vi.fn()
    const mockRemove = vi.fn()

    render(<Blog blogObject={blog} like={mockLike} remove={mockRemove} user={testUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const titleElement = screen.getByText('testtitle testauthor')
    expect(titleElement).toBeDefined()

    const urlElement = screen.getByText('testurl')
    expect(urlElement).toBeDefined()

    const likeElement = screen.getByText('likes: 123')
    expect(likeElement).toBeDefined()

    const userElement = screen.getByText('testuser')
    expect(userElement).toBeDefined()

  })

  test('when like button is clicked twice, its handler is called two times', async () => {
    const testUser = {
      name: 'testuser',
      id: 123
    }

    const blog = {
      user: testUser,
      likes: 123,
      author: 'testauthor',
      title: 'testtitle',
      url: 'testurl',
      id: 123
    }

    const mockLike = vi.fn()
    const mockRemove = vi.fn()

    render(<Blog blogObject={blog} like={mockLike} remove={mockRemove} user={testUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.dblClick(likeButton)

    expect(mockLike.mock.calls).toHaveLength(2)


  })
})