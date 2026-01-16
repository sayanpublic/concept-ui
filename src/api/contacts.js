import { fetchJson } from './client'

export const CONTACTS_URL = '/api/contacts'
export const ADD_FRIEND_URL = '/api/friends'

export async function fetchContacts() {
  return fetchJson(CONTACTS_URL)
}

export async function addFriend(identifier) {
  return fetchJson(ADD_FRIEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  })
}
