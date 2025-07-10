import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";
import { Timeline } from "@/components/timeline";
import { CertificationCard } from "@/components/certification-card";
import linksData from "@/lib/links.json";
export default function ResumePage() {
  return (
    <div className="container py-8 md:py-12 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Resume
          </h1>
          <p className="text-muted-foreground mt-2">
            My professional experience and skills
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/Wesley_van_der_Kraan_CV_EN.pdf" target="_blank">
              <Download className="mr-2 h-4 w-4" /> English CV
            </Link>
          </Button>
          <Button
            asChild
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/Wesley_van_der_Kraan_CV_NL.pdf" target="_blank">
              <Download className="mr-2 h-4 w-4" /> Dutch CV
            </Link>
          </Button>
        </div>
      </div>
      {}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Profile
        </h2>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-muted-foreground text-sm md:text-base">
              Recent programming graduate with experience in both frontend and backend web development. Proficient in HTML, CSS, JavaScript and frameworks such as React and Vue 3, with knowledge of user-friendly and scalable UIs. Experience with backend technologies such as Node.js, Express.js, C#, and databases such as MySQL and PostgreSQL (PSQL). Worked on REST APIs, unit testing, and full web projects in team and independently. Strong in self-learning, problem-solving, and motivated to continuously grow within a professional development team.
            </p>
          </CardContent>
        </Card>
      </section>
      {}
      {Object.keys(linksData.certifications || {}).length > 0 && (
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-600" />
            <h2 className="text-3xl font-bold tracking-tight">
              Certifications & Degrees
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {Object.values(linksData.certifications).map((cert: any, index) => (
              <CertificationCard
                key={index}
                title={cert.title}
                issuer={cert.issuer}
                date={cert.issueDate}
                expiryDate={cert.expiryDate}
                credentialId={cert.credentialId}
                verificationUrl={cert.verificationUrl}
                skills={cert.skills}
                logoSrc={cert.logoSrc}
                variant={cert.variant || "default"}
              />
            ))}
          </div>
        </section>
      )}
      {}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          My Journey
        </h2>
        <Timeline
          items={[
            {
              date: "2014 - 2020",
              title: "Graduate Mechanics, PITO, Stabroek",
              description:
                "Completed high school education with a focus on mechanics.",
              icon: <GraduationCap className="h-4 w-4" />,
            },
            {
              date: "2020 - 2023",
              title: "Various Bachelor Programs",
              description:
                "Explored different fields including Game Development at Howest DAE, IT & Software, and IT & AI at AP University of Applied Sciences.",
              icon: <GraduationCap className="h-4 w-4" />,
            },
            {
              date: "2023 - 2025",
              title:
                "Associate Degree Programming, AP University of Applied Sciences",
              description:
                "Completed a degree in programming with focus on web development and modern programming practices.",
              icon: <GraduationCap className="h-4 w-4" />,
            },
            {
              date: "February 2025 - June 2025",
              title: "Full Stack Developer, TagLayer",
              description:
                "Completed a full-stack development role working on web applications using Vue.js and other modern technologies. Gained valuable professional experience in a collaborative development environment.",
              icon: <Briefcase className="h-4 w-4" />,
            },
          ]}
        />
      </section>
      {}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Work Experience
        </h2>
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <CardTitle className="text-xl md:text-2xl">
                  Full Stack Developer
                </CardTitle>
                <div className="text-muted-foreground text-sm md:text-base">
                  February 2025 - June 2025
                </div>
              </div>
              <div className="text-base md:text-lg">TagLayer, Antwerp</div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm md:text-base">
              <p>
                Completed a full-stack development role at TagLayer, working on developing and improving web applications using Vue.js and modern technologies.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Developed new features for company web applications using Vue.js
                </li>
                <li>
                  Fixed bugs and improved user interface components
                </li>
                <li>
                  Collaborated with development team on project planning and implementation
                </li>
                <li>
                  Applied modern web development practices and best coding standards
                </li>
                <li>
                  Worked with backend technologies including Express.js and databases
                </li>
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className="bg-indigo-100 text-indigo-600">Vue.js</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  TailwindCSS
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  Express.js
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  Unit Testing
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  JavaScript
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Education
        </h2>
        <div className="space-y-4 md:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <CardTitle className="text-xl">
                  Associate Degree Programming
                </CardTitle>
                <div className="text-muted-foreground text-sm md:text-base">
                  September 2023 - June 2025
                </div>
              </div>
              <div className="text-base md:text-lg">
                AP University of Applied Sciences, Antwerp
              </div>
            </CardHeader>
            <CardContent className="text-sm md:text-base">
              <p>
                Completed a degree in programming with focus on web
                development and software engineering.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <CardTitle className="text-xl">Bachelor IT & AI</CardTitle>
                <div className="text-muted-foreground text-sm md:text-base">
                  September 2022 - August 2023
                </div>
              </div>
              <div className="text-base md:text-lg">
                AP University of Applied Sciences, Antwerp
              </div>
            </CardHeader>
            <CardContent className="text-sm md:text-base">
              <p>
                Studied IT with a focus on artificial intelligence. (Didn't
                finish)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <CardTitle className="text-xl">
                  Bachelor IT & Software
                </CardTitle>
                <div className="text-muted-foreground text-sm md:text-base">
                  September 2021 - August 2022
                </div>
              </div>
              <div className="text-base md:text-lg">
                AP University of Applied Sciences, Antwerp
              </div>
            </CardHeader>
            <CardContent className="text-sm md:text-base">
              <p>
                Studied IT with a focus on software development. (Didn't finish)
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <CardTitle className="text-xl">
                  Bachelor Game Development
                </CardTitle>
                <div className="text-muted-foreground text-sm md:text-base">
                  September 2020 - August 2021
                </div>
              </div>
              <div className="text-base md:text-lg">Howest DAE, Kortrijk</div>
            </CardHeader>
            <CardContent className="text-sm md:text-base">
              <p>Studied game development and design. (Didn't finish)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between">
                <CardTitle className="text-xl">Graduate Mechanics</CardTitle>
                <div className="text-muted-foreground text-sm md:text-base">
                  September 2014 - June 2020
                </div>
              </div>
              <div className="text-lg">PITO, Stabroek</div>
            </CardHeader>
            <CardContent className="text-sm md:text-base">
              <p>Completed high school education with a focus on mechanics.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      {}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-600">HTML</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">CSS</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  JavaScript
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  TypeScript
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">React</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">Vue.js</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  TailwindCSS
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Backend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-600">Node.js</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  Express.js
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">C#</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  Ruby on Rails
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">Python</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">Java</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">C++</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Databases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-600">SQL</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">MySQL</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  PostgreSQL
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">NoSQL</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tools & Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-600">Git</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">GitHub</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">VS Code</Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  Unit Testing
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  REST APIs
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-indigo-100 text-indigo-600">
                  Dutch (Native)
                </Badge>
                <Badge className="bg-indigo-100 text-indigo-600">
                  English (Fluent)
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {}
      <section className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AP Gaming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm md:text-base">
                A gaming platform developed as part of university coursework.
              </p>
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                asChild
              >
                <Link
                  href="https://ap-gaming.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" /> View Project
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>AP Gaming Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm md:text-base">
                Admin dashboard for the AP Gaming platform.
              </p>
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                asChild
              >
                <Link
                  href="https://github.com/Wesleyvdk/AP-Gaming-Dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" /> View on GitHub
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Poke3</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm md:text-base">
                A university project related to Pokemon.
              </p>
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-700"
                asChild
              >
                <Link href="#" target="_blank" rel="noopener noreferrer">
                  <FileText className="mr-2 h-4 w-4" /> View Project
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Dreamy Stories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm md:text-base">
                A storytelling platform.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  asChild
                >
                  <Link
                    href="https://dreamycroisssan.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-4 w-4" /> View Project
                  </Link>
                </Button>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  asChild
                >
                  <Link
                    href="https://github.com/Wesleyvdk/DreamyCroissan"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-4 w-4" /> View on GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
