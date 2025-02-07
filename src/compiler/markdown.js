import MarkdownIt from 'markdown-it'

export default function createMarkdown(content) {
  const markdown = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
  const result = markdown.render(content)
  return result
}
