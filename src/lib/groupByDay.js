export const groupByDay = (commits) => {
  if (!Array.isArray(commits)) return {}
  return commits.reduce((acc, commit) => {
    if (!commit?.date) return acc
    const day = commit.date.slice(0, 10)
    if (!acc[day]) acc[day] = []
    acc[day].push(commit)
    return acc
  }, {})
}

export const sortedDayKeys = (grouped) => {
  if (!grouped || typeof grouped !== 'object') return []
  return Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1))
}
