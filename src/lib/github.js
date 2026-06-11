export const getToken = () => localStorage.getItem('dailies_pat')

export const getUsername = () => localStorage.getItem('dailies_username')

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
