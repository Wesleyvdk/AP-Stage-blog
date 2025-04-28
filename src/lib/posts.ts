export type Post = {
    id: string
    title: string
    date: string
    excerpt: string
    content: string
    tags: string[]
  }
  
  // Mock data - replace with actual data fetching
  const mockPosts: Post[] = [
    {
      id: "week-1",
      title: "Week 1: Getting Started with Vue.js & Fixing My First Bug",
      date: "February 7, 2025",
      excerpt:
        "This week was all about getting familiar with Vue.js, as it's my first time working with it. To get up to speed, I spent time exploring how Vue works, mainly by watching tutorials.",
      content: "Full content here...",
      tags: ["Development", "Start"],
    },
    {
      id: "week-1-2",
      title: "Week 1.2: Fixing UI Bugs",
      date: "February 10, 2025",
      excerpt:
        "Alongside learning Vue, I also tackled a couple of bug fixes in the project. One issue I worked on was related to the skeleton loader not spanning the full width.",
      content: "Full content here...",
      tags: ["Development", "Update", "Bugs"],
    },
    {
      id: "week-2",
      title: "Week 2: Bug Fixes & App Improvements",
      date: "February 17, 2025",
      excerpt:
        "This week, I focused on several different bug fixes and UI improvements across the application. Implementing a Skeleton Loader for Dashboard Cards.",
      content: "Full content here...",
      tags: ["Development", "Bugs"],
    },
    {
      id: "week-3",
      title: "Week 3: Solving Complex Bugs and Researching Onboarding",
      date: "February 24, 2025",
      excerpt: "This week presented some challenging tasks, requiring both problem-solving and research.",
      content: "Full content here...",
      tags: ["Development", "Research"],
    },
    {
      id: "week-4",
      title: "Week 4: Refining the Onboarding Proof of Concept and Team Activities",
      date: "March 7, 2025",
      excerpt:
        "This week, I continued working on the Proof of Concept (PoC) for the onboarding system, making it more adaptable and future-proof.",
      content: "Full content here...",
      tags: ["Development", "Team Building", "Networking", "Week 4"],
    },
    {
      id: "week-5",
      title: "Week 5: Testing and Refining the Onboarding Proof of Concept",
      date: "March 17, 2025",
      excerpt: "This week was primarily focused on testing and fine-tuning the onboarding Proof of Concept.",
      content: "Full content here...",
      tags: ["Development", "Testing"],
    },
  ]
  
  export async function getAllPosts(limit?: number): Promise<Post[]> {
    // In a real app, this would be a server-side fetch
    // For now, we'll just return the mock data
    const sortedPosts = [...mockPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
    return limit ? sortedPosts.slice(0, limit) : sortedPosts
  }
  
  export async function getPostById(id: string): Promise<Post | undefined> {
    return mockPosts.find((post) => post.id === id)
  }
  