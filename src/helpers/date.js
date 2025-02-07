export const formatDate = (date) => {
  const parsedDate = new Date(date)
  if (isNaN(parsedDate)) {
    console.error('Invalid date:', date)
    return 'Invalid Date'
  }
  return parsedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
