import { getToken } from './github'

// ─── GITHUB MODELS (PRIMARY) ───────────────────────────────────────────────

const githubModelsSummary = async (dayData, token) => {
  const { commits, totalAdditions, totalDeletions, date } = dayData
  if (!commits?.length) return null

  const myCommits = commits.filter(c => !c.isAgent)
  const agentCommits = commits.filter(c => c.isAgent)
  const repos = [...new Set(commits.map(c => c.repo))]

  const commitLines = commits
    .slice(0, 30) // cap at 30 to stay within token limits
    .map(c => `[${c.repo}${c.isAgent ? ' (agent)' : ''}] ${c.message} (+${c.additions}/-${c.deletions})`)
    .join('\n')

  const prompt = `You are summarizing a software developer's daily commit activity for their personal dashboard called Dailies.

Date: ${date}
Total commits: ${commits.length} (${myCommits.length} by developer, ${agentCommits.length} by AI agents)
Repos touched: ${repos.join(', ')}
Total LOC: +${totalAdditions} / -${totalDeletions}

Commits:
${commitLines}

Write a 2-3 sentence summary of this developer's day. Be specific — reference actual feature names and repos from the commits. Mention if AI agents did significant work. End with the LOC stats. Write in third person, present tense. Be concise and factual, not motivational. Do not use bullet points.`

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 180,
        temperature: 0.4,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`GitHub Models error ${response.status}: ${err}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim() ?? null
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

// ─── LOGIC FALLBACK ────────────────────────────────────────────────────────

const COMMIT_TYPES = {
  feat: 'feature',
  fix: 'fix',
  refactor: 'refactor',
  chore: 'chore',
  docs: 'docs',
  test: 'test',
  style: 'style',
  perf: 'perf',
  build: 'build',
  ci: 'ci',
}

const NOISE_WORDS = new Set([
  'the','a','an','in','on','for','with','to','of','and','or','is','are',
  'was','were','be','been','being','have','has','had','do','does','did',
  'will','would','could','should','may','might','shall','can','need',
  'add','adds','added','update','updates','updated','fix','fixes','fixed',
  'remove','removes','removed','change','changes','changed','use','uses','used',
])

const extractSubject = (message) => {
  const match = message.match(/^[a-z]+(\([^)]+\))?:\s*(.+)/)
  return match ? match[2] : message
}

const getCommitType = (message) => {
  const prefix = message.match(/^([a-z]+)(\([^)]+\))?:/)
  return prefix ? COMMIT_TYPES[prefix[1]] ?? null : null
}

const getDominantRepo = (commits) => {
  const locByRepo = {}
  commits.forEach(c => {
    locByRepo[c.repo] = (locByRepo[c.repo] ?? 0) + c.additions + c.deletions
  })
  return Object.entries(locByRepo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? commits[0]?.repo
}

const getTopKeywords = (commits, n = 3) => {
  const freq = {}
  commits.forEach(c => {
    const subject = extractSubject(c.message).toLowerCase()
    subject.split(/\s+/).forEach(word => {
      const clean = word.replace(/[^a-z]/g, '')
      if (clean.length > 3 && !NOISE_WORDS.has(clean)) {
        freq[clean] = (freq[clean] ?? 0) + 1
      }
    })
  })
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word]) => word)
}

const groupByType = (commits) => {
  const groups = {}
  commits.forEach(c => {
    const type = getCommitType(c.message) ?? 'other'
    if (!groups[type]) groups[type] = []
    groups[type].push(c)
  })
  return groups
}

export const logicSummary = (dayData) => {
  const { commits, totalAdditions, totalDeletions } = dayData
  if (!commits?.length) return 'No commits today.'

  const myCommits = commits.filter(c => !c.isAgent)
  const agentCommits = commits.filter(c => c.isAgent)
  const repos = [...new Set(commits.map(c => c.repo))]
  const dominantRepo = getDominantRepo(commits)
  const groups = groupByType(myCommits.length ? myCommits : commits)
  const statsLine = `+${totalAdditions.toLocaleString()} / -${totalDeletions.toLocaleString()} LOC across ${repos.length} repo${repos.length !== 1 ? 's' : ''}.`

  const feats = groups['feature'] ?? []
  const fixes = groups['fix'] ?? []
  const refactors = groups['refactor'] ?? []

  if (commits.length === 1) {
    const c = commits[0]
    const subject = extractSubject(c.message)
    return `One commit today on ${c.repo}: ${subject}. ${statsLine}`
  }

  const meaningfulCommits = commits.filter(c => {
    const type = getCommitType(c.message)
    return type && !['chore', 'style', 'ci', 'build'].includes(type)
  })
  if (meaningfulCommits.length === 0) {
    return `Light maintenance day — dependency updates and configuration changes across ${repos.length} repo${repos.length !== 1 ? 's' : ''}. ${statsLine}`
  }

  if (agentCommits.length > myCommits.length && agentCommits.length > 3) {
    const agentRepos = [...new Set(agentCommits.map(c => c.repo))]
    const keywords = getTopKeywords(agentCommits)
    const myPart = myCommits.length
      ? ` Made ${myCommits.length} personal commit${myCommits.length !== 1 ? 's' : ''} alongside.`
      : ''
    return `Second unit handled most of today's work on ${agentRepos.join(', ')}${keywords.length ? `, focusing on ${keywords.join(', ')}` : ''}.${myPart} ${statsLine}`
  }

  if (feats.length >= 2) {
    const featSubjects = feats.slice(0, 2).map(c => extractSubject(c.message).toLowerCase())
    const fixPart = fixes.length ? ` Resolved ${fixes.length} issue${fixes.length !== 1 ? 's' : ''} alongside.` : ''
    const agentPart = agentCommits.length ? ` Second unit contributed ${agentCommits.length} commit${agentCommits.length !== 1 ? 's' : ''}.` : ''
    return `Primarily building on ${dominantRepo} — ${featSubjects.join(' and ')}.${fixPart}${agentPart} ${statsLine}`
  }

  if (feats.length >= 1 && fixes.length >= 1) {
    const featSubject = extractSubject(feats[0].message).toLowerCase()
    const fixSubject = extractSubject(fixes[0].message).toLowerCase()
    const agentPart = agentCommits.length ? ` Second unit contributed ${agentCommits.length} commit${agentCommits.length !== 1 ? 's' : ''}.` : ''
    return `Worked on ${dominantRepo} — shipped ${featSubject} and fixed ${fixSubject}.${agentPart} ${statsLine}`
  }

  if (fixes.length >= 3) {
    const agentPart = agentCommits.length ? ` Second unit contributed ${agentCommits.length} commit${agentCommits.length !== 1 ? 's' : ''}.` : ''
    return `Maintenance-focused day, resolving ${fixes.length} issues across ${repos.join(', ')}.${agentPart} ${statsLine}`
  }

  if (refactors.length >= 2) {
    const keywords = getTopKeywords(refactors)
    const agentPart = agentCommits.length ? ` Second unit contributed ${agentCommits.length} commit${agentCommits.length !== 1 ? 's' : ''}.` : ''
    return `Refactoring day on ${dominantRepo}${keywords.length ? ` — ${keywords.join(', ')}` : ''}.${agentPart} ${statsLine}`
  }

  const keywords = getTopKeywords(commits)
  const agentPart = agentCommits.length ? ` Second unit contributed ${agentCommits.length} commit${agentCommits.length !== 1 ? 's' : ''}.` : ''
  return `${commits.length} commits across ${repos.join(', ')}${keywords.length ? `, touching ${keywords.join(', ')}` : ''}.${agentPart} ${statsLine}`
}

// ─── CACHE HELPERS ─────────────────────────────────────────────────────────

const CACHE_PREFIX = 'dailies_summary_'
const today = () => new Date().toISOString().slice(0, 10)

export const getCachedSummary = (date) => {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${date}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setCachedSummary = (date, summary) => {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${date}`, JSON.stringify(summary))
  } catch {
    // localStorage full — skip caching
  }
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────

export const summarizeDay = async (dayData) => {
  const { date, commits } = dayData

  if (!commits?.length) {
    return { text: null, source: 'empty' }
  }

  // Past days: check cache first — never regenerate
  const isToday = date === today()
  if (!isToday) {
    const cached = getCachedSummary(date)
    if (cached) return cached
  }

  // Try GitHub Models
  const token = getToken()
  if (token) {
    try {
      const text = await githubModelsSummary(dayData, token)
      if (text) {
        const result = { text, source: 'ai' }
        setCachedSummary(date, result)
        return result
      }
    } catch {
      // GitHub Models failed — fall through to logic
    }
  }

  // Logic fallback
  const text = logicSummary(dayData)
  const result = { text, source: 'logic' }
  setCachedSummary(date, result)
  return result
}
