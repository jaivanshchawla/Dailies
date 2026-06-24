import { useQuery } from '@tanstack/react-query'
import { githubFetch } from '../lib/github'

export const useGitHubRepos = () =>
  useQuery({
    queryKey: ['repos'],
    queryFn: async () => {
      try {
        const data = await githubFetch('/user/repos?per_page=100&type=all&sort=pushed')
        const repos = Array.isArray(data) ? data : []
        console.debug('[useGitHubRepos] fetched', repos.length, 'repos')
        return repos
      } catch (err) {
        console.error('[useGitHubRepos] queryFn failed:', err.message)
        return []
      }
    },
    enabled: !!localStorage.getItem('dailies_pat'),
  })
