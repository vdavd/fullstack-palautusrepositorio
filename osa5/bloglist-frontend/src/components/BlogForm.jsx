import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div className="formDiv">

      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title: <input
            type="text"
            value={title}
            name="title"
            onChange={(event) => setTitle(event.target.value)}
            id='title-input'
            data-testid='title'
          />
        </div>
        <div>
          author: <input
            type="text"
            value={author}
            name="author"
            onChange={(event) => setAuthor(event.target.value)}
            id='author-input'
            data-testid='author'
          />
        </div>
        <div>
          url: <input
            type="text"
            value={url}
            name="url"
            onChange={(event) => setUrl(event.target.value)}
            id='url-input'
            data-testid='url'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm