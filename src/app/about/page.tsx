import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, ExternalLink } from "lucide-react"

export default function AboutPage() {
  const skills = [
    {
      category: "Frontend",
      items: ["HTML", "CSS", "JavaScript", "TypeScript", "Vue.js", "React", "Next.js", "TailwindCSS"],
    },
    { category: "Backend", items: ["Node.js", "Express.js", "REST APIs", ".NET"] },
    { category: "Tools", items: ["Git", "GitHub", "VS Code", "Figma"] },
    { category: "Learning", items: ["React Native", "Flutter", "GraphQL", "AWS", "Unreal Engine"] },
  ]

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-full md:w-1/3 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary">
            <Image src="/confident-professional.png" alt="Wesley van der Kraan" fill className="object-cover" />
          </div>
        </div>
        <div className="w-full md:w-2/3 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About Me</h1>
          <p className="text-xl">
            I'm Wesley van der Kraan, a passionate developer currently pursuing my education and gaining practical
            experience through internships.
          </p>
          <div className="flex gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="https://github.com/Wesleyvdk" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link href="https://www.linkedin.com/in/wesley-van-der-kraan-782b09230/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Who I Am</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Programming</h3>
                <p className="text-muted-foreground">AP Hogeschool, 2023-Present</p>
              </div>
              <p>
                Currently pursuing an associate's degree in Programming with a focus on web development and software
                engineering.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Personal Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                My journey in tech began with a curiosity about how chatbots and games are made. This led me to explore javascript, as well as C# and C++. after this I got into web development and started in HTML and CSS, eventually diving into frameworks like Next.js and now expanding to Vue.js.
              </p>
              <p className="mt-4">
                I'm passionate about creating clean, efficient, and user-friendly applications that solve real problems.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-6" id="skills">
        <h2 className="text-3xl font-bold tracking-tight">My Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup) => (
            <Card key={skillGroup.category}>
              <CardHeader>
                <CardTitle>{skillGroup.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Internship Section */}
      <section className="space-y-6" id="internship">
        <h2 className="text-3xl font-bold tracking-tight">My Internship</h2>
        <Card>
          <CardHeader>
            <CardTitle>Taglayer</CardTitle>
            <CardDescription>Full Stack Developer Intern, 2025-Present</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full aspect-video relative rounded-lg overflow-hidden">
              <Image src="/taglayer-logo.webp" alt="Taglayer Office" fill className="object-cover" />
            </div>
            <div className="space-y-4">
              <p>
                At Taglayer, I'm working on developing and improving web applications using Vue.js and other modern
                technologies. My responsibilities include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Developing new features for the company's web applications</li>
                <li>Fixing bugs and improving UI components</li>
                <li>Collaborating with the team on project planning and implementation</li>
                <li>Learning and applying best practices in web development</li>
              </ul>
              <p>
                This internship has been an invaluable opportunity to apply my theoretical knowledge in a real-world
                setting and learn from experienced professionals in the field.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge>Vue.js</Badge>
                <Badge>TailwindCSS</Badge>
                <Badge>Express.js</Badge>
                <Badge>Git</Badge>
                <Badge>Team Collaboration</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
