import { fetchJson, BASE_URL, CONTEXT_PATH } from './client'

export const LOGIN_URL = `${BASE_URL}${CONTEXT_PATH}/login`
export const REGISTER_URL = `${BASE_URL}${CONTEXT_PATH}/register`

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
