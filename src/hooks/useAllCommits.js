import { useQueries } from '@tanstack/react-query';
import { githubFetch, getToken } from '../lib/github';

export function useAllCommits(repos) {
  const username = localStorage.getItem('dailies_username') || '';

  const queries = useQueries({
    queries: repos.map((repo) => ({
      queryKey: ['commits', repo.name],
      queryFn: () =>
        githubFetch(
          `/repos/${repo.owner.login}/${repo.name}/commits?author=${username}&per_page=100`
        ),
      enabled: !!repos.length,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const commits = queries
    .filter((q) => q.isSuccess && Array.isArray(q.data))
    .flatMap((q) =>
      q.data.map((c) => ({
        sha: c.sha,
        shortSha: c.sha.slice(0, 7),
        message: c.commit.message,
        repo: c.repository?.name || '',
        repoPrivate: c.repository?.private || false,
        branch: '',
        date: c.commit.author?.date || '',
        additions: 0,
        deletions: 0,
        authorLogin: c.author?.login || '',
        isAgent:
          c.commit.author?.name !== username &&
          c.commit.committer?.name !== username,
      }))
    );

  return { commits, isLoading, isError };
}
