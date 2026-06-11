export const groupByDay = (commits) => {
  return commits.reduce((acc, commit) => {
    const day = commit.date.slice(0, 10)
    if (!acc[day]) acc[day] = []
    acc[day].push(commit)
    return acc
  }, {})
}

export const sortedDayKeys = (grouped) =>
  Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1))
