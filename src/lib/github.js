let _cachedToken = null
let _cachedUsername = null

export const getToken = () => {
  const t = localStorage.getItem('dailies_pat')
  if (t !== _cachedToken) _cachedToken = t
  return _cachedToken
}

export const getUsername = () => {
  const u = localStorage.getItem('dailies_username')
  if (u !== _cachedUsername) _cachedUsername = u
  return _cachedUsername
}

export const githubFetch = async (endpoint) => {
  const token = getToken()
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json',
    },
  })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}
