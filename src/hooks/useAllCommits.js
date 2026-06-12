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
        const commits = await githubFetch(
          `/repos/${repo.full_name}/commits?author=${username}&per_page=100&since=${since}`
        )
        return commits.map((c) => normalise(c, repo.name, repo.private))
      },
      enabled: repos.length > 0 && !!username && !!localStorage.getItem('dailies_pat'),
    })),
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)
  const commits = results
    .flatMap((r) => r.data ?? [])
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  return { commits, isLoading, isError }
}
