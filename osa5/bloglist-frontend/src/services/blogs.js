import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async ( updatedObject, id ) => {
  const config = {
    headers: { Authorization: token },
  }

  const url = `${baseUrl}/${id}`

  const response = await axios.put(url, updatedObject, config)
  return response.data
}

const remove = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }

  const url = `${baseUrl}/${blogObject.id}`

  const response = await axios.delete(url, config)
  return response.data
}

export default { setToken, getAll, create, update, remove }