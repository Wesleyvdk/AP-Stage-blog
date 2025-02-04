// This is a mock service. In a real application, you would fetch data from an API or database.

const blogPosts = [
  {
    id: 1,
    title: 'My First Week at the Internship',
    date: '2023-05-01',
    excerpt:
      'Reflecting on my first week at the company, the challenges I faced, and the exciting projects ahead.',
    content: '... full content here ...',
    categories: ['reflection', 'lessons learned'],
  },
  {
    id: 2,
    title: 'Solving a Complex Coding Problem',
    date: '2023-05-08',
    excerpt: 'How I tackled a difficult coding challenge and what I learned in the process.',
    content: '... full content here ...',
    categories: ['code', 'wins'],
  },
  // Add more blog posts here
]

export const getAllBlogPosts = () => {
  return Promise.resolve(blogPosts)
}

export const getBlogPostById = (id) => {
  const post = blogPosts.find((post) => post.id === Number.parseInt(id))
  return Promise.resolve(post)
}

export const getLatestBlogPost = () => {
  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
  return Promise.resolve(sortedPosts[0])
}
