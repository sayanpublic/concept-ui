import { fetchJson } from './client'

export const LOGIN_URL = '/api/login'
export const REGISTER_URL = '/api/register'

export async function login(payload) {
  return fetchJson(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function register(payload) {
  return fetchJson(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
