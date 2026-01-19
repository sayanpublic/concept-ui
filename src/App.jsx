import { useCallback, useEffect, useMemo, useState } from 'react'
import { login, register } from './api/auth'
import { addFriend, fetchContacts } from './api/contacts'
import ChatPanel from './components/ChatPanel'
import Contacts from './components/Contacts'
import Login from './components/Login'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  const [contacts, setContacts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [friendInput, setFriendInput] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')

  const loadContacts = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await fetchContacts()
      setContacts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError('Backend unavailable. Showing sample contacts.')
      setContacts([
        {
          id: 1,
          name: 'Priya',
          status: 'available',
          lastMessage: 'Reviewing CAP notes.',
        },
        {
          id: 2,
          name: 'Arjun',
          status: 'away',
          lastMessage: 'Latency drill later.',
        },
        {
          id: 3,
          name: 'Maya',
          status: 'busy',
          lastMessage: 'Tracing request IDs.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return
    loadContacts()
  }, [isLoggedIn, loadContacts])

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedId) || null,
    [contacts, selectedId]
  )

  const clientMeta = useMemo(() => {
    let deviceId = 'web'
    if (typeof window !== 'undefined') {
      const storageKey = 'concept_device_id'
      const stored = window.localStorage.getItem(storageKey)
      if (stored) {
        deviceId = stored
      } else if (window.crypto?.randomUUID) {
        deviceId = window.crypto.randomUUID()
        window.localStorage.setItem(storageKey, deviceId)
      }
    }

    return {
      deviceId,
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'web',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      locale: typeof navigator !== 'undefined' ? navigator.language : 'en',
    }
  }, [])

  const handleAuth = async (event) => {
    event.preventDefault()
    if (!username || !password) return
    setAuthError('')
    setIsAuthLoading(true)
    try {
      if (authMode === 'signup') {
        await register({
          username,
          password,
          displayName: username,
          client: clientMeta,
        })
        setAuthMode('signin')
        setAuthError('Account created. Please sign in.')
        return
      }

      await login({
        email: username,
        password,
        rememberMe,
        client: clientMeta,
      })
      setIsLoggedIn(true)
    } catch (err) {
      const data = err?.data
      const message = String(data?.message || data?.error || err?.message || '')
      const isUserExists =
        data?.code === 'USERNAME_EXISTS' ||
        data?.error === 'USERNAME_EXISTS' ||
        message.toLowerCase().includes('exists')

      if (authMode === 'signup' && isUserExists) {
        setAuthMode('signin')
        setAuthError('Username exists. Please sign in instead.')
      } else {
        setAuthError(message || 'Authentication failed.')
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleFriendInputChange = (value) => {
    setFriendInput(value)
    if (addError) setAddError('')
    if (addSuccess) setAddSuccess('')
  }

  const handleAddFriend = async (event) => {
    event.preventDefault()
    if (!friendInput) return
    setAddError('')
    setAddSuccess('')
    setIsAdding(true)
    try {
      await addFriend(friendInput)
      setAddSuccess('Friend added.')
      setFriendInput('')
      await loadContacts()
    } catch (err) {
      const data = err?.data
      const message = String(data?.message || data?.error || err?.message || '')
      setAddError(message || 'Unable to add friend.')
    } finally {
      setIsAdding(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <Login
        mode={authMode}
        username={username}
        password={password}
        rememberMe={rememberMe}
        error={authError}
        isLoading={isAuthLoading}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onRememberMeChange={setRememberMe}
        onSubmit={handleAuth}
        onToggleMode={() =>
          setAuthMode((mode) => (mode === 'signup' ? 'signin' : 'signup'))
        }
      />
    )
  }

  return (
    <div className="layout">
      <Contacts
        contacts={contacts}
        isLoading={isLoading}
        error={error}
        selectedId={selectedId}
        onSelect={setSelectedId}
        friendInput={friendInput}
        onFriendInputChange={handleFriendInputChange}
        onAddFriend={handleAddFriend}
        isAdding={isAdding}
        addError={addError}
        addSuccess={addSuccess}
      />
      <ChatPanel contact={selectedContact} />
    </div>
  )
}

export default App
