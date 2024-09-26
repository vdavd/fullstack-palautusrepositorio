import PropTypes from 'prop-types'
import { useState } from 'react'

const Blog = ({ blogObject, like, remove, user }) => {

  const [visible, setVisible] = useState(false)
  const [blog, setBlog] = useState(blogObject)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const displayRemove = blog.user.id.toString() === user.id.toString()

  const likeBlog = async () => {
    const response = await like(blog)

    const updatedBlog = {
      user: blog.user,
      likes: blog.likes+1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id
    }

    setBlog(updatedBlog)

  }

  const removeBlog = async () => {

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      const response = await remove(blog)
      return response
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingBottom: 1,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  if (visible) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes: {blog.likes} <button onClick={likeBlog}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          {displayRemove && <button onClick={removeBlog}>remove</button>}
        </div>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
    </div>
  )
}

Blog.propTypes = {
  blogObject: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog