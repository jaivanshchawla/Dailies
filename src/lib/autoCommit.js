import { getToken, getUsername, githubFetch } from './github'

const LOG_REPO = 'devlog'
const STORAGE_KEY = 'dailies_last_autocommit'

export const shouldAutoCommit = () => {
  const last = localStorage.getItem(STORAGE_KEY)
  if (!last) return true
  const today = new Date().toISOString().slice(0, 10)
  return last !== today
}

export const buildLogContent = (commits, date) => {
  const additions = commits.reduce((s, c) => s + c.additions, 0)
  const deletions = commits.reduce((s, c) => s + c.deletions, 0)
  const repos = [...new Set(commits.map(c => c.repo))]
  const agentCommits = commits.filter(c => c.isAgent)
  const myCommits = commits.filter(c => !c.isAgent)

  const lines = [
    `# ${date}`,
    ``,
    `**${commits.length} commits** across ${repos.length} repo${repos.length !== 1 ? 's' : ''}`,
    `+${additions} / -${deletions} LOC`,
    ``,
    `## Repos`,
    ...repos.map(r => `- ${r}`),
    ``,
  ]

  if (myCommits.length) {
    lines.push(`## My commits`)
    myCommits.forEach(c => lines.push(`- \`${c.shortSha}\` ${c.message} (${c.repo})`))
    lines.push(``)
  }

  if (agentCommits.length) {
    lines.push(`## Second unit`)
    agentCommits.forEach(c => lines.push(`- \`${c.shortSha}\` ${c.message} (${c.repo})`))
    lines.push(``)
  }

  return lines.join('\n')
}

export const runAutoCommit = async (commits) => {
  if (!shouldAutoCommit()) return
  const token = getToken()
  const username = getUsername()
  if (!token || !username) return

  const today = new Date().toISOString().slice(0, 10)
  const todayCommits = commits.filter(c => c.date.slice(0, 10) === today)

  const path = `logs/${today}.md`
  const content = buildLogContent(todayCommits, today)
  const encoded = btoa(unescape(encodeURIComponent(content)))

  try {
    let fileSha = null
    try {
      const existing = await githubFetch(`/repos/${username}/${LOG_REPO}/contents/${path}`)
      fileSha = existing.sha
    } catch {
      // File doesn't exist yet
    }

    const body = {
      message: `log: daily summary for ${today} — ${todayCommits.length} commits`,
      content: encoded,
      ...(fileSha ? { sha: fileSha } : {}),
    }

    await fetch(`https://api.github.com/repos/${username}/${LOG_REPO}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    localStorage.setItem(STORAGE_KEY, today)
  } catch (err) {
    console.warn('Auto-commit skipped:', err.message)
  }
}
