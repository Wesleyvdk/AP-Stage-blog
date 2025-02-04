import { marked } from 'marked'

export const parseMarkdown = (content) => {
  return marked(content)
}

export const sanitizeHtml = (html) => {
  // Implement HTML sanitization logic here
  return html
}
