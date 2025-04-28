import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      id: "blog-website",
      title: "Personal Blog & Portfolio",
      description: "A Next.js-powered blog and portfolio website showcasing my projects and internship experiences.",
      image: "/clean-tech-startup.png",
      tags: ["Next.js", "React", "TypeScript", "TailwindCSS"],
      github: "https://github.com/Wesleyvdk/AP-Stage-blog",
      demo: "#",
      featured: true,
    },
    {
      id: "vue-blog",
      title: "Vue.js Blog Platform",
      description: "The original version of my blog built with Vue.js, documenting my internship journey.",
      image: "/vue-components-abstract.png",
      tags: ["Vue.js", "TailwindCSS", "Express.js"],
      github: "https://github.com/Wesleyvdk/DreamyCroissan",
      demo: "#",
      featured: true,
    },
    {
      id: "task-manager",
      title: "Task Manager Application",
      description: "A simple task management application with authentication and CRUD operations.",
      image: "/placeholder.svg?height=300&width=600&query=task management app",
      tags: ["React", "Firebase", "CSS"],
      github: "#",
      demo: "#",
      featured: false,
    },
  ]

  const featuredProjects = projects.filter((project) => project.featured)
  const otherProjects = projects.filter((project) => !project.featured)

  return (
    <div className="container py-12 space-y-16">
      <section className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">My Projects</h1>
        <p className="text-xl text-muted-foreground">
          A collection of projects I've built during my studies, internships, and personal time.
        </p>
      </section>

      {featuredProjects.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
          <div className="grid grid-cols-1 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col p-6">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-2xl">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 py-4 flex-grow">
                      <p className="text-muted-foreground">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="px-0 pb-0 flex flex-wrap gap-4">
                      <Button asChild variant="outline">
                        <Link href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View Code
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                          Live Demo
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Other Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <Card key={project.id} className="flex flex-col h-full">
                <div className="relative aspect-video">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                      Demo
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
