import { isServer } from '@tanstack/react-query'
import axios, { AxiosRequestConfig } from 'axios'
import { initContract } from '@ts-rest/core'

export const createServerAxios = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:8765',
  })
  return instance
}

export const createClientAxios = () => {
  const instance = axios.create({})
  return instance
}

export const http = () => {
  const instance = isServer ? createServerAxios() : createClientAxios()
  return {
    request: (config: AxiosRequestConfig) => {
      return instance.request(config)
    },
  }
}

export const contract = initContract()
