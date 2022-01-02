import axios from 'axios'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
})

request.interceptors.response.use(response => {
  if (response.status !== 200) return Promise.reject(response)

  return Promise.resolve(response.data)
})

export default request
