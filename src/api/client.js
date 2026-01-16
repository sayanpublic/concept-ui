export async function fetchJson(url, options = {}) {
  const response = await fetch(url, options)
  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error('Request failed')
    error.data = data
    throw error
  }

  return data
}
