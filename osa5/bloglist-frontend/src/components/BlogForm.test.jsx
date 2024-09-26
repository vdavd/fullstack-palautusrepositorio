import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  test('form calls the callback function with the right data upon blog creation', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testtitle')
    await user.type(authorInput, 'testauthor')
    await user.type(urlInput, 'testurl')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testtitle')
    expect(createBlog.mock.calls[0][0].author).toBe('testauthor')
    expect(createBlog.mock.calls[0][0].url).toBe('testurl')

  })
})