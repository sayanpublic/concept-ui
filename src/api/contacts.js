import { fetchJson, BASE_URL, CONTEXT_PATH } from './client'

export const CONTACTS_URL = `${BASE_URL}${CONTEXT_PATH}/contacts`
export const ADD_FRIEND_URL = `${BASE_URL}${CONTEXT_PATH}/friends`

export async function fetchContacts() {
  return fetchJson(CONTACTS_URL)
}

export async function addFriend(email) {
  return fetchJson(ADD_FRIEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}
