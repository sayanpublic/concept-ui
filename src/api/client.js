import axios from 'axios'

export const BASE_URL = 'http://localhost:8080'
export const CONTEXT_PATH = '/auth'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

export async function fetchJson(url, options = {}) {
  try {
    const response = await client.request({
      url,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      headers: options.headers,
    })
    return response.data
  } catch (error) {
    const message = error?.message || 'Request failed'
    const err = new Error(message)
    err.data = error?.response?.data ?? null
    throw err
  }
}
