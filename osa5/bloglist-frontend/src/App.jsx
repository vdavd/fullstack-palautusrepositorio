import { useState, useEffect, useRef } from 'react'

import Togglable from './components/Togglable'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('notification')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const messageTimeout = () => setTimeout(() => {setMessage(null)}, 4000)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong username or password')
      setMessageType('error')
      setMessage('wrong username or password')
      messageTimeout()
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const response = await blogService.create(blogObject)
    const blogs = await blogService.getAll()
    setBlogs( blogs )
    setMessageType('notification')
    setMessage(`new blog ${response.title} by ${response.author}`)
    messageTimeout()
  }

  const likeBlog = async (blogObject) => {
    const updatedObject = {
      user: blogObject.user.id,
      likes: blogObject.likes+1,
      author: blogObject.author,
      title: blogObject.title,
      url: blogObject.url
    }

    const response = await blogService.update(updatedObject, blogObject.id)

    return response
  }

  const deleteBlog = async (blogObject) => {
    const response = await blogService.remove(blogObject)

    const newBlogs = blogs.filter((blog) => blog.id !== blogObject.id)
    setBlogs(newBlogs)
    return response
  }

  const sortBlogs = () => {
    const blogsCopy = [...blogs]
    blogsCopy.sort((a, b) => a.likes - b.likes)
    blogsCopy.reverse()

    return blogsCopy
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} messageType={messageType} />
        <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername} password={password} setPassword={setPassword} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType} />
      {user.username} logged in  <button type="submit" onClick={handleLogout}>logout</button>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {sortBlogs().map(blog =>
        <Blog like={likeBlog} remove={deleteBlog} key={blog.id} blogObject={blog} user={user} />
      )}
    </div>
  )
}

export default App