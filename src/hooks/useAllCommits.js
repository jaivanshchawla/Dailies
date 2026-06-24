import { useQueries } from '@tanstack/react-query'
import { githubFetch, getUsername } from '../lib/github'

const normalise = (commit, repo, repoPrivate) => {
  const username = getUsername()
  return {
    sha: commit.sha,
    shortSha: commit.sha.slice(0, 7),
    message: commit.commit.message.split('\n')[0],
    repo,
    repoPrivate,
    date: commit.commit.author.date,
    additions: commit.stats?.additions ?? 0,
    deletions: commit.stats?.deletions ?? 0,
    authorLogin: commit.author?.login ?? commit.commit.author.name,
    isAgent: commit.committer?.login !== username && commit.commit.committer.name !== username,
    url: commit.html_url,
  }
}

// Fetch accurate per-commit stats via the single-commit endpoint
const fetchStats = async (repoFullName, sha) => {
  try {
    const detail = await githubFetch(`/repos/${repoFullName}/commits/${sha}`)
    if (detail.stats) {
      return { additions: detail.stats.additions, deletions: detail.stats.deletions }
    }
  } catch {
    // stats fetch failed — fall back to list endpoint defaults
  }
  return null
}

export const useAllCommits = (repos = []) => {
  const username = getUsername()

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const results = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ['commits', repo.full_name],
      queryFn: async () => {
        const commits = await githubFetch(
          `/repos/${repo.full_name}/commits?author=${username}&per_page=100&since=${since}`
        )

        // Fetch accurate per-commit stats in batches to avoid rate limits
        const BATCH_SIZE = 8
        const enriched = []
        for (let i = 0; i < commits.length; i += BATCH_SIZE) {
          const batch = commits.slice(i, i + BATCH_SIZE)
          const results = await Promise.all(
            batch.map(async (c) => {
              const hasStats = c.stats && c.stats.additions != null && c.stats.deletions != null
              if (hasStats) return c
              const fetched = await fetchStats(repo.full_name, c.sha)
              if (fetched) return { ...c, stats: { ...c.stats, ...fetched } }
              return c
            })
          )
          enriched.push(...results)
        }

        return enriched.map((c) => normalise(c, repo.name, repo.private))
      },
      enabled: repos.length > 0 && !!username && !!localStorage.getItem('dailies_pat'),
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)

  const commits = results
    .flatMap((r) => (Array.isArray(r.data) ? r.data : []))
    .filter(Boolean)
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  if (isError) {
    const failedRepos = results.filter(r => r.isError).map(r => r.error?.message ?? 'unknown')
    console.error('[useAllCommits] query errors:', failedRepos)
  }

  if (!isLoading && commits.length === 0 && repos.length > 0) {
    console.warn('[useAllCommits] no commits returned from', repos.length, 'repos')
  }

  console.debug('[useAllCommits] commits:', commits.length, 'repos:', repos.length, 'loading:', isLoading)

  return { commits, isLoading, isError }
}
