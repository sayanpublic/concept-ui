import { http, HttpResponse } from 'msw'

const usersKey = 'concept_mock_users'
const contactsKey = 'concept_mock_contacts'

const seedUsers = [
  { id: 1, username: 'sayan', email: 'sayan@example.com', displayName: 'Sayan' },
  { id: 2, username: 'maya', email: 'maya@example.com', displayName: 'Maya' },
  { id: 3, username: 'arjun', email: 'arjun@example.com', displayName: 'Arjun' },
]

const seedContacts = [
  { id: 2, name: 'Maya', status: 'available', lastMessage: 'Tracing request IDs.' },
  { id: 3, name: 'Arjun', status: 'away', lastMessage: 'Latency drill later.' },
]

const loadList = (key, fallback) => {
  if (typeof window === 'undefined') return fallback
  const stored = window.localStorage.getItem(key)
  if (!stored) return fallback
  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

const saveList = (key, list) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(list))
}

const findUserByEmail = (users, email) => {
  const normalized = email.toLowerCase()
  return users.find((user) => user.email.toLowerCase() === normalized)
}

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    const users = loadList(usersKey, seedUsers)
    const user = findUserByEmail(users, body?.email || '')
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json({
      user: {
        id: `usr_${user.id}`,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: '',
        status: 'online',
        createdAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: 'mock-token',
        expiresIn: 900,
      },
    })
  }),

  http.post('/api/register', async ({ request }) => {
    const body = await request.json()
    const users = loadList(usersKey, seedUsers)
    const username = (body?.username || '').toLowerCase()
    const exists = users.some((user) => user.username.toLowerCase() === username)
    if (exists) {
      return HttpResponse.json(
        { code: 'USERNAME_EXISTS', message: 'Username already exists.' },
        { status: 409 }
      )
    }
    const next = {
      id: users.length + 1,
      username: body?.username || 'user',
      email: body?.email || `${body?.username}@example.com`,
      displayName: body?.displayName || body?.username || 'User',
    }
    const updated = [...users, next]
    saveList(usersKey, updated)
    return HttpResponse.json({ userId: `usr_${next.id}` }, { status: 201 })
  }),

  http.get('/api/contacts', () => {
    const contacts = loadList(contactsKey, seedContacts)
    return HttpResponse.json(contacts)
  }),

  http.post('/api/friends', async ({ request }) => {
    const body = await request.json()
    const users = loadList(usersKey, seedUsers)
    const contacts = loadList(contactsKey, seedContacts)
    const user = findUserByEmail(users, body?.email || '')
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const exists = contacts.some(
      (contact) => contact.name.toLowerCase() === user.username.toLowerCase()
    )
    if (!exists) {
      const updated = [
        ...contacts,
        {
          id: user.id,
          name: user.username,
          status: 'available',
          lastMessage: 'New contact added.',
        },
      ]
      saveList(contactsKey, updated)
    }
    return HttpResponse.json({ ok: true }, { status: 201 })
  }),
]
