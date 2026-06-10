import { useQuery } from '@tanstack/react-query';
import { githubFetch } from '../lib/github';

export function useGitHubRepos() {
  return useQuery({
    queryKey: ['repos'],
    queryFn: () => githubFetch('/user/repos?per_page=100&type=all'),
  });
}
