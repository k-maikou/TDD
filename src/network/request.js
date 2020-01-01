import axios from 'axios';

export const request = (config) => {
  const instance = axios.create({
    baseURL: 'http://localhost:3004',
    timeout: 5000
  })
  return instance(config)
}
