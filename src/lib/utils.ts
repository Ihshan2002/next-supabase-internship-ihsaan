export const formatDate = (date: string) =>
  new Date(date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
