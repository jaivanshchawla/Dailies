import { useQuery } from '@tanstack/react-query';
import { githubFetch } from '../lib/github';

export function useRepoCommits(owner, repo, username) {
  return useQuery({
    queryKey: ['commits', repo],
    queryFn: () =>
      githubFetch(
        `/repos/${owner}/${repo}/commits?author=${username}&per_page=100`
      ),
  });
}
