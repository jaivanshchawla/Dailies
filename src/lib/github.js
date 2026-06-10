export function getToken() {
  return localStorage.getItem('dailies_pat');
}

export async function githubFetch(endpoint) {
  const token = getToken();
  const res = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}
