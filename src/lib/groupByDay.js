export function groupByDay(commits) {
  const grouped = {};
  for (const commit of commits) {
    const date = commit.date.split('T')[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(commit);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return grouped;
}

export function sortedDayKeys(grouped) {
  return Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
}
