import { useQuery } from '@tanstack/react-query'
import { githubFetch } from '../lib/github'

export const useGitHubRepos = () =>
  useQuery({
    queryKey: ['repos'],
    queryFn: () => githubFetch('/user/repos?per_page=100&type=all&sort=pushed'),
    enabled: !!localStorage.getItem('dailies_pat'),
  })
