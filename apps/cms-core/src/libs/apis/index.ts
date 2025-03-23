import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

export { authTokenPlugin } from './authTokenPlugin'
export { refreshTokenPlugin } from './refreshTokenPlugin'
export const createHttpInstance = (config: CreateAxiosDefaults, plugins: ((i: AxiosInstance) => void)[] = []) => {
  const instance = axios.create(config)
  plugins.forEach(plugin => plugin(instance))
  return instance
}
