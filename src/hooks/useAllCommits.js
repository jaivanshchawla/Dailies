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

export const useAllCommits = (repos = []) => {
  const username = getUsername()

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const results = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ['commits', repo.full_name],
      queryFn: async () => {
        const t0 = performance.now()
        const commits = await githubFetch(
          `/repos/${repo.full_name}/commits?author=${username}&per_page=100&since=${since}`
        )

        const ms = Math.round(performance.now() - t0)
        console.debug(`[useAllCommits] ${repo.name}: fetched ${commits.length} commits in ${ms}ms`)

        // Use list endpoint stats directly — no per-commit enrichment needed
        // The list endpoint already includes stats.additions/deletions for most commits
        return commits.map((c) => normalise(c, repo.name, repo.private))
      },
      enabled: repos.length > 0 && !!username && !!localStorage.getItem('dailies_pat'),
      staleTime: 5 * 60 * 1000,
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
